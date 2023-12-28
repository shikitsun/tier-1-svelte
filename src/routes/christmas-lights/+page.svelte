<script context="module">
  export const onlyNumber = /\d*/;
  export const TOP = Symbol('top');
</script>

<script>
  // tl;dr many of these styles inspired by https://codepen.io/irfanezani_/pen/mdeLpKo, many thanks to author :)
  /**
   * In px for precise
   */
  const bulbWidth = 36;
  /**
   * In px for precise
   */
  const ropePartLength = bulbWidth * 0.4;
  /**
   * In px for precise
   */
  const elementWidth = ropePartLength + bulbWidth;

  /**
   * @typedef Bulb
   * @property {string} id identity of bulb (uuid4)
   * @property {number} size size of bulb (width x height in one value)
   * @property {string} color color of bulb (hex, rgb or rgba)
   */

  /**
   * @typedef {Row<Bulb>} BulbRow
   */

  /**
   * @typedef {Array<T> & {[TOP]: number}} Row
   * @template T
   */

  let ropeWidth = 0;

  /**
   * @type {BulbRow[]}
   */
  let allBulbs = [];

  let displayedRows = 7;

  // control values
  let isPlayed = true;
  /**
   * Intensity (animation interval) in seconds
   */
  let intensity = 1;

  const defaultColors = Object.freeze(['#e63946', '#ffb700', '#4cc9f0', '#2ba84a']);
  /**
   * How many elements
   */
  $: elementCount = defaultColors.length;

  /**
   * Creates element
   * @param {string[]} usedColors used colors to exclude from pick
   * @returns {Bulb}
   */
  const createElement = (usedColors) => {
    const colors = defaultColors.filter((color) => !usedColors.includes(color));
    return {
      color: colors[Math.round(Math.random() * colors.length - 1)],
      size: bulbWidth,
      id: crypto.randomUUID()
    };
  };

  /**
   * Gets bulbs from `all` according to `rows` & `width`
   * @param {BulbRow[]} all bulbs to take from
   * @param {number} rows how many bulbs rows take from `all`
   * @param {number} width how many bulbs in default size can contain retrieved width
   * @returns {BulbRow[]} bulbs to display
   */
  function getBulbsFrom(all, rows, width) {
    let topOffset = 0;
    /**
     * Bulbs rows
     * @type {BulbRow[]}
     */
    let result = [];
    for (let r = 0; r < rows; r++) {
      let heightMax = 0;
      const row =
        all[r] ||
        new Array(Math.round(width / (elementWidth + bulbWidth)))
          .fill(null)
          .map(() => createElement([]));
      if (!all[r]) {
        all[r] = row;
      }
      let rowWidth = 0;
      let i = 0;
      /**
       * @type {typeof row}
       */
      const newRow = /** @type {typeof row} */ (/** @type {unknown} */ ([]));
      while (width > rowWidth) {
        const element =
          row[i] ||
          createElement([all[r - 1] ? all[r - 1][i]?.color || '' : '', all[r][i - 1]?.color || '']);
        if (!row[i]) {
          all[r][i] = element;
        }
        newRow.push(element);
        rowWidth += element.size;
        heightMax = Math.max(element.size + element.size / 4 - 1);
        i++;
      }
      newRow[TOP] = topOffset;
      topOffset += heightMax;
      result.push(newRow);
    }
    return result;
  }

  $: bulbs = getBulbsFrom(allBulbs, displayedRows, ropeWidth - (ropeWidth / 100) * 60);

  /**
   * Get delay in `ms` for `idx`
   * @param {number} idx index element
   */
  function getDelayOf(idx) {
    return `${500 * (idx % Math.round(elementCount))}ms`;
  }

  /**
   * Sync animation between same-based intervals
   * @type {import("svelte/action").Action<HTMLLIElement, {animName?: string}>}
   */
  function syncAnimation(node, { animName = 'glow' }) {
    /**
     * @type {Animation | undefined} current animation
     */
    let animation;
    /**
     * Finds animation in `animations`
     * @param {Animation[] | undefined} animations
     * @param {string} name
     */
    const findAnimation = (animations, name) =>
      (animations || []).find(
        (anim) =>
          /** @type {any} */ (anim)['animationName'] &&
          /** @type {any} */ (anim)['animationName'].includes(name)
      );
    /**
     * Search for animation container with same idx base
     * @param {string} name animation name
     */
    const seek = (name) =>
      findAnimation(
        node.parentElement?.querySelector(`[data-color^="${node.dataset.color}"]`)?.getAnimations(),
        name
      );

    /**
     * Syncs `node` animation with animation
     * @param {Animation | undefined} anim external animation to sync with
     */
    const sync = (anim) => {
      if (!animation || !anim) return;
      animation.startTime = anim.startTime;
    };

    /**
     * @param {AnimationEvent} ev
     */
    function handleAnimationStart(ev) {
      if (
        ev.animationName.includes(animName) &&
        ev.target &&
        ev.target instanceof HTMLElement &&
        ev.target.dataset.color === node.dataset.color
      ) {
        animation = findAnimation(node.getAnimations(), animName);
        sync(seek(animName));
      }
    }

    // can also handle cancel, but it's enough
    node.addEventListener('animationstart', handleAnimationStart);

    sync(seek(animName));

    return {
      update: ({ animName = 'glow' }) => {
        sync(seek(animName));
      },
      destroy: () => {
        // unbind event listener
        node.removeEventListener('animationstart', handleAnimationStart);
      }
    };
  }

  /**
   * Updates certain bulb
   * @param {number} row where update
   * @param {number} idx which update
   * @param {Partial<Bulb>} data what update
   */
  function updateBulb(row, idx, data) {
    allBulbs = [...allBulbs];
    allBulbs[row].splice(idx, 1, { ...allBulbs[row][idx], ...data });
  }
</script>

<main bind:clientWidth={ropeWidth}>
  {#each bulbs as rows, idx}
    <ul
      class="lightrope"
      style:--offset={rows[TOP] + 'px'}
      style:--ropePartLength={ropePartLength + 'px'}
      class:off={!isPlayed}
    >
      {#each rows as bulb, ridx (bulb.id)}
        <li
          style:--color={bulb.color}
          style:--bw={bulb.size + 'px'}
          style:--delay={getDelayOf(ridx)}
          style:--duration={`${intensity}s`}
          data-color={bulb.color}
          use:syncAnimation={{}}
        />
      {/each}
    </ul>
  {/each}

  <div class="controls">
    <h2 class="title">Christmas lights</h2>

    <div class="form-container">
      <form class="form">
        <input type="checkbox" bind:checked={isPlayed} />
        <div class="intensity">
          <input
            type="number"
            value={intensity ?? 0}
            on:input|preventDefault={(ev) => {
              if (ev.target && ev.target instanceof HTMLInputElement) {
                // if test failed (false)
                if (!onlyNumber.test(ev.target.value)) {
                  // do not update value
                  ev.target.value = `${intensity || ''}`;
                }
                intensity = +ev.target.value;
              }
            }}
          />
          <span>s</span>
        </div>
      </form>
    </div>
  </div>
</main>

<style>
  :global(body) {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    background-color: #121212;
    color: #edede9ee;
    min-width: 100vw;
    min-height: 100vh;
    padding: 0;
    --rope-color: #333d;
  }

  main {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }

  .lightrope {
    all: unset;
    position: fixed;
    width: 100vw;
    display: flex;
    justify-content: center;
    top: var(--offset, 0);
  }

  .lightrope > * {
    all: unset;
    --glow-color: var(--color, #2ba84a);
    --top-size: calc(var(--bw) / 4);
    --top-radius: 2px;
    --base-delay: 500ms;
    position: relative;
    width: var(--bw);
    height: var(--bw);
    border-radius: 50%;
    top: calc(var(--bw) / 5);
    min-width: var(--bw);
    background-color: var(--rope-color);
    margin-right: calc((var(--bw) + var(--ropePartLength, 16px)) * 0.6666666666666666);
    background-color: #003049;
    transition: background-color var(--base-delay) linear;
    z-index: 1;
  }

  .lightrope:not(.off) > * {
    background-color: var(--color, #2ba84a);
    animation: glow var(--duration, 1s) infinite;
    animation-delay: calc(var(--delay, 0s) + var(--base-delay));
  }

  .lightrope > *:last-child {
    margin-right: 0;
  }

  .lightrope > *:last-child::after {
    display: none;
  }

  .lightrope > ::before {
    content: '';
    position: absolute;
    height: var(--top-size);
    width: var(--top-size);
    border-radius: var(--top-radius);
    display: inline-block;
    background-color: var(--rope-color);
    left: calc(var(--top-size) * 1.5);
    top: calc(var(--top-size) * -1 + var(--top-radius));
    z-index: -1;
  }

  .lightrope > ::after {
    content: '';
    display: inline-block;
    position: absolute;
    top: calc(var(--bw) / 5 * -1);
    left: calc(var(--bw) - var(--bw) / 5);
    width: calc((var(--bw) + var(--ropePartLength, 16px)));
    height: calc(var(--bw) / 2);
    border-bottom: calc(var(--bw) / 10) solid var(--rope-color);
    border-radius: 50%;
    z-index: -1;
  }

  .controls {
    position: relative;
    display: flex;
    flex-direction: column;
    align-content: center;
    width: 100%;
    z-index: 1;
  }

  .controls .title {
    color: white;
    font-size: min(11vw, max(2rem, 2vw));
    text-align: center;
    text-shadow: 0px 0px 30px white;
  }

  .controls .form-container {
    display: flex;
    justify-content: center;
  }

  .controls .form {
    display: flex;
    justify-content: space-between;
    align-items: center;
    column-gap: 1.5rem;
  }

  .controls .form [type='checkbox'] {
    all: unset;
    position: relative;
    --width: 4rem;
    --height: 2rem;
    /* off by default */
    --state: 0;
    width: var(--width);
    height: var(--height);
    cursor: pointer;
  }

  .controls .form [type='checkbox']:checked {
    --state: 1;
  }

  .controls .form [type='checkbox'],
  .controls .form [type='checkbox']::before {
    background-color: #5a189a3a;
    border-radius: 0.25rem;
    border: 0.025rem solid #5a189aaa;
  }

  .controls .form [type='checkbox']::before {
    content: '';
    position: absolute;
    inset: 0;
    top: -1.05%;
    transform: scale(0.8) translateX(calc(var(--width) / 2 * var(--state) / 0.82));
    width: calc(var(--width) / 2);
    height: var(--height);
    transition: transform 150ms linear, background-color 150ms linear;
  }

  .controls .form [type='checkbox']:checked::before {
    background-color: #5a189aaa;
  }

  .controls .form .intensity {
    display: flex;
  }

  .controls .form .intensity input {
    all: unset;
    appearance: textField;
    width: calc(5ch + 0.25rem * 2);
    height: 1.25rem;
    text-align: end;
    font-size: 1rem;
    background-color: #003049cc;
    border-radius: 0.25rem;
    padding: 0.25rem;
    border-start-end-radius: 0;
    border-end-end-radius: 0;
    border: 0.01rem solid #003049ff;
  }

  .controls .form .intensity span {
    font-size: 1rem;
    opacity: 0.6;
    user-select: none;
    padding: 0.25rem 0.5rem;
    text-transform: lowercase;
    background-color: #5a189aa2;
    border-start-end-radius: 0.25rem;
    border-end-end-radius: 0.25rem;
    border: 0.01rem solid #5a189aff;
  }

  @keyframes glow {
    0%,
    100% {
      box-shadow: 0 0 calc(var(--bw) / 2.5) calc(var(--bw) / 10) var(--glow-color);
    }
    50% {
      box-shadow: none;
    }
  }
</style>
