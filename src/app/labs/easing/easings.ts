export type EasingKey =
  | 'linear'
  | 'easeInQuad'
  | 'easeOutQuad'
  | 'easeInOutQuad'
  | 'easeInCubic'
  | 'easeOutCubic'
  | 'easeInOutCubic'
  | 'easeInBack'
  | 'easeOutBack'
  | 'easeInOutBack'
  | 'easeOutElastic'
  | 'easeOutBounce';

export interface EasingEntry {
  fn: (t: number) => number;
  jp: string;
  en: string;
  rpg: string;
  rpgEn: string;
  desc: string;
  color: string;
}

export const EASINGS: Record<EasingKey, EasingEntry> = {
  linear: {
    fn: (t) => t,
    jp: '直線移動',
    en: 'Linear',
    rpg: '兵士の行軍',
    rpgEn: "Soldier's March",
    desc: '一定速度。機械的で生命感がない。ゴーレムの歩みのよう。',
    color: '#8a8578',
  },
  easeInQuad: {
    fn: (t) => t * t,
    jp: 'イーズイン (加速)',
    en: 'Ease In Quad',
    rpg: '魔力チャージ',
    rpgEn: 'Mana Charge',
    desc: 'ゆっくり始まり徐々に加速。呪文詠唱や溜め攻撃に最適。',
    color: '#7b5cd6',
  },
  easeOutQuad: {
    fn: (t) => 1 - (1 - t) * (1 - t),
    jp: 'イーズアウト (減速)',
    en: 'Ease Out Quad',
    rpg: '放たれし矢',
    rpgEn: 'Released Arrow',
    desc: '勢いよく始まり減速。投擲武器の着弾直前に重みを感じる。',
    color: '#d4a017',
  },
  easeInOutQuad: {
    fn: (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
    jp: 'イーズインアウト2乗',
    en: 'Ease In-Out Quad',
    rpg: '定規の滑走',
    rpgEn: 'Sliding Rule',
    desc: '両端で滑らか、中央最速。クセのない素朴なS字。',
    color: '#5c86b0',
  },
  easeInCubic: {
    fn: (t) => t * t * t,
    jp: 'イーズイン3乗',
    en: 'Ease In Cubic',
    rpg: '隕石落下',
    rpgEn: 'Meteor Fall',
    desc: '最後に一気に加速。重力落下や隕石魔法の表現に。',
    color: '#6b4423',
  },
  easeOutCubic: {
    fn: (t) => 1 - Math.pow(1 - t, 3),
    jp: 'イーズアウト3乗',
    en: 'Ease Out Cubic',
    rpg: '英雄の着地',
    rpgEn: "Hero's Landing",
    desc: '3乗の減速。Quadより序盤が鋭く、終盤が柔らかい。',
    color: '#e27c3e',
  },
  easeInOutCubic: {
    fn: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    jp: 'イーズインアウト',
    en: 'Ease In-Out Cubic',
    rpg: '聖騎士の突進',
    rpgEn: "Paladin's Charge",
    desc: '滑らかに加速し滑らかに停止。カメラ移動や王の歩みに。',
    color: '#c89b3c',
  },
  easeInBack: {
    fn: (t) => {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return c3 * t * t * t - c1 * t * t;
    },
    jp: 'バック (振り戻し)',
    en: 'Ease In Back',
    rpg: '呪文の予備動作',
    rpgEn: 'Spell Windup',
    desc: '一度後ろに引いてから前へ。溜め・予備動作の表現に最適。',
    color: '#9a5f2a',
  },
  easeOutBack: {
    fn: (t) => {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    },
    jp: 'バック (行き過ぎ)',
    en: 'Ease Out Back',
    rpg: '英雄の抜刀',
    rpgEn: "Hero's Draw",
    desc: '一度行き過ぎて戻る。剣の鞘抜きやメニュー出現に躍動感。',
    color: '#b8464d',
  },
  easeInOutBack: {
    fn: (t) => {
      const c1 = 1.70158;
      const c2 = c1 * 1.525;
      return t < 0.5
        ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
        : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
    },
    jp: 'バック (両端行き過ぎ)',
    en: 'Ease In-Out Back',
    rpg: '呪印の展開',
    rpgEn: 'Sigil Unfurl',
    desc: '両端でオーバーシュート。劇的な出現・消失のモーションに。',
    color: '#b85d9d',
  },
  easeOutElastic: {
    fn: (t) => {
      const c4 = (2 * Math.PI) / 3;
      if (t === 0) return 0;
      if (t === 1) return 1;
      return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    },
    jp: 'エラスティック (弾性)',
    en: 'Ease Out Elastic',
    rpg: 'スライムの震え',
    rpgEn: 'Slime Wobble',
    desc: 'バネのように震えて収束。宝箱オープンやゼリー系の敵に。',
    color: '#4a9d6e',
  },
  easeOutBounce: {
    fn: (t) => {
      const n1 = 7.5625;
      const d1 = 2.75;
      if (t < 1 / d1) return n1 * t * t;
      if (t < 2 / d1) {
        const x = t - 1.5 / d1;
        return n1 * x * x + 0.75;
      }
      if (t < 2.5 / d1) {
        const x = t - 2.25 / d1;
        return n1 * x * x + 0.9375;
      }
      const x = t - 2.625 / d1;
      return n1 * x * x + 0.984375;
    },
    jp: 'バウンス (跳ね返り)',
    en: 'Ease Out Bounce',
    rpg: '落下するポーション',
    rpgEn: 'Falling Potion',
    desc: '床で跳ね返る物理挙動。アイテム落下やコイン収集に。',
    color: '#c8862f',
  },
};

export const EASING_KEYS = Object.keys(EASINGS) as EasingKey[];

export const SIGILS: Record<EasingKey, string> = {
  linear: '⚑',
  easeInQuad: '✦',
  easeOutQuad: '➴',
  easeInOutQuad: '∿',
  easeInCubic: '☄',
  easeOutCubic: '➵',
  easeInOutCubic: '⚔',
  easeInBack: '⟲',
  easeOutBack: '⚔',
  easeInOutBack: '⇋',
  easeOutElastic: '❂',
  easeOutBounce: '◉',
};
