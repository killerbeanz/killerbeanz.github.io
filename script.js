const answerInput = document.getElementById('answer');
const equationDisplay = document.getElementById('equation');
const timerDisplay = document.getElementById('timer');
const feedback = document.getElementById('feedback');
const scoreDisplay = document.getElementById('score');
const missesDisplay = document.getElementById('misses');
const streakDisplay = document.getElementById('streak');
const progressBar = document.getElementById('progress-bar');
const resetButton = document.getElementById('reset');

let allProblems = [];
let buffer = [];
let currentProblem = null;
let timer = null;
let timeLeft = 5;
let showingAnswer = false;

let correctCount = 0;
let missCount = 0;
let streakCount = 0;

const min = 2;
const max = 99;
const bufferSize = 100;

function createProblemList() {
  const seen = new Set();
  const list = [];
  for (let a = min; a <= max; a++) {
    for (let b = min; b <= max; b++) {
      const key = [a, b].sort((x, y) => x - y).join('x');
      if (!seen.has(key)) {
        seen.add(key);
        list.push({
          a: a,
          b: b,
          answer: a * b,
          key: key
        });
      }
    }
  }
  return list;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function initializeBuffer() {
  shuffleArray(allProblems);
  buffer = allProblems.slice(0, bufferSize);
}

function pickFromBuffer() {
  return buffer[Math.floor(Math.random() * buffer.length)];
}

function cycleProblem(problem) {
  const bufferIndex = buffer.indexOf(problem);
  const allIndex = allProblems.indexOf(problem);

  if (bufferIndex !== -1) buffer.splice(bufferIndex, 1);
  if (allIndex !== -1) {
    allProblems.splice(allIndex, 1);
    allProblems.push(problem);
  }

  // Fill buffer from the front of allProblems
  while (buffer.length < bufferSize && buffer.length < allProblems.length) {
    const next = allProblems.find(p => !buffer.includes(p));
    if (!next) break;
    buffer.push(next);
  }
}

function updateStats() {
  scoreDisplay.textContent = `Score: ${correctCount}`;
  missesDisplay.textContent = `Misses: ${missCount}`;
  streakDisplay.textContent = `Streak: ${streakCount}`;
  const progress = (correctCount / allProblems.length) * 100;
  progressBar.style.width = `${progress.toFixed(1)}%`;
}

function showProblem() {
  clearInterval(timer);
  showingAnswer = false;
  currentProblem = pickFromBuffer();
  equationDisplay.textContent = `${currentProblem.a} x ${currentProblem.b} = ?`;
  answerInput.value = '';
  feedback.textContent = '';
  timeLeft = 5;
  timerDisplay.textContent = timeLeft;
  timer = setInterval(updateTimer, 1000);
}

function updateTimer() {
  timeLeft--;
  timerDisplay.textContent = timeLeft;
  if (timeLeft <= 0) {
    clearInterval(timer);
    feedback.textContent = `Time's up! Type: ${currentProblem.answer}`;
    showingAnswer = true;
    missCount++;
    streakCount = 0;
    updateStats();
  }
}

function checkAnswer() {
  const val = parseInt(answerInput.value.trim());
  if (showingAnswer) {
    if (val === currentProblem.answer) {
      feedback.textContent = '';
      showProblem();
    }
    return;
  }

  if (val === currentProblem.answer) {
    clearInterval(timer);
    correctCount++;
    streakCount++;
    feedback.textContent = 'Correct!';
    updateStats();
    cycleProblem(currentProblem);
    showProblem();
  }
}

function resetGame() {
  correctCount = 0;
  missCount = 0;
  streakCount = 0;
  allProblems = createProblemList();
  initializeBuffer();
  updateStats();
  showProblem();
}

answerInput.addEventListener('input', checkAnswer);
resetButton.addEventListener('click', resetGame);

// Initialize game
allProblems = createProblemList();
initializeBuffer();
updateStats();
showProblem();
