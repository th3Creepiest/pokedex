/**
 * Pokédex Application
 * A web application that displays information about Pokémon using the PokeAPI.
 */

import { loadTheme, toggleTheme } from "./theme.js"
import { initializePokemonList } from "./pokemon-list.js"
import { initPokemonDetailCard } from "./pokemon-card.js"

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

    // Initialize Pokemon list with all required parameters
    await initializePokemonList(
      pokemonList,
      searchInput,
      searchButton,
      pokemonDetailCard
    )

    themeToggle.addEventListener("click", toggleTheme)
  } catch (error) {
    console.error("Error initializing app:", error)
  }
}
