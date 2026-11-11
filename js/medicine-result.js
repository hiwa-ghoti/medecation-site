const renderMedicineResult = (() => {
  'use strict';

  const medicines = {
    posikusa: {
      art: 'posikusa',
      alt: 'ピンクと黄緑の水玉がついた、矢印型の錠剤',
      description: 'ポジティブになる。\n前向きに課題をがんばろう！',
      effect: '前向きになる',
      sideEffect: 'うでがかゆくなる'
    },
    esumahon_moka: {
      art: 'esumahon-moka',
      alt: '黄色い稲妻が入った、蛍光グリーンの丸い錠剤',
      description: 'めちゃくちゃ目が覚める\nカフェイン錠剤。',
      effect: '眠気ざまし',
      sideEffect: 'ブルーライトを見ると頭が痛くなる'
    },
    focasion: {
      art: 'focasion',
      alt: '大きな紫の目を照準で囲んだカプセル',
      description: '三大欲求を忘れるほどの集中をあなたに',
      effect: '集中できるようになる',
      sideEffect: '食欲不振・睡眠不足'
    },
    kakureisan: {
      art: 'kakureisan',
      alt: '薬包紙に盛られた、目のついた群青色の粉の山',
      description: 'とんでもない苦さで食欲と眠気を撃退！',
      effect: '目が覚める',
      sideEffect: '食欲がなくなる'
    },
    gaming_prazole: {
      art: 'gaming-prazole',
      alt: '端がピクセルに砕ける水色のコントローラー型の錠剤',
      description: 'ブルーライトで目を覚ましちゃえ',
      effect: 'めがさめる・人生が楽しくなる',
      sideEffect: 'たまに生きずらくなる'
    }
  };

  return function render(id, actions = '') {
    const medicine = medicines[id];
    return `<section class="medicine-result" aria-labelledby="screen-title" data-result="${id}">
      <h1 id="screen-title" tabindex="-1">${resultNames[id]}</h1>
      <img class="medicine-illustration" src="assets/images/medicines/${medicine.art}.png"
        alt="${medicine.alt}" width="1254" height="1254">
      <p class="medicine-intro">${medicine.description}</p>
      <dl class="medicine-details">
        <div><dt>こうのう</dt><dd>${medicine.effect}</dd></div>
        <div><dt>ふくさよう</dt><dd>${medicine.sideEffect}</dd></div>
      </dl>
      <div class="medicine-clerk">
        <p class="medicine-clerk-bubble">なおるといいねー</p>
        <img src="assets/images/result-bird.webp" alt="手を上げる鳥の店員" width="512" height="512">
      </div>
      ${actions}
    </section>`;
  };
})();
