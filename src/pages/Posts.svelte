<script lang="ts">
  import { tick } from 'svelte';
  import Comment from '../components/Comments.svelte';
  import posts from '../assets/json/posts.json';

  let readerMode = false;
  let contentHeading: string;
  let content: HTMLDivElement;

  let readerPost = async (id: number) => {
    readerMode = true;
    await tick();

    const post = posts.filter((post) => post.id === id).at(0);

    fetch(`/posts/${id}.html`)
      .then((res) => res.text())
      .then((res) => {
        contentHeading = post.title;
        content.innerHTML = res;

        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
      })
  }
</script>

{#if readerMode === true}
<section class="container">
  <h1>{ contentHeading }</h1>
  <div class="content" bind:this={content}></div>

  <Comment />
</section>
{/if}

<section id="list-posts">
  <div id="header">
    <h1>Escolha e leia!</h1>
    <p>Curta, comente, leia!</p>
    <div class="arrow-down"></div>
  </div>
  
  <div class="wrapper">
    {#each posts as post}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <article class="tale" on:click={() => readerPost(post.id)}>
      <img src={post.image} alt="Imagem de descrição do post">
      <h1>{post.title}</h1>
      <p>{post.description}</p>
    </article>
    {/each}
  </div>
</section>

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


  #list-posts {
    grid-column: 2 / span 10;
  }

  .wrapper {
    display: grid;
    gap: 16px;
    margin-top: 32px;
    width: 100%;
  }

  article {
    background: #FFF;
    border-radius: 10px;
    height: fit-content;
    padding-bottom: 16px;
  }

  article > img {
    aspect-ratio: 16/9;
    border-radius: 10px 10px 0 0;
    max-width: 100%;
    object-fit: contain;
  }

  article > h1 {
    color: #000;
    font-size: 1rem;
    padding: 0 16px;
  }

  article > p {
    color: #333;
    font-size: 0.85rem;
    margin: 0;
    padding: 0 16px;
  }

  @media (min-width: 768px) {
    .wrapper {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 1024px) {
    .wrapper {
      gap: 32px;
      grid-template-columns: repeat(3, 1fr);
    }
  }

  section.container {
    backdrop-filter: blur(10px);
    background: #ffffffdb;
    color: #333;
    grid-column: 1 / span 12;
    margin: 0 8px;
    padding: 16px;
  }
</style>