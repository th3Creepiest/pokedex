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
  getPokemonDescription,
  showPokemonDetailError,
  getBestPokemonSprite,
  setupPokemonCryPlayback,
} from "./pokemon-card.js"
import {
  fetchPokemonList,
  fetchPokemonByNameOrId,
  fetchPokemonSpecies,
  getPokemonCryUrl,
} from "./api.js"

const POKEMON_COUNT = 50 // Number of Pokémon to load initially

// DOM Elements
const pokemonList = document.getElementById("pokemon-list")
const pokemonDetailCard = document.getElementById("pokemon-detail-card")
const searchInput = document.getElementById("search-input")
const searchButton = document.getElementById("search-button")
const themeToggle = document.getElementById("theme-toggle")

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
    setupPokemonCryPlayback(pokemon.name, getPokemonCryUrl)
  } catch (error) {
    console.error(`Error showing details for ${pokemon.name}:`, error)
    showPokemonDetailError(pokemon.name)
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
