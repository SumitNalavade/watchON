const options = {
    numVisible : 8
}

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.carousel');
    var instances = M.Carousel.init(elems, options);
  });

window.onresize = function(){ location.reload(); }

//<a class="carousel-item" href="#one!"><img src="https://static.tvmaze.com/uploads/images/original_untouched/166/416516.jpg"></a>

async function getPopularMovies () {
  let popularMoviesPromise = await axios.get("https://api.themoviedb.org/3/movie/popular?api_key=5f962c263d7b0f3d4790f1a7fec62185&language=en-US&page=1")
    return popularMoviesPromise.data.results
}

getPopularMovies().then(response => {
    for(let i of response) {
        console.log(i.original_title)
    }
});