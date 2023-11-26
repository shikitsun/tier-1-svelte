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
const RADIUSES_KEYS = Object.freeze(['topLeft', 'topRight', 'bottomLeft', 'bottomRight']);

/**
 * Creates empty radius
 * @returns {Radius}
 */
const createEmptyRadius = () => ({ main: 0, primary: 0 });
/**
 * Creates empty border
 * @returns {Border}
 */
const createBorder = () =>
  // @ts-ignore
  RADIUSES_KEYS.reduce((key, curr) => ({ ...curr, [key]: createEmptyRadius() }), {});

/**
 * Forms url part out of radius
 * @param {Radius[]} radiuses which use to form
 * @param {keyof Radius} key retrieve from `radius`
 * @param {string} [separator] between el
 * @returns radius in URL representation
 */
const formURLPart = (radiuses, key, separator = PART_SEPARATOR) =>
  radiuses.map((r) => r[key]).join(separator);

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
 * @param {string} [separator] between radiuses
 * @returns {string} url of border
 */
const formURL = (border, separator = DEFAULT_SEPARATOR) => {
  const radiuses = formRadiuses(border);
  return `${formURLPart(radiuses, 'main')}${separator}${formURLPart(radiuses, 'primary')}`;
};

/**
 * Parses part of url for radiuses
 * @param {string} radiuses part of radiuses
 * @param {string} separator between radiuses
 * @returns {number[]} parsed radiuses
 */
const parseURLPart = (radiuses, separator = PART_SEPARATOR) =>
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
  let i = 0;
  for (const radius of Object.values(result)) {
    radius[key] = values[i];
    i++;
  }
  return result;
};

/**
 * Parses provided `url` to border
 * @param {string} url what parse
 * @param {string} [separator] between parts
 * @returns {Border} parsed border
 */
const parseURL = (url, separator = DEFAULT_SEPARATOR) => {
  const parts = url.split(separator);
  /** @type {Border} */
  const border = createBorder();
  return fillBorderParts(
    fillBorderParts(border, 'main', parseURLPart(parts[0])),
    'primary',
    parseURLPart(parts[1])
  );
};
