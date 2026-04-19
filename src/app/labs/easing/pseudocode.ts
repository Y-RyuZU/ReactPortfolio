import type { EasingKey } from './easings';

export interface PseudocodeEntry {
  modelLabel: string;
  modelTag: string;
  summary: string;
  code: string;
  afterNote?: string;
}

// Per-frame pseudocode: expresses each easing as a physics-style update loop
// that doesn't require knowing the landing point or total duration up-front.
// The traditional parametric form needs `start`, `end`, and `t = elapsed/duration`;
// the per-frame form only needs the previous state and dt.
export const PSEUDOCODE: Record<EasingKey, PseudocodeEntry> = {
  linear: {
    modelLabel: '等速運動',
    modelTag: 'CONSTANT VELOCITY',
    summary: '加速度なし。初速を与え、毎フレーム同じ量だけ進める。',
    code: `// 初期化
let velocity = { x: 300, y: 0 };   // px/s

// 毎フレーム
function update(dt) {
  position.x += velocity.x * dt;
  position.y += velocity.y * dt;
}`,
    afterNote: '真空中を慣性で飛ぶような非現実的な動き。ほぼ使わない。',
  },

  easeInQuad: {
    modelLabel: '等加速度運動',
    modelTag: 'CONSTANT ACCELERATION',
    summary: '一定の加速度を加え続けるだけ。静止から始めれば変位は t² に比例する。',
    code: `// 初期化
let velocity     = { x: 0, y: 0 };
const acceleration = { x: 0, y: 980 };   // 重力 or 推力

// 毎フレーム
function update(dt) {
  velocity.x += acceleration.x * dt;
  velocity.y += acceleration.y * dt;
  position.x += velocity.x * dt;
  position.y += velocity.y * dt;
}`,
    afterNote: '重力落下・推進剤点火の加速・溜め動作の初動などに。',
  },

  easeOutQuad: {
    modelLabel: '線形ドラッグ減速',
    modelTag: 'LINEAR DRAG',
    summary: '初速を与え、速度に比例したブレーキで減速。数フレームかけて0へ近づく。',
    code: `// 初期化
let velocity = { x: 400, y: 0 };
const drag = 2.0;                      // 抗力係数 (大きいほど早く減速)

// 毎フレーム (暗黙オイラーで dt 大でも安定)
function update(dt) {
  const k = 1 / (1 + drag * dt);
  velocity.x *= k;
  velocity.y *= k;
  position.x += velocity.x * dt;
  position.y += velocity.y * dt;
}`,
    afterNote: '矢・ダッシュ・スケート的な「勢いが抜ける」表現に最適。',
  },

  easeInOutQuad: {
    modelLabel: '柔らかめの臨界スプリング',
    modelTag: 'SOFT CRITICAL SPRING',
    summary: 'Cubicより剛性を落とし、臨界減衰で静かに目標へ寄せる。クセのない汎用追従。',
    code: `// 初期化
let velocity = 0;
const stiffness = 25;
const damping   = 2 * Math.sqrt(stiffness);  // 臨界 ≈ 10

// 毎フレーム
function update(dt, target) {
  const dx = target - position;
  const a  = stiffness * dx - damping * velocity;
  velocity += a * dt;
  position += velocity * dt;
}`,
    afterNote: 'UIの控えめな追従、カーソル・カメラの微調整に。主張しすぎない。',
  },

  easeInCubic: {
    modelLabel: '一定躍度（jerk）',
    modelTag: 'CONSTANT JERK',
    summary: '加速度そのものが時間に比例して増え続ける。初速ゼロで始めれば変位は t³。',
    code: `// 初期化
let velocity     = 0;
let acceleration = 0;
const jerk = 120;                      // 加速度の変化率 (px/s³)

// 毎フレーム
function update(dt) {
  acceleration += jerk * dt;
  velocity     += acceleration * dt;
  position     += velocity * dt;
}`,
    afterNote: '隕石落下・終盤で一気に迫る呪文など、じわじわ加速していく動き。',
  },

  easeOutCubic: {
    modelLabel: '2次ドラッグ',
    modelTag: 'QUADRATIC DRAG',
    summary: '速度の2乗に比例する抵抗（空気抵抗のモデル）。高速域ほど急激に減速する。',
    code: `// 初期化
let velocity = 500;
const k = 0.003;                       // 二次抗力係数

// 毎フレーム
function update(dt) {
  velocity -= k * velocity * Math.abs(velocity) * dt;
  position += velocity * dt;
}`,
    afterNote: '弾道・水流など速度に強く依存する抵抗のある環境。Quadとの違いは序盤の鋭さ。',
  },

  easeInOutCubic: {
    modelLabel: '臨界減衰スプリング',
    modelTag: 'CRITICALLY-DAMPED SPRING',
    summary: '目標に向かってスプリングで引く。臨界減衰にすれば両端で静かに、振動なしで収束する。',
    code: `// 初期化
let velocity = 0;
const stiffness = 50;                  // 剛性
const damping   = 2 * Math.sqrt(stiffness);  // 臨界減衰 (≈14.14)

// 毎フレーム (target は「今向かっている点」でOK。事前に到達時間は不要)
function update(dt, target) {
  const dx = target - position;
  const a  = stiffness * dx - damping * velocity;
  velocity += a * dt;
  position += velocity * dt;
}`,
    afterNote: 'カメラ追従・メニューの滑らかな出現・キャラクタのホーミング等。',
  },

  easeInBack: {
    modelLabel: '逆方向のタメ → 順方向の加速',
    modelTag: 'WINDUP → LAUNCH',
    summary: 'まず短時間だけ目標と逆向きに引き、それから本命の加速。予備動作が生まれる。',
    code: `// 初期化
let velocity = 0;
let phase = 'windup';                  // 'windup' → 'launch'
let windupTimer = 0.12;                // 振りかぶり時間 (秒)
const windupAccel = -220;              // 逆方向への引き
const launchAccel = 420;               // 本命の押し

// 毎フレーム
function update(dt) {
  if (phase === 'windup') {
    velocity += windupAccel * dt;
    windupTimer -= dt;
    if (windupTimer <= 0) phase = 'launch';
  } else {
    velocity += launchAccel * dt;
  }
  position += velocity * dt;
}`,
    afterNote: '呪文詠唱の振りかぶり、溜めパンチ、ダッシュ前の一歩引きなど。',
  },

  easeOutBack: {
    modelLabel: 'アンダーダンプド・スプリング',
    modelTag: 'UNDER-DAMPED SPRING',
    summary: '臨界より減衰が弱いスプリング。目標を一度行き過ぎてから戻るオーバーシュートが出る。',
    code: `// 初期化
let velocity = 0;
const stiffness = 80;
const damping   = 6;                   // < 2*sqrt(stiffness) なので振動する

// 毎フレーム
function update(dt, target) {
  const dx = target - position;
  const a  = stiffness * dx - damping * velocity;
  velocity += a * dt;
  position += velocity * dt;
}`,
    afterNote: 'UIの決まり感、剣の抜刀の「キュッ」という止め。1往復で収まる。',
  },

  easeInOutBack: {
    modelLabel: '振りかぶり→アンダーダンプド到達',
    modelTag: 'WINDUP + OVERSHOOT',
    summary: '出発時に逆方向へ引いてから加速し、到達時にもオーバーシュート。2段階のドラマを持つ動作。',
    code: `// 初期化
let velocity = 0;
let phase = 'windup';                  // windup → approach
let windupTimer = 0.1;
const windupAccel = -180;
const stiffness   = 90;
const damping     = 5;                 // 弱減衰

// 毎フレーム
function update(dt, target) {
  if (phase === 'windup') {
    velocity += windupAccel * dt;
    windupTimer -= dt;
    if (windupTimer <= 0) phase = 'approach';
  } else {
    const dx = target - position;
    const a  = stiffness * dx - damping * velocity;
    velocity += a * dt;
  }
  position += velocity * dt;
}`,
    afterNote: '決め技のエフェクト、モーダルの印象的な登場・退場に。',
  },

  easeOutElastic: {
    modelLabel: '低減衰スプリング',
    modelTag: 'LOW-DAMPING SPRING',
    summary: 'さらに減衰を弱めた同じスプリングモデル。何度も揺れてから収束する。',
    code: `// 初期化
let velocity = 0;
const stiffness = 120;
const damping   = 2;                   // 非常に小さい → 長く振動

// 毎フレーム
function update(dt, target) {
  const dx = target - position;
  const a  = stiffness * dx - damping * velocity;
  velocity += a * dt;
  position += velocity * dt;
}`,
    afterNote: '宝箱の開封、スライム敵、ゼリー素材の弾性など「震え」を表現。',
  },

  easeOutBounce: {
    modelLabel: '重力落下＋床反発',
    modelTag: 'GRAVITY + RESTITUTION',
    summary: '重力で落とし、床にぶつかったら速度を反転。反発係数で徐々に勢いが減る。',
    code: `// 初期化
let velocity = { x: 0, y: 0 };
const gravity       = 980;             // px/s² (下向き)
const groundY       = 0;               // 床の Y 座標
const restitution   = 0.7;             // 0..1 の反発係数

// 毎フレーム
function update(dt) {
  velocity.y += gravity * dt;
  position.y += velocity.y * dt;

  if (position.y > groundY) {          // 床を突き抜けた
    position.y = groundY;              // 戻す
    velocity.y = -velocity.y * restitution;  // 反転＆減衰
  }
}`,
    afterNote: '落としたコインやポーション瓶の挙動。反発係数を下げるほど早く止まる。',
  },
};
