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

class Movie {
  constructor(name, year, poster_path, overview, movieID, trailerLink, watchLink, reviews, cast) {
    this.name = name
    this.year = year
    this.poster_path = poster_path
    this.overview = overview
    this.trailerLink = trailerLink
    this.watchLink = watchLink
    this.reviews = []
    this.cast = []
    this.movieID = movieID
  }

  getTrailerLink() {
    fetch(`https://api.themoviedb.org/3/movie/${this.movieID}/videos?api_key=${APIKEY}&language=en-US`).then(response => response.json())
      .then(data => {
        if (data.results.length > 0) {
          this.trailerLink = `https://www.youtube.com/watch?v=${data.results[0].key}`
          document.querySelector(".trailer").setAttribute("href", this.trailerLink)
        }
      })
  }

  getWatchLink() {
    fetch(`https://api.themoviedb.org/3/movie/${this.movieID}/watch/providers?api_key=${APIKEY}`).then(response => response.json())
      .then(data => {
        if (data.results.US) {
          this.watchLink = data.results.US.link
          document.querySelector(".watchLink").setAttribute("href", this.watchLink)
        }
      })
  }

  getReviews() {
    console.log("Not working")
  }

  getCast() {
    fetch(`https://api.themoviedb.org/3/movie/${this.movieID}/credits?api_key=${APIKEY}&language=en-US`).then(response => response.json())
      .then(data => {
        data.cast.forEach((person) => this.cast.push(person))
        for (let i of this.cast) {
          if (i) {
            let newCast = document.createElement("li");
            newCast.classList.add("castLi");

            let castInfoContainer = document.createElement("div");

            let profilePicture = document.createElement("img");
            profilePicture.classList.add("profilePic")
            profilePicture.setAttribute("src", `https://image.tmdb.org/t/p/w500${i.profile_path}`);
            newCast.appendChild(profilePicture);

            let character = document.createElement("h4");
            character.classList.add("character")
            character.innerText = i.character;
            castInfoContainer.appendChild(character);

            let realName = document.createElement("h5");
            realName.innerText = i.name
            castInfoContainer.appendChild(realName);

            newCast.appendChild(castInfoContainer);
            document.querySelector(".castUL").appendChild(newCast);
          }
        }
      })
  }

  addToMain() {
    let newImage = document.createElement("img")
    newImage.setAttribute("src", this.poster_path)
    newImage.classList.add("generaMovie")

    newImage.addEventListener("click", () => this.addToModal())

    document.querySelector("#moviesContainer").appendChild(newImage)
  }

  addToModal() {
    clearModal()
    this.getTrailerLink()
    this.getWatchLink()
    this.getReviews()
    this.getCast()

    document.querySelector("#modalImage").setAttribute("src", this.poster_path)
    document.querySelector(".modalTitle").innerText = this.name
    document.querySelector(".releaseDate").innerText = this.year.split("-")[0]
    document.querySelector(".modalDescription").innerText = this.overview
    document.querySelector(".infoModal").style.display = "block";
  }
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
