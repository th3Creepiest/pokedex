import { getPokemonCryUrl } from "./api.js"

let pokemonDetailCard

/**
 * @param {HTMLElement} detailCardElement
 */
export function initSound(detailCardElement) {
  pokemonDetailCard = detailCardElement
}

/**
 * Set up event listener for playing Pokémon cry
 * @param {string} pokemonName - Name of the Pokémon
 */
export function setupPokemonCryPlayback(pokemonName) {
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
  const soundIcon = pokemonDetailCard.querySelector(".sound-icon")
  if (!soundIcon) return

  if (isPlaying) {
    soundIcon.textContent = "🔈"
    soundIcon.style.animation = "pulse 0.5s infinite"
  } else {
    soundIcon.textContent = "🔊"
    soundIcon.style.animation = ""
  }
}
