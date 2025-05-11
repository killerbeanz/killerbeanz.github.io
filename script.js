const answerInput = document.getElementById('answer');
const equationDisplay = document.getElementById('equation');
const timerDisplay = document.getElementById('timer');
const feedback = document.getElementById('feedback');
const scoreDisplay = document.getElementById('score');
const resetButton = document.getElementById('reset');

let allProblems = [];
let buffer = [];
let currentProblem = null;
let timer = null;
let timeLeft = 5;
let showingAnswer = false;

let correctCount = 0;

const min = 2;
const max = 101; // 2x101 as max
const bufferSize = 100;

function createProblemList() {
  const list = [];
  for (let a = min; a <= max; a++) {
    for (let b = min; b <= max; b++) {
      list.push({
        a: a,
        b: b,
        answer: a * b,
        key: `${a}x${b}`
      });
    }
  }
  return list;
}

function initializeBuffer() {
  // Initialize buffer with problems from 2x2 to 2x101
  buffer = allProblems.slice(0, bufferSize);
}

function pickFromBuffer() {
  return buffer[Math.floor(Math.random() * buffer.length)];
}

function cycleProblem(problem) {
  // Remove the problem from the buffer and add it to the end of the allProblems list
  const bufferIndex = buffer.indexOf(problem);
  if (bufferIndex !== -1) buffer.splice(bufferIndex, 1);

  allProblems.push(problem);

  // Refills the buffer if it’s underfilled
  while (buffer.length < bufferSize && allProblems.length > buffer.length) {
    const next = allProblems.find(p => !buffer.includes(p));
    if (next) buffer.push(next);
  }
}

function updateStats() {
  scoreDisplay.textContent = `Score: ${correctCount}`;
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
    feedback.textContent = 'Correct!';
    updateStats();
    cycleProblem(currentProblem);
    showProblem();
  }
}

function resetGame() {
  correctCount = 0;
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
