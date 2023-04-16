declare global {
    interface Window {
        clarity: {
            q: any[]
        };
    }
}

export default () => {
    if (!import.meta.env.VITE_CLARITY_CODE) return;

    window.clarity = window.clarity || function(){(window.clarity.q=window.clarity.q||[]).push(arguments)};

    const js = document.createElement('script');
    js.async = true;
    js.src = `https://claridade.valdeir-webdesign.workers.dev/www.clarity.ms/tag/${import.meta.env.VITE_CLARITY_CODE}`;
    const firstScript = document.querySelector('script');
    firstScript?.parentNode?.insertBefore(js, firstScript);
}