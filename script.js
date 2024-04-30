import { getRandomPokemon, getTotalPokemonCount } from './api.js';

let currentPokemonData = null;
let guessedPokemonList = [];
let scores = [0, 0, 0]; 
let totalPokemonCounts = {};
const progressBarText = document.getElementById('progress-text');
let selectedRegion = 'kanto';

const regionIndexMap = {
    'kanto': 0,
    'johto': 1,
    'hoenn': 2
};

async function generateNewPokemon() {
    try {
        totalPokemonCounts[selectedRegion] = await getTotalPokemonCount(selectedRegion);
        progressBarText.textContent = `${scores[regionIndexMap[selectedRegion]]}/${totalPokemonCounts[selectedRegion]}`;

        const data = await getRandomPokemon(selectedRegion);
        currentPokemonData = data;
        updatePokemonDisplay();
    } catch (error) {
        console.error('Error fetching Pokémon data:', error);
    }
}

function handleRegionClick(region) {
    if (region === selectedRegion) {
        return;
    }

    document.querySelectorAll('.region-link').forEach(link => {
        link.classList.remove('border-b-2', 'border-green-400');
    });

    this.classList.add('border-b-2', 'border-green-400');

    selectedRegion = region;

    generateNewPokemon();
}

document.querySelectorAll('.region-link').forEach(link => {
    link.addEventListener('click', () => {
        const region = link.dataset.region;
        handleRegionClick.call(link, region);
    });
});

const defaultRegionLink = document.querySelector('.region-link');
defaultRegionLink.classList.add('selected');

window.checkGuess = function() {
    if (!currentPokemonData) {
        console.error('No current Pokémon data.');
        return;
    }

    const pokemonName = currentPokemonData.name.toLowerCase();
    const formattedPokemonName = pokemonName.replace(/-.*/, '');

    const selectBoxes = document.querySelectorAll('.letter-select');
    let guess = '';
    selectBoxes.forEach(selectBox => {
        guess += selectBox.value;
    });
    guess = guess.toLowerCase();

    if (guess === formattedPokemonName) {
        guessedPokemonList.push(pokemonName);
        scores[regionIndexMap[selectedRegion]]++;

        const totalPokemonCount = totalPokemonCounts[selectedRegion];
        if (scores[regionIndexMap[selectedRegion]] === totalPokemonCount) {
            displayModal('Congratulations!', 'You found all the Pokémon in this region!');
            const checkButton = document.getElementById('check-button');
            if (checkButton) {
                checkButton.textContent = 'Try Again';
                checkButton.setAttribute('onclick', 'restartGame()');
            }
        } else {
            generateNewPokemon();
        }

        // Atualiza a barra de progresso
        updateScoreProgressBar();
    } else {
        displayModal('Wrong guess', `Sorry, wrong guess. Keep trying!`);
    }
}

function displayModal(title, message) {
    const modalContainer = document.getElementById('modal-container');
    const modalContent = document.getElementById('modal-content');

    if (modalContainer && modalContent) {
        modalContent.innerHTML = `<h2 class="text-2xl font-bold mb-4">${title}</h2><p>${message}</p>`;
        modalContainer.classList.remove('hidden');
    } else {
        console.error('Modal container or content element not found.');
    }
}

// Função para fechar o modal
function closeModal() {
    const modalContainer = document.getElementById('modal-container');
    if (modalContainer) {
        modalContainer.classList.add('hidden');
    }
}

// Update the Pokémon display
function updatePokemonDisplay() {
    const pokemonImageElement = document.getElementById('pokemon-image');
    const letterBoxElement = document.getElementById('letter-box');

    if (!pokemonImageElement || !letterBoxElement) {
        console.error('Pokemon image or letter box element not found.');
        return;
    }

    pokemonImageElement.innerHTML = '';
    letterBoxElement.innerHTML = '';

    const pokemonName = currentPokemonData.name;
    const pokemonImageUrl = currentPokemonData.sprites.front_default;

    // Display Pokémon image
    const imageElement = document.createElement('img');
    imageElement.src = pokemonImageUrl;
    pokemonImageElement.appendChild(imageElement);

    // Create letter select boxes for guessing
    for (let i = 0; i < pokemonName.length; i++) {
        const selectBox = document.createElement('select');
        selectBox.classList.add('letter-select');
        for (let charCode = 65; charCode <= 90; charCode++) {
            const option = document.createElement('option');
            option.value = String.fromCharCode(charCode);
            option.text = String.fromCharCode(charCode);
            selectBox.appendChild(option);
        }
        letterBoxElement.appendChild(selectBox);
    }
}

function updateScoreProgressBar() {
    const progressBar = document.getElementById('progress-bar-inner');
    const progressText = document.getElementById('progress-text');

    if (!progressBar || !progressText) {
        console.error('Progress bar or progress text element not found.');
        return;
    }

    const totalPokemonCount = totalPokemonCounts[selectedRegion];
    const progress = scores[regionIndexMap[selectedRegion]] / totalPokemonCount;

    progressBar.style.width = `${progress * 100}%`;
    progressText.textContent = `${scores[regionIndexMap[selectedRegion]]}/${totalPokemonCount}`;
}

// Initialize the Pokédex
document.addEventListener('DOMContentLoaded', () => {
    updateScoreProgressBar();
    generateNewPokemon();
    const closeButton = document.getElementById('modal-close-button');
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const modalCloseButton = document.getElementById('modal-close-button');
        if (modalCloseButton) {
            modalCloseButton.focus();
        }
    }
});
