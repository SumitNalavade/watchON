async function getMovieSearch () {
    let movieSearchData = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=5f962c263d7b0f3d4790f1a7fec62185&language=en-US&query=${searchQuery}&page=1&include_adult=false`)

    return (movieSearchData.data.results);
}

function createMovieSearchPoster () {
    getMovieSearch().then(response => {
        for(let i of response) {
            let movieSearch = document.createElement("div");
            movieSearch.classList.add("movieSearch");
            
            let movieSearchPoster = document.createElement("img");
            movieSearchPoster.setAttribute("src", `https://image.tmdb.org/t/p/w500${i.poster_path}`)
            movieSearchPoster.classList.add("movieSearchPoster");

            let movieSearchTitle = document.createElement("h4");
            movieSearchTitle.innerText = i.title;

            movieSearch.appendChild(movieSearchPoster);
            movieSearch.append(movieSearchTitle);

            movieSearchContainer.appendChild(movieSearch);
        }
    })
}

createMovieSearchPoster();