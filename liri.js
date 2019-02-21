require("dotenv").config();
var axios = require("axios");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var moment = require('moment');
var fs = require("fs");

var action = process.argv[2];
var value = process.argv[3];

function concert(artist){
    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    axios.get(queryUrl).then(
        function(response) {
            var venueName = response.data[0].venue.name;
            var venueLocation = response.data[0].venue.city + ", " + response.data[0].venue.country;
            var venueDate = moment(response.data[0].datetime).format("MM/DD/YYYY")
            console.log("Venue: " + venueName);
            console.log("Location: " + venueLocation);
            console.log("Date: " + venueDate);
        });
};

function spotifySong(song){
    if (song === undefined){
        song = "the&20sign";
        spotify
        .request('https://api.spotify.com/v1/search?q=track:the%20sign%20artist:ace%20of%20base&type=track&limit=1')
        .then(function(data) {
            var artistName = data.tracks.items[0].artists[0].name;
            var albumName = data.tracks.items[0].album.name;
            var previewLink = data.tracks.items[0].external_urls.spotify;
            var songName = data.tracks.items[0].name;
            console.log("Artist: " + artistName); 
            console.log("Song: " + songName);
            console.log("Album: " + albumName);
            console.log("Preview on Spotify: " + previewLink);
        })
        .catch(function(err) {
            console.error('Error occurred: ' + err); 
        });
    }
    else{
    
        spotify.search({ type: 'track', query: song, limit: 1 }, function(err, data) {
            if (err) {
            return console.log('Error occurred: ' + err);
            }
            var artistName = data.tracks.items[0].artists[0].name;
            var albumName = data.tracks.items[0].album.name;
            var previewLink = data.tracks.items[0].external_urls.spotify;
            var songName = data.tracks.items[0].name;
            console.log("Artist: " + artistName); 
            console.log("Song: " + songName);
            console.log("Album: " + albumName);
            console.log("Preview on Spotify: " + previewLink);
        })
    };
};

function movieThis(movieName){
    if (movieName === undefined){
        movieName = "Mr. Nobody";
    };

    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&type=movie&plot=short&apikey=trilogy";
    axios.get(queryUrl).then(
        function(response) {
            var rottenRating;
            var rottenRatingObj = response.data.Ratings.find(x => x.Source === "Rotten Tomatoes");
            if (rottenRatingObj !== undefined){
                rottenRating = rottenRatingObj.Value;
            }
            else{
                rottenRating = "NA";
            };
            console.log("Title: " + response.data.Title);
            console.log("Release Year: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.imdbRating);
            console.log("Rotten Tomatoes Rating: " + rottenRating);
            console.log("Country: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
        }
    )
};

function doWhatever(){
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
          return console.log(error);
        };
        var dataArr = data.split(",");
        action = dataArr[0];
        value = dataArr[1];
        switch (action) {
            case "concert-this":
              concert(value);
              break;
            
            case "spotify-this-song":
              spotifySong(value);
              break;
            
            case "movie-this":
              movieThis(value);
              break;
        }        
    });
}

switch (action) {
    case "concert-this":
      concert(value);
      break;
    
    case "spotify-this-song":
      spotifySong(value);
      break;
    
    case "movie-this":
      movieThis(value);
      break;
    
    case "do-what-it-says":
      doWhatever(value);
      break;
};