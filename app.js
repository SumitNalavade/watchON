let movies = {
  28: [],
  35: [],
  27: [],
  10749: [],
  878: [],
  99: []
}

let currentPage = 2

let currentGenera = document.querySelector("#actionGeneraButton").getAttribute("aria-label")

for (let i of document.querySelectorAll(".generasButton")) {
  i.addEventListener("click", () => {
    currentGenera = i.getAttribute("aria-label");
    assignSelectedGeneraColor();
    clearGeneraContainer();
    addToGeneraContainer(`https://api.themoviedb.org/3/discover/movie?api_key=5f962c263d7b0f3d4790f1a7fec62185&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${currentPage}&with_genres=${currentGenera}&with_watch_monetization_types=flatrate`, currentGenera)
  })
}

document.querySelector("#loadMoreButton").addEventListener("click", () => {
  currentPage += 1
  lazyLoadImages(`https://api.themoviedb.org/3/discover/movie?api_key=5f962c263d7b0f3d4790f1a7fec62185&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${currentPage}&with_genres=${currentGenera}&with_watch_monetization_types=flatrate`, currentGenera)
})

async function getMovies(APIURL) {
  let getMoviesPromise = await axios.get(APIURL)
  return getMoviesPromise.data.results
}

//Collcts the data from getMovies using a content type (popular, top_rated etc...) and calls the helper function to add image posters
function getPopularAndTopRatedMovies(APIURL, content) {
  getMovies(APIURL).then(response => {
    for (let i = 0; i < response.length; i++) {
      if (i === 0) {
        createPosters2(response[i].poster_path, response[i].title, response[i].overview, true, content)
      } else {
        createPosters2(response[i].poster_path, response[i].title, response[i].overview, false, content)
      }
    }
  })
}

//Helper for getPopularAndTopRatedMovies that makes the imagePosters and appends it to the page
function createPosters2(imageURL, title, description, isActive, content) {
  let newPosterContainer = document.createElement("div");
  newPosterContainer.classList.add("carousel-item")
  if (isActive) {
    newPosterContainer.classList.add("active");
  }

  let newImage = document.createElement("img");
  newImage.setAttribute("src", `https://image.tmdb.org/t/p/w500${imageURL}`)
  newImage.classList.add("d-block", "w-100")
  openModalOnPosterClick(imageURL, newImage, title, description);

  newPosterContainer.appendChild(newImage);

  if (content == "popular") {
    document.querySelector("#popular").appendChild(newPosterContainer);
  } else if (content == "top_rated") {
    document.querySelector("#top_rated").appendChild(newPosterContainer);
  }

}

function addToGeneraContainer(APIURL, generaNumber) {
  if (movies[generaNumber].length == 0) {
    getMovies(APIURL).then(response => {
      for (let i of response) {
        movies[generaNumber].push({
          posterPath: `https://image.tmdb.org/t/p/w500${i.poster_path}`,
          title: i.title,
          description: i.overview
        });
      }
    }).then(data => {
      for (let i of movies[generaNumber]) {
        addToGeneraContainer2(i.posterPath, i.title, i.description)
      }
    })
  }
  else {
    for (let i of movies[generaNumber]) {
      addToGeneraContainer2(i.posterPath, i.title, i.description)
    }
  }
}
function addToGeneraContainer2(src, title, description) {
  let newImage = document.createElement("img");
  newImage.setAttribute("src", src);
  newImage.classList.add("generaMovie");
  openModalOnPosterClick(src, newImage, title, description);

  document.querySelector("#moviesContainer").appendChild(newImage);
}

function clearGeneraContainer() {
  for (let i of document.querySelectorAll(".generaMovie")) {
    i.remove();
  }
}

function lazyLoadImages(APIURL, currentGenera) {
  getMovies(APIURL).then(response => {
    for (let i of response) {
      if (i.poster_path) {
        let newImage = document.createElement("img");
        addToGeneraContainer2(`https://image.tmdb.org/t/p/w500${i.poster_path}`, i.title, i.overview)
        movies[currentGenera].push({
          posterPath: `https://image.tmdb.org/t/p/w500${i.poster_path}`,
          title: i.title,
          description: i.overview
        })
      }
    }
  })
}

function assignSelectedGeneraColor() {
  for (let i of document.querySelectorAll(".generasButton")) {
    if (i.getAttribute("aria-label") == currentGenera) {
      i.classList.add("selectedGenera")
    } else {
      i.classList.remove("selectedGenera")
    }
  }
  currentPage = 2
  currentGenera = document.querySelector(".selectedGenera").getAttribute("aria-label")
}


document.addEventListener('scroll', function (event) {
  if (document.body.scrollHeight ==
    document.body.scrollTop +
    window.innerHeight) {
    currentPage += 1
    document.querySelector("#loadMoreButton").style.display = "none";
    lazyLoadImages(`https://api.themoviedb.org/3/discover/movie?api_key=5f962c263d7b0f3d4790f1a7fec62185&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${currentPage}&with_genres=${currentGenera}&with_watch_monetization_types=flatrate`, currentGenera)
  }
});

function openModalOnPosterClick(imageURL, poster, title, description) {
  poster.addEventListener("click", () => {
    document.querySelector("#modalImage").setAttribute("src", `https://image.tmdb.org/t/p/w500${imageURL}`)
    document.querySelector("#modalTitle").innerText = title
    document.querySelector("#modalDescription").innerText = description
    document.querySelector(".infoModal").style.display = "block";
  })
}

document.querySelector("#suggestionsButton").addEventListener("click", () => document.querySelector(".suggestionsModal").style.display = "block")

// Get the modal
var infoModal = document.querySelector(".infoModal");
var suggestionsModal = document.querySelector(".suggestionsModal");

// Get the <span> element that closes the modal
var infoSpan = document.getElementsByClassName("close")[0];
var suggestionsSpan = document.getElementsByClassName("close")[1];

// When the user clicks on <span> (x), close the modal
infoSpan.onclick = function () {
  infoModal.style.display = "none";
}

suggestionsSpan.onclick = function () {
  suggestionsModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == infoModal) {
    infoModal.style.display = "none";
  }
}

window.onclick = function (event) {
  if (event.target == suggestionsModal) {
    suggestionsModal.style.display = "none";
  }
}


getPopularAndTopRatedMovies("https://api.themoviedb.org/3/movie/popular?api_key=5f962c263d7b0f3d4790f1a7fec62185&language=en-US&page=1", "popular")
getPopularAndTopRatedMovies("https://api.themoviedb.org/3/movie/top_rated?api_key=5f962c263d7b0f3d4790f1a7fec62185&language=en-US&page=1", "top_rated")
addToGeneraContainer(`https://api.themoviedb.org/3/discover/movie?api_key=5f962c263d7b0f3d4790f1a7fec62185&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=${currentGenera}&with_watch_monetization_types=flatrate`, 28)
document.querySelector("#loadMoreButton").click()
