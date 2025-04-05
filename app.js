/**
 * Pokédex Application
 * A web application that displays information about Pokémon using the PokeAPI.
 */

import { loadTheme, toggleTheme } from "./theme.js"
import { initPokemonDetailCard } from "./pokemon-card.js"
import { fetchPokemonList, fetchPokemonByNameOrId } from "./api.js"
import {
  initPokemonList,
  setPokemonCollection,
  showPokemonListLoadingState,
  showPokemonListErrorState,
  renderPokemonList,
  resetDetailView,
  initSearchElements,
  setupSearchEvents,
  handleSearch,
  searchPokemonFromAPI,
  showPokemonDetail,
} from "./pokemon-list.js"

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

  setupSearchEvents(searchHandler)
  themeToggle.addEventListener("click", toggleTheme)
}
