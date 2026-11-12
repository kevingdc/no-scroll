const test = require('node:test');
const assert = require('node:assert');
const RULES = require('./extension/rules.js');

const rule = (id) => RULES.find((r) => r.id === id);

const cases = {
  'fb-feed': { blocked: ['/', '/?sk=h_chr', '/home.php', '/watch/', '/reels/', '/reel/'], allowed: ['/marketplace/', '/messages/t/1', '/groups/feed/', '/search/top?q=x', '/watch/?v=123', '/zuck'] },
  'ig-feed': { blocked: ['/', '/?variant=following', '/explore/', '/explore/tags/x/', '/reels/abc/'], allowed: ['/direct/inbox/', '/p/abc/', '/reel/abc/', '/someuser/'] },
  'li-feed': { blocked: ['/feed/', '/feed', '/feed/?trk=x'], allowed: ['/in/someone/', '/feed/update/urn:li:activity:1/', '/posts/someone_abc', '/messaging/'] },
  'yt-home': { blocked: ['/', '/?app=m'], allowed: ['/results?search_query=x', '/watch?v=1', '/@someone', '/shorts/abc'] },
  'rd-feed': { blocked: ['/', '/best/', '/hot', '/r/all/', '/r/popular/', '/r/foo', '/r/foo/new/', '/r/foo/top/?t=week', '/news/', '/explore/'], allowed: ['/r/foo/comments/abc/title/', '/search/?q=x', '/user/bob/', '/r/foo/wiki/'] },
};

for (const [id, { blocked, allowed }] of Object.entries(cases)) {
  test(id, () => {
    for (const url of blocked) {
      assert.ok(rule(id).path.test(url), `${url} should be blocked`);
    }
    for (const url of allowed) {
      assert.ok(!rule(id).path.test(url), `${url} should be allowed`);
    }
  });
}
