import { fetchPokemonSpecies, fetchPokemonList } from "./api.js"
import { setupPokemonCryPlayback } from "./pokemon-sound.js"
import {
  renderPokemonDetailCard,
  showPokemonDetailError,
  getPokemonDescription,
  getBestPokemonSprite,
} from "./pokemon-card.js"

const POKEMON_COUNT = 50 // Number of Pokémon to load initially

// DOM Elements
let pokemonListElement

// State variables
let allPokemon = [] // Stores all loaded Pokémon data
let selectedPokemonId = null // Currently selected Pokémon ID
let onPokemonSelectCallback = null // Callback function when a Pokemon is selected

/**
 * @param {HTMLElement} listElement - The DOM element to render Pokemon list into
 * @param {HTMLElement} inputElement - The search input element
 * @param {HTMLElement} buttonElement - The search button element
 * @param {HTMLElement} detailCardElement - The Pokemon detail card element
 */
export async function initializePokemonList(listElement) {
  try {
    pokemonListElement = listElement
    onPokemonSelectCallback = showPokemonDetail
    pokemonListElement.innerHTML = '<p class="loading">Loading Pokémon...</p>'

    // Fetch initial Pokémon data
    const pokemonData = await fetchPokemonList(POKEMON_COUNT)
    allPokemon = pokemonData

    // Render the list
    renderPokemonList(pokemonData)
  } catch (error) {
    console.error("Error initializing Pokemon list:", error)
    pokemonListElement.innerHTML = `<p class="error">Failed to load Pokémon. Please try again later.</p>`
  }
}

/**
 * Get the full Pokemon collection
 * @returns {Array} - Array of all Pokemon objects
 */
export function getPokemonList() {
  return allPokemon
}

/**
 * Display searching state in the UI
 */
export function showSearchingStateOnList() {
  pokemonListElement.innerHTML =
    '<p class="loading">Searching for Pokémon...</p>'
}

/**
 * Show search error in the UI
 * @param {string} searchTerm - The term that was searched
 */
export function showSearchErrorOnList(searchTerm) {
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
  addPokemonToList2(pokemonData)

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
 * Add a Pokémon to the collection if not already present
 * @param {Object} pokemon - Pokémon to add
 */
function addPokemonToList1(pokemon) {
  if (!allPokemon.some((p) => p.id === pokemon.id)) {
    allPokemon.push(pokemon)
  }
}

/**
 * Add Pokémon items to the list
 * @param {Array} pokemonData - Array of Pokémon objects
 */
function addPokemonToList2(pokemonData) {
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
  const formattedId = pokemon.id.toString().padStart(3, "0")

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
 * Process a Pokémon fetched from the API
 * @param {Object} pokemon - Fetched Pokémon data
 */
export function processFetchedPokemon(pokemon) {
  addPokemonToList1(pokemon)
  renderPokemonList([pokemon])
  selectPokemonInList(pokemon.id)
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
    const speciesData = await fetchPokemonSpecies(pokemon.species.url)
    const description = getPokemonDescription(speciesData)
    const spriteUrl = getBestPokemonSprite(pokemon)
    renderPokemonDetailCard(pokemon, description, spriteUrl)
    setupPokemonCryPlayback(pokemon.name)
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
