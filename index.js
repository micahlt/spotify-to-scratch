const fetch = require("node-fetch");
const { Session, Cloud } = require('scratchcloud');
const s2n = require('string2num');
var Vibrant = require('node-vibrant');
let at = '';
var Scratch = require('scratch-api');
var c = (n) => {
  return `☁ ${n}`;
}
var t;
const defaultItem = {
  item: {
    name: ' ',
    artists: [{ name: 'nothing is playing' }],
    album: {
      images: [{ url: 'https://cdn2.scratch.mit.edu/get_image/user/41216777_60x60.png' }]
    },
    duration_ms: 0
  },
  progress_ms: 0
}

fetch('https://accounts.spotify.com/api/token', {
  method: 'POST',
  headers: {
    'Authorization': 'Basic ' + (new Buffer(process.env.CLIENT + ':' + process.env.SECRET).toString('base64')),
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: `grant_type=refresh_token&refresh_token=${process.env.REFRESHER}`
}).then((res) => {
  return res.json();
}).then((resd) => {
  at = resd.access_token;
});

Scratch.UserSession.create(process.env.USERNAME, process.env.PASSWORD, function(err, user) {
  user.cloudSession(598414279, function(err, cloud) {
    cloud.on('set', (name, value) => {
      if (name == c('pleaseRefresh') && value == 201) {
        console.log('Refresh manually requested');
        clearTimeout(t);
        lookForSong();
      }
    })
    var lookForSong = () => {
      fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: {
          'Authorization': `Bearer ${at}`,
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        if (res.status == 200) {
          return res.json()
        } else {
          return defaultItem;
        }
      }).then((data) => {
        if (!data.is_playing) {
          data = defaultItem;
        }
        Vibrant.from(data.item.album.images[0].url).getPalette()
          .then((palette) => {
            cloud.set(c('colorTheme'), s2n.encode(palette.Vibrant.getHex().toLowerCase().substring(1)));
            cloud.set(c('colorAccent'), s2n.encode(palette.LightMuted.getHex().toLowerCase().substring(1)));
            cloud.set(c('songName'), s2n.encode(data.item.name.toLowerCase()));
            cloud.set(c('songArtist'), s2n.encode(data.item.artists[0].name.toLowerCase()));
            cloud.set(c('duration'), data.item.duration_ms / 1000);
            cloud.set(c('progress'), data.progress_ms / 1000);
            cloud.set(c('pleaseRefresh'), 200);
            t = setTimeout(lookForSong, 60000);
          })
      });
    }
    lookForSong();
  });
});

setInterval(() => {
  fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + (new Buffer(process.env.CLIENT + ':' + process.env.SECRET).toString('base64')),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=refresh_token&refresh_token=${process.env.REFRESHER}`
  }).then((res) => {
    return res.json();
  }).then((resd) => {
    at = resd.access_token;
  });
}, 60000)