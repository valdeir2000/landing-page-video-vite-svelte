import './app.css'
import Clarity from './lib/clarity';
import App from './App.svelte'

const app = new App({
  target: document.getElementById('app'),
})

Clarity();

export default app
