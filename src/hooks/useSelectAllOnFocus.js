// First focus on a field selects the entire value, so typing replaces it
// immediately. A second click/tap on an already-focused field falls through
// to the browser's normal caret placement instead of re-selecting (onFocus
// only fires on the actual focus transition, not on later clicks).
//
// Naive `onFocus={e => e.target.select()}` gets overridden on the very
// click that caused the focus: the browser's own mouseup/touchend handler
// runs right after and collapses the selection to the click position. We
// can't preventDefault() that mouseup to stop it — on a number input's
// spin buttons, preventing the mouseup also blocks the browser's own
// "stop auto-repeating" handling, leaving the up/down arrows incrementing
// forever after a single click. Instead, re-assert the selection on the
// next animation frame, after the browser's own handling has already run,
// so the whole value ends up selected either way without blocking anything.
export function useSelectAllOnFocus() {
  return {
    onFocus: (e) => {
      const target = e.target
      target.select()
      requestAnimationFrame(() => target.select())
    },
  }
}
