"use strict"
const APIKEY = "5f962c263d7b0f3d4790f1a7fec62185"

let currentGenera = document.querySelector("#actionGeneraButton").getAttribute("aria-label")

for (let buttons of document.querySelectorAll(".generasButton")) {
  buttons.addEventListener("click", () => {
    currentGenera = buttons.getAttribute("aria-label");
    document.querySelector(".selectedGenera").classList.remove("selectedGenera")
    buttons.classList.add("selectedGenera")

    clearAllMovies()
    setAllMovies(currentGenera)
  })
}

let moviesObj = {
  "popular": [],
  "top_rated": [],
  28: [], //Action
  35: [], //Comedy
  27: [], //Horror
  10749: [], //Romance
  878: [], //Science Fiction
  99: [], //Documentary
  36: [] //History
}

class Movie {
  constructor(name, year, poster_path, overview, movieID, trailerLink, watchLink, reviews, cast) {
    this.name = name
    this.year = year
    this.poster_path = poster_path
    this.overview = overview
    this.trailerLink = trailerLink
    this.watchLink = watchLink
    this.reviews = [reviews]
    this.cast = [cast]
    this.movieID = movieID
  }

  getTrailerLink() {
    fetch(`https://api.themoviedb.org/3/movie/${this.movieID}/videos?api_key=${APIKEY}&language=en-US`).then(response => response.json())
      .then(data => {
        if (data.results.length > 0) {
          this.trailerLink = `https://www.youtube.com/watch?v=${data.results[0].key}`
        }
      })
  }

  getWatchLink() {
    fetch(`https://api.themoviedb.org/3/movie/${this.movieID}/watch/providers?api_key=${APIKEY}`).then(response => response.json())
      .then(data => {
        if (data.results.US) {
          this.watchLink = data.results.US.link
        }
      })
  }

  getReviews() {
    fetch(`https://api.themoviedb.org/3/movie/${this.movieID}/reviews?api_key=${APIKEY}&language=en-US&page=1`).then(response => response.json())
      .then(data => {
        data.results.forEach((review) => this.reviews.push(review))
      })
  }

  getCast() {
    fetch(`https://api.themoviedb.org/3/movie/${this.movieID}/credits?api_key=${APIKEY}&language=en-US`).then(response => response.json())
      .then(data => {
        data.cast.forEach((person) => this.cast.push(person))
      })
  }
}

async function getFeaturedMovies(featuredType) {
  let response = await axios.get(`https://api.themoviedb.org/3/movie/${featuredType}?api_key=${APIKEY}&language=en-US&page=1`)

  for (let movies of response.data.results) {
    const { original_title, release_data, poster_path, overview, id } = movies
    let newMovie = new Movie(original_title, release_data, `https://image.tmdb.org/t/p/w500${poster_path}`, overview, id)
    moviesObj[featuredType].push(newMovie)
  }
}

function setFeaturedMovies(featuredType) {
  getFeaturedMovies(featuredType).then(() => {
    for (let i = 0; i < moviesObj[featuredType].length; i++) {
      let newPosterContainer = document.createElement("div")
      newPosterContainer.classList.add("carousel-item")

      if (i == 0) {
        newPosterContainer.classList.add("active")
      }

      let newImage = document.createElement("img")
      newImage.setAttribute("src", moviesObj[featuredType][i].poster_path)
      newImage.classList.add("d-block", "w-100")
      newPosterContainer.appendChild(newImage)

      document.querySelector(`#${featuredType}`).appendChild(newPosterContainer)
    }
  })
}

async function getAllMovies(generaNumber) {
  let response = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${APIKEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=${generaNumber}&with_watch_monetization_types=flatrate`)
  for (let movie of response.data.results) {
    const { original_title, release_data, poster_path, overview, id } = movie
    let newMovie = new Movie(original_title, release_data, `https://image.tmdb.org/t/p/w500${poster_path}`, overview, id)
    moviesObj[generaNumber].push(newMovie)
  }
}

async function setAllMovies (generaNumber) {
  if(moviesObj[generaNumber].length == 0) {
    await getAllMovies(generaNumber)
  }

  for(let movie of moviesObj[generaNumber]) {
    let newImage = document.createElement("img")
    newImage.setAttribute("src", movie.poster_path)
    newImage.classList.add("generaMovie")

    document.querySelector("#moviesContainer").appendChild(newImage)
  }
}

function clearAllMovies() {
  for (let movie of document.querySelectorAll(".generaMovie")) {
    movie.remove();
  }
}

setFeaturedMovies("popular")
setFeaturedMovies("top_rated")
setAllMovies(currentGenera)
