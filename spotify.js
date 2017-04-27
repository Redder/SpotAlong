const SpotifyWebHelper = require('spotify-web-helper');

const helper = SpotifyWebHelper();

helper.player.on('error', err => {
  if (error.message.match(/No user logged in/)) {
    // also fires when Spotify client quits
    console.log('User not logged on OR Spotify client shutdown');

  } else {
    // other errors: /Cannot start Spotify/ and /Spotify is not installed/
    console.log('Cannot Start Spotify OR Spotify is not installed');
  }
});

helper.player.on('ready', () => {
  console.log('Connected! and im good to go');

  // When the user changes a track
  helper.player.on('track-will-change', track => {
    console.log('You are currently listening to: %s by %s', track.track_resource.name, track.artist_resource.name);
    var lyrics = getLyrics(track);
    console.log(lyrics);
  });

  console.log('You are currently listening to: %s by %s', helper.status.track.track_resource.name, helper.status.track.artist_resource.name);

});

var getLyrics = function(track){

}
