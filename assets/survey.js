(function () {
  'use strict';

  var SURVEY_ID = 'travel_preference_v1';
  var TRIPS = {
    retro_hiking_11_14: {
      trip_id: 'retro_hiking_11_14',
      trip_name: '레트로 등산복 입고 등산 여행',
      trip_category: 'concept_trip',
      travel_date: '11-14',
      max_participants: 20,
      lead_type: 'trip_application',
      value: 130000,
      currency: 'KRW',
      detail_url: './#apply'
    },
    nature_yoga_11_21: {
      trip_id: 'nature_yoga_11_21',
      trip_name: '자연 속 요가 1박 2일',
      trip_category: 'concept_trip',
      travel_date: '11-21',
      max_participants: 20,
      lead_type: 'trip_application',
      detail_url: 'trip-yoga.html#apply'
    },
    local_cooking_11_21: {
      trip_id: 'local_cooking_11_21',
      trip_name: '로컬 쿠킹 클래스 여행',
      trip_category: 'concept_trip',
      travel_date: '11-21',
      max_participants: 15,
      lead_type: 'trip_application',
      detail_url: 'trip-cooking.html#apply'
    },
    stargazing_12_12: {
      trip_id: 'stargazing_12_12',
      trip_name: '별 보러 가는 밤',
      trip_category: 'concept_trip',
      travel_date: '12-12',
      max_participants: 20,
      lead_type: 'trip_application',
      detail_url: 'trip-stargazing.html#apply'
    }
  };

  var requestedTrip = new URLSearchParams(window.location.search).get('trip');
  var TRIP = TRIPS[requestedTrip] || TRIPS.retro_hiking_11_14;

  function compact(object) {
    var result = {};
    Object.keys(object).forEach(function (key) {
      if (object[key] !== undefined && object[key] !== null && object[key] !== '') {
        result[key] = object[key];
      }
    });
    return result;
  }

  function tripEventParams() {
    return compact({
      trip_id: TRIP.trip_id,
      trip_name: TRIP.trip_name,
      trip_category: TRIP.trip_category,
      travel_date: TRIP.travel_date,
      max_participants: TRIP.max_participants,
      lead_type: TRIP.lead_type,
      value: TRIP.value,
      currency: TRIP.currency
    });
  }

  var QUESTIONS = [
    {
      id: 'q1',
      title: '이번 여행에서 가장 기대하는 것은 무엇인가요?',
      type: 'single',
      options: [
        ['a', '해보고 싶었던 여행 콘셉트를 즐기는 것'],
        ['b', '일상에서 벗어나 충분히 쉬는 것'],
        ['c', '같은 관심사를 가진 사람들과 어울리는 것'],
        ['d', '새로운 장소와 활동을 경험하는 것']
      ]
    },
    {
      id: 'q2',
      title: '여행 중 장소를 둘러볼 때, 어떤 속도가 좋나요?',
      type: 'single',
      options: [
        ['a', '적은 곳을 가더라도 여유롭게 즐기고 싶어요.'],
        ['b', '주요 장소를 둘러보고 중간중간 쉬고 싶어요.'],
        ['c', '이동이 조금 늘어도 여러 곳을 둘러보고 싶어요.']
      ]
    },
    {
      id: 'q3',
      title: '공통 일정을 마친 뒤 시간이 남았어요. 무엇을 하고 싶나요?',
      type: 'single',
      options: [
        ['a', '추가 활동 없이 편하게 쉬고 싶어요.'],
        ['b', '짧은 산책 정도를 하고 싶어요.'],
        ['c', '주변에서 할 수 있는 활동을 더 찾아보고 싶어요.']
      ]
    },
    {
      id: 'q4',
      title: '처음 만난 참가자들과 식사하게 됐어요. 어떤 모습이 가장 편한가요?',
      type: 'single',
      options: [
        ['a', '이야기를 듣다가 하고 싶은 말이 있을 때 참여해요.'],
        ['b', '옆 사람과 자연스럽게 이야기를 나눠요.'],
        ['c', '먼저 말을 걸고 여러 사람과 이야기해요.']
      ]
    },
    {
      id: 'q5',
      title: '공통 프로그램 외 시간은 어떻게 구성되면 좋나요?',
      type: 'single',
      options: [
        ['a', '각자 보내는 시간이 많으면 좋아요.'],
        ['b', '함께하는 시간과 각자 보내는 시간이 비슷하면 좋아요.'],
        ['c', '함께 보내는 시간이 많으면 좋아요.']
      ]
    },
    {
      id: 'q6',
      title: '이번 여행에서 음주는 어느 정도 함께하면 좋나요?',
      type: 'single',
      options: [
        ['a', '술 없이 여행을 즐기고 싶어요.'],
        ['b', '다른 사람이 마시는 것은 괜찮지만, 저는 마시지 않거나 거의 마시지 않을 것 같아요.'],
        ['c', '식사와 함께 가볍게 한두 잔 정도 즐기면 좋아요.'],
        ['d', '일정이 끝난 뒤 참가자들과 술을 마시며 어울리는 시간이 있으면 좋아요.']
      ]
    },
    {
      id: 'q7',
      title: '동행과 특히 잘 맞았으면 하는 것은 무엇인가요?',
      type: 'multiple',
      maxSelections: 2,
      options: [
        ['a', '움직이고 쉬는 속도'],
        ['b', '대화를 나누는 정도'],
        ['c', '각자 보내는 시간의 양'],
        ['d', '음주 여부와 여행 중 원하는 분위기']
      ]
    },
    {
      id: 'q8',
      title: '아래 방식으로 함께 여행하는 데 동의하나요?',
      type: 'single',
      description: [
        '여행의 콘셉트와 공통 일정을 존중해요.',
        '각자 쉬고 싶은 시간과 참여 의사를 존중해요.',
        '다른 사람을 촬영하거나 사진을 공유하기 전에 의사를 확인해요.',
        '집결 시간과 공동 이용 규칙을 지켜요.',
        '음주 여부와 관계없이 서로의 선택을 존중해요.'
      ],
      options: [
        ['a', '확인했고 동의해요.'],
        ['b', '일부 내용에 대해 안내를 더 받고 싶어요.'],
        ['c', '제가 기대한 여행 방식과 달라요.']
      ]
    }
  ];

  var answers = {};
  var currentIndex = 0;
  var completed = false;

  var intro = document.getElementById('survey-intro');
  var questionView = document.getElementById('survey-question');
  var reviewView = document.getElementById('survey-review');
  var startButton = document.getElementById('survey-start');
  var form = document.getElementById('question-form');
  var title = document.getElementById('question-title');
  var help = document.getElementById('selection-help');
  var optionList = document.getElementById('option-list');
  var notice = document.getElementById('question-notice');
  var backButton = document.getElementById('survey-back');
  var nextButton = document.getElementById('survey-next');
  var progressLabel = document.getElementById('progress-label');
  var progressPercent = document.getElementById('progress-percent');
  var progressBar = document.querySelector('.progress-track');
  var progressFill = document.getElementById('progress-fill');
  var reviewTitle = document.getElementById('review-title');
  var reviewStatus = document.getElementById('review-status');
  var agreementStatus = document.getElementById('agreement-status');
  var summaryList = document.getElementById('answer-summary-list');
  var reviewEdit = document.getElementById('review-edit');
  var reviewComplete = document.getElementById('review-complete');
  var modal = document.getElementById('survey-privacy-modal');
  var privacyAgree = document.getElementById('survey-privacy-agree');
  var privacyCancel = document.getElementById('survey-privacy-cancel');
  var privacyOk = document.getElementById('survey-privacy-ok');
  var tripContext = document.getElementById('survey-trip-context');
  var cancelLink = document.getElementById('survey-cancel');

  tripContext.textContent = TRIP.trip_name + ' 신청을 위한 여행 성향 설문';
  cancelLink.href = TRIP.detail_url;

  function track(eventName, params) {
    if (typeof window.toravelTrack !== 'function') return;
    window.toravelTrack(eventName, Object.assign({
      survey_id: SURVEY_ID,
      trip_id: TRIP.trip_id,
      trip_name: TRIP.trip_name,
      trip_category: TRIP.trip_category,
      travel_date: TRIP.travel_date,
      max_participants: TRIP.max_participants
    }, params || {}));
  }

  function showOnly(view) {
    intro.hidden = view !== intro;
    questionView.hidden = view !== questionView;
    reviewView.hidden = view !== reviewView;
  }

  function answerFor(question) {
    return answers[question.id] || [];
  }

  function isAnswered(question) {
    return answerFor(question).length > 0;
  }

  function answeredCount() {
    return QUESTIONS.filter(isAnswered).length;
  }

  function renderQuestion(shouldFocus) {
    var question = QUESTIONS[currentIndex];
    var answer = answerFor(question);
    var number = currentIndex + 1;
    var percent = Math.round((number / QUESTIONS.length) * 100);

    showOnly(questionView);
    progressLabel.textContent = number + ' / ' + QUESTIONS.length;
    progressPercent.textContent = percent + '%';
    progressBar.setAttribute('aria-valuenow', String(number));
    progressFill.style.width = percent + '%';
    title.textContent = question.title;
    help.textContent = question.type === 'multiple' ? '최대 2개 선택' : '1개 선택';
    notice.textContent = '';
    optionList.innerHTML = '';

    if (question.description) {
      var rules = document.createElement('ul');
      rules.className = 'travel-rules';
      question.description.forEach(function (item) {
        var li = document.createElement('li');
        li.textContent = item;
        rules.appendChild(li);
      });
      optionList.appendChild(rules);
    }

    question.options.forEach(function (option, optionIndex) {
      var id = question.id + '-' + option[0];
      var wrapper = document.createElement('div');
      wrapper.className = 'option-item';

      var input = document.createElement('input');
      input.type = question.type === 'multiple' ? 'checkbox' : 'radio';
      input.id = id;
      input.name = question.id;
      input.value = option[0];
      input.checked = answer.indexOf(option[0]) !== -1;

      var label = document.createElement('label');
      label.htmlFor = id;

      var code = document.createElement('span');
      code.className = 'option-code';
      code.textContent = String.fromCharCode(65 + optionIndex) + '.';

      var labelText = document.createElement('span');
      labelText.textContent = option[1];

      label.appendChild(code);
      label.appendChild(labelText);
      wrapper.appendChild(input);
      wrapper.appendChild(label);
      optionList.appendChild(wrapper);
    });

    nextButton.disabled = !isAnswered(question);
    nextButton.textContent = currentIndex === QUESTIONS.length - 1 ? '응답 확인하기' : '다음';
    backButton.textContent = currentIndex === 0 ? '처음으로' : '이전';

    if (question.id === 'q8') updateAgreementNotice();

    track('survey_question_view', {
      question_number: number,
      question_count: QUESTIONS.length,
      progress_percent: percent
    });

    if (shouldFocus) title.focus();
  }

  function updateAgreementNotice() {
    var selected = answerFor(QUESTIONS[7])[0];
    if (selected === 'b') {
      notice.textContent = '추가 안내가 필요한 항목으로 선택했습니다.';
    } else if (selected === 'c') {
      notice.textContent = '현재 여행 운영 방식과 기대가 다를 수 있습니다. 그래도 설문을 완료하거나 이전 문항으로 돌아갈 수 있어요.';
    } else {
      notice.textContent = '';
    }
  }

  function handleSelection(event) {
    var input = event.target;
    if (!input.matches('input')) return;

    var question = QUESTIONS[currentIndex];
    var current = answerFor(question).slice();

    if (question.type === 'single') {
      current = [input.value];
    } else if (input.checked) {
      if (current.length >= question.maxSelections) {
        input.checked = false;
        notice.textContent = '최대 2개까지 선택할 수 있어요.';
        return;
      }
      current.push(input.value);
    } else {
      current = current.filter(function (value) { return value !== input.value; });
    }

    answers[question.id] = current;
    nextButton.disabled = current.length === 0;
    if (question.id === 'q8') updateAgreementNotice();
    else notice.textContent = '';

    track('survey_answer_select', {
      question_number: currentIndex + 1,
      selection_count: current.length
    });
  }

  function optionLabel(question, value) {
    var option = question.options.find(function (item) { return item[0] === value; });
    return option ? option[1] : '';
  }

  function agreementMessage() {
    var value = answerFor(QUESTIONS[7])[0];
    if (value === 'b') {
      return { className: 'notice', text: '추가 안내가 필요한 항목으로 선택했습니다.' };
    }
    if (value === 'c') {
      return { className: 'caution', text: '현재 여행 운영 방식과 기대가 다를 수 있습니다. 완료하거나 답변을 수정할 수 있어요.' };
    }
    return { className: '', text: '공동 여행 방식을 확인하고 동의했습니다.' };
  }

  function renderReview() {
    showOnly(reviewView);
    var count = answeredCount();
    reviewStatus.textContent = count === QUESTIONS.length ?
      QUESTIONS.length + '개 문항에 모두 응답했습니다.' :
      (QUESTIONS.length - count) + '개 문항에 답변이 필요합니다.';
    reviewComplete.disabled = count !== QUESTIONS.length;

    var agreement = agreementMessage();
    agreementStatus.className = 'agreement-status ' + agreement.className;
    agreementStatus.textContent = agreement.text;

    summaryList.innerHTML = '';
    QUESTIONS.forEach(function (question, index) {
      var item = document.createElement('div');
      item.className = 'summary-item';

      var copy = document.createElement('div');
      var heading = document.createElement('strong');
      heading.textContent = (index + 1) + '. ' + question.title;
      var selected = document.createElement('p');
      var labels = answerFor(question).map(function (value) {
        return optionLabel(question, value);
      });
      selected.textContent = labels.length ? labels.join(', ') : '미응답';
      copy.appendChild(heading);
      copy.appendChild(selected);

      var edit = document.createElement('button');
      edit.type = 'button';
      edit.className = 'summary-edit';
      edit.dataset.index = String(index);
      edit.textContent = '수정';

      item.appendChild(copy);
      item.appendChild(edit);
      summaryList.appendChild(item);
    });

    track('survey_review', {
      answered_count: count,
      question_count: QUESTIONS.length
    });
    reviewTitle.focus();
  }

  function openPrivacy() {
    privacyAgree.checked = false;
    privacyOk.disabled = true;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    privacyAgree.focus();
  }

  function closePrivacy() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    reviewComplete.focus();
  }

  function wipeAnswers() {
    Object.keys(answers).forEach(function (key) { delete answers[key]; });
  }

  function finishSurvey() {
    if (completed || !privacyAgree.checked) return;
    completed = true;
    privacyOk.disabled = true;

    track('survey_complete', {
      question_count: QUESTIONS.length,
      completion_status: 'completed',
      trip_name: TRIP.trip_name
    });

    wipeAnswers();

    var navigated = false;
    function goToResult() {
      if (navigated) return;
      navigated = true;
      window.location.replace('result.html');
    }

    if (typeof window.gtag === 'function') {
      window.gtag('event', 'generate_lead', Object.assign(tripEventParams(), {
        page_type: 'survey',
        event_callback: goToResult,
        event_timeout: 900
      }));
      if (window.fbq) fbq('track', 'Lead');
      window.setTimeout(goToResult, 1000);
    } else {
      goToResult();
    }
  }

  startButton.addEventListener('click', function () {
    track('survey_start', { question_count: QUESTIONS.length });
    currentIndex = 0;
    renderQuestion(true);
  });

  optionList.addEventListener('change', handleSelection);

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var question = QUESTIONS[currentIndex];
    if (!isAnswered(question)) return;

    if (currentIndex === QUESTIONS.length - 1) {
      renderReview();
      return;
    }

    track('survey_next', {
      from_question: currentIndex + 1,
      to_question: currentIndex + 2
    });
    currentIndex += 1;
    renderQuestion(true);
  });

  backButton.addEventListener('click', function () {
    if (currentIndex === 0) {
      showOnly(intro);
      startButton.focus();
      return;
    }
    track('survey_back', {
      from_question: currentIndex + 1,
      to_question: currentIndex
    });
    currentIndex -= 1;
    renderQuestion(true);
  });

  reviewEdit.addEventListener('click', function () {
    currentIndex = 0;
    renderQuestion(true);
  });

  summaryList.addEventListener('click', function (event) {
    var button = event.target.closest('.summary-edit');
    if (!button) return;
    currentIndex = Number(button.dataset.index);
    renderQuestion(true);
  });

  reviewComplete.addEventListener('click', openPrivacy);
  privacyAgree.addEventListener('change', function () {
    privacyOk.disabled = !privacyAgree.checked;
  });
  privacyCancel.addEventListener('click', closePrivacy);
  privacyOk.addEventListener('click', finishSurvey);
  modal.addEventListener('click', function (event) {
    if (event.target === modal) closePrivacy();
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && modal.classList.contains('open')) closePrivacy();
  });
})();
