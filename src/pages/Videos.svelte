<script>
  import Player from '../components/Player.svelte';
  import Comments from '../components/Comments.svelte';
  import commentsDefault from '../assets/json/comments.json';
</script>

<div id="header">
  <h1>Clique em play!</h1>
  <p>Curta, comente, baixe!</p>
  <div class="arrow-down"></div>
</div>

<!-- Player Here -->
<Player />

<Comments comments={commentsDefault} />

<style>
#header {
  margin: 0 auto;
  text-align: center;
  grid-column: auto/span 12;
}

#header h1 {
  letter-spacing: 5px;
  text-align: center;
  text-transform: uppercase;
}

#header p {
  font-weight: 200;
}

.arrow-down {
  border-bottom: 1px solid #FFF;
  border-left: 1px solid #FFF;
  height: 29px;
  margin: 2.5rem auto 0;
  transform: rotate(-45deg);
  width: 29px;
}
</style>