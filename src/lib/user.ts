import fingerprint from '@fingerprintjs/fingerprintjs';

/** Generate UUID */
const uuid = localStorage.getItem('uuid') ?? (Math.random() * 1000).toString(36);

const user = {
    userAgent: navigator.userAgent,
    /* @ts-ignore */
    isMobile: navigator?.userAgentData || {},
    fingerprint: uuid,
    fingerprintScore: 0,
    uuid,
};

if (uuid) {
    localStorage.setItem('uiud', uuid);
}

fingerprint.load()
    .then((fp) => fp.get())
    .then((result) => {
        user.fingerprint = result?.visitorId;
        user.fingerprintScore = result?.confidence?.score;
    });

export default user;