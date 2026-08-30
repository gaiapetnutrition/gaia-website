import { useRef } from 'react'

// First focus on a field selects the entire value, so typing replaces it
// immediately. A second click/tap on an already-focused field falls through
// to the browser's normal caret placement instead of re-selecting.
//
// Naive `onFocus={e => e.target.select()}` gets overridden on the very
// click that caused the focus: the browser's own mouseup/touchend handler
// runs right after and collapses the selection to the click position. This
// arms a flag in onFocus and consumes it in the following onMouseUp via
// preventDefault, so the selection survives that first click but any
// later click behaves normally.
export function useSelectAllOnFocus() {
  const justFocused = useRef(false)

  return {
    onFocus: (e) => {
      justFocused.current = true
      e.target.select()
    },
    onMouseUp: (e) => {
      if (!justFocused.current) return
      justFocused.current = false
      e.preventDefault()
    },
    onBlur: () => {
      justFocused.current = false
    },
  }
}
