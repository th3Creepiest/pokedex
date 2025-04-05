import {
  getPokemonList,
  renderPokemonList,
  showSearchErrorOnList,
  showSearchingStateOnList,
  processFetchedPokemon,
} from "./pokemon-list.js"
import { fetchPokemonByNameOrId } from "./api.js"

let searchInput
let searchButton

/**
 * Initialize the search functionality
 * @param {HTMLElement} inputElement - Search input element
 * @param {HTMLElement} buttonElement - Search button element
 */
export function initializeSearch(inputElement, buttonElement) {
  searchInput = inputElement
  searchButton = buttonElement

  const handleSearch = async () => {
    const term = searchInput.value.trim()
    if (!term) return

    const localResults = filterLocalPokemon(term)
    if (localResults.length > 0) {
      renderPokemonList(localResults)
    } else {
      try {
        showSearchingStateOnList()
        const pokemon = await fetchPokemonByNameOrId(term)
        if (pokemon) processFetchedPokemon(pokemon)
      } catch (error) {
        showSearchErrorOnList(term)
      }
    }
  }

  searchInput.addEventListener(
    "keyup",
    (e) => e.key === "Enter" && handleSearch()
  )
  searchInput.addEventListener("input", () => {
    if (searchInput.value.trim() === "") renderPokemonList(getPokemonList())
  })
  searchButton.addEventListener("click", handleSearch)
}

/**
 * Filters local Pokémon collection
 * @param {string} searchTerm - Raw search input
 * @returns {Pokemon[]}
 */
function filterLocalPokemon(searchTerm) {
  if (!searchTerm) return getPokemonList()
  const normalizedTerm = searchTerm.toLowerCase()
  return getPokemonList().filter((pokemon) =>
    hasAnyMatch(pokemon, normalizedTerm)
  )
}

/**
 * Checks all possible match conditions
 * @param {Pokemon} pokemon - Pokémon to check
 * @param {string} term - Normalized search term
 * @returns {boolean}
 */
function hasAnyMatch(pokemon, term) {
  return [
    matchesByName(pokemon, term),
    matchesById(pokemon, term),
    matchesByType(pokemon, term),
  ].some(Boolean)
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
  return pokemon.types.some(({ type }) => type.name.includes(term))
}
