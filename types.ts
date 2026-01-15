
export enum PoemMood {
  MAJESTIC = '庄严宏大',
  COZY = '温暖舒适',
  MELANCHOLY = '忧郁宁静',
  PURE = '纯洁晶莹',
}

export interface PoemConfig {
  mood: PoemMood;
  length: 'short' | 'medium' | 'long';
}
