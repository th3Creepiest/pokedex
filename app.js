/**
 * Pokédex Application
 * A web application that displays information about Pokémon using the PokeAPI.
 */

import { loadTheme, toggleTheme } from "./theme.js"
import {
  initPokemonDetailCard,
  renderPokemonDetailCard,
  showPokemonDetailError,
} from "./pokemon-detail-card.js"
import {
  fetchPokemonList,
  fetchPokemonByNameOrId,
  fetchPokemonSpecies,
  getPokemonCryUrl,
} from "./api.js"

// Configuration
const POKEMON_COUNT = 50 // Number of Pokémon to load initially

// DOM Elements
const pokemonList = document.getElementById("pokemon-list")
const pokemonDetailCard = document.getElementById("pokemon-detail-card")
const searchInput = document.getElementById("search-input")
const searchButton = document.getElementById("search-button")
const themeToggle = document.getElementById("theme-toggle")

// Application State
let allPokemon = [] // Stores all loaded Pokémon data
let selectedPokemonId = null // Currently selected Pokémon ID

/**
 * Initialize the application
 * Loads theme, fetches initial Pokémon data, and sets up event listeners
 */
export async function initApp() {
  try {
    // Initialize theme based on user preference
    loadTheme()

    // Initialize the detail renderer with the detail card element
    initPokemonDetailCard(pokemonDetailCard)

    // Display loading indicator
    showLoadingState()

    // Fetch initial Pokémon data
    const pokemonData = await fetchPokemonList(POKEMON_COUNT)
    allPokemon = pokemonData

    // Display Pokémon list
    renderPokemonList(pokemonData)

    // Set up UI event handlers
    setupEventListeners()
  } catch (error) {
    console.error("Error initializing app:", error)
    showErrorState("Failed to load Pokémon. Please try again later.")
  }
}

/**
 * Display loading indicator in the Pokémon list
 */
function showLoadingState() {
  pokemonList.innerHTML = '<p class="loading">Loading Pokémon...</p>'
}

/**
 * Display error message in the Pokémon list
 * @param {string} message - Error message to display
 */
function showErrorState(message) {
  pokemonList.innerHTML = `<p class="error">${message}</p>`
}

/**
 * Render the list of Pokémon in the UI
 * @param {Array} pokemonData - Array of Pokémon objects to display
 */
function renderPokemonList(pokemonData) {
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
  pokemonList.innerHTML = ""
}

/**
 * Display a message when no Pokémon are found
 */
function showNoResultsMessage() {
  pokemonList.innerHTML =
    '<p class="no-results">No Pokémon found. Try a different search.</p>'
}

/**
 * Add Pokémon items to the list
 * @param {Array} pokemonData - Array of Pokémon objects
 */
function addPokemonToList(pokemonData) {
  pokemonData.forEach((pokemon) => {
    const listItem = createPokemonListItem(pokemon)
    pokemonList.appendChild(listItem)
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
  } else {
    // Clear selection if Pokémon is no longer in the list
    clearPokemonSelection()
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
 * Clear the Pokémon selection and reset detail view
 */
function clearPokemonSelection() {
  pokemonDetailCard.innerHTML = `
    <div class="empty-state">
      <p>Select a Pokémon to view details</p>
    </div>
  `
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
function formatPokemonId(id) {
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

  // Show Pokémon details
  showPokemonDetail(pokemon)

  // Update selected Pokémon ID
  selectedPokemonId = pokemon.id
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
 * Display detailed information about a Pokémon
 * @param {Object} pokemon - Pokémon data object
 */
async function showPokemonDetail(pokemon) {
  try {
    // Fetch additional species data
    const speciesData = await fetchPokemonSpecies(pokemon.species.url)

    // Get Pokémon description and sprite
    const description = getPokemonDescription(speciesData)
    const spriteUrl = getBestPokemonSprite(pokemon)
    const formattedId = formatPokemonId(pokemon.id)

    // Render the detail card
    renderPokemonDetailCard(pokemon, description, spriteUrl, formattedId)

    // Set up sound playback
    setupPokemonCryPlayback(pokemon.name)
  } catch (error) {
    console.error(`Error showing details for ${pokemon.name}:`, error)
    showPokemonDetailError(pokemon.name)
  }
}

/**
 * Get the Pokémon's description from species data
 * @param {Object} speciesData - Pokémon species data
 * @returns {string} - Pokémon description
 */
function getPokemonDescription(speciesData) {
  return (
    speciesData.flavor_text_entries
      .find((entry) => entry.language.name === "en")
      ?.flavor_text.replace(/\f/g, " ") || "No description available."
  )
}

/**
 * Get the best available sprite for a Pokémon
 * @param {Object} pokemon - Pokémon data
 * @returns {string} - URL of the best available sprite
 */
function getBestPokemonSprite(pokemon) {
  return (
    pokemon.sprites.versions["generation-v"]["black-white"].animated
      ?.front_default || pokemon.sprites.front_default
  )
}

/**
 * Set up event listener for playing Pokémon cry
 * @param {string} pokemonName - Name of the Pokémon
 */
function setupPokemonCryPlayback(pokemonName) {
  const detailImage = pokemonDetailCard.querySelector(".detail-image")
  detailImage.addEventListener("click", () => {
    playPokemonCry(pokemonName)
  })
}

/**
 * Play the cry sound for a Pokémon
 * @param {string} pokemonName - Name of the Pokémon
 */
async function playPokemonCry(pokemonName) {
  const soundUrl = getPokemonCryUrl(pokemonName)
  const audio = new Audio()

  try {
    // Update UI to show sound is playing
    updateSoundIconPlaying(true)

    // Play the sound
    audio.src = soundUrl
    await audio.play()
  } catch (error) {
    console.error(`Failed to play sound for ${pokemonName}:`, error)
  } finally {
    // Reset UI after sound finishes (or fails)
    setTimeout(() => updateSoundIconPlaying(false), 500)
  }
}

/**
 * Update the sound icon to indicate playing state
 * @param {boolean} isPlaying - Whether sound is playing
 */
function updateSoundIconPlaying(isPlaying) {
  const soundIcon = document.querySelector(".sound-icon")
  if (!soundIcon) return

  if (isPlaying) {
    soundIcon.textContent = "🔈"
    soundIcon.style.animation = "pulse 0.5s infinite"
  } else {
    soundIcon.textContent = "🔊"
    soundIcon.style.animation = ""
  }
}

/**
 * Filter Pokémon list based on search term
 * @param {string} searchTerm - Term to search for
 * @returns {Array} - Filtered list of Pokémon
 */
function filterPokemon(searchTerm) {
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
 * Set up all event listeners for the application
 */
function setupEventListeners() {
  setupSearchEvents()
  setupThemeToggle()
}

/**
 * Set up search-related event listeners
 */
function setupSearchEvents() {
  // Search button click
  searchButton.addEventListener("click", handleSearch)

  // Search input enter key
  searchInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      handleSearch()
    }
  })

  // Reset search when input is cleared
  searchInput.addEventListener("input", () => {
    if (searchInput.value.trim() === "") {
      renderPokemonList(allPokemon)
    }
  })
}

/**
 * Set up theme toggle event listener
 */
function setupThemeToggle() {
  themeToggle.addEventListener("click", toggleTheme)
}

/**
 * Handle search functionality
 */
async function handleSearch() {
  const searchTerm = searchInput.value.trim()

  // If search is empty, show all Pokémon
  if (!searchTerm) {
    renderPokemonList(allPokemon)
    return
  }

  // First try to filter from existing Pokémon
  const filteredPokemon = filterPokemon(searchTerm)

  if (filteredPokemon.length > 0) {
    // Display matches from current list
    renderPokemonList(filteredPokemon)
  } else {
    // Try to fetch from API if not found locally
    await searchPokemonFromAPI(searchTerm)
  }
}

/**
 * Search for a Pokémon from the API
 * @param {string} searchTerm - Term to search for
 */
async function searchPokemonFromAPI(searchTerm) {
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
  }
}

/**
 * Show searching state in the UI
 */
function showSearchingState() {
  pokemonList.innerHTML = '<p class="loading">Searching for Pokémon...</p>'
}

/**
 * Process a Pokémon fetched from the API
 * @param {Object} pokemon - Fetched Pokémon data
 */
function processFetchedPokemon(pokemon) {
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
function addPokemonToCollection(pokemon) {
  if (!allPokemon.some((p) => p.id === pokemon.id)) {
    allPokemon.push(pokemon)
  }
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

/**
 * Show search error in the UI
 * @param {string} searchTerm - The term that was searched
 */
function showSearchError(searchTerm) {
  // Show error message
  pokemonList.innerHTML = `
    <p class="error">Pokémon "${searchTerm}" not found. Please try a different search.</p>
  `

  // Reset detail view
  clearPokemonSelection()
}
