"use strict"
const APIKEY = "5f962c263d7b0f3d4790f1a7fec62185"

let currentGenera = document.querySelector("#actionGeneraButton").getAttribute("aria-label")
let currentPage = 1

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

async function getFeaturedMovies(featuredType) {
  let response = await axios.get(`https://api.themoviedb.org/3/movie/${featuredType}?api_key=${APIKEY}&language=en-US&page=${currentPage}`)

  for (let movies of response.data.results) {
    const { original_title, release_date, poster_path, overview, id } = movies
    let newMovie = new Movie(original_title, release_date, `https://image.tmdb.org/t/p/w500${poster_path}`, overview, id)
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

      newImage.addEventListener("click", () => moviesObj[featuredType][i].addToModal())

      document.querySelector(`#${featuredType}`).appendChild(newPosterContainer)
    }
  })
}

async function getAllMovies(generaNumber) {
  let response = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${APIKEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${currentPage}&with_genres=${generaNumber}&with_watch_monetization_types=flatrate`)
  let newMovie
  for (let movie of response.data.results) {
    const { original_title, release_date, poster_path, overview, id } = movie
    newMovie = new Movie(original_title, release_date, `https://image.tmdb.org/t/p/w500${poster_path}`, overview, id)
    moviesObj[generaNumber].push(newMovie)
    newMovie.addToMain()
  }

  return newMovie
}

function clearAllMovies() {
  for (let movie of document.querySelectorAll(".generaMovie")) {
    movie.remove();
  }
}

function clearModal() {
  for (let i of document.querySelectorAll("li")) {
    i.remove()
  }
}

setFeaturedMovies("popular")
setFeaturedMovies("top_rated")
getAllMovies(currentGenera)
document.querySelector("#loadMoreButton").click()

document.querySelector("#loadMoreButton").addEventListener("click", () => {
  currentPage += 1
  getAllMovies(currentGenera)
})

for (let buttons of document.querySelectorAll(".generasButton")) {
  buttons.addEventListener("click", () => {
    currentGenera = buttons.getAttribute("aria-label");
    document.querySelector(".selectedGenera").classList.remove("selectedGenera")
    buttons.classList.add("selectedGenera")

    clearAllMovies()
    if (moviesObj[currentGenera].length == 0) {
      getAllMovies(currentGenera)
    } else {
      moviesObj[currentGenera].forEach(movie => movie.addToMain())
    }
  })
}

document.addEventListener("scroll", function (event) {
  let offset = window.scrollY / (document.body.offsetHeight - window.innerHeight)

  if (offset > 0.85) {
    currentPage = currentPage + 1
    getAllMovies(currentGenera)
  }
})

// Get the modal
var infoModal = document.querySelector(".infoModal");

// Get the <span> element that closes the modal
var infoSpan = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
infoSpan.onclick = function () {
  infoModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == infoModal) {
    infoModal.style.display = "none";
  }
}
