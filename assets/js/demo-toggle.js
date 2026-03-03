/**
 * demo-toggle.js
 *
 * Handles all FAIL/PASS toggle buttons across demo containers.
 *
 * Required HTML structure per demo:
 *
 *   <div class="demo-container"
 *        data-mode="fail"
 *        role="region"
 *        aria-labelledby="{label-id}"
 *        data-announce-fail="Showing fail example. {context}"
 *        data-announce-pass="Showing pass example. {context}">
 *
 *     <div class="demo-container__toolbar">
 *       <span id="{label-id}" class="demo-container__label">...</span>
 *       <button class="demo-toggle" type="button" aria-pressed="false">
 *         <span class="demo-toggle__label--fail">Show passing example</span>
 *         <span class="demo-toggle__label--pass" hidden>Show failing example</span>
 *       </button>
 *     </div>
 *
 *     <div class="demo-status" aria-hidden="true">...</div>
 *     <div class="visually-hidden" aria-live="polite" aria-atomic="true" data-demo-announcement></div>
 *
 *     <div class="demo-stage">
 *       <div data-demo-state="fail">...</div>
 *       <div data-demo-state="pass" hidden>...</div>
 *     </div>
 *
 *   </div>
 */

(function () {
  'use strict';

  function initDemoToggle(button) {
    var container = button.closest('.demo-container');
    if (!container) return;

    button.addEventListener('click', function () {
      var isCurrentlyPass = button.getAttribute('aria-pressed') === 'true';
      var nextMode = isCurrentlyPass ? 'fail' : 'pass';

      // Update container state
      container.setAttribute('data-mode', nextMode);

      // Update button pressed state
      button.setAttribute('aria-pressed', isCurrentlyPass ? 'false' : 'true');

      // Swap visible label text
      var labelFail = button.querySelector('.demo-toggle__label--fail');
      var labelPass = button.querySelector('.demo-toggle__label--pass');
      if (labelFail && labelPass) {
        labelFail.hidden = !isCurrentlyPass;
        labelPass.hidden = isCurrentlyPass;
      }

      // Swap demo state panels
      var failPanel = container.querySelector('[data-demo-state="fail"]');
      var passPanel = container.querySelector('[data-demo-state="pass"]');
      if (failPanel && passPanel) {
        failPanel.hidden = !isCurrentlyPass;
        passPanel.hidden = isCurrentlyPass;
      }

      // Announce state change to screen readers via live region.
      // Live regions only fire on DOM text changes — not CSS changes —
      // so we maintain a dedicated hidden element for this.
      var announcement = container.querySelector('[data-demo-announcement]');
      if (announcement) {
        var msg = nextMode === 'pass'
          ? (container.dataset.announcePass || 'Now showing: pass example.')
          : (container.dataset.announceFail || 'Now showing: fail example.');
        announcement.textContent = msg;
      }
    });
  }

  function init() {
    var buttons = document.querySelectorAll('.demo-toggle');
    buttons.forEach(initDemoToggle);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
