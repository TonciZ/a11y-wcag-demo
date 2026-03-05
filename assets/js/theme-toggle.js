/**
 * theme-toggle.js
 *
 * Applies and persists a dark/light theme.
 * Works alongside an inline <script> in <head> that applies the saved
 * theme before first paint to prevent flash-of-wrong-theme.
 *
 * Required HTML:
 *   <button class="theme-toggle" type="button" aria-pressed="false">
 *     Dark mode
 *   </button>
 *
 * Theme is stored in localStorage under the key "theme".
 * Falls back to prefers-color-scheme on first visit.
 */

(function () {
  'use strict';

  var STORAGE_KEY = 'theme';
  var DARK  = 'dark';
  var LIGHT = 'light';

  function getStoredOrSystem() {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved === DARK || saved === LIGHT) return saved;
    return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
      ? DARK
      : LIGHT;
  }

  function applyTheme(theme) {
    if (theme === DARK) {
      document.documentElement.setAttribute('data-theme', DARK);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  function syncButton(btn, theme) {
    var isDark = theme === DARK;
    btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    btn.innerHTML = isDark
      ? '<span class="theme-toggle__icon" aria-hidden="true">&#9728;&#65039;</span> Light mode'
      : '<span class="theme-toggle__icon" aria-hidden="true">&#127769;</span> Dark mode';
  }

  function init() {
    var btn = document.querySelector('.theme-toggle');
    if (!btn) return;

    var theme = getStoredOrSystem();
    applyTheme(theme);
    syncButton(btn, theme);

    btn.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme') === DARK ? DARK : LIGHT;
      var next = current === DARK ? LIGHT : DARK;
      applyTheme(next);
      syncButton(btn, next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
