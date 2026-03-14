(function() {
  'use strict';

  var searchIndex = [];
  var filterState = {
    pillars: [],
    levels: []
  };

  // Fetch and initialize search index
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '../assets/data/search-index.json', true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      try {
        var data = JSON.parse(xhr.responseText);
        searchIndex = data.checkpoints || [];
        initSearch();
      } catch (e) {
        console.error('Failed to parse search index:', e);
      }
    } else {
      console.error('Failed to load search index');
    }
  };
  xhr.onerror = function() {
    console.error('Error loading search index');
  };
  xhr.send();

  // Initialize search on page load
  function initSearch() {
    // Check if search widget already exists
    var wrapper = document.querySelector('.search-widget-wrapper');

    // If not on this page, inject it
    if (!wrapper) {
      injectSearchWidget();
    }

    // Find DOM elements
    var searchInput = document.getElementById('search-input');
    var resultsContainer = document.querySelector('.search-results__list');
    var countContainer = document.querySelector('.search-results__count');

    // Exit gracefully if elements not found
    if (!searchInput || !resultsContainer || !countContainer) {
      return;
    }

    // Initialize filter state from checkbox values
    var pillarCheckboxes = document.querySelectorAll('.filter-pillar');
    var levelCheckboxes = document.querySelectorAll('.filter-level');

    pillarCheckboxes.forEach(function(cb) {
      if (cb.checked) {
        filterState.pillars.push(cb.value);
      }
    });

    levelCheckboxes.forEach(function(cb) {
      if (cb.checked) {
        filterState.levels.push(cb.value);
      }
    });

    // Attach event listeners
    searchInput.addEventListener('input', function() {
      updateResults();
    });

    pillarCheckboxes.forEach(function(cb) {
      cb.addEventListener('change', function() {
        filterState.pillars = [];
        document.querySelectorAll('.filter-pillar:checked').forEach(function(checked) {
          filterState.pillars.push(checked.value);
        });
        updateResults();
      });
    });

    levelCheckboxes.forEach(function(cb) {
      cb.addEventListener('change', function() {
        filterState.levels = [];
        document.querySelectorAll('.filter-level:checked').forEach(function(checked) {
          filterState.levels.push(checked.value);
        });
        updateResults();
      });
    });

    // Keyboard navigation
    resultsContainer.addEventListener('keydown', function(event) {
      var links = Array.from(resultsContainer.querySelectorAll('a'));
      var currentIndex = links.indexOf(document.activeElement);

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (currentIndex < links.length - 1) {
          links[currentIndex + 1].focus();
        }
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (currentIndex > 0) {
          links[currentIndex - 1].focus();
        }
      }
    });

    // Initial render
    updateResults();
  }

  // Inject search widget HTML onto checkpoint pages
  function injectSearchWidget() {
    var main = document.getElementById('main-content');
    if (!main) {
      return;
    }

    var html = '<div class="search-widget-wrapper">' +
      '<form class="search-widget" role="search" aria-label="Search checkpoints">' +
      '<div class="search-widget__input-group">' +
      '<label for="search-input" class="visually-hidden">Search</label>' +
      '<input type="search" id="search-input" class="search-input" ' +
      'placeholder="Search checkpoints..." autocomplete="off" ' +
      'aria-label="Search checkpoint titles and codes" ' +
      'aria-describedby="search-instructions">' +
      '<div id="search-instructions" class="visually-hidden">' +
      'Type to filter checkpoints by title or code. ' +
      'Use arrow keys to navigate results. ' +
      'Press Enter to open a checkpoint.' +
      '</div>' +
      '</div>' +
      '<fieldset class="search-filters">' +
      '<legend class="search-filters__legend">Filter by pillar and level</legend>' +
      '<div class="filter-group filter-pillar-group">' +
      '<label class="filter-label">' +
      '<input type="checkbox" class="filter-pillar" value="Perceivable" checked>' +
      'Perceivable' +
      '</label>' +
      '<label class="filter-label">' +
      '<input type="checkbox" class="filter-pillar" value="Operable" checked>' +
      'Operable' +
      '</label>' +
      '<label class="filter-label">' +
      '<input type="checkbox" class="filter-pillar" value="Understandable" checked>' +
      'Understandable' +
      '</label>' +
      '<label class="filter-label">' +
      '<input type="checkbox" class="filter-pillar" value="Robust" checked>' +
      'Robust' +
      '</label>' +
      '</div>' +
      '<div class="filter-group filter-level-group">' +
      '<label class="filter-label">' +
      '<input type="checkbox" class="filter-level" value="A" checked>' +
      'Level A' +
      '</label>' +
      '<label class="filter-label">' +
      '<input type="checkbox" class="filter-level" value="AA" checked>' +
      'Level AA' +
      '</label>' +
      '</div>' +
      '</fieldset>' +
      '</form>' +
      '<div class="search-results" role="region" aria-label="Search results" ' +
      'aria-live="polite" aria-atomic="false">' +
      '<div class="search-results__count" aria-live="assertive"></div>' +
      '<ul class="search-results__list"></ul>' +
      '</div>' +
      '</div>';

    main.insertAdjacentHTML('afterbegin', html);
  }

  // Filter results based on search term and filter state
  function filterResults(searchTerm) {
    return searchIndex.filter(function(checkpoint) {
      // Match search term
      var matchesSearch = searchTerm === '' ||
        checkpoint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        checkpoint.code.toLowerCase().includes(searchTerm.toLowerCase());

      // Match pillar filter
      var matchesPillar = filterState.pillars.length === 0 ||
        filterState.pillars.indexOf(checkpoint.pillar) !== -1;

      // Match level filter
      var matchesLevel = filterState.levels.length === 0 ||
        filterState.levels.indexOf(checkpoint.level) !== -1;

      return matchesSearch && matchesPillar && matchesLevel;
    });
  }

  // Render results to DOM
  function renderResults(results) {
    var resultsContainer = document.querySelector('.search-results__list');
    var countContainer = document.querySelector('.search-results__count');

    if (!resultsContainer || !countContainer) {
      return;
    }

    resultsContainer.innerHTML = '';

    if (results.length === 0) {
      var emptyItem = document.createElement('li');
      emptyItem.className = 'search-results__empty';
      emptyItem.textContent = 'No checkpoints found.';
      resultsContainer.appendChild(emptyItem);
      countContainer.textContent = 'No results';
      announceToScreenReader('No results found');
    } else {
      results.forEach(function(checkpoint) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = checkpoint.url;
        a.className = 'search-result-link';
        a.textContent = checkpoint.code + ' ' + checkpoint.title;
        li.appendChild(a);
        resultsContainer.appendChild(li);
      });

      var resultText = results.length === 1 ? 'result' : 'results';
      countContainer.textContent = 'Showing ' + results.length + ' ' + resultText;
      announceToScreenReader('Showing ' + results.length + ' ' + resultText);
    }
  }

  // Update results based on current search term and filters
  function updateResults() {
    var searchInput = document.getElementById('search-input');
    if (!searchInput) {
      return;
    }

    var searchTerm = searchInput.value.trim();
    var results = filterResults(searchTerm);
    renderResults(results);
  }

  // Announce to screen readers via aria-live
  function announceToScreenReader(message) {
    var countContainer = document.querySelector('.search-results__count');
    if (countContainer) {
      countContainer.textContent = message;
    }
  }
})();
