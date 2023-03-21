<script>
  import PageVideos from './pages/Videos.svelte';
  import PageSplash from './pages/Splash.svelte';
  import PageNotFound from './pages/NotFound.svelte';

  const pages = {
    '': PageSplash,
    '#videos': PageVideos
  }

  let page = pages[location.hash] ?? PageNotFound;

  function hashChange() {
    page = pages[location.hash] ?? PageNotFound;
  }
</script>

<svelte:window on:hashchange={hashChange} />

<main id="container">
  <svelte:component this={page} />
</main>

<style>
#container {
  box-sizing: border-box;
  margin: 0 auto;
  min-height: 100vh;
  padding: 5rem 0;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
}
</style>