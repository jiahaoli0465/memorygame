// Retrieve from local storage
let lowestScore;
if (localStorage.getItem('lowestScore')) {
  lowestScore = parseInt(localStorage.getItem('lowestScore'));
  document.getElementById("lowestScore").textContent = lowestScore;
  document.getElementById("lowestScoreIn").textContent = lowestScore;
} else {
  lowestScore = 99999;
}

// Prevent scrolling and interactions on the initial screen
document.body.style.overflow = 'hidden';
document.body.style.overflowY = 'hidden';

document.getElementById("restartGame").addEventListener("click", restartGame);

// DOM references
const gameContainer = document.getElementById("game");

// Game state variables
let gameStart = false;
let score = 0;
let flippedCards = [];
let isProcessing = false;
// Timer variables

let timer = 30;
let timerInterval;

// Function to start the countdown timer
function startTimer() {
    timerInterval = setInterval(function() {
        timer--;
        document.getElementById("timer").textContent = timer;
        if (timer <= 0) {
            gameOver();
        }
    }, 1000);
}

// Function to stop the timer
function stopTimer() {
    clearInterval(timerInterval);
}

// Function to reset the timer
function resetTimer() {
    stopTimer();
    timer = 35;
    document.getElementById("timer").textContent = timer;
}

// Function to handle game over due to timer reaching 0
// Function to handle game over due to timer reaching 0
function gameOver() {
  stopTimer();
  document.getElementById("widgetTitle").textContent = "Game Over!";
  document.getElementById("widgetMessage").textContent = "Time's up!";
  showRestartButton();
}


// Array of colors for the game (16 colors)
const COLORS = [
  "red", "blue", "green", "orange", "purple", "yellow", "cyan", "magenta",
  "red", "blue", "green", "orange", "purple", "yellow", "cyan", "magenta"
];

// Event listener to start the game when the button is clicked
document.getElementById("startGame").addEventListener("click", function() {
  // Calculate the position to scroll to
  const gameBoard = document.getElementById("gameBoard");
  const gameBoardTop = gameBoard.offsetTop;
  const gameBoardHeight = gameBoard.offsetHeight;
  const windowHeight = window.innerHeight;
  const scrollToPosition = (gameBoardTop + (gameBoardHeight / 2)) - (windowHeight / 2);

  // Smoothly scroll to the calculated position
  window.scrollTo({
    top: scrollToPosition,
    behavior: 'smooth'
  });

  // After a short delay, hide the initial screen
  setTimeout(() => {
    document.getElementById("initialScreen").style.display = 'none';
  }, 1000);

  // Start the game
  startGame();
});

// Function to shuffle an array
function shuffle(array) {
  let counter = array.length;
  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}

// Function to create div elements for each color in the array
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    const newDiv = document.createElement("div");
    newDiv.classList.add(color);
    newDiv.addEventListener("click", handleCardClick);
    gameContainer.append(newDiv);
  }
}

// Function to handle the logic when a card is clicked
function handleCardClick(event) {
  // Exit if the game hasn't started or other conditions are met
  if (!gameStart) return;
  const card = event.target;
  console.log("you clicked", card)
  if (card.style.backgroundColor || flippedCards.includes(card) || flippedCards.length >= 2 || isProcessing) return;

  // Show the card's color
  card.style.backgroundColor = card.classList[0];
  flippedCards.push(card);
  
  // Logic for when two cards are flipped
  if (flippedCards.length == 2) {
    isProcessing = true;
    const [firstCard, secondCard] = flippedCards;

    // Check if the two cards match
    if (firstCard.classList[0] === secondCard.classList[0]) {
      firstCard.classList.add("matched");
      secondCard.classList.add("matched");
      console.log("match")
      
      // Check if all cards are matched
      if (allCardsMatched()) {
        score++;
        stopTimer();
        document.getElementById("scoreDisplay").textContent = score;
        if (score < lowestScore) {
            lowestScore = score;
            localStorage.setItem('lowestScore', lowestScore);
            document.getElementById("lowestScore").textContent = lowestScore;
        }
        document.getElementById("widgetTitle").textContent = "Congratulations!";
        document.getElementById("widgetMessage").textContent = "You've matched all the cards!";
        showRestartButton();
    }
    
    
      setTimeout(function() {
        isProcessing = false;
        flippedCards = [];
      }, 500);
    } else {
      // Logic for when the two cards don't match
      setTimeout(function() {
        firstCard.style.backgroundColor = '';
        secondCard.style.backgroundColor = '';
        flippedCards = [];
        isProcessing = false;
      }, 750);
    }
    // Increment the score and update the display
    if (!allCardsMatched()){
    score++;
    document.getElementById("scoreDisplay").textContent = score;
    }
  }
}

// Function to check if all cards are matched
function allCardsMatched() {
  const matchedCards = document.querySelectorAll(".matched").length;
  let matchedCardsLength = matchedCards;
  console.log("Number of matched cards:", matchedCards);

  return matchedCardsLength === COLORS.length;
}

// Function to start the game
function startGame() {
  hideRestartButton();
  startTimer();
  shuffledColors = shuffle(COLORS);
  createDivsForColors(shuffledColors);
  gameStart = true;
}

function showRestartButton() {
  gameContainer.classList.add('blurred');

  // Show the game complete widget
  document.getElementById("gameCompleteWidget").style.display = 'block';
}

function hideRestartButton() {
  // Remove the blur from the game container
  gameContainer.classList.remove('blurred');

  // Hide the restart button
  document.getElementById("restartGame").style.display = 'none';
}
document.getElementById("widgetRestartGame").addEventListener("click", restartGame);

function restartGame() {
  // Reset game state
  resetTimer();
  // Hide the game complete widget
  document.getElementById("gameCompleteWidget").style.display = 'none';
  
  gameStart = false;
  score = 0;
  flippedCards = [];
  isProcessing = false;
  
  // Clear the game container
  gameContainer.innerHTML = '';

  // Reset score display
  document.getElementById("scoreDisplay").textContent = '0';

  // Hide the restart button and remove the blur
  hideRestartButton();

  // Start a new game
  startGame();
}
