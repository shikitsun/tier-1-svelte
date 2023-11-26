<script>
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
  export let atEnd = false;

  let x = '0px';
  let y = '0px';
  let offsetX = 'var(--offset)';
  let offsetY = 'var(--offset)';
  let active = false;

  $: {
    // reset all properties
    x = '0px';
    y = '0px';
    offsetX = 'var(--offset)';
    offsetY = 'var(--offset)';
    const position = `${(length / 100) * value}px`;
    const oppositePosition = `${atEnd ? length : 0}px`;

    if (direction === 'horizontal') {
      x = position;
      y = oppositePosition;
      if (atEnd) {
        offsetY = '0px';
      }
    } else if (direction === 'vertical') {
      y = position;
      x = oppositePosition;
      if (atEnd) {
        offsetX = '0px';
      }
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
    let change = 0;
    if (direction === 'horizontal') {
      change = ev.movementX;
    } else if (direction === 'vertical') {
      change = ev.movementY;
    }
    // TODO round change & make less harsh on move
    value = Math.max(Math.min((value || 0) + change, 100), 0);
  }
</script>

<div
  on:mousedown={handleMouseDown}
  tabindex="-1"
  role="button"
  style:--x={x}
  style:--y={y}
  style:--offsetX={offsetX}
  style:--offsetY={offsetY}
  class:active
/>

<style>
  div {
    --default-size: 12px;
    --offset: 7px;
    --s: var(--size, var(--default-size));
    position: absolute;
    left: calc(var(--x) - var(--offsetX));
    top: calc(var(--y) - var(--offsetY));
    width: var(--s);
    height: var(--s);
    background-color: var(--bg, #333);
    border: var(--bw, 1px) solid var(--bc, #ccc);
    cursor: pointer;
  }

  div::after {
    content: '';
    display: block;
    width: var(--s);
    height: var(--s);
    background-color: #000;
    opacity: 0;
    transition-property: opacity;
    transition-duration: 150ms;
  }

  div:hover::after {
    opacity: 0.2;
  }

  .active::after {
    opacity: 0.25;
  }
</style>
