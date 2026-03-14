// ============================================
// Quiz Engine - MCQ, Drag-Drop, Type Command
// ============================================

import { playCorrect, playWrong } from './sounds.js';

let currentQuiz = null;
let currentIndex = 0;
let score = 0;
let answers = [];

export function startQuiz(quizData, onComplete) {
  currentQuiz = { questions: quizData, onComplete };
  currentIndex = 0;
  score = 0;
  answers = [];

  const overlay = document.getElementById('quiz-overlay');
  overlay.classList.remove('overlay-hidden');
  renderQuestion();
}

function renderQuestion() {
  const container = document.getElementById('quiz-container');
  const q = currentQuiz.questions[currentIndex];
  const total = currentQuiz.questions.length;

  const progressPct = ((currentIndex) / total) * 100;

  let html = `
    <div class="quiz-header">
      <span style="color: var(--text-dim);">Question ${currentIndex + 1} of ${total}</span>
      <button class="hud-btn" onclick="document.getElementById('quiz-overlay').classList.add('overlay-hidden')" title="Close">✕</button>
    </div>
    <div class="quiz-progress-bar">
      <div class="quiz-progress-fill" style="width: ${progressPct}%"></div>
    </div>
    <div class="quiz-question">${q.question}</div>
  `;

  if (q.type === 'mcq') {
    html += renderMCQ(q);
  } else if (q.type === 'type-command') {
    html += renderTypeCommand(q);
  } else if (q.type === 'drag-match') {
    html += renderDragMatch(q);
  }

  container.innerHTML = html;

  // Bind events after render
  if (q.type === 'mcq') bindMCQ(q);
  else if (q.type === 'type-command') bindTypeCommand(q);
  else if (q.type === 'drag-match') bindDragMatch(q);
}

// ==================== MCQ ====================
function renderMCQ(q) {
  let html = '<div class="quiz-options">';
  q.options.forEach((opt, i) => {
    html += `<div class="quiz-option" data-index="${i}">${opt}</div>`;
  });
  html += '</div>';
  html += `<div class="quiz-explanation" id="quiz-explanation">${q.explanation || ''}</div>`;
  return html;
}

function bindMCQ(q) {
  const options = document.querySelectorAll('.quiz-option');
  let answered = false;

  options.forEach(opt => {
    opt.addEventListener('click', () => {
      if (answered) return;
      answered = true;

      const selected = parseInt(opt.dataset.index);
      const correct = q.correct;

      if (selected === correct) {
        opt.classList.add('correct');
        score++;
        playCorrect();
      } else {
        opt.classList.add('wrong');
        options[correct].classList.add('correct');
        playWrong();
      }

      answers.push({ question: q.question, selected, correct, isCorrect: selected === correct });

      const explanation = document.getElementById('quiz-explanation');
      if (explanation && q.explanation) {
        explanation.classList.add('show');
      }

      setTimeout(() => nextQuestion(), 1500);
    });
  });
}

// ==================== TYPE COMMAND ====================
function renderTypeCommand(q) {
  let html = `
    <div style="margin-bottom: 16px; color: var(--text-dim); font-size: 14px;">${q.scenario || 'Type the correct command:'}</div>
    <input type="text" class="quiz-cmd-input" id="quiz-cmd-input" placeholder="Type your command here..." autocomplete="off" spellcheck="false">
    <div class="quiz-explanation" id="quiz-explanation">${q.explanation || `Correct answer: <code>${q.validAnswers[0]}</code>`}</div>
    <div style="margin-top: 12px;">
      <button class="btn-primary quiz-btn" id="quiz-submit-cmd">Submit</button>
      <button class="btn-secondary quiz-btn" id="quiz-hint-cmd" style="margin-left: 8px;">Hint</button>
    </div>
  `;
  return html;
}

function bindTypeCommand(q) {
  const input = document.getElementById('quiz-cmd-input');
  const submitBtn = document.getElementById('quiz-submit-cmd');
  const hintBtn = document.getElementById('quiz-hint-cmd');
  let attempts = 0;
  let answered = false;

  const checkAnswer = () => {
    if (answered) return;
    const userAnswer = input.value.trim();
    if (!userAnswer) return;

    const isCorrect = q.validAnswers.some(valid => {
      // Normalize both strings for comparison
      const normalize = s => s.replace(/\s+/g, ' ').trim().toLowerCase();
      const normalUser = normalize(userAnswer);
      const normalValid = normalize(valid);

      // Exact match
      if (normalUser === normalValid) return true;

      // Check if all key parts are present (order-independent flags)
      const userParts = normalUser.split(' ');
      const validParts = normalValid.split(' ');

      // Must have same command
      if (userParts[0] !== validParts[0]) return false;

      // Check all flags/args from valid answer exist in user answer
      const userSet = new Set(userParts);
      return validParts.every(p => userSet.has(p));
    });

    if (isCorrect) {
      input.classList.add('correct');
      score++;
      answered = true;
      playCorrect();
      answers.push({ question: q.question, isCorrect: true });
      setTimeout(() => nextQuestion(), 1200);
    } else {
      attempts++;
      input.classList.add('wrong');
      playWrong();
      setTimeout(() => input.classList.remove('wrong'), 400);

      if (attempts >= 3) {
        answered = true;
        const explanation = document.getElementById('quiz-explanation');
        if (explanation) explanation.classList.add('show');
        answers.push({ question: q.question, isCorrect: false });
        setTimeout(() => nextQuestion(), 2000);
      }
    }
  };

  submitBtn?.addEventListener('click', checkAnswer);
  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') checkAnswer();
  });

  hintBtn?.addEventListener('click', () => {
    if (q.hint) {
      input.placeholder = q.hint;
    } else if (q.validAnswers[0]) {
      const answer = q.validAnswers[0];
      input.placeholder = answer.substring(0, Math.ceil(answer.length * 0.4)) + '...';
    }
  });

  input?.focus();
}

// ==================== DRAG MATCH ====================
function renderDragMatch(q) {
  // Shuffle the draggable items
  const shuffled = [...q.pairs].sort(() => Math.random() - 0.5);

  let html = '<div class="drag-zone" id="drag-source">';
  shuffled.forEach((pair, i) => {
    html += `<div class="drag-item" draggable="true" data-value="${pair.value}" id="drag-${i}">${pair.value}</div>`;
  });
  html += '</div>';

  html += '<div style="margin-top: 16px;">';
  q.pairs.forEach((pair, i) => {
    html += `
      <div class="drag-target">
        <span class="drag-target-label">${pair.label}</span>
        <div class="drag-target-slot" data-expected="${pair.value}" id="slot-${i}"></div>
      </div>`;
  });
  html += '</div>';

  html += `<div style="margin-top: 16px;">
    <button class="btn-primary quiz-btn" id="quiz-check-drag">Check Answers</button>
  </div>`;

  return html;
}

function bindDragMatch(q) {
  const items = document.querySelectorAll('.drag-item');
  const slots = document.querySelectorAll('.drag-target-slot');
  const source = document.getElementById('drag-source');
  let draggedEl = null;

  items.forEach(item => {
    item.addEventListener('dragstart', (e) => {
      draggedEl = item;
      e.dataTransfer.effectAllowed = 'move';
      item.style.opacity = '0.5';
    });

    item.addEventListener('dragend', () => {
      item.style.opacity = '1';
      draggedEl = null;
    });

    // Touch support
    let touchStartX, touchStartY;
    item.addEventListener('touchstart', (e) => {
      draggedEl = item;
      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    });

    item.addEventListener('touchend', (e) => {
      if (!draggedEl) return;
      const touch = e.changedTouches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      if (target?.classList.contains('drag-target-slot')) {
        target.innerHTML = '';
        target.appendChild(draggedEl);
        draggedEl.classList.add('placed');
      }
      draggedEl = null;
    });
  });

  slots.forEach(slot => {
    slot.addEventListener('dragover', (e) => {
      e.preventDefault();
      slot.classList.add('over');
    });

    slot.addEventListener('dragleave', () => {
      slot.classList.remove('over');
    });

    slot.addEventListener('drop', (e) => {
      e.preventDefault();
      slot.classList.remove('over');
      if (!draggedEl) return;

      // If slot already has an item, move it back to source
      const existing = slot.querySelector('.drag-item');
      if (existing) {
        existing.classList.remove('placed');
        source.appendChild(existing);
      }

      slot.appendChild(draggedEl);
      draggedEl.classList.add('placed');
    });
  });

  // Also allow dropping back to source
  source.addEventListener('dragover', (e) => e.preventDefault());
  source.addEventListener('drop', (e) => {
    e.preventDefault();
    if (draggedEl) {
      draggedEl.classList.remove('placed');
      source.appendChild(draggedEl);
    }
  });

  // Check button
  document.getElementById('quiz-check-drag')?.addEventListener('click', () => {
    let allCorrect = true;
    let answered = false;

    slots.forEach(slot => {
      const expected = slot.dataset.expected;
      const item = slot.querySelector('.drag-item');
      const value = item?.dataset.value;

      if (value === expected) {
        slot.classList.add('correct');
        item?.classList.add('placed');
      } else {
        slot.classList.add('wrong');
        allCorrect = false;
      }
    });

    if (allCorrect) {
      score++;
      playCorrect();
    } else {
      playWrong();
    }

    answers.push({ question: q.question || 'Drag & Match', isCorrect: allCorrect });
    setTimeout(() => nextQuestion(), 1500);
  });
}

// ==================== NAVIGATION ====================
function nextQuestion() {
  currentIndex++;
  if (currentIndex >= currentQuiz.questions.length) {
    showResults();
  } else {
    renderQuestion();
  }
}

function showResults() {
  const container = document.getElementById('quiz-container');
  const total = currentQuiz.questions.length;
  const pct = Math.round((score / total) * 100);

  let gradeClass = 'grade-f';
  let gradeText = 'Try Again';
  if (pct >= 90) { gradeClass = 'grade-a'; gradeText = 'Outstanding!'; }
  else if (pct >= 70) { gradeClass = 'grade-b'; gradeText = 'Great Job!'; }
  else if (pct >= 50) { gradeClass = 'grade-c'; gradeText = 'Not Bad'; }

  const xpEarned = pct >= 90 ? 100 : pct >= 70 ? 75 : 50;

  container.innerHTML = `
    <div class="quiz-score">
      <div class="score-label">${gradeText}</div>
      <div class="score-num ${gradeClass}">${pct}%</div>
      <div style="color: var(--text-dim); margin: 8px 0;">${score}/${total} correct</div>
      <div class="score-xp">+${xpEarned} XP</div>
      <div style="margin-top: 24px; display: flex; gap: 12px; justify-content: center;">
        <button class="btn-primary" id="quiz-done">Continue</button>
        ${pct < 100 ? '<button class="btn-secondary" id="quiz-retry">Retry</button>' : ''}
      </div>
    </div>
  `;

  document.getElementById('quiz-done')?.addEventListener('click', () => {
    document.getElementById('quiz-overlay').classList.add('overlay-hidden');
    if (currentQuiz.onComplete) currentQuiz.onComplete(pct);
  });

  document.getElementById('quiz-retry')?.addEventListener('click', () => {
    startQuiz(currentQuiz.questions, currentQuiz.onComplete);
  });
}

export function closeQuiz() {
  document.getElementById('quiz-overlay')?.classList.add('overlay-hidden');
}
