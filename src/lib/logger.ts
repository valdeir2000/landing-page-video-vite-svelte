declare global {
    interface Window {
        videojs: {
            [key: string]: Function
        }
    }
}

import plausibleTracker from 'plausible-tracker';
import user from './user.js';

const currentPage = new URL(location.href);
currentPage.searchParams.set('ref', user.fingerprint || user.uuid);

/**
 * Tracker Pages and Events
 */
console.log()
const plausible = plausibleTracker({
    domain: import.meta.env.VITE_PLAUSIBLE_DOMAIN,
    trackLocalhost: import.meta.env.VITE_PLAUSIBLE_LOCALHOST === 'true' || import.meta.env.VITE_PLAUSIBLE_LOCALHOST == 1,
    apiHost: import.meta.env.VITE_PLAUSIBLE_API_HOST,
    hashMode: true
});
plausible.trackPageview({
    url: currentPage.toString()
});
plausible.enableAutoPageviews();

/**
 * Plausible events allowed
 */
const PLAUSIBLE_EVENTS = {
    play: 'Play Video',
    pause: 'Video Paused',
    ended: 'Video Ended',
    comment: 'Comment',
    click_like: 'Like',
    click_dislike: 'Dislike',
    click_next: 'Next Video',
    loadstart: 'Load Start',
    abort: 'Abort',
    error: 'Error',
    playing: 'Playing',
    seeked: 'Seeked',
    durationchange: 'Duration Change',
    timeupdate: 'Time Update',
    display_modal_comments: 'Display Modal Comments',
    comment_none: 'Comment None',
    post_reader: 'Post Reader',
    page_hidden: 'Page Hidden',
    page_show: 'Page Show',
    stories_view: 'Stories View'
}

/**
 * Envia o rastreio para o código no PipeDream
 */
function _sendPipeDream(action: string, data: object) {
    if (location.href.indexOf('localhost') === -1) {
        fetch(
            `${import.meta.env.VITE_LOGGER_URL_PIPEDREAM}/${ user.fingerprint.length ? user.fingerprint : 'unknown' }`,
            {
                method: 'POST',
                body: JSON.stringify(data)
            }
        );
    } else {
        console.log({ action, data })
    }
}

/**
 * Envia o rastreio para Plausible
 */
function _sendPlausible(action: string, data: object) {
    const plausibleKey = action.toLowerCase().replace(/\s/, '_');

    if (PLAUSIBLE_EVENTS.hasOwnProperty(plausibleKey)) {
        plausible.trackEvent(PLAUSIBLE_EVENTS[plausibleKey], {
            props: {
                ...data
            }
        })
    }
}

/**
 * Envia log se o usuário sair ou voltar para a página
 */
function _onVisibilityChange() {
    const action = (document.hidden) ? 'page_hidden' : 'page_show';

    _dispathEvent(action, location.href)
}

window.addEventListener('visibilitychange', _onVisibilityChange);

function _dispathEvent(action: string, value: string|object = '', extras: object = {}) {
    const data = {
      ...user,
      ...extras,
      action,
      value
    }
    
    _sendPipeDream(action, data);
    _sendPlausible(action, data);
}

/** Dispatch Logger */
export default _dispathEvent;