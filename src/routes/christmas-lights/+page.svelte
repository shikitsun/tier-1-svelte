<script>
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

  let ropeWidth = 0;
  /**
   * saved colors by index
   * @type {{[key: string | number]: string}}
   */
  let colors = {};
  const defaultColors = Object.freeze(['#e63946', '#ffb700', '#4cc9f0', '#2ba84a']);

  $: bulbs = new Array(Math.round(ropeWidth / (elementWidth + bulbWidth * 1.25))).fill(null);

  /**
   * Get color for index `idx` or default
   * @param {number} idx index of element
   */
  function getColorOf(idx) {
    if (colors[idx]) return colors[idx];
    return defaultColors[idx % defaultColors.length];
  }

  /**
   * Get delay in `ms` for `idx`
   * @param {number} idx index element
   */
  function getDelayOf(idx) {
    return `${500 * (idx % Math.round(defaultColors.length / 2))}ms`;
  }
</script>

<main>
  <ul
    class="lightrope"
    bind:clientWidth={ropeWidth}
    style:--ropePartLength={ropePartLength + 'px'}
    style:--bulbWidth={bulbWidth + 'px'}
  >
    {#each bulbs as _, idx}
      <li style:--color={getColorOf(idx)} style:--delay={getDelayOf(idx)} />
    {/each}
  </ul>
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
    --rope-color: #222;
  }

  main {
    width: 100vw;
    height: 100vh;
  }

  .lightrope {
    --bw: var(--bulbWidth, 12px);
    all: unset;
    width: 100vw;
    display: flex;
    position: relative;
    justify-content: center;
  }

  .lightrope > * {
    all: unset;
    --glow-color: var(--color, #2ba84a);
    position: relative;
    width: var(--bw);
    height: var(--bw);
    border-radius: 50%;
    top: calc(var(--bw) / 2);
    background-color: var(--rope-color);
    margin-right: calc((var(--bw) + var(--ropePartLength, 16px)) * 0.6666666666666666);
    background-color: var(--color, #2ba84a);
  }

  .lightrope:not(.off) > * {
    animation: glow var(--duration, 1s) infinite;
    animation-delay: var(--delay, 0s);
  }

  .lightrope > *:last-child {
    margin-right: 0;
  }

  .lightrope > *:last-child::after {
    display: none;
  }

  .lightrope > ::before {
    --size: calc(var(--bw) / 4);
    content: '';
    position: absolute;
    height: var(--size);
    width: var(--size);
    border-radius: 2px;
    display: inline-block;
    background-color: var(--rope-color);
    left: calc(var(--size) * 1.5);
    top: calc(var(--size) * -1);
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
