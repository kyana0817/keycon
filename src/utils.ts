type KeyboardEventListenerFn = (
  callback: (e: KeyboardEvent) => void
) => () => void

export const keyboardEventLitener: KeyboardEventListenerFn = (callback) => {
  document.addEventListener('keydown', callback)
  return () => {
    document.removeEventListener('keydown', callback)
  }
}
