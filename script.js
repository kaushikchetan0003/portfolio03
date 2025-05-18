const wordHints = [
    { word: "cat", hint: "A small furry animal that says 'meow'" },
    { word: "dog", hint: "Man's best friend, often barks" },
    { word: "elephant", hint: "The largest land animal with big ears" },
    { word: "pencil", hint: "A tool used for writing, often has an eraser" },
    { word: "guitar", hint: "A musical instrument with strings" }

];
const correctSound = new Audio('sounds/correct.mp3');
const wrongSound = new Audio('sounds/wrong.mp3');
const winSound = new Audio('sounds/win.mp3');
const loseSound = new Audio('sounds/lose.mp3')
const canvas = document.getElementById('hangmanCanvas');
const ctx = canvas.getContext('2d');

let selectedWord = "";
let displayedWord = [];
let currentHint = "";
let score = 0;
let wrongLetters = [];
let timeLeft = 60;

function startGame() {
    // Pick a random word and its associated hint
    const randomIndex = Math.floor(Math.random() * wordHints.length);
    selectedWord = wordHints[randomIndex].word;
    currentHint = wordHints[randomIndex].hint;

    // Display hint as the question
    document.getElementById("hintDisplay").innerText = "Hint: " + currentHint;

    displayedWord = Array(selectedWord.length).fill("_");
    wrongLetters = [];
    score = 0;
    timeLeft = 60;

    updateDisplay();
}

function updateDisplay() {
    document.getElementById("wordDisplay").innerText = displayedWord.join(" ");
    document.getElementById("wrongLetters").innerText = "Wrong Letters: " + wrongLetters.join(", ");
    document.getElementById("score").innerText = "Score: " + score;
    document.getElementById("timer").innerText = "Time Left: " + timeLeft;
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawHangman(wrongGuessCount) {
    switch (wrongGuessCount) {
        case 1: // Base
            ctx.beginPath();
            ctx.moveTo(10, 240);
            ctx.lineTo(190, 240);
            ctx.stroke();
            break;
        case 2: // Pole
            ctx.beginPath();
            ctx.moveTo(50, 240);
            ctx.lineTo(50, 20);
            ctx.lineTo(130, 20);
            ctx.lineTo(130, 40);
            ctx.stroke();
            break;
        case 3: // Head
            ctx.beginPath();
            ctx.arc(130, 60, 20, 0, Math.PI * 2);
            ctx.stroke();
            break;
        case 4: // Body
            ctx.beginPath();
            ctx.moveTo(130, 80);
            ctx.lineTo(130, 140);
            ctx.stroke();
            break;
        case 5: // Left Arm
            ctx.beginPath();
            ctx.moveTo(130, 100);
            ctx.lineTo(100, 120);
            ctx.stroke();
            break;
        case 6: // Right Arm
            ctx.beginPath();
            ctx.moveTo(130, 100);
            ctx.lineTo(160, 120);
            ctx.stroke();
            break;
        case 7: // Left Leg
            ctx.beginPath();
            ctx.moveTo(130, 140);
            ctx.lineTo(110, 180);
            ctx.stroke();
            break;
        case 8: // Right Leg
            ctx.beginPath();
            ctx.moveTo(130, 140);
            ctx.lineTo(150, 180);
            ctx.stroke();
            break;
    }
}




function guessLetter() {
    const input = document.getElementById("letterInput");
    const guess = input.value.toLowerCase();
    input.value = "";

    if (!guess || guess.length !== 1) {
        alert("Please enter one letter!");
        return;
    }

    if (selectedWord.includes(guess)) {
        selectedWord.split('').forEach((letter, idx) => {
            if (letter === guess) {
                displayedWord[idx] = guess;
                score += 10;
            }
        });
        correctSound.play();
    } else {
        if (!wrongLetters.includes(guess)) {
            wrongLetters.push(guess);
            score -= 5;
            wrongSound.play();
            drawHangman(wrongLetters.length); // ✅ draw body part
        }
    }

    updateDisplay();
    checkGameStatus();
    input.focus();
}


function checkGameStatus() {
    if (!displayedWord.includes("_")) {
        document.getElementById("message").innerText = "🎉 You Won!";
        clearInterval(timerInterval);
        winSound.play(); // ✅ Play win sound
    }

    if (wrongLetters.length >= 6) {
        document.getElementById("message").innerText = `😢 You Lost! Word was: ${selectedWord}`;
        clearInterval(timerInterval);
        loseSound.play(); // ✅ Play lose sound
    }
}


function updateTimer() {
    timeLeft--;
    document.getElementById("timer").innerText = `⏳ Time Left: ${timeLeft}s`;

    if (timeLeft <= 0) {
        document.getElementById("message").innerText = `⏳ Time's up! Word was: ${selectedWord}`;
        clearInterval(timerInterval);
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

// Start game initially
startGame();
