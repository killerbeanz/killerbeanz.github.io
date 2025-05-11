const answerInput = document.getElementById('answer');
const equationDisplay = document.getElementById('equation');
const timerDisplay = document.getElementById('timer');
const submitButton = document.getElementById('submit');
const feedback = document.getElementById('feedback');

let timer;
let timeLeft = 5;
let currentPair = null;
let showingAnswer = false;

const min = 2;
const max = 999;

function getPairs() {
  const pairs = [];
  for (let i = min; i <= max; i++) {
    for (let j = i; j <= max; j++) {
      pairs.push([i, j]);
    }
  }
  return pairs;
}

function loadScores() {
  const data = localStorage.getItem('multiplicationScores');
  return data ? JSON.parse(data) : {};
}

function saveScores(scores) {
  localStorage.setItem('multiplicationScores', JSON.stringify(scores));
}

function pickNext(scores, pairs) {
  let minScore = Infinity;
  let candidates = [];

  for (const [a, b] of pairs) {
    const key = `${a}x${b}`;
    const score = scores[key] || 0;
    if (score < minScore) {
      minScore = score;
      candidates = [[a, b]];
    } else if (score === minScore) {
      candidates.push([a, b]);
    }
  }

  return candidates[Math.floor(Math.random() * candidates.length)];
}

function startTimer() {
  timeLeft = 5;
  timerDisplay.textContent = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      showAnswer();
    }
  }, 1000);
}

function showEquation() {
  const scores = loadScores();
  const pairs = getPairs();
  currentPair = pickNext(scores, pairs);
  equationDisplay.textContent = `${currentPair[0]} x ${currentPair[1]} = ?`;
  answerInput.value = '';
  feedback.textContent = '';
  showingAnswer = false;
  startTimer();
}

function showAnswer() {
  showingAnswer = true;
  feedback.textContent = `Time's up! Correct answer: ${currentPair[0] * currentPair[1]}. Type it to continue.`;
}

function handleSubmit() {
  const input = parseInt(answerInput.value.trim());
  const correct = currentPair[0] * currentPair[1];

  if (isNaN(input)) return;

  if (showingAnswer) {
    if (input === correct) {
      showEquation();
    } else {
      feedback.textContent = `Type the correct answer to continue: ${correct}`;
    }
  } else {
    clearInterval(timer);
    if (input === correct) {
      const scores = loadScores();
      const key = `${currentPair[0]}x${currentPair[1]}`;
      scores[key] = (scores[key] || 0) + 1;
      saveScores(scores);
      showEquation();
    } else {
      showAnswer();
    }
  }
}

submitButton.addEventListener('click', handleSubmit);
answerInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleSubmit();
});

showEquation();
