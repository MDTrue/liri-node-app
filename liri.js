require("dotenv").config();
var fs = require("fs");
var request = require("request");
var inquirer = require("inquirer")
var secretKeys = require("./keys.js")
var Spotify = require("node-spotify-api")
// var spotify = new Spotify(keys.spotify);
var moment = require('moment');
var spotify = new Spotify ({
    id:secretKeys.spotify.id,
    secret:secretKeys.spotify.secret
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
          choices: ["concert-this", "spotify-this-song", "movie-this","do-what-it-says"]
        }
]).then(function(userChoice){
    switch (userChoice.menuChoice){
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
function runConcert(){

    inquirer.prompt([
        {
          type: "input",
          name: "artist",
          message: "Please enter the band or artist of your choice",
        }
    ]).then(function(userInput){
        var band = (userInput.artist);
        // console.log(band)
        var queryURL = "https://rest.bandsintown.com/artists/" + band + "/events?app_id=codingbootcamp"
        request(queryURL,function(error, response, body){
            // console.log(response)
            if (!error) {
                var event = JSON.parse(body);
                // console.log(event)
                for (var j = 0;j < event.length;j++){
                    console.log(event[j].venue.name)
                    console.log(event[j].venue.city,event[j].venue.region)
                    console.log(event[j].datetime)
                //    var  date = moment(day).format(MM-DD-YYYY)
                    // console.log
                }
            }else {
                console.log(error)
              }
        })
    })
}
function runSpotify(){
    inquirer.prompt([
        {
          type: "input",
          name: "song",
          message: "Please enter the song of your choice",
        }
    ]).then(function(userInput){
        var song = userInput.song;
        console.log(song)
        spotify.search({type: "track", query: song},function(err,data){
            console.log(data,)
        })
    })
}
function runMovie(){
    inquirer.prompt([
        {
          type: "input",
          name: "movie",
          message: "Please enter the movie of your choice",
        }
    ]).then(function(userInput){
        var movie =(userInput.movie)
        console.log(movie)
        var queryURL = "https://www.omdbapi.com/?t=Jaws&y=&plot=short&apikey=trilogy";
        request(queryURL,function(error,response,body){
            console.log(response)
            if (!error ) {

                var movieInfo = JSON.parse(body);
                // console.log(movieInfo)
            }
        })
    })

}