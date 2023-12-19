<script>
  import { createBorder, formString, parseString } from '$lib/border-radius';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import BorderMovable from '$lib/components/BorderMovable.svelte';
  import { debounce } from '$lib';

  let border = parseString('0.100.100.0.0-100.0.0.100');
  let mounted = false;
  let overlayWidth = 0;
  let overlayHeight = 0;
  onMount(() => {
    const { hash } = window.location;
    mounted = true;
    if (!hash) return;
    border = parseString(hash.replace('#', '')) || border;
  });

  const update = debounce(
    /** @param {import('$lib/border-radius').Border} border */ (border) => {
      // no need use localStorage, because this is not production
      // but may replaced with it as well if needed
      window.location.hash = formString(border);
    },
    400
  );

  $: borderRadius = formString(border, ' / ', ' ', '%');
  // updates only if has browser and mounted later (to not override old)
  $: if (browser && mounted) {
    update(border);
  }
</script>

<main>
  <div class="app">
    <div class="fig" style:border-radius={borderRadius} />
    <div class="overlay" bind:clientWidth={overlayWidth} bind:clientHeight={overlayHeight}>
      <BorderMovable
        bind:value={border.topLeft.main}
        direction="horizontal"
        length={overlayWidth}
        on:change={({ detail }) => {
          border.topRight.main = 100 - detail;
        }}
      />

      <BorderMovable
        bind:value={border.topRight.primary}
        direction="vertical"
        length={overlayHeight}
        on:change={({ detail }) => {
          border.bottomRight.primary = 100 - detail;
        }}
        --baseX={overlayWidth + 'px'}
        --offsetX={5 + 'px'}
      />

      <BorderMovable
        bind:value={border.topLeft.primary}
        direction="vertical"
        length={overlayHeight}
        on:change={({ detail }) => {
          border.bottomLeft.primary = 100 - detail;
        }}
      />

      <BorderMovable
        bind:value={border.bottomLeft.main}
        direction="horizontal"
        length={overlayWidth}
        on:change={({ detail }) => {
          border.bottomRight.main = 100 - detail;
        }}
        --baseY={overlayHeight + 'px'}
        --offsetX={5 + 'px'}
      />
    </div>
  </div>

  <div class="style">
    <div class="label">border-radius:</div>
    <div class="input">
      <code class="code">{borderRadius}</code>
      <button class="btn">Copy</button>
    </div>
    <!-- custom size here -->
  </div>
</main>

<style>
  :global(body) {
    background-color: #0f0f0f;
    color: #bbb;
  }

  main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
  }

  .app {
    position: relative;
    isolation: isolate;
    --s: 400px;
    --width: var(--w, var(--s));
    --height: var(--h, var(--s));
  }

  .overlay {
    position: absolute;
    inset: -2px;
    border: 2px dashed #ccc;
    width: calc(var(--width) + 4px);
    height: calc(var(--height) + 4px);
    padding: 2px;
  }

  .fig {
    background-color: #22a5ee;
    width: var(--width);
    height: var(--height);
  }

  .style {
    display: grid;
    grid-template-areas: 'label input' 'label input';
    align-items: center;
    gap: 0.5rem;
  }

  .label {
    grid-area: 'label';
    font-size: 1rem;
    line-height: 1;
  }

  .input {
    grid-area: 'input';
    display: flex;
    align-items: center;
    font-size: 1rem;
    line-height: 1;
    --p: 6px;
    --br: 6px;
  }

  .code {
    padding: var(--p);
    border-top-left-radius: var(--br);
    border-bottom-left-radius: var(--br);
    background-color: #eee;
    color: #222;
    user-select: none;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--p);
    border-width: 0;
    line-height: 1;
    font-size: 1rem;
    text-align: inherit;
    border-top-right-radius: var(--br);
    border-bottom-right-radius: var(--br);
    background-color: #18e;

    transition-property: background-color;
    transition-duration: 150ms;
    color: white;
  }

  .btn:hover {
    background-color: #18ee;
  }

  .btn:active {
    background-color: #18ec;
  }
</style>
