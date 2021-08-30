let currentGenera = document.querySelector("#actionGeneraButton").getAttribute("aria-label")

for (let i of document.querySelectorAll(".generasButton")) {
  i.addEventListener("click", () => {
    currentGenera = i.getAttribute("aria-label");
    assignSelectedGeneraColor();
  })
}

async function getMovies(content) {
  let getMoviesPromise = await axios.get(`https://api.themoviedb.org/3/movie/${content}?api_key=5f962c263d7b0f3d4790f1a7fec62185&language=en-US&page=1`)
  return getMoviesPromise.data.results
}

//Collcts the data from getMovies using a content type (popular, top_rated etc...) and calls the helper function to add image posters
function getPopularAndTopRatedMovies(content) {
  getMovies(content).then(response => {
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

function assignSelectedGeneraColor() {
  for (let i of document.querySelectorAll(".generasButton")) {
    if (i.getAttribute("aria-label") == currentGenera) {
      i.classList.add("selectedGenera")
    } else {
      i.classList.remove("selectedGenera")
    }
  }
}

getPopularAndTopRatedMovies("popular")
getPopularAndTopRatedMovies("top_rated")