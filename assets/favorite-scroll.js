(function () {
  'use strict';

  var FAVORITE_KEY = 'toravel_favorite_retro_hiking_11_14';
  var button = document.getElementById('favorite-toggle');
  var baseCount = 122;

  function readFavorite() {
    try {
      return window.localStorage.getItem(FAVORITE_KEY) === 'true';
    } catch (error) {
      return false;
    }
  }

  function saveFavorite(isFavorite) {
    try {
      window.localStorage.setItem(FAVORITE_KEY, String(isFavorite));
    } catch (error) {
      // The button still works for this page view when storage is unavailable.
    }
  }

  function renderFavorite(isFavorite) {
    if (!button) return;
    button.setAttribute('aria-pressed', String(isFavorite));
    button.setAttribute('aria-label',
      '레트로 등산복 입고 등산 여행 ' + (isFavorite ? '찜 취소' : '찜하기'));
    button.querySelector('i').textContent = isFavorite ? '♥' : '♡';
    button.querySelector('.favorite-count').textContent = String(baseCount + (isFavorite ? 1 : 0));
  }

  if (button) {
    renderFavorite(readFavorite());

    button.addEventListener('click', function () {
      var isFavorite = button.getAttribute('aria-pressed') !== 'true';
      saveFavorite(isFavorite);
      renderFavorite(isFavorite);

      if (typeof window.toravelTrack === 'function') {
        window.toravelTrack('favorite_toggle', {
          element_id: 'favorite-toggle',
          element_location: 'sidebar',
          favorite_state: isFavorite ? 'added' : 'removed',
          trip_id: 'retro_hiking_11_14',
          trip_name: '레트로 등산복 입고 등산 여행'
        });
      }
    });
  }

  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }

  function showPageTop() {
    if (!window.location.hash) {
      window.requestAnimationFrame(function () {
        window.scrollTo(0, 0);
      });
    }
  }

  showPageTop();
  window.addEventListener('pageshow', showPageTop);
})();
