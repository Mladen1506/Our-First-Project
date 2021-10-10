//variable to store a reference to DOM element
var foodishEl = document.querySelector("#image-div");
var movieEl = document.querySelector(".movie-info");
var btn = document.querySelector(".button");
var movieDetailEl = document.querySelector(".movie-details");


// 5 movies for each genre
// randomly select with Math.random
var genreAction = ['Gladiator', 'Black Panther', 'Kill Bill', 'John Wick', 'Die Hard'];
var genreComedy = ['Shaun of the Dead', 'Kiss Kiss, Bang Bang', 'The 40-Year-Old Virgin', 'Borat', 'Superbad'];
var genreDrama = ['Citizen Kane', 'Parasite', 'Casablanca', 'Knives Out', 'Lady Bird'];
var genreFantasy = ['The Hobbit', 'Harry Potter and the Chamber of Secrets', 'Solomon Kane', 'Clash of the Titans', 'The Forbidden Kingdom'];
var genreSciFi = ['The Wizard of Oz', 'Avengers: Endgame', 'Toy Story 4', 'Spider-Man', 'Wonder Woman'];
var genreHorror = ["Rosemary's Baby", "The Exorcist", "The Conjuring", "Scream", "Sinister"];
var genreMystery = ["The Girl on the Train", "Clue", "The Fugitive", "Donnie Darko", "Mystic River"];
var genreRomance = ["Love Actually", "The Notebook", "Dirty Dancing", "Pretty Woman", "Titanic"];
var genreThriller = ["Split", "Basic Instinct", "Memento", "Eyes Wide Shut", "Candyman"];

// display genre in console
var getSelectedGenre = function () {
  var getGenres = document.getElementById("genres");
  var selectedGenre = getGenres.options[getGenres.selectedIndex].text;


  //random selection of movie from array based on user genre selection
  if (selectedGenre === "Action") {
    var movieChoice = genreAction[Math.floor(Math.random() * genreAction.length)];
    console.log(movieChoice);
  }
  else if (selectedGenre === "Comedy") {
    var movieChoice = genreComedy[Math.floor(Math.random() * genreComedy.length)];
  }
  else if (selectedGenre === "Drama") {
    var movieChoice = genreDrama[Math.floor(Math.random() * genreDrama.length)];
  }
  else if (selectedGenre === "Fantasy") {
    var movieChoice = genreFantasy[Math.floor(Math.random() * genreFantasy.length)];
  }
  else if (selectedGenre === "Sci-Fi") {
    var movieChoice = genreSciFi[Math.floor(Math.random() * genreSciFi.length)];
  }
  else if (selectedGenre === "Horror") {
    var movieChoice = genreHorror[Math.floor(Math.random() * genreHorror.length)];
  }
  else if (selectedGenre === "Mystery") {
    var movieChoice = genreMystery[Math.floor(Math.random() * genreMystery.length)];
  }
  else if (selectedGenre === "Romance") {
    var movieChoice = genreRomance[Math.floor(Math.random() * genreRomance.length)];
  }
  else if (selectedGenre === "Thriller") {
    var movieChoice = genreThriller[Math.floor(Math.random() * genreThriller.length)];
  }
  // first API call to OMDB
  // format api url
  var apiUrl = "https://www.omdbapi.com/?t=" + movieChoice + "&apikey=8a73c1f2";
  movieEl.innerHTML = "";
  //make api request
  fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      //grabs the details of the movie from the API
      var movieTitle = data["Title"];
      var movieRatingS = data.Ratings[1].Source;
      var movieRatingV = data.Ratings[1].Value;
      var movieYear = data["Year"];
      var movieActors = data["Actors"];
      var moviePlot = data["Plot"];
      console.log(movieRatingS, movieRatingV);
      // post movie details above poster - TRY AND GET TO RIGHT SIDE OF POSTER
      movieDetailEl.innerHTML = "Title: " + movieTitle + "<br>" + "Year: " + movieYear + "<br>" +
        "Actors: " + movieActors + "<br>" + "Plot: " + moviePlot + "<br>" + "Rating: " + movieRatingS + " - " + movieRatingV + "<br><br>";


      // movie poster will appear for each movie
      var moviePic = data['Poster'];

      var moviePoster = new Image();
      moviePoster.src = moviePic;
      moviePoster.alt = data['Plot'];
      moviePoster.setAttribute('style', 'height:auto; width:100%');
      movieEl.append(moviePoster);
      // call setMovies to local storage here
      setMovieToLocalStorage(movieTitle);

    });


  //second api call to foodish
  // format api url
  var foodishApiUrl = "https://foodish-api.herokuapp.com/api";
  foodishEl.innerHTML = "";
  //make api request
  fetch(foodishApiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);

      Object.keys(data).forEach((key) => {
        // create image element
        var imageEl = document.createElement("img");
        //insert image to image element
        imageEl.setAttribute('src', data[key]);
        imageEl.setAttribute('style', 'height:auto; width:100%');
        //append to <div> container
        foodishEl.appendChild(imageEl);
      });
    });
}

btn.addEventListener("click", function () {
  getSelectedGenre();
})

// FUNCTION to save random movie suggestions to localStorage using `setItem()`
function setMovieToLocalStorage(title) {
  // add movie to local storage, if no movies yet set empty array
  var movieArray = JSON.parse(localStorage.getItem('movieTitles')) || [];
  //add titel to array
  movieArray.push(title);
  //save array to local storage
  localStorage.setItem('movieTitles', JSON.stringify(movieArray));
  //call get movies from local storage
  getMoviesFromLocalStorage()
  
}
//FUNCTION to get movies from local storage for display
function getMoviesFromLocalStorage() {
  //create container 
  var previousResultsHolder = document.getElementById("previous-searches")
  //empty innerHTML before displaying titles
  previousResultsHolder.innerHTML = ""
  // get movies from local storage
  var movieArray = JSON.parse(localStorage.getItem('movieTitles')) || [];
  //if no movies yet display message to user
  if (movieArray.length <= 0) {
    var h3 = document.createElement("h3")
    h3.textContent = "no searches yet"
    previousResultsHolder.appendChild(h3)
  }
  //if movies thencreate list items and append to container
  else {
    var ul = document.createElement("ul")
    for (i = 0; i < movieArray.length; i++) {
      var li = document.createElement("li")
      li.textContent = movieArray[i];
      ul.appendChild(li)
    }
    previousResultsHolder.appendChild(ul);
  }

}
// clear the local storage
function clearMoviesFromLocalStorage() {
  localStorage.clear()
  // CALL get movies from local storage
  getMoviesFromLocalStorage()

}
//event listener button to clear title history
document.getElementById("clear-previous-searches").addEventListener("click", clearMoviesFromLocalStorage)