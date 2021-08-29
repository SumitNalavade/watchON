/*
 <div class="carousel-item active">
                            <img src=""
                                class="d-block w-100" alt="...">
                        </div>
*/


async function getMovies(content) {
  let getMoviesPromise = await axios.get(`https://api.themoviedb.org/3/movie/${content}?api_key=5f962c263d7b0f3d4790f1a7fec62185&language=en-US&page=1`)
  return getMoviesPromise.data.results
}

//Collcts the data from getMovies using a content type (popular, top_rated etc...) and calls the helper function to add image posters
function createPosters1(content) {
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

//Helper for createPosters1 that makes the imagePosters and appends it to the page
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

createPosters1("popular")
createPosters1("top_rated")
