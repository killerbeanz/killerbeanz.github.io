const answerInput = document.getElementById('answer');
const equationDisplay = document.getElementById('equation');
const timerDisplay = document.getElementById('timer');
const feedback = document.getElementById('feedback');
const scoreDisplay = document.getElementById('score');

let allProblems = [];
let buffer = [];
let currentProblem = null;
let timer = null;
let timeLeft = 5;
let showingAnswer = false;
let correctCount = 0;

const min = 2;
const max = 99; // change if you want more difficulty
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

  if (bufferIndex !== -1) {
    buffer.splice(bufferIndex, 1);
  }

  if (allIndex !== -1) {
    allProblems.splice(allIndex, 1);
    allProblems.push(problem);
  }

  // Fill buffer with the next unseen item from allProblems
  while (buffer.length < bufferSize && buffer.length < allProblems.length) {
    const next = allProblems.find(p => !buffer.includes(p));
    if (!next) break;
    buffer.push(next);
  }
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
  }
}

function updateScore() {
  scoreDisplay.textContent = `Score: ${correctCount}`;
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
    updateScore();
    cycleProblem(currentProblem);
    showProblem();
  }
}

answerInput.addEventListener('input', checkAnswer);

// Initialize game
allProblems = createProblemList();
initializeBuffer();
updateScore();
showProblem();
