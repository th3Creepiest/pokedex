import { fetchPokemonByNameOrId } from "./api.js"
import {
  getPokemonList,
  renderPokemonList,
  showSearchError,
  processFetchedPokemon,
  showSearchingState,
} from "./pokemon-list.js"

let searchInput = null
let searchButton = null

/**
 * Initialize the search functionality
 * @param {HTMLElement} inputElement - The search input element
 * @param {HTMLElement} buttonElement - The search button element
 */
export function initializeSearch(inputElement, buttonElement) {
  const searchCallback = handleSearch((term) =>
    searchPokemonFromAPI(
      term,
      fetchPokemonByNameOrId,
      processFetchedPokemon,
      showSearchingState,
      showSearchError
    )
  )
  searchButton = buttonElement
  searchButton.addEventListener("click", searchCallback)
  searchInput = inputElement
  searchInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") searchCallback()
  })
  searchInput.addEventListener("input", () => {
    if (searchInput.value.trim() === "") renderPokemonList(getPokemonList())
  })
}

/**
 * Handle search functionality
 * @param {Function} searchPokemonAPI - Function to search Pokemon from API
 */
function handleSearch(searchPokemonAPI) {
  return () => {
    if (!searchInput) {
      console.error("Search input element not initialized")
      return
    }
    const searchTerm = searchInput.value.trim()
    if (!searchTerm) return
    const filteredPokemon = filterPokemon(searchTerm)
    if (filteredPokemon.length > 0) renderPokemonList(filteredPokemon)
    else searchPokemonAPI(searchTerm)
  }
}

/**
 * Search for a Pokémon from the API
 * @param {string} searchTerm - Term to search for
 * @param {Function} fetchPokemonByNameOrId - Function to fetch Pokemon data
 * @param {Function} processFetchedPokemonFn - Function to process fetched Pokemon
 * @param {Function} showSearchingStateFn - Function to show searching state
 * @param {Function} showSearchErrorFn - Function to show search error
 */
async function searchPokemonFromAPI(
  searchTerm,
  fetchPokemonByNameOrId,
  processFetchedPokemonFn,
  showSearchingStateFn,
  showSearchErrorFn
) {
  try {
    showSearchingStateFn()
    const pokemon = await fetchPokemonByNameOrId(searchTerm)
    if (pokemon) processFetchedPokemonFn(pokemon)
  } catch (error) {
    showSearchErrorFn(searchTerm)
  }
}

/**
 * Filter Pokémon list based on search term
 * @param {string} searchTerm - Term to search for
 * @returns {Array} - Filtered list of Pokémon
 */
function filterPokemon(searchTerm) {
  if (!searchTerm) return getPokemonList()
  const normalizedTerm = searchTerm.toLowerCase()

  // Filter Pokémon that match any criteria
  return getPokemonList().filter((pokemon) => {
    return (
      matchesByName(pokemon, normalizedTerm) ||
      matchesById(pokemon, normalizedTerm) ||
      matchesByType(pokemon, normalizedTerm)
    )
  })
}

/**
 * Check if Pokémon matches by name
 * @param {Object} pokemon - Pokémon to check
 * @param {string} term - Search term
 * @returns {boolean} - Whether it matches
 */
function matchesByName(pokemon, term) {
  return pokemon.name.includes(term)
}

/**
 * Check if Pokémon matches by ID
 * @param {Object} pokemon - Pokémon to check
 * @param {string} term - Search term
 * @returns {boolean} - Whether it matches
 */
function matchesById(pokemon, term) {
  return pokemon.id.toString() === term
}

/**
 * Check if Pokémon matches by type
 * @param {Object} pokemon - Pokémon to check
 * @param {string} term - Search term
 * @returns {boolean} - Whether it matches
 */
function matchesByType(pokemon, term) {
  return pokemon.types.some((type) => type.type.name.includes(term))
}
