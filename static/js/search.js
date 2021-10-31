async function getMovieSearch() {
    let movieSearchData = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=5f962c263d7b0f3d4790f1a7fec62185&language=en-US&query=${searchQuery}&page=1&include_adult=false`)

    return (movieSearchData.data.results);
}

function createSearchImage(imageURL) {
    return `
        <img class = "card-img-top searchImg" src = "https://image.tmdb.org/t/p/w500${imageURL}"></img>
    `
}

function createSearchTitle(title) {
    return `
        <h4 class = "card-text modalTitle">${title}</h4>
    `
}

function createSearchYear(release_date) {
    return `
        <p class = "releaseDate">${release_date.split("-")[0]}</p>
    `
}

function createSearchDescription(description) {
    return `
        <p class = "modalDescription">${description}</p>
    `
}

async function getTrailer(movieID) {
    let trailerData = await axios.get(`https://api.themoviedb.org/3/movie/${movieID}/videos?api_key=5f962c263d7b0f3d4790f1a7fec62185&language=en-US`)

    for (let i of trailerData.data.results) {
        if (i.type === "Trailer") {
            return `https://www.youtube.com/watch?v=${i.key}`
        }
    }
}

function createTrailerLink(movieID) {
    let trailerA = document.createElement("a");
    trailerA.classList.add("trailer");
    trailerA.innerText = "Trailer";
    trailerA.setAttribute("target", "_blank");

    getTrailer(movieID).then(response => {
        trailerA.setAttribute("href", response)
    })

    return trailerA
}

async function getSearchWatchLinks(movieID) {
    if (movieID) {
        let providerData = await axios.get(`https://api.themoviedb.org/3/movie/${movieID}/watch/providers?api_key=5f962c263d7b0f3d4790f1a7fec62185`)

        if (providerData.data.results.US) {
            return providerData.data.results.US.link
        }
    }
}

function createSearchWatchLinks(movieID) {
    let watchLink = document.createElement("a");
    watchLink.classList.add("watchLink")
    watchLink.innerText = "Watch Now"
    watchLink.setAttribute("target", "_blank");

    getSearchWatchLinks(movieID).then(response => {
        if (response) {
            watchLink.setAttribute("href", response)
        }
    })

    return watchLink
}

function createSearchCards() {
    getMovieSearch().then(response => {
        for (let i of response) {
            let newCard = document.createElement("div");
            newCard.classList.add("card");

            newCard.innerHTML += (createSearchImage(i.poster_path))

            let newCardBody = document.createElement("div");
            newCardBody.classList.add("card-body");
            newCard.appendChild(newCardBody);

            newCardBody.innerHTML += (createSearchTitle(i.title))
            newCardBody.innerHTML += (createSearchYear(i.release_date))
            newCardBody.innerHTML += (createSearchDescription(i.overview))
            newCardBody.appendChild(createTrailerLink(i.id))
            newCardBody.appendChild(createSearchWatchLinks(i.id))

            let reviewsContainer = document.createElement("div");
            reviewsContainer.classList.add("reviewsContainer");
            let reviewDetailsContainer = document.createElement("details");
            reviewsContainer.appendChild(reviewDetailsContainer);
            let reviewSummary = document.createElement("summary");
            reviewSummary.innerText = "Reviews"
            reviewDetailsContainer.appendChild(reviewSummary);
            let reviewsUL = document.createElement("ul");
            reviewsUL.classList.add("reviewsUL");
            reviewDetailsContainer.appendChild(reviewsUL);
            newCardBody.appendChild(reviewsContainer);

            let castContainer = document.createElement("div");
            castContainer.classList.add("castContainer");
            let detailsContainer = document.createElement("details");
            castContainer.appendChild(detailsContainer);
            let summary = document.createElement("summary");
            summary.innerText = "Cast"
            detailsContainer.appendChild(summary);
            let castUl = document.createElement("ul");
            detailsContainer.appendChild(castUl);
            newCardBody.appendChild(castContainer);

            document.querySelector("#movieSearchContainer").appendChild(newCard);

            let reviewData = getSearchReviews(i.id).then(response => {
                for (let i of response) {
                    let newReview = document.createElement("li");

                    let reviewUser = document.createElement("h4");
                    reviewUser.classList.add("reviewUser")
                    reviewUser.innerText = i.author;
                    newReview.appendChild(reviewUser);

                    let reviewPoints = document.createElement("h5");
                    reviewPoints.innerText = `${i.author_details.rating}/10`
                    newReview.appendChild(reviewPoints);

                    let reviewContent = document.createElement("p");
                    reviewContent.innerHTML = i.content;
                    newReview.appendChild(reviewContent);

                    reviewsUL.appendChild(newReview);
                }
            })

            getSearchCast(i.id).then(response => {
                for (let i of response) {
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

                    castUl.appendChild(newCast);
                }
            })
        }
    })
}

async function getSearchReviews(movieID) {
    let reviewData = await axios.get(`https://api.themoviedb.org/3/movie/${movieID}/reviews?api_key=5f962c263d7b0f3d4790f1a7fec62185&language=en-US&page=1`)

    return reviewData.data.results
}

async function getSearchCast(movieID) {
    if (movieID) {
        let castData = await axios.get(`https://api.themoviedb.org/3/movie/${movieID}/credits?api_key=5f962c263d7b0f3d4790f1a7fec62185&language=en-US`)

        return castData.data.cast
    }
}



createSearchCards();