/* Toravel GA4 event tracking. Never include form values or personal data. */
(function () {
  'use strict';

  function numberOrUndefined(value) {
    if (value === undefined || value === null || value === '') return undefined;
    var parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  function compact(object) {
    var result = {};
    Object.keys(object).forEach(function (key) {
      if (object[key] !== undefined && object[key] !== null && object[key] !== '') {
        result[key] = object[key];
      }
    });
    return result;
  }

  function currentTrip() {
    var data = document.body.dataset || {};
    return compact({
      trip_id: data.tripId || 'retro_hiking_11_14',
      trip_name: data.tripName || '레트로 등산복 입고 등산 여행',
      trip_category: data.tripCategory || 'concept_trip',
      travel_date: data.travelDate || '11-14',
      max_participants: numberOrUndefined(data.maxParticipants),
      value: numberOrUndefined(data.tripValue || (data.tripId ? undefined : 130000)),
      currency: data.tripCurrency || (data.tripId ? undefined : 'KRW')
    });
  }

  function trackMeta(eventName, params) {
    if (!window.fbq || eventName === 'page_view' || /scroll/i.test(eventName)) return;

    var standardEvents = {
      generate_lead: 'Lead',
      sign_up: 'CompleteRegistration',
      contact_click: 'Contact',
      view_item: 'ViewContent',
      add_to_cart: 'AddToCart',
      begin_checkout: 'InitiateCheckout',
      purchase: 'Purchase',
      search: 'Search'
    };
    var metaEventName = standardEvents[eventName];

    if (metaEventName === 'Purchase') {
      fbq('track', 'Purchase', {
        value: params && params.value,
        currency: 'KRW'
      });
    } else if (metaEventName) {
      fbq('track', metaEventName);
    } else {
      fbq('trackCustom', eventName);
    }
  }

  window.toravelTrack = function (eventName, params) {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', eventName, compact(Object.assign({
      page_type: document.body.classList.contains('ga-result-page') ? 'result' :
        document.body.classList.contains('ga-survey-page') ? 'survey' :
        document.body.classList.contains('ga-trip-page') ? 'trip_detail' : 'landing'
    }, params || {})));
    trackMeta(eventName, params);
  };

  function locationOf(el) {
    if (el.closest('header')) return 'header';
    if (el.closest('#review')) return 'review';
    if (el.closest('.tabs')) return 'detail_tab';
    if (el.closest('#info')) return 'trip_description';
    if (el.closest('#more')) return 'recommendation';
    if (el.closest('#apply')) return 'sidebar';
    if (el.closest('footer')) return 'footer';
    if (el.closest('#privacy-modal') || el.closest('#survey-privacy-modal')) return 'privacy_modal';
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
      var cards = Array.prototype.slice.call(el.closest('.cards') ? el.closest('.cards').querySelectorAll('.card') : document.querySelectorAll('.card'));
      var index = Number(el.dataset.index) || cards.indexOf(el) + 1;
      window.toravelTrack('select_trip', compact(Object.assign(base, {
        trip_id: el.dataset.tripId,
        trip_name: el.dataset.tripName,
        travel_date: el.dataset.travelDate,
        max_participants: numberOrUndefined(el.dataset.maxParticipants),
        item_list_name: 'recommended_trips',
        index: index
      })));
      return;
    }

    if (el.id === 'cta-main') {
      window.toravelTrack('cta_click', Object.assign(base, currentTrip(), {
        cta_type: 'application_start',
        link_target: 'survey'
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
