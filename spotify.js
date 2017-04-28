var request = require('request');
var cheerio = require('cheerio');

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
  // We are basically searching musixmatch with the name of the song and artist.
  // We will then crawl the best result search, then get the lyrics and return it
  var searchQ = 'https://genius.com/search?q=' + track.track_resource.name + ' ' + track.artist_resource.name;  // The search URL for the track
  console.log('Searching for %s', searchQ);
  request(searchQ, function (error, response, body) {
    if (error) {
      console.log('Could not search for Lyrics!');
      console.log('error:', error); // Print the error if one occurred
    }
    if (response.statusCode == 200) {
      var $ = cheerio.load(body); // Load Cherrio with search page we got

      // Iterate through each song link (result)
      $('a.song_link', '#main').each(function(){
        var attribute = $(this).attr('href'); // Get href attribute
        var title = $(this).attr('title');  // Get the title Attribute
        var newTitle = searchTitleFormat(title); // Turn the title from search to lower case to make searching easier
        var newSpotTitle = searchTitleFormat(track.track_resource.name);

        // If the track name we get from spotify (in its lowercase form) is in the title, then we found the lyric page!
        if (newTitle.search(newSpotTitle) == 0) {
          console.log('FOUND IT!');
          return getPage(attribute);
        } else {
          // The track names do not match so this is not the page we want
          console.log('This is not the search result we want');
          console.log('Title from spotify is %s and I received %s', newSpotTitle, newTitle);
        }
      });
      //var title = $('.search_result > a').attr('href');
      /*
      $('.search-result').each(function(i, elem) {
        console.log(i);
        console.log(elem);
        console.log($(elem).children('a').attr('href'));
      });
      */
      //console.log('THE TITLE FROM SEARCH IS: %s', title);

    } else {
      console.log('Did not receive 200 Status Code!');
    }

  });
}

// This function will get lyrics page (given in the parameter)
var getPage = function(link){

}

// This function will format the string (as given in the parameter) to a more friendly
// version to search for, after scraping the lyric search page
var searchTitleFormat = function(s){
  s = s.toLowerCase(); // Turn everything to lowercase
  s = s.replace("feat", "ft");  // Replace feat to ft because the lyrics web page write featuring artists in that format
  return s
}
