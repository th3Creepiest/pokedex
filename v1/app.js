// Constants
const POKEMON_COUNT = 50;
const API_BASE_URL = "https://pokeapi.co/api/v2/";
const THEME_KEY = "pokedex-theme";

// DOM Elements
const pokemonGrid = document.getElementById("pokemon-grid");
const pokemonDetail = document.getElementById("pokemon-detail");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const themeToggle = document.getElementById("theme-toggle");

// State
let allPokemon = [];
let currentTheme = "dark"; // Default theme is dark

// Initialize the app
async function initApp() {
  try {
    // Load saved theme or use default
    loadTheme();

    // Show loading state
    pokemonGrid.innerHTML = '<p class="loading">Loading Pokémon...</p>';

    // Fetch the first 50 Pokemon
    const pokemonData = await fetchPokemonList(POKEMON_COUNT);
    allPokemon = pokemonData;

    // Render Pokemon cards
    renderPokemonGrid(pokemonData);

    // Set up event listeners
    setupEventListeners();
  } catch (error) {
    console.error("Error initializing app:", error);
    pokemonGrid.innerHTML =
      '<p class="error">Failed to load Pokémon. Please try again later.</p>';
  }
}

// Fetch Pokemon list from API
async function fetchPokemonList(count) {
  try {
    // Fetch basic Pokemon list
    const response = await fetch(`${API_BASE_URL}pokemon?limit=${count}`);
    const data = await response.json();

    // Fetch detailed data for each Pokemon
    const detailedPokemon = await Promise.all(
      data.results.map(async (pokemon) => {
        const detailResponse = await fetch(pokemon.url);
        return await detailResponse.json();
      })
    );

    return detailedPokemon;
  } catch (error) {
    console.error("Error fetching Pokemon list:", error);
    throw error;
  }
}

// Render Pokemon grid
function renderPokemonGrid(pokemonList) {
  // Clear the grid
  pokemonGrid.innerHTML = "";

  // If no Pokemon found
  if (pokemonList.length === 0) {
    pokemonGrid.innerHTML =
      '<p class="no-results">No Pokémon found. Try a different search.</p>';
    return;
  }

  // Create a card for each Pokemon
  pokemonList.forEach((pokemon) => {
    const card = createPokemonCard(pokemon);
    pokemonGrid.appendChild(card);
  });
}

// Create a Pokemon card element
function createPokemonCard(pokemon) {
  const card = document.createElement("div");
  card.className = "pokemon-card";
  card.dataset.id = pokemon.id;

  // Get animated sprite if available, otherwise use static sprite
  const spriteUrl =
    pokemon.sprites.versions["generation-v"]["black-white"].animated
      ?.front_default || pokemon.sprites.front_default;

  // Create card HTML
  card.innerHTML = `
        <div class="pokemon-card-header">
            <h2>${pokemon.name}</h2>
            <span class="pokemon-id">#${pokemon.id
              .toString()
              .padStart(3, "0")}</span>
        </div>
        <div class="pokemon-image">
            <img src="${spriteUrl}" alt="${pokemon.name}">
        </div>
        <div class="pokemon-types">
            ${pokemon.types
              .map(
                (type) => `
                <span class="type-badge ${type.type.name}">${type.type.name}</span>
            `
              )
              .join("")}
        </div>
    `;

  // Add click event to show details
  card.addEventListener("click", () => showPokemonDetail(pokemon));

  return card;
}

// Show Pokemon detail view
async function showPokemonDetail(pokemon) {
  // Get species data for additional info
  const speciesResponse = await fetch(pokemon.species.url);
  const speciesData = await speciesResponse.json();

  // Find English flavor text
  const flavorText =
    speciesData.flavor_text_entries
      .find((entry) => entry.language.name === "en")
      ?.flavor_text.replace(/\f/g, " ") || "No description available.";

  // Get animated sprite if available, otherwise use static sprite
  const spriteUrl =
    pokemon.sprites.versions["generation-v"]["black-white"].animated
      ?.front_default || pokemon.sprites.front_default;

  // Create detail view HTML
  pokemonDetail.innerHTML = `
        <div class="detail-header">
            <h2>${pokemon.name}</h2>
            <span class="pokemon-id">#${pokemon.id
              .toString()
              .padStart(3, "0")}</span>
            <button class="detail-close">&times;</button>
        </div>
        <div class="detail-content">
            <div class="detail-image">
                <img src="${spriteUrl}" alt="${pokemon.name}">
            </div>
            <div class="detail-info">
                <div class="detail-types">
                    ${pokemon.types
                      .map(
                        (type) => `
                        <span class="type-badge ${type.type.name}">${type.type.name}</span>
                    `
                      )
                      .join("")}
                </div>
                <p class="detail-description">${flavorText}</p>
                <div class="detail-attributes">
                    <p><strong>Height:</strong> ${pokemon.height / 10} m</p>
                    <p><strong>Weight:</strong> ${pokemon.weight / 10} kg</p>
                    <p><strong>Abilities:</strong> ${pokemon.abilities
                      .map((ability) => ability.ability.name.replace("-", " "))
                      .join(", ")}</p>
                </div>
                <div class="detail-stats">
                    <h3>Base Stats</h3>
                    ${pokemon.stats
                      .map((stat) => {
                        const statName = stat.stat.name.replace("-", " ");
                        const statValue = stat.base_stat;
                        const statPercentage = Math.min(
                          100,
                          (statValue / 255) * 100
                        );

                        return `
                            <div class="stat-bar">
                                <span class="stat-name">${statName}</span>
                                <span class="stat-value">${statValue}</span>
                                <div class="stat-bar-outer">
                                    <div class="stat-bar-inner" style="width: ${statPercentage}%"></div>
                                </div>
                            </div>
                        `;
                      })
                      .join("")}
                </div>
            </div>
        </div>
    `;

  // Show the detail view
  pokemonDetail.classList.add("active");

  // Add close button event listener
  const closeButton = pokemonDetail.querySelector(".detail-close");
  closeButton.addEventListener("click", () => {
    pokemonDetail.classList.remove("active");
  });

  // Scroll to detail view
  pokemonDetail.scrollIntoView({ behavior: "smooth" });
}

// Filter Pokemon by search term
function filterPokemon(searchTerm) {
  if (!searchTerm) {
    return allPokemon;
  }

  searchTerm = searchTerm.toLowerCase();

  return allPokemon.filter((pokemon) => {
    // Match by name
    if (pokemon.name.includes(searchTerm)) {
      return true;
    }

    // Match by ID
    if (pokemon.id.toString() === searchTerm) {
      return true;
    }

    // Match by type
    if (pokemon.types.some((type) => type.type.name.includes(searchTerm))) {
      return true;
    }

    return false;
  });
}

// Set up event listeners
function setupEventListeners() {
  // Search button click
  searchButton.addEventListener("click", () => {
    const searchTerm = searchInput.value.trim();
    const filteredPokemon = filterPokemon(searchTerm);
    renderPokemonGrid(filteredPokemon);
  });

  // Search input enter key
  searchInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      const searchTerm = searchInput.value.trim();
      const filteredPokemon = filterPokemon(searchTerm);
      renderPokemonGrid(filteredPokemon);
    }
  });

  // Reset search when input is cleared
  searchInput.addEventListener("input", () => {
    if (searchInput.value.trim() === "") {
      renderPokemonGrid(allPokemon);
    }
  });

  // Theme toggle button click
  themeToggle.addEventListener("click", toggleTheme);
}

// Theme functions
function loadTheme() {
  // Check if theme is saved in localStorage
  const savedTheme = localStorage.getItem(THEME_KEY);

  if (savedTheme) {
    currentTheme = savedTheme;
  }

  // Apply the theme
  applyTheme();
}

function toggleTheme() {
  // Switch between light and dark themes
  currentTheme = currentTheme === "dark" ? "light" : "dark";

  // Save theme preference
  localStorage.setItem(THEME_KEY, currentTheme);

  // Apply the theme
  applyTheme();
}

function applyTheme() {
  // Update body class
  if (currentTheme === "light") {
    document.body.classList.add("light-theme");
    themeToggle.querySelector(".theme-icon").textContent = "🌙";
  } else {
    document.body.classList.remove("light-theme");
    themeToggle.querySelector(".theme-icon").textContent = "☀️";
  }
}

// Start the app when DOM is loaded
document.addEventListener("DOMContentLoaded", initApp);
