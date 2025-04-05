/**
 * Set up event listener for playing Pokémon cry
 * @param {HTMLElement} detailCardElement - The DOM element containing the Pokémon details
 * @param {string} pokemonName - Name of the Pokémon
 * @param {Function} [cryUrlGetter] - Function to get the URL for the Pokémon cry
 */
export function setupPokemonCryPlayback(
  detailCardElement,
  pokemonName,
  cryUrlGetter
) {
  const detailImage = detailCardElement.querySelector(".detail-image")
  detailImage.addEventListener("click", () => {
    playPokemonCry(detailCardElement, pokemonName, cryUrlGetter)
  })
}

/**
 * Play the cry sound for a Pokémon
 * @param {HTMLElement} detailCardElement - The DOM element containing the Pokémon details
 * @param {string} pokemonName - Name of the Pokémon
 * @param {Function} cryUrlGetter - Function to get the URL for the Pokémon cry
 */
async function playPokemonCry(detailCardElement, pokemonName, cryUrlGetter) {
  const soundUrl = cryUrlGetter(pokemonName)
  const audio = new Audio()

  try {
    // Update UI to show sound is playing
    updateSoundIconPlaying(detailCardElement, true)

    // Play the sound
    audio.src = soundUrl
    await audio.play()
  } catch (error) {
    console.error(`Failed to play sound for ${pokemonName}:`, error)
  } finally {
    // Reset UI after sound finishes (or fails)
    setTimeout(() => updateSoundIconPlaying(detailCardElement, false), 500)
  }
}

/**
 * Update the sound icon to indicate playing state
 * @param {HTMLElement} detailCardElement - The DOM element containing the Pokémon details
 * @param {boolean} isPlaying - Whether sound is playing
 */
function updateSoundIconPlaying(detailCardElement, isPlaying) {
  const soundIcon = detailCardElement.querySelector(".sound-icon")
  if (!soundIcon) return

  if (isPlaying) {
    soundIcon.textContent = "🔈"
    soundIcon.style.animation = "pulse 0.5s infinite"
  } else {
    soundIcon.textContent = "🔊"
    soundIcon.style.animation = ""
  }
}
