async function getMovieSearch () {
    let movieSearchData = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=5f962c263d7b0f3d4790f1a7fec62185&language=en-US&query=${searchQuery}&page=1&include_adult=false`)

    return (movieSearchData.data.results);
}

/*
 <div class="card">
                <img src="https://image.tmdb.org/t/p/w500/6Y9fl8tD1xtyUrOHV2MkCYTpzgi.jpg" class="card-img-top" alt="...">
                <div class="card-body">
                    <h4 class="card-text">Some quick example text to build on the card title and make up the bulk of the
                        card's content.</h4>
                </div>
            </div>
*/

function createSearchCards () {
    getMovieSearch().then(response => {
        for(let i of response) {
            console.log(i.poster_path);
            let newCard = document.createElement("div");
            newCard.classList.add("card");

            let newPoster = document.createElement("img");
            newPoster.setAttribute("src", `https://image.tmdb.org/t/p/w500${i.poster_path}`)
            newPoster.classList.add("card-img-top");
            newCard.appendChild(newPoster);

            let newCardBody = document.createElement("div");
            newCardBody.classList.add("card-body");
            newCard.appendChild(newCardBody);

            let newCardText = document.createElement("h4");
            newCardText.classList.add("card-text");
            newCardText.innerText = i.title;
            newCardBody.appendChild(newCardText);

            document.querySelector("#movieSearchContainer").appendChild(newCard);

        }
    })
}

createSearchCards();