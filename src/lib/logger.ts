declare global {
    interface Window {
        videojs: {
            [key: string]: Function
        }
    }
}

import plausibleTracker from 'plausible-tracker';
import user from './user.js';

/**
 * Tracker Pages and Events
 */
const plausible = plausibleTracker({
    domain: import.meta.env.VITE_PLAUSIBLE_DOMAIN,
    trackLocalhost: import.meta.env.VITE_PLAUSIBLE_LOCALHOST || false,
    apiHost: import.meta.env.VITE_PLAUSIBLE_API_HOST
})
plausible.trackPageview();

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
    click_next: 'Next Video'
}

/**
 * Envia o rastreio para o código no PipeDream
 */
function _sendPipeDream(action, data) {
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
function _sendPlausible(action, data) {
    const plausibleKey = action.toLowerCase().replace(/\s/, '_');

    if (PLAUSIBLE_EVENTS.hasOwnProperty(plausibleKey)) {
        plausible.trackEvent(PLAUSIBLE_EVENTS[plausibleKey], {
            props: {
                ...data
            }
        })
    }
}

/** Dispatch Logger */
export default (action, value = '') => {
    const player = {};

    
    if ('videojs' in window) {
        const videojsPlayer = window.videojs.getAllPlayers().at(0);

        if (videojsPlayer) {
            player['video-src'] = videojsPlayer.src();
            player['video-height'] = videojsPlayer.height();
            player['video-width'] = videojsPlayer.width();
            player['video-muted'] = videojsPlayer.muted();
            player['video-volume'] = videojsPlayer.volume();
            player['video-paused'] = videojsPlayer.paused();
        }
    }

    const data = {
      ...user,
      ...player,
      action,
      value
    }
    
    _sendPipeDream(action, data);
    _sendPlausible(action, data);
}