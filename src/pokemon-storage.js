/**
 * Storage Module
 * Handles localStorage operations for caching Pokemon data and theme preferences
 */

/**
 * Save Pokemon data to localStorage
 * @param {Array} pokemonData - Array of Pokemon objects to save
 */
export function savePokemonToLocalStorage(pokemonData) {
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
export function loadPokemonFromLocalStorage() {
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
 * Save theme preference to localStorage
 * @param {string} theme - The theme preference ('dark' or 'light')
 */
export function saveTheme(theme) {
  try {
    localStorage.setItem("pokedex-theme", theme)
  } catch (error) {
    console.error("Error saving theme to localStorage:", error)
  }
}

/**
 * Load theme preference from localStorage
 * @returns {string|null} - The saved theme preference or null if not found
 */
export function loadTheme() {
  try {
    return localStorage.getItem("pokedex-theme")
  } catch (error) {
    console.error("Error loading theme from localStorage:", error)
    return null
  }
}
