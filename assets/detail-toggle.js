(function () {
  'use strict';

  var content = document.getElementById('trip-detail-content');
  var toggle = document.getElementById('detail-toggle');
  if (!content || !toggle) return;

  var collapsedHeight = window.matchMedia('(max-width: 1000px)').matches ? 620 : 760;

  function setCollapsedHeight() {
    if (toggle.getAttribute('aria-expanded') === 'false') {
      content.style.maxHeight = collapsedHeight + 'px';
    }
  }

  toggle.addEventListener('click', function () {
    var willExpand = toggle.getAttribute('aria-expanded') === 'false';
    toggle.setAttribute('aria-expanded', String(willExpand));
    content.classList.toggle('expanded', willExpand);

    if (willExpand) {
      content.style.maxHeight = content.scrollHeight + 'px';
      toggle.textContent = '접기 ⌃';
    } else {
      content.style.maxHeight = collapsedHeight + 'px';
      toggle.textContent = '더보기 ⌄';
      document.getElementById('info').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (typeof window.toravelTrack === 'function') {
      window.toravelTrack('detail_toggle', {
        element_id: 'detail-toggle',
        element_location: 'trip_description',
        toggle_state: willExpand ? 'expanded' : 'collapsed',
        trip_id: 'retro_hiking_11_14',
        trip_name: '레트로 등산복 입고 등산 여행'
      });
    }
  });

  window.addEventListener('resize', function () {
    collapsedHeight = window.matchMedia('(max-width: 1000px)').matches ? 620 : 760;
    setCollapsedHeight();
  });

  setCollapsedHeight();
})();
