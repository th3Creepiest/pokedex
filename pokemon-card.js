import { fetchPokemonSpecies } from "./api.js"
import { setupPokemonCryPlayback } from "./pokemon-sound.js"

const pokemonDetailCard = document.getElementById("pokemon-detail-card")

/**
 * Render the Pokémon detail card with all information
 * @param {Object} pokemon - Pokémon data
 */
export async function renderPokemonDetailCard(pokemon) {
  try {
    const speciesData = await fetchPokemonSpecies(pokemon.species.url)
    const description = getPokemonDescription(speciesData)
    const spriteUrl = getBestPokemonSprite(pokemon)

    // Render the card using helper functions
    pokemonDetailCard.innerHTML = `
      ${renderHeader(pokemon)}
      <div class="detail-content">
        ${renderImage(pokemon, spriteUrl)}
        <div class="detail-info">
          ${renderTypesBadges(pokemon.types)}
          <p class="detail-description">${description}</p>
          ${renderPokemonAttributes(pokemon)}
          ${renderPokemonStats(pokemon.stats)}
        </div>
      </div>
    `
    setupPokemonCryPlayback(pokemon.name, pokemonDetailCard)
  } catch (error) {
    console.error(`Error showing details for ${pokemon.name}:`, error)
    showPokemonDetailError(pokemon.name, error.message)
  }
}

/**
 * Get the best available sprite for a Pokémon
 * @param {Object} pokemon - Pokémon data
 * @returns {string} - URL of the best available sprite
 */
function getBestPokemonSprite(pokemon) {
  // Try to get animated sprite first, fall back to static sprite
  return (
    pokemon.sprites.versions?.["generation-v"]?.["black-white"]?.animated
      ?.front_default || pokemon.sprites.front_default
  )
}

/**
 * Get the Pokémon's description from species data
 * @param {Object} speciesData - Pokémon species data
 * @returns {string} - Pokémon description
 */
function getPokemonDescription(speciesData) {
  const englishEntry = speciesData.flavor_text_entries.find(
    (entry) => entry.language.name === "en"
  )
  return englishEntry
    ? englishEntry.flavor_text.replace(/\f/g, " ")
    : "No description available."
}

/**
 * Show error message in detail card
 * @param {string} pokemonName - Name of the Pokémon
 * @param {string} errorMessage - Optional specific error message
 */
function showPokemonDetailError(pokemonName, errorMessage = "") {
  const errorText = errorMessage
    ? `Error: ${errorMessage}`
    : "Failed to load details. Please try again."
  pokemonDetailCard.innerHTML = `
    <div class="detail-header">
      <h2>${pokemonName}</h2>
    </div>
    <div class="detail-content">
      <p class="error">${errorText}</p>
    </div>
  `
}

/**
 * Render the header section with name and ID
 * @param {Object} pokemon - Pokémon data
 * @returns {string} - HTML for header section
 */
function renderHeader(pokemon) {
  const formattedId = pokemon.id.toString().padStart(3, "0")
  return `
    <div class="detail-header">
      <h2>${pokemon.name}</h2>
      <span class="pokemon-id">#${formattedId}</span>
    </div>
  `
}

/**
 * Render the image section with sound icon
 * @param {Object} pokemon - Pokémon data
 * @param {string} spriteUrl - URL to the Pokémon sprite
 * @returns {string} - HTML for image section
 */
function renderImage(pokemon, spriteUrl) {
  return `
    <div class="detail-image" title="Click to hear ${pokemon.name}'s cry" style="cursor: pointer; position: relative;">
      <img src="${spriteUrl}" alt="${pokemon.name}">
      <div class="sound-icon" style="position: absolute; bottom: 5px; right: 5px; font-size: 1.2rem;">🔊</div>
    </div>
  `
}

/**
 * Render type badges for a Pokémon
 * @param {Array} types - Pokémon types
 * @returns {string} - HTML for type badges
 */
function renderTypesBadges(types) {
  const typeHtml = types
    .map(
      (type) =>
        `<span class="type-badge ${type.type.name}">${type.type.name}</span>`
    )
    .join("")

  return `<div class="detail-types">${typeHtml}</div>`
}

/**
 * Render Pokémon physical attributes and abilities
 * @param {Object} pokemon - Pokémon data
 * @returns {string} - HTML for attributes section
 */
function renderPokemonAttributes(pokemon) {
  const height = (pokemon.height / 10).toFixed(1)
  const weight = (pokemon.weight / 10).toFixed(1)
  const abilities = pokemon.abilities
    .map((ability) => ability.ability.name.replace(/-/g, " "))
    .join(", ")

  return `
    <div class="detail-attributes">
      <p><strong>Height:</strong> ${height} m</p>
      <p><strong>Weight:</strong> ${weight} kg</p>
      <p><strong>Abilities:</strong> ${abilities}</p>
    </div>
  `
}

/**
 * Render Pokémon stats with progress bars
 * @param {Array} stats - Pokémon stats
 * @returns {string} - HTML for stats section
 */
function renderPokemonStats(stats) {
  const MAX_STAT_VALUE = 255

  const statsHtml = stats
    .map((stat) => {
      const statName = stat.stat.name.replace(/-/g, " ")
      const statValue = stat.base_stat
      const statPercentage = Math.min(100, (statValue / MAX_STAT_VALUE) * 100)

      return `
        <div class="stat-bar">
          <span class="stat-name">${statName}</span>
          <span class="stat-value">${statValue}</span>
          <div class="stat-bar-outer">
            <div class="stat-bar-inner" style="width: ${statPercentage}%"></div>
          </div>
        </div>
      `
    })
    .join("")

  return `
    <div class="detail-stats">
      <h3>Base Stats</h3>
      ${statsHtml}
    </div>
  `
}
