(() => {
  'use strict';
  const screen = document.querySelector('#screen');
  const main = document.querySelector('#main');
  const state = { step: 1, category: null, option: null, busy: false };
  const disclaimer = 'このサイトに登場するおくすりはぜんぶ架空のものです。実際の医薬品や医療上の診断とは関係ありません。';
  const mascot = '<img src="assets/images/character-original.jpg" alt="手描きの、とりの薬局店員" class="mascot">';
  const pill = '<span class="mini-pill" aria-hidden="true"></span>';

  function decorations() {
    return '<div class="sketch-decorations" aria-hidden="true">' + ['capsule','bottle','blister','sachets','capsule','tube','box','tablets'].map((id,i) => '<span class="doodle doodle-'+(i+1)+'"><svg fill="white" stroke="#111" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><use href="#'+id+'"></use></svg></span>').join('') + '</div>';
  }
  function dialogue(text) {
    const outline = '<svg class="bubble-outline" viewBox="0 0 1000 220" preserveAspectRatio="none" aria-hidden="true"><path d="M45 4 Q18 3 13 25 Q5 85 12 156 Q14 179 44 180 L863 180 Q887 182 907 177 L987 211 L938 161 L938 34 Q936 7 909 5 Q477 0 45 4 Z" fill="white" stroke="#111" stroke-width="2.5" vector-effect="non-scaling-stroke" stroke-linejoin="round"/></svg>';
    return '<div class="sketch-dialogue"><div class="sketch-bubble">'+outline+'<span>'+text+'</span></div>'+mascot.replace('class="mascot"','class="sketch-bird"')+'</div>';
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
  function chosenOption() {
    const option = followupData.find(item => item.id === state.option);
    return { ...option, resultId: option.resultId || initialPrescription[state.category] };
  }

  function result() {
    const category = diagnosisData[state.category];
    const option = chosenOption();
    const med = medicineData[option.resultId];
    return `<section class="result-screen" aria-labelledby="screen-title" data-result="${option.resultId}"><button class="back-button" data-action="edit">← えらびなおす</button><div class="result-heading"><p class="little-label"><span>おまたせしました。</span></p><h1 id="screen-title" tabindex="-1">おくすり、<span class="outlined">だしとくね。</span></h1><p>${category.label} <span aria-hidden="true">→</span> ${option.text}</p></div><div class="prescription"><div class="medicine-stage ${med.color}"><span class="stage-star one" aria-hidden="true">✳</span><span class="stage-star two" aria-hidden="true">✧</span><span class="package-sticker">あなた専用<br>きぶん処方</span><div class="medicine-box" role="img" aria-label="${med.name}のオリジナルパッケージ"><div class="package-top">薬局.com <span>空想薬品</span></div><div class="package-main"><span class="package-english">${med.english}</span><strong>${med.name}</strong><span class="package-motif" aria-hidden="true">${med.motif}</span><span class="package-caption">こころに、ひとさじのへんてこ。</span></div><div class="package-bottom">ききめは、きぶんしだい。 <span>✚</span></div></div><span class="loose-pill pill-one" aria-hidden="true"></span><span class="loose-pill pill-two" aria-hidden="true"></span><span class="stage-caption">※ イラストです。ほんものは届きません。</span></div><div class="prescription-copy"><p class="prescription-number">YOUR PRESCRIPTION / ${String(Object.keys(medicineData).indexOf(option.resultId) + 1).padStart(2, '0')}</p><p class="result-title">${med.title}</p><h2>${med.name}</h2><p class="medicine-description">${med.description}</p><div class="effect"><h3>こんなきぶんに</h3><p>${med.effect}</p></div><div class="clerk-message"><img src="assets/images/character-original.jpg" alt=""/><p><span>くすりさんより</span>${med.message}</p></div></div></div><div class="result-actions"><button class="restart-button" data-action="restart">もういっかい診断する <span aria-hidden="true">↻</span></button><p class="result-disclaimer">${disclaimer}</p></div></section>`;
  }

  function render(focus = true) {
    document.body.dataset.screen = String(state.step);
    screen.innerHTML = state.step === 1 ? home() : state.step === 2 ? question() : result();
    document.querySelectorAll('[data-step]').forEach(item => {
      const step = Number(item.dataset.step);
      if (step === state.step) item.setAttribute('aria-current', 'step');
      else item.removeAttribute('aria-current');
      item.classList.toggle('complete', step < state.step);
    });
    document.title = `${state.step === 3 ? medicineData[chosenOption().resultId].name : 'ちいさなおなやみ相談'}｜薬局.com`;
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
