<script>
  /**
   * @type {string | null}
   */
  let value = null;
  /**
   * Last value of calc execution
   * @type {number | null}
   */
  let last = null;
  /**
   * Last used function
   * @type {string | null}
   */
  let lastUsed = null;
  const pattern = '^(\\+|-)?([\\d]+(\\.[\\d]*)?(e?-?[\\d]*)?)?$';
  const fullPattern = '^(\\+|-)?([\\d]+(\\.[\\d]*)?(e-?[\\d]+)?)?$';
  const patternRegExp = new RegExp(pattern);
  const fullPatternRegExp = new RegExp(fullPattern);

  $: valid = fullPatternRegExp.test(value || '');

  /**
   * Factory for add-to-end
   * @param {number | string} suffix what add to end
   * @returns {(value: number | string) => number}
   */
  const createAddToEnd = (suffix) => (value) => +`${value || ''}${suffix}`;
  /**
   * Wraps function and after call `fn` write `key` to `lastUsed`
   * @param {string} key
   * @param {T} fn
   * @template {Function} T
   */
  const writeToLast =
    (key, fn) =>
    (/** @type {Parameters<typeof fn>} */ ...args) => {
      lastUsed = key;
      return fn(...args);
    };
  /**
   * Where need at least 2 args, set value to last & empty value
   * If last is exists, do `fn`
   * @param {T} fn
   * @template {OperationFn} T
   */
  const waitForLast = (fn) => (/** @type {number} */ value, /** @type {number | null} */ prev) => {
    if (!prev) {
      last = value;
      return null;
    }
    return fn(value, prev);
  };

  /**
   * @callback OperationFn
   * @param {number} value
   * @param {number} by
   * @returns {number | null}
   */

  const fns = Object.freeze({
    /**
     * Clears current value
     */
    c: () => null,
    /**
     * Negate value
     * if it has - sign, then it will be -(-value) -> value
     * @param {number} value
     */
    '+/-': (value) => -value,
    /**
     * get's percent of value
     */
    '%': writeToLast('%', (/** @type {number} */ value) => value / 100),
    /**
     * Divide `value` by `by`
     */
    '/': writeToLast(
      '/',
      waitForLast(
        /** @type {OperationFn} */ (value, by) => {
          // if it can't be divided, return 0
          if (!by) return 0;
          return value / by;
        }
      )
    ),
    '7': createAddToEnd(7),
    '8': createAddToEnd(8),
    '9': createAddToEnd(9),
    /**
     * Multiply `value` by `by`
     */
    x: writeToLast(
      'x',
      waitForLast(/** @type {OperationFn} */ (value, by = 0) => value * by)
    ),
    '4': createAddToEnd(4),
    '5': createAddToEnd(5),
    '6': createAddToEnd(6),
    /**
     * Minus `by` from `value`
     */
    '-': writeToLast(
      '-',
      waitForLast(/** @type {OperationFn} */ (value, by = 0) => value - by)
    ),
    '1': createAddToEnd(1),
    '2': createAddToEnd(2),
    '3': createAddToEnd(3),
    /**
     * Adds `by` to `value`
     */
    '+': writeToLast(
      '+',
      waitForLast(/** @type {OperationFn} */ (value, by = 0) => value + by)
    ),
    /** reset last number & value */
    ac: function () {
      // clear last
      last = null;
      lastUsed = null;
      return this.c();
    },
    '0': createAddToEnd(0),
    '.': createAddToEnd('.'),
    /**
     * Repeat last operation
     * @type {OperationFn}
     */
    '=': (value, last) =>
      // @ts-ignore value & last
      lastUsed ? fns[/** @type {keyof typeof fns} */ (lastUsed)](value, last) : +value
  });
  const grid = [
    'c',
    '+/-',
    '%',
    '/',
    '7',
    '8',
    '9',
    'x',
    '4',
    '5',
    '6',
    '-',
    '1',
    '2',
    '3',
    '+',
    'ac',
    '0',
    '.',
    '='
  ];
</script>

<main>
  <input
    type="text"
    pattern={fullPattern}
    on:input|preventDefault={(ev) => {
      if (ev.target && ev.target instanceof HTMLInputElement) {
        // if test failed (false)
        if (!patternRegExp.test(ev.target.value)) {
          // do not update value
          ev.target.value = `${value || ''}`;
        }
        value = ev.target.value;
      }
    }}
    {value}
  />
  <div class="pad">
    {#each grid as key (key)}
      <button
        class:highlight={Number.isNaN(+key) && key !== '.'}
        disabled={!valid && Number.isNaN(+key) && key !== '.'}
        on:click={() =>
          (value = fns[/** @type {keyof typeof fns} */ (key)](
            /** @type {never} */ (+(value || '')),
            /** @type {never} */ (last)
          ))}>{key}</button
      >
    {/each}
  </div>
</main>

<style>
  :global(body) {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #121212;
    color: #edede9ee;
    min-width: 100vw;
    min-height: 100vh;
    padding: 0;
    --bg: 20, 33, 61;
  }

  main {
    display: flex;
    align-items: center;
    flex-direction: column;
    background-color: rgba(var(--bg), 0.533);
    border: 1px solid rgba(var(--bg), 1);
    border-radius: 0.75rem;
    max-width: min(50ch, calc(100vh - 1.75rem));
    max-height: min(100vh - 1.75rem, 45rem);
    padding: 2rem;
    row-gap: 1.5rem;
    height: fit-content;
    width: fit-content;
  }

  input {
    all: unset;
    appearance: textfield;
    font-size: 2.5rem;
    width: 100%;
    line-height: 1;
    height: 2ch;
    border-radius: 12px;
    border: 2px solid rgba(var(--bg), 0.933);
    padding: 12px;
    background-color: rgba(var(--bg), 0.677);
    transition-property: border-color;
    transition-duration: 150ms;
    text-align: end;
  }

  input:invalid {
    border-color: #d90429;
  }

  .pad {
    --p: 0.5rem;
    --s: 4rem;
    --fs: 2.5rem;
    display: grid;
    grid-template-columns: repeat(4, calc(var(--s) + var(--p) * 2));
    gap: 0.5rem;
    justify-content: space-between;
    align-content: space-between;
    width: 100%;
    height: 100%;
  }

  .pad button {
    all: unset;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: var(--fs);
    padding: var(--p);
    background-color: rgba(var(--bg), 0.4);
    border-radius: 100%;
    width: var(--s);
    height: var(--s);

    transition-property: background-color opacity;
    transition-duration: 150ms;
    user-select: none;
    cursor: pointer;
    text-transform: uppercase;
    font-family: 'Courier New', Courier, monospace;
  }

  .pad button.highlight {
    color: #e36414;
  }

  .pad button:hover {
    background-color: rgba(var(--bg), 0.65);
  }

  .pad button:active {
    background-color: rgba(var(--bg), 1);
  }

  .pad button:disabled {
    opacity: 0.6;
  }

  @media (max-width: 600px) {
    :global(body) {
      padding: 2rem !important;
      align-items: flex-start;
    }

    .pad {
      --fs: 1.5rem;
      --p: 0.25rem;
      --s: 3rem;
    }
  }
</style>
