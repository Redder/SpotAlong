const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const SpotifyWebHelper = require('spotify-web-helper');
const helper = SpotifyWebHelper();
const app = express();
const server = app.listen(3000);
const io = require('socket.io').listen(server);
const spotify = require('./spotify.js');


//Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// If there is an error loading spotify don't do anything (just log it)
helper.player.on('error', err => {
  if (error.message.match(/No user logged in/)) {
    // also fires when Spotify client quits
    console.log('User not logged on OR Spotify client shutdown');
  } else {
    // other errors: /Cannot start Spotify/ and /Spotify is not installed/
    console.log('Cannot Start Spotify OR Spotify is not installed');
  }
});
// If can connect to spotify then start app!
helper.player.on('ready', () => {
  console.log('Connected! and im good to go');
	console.log('Server running in port 3000');

	// Upon a new user connecting
	io.on('connection', function(){
		// When the user changes a track

	});
	helper.player.on('track-will-change', track => {
		console.log('You are currently listening to: %s by %s', track.track_resource.name, track.artist_resource.name);
		// This is callback hell but my knowledge of javascript only lets me do it this way.
		spotify.retrieveLyrics(track, (err, data) => {
			if (err) {
				console.log(err);
			} else {
				io.emit('update', {track: track, lyrics: data}); // emit an event to all connected sockets
				console.log('Sent Lyrics and Track!');
				// Track is the object from the spotify API, lyrics is the HTML from the lyrics genius page
				// The lyrics page starts at the div that has lyrics as a class.
			}
		});
	});

});
app.get('/', function(req, res) {
	res.render('public/index.html');
});
