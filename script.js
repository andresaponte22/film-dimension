/** JAVASCRIPT CODE OUTLINE
 * - variable declarations
 * - functions
 *       - initalise
 *       - handle user submissions
 *       - fetch API data
 *       - localStorage
 *       - display results to pages
 * - event listeners
 * - list functions to call upon page load
 */

// ---- Variable declarations ---- 

// Reference to important DOM elements
// e.g. var [nameEl] = document.querySelector('#[id]');
var movieTitleInput = document.querySelector("#movieTitle")
var genreChoiceEl = document.querySelector('#genreChoice')
var searchButton = document.querySelector('#searchBtn')
var searchHistoryEl = document.querySelector('#searchHistory')

var metaScoreEl = document.querySelector("#metaScore");
var imdbScoreEl = document.querySelector("#imdbScore");
var reviewsEl = document.querySelectorAll(".reviews");
var criticEl = document.querySelectorAll(".critic");
var quoteEl = document.querySelectorAll(".quote");
var urlEl = document.querySelectorAll(".url");
var youtubeEl = document.querySelector("#movieTrailer-container")
var genreResultsContainerEl = document.querySelector("#genreResults-container");

// Global Variables
var pastSearches = [];
var pastSearchesID = []
var apiKeyImbd = "6fe8f8382cmsh92b517b93c8e6dap1c91a6jsn33a3741aafbd"
var apiKeyYoutube = "6fe8f8382cmsh92b517b93c8e6dap1c91a6jsn33a3741aafbd"
var movieTitle = movieTitleInput.value;

// ---- Functions ---- 

// ---- Functions to fetch API data  ---- 

// Function - YouTube API fetch here - search the API
function youtubeApi(movie) {

  if (movieTitleInput.value) {
    // Movie title from search - not genre list
    movieTitle = movieTitleInput.value;
  } else {
    // Movie title from search history
    movieTitle = movie;
  }

  youtubeEl.innerHTML = '';

  fetch(`https://youtube-search-results.p.rapidapi.com/youtube-search/?q=${movieTitle} official trailer`, {
    "method": "GET",
    "headers": {
      "x-rapidapi-key": apiKeyYoutube,
      "x-rapidapi-host": "youtube-search-results.p.rapidapi.com"
    }
  })
  .then(response => {
    return response.json()
  })
  .then(function(data) {
  
    movieURL = data.items[1].url.split("https://www.youtube.com/watch?v=")[1];
    
    // embedded video to display on html
    var obj = {video: {
      value: `<iframe title='YouTube video player' type=\"text/html\" width='640' height='390' src='https://www.youtube.com/embed/${movieURL}' frameborder='0' allowFullScreen></iframe>`
    }}
    // youtubeEl.write(obj.video.value)
    let youtubeValue = obj.video.value
    youtubeEl.innerHTML = youtubeValue
  })
  .catch(err => {
    console.error(err);
  });
}

// Function - get details of movies from popular by genre fetch request
function getGenreMovieDetails(searchResults) {
  movieTitleInput.value = '';
  var movieID;
  var moviesDetails = [];

  for (i = 0; i < searchResults.length; i++) {
    movieID = searchResults[i];

    var requestUrl = `https://imdb8.p.rapidapi.com/title/get-reviews?tconst=${movieID}&currentCountry=CA&purchaseCountry=CA`   
    
    fetch(requestUrl, {
    "method": "GET",
    "headers": {
    "x-rapidapi-key": apiKeyImbd,
    "x-rapidapi-host": "imdb8.p.rapidapi.com"
    }
    })
    .then(response => {
      return response.json();
    })
    .then(function(data) {
        
        var movie = {
          imbdTitle: data.imdbrating.title,
          imbdYear: data.imdbrating.year,
          imbdRating: data.imdbrating.rating,
          movieID: data.imdbrating.id
        }

        movie.movieID = movie.movieID.slice(7); // remove "/title/" from id string
        movie.movieID = movie.movieID.substring(0, movie.movieID.length - 1); // remove "/" at end of string to get movie ID on its own

        moviesDetails.push(movie)
        
        if(moviesDetails.length === searchResults.length) {
          displayGenreResults(moviesDetails);
        }
    })
    .catch(err => {
      console.error(err);
    });
  }
  return;
}

// Function - Get top movies IDs by Genre
function getPopularByGenre() {
  
  var genre = localStorage.getItem("genreChoice");

  var searchResults = '';
  searchResults = [];

  var requestUrl = `https://imdb8.p.rapidapi.com/title/get-popular-movies-by-genre?genre=%2Fchart%2Fpopular%2Fgenre%2F${genre}`;

  fetch(requestUrl, {
    "method": "GET",
    "headers": {
      "x-rapidapi-key": apiKeyImbd,
      "x-rapidapi-host": "imdb8.p.rapidapi.com"
    }
  })
  .then(response => {
    return response.json();
  })
  .then(function(data) {
    
    // Assign movie IDs of a few popular movies from a user identified genre to an array
    for (i=0; i < 4; i++) {
      searchResults[i] = data[i];
      searchResults[i] = searchResults[i].slice(7); // remove "/title/" from results string
      searchResults[i] = searchResults[i].substring(0, searchResults[i].length - 1); // remove "/" at end of string to get movie ID on its own
    };
    getGenreMovieDetails(searchResults);
  })
  .catch(err => {
    console.error(err);
  });
}

// Function - Get Movie ID - search the API
function getMovieID() {

    var movieID;

    // Get list of records matching user movie title input, select first record and assign to 'movieID' variable
    var requestUrl = `https://imdb8.p.rapidapi.com/auto-complete?q=${movieTitleInput.value}`   
    fetch(requestUrl, {
	    "method": "GET",
	    "headers": {
		  "x-rapidapi-key": apiKeyImbd,
		  "x-rapidapi-host": "imdb8.p.rapidapi.com"
	  }
    })
    .then(response => {
        return response.json();
    })
    .then(function(data) {
        movieID = data.d[0].id;
        getMovieReview(movieID);
        saveSearch(movieID)
    })
    .catch(err => {
	    console.error(err);
    });
}

// Function - get movie review results based on movieID & display
function getMovieReview (movieID) {

    // Get review data for movie based on 'movieID' variable
    var requestUrl = `https://imdb8.p.rapidapi.com/title/get-reviews?tconst=${movieID}&currentCountry=CA&purchaseCountry=CA`   
    var metaScore;
    var imbdRating;

    fetch(requestUrl, {
	  "method": "GET",
	  "headers": {
		"x-rapidapi-key": apiKeyImbd,
		"x-rapidapi-host": "imdb8.p.rapidapi.com"
	  }
    })
    .then(response => {
	    return response.json();
    })
    .then(function(data) {
        
        metaScore = data.metacritic.metaScore;      
        imbdRating = data.imdbrating.rating;

        // DISPLAY CRITIC SCORES***--------------
        metaScoreEl.innerHTML = "Metascore: "+data.metacritic.metaScore;
        imdbScoreEl.innerHTML = "IMDB Rating: "+data.imdbrating.rating;

        
        // DISPLAY CRITIC REVIEWS AND LINKS--------------
        let index = 0;
        for (i=0; i < data.metacritic.reviews.length; i++) {
          
          // Quote from Critic
          let quoteActual = data.metacritic.reviews[i].quote;
          quoteEl[index].innerHTML = '"'+quoteActual+'"';

          // Critic Name Displayed as a Link to the Review
          let urlLink = data.metacritic.reviews[i].reviewUrl;
          let criticName = data.metacritic.reviews[i].reviewSite;
          var criticUrl = {link: "<a href='"+urlLink+"'>"+criticName+"</a>"}
          urlEl[index].innerHTML = criticUrl.link.valueOf()
          index++;
        }

    })
    .catch(err => {
	    console.error(err);
    });
}

// ---- Function to update localStorage ---- 

// Function - Update variables and localStorage related to saved/searched movie titles, then call function to display on page
function updateSearchHistory(search, movieID) {
  searchList = document.createElement("li")
  searchList.appendChild(document.createTextNode(search))
  searchList.setAttribute("id", movieID)
  searchList.addEventListener("click", function(event) {
    movieTitleInput.value = '' 
    getMovieReview(event.target.getAttribute("id"))
    youtubeApi(search)
  })
  searchHistoryEl.prepend(searchList)
}

// ---- Functions to update display on pages ---- 

// Function - Display movie listing based on genre results, clickable movie info
function displayGenreResults (moviesDetails) {

  genreResultsContainerEl.innerHTML = "";

  // To display actual results
  for (var i = 0; i < moviesDetails.length; i++) {
    
    var movieEl = document.createElement("div");
    var movieTitleEl = document.createElement("h5");
    var movieYearEl = document.createElement("p");
    var movieImbdRatingEl = document.createElement("p");
    var movieButtonEl = document.createElement("button");

    movieButtonEl.setAttribute("genre-id", moviesDetails[i].movieID);
    movieButtonEl.setAttribute("genre-title", moviesDetails[i].imbdTitle);

    movieButtonEl.classList = "btn-genre-item waves-effect waves-light btn-small cyan darken-1 btn";
    movieTitleEl.classList = "genre-title";

    movieEl.classList = "genre-item";
    movieEl.style.color = '#00acc1'
    movieEl.style.borderRadius = '10px';
    movieEl.style.margin = '10px';  
    movieEl.style.padding = '5px';
    movieEl.style.color = '#00acc1';

    movieTitleEl.textContent = `${moviesDetails[i].imbdTitle}`;
    movieYearEl.textContent = `${moviesDetails[i].imbdYear}`;
    movieImbdRatingEl.textContent = `IMBd rating: ${moviesDetails[i].imbdRating}/10`;
    movieButtonEl.textContent = `Learn More`;
    
    movieEl.appendChild(movieTitleEl);
    movieEl.appendChild(movieYearEl);
    movieEl.appendChild(movieImbdRatingEl);
    movieEl.appendChild(movieButtonEl);

    genreResultsContainerEl.appendChild(movieEl);
  }
  return;
};


// Function - Display searched movies on main page 
function saveSearch(id) {
  var search = movieTitleInput.value
  var searchID = id
  if (pastSearches.includes(search) === false) {
    pastSearches.push(search)
    pastSearchesID.push(searchID)
    localStorage.setItem("searchHistoryTitle", JSON.stringify(pastSearches))
    localStorage.setItem("searchHistoryID", JSON.stringify(pastSearchesID))
    updateSearchHistory(search, searchID)
  } else {
    return
  }
}                   


// ---- Event listeners ---- 

// Event listener for dropdown menu of different genres
genreChoiceEl.addEventListener("change", function(event) {
  event.preventDefault()
  var genreChoice = genreChoiceEl.value;
  genreChoice = genreChoice.toLowerCase();
  localStorage.setItem("genreChoice", genreChoice)
  getPopularByGenre()
})

// Event listener for click on search button
searchButton.addEventListener("click", function(event) {
  event.preventDefault()
  
  genreResultsContainerEl.innerHTML = "";

  var movieTitle = document.querySelector("#movieTitle")

  localStorage.setItem("movieTitle", movieTitle.value)

  getMovieID();
  youtubeApi();
})

// Event listener for buttons for movies listed within genreResults-container
function handleGenreMovieClick(event) {
  event.preventDefault();

  var element = event.target;
  var genreMovieID;
  var genreMovieTitle;

  if (element.matches(".btn-genre-item")) {
    genreMovieID = element.getAttribute("genre-id");
    genreMovieTitle = element.getAttribute("genre-title");
    
    movieTitle = genreMovieTitle;
    genreResultsContainerEl.innerHTML = "";

    getMovieReview(genreMovieID);
    youtubeApi(movieTitle);
  }
  return;
}

// ---- Functions to call & event listeners  ---- 

genreResultsContainerEl.addEventListener("click", handleGenreMovieClick);