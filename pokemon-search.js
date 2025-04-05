import { fetchPokemonByNameOrId } from "./api.js"
import { getPokemonList, renderPokemonList } from "./pokemon-list.js"

let searchInput = null
let searchButton = null

/**
 * Initialize the search functionality
 * @param {HTMLElement} inputElement - The search input element
 * @param {HTMLElement} buttonElement - The search button element
 */
export function initializeSearch(inputElement, buttonElement) {
  searchInput = inputElement
  searchButton = buttonElement

  // Initialize search functionality
  const searchCallback = () =>
    handleSearch((term) =>
      searchPokemonFromAPI(
        term,
        fetchPokemonByNameOrId,
        () => processFetchedPokemon,
        showSearchingState,
        showSearchError
      )
    )

  // Set up event listeners
  setupSearchEvents(searchCallback)
}

/**
 * Set up search-related event listeners
 * @param {Function} searchHandler - The function to handle search
 */
function setupSearchEvents(searchHandler) {
  // Search button click
  searchButton.addEventListener("click", searchHandler)

  // Search input enter key
  searchInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      searchHandler()
    }
  })

  // Reset search when input is cleared
  searchInput.addEventListener("input", () => {
    if (searchInput.value.trim() === "") {
      renderPokemonList(getPokemonList())
    }
  })
}

/**
 * Handle search functionality
 * @param {Function} searchPokemonAPI - Function to search Pokemon from API
 * @param {Function} resetDetailViewFn - Function to reset detail view
 */
function handleSearch(searchPokemonAPI, resetDetailViewFn) {
  const searchTerm = searchInput.value.trim()

  // If search is empty, show all Pokémon
  if (!searchTerm) {
    renderPokemonList(getPokemonList())
    return
  }

  // First try to filter from existing Pokémon
  const filteredPokemon = filterPokemon(searchTerm)

  if (filteredPokemon.length > 0) {
    // Display matches from current list
    renderPokemonList(filteredPokemon)
  } else {
    // Try to fetch from API if not found locally
    searchPokemonAPI(searchTerm, resetDetailViewFn)
  }
}

/**
 * Search for a Pokémon from the API
 * @param {string} searchTerm - Term to search for
 * @param {Function} fetchPokemonByNameOrId - Function to fetch Pokemon data
 * @param {Function} resetDetailViewFn - Function to reset detail view
 * @param {Function} processFetchedPokemonFn - Function to process fetched Pokemon
 * @param {Function} showSearchingStateFn - Function to show searching state
 * @param {Function} showSearchErrorFn - Function to show search error
 */
async function searchPokemonFromAPI(
  searchTerm,
  fetchPokemonByNameOrId,
  resetDetailViewFn,
  processFetchedPokemonFn,
  showSearchingStateFn,
  showSearchErrorFn
) {
  try {
    // Show searching indicator
    showSearchingStateFn()

    // Fetch Pokémon data
    const pokemon = await fetchPokemonByNameOrId(searchTerm)

    // Process the found Pokémon
    if (pokemon) {
      processFetchedPokemonFn(pokemon)
    }
  } catch (error) {
    // Handle search error
    showSearchErrorFn(searchTerm)
    // Reset detail view
    resetDetailViewFn()
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
