// Each rule adds class `ns-<id>` to <html> while enabled and the URL matches; block.css does the hiding.
// `path` is tested against pathname + search; omit it to apply on every page of the site.
const RULES = [
  { id: 'fb-feed', site: 'Facebook', label: 'Hide home feed, Watch and Reels', host: /(^|\.)facebook\.com$/,
    path: /^\/(home\.php)?(\?|$)|^\/watch\/?$|^\/reels?\/?(\?|$)/ },
  { id: 'ig-feed', site: 'Instagram', label: 'Hide home feed, Explore and Reels', host: /(^|\.)instagram\.com$/,
    path: /^\/(\?|$)|^\/(explore|reels)(\/|\?|$)/ },
  { id: 'li-feed', site: 'LinkedIn', label: 'Hide home feed', host: /(^|\.)linkedin\.com$/,
    path: /^\/feed\/?(\?|$)/ },
  { id: 'rd-feed', site: 'Reddit', label: 'Hide home, News, Explore and subreddit feeds', host: /(^|\.)reddit\.com$/,
    path: /^\/((best|hot|new|top|rising|news|explore)\/?)?(\?|$)|^\/r\/[^/]+\/?((best|hot|new|top|rising|controversial)\/?)?(\?|$)/ },
  { id: 'rd-sidebar', site: 'Reddit', label: 'Hide sidebars on all pages', host: /(^|\.)reddit\.com$/ },
  { id: 'yt-home', site: 'YouTube', label: 'Hide home feed', host: /(^|\.)youtube\.com$/ },
  { id: 'yt-comments', site: 'YouTube', label: 'Hide comments', host: /(^|\.)youtube\.com$/ },
  { id: 'yt-autoplay', site: 'YouTube', label: 'Disable autoplay (on open, next video, hover previews)', host: /(^|\.)youtube\.com$/ },
  { id: 'yt-related', site: 'YouTube', label: 'Hide recommended videos', host: /(^|\.)youtube\.com$/ },
  { id: 'yt-theater', site: 'YouTube', label: 'Open videos in theater mode', host: /(^|\.)youtube\.com$/, path: /^\/watch(\?|$)/ },
  { id: 'yt-likes', site: 'YouTube', label: 'Hide like/dislike buttons', host: /(^|\.)youtube\.com$/ },
];

if (typeof module !== 'undefined') {
  module.exports = RULES;
}
