<script></script>

<main>
  <ul class="people">
    <li>Person Name</li>
  </ul>
  <article class="panel">
    <section class="short-info">
      <h2>Person name</h2>
      <div class="about">
        <strong class="birthday">Birthday</strong>
        <address>
          <a href="tel:800">800</a>
        </address>
      </div>
    </section>

    <section class="address-section">
      <h3>Lives at</h3>
      <div class="address">
        <span class="street">Street</span><i class="city">City</i><strong class="state"
          >State</strong
        ><strong class="country">Country</strong>
      </div>
    </section>
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
  }

  .people li.active {
    box-shadow: 0 0 4px -1px #cccc;
  }

  .panel {
    flex: 1 1 80%;
    --p: 0.5rem;
    --pt: 0.3rem;
    padding: 0.5rem;
    background-color: #0008142c;
    box-shadow: 0px 0px 8px -4px #cccc;
    border-radius: 0.75rem;
    margin: 1rem;
  }

  .panel > section {
    padding: var(--p);
    padding-top: var(--pt);
  }

  .panel h2,
  h3 {
    margin: 0;
  }

  .panel,
  .panel .address-section {
    display: flex;
    flex-direction: column;
    row-gap: 0.5rem;
  }

  .panel .short-info,
  .panel .address-section .address {
    display: flex;
    flex-direction: column;
    row-gap: 0.25rem;
  }

  .panel .short-info,
  .panel .address-section {
    border-radius: 8px;
    background-color: #0004;
    box-shadow: 0 0 4px -1px #444;
  }

  .panel .short-info .about {
    display: flex;
    column-gap: 0.75rem;
  }
</style>
