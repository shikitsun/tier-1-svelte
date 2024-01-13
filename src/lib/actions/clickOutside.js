/**
 * @type {import("svelte/action").Action<HTMLElement, undefined, { 'on:clickOutside': (e: CustomEvent<HTMLElement>) => void }>}
 */
export function clickOutside(node) {
  /**
   * Detects click is outside or not
   * If that, fires clickOutside event
   * @param {MouseEvent} ev event
   */
  function detect({ target }) {
    if (target instanceof HTMLElement && !node.contains(target)) {
      node.dispatchEvent(new CustomEvent('clickOutside', { detail: node }));
    }
  }
  document.addEventListener('click', detect, { passive: true, capture: true });

  return {
    destroy() {
      document.removeEventListener('click', detect);
    }
  };
}
