const answerInput = document.getElementById('answer');
const equationDisplay = document.getElementById('equation');
const timerDisplay = document.getElementById('timer');
const feedback = document.getElementById('feedback');
const averageScoreDisplay = document.getElementById('average-score');

let allProblems = [];
let buffer = [];
let currentProblem = null;
let timer = null;
let timeLeft = 5;
let showingAnswer = false;
let correctCount = 0;

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

function initializeBuffer() {
  shuffleArray(allProblems);
  buffer = allProblems.slice(0, bufferSize).map(p => ({ ...p, score: 0 }));
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function pickFromBuffer() {
  return buffer[Math.floor(Math.random() * buffer.length)];
}

function cycleProblem(problem) {
  const index = buffer.indexOf(problem);
  if (index !== -1) {
    buffer.splice(index, 1); // remove from current position
    buffer.push({ ...problem, score: 0 }); // reset score and push to end
  }
}

function updateAverageScore() {
  const totalPossible = allProblems.length;
  const average = (correctCount / totalPossible).toFixed(6);
  averageScoreDisplay.textContent = `Average Score: ${average}`;
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
    updateAverageScore();
    cycleProblem(currentProblem); // move it to the end of buffer
    showProblem();
  }
}

answerInput.addEventListener('input', checkAnswer);

// Init
allProblems = createProblemList();
initializeBuffer();
updateAverageScore();
showProblem();
