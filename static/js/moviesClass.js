"use strict"

export const APIKEY = "5f962c263d7b0f3d4790f1a7fec62185"

export class Movie {
  constructor(name, year, poster_path, overview, movieID, trailerLink, watchLink, reviews, cast) {
    this.name = name
    this.year = year.split("-")[0]
    this.poster_path = poster_path
    this.overview = overview
    this.trailerLink = trailerLink
    this.watchLink = watchLink
    this.reviews = []
    this.cast = []
    this.movieID = movieID
  }

  async getTrailerLink() {
    let response = await axios.get(`https://api.themoviedb.org/3/movie/${this.movieID}/videos?api_key=${APIKEY}&language=en-US`)

    return response.data
  }

  createTrailerLink() {
    this.getTrailerLink().then(data => {
      if (data.results.length > 0) {
        this.trailerLink = `https://www.youtube.com/watch?v=${data.results[0].key}`
        document.querySelector(".trailer").setAttribute("href", this.trailerLink)
      }
      else {
        document.querySelector(".trailer").removeAttribute("href")
      }
    })
  }

  async getWatchLink() {
    let response = await axios.get(`https://api.themoviedb.org/3/movie/${this.movieID}/watch/providers?api_key=${APIKEY}`)

    return response.data
  }

  createWatchLink() {
    this.getWatchLink().then(data => {
      if (data.results.US) {
        this.watchLink = data.results.US.link
        document.querySelector(".watchLink").setAttribute("href", this.watchLink)
      }
      else {
        document.querySelector(".watchLink").removeAttribute("href")
      }
    })
  }

  async getReviews() {
    let response = await axios.get(`https://api.themoviedb.org/3/movie/${this.movieID}/reviews?api_key=${APIKEY}`)

    response.data.results.forEach((review) => this.reviews.push(review))

    return response.data

  }

  createReviews() {
    this.getReviews().then(data => {
      for (let review of this.reviews) {
        let temp = `
          <li>
            <h4 class = "reviewUser">${review.author}</h4>
            <h5>${review.author_details.rating}/10</h5>
            <p>${review.content}</p>
          </li>
        `

        document.querySelector(".reviewsUL").innerHTML += temp
      }
    })
  }

  async getCast() {
    let response = await axios.get(`https://api.themoviedb.org/3/movie/${this.movieID}/credits?api_key=${APIKEY}&language=en-US`)

    response.data.cast.forEach((cast) => this.cast.push(cast))

    return response.data
  }

  createCast() {
    this.getCast().then(data => {
      for (let i of this.cast) {
        if (!i) { return }

        let temp = `
          <li class = "castLi"> 
            <img class = "profilePic" src = "https://image.tmdb.org/t/p/w500${i.profile_path}"></img>
            <div>
              <h4 class = "character">${i.character}</h4>
              <h5>${i.name}</h5>
            </div>
          </li>
        `

        document.querySelector(".castUL").innerHTML += temp;
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

  static clearModal() {
    for (let i of document.querySelectorAll("li")) {
      i.remove()
    }
  }

  addToModal() {
    Movie.clearModal()
    this.createTrailerLink()
    this.createWatchLink()
    this.createReviews()
    this.createCast()

    document.querySelector("#modalImage").setAttribute("src", this.poster_path)
    document.querySelector(".modalTitle").innerText = this.name
    document.querySelector(".releaseDate").innerText = this.year
    document.querySelector(".modalDescription").innerText = this.overview
    document.querySelector(".infoModal").style.display = "block";
  }
}