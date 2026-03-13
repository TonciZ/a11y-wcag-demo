// checkpoint-nav.js - inject persistent navigation and mark current page
(function() {
  // Only run on checkpoint pages (not index)
  if (!document.body.classList.contains('checkpoint-page')) return;

  var navHTML = `
    <nav class="checkpoint-nav" aria-label="Checkpoint navigation">
      <div class="checkpoint-nav__group">
        <a href="../index.html#perceivable-heading" class="checkpoint-nav__heading">1 Perceivable</a>
        <ul class="checkpoint-nav__list">
          <li><a href="../index.html#sc-1-1-1" class="checkpoint-nav__guideline" aria-label="1.1 Text Alternatives guideline">1.1 Text Alternatives</a></li>
          <li><a href="1-1-1-non-text-content.html" class="checkpoint-nav__link" data-checkpoint="1-1-1" aria-label="1.1.1 Non-text Content"><span class="checkpoint-nav__code">1.1.1</span><span class="checkpoint-nav__title">Non-text Content</span></a></li>
          <li><a href="../index.html#sc-1-2-1" class="checkpoint-nav__guideline" aria-label="1.2 Time-based Media guideline">1.2 Time-based Media</a></li>
          <li><a href="1-2-1-audio-only-and-video-only-prerecorded.html" class="checkpoint-nav__link" data-checkpoint="1-2-1" aria-label="1.2.1 Audio-only and Video-only"><span class="checkpoint-nav__code">1.2.1</span><span class="checkpoint-nav__title">Audio-only and Video-only</span></a></li>
          <li><a href="1-2-2-captions-prerecorded.html" class="checkpoint-nav__link" data-checkpoint="1-2-2" aria-label="1.2.2 Captions (Prerecorded)"><span class="checkpoint-nav__code">1.2.2</span><span class="checkpoint-nav__title">Captions (Prerecorded)</span></a></li>
          <li><a href="../index.html#sc-1-3-1" class="checkpoint-nav__guideline" aria-label="1.3 Adaptable guideline">1.3 Adaptable</a></li>
          <li><a href="1-3-1-info-relationships.html" class="checkpoint-nav__link" data-checkpoint="1-3-1" aria-label="1.3.1 Info and Relationships"><span class="checkpoint-nav__code">1.3.1</span><span class="checkpoint-nav__title">Info and Relationships</span></a></li>
          <li><a href="1-3-2-meaningful-sequence.html" class="checkpoint-nav__link" data-checkpoint="1-3-2" aria-label="1.3.2 Meaningful Sequence"><span class="checkpoint-nav__code">1.3.2</span><span class="checkpoint-nav__title">Meaningful Sequence</span></a></li>
          <li><a href="1-3-3-sensory-characteristics.html" class="checkpoint-nav__link" data-checkpoint="1-3-3" aria-label="1.3.3 Sensory Characteristics"><span class="checkpoint-nav__code">1.3.3</span><span class="checkpoint-nav__title">Sensory Characteristics</span></a></li>
          <li><a href="1-3-4-orientation.html" class="checkpoint-nav__link" data-checkpoint="1-3-4" aria-label="1.3.4 Orientation"><span class="checkpoint-nav__code">1.3.4</span><span class="checkpoint-nav__title">Orientation</span></a></li>
          <li><a href="1-3-5-identify-input-purpose.html" class="checkpoint-nav__link" data-checkpoint="1-3-5" aria-label="1.3.5 Identify Input Purpose"><span class="checkpoint-nav__code">1.3.5</span><span class="checkpoint-nav__title">Identify Input Purpose</span></a></li>
          <li><a href="../index.html#sc-1-4-1" class="checkpoint-nav__guideline" aria-label="1.4 Distinguishable guideline">1.4 Distinguishable</a></li>
          <li><a href="1-4-1-use-of-color.html" class="checkpoint-nav__link" data-checkpoint="1-4-1" aria-label="1.4.1 Use of Color"><span class="checkpoint-nav__code">1.4.1</span><span class="checkpoint-nav__title">Use of Color</span></a></li>
          <li><a href="1-4-2-audio-control.html" class="checkpoint-nav__link" data-checkpoint="1-4-2" aria-label="1.4.2 Audio Control"><span class="checkpoint-nav__code">1.4.2</span><span class="checkpoint-nav__title">Audio Control</span></a></li>
          <li><a href="1-4-3-contrast-minimum.html" class="checkpoint-nav__link" data-checkpoint="1-4-3" aria-label="1.4.3 Contrast (Minimum)"><span class="checkpoint-nav__code">1.4.3</span><span class="checkpoint-nav__title">Contrast (Minimum)</span></a></li>
          <li><a href="1-4-4-resize-text.html" class="checkpoint-nav__link" data-checkpoint="1-4-4" aria-label="1.4.4 Resize Text"><span class="checkpoint-nav__code">1.4.4</span><span class="checkpoint-nav__title">Resize Text</span></a></li>
          <li><a href="1-4-5-images-of-text.html" class="checkpoint-nav__link" data-checkpoint="1-4-5" aria-label="1.4.5 Images of Text"><span class="checkpoint-nav__code">1.4.5</span><span class="checkpoint-nav__title">Images of Text</span></a></li>
          <li><a href="1-4-10-reflow.html" class="checkpoint-nav__link" data-checkpoint="1-4-10" aria-label="1.4.10 Reflow"><span class="checkpoint-nav__code">1.4.10</span><span class="checkpoint-nav__title">Reflow</span></a></li>
          <li><a href="1-4-11-non-text-contrast.html" class="checkpoint-nav__link" data-checkpoint="1-4-11" aria-label="1.4.11 Non-text Contrast"><span class="checkpoint-nav__code">1.4.11</span><span class="checkpoint-nav__title">Non-text Contrast</span></a></li>
          <li><a href="1-4-12-text-spacing.html" class="checkpoint-nav__link" data-checkpoint="1-4-12" aria-label="1.4.12 Text Spacing"><span class="checkpoint-nav__code">1.4.12</span><span class="checkpoint-nav__title">Text Spacing</span></a></li>
          <li><a href="1-4-13-content-on-hover-or-focus.html" class="checkpoint-nav__link" data-checkpoint="1-4-13" aria-label="1.4.13 Content on Hover or Focus"><span class="checkpoint-nav__code">1.4.13</span><span class="checkpoint-nav__title">Content on Hover or Focus</span></a></li>
        </ul>
      </div>

      <div class="checkpoint-nav__group">
        <a href="../index.html#operable-heading" class="checkpoint-nav__heading">2 Operable</a>
        <ul class="checkpoint-nav__list">
          <li><a href="../index.html#sc-2-1-1" class="checkpoint-nav__guideline" aria-label="2.1 Keyboard Accessible guideline">2.1 Keyboard Accessible</a></li>
          <li><a href="2-1-1-keyboard.html" class="checkpoint-nav__link" data-checkpoint="2-1-1" aria-label="2.1.1 Keyboard"><span class="checkpoint-nav__code">2.1.1</span><span class="checkpoint-nav__title">Keyboard</span></a></li>
          <li><a href="2-1-2-no-keyboard-trap.html" class="checkpoint-nav__link" data-checkpoint="2-1-2" aria-label="2.1.2 No Keyboard Trap"><span class="checkpoint-nav__code">2.1.2</span><span class="checkpoint-nav__title">No Keyboard Trap</span></a></li>
          <li><a href="2-1-4-character-key-shortcuts.html" class="checkpoint-nav__link" data-checkpoint="2-1-4" aria-label="2.1.4 Character Key Shortcuts"><span class="checkpoint-nav__code">2.1.4</span><span class="checkpoint-nav__title">Character Key Shortcuts</span></a></li>
          <li><a href="../index.html#sc-2-2-1" class="checkpoint-nav__guideline" aria-label="2.2 Enough Time guideline">2.2 Enough Time</a></li>
          <li><a href="2-2-2-pause-stop-hide.html" class="checkpoint-nav__link" data-checkpoint="2-2-2" aria-label="2.2.2 Pause, Stop, Hide"><span class="checkpoint-nav__code">2.2.2</span><span class="checkpoint-nav__title">Pause, Stop, Hide</span></a></li>
          <li><a href="../index.html#sc-2-4-1" class="checkpoint-nav__guideline" aria-label="2.4 Navigable guideline">2.4 Navigable</a></li>
          <li><a href="2-4-1-bypass-blocks.html" class="checkpoint-nav__link" data-checkpoint="2-4-1" aria-label="2.4.1 Bypass Blocks"><span class="checkpoint-nav__code">2.4.1</span><span class="checkpoint-nav__title">Bypass Blocks</span></a></li>
          <li><a href="2-4-2-page-titled.html" class="checkpoint-nav__link" data-checkpoint="2-4-2" aria-label="2.4.2 Page Titled"><span class="checkpoint-nav__code">2.4.2</span><span class="checkpoint-nav__title">Page Titled</span></a></li>
          <li><a href="2-4-3-focus-order.html" class="checkpoint-nav__link" data-checkpoint="2-4-3" aria-label="2.4.3 Focus Order"><span class="checkpoint-nav__code">2.4.3</span><span class="checkpoint-nav__title">Focus Order</span></a></li>
          <li><a href="2-4-4-link-purpose-in-context.html" class="checkpoint-nav__link" data-checkpoint="2-4-4" aria-label="2.4.4 Link Purpose (In Context)"><span class="checkpoint-nav__code">2.4.4</span><span class="checkpoint-nav__title">Link Purpose (In Context)</span></a></li>
          <li><a href="2-4-6-headings-and-labels.html" class="checkpoint-nav__link" data-checkpoint="2-4-6" aria-label="2.4.6 Headings and Labels"><span class="checkpoint-nav__code">2.4.6</span><span class="checkpoint-nav__title">Headings and Labels</span></a></li>
          <li><a href="2-4-7-focus-visible.html" class="checkpoint-nav__link" data-checkpoint="2-4-7" aria-label="2.4.7 Focus Visible"><span class="checkpoint-nav__code">2.4.7</span><span class="checkpoint-nav__title">Focus Visible</span></a></li>
          <li><a href="2-4-11-focus-not-obscured-minimum.html" class="checkpoint-nav__link" data-checkpoint="2-4-11" aria-label="2.4.11 Focus Not Obscured (Minimum)"><span class="checkpoint-nav__code">2.4.11</span><span class="checkpoint-nav__title">Focus Not Obscured (Minimum)</span></a></li>
          <li><a href="2-4-13-focus-appearance.html" class="checkpoint-nav__link" data-checkpoint="2-4-13" aria-label="2.4.13 Focus Appearance"><span class="checkpoint-nav__code">2.4.13</span><span class="checkpoint-nav__title">Focus Appearance</span></a></li>
          <li><a href="../index.html#sc-2-5-1" class="checkpoint-nav__guideline" aria-label="2.5 Input Modalities guideline">2.5 Input Modalities</a></li>
          <li><a href="2-5-2-pointer-cancellation.html" class="checkpoint-nav__link" data-checkpoint="2-5-2" aria-label="2.5.2 Pointer Cancellation"><span class="checkpoint-nav__code">2.5.2</span><span class="checkpoint-nav__title">Pointer Cancellation</span></a></li>
          <li><a href="2-5-3-label-in-name.html" class="checkpoint-nav__link" data-checkpoint="2-5-3" aria-label="2.5.3 Label in Name"><span class="checkpoint-nav__code">2.5.3</span><span class="checkpoint-nav__title">Label in Name</span></a></li>
          <li><a href="2-5-7-dragging-movements.html" class="checkpoint-nav__link" data-checkpoint="2-5-7" aria-label="2.5.7 Dragging Movements"><span class="checkpoint-nav__code">2.5.7</span><span class="checkpoint-nav__title">Dragging Movements</span></a></li>
          <li><a href="2-5-8-target-size-minimum.html" class="checkpoint-nav__link" data-checkpoint="2-5-8" aria-label="2.5.8 Target Size (Minimum)"><span class="checkpoint-nav__code">2.5.8</span><span class="checkpoint-nav__title">Target Size (Minimum)</span></a></li>
        </ul>
      </div>

      <div class="checkpoint-nav__group">
        <a href="../index.html#understandable-heading" class="checkpoint-nav__heading">3 Understandable</a>
        <ul class="checkpoint-nav__list">
          <li><a href="../index.html#sc-3-1-1" class="checkpoint-nav__guideline" aria-label="3.1 Readable guideline">3.1 Readable</a></li>
          <li><a href="3-1-1-language-of-page.html" class="checkpoint-nav__link" data-checkpoint="3-1-1" aria-label="3.1.1 Language of Page"><span class="checkpoint-nav__code">3.1.1</span><span class="checkpoint-nav__title">Language of Page</span></a></li>
          <li><a href="3-1-2-language-of-parts.html" class="checkpoint-nav__link" data-checkpoint="3-1-2" aria-label="3.1.2 Language of Parts"><span class="checkpoint-nav__code">3.1.2</span><span class="checkpoint-nav__title">Language of Parts</span></a></li>
          <li><a href="../index.html#sc-3-2-1" class="checkpoint-nav__guideline" aria-label="3.2 Predictable guideline">3.2 Predictable</a></li>
          <li><a href="3-2-1-on-focus.html" class="checkpoint-nav__link" data-checkpoint="3-2-1" aria-label="3.2.1 On Focus"><span class="checkpoint-nav__code">3.2.1</span><span class="checkpoint-nav__title">On Focus</span></a></li>
          <li><a href="3-2-2-on-input.html" class="checkpoint-nav__link" data-checkpoint="3-2-2" aria-label="3.2.2 On Input"><span class="checkpoint-nav__code">3.2.2</span><span class="checkpoint-nav__title">On Input</span></a></li>
          <li><a href="3-2-6-consistent-help.html" class="checkpoint-nav__link" data-checkpoint="3-2-6" aria-label="3.2.6 Consistent Help"><span class="checkpoint-nav__code">3.2.6</span><span class="checkpoint-nav__title">Consistent Help</span></a></li>
          <li><a href="../index.html#sc-3-3-1" class="checkpoint-nav__guideline" aria-label="3.3 Input Assistance guideline">3.3 Input Assistance</a></li>
          <li><a href="3-3-1-error-identification.html" class="checkpoint-nav__link" data-checkpoint="3-3-1" aria-label="3.3.1 Error Identification"><span class="checkpoint-nav__code">3.3.1</span><span class="checkpoint-nav__title">Error Identification</span></a></li>
          <li><a href="3-3-2-labels-or-instructions.html" class="checkpoint-nav__link" data-checkpoint="3-3-2" aria-label="3.3.2 Labels or Instructions"><span class="checkpoint-nav__code">3.3.2</span><span class="checkpoint-nav__title">Labels or Instructions</span></a></li>
          <li><a href="3-3-3-error-suggestion.html" class="checkpoint-nav__link" data-checkpoint="3-3-3" aria-label="3.3.3 Error Suggestion"><span class="checkpoint-nav__code">3-3-3</span><span class="checkpoint-nav__title">Error Suggestion</span></a></li>
          <li><a href="3-3-7-redundant-entry.html" class="checkpoint-nav__link" data-checkpoint="3-3-7" aria-label="3.3.7 Redundant Entry"><span class="checkpoint-nav__code">3.3.7</span><span class="checkpoint-nav__title">Redundant Entry</span></a></li>
          <li><a href="3-3-8-accessible-authentication-minimum.html" class="checkpoint-nav__link" data-checkpoint="3-3-8" aria-label="3.3.8 Accessible Authentication (Minimum)"><span class="checkpoint-nav__code">3.3.8</span><span class="checkpoint-nav__title">Accessible Authentication (Minimum)</span></a></li>
        </ul>
      </div>

      <div class="checkpoint-nav__group">
        <a href="../index.html#robust-heading" class="checkpoint-nav__heading">4 Robust</a>
        <ul class="checkpoint-nav__list">
          <li><a href="../index.html#sc-4-1-1" class="checkpoint-nav__guideline" aria-label="4.1 Compatible guideline">4.1 Compatible</a></li>
          <li><a href="4-1-2-name-role-value.html" class="checkpoint-nav__link" data-checkpoint="4-1-2" aria-label="4.1.2 Name, Role, Value"><span class="checkpoint-nav__code">4.1.2</span><span class="checkpoint-nav__title">Name, Role, Value</span></a></li>
          <li><a href="4-1-3-status-messages.html" class="checkpoint-nav__link" data-checkpoint="4-1-3" aria-label="4.1.3 Status Messages"><span class="checkpoint-nav__code">4.1.3</span><span class="checkpoint-nav__title">Status Messages</span></a></li>
        </ul>
      </div>
    </nav>
  `;

  // Extract checkpoint ID from current page URL
  var currentFile = window.location.pathname.split('/').pop();
  var currentCheckpoint = currentFile.replace('.html', '').match(/\d+-\d+-\d+/);
  if (currentCheckpoint) {
    currentCheckpoint = currentCheckpoint[0];
  }

  // Create wrapper and inject navigation
  var mainContent = document.getElementById('main-content');
  if (mainContent) {
    var wrapper = document.createElement('div');
    wrapper.className = 'index-layout';
    wrapper.innerHTML = navHTML;

    // Move main content into wrapper
    mainContent.parentNode.insertBefore(wrapper, mainContent);
    wrapper.appendChild(mainContent);

    // Mark current page as active
    if (currentCheckpoint) {
      var activeLink = wrapper.querySelector('[data-checkpoint="' + currentCheckpoint + '"]');
      if (activeLink) {
        activeLink.setAttribute('aria-current', 'page');
        activeLink.classList.add('checkpoint-nav__link--active');

        // Scroll the nav to show the active item
        setTimeout(function() {
          activeLink.scrollIntoView({ block: 'center', behavior: 'auto' });
        }, 100);
      }
    }
  }
})();
