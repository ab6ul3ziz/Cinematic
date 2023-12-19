const BASE_URL = "https://api.themoviedb.org/3/movie/";
const API_KEY = "api_key=f5a82085b76fad4f2804178f551bce6e";
const IMG_PATH = "https://image.tmdb.org/t/p/w500";
const YOUTUBE_PATH = "https://youtube.com/watch?v=";
const SEARCH_PATH = "https://api.themoviedb.org/3/search/movie";

async function fetchData(list, id) {
  try {
    const response = await fetch(BASE_URL + list + `?${API_KEY}`);
    let data = await response.json();
    return generateData(data, id);
  } catch (error) {
    console.log(error);
  }
}

const now_playing = fetchData("now_playing", "Movies-in-Theaters");
const popular = fetchData("popular", "popular");
const upcoming = fetchData("upcoming", "upcoming");
const topRated = fetchData("top_rated", "top-rated");

async function getMovieTrailer(moveiId, playTrailer) {
  try {
    const response = await fetch(
      BASE_URL + moveiId + "/videos" + `?${API_KEY}`
    );
    let data = await response.json();
    data.results.length
      ? (playTrailer.href =
          YOUTUBE_PATH + data.results[data.results.length - 1].key)
      : playTrailer.remove();
  } catch (error) {
    console.log(error);
  }
  return;
}

async function searchResults(movieName) {
  const response = await fetch(
    SEARCH_PATH + "?query=" + movieName + `&${API_KEY}`
  );
  let data = await response.json();
  return generateData(data, "serach-result");
}
const input = document.getElementById("search");
const icon = document.querySelector(".serach-icon");
let serachContainer = document.getElementById("serach-result");
icon.addEventListener("click", () => {
  serachContainer.innerHTML = "";
  searchResults(input.value);
});

function generateData(data, id) {
  let moveiContainer = document.getElementById(id);
  data.results.forEach((data) => {
    let card = document.createElement("div");
    card.className = "card";
    moveiContainer.appendChild(card);
    let imgDiv = document.createElement("div");
    imgDiv.className = "image";
    card.appendChild(imgDiv);
    let poster = document.createElement("img");
    poster.loading = "lazy";
    poster.alt = `${data.original_title}`;
    poster.src = `${IMG_PATH + data.poster_path}`;
    imgDiv.appendChild(poster);
    let overviewDiv = document.createElement("div");
    overviewDiv.className = "overview";
    imgDiv.appendChild(overviewDiv);
    let overview = document.createElement("p");
    overview.textContent = data.overview;
    overviewDiv.appendChild(overview);
    let trailer = document.createElement("a");
    trailer.className = "watch-trailer";
    trailer.textContent = "Watch Trailer";
    overviewDiv.appendChild(trailer);
    getMovieTrailer(data.id, trailer);
    let content = document.createElement("div");
    content.className = "content";
    card.appendChild(content);
    let title = document.createElement("p");
    title.className = "title";
    title.textContent = data.original_title;
    content.appendChild(title);
    let releaseDate = document.createElement("span");
    releaseDate.textContent = `  (${data.release_date.slice(0, 4)})`;
    title.appendChild(releaseDate);
    let percentageDiv = document.createElement("div");
    percentageDiv.className = "percentage-div";
    content.appendChild(percentageDiv);
    let ring = document.createElement("div");
    ring.className = "ring";
    percentageDiv.appendChild(ring);
    let percent = document.createElement("div");
    percent.className = "percent";
    ring.appendChild(percent);
    let voteAverage = document.createElement("span");
    voteAverage.className = "vote-average";
    voteAverage.textContent = "%";
    voteAverage.setAttribute(
      "data-percent",
      `${data.vote_average.toFixed(1) * 10}`
    );
    percent.appendChild(voteAverage);
    let votePercent = voteAverage.dataset.percent;
    styleVotePercent(votePercent, ring);
  });
}

// theme mood
function setThemeByDevice() {
  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? (document.documentElement.dataset.theme = "dark")
    : (document.documentElement.dataset.theme = "light");
}
window.addEventListener("load", setThemeByDevice);

// navbar toggle
const bottun = document.querySelector(".navbar-toggle");
const nav = document.getElementById("nav");
bottun.addEventListener("click", () => {
  if (nav.classList.contains("false")) {
    nav.classList.remove("false");
  }
  bottun.classList.toggle("true");
  nav.classList.toggle("true");

  if (!nav.classList.contains("true")) {
    nav.classList.add("false");
  }
});

// close navbar when link clicked
const navlinks = document.querySelectorAll(".nav-links > li > a");
navlinks.forEach((a) => {
  a.addEventListener("click", () => {
    nav.classList.remove("true");
    bottun.classList.remove("true");
  });
});

function styleVotePercent(votePercent, ring) {
  votePercent >= 75
    ? (ring.style.background = `conic-gradient(green ${
        votePercent * 3.6
      }deg, rgb(164 202 164)0deg)`)
    : votePercent < 50
    ? (ring.style.background = `conic-gradient(#ff0505 ${
        votePercent * 3.6
      }deg,#d9a2a2 0deg)`)
    : (ring.style.background = `conic-gradient(orange ${
        votePercent * 3.6
      }deg,#dac193 0deg)`);
}
