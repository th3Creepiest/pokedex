import {
  showPokemonDetailError,
  renderPokemonDetailCard,
  getPokemonDescription,
  getBestPokemonSprite,
  setupPokemonCryPlayback,
} from "./pokemon-card.js"

import {
  fetchPokemonSpecies,
  getPokemonCryUrl,
  fetchPokemonList,
  fetchPokemonByNameOrId,
} from "./api.js"

const POKEMON_COUNT = 50 // Number of Pokémon to load initially

// DOM Elements
let pokemonListElement
let searchInput = null
let searchButton = null

let allPokemon = [] // Stores all loaded Pokémon data
let selectedPokemonId = null // Currently selected Pokémon ID
let onPokemonSelectCallback = null // Callback function when a Pokemon is selected

/**
 * @param {HTMLElement} listElement - The DOM element to render Pokemon list into
 * @param {HTMLElement} inputElement - The search input element
 * @param {HTMLElement} buttonElement - The search button element
 * @param {HTMLElement} detailCardElement - The Pokemon detail card element
 */
export async function initializePokemonList(
  listElement,
  inputElement,
  buttonElement,
  detailCardElement
) {
  try {
    pokemonListElement = listElement
    searchInput = inputElement
    searchButton = buttonElement
    onPokemonSelectCallback = showPokemonDetail
    pokemonListElement.innerHTML = '<p class="loading">Loading Pokémon...</p>'
    // Fetch initial Pokémon data
    const pokemonData = await fetchPokemonList(POKEMON_COUNT)
    allPokemon = pokemonData
    // Render the list
    renderPokemonList(pokemonData)
    // Set up event listeners
    setupEventListeners(detailCardElement, fetchPokemonByNameOrId)
  } catch (error) {
    console.error("Error initializing Pokemon list:", error)
    pokemonListElement.innerHTML = `<p class="error">Failed to load Pokémon. Please try again later.</p>`
  }
}

/**
 * Get the full Pokemon collection
 * @returns {Array} - Array of all Pokemon objects
 */
export function getPokemonCollection() {
  return allPokemon
}

/**
 * Display searching state in the UI
 */
export function showSearchingState() {
  pokemonListElement.innerHTML =
    '<p class="loading">Searching for Pokémon...</p>'
}

/**
 * Show search error in the UI
 * @param {string} searchTerm - The term that was searched
 */
export function showSearchError(searchTerm) {
  pokemonListElement.innerHTML = `
    <p class="error">Pokémon "${searchTerm}" not found. Please try a different search.</p>
  `
}

/**
 * Render the list of Pokémon in the UI
 * @param {Array} pokemonData - Array of Pokémon objects to display
 */
export function renderPokemonList(pokemonData) {
  // Clear the current list
  clearPokemonList()

  // Show message if no Pokémon found
  if (pokemonData.length === 0) {
    showNoResultsMessage()
    return
  }

  // Add each Pokémon to the list
  addPokemonToList(pokemonData)

  // Maintain selection state if applicable
  updateSelectionState(pokemonData)
}

/**
 * Clear the Pokémon list container
 */
function clearPokemonList() {
  pokemonListElement.innerHTML = ""
}

/**
 * Display a message when no Pokémon are found
 */
function showNoResultsMessage() {
  pokemonListElement.innerHTML =
    '<p class="no-results">No Pokémon found. Try a different search.</p>'
}

/**
 * Add Pokémon items to the list
 * @param {Array} pokemonData - Array of Pokémon objects
 */
function addPokemonToList(pokemonData) {
  pokemonData.forEach((pokemon) => {
    const listItem = createPokemonListItem(pokemon)
    pokemonListElement.appendChild(listItem)
  })
}

/**
 * Update the selection state in the UI
 * @param {Array} pokemonData - Current list of Pokémon
 */
function updateSelectionState(pokemonData) {
  if (!selectedPokemonId) return

  const selectedPokemon = pokemonData.find((p) => p.id === selectedPokemonId)

  if (selectedPokemon) {
    // Highlight the selected Pokémon in the list
    highlightSelectedPokemon()
  }
}

/**
 * Highlight the selected Pokémon in the list
 */
function highlightSelectedPokemon() {
  const listItem = document.querySelector(
    `.pokemon-list-item[data-id="${selectedPokemonId}"]`
  )
  if (listItem) {
    listItem.classList.add("active")
  }
}

/**
 * Clear the Pokémon selection
 */
export function clearPokemonSelection() {
  selectedPokemonId = null
}

/**
 * Create a Pokémon list item element
 * @param {Object} pokemon - Pokémon data object
 * @returns {HTMLElement} - The created list item element
 */
function createPokemonListItem(pokemon) {
  // Create container element
  const listItem = document.createElement("div")
  listItem.className = "pokemon-list-item"
  listItem.dataset.id = pokemon.id

  // Get sprite image URL
  const spriteUrl = pokemon.sprites.front_default

  // Format Pokémon ID with leading zeros
  const formattedId = formatPokemonId(pokemon.id)

  // Create list item content
  listItem.innerHTML = `
    <img src="${spriteUrl}" alt="${pokemon.name}">
    <div class="pokemon-list-item-info">
      <h3>${pokemon.name}</h3>
      <span class="pokemon-id">#${formattedId}</span>
    </div>
  `

  // Add click event handler
  listItem.addEventListener("click", () =>
    handlePokemonSelection(pokemon, listItem)
  )

  return listItem
}

/**
 * Format Pokémon ID with leading zeros
 * @param {number} id - Pokémon ID
 * @returns {string} - Formatted ID with leading zeros
 */
export function formatPokemonId(id) {
  return id.toString().padStart(3, "0")
}

/**
 * Handle Pokémon selection from the list
 * @param {Object} pokemon - Selected Pokémon data
 * @param {HTMLElement} listItem - The clicked list item element
 */
function handlePokemonSelection(pokemon, listItem) {
  // Clear previous selection
  clearPreviousSelection()

  // Highlight selected item
  listItem.classList.add("active")

  // Update selected Pokémon ID
  selectedPokemonId = pokemon.id

  // Call the callback function if provided
  if (onPokemonSelectCallback) {
    onPokemonSelectCallback(pokemon)
  }
}

/**
 * Clear previous Pokémon selection
 */
function clearPreviousSelection() {
  document.querySelectorAll(".pokemon-list-item").forEach((item) => {
    item.classList.remove("active")
  })
}

/**
 * Filter Pokémon list based on search term
 * @param {string} searchTerm - Term to search for
 * @returns {Array} - Filtered list of Pokémon
 */
export function filterPokemon(searchTerm) {
  // Return all Pokémon if no search term
  if (!searchTerm) {
    return allPokemon
  }

  // Normalize search term
  const normalizedTerm = searchTerm.toLowerCase()

  // Filter Pokémon that match any criteria
  return allPokemon.filter((pokemon) => {
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

/**
 * Process a Pokémon fetched from the API
 * @param {Object} pokemon - Fetched Pokémon data
 */
export function processFetchedPokemon(pokemon) {
  // Add to collection if not already there
  addPokemonToCollection(pokemon)

  // Display the Pokémon
  renderPokemonList([pokemon])

  // Automatically select it
  selectPokemonInList(pokemon.id)
}

/**
 * Add a Pokémon to the collection if not already present
 * @param {Object} pokemon - Pokémon to add
 */
export function addPokemonToCollection(pokemon) {
  if (!allPokemon.some((p) => p.id === pokemon.id)) {
    allPokemon.push(pokemon)
  }
}

/**
 * Select a Pokémon in the list by ID
 * @param {number} pokemonId - ID of the Pokémon to select
 */
export function selectPokemonInList(pokemonId) {
  const listItem = document.querySelector(
    `.pokemon-list-item[data-id="${pokemonId}"]`
  )
  if (listItem) {
    listItem.click()
  }
}

/**
 * Display detailed information about a Pokémon
 * @param {Object} pokemon - Pokémon data object
 */
export async function showPokemonDetail(pokemon) {
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
 * Reset the detail view to empty state
 */
export function resetDetailView(detailCardElement) {
  detailCardElement.innerHTML = `
    <div class="empty-state">
      <p>Select a Pokémon to view details</p>
    </div>
  `
  clearPokemonSelection()
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
      renderPokemonList(getPokemonCollection())
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
    renderPokemonList(getPokemonCollection())
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
 */
export async function searchPokemonFromAPI(
  searchTerm,
  fetchPokemonByNameOrId,
  resetDetailViewFn
) {
  try {
    // Show searching indicator
    showSearchingState()

    // Fetch Pokémon data
    const pokemon = await fetchPokemonByNameOrId(searchTerm)

    // Process the found Pokémon
    if (pokemon) {
      processFetchedPokemon(pokemon)
    }
  } catch (error) {
    // Handle search error
    showSearchError(searchTerm)
    // Reset detail view
    resetDetailViewFn()
  }
}

/**
 * Set up all event listeners for the Pokemon list functionality
 * @param {HTMLElement} detailCardElement - The Pokemon detail card element
 * @param {Function} fetchPokemonByNameOrIdFn - Function to fetch Pokemon by name or ID
 */
export function setupEventListeners(
  detailCardElement,
  fetchPokemonByNameOrIdFn
) {
  // Create search handler function
  const searchHandler = () =>
    handleSearch(
      (term) =>
        searchPokemonFromAPI(term, fetchPokemonByNameOrIdFn, () =>
          resetDetailView(detailCardElement)
        ),
      () => resetDetailView(detailCardElement)
    )

  setupSearchEvents(searchHandler)
}
