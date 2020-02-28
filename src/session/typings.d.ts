export const enum DirectionType {
  Up = 0,
  Right = 1,
  Down = 2,
  Left = 3
}

export const enum PageSize {
  None = 0,
  Paperback = 1 / 112 * 176,
  Digest = 1 / 140 * 210,
  Pocket = 1 / 105 * 152,
  JapaneseB6 = 1 / 128 * 182,
  ISOA5 = 1 / 148 * 210
}

export type ITouchEvent =
  {type: 'Swipe', direction: DirectionType} |
  {type: 'Tap', direction: DirectionType};
