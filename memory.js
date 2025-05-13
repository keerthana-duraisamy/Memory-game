// Variables to store game state
let board = document.getElementById('gameBoard');
let scoreDisplay = document.getElementById('scoreCount');
let movesDisplay = document.getElementById('movesCount');
let restartButton = document.getElementById('restartButton');
let flippedCards = [];
let matchedCards = [];
let score = 0;
let movesLeft = 20; // Starting moves

// Card values (pairs of images)
const icons = [
    'images/watermelon.png',
    'images/burger.png',
    'images/kitty.png',
    'images/orange-juice.png',
    'images/fish.png',
    'images/latte-art.png',
    'images/cake-slice.png',
    'images/angry-birds.png',
];

// Create pairs of icons
let cardValues = [...icons, ...icons]; // Duplicate for pairs

// Shuffle function (Fisher-Yates algorithm)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Create the game board
function createBoard() {
    board.innerHTML = '';
    shuffle(cardValues);

    cardValues.forEach(iconPath => {
        let card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('data-value', iconPath);

        let cardFront = document.createElement('div');
        cardFront.classList.add('card-front');
        card.appendChild(cardFront);

        let cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        let img = document.createElement('img');
        img.src = iconPath;
        img.alt = 'Card image';
        img.classList.add('card-image');
        cardBack.appendChild(img);

        card.appendChild(cardBack);
        card.addEventListener('click', flipCard);
        board.appendChild(card);
    });
}

// Handle card flipping
function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains('flipped') && !this.classList.contains('matched')) {
        this.classList.add('flipped');
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            movesLeft--;
            movesDisplay.textContent = movesLeft;

            setTimeout(() => {
                checkMatch();

                // Only show lose message if game is not already won
                if (movesLeft === 0 && document.querySelectorAll('.matched').length !== cardValues.length) {
                    displayLoseMessage();
                }
            }, 1000);
        }
    }
}

// Check if the flipped cards match
function checkMatch() {
    const [firstCard, secondCard] = flippedCards;

    if (firstCard.getAttribute('data-value') === secondCard.getAttribute('data-value')) {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        score += 10;

        setTimeout(() => {
            firstCard.style.visibility = 'hidden';
            secondCard.style.visibility = 'hidden';
        }, 500);
    } else {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
    }

    flippedCards = [];
    scoreDisplay.textContent = score;

    if (document.querySelectorAll('.matched').length === cardValues.length) {
        displayWinMessage();
    }
}

// Display win message
function displayWinMessage() {
    board.style.display = 'none';
    restartButton.style.display = 'none';

    let winMessage = document.createElement('div');
    winMessage.classList.add('win-message');
    winMessage.innerHTML = `
        <h2>Congratulations! You won!</h2>
        <p>Your score: ${score}</p>
        <button id="newRestartButton">Restart Game</button>
    `;
    document.body.appendChild(winMessage);

    document.getElementById('newRestartButton').addEventListener('click', restartGame);
}

// Display lose message
function displayLoseMessage() {
    board.style.display = 'none';
    restartButton.style.display = 'none';

    let loseMessage = document.createElement('div');
    loseMessage.classList.add('lose-message');
    loseMessage.innerHTML = `
        <h2>Game Over! You lost.</h2>
        <p>Your score: ${score}</p>
        <button id="newRestartButton">Restart Game</button>
    `;
    document.body.appendChild(loseMessage);

    document.getElementById('newRestartButton').addEventListener('click', restartGame);
}

// Restart the game
function restartGame() {
    score = 0;
    movesLeft = 20;
    scoreDisplay.textContent = score;
    movesDisplay.textContent = movesLeft;
    flippedCards = [];
    matchedCards = [];

    board.style.display = 'grid';
    document.querySelector('.win-message')?.remove();
    document.querySelector('.lose-message')?.remove();

    restartButton.style.display = 'inline-block';
    createBoard();
}

// Initial setup
scoreDisplay.textContent = score;
movesDisplay.textContent = movesLeft; // Ensures "20" shows on first load
restartButton.addEventListener('click', restartGame);
createBoard();
