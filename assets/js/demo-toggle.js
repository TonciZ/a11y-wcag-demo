/**
 * demo-toggle.js
 *
 * Handles all FAIL/PASS toggle buttons across demo containers.
 *
 * Required HTML structure per demo:
 *   .demo-container[data-mode="fail"]
 *     button.demo-toggle[aria-pressed="false"]
 *       .demo-toggle__label--fail
 *       .demo-toggle__label--pass[hidden]
 *     [data-demo-state="fail"]   — visible initially
 *     [data-demo-state="pass"]   — hidden initially (hidden attribute)
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
