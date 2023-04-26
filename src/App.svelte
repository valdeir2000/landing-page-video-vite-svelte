<script lang="ts">
  import SplashFound from './pages/Splash.svelte';
  import PageNotFound from './pages/NotFound.svelte';

  const pages = {
    '': () => SplashFound,
    '#videos':  () => import('./pages/Videos.svelte').then(m => m.default),
    '#posts':  () => import('./pages/Posts.svelte').then(m => m.default),
    '#stories':  () => import('./pages/Stories.svelte').then(m => m.default)
  }

  let page = SplashFound;

  async function hashChange() {
    page = (!!pages[location.hash]) ? await pages[location.hash]() : PageNotFound;
  }

  hashChange();
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