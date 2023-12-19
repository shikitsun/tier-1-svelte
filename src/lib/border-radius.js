/**
 * @typedef Radius
 * @property {number} main
 * @property {number} primary
 */

/**
 * @typedef Border
 * @property {Radius} topLeft
 * @property {Radius} topRight
 * @property {Radius} bottomLeft
 * @property {Radius} bottomRight
 */

const PART_SEPARATOR = '.';
const DEFAULT_SEPARATOR = '-';
/**
 * @type {Readonly<['topLeft', 'topRight', 'bottomLeft', 'bottomRight']>};
 */
const RADIUS_KEYS = Object.freeze(['topLeft', 'topRight', 'bottomLeft', 'bottomRight']);
export const BASE_BORDER = '0.100.0.100-100.0.100.0';
export const BASE_BORDER2 = '10.10.10.10-10.10.10.10';

/**
 * Creates empty radius
 * @returns {Radius}
 */
const createEmptyRadius = () => ({ main: 0, primary: 0 });
/**
 * Creates empty border
 * @returns {Border}
 */
export const createBorder = () =>
  // @ts-ignore
  RADIUS_KEYS.reduce((br, key) => ({ ...br, [key]: createEmptyRadius() }), {});

/**
 * Forms url part out of radius
 * @param {Radius[]} radiuses which use to form
 * @param {keyof Radius} key retrieve from `radius`
 * @param {string} [separator] between el
 * @param {string} [suffix] append to each radius
 * @returns radius in URL representation
 */
const formStringPart = (radiuses, key, separator = PART_SEPARATOR, suffix = '') =>
  radiuses.map((r) => `${r[key]}${suffix}`).join(separator);

/**
 * Form array of radiuses from `border`
 * @param {Border} border where retrieve radiuses
 * @returns {Radius[]} array of radiuses from `border`
 */
const formRadiuses = (border) => [
  border.topLeft,
  border.topRight,
  border.bottomRight,
  border.bottomLeft
];

/**
 * Forms url from provided border
 * @param {Border} border a border to form url from
 * @param {string} [separator] between parts of radiuses
 * @param {string} [partSeparator] between radiuses
 * @param {string} [suffix] append to each radius in part
 * @returns {string} url of border
 */
export const formString = (
  border,
  separator = DEFAULT_SEPARATOR,
  partSeparator = undefined,
  suffix = undefined
) => {
  const radiuses = formRadiuses(border);
  return `${formStringPart(radiuses, 'main', partSeparator, suffix)}${separator}${formStringPart(
    radiuses,
    'primary',
    partSeparator,
    suffix
  )}`;
};

/**
 * Parses part of url for radiuses
 * @param {string} radiuses part of radiuses
 * @param {string} separator between radiuses
 * @returns {number[]} parsed radiuses
 */
const parseStringPart = (radiuses, separator = PART_SEPARATOR) =>
  radiuses.split(separator).map(Number);

/**
 * Copy and fill radiuses for provided `border`
 * @param {Border} border what fill
 * @param {keyof Radius} key where to set value from `values`
 * @param {number[]} values radiuses
 * @returns {Border} filled border
 */
const fillBorderParts = (border, key, values) => {
  /**
   * deep copy of `border`
   * @type {typeof border}
   */
  const result = JSON.parse(JSON.stringify(border));
  for (let i = 0, l = values.length; i < l; i++) {
    result[RADIUS_KEYS[i]][key] = values[i] || 0;
  }
  return result;
};

/**
 * Parses provided `url` to border
 * @param {string} url what parse
 * @param {string} [separator] between parts
 * @returns {Border} parsed border
 */
export const parseString = (url, separator = DEFAULT_SEPARATOR) => {
  const parts = url.split(separator);
  /** @type {Border} */
  const border = createBorder();
  return fillBorderParts(
    fillBorderParts(border, 'main', parseStringPart(parts[0])),
    'primary',
    parseStringPart(parts[1])
  );
};
