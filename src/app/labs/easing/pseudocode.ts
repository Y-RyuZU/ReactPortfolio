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
};
