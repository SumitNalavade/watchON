async function getMovieSearch() {
    let movieSearchData = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=5f962c263d7b0f3d4790f1a7fec62185&language=en-US&query=${searchQuery}&page=1&include_adult=false`)

    return (movieSearchData.data.results);
}

function createSearchImage(imageURL) {
    let newPoster = document.createElement("img");
    newPoster.setAttribute("src", `https://image.tmdb.org/t/p/w500${imageURL}`)
    newPoster.classList.add("card-img-top");

    return newPoster
}

function createSearchTitle(title) {
    let newCardText = document.createElement("h4");
    newCardText.classList.add("card-text", "modalTitle");
    newCardText.innerText = title;

    return newCardText
}

function createSearchDescription(description) {
    let newDescriptionText = document.createElement("p");
    newDescriptionText.classList.add("modalDescription");
    newDescriptionText.innerText = description;

    return newDescriptionText
}

function createSearchCards() {
    getMovieSearch().then(response => {
        for (let i of response) {
            let newCard = document.createElement("div");
            newCard.classList.add("card");

            newCard.appendChild(createSearchImage(i.poster_path))

            let newCardBody = document.createElement("div");
            newCardBody.classList.add("card-body");
            newCard.appendChild(newCardBody);

            newCardBody.appendChild(createSearchTitle(i.title))
            newCardBody.appendChild(createSearchDescription(i.overview))

            document.querySelector("#movieSearchContainer").appendChild(newCard);

        }
    })
}

createSearchCards();