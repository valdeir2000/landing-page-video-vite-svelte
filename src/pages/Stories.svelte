<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { LottiePlayer } from '@lottiefiles/svelte-lottie-player';
  import Reveal from 'reveal.js';
  import Stories from '../assets/json/stories.json';
  import logger from '../lib/logger';
  import Comments from '../components/Comments.svelte';
  import 'reveal.js/dist/reveal.css';
  import 'reveal.js/dist/theme/league.css';
  import Swal from 'sweetalert2';

  let sliders: any;

  onMount(() => {
    sliders = new Reveal({
      controlsTutorial: true,
      controlsLayout: 'edges',
      slideNumber: 'c/t',
      center: true,
      disableLayout: true,
    });

    sliders.on('slidechanged', (ev: any) => {
      const story = Object.assign({}, Stories[ev.indexh - 1]);

      /* @ts-ignore */
      if (story) logger('stories_view', `Visualizou o story ${story?.title ?? story?.src}`);
      
      /* @ts-ignore */
      if (story.type === 'quiz') {
        delete story.type;

        Swal.fire(story)
          .then((res) => {
            if (res.isConfirmed) Swal.fire({ icon: 'success' })
            else if (res.isDenied) Swal.fire({ icon: 'error' })
            return res;
          })
          .then((res) => {
            let result = '';

            if (res.isConfirmed) {
              result = story.confirmButtonText;
            } else if (res.isDenied) {
              result = story.denyButtonText;
            } else {
              result = story.cancelButtonText ?? 'Não respondeu o quiz';
            }

            logger('stories_answer', `Respondeu o quiz ${story?.title ?? story?.src} com ${result}`);
            sliders.next();
          })
      }

      if ((ev.indexh + 1) == sliders.getTotalSlides()) {
        logger('stories_view', `Visualizou a caixa de comentário no story`);
      }
    })

    sliders.initialize().then(() => {
      if (Stories[0]) logger('stories_view', 'Visualizou o slide inicial');
    })
  });

  onDestroy(() => {
    document.documentElement.classList.remove('reveal-full-page');
    document.body.classList.remove('reveal-viewport');
  });

  let isPlaying = false;

  function togglePlayPauseVideo(e: MouseEvent|KeyboardEvent) {
    let el = e.target as HTMLElement;
    /* @ts-ignore */
    if (el.tagName !== 'p') el = e.target.closest('p');
    const video = el.querySelector('video');
    if (!video) return;
    video.paused ? video.play() : video.pause();
    isPlaying = !video.paused;
  }
</script>

<div class="reveal">
  <div class="slides">
    <section>
      <p class="center-hv">Arraste para o lado</p>
    </section>

    {#each Stories as story}
    {#if story.type === 'image'}
    <section data-transition="slide-in fade-out"><img data-src={story.src} alt="Figure" width="1080" height="1920"></section>
    {:else if story.type === 'video'}
    <section data-transition="slide-in fade-out">
      <p class="center-hv" on:click={togglePlayPauseVideo} on:keydown={togglePlayPauseVideo}>
        {#if isPlaying === false}
        <span class="btn-play">
          <LottiePlayer
            src="https://assets7.lottiefiles.com/packages/lf20_z0b82vos.json"
            autoplay
            loop
            background="transparent"
            class="lottie-player"
            height="100"
            width="100"
          />
        </span>
        {/if}

        <!-- svelte-ignore a11y-media-has-caption -->
        <video
          src="https://file-examples.com/storage/feee5c69f0643c59da6bf13/2017/04/file_example_MP4_480_1_5MG.mp4"
          controls
          controlslist="nodownload nofullscreen noremoteplayback"
        ></video>
      </p>
    </section>
    {:else if story.type === 'quiz'}
    <section data-transition="slide-in fade-out"><p></p></section>
    {/if}
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

video {
  height: 100vh;
  pointer-events: none;
  max-width: 100%;
}

video::-webkit-media-controls-mute-button,
video::-webkit-media-controls-fullscreen-button {
  display: none;
}

.btn-play {
  position: absolute;
}

.center-hv {
  display: flex;
  height: 100%;
  place-content: center;
  place-items: center;
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