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
var genreChoice = document.querySelector('#genreChoice')
var searchButton = document.querySelector('#searchBtn')
var searchHistoryEl = document.querySelector('#searchHistory')

var metaScoreEl = document.querySelector("#metaScore");
var imdbScoreEl = document.querySelector("#imdbScore");
var reviewsEl = document.querySelectorAll(".reviews");
var criticEl = document.querySelectorAll(".critic");
var quoteEl = document.querySelectorAll(".quote");
var urlEl = document.querySelectorAll(".url");

var genreResultsContainerEl = document.querySelector("#genreResults-container");

// Global Variables
// TO DO: Define any variables with global scope excluding those referencing DOM elements already noted above

var pastSearches = [];
var pastSearchesID = []

// ENTER YOUR API KEYS BELOW BETWEEN THE SINGLE QUOTES - KEEP THE QUOTES - CAN BE THE SAME API KEY
var apiKeyImbd = 'YOUR API KEY FOR IMBd API'
var apiKeyYoutube = 'YOUR API KEY FOR YouTube Search Results API'

// ---- Functions ---- 

// Function - Initialise web app
// TO DO: Create function that is run when page first loaded, e.g., get localStorage.









// ---- Functions to handle user form submissions ---- 

// Function - Handle form / search submit including calling search APIs
// TO DO: Create function that handles user submission (e.g., get movie title OR genre, check not blank, call APIs)







// ---- Functions to fetch API data  ---- 
function youtubeApi() {
  
// Function - YouTube API fetch here - search the API
// TO DO: Create YouTube API fetch

fetch(`https://youtube-search-results.p.rapidapi.com/youtube-search/?q=${movieTitleInput.value} official trailer`, {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": apiKeyYoutube,
		"x-rapidapi-host": "youtube-search-results.p.rapidapi.com"
	}
})
.then(response => {
	// console.log(response);
  return response.json()
})
.then(function(data) {
  console.log(`youTube API \n----------`);
  console.log(data);
  movieURL = data.items[1].link.split("https://www.youtube.com/watch?v=")[1];
  console.log(`movieURL: ${movieURL}`);
  // embedded video to display on html
  var obj = {video: {
    value: `<iframe title='YouTube video player' type=\"text/html\" width='640' height='390' src='http://www.youtube.com/embed/${movieURL}' frameborder='0' allowFullScreen></iframe>`
  }}
  document.write(obj.video.value);
})
.catch(err => {
	console.error(err);
});
}

// Function - get details of movies from popular by genre fetch request
function getGenreMovieDetails(searchResults) {
  
  var movieID;
  var moviesDetails = [];

  // console.log(`In getGenreMovieDetails\nSearch results movie details\n----------`);

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
        console.log(data);
        
        var movie = {
          imbdTitle: data.imdbrating.title,
          imbdRating: data.imdbrating.rating,
          metaScore: data.metacritic.metaScore
        }
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
  
  var genreInput = 'horror'
  var requestUrl = `https://imdb8.p.rapidapi.com/title/get-popular-movies-by-genre?genre=%2Fchart%2Fpopular%2Fgenre%2F${genreInput}`;   
  var searchResults = [];

  fetch(requestUrl, {
    "method": "GET",
    "headers": {
      "x-rapidapi-key": apiKeyImbd,
      "x-rapidapi-host": "imdb8.p.rapidapi.com"
    }
  })
  .then(response => {
    // console.log(response);
    return response.json();
  })
  .then(function(data) {
    console.log(`In getPopularBy Genre function\n2 Top Movies in ${genreInput} Genre\n----------`);
    // console.log(data);
    for (i=0; i < 2; i++) {
      searchResults[i] = data[i];
      searchResults[i] = searchResults[i].slice(7); // remove "/title/" from results string
      searchResults[i] = searchResults[i].substring(0, searchResults[i].length - 1); // remove "/" at end of string to get movie ID on its own
      console.log(searchResults[i]);
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
	      // console.log(response);
        return response.json();
    })
    .then(function(data) {
        console.log(data);
        movieID = data.d[0].id;
        // console.log(`movieID: ${movieID}`);
        getMovieReview(movieID);
        saveSearch(movieID)

    })
    .catch(err => {
	    console.error(err);
    });
}

// Function - get movie review results based on movieID
// TO DO: Create function that gets movie review data
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
	    // console.log(response);
      return response.json();
    })
    .then(function(data) {
        console.log(data);
        
        metaScore = data.metacritic.metaScore;
        console.log(`metaScore: ${metaScore}`);
        

        imbdRating = data.imdbrating.rating;
        console.log(`IMBd rating: ${imbdRating}`);

        // DISPLAY CRITIC SCORES***--------------
        metaScoreEl.innerHTML = "Metascore: "+data.metacritic.metaScore;
        imdbScoreEl.innerHTML = "IMDB Rating: "+data.imdbrating.rating;

        
        // DISPLAY CRITIC REVIEWS AND LINKS--------------
        let index = 0;
        for (i=0; i < data.metacritic.reviews.length; i++) {
          
          // reviewsEl.innerHTML = ""
          let criticName = data.metacritic.reviews[i].reviewSite;
          criticEl[index].innerHTML= criticName;

          let quoteActual = data.metacritic.reviews[i].quote;
          quoteEl[index].innerHTML = '"'+quoteActual+'"';

          let urlLink = data.metacritic.reviews[i].reviewUrl;
          // urlEl[index].innerHTML = "URL: "+urlLink
          var criticUrl = {link: "<a href='"+urlLink+"'>"+urlLink+"</a>"}
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
// TO DO: Create function that will update searched/saved movie list variables & localStorage then call funciton to update display on page
function updateSearchHistory(search) {
  searchList = document.createElement("li")
  searchList.appendChild(document.createTextNode(search))
  searchHistoryEl.appendChild(searchList)
}








// ---- Functions to update display on pages ---- 

// Function - Display YouTube video to main page
// TO DO: Create function that will add YouTube API result to main page










// Function - Display IMBd movie critic reviews & scores to main page
// TO DO: Create function that will add movie reviews and scores to main page










// Function - Display movie listing based on genre results on second page, clickable movie info
// TO DO: Create function that will add Rotten Tomates API movie list based on genre, clickable to display on main page

function displayGenreResults (moviesDetails) {

  for (var i = 0; i < moviesDetails.length; i++) {
    
    var movieEl = document.createElement("div");
    var movieTitleEl = document.createElement("h2");
    var movieImbdRatingEl = document.createElement("p");
    var movieMetaScoreEl = document.createElement("p");

    movieTitleEl.textContent = `Movie title: ${moviesDetails[i].imbdTitle}`;
    movieImbdRatingEl.textContent = `Movie IMBd rating: ${moviesDetails[i].imbdRating}`;
    movieMetaScoreEl.textContent = `Movie meta score: ${moviesDetails[i].metaScore}`;
    
    movieEl.appendChild(movieTitleEl);
    movieEl.appendChild(movieImbdRatingEl);
    movieEl.appendChild(movieMetaScoreEl);

    genreResultsContainerEl.appendChild(movieEl);
  }
  return;
};


// Function - Display saved / searched (?) movies on main page 
// TO DO: Create function that will display saved/searched movies to main page
function saveSearch(id) {
  var search = movieTitleInput.value
  var searchID = id
  pastSearches.push(search)
  pastSearchesID.push(searchID)
  localStorage.setItem("searchHistoryTitle", JSON.stringify(pastSearches))
  localStorage.setItem("searchHistoryID", JSON.stringify(pastSearchesID))
  updateSearchHistory(search)
}








// ---- Event listeners ---- 

// TO DO: Create event listeners 
// e.g. languageButtonsEl.addEventListener('click', buttonClickHandler);

//Event listener for click on search button
searchButton.addEventListener("click", function(event) {
  event.preventDefault()
  
  var movieTitle = document.querySelector("#movieTitle")

  localStorage.setItem("movieTitle", movieTitle.value)

  getMovieID();
  youtubeApi();
})







// ---- Functions to call  ---- 

// TO DO: List any functions that are to be called upon main page load

// getPopularByGenre();
