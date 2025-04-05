/**
 * Pokédex Application
 * A web application that displays information about Pokémon using the PokeAPI.
 */

import { initTheme } from "./theme.js"
import { initializePokemonList } from "./pokemon-list.js"
import { initPokemonDetailCard } from "./pokemon-card.js"

// DOM Elements
const pokemonList = document.getElementById("pokemon-list")
const pokemonDetailCard = document.getElementById("pokemon-detail-card")
const searchInput = document.getElementById("search-input")
const searchButton = document.getElementById("search-button")
const themeToggle = document.getElementById("theme-toggle")

async function initApp() {
  try {
    initTheme(themeToggle)
    initPokemonDetailCard(pokemonDetailCard)
    await initializePokemonList(
      pokemonList,
      searchInput,
      searchButton,
      pokemonDetailCard
    )
  } catch (error) {
    console.error("Error initializing app:", error)
  }
}

document.addEventListener("DOMContentLoaded", initApp)
