// Keep GitHub star counts on research project links current without blocking page render.
(function () {
  var REFRESH_MS = 30 * 60 * 1000;
  var CACHE_PREFIX = 'alexandertsui:github-stars:';
  var inFlight = {};

  function trackers() {
    return document.querySelectorAll('[data-github-repo]');
  }

  function formatCount(value) {
    var raw = String(value == null ? '' : value).trim();
    if (/^\d+$/.test(raw)) return Number(raw).toLocaleString('en-US');
    if (/^\d{1,3}(?:,\d{3})+$/.test(raw)) return raw;
    if (/^\d+(?:\.\d+)?[kKmMbBtT]$/.test(raw)) return raw;
    return null;
  }

  function render(repo, count) {
    var formatted = formatCount(count);
    if (!formatted) return;

    trackers().forEach(function (tracker) {
      if (tracker.getAttribute('data-github-repo') !== repo) return;
      var display = tracker.querySelector('[data-github-star-display]');
      var countNode = tracker.querySelector('[data-github-star-count]');
      if (!display || !countNode) return;
      countNode.textContent = formatted;
      display.setAttribute('aria-label', formatted + ' GitHub stars');
    });
  }

  function readCache(repo) {
    try {
      var cached = JSON.parse(localStorage.getItem(CACHE_PREFIX + repo));
      if (!cached || typeof cached.updatedAt !== 'number' || !formatCount(cached.count)) return null;
      return cached;
    } catch (error) {
      return null;
    }
  }

  function writeCache(repo, count) {
    try {
      localStorage.setItem(CACHE_PREFIX + repo, JSON.stringify({ count: count, updatedAt: Date.now() }));
    } catch (error) {
      // The visible fallback count still works when storage is unavailable.
    }
  }

  function fetchCount(repo) {
    if (inFlight[repo] || typeof window.fetch !== 'function') return;
    var encoded = repo.split('/').map(encodeURIComponent).join('/');
    inFlight[repo] = window.fetch('https://img.shields.io/github/stars/' + encoded + '.json', {
      credentials: 'omit'
    }).then(function (response) {
      if (!response.ok) throw new Error('GitHub star service returned ' + response.status);
      return response.json();
    }).then(function (data) {
      var count = formatCount(data && data.value);
      if (!count) throw new Error('GitHub star service returned an invalid count');
      render(repo, count);
      writeCache(repo, count);
    }).catch(function () {
      // Keep the server-rendered count when the remote service is unavailable.
    }).then(function () {
      delete inFlight[repo];
    });
  }

  function refresh() {
    if (document.hidden) return;
    var now = Date.now();
    var seen = {};
    trackers().forEach(function (tracker) {
      var repo = tracker.getAttribute('data-github-repo');
      if (!repo || seen[repo]) return;
      seen[repo] = true;
      var cached = readCache(repo);
      if (cached) render(repo, cached.count);
      if (!cached || now - cached.updatedAt >= REFRESH_MS) fetchCount(repo);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!trackers().length) return;
    refresh();
    window.setInterval(refresh, REFRESH_MS);
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) refresh();
    });
  });
})();
