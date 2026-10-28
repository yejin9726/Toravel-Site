/*
  신청 폼 처리. 입력값은 어디로도 보내지 않습니다.
  - 폼 입력칸에는 name 속성이 없어서, 스크립트가 꺼져 있어도 값이 주소창·서버로 넘어가지 않습니다.
  - 제출 → 개인정보 안내 팝업 → 동의 → 입력값 즉시 삭제 → result.html 이동.
  - 나중에 폼을 Make·구글시트 등에 연결하면 팝업 문구(index.html의 #privacy-modal)를 반드시 고쳐야 합니다.
*/
(function () {
  var form = document.getElementById('lead-form');
  var modal = document.getElementById('privacy-modal');
  if (!modal) return;
  var agree = document.getElementById('privacy-agree');
  var ok = document.getElementById('privacy-ok');
  var cancel = document.getElementById('privacy-cancel');
  var mode = 'info';

  function wipe() {
    if (!form) return;
    form.querySelectorAll('input, select, textarea').forEach(function (el) {
      if (el.type === 'checkbox' || el.type === 'radio') el.checked = false;
      else el.value = '';
    });
    form.reset();
  }

  function open(m) {
    mode = m;
    agree.checked = false;
    ok.disabled = true;
    ok.textContent = m === 'submit' ? '동의하고 완료하기' : '확인했습니다';
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    agree.focus();
    if (m === 'submit' && typeof window.toravelTrack === 'function') {
      window.toravelTrack('privacy_notice_open', {
        element_location: 'privacy_modal',
        open_mode: 'submit',
        trip_id: 'retro_hiking_11_14'
      });
    }
  }

  function close(method) {
    if (typeof window.toravelTrack === 'function') {
      window.toravelTrack('application_modal_close', {
        element_location: 'privacy_modal',
        modal_mode: mode,
        close_method: method || 'unknown'
      });
    }
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  agree.addEventListener('change', function () {
    ok.disabled = !agree.checked;
    if (typeof window.toravelTrack === 'function') {
      window.toravelTrack('privacy_consent_change', {
        element_location: 'privacy_modal',
        modal_mode: mode,
        consent_state: agree.checked ? 'granted' : 'denied'
      });
    }
  });
  cancel.addEventListener('click', function () { close('button'); });
  modal.addEventListener('click', function (e) { if (e.target === modal) close('backdrop'); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('open')) close('escape');
  });

  ok.addEventListener('click', function () {
    if (mode !== 'submit') {
      if (typeof window.toravelTrack === 'function') {
        window.toravelTrack('navigation_click', {
          element_location: 'privacy_modal',
          element_text: '확인했습니다',
          action: 'acknowledge',
          modal_mode: 'info'
        });
      }
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      return;
    }
    wipe();
    if (typeof window.toravelTrack === 'function') {
      window.toravelTrack('generate_lead', {
        trip_id: 'retro_hiking_11_14',
        trip_name: '레트로 등산복 입고 등산 여행',
        trip_category: 'concept_trip',
        lead_type: 'trip_application',
        value: 130000,
        currency: 'KRW'
      });
    }
    if (typeof window.fbq === 'function') window.fbq('track', 'Lead');
    location.replace('result.html');
  });

  document.querySelectorAll('[data-privacy-open]').forEach(function (b) {
    b.addEventListener('click', function (e) { e.preventDefault(); open('info'); });
  });

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      open('submit');
    });
  }

  // 검토 메모 패널 닫기 (검토용 빌드에만 있음)
  var rp = document.querySelector('.review-panel button');
  if (rp) rp.addEventListener('click', function () { rp.parentNode.remove(); });
})();
