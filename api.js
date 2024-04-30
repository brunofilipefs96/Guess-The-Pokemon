export async function getRandomPokemon(region) {
    let regionId;
    switch(region) {
        case 'kanto':
            regionId = Math.floor(Math.random() * 151) + 1;
            break;
        case 'johto':
            regionId = Math.floor(Math.random() * 100) + 152;
            break;
        case 'hoenn':
            regionId = Math.floor(Math.random() * 135) + 252;
            break;
    }
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${regionId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching Pokémon data:', error);
        throw error;
    }
}

export async function getTotalPokemonCount(region) {
    let regionId;
    switch(region) {
        case 'kanto':
            regionId = 151;
            break;
        case 'johto':
            regionId = 100;
            break;
        case 'hoenn':
            regionId = 135;
            break;
    }
    return regionId;
}
