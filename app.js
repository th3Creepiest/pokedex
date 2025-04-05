/**
 * Pokédex Application
 * A web application that displays information about Pokémon using the PokeAPI.
 */

import { loadTheme, toggleTheme } from "./theme.js"
import {
  initPokemonList,
  setPokemonCollection,
  showPokemonListLoadingState,
  showPokemonListErrorState,
  renderPokemonList,
  formatPokemonId,
  resetDetailView,
  initSearchElements,
  setupSearchEvents,
  handleSearch,
  searchPokemonFromAPI,
} from "./pokemon-list.js"
import {
  initPokemonDetailCard,
  renderPokemonDetailCard,
  showPokemonDetailError,
} from "./pokemon-detail-card.js"
import {
  fetchPokemonList,
  fetchPokemonByNameOrId,
  fetchPokemonSpecies,
  getPokemonCryUrl,
} from "./api.js"

// Configuration
const POKEMON_COUNT = 50 // Number of Pokémon to load initially

// DOM Elements
const pokemonList = document.getElementById("pokemon-list")
const pokemonDetailCard = document.getElementById("pokemon-detail-card")
const searchInput = document.getElementById("search-input")
const searchButton = document.getElementById("search-button")
const themeToggle = document.getElementById("theme-toggle")

/**
 * Initialize the application
 * Loads theme, fetches initial Pokémon data, and sets up event listeners
 */
export async function initApp() {
  try {
    loadTheme()
    initPokemonDetailCard(pokemonDetailCard)
    initPokemonList(pokemonList, showPokemonDetail)
    showPokemonListLoadingState()

    // Fetch initial Pokémon data
    const pokemonData = await fetchPokemonList(POKEMON_COUNT)
    setPokemonCollection(pokemonData)

    renderPokemonList(pokemonData)

    setupEventListeners()
  } catch (error) {
    console.error("Error initializing app:", error)
    showPokemonListErrorState("Failed to load Pokémon. Please try again later.")
  }
}

/**
 * Display detailed information about a Pokémon
 * @param {Object} pokemon - Pokémon data object
 */
async function showPokemonDetail(pokemon) {
  try {
    // Fetch additional species data
    const speciesData = await fetchPokemonSpecies(pokemon.species.url)
    const description = getPokemonDescription(speciesData)
    const spriteUrl = getBestPokemonSprite(pokemon)
    const formattedId = formatPokemonId(pokemon.id)

    renderPokemonDetailCard(pokemon, description, spriteUrl, formattedId)

    // Set up sound playback
    setupPokemonCryPlayback(pokemon.name)
  } catch (error) {
    console.error(`Error showing details for ${pokemon.name}:`, error)
    showPokemonDetailError(pokemon.name)
  }
}

/**
 * Get the Pokémon's description from species data
 * @param {Object} speciesData - Pokémon species data
 * @returns {string} - Pokémon description
 */
function getPokemonDescription(speciesData) {
  return (
    speciesData.flavor_text_entries
      .find((entry) => entry.language.name === "en")
      ?.flavor_text.replace(/\f/g, " ") || "No description available."
  )
}

/**
 * Get the best available sprite for a Pokémon
 * @param {Object} pokemon - Pokémon data
 * @returns {string} - URL of the best available sprite
 */
function getBestPokemonSprite(pokemon) {
  return (
    pokemon.sprites.versions["generation-v"]["black-white"].animated
      ?.front_default || pokemon.sprites.front_default
  )
}

/**
 * Set up event listener for playing Pokémon cry
 * @param {string} pokemonName - Name of the Pokémon
 */
function setupPokemonCryPlayback(pokemonName) {
  const detailImage = pokemonDetailCard.querySelector(".detail-image")
  detailImage.addEventListener("click", () => {
    playPokemonCry(pokemonName)
  })
}

/**
 * Play the cry sound for a Pokémon
 * @param {string} pokemonName - Name of the Pokémon
 */
async function playPokemonCry(pokemonName) {
  const soundUrl = getPokemonCryUrl(pokemonName)
  const audio = new Audio()

  try {
    // Update UI to show sound is playing
    updateSoundIconPlaying(true)

    // Play the sound
    audio.src = soundUrl
    await audio.play()
  } catch (error) {
    console.error(`Failed to play sound for ${pokemonName}:`, error)
  } finally {
    // Reset UI after sound finishes (or fails)
    setTimeout(() => updateSoundIconPlaying(false), 500)
  }
}

/**
 * Update the sound icon to indicate playing state
 * @param {boolean} isPlaying - Whether sound is playing
 */
function updateSoundIconPlaying(isPlaying) {
  const soundIcon = document.querySelector(".sound-icon")
  if (!soundIcon) return

  if (isPlaying) {
    soundIcon.textContent = "🔈"
    soundIcon.style.animation = "pulse 0.5s infinite"
  } else {
    soundIcon.textContent = "🔊"
    soundIcon.style.animation = ""
  }
}

/**
 * Set up all event listeners for the application
 */
function setupEventListeners() {
  // Initialize search elements
  initSearchElements(searchInput, searchButton)

  // Create search handler function
  const searchHandler = () =>
    handleSearch(
      (term) =>
        searchPokemonFromAPI(term, fetchPokemonByNameOrId, () =>
          resetDetailView(pokemonDetailCard)
        ),
      () => resetDetailView(pokemonDetailCard)
    )

  // Setup search events
  setupSearchEvents(searchHandler)

  // Setup theme toggle
  themeToggle.addEventListener("click", toggleTheme)
}
