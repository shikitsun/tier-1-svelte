<script>
  /**
   * @type {number | null}
   */
  let value = null;
</script>

<main>
  <input type="text" pattern="(\+|-)?[\d]*(\.[\d]*)?" bind:value />
  <div class="pad" />
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
    padding: 4rem 0;
  }

  main {
    display: flex;
    background-color: #14213d88;
    border: 1px solid #14213d;
    padding: 0.875rem;
    border-radius: 0.75rem;
    width: 50ch;
    max-height: 80vh;
    padding: 2rem;
  }

  input {
    all: unset;
    appearance: textfield;
    font-size: 2.5rem;
    width: 100%;
    line-height: 1;
    height: 2ch;
    border-radius: 12px;
    border: 2px solid #14213dee;
    padding: 12px;
    background-color: #14213daa;
    transition-property: border-color;
    transition-duration: 150ms;
  }

  input:invalid {
    border-color: #d90429;
  }
</style>
