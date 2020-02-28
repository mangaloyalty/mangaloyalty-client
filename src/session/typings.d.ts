export const enum DirectionType {
  Up = 'up',
  Right = 'right',
  Down = 'down',
  Left = 'left'
}

export const enum PageSize {
  None = 0,
  Paperback = 1 / 112 * 176,
  Digest = 1 / 140 * 210,
  Pocket = 1 / 105 * 152,
  JapaneseB6 = 1 / 128 * 182,
  ISOA5 = 1 / 148 * 210
}

export type INavigationEvent =
  {type: 'Keyboard', direction: DirectionType} |
  {type: 'Swipe', direction: DirectionType} |
  {type: 'Tap', direction: DirectionType};
