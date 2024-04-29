import { getRandomPokemon } from './api.js';

let currentPokemonData = null;
let guessedPokemonList = [];
let lives = 3;
let score = 0;
const scoreElement = document.getElementById('score-value');

window.checkGuess = function() {
    if (!currentPokemonData) {
        console.error('Nenhum dado de Pokémon disponível.');
        return;
    }

    const pokemonName = currentPokemonData.name.toLowerCase();
    console.log('Nome correto do Pokémon:', pokemonName);

    const formattedPokemonName = pokemonName.replace(/-.*/, '');

    const selectBoxes = document.querySelectorAll('.letter-select');
    let guess = '';
    selectBoxes.forEach(selectBox => {
        guess += selectBox.value;
    });
    guess = guess.toLowerCase();
    console.log('Palpite do usuário:', guess);

    if (guess === formattedPokemonName) {
        guessedPokemonList.push(pokemonName);
        score++;
        scoreElement.textContent = score;
        updateLivesDisplay();

        if (score === 151) {
            displayModal('Congratulations!', 'You found all 151 Pokémon!');
            const checkButton = document.getElementById('check-button');
            if (checkButton) {
                checkButton.textContent = 'Try Again';
                checkButton.setAttribute('onclick', 'restartGame()');
            }
        } else {
            displayModal('Congratulations!', 'You guessed the Pokémon correctly!');
            generateNewPokemon();
        }
    } else {
        lives--;
        updateLivesDisplay();
        if (lives < 1) {
            displayModal('Game over!', 'You have run out of lives.');
            const checkButton = document.getElementById('check-button');
            if (checkButton) {
                checkButton.textContent = 'Try Again';
                checkButton.setAttribute('onclick', 'restartGame()');
            }
        } else {
            displayModal('Wrong guess', `Sorry, wrong guess. You have ${lives} lives remaining. Try again!`);
        }
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

// Generate a new Pokémon
function generateNewPokemon() {
    getRandomPokemon().then(data => {
        const newPokemonName = data.name;
        if (guessedPokemonList.includes(newPokemonName)) {
            generateNewPokemon();
        } else {
            currentPokemonData = data;
            updatePokemonDisplay();
        }
    }).catch(error => {
        console.error('Error fetching Pokémon data:', error);
    });
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

// Update the lives display
function updateLivesDisplay() {
    const livesElement = document.getElementById('lives');
    if (livesElement) {
        livesElement.textContent = `Lives: ${lives}`;
    } else {
        console.error('Element with ID "lives" not found.');
    }
}

// Restart the game
window.restartGame = function() {
    guessedPokemonList = [];
    lives = 3;
    score = 0;
    scoreElement.textContent = score;
    updateLivesDisplay();
    const checkButton = document.getElementById('check-button');
    if (checkButton) {
        checkButton.textContent = 'Guess';
        checkButton.setAttribute('onclick', 'checkGuess()');
    }
    generateNewPokemon();
}

// Initialize the Pokédex
document.addEventListener('DOMContentLoaded', () => {
    updateLivesDisplay();
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
