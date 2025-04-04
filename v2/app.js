// Constants
const POKEMON_COUNT = 50;
const API_BASE_URL = "https://pokeapi.co/api/v2/";
const THEME_KEY = "pokedex-theme";

// DOM Elements
const pokemonList = document.getElementById("pokemon-list");
const pokemonDetailCard = document.getElementById("pokemon-detail-card");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const themeToggle = document.getElementById("theme-toggle");

// State
let allPokemon = [];
let currentTheme = "dark"; // Default theme is dark
let selectedPokemonId = null;

// Initialize the app
async function initApp() {
  try {
    // Load saved theme or use default
    loadTheme();

    // Show loading state
    pokemonList.innerHTML = '<p class="loading">Loading Pokémon...</p>';

    // Fetch the first 50 Pokemon
    const pokemonData = await fetchPokemonList(POKEMON_COUNT);
    allPokemon = pokemonData;

    // Render Pokemon list
    renderPokemonList(pokemonData);

    // Set up event listeners
    setupEventListeners();
  } catch (error) {
    console.error("Error initializing app:", error);
    pokemonList.innerHTML =
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

// Render Pokemon list
function renderPokemonList(pokemonList) {
  // Clear the list
  document.getElementById("pokemon-list").innerHTML = "";

  // If no Pokemon found
  if (pokemonList.length === 0) {
    document.getElementById("pokemon-list").innerHTML =
      '<p class="no-results">No Pokémon found. Try a different search.</p>';
    return;
  }

  // Create a list item for each Pokemon
  pokemonList.forEach((pokemon) => {
    const listItem = createPokemonListItem(pokemon);
    document.getElementById("pokemon-list").appendChild(listItem);
  });

  // If there was a selected Pokemon, keep it selected
  if (selectedPokemonId) {
    const selectedPokemon = pokemonList.find((p) => p.id === selectedPokemonId);
    if (selectedPokemon) {
      const listItem = document.querySelector(
        `.pokemon-list-item[data-id="${selectedPokemonId}"]`
      );
      if (listItem) {
        listItem.classList.add("active");
      }
    } else {
      // If the selected Pokemon is no longer in the list (filtered out), clear the detail view
      pokemonDetailCard.innerHTML = `
        <div class="empty-state">
          <p>Select a Pokémon to view details</p>
        </div>
      `;
      selectedPokemonId = null;
    }
  }
}

// Create a Pokemon list item element
function createPokemonListItem(pokemon) {
  const listItem = document.createElement("div");
  listItem.className = "pokemon-list-item";
  listItem.dataset.id = pokemon.id;

  // Get sprite for the list item
  const spriteUrl = pokemon.sprites.front_default;

  // Create list item HTML
  listItem.innerHTML = `
    <img src="${spriteUrl}" alt="${pokemon.name}">
    <div class="pokemon-list-item-info">
      <h3>${pokemon.name}</h3>
      <span class="pokemon-id">#${pokemon.id.toString().padStart(3, "0")}</span>
    </div>
  `;

  // Add click event to show details
  listItem.addEventListener("click", () => {
    // Remove active class from all list items
    document.querySelectorAll(".pokemon-list-item").forEach((item) => {
      item.classList.remove("active");
    });

    // Add active class to clicked item
    listItem.classList.add("active");

    // Show Pokemon details
    showPokemonDetail(pokemon);

    // Update selected Pokemon ID
    selectedPokemonId = pokemon.id;
  });

  return listItem;
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

  // Get Pokemon cry sound URLs - using both PokeAPI and Pokemon Showdown as options
  // PokeAPI format: https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/{id}.ogg
  // Pokemon Showdown format: https://play.pokemonshowdown.com/audio/cries/{name}.mp3
  const pokeApiSoundUrl = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokemon.id}.ogg`;
  const showdownSoundUrl = `https://play.pokemonshowdown.com/audio/cries/${pokemon.name.toLowerCase()}.mp3`;

  // Create detail view HTML
  pokemonDetailCard.innerHTML = `
    <div class="detail-header">
      <h2>${pokemon.name}</h2>
      <span class="pokemon-id">#${pokemon.id.toString().padStart(3, "0")}</span>
    </div>
    <div class="detail-content">
      <div class="detail-image" title="Click to hear ${
        pokemon.name
      }'s cry" style="cursor: pointer; position: relative;">
        <img src="${spriteUrl}" alt="${pokemon.name}">
        <div class="sound-icon" style="position: absolute; bottom: 5px; right: 5px; font-size: 1.2rem;">🔊</div>
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
              const statPercentage = Math.min(100, (statValue / 255) * 100);

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

  // Add click event listener to play sound when the image is clicked
  const detailImage = pokemonDetailCard.querySelector(".detail-image");
  detailImage.addEventListener("click", () => {
    playPokemonCry(pokemon.id, pokemon.name);
  });
}

// Function to play Pokemon cry with fallback mechanism
async function playPokemonCry(pokemonId, pokemonName) {
  // Create audio element
  let audio = new Audio();

  // Try PokeAPI sound first
  const pokeApiSoundUrl = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokemonId}.ogg`;
  const showdownSoundUrl = `https://play.pokemonshowdown.com/audio/cries/${pokemonName.toLowerCase()}.mp3`;

  try {
    // Show visual feedback
    const soundIcon = document.querySelector(".sound-icon");
    if (soundIcon) {
      soundIcon.textContent = "🔈";
      soundIcon.style.animation = "pulse 0.5s infinite";
    }

    // Try PokeAPI sound first
    audio.src = pokeApiSoundUrl;
    await audio.play();
  } catch (error) {
    console.log(
      `Failed to play PokeAPI sound for ${pokemonName}, trying fallback...`
    );

    // Try Pokemon Showdown sound as fallback
    try {
      audio = new Audio(showdownSoundUrl);
      await audio.play();
    } catch (fallbackError) {
      console.error(
        `Failed to play sound for ${pokemonName} from both sources`,
        fallbackError
      );
    }
  } finally {
    // Reset visual feedback after playing (or attempting to play)
    setTimeout(() => {
      const soundIcon = document.querySelector(".sound-icon");
      if (soundIcon) {
        soundIcon.textContent = "🔊";
        soundIcon.style.animation = "";
      }
    }, 500);
  }
}

// Fetch a single Pokemon by name or ID
async function fetchPokemonByNameOrId(nameOrId) {
  try {
    // Convert to lowercase for name search
    const query = nameOrId.toLowerCase();

    // Make API request
    const response = await fetch(`${API_BASE_URL}pokemon/${query}`);

    // If the response is not ok, throw an error
    if (!response.ok) {
      throw new Error(`Pokemon '${nameOrId}' not found`);
    }

    // Parse and return the data
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Pokemon:", error);
    throw error;
  }
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
    handleSearch();
  });

  // Search input enter key
  searchInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  });

  // Reset search when input is cleared
  searchInput.addEventListener("input", () => {
    if (searchInput.value.trim() === "") {
      renderPokemonList(allPokemon);
    }
  });

  // Theme toggle button click
  themeToggle.addEventListener("click", toggleTheme);
}

// Handle search functionality
async function handleSearch() {
  const searchTerm = searchInput.value.trim();

  if (!searchTerm) {
    renderPokemonList(allPokemon);
    return;
  }

  // First try to filter from existing Pokemon
  const filteredPokemon = filterPokemon(searchTerm);

  if (filteredPokemon.length > 0) {
    // If we found matches in our current list, display them
    renderPokemonList(filteredPokemon);
  } else {
    // If no matches in our current list, try to fetch from API
    try {
      // Show loading state
      pokemonList.innerHTML = '<p class="loading">Searching for Pokémon...</p>';

      // Try to fetch the Pokemon by name or ID
      const pokemon = await fetchPokemonByNameOrId(searchTerm);

      // If found, show it in the list
      if (pokemon) {
        // Add to our list if not already there
        if (!allPokemon.some((p) => p.id === pokemon.id)) {
          allPokemon.push(pokemon);
        }

        // Show just this Pokemon in the list
        renderPokemonList([pokemon]);

        // Automatically select and show details
        const listItem = document.querySelector(
          `.pokemon-list-item[data-id="${pokemon.id}"]`
        );
        if (listItem) {
          listItem.click();
        }
      }
    } catch (error) {
      // Show error message if Pokemon not found
      pokemonList.innerHTML = `
        <p class="error">Pokémon "${searchTerm}" not found. Please try a different search.</p>
      `;

      // Clear the detail view
      pokemonDetailCard.innerHTML = `
        <div class="empty-state">
          <p>Select a Pokémon to view details</p>
        </div>
      `;
      selectedPokemonId = null;
    }
  }
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
