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

  var PAGE_KEY  = 'page:' + window.location.pathname;
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

  function buildBody(x, y, num, text) {
    return '<!-- RHACS_PIN ' + JSON.stringify({ x: x, y: y, resolved: false, pinNumber: num }) + ' -->\n' + text;
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
      var match = d.repository.discussions.nodes.find(function (n) { return n.title === PAGE_KEY; });
      return match ? match.id : null;
    }).catch(function () { return null; });
  }

  function createDiscussion() {
    return getRepoMeta().then(function () {
      if (!S.repoId || !S.categoryId) throw new Error('Could not load repo metadata');
      return ghReq(
        'mutation($r:ID!,$c:ID!,$t:String!,$b:String!){ createDiscussion(input:{repositoryId:$r,categoryId:$c,title:$t,body:$b}){ discussion{ id } } }',
        { r: S.repoId, c: S.categoryId, t: PAGE_KEY, b: 'Auto-created for ' + window.location.href },
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
        S.guestMode = true;
        S.user = Auth.guestIdentity();
      }
    },
    isLoggedIn: function () { return !!S.token; },
    isAuthed:   function () { return !!S.token || S.guestMode; },

    // ── GitHub OAuth ──────────────────────────────────────────────────────────
    login: function () {
      return new Promise(function (resolve, reject) {
        var url = 'https://github.com/login/oauth/authorize?client_id=' + CFG.clientId +
          '&redirect_uri=' + encodeURIComponent(CFG.callbackUrl) + '&scope=public_repo';
        var popup = window.open(url, 'gh-oauth', 'width=620,height=720,left=200,top=80');
        if (!popup) { reject(new Error('Popup blocked — please allow popups for this site')); return; }
        var handler = function (e) {
          if (e.origin !== 'https://zhenpesky.github.io') return;
          if (!e.data || e.data.type !== 'rhacs_auth_done') return;
          window.removeEventListener('message', handler);
          if (e.data.token) {
            S.token = e.data.token;
            S.guestMode = false;
            localStorage.setItem(CFG.tokenKey, S.token);
            localStorage.removeItem(CFG.guestKey);
            Auth.fetchUser().then(function () { FAB.updateUser(); resolve(S.user); });
          } else {
            reject(new Error('GitHub login failed'));
          }
        };
        window.addEventListener('message', handler);
        setTimeout(function () {
          window.removeEventListener('message', handler);
          if (!S.token) reject(new Error('Login timed out'));
        }, 300000);
      });
    },
    fetchUser: function () {
      if (!S.token) return Promise.resolve();
      return fetch('https://api.github.com/user', { headers: { Authorization: 'token ' + S.token } })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (u) {
          if (!u) return;
          S.user = { login: u.login, avatarUrl: u.avatar_url, name: u.name };
          localStorage.setItem(CFG.userKey, JSON.stringify(S.user));
        }).catch(function () {});
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
    guestIdentity: function () {
      var id = localStorage.getItem(CFG.guestKey);
      if (!id) {
        id = 'Guest-' + Math.random().toString(36).slice(2, 7).toUpperCase();
        localStorage.setItem(CFG.guestKey, id);
      }
      return { login: id, avatarUrl: '', name: 'Guest' };
    },
    loginAsGuest: function () {
      S.guestMode = true;
      S.user = Auth.guestIdentity();
      FAB.updateUser();
      Notify.toast('Commenting as guest — comments are saved locally only.');
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
      return CFG.guestPinsPrefix + window.location.pathname;
    },
    loadGuestPins: function () {
      try { return JSON.parse(localStorage.getItem(Auth.guestPinsKey()) || '[]'); } catch (e) { return []; }
    },
    saveGuestPins: function (pins) {
      localStorage.setItem(Auth.guestPinsKey(), JSON.stringify(pins));
    },
    addGuestPin: function (text, x, y, num) {
      var pins = Auth.loadGuestPins();
      var pin = {
        id: 'guest-' + Date.now(),
        body: buildBody(x, y, num, text),
        createdAt: new Date().toISOString(),
        author: S.user,
        replies: [],
        meta: Object.assign(parseMeta(buildBody(x, y, num, text)), { pinNumber: num, resolved: false }),
        _guest: true,
      };
      pins.push(pin);
      Auth.saveGuestPins(pins);
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
          overlay.remove();
          Auth.login().then(function () { FAB.updateUser(); resolve(); }).catch(function (e) { Notify.toast(e.message); reject(e); });
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
        guestBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="flex-shrink:0"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.029 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/></svg><span>Continue as guest</span><span class="rhacs-auth-dialog__badge rhacs-auth-dialog__badge--local">Local only</span>';
        guestBtn.addEventListener('click', function () {
          overlay.remove();
          Auth.loginAsGuest();
          resolve();
        });

        // Feature list for guest
        var guestFeatures = el('ul', { className: 'rhacs-auth-dialog__features rhacs-auth-dialog__features--muted' });
        ['Stored in this browser only', 'No notifications', 'Not visible to others'].forEach(function (f) {
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
        return Object.assign({}, c, { meta: parseMeta(c.body), replies: c.replies ? c.replies.nodes : [] });
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
          S.pins = parseComments(comments);
          // Merge in any guest pins on top of GitHub pins
          var guestPins = Auth.loadGuestPins().map(function (p) {
            if (!p.meta) p.meta = parseMeta(p.body);
            return p;
          });
          if (guestPins.length) {
            S.pins = S.pins.concat(guestPins).sort(function (a, b) {
              return new Date(a.createdAt) - new Date(b.createdAt);
            });
          }
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
      S.pins.forEach(function (pin) {
        if (!pin.meta) return;
        var vp = pinToViewport(pin.meta);
        var isUnread   = new Date(pin.createdAt).getTime() > S.lastSeen;
        var isResolved = pin.meta.resolved;
        var cls = 'rhacs-pin' +
          (isResolved ? ' rhacs-pin--resolved' : '') +
          (isUnread   ? ' rhacs-pin--unread'   : '');
        var pinEl = el('div', { className: cls, 'data-pin-id': pin.id });
        pinEl.appendChild(txt(String(pin.meta.pinNumber)));
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
      var commentCursor = [
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 16 16'%3E%3Crect width='16' height='16' rx='8' fill='%230052cc'/%3E%3Cpath fill='%23fff' d='M3.678 10.894a.75.75 0 0 1 .215.601 8.3 8.3 0 0 1-.298 1.5c1.046-.242 1.685-.523 1.976-.67a.75.75 0 0 1 .532-.055A6 6 0 0 0 8 12.5c3 0 5.25-2.105 5.25-4.5S11 3.5 8 3.5 2.75 5.605 2.75 8c0 1.101.463 2.122 1.258 2.92'/%3E%3C/svg%3E\") 14 14",
        "crosshair"
      ].join(", ");
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
      var vw = window.innerWidth, vh = window.innerHeight;
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
      var margin = 12;
      var vh = window.innerHeight;
      var vw = window.innerWidth;

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

      var actions = el('div', { className: 'rhacs-popup__actions' });
      var postBtn = el('button', { className: 'pf-v6-c-button pf-m-primary' });
      postBtn.appendChild(txt('Post'));
      postBtn.addEventListener('click', function () {
        postBtn.disabled = true;
        postBtn.textContent = 'Posting…';
        Popup.submitNew(textarea.value, x, y);
      });

      var cancelBtn = el('button', { className: 'pf-v6-c-button pf-m-secondary' });
      cancelBtn.appendChild(txt('Cancel'));
      cancelBtn.addEventListener('click', function () { Popup.close(); });

      append(actions, postBtn, cancelBtn);
      append(this.el, header, textarea, actions);
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
      var isOwner = S.user && pin.author.login === S.user.login;

      // ── Level 1: conversation header with conversation-level kebab ──
      var header = el('div', { className: 'rhacs-popup__header' });
      var headerLeft = el('div', { className: 'rhacs-popup__header-left' });
      var avatar = el('img', { className: 'pf-v6-c-avatar rhacs-avatar', src: pin.author.avatarUrl, alt: pin.author.login });
      var author = el('span', { className: 'rhacs-popup__author' });
      author.appendChild(txt(pin.author.login));
      var time = el('span', { className: 'rhacs-popup__time' });
      time.appendChild(txt(timeAgo(pin.createdAt)));
      append(headerLeft, avatar, author, time);

      // Conversation kebab: Delete (owner), Resolve/Unresolve, Mark as read
      var convKebab = Popup.makeKebab([
        isOwner ? { label: 'Delete thread', danger: true, action: function () { Popup.confirmDelete(pin.id); } } : null,
        { label: pin.meta.resolved ? 'Unresolve' : 'Resolve', action: function () { Popup.toggleResolve(pin); } },
        { label: 'Mark as read', action: function () {
          S.lastSeen = Math.max(S.lastSeen, new Date(pin.createdAt).getTime());
          localStorage.setItem(CFG.seenPrefix + window.location.pathname, String(S.lastSeen));
          Overlay.renderPins();
          Notify.clearUnread();
        }}
      ].filter(Boolean));

      var closeBtn = el('button', { className: 'rhacs-btn rhacs-btn--plain rhacs-popup__close', onclick: function () { Popup.close(); } });
      closeBtn.setAttribute('aria-label', 'Close');
      closeBtn.appendChild(txt('×'));
      append(header, headerLeft, convKebab, closeBtn);

      // ── Level 2: first post as a message row with message-level kebab ──
      var firstPost = el('div', { className: 'rhacs-reply rhacs-reply--first' });
      var fpHdr = el('div', { className: 'rhacs-reply__header' });
      var fpAv  = el('img', { className: 'pf-v6-c-avatar rhacs-avatar rhacs-avatar--sm', src: pin.author.avatarUrl, alt: pin.author.login });
      var fpAu  = el('span', { className: 'rhacs-popup__author' });
      fpAu.appendChild(txt(pin.author.login));
      var fpTm  = el('span', { className: 'rhacs-popup__time' });
      fpTm.appendChild(txt(timeAgo(pin.createdAt)));
      append(fpHdr, fpAv, fpAu, fpTm);
      if (isOwner) {
        var msgKebab = Popup.makeKebab([
          { label: 'Edit', action: function () { Popup.showEdit(pin, fpBody); } },
          { label: 'Delete', danger: true, action: function () { Popup.confirmDelete(pin.id); } }
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
      var replyArea = el('textarea', { className: 'pf-v6-c-form-control rhacs-popup__textarea rhacs-popup__textarea--reply', placeholder: 'Reply…', rows: '2' });
      var replyBtn  = el('button', { className: 'rhacs-btn rhacs-btn--primary' });
      replyBtn.appendChild(txt('Reply'));
      replyBtn.addEventListener('click', function () {
        replyBtn.disabled = true;
        replyBtn.textContent = 'Replying…';
        Popup.submitReply(pinId, replyArea.value, replyArea);
      });
      var replyForm = el('div', { className: 'rhacs-reply-form' });
      append(replyForm, replyArea, replyBtn);

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
      Auth.requireLogin()
        .then(function () { return toggleReaction(pinId, content, hasReacted); })
        .then(function () { return loadAndRender(); })
        .then(function () { if (S.activePinId === pinId) Popup.showThread(pinId); })
        .catch(function (e) { Notify.toast(e.message); });
    },
    toggleResolve: function (pin) {
      Auth.requireLogin()
        .then(function () { return updateComment(pin.id, setMeta(pin.body, { resolved: !pin.meta.resolved })); })
        .then(function () { return loadAndRender(); })
        .then(function () { Popup.close(); Panel.render(); })
        .catch(function (e) { Notify.toast(e.message); });
    },
    showEdit: function (pin, bodyEl) {
      bodyEl.innerHTML = '';
      var editArea = el('textarea', { className: 'pf-v6-c-form-control rhacs-popup__textarea', rows: '3' });
      editArea.value = pinText(pin.body);
      var saveBtn = el('button', { className: 'pf-v6-c-button pf-m-primary' });
      saveBtn.appendChild(txt('Save'));
      saveBtn.addEventListener('click', function () {
        var newText = editArea.value.trim();
        if (!newText) return;
        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving…';
        var metaMatch = pin.body.match(/<!--\s*RHACS_PIN[\s\S]*?-->/);
        var metaPart  = metaMatch ? metaMatch[0] : '';
        updateComment(pin.id, metaPart + '\n' + newText)
          .then(function () { return loadAndRender(); })
          .then(function () { Popup.showThread(pin.id); })
          .catch(function (e) { saveBtn.disabled = false; saveBtn.textContent = 'Save'; Notify.toast(e.message); });
      });
      append(bodyEl, editArea, saveBtn);
    },
    confirmDelete: function (pinId) {
      if (!confirm('Delete this comment and all its replies?')) return;
      if (String(pinId).startsWith('guest-')) {
        Auth.deleteGuestPin(pinId);
        Popup.close();
        return loadAndRender();
      }
      deleteComment(pinId)
        .then(function () { Popup.close(); return loadAndRender(); })
        .catch(function (e) { Notify.toast(e.message); });
    },
    renderReply: function (reply, pinId) {
      var wrap = el('div', { className: 'rhacs-reply', 'data-reply-id': reply.id });
      var hdr  = el('div', { className: 'rhacs-reply__header' });
      var av   = el('img', { className: 'pf-v6-c-avatar rhacs-avatar rhacs-avatar--sm', src: reply.author.avatarUrl, alt: reply.author.login });
      var au   = el('span', { className: 'rhacs-popup__author' });
      au.appendChild(txt(reply.author.login));
      var tm   = el('span', { className: 'rhacs-popup__time' });
      tm.appendChild(txt(timeAgo(reply.createdAt)));
      append(hdr, av, au, tm);

      var bd = el('div', { className: 'rhacs-reply__body' });
      bd.appendChild(txt(reply.body));

      if (S.user && reply.author.login === S.user.login) {
        hdr.appendChild(Popup.makeKebab([
          { label: 'Edit',   action: function () { Popup.showReplyEdit(reply, pinId, bd); } },
          { label: 'Delete', danger: true, action: function () {
            if (!confirm('Delete this reply?')) return;
            deleteComment(reply.id)
              .then(function () { return loadAndRender(); })
              .then(function () { Popup.showThread(pinId); })
              .catch(function (e) { Notify.toast(e.message); });
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
      if (!text) return;
      Auth.requireLogin()
        .then(function () { return addReply(pinId, text); })
        .then(function () {
          if (textarea) textarea.value = '';
          return loadAndRender();
        })
        .then(function () { Popup.showThread(pinId); })
        .catch(function (e) { Notify.toast(e.message); });
    },
  };

  // ── Side Panel ────────────────────────────────────────────────────────────────
  var Panel = {
    el: null,
    activeTab: 'all', // 'all' | 'unresolved' | 'resolved'
    init: function () {
      this.el = el('div', { className: 'rhacs-panel', id: 'rhacs-panel' });
      rhacsMount().appendChild(this.el);
    },
    open: function () {
      S.lastSeen = Date.now();
      localStorage.setItem(CFG.seenPrefix + window.location.pathname, String(S.lastSeen));
      this.render();
      this.el.classList.add('rhacs-panel--open');
      Notify.clearUnread();
    },
    close: function () { this.el.classList.remove('rhacs-panel--open'); },
    toggle: function () {
      if (this.el.classList.contains('rhacs-panel--open')) this.close(); else this.open();
    },
    renderEmpty: function (tab) {
      var msgs = {
        all:        { title: 'No comments yet',       hint: 'Click anywhere on the page to pin a comment.' },
        unresolved: { title: 'No open comments',      hint: 'All comments have been resolved.' },
        resolved:   { title: 'No resolved comments',  hint: 'Resolved comments will appear here.' },
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

      // ── Header ──────────────────────────────────────────────────────────────
      var hdr = el('div', { className: 'rhacs-panel__header' });
      var title = el('span', { className: 'rhacs-panel__title' });
      title.appendChild(txt('Comments'));
      var closeBtn = el('button', { className: 'pf-v6-c-button pf-m-plain rhacs-panel__close' });
      closeBtn.setAttribute('aria-label', 'Close');
      closeBtn.appendChild(txt('×'));
      closeBtn.addEventListener('click', function () { Panel.close(); });
      append(hdr, title, closeBtn);
      this.el.appendChild(hdr);

      // ── Guest notice banner ──────────────────────────────────────────────────
      if (S.guestMode) {
        var guestBanner = el('div', { className: 'rhacs-panel__guest-banner' });
        guestBanner.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 16 16" fill="currentColor" style="flex-shrink:0"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.029 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/></svg> <span>Guest mode — comments are local to this browser. <button class="rhacs-panel__guest-login-link">Log in with GitHub</button> for full features.</span>';
        guestBanner.querySelector('.rhacs-panel__guest-login-link').addEventListener('click', function () {
          Auth.login().then(function () { FAB.updateUser(); Panel.open(); loadAndRender(); }).catch(function (e) { Notify.toast(e.message); });
        });
        this.el.appendChild(guestBanner);
      }

      // ── PF6 Tabs ─────────────────────────────────────────────────────────────
      var allPins        = S.pins.filter(function (p) { return p.meta; });
      var unresolvedPins = allPins.filter(function (p) { return !p.meta.resolved; });
      var resolvedPins   = allPins.filter(function (p) { return p.meta.resolved; });

      var tabs = [
        { id: 'all',        label: 'All',        count: allPins.length },
        { id: 'unresolved', label: 'Unresolved', count: unresolvedPins.length },
        { id: 'resolved',   label: 'Resolved',   count: resolvedPins.length },
      ];

      var tabList = el('div', { className: 'rhacs-panel__tabs', role: 'tablist' });
      tabs.forEach(function (tab) {
        var btn = el('button', { className: 'rhacs-panel__tab' + (Panel.activeTab === tab.id ? ' rhacs-panel__tab--active' : ''), role: 'tab' });
        btn.appendChild(txt(tab.label));
        if (tab.count > 0) {
          var badge = el('span', { className: 'rhacs-panel__tab-badge' });
          badge.appendChild(txt(String(tab.count)));
          btn.appendChild(badge);
        }
        btn.addEventListener('click', function () {
          Panel.activeTab = tab.id;
          Panel.render();
        });
        tabList.appendChild(btn);
      });
      this.el.appendChild(tabList);

      // ── Visible pins for active tab ───────────────────────────────────────
      var visible = Panel.activeTab === 'all'        ? allPins
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
        var av  = el('img', { className: 'pf-v5-c-avatar rhacs-avatar rhacs-avatar--sm', src: pin.author.avatarUrl, alt: pin.author.login });
        var num = el('span', { className: 'pf-v5-c-badge pf-m-unread rhacs-panel__item-num' }); num.appendChild(txt(String(pin.meta.pinNumber)));
        var au  = el('span', { className: 'rhacs-panel__item-author' }); au.appendChild(txt(pin.author.login));
        var tm  = el('span', { className: 'rhacs-panel__item-time' }); tm.appendChild(txt(timeAgo(pin.createdAt)));
        append(itemHdr, av, num, au, tm);
        if (isUnread) {
          var dot = el('span', { className: 'rhacs-unread-dot' });
          itemHdr.appendChild(dot);
        }

        var preview = el('div', { className: 'rhacs-panel__item-preview' });
        var ptext = pinText(pin.body);
        preview.appendChild(txt(ptext.length > 80 ? ptext.slice(0, 80) + '…' : ptext));

        append(item, itemHdr, preview);

        if (pin.replies && pin.replies.length > 0) {
          var replyCount = el('div', { className: 'rhacs-panel__item-replies' });
          var rc = el('span', { className: 'pf-v5-c-badge' });
          rc.appendChild(txt(String(pin.replies.length)));
          replyCount.appendChild(rc);
          replyCount.appendChild(txt(' ' + (pin.replies.length === 1 ? 'reply' : 'replies')));
          item.appendChild(replyCount);
        }

        item.addEventListener('click', (function (p) { return function () {
          Panel.close();
          var ci = containerInfo();
          var scrollY = (p.meta.y / 100) * ci.scrollHeight;
          if (S.scrollContainer) {
            S.scrollContainer.scrollTo({ top: scrollY - 120, behavior: 'smooth' });
          } else {
            window.scrollTo({ top: scrollY - 120, behavior: 'smooth' });
          }
          setTimeout(function () { Popup.showThread(p.id); }, 400);
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
      icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105"/></svg>';
      var label = el('span', { className: 'rhacs-fab__label' });
      label.appendChild(txt('Add comment'));

      var mainBtn = el('button', { className: 'rhacs-fab__btn', title: 'Toggle comment mode (C)' });
      append(mainBtn, icon, label, this.badge);
      mainBtn.addEventListener('click', function () { FAB.toggleMode(); });

      var panelBtn = el('button', { className: 'rhacs-fab__panel-btn', title: 'View all comments' });
      panelBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="currentColor" style="flex-shrink:0"><path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/></svg><span style="font-size:12px;font-weight:500">View all</span>';
      panelBtn.style.cssText = 'display:flex;align-items:center;gap:5px;width:auto;padding:0 10px;border-radius:16px;';
      panelBtn.addEventListener('click', function () { Panel.toggle(); });

      this.userEl = el('div', { className: 'rhacs-fab__user' });

      append(this.el, mainBtn, panelBtn, this.userEl);
      rhacsMount().appendChild(this.el);
      this.updateUser();

      document.addEventListener('keydown', function (e) {
        if (e.key !== 'c' && e.key !== 'C') return;
        var tag = document.activeElement && document.activeElement.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement.isContentEditable) return;
        FAB.toggleMode();
      });
    },
    toggleMode: function () { FAB.setMode(!S.commentMode); },
    setMode: function (active) {
      S.commentMode = active;
      if (active) this.el.classList.add('rhacs-fab--active');
      else         this.el.classList.remove('rhacs-fab--active');
      var labelEl = this.el.querySelector('.rhacs-fab__label');
      if (labelEl) labelEl.textContent = active ? 'Exit comment mode' : 'Add comment';
      Overlay.setMode(active);
      if (active) {
        Panel.open();
      }
    },
    updateBadge: function () {
      var count = S.unread;
      if (count > 0) {
        this.badge.textContent = count;
        this.badge.style.display = '';
      } else {
        this.badge.style.display = 'none';
      }
    },
    updateUser: function () {
      if (!this.userEl) return;
      this.userEl.innerHTML = '';
      if (S.guestMode) {
        // Guest mode: show guest badge + login and exit options
        var guestBadge = el('span', { className: 'rhacs-guest-badge', title: S.user ? S.user.login : 'Guest' });
        guestBadge.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.029 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/></svg> Guest';
        var ghLoginBtn = el('button', { className: 'pf-v6-c-button pf-m-link pf-m-small', title: 'Log in with GitHub for full features' });
        ghLoginBtn.appendChild(txt('Log in'));
        ghLoginBtn.addEventListener('click', function () {
          Auth.login().then(function () { FAB.updateUser(); loadAndRender(); }).catch(function (e) { Notify.toast(e.message); });
        });
        var exitGuestBtn = el('button', { className: 'pf-v6-c-button pf-m-link pf-m-small rhacs-guest-exit', title: 'Exit guest mode' });
        exitGuestBtn.appendChild(txt('Exit'));
        exitGuestBtn.addEventListener('click', function () { Auth.exitGuest(); loadAndRender(); });
        append(this.userEl, guestBadge, ghLoginBtn, exitGuestBtn);
      } else if (S.user) {
        var av = el('img', { className: 'pf-v5-c-avatar rhacs-avatar rhacs-avatar--sm', src: S.user.avatarUrl, alt: S.user.login, title: 'Logged in as ' + S.user.login });
        var logoutBtn = el('button', { className: 'pf-v6-c-button pf-m-link pf-m-small', title: 'Log out', onclick: function () { Auth.logout(); } });
        logoutBtn.setAttribute('aria-label', 'Log out');
        logoutBtn.appendChild(txt('Log out'));
        append(this.userEl, av, logoutBtn);
      } else {
        var loginBtn = el('button', { className: 'pf-v6-c-button pf-m-secondary pf-m-small', title: 'Login with GitHub (Shift+click to use a Personal Access Token)' });
        loginBtn.appendChild(txt('Login'));
        loginBtn.addEventListener('click', function (e) {
          if (e.shiftKey) {
            var pat = window.prompt('Paste a GitHub Personal Access Token (needs public_repo scope):\n\nCreate one at: github.com/settings/tokens/new\nSelect scope: public_repo');
            if (!pat || !pat.trim()) return;
            S.token = pat.trim();
            localStorage.setItem(CFG.tokenKey, S.token);
            Auth.fetchUser().then(function () { FAB.updateUser(); Notify.toast('Logged in via PAT as ' + (S.user ? S.user.login : 'unknown')); }).catch(function () {});
          } else {
            Auth.login().then(function () { FAB.updateUser(); }).catch(function (e) { Notify.toast(e.message); });
          }
        });
        this.userEl.appendChild(loginBtn);
      }
    },
  };

  // ── Notifications ─────────────────────────────────────────────────────────────
  var Notify = {
    toastEl: null,
    timer: null,
    init: function () {
      this.toastEl = el('div', { className: 'pf-v6-c-alert pf-m-info rhacs-toast', id: 'rhacs-toast', role: 'alert' });
      this.toastEl.setAttribute('aria-live', 'polite');
      this.toastEl.style.display = 'none';
      rhacsMount().appendChild(this.toastEl);
    },
    toast: function (msg, ms) {
      ms = ms || 4000;
      clearTimeout(this.timer);
      this.toastEl.innerHTML = '';
      var iconEl = el('div', { className: 'pf-v6-c-alert__icon' });
      iconEl.appendChild(txt('ℹ'));
      var titleEl = el('p', { className: 'pf-v6-c-alert__title' });
      titleEl.appendChild(txt(msg));
      var actionEl = el('div', { className: 'pf-v6-c-alert__action' });
      var closeBtn = el('button', { className: 'pf-v6-c-button pf-m-plain' });
      closeBtn.setAttribute('aria-label', 'Close alert');
      closeBtn.appendChild(txt('×'));
      closeBtn.addEventListener('click', function () { Notify.toastEl.style.display = 'none'; });
      actionEl.appendChild(closeBtn);
      append(this.toastEl, iconEl, titleEl, actionEl);
      this.toastEl.style.display = 'flex';
      this.timer = setTimeout(function () { Notify.toastEl.style.display = 'none'; }, ms);
    },
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
    showUnread: function (count) {
      S.unread += count;
      document.title = '(' + S.unread + ') ' + S.origTitle;
      FAB.updateBadge();
      Notify.toast(count + ' new comment' + (count > 1 ? 's' : '') + ' added');
    },
    clearUnread: function () {
      S.unread = 0;
      document.title = S.origTitle;
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
    if (!active) {
      FAB.setMode(false);
      if (Popup.el) Popup.el.style.display = 'none';
      if (Panel.el) Panel.el.classList.remove('rhacs-panel--open');
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
      // Popup: close on outside click unless a textarea/input inside is focused
      if (Popup.el && Popup.el.style.display !== 'none') {
        if (!Popup.el.contains(e.target)) {
          var active = document.activeElement;
          var isTyping = active &&
            (active.tagName === 'TEXTAREA' || active.tagName === 'INPUT') &&
            Popup.el.contains(active);
          if (!isTyping) Popup.close();
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
      ? Auth.fetchUser().then(function () { FAB.updateUser(); })
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
