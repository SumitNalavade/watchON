let currentGenera = document.querySelector("#actionGeneraButton").getAttribute("aria-label")

for (let i of document.querySelectorAll(".generasButton")) {
  i.addEventListener("click", () => {
    currentGenera = i.getAttribute("aria-label");
    assignSelectedGeneraColor();
    clearGeneraContainer();
    addToGeneraContainer(`https://api.themoviedb.org/3/discover/movie?api_key=5f962c263d7b0f3d4790f1a7fec62185&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=${currentGenera}&with_watch_monetization_types=flatrate`)
  })
}

async function getMovies(APIURL) {
  let getMoviesPromise = await axios.get(APIURL)
  return getMoviesPromise.data.results
}

//Collcts the data from getMovies using a content type (popular, top_rated etc...) and calls the helper function to add image posters
function getPopularAndTopRatedMovies(APIURL, content) {
  getMovies(APIURL).then(response => {
    for (let i = 0; i < response.length; i++) {
      if (i === 0) {
        createPosters2(response[i].poster_path, true, content)
      } else {
        createPosters2(response[i].poster_path, false, content)
      }
    }
  })
}

//Helper for getPopularAndTopRatedMovies that makes the imagePosters and appends it to the page
function createPosters2(imageURL, isActive, content) {
  let newPosterContainer = document.createElement("div");
  newPosterContainer.classList.add("carousel-item")
  if (isActive) {
    newPosterContainer.classList.add("active");
  }

  let newImage = document.createElement("img");
  newImage.setAttribute("src", `https://image.tmdb.org/t/p/w500${imageURL}`)
  newImage.classList.add("d-block", "w-100")
  newPosterContainer.appendChild(newImage);

  if (content == "popular") {
    document.querySelector("#popular").appendChild(newPosterContainer);
  } else if (content == "top_rated") {
    document.querySelector("#top_rated").appendChild(newPosterContainer);
  }

}

function addToGeneraContainer(APIURL) {
  getMovies(APIURL).then(response => {
    for (let i of response) {
      let newImage = document.createElement("img");
      newImage.setAttribute("src", `https://image.tmdb.org/t/p/w500${i.poster_path}`)
      document.querySelector("#moviesContainer").appendChild(newImage)
    }
  });
}
function clearGeneraContainer () {
  for(let i of document.querySelector("#moviesContainer").children) {
    i.remove()
  }
}

function assignSelectedGeneraColor() {
  for (let i of document.querySelectorAll(".generasButton")) {
    if (i.getAttribute("aria-label") == currentGenera) {
      i.classList.add("selectedGenera")
    } else {
      i.classList.remove("selectedGenera")
    }
  }
}

getPopularAndTopRatedMovies("https://api.themoviedb.org/3/movie/popular?api_key=5f962c263d7b0f3d4790f1a7fec62185&language=en-US&page=1", "popular")
getPopularAndTopRatedMovies("https://api.themoviedb.org/3/movie/top_rated?api_key=5f962c263d7b0f3d4790f1a7fec62185&language=en-US&page=1", "top_rated")
addToGeneraContainer(`https://api.themoviedb.org/3/discover/movie?api_key=5f962c263d7b0f3d4790f1a7fec62185&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=${currentGenera}&with_watch_monetization_types=flatrate`)
