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
    }

    if (direction === 'vertical') {
      y = position;
      x = oppositePosition;
      if (atEnd) {
        offsetX = '0px';
      }
    }
  }
</script>

<div style:--x={x} style:--y={y} style:--offsetX={offsetX} style:--offsetY={offsetY} />

<style>
  div {
    --default-size: 12px;
    --offset: 7px;
    position: absolute;
    left: calc(var(--x) - var(--offsetX));
    top: calc(var(--y) - var(--offsetY));
    width: var(--size, var(--default-size));
    height: var(--size, var(--default-size));
    background-color: var(--bg, #333);
    border: var(--bw, 1px) solid var(--bc, #ccc);
  }
</style>
