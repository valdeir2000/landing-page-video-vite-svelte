<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Reveal from 'reveal.js';
  import Stories from '../assets/json/stories.json';
  import logger from '../lib/logger';
  import Comments from '../components/Comments.svelte';
  import 'reveal.js/dist/reveal.css';
  import 'reveal.js/dist/theme/league.css';

  onMount(() => {
    const sliders = new Reveal({
      controlsTutorial: true,
      controlsLayout: 'edges',
      slideNumber: 'c/t',
      disableLayout: true,
    });

    sliders.on('slidechanged', (ev: any) => {
      if (Stories[ev.indexh]) logger('StoriesView', `Visualizou o story ${Stories[ev.indexh]}`);
    })

    sliders.initialize().then(() => {
      if (Stories[0]) logger('StoriesView', `Visualizou o story ${Stories[0]}`);
    })
  });

  onDestroy(() => {
    document.documentElement.classList.remove('reveal-full-page');
    document.body.classList.remove('reveal-viewport');
  })
</script>

<div class="reveal">
  <div class="slides">
    {#each Stories as story}
    <section data-transition="slide-in fade-out"><img data-src={story} alt="Figure" width="1080" height="1920"></section>
    {/each}
    <section data-transition="slide-in fade-out">
      <div class="comments">
        <Comments hiddenList={true} />
      </div>
    </section>
  </div>
</div>

<style>
:root {
  --r-heading3-size: 1.17em !important;
}

.reveal {
  grid-column: 1 / span 12;
}

.reveal {
  background: #000;
  height: 100vh;
}

.reveal section {
  align-items: center;
  flex-flow: column wrap;
  display: flex;
  height: 100%;
  justify-content: center;
}

.reveal img {
  margin: 0 auto;
  height: 100vh;
  max-height: 100vh;
  max-width: 100vh;
  object-fit: contain;
  width: 100vw;
}

.reveal .comments {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  height: 100%;
  place-items: center;
}

:global(#container) {
  padding: 0 !important;
}
</style>