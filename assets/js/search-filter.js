(function() {
  'use strict';

  var searchIndex = [];
  var activeLevels = { A: true, AA: true };

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
  };
  xhr.send();

  function initSearch() {
    var wrapper = document.querySelector('.search-widget-wrapper');
    if (!wrapper) {
      injectSearchWidget();
    }

    var searchInput = document.getElementById('search-input');
    var resultsContainer = document.querySelector('.search-results__list');
    var countContainer = document.querySelector('.search-results__count');

    if (!searchInput || !resultsContainer || !countContainer) {
      return;
    }

    // Level toggle buttons
    var levelButtons = document.querySelectorAll('.search-level-btn');
    levelButtons.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var level = btn.getAttribute('data-level');
        activeLevels[level] = !activeLevels[level];
        btn.setAttribute('aria-pressed', activeLevels[level]);
        btn.classList.toggle('active', activeLevels[level]);
        updateResults();
      });
    });

    searchInput.addEventListener('input', function() {
      updateResults();
    });

    // Keyboard navigation in results
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

    // Don't show results until user types or filters
  }

  function injectSearchWidget() {
    var main = document.getElementById('main-content');
    if (!main) return;

    var html = '<div class="search-widget-wrapper">' +
      '<form class="search-widget" role="search" aria-label="Search checkpoints" onsubmit="return false">' +
      '<div class="search-widget__input-group">' +
      '<label for="search-input" class="visually-hidden">Search</label>' +
      '<input type="search" id="search-input" class="search-input" ' +
      'placeholder="Search checkpoints..." autocomplete="off" ' +
      'aria-label="Search checkpoint titles and codes" ' +
      'aria-describedby="search-instructions">' +
      '<div id="search-instructions" class="visually-hidden">' +
      'Type to filter checkpoints by title or code. ' +
      'Use arrow keys to navigate results. ' +
      'Press Enter to open a checkpoint.</div>' +
      '</div>' +
      '<div class="search-level-filters" role="group" aria-label="Filter by conformance level">' +
      '<button type="button" class="search-level-btn active" data-level="A" aria-pressed="true">Level A</button>' +
      '<button type="button" class="search-level-btn active" data-level="AA" aria-pressed="true">Level AA</button>' +
      '</div>' +
      '</form>' +
      '<div class="search-results" role="region" aria-label="Search results" aria-live="polite">' +
      '<div class="search-results__count" aria-live="assertive"></div>' +
      '<ul class="search-results__list"></ul>' +
      '</div>' +
      '</div>';

    main.insertAdjacentHTML('afterbegin', html);
  }

  function filterResults(searchTerm) {
    return searchIndex.filter(function(checkpoint) {
      var matchesSearch = searchTerm === '' ||
        checkpoint.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        checkpoint.code.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1;

      var matchesLevel = activeLevels[checkpoint.level];

      return matchesSearch && matchesLevel;
    });
  }

  function renderResults(results, hasQuery) {
    var resultsContainer = document.querySelector('.search-results__list');
    var countContainer = document.querySelector('.search-results__count');
    if (!resultsContainer || !countContainer) return;

    resultsContainer.innerHTML = '';

    if (!hasQuery) {
      countContainer.textContent = '';
      return;
    }

    if (results.length === 0) {
      var emptyItem = document.createElement('li');
      emptyItem.className = 'search-results__empty';
      emptyItem.textContent = 'No checkpoints found.';
      resultsContainer.appendChild(emptyItem);
      countContainer.textContent = 'No results';
    } else {
      results.forEach(function(checkpoint) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = (isCheckpointPage ? '../' : '') + checkpoint.url;
        a.className = 'search-result-link';

        var code = document.createElement('span');
        code.className = 'search-result-code';
        code.textContent = checkpoint.code;

        var title = document.createElement('span');
        title.className = 'search-result-title';
        title.textContent = checkpoint.title.replace(checkpoint.code + ' ', '');

        var level = document.createElement('span');
        level.className = 'search-result-level search-result-level--' + checkpoint.level.toLowerCase();
        level.textContent = checkpoint.level;

        a.appendChild(code);
        a.appendChild(title);
        a.appendChild(level);
        li.appendChild(a);
        resultsContainer.appendChild(li);
      });

      var resultText = results.length === 1 ? 'result' : 'results';
      countContainer.textContent = 'Showing ' + results.length + ' ' + resultText;
    }
  }

  function updateResults() {
    var searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    var searchTerm = searchInput.value.trim();
    var bothActive = activeLevels.A && activeLevels.AA;
    var hasQuery = searchTerm !== '' || !bothActive;

    var results = filterResults(searchTerm);
    renderResults(results, hasQuery);
  }
})();
