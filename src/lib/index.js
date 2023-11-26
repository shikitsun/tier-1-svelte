// place files you want to import through the `$lib` alias in this folder.
/**
 * Create debounced function for `fn`
 * @param {T} fn function to debounce for
 * @param {number} [time] how long debounce
 * @template {Function} T
 * @returns {(...args: any) => void} debounced FN
 */
export const debounce = (fn, time = 750) => {
  /**
   * @type {NodeJS.Timeout}
   */
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, time);
  };
};
