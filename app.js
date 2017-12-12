//
//  Created by Oliver Boudet on 12/10/2017.
//  Copyright © 2017 Oliver Boudet. All rights reserved.
//

const client = require('discord-rich-presence')('389391921401036803');
var nodeSpotifyWebHelper = require('./spotify');
var spotify = new nodeSpotifyWebHelper.SpotifyWebHelper();
const log = require('fancy-log');
client.on('connected', () => {
  log('Connected!')
})
function nowPlayingURL() {
  spotify.getStatus((err, res) => {
    if (res.track.track_type == "ad") return;
    console.log(res.track.track_resource.uri.replace('spotify:track:', 'https://open.spotify.com/track/'))
  })
}

function updatePlaying() {
spotify.getStatus((err, res) => {
    if (err) {
      return log(err);
    }
    if (res.track.track_type == "ad")  {
      log('no music playing')
      client.updatePresence({
        details: `🎵 No music playing.`, //track name      
        state: `👤 Advertisements.`, //artist name
        startTimestamp: new Date(), //ehh
        largeImageKey: 'spotify_logo', //client asset
        smallImageKey: 'play', //client asset
        largeImageText: '--',
        smallImageText: 'Stopped',
        instance: true, //tbh idk what this does
      });
      return;
    }
    if (res.playing && res.track.track_resource.name) {
      client.updatePresence({
        details: `🎵 ${res.track.track_resource.name}`, //track name      
        state: `👤 ${res.track.artist_resource.name}`, //artist name
        //startTimestamp: new Date(),
        endTimestamp: res.playing ? ((Date.now() / 1000) + +(res.track.length - Math.round(res.playing_position))) : null, //works now
        largeImageKey: 'spotify_logo', //client asset
        smallImageKey: 'play', //client asset
        instance: true, //tbh idk what this does
        largeImageText: `${res.track.artist_resource.name} - ${res.track.track_resource.name}`,
        smallImageText: `Playing`
      });
    } else if (!res.playing) {
      client.updatePresence({
        details: `🎵 ${res.track.track_resource.name}`, //track name      
        state: `👤 Paused`, //artist name
        startTimestamp: res.playing ? new Date() : null,
        largeImageKey: 'spotify_logo', //client asset
        smallImageKey: 'pause', //client asset
        instance: true, //tbh idk what this does
        largeImageText: `${res.track.artist_resource.name} - ${res.track.track_resource.name}`,
        smallImageText: `Paused`
      });
    } else {
      client.updatePresence({
        details: `🎵 Nothing playing.`, //track name      
        state: `👤 N/A.`, //artist name
        startTimestamp: new Date(), //ehh
        largeImageKey: 'spotify_logo', //client asset
        smallImageKey: 'play', //client asset
        instance: true, //tbh idk what this does
      });
    }
  });
}
updatePlaying();
setInterval(() => {
  updatePlaying();
  nowPlayingURL();
  //log(`updated`)
}, 15e3)