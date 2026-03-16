(function() {
  'use strict';

  var searchIndex = [];
  var activeLevel = 'all'; // 'all', 'A', or 'AA'

  // Determine base path based on page location
  var isCheckpointPage = window.location.pathname.indexOf('/checkpoints/') !== -1;
  var basePath = isCheckpointPage ? '../' : '';

  // Fetch and initialize search index
  var xhr = new XMLHttpRequest();
  xhr.open('GET', basePath + 'assets/data/search-index.json', true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      try {
        var data = JSON.parse(xhr.responseText);
        searchIndex = data.checkpoints || [];
        initSearch();
      } catch (e) {
        console.error('Failed to parse search index:', e);
      }
    }
  };
  xhr.onerror = function() {
    console.error('Error loading search index');
    showSearchError();
  };

  function showSearchError() {
    var wrapper = document.querySelector('.search-widget-wrapper');
    if (!wrapper) return;
    var msg = wrapper.querySelector('.search-error');
    if (msg) return;
    msg = document.createElement('p');
    msg.className = 'search-error';
    msg.setAttribute('role', 'alert');
    msg.textContent = 'Search is currently unavailable.';
    wrapper.appendChild(msg);
  }
  xhr.send();

  function initSearch() {
    var wrapper = document.querySelector('.search-widget-wrapper');
    if (!wrapper) {
      injectSearchWidget();
    }

    var searchInput = document.getElementById('search-input');
    var resultsContainer = document.querySelector('.search-results');
    var resultsList = document.querySelector('.search-results__list');
    var countContainer = document.querySelector('.search-results__count');

    if (!searchInput || !resultsList || !countContainer) {
      return;
    }

    // Level filter buttons — radio-style: click to select one, click again for all
    var levelButtons = document.querySelectorAll('.search-level-btn');
    for (var i = 0; i < levelButtons.length; i++) {
      levelButtons[i].addEventListener('click', handleLevelClick);
    }

    function handleLevelClick() {
      var level = this.getAttribute('data-level');

      if (activeLevel === level) {
        // Clicking the active filter again → reset to all
        activeLevel = 'all';
      } else {
        activeLevel = level;
      }

      updateLevelButtons();
      updateResults();
    }

    function updateLevelButtons() {
      for (var i = 0; i < levelButtons.length; i++) {
        var btn = levelButtons[i];
        var level = btn.getAttribute('data-level');
        var isActive = activeLevel === 'all' || activeLevel === level;
        var isSelected = activeLevel === level;
        btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
        btn.classList.toggle('active', isActive);
        btn.classList.toggle('selected', isSelected);
      }
    }

    // Search input
    searchInput.addEventListener('input', function() {
      updateResults();
    });

    function handleEscape() {
      searchInput.value = '';
      activeLevel = 'all';
      updateLevelButtons();
      updateResults();
      searchInput.focus();
    }

    // Escape key closes results and clears input
    searchInput.addEventListener('keydown', function(event) {
      if (event.key === 'Escape') {
        handleEscape();
      }
      // Arrow down moves focus to first result
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        var firstLink = resultsList.querySelector('a');
        if (firstLink) {
          firstLink.focus();
        }
      }
    });

    // Keyboard navigation in results
    resultsList.addEventListener('keydown', function(event) {
      var links = resultsList.querySelectorAll('a');
      var linksArray = [];
      for (var i = 0; i < links.length; i++) {
        linksArray.push(links[i]);
      }
      var currentIndex = linksArray.indexOf(document.activeElement);

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (currentIndex < linksArray.length - 1) {
          linksArray[currentIndex + 1].focus();
        }
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (currentIndex > 0) {
          linksArray[currentIndex - 1].focus();
        } else {
          searchInput.focus();
        }
      } else if (event.key === 'Escape') {
        handleEscape();
      }
    });
  }

  function injectSearchWidget() {
    // On checkpoint pages, insert before the page header inside main
    // On index page, insert as first child of main
    var main = document.getElementById('main-content');
    if (!main) return;

    var html = '<div class="search-widget-wrapper">' +
      '<form class="search-widget" role="search" aria-label="Search checkpoints" onsubmit="return false">' +
      '<div class="search-widget__input-group">' +
      '<label for="search-input" class="visually-hidden">Search checkpoints</label>' +
      '<input type="search" id="search-input" class="search-input" ' +
      'placeholder="Search checkpoints\u2026" autocomplete="search" ' +
      'aria-describedby="search-instructions" aria-controls="search-results">' +
      '<span id="search-instructions" class="visually-hidden">' +
      'Type to filter checkpoints by title or code. ' +
      'Use arrow keys to navigate results. ' +
      'Press Escape to clear. ' +
      'Click a level button to filter; click again to show all. ' +
      'Press Enter to open a checkpoint.</span>' +
      '</div>' +
      '<div class="search-level-filters" role="group" aria-label="Filter by conformance level">' +
      '<button type="button" class="search-level-btn active" data-level="A" aria-pressed="false">A</button>' +
      '<button type="button" class="search-level-btn active" data-level="AA" aria-pressed="false">AA</button>' +
      '</div>' +
      '</form>' +
      '<div id="search-results" class="search-results" role="region" aria-label="Search results" aria-live="polite">' +
      '<p class="search-results__count" aria-live="polite"></p>' +
      '<ul class="search-results__list" role="list"></ul>' +
      '</div>' +
      '</div>';

    main.insertAdjacentHTML('afterbegin', html);
  }

  function filterResults(searchTerm) {
    return searchIndex.filter(function(checkpoint) {
      var term = searchTerm.toLowerCase();
      var matchesSearch = term === '' ||
        checkpoint.title.toLowerCase().indexOf(term) !== -1 ||
        checkpoint.code.toLowerCase().indexOf(term) !== -1;

      var matchesLevel = activeLevel === 'all' || checkpoint.level === activeLevel;

      return matchesSearch && matchesLevel;
    });
  }

  function renderResults(results, hasQuery) {
    var resultsList = document.querySelector('.search-results__list');
    var countContainer = document.querySelector('.search-results__count');
    if (!resultsList || !countContainer) return;

    resultsList.innerHTML = '';

    if (!hasQuery) {
      countContainer.textContent = '';
      return;
    }

    if (results.length === 0) {
      countContainer.textContent = 'No checkpoints found';
      var emptyItem = document.createElement('li');
      emptyItem.className = 'search-results__empty';
      emptyItem.setAttribute('role', 'status');
      emptyItem.textContent = 'No matching checkpoints. Try a different search term or filter.';
      resultsList.appendChild(emptyItem);
    } else {
      var word = results.length === 1 ? 'checkpoint' : 'checkpoints';
      countContainer.textContent = results.length + ' ' + word + ' found';

      for (var i = 0; i < results.length; i++) {
        var checkpoint = results[i];
        var li = document.createElement('li');

        var a = document.createElement('a');
        a.href = basePath + checkpoint.url;
        a.className = 'search-result-link';

        var code = document.createElement('span');
        code.className = 'search-result-code';
        code.textContent = checkpoint.code;

        var title = document.createElement('span');
        title.className = 'search-result-title';
        title.textContent = checkpoint.title.replace(checkpoint.code + ' ', '');

        var level = document.createElement('span');
        level.className = 'search-result-level search-result-level--' + checkpoint.level.toLowerCase();
        level.textContent = 'Level ' + checkpoint.level;

        a.appendChild(code);
        a.appendChild(title);
        a.appendChild(level);
        li.appendChild(a);
        resultsList.appendChild(li);
      }
    }
  }

  function updateResults() {
    var searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    var searchTerm = searchInput.value.trim();
    var hasQuery = searchTerm !== '' || activeLevel !== 'all';

    var results = filterResults(searchTerm);
    renderResults(results, hasQuery);
  }
})();
