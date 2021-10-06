"use strict"

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
      fetch(`https://api.themoviedb.org/3/movie/${this.movieID}/reviews?api_key=${APIKEY}`).then(response => response.json())
        .then(data => {
          for (let review of data.results) {
            let newReview = document.createElement("li");
  
            let reviewUser = document.createElement("h4");
            reviewUser.classList.add("reviewUser")
            reviewUser.innerText = review.author;
            newReview.appendChild(reviewUser);
  
            let reviewPoints = document.createElement("h5");
            reviewPoints.innerText = `${review.author_details.rating}/10`
            newReview.appendChild(reviewPoints);
  
            let reviewContent = document.createElement("p");
            reviewContent.innerHTML = review.content;
            newReview.appendChild(reviewContent);
  
            document.querySelector(".reviewsUL").appendChild(newReview);
          }
        })
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