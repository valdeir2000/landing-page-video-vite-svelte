<script>
  import posts from '../assets/json/posts.json';
</script>

<div id="header">
  <h1>Escolha e leia!</h1>
  <p>Curta, comente, leia!</p>
  <div class="arrow-down"></div>
</div>

<div class="wrapper">
  {#each posts as post}
  <article class="tale">
    <img src={post.image} alt="Imagem de descrição do post">
    <h1>{post.title}</h1>
    <p>{post.description}</p>
  </article>
  {/each}
</div>

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


  .wrapper {
    display: grid;
    gap: 16px;
    grid-column: 2 / span 10;
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
</style>