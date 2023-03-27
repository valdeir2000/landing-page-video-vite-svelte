<script lang="ts">
  import { onMount } from 'svelte';
  import Swal from 'sweetalert2';
  import logger from '../lib/logger';

  export let comments = [];

  function writeComment() {
    const comment = document.querySelector('#comment-content') as HTMLTextAreaElement;
    
    logger('Comment', comment.value);

    Swal.fire({
      title: 'Enviado!!',
      text: 'Comentário anônimo enviado',
      icon: 'success',
      confirmButtonText: 'Ok'
    })

    localStorage.setItem(`comment-${new Date().getTime()}`, comment.value);
    comments[comments.length] = comment.value;

    comment.value = '';
  }

  function loadComments() {
    for (const key of Object.keys(localStorage)) {
      if (!key.startsWith('comment-')) continue;

      comments[comments.length] = localStorage.getItem(key);
    }
  }

  onMount(() => [
    loadComments()
  ])
</script>

<div class="comments-list">
  <h3>Comentários Anônimos</h3>

  <div>
    {#if !comments.length}
    <p>Seja o(a) primeiro(a) a comentar!</p>
    {/if}

    {#each comments as comment,k}
    <div>
      <img src={`https://robohash.org/${k}`} height="32" width="32" alt="Icon people" />
      <p>{comment}</p>
    </div>
    {/each}
  </div>
</div>

<div class="comment-wrapper">
  <h3>Envie um comentário anônimo</h3>
  <textarea name="comment-content" id="comment-content" on:keydown={(e) => e.key === '13' && writeComment()}></textarea>
  <button type="button" class="plausible-event-name=Comment" on:click={writeComment}>Enviar</button>
</div>

<style>
:root {
  --font-size: 13.3px;
}

h3, textarea, button {
  font-size: 18.72px;
  font-family: 'Prompt', sans-serif;
}

img {
  margin: initial;
}

p {
  font-size: var(--font-size);
  margin: 0;
}

.comment-wrapper {
  grid-column: 2/span 10;
  padding-top: 10px;
  width: 100%;
}

.comment-wrapper textarea {
  border-color: #3fc3c4;
  font-weight: 200;
  height: 203.906px;
  outline-color: #3fc3c4;
  padding: 10px;
  width: 100%;
}

.comment-wrapper button {
  height: 42px;
  width: 100%;
}

.comments-list {
  display: grid;
  gap: 10px;
  grid-column: 2/span 10;
  padding-top: 10px;
  width: 100%;
}

.comments-list > div {
  max-height: 400px;
  overflow: auto;
}

.comments-list > div > div {
  background: #adecec;
  color: black;
  display: flex;
  font-size: smaller;
  gap: 10px;
  margin-bottom: 10px;
  place-items: center;
  padding: 5px;
}

@media screen and (min-width: 1024px) {
  .comments-list, .comment-wrapper {
    grid-column: 3/span 8;
  }

  .comment-wrapper button {
    float: right;
    width: 250px;
  }
}

@media screen and (min-width: 1383px) {
  .comments-list, .comment-wrapper {
    grid-column: 4/span 6;
  }

  .comment-wrapper button {
    float: right;
    width: 250px;
  }
}
</style>