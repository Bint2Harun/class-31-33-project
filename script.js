// GRAB ELEMENTS FROM HTML
const API_KEY = "d8fcbd28";
const FAVORITES_KEY = "favorites";
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const statusDiv = document.getElementById("status");
const favoriteContainer = document.getElementById("favoriteContainer");
const resultCount = document.getElementById("resultCount");
const movieContainer = document.getElementById("movieContainer");
const paginationContainer = document.getElementById("paginationContainer");
const clearFavoritesBtn = document.getElementById("clearFavoritesBtn");
const quickTags = document.getElementById("quickTags");

const modal = document.getElementById("movieModal");
const modalContent = document.getElementById("modalContent");
const closeBtn = document.getElementById("closeModal");
const modalBody = document.getElementById("modalBody");

// OTHER VARIABLES NEEDED
let currentPage = 1;
let currentTitle = "";
let currentResults = [];
let totalResults = 0;
let totalPages = 1;
let debounceTimer;
let favorites = loadFavorites();

function loadFavorites() {
  try {
    const savedFavorites = localStorage.getItem(FAVORITES_KEY);
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  } catch (error) {
    console.error("Could not load favorites:", error);
    return [];
  }
}

function saveFavorites() {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

function isFavorite(imdbID) {
  return favorites.some((movie) => movie.imdbID === imdbID);
}

function getPosterUrl(poster) {
  if (poster && poster !== "N/A") {
    return poster;
  }

  return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='450' viewBox='0 0 300 450'%3E%3Crect width='300' height='450' fill='%230f172a'/%3E%3Ctext x='150' y='220' text-anchor='middle' fill='%23f8fafc' font-family='Arial' font-size='24'%3ENo Poster%3C/text%3E%3C/svg%3E";
}

function renderFavorites() {
  if (!favorites.length) {
    favoriteContainer.innerHTML = `
      <div class="col-span-full rounded-3xl border border-dashed border-slate-700 bg-slate-900/60 p-10 text-center text-gray-400">
        No favorites yet. Search for a movie and tap the heart to save it here.
      </div>
    `;
    return;
  }

  favoriteContainer.innerHTML = favorites
    .map((movie) => {
      const poster = getPosterUrl(movie.Poster);
      return `
        <div class="group overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/80 shadow-[0_20px_45px_rgba(2,6,23,0.45)]">
          <div class="relative overflow-hidden">
            <img src="${poster}" alt="${movie.Title}" class="w-full h-[320px] object-cover duration-500 group-hover:scale-105">
            <div class="absolute top-3 right-3">
              <span class="rounded-full bg-slate-900/80 px-3 py-1 text-sm">${movie.Year || "N/A"}</span>
            </div>
          </div>
          <div class="p-5">
            <h3 class="truncate text-lg font-bold text-white">${movie.Title}</h3>
            <p class="mt-2 capitalize text-gray-400">${movie.Type || "movie"}</p>
            <button
              type="button"
              data-action="remove-favorite"
              data-id="${movie.imdbID}"
              class="mt-5 w-full rounded-lg bg-slate-800 py-3 font-semibold text-white duration-300 hover:bg-red-500"
            >
              Remove
            </button>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderMovies(movies) {
  currentResults = movies;
  movieContainer.innerHTML = "";

  if (!movies.length) {
    resultCount.innerHTML = "No movies found.";
    movieContainer.innerHTML = "";
    return;
  }

  resultCount.innerHTML = `Showing <span class="text-red-500 font-bold">${movies.length}</span> movie(s)`;

  movieContainer.innerHTML = movies
    .map((movie) => {
      const poster = getPosterUrl(movie.Poster);
      const isInFavorites = isFavorite(movie.imdbID);

      return `
        <div class="group overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/80 shadow-[0_20px_45px_rgba(2,6,23,0.45)] transition duration-300 hover:-translate-y-2 hover:border-red-500/50">
          <div class="relative overflow-hidden">
            <img src="${poster}" alt="${movie.Title}" class="w-full h-[420px] object-cover duration-500 group-hover:scale-110">
            <div class="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition duration-300 group-hover:opacity-100">
              <button
                type="button"
                data-action="details"
                data-id="${movie.imdbID}"
                class="rounded-lg bg-red-500 px-5 py-3 font-semibold shadow-lg shadow-red-500/20"
              >
                View Details
              </button>
            </div>
            <button
              type="button"
              data-action="favorite"
              data-id="${movie.imdbID}"
              class="absolute top-3 left-3 ${isInFavorites ? "bg-red-500" : "bg-slate-900/80"} rounded-full px-3 py-2 text-sm font-semibold"
            >
              ${isInFavorites ? "♥" : "♡"}
            </button>
            <div class="absolute top-3 right-3">
              <span class="rounded-full bg-slate-900/80 px-3 py-1 text-sm">${movie.Year}</span>
            </div>
          </div>
          <div class="p-5">
            <h2 class="truncate text-lg font-bold text-white">${movie.Title}</h2>
            <p class="mt-2 capitalize text-gray-400">${movie.Type}</p>
            <button
              type="button"
              data-action="favorite"
              data-id="${movie.imdbID}"
              class="mt-5 w-full rounded-lg py-3 font-semibold duration-300 ${isInFavorites ? "bg-red-500 hover:bg-red-600" : "bg-slate-800 hover:bg-red-500"}"
            >
              ${isInFavorites ? "Remove Favourite" : "Add Favourite"}
            </button>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderPagination(page, totalPageCount) {
  if (!currentTitle || totalPageCount <= 1) {
    paginationContainer.innerHTML = "";
    return;
  }

  const isPrevDisabled = page <= 1;
  const isNextDisabled = page >= totalPageCount;

  paginationContainer.innerHTML = `
    <div class="inline-flex items-center gap-3 rounded-full border border-slate-800 bg-slate-900/80 p-2 shadow-lg shadow-red-500/10">
      <button
        type="button"
        data-page="prev"
        ${isPrevDisabled ? "disabled" : ""}
        class="rounded-full px-4 py-2 text-sm font-semibold ${isPrevDisabled ? "cursor-not-allowed opacity-40" : "bg-slate-800 hover:bg-red-500"}"
      >
        ← Previous
      </button>
      <span class="px-3 text-sm font-semibold text-slate-300">Page ${page} of ${totalPageCount}</span>
      <button
        type="button"
        data-page="next"
        ${isNextDisabled ? "disabled" : ""}
        class="rounded-full px-4 py-2 text-sm font-semibold ${isNextDisabled ? "cursor-not-allowed opacity-40" : "bg-slate-800 hover:bg-red-500"}"
      >
        Next →
      </button>
    </div>
  `;
}

quickTags.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-search]");
  if (!button) return;

  const query = button.dataset.search.trim();
  searchInput.value = query;
  fetchMovies(query, 1);
});

// SEARCH FORM
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = searchInput.value.trim();
  if (!title) {
    statusDiv.textContent = "Please encleter a movie title.";
    return;
  }
  fetchMovies(title, 1);
});

searchButton.addEventListener("click", function (event) {
  event.preventDefault();
  const title = searchInput.value.trim();
  if (!title) {
    statusDiv.textContent = "Please enter a movie title.";
    return;
  }
  fetchMovies(title, 1);
});

// SEARCH FUNCTION AND API CALL
async function fetchMovies(title, page = 1) {
  const url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(title)}&page=${page}`;

  currentTitle = title;
  currentPage = page;
  try {
    statusDiv.textContent = "Loading...";

    const response = await fetch(url);
    const data = await response.json();

    if (data.Response === "False") {
      currentResults = [];
      totalResults = 0;
      totalPages = 1;
      renderMovies([]);
      renderPagination(1, 1);
      statusDiv.textContent = data.Error;
      return;
    }

    currentResults = data.Search || [];
    totalResults = Number(data.totalResults || 0);
    totalPages = Math.max(1, Math.ceil(totalResults / 10));
    renderMovies(currentResults);
    renderPagination(page, totalPages);
    statusDiv.textContent = "";
  } catch (error) {
    statusDiv.textContent = "Error fetching movies";
    console.error("Error fetching movies:", error);
  }
}

function toggleFavorite(imdbID) {
  const existingMovie = currentResults.find((movie) => movie.imdbID === imdbID) || favorites.find((movie) => movie.imdbID === imdbID);

  if (!existingMovie) return;

  const favoriteIndex = favorites.findIndex((movie) => movie.imdbID === imdbID);

  if (favoriteIndex >= 0) {
    favorites.splice(favoriteIndex, 1);
  } else {
    favorites.unshift({
      imdbID: existingMovie.imdbID,
      Title: existingMovie.Title,
      Year: existingMovie.Year,
      Poster: existingMovie.Poster,
      Type: existingMovie.Type,
    });
  }

  saveFavorites();
  renderFavorites();
  renderMovies(currentResults);
}

function clearFavorites() {
  favorites = [];
  saveFavorites();
  renderFavorites();
  renderMovies(currentResults);
}

movieContainer.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const action = button.dataset.action;
  const imdbID = button.dataset.id;

  if (action === "details") {
    fetchMovieDetails(imdbID);
  } else if (action === "favorite") {
    toggleFavorite(imdbID);
  }
});

favoriteContainer.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const action = button.dataset.action;
  const imdbID = button.dataset.id;

  if (action === "remove-favorite") {
    toggleFavorite(imdbID);
  }
});

paginationContainer.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-page]");
  if (!button || !currentTitle) return;

  if (button.dataset.page === "prev" && currentPage > 1) {
    fetchMovies(currentTitle, currentPage - 1);
  } else if (button.dataset.page === "next" && currentPage < totalPages) {
    fetchMovies(currentTitle, currentPage + 1);
  }
});

clearFavoritesBtn.addEventListener("click", clearFavorites);

async function fetchMovieDetails(Id) {
  try {
    const url = `https://www.omdbapi.com/?apikey=${API_KEY}&i=${Id}`;
    const response = await fetch(url);
    const data = await response.json();
    modalBody.innerHTML = `
      <div class="grid md:grid-cols-2 gap-4">
        <img src="${getPosterUrl(data.Poster)}" alt="${data.Title}" class="w-full rounded-lg object-cover">
        <div class="space-y-2 text-sm">
          <h2 class="text-2xl font-bold mb-3">${data.Title}</h2>
          <p><strong>Year:</strong> ${data.Year}</p>
          <p><strong>Genre:</strong> ${data.Genre}</p>
          <p><strong>Director:</strong> ${data.Director}</p>
          <p><strong>Actors:</strong> ${data.Actors}</p>
          <p><strong>IMDb Rating:</strong> ${data.imdbRating}</p>
          <p><strong>Runtime:</strong> ${data.Runtime}</p>
        </div>
      </div>
      <div class="mt-4">
        <h3 class="font-bold text-lg">Plot</h3>
        <p>${data.Plot}</p>
      </div>
    `;
    modal.classList.remove("hidden");
  } catch (error) {
    console.error("Error fetching movie details:", error);
  }
}
window.fetchMovieDetails = fetchMovieDetails;

closeBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.classList.add("hidden");
  }
});

modalContent.addEventListener("click", (event) => {
  event.stopPropagation();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    modal.classList.add("hidden");
  }
});

renderFavorites();


