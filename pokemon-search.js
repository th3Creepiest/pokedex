import { renderPokemonList } from "./pokemon-list.js"

// DOM Elements
let searchInput = null
let searchButton = null

// State variables
let getPokemonCollectionFn = null // Function to get the Pokemon collection

/**
 * Initialize the search functionality
 * @param {HTMLElement} inputElement - The search input element
 * @param {HTMLElement} buttonElement - The search button element
 * @param {Function} searchCallback - Callback function for search handling
 * @param {Function} getPokemonCollection - Function to get Pokemon collection
 */
export function initializeSearch(
  inputElement,
  buttonElement,
  searchCallback,
  getPokemonCollection
) {
  searchInput = inputElement
  searchButton = buttonElement
  getPokemonCollectionFn = getPokemonCollection

  // Set up event listeners
  setupSearchEvents(searchCallback)
}

/**
 * Set up search-related event listeners
 * @param {Function} searchHandler - The function to handle search
 */
export function setupSearchEvents(searchHandler) {
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
      renderPokemonList(getPokemonCollectionFn())
    }
  })
}

/**
 * Handle search functionality
 * @param {Function} searchPokemonAPI - Function to search Pokemon from API
 * @param {Function} resetDetailViewFn - Function to reset detail view
 */
export function handleSearch(searchPokemonAPI, resetDetailViewFn) {
  const searchTerm = searchInput.value.trim()

  // If search is empty, show all Pokémon
  if (!searchTerm) {
    renderPokemonList(getPokemonCollectionFn())
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
export async function searchPokemonFromAPI(
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
export function filterPokemon(searchTerm) {
  // Return all Pokémon if no search term
  if (!searchTerm) {
    return getPokemonCollectionFn()
  }

  // Normalize search term
  const normalizedTerm = searchTerm.toLowerCase()

  // Filter Pokémon that match any criteria
  return getPokemonCollectionFn().filter((pokemon) => {
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
