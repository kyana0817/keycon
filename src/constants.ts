export const SUPPORT_KEYS = [
  {
    property: 'altKey',
    name: 'alt',
  },
  {
    property: 'ctrlKey',
    name: 'control',
  },
  {
    property: 'metaKey',
    name: 'control',
  },
  {
    property: 'shiftKey',
    name: 'shift',
  },
] as const

export const SUPPORT_NAMES = SUPPORT_KEYS.map((item) => item.name)
