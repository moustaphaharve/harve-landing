/**
 * Harve Help — floating widget (home + AI-style answers).
 *
 * What Cluely uses in screenshots: typically Intercom + Fin (hosted). You’d paste their
 * snippet and remove this file — or keep this and point it at your own API.
 *
 * Optional later:
 *   window.HARVE_HELP_CHAT_ENDPOINT = 'https://api.harve.ai/support/chat';
 *   POST JSON { "message": "..." } → { "reply": "html or plain text", "link"?: "url" }
 */
(function () {
  'use strict';

  var ENDPOINT = typeof window !== 'undefined' && window.HARVE_HELP_CHAT_ENDPOINT;

  /** Quick links shown on Home (filterable by search) */
  var QUICK_LINKS = [
    { label: 'Install Harve (Mac & Windows)', href: '/support/articles/install-harve.html' },
    { label: 'Browser sign-in & “Opening Harve”', href: '/support/articles/opening-harve-page.html' },
    { label: 'Connect bank & payouts', href: '/support/articles/connect-bank-stripe.html' },
    { label: 'Recording & the pill', href: '/support/articles/pill-and-controls.html' },
    { label: 'Troubleshooting uploads', href: '/support/articles/upload-or-sync-failed.html' },
    { label: 'Contact support', href: '/support/articles/contact-support.html' },
  ];

  /**
   * Lightweight “AI” from help content — replace with real model via ENDPOINT.
   * Each entry: keywords to match (lowercase), short reply, optional article link.
   */
  var KNOWLEDGE = [
    {
      keys: ['install', 'download', 'windows', 'mac', 'setup', 'first'],
      text: 'Start with a clean install and onboarding — we walk through permissions and your first session in the docs.',
      href: '/support/getting-started.html',
    },
    {
      keys: ['login', 'sign in', 'browser', 'workos', 'email', 'wrong account', 'logout'],
      text: 'Sign-in happens in the browser; the “Opening Harve” page hands off back to the app. Wrong account? Sign out from Settings.',
      href: '/support/account-sign-in.html',
    },
    {
      keys: ['pay', 'payout', 'stripe', 'bank', 'money', 'earnings', 'monday'],
      text: 'Payouts go through Stripe Connect after you add a bank. Thresholds and timing are explained in Earnings & payouts.',
      href: '/support/earnings-payouts.html',
    },
    {
      keys: ['record', 'pill', 'overlay', 'shortcut', 'pause', 'screen'],
      text: 'The pill controls recording; you can pause for sensitive apps. Shortcuts and what gets captured are in Recording & overlay.',
      href: '/support/recording-overlay.html',
    },
    {
      keys: ['privacy', 'data', 'kyc', 'verification', 'delete'],
      text: 'We collect what’s needed to run Harve and pay you; you can request data or ask questions under Privacy & your data.',
      href: '/support/privacy-data.html',
    },
    {
      keys: ['error', 'crash', 'upload', 'sync', 'fix', 'not working', 'troubleshoot'],
      text: 'Try the troubleshooting collection first — many upload and app issues have step-by-step fixes.',
      href: '/support/troubleshooting.html',
    },
    {
      keys: ['ticket', 'human', 'support', 'contact', 'email'],
      text: 'If you’re still stuck after trying the articles, email us — we read every message.',
      href: '/support/articles/contact-support.html',
    },
  ];

  var FALLBACK =
    'I’m Harve’s assistant (demo mode): I match your question to our help articles. Try rephrasing, browse collections on this page, or email <a href="mailto:support@harve.ai">support@harve.ai</a> for a human.';

  function norm(s) {
    return (s || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function bestKnowledge(q) {
    var n = norm(q);
    if (!n) return null;
    var best = null;
    var bestScore = 0;
    KNOWLEDGE.forEach(function (row) {
      var score = 0;
      row.keys.forEach(function (k) {
        if (n.indexOf(k) !== -1) score += k.split(' ').length + 2;
      });
      if (score > bestScore) {
        bestScore = score;
        best = row;
      }
    });
    return bestScore >= 2 ? best : null;
  }

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function chev() {
    return '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>';
  }

  function build(root) {
    root.className = 'hhw-root';
    root.setAttribute('aria-live', 'polite');

    var launcher = el('button', 'hhw-launcher');
    launcher.type = 'button';
    launcher.setAttribute('aria-expanded', 'false');
    launcher.setAttribute('aria-label', 'Open Harve help');
    launcher.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>';

    var panel = el('div', 'hhw-panel');
    panel.id = 'hhw-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-label', 'Harve help');

    var header = el('header', 'hhw-header');
    header.innerHTML =
      '<div><h2>Hi there 👋</h2><p>How can we help?</p></div>';
    var closeBtn = el('button', 'hhw-close');
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.innerHTML =
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>';
    header.appendChild(closeBtn);

    var body = el('div', 'hhw-body');

    /* Home */
    var viewHome = el('div', 'hhw-view hhw-view--home');
    var searchBox = el('div', 'hhw-search');
    searchBox.innerHTML =
      '<label for="hhw-filter">Search help</label><div class="hhw-search-wrap"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg><input type="search" id="hhw-filter" placeholder="Search for help" autocomplete="off" /></div>';
    var linksWrap = el('div', 'hhw-links');
    var linkEls = [];
    function renderLinks(filter) {
      var f = norm(filter);
      linksWrap.innerHTML = '';
      linkEls = [];
      QUICK_LINKS.forEach(function (item) {
        if (f && norm(item.label).indexOf(f) === -1 && f.length > 1) return;
        var a = el('a', 'hhw-link');
        a.href = item.href;
        a.innerHTML = '<span>' + escapeHtml(item.label) + '</span>' + chev();
        linksWrap.appendChild(a);
      });
    }
    function escapeHtml(s) {
      var d = document.createElement('div');
      d.textContent = s;
      return d.innerHTML;
    }
    renderLinks('');

    var askRow = el('div', 'hhw-ask-row');
    var askBtn = el('button', 'hhw-ask');
    askBtn.type = 'button';
    askBtn.innerHTML = '<span>Ask a question</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';

    viewHome.appendChild(searchBox);
    viewHome.appendChild(linksWrap);
    viewHome.appendChild(askRow);
    askRow.appendChild(askBtn);

    /* Chat */
    var viewChat = el('div', 'hhw-view hhw-view--chat');
    viewChat.hidden = true;
    var chatTop = el('div', 'hhw-chat-head');
    var backBtn = el('button', 'hhw-back');
    backBtn.type = 'button';
    backBtn.setAttribute('aria-label', 'Back');
    backBtn.innerHTML =
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>';
    var chatHeadText = el('div');
    chatHeadText.innerHTML =
      '<div class="hhw-chat-title">Harve Assistant</div><div class="hhw-chat-sub">Guidance from our help center · AI-style</div>';
    chatTop.appendChild(backBtn);
    chatTop.appendChild(chatHeadText);

    var messages = el('div', 'hhw-messages');
    var welcome = el('div', 'hhw-msg');
    welcome.innerHTML =
      'Ask anything about Harve — I’ll point you to the right article when I can. <span class="hhw-msg-meta">Harve Assistant · Just now</span>';

    var pills = el('div', 'hhw-pills');
    var pillLabels = ['Getting started', 'Payouts', 'Recording', 'Privacy', 'Contact'];
    pillLabels.forEach(function (label) {
      var p = el('button', 'hhw-pill');
      p.type = 'button';
      p.textContent = label;
      p.addEventListener('click', function () {
        textarea.value = 'Tell me about ' + label.toLowerCase();
        send();
      });
      pills.appendChild(p);
    });

    var composer = el('div', 'hhw-composer');
    var textarea = el('textarea');
    textarea.rows = 1;
    textarea.placeholder = 'Ask a question…';
    textarea.setAttribute('aria-label', 'Your question');
    var sendBtn = el('button', 'hhw-send');
    sendBtn.type = 'button';
    sendBtn.disabled = true;
    sendBtn.setAttribute('aria-label', 'Send');
    sendBtn.innerHTML =
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m22 2-7 20-4-9-9-4 20-7z"/><path d="M22 2 11 13"/></svg>';

    messages.appendChild(welcome);
    viewChat.appendChild(chatTop);
    viewChat.appendChild(messages);
    viewChat.appendChild(pills);
    viewChat.appendChild(composer);
    composer.appendChild(textarea);
    composer.appendChild(sendBtn);

    panel.appendChild(header);
    body.appendChild(viewHome);
    body.appendChild(viewChat);
    panel.appendChild(body);

    root.appendChild(panel);
    root.appendChild(launcher);

    var filterInput = searchBox.querySelector('#hhw-filter');
    filterInput.addEventListener('input', function () {
      renderLinks(filterInput.value);
    });

    function openPanel() {
      root.classList.add('is-open');
      launcher.setAttribute('aria-expanded', 'true');
      closeBtn.focus();
    }
    function closePanel() {
      root.classList.remove('is-open');
      launcher.setAttribute('aria-expanded', 'false');
    }

    launcher.addEventListener('click', function () {
      if (root.classList.contains('is-open')) closePanel();
      else openPanel();
    });
    closeBtn.addEventListener('click', closePanel);

    askBtn.addEventListener('click', function () {
      viewHome.hidden = true;
      viewChat.hidden = false;
      textarea.focus();
    });
    backBtn.addEventListener('click', function () {
      viewChat.hidden = true;
      viewHome.hidden = false;
      filterInput.focus();
    });

    function addUser(text) {
      var m = el('div', 'hhw-msg hhw-msg--user');
      m.textContent = text;
      messages.appendChild(m);
      messages.scrollTop = messages.scrollHeight;
    }

    function addBot(html, meta) {
      var m = el('div', 'hhw-msg');
      m.innerHTML = html + (meta ? '<div class="hhw-msg-meta">' + escapeHtml(meta) + '</div>' : '');
      messages.appendChild(m);
      messages.scrollTop = messages.scrollHeight;
    }

    function showTyping() {
      var t = el('div', 'hhw-typing');
      t.setAttribute('aria-hidden', 'true');
      t.innerHTML = '<span></span><span></span><span></span>';
      messages.appendChild(t);
      messages.scrollTop = messages.scrollHeight;
      return t;
    }

    function replyLocal(q) {
      var hit = bestKnowledge(q);
      if (hit) {
        var link = hit.href
          ? ' <a href="' + hit.href + '">Open collection →</a>'
          : '';
        return { html: hit.text + link, meta: 'Harve Assistant · Matched help topic' };
      }
      return { html: FALLBACK, meta: 'Harve Assistant' };
    }

    function send() {
      var q = (textarea.value || '').trim();
      if (!q) return;
      addUser(q);
      textarea.value = '';
      sendBtn.disabled = true;
      var typingEl = showTyping();

      function finish(html, meta) {
        if (typingEl.parentNode) typingEl.parentNode.removeChild(typingEl);
        addBot(html, meta);
      }

      if (ENDPOINT) {
        fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: q }),
        })
          .then(function (r) {
            return r.json();
          })
          .then(function (data) {
            var html = data.reply || data.text || '';
            var link = data.link ? ' <a href="' + data.link + '">Learn more →</a>' : '';
            finish(html + link, data.meta || 'Harve');
          })
          .catch(function () {
            var r = replyLocal(q);
            finish(r.html, r.meta);
          });
        return;
      }

      window.setTimeout(function () {
        var r = replyLocal(q);
        finish(r.html, r.meta);
      }, 450 + Math.random() * 400);
    }

    textarea.addEventListener('input', function () {
      sendBtn.disabled = !textarea.value.trim();
    });
    textarea.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (!sendBtn.disabled) send();
      }
    });
    sendBtn.addEventListener('click', send);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && root.classList.contains('is-open')) {
        closePanel();
      }
    });
  }

  function init() {
    var root = document.getElementById('harve-help-widget');
    if (!root) {
      root = document.createElement('div');
      root.id = 'harve-help-widget';
      document.body.appendChild(root);
    }
    build(root);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
