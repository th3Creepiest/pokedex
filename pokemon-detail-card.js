/**
 * Pokemon Detail Renderer Module
 * Handles the rendering of Pokemon detail information in the UI
 */

// Reference to the DOM element that displays Pokemon details
let pokemonDetailCard

/**
 * Initialize the renderer with the necessary DOM element
 * @param {HTMLElement} detailCardElement - The DOM element to render Pokemon details into
 */
export function initPokemonDetailCard(detailCardElement) {
  pokemonDetailCard = detailCardElement
}

/**
 * Render the Pokémon detail card with all information
 * @param {Object} pokemon - Pokémon data
 * @param {string} description - Pokémon description
 * @param {string} spriteUrl - URL of Pokémon sprite
 * @param {string} formattedId - Formatted Pokémon ID
 */
export function renderPokemonDetailCard(
  pokemon,
  description,
  spriteUrl,
  formattedId
) {
  pokemonDetailCard.innerHTML = `
    <div class="detail-header">
      <h2>${pokemon.name}</h2>
      <span class="pokemon-id">#${formattedId}</span>
    </div>
    <div class="detail-content">
      <div class="detail-image" title="Click to hear ${
        pokemon.name
      }'s cry" style="cursor: pointer; position: relative;">
        <img src="${spriteUrl}" alt="${pokemon.name}">
        <div class="sound-icon" style="position: absolute; bottom: 5px; right: 5px; font-size: 1.2rem;">🔊</div>
      </div>
      <div class="detail-info">
        ${renderTypesBadges(pokemon.types)}
        <p class="detail-description">${description}</p>
        ${renderPokemonAttributes(pokemon)}
        ${renderPokemonStats(pokemon.stats)}
      </div>
    </div>
  `
}

/**
 * Show error message in detail card
 * @param {string} pokemonName - Name of the Pokémon
 */
export function showPokemonDetailError(pokemonName) {
  pokemonDetailCard.innerHTML = `
    <div class="detail-header">
      <h2>${pokemonName}</h2>
    </div>
    <div class="detail-content">
      <p class="error">Failed to load details. Please try again.</p>
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
    .map((ability) => ability.ability.name.replace("-", " "))
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
  const statsHtml = stats
    .map((stat) => {
      const statName = stat.stat.name.replace("-", " ")
      const statValue = stat.base_stat
      const statPercentage = Math.min(100, (statValue / 255) * 100)

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
