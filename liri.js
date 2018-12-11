require("dotenv").config();
var fs = require("fs");
var request = require("request");
var inquirer = require("inquirer")
var secretKeys = require("./keys.js")
var Spotify = require("node-spotify-api")
// var spotify = new Spotify(keys.spotify);
var moment = require('moment');
var spotify = new Spotify({
    id: secretKeys.spotify.id,
    secret: secretKeys.spotify.secret
})

// console.log(spotify)
start()
function start() {

    console.log("Good morning, what can I help you with today?\n");
    mainMenu();
}
function mainMenu() {

    inquirer.prompt([
        {
            type: "list",
            name: "menuChoice",
            message: "Please pick one of my preprogrammed functions",
            choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"]
        }
    ]).then(function (userChoice) {
        switch (userChoice.menuChoice) {
            case "concert-this":
                runConcert();
                break;

            case "spotify-this-song":
                runSpotify();
                break;

            case "movie-this":
                runMovie();
                break;

            case "do-what-it-says":
                runDoWhat();
                break;
        }
    })
}
function runConcert() {

    inquirer.prompt([
        {
            type: "input",
            name: "artist",
            message: "Please enter the band or artist of your choice",
        }
    ]).then(function (userInput) {
        var band = (userInput.artist);
        if (!band){
            band = "Santana"
        }

        // console.log(band)
        var queryURL = "https://rest.bandsintown.com/artists/" + band + "/events?app_id=codingbootcamp"
        request(queryURL, function (error, response, body) {
            // console.log(response)
            if (!error) {
                var event = JSON.parse(body);
                console.log("You can hear " + band + " at these venues:")
                // console.log(event)
                for (var j = 0; j < event.length; j++) {
                    console.log(event[j].venue.name)
                    console.log(event[j].venue.city, event[j].venue.region)
                    // console.log(event[j].datetime)
                    var date = moment(event[j].datetime).format("MM-DD-YYYY")
                    console.log(date)
                }
            } else {
                console.log(error)
            }
        })
    })
}
function runSpotify() {
    inquirer.prompt([
        {
            type: "input",
            name: "song",
            message: "Please enter the song of your choice",
        }
    ]).then(function (userInput) {
        var song = userInput.song;
        if (!song) {
            song = "The Sign"
        }

        spotify.search({ type: "track", query: song, limit: 1 }, function (error, response) {
            if (error) {
                console.log("error found" + error)
            } else {


                var songAlbum = response.tracks.items[0].album.name
                var songArtist = response.tracks.items[0].artists[0].name
                var songPreview = response.tracks.items[0].preview_url
                console.log("You picked " + song)
                console.log("by " + songArtist)
                console.log("on the album " + songAlbum)
                console.log("Here is a link to a preview of " + song + ": " + songPreview)
            }

        })
    })
}
function runMovie() {
    inquirer.prompt([
        {
            type: "input",
            name: "movie",
            message: "Please enter the movie of your choice",
        }
    ]).then(function (userInput) {
        var movie = (userInput.movie)
        if (!movie) {
            movie = "Mr. Nobody"
        }
        console.log(movie)
        var queryURL = "https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
        request(queryURL, function (error, response, body) {
            // console.log(response)
            if (!error) {

                var movieInfo = JSON.parse(body);
                var premierYear = movieInfo.Year
                var imdbRating = movieInfo.imdbRating
                var rtRating = movieInfo.Ratings[1].Value
                var movieCountry = movieInfo.Country
                var movieLanguage = movieInfo.Language
                var moviePlot = movieInfo.Plot
                var movieActors = movieInfo.Actors
                // console.log(movieInfo)
                console.log("You asked about the " + premierYear)
                console.log("movie " + movie + ".")
                console.log("It has a " + imdbRating + " on IMDB")
                console.log("and " + rtRating + " on Rotten Tomatoes")
                console.log(movie + " was made in " + movieCountry)
                console.log("and the audio is in " + movieLanguage)
                console.log(moviePlot)
                console.log("Featuring: " + movieActors)

            }

        })
    })

}
function runDoWhat() {
    fs.readFile("./random.txt", "utf8", function (error, data) {
        if (!error) {
            // console.log(data)
            var sourceVariable = data.split(",")
            // console.log(sourceVariable)
            var prompt = sourceVariable[0]
            // console.log(prompt)
            var song = sourceVariable[1]
            // console.log(song)
            if(prompt  = "spotify-this-song"){
                spotify.search({ type: "track", query: song, limit: 1 }, function (error, response) {
                    if (error) {
                        console.log("error found" + error)
                    } else {
        
        
                        var songAlbum = response.tracks.items[0].album.name
                        var songArtist = response.tracks.items[0].artists[0].name
                        var songPreview = response.tracks.items[0].preview_url
                        console.log("You picked " + song)
                        console.log("by " + songArtist)
                        console.log("on the album " + songAlbum)
                        console.log("Here is a link to a preview of " + song + ": " + songPreview)
                    }
        
                })

            }
        }
    })
}
