import { fetchPokemonList } from "./api.js"
import { renderPokemonDetailCard } from "./pokemon-card.js"

const POKEMON_COUNT = 15 // Number of Pokémon to load initially

// Module state variables
let pokemonListElement // DOM Element for the list container
let allPokemon = [] // Stores all loaded Pokémon data
let selectedPokemonId = null // Currently selected Pokémon ID

/**
 * Initialize the Pokemon list component
 * @param {HTMLElement} listElement - The DOM element to render Pokemon list into
 */
export async function initializePokemonList(listElement) {
  try {
    pokemonListElement = listElement
    pokemonListElement.innerHTML = '<p class="loading">Loading Pokémon...</p>'
    allPokemon = await fetchPokemonList(POKEMON_COUNT)
    renderPokemonList(allPokemon)
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
  renderPokemonItems(pokemonData)

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
function addPokemonToCollection(pokemon) {
  if (!allPokemon.some((p) => p.id === pokemon.id)) {
    allPokemon.push(pokemon)
  }
}

/**
 * Render Pokémon items to the list
 * @param {Array} pokemonData - Array of Pokémon objects
 */
function renderPokemonItems(pokemonData) {
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

  // Only proceed if the selected Pokémon exists in the current data
  if (pokemonData.some((p) => p.id === selectedPokemonId)) {
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
 * Create a Pokémon list item element
 * @param {Object} pokemon - Pokémon data object
 * @returns {HTMLElement} - The created list item element
 */
function createPokemonListItem(pokemon) {
  // Create container element
  const listItem = document.createElement("div")
  listItem.className = "pokemon-list-item"
  listItem.dataset.id = pokemon.id

  // Get sprite image URL and format ID with leading zeros
  const spriteUrl = pokemon.sprites.front_default
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
  document.querySelectorAll(".pokemon-list-item").forEach((item) => {
    item.classList.remove("active")
  })
  listItem.classList.add("active")
  selectedPokemonId = pokemon.id
  renderPokemonDetailCard(pokemon)
}

/**
 * Process a Pokémon fetched from the API
 * @param {Object} pokemon - Fetched Pokémon data
 */
export function processFetchedPokemon(pokemon) {
  addPokemonToCollection(pokemon)
  renderPokemonList([pokemon])
  selectPokemonInList(pokemon.id)
}

/**
 * Select a Pokémon in the list by ID
 * @param {number} pokemonId - ID of the Pokémon to select
 */
function selectPokemonInList(pokemonId) {
  const listItem = document.querySelector(
    `.pokemon-list-item[data-id="${pokemonId}"]`
  )
  if (listItem) {
    listItem.click()
  }
}
