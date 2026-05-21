/* ─────────────────────────────────────────────────────────────────────────────
   RHACS Prototype Comments — Figma-style click-to-pin overlay
   Injected into every prototype page via deploy.sh
   Stores data in GitHub Discussions on zhenpesky/rhacs-ux-prototypes
───────────────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  // ── Config ──────────────────────────────────────────────────────────────────
  var CFG = {
    owner:       'zhenpesky',
    repo:        'rhacs-ux-prototypes',
    categoryName:'General',
    clientId:    'Ov23liDWQDQiOy5Yd1Kc',
    workerUrl:   'https://rhacs-comments-auth.zhenpche.workers.dev',
    callbackUrl: 'https://zhenpesky.github.io/rhacs-ux-prototypes/auth-callback.html',
    tokenKey:    'rhacs_gh_token',
    userKey:     'rhacs_gh_user',
    guestKey:    'rhacs_guest_id',
    guestPinsPrefix: 'rhacs_guest_pins_',
    seenPrefix:  'rhacs_seen_',
    pollMs:      30000,
  };

  // PAGE_KEY must be evaluated at call time (SPA route changes after load)
  function getPageKey() {
    return 'page:' + window.location.pathname;
  }
  var PAGE_KEY  = getPageKey(); // legacy alias — still used for GitHub Discussion title lookup
  var GH_GQL    = 'https://api.github.com/graphql';

  // ── State ────────────────────────────────────────────────────────────────────
  var S = {
    token:        null,
    user:         null,
    guestMode:    false,   // true when using guest (localStorage-only) commenting
    commentMode:  false,
    repoId:       null,
    categoryId:   null,
    discussionId: null,
    pins:         [],
    activePinId:  null,
    lastSeen:     0,
    unread:       0,
    origTitle:    document.title,
    pollTimer:    null,
  };

  // ── Scroll container detection ───────────────────────────────────────────────
  // PatternFly SPAs scroll inside .pf-v5-c-page__main rather than window/body.
  // We detect this read-only (never move the overlay into it) and recompute each
  // pin's viewport position on every scroll / resize event.

  function findScrollContainer() {
    // Try PF-specific selectors first (most reliable, avoids false positives)
    var pf = ['.pf-v6-c-page__main', '.pf-v5-c-page__main', '.pf-c-page__main', 'main[role="main"]', 'main'];
    for (var i = 0; i < pf.length; i++) {
      var c = document.querySelector(pf[i]);
      if (c && c.scrollHeight > c.clientHeight + 4) return c;
    }
    // If window itself scrolls there's no inner container
    if (document.documentElement.scrollHeight > window.innerHeight + 4) return null;
    // Generic fallback: find the element with the most scrollable content
    var best = null, bestPx = 10;
    var els = document.querySelectorAll('*');
    for (var j = 0; j < els.length; j++) {
      var oy = window.getComputedStyle(els[j]).overflowY;
      if (oy !== 'auto' && oy !== 'scroll') continue;
      var px = els[j].scrollHeight - els[j].clientHeight;
      if (px > bestPx) { bestPx = px; best = els[j]; }
    }
    return best;
  }

  // Snapshot of the scroll container's current state (position + scroll)
  function containerInfo() {
    var c = S.scrollContainer;
    if (c) {
      var r = c.getBoundingClientRect();
      return {
        scrollTop: c.scrollTop, scrollLeft: c.scrollLeft,
        clientTop: r.top, clientLeft: r.left,
        viewH: r.height, viewW: r.width,
        scrollHeight: c.scrollHeight, scrollWidth: c.scrollWidth,
      };
    }
    return {
      scrollTop: window.scrollY, scrollLeft: window.scrollX,
      clientTop: 0, clientLeft: 0,
      viewH: window.innerHeight, viewW: window.innerWidth,
      scrollHeight: document.documentElement.scrollHeight,
      scrollWidth:  document.documentElement.scrollWidth,
    };
  }

  // Convert a pin's stored (x%, y%) to current viewport pixel coordinates.
  function pinToViewport(meta) {
    var ci = containerInfo();
    var docX = (meta.x / 100) * ci.scrollWidth;
    var docY = (meta.y / 100) * ci.scrollHeight;
    return {
      left:    docX - ci.scrollLeft + ci.clientLeft,
      top:     docY - ci.scrollTop  + ci.clientTop,
      visible: docX >= ci.scrollLeft && docX <= ci.scrollLeft + ci.viewW &&
               docY >= ci.scrollTop  && docY <= ci.scrollTop  + ci.viewH,
    };
  }

  // ── Page-state detection ─────────────────────────────────────────────────────
  // The prototype has two distinct states: read-only view and edit form.
  // Pins are scoped to the state they were dropped in so they don't bleed across.
  function detectViewState() {
    var main = document.querySelector('.pf-v6-c-page__main, .pf-c-page__main, main');
    if (!main) return 'view';
    // Edit state: non-trivial form inputs exist in the app content area
    // (exclude our own commenting textareas, and search/hidden/checkbox inputs)
    var appInputs = Array.prototype.slice.call(
      main.querySelectorAll('input, select, .pf-v6-c-form-control')
    ).filter(function (el) {
      if (el.closest('#rhacs-comment-root') || el.closest('#rhacs-popup') || el.closest('#rhacs-panel')) return false;
      var t = (el.getAttribute('type') || '').toLowerCase();
      return t !== 'hidden' && t !== 'search' && t !== 'checkbox' && t !== 'radio';
    });
    return appInputs.length > 0 ? 'edit' : 'view';
  }

  // ── Utility helpers ───────────────────────────────────────────────────────────
  function timeAgo(iso) {
    var s = Math.floor((Date.now() - new Date(iso)) / 1000);
    if (s < 60)    return 'just now';
    if (s < 3600)  return Math.floor(s / 60) + 'm ago';
    if (s < 86400) return Math.floor(s / 3600) + 'h ago';
    return Math.floor(s / 86400) + 'd ago';
  }

  function parseMeta(body) {
    var m = body && body.match(/<!--\s*RHACS_PIN\s*(\{[\s\S]*?\})\s*-->/);
    if (!m) return null;
    try { return JSON.parse(m[1]); } catch (e) { return null; }
  }

  function pinText(body) {
    return (body || '').replace(/<!--\s*RHACS_PIN\s*\{[\s\S]*?\}\s*-->\s*/, '').trim();
  }

  // Get 1-2 char initials from an author object for use as pin label
  function pinInitials(author) {
    if (!author) return '?';
    // For guests, login is "First Last · Title · Company" — extract from name fields or the first part
    var displayName = (author.name && author.name.trim()) ? author.name
                    : (author.login || '');
    // Strip everything after the first · separator to get just the name part
    var namePart = displayName.split('\u00b7')[0].trim();
    var words = namePart.split(/\s+/).filter(Boolean);
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    // Fallback: first 2 chars of login
    return (author.login || '?').replace(/[^a-zA-Z0-9]/g, '').slice(0, 2).toUpperCase() || '?';
  }

  function buildBody(x, y, num, text, guestAuthor) {
    var meta = { x: x, y: y, resolved: false, pinNumber: num, viewState: detectViewState() };
    if (guestAuthor) meta.guestAuthor = guestAuthor;
    return '<!-- RHACS_PIN ' + JSON.stringify(meta) + ' -->\n' + text;
  }

  function setMeta(body, updates) {
    return body.replace(/<!--\s*RHACS_PIN\s*(\{[\s\S]*?\})\s*-->/, function (m, json) {
      try { return '<!-- RHACS_PIN ' + JSON.stringify(Object.assign(JSON.parse(json), updates)) + ' -->'; }
      catch (e) { return m; }
    });
  }

  function el(tag, attrs) {
    var e = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (k === 'className') { e.className = v; }
        else if (k.startsWith('on')) { e.addEventListener(k.slice(2), v); }
        else { e.setAttribute(k, v); }
      });
    }
    return e;
  }

  function txt(s) { return document.createTextNode(s); }

  // makeAvatar: renders a circular avatar that works for both GitHub URLs and
  // generated SVG data-URIs (guest mode). Falls back to a coloured SVG circle
  // if src is empty.
  function makeAvatar(author, sizeCls) {
    sizeCls = sizeCls || '';
    var src = (author && author.avatarUrl) ? author.avatarUrl : '';
    if (!src && author && author.login) {
      src = Auth._makeAvatarSvg(author.login);
    }
    var cls = 'rhacs-avatar' + (sizeCls ? ' ' + sizeCls : '');
    var img = el('img', { className: cls, src: src, alt: author ? author.login : '' });
    img.style.borderRadius = '50%';
    img.style.objectFit    = 'cover';
    return img;
  }

  function append(parent) {
    var children = Array.prototype.slice.call(arguments, 1);
    children.forEach(function (c) { if (c) parent.appendChild(typeof c === 'string' ? txt(c) : c); });
    return parent;
  }

  // ── GitHub GraphQL ────────────────────────────────────────────────────────────
  function ghReq(query, vars, requireAuth) {
    var headers = { 'Content-Type': 'application/json' };
    if (S.token) headers['Authorization'] = 'bearer ' + S.token;
    else if (requireAuth) return Promise.reject(new Error('Not logged in'));

    return fetch(GH_GQL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ query: query, variables: vars || {} }),
    }).then(function (r) {
      if (r.status === 401) { Auth.logout(); throw new Error('Session expired — please log in again'); }
      if (r.status === 429) throw new Error('GitHub rate limit reached — please wait a minute');
      return r.json();
    }).then(function (d) {
      if (d.errors && d.errors.length) throw new Error(d.errors[0].message);
      return d.data;
    });
  }

  function getRepoMeta() {
    if (S.repoId && S.categoryId) return Promise.resolve();
    return ghReq(
      'query { repository(owner:"' + CFG.owner + '",name:"' + CFG.repo + '") { id discussionCategories(first:25){ nodes { id name } } } }'
    ).then(function (d) {
      if (!d || !d.repository) return;
      S.repoId = d.repository.id;
      var cats = d.repository.discussionCategories.nodes;
      var cat  = cats.find(function (c) { return c.name === CFG.categoryName; });
      if (cat) S.categoryId = cat.id;
    }).catch(function () {});
  }

  function findDiscussion() {
    if (!S.categoryId) return Promise.resolve(null);
    return ghReq(
      'query($o:String!,$r:String!,$c:ID!){ repository(owner:$o,name:$r){ discussions(first:100,categoryId:$c){ nodes{ id title } } } }',
      { o: CFG.owner, r: CFG.repo, c: S.categoryId }
    ).then(function (d) {
      if (!d || !d.repository) return null;
      var match = d.repository.discussions.nodes.find(function (n) { return n.title === getPageKey(); });
      return match ? match.id : null;
    }).catch(function () { return null; });
  }

  function createDiscussion() {
    return getRepoMeta().then(function () {
      if (!S.repoId || !S.categoryId) throw new Error('Could not load repo metadata');
      return ghReq(
        'mutation($r:ID!,$c:ID!,$t:String!,$b:String!){ createDiscussion(input:{repositoryId:$r,categoryId:$c,title:$t,body:$b}){ discussion{ id } } }',
        { r: S.repoId, c: S.categoryId, t: getPageKey(), b: 'Auto-created for ' + window.location.href },
        true
      ).then(function (d) { return d.createDiscussion.discussion.id; });
    });
  }

  function loadComments(discId) {
    return ghReq(
      'query($id:ID!){ node(id:$id){ ... on Discussion{ comments(first:100){ nodes{ id body createdAt author{ login avatarUrl } reactionGroups{ content users{ totalCount } viewerHasReacted } replies(first:20){ nodes{ id body createdAt author{ login avatarUrl } } } } } } } }',
      { id: discId }
    ).then(function (d) {
      if (!d || !d.node) return [];
      return d.node.comments.nodes;
    }).catch(function () { return []; });
  }

  function ensureDiscussion() {
    if (S.discussionId) return Promise.resolve(S.discussionId);
    return findDiscussion().then(function (id) {
      if (id) { S.discussionId = id; return id; }
      return createDiscussion().then(function (newId) { S.discussionId = newId; return newId; });
    });
  }

  function addPinComment(text, x, y, num) {
    return ensureDiscussion().then(function (discId) {
      return ghReq(
        'mutation($d:ID!,$b:String!){ addDiscussionComment(input:{discussionId:$d,body:$b}){ comment{ id createdAt } } }',
        { d: discId, b: buildBody(x, y, num, text) },
        true
      ).then(function (d) { return d.addDiscussionComment.comment; });
    });
  }

  function addReply(commentId, text) {
    return ghReq(
      'mutation($d:ID!,$r:ID!,$b:String!){ addDiscussionComment(input:{discussionId:$d,replyToId:$r,body:$b}){ comment{ id } } }',
      { d: S.discussionId, r: commentId, b: text },
      true
    );
  }

  function updateComment(id, body) {
    return ghReq(
      'mutation($i:ID!,$b:String!){ updateDiscussionComment(input:{commentId:$i,body:$b}){ comment{ id } } }',
      { i: id, b: body },
      true
    );
  }

  function deleteComment(id) {
    return ghReq(
      'mutation($i:ID!){ deleteDiscussionComment(input:{id:$i}){ clientMutationId } }',
      { i: id },
      true
    );
  }

  function toggleReaction(subjectId, content, hasReacted) {
    var mutation = hasReacted
      ? 'mutation($s:ID!,$c:ReactionContent!){ removeReaction(input:{subjectId:$s,content:$c}){ reaction{ content } } }'
      : 'mutation($s:ID!,$c:ReactionContent!){ addReaction(input:{subjectId:$s,content:$c}){ reaction{ content } } }';
    return ghReq(mutation, { s: subjectId, c: content }, true);
  }

  // ── Auth ──────────────────────────────────────────────────────────────────────
  var Auth = {
    init: function () {
      S.token = localStorage.getItem(CFG.tokenKey);
      try { S.user = JSON.parse(localStorage.getItem(CFG.userKey)); } catch (e) {}
      // Restore guest session if active
      if (!S.token && localStorage.getItem(CFG.guestKey)) {
        var restored = Auth.guestIdentity();
        if (restored) {
          S.guestMode = true;
          S.user = restored;
          // Back-fill avatarUrl if legacy entry had none
          if (!S.user.avatarUrl) S.user.avatarUrl = Auth._makeAvatarSvg(S.user.login);
        }
      }
    },
    isLoggedIn:        function () { return !!S.token; },
    isAuthed:          function () { return !!S.token || S.guestMode; },
    isPrototypeOwner:  function () { return !!(S.user && S.user.login === CFG.owner); },

    // ── GitHub OAuth ──────────────────────────────────────────────────────────
    login: function () {
      return new Promise(function (resolve, reject) {
        var url = 'https://github.com/login/oauth/authorize?client_id=' + CFG.clientId +
          '&redirect_uri=' + encodeURIComponent(CFG.callbackUrl) + '&scope=public_repo';

        var popup = window.open(url, 'gh-oauth', 'width=620,height=720,left=200,top=80');
        console.log('[rhacs] popup opened:', popup ? 'ok' : 'blocked');
        // Fallback: if popup is blocked, use a full-page redirect instead
        if (!popup) {
          localStorage.setItem('rhacs_return_url', window.location.href);
          window.location.href = url;
          return;
        }

        var done = false;
        var pollTimer, closedTimer, storageHandler, msgHandler, bc;

        function cleanup() {
          clearInterval(pollTimer);
          clearInterval(closedTimer);
          window.removeEventListener('message', msgHandler);
          window.removeEventListener('storage', storageHandler);
          try { if (bc) { bc.close(); bc = null; } } catch (e) {}
          localStorage.removeItem('rhacs_oauth_result');
        }

        function handleToken(source, token) {
          console.log('[rhacs] handleToken via ' + source + ' token=' + (token ? 'present' : 'null'));
          if (done) { console.log('[rhacs] already done, skipping'); return; }
          done = true;
          cleanup();
          if (token) {
            S.token = token;
            S.guestMode = false;
            localStorage.setItem(CFG.tokenKey, S.token);
            localStorage.removeItem(CFG.guestKey);
            // Resolve immediately so the dialog closes — don't block on fetchUser
            resolve(S.user);
            // Fetch profile in background; a failure just means no avatar
            Auth.fetchUser()
              .then(function () { try { FAB.updateUser(); } catch (e) {} })
              .catch(function (e) {
                console.warn('[rhacs] fetchUser after login:', e && e.message);
                try { FAB.updateUser(); } catch (ex) {}
              });
          } else {
            reject(new Error('GitHub login failed'));
          }
        }

        // Channel 0: BroadcastChannel — purpose-built same-origin cross-tab messaging
        try {
          bc = new BroadcastChannel('rhacs_auth');
          bc.onmessage = function (e) {
            console.log('[rhacs] BroadcastChannel received:', JSON.stringify(e.data));
            if (e.data && e.data.type === 'rhacs_token' && !done) handleToken('BroadcastChannel', e.data.token);
          };
          console.log('[rhacs] BroadcastChannel listening');
        } catch (e) { bc = null; console.warn('[rhacs] BroadcastChannel unavailable:', e.message); }

        // Channel 1: storage event — fires INSTANTLY in the main window when
        // auth-callback.html writes to localStorage in the popup tab
        storageHandler = function (e) {
          if (e.key !== 'rhacs_oauth_result' || !e.newValue) return;
          console.log('[rhacs] storage event received for rhacs_oauth_result');
          try {
            var d = JSON.parse(e.newValue);
            if (d && d.token && Date.now() - d.ts < 60000) handleToken('storage-event', d.token);
          } catch (ex) {}
        };
        window.addEventListener('storage', storageHandler);

        // Channel 2: localStorage polling (backup for browsers that delay storage events)
        localStorage.removeItem('rhacs_oauth_result');
        pollTimer = setInterval(function () {
          try {
            var raw = localStorage.getItem('rhacs_oauth_result');
            if (!raw) return;
            var data = JSON.parse(raw);
            if (data && data.token && Date.now() - data.ts < 60000) {
              console.log('[rhacs] localStorage poll found token');
              handleToken('localStorage-poll', data.token);
            }
          } catch (e) {}
        }, 300);

        // Channel 3: postMessage (instant when same-origin popup works)
        msgHandler = function (e) {
          if (e.origin !== 'https://zhenpesky.github.io') return;
          if (!e.data || e.data.type !== 'rhacs_auth_done') return;
          console.log('[rhacs] postMessage received token');
          handleToken('postMessage', e.data.token);
        };
        window.addEventListener('message', msgHandler);

        // Channel 4: popup-closed watcher — once the popup closes we do one final
        // localStorage read; if nothing arrives within 2s after close, reject
        closedTimer = setInterval(function () {
          if (!popup || !popup.closed) return;
          clearInterval(closedTimer);
          console.log('[rhacs] popup closed detected, done=' + done);
          if (done) return;
          // Give auth-callback up to 1s after close to flush localStorage
          setTimeout(function () {
            if (done) return;
            try {
              var raw = localStorage.getItem('rhacs_oauth_result');
              console.log('[rhacs] post-close localStorage check: ' + (raw ? 'found' : 'empty'));
              // Also check the callback debug log
              var cbLog = localStorage.getItem('rhacs_cb_log');
              if (cbLog) console.log('[rhacs] cb_log:', cbLog);
              if (raw) { var d = JSON.parse(raw); if (d && d.token) { handleToken('post-close-poll', d.token); return; } }
            } catch (ex) {}
            // Popup closed with no token — treat as cancelled
            done = true; cleanup(); reject(new Error('Login cancelled'));
          }, 1000);
        }, 500);

        // Timeout after 5 minutes
        setTimeout(function () {
          if (!done) { done = true; cleanup(); reject(new Error('Login timed out')); }
        }, 300000);
      });
    },
    fetchUser: function () {
      if (!S.token) return Promise.resolve();
      return fetch('https://api.github.com/user', { headers: { Authorization: 'token ' + S.token } })
        .then(function (r) {
          if (r.status === 401) {
            // Token is invalid — clear it so we don't loop
            console.warn('[rhacs] GitHub token rejected (401), clearing.');
            S.token = null;
            localStorage.removeItem(CFG.tokenKey);
            return Promise.reject(new Error('GitHub token invalid or expired. Please log in again.'));
          }
          if (!r.ok) return Promise.reject(new Error('GitHub API error: ' + r.status));
          return r.json();
        })
        .then(function (u) {
          if (!u) return;
          S.user = { login: u.login, avatarUrl: u.avatar_url, name: u.name };
          localStorage.setItem(CFG.userKey, JSON.stringify(S.user));
        });
    },
    logout: function () {
      S.token = null; S.user = null; S.guestMode = false;
      localStorage.removeItem(CFG.tokenKey);
      localStorage.removeItem(CFG.userKey);
      localStorage.removeItem(CFG.guestKey);
      FAB.updateUser();
      Notify.toast('Logged out');
    },

    // ── Guest mode ────────────────────────────────────────────────────────────
    _avatarColors: [
      ['#0052cc','#fff'],['#6f42c1','#fff'],['#1a7f37','#fff'],
      ['#cf222e','#fff'],['#bf8700','#fff'],['#0969da','#fff'],
      ['#8250df','#fff'],['#2da44e','#fff'],['#d1242f','#fff'],
      ['#9a6700','#fff'],
    ],
    _pickRandom: function (arr, seed) {
      // deterministic pick based on a seed string so same name → same color
      var h = 0;
      for (var i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
      return arr[Math.abs(h) % arr.length];
    },
    _makeAvatarSvg: function (seed) {
      var pair     = Auth._pickRandom(Auth._avatarColors, seed || 'Guest');
      var bg       = pair[0], fg = pair[1];
      var initials = (seed || 'G').replace(/[^a-zA-Z]/g, '').slice(0, 2).toUpperCase() || 'G';
      return 'data:image/svg+xml,' + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">' +
        '<circle cx="16" cy="16" r="16" fill="' + bg + '"/>' +
        '<text x="16" y="21" font-size="13" font-weight="600" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif" ' +
        'fill="' + fg + '" text-anchor="middle">' + initials + '</text>' +
        '</svg>'
      );
    },
    // Join fullName · title · company — use whatever is filled in
    _buildGuestLogin: function (firstName, lastName, title, company) {
      var namePart = [firstName, lastName].map(function (s) { return (s || '').trim(); }).filter(Boolean).join(' ');
      var parts = [namePart, title, company].map(function (s) { return (s || '').trim(); }).filter(Boolean);
      return parts.length ? parts.join(' \u00b7 ') : 'Anonymous Guest';
    },
    guestIdentity: function () {
      var stored = localStorage.getItem(CFG.guestKey);
      if (stored) {
        try {
          var obj = JSON.parse(stored);
          if (obj && obj.login) return obj;
        } catch (e) {}
        // Legacy plain string — migrate gracefully
        var legacy = { login: stored, avatarUrl: Auth._makeAvatarSvg(stored), name: stored };
        localStorage.setItem(CFG.guestKey, JSON.stringify(legacy));
        return legacy;
      }
      return null;
    },
    _createGuestIdentity: function (firstName, lastName, title, company) {
      var login    = Auth._buildGuestLogin(firstName, lastName, title, company);
      // Avatar seed: first name, then first of any other field
      var seed     = (firstName || lastName || title || company || 'Guest').trim();
      var user     = { login: login, firstName: firstName || '', lastName: lastName || '', title: title || '', company: company || '', avatarUrl: Auth._makeAvatarSvg(seed) };
      localStorage.setItem(CFG.guestKey, JSON.stringify(user));
      return user;
    },
    _showNamePromptThenGuest: function () {
      return new Promise(function (resolve, reject) {
        var old = document.getElementById('rhacs-guest-prompt');
        if (old) old.remove();

        var overlay = el('div', { id: 'rhacs-guest-prompt', className: 'rhacs-auth-dialog-overlay' });
        var card    = el('div', { className: 'rhacs-auth-dialog' });

        var iconEl = el('div', { className: 'rhacs-auth-dialog__icon' });
        iconEl.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16" fill="currentColor"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4"/></svg>';

        var titleEl = el('h3', { className: 'rhacs-auth-dialog__title' });
        titleEl.appendChild(txt('Your info'));

        function makeField(labelText, placeholder, required) {
          var wrap  = el('div', { className: 'rhacs-guest-field' });
          var lbl   = el('label', { className: 'rhacs-guest-field__label' });
          lbl.appendChild(txt(labelText));
          if (required) {
            var req = el('span', { className: 'rhacs-guest-field__required' });
            req.appendChild(txt(' *'));
            lbl.appendChild(req);
          }
          var input = el('input', { className: 'rhacs-guest-name-input', placeholder: placeholder, maxLength: '40', type: 'text' });
          append(wrap, lbl, input);
          return { wrap: wrap, input: input };
        }

        // Name row: first + last side by side
        var nameRow   = el('div', { className: 'rhacs-guest-name-row' });
        var firstF    = makeField('First name', 'e.g. Alex', true);
        var lastF     = makeField('Last name',  'e.g. Smith');
        append(nameRow, firstF.wrap, lastF.wrap);

        var titleF   = makeField('Title or role',  'e.g. UX Designer, PM', false);
        var companyF = makeField('Company',         'e.g. Red Hat, IBM',    false);

        // Button starts disabled; lights up once first name has content
        var continueBtn = el('button', { className: 'rhacs-auth-dialog__btn rhacs-auth-dialog__btn--primary', disabled: true });
        continueBtn.innerHTML = '<span>Continue as guest</span>';
        continueBtn.style.opacity = '0.45';
        continueBtn.style.cursor  = 'not-allowed';

        function syncBtn() {
          var hasFirst = !!firstF.input.value.trim();
          continueBtn.disabled      = !hasFirst;
          continueBtn.style.opacity = hasFirst ? '' : '0.45';
          continueBtn.style.cursor  = hasFirst ? '' : 'not-allowed';
        }

        [firstF, lastF, titleF, companyF].forEach(function (f) {
          f.input.addEventListener('input', function () { syncBtn(); });
        });

        continueBtn.addEventListener('click', function () {
          if (continueBtn.disabled) return;
          overlay.remove();
          resolve(Auth._createGuestIdentity(firstF.input.value, lastF.input.value, titleF.input.value, companyF.input.value));
        });

        [firstF, lastF, titleF, companyF].forEach(function (f) {
          f.input.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !continueBtn.disabled) continueBtn.click(); });
        });

        append(card, iconEl, titleEl, nameRow, titleF.wrap, companyF.wrap, continueBtn);
        overlay.appendChild(card);
        overlay.addEventListener('click', function (e) {
          if (e.target === overlay) { overlay.remove(); reject(new Error('cancelled')); }
        });
        rhacsMount().appendChild(overlay);
        setTimeout(function () { firstF.input.focus(); }, 50);
      });
    },
    loginAsGuest: function () {
      var existing = Auth.guestIdentity();
      if (existing) {
        S.guestMode = true;
        S.user = existing;
        FAB.updateUser();
        Notify.toast('Commenting as guest.');
        return Promise.resolve();
      }
      return Auth._showNamePromptThenGuest().then(function (user) {
        S.guestMode = true;
        S.user = user;
        FAB.updateUser();
        Notify.toast('Commenting as ' + user.login + '.');
      });
    },
    exitGuest: function () {
      S.guestMode = false;
      S.user = null;
      localStorage.removeItem(CFG.guestKey);
      FAB.updateUser();
      Notify.toast('Guest session ended');
    },

    // ── Guest localStorage CRUD ───────────────────────────────────────────────
    guestPinsKey: function () {
      // Scope guest pins to the specific SPA route (pathname) so comments
      // on System Config don't leak into Saved Filters or other prototype routes.
      var path = window.location.pathname;
      // Also include the prototype version param so v1/v2 are separate if needed
      var version = new URLSearchParams(window.location.search).get('prototype') || '';
      return CFG.guestPinsPrefix + path + (version ? '?prototype=' + version : '');
    },
    loadGuestPins: function () {
      try { return JSON.parse(localStorage.getItem(Auth.guestPinsKey()) || '[]'); } catch (e) { return []; }
    },
    saveGuestPins: function (pins) {
      localStorage.setItem(Auth.guestPinsKey(), JSON.stringify(pins));
    },
    addGuestPin: function (text, x, y, num) {
      // Build the comment body with embedded guest author identity
      var guestAuthor = S.user ? { login: S.user.login, name: S.user.name, avatarUrl: S.user.avatarUrl } : null;
      var body = buildBody(x, y, num, text, guestAuthor);
      var tempId = 'guest-' + Date.now();
      var pin = {
        id: tempId,
        body: body,
        createdAt: new Date().toISOString(),
        author: guestAuthor || { login: 'Guest', name: 'Guest' },
        replies: [],
        meta: Object.assign(parseMeta(body), { pinNumber: num, resolved: false }),
        _guest: true,
        _pendingUpload: true,
      };

      // Store immediately in localStorage so the guest sees it right away (optimistic)
      var pins = Auth.loadGuestPins();
      pins.push(pin);
      Auth.saveGuestPins(pins);

      // Fire-and-forget: POST to worker → GitHub Discussions so the prototype owner can see it
      fetch(CFG.workerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'guest_post',
          pageKey: getPageKey(),
          pageUrl: window.location.href,
          commentBody: body,
          owner: CFG.owner,
          repo: CFG.repo,
          categoryName: CFG.categoryName,
        }),
      }).then(function (r) { return r.json(); }).then(function (data) {
        if (data && data.id) {
          // Replace the temp ID with the real GitHub comment ID
          var stored = Auth.loadGuestPins();
          for (var i = 0; i < stored.length; i++) {
            if (stored[i].id === tempId) {
              stored[i].id = data.id;
              stored[i]._pendingUpload = false;
              break;
            }
          }
          Auth.saveGuestPins(stored);
          if (data.discussionId) S.discussionId = data.discussionId;
        }
      }).catch(function (e) {
        console.warn('[rhacs] Guest comment upload to GitHub failed:', e && e.message);
        // Pin stays in localStorage as a local-only draft
      });

      return pin;
    },
    deleteGuestPin: function (id) {
      Auth.saveGuestPins(Auth.loadGuestPins().filter(function (p) { return p.id !== id; }));
    },

    // ── requireAuth: shows choice dialog if not authed ────────────────────────
    requireAuth: function () {
      if (Auth.isAuthed()) return Promise.resolve();
      return Auth.showAuthDialog();
    },
    showAuthDialog: function () {
      return new Promise(function (resolve, reject) {
        // Remove any stale dialog
        var existing = document.getElementById('rhacs-auth-dialog');
        if (existing) existing.remove();

        var overlay = el('div', { id: 'rhacs-auth-dialog', className: 'rhacs-auth-dialog-overlay' });

        var card = el('div', { className: 'rhacs-auth-dialog' });

        var iconEl = el('div', { className: 'rhacs-auth-dialog__icon' });
        iconEl.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 16 16" fill="currentColor"><path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105"/></svg>';

        var titleEl = el('h3', { className: 'rhacs-auth-dialog__title' });
        titleEl.appendChild(txt('Add a comment'));

        var subEl = el('p', { className: 'rhacs-auth-dialog__sub' });
        subEl.appendChild(txt('Choose how you want to comment on this prototype.'));

        // GitHub login option
        var ghBtn = el('button', { className: 'rhacs-auth-dialog__btn rhacs-auth-dialog__btn--primary' });
        ghBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="flex-shrink:0"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/></svg><span>Log in with GitHub</span><span class="rhacs-auth-dialog__badge rhacs-auth-dialog__badge--full">Full features</span>';
        ghBtn.addEventListener('click', function () {
          ghBtn.disabled = true;
          ghBtn.style.opacity = '0.6';
          var origHTML = ghBtn.innerHTML;
          ghBtn.innerHTML = '<span>Opening GitHub…</span>';
          Auth.login()
            .then(function () {
              overlay.remove();
              resolve(); // resolve FIRST — triggers FAB.setMode(true) in the toggleMode chain
              try { FAB.updateUser(); } catch (e) {}
              try { loadAndRender(); } catch (e) {}
            })
            .catch(function (e) {
              // Login failed — restore button so user can retry
              ghBtn.disabled = false;
              ghBtn.style.opacity = '';
              ghBtn.innerHTML = origHTML;
            });
        });

        // Feature list for GitHub
        var ghFeatures = el('ul', { className: 'rhacs-auth-dialog__features' });
        ['Seen by all reviewers', 'Real-time notifications', 'Full history across sessions'].forEach(function (f) {
          var li = el('li'); li.appendChild(txt(f)); ghFeatures.appendChild(li);
        });

        var divider = el('div', { className: 'rhacs-auth-dialog__divider' });
        divider.appendChild(txt('or'));

        // Guest option
        var guestBtn = el('button', { className: 'rhacs-auth-dialog__btn rhacs-auth-dialog__btn--secondary' });
        guestBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="flex-shrink:0"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.029 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/></svg><span>Comment without login</span><span class="rhacs-auth-dialog__badge rhacs-auth-dialog__badge--local">No account needed</span>';
        guestBtn.addEventListener('click', function () {
          overlay.remove();
          Auth.loginAsGuest()
            .then(function () { resolve(); })
            .catch(function (e) {
              // User cancelled the name prompt — that's fine, just reject silently
              reject(e);
            });
        });

        // Feature list for guest
        var guestFeatures = el('ul', { className: 'rhacs-auth-dialog__features rhacs-auth-dialog__features--muted' });
        ['No GitHub account needed', 'Comments are visible to the prototype owner', 'No notifications — log in with GitHub for those'].forEach(function (f) {
          var li = el('li'); li.appendChild(txt(f)); guestFeatures.appendChild(li);
        });

        var cancelBtn = el('button', { className: 'rhacs-auth-dialog__cancel' });
        cancelBtn.appendChild(txt('Cancel'));
        cancelBtn.addEventListener('click', function () { overlay.remove(); reject(new Error('cancelled')); });

        append(card, iconEl, titleEl, subEl, ghBtn, ghFeatures, divider, guestBtn, guestFeatures, cancelBtn);
        overlay.appendChild(card);

        // Close on backdrop click
        overlay.addEventListener('click', function (e) { if (e.target === overlay) { overlay.remove(); reject(new Error('cancelled')); } });

        rhacsMount().appendChild(overlay);
      });
    },
  };

  // ── Data helpers ─────────────────────────────────────────────────────────────
  function parseComments(comments) {
    return comments
      .map(function (c) {
        var pin = Object.assign({}, c, { meta: parseMeta(c.body), replies: c.replies ? c.replies.nodes : [] });
        // Guest comments are posted via the owner token; restore the real guest identity from meta
        if (pin.meta && pin.meta.guestAuthor) {
          pin.author = pin.meta.guestAuthor;
          pin._guest = true;
        }
        return pin;
      })
      .filter(function (c) { return c.meta !== null; })
      .sort(function (a, b) { return a.meta.pinNumber - b.meta.pinNumber; });
  }

  // Returns merged array: GitHub pins (if logged in) + guest pins from localStorage
  function loadAllPins() {
    var ghPins  = S.pins.filter(function (p) { return !p._guest; });
    var gPins   = Auth.loadGuestPins().map(function (p) {
      // Ensure meta is parsed (may have been re-read from storage)
      if (!p.meta) p.meta = parseMeta(p.body);
      return p;
    });
    return ghPins.concat(gPins).sort(function (a, b) {
      return new Date(a.createdAt) - new Date(b.createdAt);
    });
  }

  function loadAndRender() {
    // Guest-only: skip GitHub API entirely
    if (S.guestMode && !S.token) {
      S.pins = Auth.loadGuestPins().map(function (p) {
        if (!p.meta) p.meta = parseMeta(p.body);
        return p;
      });
      Overlay.renderPins();
      FAB.updateBadge();
      return Promise.resolve();
    }
    return getRepoMeta()
      .then(findDiscussion)
      .then(function (id) {
        if (!id) { S.pins = Auth.loadGuestPins(); Overlay.renderPins(); return; }
        S.discussionId = id;
        return loadComments(id).then(function (comments) {
          // Guest comments are now posted to GitHub Discussions via the worker,
          // so they appear in `comments` already. No localStorage merge needed
          // (that would create duplicates). localStorage is a local-only cache
          // for the guest's own session only.
          S.pins = parseComments(comments);
          Overlay.renderPins();
          FAB.updateBadge();
        });
      }).catch(function (e) {
        console.warn('[RHACS Comments] load failed:', e.message);
        S.pins = Auth.loadGuestPins();
        Overlay.renderPins();
      });
  }

  // ── Overlay ───────────────────────────────────────────────────────────────────
  // Strategy: root stays on document.body with position:fixed (full viewport,
  // zero layout impact). Pins use position:fixed with viewport-pixel coords
  // recomputed on every scroll/resize, so they always sit over the right content
  // regardless of which element is the scroll container.
  var Overlay = {
    root: null,
    overlayEl: null,
    _scrollListener: null,

    init: function () {
      this.root = el('div', { id: 'rhacs-comment-root' });
      this.overlayEl = el('div', { className: 'rhacs-overlay' });
      this.overlayEl.addEventListener('click', Overlay.handleClick);

      // Forward wheel events through the overlay so mouse scroll works in comment mode
      this.overlayEl.addEventListener('wheel', function (e) {
        var scroller = findScrollContainer();
        var target   = scroller || document.documentElement;
        target.scrollTop  += e.deltaY;
        target.scrollLeft += e.deltaX;
      }, { passive: true });

      this.root.appendChild(this.overlayEl);
      rhacsMount().appendChild(this.root);

      window.addEventListener('resize', function () { Overlay.refresh(); });
      // Use capturing scroll so we catch scroll on any nested element
      document.addEventListener('scroll', function () { Overlay.onScroll(); }, true);

      // Re-detect scroll container after React finishes hydrating
      setTimeout(function () { Overlay.refresh(); }, 800);
      setTimeout(function () { Overlay.refresh(); }, 2500);
      setTimeout(function () { Overlay.refresh(); }, 5000);
    },

    // Re-detect scroll container and re-render pins.
    refresh: function () {
      S.scrollContainer = findScrollContainer();
      Overlay.renderPins();
    },

    // Called on every scroll event (captured, fires for any element).
    onScroll: function () {
      // Always re-render pins so they track content
      Overlay.renderPins();
      // Reposition popup next to its pin if open
      if (S.activePinId) {
        var pinEl = Overlay.overlayEl.querySelector('[data-pin-id="' + S.activePinId + '"]');
        if (!pinEl || pinEl.style.visibility === 'hidden') { Popup.close(); return; }
        var r = pinEl.getBoundingClientRect();
        Popup.positionFixed(r.right + 4, r.top);
      }
    },

    handleClick: function (e) {
      if (!S.commentMode) return;
      if (e.target.closest && (e.target.closest('.rhacs-pin') || e.target.closest('#rhacs-popup'))) return;
      e.stopPropagation(); // prevent the document click-outside handler from closing the popup we're about to open
      var ci = containerInfo();
      var x = ((e.clientX - ci.clientLeft + ci.scrollLeft) / Math.max(ci.scrollWidth,  1)) * 100;
      var y = ((e.clientY - ci.clientTop  + ci.scrollTop)  / Math.max(ci.scrollHeight, 1)) * 100;
      Popup.showNewForm(x, y, e.clientX, e.clientY);
    },

    renderPins: function () {
      this.overlayEl.querySelectorAll('.rhacs-pin').forEach(function (p) { p.remove(); });
      var curState = detectViewState();
      S.pins.forEach(function (pin) {
        if (!pin.meta) return;
        // Only show pins that match the current view state.
        // Legacy pins without viewState are shown in both states.
        var pinState = pin.meta.viewState;
        if (pinState && pinState !== curState) return;
        var vp = pinToViewport(pin.meta);
        var isUnread   = new Date(pin.createdAt).getTime() > S.lastSeen;
        var isResolved = pin.meta.resolved;
        var cls = 'rhacs-pin' +
          (isResolved ? ' rhacs-pin--resolved' : '') +
          (isUnread   ? ' rhacs-pin--unread'   : '');
        var pinEl = el('div', { className: cls, 'data-pin-id': pin.id });
        pinEl.appendChild(txt(pinInitials(pin.author)));
        pinEl.title = (pin.author ? pin.author.login : '') + ' — click to view';
        // Fixed-pixel viewport position (pin scrolls with content because we
        // subtract the container's scrollTop/scrollLeft each render)
        pinEl.style.left       = vp.left + 'px';
        pinEl.style.top        = vp.top  + 'px';
        pinEl.style.visibility = vp.visible ? 'visible' : 'hidden';
        pinEl.addEventListener('click', function (e) {
          e.stopPropagation();
          Popup.showThread(pin.id);
        });
        Overlay.overlayEl.appendChild(pinEl);
      });
    },

    setMode: function (active) {
      var cursorSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">' +
        '<circle cx="15" cy="15" r="14" fill="#ede9f8"/>' +
        '<path fill="#6753ac" d="M6.9 20.4a1.4 1.4 0 0 1 .4 1.1 15 15 0 0 1-.56 2.8c1.95-.45 3.14-.97 3.68-1.25a1.4 1.4 0 0 1 .99-.1A11.2 11.2 0 0 0 15 23.4c5.6 0 9.8-3.93 9.8-8.4s-4.2-8.4-9.8-8.4-9.8 3.93-9.8 8.4c0 1.95.87 3.75 2.35 5.1 0 0 0 0-.65-.1z"/>' +
        '</svg>';
      var commentCursor = [
        'url("data:image/svg+xml,' + encodeURIComponent(cursorSvg) + '") 15 15',
        'crosshair'
      ].join(', ');
      if (active) {
        this.overlayEl.classList.add('rhacs-overlay--active');
        document.body.style.cursor = commentCursor;
        rhacsMount().classList.add('rhacs-comment-mode');
      } else {
        this.overlayEl.classList.remove('rhacs-overlay--active');
        document.body.style.cursor = '';
        rhacsMount().classList.remove('rhacs-comment-mode');
      }
    },
  };

  // ── Confirm dialog (PF6-styled replacement for native confirm()) ─────────────
  function showConfirm(message, opts) {
    // opts: { title, confirmLabel, cancelLabel, danger }
    opts = opts || {};
    return new Promise(function (resolve) {
      var backdrop = el('div', { className: 'rhacs-confirm-backdrop' });
      var dialog   = el('div', { className: 'rhacs-confirm-dialog', role: 'dialog', 'aria-modal': 'true' });

      var hdr = el('div', { className: 'rhacs-confirm-dialog__header' });
      var titleEl = el('span', { className: 'rhacs-confirm-dialog__title' });
      if (opts.danger !== false) {
        var icon = el('span', { className: 'rhacs-confirm-dialog__title-icon' });
        icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/></svg>';
        titleEl.appendChild(icon);
      }
      titleEl.appendChild(txt(opts.title || 'Are you sure?'));
      var closeBtn = el('button', { className: 'rhacs-confirm-dialog__close', 'aria-label': 'Cancel' });
      closeBtn.appendChild(txt('\u00d7'));
      append(hdr, titleEl, closeBtn);

      var body = el('div', { className: 'rhacs-confirm-dialog__body' });
      body.appendChild(txt(message));

      var footer = el('div', { className: 'rhacs-confirm-dialog__footer' });
      var cancelBtn = el('button', { className: 'pf-v6-c-button pf-m-secondary' });
      cancelBtn.appendChild(txt(opts.cancelLabel || 'Cancel'));
      var confirmBtn = el('button', { className: 'pf-v6-c-button ' + (opts.danger !== false ? 'pf-m-danger' : 'pf-m-primary') });
      confirmBtn.appendChild(txt(opts.confirmLabel || 'Delete'));
      append(footer, cancelBtn, confirmBtn);

      append(dialog, hdr, body, footer);
      backdrop.appendChild(dialog);
      document.body.appendChild(backdrop);
      confirmBtn.focus();

      function close(result) {
        backdrop.style.opacity = '0';
        backdrop.style.transition = 'opacity 0.12s ease';
        setTimeout(function () { backdrop.remove(); }, 130);
        resolve(result);
      }
      confirmBtn.addEventListener('click', function () { close(true); });
      cancelBtn.addEventListener('click', function () { close(false); });
      closeBtn.addEventListener('click', function () { close(false); });
      backdrop.addEventListener('click', function (e) { if (e.target === backdrop) close(false); });
      backdrop.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { close(false); }
        if (e.key === 'Enter')  { close(true); }
      });
    });
  }

  // ── Popup ─────────────────────────────────────────────────────────────────────
  var Popup = {
    el: null,
    _ro: null,
    init: function () {
      this.el = el('div', { className: 'rhacs-popup', id: 'rhacs-popup' });
      this.el.style.display = 'none';
      rhacsMount().appendChild(this.el);
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') Popup.close(); });
      // Auto-reposition whenever the popup grows or shrinks
      if (window.ResizeObserver) {
        this._ro = new ResizeObserver(function () {
          if (Popup.el.style.display !== 'none') Popup.reposition();
        });
        this._ro.observe(this.el);
      }
    },
    close: function () {
      this.el.style.display = 'none';
      S.activePinId = null;
    },
    _anchorX: 0,
    _anchorY: 0,
    positionFixed: function (clientX, clientY) {
      this._anchorX = clientX;
      this._anchorY = clientY;
      var popupEl = this.el;
      var margin = 12;
      var panelOpen = rhacsMount().classList.contains('rhacs-panel-open');
      var panelW    = panelOpen ? 300 : 0;
      var vw = window.innerWidth - panelW, vh = window.innerHeight;
      popupEl.style.display = 'block';
      // Temporarily remove max-height to measure true content height
      var prevMaxH = popupEl.style.maxHeight;
      popupEl.style.maxHeight = 'none';

      function applyPos(top, left) {
        if (Popup._ro) Popup._ro.disconnect();
        popupEl.style.maxHeight = '';
        popupEl.style.overflowY = '';

        var naturalH = popupEl.scrollHeight;
        var maxAvail = vh - 2 * margin;

        // Shift up if needed so bottom stays in viewport
        if (top + naturalH > vh - margin) top = vh - margin - naturalH;
        top  = Math.max(margin, top);
        left = Math.min(Math.max(margin, left), vw - (popupEl.offsetWidth || 320) - margin);

        popupEl.style.top        = top  + 'px';
        popupEl.style.left       = left + 'px';
        popupEl.style.visibility = '';

        // Scroll only if content exceeds full viewport height
        if (naturalH > maxAvail) {
          popupEl.style.maxHeight = maxAvail + 'px';
          popupEl.style.overflowY = 'auto';
        }

        requestAnimationFrame(function () {
          if (Popup._ro) Popup._ro.observe(popupEl);
        });
      }

      var fui = window.FloatingUIDOM;
      if (fui && fui.computePosition && fui.offset && fui.flip && fui.shift) {
        popupEl.style.visibility = 'hidden';
        var anchor = {
          getBoundingClientRect: function () {
            return { width: 0, height: 0, x: clientX, y: clientY,
                     top: clientY, left: clientX, right: clientX, bottom: clientY };
          }
        };
        fui.computePosition(anchor, popupEl, {
          placement: 'right-start',
          strategy:  'fixed',
          middleware: [ fui.offset(8), fui.flip({ padding: 12 }), fui.shift({ padding: 12 }) ]
        }).then(function (pos) {
          applyPos(pos.y, pos.x);
        }).catch(function () {
          var pw = popupEl.offsetWidth || 320;
          var left = clientX + margin;
          if (left + pw > vw - margin) left = clientX - pw - margin;
          applyPos(clientY, left);
        });
      } else {
        var pw = popupEl.offsetWidth || 320;
        var left = clientX + margin;
        if (left + pw > vw - margin) left = clientX - pw - margin;
        applyPos(clientY, left);
      }
    },
    reposition: function () {
      var popupEl = this.el;
      if (!popupEl || popupEl.style.display === 'none' || popupEl.style.visibility === 'hidden') return;
      var margin    = 12;
      var panelOpen = rhacsMount().classList.contains('rhacs-panel-open');
      var vh = window.innerHeight;
      var vw = window.innerWidth - (panelOpen ? 300 : 0);

      // Let content determine natural height — remove any previous cap first
      if (Popup._ro) Popup._ro.disconnect();
      popupEl.style.maxHeight = '';
      popupEl.style.overflowY = '';

      var naturalH = popupEl.scrollHeight;
      var naturalW = popupEl.offsetWidth;
      var curTop   = parseFloat(popupEl.style.top)  || 0;
      var curLeft  = parseFloat(popupEl.style.left) || 0;

      // Best top: shift up just enough so bottom fits, but never above margin
      var idealTop = curTop;
      if (curTop + naturalH > vh - margin) {
        idealTop = vh - margin - naturalH;
      }
      idealTop = Math.max(margin, idealTop);

      // Best left: shift left just enough so right edge fits
      var idealLeft = curLeft;
      if (curLeft + naturalW > vw - margin) {
        idealLeft = vw - margin - naturalW;
      }
      idealLeft = Math.max(margin, idealLeft);

      popupEl.style.top  = idealTop  + 'px';
      popupEl.style.left = idealLeft + 'px';

      // Only add scroll if content is taller than the entire viewport
      var maxAvail = vh - 2 * margin;
      if (naturalH > maxAvail) {
        popupEl.style.maxHeight = maxAvail + 'px';
        popupEl.style.overflowY = 'auto';
      }

      requestAnimationFrame(function () {
        if (Popup._ro) Popup._ro.observe(popupEl);
      });
    },
    showNewForm: function (x, y, clientX, clientY) {
      S.activePinId = null;
      this.el.innerHTML = '';

      var header = el('div', { className: 'rhacs-popup__header' });
      var titleEl = el('span', { className: 'rhacs-popup__title' });
      titleEl.appendChild(txt('Add comment'));
      var closeBtn = el('button', { className: 'pf-v6-c-button pf-m-plain rhacs-popup__close', onclick: function () { Popup.close(); } });
      closeBtn.setAttribute('aria-label', 'Close');
      closeBtn.appendChild(txt('×'));
      append(header, titleEl, closeBtn);

      var textarea = el('textarea', { className: 'pf-v6-c-form-control rhacs-popup__textarea', placeholder: 'Leave a comment…', rows: '3' });
      var inputError = el('div', { className: 'rhacs-popup__input-error' });
      inputError.appendChild(txt('Comment can\u2019t be empty'));

      textarea.addEventListener('input', function () {
        if (textarea.value.trim()) {
          textarea.classList.remove('rhacs-popup__textarea--error');
          inputError.style.display = 'none';
        }
      });

      var actions = el('div', { className: 'rhacs-popup__actions' });
      var postBtn = el('button', { className: 'pf-v6-c-button pf-m-primary' });
      postBtn.appendChild(txt('Post'));
      postBtn.addEventListener('click', function () {
        if (!textarea.value.trim()) {
          textarea.classList.add('rhacs-popup__textarea--error');
          inputError.style.display = 'block';
          textarea.focus();
          return;
        }
        postBtn.disabled = true;
        postBtn.textContent = 'Posting…';
        Popup.submitNew(textarea.value, x, y);
      });

      var cancelBtn = el('button', { className: 'pf-v6-c-button pf-m-secondary' });
      cancelBtn.appendChild(txt('Cancel'));
      cancelBtn.addEventListener('click', function () { Popup.close(); });

      append(actions, postBtn, cancelBtn);
      append(this.el, header, textarea, inputError, actions);
      this.el.style.display = 'block';
      this.positionFixed(clientX, clientY);
      textarea.focus();
    },
    submitNew: function (text, x, y) {
      text = text.trim();
      if (!text) return;
      var num = S.pins.length + 1;
      Auth.requireAuth()
        .then(function () {
          if (S.guestMode) {
            Auth.addGuestPin(text, x, y, num);
            Popup.close();
            FAB.setMode(false);
            S.pins = loadAllPins();
            Overlay.renderPins();
            Panel.render();
            FAB.updateBadge();
          } else {
            return addPinComment(text, x, y, num)
              .then(function () {
                Popup.close();
                FAB.setMode(false);
                return loadAndRender();
              });
          }
        })
        .catch(function (e) { if (e.message !== 'cancelled') Notify.toast('Failed: ' + e.message); });
    },
    showThread: function (pinId) {
      S.activePinId = pinId;
      var pin = S.pins.find(function (p) { return p.id === pinId; });
      if (!pin) return;
      this.el.innerHTML = '';
      var isProtoOwner = Auth.isPrototypeOwner();
      var isOwnComment = !!(S.user && (
        pin.author.login === S.user.login ||
        String(pin.id).startsWith('guest-')
      ));
      var canDelete  = isProtoOwner || isOwnComment;
      var canResolve = isProtoOwner;

      // ── Level 1: conversation header with conversation-level kebab ──
      var header = el('div', { className: 'rhacs-popup__header' });
      var headerLeft = el('div', { className: 'rhacs-popup__header-left' });
      var avatar = makeAvatar(pin.author);
      var author = el('span', { className: 'rhacs-popup__author' });
      author.appendChild(txt(pin.author.login));
      var time = el('span', { className: 'rhacs-popup__time' });
      time.appendChild(txt(timeAgo(pin.createdAt)));
      append(headerLeft, avatar, author, time);

      // Conversation kebab: Delete (owner or own comment), Resolve/Unresolve (owner only), Mark as read/unread (all GitHub users)
      var pinTs   = new Date(pin.createdAt).getTime();
      var isUnread = pinTs > S.lastSeen;
      var convKebab = Popup.makeKebab([
        canDelete  ? { label: 'Delete thread', danger: true, action: function () { Popup.confirmDelete(pin.id); } } : null,
        canResolve ? { label: pin.meta.resolved ? 'Unresolve' : 'Resolve', action: function () { Popup.toggleResolve(pin); } } : null,
        isUnread
          ? { label: 'Mark as read', action: function () {
              S.lastSeen = Math.max(S.lastSeen, pinTs);
              localStorage.setItem(CFG.seenPrefix + window.location.pathname, String(S.lastSeen));
              Overlay.renderPins();
              Notify.clearUnread();
            }}
          : { label: 'Mark as unread', action: function () {
              // Set lastSeen to just before this pin so it becomes unread again
              S.lastSeen = Math.min(S.lastSeen, pinTs - 1);
              localStorage.setItem(CFG.seenPrefix + window.location.pathname, String(S.lastSeen));
              S.unread = Math.max(1, S.unread);
              FAB.updateBadge();
              Overlay.renderPins();
            }}
      ].filter(Boolean));

      var closeBtn = el('button', { className: 'rhacs-btn rhacs-btn--plain rhacs-popup__close', onclick: function () { Popup.close(); } });
      closeBtn.setAttribute('aria-label', 'Close');
      closeBtn.appendChild(txt('×'));
      append(header, headerLeft, convKebab, closeBtn);

      // ── Level 2: first post as a message row with message-level kebab ──
      var firstPost = el('div', { className: 'rhacs-reply rhacs-reply--first' });
      var fpHdr = el('div', { className: 'rhacs-reply__header' });
      var fpAv  = makeAvatar(pin.author, 'rhacs-avatar--sm');
      var fpAu  = el('span', { className: 'rhacs-popup__author' });
      fpAu.appendChild(txt(pin.author.name && pin.author.name.trim() ? pin.author.name : pin.author.login));
      var fpTm  = el('span', { className: 'rhacs-popup__time' });
      fpTm.appendChild(txt(timeAgo(pin.createdAt)));
      append(fpHdr, fpAv, fpAu, fpTm);
      if (isProtoOwner) {
        var msgKebab = Popup.makeKebab([
          { label: 'Edit', action: function () { Popup.showEdit(pin, fpBody); } }
        ]);
        fpHdr.appendChild(msgKebab);
      }
      var fpBody = el('div', { className: 'rhacs-reply__body' });
      fpBody.appendChild(txt(pinText(pin.body)));
      append(firstPost, fpHdr, fpBody);

      // Reactions
      var reactionsEl = Popup.buildReactions(pin);

      // Replies
      var repliesEl = el('div', { className: 'rhacs-replies' });
      (pin.replies || []).forEach(function (r) { repliesEl.appendChild(Popup.renderReply(r, pinId)); });

      // Reply form
      var replyForm = el('div', { className: 'rhacs-reply-form' });
      if (S.guestMode) {
        // Guests can't reply — show an inline info notice instead of a text box
        var guestReplyNotice = el('div', { className: 'rhacs-inline-notice' });
        var noticeIcon = el('span', { className: 'rhacs-inline-notice__icon' });
        noticeIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 16 16" fill="currentColor"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/></svg>';
        var noticeText = el('span');
        noticeText.appendChild(txt('Log in with GitHub to reply. '));
        var noticeLink = el('button', { className: 'rhacs-inline-notice__link' });
        noticeLink.appendChild(txt('Log in'));
        noticeLink.addEventListener('click', function () {
          Auth.showAuthDialog().then(function () { FAB.updateUser(); loadAndRender(); }).catch(function () {});
        });
        noticeText.appendChild(noticeLink);
        append(guestReplyNotice, noticeIcon, noticeText);
        replyForm.appendChild(guestReplyNotice);
      } else {
        var replyArea = el('textarea', { className: 'pf-v6-c-form-control rhacs-popup__textarea rhacs-popup__textarea--reply', placeholder: 'Reply…', rows: '2' });
        var replyError = el('div', { className: 'rhacs-popup__input-error' });
        replyError.appendChild(txt('Reply can\u2019t be empty'));
        replyArea.addEventListener('input', function () {
          if (replyArea.value.trim()) {
            replyArea.classList.remove('rhacs-popup__textarea--error');
            replyError.style.display = 'none';
          }
        });
        var replyBtn  = el('button', { className: 'rhacs-btn rhacs-btn--primary rhacs-btn--sm' });
        replyBtn.appendChild(txt('Reply'));
        replyBtn.addEventListener('click', function () {
          if (!replyArea.value.trim()) {
            replyArea.classList.add('rhacs-popup__textarea--error');
            replyError.style.display = 'block';
            replyArea.focus();
            return;
          }
          replyBtn.disabled = true;
          replyBtn.textContent = 'Replying…';
          Popup.submitReply(pinId, replyArea.value, replyArea)
            .catch(function () {})
            .finally(function () {
              replyBtn.disabled = false;
              replyBtn.textContent = 'Reply';
            });
        });
        append(replyForm, replyArea, replyError, replyBtn);
      }

      append(this.el, header, firstPost, reactionsEl, repliesEl, replyForm);
      this.el.style.display = 'block';

      // Position near pin element
      var pinEl = Overlay.overlayEl.querySelector('[data-pin-id="' + pinId + '"]');
      if (pinEl) {
        var r = pinEl.getBoundingClientRect();
        this.positionFixed(r.right + 4, r.top);
      } else {
        this.el.style.left = '50%';
        this.el.style.top  = '80px';
        this.el.style.transform = 'translateX(-50%)';
      }
    },
    buildReactions: function (pin) {
      var EMOJI = { THUMBS_UP:'👍', THUMBS_DOWN:'👎', LAUGH:'😄', HOORAY:'🎉', CONFUSED:'😕', HEART:'❤️', ROCKET:'🚀', EYES:'👀' };
      var wrap = el('div', { className: 'rhacs-reactions' });
      (pin.reactionGroups || []).forEach(function (g) {
        if (g.users.totalCount === 0 && !g.viewerHasReacted) return;
        var btn = el('button', { className: 'rhacs-reaction-btn' + (g.viewerHasReacted ? ' active' : '') });
        btn.appendChild(txt((EMOJI[g.content] || '') + ' ' + g.users.totalCount));
        btn.addEventListener('click', function () { Popup.handleReaction(pin.id, g.content, g.viewerHasReacted); });
        wrap.appendChild(btn);
      });
      // Add reaction picker
      var addBtn = el('button', { className: 'rhacs-reaction-btn rhacs-reaction-add' });
      addBtn.appendChild(txt('+ 😀'));
      addBtn.addEventListener('click', function (e) { e.stopPropagation(); Popup.showPicker(pin.id, wrap); });
      wrap.appendChild(addBtn);
      return wrap;
    },
    showPicker: function (pinId, container) {
      var existing = container.querySelector('.rhacs-reaction-picker');
      if (existing) { existing.remove(); return; }
      var CHOICES = [
        { c:'THUMBS_UP',   e:'👍' }, { c:'THUMBS_DOWN', e:'👎' },
        { c:'LAUGH',       e:'😄' }, { c:'HOORAY',      e:'🎉' },
        { c:'CONFUSED',    e:'😕' }, { c:'HEART',       e:'❤️' },
        { c:'ROCKET',      e:'🚀' }, { c:'EYES',        e:'👀' },
      ];
      var picker = el('div', { className: 'rhacs-reaction-picker' });
      CHOICES.forEach(function (item) {
        var btn = el('button', { className: 'rhacs-reaction-picker__btn' });
        btn.appendChild(txt(item.e));
        btn.addEventListener('click', function () { picker.remove(); Popup.handleReaction(pinId, item.c, false); });
        picker.appendChild(btn);
      });
      container.appendChild(picker);
      setTimeout(function () {
        document.addEventListener('click', function dismiss() {
          picker.remove();
          document.removeEventListener('click', dismiss);
        });
      }, 0);
    },
    handleReaction: function (pinId, content, hasReacted) {
      Auth.requireAuth()
        .then(function () { return toggleReaction(pinId, content, hasReacted); })
        .then(function () { return loadAndRender(); })
        .then(function () { if (S.activePinId === pinId) Popup.showThread(pinId); })
        .catch(function (e) { Notify.toast(e.message); });
    },
    toggleResolve: function (pin) {
      if (String(pin.id).startsWith('guest-')) {
        var guestPins = Auth.loadGuestPins();
        var idx = guestPins.findIndex(function (p) { return p.id === pin.id; });
        if (idx !== -1) {
          guestPins[idx].body = setMeta(guestPins[idx].body, { resolved: !pin.meta.resolved });
          if (guestPins[idx].meta) guestPins[idx].meta.resolved = !pin.meta.resolved;
          Auth.saveGuestPins(guestPins);
        }
        loadAndRender().then(function () { Popup.close(); Panel.render(); });
        return;
      }
      Auth.requireAuth()
        .then(function () { return updateComment(pin.id, setMeta(pin.body, { resolved: !pin.meta.resolved })); })
        .then(function () { return loadAndRender(); })
        .then(function () { Popup.close(); Panel.render(); })
        .catch(function (e) { Notify.toast(e.message); });
    },
    showEdit: function (pin, bodyEl) {
      var originalContent = bodyEl.innerHTML;
      bodyEl.innerHTML = '';
      var editArea = el('textarea', { className: 'pf-v6-c-form-control rhacs-popup__textarea', rows: '3' });
      editArea.value = pinText(pin.body);
      var editError = el('div', { className: 'rhacs-popup__input-error' });
      editError.appendChild(txt('Comment can\u2019t be empty'));
      editArea.addEventListener('input', function () {
        if (editArea.value.trim()) {
          editArea.classList.remove('rhacs-popup__textarea--error');
          editError.style.display = 'none';
        }
      });
      var actions = el('div', { className: 'rhacs-btn-row' });
      var saveBtn = el('button', { className: 'rhacs-btn rhacs-btn--primary rhacs-btn--sm' });
      saveBtn.appendChild(txt('Save'));
      saveBtn.addEventListener('click', function () {
        var newText = editArea.value.trim();
        if (!newText) {
          editArea.classList.add('rhacs-popup__textarea--error');
          editError.style.display = 'block';
          editArea.focus();
          return;
        }
        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving…';

        if (String(pin.id).startsWith('guest-')) {
          // Guest pin: update in localStorage
          var guestPins = Auth.loadGuestPins();
          var idx = guestPins.findIndex(function (p) { return p.id === pin.id; });
          if (idx !== -1) {
            var metaMatch2 = guestPins[idx].body.match(/<!--\s*RHACS_PIN[\s\S]*?-->/);
            var metaPart2  = metaMatch2 ? metaMatch2[0] : '';
            guestPins[idx].body = metaPart2 + '\n' + newText;
            Auth.saveGuestPins(guestPins);
          }
          loadAndRender().then(function () { Popup.showThread(pin.id); });
          return;
        }

        var metaMatch = pin.body.match(/<!--\s*RHACS_PIN[\s\S]*?-->/);
        var metaPart  = metaMatch ? metaMatch[0] : '';
        updateComment(pin.id, metaPart + '\n' + newText)
          .then(function () { return loadAndRender(); })
          .then(function () { Popup.showThread(pin.id); })
          .catch(function (e) { saveBtn.disabled = false; saveBtn.textContent = 'Save'; Notify.toast(e.message); });
      });
      var cancelBtn = el('button', { className: 'rhacs-btn rhacs-btn--secondary rhacs-btn--sm' });
      cancelBtn.appendChild(txt('Cancel'));
      cancelBtn.addEventListener('click', function () {
        bodyEl.innerHTML = originalContent;
      });
      append(actions, saveBtn, cancelBtn);
      append(bodyEl, editArea, editError, actions);
      editArea.focus();
    },
    confirmDelete: function (pinId) {
      showConfirm('Delete this comment and all its replies?', {
        title: 'Delete comment',
        confirmLabel: 'Delete',
        cancelLabel: 'Cancel',
        danger: true
      }).then(function (confirmed) {
        if (!confirmed) return;
        if (String(pinId).startsWith('guest-')) {
          Auth.deleteGuestPin(pinId);
          Popup.close();
          return loadAndRender();
        }
        deleteComment(pinId)
          .then(function () { Popup.close(); return loadAndRender(); })
          .catch(function (e) { Notify.toast(e.message); });
      });
    },
    renderReply: function (reply, pinId) {
      var wrap = el('div', { className: 'rhacs-reply', 'data-reply-id': reply.id });
      var hdr  = el('div', { className: 'rhacs-reply__header' });
      var av   = makeAvatar(reply.author, 'rhacs-avatar--sm');
      var au   = el('span', { className: 'rhacs-popup__author' });
      au.appendChild(txt(reply.author.name && reply.author.name.trim() ? reply.author.name : reply.author.login));
      var tm   = el('span', { className: 'rhacs-popup__time' });
      tm.appendChild(txt(timeAgo(reply.createdAt)));
      append(hdr, av, au, tm);

      var bd = el('div', { className: 'rhacs-reply__body' });
      bd.appendChild(txt(reply.body));

      if (S.user && reply.author.login === S.user.login) {
        hdr.appendChild(Popup.makeKebab([
          { label: 'Edit',   action: function () { Popup.showReplyEdit(reply, pinId, bd); } },
          { label: 'Delete', danger: true, action: function () {
            showConfirm('Delete this reply?', {
              title: 'Delete reply',
              confirmLabel: 'Delete',
              cancelLabel: 'Cancel',
              danger: true
            }).then(function (confirmed) {
              if (!confirmed) return;
              deleteComment(reply.id)
                .then(function () { return loadAndRender(); })
                .then(function () { Popup.showThread(pinId); })
                .catch(function (e) { Notify.toast(e.message); });
            });
          }}
        ]));
      }

      append(wrap, hdr, bd);
      return wrap;
    },
    // Build a kebab ⋮ button with a dropdown. items: [{ label, action, danger? }]
    makeKebab: function (items) {
      var wrap     = el('div', { className: 'rhacs-kebab' });
      var btn      = el('button', { className: 'rhacs-kebab__btn', 'aria-label': 'Actions' });
      btn.appendChild(txt('⋮'));
      var dropdown = el('div', { className: 'rhacs-kebab__dropdown' });
      items.forEach(function (item) {
        var i = el('button', { className: 'rhacs-kebab__item' + (item.danger ? ' rhacs-kebab__item--danger' : '') });
        i.appendChild(txt(item.label));
        i.addEventListener('click', function (e) {
          e.stopPropagation();
          dropdown.classList.remove('rhacs-kebab__dropdown--open');
          item.action();
        });
        dropdown.appendChild(i);
      });
      append(wrap, btn, dropdown);
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = dropdown.classList.contains('rhacs-kebab__dropdown--open');
        document.querySelectorAll('.rhacs-kebab__dropdown--open').forEach(function (d) {
          d.classList.remove('rhacs-kebab__dropdown--open');
        });
        if (!isOpen) dropdown.classList.add('rhacs-kebab__dropdown--open');
      });
      return wrap;
    },
    showReplyEdit: function (reply, pinId, bodyEl) {
      bodyEl.innerHTML = '';
      var editArea = el('textarea', { className: 'pf-v6-c-form-control rhacs-popup__textarea', rows: '2' });
      editArea.value = reply.body;
      var saveBtn = el('button', { className: 'rhacs-btn rhacs-btn--primary rhacs-btn--sm' });
      saveBtn.appendChild(txt('Save'));
      saveBtn.addEventListener('click', function () {
        var newText = editArea.value.trim();
        if (!newText) return;
        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving…';
        updateComment(reply.id, newText)
          .then(function () { return loadAndRender(); })
          .then(function () { Popup.showThread(pinId); })
          .catch(function (e) { saveBtn.disabled = false; saveBtn.textContent = 'Save'; Notify.toast(e.message); });
      });
      var cancelBtn = el('button', { className: 'rhacs-btn rhacs-btn--secondary rhacs-btn--sm' });
      cancelBtn.appendChild(txt('Cancel'));
      cancelBtn.addEventListener('click', function () {
        bodyEl.innerHTML = '';
        bodyEl.appendChild(txt(reply.body));
      });
      var actions = el('div', { className: 'rhacs-reply-form' });
      append(actions, saveBtn, cancelBtn);
      append(bodyEl, editArea, actions);
      editArea.focus();
    },
    submitReply: function (pinId, text, textarea) {
      text = text.trim();
      if (!text) return Promise.resolve();
      return Auth.requireAuth()
        .then(function () {
          if (S.guestMode) return; // handled by inline notice in the reply form
          return addReply(pinId, text)
            .then(function () {
              if (textarea) textarea.value = '';
              return loadAndRender();
            })
            .then(function () { Popup.showThread(pinId); });
        })
        .catch(function (e) { Notify.toast(e.message); });
    },
  };

  // ── Side Panel ────────────────────────────────────────────────────────────────
  var Panel = {
    el: null,
    activeTab: 'unread', // 'unread' | 'all' | 'unresolved' | 'resolved'
    init: function () {
      this.el = el('div', { className: 'rhacs-panel', id: 'rhacs-panel' });
      rhacsMount().appendChild(this.el);
    },
    _pageEl: function () {
      return document.querySelector('.pf-v6-c-page') ||
             document.querySelector('.pf-v5-c-page') ||
             document.querySelector('[class*="pf-"][class*="-c-page"]') ||
             document.body;
    },
    _pushPage: function (open) {
      var page = Panel._pageEl();
      if (!page) return;
      if (!page._rhacsTransitionSet) {
        var cur = window.getComputedStyle(page).transition;
        page.style.transition = (cur && cur !== 'all 0s ease 0s' ? cur + ', ' : '') +
          'margin-right 0.26s cubic-bezier(0.16,1,0.3,1)';
        page._rhacsTransitionSet = true;
      }
      page.style.marginRight = open ? '300px' : '';
    },
    open: function () {
      this.render(); // render BEFORE updating lastSeen so unread yellows show
      this.el.classList.add('rhacs-panel--open');
      rhacsMount().classList.add('rhacs-panel-open');
      Panel._pushPage(true);
    },
    close: function () {
      // Mark everything as seen when the user closes the panel
      S.lastSeen = Date.now();
      localStorage.setItem(CFG.seenPrefix + window.location.pathname, String(S.lastSeen));
      this.el.classList.remove('rhacs-panel--open');
      rhacsMount().classList.remove('rhacs-panel-open');
      Panel._pushPage(false);
      Notify.clearUnread();
    },
    toggle: function () {
      if (this.el.classList.contains('rhacs-panel--open')) this.close(); else this.open();
    },
    renderEmpty: function (tab) {
      var msgs = {
        unread:     { title: 'All caught up',          hint: 'No new comments since your last visit.' },
        all:        { title: 'No comments yet',        hint: 'Click anywhere on the page to pin a comment.' },
        unresolved: { title: 'No open comments',       hint: 'All comments have been resolved.' },
        resolved:   { title: 'No resolved comments',   hint: 'Resolved comments will appear here.' },
      };
      var m = msgs[tab] || msgs.all;
      var empty = el('div', { className: 'rhacs-panel__empty' });
      var emptyIcon = el('div', { className: 'rhacs-panel__empty-icon' });
      emptyIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 16 16" fill="currentColor"><path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105"/></svg>';
      var emptyTitle = el('div', { className: 'rhacs-panel__empty-title' });
      emptyTitle.appendChild(txt(m.title));
      var emptyHint = el('div', { className: 'rhacs-panel__empty-hint' });
      emptyHint.appendChild(txt(m.hint));
      append(empty, emptyIcon, emptyTitle, emptyHint);
      return empty;
    },
    render: function () {
      this.el.innerHTML = '';

      // ── Guest notice banner (top) ────────────────────────────────────────────
      if (S.guestMode) {
        var guestBanner = el('div', { className: 'rhacs-panel__guest-banner' });
        guestBanner.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 16 16" fill="currentColor" style="flex-shrink:0;margin-top:1px"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.029 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/></svg>' +
          '<span>You\u2019re commenting as a guest \u2014 no login needed. <button class="rhacs-panel__guest-login-link">Log in with GitHub</button> to get notifications when someone replies.</span>';
        guestBanner.querySelector('.rhacs-panel__guest-login-link').addEventListener('click', function () {
          Auth.login().then(function () { try { FAB.updateUser(); } catch(e){} loadAndRender(); Panel.open(); }).catch(function () {});
        });
        this.el.appendChild(guestBanner);
      }

      // ── Header ──────────────────────────────────────────────────────────────
      var hdr = el('div', { className: 'rhacs-panel__header' });
      var title = el('span', { className: 'rhacs-panel__title' });
      title.appendChild(txt('Comments'));
      var closeBtn = el('button', { className: 'pf-v6-c-button pf-m-plain rhacs-panel__close' });
      closeBtn.setAttribute('aria-label', 'Close');
      closeBtn.appendChild(txt('\u00d7'));
      closeBtn.addEventListener('click', function () { Panel.close(); });
      append(hdr, title, closeBtn);
      this.el.appendChild(hdr);

      // ── PF6 Tabs ─────────────────────────────────────────────────────────────
      var allPins        = S.pins.filter(function (p) { return p.meta; });
      var unreadPins     = allPins.filter(function (p) { return !p.meta.resolved && new Date(p.createdAt).getTime() > S.lastSeen; });
      var unresolvedPins = allPins.filter(function (p) { return !p.meta.resolved; });
      var resolvedPins   = allPins.filter(function (p) { return p.meta.resolved; });

      var ownerTabs = [
        { id: 'unread',     label: 'Unread',     count: unreadPins.length },
        { id: 'all',        label: 'All',         count: allPins.length },
        { id: 'unresolved', label: 'Unresolved',  count: unresolvedPins.length },
        { id: 'resolved',   label: 'Resolved',    count: resolvedPins.length },
      ];
      var nonOwnerTabs = [
        { id: 'unread', label: 'Unread', count: unreadPins.length },
        { id: 'all',    label: 'All',    count: allPins.length },
      ];
      var tabs = Auth.isPrototypeOwner() ? ownerTabs : nonOwnerTabs;
      // Guard: if activeTab is a restricted tab for this role, fall back to 'all'
      var allowedTabIds = tabs.map(function (t) { return t.id; });
      if (allowedTabIds.indexOf(Panel.activeTab) === -1) Panel.activeTab = 'all';

      var tabList = el('div', { className: 'rhacs-panel__tabs', role: 'tablist' });
      tabs.forEach(function (tab) {
        var btn = el('button', { className: 'rhacs-panel__tab' + (Panel.activeTab === tab.id ? ' rhacs-panel__tab--active' : ''), role: 'tab' });
        btn.appendChild(txt(tab.label));
        if (tab.count > 0) {
          var badge = el('span', { className: 'rhacs-panel__tab-badge' });
          badge.appendChild(txt(String(tab.count)));
          btn.appendChild(badge);
        }
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          Panel.activeTab = tab.id;
          Panel.render();
        });
        tabList.appendChild(btn);
      });
      this.el.appendChild(tabList);

      // ── Visible pins for active tab ───────────────────────────────────────
      var visible = Panel.activeTab === 'unread'     ? unreadPins
                  : Panel.activeTab === 'all'        ? allPins
                  : Panel.activeTab === 'unresolved' ? unresolvedPins
                  : resolvedPins;

      if (visible.length === 0) {
        this.el.appendChild(this.renderEmpty(Panel.activeTab));
        return;
      }

      var list = el('div', { className: 'rhacs-panel__list' });
      visible.forEach(function (pin) {
        var isUnread = new Date(pin.createdAt).getTime() > S.lastSeen;
        var cls = 'rhacs-panel__item' +
          (isUnread   ? ' rhacs-panel__item--unread'   : '') +
          (pin.meta.resolved ? ' rhacs-panel__item--resolved' : '');
        var item = el('div', { className: cls });

        var itemHdr = el('div', { className: 'rhacs-panel__item-header' });
        var av  = makeAvatar(pin.author, 'rhacs-avatar--sm');
        var num = el('span', { className: 'pf-v5-c-badge pf-m-unread rhacs-panel__item-num' }); num.appendChild(txt(String(pin.meta.pinNumber)));
        var au  = el('span', { className: 'rhacs-panel__item-author' }); au.appendChild(txt(pin.author.name && pin.author.name.trim() ? pin.author.name : pin.author.login));
        var tm  = el('span', { className: 'rhacs-panel__item-time' }); tm.appendChild(txt(timeAgo(pin.createdAt)));
        append(itemHdr, av, num, au, tm);
        // Show a state badge if the pin has a viewState recorded
        if (pin.meta.viewState) {
          var stateBadge = el('span', { className: 'rhacs-panel__state-badge rhacs-panel__state-badge--' + pin.meta.viewState });
          stateBadge.appendChild(txt(pin.meta.viewState === 'edit' ? 'Edit mode' : 'Read-only view'));
          itemHdr.appendChild(stateBadge);
        }
        if (isUnread) {
          var dot = el('span', { className: 'rhacs-unread-dot' });
          itemHdr.appendChild(dot);
        }

        var preview = el('div', { className: 'rhacs-panel__item-preview' });
        var ptext = pinText(pin.body);
        preview.appendChild(txt(ptext.length > 80 ? ptext.slice(0, 80) + '…' : ptext));

        append(item, itemHdr, preview);

        if (pin.replies && pin.replies.length > 0) {
          var replyCount = el('button', { className: 'rhacs-panel__item-replies' });
          replyCount.appendChild(txt(pin.replies.length + ' ' + (pin.replies.length === 1 ? 'reply' : 'replies')));
          replyCount.addEventListener('click', (function (p) { return function (e) {
            e.stopPropagation();
            Popup.showThread(p.id);
          }; })(pin));
          item.appendChild(replyCount);
        }

        item.addEventListener('click', (function (p) { return function () {
          var pinState = p.meta.viewState;
          var curState = detectViewState();
          var delay    = 400;

          // If the pin was created in a different state, try to switch to it first
          if (pinState && pinState !== curState) {
            var switched = false;
            if (pinState === 'edit') {
              // Look for an Edit button in the page (not in our UI)
              var editBtns = Array.prototype.slice.call(
                document.querySelectorAll('button, a[role="button"]')
              ).filter(function (b) {
                if (b.closest('#rhacs-mount')) return false;
                var txt = (b.textContent || b.getAttribute('aria-label') || '').trim().toLowerCase();
                return txt === 'edit' || txt === 'edit configuration';
              });
              if (editBtns.length) { editBtns[0].click(); switched = true; }
            } else {
              // Look for a Cancel button to return to view mode
              var cancelBtns = Array.prototype.slice.call(
                document.querySelectorAll('button')
              ).filter(function (b) {
                if (b.closest('#rhacs-mount')) return false;
                var txt = (b.textContent || '').trim().toLowerCase();
                return txt === 'cancel';
              });
              if (cancelBtns.length) { cancelBtns[0].click(); switched = true; }
            }
            if (switched) delay = 600; // give the DOM time to transition
          }

          var ci = containerInfo();
          var scrollY = (p.meta.y / 100) * ci.scrollHeight;
          if (S.scrollContainer) {
            S.scrollContainer.scrollTo({ top: scrollY - 120, behavior: 'smooth' });
          } else {
            window.scrollTo({ top: scrollY - 120, behavior: 'smooth' });
          }
          setTimeout(function () { Popup.showThread(p.id); }, delay);
        }; })(pin));

        list.appendChild(item);
      });
      this.el.appendChild(list);
    },
  };

  // ── FAB ───────────────────────────────────────────────────────────────────────
  var FAB = {
    el: null,
    badge: null,
    userEl: null,
    init: function () {
      this.el = el('div', { className: 'rhacs-fab' });

      this.badge = el('span', { className: 'rhacs-fab__badge' });
      this.badge.style.display = 'none';
      this.badge.appendChild(txt('0'));

      var icon = el('span', { className: 'rhacs-fab__icon' });
      var ICON_ADD  = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105"/></svg>';
      var ICON_EXIT = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/><path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/></svg>';
      icon.innerHTML = ICON_ADD;
      FAB._iconEl = icon; FAB._iconAdd = ICON_ADD; FAB._iconExit = ICON_EXIT;
      var label = el('span', { className: 'rhacs-fab__label' });
      label.appendChild(txt('Add comment'));

      var mainBtn = el('button', { className: 'rhacs-fab__btn', title: 'Toggle comment mode (C)' });
      append(mainBtn, icon, label);
      mainBtn.addEventListener('click', function () { FAB.toggleMode(); });

      // Badge lives on the "View all" button so it doesn't conflict with the main button label
      var panelBtn = el('button', { className: 'rhacs-fab__panel-btn', title: 'View all comments', style: 'position:relative' });
      panelBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="currentColor" style="flex-shrink:0"><path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/></svg><span style="font-size:12px;font-weight:500">View all</span>';
      panelBtn.style.cssText = 'position:relative;display:flex;align-items:center;gap:5px;width:auto;padding:0 10px;border-radius:16px;';
      panelBtn.appendChild(this.badge);
      panelBtn.addEventListener('click', function () { Panel.toggle(); });
      this.panelBtn = panelBtn;

      this.userEl = el('div', { className: 'rhacs-fab__user' });

      append(this.el, mainBtn, panelBtn, this.userEl);
      rhacsMount().appendChild(this.el);
      this.updateUser();

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && S.commentMode) {
          FAB.setMode(false);
          return;
        }
        if (e.key !== 'c' && e.key !== 'C') return;
        var tag = document.activeElement && document.activeElement.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || (document.activeElement && document.activeElement.isContentEditable)) return;
        FAB.toggleMode();
      });
    },
    toggleMode: function () {
      // If currently in comment mode, just exit — no auth needed to turn off
      if (S.commentMode) { FAB.setMode(false); return; }
      // Not yet authed — show login/guest dialog first, then activate
      if (!Auth.isAuthed()) {
        Auth.showAuthDialog().then(function () {
          FAB.setMode(true);
        }).catch(function () {}); // user cancelled
        return;
      }
      FAB.setMode(true);
    },
    setMode: function (active) {
      S.commentMode = active;
      if (active) this.el.classList.add('rhacs-fab--active');
      else         this.el.classList.remove('rhacs-fab--active');
      var labelEl = this.el.querySelector('.rhacs-fab__label');
      if (labelEl) labelEl.textContent = active ? 'Exit comment mode' : 'Add comment';
      if (this._iconEl) this._iconEl.innerHTML = active ? this._iconExit : this._iconAdd;
      Overlay.setMode(active);
    },
    updateBadge: function () {
      // Only count unread pins from OTHER users — not your own comments.
      var myLogin = S.user && S.user.login;
      var count = S.pins.filter(function (p) {
        if (!p.meta || p.meta.resolved) return false;
        if (!(new Date(p.createdAt).getTime() > S.lastSeen)) return false;
        // Exclude the current user's own pins
        if (myLogin && p.author && p.author.login === myLogin) return false;
        return true;
      }).length;
      S.unread = count;
      if (count > 0) {
        this.badge.textContent = count;
        this.badge.style.display = '';
        document.title = '(' + count + ') ' + S.origTitle;
      } else {
        this.badge.style.display = 'none';
        document.title = S.origTitle;
      }
    },
    updateUser: function () {
      if (!this.userEl) return;
      // FAB is always visible — visitors can add guest comments, owner manages everything.
      this.el.style.display = '';

      // "View all" panel button: only for GitHub-authenticated users, not guests
      if (this.panelBtn) {
        this.panelBtn.style.display = S.token ? '' : 'none';
      }
      this.userEl.innerHTML = '';
      if (S.guestMode && S.user) {
        // Guest: show their name + exit option
        var guestBadge = el('span', { className: 'rhacs-guest-badge', title: S.user.login });
        guestBadge.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.029 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/></svg> Guest';
        var exitGuestBtn = el('button', { className: 'rhacs-btn rhacs-btn--light rhacs-btn--sm rhacs-guest-exit', title: 'Exit guest mode' });
        exitGuestBtn.appendChild(txt('Exit'));
        exitGuestBtn.addEventListener('click', function () { Auth.exitGuest(); loadAndRender(); });
        append(this.userEl, guestBadge, exitGuestBtn);
      } else if (S.token && S.user) {
        // GitHub-authenticated user: show avatar + logout
        var av = makeAvatar(S.user, 'rhacs-avatar--sm');
        av.title = 'Logged in as ' + S.user.login;
        var logoutBtn = el('button', { className: 'rhacs-btn rhacs-btn--light rhacs-btn--sm', title: 'Log out', onclick: function () { Auth.logout(); } });
        logoutBtn.setAttribute('aria-label', 'Log out');
        logoutBtn.appendChild(txt('Log out'));
        append(this.userEl, av, logoutBtn);
      }
      // Not authenticated: no user area content shown — clicking "Add comment" triggers the dialog
    },
  };

  // ── Notifications ─────────────────────────────────────────────────────────────
  var Notify = {
    init: function () { /* toast removed */ },
    toast: function () { /* toasts disabled */ },
    startPolling: function () {
      var poll = function () {
        if (document.visibilityState !== 'visible') return;
        if (!S.discussionId) return;
        loadComments(S.discussionId).then(function (comments) {
          var freshPins = parseComments(comments);
          var newOnes = freshPins.filter(function (fp) {
            return fp.meta && new Date(fp.createdAt).getTime() > S.lastSeen &&
              !S.pins.some(function (ep) { return ep.id === fp.id; });
          });
          if (newOnes.length > 0) {
            S.pins = freshPins;
            Overlay.renderPins();
            Panel.render();
            Notify.showUnread(newOnes.length);
          }
        }).catch(function () {});
      };
      S.pollTimer = setInterval(poll, CFG.pollMs);
      document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible') poll();
      });
    },
    showUnread: function () {
      FAB.updateBadge();
    },
    clearUnread: function () {
      S.lastSeen = Date.now();
      localStorage.setItem(CFG.seenPrefix + window.location.pathname, String(S.lastSeen));
      FAB.updateBadge();
      Overlay.renderPins();
    },
  };

  // ── Init ──────────────────────────────────────────────────────────────────────
  function loadFloatingUI(cb) {
    if (window.FloatingUIDOM) { cb(); return; }
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@floating-ui/dom@1/dist/floating-ui.dom.umd.min.js';
    s.onload = cb;
    document.head.appendChild(s);
  }

  // Single mount point for every comment UI element.
  var _rhacsMount = null;
  function rhacsMount() {
    if (!_rhacsMount) {
      _rhacsMount = document.createElement('div');
      _rhacsMount.id = 'rhacs-mount';
      document.body.appendChild(_rhacsMount);
    }
    return _rhacsMount;
  }

  // Returns true only when the current URL is a versioned prototype page (not baseline).
  function isPrototypePage() {
    var v = new URLSearchParams(window.location.search).get('prototype');
    return v !== null && v !== 'baseline';
  }

  // Toggle the single mount wrapper — hides everything at once.
  function syncVisibility() {
    var active = isPrototypePage();
    var mount = rhacsMount();
    mount.style.display = active ? '' : 'none';
    // Close the panel and popup on every route/tab navigation
    Panel.close();
    Popup.close();
    if (!active) {
      FAB.setMode(false);
      if (Popup.el) Popup.el.style.display = 'none';
      if (Panel.el) Panel.el.classList.remove('rhacs-panel--open');
      rhacsMount().classList.remove('rhacs-panel-open');
      Panel._pushPage(false);
    }
  }

  function init() {
    loadFloatingUI(function () {}); // load eagerly so it's ready before first click
    // Dev convenience: ?rhacs_token=xxx auto-injects token and removes param from URL
    var devToken = new URLSearchParams(window.location.search).get('rhacs_token');
    if (devToken) {
      localStorage.setItem(CFG.tokenKey, devToken);
      var clean = window.location.pathname + window.location.search.replace(/[?&]rhacs_token=[^&]*/g, '').replace(/^&/, '?') + window.location.hash;
      history.replaceState({}, '', clean || window.location.pathname);
    }

    Auth.init();
    S.lastSeen = parseInt(localStorage.getItem(CFG.seenPrefix + window.location.pathname) || '0', 10);

    Overlay.init();
    Popup.init();
    Panel.init();
    FAB.init();
    Notify.init();

    // Hide immediately if starting on baseline; show only on prototype pages.
    syncVisibility();

    // Auto-activate comment mode when returning from GitHub OAuth redirect
    if (devToken && isPrototypePage()) {
      setTimeout(function () { FAB.setMode(true); }, 300);
    }

    // React Router changes URLs via history.pushState / replaceState — intercept both.
    (function patchHistory(type) {
      var orig = history[type];
      history[type] = function () {
        var ret = orig.apply(this, arguments);
        setTimeout(syncVisibility, 0);
        return ret;
      };
    })('pushState');
    (function patchHistory(type) {
      var orig = history[type];
      history[type] = function () {
        var ret = orig.apply(this, arguments);
        setTimeout(syncVisibility, 0);
        return ret;
      };
    })('replaceState');
    window.addEventListener('popstate', function () { setTimeout(syncVisibility, 0); });

    // ── Click-outside dismissal ──────────────────────────────────────────────
    // Dismiss popup / panel when clicking outside, but ONLY if the user is not
    // actively typing in a textarea or input inside that element.
    document.addEventListener('click', function (e) {
      // Kebab menus: close any open dropdown when clicking outside it
      if (!e.target.closest('.rhacs-kebab')) {
        document.querySelectorAll('.rhacs-kebab__dropdown--open').forEach(function (d) {
          d.classList.remove('rhacs-kebab__dropdown--open');
        });
      }
      // Popup: close on outside click; shake instead if there's unsaved input
      if (Popup.el && Popup.el.style.display !== 'none') {
        if (!Popup.el.contains(e.target)) {
          var hasUnsavedInput = Array.from(Popup.el.querySelectorAll('textarea')).some(function (ta) {
            return ta.value.trim().length > 0;
          });
          if (hasUnsavedInput) {
            // Shake to signal "you have unsaved text"
            Popup.el.classList.remove('rhacs-popup--shake');
            void Popup.el.offsetWidth; // force reflow so the animation restarts
            Popup.el.classList.add('rhacs-popup--shake');
            Popup.el.addEventListener('animationend', function removeShake() {
              Popup.el.classList.remove('rhacs-popup--shake');
              Popup.el.removeEventListener('animationend', removeShake);
            });
          } else {
            Popup.close();
          }
        }
      }
      // Panel: close on outside click, but not when clicking the FAB or an open popup
      if (Panel.el && Panel.el.classList.contains('rhacs-panel--open')) {
        var outsidePanel  = !Panel.el.contains(e.target);
        var notFab        = !e.target.closest('.rhacs-fab');
        var notPopup      = !(Popup.el && Popup.el.contains(e.target));
        var notCommentRoot = !e.target.closest('#rhacs-comment-root');
        if (outsidePanel && notFab && notPopup && notCommentRoot) {
          Panel.close();
        }
      }
    });

    // If token exists but user profile is missing, fetch it now (e.g. after page reload)
    var userPromise = (S.token && !S.user)
      ? Auth.fetchUser()
          .then(function () { FAB.updateUser(); })
          .catch(function (e) {
            console.warn('[rhacs] fetchUser on init failed:', e && e.message);
            FAB.updateUser(); // still update so the UI reflects logged-out state
          })
      : Promise.resolve();

    userPromise.then(function () {
      return loadAndRender();
    }).then(function () {
      Notify.startPolling();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // Give React a moment to hydrate before we measure scrollHeight
    setTimeout(init, 600);
  }
})();
