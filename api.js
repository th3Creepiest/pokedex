const API_BASE_URL = "https://pokeapi.co/api/v2/";

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

export async function fetchPokemonSpecies(speciesUrl) {
  try {
    const response = await fetch(speciesUrl);
    return await response.json();
  } catch (error) {
    console.error("Error fetching Pokemon species:", error);
    throw error;
  }
}
