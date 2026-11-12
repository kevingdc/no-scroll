// Chrome only exposes `chrome`; Safari exposes both.
globalThis.browser ??= chrome;

let settings = {};

function apply() {
  const url = location.pathname + location.search;
  for (const rule of RULES) {
    const active = settings[rule.id] !== false && rule.host.test(location.hostname) && (!rule.path || rule.path.test(url));
    document.documentElement.classList.toggle('ns-' + rule.id, active);
  }

  if (document.documentElement.classList.contains('ns-yt-autoplay')) {
    document.querySelector('.ytp-autonav-toggle-button[aria-checked="true"], .ytwAutonavToggleButtonHost[aria-pressed="true"]')?.click();
  }

  if (document.documentElement.classList.contains('ns-yt-theater')) {
    enterTheater();
  }
}

let theaterUrl = '';

// Once per video, so exiting theater mode manually sticks until the next video.
function enterTheater() {
  if (location.href === theaterUrl) {
    return;
  }

  const watch = document.querySelector('ytd-watch-flexy');
  const sizeButton = document.querySelector('.ytp-size-button');
  if (!watch || !sizeButton) {
    return;
  }

  if (!watch.hasAttribute('theater')) {
    sizeButton.click();
  }
  theaterUrl = location.href;
}

const USER_INTENT_WINDOW_MS = 1000;
let lastPlayerIntent = 0;

// Clicks in the player and any key press (k, space) count as the user asking to play.
document.addEventListener('pointerdown', (event) => {
  if (event.target.closest?.('#movie_player, #player-container-id, #shorts-player, ytd-shorts, shorts-page')) {
    lastPlayerIntent = Date.now();
  }
}, true);
document.addEventListener('keydown', () => {
  lastPlayerIntent = Date.now();
}, true);

// `play` doesn't bubble, so listen in the capture phase.
document.addEventListener('play', (event) => {
  if (!document.documentElement.classList.contains('ns-yt-autoplay')) {
    return;
  }
  if (Date.now() - lastPlayerIntent < USER_INTENT_WINDOW_MS) {
    return;
  }
  event.target.pause();
}, true);

apply();
browser.storage.sync.get().then((stored) => {
  settings = stored;
  apply();
});
browser.storage.onChanged.addListener((changes) => {
  for (const [key, { newValue }] of Object.entries(changes)) {
    settings[key] = newValue;
  }
  apply();
});

// shortcut: polling catches SPA navigation on all five sites; switch to the Navigation API once Safari ships it everywhere.
setInterval(apply, 1000);
