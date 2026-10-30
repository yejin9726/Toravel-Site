(function () {
  'use strict';

  var body = document.body;
  var trip = {
    id: body.dataset.tripId,
    name: body.dataset.tripName
  };

  function cleanResolvedPlaceholders() {
    document.querySelectorAll('[data-needs-edit]').forEach(function (element) {
      if (!element.textContent.trim().startsWith('수정 필요:')) {
        element.classList.remove('needs-edit');
        element.removeAttribute('data-needs-edit');
      }
    });
  }

  cleanResolvedPlaceholders();

  var detail = document.getElementById('trip-detail-content');
  var toggle = document.getElementById('detail-toggle');
  if (detail && toggle) {
    var collapsedHeight = window.matchMedia('(max-width: 1000px)').matches ? 480 : 560;

    function setCollapsedHeight() {
      if (toggle.getAttribute('aria-expanded') === 'false') {
        detail.style.maxHeight = collapsedHeight + 'px';
      }
    }

    toggle.addEventListener('click', function () {
      var expanding = toggle.getAttribute('aria-expanded') === 'false';
      toggle.setAttribute('aria-expanded', String(expanding));
      detail.classList.toggle('expanded', expanding);
      detail.style.maxHeight = expanding ? 'none' : collapsedHeight + 'px';
      toggle.textContent = expanding ? '접기 ⌃' : '더보기 ⌄';

      if (!expanding) {
        document.getElementById('info').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      if (typeof window.toravelTrack === 'function') {
        window.toravelTrack('detail_toggle', {
          element_id: 'detail-toggle',
          element_location: 'trip_description',
          toggle_state: expanding ? 'expanded' : 'collapsed',
          trip_id: trip.id,
          trip_name: trip.name
        });
      }
    });

    window.addEventListener('resize', function () {
      collapsedHeight = window.matchMedia('(max-width: 1000px)').matches ? 480 : 560;
      if (toggle.getAttribute('aria-expanded') === 'true') {
        detail.style.maxHeight = 'none';
      } else {
        setCollapsedHeight();
      }
    });

    setCollapsedHeight();
  }

  var favorite = document.getElementById('favorite-toggle');
  if (favorite && trip.id) {
    var storageKey = 'toravel_favorite_' + trip.id;

    function readFavorite() {
      try {
        return window.localStorage.getItem(storageKey) === 'true';
      } catch (error) {
        return false;
      }
    }

    function saveFavorite(value) {
      try {
        window.localStorage.setItem(storageKey, String(value));
      } catch (error) {
        // The control remains usable for this page view when storage is unavailable.
      }
    }

    function renderFavorite(value) {
      favorite.setAttribute('aria-pressed', String(value));
      favorite.setAttribute('aria-label', trip.name + (value ? ' 찜 취소' : ' 찜하기'));
      favorite.querySelector('i').textContent = value ? '♥' : '♡';
      favorite.querySelector('span').textContent = value ? '찜했어요' : '찜하기';
    }

    renderFavorite(readFavorite());

    favorite.addEventListener('click', function () {
      var next = favorite.getAttribute('aria-pressed') !== 'true';
      saveFavorite(next);
      renderFavorite(next);

      if (typeof window.toravelTrack === 'function') {
        window.toravelTrack('favorite_toggle', {
          element_id: 'favorite-toggle',
          element_location: 'sidebar',
          favorite_state: next ? 'added' : 'removed',
          trip_id: trip.id,
          trip_name: trip.name
        });
      }
    });
  }

  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }

  if (!window.location.hash) {
    window.requestAnimationFrame(function () { window.scrollTo(0, 0); });
  }
})();
