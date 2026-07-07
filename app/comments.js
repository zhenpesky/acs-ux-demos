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
    verifiedKey: 'rhacs_domain_verified',
    pollMs:      30000,
  };

  // ── Access gate — restricts prototype pages to @redhat.com GitHub accounts ──
  var AccessGate = {
    _el: null,

    // True when the page doesn't need gating (share link or already verified)
    isCleared: function () {
      if (isShareMode()) return true;
      if (!isPrototypePage()) return true;
      try {
        var cached = localStorage.getItem(CFG.verifiedKey);
        // Accept 'verified' (stored when S.user wasn't loaded yet) or exact login match
        if (cached && (cached === 'verified' || (S.user && cached === S.user.login))) return true;
      } catch (e) {}
      return false;
    },

    // Show a full-screen blocking overlay before the user authenticates
    show: function () {
      if (AccessGate._el) return;
      // Remove the lightweight pregate div injected by the <head> inline script
      var pregate = document.getElementById('rhacs-pregate');
      if (pregate) pregate.remove();
      var overlay = el('div', { id: 'rhacs-gate', className: 'rhacs-gate' });
      var card = el('div', { className: 'rhacs-gate__card' });

      var logo = el('div', { className: 'rhacs-gate__logo' });
      logo.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40"><circle cx="20" cy="20" r="20" fill="#ee0000"/><text x="20" y="26" text-anchor="middle" font-size="16" font-weight="bold" fill="#fff" font-family="sans-serif">RH</text></svg>';

      var title = el('h2', { className: 'rhacs-gate__title' });
      title.appendChild(txt('Red Hat prototype access'));

      var sub = el('p', { className: 'rhacs-gate__sub' });
      sub.appendChild(txt('This prototype is restricted to Red Hat team members. Sign in with your Red Hat GitHub account to continue.'));

      var btn = el('button', { className: 'rhacs-gate__btn' });
      btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 16" fill="currentColor" style="flex-shrink:0"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/></svg><span>Sign in with GitHub</span>';
      btn.addEventListener('click', function () {
        btn.disabled = true;
        btn.style.opacity = '0.6';
        Auth.login()
          .then(function () { return AccessGate.verifyAndClear(); })
          .catch(function () {
            btn.disabled = false;
            btn.style.opacity = '';
          });
      });

      AccessGate._statusEl = el('p', { className: 'rhacs-gate__status' });

      append(card, logo, title, sub, btn, AccessGate._statusEl);
      overlay.appendChild(card);
      document.body.appendChild(overlay);
      AccessGate._el = overlay;
      AccessGate._btn = btn;
    },

    _showDenied: function () {
      if (AccessGate._statusEl) {
        AccessGate._statusEl.textContent = 'Access denied — no verified @redhat.com email found on this GitHub account. Contact the prototype owner for access.';
        AccessGate._statusEl.className = 'rhacs-gate__status rhacs-gate__status--denied';
      }
      if (AccessGate._btn) {
        AccessGate._btn.disabled = false;
        AccessGate._btn.style.opacity = '';
      }
    },

    remove: function () {
      var pregate = document.getElementById('rhacs-pregate');
      if (pregate) pregate.remove();
      if (AccessGate._el) { AccessGate._el.remove(); AccessGate._el = null; }
    },

    // Called after OAuth completes — checks email domain, caches result
    verifyAndClear: function () {
      return fetch('https://api.github.com/user/emails', {
        headers: { Authorization: 'bearer ' + S.token, 'User-Agent': 'rhacs-comments/1.0' }
      })
        .then(function (r) { return r.json(); })
        .then(function (emails) {
          var ok = Array.isArray(emails) && emails.some(function (e) {
            return e.verified && e.email && e.email.toLowerCase().endsWith('@redhat.com');
          });
          if (ok) {
            try { localStorage.setItem(CFG.verifiedKey, S.user ? S.user.login : 'verified'); } catch (ex) {}
            AccessGate.remove();
          } else {
            AccessGate.show(); // ensure overlay is visible
            AccessGate._showDenied();
          }
        })
        .catch(function () {
          // Network error — don't block, allow access (fail open for reliability)
          AccessGate.remove();
        });
    },

    // Run at startup — decides whether to gate, skip, or verify
    check: function () {
      if (isShareMode() || !isPrototypePage()) return;
      if (AccessGate.isCleared()) return;
      if (S.token) {
        // Token exists but domain not yet verified — verify silently
        AccessGate.verifyAndClear();
      } else {
        AccessGate.show();
      }
    },
  };

  // ── Share mode: ?share=1 hides GitHub login and isolates the view ──────────
  function isShareMode() {
    // GitHub-authenticated users always get full UI — share restrictions are guest-only.
    if (S.token) return false;
    return !!shareToken();
  }

  function shareToken() {
    try { return new URLSearchParams(window.location.search).get('share') || ''; } catch (e) { return ''; }
  }

  // GitHub token always wins over guest/share session state.
  function prioritizeGitHubAuth() {
    if (!S.token) return false;
    S.guestMode = false;
    syncGhUser();
    return true;
  }

  // Share links skip GitHub login — restore guest session + pins after refresh.
  function restoreShareGuestSession() {
    if (prioritizeGitHubAuth() || !isShareMode() || S.guestMode) return;
    var guest = Auth.guestIdentity();
    if (guest) {
      S.guestMode = true;
      S.user = guest;
      syncGhUser();
    }
  }

  function loadGuestPinsIntoState() {
    S.pins = Auth.loadGuestPins().map(function (p) {
      if (!p.meta) p.meta = parseMeta(p.body);
      p._guest = true;
      return p;
    });
  }

  // Match live pin after guest→GitHub ID sync (_origGuestId) or stale thread pinId.
  function findPinById(pinId) {
    var pin = S.pins.find(function (p) { return p.id === pinId || p._origGuestId === pinId; });
    if (!pin && S.guestMode) {
      var stored = Auth.loadGuestPins().find(function (p) { return p.id === pinId || p._origGuestId === pinId; });
      if (stored) {
        if (!stored.meta) stored.meta = parseMeta(stored.body);
        stored._guest = true;
        S.pins.push(stored);
        pin = stored;
      }
    }
    return pin || null;
  }

  function findStoredGuestPin(stored, pinId) {
    for (var i = 0; i < stored.length; i++) {
      if (stored[i].id === pinId || stored[i]._origGuestId === pinId) return stored[i];
    }
    return null;
  }

  function isEventInsidePopup(e) {
    if (!Popup.el) return false;
    if (typeof e.composedPath === 'function') {
      var path = e.composedPath();
      for (var i = 0; i < path.length; i++) {
        if (path[i] === Popup.el) return true;
      }
    }
    var t = e.target;
    if (t && t.nodeType === 3) t = t.parentNode;
    return !!(t && typeof t.closest === 'function' && t.closest('#rhacs-popup'));
  }

  // PAGE_KEY must be evaluated at call time (SPA route changes after load)
  function getPageKey() {
    return 'page:' + window.location.pathname;
  }
  // Pins store full href at creation time; SPA nav often strips ?prototype= while pathname stays the same.
  function pinUrlsSamePage(storedUrl, currentUrl) {
    if (!storedUrl) return true;
    try {
      return new URL(storedUrl, window.location.origin).pathname
           === new URL(currentUrl, window.location.origin).pathname;
    } catch (e) {
      return storedUrl === currentUrl;
    }
  }
  var PAGE_KEY  = getPageKey(); // legacy alias — still used for GitHub Discussion title lookup
  var GH_GQL    = 'https://api.github.com/graphql';

  // ── State ────────────────────────────────────────────────────────────────────
  var S = {
    token:        null,
    user:         null,
    ghUser:       null,    // GitHub-authenticated user only (null for guests)
    guestMode:    false,   // true when using guest (localStorage-only) commenting
    commentMode:  false,
    repoId:       null,
    categoryId:   null,
    discussionId: null,
    pins:         [],
    activePinId:  null,
    lastSeen:     0,
    seenIds:      new Set(),
    unread:          0,
    origTitle:       document.title,
    pollTimer:       null,
    showResolved:    false,
    seenReplyCounts: {},   // { [pinId]: replyCount at time of reading } — detects new replies
    pendingPanelPinOpen: null, // set before cross-page panel nav; fulfilled after pins load
    _pinsPageKey:    null,   // getPageKey() when S.pins was last loaded — skip redundant fetches
  };

  function syncGhUser() {
    S.ghUser = (S.token && !S.guestMode && S.user) ? S.user : null;
  }

  // ── Per-user seen / unread tracking ───────────────────────────────────────────
  function seenUserKey() {
    try {
      if (S.token) {
        var login = S.user && S.user.login;
        if (!login) {
          var cached = JSON.parse(localStorage.getItem(CFG.userKey) || 'null');
          if (cached && cached.login) login = cached.login;
        }
        if (login) return 'gh:' + login;
      }
    } catch (e) {}
    if (S.guestMode && S.user && S.user.login) return 'guest:' + S.user.login;
    try {
      var gid = localStorage.getItem(CFG.guestKey);
      if (gid) return 'guestid:' + gid;
    } catch (e) {}
    return 'anon';
  }

  function seenIdsStorageKey() {
    return CFG.seenPrefix + 'ids-' + seenUserKey() + '-' + window.location.pathname;
  }

  function seenTsStorageKey() {
    return CFG.seenPrefix + seenUserKey() + '-' + window.location.pathname;
  }

  function migrateLegacySeenKeys() {
    var oldIds = CFG.seenPrefix + 'ids-' + window.location.pathname;
    var oldTs  = CFG.seenPrefix + window.location.pathname;
    var newIds = seenIdsStorageKey();
    var newTs  = seenTsStorageKey();
    try {
      if (!localStorage.getItem(newIds) && localStorage.getItem(oldIds)) {
        localStorage.setItem(newIds, localStorage.getItem(oldIds));
      }
      if (!localStorage.getItem(newTs) && localStorage.getItem(oldTs)) {
        localStorage.setItem(newTs, localStorage.getItem(oldTs));
      }
    } catch (e) {}
  }

  function loadSeenState() {
    migrateLegacySeenKeys();
    S.lastSeen = parseInt(localStorage.getItem(seenTsStorageKey()) || '0', 10);
    try {
      var ids = JSON.parse(localStorage.getItem(seenIdsStorageKey()));
      S.seenIds = new Set(Array.isArray(ids) ? ids : []);
    } catch (e) { S.seenIds = new Set(); }
  }

  function saveSeenIds() {
    try {
      localStorage.setItem(seenIdsStorageKey(), JSON.stringify(Array.from(S.seenIds)));
    } catch (e) {}
  }

  function saveLastSeen() {
    try {
      localStorage.setItem(seenTsStorageKey(), String(S.lastSeen));
    } catch (e) {}
  }

  function isOwnPin(pin) {
    var myLogin = (S.token && !S.guestMode && S.user) ? S.user.login : null;
    return !!(myLogin && pin.author && pin.author.login === myLogin && !pin._guest);
  }

  function isPinUnread(pin) {
    if (!pin || !pin.id || !pin.meta || pin.meta.resolved) return false;
    if (isOwnPin(pin)) return false;
    return !S.seenIds.has(pin.id);
  }

  function markPinAsSeen(pin) {
    if (!pin || !pin.id) return false;
    S.seenReplyCounts[pin.id] = (pin.replies || []).length;
    if (S.seenIds.has(pin.id)) return false;
    S.seenIds.add(pin.id);
    saveSeenIds();
    return true;
  }

  function reconcileSeenStateAfterPinLoad() {
    S.pins.forEach(function (p) {
      if (isOwnPin(p)) S.seenIds.add(p.id);
      if (S.seenIds.has(p.id)) {
        var prevCount = S.seenReplyCounts[p.id];
        if (prevCount !== undefined && (p.replies || []).length > prevCount) {
          S.seenIds.delete(p.id);
          saveSeenIds();
        }
      }
    });
  }

  function pinsDataChanged(oldPins, freshPins) {
    if (oldPins.length !== freshPins.length) return true;
    var oldMap = {};
    oldPins.forEach(function (p) { oldMap[p.id] = p; });
    for (var i = 0; i < freshPins.length; i++) {
      var fp = freshPins[i];
      var ep = oldMap[fp.id];
      if (!ep) return true;
      if ((fp.replies || []).length !== (ep.replies || []).length) return true;
      if (fp.body !== ep.body) return true;
    }
    return false;
  }

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

  // ── Modal pin helpers ────────────────────────────────────────────────────────
  var _lastFocusedBtn = null;

  function getModalHeadingText(modalEl) {
    if (!modalEl) return '';
    var heading = modalEl.querySelector('[class*="modal-box__title"], [class*="modal__title"], h1, h2, h3');
    return heading && heading.textContent ? heading.textContent.trim() : '';
  }

  function isElementVisible(el) {
    if (!el) return false;
    if (el.hidden || el.getAttribute('aria-hidden') === 'true') return false;
    var st = getComputedStyle(el);
    return st.display !== 'none' && st.visibility !== 'hidden';
  }

  function findOpenModal(title) {
    if (!title) return null;
    var dialogs = document.querySelectorAll('[role="dialog"], .pf-v6-c-modal-box, .pf-c-modal-box');
    for (var i = 0; i < dialogs.length; i++) {
      var d = dialogs[i];
      if (!isElementVisible(d)) continue;
      if (getModalHeadingText(d) === title) return d;
    }
    return null;
  }

  function isInsideCommentsUI(el) {
    return !!(el && el.closest && (
      el.closest('#rhacs-mount') || el.closest('[role="dialog"]') ||
      el.closest('.pf-v6-c-modal-box') || el.closest('.pf-c-modal-box')
    ));
  }

  function findModalOpenerButton(modalTitle, storedOpener) {
    var allBtns = Array.prototype.slice.call(document.querySelectorAll('button, a[role="button"]'))
      .filter(function (b) { return !isInsideCommentsUI(b); });
    if (storedOpener) {
      var exact = allBtns.find(function (b) {
        var t = (b.textContent || b.getAttribute('aria-label') || '').trim();
        return t === storedOpener;
      });
      if (exact) return exact;
    }
    var modalWords = (modalTitle || '').toLowerCase().split(/\s+/).filter(function (w) { return w.length > 2; });
    var matched = allBtns.find(function (b) {
      var bt = (b.textContent || b.getAttribute('aria-label') || '').toLowerCase();
      return modalWords.some(function (w) { return bt.includes(w); });
    });
    if (matched) return matched;
    if (_lastFocusedBtn && !isInsideCommentsUI(_lastFocusedBtn)) return _lastFocusedBtn;
    return null;
  }

  function modalPinToViewport(meta) {
    var modal = findOpenModal(meta.modalTitle);
    if (!modal || meta.modalX == null || meta.modalY == null) return null;
    var mr = modal.getBoundingClientRect();
    return {
      left: mr.left + (meta.modalX / 100) * mr.width,
      top:  mr.top  + (meta.modalY / 100) * mr.height,
      visible: true,
      isModal: true,
    };
  }

  function hasModalPins() {
    return S.pins.some(function (p) { return p.meta && p.meta.modalTitle; });
  }

  function ensureModalPinRefresh() {
    if (Overlay._modalPinInterval) return;
    if (!hasModalPins()) return;
    Overlay._modalPinInterval = setInterval(function () {
      if (!hasModalPins()) {
        clearInterval(Overlay._modalPinInterval);
        Overlay._modalPinInterval = null;
        return;
      }
      Overlay.renderPins();
    }, 500);
  }

  // ── Page-state detection (4-state CRUD) ──────────────────────────────────────
  // Priority: URL signals → visible delete dialog → DOM form signals → view
  function detectViewState() {
    var url = window.location.href.toLowerCase();
    var params = new URLSearchParams(window.location.search);
    var mode = (params.get('mode') || '').toLowerCase();

    // 1. URL / query-param signals
    if (/\/create(\/|$)|\bnew\b|mode=create/.test(url) || mode === 'create') return 'create';
    if (/\/edit(\/|$)|[?&]edit=|mode=edit/.test(url) || mode === 'edit') return 'edit';
    if (/\/delete(\/|$)|mode=delete/.test(url) || mode === 'delete') return 'delete';

    // 2. Visible PF6 modal/dialog with delete/remove action
    var dialogs = document.querySelectorAll(
      '.pf-v6-c-modal-box, .pf-c-modal-box, [role="dialog"], [role="alertdialog"]'
    );
    for (var d = 0; d < dialogs.length; d++) {
      var dlg = dialogs[d];
      if (getComputedStyle(dlg).display === 'none') continue;
      var dlgText = (dlg.textContent || '').toLowerCase();
      if (/\bdelete\b|\bremove\b|\bdestroy\b/.test(dlgText)) return 'delete';
    }

    // 3. DOM form signals — non-trivial inputs in app content (exclude our own UI)
    var main = document.querySelector('.pf-v6-c-page__main, .pf-c-page__main, main');
    if (!main) return 'view';
    var appInputs = Array.prototype.slice.call(
      main.querySelectorAll('input, select, textarea, .pf-v6-c-form-control')
    ).filter(function (el) {
      if (el.closest('#rhacs-comment-root') || el.closest('#rhacs-popup') || el.closest('#rhacs-panel')) return false;
      var t = (el.getAttribute('type') || '').toLowerCase();
      if (t === 'hidden' || t === 'search' || t === 'checkbox' || t === 'radio') return false;
      // Exclude read-only display fields (e.g. System Config V2 view uses disabled TextInputs).
      if (el.disabled || el.readOnly || el.getAttribute('aria-disabled') === 'true') return false;
      if (el.hasAttribute('readonly')) return false;
      return true;
    });

    if (appInputs.length > 0) {
      // Create vs edit: if most required fields are empty → creating, otherwise editing
      var filledCount = appInputs.filter(function (el) {
        return (el.value || '').trim().length > 0;
      }).length;
      return filledCount === 0 ? 'create' : 'edit';
    }

    return 'view';
  }

  function isEditLabel(text, aria) {
    text = (text || '').trim().toLowerCase();
    aria = (aria || '').trim().toLowerCase();
    return text === 'edit' || text.startsWith('edit ') ||
      aria === 'edit' || aria.startsWith('edit ');
  }

  // Enabled header Edit button (SystemConfigPage.tsx primary "Edit" control).
  function findPageEditButton() {
    var candidates = Array.prototype.slice.call(
      document.querySelectorAll('button, a[role="button"]')
    ).filter(function (b) {
      if (b.closest('#rhacs-mount') || b.closest('#rhacs-comment-root') ||
          b.closest('#rhacs-popup') || b.closest('#rhacs-panel')) return false;
      if (b.disabled || b.getAttribute('aria-disabled') === 'true') return false;
      return isEditLabel(b.textContent, b.getAttribute('aria-label'));
    });
    var headerEdit = candidates.filter(function (b) {
      return b.closest('.pf-v6-c-page__main-section, .pf-c-page__main-section');
    });
    return headerEdit[0] || candidates[0] || null;
  }

  // Guard against false "edit" from read-only inputs still counted by detectViewState().
  function effectiveViewState() {
    var state = detectViewState();
    if (state === 'edit' && findPageEditButton()) return 'view';
    return state;
  }

  // ── Utility helpers ───────────────────────────────────────────────────────────
  function timeAgo(iso) {
    var s = Math.floor((Date.now() - new Date(iso)) / 1000);
    if (s < 60)    return 'just now';
    if (s < 3600)  return Math.floor(s / 60) + 'm ago';
    if (s < 86400) return Math.floor(s / 3600) + 'h ago';
    return Math.floor(s / 86400) + 'd ago';
  }

  function fmtDate(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }

  // Extract RHACS_PIN JSON even when modal titles contain "}" or other special chars.
  function extractMetaJson(body) {
    if (!body) return null;
    var marker = body.indexOf('<!-- RHACS_PIN ');
    if (marker === -1) marker = body.indexOf('<!--RHACS_PIN ');
    if (marker === -1) return null;
    var jsonStart = body.indexOf('{', marker);
    if (jsonStart === -1) return null;
    var depth = 0, inString = false, escape = false;
    for (var i = jsonStart; i < body.length; i++) {
      var c = body[i];
      if (inString) {
        if (escape) { escape = false; continue; }
        if (c === '\\') { escape = true; continue; }
        if (c === '"') inString = false;
        continue;
      }
      if (c === '"') { inString = true; continue; }
      if (c === '{') depth++;
      else if (c === '}') {
        depth--;
        if (depth === 0) return body.slice(jsonStart, i + 1);
      }
    }
    return null;
  }

  function parseMeta(body) {
    var json = extractMetaJson(body);
    if (!json) return null;
    try { return JSON.parse(json); } catch (e) { return null; }
  }

  function pinText(body) {
    if (!body) return '';
    var marker = body.indexOf('<!-- RHACS_PIN ');
    if (marker === -1) marker = body.indexOf('<!--RHACS_PIN ');
    if (marker === -1) return body.trim();
    var end = body.indexOf('-->', marker);
    if (end === -1) return body.trim();
    return body.slice(end + 3).trim();
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

  function buildBody(x, y, num, text, guestAuthor, modalMeta) {
    var meta = { x: x, y: y, resolved: false, pinNumber: num, viewState: detectViewState(), pageUrl: window.location.href };
    if (guestAuthor) meta.guestAuthor = guestAuthor;
    if (modalMeta) {
      if (modalMeta.modalTitle) meta.modalTitle = modalMeta.modalTitle;
      if (modalMeta.modalX != null) meta.modalX = modalMeta.modalX;
      if (modalMeta.modalY != null) meta.modalY = modalMeta.modalY;
      if (modalMeta.modalOpener) meta.modalOpener = modalMeta.modalOpener;
    }
    return '<!-- RHACS_PIN ' + JSON.stringify(meta) + ' -->\n' + text;
  }

  function extractImages(body) {
    var text = (body || '').replace(/^<!--\s*RHACS_PIN\s+[\s\S]*?-->\n?/, '');
    var urls = [];
    text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, function (match, alt, url) {
      if (/^https?:\/\//.test(url) || /^data:image\//.test(url)) {
        urls.push(url);
        return '';
      }
      return match;
    });
    text = text.trim();
    return { text: text, urls: urls };
  }

  function setMeta(body, updates) {
    var json = extractMetaJson(body);
    if (!json) return body;
    try {
      var merged = '<!-- RHACS_PIN ' + JSON.stringify(Object.assign(JSON.parse(json), updates)) + ' -->';
      return body.replace(/<!--\s*RHACS_PIN\s[\s\S]*?-->/, merged);
    } catch (e) { return body; }
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

  function fetchWithTimeout(url, options, timeoutMs) {
    timeoutMs = timeoutMs || 30000;
    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, timeoutMs);
    var opts = Object.assign({}, options || {}, { signal: ctrl.signal });
    return fetch(url, opts)
      .finally(function () { clearTimeout(timer); })
      .catch(function (err) {
        if (err && err.name === 'AbortError') {
          throw new Error('Request timed out — please try again');
        }
        throw err;
      });
  }

  // Only clear the session on a confirmed invalid-token 401 — never on timeouts,
  // network errors, rate limits, or other HTTP statuses.
  function invalidateSessionIfUnauthorized(status) {
    if (status === 401 && S.token) Auth.logout();
  }

  // ── GitHub GraphQL ────────────────────────────────────────────────────────────
  function ghReq(query, vars, requireAuth) {
    var headers = { 'Content-Type': 'application/json' };
    if (S.token) headers['Authorization'] = 'bearer ' + S.token;
    else if (requireAuth) return Promise.reject(new Error('Not logged in'));

    return fetchWithTimeout(GH_GQL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ query: query, variables: vars || {} }),
    }, 60000).then(function (r) {
      if (r.status === 401) {
        invalidateSessionIfUnauthorized(r.status);
        throw new Error('Session expired — please log in again');
      }
      if (r.status === 429) throw new Error('GitHub rate limit reached — please wait a minute');
      if (!r.ok) throw new Error('GitHub API error: ' + r.status);
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
      'query($id:ID!){ node(id:$id){ ... on Discussion{ comments(first:100){ nodes{ id body createdAt author{ login avatarUrl } replies(first:20){ nodes{ id body createdAt author{ login avatarUrl } } } } } } } }',
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

  function addPinComment(text, x, y, num, modalMeta) {
    return ensureDiscussion().then(function (discId) {
      return ghReq(
        'mutation($d:ID!,$b:String!){ addDiscussionComment(input:{discussionId:$d,body:$b}){ comment{ id createdAt } } }',
        { d: discId, b: buildBody(x, y, num, text, null, modalMeta) },
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


  // ── Auth ──────────────────────────────────────────────────────────────────────
  var Auth = {
    init: function () {
      S.token = localStorage.getItem(CFG.tokenKey);
      try { S.user = JSON.parse(localStorage.getItem(CFG.userKey)); } catch (e) {}
      loadSeenState();
      // Guest mode is only available on share links (?share=1).
      // Share links (?share=1) auto-restore guest identity so local pins survive refresh.
      S.guestMode = false;
      if (!S.token) restoreShareGuestSession();
      syncGhUser();
      // Domain gate — runs after token/user are restored
      AccessGate.check();
    },
    isLoggedIn:        function () { return !!S.token; },
    isAuthed:          function () { return !!S.token || S.guestMode; },
    isPrototypeOwner:  function () { return !!(S.user && S.user.login === CFG.owner); },

    // ── GitHub OAuth ──────────────────────────────────────────────────────────
    login: function () {
      return new Promise(function (resolve, reject) {
        var url = 'https://github.com/login/oauth/authorize?client_id=' + CFG.clientId +
          '&redirect_uri=' + encodeURIComponent(CFG.callbackUrl) + '&scope=public_repo%20user%3Aemail';

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
            S.user = null;
            syncGhUser();
            localStorage.setItem(CFG.tokenKey, S.token);
            localStorage.removeItem(CFG.userKey);
            localStorage.removeItem(CFG.guestKey);
            // Resolve immediately so the dialog closes — don't block on fetchUser
            resolve();
            // Fetch profile in background; a failure just means no avatar
            Auth.fetchUser()
              .then(function () {
                try { FAB.updateUser(); } catch (e) {}
                // After profile loads, verify domain (S.user.login is now available)
                if (isPrototypePage() && !isShareMode()) AccessGate.verifyAndClear();
              })
              .catch(function (e) {
                console.warn('[rhacs] fetchUser after login:', e && e.message);
                try { FAB.updateUser(); } catch (ex) {}
                if (isPrototypePage() && !isShareMode()) AccessGate.verifyAndClear();
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
      return fetchWithTimeout('https://api.github.com/user', {
        headers: { Authorization: 'token ' + S.token },
      }, 60000).then(function (r) {
          if (r.status === 401) {
            console.warn('[rhacs] GitHub token rejected (401), logging out.');
            invalidateSessionIfUnauthorized(r.status);
            return Promise.reject(new Error('GitHub token invalid or expired. Please log in again.'));
          }
          if (!r.ok) return Promise.reject(new Error('GitHub API error: ' + r.status));
          return r.json();
        })
        .then(function (u) {
          if (!u) return;
          S.user = { login: u.login, avatarUrl: u.avatar_url, name: u.name };
          localStorage.setItem(CFG.userKey, JSON.stringify(S.user));
          syncGhUser();
          window.dispatchEvent(new CustomEvent('rhacs-auth-change', { detail: { loggedIn: true } }));
        });
    },
    logout: function () {
      S.token = null; S.user = null; S.guestMode = false;
      syncGhUser();
      localStorage.removeItem(CFG.tokenKey);
      localStorage.removeItem(CFG.userKey);
      localStorage.removeItem(CFG.guestKey);
      localStorage.removeItem(CFG.verifiedKey);
      window.dispatchEvent(new CustomEvent('rhacs-auth-change', { detail: { loggedIn: false } }));
      if (S.commentMode) FAB.setMode(false);
      // Close open UI and wipe all visible comment state
      Popup.close();
      if (typeof Panel !== 'undefined' && Panel.close) Panel.close();
      S.pins = [];
      S.discussionId = null;
      S._pinsPageKey = null;
      if (Overlay.renderPins) Overlay.renderPins();
      FAB.updateUser();
      FAB.updateBadge();
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
      // Derive initials using same logic as pinInitials: split on ·, take first word(s)
      var namePart = (seed || 'G').split('\u00b7')[0].trim();
      var words    = namePart.split(/\s+/).filter(Boolean);
      var initials = words.length >= 2 ? (words[0][0] + words[1][0]).toUpperCase()
                   : words.length === 1 ? words[0].slice(0, 2).toUpperCase()
                   : 'G';
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
      // Always use the full login as seed so stored avatar matches the re-derived one in parseGuestReply
      var user     = { login: login, name: login, firstName: firstName || '', lastName: lastName || '', title: title || '', company: company || '', avatarUrl: Auth._makeAvatarSvg(login) };
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
        var lastF     = makeField('Last name',  'e.g. Smith', true);
        append(nameRow, firstF.wrap, lastF.wrap);

        var titleF   = makeField('Title or role',  'e.g. UX Designer, PM', true);
        var companyF = makeField('Company',         'e.g. Red Hat, IBM',    true);

        // Button starts disabled; lights up once all required fields have content
        var continueBtn = el('button', { className: 'rhacs-auth-dialog__btn rhacs-auth-dialog__btn--primary', disabled: true });
        continueBtn.innerHTML = '<span>Continue to add comments</span>';

        function syncBtn() {
          continueBtn.disabled = !firstF.input.value.trim() || !lastF.input.value.trim() || !titleF.input.value.trim() || !companyF.input.value.trim();
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
        syncGhUser();
        FAB.updateUser();
        // toast removed
        return Promise.resolve();
      }
      return Auth._showNamePromptThenGuest().then(function (user) {
        S.guestMode = true;
        S.user = user;
        syncGhUser();
        FAB.updateUser();
        // toast removed
      });
    },
    exitGuest: function () {
      S.guestMode = false;
      S.user = null;
      syncGhUser();
      localStorage.removeItem(CFG.guestKey);
      if (S.commentMode) FAB.setMode(false);
      FAB.updateUser();
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
    addGuestPin: function (text, x, y, num, modalMeta) {
      // Build the comment body with embedded guest author identity
      var guestAuthor = S.user ? { login: S.user.login, name: S.user.name, avatarUrl: S.user.avatarUrl } : null;
      var body = buildBody(x, y, num, text, guestAuthor, modalMeta);
      var tempId = 'guest-' + Date.now();
      var pin = {
        id: tempId,
        body: body,
        createdAt: new Date().toISOString(),
        author: guestAuthor || { login: 'Guest', name: 'Guest' },
        replies: [],
        meta: Object.assign({}, parseMeta(body) || {}, { pinNumber: num, resolved: false }),
        _guest: true,
        _pendingUpload: true,
      };

      // Store immediately in localStorage so the guest sees it right away (optimistic)
      var pins = Auth.loadGuestPins();
      pins.push(pin);
      Auth.saveGuestPins(pins);

      // Fire-and-forget: POST to worker → GitHub Discussions so the prototype owner can see it
      fetchWithTimeout(CFG.workerUrl, {
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
          // Replace the temp ID with the real GitHub comment ID in localStorage
          var stored = Auth.loadGuestPins();
          for (var i = 0; i < stored.length; i++) {
            if (stored[i].id === tempId) {
              stored[i].id = data.id;
              stored[i]._pendingUpload = false;
              break;
            }
          }
          Auth.saveGuestPins(stored);
          // Also update S.pins in memory so follow-up replies use the real GitHub ID.
          // Keep _origGuestId so the follow-up handler can still find the pin by its old ID.
          for (var j = 0; j < S.pins.length; j++) {
            if (S.pins[j].id === tempId) {
              S.pins[j]._origGuestId = tempId;
              S.pins[j].id = data.id;
              break;
            }
          }
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
      if (isShareMode()) return Auth.loginAsGuest();
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
        ghBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="flex-shrink:0"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/></svg><span>Continue with GitHub</span>';
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

        // Guest option (share mode only)
        var guestBtn = el('button', { className: 'rhacs-auth-dialog__btn rhacs-auth-dialog__btn--secondary' });
        guestBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="flex-shrink:0"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.029 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/></svg><span>Continue as guest</span>';
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
        ['No GitHub account required', 'Your comment is visible to the prototype owner'].forEach(function (f) {
          var li = el('li'); li.appendChild(txt(f)); guestFeatures.appendChild(li);
        });

        var cancelBtn = el('button', { className: 'rhacs-auth-dialog__cancel' });
        cancelBtn.appendChild(txt('Cancel'));
        cancelBtn.addEventListener('click', function () { overlay.remove(); reject(new Error('cancelled')); });

        if (isShareMode()) {
          subEl.firstChild.nodeValue = 'Leave your feedback on this prototype.';
          append(card, iconEl, titleEl, subEl, guestBtn, guestFeatures, cancelBtn);
        } else {
          append(card, iconEl, titleEl, subEl, ghBtn, ghFeatures, cancelBtn);
        }
        overlay.appendChild(card);

        // Close on backdrop click
        overlay.addEventListener('click', function (e) { if (e.target === overlay) { overlay.remove(); reject(new Error('cancelled')); } });

        rhacsMount().appendChild(overlay);
      });
    },
  };

  // ── Data helpers ─────────────────────────────────────────────────────────────
  // Guest follow-up replies are posted via the owner token with a trailing "— _Name (guest)_" signature.
  // Strip the signature and restore the real guest identity so the reply shows the correct name/avatar.
  function parseGuestReply(r) {
    var GUEST_SIG = /\n\n\u2014 _(.+?) \(guest\)_\s*$/;
    var m = r.body.match(GUEST_SIG);
    if (!m) return r;
    var guestName = m[1];
    return Object.assign({}, r, {
      author: { login: guestName, name: guestName, avatarUrl: Auth._makeAvatarSvg(guestName) },
      body: r.body.replace(GUEST_SIG, '').trim(),
      _guest: true,
    });
  }

  function parseComments(comments) {
    return comments
      .map(function (c) {
        var rawReplies = c.replies ? c.replies.nodes : [];
        var pin = Object.assign({}, c, {
          meta: parseMeta(c.body),
          replies: rawReplies.map(parseGuestReply),
        });
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

  // Debounced pin re-render after page layout settles (React hydrate, fonts, images).
  var _layoutSettleRenderTimer = null;
  var _layoutSettleObserverUntil = 0;

  function scheduleRenderPinsAfterLayout() {
    if (_layoutSettleRenderTimer) clearTimeout(_layoutSettleRenderTimer);
    _layoutSettleRenderTimer = setTimeout(function () {
      _layoutSettleRenderTimer = null;
      requestAnimationFrame(function () {
        if (Overlay.pinLayerEl) Overlay.renderPins();
      });
    }, 300);
  }

  function startLayoutSettleObserver() {
    if (!window.ResizeObserver || Overlay._layoutSettleRO) return;
    _layoutSettleObserverUntil = Date.now() + 5000;
    var lastHeight = document.documentElement.scrollHeight;
    var debounceTimer = null;
    Overlay._layoutSettleRO = new ResizeObserver(function () {
      if (Date.now() > _layoutSettleObserverUntil) return;
      var h = document.documentElement.scrollHeight;
      if (Math.abs(h - lastHeight) < 8) return;
      lastHeight = h;
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        debounceTimer = null;
        requestAnimationFrame(function () { Overlay.refresh(); });
      }, 100);
    });
    Overlay._layoutSettleRO.observe(document.body);
  }

  function applyLoadedPins(comments) {
    S.pins = parseComments(comments);
    S._pinsPageKey = getPageKey();
    reconcileSeenStateAfterPinLoad();
    scheduleRenderPinsAfterLayout();
    FAB.updateBadge();
    fulfillPendingPanelPinOpen();
  }

  function waitForViewState(target, onReady, timeoutMs) {
    timeoutMs = timeoutMs || 2500;
    if (!target || detectViewState() === target) { onReady(); return; }
    var elapsed = 0;
    var interval = setInterval(function () {
      elapsed += 100;
      if (detectViewState() === target || elapsed >= timeoutMs) {
        clearInterval(interval);
        onReady();
      }
    }, 100);
  }

  function scrollToPinMetaY(metaY, pinId) {
    var ci = containerInfo();
    var scrollY = (metaY / 100) * ci.scrollHeight;
    if (S.scrollContainer) {
      S.scrollContainer.scrollTo({ top: scrollY - 120, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: scrollY - 120, behavior: 'smooth' });
    }
    setTimeout(function () { Popup.showThread(pinId); }, 200);
  }

  function fulfillPendingPanelPinOpen() {
    var pending = S.pendingPanelPinOpen;
    if (!pending) return;
    S.pendingPanelPinOpen = null;
    if (pending.modalTitle) {
      waitForViewState(pending.targetState, function () {
        var pin = S.pins.find(function (p) { return p.id === pending.pinId; });
        if (findOpenModal(pending.modalTitle)) {
          Overlay.renderPins();
          setTimeout(function () { Popup.showThread(pending.pinId); }, 50);
          return;
        }
        var opener = findModalOpenerButton(pending.modalTitle, pending.modalOpener);
        if (opener) opener.click();
        var elapsed = 0;
        var poll = setInterval(function () {
          elapsed += 100;
          if (findOpenModal(pending.modalTitle) || elapsed >= 2500) {
            clearInterval(poll);
            Overlay.renderPins();
            setTimeout(function () { Popup.showThread(pending.pinId); }, 50);
          }
        }, 100);
      }, 2500);
      return;
    }
    waitForViewState(pending.targetState, function () {
      scrollToPinMetaY(pending.metaY, pending.pinId);
    }, 2500);
  }

  function loadFromGitHub() {
    return getRepoMeta()
      .then(function () {
        if (!S.categoryId) throw new Error('Repo metadata unavailable');
        return findDiscussion();
      })
      .then(function (id) {
        if (!id) {
          S.discussionId = null;
          S.pins = [];
          S._pinsPageKey = getPageKey();
          S.pendingPanelPinOpen = null;
          scheduleRenderPinsAfterLayout();
          return;
        }
        S.discussionId = id;
        return loadComments(id).then(applyLoadedPins);
      }).catch(function (e) {
        console.warn('[RHACS Comments] load failed:', e.message);
        // Transient failures (timeout, network, metadata race) must not wipe loaded pins.
        if (S.pins.length === 0) scheduleRenderPinsAfterLayout();
        S.pendingPanelPinOpen = null;
      });
  }

  function loadAndRender() {
    // GitHub-authenticated users always load from Discussions (includes guest posts via worker).
    if (prioritizeGitHubAuth()) return loadFromGitHub();

    // Share-mode / guest path: localStorage only.
    restoreShareGuestSession();
    if (S.guestMode || (isShareMode() && Auth.loadGuestPins().length > 0)) {
      loadGuestPinsIntoState();
      S._pinsPageKey = getPageKey();
    } else {
      S.pins = [];
      S._pinsPageKey = null;
    }
    if (Overlay.pinLayerEl) scheduleRenderPinsAfterLayout();
    if (FAB.badge) FAB.updateBadge();
    return Promise.resolve();
  }

  // ── Ghost preview pin (temporary dot while "Add comment" popup is open) ─────
  var GhostPin = {
    el: null,
    show: function (clientX, clientY) {
      if (!this.el) {
        this.el = el('div', { className: 'rhacs-ghost-pin' });
        rhacsMount().appendChild(this.el);
      }
      this.el.style.left = clientX + 'px';
      this.el.style.top = clientY + 'px';
    },
    hide: function () {
      if (this.el) {
        this.el.parentNode && this.el.parentNode.removeChild(this.el);
        this.el = null;
      }
    }
  };

  // ── Overlay ───────────────────────────────────────────────────────────────────
  // Strategy: root stays on document.body with position:fixed (full viewport,
  // zero layout impact). Pins use position:fixed with viewport-pixel coords
  // recomputed on every scroll/resize, so they always sit over the right content
  // regardless of which element is the scroll container.
  var Overlay = {
    root: null,
    overlayEl: null,
    pinLayerEl: null,
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

      // Separate pin layer appended directly to <body> so pins are in the
      // document flow and follow the browser's rubber-band overscroll bounce.
      this.pinLayerEl = el('div', { id: 'rhacs-pin-layer' });
      document.body.appendChild(this.pinLayerEl);

      window.addEventListener('resize', function () { Overlay.refresh(); });
      // Use capturing scroll so we catch scroll on any nested element
      document.addEventListener('scroll', function () { Overlay.onScroll(); }, true);

      // Re-render after fonts/images load — they change document height.
      window.addEventListener('load', function () {
        if (Overlay.pinLayerEl) Overlay.refresh();
      });

      startLayoutSettleObserver();

      // Re-render modal pins when dialogs appear/disappear in the DOM
      Overlay._modalObserver = new MutationObserver(function () {
        if (hasModalPins()) Overlay.renderPins();
      });
      Overlay._modalObserver.observe(document.body, { childList: true, subtree: true });

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
      // Reposition popup next to its pin if open — never auto-close on scroll
      // (a pin can be briefly missing during re-render or marked hidden off-screen).
      if (S.activePinId && Popup.el && Popup._isPopupVisible()) {
        var pinEl = Overlay.pinLayerEl.querySelector('[data-pin-id="' + S.activePinId + '"]');
        if (pinEl && pinEl.style.visibility !== 'hidden') {
          var r = pinEl.getBoundingClientRect();
          Popup.positionFixed(r.right + 4, r.top);
        }
      }
    },

    handleClick: function (e) {
      if (!S.commentMode) return;
      if (e.target.closest && (e.target.closest('.rhacs-pin') || e.target.closest('#rhacs-popup'))) return;

      // If popup is open with unsaved input, shake it and block the new-pin action
      if (Popup.el && Popup._isPopupVisible() && !Popup.el.contains(e.target)) {
        var hasUnsaved = Popup._hasUnsavedInput();
        if (hasUnsaved) {
          e.stopPropagation();
          Popup.el.classList.remove('rhacs-popup--shake');
          void Popup.el.offsetWidth;
          Popup.el.classList.add('rhacs-popup--shake');
          Popup.el.addEventListener('animationend', function removeShake() {
            Popup.el.removeEventListener('animationend', removeShake);
            // Explicitly cancel animation on compositor BEFORE removing class
            Popup.el.style.animation = 'none';
            requestAnimationFrame(function () {
              Popup.el.classList.remove('rhacs-popup--shake');
              requestAnimationFrame(function () {
                Popup.el.style.animation = '';
              });
            });
          });
          return;
        }
      }

      e.stopPropagation(); // prevent the document click-outside handler from firing redundantly
      var ci = containerInfo();
      var x = ((e.clientX - ci.clientLeft + ci.scrollLeft) / Math.max(ci.scrollWidth,  1)) * 100;
      var y = ((e.clientY - ci.clientTop  + ci.scrollTop)  / Math.max(ci.scrollHeight, 1)) * 100;
      var popupX = e.clientX;
      var popupY = e.clientY;
      var modalMeta = null;

      var modalEl = e.target.closest && e.target.closest('[role="dialog"], .pf-v6-c-modal-box, .pf-c-modal-box');
      if (modalEl) {
        var mr = modalEl.getBoundingClientRect();
        var modalX = ((e.clientX - mr.left) / Math.max(mr.width,  1)) * 100;
        var modalY = ((e.clientY - mr.top)  / Math.max(mr.height, 1)) * 100;
        var modalTitle = getModalHeadingText(modalEl);
        var openerBtn = findModalOpenerButton(modalTitle, null);
        modalMeta = {
          modalTitle: modalTitle,
          modalX: modalX,
          modalY: modalY,
          modalOpener: openerBtn
            ? (openerBtn.textContent || openerBtn.getAttribute('aria-label') || '').trim().slice(0, 50)
            : '',
        };
        popupX = mr.left + (modalX / 100) * mr.width;
        popupY = mr.top  + (modalY / 100) * mr.height;
      }

      GhostPin.show(e.clientX, e.clientY);
      Popup.showNewForm(x, y, popupX, popupY, modalMeta);
    },

    renderPins: function () {
      // Clear existing pins from the document-flow pin layer
      this.pinLayerEl.querySelectorAll('.rhacs-pin').forEach(function (p) { p.remove(); });
      var curState = detectViewState();
      // Capture window scroll once per render — pin layer is position:absolute in
      // the document, so we convert viewport coords → document coords by adding scrollX/Y.
      var winScrollX = window.scrollX || window.pageXOffset || 0;
      var winScrollY = window.scrollY || window.pageYOffset || 0;
      S.pins.forEach(function (pin) {
        if (!pin.meta) return;
        // Only show pins that match the current view state.
        // Legacy pins without viewState are shown in both states.
        var pinState = pin.meta.viewState;
        if (pinState && pinState !== curState) return;
        var isModalPin = !!(pin.meta.modalTitle && pin.meta.modalX != null && pin.meta.modalY != null);
        var vp;
        if (isModalPin) {
          vp = modalPinToViewport(pin.meta);
          if (!vp) return; // modal closed — hide pin until modal reopens
        } else {
          vp = pinToViewport(pin.meta);
        }
        var isUnread   = isPinUnread(pin);
        var isResolved = pin.meta.resolved;
        // Resolved pins are hidden by default; only shown when the panel toggle is on
        if (isResolved && !S.showResolved) return;
        var isRead = !isUnread && !isResolved;
        var replyCount = (pin.replies || []).length;
        // Total visible thread depth: root post + replies
        var threadCount = 1 + replyCount;
        var cls = 'rhacs-pin' +
          (isModalPin ? ' rhacs-pin--modal' : '') +
          (isResolved ? ' rhacs-pin--resolved' : '') +
          (isUnread   ? ' rhacs-pin--unread'   : '') +
          (isRead     ? ' rhacs-pin--read'     : '');
        var pinEl = el('div', { className: cls, 'data-pin-id': pin.id });
        if (isResolved) {
          // Replace initials with a checkmark badge
          var checkSpan = el('span', { className: 'rhacs-pin__checkmark' });
          checkSpan.appendChild(txt('✓'));
          pinEl.appendChild(checkSpan);
        } else {
          pinEl.appendChild(txt(pinInitials(pin.author)));
          // Reply count badge — top-right, only when unread and thread has replies
          if (isUnread && replyCount > 0) {
            var countBadge = el('span', { className: 'rhacs-pin__count' });
            countBadge.appendChild(txt(String(threadCount)));
            pinEl.appendChild(countBadge);
          }
        }
        var replyLabel = replyCount > 0 ? (', ' + replyCount + ' ' + (replyCount === 1 ? 'reply' : 'replies')) : '';
        var stateLabel = isResolved ? ' · Resolved' : (isUnread ? ' · Unread' : ' · Read');
        pinEl.setAttribute('data-tip', (pin.author ? pin.author.login : 'Guest') + stateLabel + replyLabel + ' — click to view');
        if (isModalPin) {
          // Fixed viewport coords — track modal position while open
          pinEl.style.position  = 'fixed';
          pinEl.style.zIndex    = '10010';
          pinEl.style.left      = vp.left + 'px';
          pinEl.style.top       = vp.top + 'px';
          pinEl.style.visibility = 'visible';
        } else {
          // Document-pixel position: viewport coords + window scroll offset.
          // Because #rhacs-pin-layer is position:absolute in the document, these
          // document coordinates make pins move with page content including the
          // browser's rubber-band overscroll bounce on macOS Chrome/Safari.
          pinEl.style.left       = (vp.left + winScrollX) + 'px';
          pinEl.style.top        = (vp.top  + winScrollY) + 'px';
          pinEl.style.visibility = vp.visible ? 'visible' : 'hidden';
        }
        pinEl.addEventListener('click', function (e) {
          e.stopPropagation();
          Popup.showThread(pin.id);
        });
        Overlay.pinLayerEl.appendChild(pinEl);
      });
      ensureModalPinRefresh();
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
        document.body.classList.add('rhacs-comment-mode-active');
        rhacsMount().classList.add('rhacs-comment-mode');
      } else {
        this.overlayEl.classList.remove('rhacs-overlay--active');
        document.body.style.cursor = '';
        document.body.classList.remove('rhacs-comment-mode-active');
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

  var Lightbox = {
    _escHandler: null,

    show: function (url) {
      var self = this;
      var overlay = document.createElement('div');
      overlay.id = 'rhacs-lightbox';

      var img = document.createElement('img');
      img.src = url;
      img.className = 'rhacs-lb-img';
      img.style.cssText = 'display:block;max-width:90vw;max-height:90vh;object-fit:contain;border-radius:6px;box-shadow:0 8px 40px rgba(0,0,0,0.6);pointer-events:none;box-sizing:border-box;';

      var closeBtn = document.createElement('button');
      closeBtn.className = 'rhacs-lb-close';
      closeBtn.setAttribute('aria-label', 'Close');
      closeBtn.textContent = '\xd7';
      closeBtn.addEventListener('click', function (e) { e.stopPropagation(); self.close(); });

      overlay.addEventListener('click', function (e) {
        e.stopPropagation();
        if (e.target === overlay) self.close();
      });

      overlay.appendChild(img);
      overlay.appendChild(closeBtn);
      document.body.appendChild(overlay);

      this._escHandler = function (e) {
        if (e.key === 'Escape') self.close();
      };
      document.addEventListener('keydown', this._escHandler);
    },

    close: function () {
      var existing = document.getElementById('rhacs-lightbox');
      if (existing) existing.parentNode.removeChild(existing);
      if (this._escHandler) {
        document.removeEventListener('keydown', this._escHandler);
        this._escHandler = null;
      }
    },
  };

  // ── SelectionPopup ────────────────────────────────────────────────────────────
  var SelectionPopup = {
    _el: null,
    _text: '',
    _rect: null,

    init: function () {
      var self = this;
      document.addEventListener('mouseup', function (e) {
        setTimeout(function () { self._onMouseUp(e); }, 20);
      });
      document.addEventListener('mousedown', function (e) {
        if (self._el && !self._el.contains(e.target)) self.hide();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') self.hide();
      });
    },

    _onMouseUp: function (e) {
      if (S.commentMode) { this.hide(); return; }
      var sel = window.getSelection && window.getSelection();
      var text = sel ? sel.toString().trim() : '';
      if (!text || text.length < 2) { this.hide(); return; }
      var range;
      try { range = sel.getRangeAt(0); } catch (_) { this.hide(); return; }
      var mount = rhacsMount();
      if (mount && mount.contains(range.commonAncestorContainer)) { this.hide(); return; }
      this._text = text;
      this._rect = range.getBoundingClientRect();
      this._show();
    },

    _show: function () {
      this.hide();
      var self = this;
      var panel = document.createElement('div');
      panel.id = 'rhacs-sel-popup';
      panel.className = 'rhacs-sel-popup';

      var addBtn = document.createElement('button');
      addBtn.className = 'rhacs-sel-popup__item';
      addBtn.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="M2 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H7l-4 3V4z"/></svg>' +
        '<span>Add comment</span>';
      addBtn.addEventListener('mousedown', function (e) { e.preventDefault(); e.stopPropagation(); });
      addBtn.addEventListener('click', function (e) { e.stopPropagation(); self._addComment(); });

      var copyBtn = document.createElement('button');
      copyBtn.className = 'rhacs-sel-popup__item';
      copyBtn.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="M8 2a1 1 0 0 0 0 2h1v1H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4V4h1a1 1 0 1 0 0-2H8zm3 4h2a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h2V4h4v2z"/></svg>' +
        '<span>Copy text</span>';
      copyBtn.addEventListener('mousedown', function (e) { e.preventDefault(); e.stopPropagation(); });
      copyBtn.addEventListener('click', function (e) { e.stopPropagation(); self._copy(); });

      panel.appendChild(addBtn);
      panel.appendChild(copyBtn);

      // Render off-screen first so we can measure actual dimensions
      panel.style.visibility = 'hidden';
      panel.style.top = '-9999px';
      panel.style.left = '-9999px';
      document.body.appendChild(panel);
      this._el = panel;

      var pw = panel.offsetWidth || 164;
      var ph = panel.offsetHeight || 80;
      var rect = this._rect;
      var vw = window.innerWidth;
      var vh = window.innerHeight;
      var margin = 8;

      // Prefer above the selection; flip below if too close to top
      var idealTop = rect.top - ph - margin;
      var top = idealTop >= margin ? idealTop : rect.bottom + margin;
      // Clamp vertically so it never goes off-screen
      top = Math.max(margin, Math.min(vh - ph - margin, top));

      // Center horizontally on the selection; clamp to viewport edges
      var idealLeft = rect.left + rect.width / 2 - pw / 2;
      var left = Math.max(margin, Math.min(vw - pw - margin, idealLeft));

      panel.style.top = top + 'px';
      panel.style.left = left + 'px';
      panel.style.visibility = '';
    },

    hide: function () {
      if (this._el) {
        this._el.parentNode && this._el.parentNode.removeChild(this._el);
        this._el = null;
      }
    },

    _addComment: function () {
      var text = this._text;
      var rect = this._rect;
      this.hide();
      window.getSelection && window.getSelection().removeAllRanges();
      var ci = containerInfo();
      var x = ((rect.left + rect.width / 2 - ci.clientLeft + ci.scrollLeft) / Math.max(ci.scrollWidth, 1)) * 100;
      var y = ((rect.bottom - ci.clientTop + ci.scrollTop) / Math.max(ci.scrollHeight, 1)) * 100;
      x = Math.max(1, Math.min(99, x));
      y = Math.max(1, Math.min(99, y));
      var clientX = rect.left + rect.width / 2;
      var clientY = rect.bottom + 8;
      GhostPin.show(clientX, clientY);
      Popup.showNewForm(x, y, clientX, clientY, null);
      Popup.setQuote(text);
    },

    _copy: function () {
      var text = this._text;
      this.hide();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          Notify.toast('Copied to clipboard');
        }).catch(function () { SelectionPopup._copyFallback(text); });
      } else {
        this._copyFallback(text);
      }
    },

    _copyFallback: function (text) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); Notify.toast('Copied to clipboard'); } catch (_) {}
      document.body.removeChild(ta);
    },
  };

  // ── Screenshot capture (drag-to-select + snapdom) ─────────────────────────────
  function _loadSnapdom(cb) {
    if (window.snapdom) return cb();
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@zumer/snapdom@2.12.8/dist/snapdom.js';
    s.onload = cb;
    s.onerror = function () { console.warn('snapdom failed to load'); cb(); };
    document.head.appendChild(s);
  }

  var ScreenshotCapture = {
    _attachment: null,
    _thumbContainer: null,
    _overlay: null,
    _active: false,
    _escHandler: null,

    _mountPrevVisibility: null,

    _hideMountNow: function () {
      var m = document.getElementById('rhacs-mount');
      if (m) {
        ScreenshotCapture._mountPrevVisibility = m.style.visibility;
        m.style.visibility = 'hidden';
      }
    },

    _showCapturingBadge: function () {
      if (document.getElementById('rhacs-capture-status')) return;
      var badge = document.createElement('div');
      badge.id = 'rhacs-capture-status';
      badge.innerHTML = 'Capturing<span class="rhacs-capture-dots"><span>.</span><span>.</span><span>.</span></span>';
      badge.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.72);color:#fff;padding:12px 28px;border-radius:24px;font-size:15px;font-family:inherit;z-index:200000;pointer-events:none;display:flex;align-items:center;gap:2px;letter-spacing:0.01em;';
      document.body.appendChild(badge);
    },

    _restoreMount: function () {
      var m = document.getElementById('rhacs-mount');
      if (m) m.style.visibility = ScreenshotCapture._mountPrevVisibility || '';
      ScreenshotCapture._mountPrevVisibility = null;
      var badge = document.getElementById('rhacs-capture-status');
      if (badge && badge.parentNode) badge.parentNode.removeChild(badge);
    },

    start: function (onDone) {
      if (ScreenshotCapture._active) return;
      ScreenshotCapture._active = true;

      // Hide the comment window immediately so it doesn't appear while the user is selecting
      ScreenshotCapture._hideMountNow();

      var overlay = document.createElement('div');
      overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;cursor:crosshair;background:rgba(0,0,0,0.3);';

      var selBox = document.createElement('div');
      selBox.style.cssText = 'position:fixed;border:2px solid #4a90d9;background:rgba(74,144,217,0.1);pointer-events:none;display:none;';
      overlay.appendChild(selBox);

      var hint = document.createElement('div');
      hint.textContent = 'Drag to select · Esc to cancel';
      hint.style.cssText = 'position:fixed;top:16px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.6);color:#fff;padding:6px 16px;border-radius:20px;font-size:13px;pointer-events:none;z-index:100000;';
      overlay.appendChild(hint);

      document.body.appendChild(overlay);
      ScreenshotCapture._overlay = overlay;

      var escHandler = function (e) {
        if (e.key === 'Escape') {
          e.stopImmediatePropagation();
          ScreenshotCapture._cancel(true);
        }
      };
      document.addEventListener('keydown', escHandler, true);
      ScreenshotCapture._escHandler = escHandler;

      var startX = 0;
      var startY = 0;
      var dragging = false;

      function updateBox(x1, y1, x2, y2) {
        var left = Math.min(x1, x2);
        var top = Math.min(y1, y2);
        var width = Math.abs(x2 - x1);
        var height = Math.abs(y2 - y1);
        selBox.style.left = left + 'px';
        selBox.style.top = top + 'px';
        selBox.style.width = width + 'px';
        selBox.style.height = height + 'px';
      }

      overlay.addEventListener('mousedown', function (e) {
        if (e.button !== 0) return;
        dragging = true;
        startX = e.clientX;
        startY = e.clientY;
        selBox.style.display = 'block';
        updateBox(startX, startY, startX, startY);
        e.preventDefault();
      });

      overlay.addEventListener('mousemove', function (e) {
        if (!dragging) return;
        updateBox(startX, startY, e.clientX, e.clientY);
      });

      overlay.addEventListener('mouseup', function (e) {
        if (!dragging) return;
        dragging = false;
        var selX = Math.min(startX, e.clientX);
        var selY = Math.min(startY, e.clientY);
        var selW = Math.abs(e.clientX - startX);
        var selH = Math.abs(e.clientY - startY);
        if (selW > 10 && selH > 10) {
          ScreenshotCapture._cancel(false); // remove overlay, keep mount hidden
          ScreenshotCapture._showCapturingBadge(); // show badge NOW between selection done and window returning
          ScreenshotCapture._capture(selX, selY, selW, selH, onDone);
        } else {
          ScreenshotCapture._cancel(true); // remove overlay AND restore mount
        }
      });
    },

    _cancel: function (restoreMount) {
      if (ScreenshotCapture._overlay && ScreenshotCapture._overlay.parentNode) {
        ScreenshotCapture._overlay.parentNode.removeChild(ScreenshotCapture._overlay);
      }
      ScreenshotCapture._overlay = null;
      ScreenshotCapture._active = false;
      if (ScreenshotCapture._escHandler) {
        document.removeEventListener('keydown', ScreenshotCapture._escHandler, true);
        ScreenshotCapture._escHandler = null;
      }
      // Restore the comment window if cancelled (Escape or tiny selection)
      if (restoreMount) ScreenshotCapture._restoreMount();
    },

    _capture: function (selX, selY, selW, selH, onDone) {
      function finish() {
        ScreenshotCapture._active = false;
        if (onDone) onDone();
      }

      _loadSnapdom(function () {
        if (!window.snapdom) {
          console.warn('snapdom did not load');
          finish();
          return;
        }
        (async function () {
          var rhacsMount = document.getElementById('rhacs-mount');
          try {
            // Hide the "Capturing…" badge so it doesn't appear in the screenshot
            var captureBadge = document.getElementById('rhacs-capture-status');
            if (captureBadge) captureBadge.style.visibility = 'hidden';

            // Wait two frames so the overlay removal + badge hide repaints before snapdom reads the DOM
            await new Promise(function (r) { requestAnimationFrame(function () { requestAnimationFrame(r); }); });

            // Capture the full visible document at CSS-pixel scale.
            var result = await window.snapdom(document.documentElement, {});

            // Restore badge visibility (will be removed by _restoreMount shortly)
            if (captureBadge) captureBadge.style.visibility = '';

            // Restore the comment window immediately — don't wait for canvas decode
            ScreenshotCapture._restoreMount();

            // Resolve to a canvas
            var fullCanvas;
            if (typeof result.toCanvas === 'function') {
              fullCanvas = await result.toCanvas();
            } else {
              var rawUrl = typeof result.toDataURL === 'function' ? result.toDataURL()
                         : typeof result === 'string' ? result : null;
              if (!rawUrl) { finish(); return; }
              fullCanvas = await new Promise(function (resolve) {
                var img = new Image();
                img.onload = function () {
                  var c = document.createElement('canvas');
                  c.width = img.naturalWidth; c.height = img.naturalHeight;
                  c.getContext('2d').drawImage(img, 0, 0);
                  resolve(c);
                };
                img.onerror = function () { resolve(null); };
                img.src = rawUrl;
              });
            }
            if (!fullCanvas) { finish(); return; }

            // The canvas is CSS-pixel scale (1 : 1 with the viewport).
            // selection coords (selX/selY) are viewport-relative client coords.
            // For PatternFly the document doesn't scroll (inner containers scroll),
            // so window.scrollX/Y are both 0 and we can crop directly at selX/selY.
            var dpr = window.devicePixelRatio || 1;
            // snapdom may output at device pixel scale when dpr > 1.
            // Detect by comparing canvas width to viewport width.
            var vw = window.innerWidth;
            var vh = window.innerHeight;
            var scale = fullCanvas.width / vw;  // 1 for CSS-px, dpr for physical-px

            var srcX = Math.round(selX * scale);
            var srcY = Math.round(selY * scale);
            var srcW = Math.round(selW * scale);
            var srcH = Math.round(selH * scale);

            // Clamp
            srcX = Math.max(0, Math.min(srcX, fullCanvas.width  - 1));
            srcY = Math.max(0, Math.min(srcY, fullCanvas.height - 1));
            srcW = Math.min(srcW, fullCanvas.width  - srcX);
            srcH = Math.min(srcH, fullCanvas.height - srcY);

            var cropCanvas = document.createElement('canvas');
            cropCanvas.width  = srcW;
            cropCanvas.height = srcH;
            cropCanvas.getContext('2d').drawImage(
              fullCanvas, srcX, srcY, srcW, srcH, 0, 0, srcW, srcH
            );

            // Downscale to max 800px wide — keeps size reasonable while keeping text readable.
            // Use PNG so text stays crisp (JPEG compression blurs fine text).
            var MAX_W = 800;
            var outCanvas = cropCanvas;
            if (srcW > MAX_W) {
              var ratio = MAX_W / srcW;
              outCanvas = document.createElement('canvas');
              outCanvas.width  = MAX_W;
              outCanvas.height = Math.round(srcH * ratio);
              outCanvas.getContext('2d').drawImage(cropCanvas, 0, 0, outCanvas.width, outCanvas.height);
            }

            ScreenshotCapture._attachment = {
              dataUrl: outCanvas.toDataURL('image/png'),
              filename: 'screenshot.png'
            };
          } catch (err) {
            console.warn('snapdom capture failed', err);
            ScreenshotCapture._restoreMount();
          }
          finish();
        })();
      });
    },

    renderThumbnail: function (container) {
      ScreenshotCapture._thumbContainer = container;
      container.innerHTML = '';
      if (!ScreenshotCapture._attachment) return;
      var dataUrl = ScreenshotCapture._attachment.dataUrl;

      var wrap = document.createElement('div');
      wrap.className = 'rhacs-sc-thumb';

      var img = document.createElement('img');
      // Explicit inline styles so PatternFly global img rules can't override
      img.style.cssText = 'display:block;width:80px;height:60px;object-fit:cover;border-radius:4px;border:1px solid #ccc;cursor:zoom-in;box-sizing:border-box;';
      img.alt = '';
      img.title = 'Click to preview';
      img.src = dataUrl;

      // Click thumbnail → open lightbox preview
      img.addEventListener('click', function (e) {
        e.stopPropagation();
        Lightbox.show(dataUrl);
      });

      var removeBtn = document.createElement('button');
      removeBtn.className = 'rhacs-sc-thumb-remove';
      removeBtn.textContent = '\u00d7';
      removeBtn.setAttribute('aria-label', 'Remove screenshot');
      removeBtn.type = 'button';
      removeBtn.onclick = function (e) {
        e.stopPropagation();
        ScreenshotCapture.reset();
        container.innerHTML = '';
      };

      wrap.appendChild(img);
      wrap.appendChild(removeBtn);
      container.appendChild(wrap);
    },

    reset: function () {
      this._cancel();
      this._attachment = null;
      if (this._thumbContainer) this._thumbContainer.innerHTML = '';
    },

    getAttachment: function () { return this._attachment; }
  };

  // ── Popup ─────────────────────────────────────────────────────────────────────
  var Popup = {
    el: null,
    _ro: null,
    _newFormSubmitGen: 0,
    _suppressOutsideDismissUntil: 0,
    _showPopupEl: function () {
      this.el.style.setProperty('display', 'flex', 'important');
      this.el.style.visibility = '';
    },
    _hidePopupEl: function () {
      this.el.style.setProperty('display', 'none', 'important');
    },
    _isPopupVisible: function () {
      return this.el && this.el.style.getPropertyValue('display') !== 'none';
    },
    _abortNewFormSubmit: function () {
      this._newFormSubmitGen += 1;
    },
    suppressOutsideDismiss: function (ms) {
      Popup._suppressOutsideDismissUntil = Date.now() + (ms || 400);
    },
    keepOpenAfterAction: function (fn) {
      Popup.suppressOutsideDismiss(500);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          fn();
          Popup.suppressOutsideDismiss(350);
        });
      });
    },
    init: function () {
      this.el = el('div', { className: 'rhacs-popup', id: 'rhacs-popup' });
      this._hidePopupEl();
      rhacsMount().appendChild(this.el);
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') Popup.close(); });
      // Auto-reposition whenever the popup grows or shrinks
      if (window.ResizeObserver) {
        this._ro = new ResizeObserver(function () {
          if (Popup._isPopupVisible()) Popup.reposition();
        });
        this._ro.observe(this.el);
      }
    },
    close: function () {
      // Explicit close/cancel must always work — never blocked by outside-dismiss suppress
      this._suppressOutsideDismissUntil = 0;
      this._abortNewFormSubmit();
      this._hidePopupEl();
      this.el.classList.remove('rhacs-popup--modal');
      S.activePinId = null;
      this._newFormQuote = null;
      ScreenshotCapture.reset();
      GhostPin.hide();
    },
    _resetReplyPostBtn: function () {
      if (!this.el) return;
      var btn = this.el.querySelector('.rhacs-reply-form .pf-m-primary');
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Post';
      }
    },
    _newFormQuote: null,
    _getNewFormEditor: function () {
      return this.el && this.el.querySelector('.rhacs-popup__editor-input');
    },
    _getNewFormEditorContainer: function () {
      return this.el && this.el.querySelector('.rhacs-popup__editor');
    },
    _getNewFormReplyText: function () {
      var editor = this._getNewFormEditor();
      if (!editor) return '';
      return (editor.innerText || editor.textContent || '').trim();
    },
    _getNewFormSubmitText: function () {
      var reply = this._getNewFormReplyText();
      if (this._newFormQuote) {
        var quoteLine = '> ' + this._newFormQuote;
        return reply ? quoteLine + '\n\n' + reply : quoteLine;
      }
      return reply;
    },
    _focusNewFormEditor: function () {
      var editor = this._getNewFormEditor();
      if (!editor) return;
      editor.focus();
      if (window.getSelection && document.createRange) {
        var range = document.createRange();
        range.selectNodeContents(editor);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
    },
    setQuote: function (text) {
      if (!text || !String(text).trim()) return;
      this._newFormQuote = String(text).replace(/\n+/g, ' ').trim();
      var container = this._getNewFormEditorContainer();
      if (!container) return;
      var existing = container.querySelector('.rhacs-popup__quote-block');
      if (existing) existing.remove();
      var quoteBlock = el('div', { className: 'rhacs-popup__quote-block', contenteditable: 'false' });
      quoteBlock.appendChild(txt(this._newFormQuote));
      var editor = this._getNewFormEditor();
      if (editor) {
        container.insertBefore(quoteBlock, editor);
      } else {
        container.appendChild(quoteBlock);
      }
      this._focusNewFormEditor();
    },
    _hasUnsavedNewFormInput: function () {
      if (this._getNewFormReplyText()) return true;
      if (this._newFormQuote) return true;
      if (ScreenshotCapture.getAttachment()) return true;
      return false;
    },
    _hasUnsavedInput: function () {
      if (!this.el) return false;
      if (this.el.querySelector('.rhacs-popup__editor-input')) {
        return this._hasUnsavedNewFormInput();
      }
      return Array.from(this.el.querySelectorAll('textarea')).some(function (ta) {
        return ta.value.trim().length > 0;
      });
    },
    _setModalElevated: function (elevated) {
      this.el.classList.toggle('rhacs-popup--modal', !!elevated);
    },
    _anchorX: 0,
    _anchorY: 0,
    positionFixed: function (clientX, clientY) {
      this._anchorX = clientX;
      this._anchorY = clientY;
      var popupEl = this.el;
      var margin = 12;
      var panelOpen = rhacsMount().classList.contains('rhacs-panel-open');
      var panelW    = panelOpen ? 320 : 0;
      var vw = window.innerWidth - panelW, vh = window.innerHeight;
      Popup._showPopupEl();
      // Let CSS enforce max-height (set via !important) — never touch it in JS

      function applyPos(top, left) {
        if (Popup._ro) Popup._ro.disconnect();
        var maxAvail = vh - 2 * margin;

        // Clamp top so popup fits within viewport (CSS max-height caps the height)
        top  = Math.min(top, vh - margin - Math.min(popupEl.offsetHeight || 400, maxAvail));
        top  = Math.max(margin, top);
        left = Math.min(Math.max(margin, left), vw - (popupEl.offsetWidth || 320) - margin);

        popupEl.style.top        = top  + 'px';
        popupEl.style.left       = left + 'px';
        popupEl.style.visibility = '';

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
          left = Math.min(Math.max(margin, left), vw - pw - margin);
          applyPos(clientY, left);
        });
      } else {
        var pw = popupEl.offsetWidth || 320;
        var left = clientX + margin;
        // Flip to the left side if it overflows the right edge
        if (left + pw > vw - margin) left = clientX - pw - margin;
        // Clamp: never go off the left or right edge
        left = Math.min(Math.max(margin, left), vw - pw - margin);
        applyPos(clientY, left);
      }
    },
    reposition: function () {
      var popupEl = this.el;
      if (!popupEl || !Popup._isPopupVisible() || popupEl.style.visibility === 'hidden') return;
      var margin    = 12;
      var panelOpen = rhacsMount().classList.contains('rhacs-panel-open');
      var vh = window.innerHeight;
      var vw = window.innerWidth - (panelOpen ? 300 : 0);
      var maxAvail = vh - 2 * margin;

      // CSS flex layout owns max-height + overflow — never override in JS
      if (Popup._ro) Popup._ro.disconnect();
      popupEl.style.maxHeight = '';
      popupEl.style.overflowY = '';

      // Use rendered height (CSS-capped), not scrollHeight (full thread content)
      var visibleH = popupEl.offsetHeight || Math.min(popupEl.scrollHeight, maxAvail);
      var visibleW = popupEl.offsetWidth;
      var curTop   = parseFloat(popupEl.style.top)  || 0;
      var curLeft  = parseFloat(popupEl.style.left) || 0;

      var idealTop = Math.min(curTop, vh - margin - visibleH);
      idealTop = Math.max(margin, idealTop);

      var idealLeft = curLeft;
      if (curLeft + visibleW > vw - margin) {
        idealLeft = vw - margin - visibleW;
      }
      idealLeft = Math.max(margin, idealLeft);

      popupEl.style.top  = idealTop  + 'px';
      popupEl.style.left = idealLeft + 'px';

      requestAnimationFrame(function () {
        if (Popup._ro) Popup._ro.observe(popupEl);
      });
    },
    // Shared: build the "Take screenshot" toolbar + thumbnail strip.
    // Returns { toolbar, thumbsDiv } — toolbar goes above the textarea,
    // thumbsDiv goes between toolbar and textarea (same layout everywhere).
    _buildScreenshotUI: function () {
      var thumbsDiv = el('div', { className: 'rhacs-sc-thumbs' });
      var toolbar   = el('div', { className: 'rhacs-popup__toolbar' });
      var cameraBtn = el('button', { className: 'rhacs-sc-camera-btn', type: 'button' });
      cameraBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;vertical-align:-3px"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><circle cx="12" cy="14" r="3"/></svg>Take screenshot';
      cameraBtn.setAttribute('aria-label', 'Take screenshot');
      cameraBtn.title = 'Take screenshot';
      cameraBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        Popup.suppressOutsideDismiss(60000);
        ScreenshotCapture.start(function () {
          Popup.suppressOutsideDismiss(500);
          ScreenshotCapture.renderThumbnail(thumbsDiv);
          Popup.reposition();
        });
      });
      append(toolbar, cameraBtn);
      return { toolbar: toolbar, thumbsDiv: thumbsDiv };
    },

    showNewForm: function (x, y, clientX, clientY, modalMeta) {
      S.activePinId = null;
      Popup._pendingModalMeta = modalMeta || null;
      Popup._setModalElevated(!!(modalMeta && modalMeta.modalTitle));
      this.el.innerHTML = '';
      this._newFormQuote = null;
      ScreenshotCapture.reset();

      var header = el('div', { className: 'rhacs-popup__header' });
      var titleEl = el('span', { className: 'rhacs-popup__title' });
      titleEl.appendChild(txt('Add comment'));
      var closeBtn = el('button', { className: 'pf-v6-c-button pf-m-plain rhacs-popup__close' });
      closeBtn.setAttribute('aria-label', 'Close');
      closeBtn.appendChild(txt('×'));
      closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        Popup.close();
      });
      append(header, titleEl, closeBtn);

      var scUI = Popup._buildScreenshotUI();
      var toolbar   = scUI.toolbar;
      var thumbsDiv = scUI.thumbsDiv;

      var editorContainer = el('div', { className: 'rhacs-popup__editor' });
      var editorInput = el('div', {
        className: 'rhacs-popup__editor-input',
        contenteditable: 'true',
        'data-placeholder': 'Leave a comment\u2026',
        role: 'textbox',
        'aria-multiline': 'true'
      });
      append(editorContainer, editorInput);

      // Clicking anywhere in the container (empty space below text) focuses the input
      editorContainer.addEventListener('click', function (e) {
        if (e.target === editorContainer) editorInput.focus();
      });

      var inputError = el('div', { className: 'rhacs-popup__input-error' });
      inputError.appendChild(txt('Comment can\u2019t be empty'));

      editorInput.addEventListener('input', function () {
        if (Popup._getNewFormReplyText()) {
          editorContainer.classList.remove('rhacs-popup__editor--error');
          inputError.style.display = 'none';
        }
      });
      editorInput.addEventListener('paste', function (e) {
        e.preventDefault();
        var clip = e.clipboardData || window.clipboardData;
        var plain = clip && clip.getData('text/plain');
        if (plain != null && document.execCommand) {
          document.execCommand('insertText', false, plain);
        }
      });

      var actions = el('div', { className: 'rhacs-popup__actions' });
      var postBtn = el('button', { className: 'pf-v6-c-button pf-m-primary' });
      postBtn.appendChild(txt('Post'));
      postBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (!Popup._getNewFormReplyText()) {
          editorContainer.classList.add('rhacs-popup__editor--error');
          inputError.style.display = 'block';
          Popup._focusNewFormEditor();
          return;
        }
        postBtn.disabled = true;
        postBtn.textContent = 'Posting…';
        var submitGen = Popup._newFormSubmitGen;
        Popup.suppressOutsideDismiss(500);
        Popup.submitNew(Popup._getNewFormSubmitText(), x, y, submitGen);
      });

      var cancelBtn = el('button', { className: 'pf-v6-c-button pf-m-secondary', type: 'button' });
      cancelBtn.appendChild(txt('Cancel'));
      cancelBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        Popup.close();
      });

      append(actions, postBtn, cancelBtn);

      // Input area is sticky at the bottom; no scroll area needed for new form
      // (there are no comments to scroll — just the input)
      var stickyFooter = el('div', { className: 'rhacs-popup__sticky-footer' });
      append(stickyFooter, toolbar, thumbsDiv, editorContainer, inputError, actions);
      append(this.el, header, stickyFooter);

      this._showPopupEl();
      this.el.style.maxHeight = '';
      this.el.style.overflowY = '';
      this.positionFixed(clientX, clientY);
      Popup._focusNewFormEditor();
    },
    submitNew: function (text, x, y, submitGen) {
      text = text.trim();
      if (!text) return;
      var num = S.pins.length + 1;
      var modalMeta = Popup._pendingModalMeta || null;
      Popup._pendingModalMeta = null;
      var fullText = text;
      var attachment = ScreenshotCapture.getAttachment();
      if (attachment) fullText += '\n\n![screenshot](' + attachment.dataUrl + ')';
      Auth.requireAuth()
        .then(function () {
          if (submitGen !== Popup._newFormSubmitGen) return;
          GhostPin.hide();
          // Guest path: no GitHub token — POST via worker, show own pin from localStorage only.
          if (S.guestMode && !S.token) {
            var newPin = Auth.addGuestPin(fullText, x, y, num, modalMeta);
            loadGuestPinsIntoState();
            Overlay.renderPins();
            if (isShareMode() && newPin && newPin.id) {
              Popup.keepOpenAfterAction(function () { Popup.showThread(newPin.id); });
            } else {
              Popup.close();
            }
            Notify.toast('Comment submitted — thank you!');
          } else {
            // Optimistic: show pin immediately, sync in background
            var body = buildBody(x, y, num, fullText, null, modalMeta);
            var optimisticPin = {
              id: 'optimistic-' + Date.now(),
              body: body,
              createdAt: new Date().toISOString(),
              author: S.user,
              meta: parseMeta(body),
              replies: []
            };
            S.seenIds.add(optimisticPin.id);
            S.pins = S.pins.concat([optimisticPin]);
            Popup.close();
            Overlay.renderPins();
            Panel.render();
            FAB.updateBadge();
            return addPinComment(fullText, x, y, num, modalMeta)
              .then(function () { return loadAndRender(); })
              .catch(function (e) {
                // Rollback optimistic pin on failure
                S.pins = S.pins.filter(function (p) { return p.id !== optimisticPin.id; });
                Overlay.renderPins();
                Panel.render();
                Notify.toast('Failed to post: ' + e.message);
              });
          }
        })
        .catch(function (e) { if (e.message !== 'cancelled') Notify.toast('Failed: ' + e.message); });
    },
    showThread: function (pinId) {
      var pin = findPinById(pinId);
      if (!pin) return;
      pinId = pin.id;
      S.activePinId = pinId;

      Popup._setModalElevated(!!(pin.meta && pin.meta.modalTitle));

      // Auto-mark as read when the thread is opened — updates the pin's visual state
      var wasUnread = markPinAsSeen(pin);
      if (wasUnread) {
        Overlay.renderPins();
        FAB.updateBadge();
        if (Panel.el && Panel.el.classList.contains('rhacs-panel--open')) Panel.render();
      }

      this.el.innerHTML = '';
      var isProtoOwner = Auth.isPrototypeOwner();
      var _share = isShareMode();
      var isOwnComment = !!(S.user && pin.author && pin.author.login === S.user.login);
      var canDelete  = isProtoOwner || isOwnComment;
      var canResolve = isProtoOwner && !_share;

      // ── Level 1: conversation header with conversation-level kebab ──
      var header = el('div', { className: 'rhacs-popup__header' });
      var headerLeft = el('div', { className: 'rhacs-popup__header-left' });
      var avatar = makeAvatar(pin.author);
      var author = el('span', { className: 'rhacs-popup__author' });
      author.appendChild(txt(pin.author.login));
      var time = el('span', { className: 'rhacs-popup__time' });
      time.appendChild(txt(fmtDate(pin.createdAt)));
      append(headerLeft, avatar, author, time);

      // Conversation kebab: Delete (owner or own comment), Resolve/Unresolve (owner only), Mark as read/unread (all GitHub users)
      var pinTs   = new Date(pin.createdAt).getTime();
      var isUnread = isPinUnread(pin);
      var convKebab = Popup.makeKebab([
        canDelete && !_share ? { label: 'Delete thread', danger: true, action: function () { Popup.confirmDelete(pin.id); } } : null,
        canResolve ? { label: pin.meta.resolved ? 'Unresolve' : 'Resolve', action: function () { Popup.toggleResolve(pin); } } : null,
        !_share ? (isUnread
          ? { label: 'Mark as read', action: function () {
              markPinAsSeen(pin);
              Overlay.renderPins();
              FAB.updateBadge();
              Panel.render();
            }}
          : { label: 'Mark as unread', action: function () {
              S.seenIds.delete(pin.id);
              saveSeenIds();
              S.lastSeen = Math.min(S.lastSeen, pinTs - 1);
              saveLastSeen();
              S.unread = Math.max(1, S.unread);
              FAB.updateBadge();
              Overlay.renderPins();
              Panel.render();
            }}) : null
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
      fpTm.appendChild(txt(fmtDate(pin.createdAt)));
      append(fpHdr, fpAv, fpAu, fpTm);
      if (S.ghUser) {
        fpHdr.appendChild(Popup.makeCopyBtn(pinText(pin.body || '')));
      }
      if (isProtoOwner && !(S.guestMode && _share)) {
        var msgKebab = Popup.makeKebab([
          { label: 'Edit', action: function () { Popup.showEdit(pin, fpBody); } }
        ]);
        fpHdr.appendChild(msgKebab);
      }
      var fpBody = el('div', { className: 'rhacs-reply__body' });
      var extracted = extractImages(pin.body || '');
      if (extracted.text) fpBody.appendChild(txt(extracted.text));
      extracted.urls.forEach(function (imgUrl) {
        var imgEl = document.createElement('img');
        imgEl.className = 'rhacs-sc-inline-img';
        imgEl.src = imgUrl;
        imgEl.alt = 'Screenshot';
        imgEl.addEventListener('click', function () { Lightbox.show(imgUrl); });
        fpBody.appendChild(imgEl);
      });
      append(firstPost, fpHdr, fpBody);

      // Replies
      var repliesEl = el('div', { className: 'rhacs-replies' });
      (pin.replies || []).forEach(function (r) { repliesEl.appendChild(Popup.renderReply(r, pinId)); });

      // Reply form
      var replyForm = el('div', { className: 'rhacs-reply-form' });

      if (S.guestMode && pin._guest && isOwnComment) {
        // Guest on their own comment — allow follow-up replies via worker
        var replyArea = el('textarea', { className: 'pf-v6-c-form-control rhacs-popup__textarea rhacs-popup__textarea--reply', placeholder: 'Add a follow-up\u2026' });
        var replyError = el('div', { className: 'rhacs-popup__input-error' });
        replyError.appendChild(txt('Comment can\u2019t be empty'));
        replyArea.addEventListener('input', function () {
          if (replyArea.value.trim()) {
            replyArea.classList.remove('rhacs-popup__textarea--error');
            replyError.style.display = 'none';
          }
        });
        var rsc = Popup._buildScreenshotUI();
        var inputWrapper = el('div', { className: 'rhacs-reply-input-wrapper' });
        append(inputWrapper, rsc.toolbar, rsc.thumbsDiv, replyArea);
        var replyActions = el('div', { className: 'rhacs-btn-row' });
        var postBtn = el('button', { className: 'pf-v6-c-button pf-m-primary' });
        postBtn.appendChild(txt('Post'));
        postBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          e.preventDefault();
          if (!replyArea.value.trim()) {
            replyArea.classList.add('rhacs-popup__textarea--error');
            replyError.style.display = 'block';
            replyArea.focus();
            return;
          }
          var attachment = ScreenshotCapture.getAttachment();
          var replyText = replyArea.value.trim();
          if (attachment) replyText += '\n\n![screenshot](' + attachment.dataUrl + ')';
          var guestAuthor = S.user ? { login: S.user.login, name: S.user.name || S.user.login, avatarUrl: S.user.avatarUrl } : { login: 'Guest', name: 'Guest' };
          var authorTag = guestAuthor.name ? '\n\n\u2014 _' + guestAuthor.name + ' (guest)_' : '';
          var fullBody = replyText + authorTag;
          postBtn.disabled = true;
          postBtn.textContent = 'Posting\u2026';
          // Local display uses clean replyText — signature is metadata only for GitHub attribution
          var livePin = findPinById(pinId) || pin;
          var livePinId = livePin.id;
          var optimisticReply = { id: 'guest-reply-' + Date.now(), body: replyText, createdAt: new Date().toISOString(), author: guestAuthor };
          if (livePin.replies) livePin.replies.push(optimisticReply); else livePin.replies = [optimisticReply];
          var stored = Auth.loadGuestPins();
          var storedPin = findStoredGuestPin(stored, pinId);
          if (storedPin) storedPin.replies = livePin.replies;
          Auth.saveGuestPins(stored);
          replyArea.value = '';
          Popup.suppressOutsideDismiss(500);
          Popup.showThread(livePinId);
          Popup.keepOpenAfterAction(function () { Popup.showThread(livePinId); });
          var uploadGuestReply = function () {
            if (!String(livePinId).startsWith('guest-') && S.discussionId) {
              fetchWithTimeout(CFG.workerUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'guest_reply', commentId: livePinId, discussionId: S.discussionId, replyBody: fullBody })
              }).then(function (r) { return r.json(); }).then(function (data) {
                if (data && data.id) {
                  var st = Auth.loadGuestPins();
                  var stPin = findStoredGuestPin(st, livePinId);
                  if (stPin && stPin.replies) {
                    for (var ri = 0; ri < stPin.replies.length; ri++) {
                      if (stPin.replies[ri].id === optimisticReply.id) { stPin.replies[ri].id = data.id; break; }
                    }
                  }
                  Auth.saveGuestPins(st);
                }
              }).catch(function (e) {
                console.warn('[rhacs] Guest reply upload failed:', e && e.message);
                if (e && e.name === 'AbortError') Notify.toast('Reply timed out — please try again');
              }).finally(function () { Popup._resetReplyPostBtn(); });
            } else {
              Popup._resetReplyPostBtn();
            }
          };
          // Defer upload so keepOpenAfterAction can re-render the thread before large payload work
          setTimeout(uploadGuestReply, 0);
        });
        var guestCancelBtn = el('button', { className: 'pf-v6-c-button pf-m-secondary' });
        guestCancelBtn.appendChild(txt('Cancel'));
        guestCancelBtn.addEventListener('click', function () { Popup.close(); });
        append(replyActions, postBtn, guestCancelBtn);
        append(replyForm, inputWrapper, replyError, replyActions);
      } else if (!S.guestMode) {
        var replyArea = el('textarea', { className: 'pf-v6-c-form-control rhacs-popup__textarea rhacs-popup__textarea--reply', placeholder: 'Reply\u2026' });
        var replyError = el('div', { className: 'rhacs-popup__input-error' });
        replyError.appendChild(txt('Reply can\u2019t be empty'));
        replyArea.addEventListener('input', function () {
          if (replyArea.value.trim()) {
            replyArea.classList.remove('rhacs-popup__textarea--error');
            replyError.style.display = 'none';
          }
        });
        var rsc2 = Popup._buildScreenshotUI();
        var inputWrapper2 = el('div', { className: 'rhacs-reply-input-wrapper' });
        append(inputWrapper2, rsc2.toolbar, rsc2.thumbsDiv, replyArea);
        var replyActions = el('div', { className: 'rhacs-btn-row' });
        var replyBtn  = el('button', { className: 'pf-v6-c-button pf-m-primary' });
        replyBtn.appendChild(txt('Post'));
        replyBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          e.preventDefault();
          if (!replyArea.value.trim()) {
            replyArea.classList.add('rhacs-popup__textarea--error');
            replyError.style.display = 'block';
            replyArea.focus();
            return;
          }
          replyBtn.disabled = true;
          replyBtn.textContent = 'Posting…';
          var attachment = ScreenshotCapture.getAttachment();
          var replyText = replyArea.value;
          if (attachment) replyText += '\n\n![screenshot](' + attachment.dataUrl + ')';
          Popup.submitReply(pinId, replyText, replyArea)
            .catch(function () {})
            .finally(function () { Popup._resetReplyPostBtn(); });
        });
        var replyCancelBtn = el('button', { className: 'pf-v6-c-button pf-m-secondary' });
        replyCancelBtn.appendChild(txt('Cancel'));
        replyCancelBtn.addEventListener('click', function () {
          replyArea.value = '';
          replyArea.classList.remove('rhacs-popup__textarea--error');
          replyError.style.display = 'none';
          replyForm.style.display = 'none';
        });
        append(replyActions, replyBtn, replyCancelBtn);
        append(replyForm, inputWrapper2, replyError, replyActions);
      }

      // Comments scroll; reply form sticks to the bottom
      var scrollBody = el('div', { className: 'rhacs-popup__scroll-body' });
      append(scrollBody, firstPost, repliesEl);
      var stickyFooter = el('div', { className: 'rhacs-popup__sticky-footer' });
      append(stickyFooter, replyForm);
      append(this.el, header, scrollBody, stickyFooter);
      this._showPopupEl();
      // Ensure legacy reposition() never left root-level scroll on the popup
      this.el.style.maxHeight = '';
      this.el.style.overflowY = '';
      this.el.scrollTop = 0;
      scrollBody.scrollTop = 0;

      // Position near pin element (pins now live in pinLayerEl)
      var pinEl = Overlay.pinLayerEl.querySelector('[data-pin-id="' + pinId + '"]');
      if (pinEl) {
        var r = pinEl.getBoundingClientRect();
        this.positionFixed(r.right + 4, r.top);
      } else {
        this.el.style.left = '50%';
        this.el.style.top  = '80px';
        this.el.style.transform = 'translateX(-50%)';
      }
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
      // Optimistic: flip resolved state immediately
      var prevResolved = pin.meta.resolved;
      pin.meta.resolved = !prevResolved;
      pin.body = setMeta(pin.body, { resolved: pin.meta.resolved });
      Popup.close();
      Overlay.renderPins();
      Panel.render();
      Auth.requireAuth()
        .then(function () { return updateComment(pin.id, pin.body); })
        .then(function () { return loadAndRender(); })
        .catch(function (e) {
          // Rollback on failure
          pin.meta.resolved = prevResolved;
          pin.body = setMeta(pin.body, { resolved: prevResolved });
          Overlay.renderPins();
          Panel.render();
          Notify.toast('Failed: ' + e.message);
        });
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
        // Optimistic: remove pin immediately
        var removed = S.pins.find(function (p) { return p.id === pinId; });
        S.pins = S.pins.filter(function (p) { return p.id !== pinId; });
        Popup.close();
        Overlay.renderPins();
        Panel.render();
        FAB.updateBadge();
        deleteComment(pinId)
          .then(function () { return loadAndRender(); })
          .catch(function (e) {
            // Rollback on failure
            if (removed) S.pins = S.pins.concat([removed]);
            Overlay.renderPins();
            Panel.render();
            Notify.toast('Failed to delete: ' + e.message);
          });
      });
    },
    renderReply: function (reply, pinId) {
      var wrap = el('div', { className: 'rhacs-reply', 'data-reply-id': reply.id });
      var hdr  = el('div', { className: 'rhacs-reply__header' });
      var av   = makeAvatar(reply.author, 'rhacs-avatar--sm');
      var au   = el('span', { className: 'rhacs-popup__author' });
      au.appendChild(txt(reply.author.name && reply.author.name.trim() ? reply.author.name : reply.author.login));
      var tm   = el('span', { className: 'rhacs-popup__time' });
      tm.appendChild(txt(fmtDate(reply.createdAt)));
      append(hdr, av, au, tm);

      var bd = el('div', { className: 'rhacs-reply__body' });
      var cleanBody = reply.body.replace(/\n\n\u2014 _(.+?) \(guest\)_\s*$/, '').trim();
      var extracted = extractImages(cleanBody);
      if (extracted.text) bd.appendChild(txt(extracted.text));
      extracted.urls.forEach(function (imgUrl) {
        var imgEl = document.createElement('img');
        imgEl.className = 'rhacs-sc-inline-img';
        imgEl.src = imgUrl;
        imgEl.alt = 'Screenshot';
        imgEl.addEventListener('click', function () { Lightbox.show(imgUrl); });
        bd.appendChild(imgEl);
      });

      var copyText = extracted.text || cleanBody;
      if (S.ghUser) {
        hdr.appendChild(Popup.makeCopyBtn(copyText));
      }
      if (S.user && reply.author.login === S.user.login && !(S.guestMode && isShareMode())) {
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
              // Optimistic: remove reply immediately
              var pin = S.pins.find(function (p) { return p.id === pinId; });
              var removedReply = pin && pin.replies && pin.replies.find(function (r) { return r.id === reply.id; });
              if (pin) pin.replies = (pin.replies || []).filter(function (r) { return r.id !== reply.id; });
              Popup.showThread(pinId);
              Panel.render();
              deleteComment(reply.id)
                .then(function () { return loadAndRender(); })
                .then(function () { Popup.showThread(pinId); })
                .catch(function (e) {
                  // Rollback on failure
                  if (pin && removedReply) pin.replies = (pin.replies || []).concat([removedReply]);
                  Popup.showThread(pinId);
                  Notify.toast('Failed to delete: ' + e.message);
                });
            });
          }}
        ]));
      }

      append(wrap, hdr, bd);
      return wrap;
    },
    makeCopyBtn: function (text) {
      var COPY_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"/><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"/></svg>';
      var CHECK_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6.25 9.73l6.72-6.72a.75.75 0 0 1 1.06 0Z"/></svg>';
      var btn = el('button', {
        className: 'rhacs-copy-btn',
        type: 'button',
        'aria-label': 'Copy comment',
      });
      btn.innerHTML = COPY_SVG;
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        navigator.clipboard.writeText(text || '').then(function () {
          btn.classList.add('copied');
          btn.innerHTML = CHECK_SVG;
          setTimeout(function () {
            btn.classList.remove('copied');
            btn.innerHTML = COPY_SVG;
          }, 1500);
        }).catch(function () {
          Notify.toast('Failed to copy');
        });
      });
      return btn;
    },
    // Build a kebab ⋮ button with a dropdown. items: [{ label, action, danger? }]
    makeKebab: function (items) {
      // No items → return an invisible placeholder so callers don't need to guard
      if (!items || !items.length) return el('span');
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
          var pin = findPinById(pinId);
          if (!pin) return Promise.reject(new Error('Comment not found'));
          pinId = pin.id;
          // Optimistic: add reply immediately before API call
          var optimisticReply = {
            id: 'optimistic-reply-' + Date.now(),
            body: text,
            createdAt: new Date().toISOString(),
            author: S.user
          };
          pin.replies = (pin.replies || []).concat([optimisticReply]);
          if (textarea) textarea.value = '';
          Popup.showThread(pinId);
          Overlay.renderPins();
          Panel.render();
          return addReply(pinId, text)
            .then(function (data) {
              var newId = data && data.addDiscussionComment && data.addDiscussionComment.comment && data.addDiscussionComment.comment.id;
              if (newId) {
                pin.replies = (pin.replies || []).map(function (r) {
                  return r.id === optimisticReply.id ? Object.assign({}, r, { id: newId }) : r;
                });
              }
              Popup.showThread(pinId);
              Overlay.renderPins();
              Panel.render();
            })
            .catch(function (e) {
              // Rollback optimistic reply on failure
              pin.replies = (pin.replies || []).filter(function (r) { return r.id !== optimisticReply.id; });
              Popup.showThread(pinId);
              if (e && e.name === 'AbortError') Notify.toast('Reply timed out — please try again');
              else Notify.toast('Failed to reply: ' + e.message);
            });
        })
        .catch(function (e) { Notify.toast(e.message); });
    },
  };

  // ── Side Panel ────────────────────────────────────────────────────────────────
  var Panel = {
    el: null,
    activeTab: 'unread', // 'unread' | 'all' | 'unresolved' | 'resolved'
    searchQuery: '',
    stateFilter: '', // '' = all, otherwise 'view'|'edit'|'create'|'delete'
    sortOrder: 'newest', // 'newest' | 'oldest' | 'state'
    selected: new Set(),
    init: function () {
      this.el = el('div', { className: 'rhacs-panel', id: 'rhacs-panel' });
      this.searchQuery = '';
      this.stateFilter = '';
      this.sortOrder = 'newest';
      this.selected = new Set();

      this.topEl = el('div', { className: 'rhacs-panel__top' });

      this.searchWrap = el('div', { className: 'rhacs-panel__search' });
      this.searchIcon = el('span', { className: 'rhacs-panel__search-icon' });
      this.searchIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/></svg>';
      this.searchInput = el('input', {
        className: 'rhacs-panel__search-input',
        type: 'search',
        placeholder: 'Search comments\u2026',
        'aria-label': 'Search comments',
      });
      this.searchClear = el('button', {
        className: 'rhacs-panel__search-clear',
        type: 'button',
        'aria-label': 'Clear search',
      });
      this.searchClear.appendChild(txt('\u00d7'));
      var self = this;
      this.searchInput.addEventListener('input', function () {
        self.searchQuery = self.searchInput.value;
        self.stateFilter = '';
        self.selected.clear();
        self._updateSearchClear();
        self.render();
      });
      this.searchClear.addEventListener('click', function (e) {
        e.stopPropagation();
        self.searchInput.value = '';
        self.searchQuery = '';
        self.stateFilter = '';
        self.selected.clear();
        self._updateSearchClear();
        self.render();
      });
      append(this.searchWrap, this.searchIcon, this.searchInput, this.searchClear);

      this.filterRow = el('div', { className: 'rhacs-panel__filter-row' });
      this.filterChips = el('div', { className: 'rhacs-panel__filter-chips' });
      this.chipAll = this._makeFilterChip('', 'All');
      this.chipView = this._makeFilterChip('view', 'Viewing');
      this.chipEdit = this._makeFilterChip('edit', 'Editing');
      this.chipCreate = this._makeFilterChip('create', 'Creating');
      this.chipDelete = this._makeFilterChip('delete', 'Deleting');
      append(this.filterChips, this.chipAll, this.chipView, this.chipEdit, this.chipCreate, this.chipDelete);

      this.sortWrap = el('div', { className: 'rhacs-panel__sort-wrap' });
      this.sortBtn = el('button', {
        className: 'rhacs-panel__sort-btn rhacs-btn rhacs-btn--secondary rhacs-btn--sm',
        type: 'button',
        'aria-label': 'Sort comments',
        'aria-haspopup': 'menu',
      });
      this.sortBtn.appendChild(txt('Sort \u25be'));
      this.sortDropdown = el('div', { className: 'rhacs-panel__sort-dropdown', role: 'menu' });
      [
        { id: 'newest', label: 'Newest first' },
        { id: 'oldest', label: 'Oldest first' },
        { id: 'state', label: 'By state' },
      ].forEach(function (opt) {
        var item = el('button', {
          className: 'rhacs-panel__sort-item',
          type: 'button',
          role: 'menuitem',
          'data-sort': opt.id,
        });
        item.appendChild(txt(opt.label));
        item.addEventListener('click', function (e) {
          e.stopPropagation();
          self.sortOrder = opt.id;
          self.sortDropdown.classList.remove('rhacs-panel__sort-dropdown--open');
          self.render();
        });
        self.sortDropdown.appendChild(item);
      });
      this.sortBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = self.sortDropdown.classList.contains('rhacs-panel__sort-dropdown--open');
        document.querySelectorAll('.rhacs-panel__sort-dropdown--open').forEach(function (d) {
          d.classList.remove('rhacs-panel__sort-dropdown--open');
        });
        if (!isOpen) self.sortDropdown.classList.add('rhacs-panel__sort-dropdown--open');
      });
      append(this.sortWrap, this.sortBtn, this.sortDropdown);
      this.exportBtn = el('button', {
        className: 'rhacs-export-btn pf-v6-c-button pf-m-secondary pf-m-small',
        type: 'button',
        style: 'display:none',
        'aria-label': 'Export selected comments',
      });
      this.exportBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5Z"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3Z"/></svg><span>Export</span>';
      this.exportBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        Panel._exportSelected();
      });
      append(this.filterRow, this.filterChips, this.sortWrap, this.exportBtn);

      // "Show resolved" toggle — page-scoped, controls pin visibility on the page
      this.resolvedToggleRow = el('div', { className: 'rhacs-panel__resolved-toggle-row' });
      var toggleLabel = el('label', { className: 'rhacs-panel__resolved-toggle' });
      this.resolvedToggleInput = el('input', {
        type: 'checkbox',
        className: 'rhacs-panel__resolved-toggle__input',
        'aria-label': 'Show resolved comments on page',
      });
      var toggleTrack = el('span', { className: 'rhacs-panel__resolved-toggle__track' });
      var toggleThumb = el('span', { className: 'rhacs-panel__resolved-toggle__thumb' });
      toggleTrack.appendChild(toggleThumb);
      var toggleText = el('span', { className: 'rhacs-panel__resolved-toggle__label' });
      toggleText.appendChild(txt('Show resolved on page'));
      append(toggleLabel, this.resolvedToggleInput, toggleTrack, toggleText);
      this.resolvedToggleInput.addEventListener('change', function () {
        S.showResolved = self.resolvedToggleInput.checked;
        Overlay.renderPins();
      });
      this.resolvedToggleRow.appendChild(toggleLabel);

      this.listEl = el('div', { className: 'rhacs-panel__list' });

      append(this.el, this.topEl, this.searchWrap, this.filterRow, this.resolvedToggleRow, this.listEl);
      rhacsMount().appendChild(this.el);
    },
    _makeFilterChip: function (state, label) {
      var self = this;
      var chip = el('button', {
        className: 'rhacs-panel__chip',
        type: 'button',
        'data-state': state,
      });
      chip.appendChild(txt(label));
      chip.addEventListener('click', function (e) {
        e.stopPropagation();
        self.stateFilter = state;
        self.selected.clear();
        self.render();
      });
      return chip;
    },
    _updateFilterToolbar: function () {
      var tabSearchPins = this._getTabSearchPins();
      var stateCounts = { view: 0, edit: 0, create: 0, delete: 0 };
      tabSearchPins.forEach(function (p) {
        var vs = p.meta && p.meta.viewState;
        if (vs && stateCounts[vs] !== undefined) stateCounts[vs]++;
      });

      var chips = [
        { el: this.chipAll, state: '' },
        { el: this.chipView, state: 'view' },
        { el: this.chipEdit, state: 'edit' },
        { el: this.chipCreate, state: 'create' },
        { el: this.chipDelete, state: 'delete' },
      ];
      chips.forEach(function (c) {
        var show = c.state === '' || stateCounts[c.state] > 0;
        c.el.style.display = show ? '' : 'none';
        c.el.classList.remove(
          'rhacs-panel__chip--active',
          'rhacs-panel__chip--view-active',
          'rhacs-panel__chip--edit-active',
          'rhacs-panel__chip--create-active',
          'rhacs-panel__chip--delete-active'
        );
        if (Panel.stateFilter === c.state) {
          c.el.classList.add('rhacs-panel__chip--active');
          if (c.state) c.el.classList.add('rhacs-panel__chip--' + c.state + '-active');
        }
      });

      this.sortDropdown.querySelectorAll('.rhacs-panel__sort-item').forEach(function (item) {
        item.classList.toggle('rhacs-panel__sort-item--active', item.getAttribute('data-sort') === Panel.sortOrder);
      });

      if (this.exportBtn) {
        var showExport = S.ghUser && Panel.selected.size > 0;
        this.exportBtn.style.display = showExport ? 'inline-flex' : 'none';
      }
    },
    _updateSearchClear: function () {
      var hasQuery = !!(this.searchQuery && this.searchQuery.trim());
      this.searchClear.classList.toggle('rhacs-panel__search-clear--visible', hasQuery);
    },
    _matchesSearch: function (pin, q) {
      var authorDisplay = pin.author.name && pin.author.name.trim() ? pin.author.name : pin.author.login;
      if (authorDisplay && authorDisplay.toLowerCase().indexOf(q) !== -1) return true;
      if (pin.author.login && pin.author.login.toLowerCase().indexOf(q) !== -1) return true;
      if (pinText(pin.body).toLowerCase().indexOf(q) !== -1) return true;
      if (pin.replies) {
        for (var i = 0; i < pin.replies.length; i++) {
          if (pinText(pin.replies[i].body).toLowerCase().indexOf(q) !== -1) return true;
        }
      }
      return false;
    },
    _getTabPins: function () {
      var allPins        = S.pins.filter(function (p) { return p.meta; });
      var unreadPins     = allPins.filter(function (p) { return isPinUnread(p); });
      var unresolvedPins = allPins.filter(function (p) { return !p.meta.resolved; });
      var resolvedPins   = allPins.filter(function (p) { return p.meta.resolved; });
      return Panel.activeTab === 'unread'     ? unreadPins
           : Panel.activeTab === 'all'        ? allPins
           : Panel.activeTab === 'unresolved' ? unresolvedPins
           : resolvedPins;
    },
    _getTabSearchPins: function () {
      var tabPins = this._getTabPins();
      var q = (this.searchQuery || '').trim().toLowerCase();
      if (!q) return tabPins;
      return tabPins.filter(function (p) { return Panel._matchesSearch(p, q); });
    },
    _applySort: function (pins) {
      var order = this.sortOrder || 'newest';
      if (order === 'oldest') {
        return pins.slice().sort(function (a, b) {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        });
      }
      if (order === 'state') {
        var stateOrder = { view: 0, edit: 1, create: 2, delete: 3 };
        return pins.slice().sort(function (a, b) {
          var sa = (a.meta && a.meta.viewState && stateOrder[a.meta.viewState] !== undefined)
            ? stateOrder[a.meta.viewState] : 99;
          var sb = (b.meta && b.meta.viewState && stateOrder[b.meta.viewState] !== undefined)
            ? stateOrder[b.meta.viewState] : 99;
          if (sa !== sb) return sa - sb;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
      }
      return pins.slice().sort(function (a, b) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    },
    _getVisiblePins: function () {
      var pins = this._getTabSearchPins();
      if (this.stateFilter) {
        pins = pins.filter(function (p) {
          return p.meta && p.meta.viewState === Panel.stateFilter;
        });
      }
      return this._applySort(pins);
    },
    _updateSelectionUI: function () {
      this.el.classList.toggle('rhacs-panel--selection-mode', Panel.selected.size > 0);
    },
    _pinToMarkdown: function (pin) {
      var stateLabels = { view: 'Viewing', edit: 'Editing', create: 'Creating', delete: 'Deleting' };
      var author = pin.author.name && pin.author.name.trim() ? pin.author.name : pin.author.login;
      var viewState = pin.meta && pin.meta.viewState
        ? (stateLabels[pin.meta.viewState] || pin.meta.viewState)
        : 'Viewing';
      var body = pinText(pin.body);
      var md = '## Comment #' + pin.meta.pinNumber + ' \u2014 ' + author + ' (' + fmtDate(pin.createdAt) + ') [' + viewState + ']\n\n';
      md += body + '\n';
      if (pin.replies && pin.replies.length) {
        md += '\n### Replies\n';
        pin.replies.forEach(function (r) {
          var rAuthor = r.author.name && r.author.name.trim() ? r.author.name : r.author.login;
          var rBody = r.body.replace(/\n\n\u2014 _(.+?) \(guest\)_\s*$/, '').trim();
          md += '- **' + rAuthor + '** (' + fmtDate(r.createdAt) + '): ' + rBody + '\n';
        });
      }
      return md;
    },
    _exportSelected: function () {
      if (!S.ghUser || Panel.selected.size === 0) return;
      var pins = Array.from(Panel.selected).map(function (id) {
        return S.pins.find(function (p) { return p.id === id; });
      }).filter(Boolean);
      pins.sort(function (a, b) {
        return (a.meta.pinNumber || 0) - (b.meta.pinNumber || 0);
      });
      var markdownStr = pins.map(function (pin) { return Panel._pinToMarkdown(pin); }).join('\n\n');
      var blob = new Blob([markdownStr], { type: 'text/markdown' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'comments-' + new Date().toISOString().slice(0, 10) + '.md';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    _buildListHeader: function (visible) {
      var self = this;
      var header = el('div', { className: 'rhacs-panel__list-header' });

      var checkbox = el('input', {
        type: 'checkbox',
        className: 'rhacs-panel__list-header__checkbox',
      });
      checkbox.setAttribute('aria-label', 'Select all visible comments');

      var selectedVisible = visible.filter(function (p) { return Panel.selected.has(p.id); });
      checkbox.checked = visible.length > 0 && selectedVisible.length === visible.length;
      checkbox.indeterminate = selectedVisible.length > 0 && selectedVisible.length < visible.length;
      checkbox.addEventListener('click', function (e) {
        e.preventDefault();
        var vis = self._getVisiblePins();
        var selVis = vis.filter(function (p) { return self.selected.has(p.id); });
        var allSel = vis.length > 0 && selVis.length === vis.length;
        if (allSel) {
          self.selected.clear();
        } else {
          vis.forEach(function (p) { self.selected.add(p.id); });
        }
        self.render();
      });

      var count = el('span', { className: 'rhacs-panel__list-header__count' });
      if (Panel.selected.size > 0) {
        count.textContent = Panel.selected.size + ' selected';
      }

      append(header, checkbox, count);

      if (Panel.selected.size > 0) {
        var hasUnresolved = false;
        var hasResolved = false;
        var hasUnread = false;
        Panel.selected.forEach(function (id) {
          var pin = S.pins.find(function (p) { return p.id === id; });
          if (!pin) return;
          if (pin.meta.resolved) hasResolved = true;
          else hasUnresolved = true;
          if (isPinUnread(pin)) {
            hasUnread = true;
          }
        });

        var menuItems = [];
        var isOwner = Auth.isPrototypeOwner();
        var _sm = isShareMode();
        if (isOwner && hasUnresolved) {
          menuItems.push({ label: 'Resolve selected', action: function () { self._bulkResolve(true); } });
        }
        if (isOwner && hasResolved) {
          menuItems.push({ label: 'Unresolve selected', action: function () { self._bulkResolve(false); } });
        }
        if (isOwner && !_sm) {
          menuItems.push({ label: 'Delete selected', danger: true, action: function () { self._bulkDelete(); } });
        }
        if (!_sm) {
          if (hasUnread) {
            menuItems.push({ label: 'Mark as read', action: function () { self._bulkMarkRead(); } });
          } else {
            menuItems.push({ label: 'Mark as unread', action: function () { self._bulkMarkUnread(); } });
          }
        }

        var kebab = Popup.makeKebab(menuItems);
        kebab.className = 'rhacs-panel__list-header__kebab rhacs-kebab';
        header.appendChild(kebab);
      }

      return header;
    },
    _bulkMarkRead: function () {
      var maxTs = S.lastSeen;
      Panel.selected.forEach(function (id) {
        var pin = S.pins.find(function (p) { return p.id === id; });
        if (!pin) return;
        S.seenIds.add(id);
        S.seenReplyCounts[id] = (pin.replies || []).length;
        var ts = new Date(pin.createdAt).getTime();
        if (ts > maxTs) maxTs = ts;
      });
      S.lastSeen = maxTs;
      saveLastSeen();
      saveSeenIds();
      Panel.selected.clear();
      Overlay.renderPins();
      Panel.render();
      FAB.updateBadge();
    },
    _bulkMarkUnread: function () {
      var oldestTs = Infinity;
      Panel.selected.forEach(function (id) {
        S.seenIds.delete(id);
        var pin = S.pins.find(function (p) { return p.id === id; });
        if (!pin) return;
        var ts = new Date(pin.createdAt).getTime();
        if (ts < oldestTs) oldestTs = ts;
      });
      if (oldestTs !== Infinity) {
        S.lastSeen = Math.min(S.lastSeen, oldestTs - 1);
      }
      saveLastSeen();
      saveSeenIds();
      Panel.selected.clear();
      FAB.updateBadge();
      Overlay.renderPins();
      Panel.render();
    },
    _bulkResolve: function (resolve) {
      if (!Auth.isPrototypeOwner()) return;
      var ids = Array.from(Panel.selected);
      var apiCalls = [];
      ids.forEach(function (id) {
        var pin = S.pins.find(function (p) { return p.id === id; });
        if (!pin) return;
        if (resolve && pin.meta.resolved) return;
        if (!resolve && !pin.meta.resolved) return;
        if (String(pin.id).startsWith('guest-')) {
          var guestPins = Auth.loadGuestPins();
          var idx = guestPins.findIndex(function (p) { return p.id === pin.id; });
          if (idx !== -1) {
            guestPins[idx].body = setMeta(guestPins[idx].body, { resolved: resolve });
            if (guestPins[idx].meta) guestPins[idx].meta.resolved = resolve;
            Auth.saveGuestPins(guestPins);
          }
          pin.meta.resolved = resolve;
          pin.body = setMeta(pin.body, { resolved: resolve });
        } else {
          pin.meta.resolved = resolve;
          pin.body = setMeta(pin.body, { resolved: resolve });
          apiCalls.push(updateComment(pin.id, pin.body));
        }
      });
      Panel.selected.clear();
      Overlay.renderPins();
      Panel.render();
      FAB.updateBadge();
      if (apiCalls.length) {
        Promise.all(apiCalls)
          .then(function () { return loadAndRender(); })
          .catch(function (e) { Notify.toast('Failed: ' + e.message); loadAndRender(); });
      } else {
        loadAndRender();
      }
    },
    _bulkDelete: function () {
      if (!Auth.isPrototypeOwner()) return;
      var n = Panel.selected.size;
      showConfirm('This cannot be undone.', {
        title: 'Delete ' + n + ' comment' + (n === 1 ? '' : 's') + '?',
        confirmLabel: 'Delete',
        cancelLabel: 'Cancel',
        danger: true,
      }).then(function (confirmed) {
        if (!confirmed) return;
        var ids = Array.from(Panel.selected);
        var removed = [];
        ids.forEach(function (id) {
          var pin = S.pins.find(function (p) { return p.id === id; });
          if (pin) removed.push(pin);
          if (String(id).startsWith('guest-')) Auth.deleteGuestPin(id);
        });
        S.pins = S.pins.filter(function (p) { return ids.indexOf(p.id) === -1; });
        Panel.selected.clear();
        Overlay.renderPins();
        Panel.render();
        FAB.updateBadge();
        var deleteCalls = ids
          .filter(function (id) { return !String(id).startsWith('guest-'); })
          .map(function (id) {
            return deleteComment(id).catch(function (e) {
              Notify.toast('Failed to delete: ' + e.message);
            });
          });
        Promise.all(deleteCalls).then(function () { loadAndRender(); });
      });
    },
    _pushPage: function () {
      // Panel overlays the page instead of pushing it — avoids compressing
      // the PatternFly masthead which causes toolbar icons to wrap/overflow.
    },
    open: function () {
      if (this.resolvedToggleInput) this.resolvedToggleInput.checked = S.showResolved;
      // Re-render from in-memory pins only — never re-fetch on panel open/toggle.
      this.render();
      this.el.classList.add('rhacs-panel--open');
      rhacsMount().classList.add('rhacs-panel-open');
      Panel._pushPage(true);
    },
    dismiss: function () {
      if (!this.el) return;
      this.el.classList.remove('rhacs-panel--open');
      rhacsMount().classList.remove('rhacs-panel-open');
      Panel._pushPage(false);
    },
    close: function () {
      this.dismiss();
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
      this.topEl.innerHTML = '';
      this.listEl.innerHTML = '';
      if (this.searchInput.value !== this.searchQuery) this.searchInput.value = this.searchQuery;
      this._updateSearchClear();

      // ── Guest notice banner (top) ────────────────────────────────────────────
      if (S.guestMode) {
        var guestBanner = el('div', { className: 'rhacs-panel__guest-banner' });
        guestBanner.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 16 16" fill="currentColor" style="flex-shrink:0;margin-top:1px"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.029 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/></svg>' +
          '<span>You\u2019re commenting as an external reviewer \u2014 no login needed.</span>';
        this.topEl.appendChild(guestBanner);
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
      this.topEl.appendChild(hdr);

      // ── PF6 Tabs ─────────────────────────────────────────────────────────────
      var allPins        = S.pins.filter(function (p) { return p.meta; });
      var unreadPins     = allPins.filter(function (p) { return isPinUnread(p); });
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
          Panel.stateFilter = '';
          Panel.selected.clear();
          Panel.render();
        });
        tabList.appendChild(btn);
      });
      this.topEl.appendChild(tabList);

      // ── Filter + sort toolbar ───────────────────────────────────────────────
      this._updateFilterToolbar();

      // ── Visible pins for active tab + search + state filter + sort ─────────
      var visible = this._getVisiblePins();

      this.listEl.appendChild(this._buildListHeader(visible));

      if (visible.length === 0) {
        if ((this.searchQuery || '').trim() || this.stateFilter) {
          var noResults = el('div', { className: 'rhacs-panel__empty' });
          var noResultsTitle = el('div', { className: 'rhacs-panel__empty-title' });
          noResultsTitle.appendChild(txt('No matching comments'));
          var noResultsHint = el('div', { className: 'rhacs-panel__empty-hint' });
          noResultsHint.appendChild(txt('Try a different search term or clear the filter.'));
          append(noResults, noResultsTitle, noResultsHint);
          this.listEl.appendChild(noResults);
        } else {
          this.listEl.appendChild(this.renderEmpty(Panel.activeTab));
        }
        this._updateSelectionUI();
        return;
      }

      visible.forEach(function (pin) {
        var isUnread = isPinUnread(pin);
        var cls = 'rhacs-panel__item' +
          (isUnread   ? ' rhacs-panel__item--unread'   : '') +
          (pin.meta.resolved ? ' rhacs-panel__item--resolved' : '');
        var item = el('div', { className: cls });

        var itemCheck = el('input', { type: 'checkbox', className: 'rhacs-panel__item-check' });
        itemCheck.checked = Panel.selected.has(pin.id);
        itemCheck.setAttribute('aria-label', 'Select comment #' + pin.meta.pinNumber);
        itemCheck.addEventListener('click', function (e) { e.stopPropagation(); });
        itemCheck.addEventListener('change', function (e) {
          e.stopPropagation();
          if (itemCheck.checked) Panel.selected.add(pin.id);
          else Panel.selected.delete(pin.id);
          Panel.render();
        });

        var itemBody = el('div', { className: 'rhacs-panel__item-body' });

        // Per-pin permissions (mirrors showThread logic)
        var pIsProtoOwner = Auth.isPrototypeOwner();
        var pIsOwnComment = !!(S.user && pin.author && pin.author.login === S.user.login);
        var pCanDelete  = pIsProtoOwner || pIsOwnComment;
        var pCanResolve = pIsProtoOwner && !isShareMode();

        var itemHdr = el('div', { className: 'rhacs-panel__item-header' });
        var av  = makeAvatar(pin.author, 'rhacs-avatar--sm');
        var num = el('span', { className: 'pf-v5-c-badge pf-m-unread rhacs-panel__item-num' }); num.appendChild(txt(String(pin.meta.pinNumber)));
        var au  = el('span', { className: 'rhacs-panel__item-author' }); au.appendChild(txt(pin.author.name && pin.author.name.trim() ? pin.author.name : pin.author.login));
        var tm  = el('span', { className: 'rhacs-panel__item-time' }); tm.appendChild(txt(fmtDate(pin.createdAt)));
        append(itemHdr, av, num, au, tm);
        if (pin.meta.viewState) {
          var stateLabels = { view: 'Viewing', edit: 'Editing', create: 'Creating', delete: 'Deleting' };
          var stateTips = {
            view:   'Commented while viewing this page in read-only mode',
            edit:   'Commented while a form was open and being edited',
            create: 'Commented while creating a new item',
            delete: 'Commented during a delete action'
          };
          var stateLabel = stateLabels[pin.meta.viewState] || 'Viewing';
          var stateTip   = stateTips[pin.meta.viewState]   || 'Pinned in view mode';
          var stateBadge = el('span', {
            className: 'rhacs-panel__state-badge rhacs-panel__state-badge--' + pin.meta.viewState,
            'data-tip': stateTip
          });
          stateBadge.appendChild(txt(stateLabel));
          itemHdr.appendChild(stateBadge);
        }
        if (isUnread) {
          var dot = el('span', { className: 'rhacs-unread-dot' });
          itemHdr.appendChild(dot);
        }

        (function (p, unread, canDel, canRes) {
          var pinTs = new Date(p.createdAt).getTime();
          var _sh = isShareMode();
          var menuItems = [
            canDel && !_sh ? { label: 'Delete thread', danger: true, action: function () {
              Popup.confirmDelete(p.id);
            }} : null,
            canRes ? { label: p.meta.resolved ? 'Unresolve' : 'Resolve', action: function () {
              Popup.toggleResolve(p);
            }} : null,
            !_sh ? (unread
              ? { label: 'Mark as read', action: function () {
                  markPinAsSeen(p);
                  Overlay.renderPins(); FAB.updateBadge(); Panel.render();
                }}
              : { label: 'Mark as unread', action: function () {
                  S.seenIds.delete(p.id);
                  saveSeenIds();
                  S.lastSeen = Math.min(S.lastSeen, pinTs - 1);
                  saveLastSeen();
                  S.unread = Math.max(1, S.unread);
                  FAB.updateBadge(); Overlay.renderPins(); Panel.render();
                }}) : null
          ].filter(Boolean);
          var panelKebab = Popup.makeKebab(menuItems);
          panelKebab.style.marginLeft = 'auto';
          panelKebab.style.flexShrink = '0';
          itemHdr.appendChild(panelKebab);
        })(pin, isUnread, pCanDelete, pCanResolve);

        var preview = el('div', { className: 'rhacs-panel__item-preview' });
        var ptext = pinText(pin.body);
        preview.appendChild(txt(ptext.length > 80 ? ptext.slice(0, 80) + '\u2026' : ptext));

        if (pin.meta.modalTitle) {
          var modalBadge = el('div', { className: 'rhacs-panel__modal-badge' });
          modalBadge.appendChild(txt('\uD83D\uDCCB ' + pin.meta.modalTitle));
          append(itemBody, itemHdr, modalBadge, preview);
        } else {
          append(itemBody, itemHdr, preview);
        }

        if (pin.replies && pin.replies.length > 0) {
          var replyCount = el('button', { className: 'rhacs-panel__item-replies' });
          replyCount.appendChild(txt(pin.replies.length + ' ' + (pin.replies.length === 1 ? 'reply' : 'replies')));
          replyCount.addEventListener('click', (function (p) { return function (e) {
            e.stopPropagation();
            Popup.showThread(p.id);
          }; })(pin));
          itemBody.appendChild(replyCount);
        }

        append(item, itemCheck, itemBody);

        item.addEventListener('click', (function (p) { return function () {
          Popup.suppressOutsideDismiss(600);

          var pinId = p.id;
          var targetState = p.meta && p.meta.viewState;
          var pinPageUrl  = p.meta && p.meta.pageUrl;
          var modalTitle  = p.meta && p.meta.modalTitle;

          function showAfterModalReady() {
            Overlay.renderPins();
            setTimeout(function () { Popup.showThread(pinId); }, 50);
          }

          function openModalAndShowPin() {
            if (findOpenModal(modalTitle)) {
              showAfterModalReady();
              return;
            }
            var opener = findModalOpenerButton(modalTitle, p.meta.modalOpener);
            if (opener) opener.click();
            var elapsed = 0;
            var poll = setInterval(function () {
              elapsed += 100;
              if (findOpenModal(modalTitle) || elapsed >= 2500) {
                clearInterval(poll);
                showAfterModalReady();
              }
            }, 100);
          }

          function activateAndShow() {
            if (modalTitle) {
              openModalAndShowPin();
              return;
            }
            waitForViewState(targetState, function () {
              scrollToPinMetaY(p.meta.y, pinId);
            }, 2500);
          }

          // Step 1: navigate only when pathname differs (ignore query/hash drift on same page)
          if (pinPageUrl && !pinUrlsSamePage(pinPageUrl, window.location.href)) {
            S.pendingPanelPinOpen = {
              pinId: pinId,
              targetState: targetState,
              metaY: p.meta.y,
              modalTitle: modalTitle || null,
              modalOpener: p.meta.modalOpener || null,
            };
            history.pushState({}, '', pinPageUrl);
            window.dispatchEvent(new PopStateEvent('popstate', { state: {} }));
            return;
          }

          // Step 2: same URL but wrong view state — trigger DOM mode switch
          if (targetState && targetState !== effectiveViewState()) {
            if (targetState === 'edit' || targetState === 'create') {
              var editBtn = findPageEditButton();
              if (editBtn) {
                editBtn.click();
                setTimeout(activateAndShow, 50);
              } else {
                activateAndShow();
              }
            } else if (targetState === 'view') {
              var cancelBtns = Array.prototype.slice.call(
                document.querySelectorAll('button')
              ).filter(function (b) {
                if (b.closest('#rhacs-mount')) return false;
                return (b.textContent || '').trim().toLowerCase() === 'cancel';
              });
              if (cancelBtns.length) {
                cancelBtns[0].click();
                setTimeout(activateAndShow, 50);
              } else {
                activateAndShow();
              }
            } else {
              activateAndShow();
            }
            return;
          }

          // Step 3: already on the right URL and state — show immediately
          activateAndShow();
        }; })(pin));

        Panel.listEl.appendChild(item);
      });
      this._updateSelectionUI();
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
      var ICON_EXIT = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512" fill="currentColor"><path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z"/></svg>';
      icon.innerHTML = ICON_ADD;
      FAB._iconEl = icon; FAB._iconAdd = ICON_ADD; FAB._iconExit = ICON_EXIT;
      var label = el('span', { className: 'rhacs-fab__label' });
      label.appendChild(txt('Add comment'));

      var mainBtn = el('button', { className: 'rhacs-fab__btn', 'data-tip': 'Toggle comment mode (C)' });
      append(mainBtn, icon, label);
      mainBtn.addEventListener('click', function () { FAB.toggleMode(); });

      // Badge lives on the "View all" button so it doesn't conflict with the main button label
      var panelBtn = el('button', { className: 'rhacs-fab__panel-btn', 'data-tip': 'View all comments' });
      panelBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="flex-shrink:0;display:block"><path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/></svg><span class="rhacs-fab__panel-label">View all</span>';
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
        if (e.metaKey || e.ctrlKey) return;
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
        Auth.requireAuth().then(function () {
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
      ModeAnnounce.show(active);
    },
    updateBadge: function () {
      var count = S.pins.filter(function (p) { return isPinUnread(p); }).length;
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

      // Show "Add comments" label expanded when unauthenticated (no login yet)
      var isAuthed = S.token || S.guestMode;
      this.el.classList.toggle('rhacs-fab--unauthenticated', !isAuthed);

      // "View all" panel button: only for GitHub-authenticated users, not guests
      if (this.panelBtn) {
        this.panelBtn.style.display = S.token ? '' : 'none';
      }
      this.userEl.innerHTML = '';
      if (S.guestMode && S.user) {
        // Guest: collapsed person-icon circle → expands to Log out on hover
        var guestWrap = el('div', { className: 'rhacs-guest-wrap' });

        var logoutGuestBtn = el('button', { className: 'rhacs-guest-logout-btn' });

        var logoutIcon = el('span', { className: 'rhacs-guest-logout-icon' });
        logoutIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 16" fill="currentColor"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.029 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/></svg>';

        var logoutText = el('span', { className: 'rhacs-guest-logout-text' });
        logoutText.appendChild(txt('Log out'));

        logoutGuestBtn.appendChild(logoutIcon);
        logoutGuestBtn.appendChild(logoutText);
        logoutGuestBtn.addEventListener('click', function () { Auth.exitGuest(); loadAndRender(); });

        guestWrap.appendChild(logoutGuestBtn);
        this.userEl.appendChild(guestWrap);
      } else if (S.token && S.user) {
        // GitHub-authenticated user: PF6-style avatar dropdown button
        var userDropWrap = el('div', { className: 'rhacs-user-menu' });

        var userTrigger = el('button', {
          className: 'rhacs-user-menu__trigger',
          'aria-label': 'User menu for ' + S.user.login,
          'aria-haspopup': 'true',
          'aria-expanded': 'false'
        });

        var triggerAv = makeAvatar(S.user, 'rhacs-avatar--sm');
        var triggerName = el('span', { className: 'rhacs-user-menu__name' });
        triggerName.appendChild(txt(S.user.login));
        var CHEVRON_DOWN = '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 320 512" fill="currentColor"><path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"/></svg>';
        var triggerChevron = el('span', { className: 'rhacs-user-menu__chevron' });
        triggerChevron.innerHTML = CHEVRON_DOWN;
        append(userTrigger, triggerAv, triggerName, triggerChevron);

        var userDropdown = el('div', { className: 'rhacs-user-menu__dropdown' });

        var logoutItem = el('button', { className: 'rhacs-user-menu__item rhacs-user-menu__item--danger' });
        logoutItem.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 512 512" fill="currentColor" style="flex-shrink:0"><path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z"/></svg>';
        logoutItem.appendChild(txt('Log out'));
        logoutItem.addEventListener('click', function (e) {
          e.stopPropagation();
          userDropdown.classList.remove('rhacs-user-menu__dropdown--open');
          userTrigger.setAttribute('aria-expanded', 'false');
          Auth.logout();
        });

        append(userDropdown, logoutItem);
        append(userDropWrap, userTrigger, userDropdown);

        userTrigger.addEventListener('click', function (e) {
          e.stopPropagation();
          var isOpen = userDropdown.classList.contains('rhacs-user-menu__dropdown--open');
          // close all other open dropdowns
          document.querySelectorAll('.rhacs-user-menu__dropdown--open, .rhacs-split-btn__dropdown--open, .rhacs-kebab__dropdown--open').forEach(function (d) {
            d.classList.remove('rhacs-user-menu__dropdown--open');
            d.classList.remove('rhacs-split-btn__dropdown--open');
            d.classList.remove('rhacs-kebab__dropdown--open');
          });
          if (!isOpen) {
            userDropdown.classList.add('rhacs-user-menu__dropdown--open');
            userTrigger.setAttribute('aria-expanded', 'true');
          } else {
            userTrigger.setAttribute('aria-expanded', 'false');
          }
        });

        this.userEl.appendChild(userDropWrap);
      }
      // Not authenticated: no user area content shown — clicking "Add comment" triggers the dialog
    },
  };

  // ── Mode announcement (compact bottom toast on enter/exit comment mode) ────
  var ModeAnnounce = {
    _el: null,
    _timer: null,
    show: function (active) {
      // Clear any existing announcement
      if (this._timer) { clearTimeout(this._timer); this._timer = null; }
      if (this._el) { this._el.remove(); this._el = null; }

      var wrap = document.createElement('div');
      wrap.className = 'rhacs-mode-announce';

      var inner = document.createElement('div');
      inner.className = 'rhacs-mode-announce__inner' + (active ? '' : ' rhacs-mode-announce__inner--exit');

      var iconEl = document.createElement('span');
      iconEl.className = 'rhacs-mode-announce__icon';
      if (active) {
        iconEl.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105"/></svg>';
      } else {
        iconEl.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" aria-hidden="true"><path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z"/></svg>';
      }

      var copyEl = document.createElement('div');
      copyEl.className = 'rhacs-mode-announce__copy';

      var textEl = document.createElement('span');
      textEl.className = 'rhacs-mode-announce__text';
      textEl.textContent = active ? 'Comment mode on' : 'Comment mode off';

      var subEl = document.createElement('span');
      subEl.className = 'rhacs-mode-announce__sub';
      if (active) {
        subEl.innerHTML = 'Click to pin a comment \u00b7 Press <kbd style="display:inline-block;padding:0 4px;border:1px solid rgba(255,255,255,0.45);border-radius:3px;font-size:11px;font-family:inherit;line-height:1.5;background:rgba(255,255,255,0.12)">C</kbd> to exit';
      } else {
        subEl.textContent = 'All comments saved';
      }

      copyEl.appendChild(textEl);
      copyEl.appendChild(subEl);
      inner.appendChild(iconEl);
      inner.appendChild(copyEl);
      wrap.appendChild(inner);
      document.body.appendChild(wrap);
      this._el = wrap;

      // Animate out after 2s, remove after transition
      this._timer = setTimeout(function () {
        if (ModeAnnounce._el) {
          ModeAnnounce._el.classList.add('rhacs-mode-announce--out');
          setTimeout(function () {
            if (ModeAnnounce._el) { ModeAnnounce._el.remove(); ModeAnnounce._el = null; }
          }, 400);
        }
      }, 2000);
    }
  };

  // ── PF6 Tooltip manager ───────────────────────────────────────────────────────
  // Appends a real DOM node to document.body so it's never clipped by a parent's
  // stacking context or overflow. Positioned via getBoundingClientRect.
  var Tooltip = {
    el: null,
    show: function (text, target) {
      this.hide();
      if (!text) return;
      var tip = document.createElement('div');
      tip.className = 'rhacs-tooltip';
      tip.textContent = text;
      tip.style.visibility = 'hidden'; // measure before placing
      document.body.appendChild(tip);
      this.el = tip;
      this._place(target);
      tip.style.visibility = '';
    },
    _place: function (target) {
      var tip = this.el;
      if (!tip) return;
      var r   = target.getBoundingClientRect();
      var tw  = tip.offsetWidth;
      var th  = tip.offsetHeight;
      var vw  = window.innerWidth;
      var vh  = window.innerHeight;
      var gap = 8;

      // Prefer above; fall back to below if not enough room
      var top = r.top - th - gap;
      var below = top < gap;
      if (below) { top = r.bottom + gap; tip.classList.add('rhacs-tooltip--below'); }

      // Centre horizontally over target, clamp to viewport
      var left = r.left + r.width / 2 - tw / 2;
      left = Math.max(gap, Math.min(vw - tw - gap, left));

      // Arrow x offset relative to tooltip box (for accurate pointer)
      var arrowX = (r.left + r.width / 2 - left);
      arrowX = Math.max(10, Math.min(tw - 10, arrowX));
      tip.style.setProperty('--rhacs-tip-arrow-x', arrowX + 'px');
      tip.style.top  = top + 'px';
      tip.style.left = left + 'px';
    },
    hide: function () {
      if (this.el) { this.el.remove(); this.el = null; }
    },
    init: function () {
      // Event delegation — works for dynamically created [data-tip] elements
      document.addEventListener('mouseover', function (e) {
        var el = e.target.closest('[data-tip]');
        if (!el) return;
        Tooltip.show(el.getAttribute('data-tip'), el);
      });
      document.addEventListener('mouseout', function (e) {
        var rel = e.relatedTarget;
        if (Tooltip.el && rel && Tooltip.el.contains(rel)) return;
        var el = e.target.closest('[data-tip]');
        if (el) Tooltip.hide();
      });
      // Hide on scroll so tooltips don't drift
      document.addEventListener('scroll', function () { Tooltip.hide(); }, true);
    }
  };

  // ── Notifications ─────────────────────────────────────────────────────────────
  var Notify = {
    _stack: null,
    init: function () {
      var stack = document.createElement('div');
      stack.className = 'rhacs-toast-stack';
      rhacsMount().appendChild(stack);
      this._stack = stack;
    },
    toast: function (msg, dur) {
      if (!this._stack) return;
      var t = document.createElement('div');
      t.className = 'rhacs-toast';
      t.textContent = msg;
      this._stack.appendChild(t);
      setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, dur || 4000);
    },
    startPolling: function () {
      if (S.pollTimer) clearInterval(S.pollTimer);
      var poll = function () {
        if (document.visibilityState !== 'visible') return;
        if (!prioritizeGitHubAuth()) return;
        if (!isPrototypePage()) return;

        function refreshFromDiscussion(discId) {
          if (!discId) return Promise.resolve();
          S.discussionId = discId;
          return loadComments(discId).then(function (comments) {
            var freshPins = parseComments(comments);
            if (!pinsDataChanged(S.pins, freshPins)) return;
            S.pins = freshPins;
            reconcileSeenStateAfterPinLoad();
            Overlay.renderPins();
            if (Panel.el && Panel.el.classList.contains('rhacs-panel--open')) Panel.render();
            FAB.updateBadge();
          });
        }

        if (S.discussionId) {
          refreshFromDiscussion(S.discussionId).catch(function () {});
        } else {
          findDiscussion().then(function (id) {
            if (id) refreshFromDiscussion(id).catch(function () {});
          }).catch(function () {});
        }
      };
      poll();
      S.pollTimer = setInterval(poll, CFG.pollMs);
      document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible') poll();
      });
    },
    showUnread: function () {
      FAB.updateBadge();
    },
    clearUnread: function () {
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
  // Mirrors RELEVANT_PATHS in VmPrototypeVersionSwitcher.tsx — the exact set of
  // pages where the version switcher renders. Keep in sync with that file when
  // adding new prototype pages (only this list needs updating, not the rest of
  // comments.js).
  var PROTOTYPE_PATHS = [
    '/main/risk',
    '/main/systemconfig',
    '/main/exception-configuration',
    '/main/violations',
    '/main/vulnerabilities/',
    '/main/clusters',
    '/main/system-health',
  ];

  function isPrototypePage() {
    var path = window.location.pathname;
    // Must be on a known prototype-capable pathname — hard gate.
    var isRelevantPath = PROTOTYPE_PATHS.some(function (p) {
      return path.indexOf(p) !== -1;
    });
    if (!isRelevantPath) return false;

    var v = new URLSearchParams(window.location.search).get('prototype');

    // sessionStorage fallback: only for /main/vulnerabilities/ sub-pages.
    // Those pages strip ?prototype= from the URL during React Router navigation
    // (linkForScopedVmPrototypeNav doesn't preserve it for all sub-routes) but
    // the user is still in a prototype session.
    //
    // For all other paths (systemconfig, exception-configuration, risk,
    // violations) the URL param is the authoritative source — switching to
    // "Baseline UI" removes the param but does NOT clear sessionStorage, so
    // trusting sessionStorage there would incorrectly show the baseline as a
    // prototype page.
    if (!v && path.indexOf('/main/vulnerabilities/') !== -1) {
      var stored = sessionStorage.getItem('acs.vmPrototype.tier');
      if (stored && stored !== 'baseline') v = stored;
    }

    return !!(v && v !== 'baseline' && /^v\d+$/i.test(v.trim()));
  }

  // Tracks prototype page context so benign history.replaceState calls (same route)
  // do not wipe in-memory comment state when the side panel is toggled.
  var _lastSyncKey = null;
  var _initialLoadDone = false;

  function getSyncKey() {
    return (isPrototypePage() ? 'on:' : 'off:') + getPageKey();
  }

  function pinsLoadedForCurrentPage() {
    return S._pinsPageKey === getPageKey() && S.pins.length > 0;
  }

  // Toggle the single mount wrapper — hides everything at once.
  // Also resets per-page state so navigating to a new page never shows stale pins.
  function syncVisibility() {
    var active = isPrototypePage();
    var mount = rhacsMount();
    mount.style.display = active ? '' : 'none';

    var syncKey = getSyncKey();
    if (_initialLoadDone && syncKey === _lastSyncKey) return;
    var contextChanged = syncKey !== _lastSyncKey;
    _lastSyncKey = syncKey;
    _initialLoadDone = true;

    if (contextChanged) {
      // Keep pins when prototype visibility flips (off→on) but init already fetched
      // this page — clearing here was wiping other reviewers' GitHub comments.
      if (!pinsLoadedForCurrentPage()) {
        S.showResolved = false;
        S.discussionId = null;
        S.pins = [];
        S._pinsPageKey = null;
        loadSeenState();
        if (Overlay.pinLayerEl) Overlay.renderPins();
        if (FAB.badge) FAB.updateBadge();
      }

      // Dismiss panel/popup UI on navigation without marking comments as read
      Panel.dismiss();
      Popup.close();
    }
    if (!active) {
      FAB.setMode(false);
      if (Popup.el) Popup._hidePopupEl();
      if (Panel.el) Panel.el.classList.remove('rhacs-panel--open');
      rhacsMount().classList.remove('rhacs-panel-open');
      Panel._pushPage(false);
      // Hide / remove all body-level overlays that may persist across navigation
      if (typeof Tooltip !== 'undefined' && Tooltip.hide) Tooltip.hide();
      if (typeof ModeAnnounce !== 'undefined' && ModeAnnounce._el) {
        ModeAnnounce._el.remove(); ModeAnnounce._el = null;
        if (ModeAnnounce._timer) { clearTimeout(ModeAnnounce._timer); ModeAnnounce._timer = null; }
      }
      // Dismiss any open confirmation dialog
      var backdrop = document.querySelector('.rhacs-confirm-backdrop');
      if (backdrop) backdrop.remove();
      // Hide pin layer (clear its children; the container can stay)
      var pinLayer = document.getElementById('rhacs-pin-layer');
      if (pinLayer) pinLayer.innerHTML = '';
    } else if (contextChanged) {
      if (pinsLoadedForCurrentPage()) {
        if (Overlay.pinLayerEl) scheduleRenderPinsAfterLayout();
        if (FAB.badge) FAB.updateBadge();
      } else {
        // Load the correct comments for the newly active prototype page
        loadAndRender();
      }
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

    // Persist share mode to sessionStorage so it survives SPA navigation
    try {
      if (shareToken()) {
        sessionStorage.setItem('rhacs_share_mode', '1');
      }
    } catch (e) {}

    Auth.init();
    AccessGate.check();
    loadSeenState();

    Overlay.init();
    document.addEventListener('focusin', function (e) {
      if (e.target && (e.target.tagName === 'BUTTON' || e.target.tagName === 'A')) {
        _lastFocusedBtn = e.target;
      }
    }, true);
    document.addEventListener('mousedown', function (e) {
      if (e.target && (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' ||
          (e.target.closest && e.target.closest('button, a[role="button"]')))) {
        var btn = e.target.closest ? (e.target.closest('button') || e.target.closest('a[role="button"]')) : e.target;
        if (btn && !btn.closest('#rhacs-mount')) _lastFocusedBtn = btn;
      }
    }, true);
    Popup.init();
    Panel.init();
    FAB.init();
    Tooltip.init();
    Notify.init();
    SelectionPopup.init();

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
      // Split button dropdown: close when clicking outside
      if (!e.target.closest('.rhacs-split-btn')) {
        document.querySelectorAll('.rhacs-split-btn__dropdown--open').forEach(function (d) {
          d.classList.remove('rhacs-split-btn__dropdown--open');
        });
      }
      // Popup: close on outside click; shake instead if there's unsaved input
      if (Popup.el && Popup._isPopupVisible()) {
        var clickedInsidePopup = isEventInsidePopup(e);
        if (!clickedInsidePopup) {
          if (Popup._suppressOutsideDismissUntil && Date.now() < Popup._suppressOutsideDismissUntil) return;
          var hasUnsavedInput = Popup._hasUnsavedInput();
          if (hasUnsavedInput) {
            // Shake to signal "you have unsaved text"
            Popup.el.classList.remove('rhacs-popup--shake');
            void Popup.el.offsetWidth; // force reflow so the animation restarts
            Popup.el.classList.add('rhacs-popup--shake');
            Popup.el.addEventListener('animationend', function removeShake() {
              Popup.el.removeEventListener('animationend', removeShake);
              // Explicitly cancel animation on compositor BEFORE removing class
              Popup.el.style.animation = 'none';
              requestAnimationFrame(function () {
                Popup.el.classList.remove('rhacs-popup--shake');
                requestAnimationFrame(function () {
                  Popup.el.style.animation = '';
                });
              });
            });
          } else {
            Popup.close();
          }
        }
      }
      // Panel intentionally does NOT close on outside clicks.
      // It can only be dismissed via its own close (×) button or the FAB "View all" toggle.
    });

    // Validate token + refresh GitHub profile on every load (clears stale guest S.user).
    var userPromise = S.token
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
