<script>
  const people = [
    {
      name: 'Arthur',
      street: 'Apt. 343 186 Darrick Road',
      city: 'Archietown',
      state: '',
      country: 'US',
      telephone: '+99999999999',
      birthday: '2005/03/10'
    },
    {
      name: 'Sam',
      street: 'Apt. 703 110 Gutkowski Lights',
      city: 'Murrayberg',
      state: '',
      country: 'US',
      telephone: '+99999999999',
      birthday: '2003/02/19'
    }
  ];

  /**
   * @type {typeof people[0] | null}
   */
  let selected = null;
</script>

<main>
  <ul class="people">
    {#each people as person}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
      <li on:click={() => (selected = person)} class:active={selected?.name === person.name}>
        {person.name}
      </li>
    {/each}
  </ul>
  <article class="panel">
    {#if selected}
      <h2 class="person-name">{selected.name}</h2>

      <div class="fields">
        <div class="field birthday">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 16.5m15-3.379a48.474 48.474 0 0 0-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 0 1 3 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 0 1 6 13.12M12.265 3.11a.375.375 0 1 1-.53 0L12 2.845l.265.265Zm-3 0a.375.375 0 1 1-.53 0L9 2.845l.265.265Zm6 0a.375.375 0 1 1-.53 0L15 2.845l.265.265Z"
            />
          </svg>
          <span>{selected.birthday}</span>
        </div>

        <div class="field phone">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
            />
          </svg>

          <address>
            <a href={`tel:${selected.telephone}`}>{selected.telephone}</a>
          </address>
        </div>

        <div class="field address">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
            />
          </svg>

          <span>{selected.street} {selected.city} {selected.state} {selected.country}</span>
        </div>
      </div>
    {/if}
  </article>
</main>

<style>
  main {
    display: flex;
  }

  .people {
    all: unset;
    display: flex;
    flex-direction: column;
    flex: 1 1 20%;
    padding: 1.5rem 0.5rem;
    row-gap: 0.25rem;
    max-height: calc(100vh - 1.5rem * 2);
    overflow-y: auto;
  }

  .people li {
    all: unset;
    display: flex;
    padding: 0.5rem;
    background-color: #0004;
    border-radius: 0.25rem;
    cursor: pointer;
    transition: opacity 150ms, box-shadow 150ms;
  }

  .people li:hover {
    opacity: 0.8;
  }

  .people li.active {
    box-shadow: 0 0 4px -1px #cccc;
  }

  .panel {
    flex: 1 1 80%;
    --p: 0.5rem;
    --pt: 0.3rem;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    background-color: #0008142c;
    box-shadow: 0px 0px 8px -4px #cccc;
    border-radius: 0.75rem;
    margin: 1rem;
    gap: 1rem;
  }

  .panel h2 {
    margin: 0;
  }

  .panel .fields {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .panel .field {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .panel .field :first-child {
    width: 1.75rem;
    height: 1.75rem;
  }

  .panel address a {
    border-radius: 0.25rem;
    padding: 0.25rem;
    border: 0.15rem solid currentColor;
    color: #48cae4;
    transition: opacity 250ms;
  }

  .panel address a:hover {
    opacity: 0.8;
  }

  .panel address a:visited {
    color: #0096c7;
  }

  .panel .address :last-child {
    border-radius: 0.25rem;
    padding: 0.25rem;
    border: 0.15rem solid #2a9d8f;
    width: fit-content;
  }
</style>
