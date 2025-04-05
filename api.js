const API_BASE_URL = "https://pokeapi.co/api/v2/";

/**
 * Fetches a list of Pokemon with detailed information
 * @param {number} count - Number of Pokemon to retrieve
 * @returns {Promise<Array<object>>} Array of detailed Pokemon objects
 * @throws {Error} If fetching data fails
 */
export async function fetchPokemonList(count) {
  try {
    const response = await fetch(`${API_BASE_URL}pokemon?limit=${count}`);
    const data = await response.json();

    const detailedPokemon = await Promise.all(
      data.results.map(async (pokemon) => {
        const detailResponse = await fetch(pokemon.url);
        return await detailResponse.json();
      })
    );

    return detailedPokemon;
  } catch (error) {
    console.error("Error fetching Pokemon list:", error);
    throw error;
  }
}

/**
 * Fetches detailed data for a specific Pokemon by name or ID
 * @param {string|number} nameOrId - Pokemon name or numeric ID
 * @returns {Promise<object>} Detailed Pokemon data object
 * @throws {Error} If Pokemon not found or network request fails
 */
export async function fetchPokemonByNameOrId(nameOrId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}pokemon/${nameOrId.toLowerCase()}`
    );
    if (!response.ok) throw new Error(`Pokemon '${nameOrId}' not found`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching Pokemon:", error);
    throw error;
  }
}

/**
 * Fetches species data for a Pokemon from provided URL
 * @param {string} speciesUrl - URL to Pokemon species resource
 * @returns {Promise<object>} Pokemon species data object
 * @throws {Error} If network request fails
 */
export async function fetchPokemonSpecies(speciesUrl) {
  try {
    const response = await fetch(speciesUrl);
    return await response.json();
  } catch (error) {
    console.error("Error fetching Pokemon species:", error);
    throw error;
  }
}

/**
 * Returns the PokemonShowdown URL for a Pokemon's cry sound.
 * @param {string} pokemonName - The name of the Pokemon
 * @returns {string} The URL to the Pokemon's cry sound file
 */
export function getPokemonCryUrl(pokemonName) {
  return `https://play.pokemonshowdown.com/audio/cries/${pokemonName.toLowerCase()}.mp3`;
}
