const freeze = Object.freeze

// Popover 等 trigger 选项值
export const TRIGGER = freeze({
  CLICK: 'click',
  FOCUS: 'focus',
  HOVER: 'hover',
  MANUAL: 'manual'
})
export const TRIGGERS = freeze(Object.values(TRIGGER))

export const SIZE = freeze({
  MEDIUM: 'medium',
  SMALL: 'small',
  MINI: 'mini'
})
export const SIZES = freeze(Object.values(SIZE))

export const PLACEMENT = freeze({
  TOP: 'top',
  TOP_START: 'top-start',
  TOP_END: 'top-end',
  BOTTOM: 'bottom',
  BOTTOM_START: 'bottom-start',
  BOTTOM_END: 'bottom-end',
  LEFT: 'left',
  LEFT_START: 'left-start',
  LEFT_END: 'left-end',
  RIGHT: 'right',
  RIGHT_START: 'right-start',
  RIGHT_END: 'right-end'
})
export const PLACEMENTS = freeze(Object.values(PLACEMENT))

export const EFFECT = freeze({
  DARK: 'dark',
  LIGHT: 'light'
})
export const EFFECTS = freeze(Object.values(EFFECT))

export const MESSAGE_TYPE = freeze({
  SUCCESS: 'success',
  WARNING: 'warning',
  INFO: 'info',
  ERROR: 'error'
})
export const MESSAGE_TYPES = freeze(Object.values(MESSAGE_TYPE))
