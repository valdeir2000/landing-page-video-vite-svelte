<script>
  import { LottiePlayer } from '@lottiefiles/svelte-lottie-player';
</script>

<div>
  <LottiePlayer
    src="https://assets1.lottiefiles.com/packages/lf20_suhe7qtm.json"
    autoplay
    loop
    background="transparent"
    class="lottie-player"
  />
</div>

<style>
  div {
    display: flex;
    grid-column: 2 / span 10;
    place-content: center;
    place-items: center;
  }

  @media (min-width: 768px) {
    div {
      grid-column: 4 / span 6;
    }
  }

  @media (min-width: 1024px) {
    div {
      grid-column: 5 / span 4;
    }
  }
</style>