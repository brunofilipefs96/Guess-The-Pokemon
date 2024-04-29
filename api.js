export async function getRandomPokemon() {
    try {
        const randomId = Math.floor(Math.random() * 151) + 1; 
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching Pokémon data:', error);
        throw error;
    }
}
