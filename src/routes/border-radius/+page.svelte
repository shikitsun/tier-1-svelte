<script>
  import { BASE_BORDER, BASE_BORDER2, formString, parseString } from '$lib/border-radius';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import BorderMovable from '$lib/components/BorderMovable.svelte';
  import { debounce } from '$lib';

  let border = parseString(BASE_BORDER);
  let mounted = false;
  let overlayWidth = 0;
  let overlayHeight = 0;
  let fullControl = false;
  let copyStatus = '';

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

  /**
   *
   * @param {Event} ev
   */
  function checkBorder(ev) {
    const { checked } = /** @type {HTMLInputElement} */ (ev.target);
    const borderStr = formString(border);
    if (checked && borderStr === BASE_BORDER) border = parseString(BASE_BORDER2);
    else if (!checked && borderStr === BASE_BORDER2) border = parseString(BASE_BORDER);
    if (!checked) {
      border.topRight.main = 100 - border.topLeft.main;
      border.bottomLeft.primary = 100 - border.topRight.primary;
      border.bottomRight.primary = 100 - border.topLeft.primary;
      border.bottomRight.main = 100 - border.bottomLeft.main;
    }
  }

  function copy() {
    if (navigator.clipboard) {
      try {
        navigator.clipboard.writeText(formString(border));
        copyStatus = 'Copied to clipboard';
      } catch {
        copyStatus = 'Failed copy to clipboard';
      }
    } else {
      copyStatus = "Can't copy to clipboard";
    }
  }

  /**
   * Simple version of tooltip
   * @type {import('svelte/action').Action<HTMLDivElement, {text: string, duration: number}, {'on:hide': (e: CustomEvent) => void}>}
   */
  function tooltip(node, { text, duration }) {
    /**
     * @type {NodeJS.Timeout | undefined}
     */
    let timeout;

    const hide = () => {
      node.style.opacity = '0';
      clearTimeout(timeout);
    };
    /**
     * Show node
     * @param {number} duration
     */
    const show = (duration) => {
      node.style.opacity = '1';
      timeout = setTimeout(() => {
        hide();
        node.dispatchEvent(new CustomEvent('hide'));
      }, duration);
    };

    /**
     * Toggles vision depend on text
     * @param {string} text
     * @param {number} duration
     */
    const toggle = (text, duration) => {
      clearTimeout(timeout);
      if (!text) hide();
      else {
        node.innerText = text;
        show(duration);
      }
    };

    toggle(text, duration);

    return {
      update: ({ text, duration }) => {
        toggle(text, duration);
      }
    };
  }
</script>

<main>
  <div class="app">
    <div class="fig" style:border-radius={borderRadius} />
    <div class="overlay" bind:clientWidth={overlayWidth} bind:clientHeight={overlayHeight}>
      {#if fullControl}
        <BorderMovable
          bind:value={border.topLeft.main}
          direction="horizontal"
          length={overlayWidth}
        />

        <BorderMovable
          bind:value={border.topLeft.primary}
          direction="vertical"
          length={overlayHeight}
        />

        <BorderMovable
          bind:value={border.topRight.main}
          direction="horizontal"
          length={overlayWidth}
          reverse
          --baseX={overlayWidth + 'px'}
          --offsetX={'5px'}
        />

        <BorderMovable
          bind:value={border.topRight.primary}
          direction="vertical"
          length={overlayHeight}
          --baseX={overlayWidth + 'px'}
          --offsetX={'5px'}
        />

        <BorderMovable
          bind:value={border.bottomLeft.main}
          direction="horizontal"
          length={overlayWidth}
          reverse
          --baseX={overlayWidth + 'px'}
          --baseY={overlayHeight + 'px'}
          --offsetX={'5px'}
        />

        <BorderMovable
          bind:value={border.bottomLeft.primary}
          direction="vertical"
          length={overlayHeight}
          reverse
          --baseX={overlayWidth + 'px'}
          --baseY={overlayHeight + 'px'}
          --offsetX={'5px'}
        />

        <BorderMovable
          bind:value={border.bottomRight.main}
          direction="horizontal"
          length={overlayWidth}
          --baseY={overlayHeight + 'px'}
        />

        <BorderMovable
          bind:value={border.bottomRight.primary}
          direction="vertical"
          length={overlayHeight}
          reverse
          --baseY={overlayHeight + 'px'}
        />
      {:else}
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
            border.bottomLeft.primary = 100 - detail;
          }}
          --baseX={overlayWidth + 'px'}
          --offsetX={5 + 'px'}
        />

        <BorderMovable
          bind:value={border.topLeft.primary}
          direction="vertical"
          length={overlayHeight}
          on:change={({ detail }) => {
            border.bottomRight.primary = 100 - detail;
          }}
        />

        <BorderMovable
          bind:value={border.bottomLeft.main}
          direction="horizontal"
          length={overlayWidth}
          reverse
          on:change={({ detail }) => {
            border.bottomRight.main = 100 - detail;
          }}
          --baseY={overlayHeight + 'px'}
          --baseX={overlayWidth + 'px'}
          --offsetX={5 + 'px'}
        />
      {/if}
    </div>
  </div>

  <div class="footer">
    <div class="row">
      <div class="input">
        <input
          value={borderRadius}
          class="code"
          disabled
          readonly
          style:width={`calc(${borderRadius.length + 'ch'} + var(--p) * 2)`}
          id="borderRadiusOut"
        />
        <button class="btn" style="cursor: copy" on:click={copy}>Copy</button>
      </div>
    </div>

    <div class="row" style="justify-content: space-between; width: 100%;">
      <div class="row">
        <label class="label" for="fullControl">Full Control</label>
        <input
          bind:checked={fullControl}
          class="switch"
          id="fullControl"
          type="checkbox"
          on:change={checkBorder}
        />
      </div>
      <button
        class="btn"
        style="border-radius: 6px"
        on:click={() =>
          (border = fullControl ? parseString(BASE_BORDER2) : parseString(BASE_BORDER))}
        >Reset</button
      >
    </div>
  </div>

  <div
    class="copy-notify"
    use:tooltip={{ text: copyStatus, duration: 2000 }}
    on:hide={() => (copyStatus = '')}
  />
</main>

<style>
  :global(body) {
    background-color: #121212;
    color: #bbb;
  }

  main {
    position: relative;
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
    background: linear-gradient(60deg, #2a9d8f, #22a5ee);
    width: var(--width);
    height: var(--height);
  }

  .footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .label {
    grid-area: 'label';
    font-size: 1rem;
    line-height: 1;
  }

  .input {
    display: flex;
    align-items: stretch;
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
    font-family: 'Courier New', Courier, monospace;
    border: none;
    font-size: 1rem;
    line-height: 1;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--p, 6px);
    border-width: 0;
    line-height: 1;
    font-size: 1rem;
    text-align: inherit;
    border-top-right-radius: var(--br, 6px);
    border-bottom-right-radius: var(--br, 6px);
    background-color: #18e;

    transition-property: background-color;
    transition-duration: 150ms;
    color: white;
    text-transform: uppercase;
    font-weight: 600;
    cursor: pointer;
  }

  .switch {
    --val: 0;
    --bg: #18e8;
    --width: 40px;
    --height: 20px;
    all: unset;
    position: relative;
    width: var(--width);
    height: var(--height);
    border-radius: 8px;
    background-color: white;
  }

  .switch::before {
    content: '';
    position: absolute;
    inset: 0;
    display: block;
    width: calc(var(--width) / 2);
    height: var(--height);
    background-color: var(--bg);
    border-radius: 8px;
    transform: translateX(calc(var(--val) * var(--width) / 2));
    transition-property: transform background-color;
    transition-duration: 150ms;
  }

  .switch:checked {
    --val: 1;
    --bg: #18ec;
  }

  .btn:hover {
    background-color: #18ee;
  }

  .btn:active {
    background-color: #18ec;
  }

  .copy-notify {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    background-color: #edede988;
    border: 1px solid #00304955;
    border-radius: 6px;
    padding: 12px;
    opacity: 0;
    font-size: 1rem;
    font-weight: 500;
    color: #1b263b;
  }
</style>
