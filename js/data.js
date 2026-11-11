/* 質問と処方の対応はここで管理。共有機能は結果の id/name を利用できます。 */
const diagnosisData = {
  homework: { label: 'かだいがだせない', question: 'なんでできないのー？', note: 'うんうん。かだいって、なぜか増えるよねー。', icon: '✎', color: 'pink', options: [
    { id: 'no_motivation', text: 'やるきがでない', resultId: 'yarukideru' },
    { id: 'confused', text: 'なにをすればいいかわからない', resultId: 'mazukore' },
    { id: 'no_time', text: 'じかんがたりない', resultId: 'gofundake' },
    { id: 'distracted', text: 'ほかのことがたのしい', resultId: 'yorimichi' },
    { id: 'forgot', text: 'そもそもわすれてた', resultId: 'omoidashin' }
  ] },
  sleepy: { label: 'ずーっとねむい', question: 'なんでそんなにねむいのー？', note: 'あくびが、こっちにもうつりそうだよー。', icon: '☾', color: 'purple', options: [
    { id: 'late', text: 'よふかししちゃった', resultId: 'yorushimai' },
    { id: 'still_sleepy', text: 'ねてもねてもねむい', resultId: 'nemuketon' },
    { id: 'bored', text: 'じゅぎょうがつまらない', resultId: 'omoshiron' },
    { id: 'futon', text: 'ふとんがだいすき', resultId: 'futonbye' },
    { id: 'unknown', text: 'なんでかしらない', resultId: 'hatena' }
  ] },
  nothing: { label: 'ない', question: 'じゃあなんできたのー？', note: 'ようじがなくても、いていいんだよー。', icon: '✳', color: 'green', options: [
    { id: 'casual', text: 'なんとなく', resultId: 'nantonaku' },
    { id: 'free', text: 'ひまだから', resultId: 'himatsubu' },
    { id: 'want', text: 'おくすりがほしい', resultId: 'kibundake' },
    { id: 'actually', text: 'ほんとはちょっとある', resultId: 'chottodake' },
    { id: 'mistake', text: 'まちがえてきた', resultId: 'maikka' }
  ] }
};
const medicineData = {
  oyatsu: { name: 'オヤツノシオリ', title: 'おやつのつづきは、またあとで。', description: 'おかしのふくろに、こころのしおりをはさむ架空のおくすり。', effect: '「つづきはあとで」の看板を、ふくろのそばに立てたくなる。', message: 'おやつの時間も、ひとやすみの時間も、ゆっくりねー。', motif: '♡', color: 'green', english: 'OYATSU NO SHIORI' },
  yarukideru: { name: 'やるきでーる', title: 'やるきの芽、でるかも。', description: 'やるきがでたようなきもちになれるおくすり。', effect: 'まずはノートをひらくきもちになる。たぶん。', message: 'のんだつもりでがんばってねー。', motif: '✷', color: 'pink', english: 'YARUKI DE-RU' },
  mazukore: { name: 'マズコレカラ', title: 'さいしょの一歩を、ひとつ。', description: 'あたまのなかの「？」に、ちいさな付せんをはるおくすり。', effect: '「まず、なまえをかく」が、りっぱな作戦にみえてくる。', message: 'ぜんぶじゃなくて、ひとつでいいよー。', motif: '→', color: 'green', english: 'MAZU KORE KARA' },
  gofundake: { name: 'ゴフンダケ', title: 'じかんのすきま、みつけた。', description: 'じかんのすきまに、ちいさな作業机をおくおくすり。', effect: '５分だけのつもりが、５分ぶんすすむ。ちゃんとすごい。', message: '時計はのびないけど、ひといきつこうねー。', motif: '◷', color: 'purple', english: 'GOFUN DAKE' },
  yorimichi: { name: 'ヨリミチモドール', title: 'たのしい寄り道から、おかえり。', description: 'たのしいことに「あとでね」のしおりをはさむおくすり。', effect: '動画のつづきより、かだいのつづきが１ミリきになる。', message: 'ごほうびは、あとでもにげないよー。', motif: '↩', color: 'pink', english: 'YORIMICHI MODO-RU' },
  omoidashin: { name: 'オモイダシン', title: 'わすれてた君も、ここから。', description: 'きおくのすみで、ちいさなベルをならすおくすり。', effect: 'カレンダーと目があう。こんどはそらさない。', message: 'おもいだした今が、スタートだよー。', motif: '!', color: 'green', english: 'OMOIDASHIN' },
  yorushimai: { name: 'ヨルハオシマイ', title: 'よるにも、閉店時間を。', description: 'よるの「もうちょっと」に、へいてんの看板をだすおくすり。', effect: 'スマホに「またあした」とあいさつするきもちになる。', message: 'きょうは、ゆっくりやすんでねー。', motif: '☾', color: 'purple', english: 'YORU WA OSHIMAI' },
  nemuketon: { name: 'ネムケトンデケ', title: 'ねむけに、旅のしおりを。', description: 'ねむけがどこかにとんでいくかもしれないおくすり。', effect: 'めをあけているきもちになれる。', message: 'でも、ちゃんとねてねー。ねむさがつづいてこまるときは、お医者さんに相談してね。', motif: '✦', color: 'green', english: 'NEMUKE TONDEKE' },
  omoshiron: { name: 'オモシロミッケ', title: 'たいくつに、ちいさな発見。', description: 'いつもの景色に、ちょっとだけ虫めがねをむけるおくすり。', effect: 'ノートのすみに、きになることがひとつふえる。', message: '「なんで？」をひとつ、ひろってみてねー。', motif: '?', color: 'pink', english: 'OMOSHIRO MIKKE' },
  futonbye: { name: 'フトンバイバイ', title: 'ふとんとは、また今夜。', description: 'ふとんとのおわかれを、すこしだけドラマチックにするおくすり。', effect: 'ふとんに手をふれる。アンコールは今夜。', message: 'ふとんも、おるすばんできるよー。', motif: '☀', color: 'purple', english: 'FUTON BYE BYE' },
  hatena: { name: 'ハテナノママ', title: 'わからない日も、あるよね。', description: '「わからない」をそっと置ける、こころの小皿みたいなおくすり。', effect: 'むりにこたえをださず、ひとやすみするきもちになる。', message: 'ねむさがつづいたり、くらしでこまったりするときは、お医者さんに相談してねー。', motif: '?', color: 'green', english: 'HATENA NO MAMA' },
  nantonaku: { name: 'ナントナクール', title: 'なんとなくって、いい理由。', description: '「なんとなく」に、きれいなリボンをかけるおくすり。', effect: 'なんでもない日が、ほんのり記念日になる。', message: 'きてくれたから、きょうは来店記念日だねー。', motif: '✳', color: 'green', english: 'NANTONAKU-RU' },
  himatsubu: { name: 'ヒマツブノタネ', title: 'ひまに、小さなたねをまこう。', description: 'ぽっかりあいたじかんに、あそびのたねをまくおくすり。', effect: '雲にへんななまえをつける才能が、めざめるかも。', message: 'あの雲は、たぶんジャンボぎょうざだねー。', motif: '✿', color: 'pink', english: 'HIMATSUBU NO TANE' },
  kibundake: { name: 'キブンダケーヌ', title: 'ほしいのは、わくわく成分。', description: 'おくすりのはこをもらう、わくわくしたきぶんのおくすり。', effect: 'からっぽの手にも、おみやげをもったきぶんになる。', message: 'この画面を、こころのポケットにどうぞー。', motif: '♡', color: 'purple', english: 'KIBUN DAKE-NU' },
  chottodake: { name: 'チョットキクヨ', title: 'その「ちょっと」、きくよ。', description: 'ことばにならないきもちの、となりにすわるおくすり。', effect: 'だれかに、ひとことはなしてみたくなるかもしれない。', message: 'はなしたいときに、はなせる人に。いそがなくていいよー。', motif: '…', color: 'pink', english: 'CHOTTO KIKUYO' },
  maikka: { name: 'マイッカロン', title: 'まちがいから、こんにちは。', description: 'まちがえた道に、ちいさな花をさかせるおくすり。', effect: '「あれ？」が「ま、いっか」に着がえる。', message: 'まよいこんでくれて、ありがとねー。', motif: '✿', color: 'green', english: 'MAIKKARON' }
};

/* 採用した「お悩み２」の4択。以前の15種類のデータも残しています。 */
const followupData = [
  { id: 'life', text: 'じんせいがつらい' },
  { id: 'snacks', text: 'おかしをたべすぎちゃう' },
  { id: 'phone', text: 'スマホずっとみちゃう' },
  { id: 'nothing_else', text: 'ないってば！' }
];

const resultByAnswers = {
  homework: { life: 'posikusa', snacks: 'focasion', phone: 'focasion', nothing_else: 'posikusa' },
  sleepy: { life: 'gaming_prazole', snacks: 'kakureisan', phone: 'esumahon_moka', nothing_else: 'esumahon_moka' },
  nothing: { life: 'gaming_prazole', snacks: 'kakureisan', phone: 'esumahon_moka', nothing_else: 'reality' }
};

const resultNames = {
  posikusa: 'ポジクサー',
  focasion: 'フォーカシオン',
  gaming_prazole: 'ゲーミングプラゾール',
  kakureisan: '覚苓散',
  esumahon_moka: 'エスマホンモカ',
  reality: '現実'
};
