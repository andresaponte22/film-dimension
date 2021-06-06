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
// TO DO: Add global variables that will reference DOM elements
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
// TO DO: Define any variables with global scope excluding those referencing DOM elements already noted above

var pastSearches = [];
var pastSearchesID = []
var apiKeyImbd = "85d6732c5dmsh40c484b3b3afddcp18c9afjsna308e42c1988"
var apiKeyYoutube = "3598b8265cmsh45b2bdf797a68a4p11d2b1jsn8d213ce924ae"
var movieTitle = movieTitleInput.value;

// ---- Functions ---- 

// Function - Initialise web app
// TO DO: Create function that is run when page first loaded, e.g., get localStorage.









// ---- Functions to handle user form submissions ---- 

// Function - Handle form / search submit including calling search APIs
// TO DO: Create function that handles user submission (e.g., get movie title OR genre, check not blank, call APIs)





// ---- Functions to fetch API data  ---- 
// Function - YouTube API fetch here - search the API
// TO DO: Create YouTube API fetch

function youtubeApi(movie) {

  if (movieTitleInput.value) {
    movieTitle = movieTitleInput.value;
    console.log("movie title from search - not genre list")
  } else {
    movieTitle = movie
    console.log('movie title from search history')
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
    console.log(`youTube API \n----------`);
    console.log(data);
    movieURL = data.items[1].url.split("https://www.youtube.com/watch?v=")[1];
    console.log(`movieURL: ${movieURL}`);
    // embedded video to display on html
    var obj = {video: {
      value: `<iframe title='YouTube video player' type=\"text/html\" width='640' height='390' src='http://www.youtube.com/embed/${movieURL}' frameborder='0' allowFullScreen></iframe>`
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

  // console.log(`In getGenreMovieDetails\nSearch results movie details\n----------`);
  // console.log(searchResults);

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
          // rating: data.certificate.certificate,
          imbdRating: data.imdbrating.rating,
          // metaScore: data.metacritic.metaScore,
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
// TO DO: Increase number of movies included in searchResults once overall working - currently trying to limit API requests
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
    // console.log(`In getPopularBy Genre function\n4 Top Movies in ${genre} Genre\n----------`);
    // console.log(data);
    for (i=0; i < 4; i++) {
      searchResults[i] = data[i];
      searchResults[i] = searchResults[i].slice(7); // remove "/title/" from results string
      searchResults[i] = searchResults[i].substring(0, searchResults[i].length - 1); // remove "/" at end of string to get movie ID on its own
      // console.log(searchResults[i]);
    };
    getGenreMovieDetails(searchResults);
  })
  .catch(err => {
    console.error(err);
  });
}

// Function - Get Movie ID - search the API
// TO DO: Create movie database API fetch to get movie ID based on user movie title input
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
        console.log(data);
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
        console.log(data);
        
        metaScore = data.metacritic.metaScore;
        // console.log(`metaScore: ${metaScore}`);
        
        imbdRating = data.imdbrating.rating;
        // console.log(`IMBd rating: ${imbdRating}`);

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
    // var movieRatingEl = document.createElement("p");
    var movieImbdRatingEl = document.createElement("p");
    // var movieMetaScoreEl = document.createElement("p");
    var movieButtonEl = document.createElement("button");

    movieButtonEl.setAttribute("genre-id", moviesDetails[i].movieID);
    movieButtonEl.setAttribute("genre-title", moviesDetails[i].imbdTitle);

    movieButtonEl.classList = "btn-genre-item waves-effect waves-light btn-small";
    movieTitleEl.classList = "genre-title";

    movieEl.classList = "genre-item";
    movieEl.style.color = '#26a69a'
    movieEl.style.backgroundColor = 'white';
    movieEl.style.border = '1px solid #26a69a';
    movieEl.style.borderRadius = '10px';
    movieEl.style.margin = '10px';  
    movieEl.style.padding = '5px';
    movieEl.style.color = '#26a69a';

    movieTitleEl.textContent = `${moviesDetails[i].imbdTitle}`;
    movieYearEl.textContent = `${moviesDetails[i].imbdYear}`;
    // movieRatingEl.textContent = `${moviesDetails[i].rating}`;
    movieImbdRatingEl.textContent = `IMBd rating: ${moviesDetails[i].imbdRating}/10`;
    // movieMetaScoreEl.textContent = `metacritic metascore: ${moviesDetails[i].metaScore}/100`;
    movieButtonEl.textContent = `Learn More`;
    
    movieEl.appendChild(movieTitleEl);
    movieEl.appendChild(movieYearEl);
    // movieEl.appendChild(movieRatingEl);
    movieEl.appendChild(movieImbdRatingEl);
    // movieEl.appendChild(movieMetaScoreEl);
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
// TO DO: List any functions or event listeners that are to be called upon launch

genreResultsContainerEl.addEventListener("click", handleGenreMovieClick);