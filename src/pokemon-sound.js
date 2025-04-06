import { getPokemonCryUrl } from "./api.js"

/**
 * Set up event listener for playing Pokémon cry
 * @param {string} pokemonName - Name of the Pokémon
 */
export function setupPokemonCryPlayback(pokemonName) {
  const container = document.querySelector("#pokemon-detail-card")
  if (!container) {
    console.error("Detail card element not found")
    return
  }
  const detailImage = container.querySelector(".detail-image")
  if (!detailImage) {
    console.error("Detail image element not found")
    return
  }
  detailImage.addEventListener("click", () => {
    playPokemonCry(pokemonName, container)
  })
}

/**
 * Play the cry sound for a Pokémon
 * @param {string} pokemonName - Name of the Pokémon
 * @param {HTMLElement} container - The container element with the sound icon
 */
async function playPokemonCry(pokemonName, container) {
  const soundUrl = getPokemonCryUrl(pokemonName)
  const audio = new Audio()
  try {
    updateSoundIconPlaying(true, container)
    audio.src = soundUrl
    await audio.play()
  } catch (error) {
    console.error(`Failed to play sound for ${pokemonName}:`, error)
  } finally {
    setTimeout(() => updateSoundIconPlaying(false, container), 500)
  }
}

/**
 * Update the sound icon to indicate playing state
 * @param {boolean} isPlaying - Whether sound is playing
 * @param {HTMLElement} container - The container element with the sound icon
 */
function updateSoundIconPlaying(isPlaying, container) {
  const soundIcon = container.querySelector(".sound-icon")
  if (!soundIcon) return
  if (isPlaying) {
    soundIcon.textContent = "🔈"
    soundIcon.style.animation = "pulse 0.5s infinite"
  } else {
    soundIcon.textContent = "🔊"
    soundIcon.style.animation = ""
  }
}
