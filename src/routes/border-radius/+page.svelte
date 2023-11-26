<script>
  import { createBorder, formString, parseString } from '$lib/border-radius';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  let border = createBorder();
  let mounted = false;
  onMount(() => {
    const { hash } = window.location;
    mounted = true;
    if (!hash) return;
    border = parseString(hash.replace('#', '')) || border;
  });

  $: borderRadius = formString(border, '/', ' ', '%');
  // updates only if has browser and mounted later (to not override old)
  $: if (browser && mounted) {
    // no need use localStorage, because this is not production
    // but may replaced with it as well if needed
    window.location.hash = formString(border);
  }
</script>

<main>
  <div>
    <div class="fig" style:border-radius={borderRadius} />
  </div>
</main>

<style>
  main {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .fig {
    --s: 400px;
    background-color: aquamarine;
    width: var(--w, var(--s));
    height: var(--h, var(--s));
  }
</style>
