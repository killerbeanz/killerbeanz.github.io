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

const min = 2;
const max = 999;
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
          key: key,
          score: 0
        });
      }
    }
  }
  return list;
}

function loadScores() {
  const saved = localStorage.getItem('multiplicationScores');
  if (saved) {
    const scores = JSON.parse(saved);
    for (const item of allProblems) {
      if (scores[item.key] !== undefined) {
        item.score = scores[item.key];
      }
    }
  }
  updateAverageScore();
}

function saveScores() {
  const scores = {};
  for (const item of allProblems) {
    if (item.score > 0) {
      scores[item.key] = item.score;
    }
  }
  localStorage.setItem('multiplicationScores', JSON.stringify(scores));
  updateAverageScore();
}

function updateAverageScore() {
  const seenProblems = allProblems.filter(p => p.score > 0);
  const total = seenProblems.reduce((sum, p) => sum + p.score, 0);
  const average = seenProblems.length > 0 ? (total / seenProblems.length).toFixed(2) : 0;
  averageScoreDisplay.textContent = `Average Score: ${average}`;
}

function initializeBuffer() {
  allProblems.sort((a, b) => a.score - b.score);
  buffer = allProblems.slice(0, bufferSize);
}

function pickFromBuffer() {
  return buffer[Math.floor(Math.random() * buffer.length)];
}

function updateBuffer() {
  const minScore = Math.min(...buffer.map(p => p.score));
  const threshold = minScore + 3;

  const toReplace = buffer.filter(p => p.score >= threshold);
  for (const item of toReplace) {
    const index = buffer.indexOf(item);
    if (index !== -1) {
      for (const next of allProblems) {
        if (!buffer.includes(next) && next.score === minScore) {
          buffer[index] = next;
          break;
        }
      }
    }
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
    currentProblem.score += 1;
    saveScores();
    updateBuffer();
    feedback.textContent = 'Correct!';
    showProblem();
  }
}

answerInput.addEventListener('input', checkAnswer);

// Initialization
allProblems = createProblemList();
loadScores();
initializeBuffer();
showProblem();
