<script lang="ts">
  import 'https://vjs.zencdn.net/7.10.2/video.min.js';
  import { onMount } from 'svelte';
  import Swal from 'sweetalert2';
  import logger from '../lib/logger';
  import playlist from '../assets/json/videos.json';

  let player: any;
  let playerEl: HTMLVideoElement;
  let actionUser: 'empty' | 'liked' | 'disliked' = 'empty';
  let playerSrc: string = playlist.at(0);
  let playlistIndex = 0;

  onMount(() => initPlayer());

  function log(action: string, value: string|object = '') {
    const extra = {
      'video-src': player.src(),
      'video-height': player.height(),
      'video-width': player.width(),
      'video-muted': player.muted(),
      'video-volume': player.volume(),
      'video-paused': player.paused(),
    };

    logger(action, value, extra);
  }

  function initPlayer() {
    const playerWrapperRect = document.querySelector('#player-wrapper').getBoundingClientRect();

    /* @ts-ignore */
    player = videojs(playerEl, {
      controls: true,
      autoplay: false,
      preload: 'metadata',
      fluid: true,
      muted: false,
      width: playerWrapperRect.width - 20,
      height: playerWrapperRect.height - 20,
      userActions: {
        click: true
      }
    });

    /** Save log */
    player.on('loadstart', () => log('loadstart'));
    player.on('abort', () => log('abort'));
    player.on('error', () => log('error'));
    player.on('playing', () => log('playing'));
    player.on('seeked', () => log('seeked', player.currentTime()));
    player.on('durationchange', () => log('durationchange'));
    player.on('play', () => log('play', player.currentTime()));
    player.on('pause', () => log('pause', player.currentTime()));

    /** Save log */
    player.on('ended', () => {
      logger('ended')
      displayModalComments();
    });

    /** Save log */
    setInterval(() =>
      !player.paused() && logger('timeupdate', player.currentTime()),
    5000);
  }

  /**
   * Registra ações do usuário
   */
  function actionActionUser(action: typeof actionUser) {
    if (action === 'liked') {
      logger('Click like');
    } else if (action === 'disliked') {
      logger('Click dislike');
    }

    actionUser = action;
  }

  /**
   * Exibe o próximo vídeo caso esteja disponível
   */
  function nextVideo() {
    logger('Click Next');
    
    const nextPlayerSrc = playlist[++playlistIndex] ?? undefined;

    if (nextPlayerSrc) {
      playerSrc = nextPlayerSrc;
      player.src(playerSrc);
      return;
    }

    alert('Em breve :)')
  }

  /**
   * Exibe um modal para comentário após o vídeo
   */
  function displayModalComments() {
    logger('display_modal_comments', 'Caixa de comentário aberta após finalização do vídeo');

    Swal.fire({
      inputLabel: 'Adicione um comentário anônimo',
      input: 'textarea',
      inputPlaceholder: 'Digite seu comentário aqui',
      showCancelButton: true,
      confirmButtonText: 'Enviar'
    })
    .then((result) => {
      if (!result.value) {
        logger('comment_none', 'Não enviou comentário');
        return;
      }

      (document.querySelector('.comment-wrapper textarea') as HTMLTextAreaElement).value = result.value;
      (document.querySelector('.comment-wrapper button') as HTMLButtonElement).click();
    })
  }
</script>

<div id="player-wrapper">
  <!-- svelte-ignore a11y-media-has-caption -->
  <video id="player" class="video-js vjs-theme-forest" data-clarity-mask="True" bind:this={playerEl}>
    <source src={playerSrc} type="video/mp4" />
  </video>
</div>

<div id="controls">
  <button type="button" id="btn-like" class:active={actionUser === 'liked'} on:click={() => actionActionUser('liked')}>
    <img
      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAFASURBVEiJtdaxSlxREMbx39kILhZBSCwWizT6AikiJIQFbXwFWxFC6ryChW/gQoqQVwhoFWwtRIRAerVIEW0UhUTEsbi7cGXv7t2rnoGBy2G++c8ZmDlXRGji6OIIP9GtjW+YfBoniL7/xtRzAtZKyQe+ME7T0szWK87+jxNMDEgpvcFKNgC+IFWcX49VTdj7VdwZ7v9pnbb2BimlDr6PqP5Xrb5f4ajki9jFwoiQQ8U8lO0WOxGxj9EtwnucG27LpL4dERI+4kO5hIjYSin18KmuBWPsH+YHHw/o/Rv0nlB94AazLcX457ALtJtOchN7jW85AbCUG7CXE/AXGzkBr/AiJyChlRPwNSLOcgEu8ZniPbjKAHiJDkwp/hLeVQQdK9ZI+xGAg4j4Q/26biu26jLeYq7kMxWSW/zAZkQcwT0islqk/hwvIAAAAABJRU5ErkJggg=="
      height="16"
      width="16"
      alt="I like this"
    />
  </button>
  <button type="button" id="btn-dislike" class:active={actionUser === 'disliked'} on:click={() => actionActionUser('disliked')}>
    <img
      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAFASURBVEiJtdaxSlxREMbx39kILhZBSCwWizT6AikiJIQFbXwFWxFC6ryChW/gQoqQVwhoFWwtRIRAerVIEW0UhUTEsbi7cGXv7t2rnoGBy2G++c8ZmDlXRGji6OIIP9GtjW+YfBoniL7/xtRzAtZKyQe+ME7T0szWK87+jxNMDEgpvcFKNgC+IFWcX49VTdj7VdwZ7v9pnbb2BimlDr6PqP5Xrb5f4ajki9jFwoiQQ8U8lO0WOxGxj9EtwnucG27LpL4dERI+4kO5hIjYSin18KmuBWPsH+YHHw/o/Rv0nlB94AazLcX457ALtJtOchN7jW85AbCUG7CXE/AXGzkBr/AiJyChlRPwNSLOcgEu8ZniPbjKAHiJDkwp/hLeVQQdK9ZI+xGAg4j4Q/26biu26jLeYq7kMxWSW/zAZkQcwT0islqk/hwvIAAAAABJRU5ErkJggg=="
      height="16"
      width="16"
      alt="I don't like"
    />
  </button>
  <button type="button" id="btn-next" class="plausible-event-name=Next+Video" on:click={nextVideo}>Próximo</button>
</div>

<style>
#player-wrapper {
  background-color: #31383c;
  margin: 2.5rem auto 0;
  padding: 10px;
  grid-column: 2/span 10;
  width: 100%;
}

#player {
  background-color: #000;
}

#controls {
  grid-column: 2/span 10;
  margin-top: 10px;
}

#controls button {
  background: #FFF;
  border: 1px solid #3fc3c4;
  cursor: pointer;
}

#controls button.active {
  background: #3fc3c4;
  border-color: #174646;
}

#controls #btn-like {
  height: 40px;
  width: 40px;
}

#controls #btn-dislike {
  height: 40px;
  transform: scale(-1);
  width: 40px;
}

#controls #btn-next {
  color: #3fc3c4;
  float: right;
  height: 40px;
  padding: 0 15px;
}

@media screen and (min-width: 1024px) {
  #player-wrapper, #controls {
    grid-column: 3 / span 8;
  }
}

@media screen and (min-width: 1383px) {
  #player-wrapper, #controls {
    grid-column: 4 / span 6;
  }
}
</style>