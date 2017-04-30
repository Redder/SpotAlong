var request = require('request');
var cheerio = require('cheerio');

exports.retrieveLyrics = (track, callback) => {
  getLyricsLink(track, (err, data) => {
    if (err) {
      console.log(err);
      callback(err, null);
    } else {
      console.log(data);
      getLyrics(data, (err, data) => {
        if (err) {
          console.log(err);
          callback(err, null);
        } else {
          callback(null, data);
        }
      });
    }
  });
};

var getLyricsLink = function(track, callback){
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
      $('a.song_link', '#main').each(function(i, elem){

        var attribute = $(elem).attr('href'); // Get href attribute
        var title = $(elem).attr('title');  // Get the title Attribute
        var newTitle = searchTitleFormat(title); // Turn the title from search to lower case to make searching easier
        var newSpotTitle = searchTitleFormat(track.track_resource.name);

        // If the track name we get from spotify (in its lowercase form) is in the title, then we found the lyric page!
        if (newTitle.search(newSpotTitle) == 0) {
          console.log('FOUND IT!');
          //deferred.result = getPage(attribute);
          return callback(null, attribute);
        } else {
          // The track names do not match so this is not the page we want
          //console.log('This is not the search result we want');
          //console.log('Title from spotify is %s and I received %s', newSpotTitle, newTitle);
        }
      });

    } else {
      console.log('Did not receive 200 Status Code!');
      return callback('Did not receive 200 Status Code!', null);
    }

  });
}

// This function will get lyrics page (given in the parameter)
var getLyrics = function(link, callback){
  // Get lyrics page from link given
  request(link, (err, res, body) => {
    if (err) {
      callback(err, null);  // If we get an error call that back
    } else {
      if (res.statusCode == 200) {  // If we get a 200 status code (everthings fine)
        var $ = cheerio.load(body); // Load Cherrio with search page we got
        callback(null, $('.lyrics').html());
      } else {  // no 200 = cllback with error
        callback(err, null);
      }
    }
  });
}

// This function will format the string (as given in the parameter) to a more friendly
// version to search for, after scraping the lyric search page
var searchTitleFormat = function(s){
  s = s.toLowerCase(); // Turn everything to lowercase

  s = s.replace(/\s*\(.*?\)\s*/g, "");  // Delete anything thats inside the parenthesis...
  // because we can't correctly search for the song if it has a feature in the title.

  s = s.replace(/\s*\[.*?\]\s*/g, "");  // Same thing as above but with brackets

  s = removeAccents(s); // Replace accents with regular characters for example from ñ to n
  return s
}

// Took this code from https://gist.github.com/alisterlf/3490957
var removeAccents = function(str) {
  var accents    = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
  var accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
  str = str.split('');
  var strLen = str.length;
  var i, x;
  for (i = 0; i < strLen; i++) {
    if ((x = accents.indexOf(str[i])) != -1) {
      str[i] = accentsOut[x];
    }
  }
  return str.join('');
}
