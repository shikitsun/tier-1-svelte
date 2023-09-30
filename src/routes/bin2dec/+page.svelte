<script context="module">
  export const patterns = Object.freeze({
    bin: '[01]*[,.]{0,1}[01]*',
    dec: '\\d*[,.]{0,1}\\d*'
  });
</script>

<script>
  import { toBinary, toDecimal } from '$lib/bin2dec';

  /**
   * Binary digits
   * @type {null | string}
   */
  let binary = null;
  /**
   * Decimal digits
   * @type {null | string}
   */
  let decimal = null;

  /**
   * Fired when binary input changed
   * @param {Event & { currentTarget: EventTarget & HTMLInputElement }} ev
   */
  function binaryChanged(ev) {
    const binary = ev.currentTarget.value ?? '';
    const sep = binary.indexOf('.') === -1 ? ',' : '.';
    decimal = `${binary
      .replace(/(e\+\d+){0,1}/gm, '')
      .split(sep)
      .map((bin) => toDecimal(bin))
      .join(sep)}`;
  }

  /**
   * Fired when decimal input changed
   * @param {Event & { currentTarget: EventTarget & HTMLInputElement }} ev
   */
  function decimalChanged(ev) {
    const decimal = ev.currentTarget.value ?? '';
    const sep = decimal.indexOf('.') === -1 ? ',' : '.';
    binary = `${decimal
      .replace(/(e\+\d+){0,1}/gm, '')
      .split(sep)
      .map((dec) => toBinary(dec))
      .join(sep)}`;
  }
</script>

<div class="app">
  <div class="container">
    <h1>Binary to decimal</h1>
    <div class="inputs">
      <input
        bind:value={binary}
        on:input={binaryChanged}
        type="text"
        inputmode="numeric"
        pattern={patterns.bin}
        placeholder="110"
      />
      <span>=</span>
      <input
        bind:value={decimal}
        on:input={decimalChanged}
        type="text"
        inputmode="decimal"
        pattern={patterns.dec}
        placeholder="6"
      />
    </div>
  </div>
</div>

<style>
  :root {
    --invalid-color: rgb(160, 50, 50);
    --primary-color: rgb(49, 120, 226);
  }

  :global(body) {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  .app {
    width: 100vw;
    height: 100vh;
  }

  .app,
  .container {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .container {
    background-color: aliceblue;
    padding: clamp(0.4rem, 2vw, 1rem);
    border-radius: 10px;
    flex-direction: column;
    gap: 0.05rem;
  }

  h1 {
    all: unset;
    font-size: clamp(2rem, 3.5vmax, 3.5rem);
    line-height: 1.5;
    font-weight: 500;
    color: rgb(20, 20, 20);
  }

  .inputs {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: clamp(1rem, 4vmax, 4rem);
  }

  @media (width < 550px) {
    .inputs {
      flex-direction: column;
    }

    .inputs span:first-of-type {
      display: none;
    }
  }

  input {
    font-size: clamp(1rem, 2vmax, 2rem);
    line-height: 0.5;
    padding: 0.4em;
    border: 0.09em solid var(--primary-color);
    outline: none;
    border-radius: 0.2em;
    color: rgb(50, 50, 50);
  }

  input:focus-visible {
    outline: 1px solid var(--primary-color);
  }

  input:invalid {
    border-color: var(--invalid-color);
    outline-color: var(--invalid-color);
  }
</style>
