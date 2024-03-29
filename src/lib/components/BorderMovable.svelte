<script>
  import { createEventDispatcher } from 'svelte';

  /**
   * Current value of radius
   * @type {number}
   */
  export let value;
  /**
   * @type {'horizontal' | 'vertical'}
   */
  export let direction;
  /**
   * Available length for calculate radius position
   * @type {number}
   */
  export let length;
  /**
   * controls where movable should be positioned in opposite axis
   * @type {Boolean}
   */
  export let reverse = false;

  /**
   * @type {import('svelte').EventDispatcher<{change: number}>}
   */
  const dispatch = createEventDispatcher();

  let x = '0px';
  let y = '0px';
  let active = false;

  $: scale = length / 100;
  $: reverseFactor = reverse ? -1 : 1;
  $: /** @type {'X' | 'Y'} */
  movementKey = direction === 'horizontal' ? 'X' : 'Y';

  $: {
    // reset all properties
    x = '0px';
    y = '0px';
    const position = `${(length / 100) * value}px`;

    if (direction === 'horizontal') {
      x = position;
    } else if (direction === 'vertical') {
      y = position;
    }
  }

  function handleMouseDown() {
    document.addEventListener('mousemove', handleMouseMove);
    active = true;
    document.addEventListener(
      'mouseup',
      () => {
        document.removeEventListener('mousemove', handleMouseMove);
        active = false;
      },
      { once: true }
    );
  }

  /**
   * @param {MouseEvent} ev
   */
  function handleMouseMove(ev) {
    const change = Math.round(ev[`movement${movementKey}`] / scale) * reverseFactor;
    value = Math.max(Math.min((value || 0) + change, 100), 0);
  }

  /**
   * Fires on change with new value
   * @param {number} val new value
   */
  const onChange = (val) => dispatch('change', val);

  $: onChange(value);
</script>

<div
  on:mousedown={handleMouseDown}
  tabindex="-1"
  role="button"
  style:--x={x}
  style:--y={y}
  style:--reverse={reverseFactor}
  class:active
/>

<style>
  div {
    --default-size: 12px;
    --offset: 7px;
    --s: var(--size, var(--default-size));
    position: absolute;
    left: calc(
      var(--baseX, 0px) + (var(--x) * var(--reverse, 1)) - var(--offsetX, var(--offset, 7px))
    );
    top: calc(
      var(--baseY, 0px) + (var(--y) * var(--reverse, 1)) - var(--offsetY, var(--offset, 7px))
    );
    width: var(--s);
    height: var(--s);
    background-color: var(--bg, #333);
    border: var(--bw, 1px) solid var(--bc, #ccc);
    cursor: pointer;
    transition-property: background-color border-color;
    transition-duration: 150ms;
  }

  div:hover {
    background-color: #18ee;
    border-color: #333;
  }

  div::after {
    content: '';
    position: absolute;
    display: block;
    width: var(--s);
    height: var(--s);
    background-color: #ccc;
    opacity: 0;
    transition-property: opacity transform;
    transition-duration: 150ms;
  }

  div:hover::after {
    opacity: 0.2;
    transform: scale(2);
  }

  div:active {
    background-color: #18ef;
    border-color: #333;
  }

  div:active::after {
    opacity: 0.4;
    transform: scale(2.1);
  }

  .active::after {
    opacity: 0.25;
  }
</style>
