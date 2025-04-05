/**
 * Pokemon Detail Card
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

/**
 * Get the best available sprite for a Pokémon
 * @param {Object} pokemon - Pokémon data
 * @returns {string} - URL of the best available sprite
 */
export function getBestPokemonSprite(pokemon) {
  return (
    pokemon.sprites.versions["generation-v"]["black-white"].animated
      ?.front_default || pokemon.sprites.front_default
  )
}

/**
 * Set up event listener for playing Pokémon cry
 * @param {string} pokemonName - Name of the Pokémon
 * @param {Function} [cryUrlGetter] - Function to get the URL for the Pokémon cry
 */
export function setupPokemonCryPlayback(pokemonName, cryUrlGetter) {
  const detailImage = pokemonDetailCard.querySelector(".detail-image")
  detailImage.addEventListener("click", () => {
    playPokemonCry(pokemonName, cryUrlGetter)
  })
}

/**
 * Play the cry sound for a Pokémon
 * @param {string} pokemonName - Name of the Pokémon
 * @param {Function} cryUrlGetter - Function to get the URL for the Pokémon cry
 */
async function playPokemonCry(pokemonName, cryUrlGetter) {
  const soundUrl = cryUrlGetter(pokemonName)
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
 * Get the Pokémon's description from species data
 * @param {Object} speciesData - Pokémon species data
 * @returns {string} - Pokémon description
 */
export function getPokemonDescription(speciesData) {
  return (
    speciesData.flavor_text_entries
      .find((entry) => entry.language.name === "en")
      ?.flavor_text.replace(/\f/g, " ") || "No description available."
  )
}
