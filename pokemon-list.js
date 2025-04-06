import { fetchPokemonList } from "./api.js"
import { renderPokemonDetailCard } from "./pokemon-card.js"

const POKEMON_COUNT = 25 // Number of Pokémon to load initially
const pokemonListElement = document.getElementById("pokemon-list")

let allPokemon = []
let selectedPokemonId = null

export async function initializePokemonList() {
  pokemonListElement.innerHTML = '<p class="loading">Loading Pokémon...</p>'
  try {
    const cachedPokemon = loadPokemonFromLocalStorage()
    if (cachedPokemon && cachedPokemon.length > 0) {
      allPokemon = cachedPokemon
      console.log("Loaded Pokémon data from local storage")
    } else {
      allPokemon = await fetchPokemonList(POKEMON_COUNT)
      savePokemonToLocalStorage(allPokemon)
    }
    renderPokemonList(allPokemon)
  } catch (error) {
    console.error("Error initializing Pokemon list:", error)
    pokemonListElement.innerHTML = `<p class="error">Failed to load Pokémon. Please try again later.</p>`
  }
}

/**
 * Save Pokemon data to localStorage
 * @param {Array} pokemonData - Array of Pokemon objects to save
 */
function savePokemonToLocalStorage(pokemonData) {
  try {
    localStorage.setItem("cachedPokemon", JSON.stringify(pokemonData))
    localStorage.setItem("pokemonCacheTimestamp", Date.now().toString())
    console.log("Saved Pokémon data to local storage")
  } catch (error) {
    console.error("Error saving Pokémon to localStorage:", error)
  }
}

/**
 * Load Pokemon data from localStorage
 * @returns {Array|null} - Array of Pokemon objects or null if no valid cache
 */
function loadPokemonFromLocalStorage() {
  try {
    const cachedData = localStorage.getItem("cachedPokemon")
    const cacheTimestamp = localStorage.getItem("pokemonCacheTimestamp")

    // Check if cache exists and is not too old (24 hours)
    const CACHE_MAX_AGE = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
    const isValidCache =
      cacheTimestamp && Date.now() - parseInt(cacheTimestamp) < CACHE_MAX_AGE

    if (cachedData && isValidCache) {
      return JSON.parse(cachedData)
    }
    return null
  } catch (error) {
    console.error("Error loading Pokémon from localStorage:", error)
    return null
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
  pokemonListElement.innerHTML = ""

  if (pokemonData.length === 0) {
    pokemonListElement.innerHTML =
      '<p class="no-results">No Pokémon found. Try a different search.</p>'
    return
  }

  // Add each Pokémon to the list
  pokemonData.forEach((pokemon) => {
    const listItem = createPokemonListItem(pokemon)
    pokemonListElement.appendChild(listItem)
  })

  // Maintain selection state if applicable
  if (!selectedPokemonId) return
  if (pokemonData.some((p) => p.id === selectedPokemonId)) {
    const listItem = document.querySelector(
      `.pokemon-list-item[data-id="${selectedPokemonId}"]`
    )
    listItem.classList.add("active")
  }
}

/**
 * Create a Pokémon list item element
 * @param {Object} pokemon - Pokémon data object
 * @returns {HTMLElement} - The created list item element
 */
function createPokemonListItem(pokemon) {
  const spriteUrl = pokemon.sprites.front_default
  const formattedId = pokemon.id.toString().padStart(3, "0")
  const listItem = document.createElement("div")
  listItem.className = "pokemon-list-item"
  listItem.dataset.id = pokemon.id
  listItem.innerHTML = `
    <img src="${spriteUrl}" alt="${pokemon.name}">
    <div class="pokemon-list-item-info">
      <h3>${pokemon.name}</h3>
      <span class="pokemon-id">#${formattedId}</span>
    </div>
  `
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
  if (!allPokemon.some((p) => p.id === pokemon.id)) {
    allPokemon.push(pokemon)
  }
  renderPokemonList([pokemon])
}
