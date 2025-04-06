/**
 * Pokédex Application
 * A web application that displays information about Pokémon using the PokeAPI.
 */

import { initTheme } from "./theme.js"
import { initializeSearch } from "./pokemon-search.js"
import { initializePokemonList } from "./pokemon-list.js"

async function initApp() {
  try {
    initTheme()
    initializeSearch()
    await initializePokemonList()
  } catch (error) {
    console.error("Error initializing app:", error)
  }
}

document.addEventListener("DOMContentLoaded", initApp)
