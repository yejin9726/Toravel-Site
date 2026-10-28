/* Toravel GA4 event tracking. Never include form values or personal data. */
(function () {
  'use strict';

  var TRIP = {
    trip_id: 'retro_hiking_11_14',
    trip_name: '레트로 등산복 입고 등산 여행',
    trip_category: 'concept_trip',
    travel_date: '11-14',
    value: 130000,
    currency: 'KRW'
  };

  window.toravelTrack = function (eventName, params) {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', eventName, Object.assign({
      page_type: document.body.classList.contains('ga-result-page') ? 'result' :
        document.body.classList.contains('ga-survey-page') ? 'survey' : 'landing'
    }, params || {}));
  };

  function locationOf(el) {
    if (el.closest('header')) return 'header';
    if (el.closest('#review')) return 'review';
    if (el.closest('.tabs')) return 'detail_tab';
    if (el.closest('#info')) return 'trip_description';
    if (el.closest('#more')) return 'recommendation';
    if (el.closest('#apply')) return 'sidebar';
    if (el.closest('footer')) return 'footer';
    if (el.closest('#privacy-modal')) return 'privacy_modal';
    if (el.closest('.result')) return 'result';
    return 'content';
  }

  function textOf(el) {
    return (el.textContent || el.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim();
  }

  document.addEventListener('click', function (event) {
    var el = event.target.closest('a, button');
    if (!el) return;

    var text = textOf(el);
    var base = {
      element_text: text,
      element_id: el.id || undefined,
      element_location: locationOf(el)
    };

    if (el.matches('[data-privacy-open]')) {
      window.toravelTrack('privacy_notice_open', Object.assign(base, { open_mode: 'info' }));
      return;
    }

    if (el.matches('.card')) {
      var cards = Array.prototype.slice.call(document.querySelectorAll('.card'));
      var index = cards.indexOf(el);
      var trips = [
        { trip_id: 'nature_yoga_1n2d', trip_name: '자연 속 요가 1박 2일', travel_date: '11-21', max_participants: 20 },
        { trip_id: 'local_cooking_class', trip_name: '로컬 쿠킹 클래스 여행', travel_date: '11-21', max_participants: 15 },
        { trip_id: 'stargazing_night', trip_name: '별 보러 가는 밤', travel_date: '12-12', max_participants: 20 }
      ];
      window.toravelTrack('select_trip', Object.assign(base, trips[index], {
        item_list_name: 'recommended_trips',
        index: index + 1
      }));
      return;
    }

    if (el.id === 'cta-main') {
      window.toravelTrack('cta_click', Object.assign(base, TRIP, {
        cta_type: 'application_start',
        link_target: 'privacy_modal'
      }));
      return;
    }

    if (el.id === 'cta-top' || el.getAttribute('href') === '#apply') {
      var ctaType = el.id === 'cta-top' ? 'apply_anchor' :
        text.indexOf('로그인') > -1 ? 'login' :
        text.indexOf('자주 묻는 질문') > -1 ? 'faq' :
        locationOf(el) === 'review' ? 'review_more' :
        locationOf(el) === 'recommendation' ? 'recommendation_more' : 'detail_more';
      window.toravelTrack('cta_click', Object.assign(base, {
        cta_type: ctaType,
        link_target: 'apply'
      }));
      return;
    }

    if (document.body.classList.contains('ga-result-page') && el.getAttribute('href') === './') {
      window.toravelTrack('return_home', Object.assign(base, { link_target: 'home' }));
      return;
    }

    if (el.tagName === 'A') {
      var href = el.getAttribute('href') || '';
      window.toravelTrack('navigation_click', Object.assign(base, {
        link_target: href === './' ? 'home' : href.replace(/^#/, '') || 'placeholder'
      }));
    }
  });
})();
