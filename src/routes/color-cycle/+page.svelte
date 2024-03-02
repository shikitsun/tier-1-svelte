<script>
  let value = '';
  let increments = { r: '', g: '', b: '' };
  let play = false;
  let interval = 250;
  /**
   * @type {NodeJS.Timeout | null}
   */
  let currentTimeout = null;
  $: current = value;
  $: if (!play) {
    if (currentTimeout) clearTimeout(currentTimeout);
  }

  /**
   * Increments `color` by `r`, `g`, `b`
   * @param {string} color
   * @param {string} r
   * @param {string} g
   * @param {string} b
   */
  function incrementColor(color, r, g, b) {
    const hex = parseInt(color.replace('#', ''), 16);
    return `${inc(hex >> 16, +r)}${inc(hex >> 8, +g)}${inc(hex, +b)}`;
  }

  /**
   * Increment color by value
   * @param {number} clr
   * @param {number} by
   */
  function inc(clr, by = 0) {
    return ((clr & 0xff) + by).toString(16).padStart(2, '0');
  }

  function run() {
    if (currentTimeout) clearTimeout(currentTimeout);
    if (!play) return;
    const increment = (/** @type {string} */ val) =>
      setTimeout(() => {
        const value = incrementColor(val, increments.r, increments.g, increments.b);
        if (current === value) {
          play = false;
          return;
        }
        current = value;
        currentTimeout = increment(value);
      }, interval);
    currentTimeout = increment(current);
  }

  const validHexReversed = /^[^\dabcdef]*$/g;

  /**
   * Validates element is valid hex
   * @param {string | number} component what validate
   * @returns {boolean} is valid hex
   */
  function validateHex(component) {
    const val = typeof component === 'number' ? component.toString(16) : component;
    return validHexReversed.test(val);
  }

  /**
   * @type {import("svelte/action").Action<HTMLInputElement>}
   */
  function validateHexInput(node) {
    /**
     * @this {HTMLInputElement}
     */
    function validate() {
      this.setCustomValidity(validateHex(this.value) ? 'Input custom hex value' : '');
    }
    node.addEventListener('input', validate);
    validate.call(node);

    return {
      destroy: () => {
        node.removeEventListener('input', validate);
      }
    };
  }

  /**
   * @type {import("svelte/action").Action<HTMLInputElement>}
   */
  function validateValueInput(node) {
    /**
     * @this {HTMLInputElement}
     */
    function validate() {
      this.setCustomValidity(
        this.value.length !== 3 && this.value.length !== 6 ? 'Value should be valid hex color' : ''
      );
    }
    node.addEventListener('input', validate);
    validate.call(node);

    return {
      destroy: () => {
        node.removeEventListener('input', validate);
      }
    };
  }
</script>

<main style:--color={`#${current}`}>
  <div class="form">
    <div class="field">
      <label for="color">#</label>
      <input
        id="color"
        class="color-input"
        bind:value
        maxlength="6"
        use:validateHexInput
        use:validateValueInput
      />
    </div>
    <fieldset>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="" />
      </svg>

      <legend>Increment</legend>
      <div class="field increment">
        <label for="r" class="color" style="--clr: #780000;" />
        <input
          id="r"
          class="increment-input"
          bind:value={increments.r}
          maxlength="2"
          use:validateHexInput
        />
      </div>
      <div class="field increment">
        <label for="g" class="color" style="--clr: #588157;" />
        <input
          id="g"
          class="increment-input"
          bind:value={increments.g}
          maxlength="2"
          use:validateHexInput
        />
      </div>
      <div class="field increment">
        <label for="b" class="color" style="--clr: #023e8a;" />
        <input
          id="b"
          class="increment-input"
          bind:value={increments.b}
          maxlength="2"
          use:validateHexInput
        />
      </div>
    </fieldset>
    <div class="field">
      <button
        class="play label"
        class:playing={play}
        on:click={() => {
          play = !play;
          run();
        }}
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="" />
        </svg>
      </button>
      <input disabled class="output" value={current} />
    </div>
  </div>
</main>

<style>
  main {
    display: flex;
    width: 100vw;
    height: 100vh;
    align-items: center;
    justify-content: center;
    background-color: var(--color);
  }

  .form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    background-color: #121212;
    padding: 1.5rem;
    border-radius: 0.5rem;
    border: 0.15rem solid #bbb;
  }

  .form .field {
    display: flex;
    align-items: center;
    font-size: 1.8rem;
    border-radius: 0.125rem;
    border: 1px solid #1d3557;
    background-color: #121212;
  }

  .form .field label,
  .form .field .label {
    padding: 0.25rem;
    border-right: 1px solid #1d3557;
    background-color: #1d355788;
  }

  .form .field input {
    all: unset;
    padding: 0.25rem;
  }

  .form .field:has(input:invalid) {
    border-color: #9b2226;
  }

  .form .field .color-input,
  .form .field .output {
    width: 6ch;
  }

  .form fieldset {
    display: flex;
    gap: 0.15rem;
    border-radius: 0.25rem;
    padding: 0.5rem;
  }

  .form .field.increment {
    font-size: 1rem;
  }

  .form .field .color {
    width: 0.2rem;
    height: 100%;
    background-color: var(--clr);
  }

  .form .field .increment-input {
    width: 2ch;
    padding: 0.2rem;
  }

  .form .play {
    all: unset;
    width: 1.15rem;
    padding: 0.15rem;
    cursor: pointer;
    transition: color 150ms;
  }

  .form .play path {
    transition: d 150ms;
  }

  .form .play:not(.playing) path {
    d: path(
      'M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z'
    );
  }

  .form .play.playing path {
    d: path('M6 18 18 6M6 6l12 12');
  }

  .form .play:hover {
    color: #ccce;
  }

  .form .play:active {
    color: #bbbb;
  }
</style>
