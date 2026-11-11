(() => {
  'use strict';
  const screen = document.querySelector('#screen');
  const main = document.querySelector('#main');
  const state = { step: 1, category: null, option: null, busy: false };
  const mascot = '<img src="assets/images/question-bird.webp" alt="手描きの、とりの薬局店員" class="sketch-bird" width="512" height="512">';

  function decorations() {
    const doodles = ['capsule', 'bottle', 'blister', 'sachets', 'capsule', 'tube', 'box', 'tablets'];
    const draw = id => `<svg fill="white" stroke="#111" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><use href="#${id}"></use></svg>`;
    const drawings = doodles.map((id, index) => {
      if (index !== 4) return `<span class="doodle doodle-${index + 1}">${draw(id)}</span>`;

      return `<span class="doodle doodle-5 breakable-capsule">
        <span class="capsule-whole">${draw(id)}</span>
        <span class="capsule-piece capsule-piece-left">${draw('capsule-half-left')}</span>
        <span class="capsule-piece capsule-piece-right">${draw('capsule-half-right')}</span>
      </span>`;
    });
    return `<div class="sketch-decorations" aria-hidden="true">${drawings.join('')}</div>`;
  }
  function dialogue(text) {
    const outline = '<svg class="bubble-outline" viewBox="0 0 1000 220" preserveAspectRatio="none" aria-hidden="true"><path d="M45 4 Q18 3 13 25 Q5 85 12 156 Q14 179 44 180 L863 180 Q887 182 907 177 L987 211 L938 161 L938 34 Q936 7 909 5 Q477 0 45 4 Z" fill="white" stroke="#111" stroke-width="2.5" vector-effect="non-scaling-stroke" stroke-linejoin="round"/></svg>';
    return '<div class="sketch-dialogue"><div class="sketch-bubble">'+outline+'<span>'+text+'</span></div>'+mascot+'</div>';
  }
  function home() {
    return '<section class="sketch-page home-page" aria-labelledby="screen-title">'+decorations()+
      '<h1 id="screen-title" class="sketch-logo" tabindex="-1">薬局.com</h1><p class="sketch-intro">あなたのお悩みに合わせて<br>おくすりを処方します</p><h2 class="sketch-label">お悩み１</h2><div class="sketch-choices">'+
      Object.entries(diagnosisData).map(([key,category]) => '<div class="sketch-choice-slot"><button class="sketch-button" data-category="'+key+'">'+category.label+'</button></div>').join('')+
      '</div>'+dialogue('あなたのお悩みは？')+'</section>';
  }
  function question() {
    return '<section class="sketch-page question-page" aria-labelledby="screen-title">'+decorations()+
      '<button class="sketch-back" data-action="back">← もどる</button><h1 id="screen-title" class="sketch-label" tabindex="-1">お悩み２</h1><div class="sketch-choices">'+
      followupData.map(option => '<div class="sketch-choice-slot"><button class="sketch-button" data-option="'+option.id+'">'+option.text+'</button></div>').join('')+
      '</div>'+dialogue('お悩みはまだある？')+'</section>';
  }
  function result(resultId) {
    const name = resultNames[resultId];
    const actions = `<div class="result-actions">
      <button class="back-button" data-action="edit">← えらびなおす</button>
      <button class="back-button" data-action="restart">もういっかい診断する</button>
    </div>`;

    if (resultId === 'reality') {
      return `<section class="reality-screen" aria-labelledby="screen-title" data-result="${resultId}">
        <h1 id="screen-title" class="reality-title" tabindex="-1">${name}</h1>
        <img class="reality-art" src="assets/images/reality.webp" width="330" height="330"
          alt="なやみがないというのは本当ですか？ 現実から目を背けているだけではありませんか？">
        ${actions}
      </section>`;
    }

    return renderMedicineResult(resultId, actions);
  }

  function render(focus = true) {
    document.body.dataset.screen = String(state.step);
    const resultId = state.step === 3 ? resultByAnswers[state.category][state.option] : null;
    if (resultId) document.body.dataset.result = resultId;
    else delete document.body.dataset.result;
    document.body.classList.toggle('show-reality', resultId === 'reality');
    screen.innerHTML = state.step === 1 ? home() : state.step === 2 ? question() : result(resultId);
    document.querySelectorAll('[data-step]').forEach(item => {
      const step = Number(item.dataset.step);
      if (step === state.step) item.setAttribute('aria-current', 'step');
      else item.removeAttribute('aria-current');
      item.classList.toggle('complete', step < state.step);
    });
    document.title = `${resultId ? resultNames[resultId] : 'ちいさなおなやみ相談'}｜薬局.com`;
    if (focus) {
      screen.querySelector('h1').focus({ preventScroll: true });
      main.scrollIntoView({ block: 'start', behavior: 'instant' });
    }
  }

  function navigate(change) {
    if (state.busy) return;
    state.busy = true;
    screen.classList.add('is-leaving');
    setTimeout(() => {
      change();
      render();
      screen.classList.remove('is-leaving');
      screen.classList.add('is-entering');
      setTimeout(() => { screen.classList.remove('is-entering'); state.busy = false; }, 240);
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 150);
  }

  screen.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button || state.busy) return;
    if (button.dataset.category && state.step === 1 && diagnosisData[button.dataset.category]) {
      button.classList.add('is-selected');
      navigate(() => { state.category = button.dataset.category; state.option = null; state.step = 2; });
    } else if (button.dataset.option && state.step === 2 && followupData.some(item => item.id === button.dataset.option)) {
      button.classList.add('is-selected');
      navigate(() => { state.option = button.dataset.option; state.step = 3; });
    } else if (button.dataset.action === 'edit' && state.step === 3) {
      navigate(() => { state.option = null; state.step = 2; });
    } else if (['back', 'restart'].includes(button.dataset.action)) {
      navigate(() => { state.step = 1; state.category = null; state.option = null; });
    }
  });
  document.querySelector('.brand')?.addEventListener('click', event => {
    event.preventDefault();
    if (!state.busy) navigate(() => { state.step = 1; state.category = null; state.option = null; });
  });
  render(false);
})();
