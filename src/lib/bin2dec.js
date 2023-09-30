/**
 * Converts passed binary into decimal and returns it
 * @param {string} val binary value to convert into decimal
 * @returns {number} binary in decimal presentation
 */
export const toDecimal = (val) =>
  val
    .split('')
    .map(Number)
    .reverse()
    .reduce((acc, cur, idx) => acc + cur * Math.pow(2, idx), 0);

/**
 * Converts passed decimal into binary and returns it
 * @param {string} val decimal value to convert into binary
 * @returns {string} decimal in binary presentation
 */
export const toBinary = (val) => {
  if (!val) return val;
  let result = '';
  let curr = +val;
  while (curr) {
    result = `${curr & 1}${result}`;
    curr = curr >> 1;
  }
  return result;
};
