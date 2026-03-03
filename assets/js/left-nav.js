/* left-nav.js — injects a persistent left nav listing all WCAG 2.2 checkpoints */

(function () {
  'use strict';

  const PRINCIPLES = [
    {
      id: 'perceivable',
      label: 'Perceivable',
      checkpoints: [
        { id: '1.1.1', title: 'Non-text Content',                     level: 'A',  file: '1-1-1-non-text-content.html' },
        { id: '1.2.1', title: 'Audio-only and Video-only',            level: 'A',  file: '1-2-1-audio-only-and-video-only-prerecorded.html' },
        { id: '1.2.2', title: 'Captions (Prerecorded)',               level: 'A',  file: '1-2-2-captions-prerecorded.html' },
        { id: '1.3.1', title: 'Info and Relationships',               level: 'A',  file: '1-3-1-info-relationships.html' },
        { id: '1.3.2', title: 'Meaningful Sequence',                  level: 'A',  file: '1-3-2-meaningful-sequence.html' },
        { id: '1.3.3', title: 'Sensory Characteristics',              level: 'A',  file: '1-3-3-sensory-characteristics.html' },
        { id: '1.3.4', title: 'Orientation',                          level: 'AA', file: '1-3-4-orientation.html' },
        { id: '1.3.5', title: 'Identify Input Purpose',               level: 'AA', file: '1-3-5-identify-input-purpose.html' },
        { id: '1.4.1', title: 'Use of Color',                         level: 'A',  file: '1-4-1-use-of-color.html' },
        { id: '1.4.2', title: 'Audio Control',                        level: 'A',  file: '1-4-2-audio-control.html' },
        { id: '1.4.3', title: 'Contrast (Minimum)',                   level: 'AA', file: '1-4-3-contrast-minimum.html' },
        { id: '1.4.4', title: 'Resize Text',                          level: 'AA', file: '1-4-4-resize-text.html' },
        { id: '1.4.5', title: 'Images of Text',                       level: 'AA', file: '1-4-5-images-of-text.html' },
        { id: '1.4.10', title: 'Reflow',                              level: 'AA', file: '1-4-10-reflow.html' },
        { id: '1.4.11', title: 'Non-text Contrast',                   level: 'AA', file: '1-4-11-non-text-contrast.html' },
        { id: '1.4.12', title: 'Text Spacing',                        level: 'AA', file: '1-4-12-text-spacing.html' },
        { id: '1.4.13', title: 'Content on Hover or Focus',           level: 'AA', file: '1-4-13-content-on-hover-or-focus.html' },
      ]
    },
    {
      id: 'operable',
      label: 'Operable',
      checkpoints: [
        { id: '2.1.1', title: 'Keyboard',                             level: 'A',  file: '2-1-1-keyboard.html' },
        { id: '2.1.2', title: 'No Keyboard Trap',                     level: 'A',  file: '2-1-2-no-keyboard-trap.html' },
        { id: '2.1.4', title: 'Character Key Shortcuts',              level: 'A',  file: '2-1-4-character-key-shortcuts.html' },
        { id: '2.2.2', title: 'Pause, Stop, Hide',                    level: 'A',  file: '2-2-2-pause-stop-hide.html' },
        { id: '2.4.1', title: 'Bypass Blocks',                        level: 'A',  file: '2-4-1-bypass-blocks.html' },
        { id: '2.4.2', title: 'Page Titled',                          level: 'A',  file: '2-4-2-page-titled.html' },
        { id: '2.4.3', title: 'Focus Order',                          level: 'A',  file: '2-4-3-focus-order.html' },
        { id: '2.4.4', title: 'Link Purpose (In Context)',            level: 'A',  file: '2-4-4-link-purpose-in-context.html' },
        { id: '2.4.6', title: 'Headings and Labels',                  level: 'AA', file: '2-4-6-headings-and-labels.html' },
        { id: '2.4.7', title: 'Focus Visible',                        level: 'AA', file: '2-4-7-focus-visible.html' },
        { id: '2.4.11', title: 'Focus Not Obscured (Minimum)',        level: 'AA', file: '2-4-11-focus-not-obscured-minimum.html' },
        { id: '2.4.13', title: 'Focus Appearance',                    level: 'AA', file: '2-4-13-focus-appearance.html' },
        { id: '2.5.2', title: 'Pointer Cancellation',                 level: 'A',  file: '2-5-2-pointer-cancellation.html' },
        { id: '2.5.3', title: 'Label in Name',                        level: 'A',  file: '2-5-3-label-in-name.html' },
        { id: '2.5.7', title: 'Dragging Movements',                   level: 'AA', file: '2-5-7-dragging-movements.html' },
        { id: '2.5.8', title: 'Target Size (Minimum)',                level: 'AA', file: '2-5-8-target-size-minimum.html' },
      ]
    },
    {
      id: 'understandable',
      label: 'Understandable',
      checkpoints: [
        { id: '3.1.1', title: 'Language of Page',                     level: 'A',  file: '3-1-1-language-of-page.html' },
        { id: '3.1.2', title: 'Language of Parts',                    level: 'AA', file: '3-1-2-language-of-parts.html' },
        { id: '3.2.1', title: 'On Focus',                             level: 'A',  file: '3-2-1-on-focus.html' },
        { id: '3.2.2', title: 'On Input',                             level: 'A',  file: '3-2-2-on-input.html' },
        { id: '3.2.6', title: 'Consistent Help',                      level: 'A',  file: '3-2-6-consistent-help.html' },
        { id: '3.3.1', title: 'Error Identification',                 level: 'A',  file: '3-3-1-error-identification.html' },
        { id: '3.3.2', title: 'Labels or Instructions',               level: 'A',  file: '3-3-2-labels-or-instructions.html' },
        { id: '3.3.3', title: 'Error Suggestion',                     level: 'AA', file: '3-3-3-error-suggestion.html' },
        { id: '3.3.7', title: 'Redundant Entry',                      level: 'A',  file: '3-3-7-redundant-entry.html' },
        { id: '3.3.8', title: 'Accessible Authentication (Minimum)',  level: 'AA', file: '3-3-8-accessible-authentication-minimum.html' },
      ]
    },
    {
      id: 'robust',
      label: 'Robust',
      checkpoints: [
        { id: '4.1.2', title: 'Name, Role, Value',                    level: 'A',  file: '4-1-2-name-role-value.html' },
        { id: '4.1.3', title: 'Status Messages',                      level: 'AA', file: '4-1-3-status-messages.html' },
      ]
    }
  ];

  // Determine if we're on index or a checkpoint page
  const path = window.location.pathname;
  const isCheckpoint = path.includes('/checkpoints/');
  const rootPath = isCheckpoint ? '../' : '';
  const checkpointsPath = isCheckpoint ? '' : 'checkpoints/';

  // Detect current checkpoint file name
  const currentFile = path.split('/').pop() || '';

  // --- Build nav element ---

  const nav = document.createElement('nav');
  nav.className = 'left-nav';
  nav.setAttribute('aria-label', 'WCAG checkpoints');

  // Mobile toggle button (visible only on small screens)
  const toggle = document.createElement('button');
  toggle.className = 'left-nav__toggle';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', 'left-nav-list');
  toggle.textContent = 'Checkpoints';
  nav.appendChild(toggle);

  const navInner = document.createElement('div');
  navInner.className = 'left-nav__inner';
  navInner.id = 'left-nav-list';

  // Index link at top
  const indexLinkWrap = document.createElement('div');
  indexLinkWrap.className = 'left-nav__index-link';
  const indexLink = document.createElement('a');
  indexLink.href = rootPath + 'index.html';
  indexLink.textContent = 'All Checkpoints';
  if (!isCheckpoint) {
    indexLink.setAttribute('aria-current', 'page');
    indexLink.classList.add('left-nav__index-link--active');
  }
  indexLinkWrap.appendChild(indexLink);
  navInner.appendChild(indexLinkWrap);

  PRINCIPLES.forEach(function (principle) {
    const group = document.createElement('div');
    group.className = 'left-nav__group';

    const groupHeading = document.createElement('p');
    groupHeading.className = 'left-nav__group-heading';
    groupHeading.textContent = principle.label;
    group.appendChild(groupHeading);

    const list = document.createElement('ul');
    list.className = 'left-nav__list';

    principle.checkpoints.forEach(function (cp) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = rootPath + checkpointsPath + cp.file;
      a.className = 'left-nav__link';

      const idSpan = document.createElement('span');
      idSpan.className = 'left-nav__link-id';
      idSpan.textContent = cp.id;

      const titleSpan = document.createElement('span');
      titleSpan.className = 'left-nav__link-title';
      titleSpan.textContent = cp.title;

      a.appendChild(idSpan);
      a.appendChild(titleSpan);

      if (isCheckpoint && currentFile === cp.file) {
        a.setAttribute('aria-current', 'page');
        li.classList.add('left-nav__item--active');
      }

      li.appendChild(a);
      list.appendChild(li);
    });

    group.appendChild(list);
    navInner.appendChild(group);
  });

  nav.appendChild(navInner);

  // --- Inject into DOM ---
  const main = document.getElementById('main-content');
  if (!main) return;

  // Wrap main + nav in a layout div
  const layout = document.createElement('div');
  layout.className = 'site-layout';
  main.parentNode.insertBefore(layout, main);
  layout.appendChild(nav);
  layout.appendChild(main);

  // --- Mobile toggle behaviour ---
  toggle.addEventListener('click', function () {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    navInner.classList.toggle('left-nav__inner--open', !expanded);
  });

  // Auto-scroll active link into view in the sidebar
  const activeLink = nav.querySelector('[aria-current="page"].left-nav__link');
  if (activeLink) {
    // Use setTimeout to let layout settle before scrolling
    setTimeout(function () {
      activeLink.scrollIntoView({ block: 'nearest' });
    }, 0);
  }

})();
