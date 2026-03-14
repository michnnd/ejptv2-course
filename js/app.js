// ============================================
// eJPTv2 Training System - Main App
// ============================================

import { getProgress, saveProgress, renderHUD, updateStreak, completeTopic, isCompleted, getQuizScore } from './engine/progress.js';
import { initTerminal, toggleTerminal } from './engine/terminal.js';
import { startQuiz } from './engine/quiz.js';
import { initAudio, setMuted, playClick, playNav, playComplete } from './engine/sounds.js';
import { startPortScanner, startHackTheBox, startCommandBuilder, startFlashcards, renderGamesSection } from './engine/games.js';

// ==================== COURSE STRUCTURE ====================
const COURSE = [
  {
    id: 'prerequisites',
    title: 'Prerequisites',
    topics: [
      { id: 'networking', title: 'Networking Fundamentals', icon: '🌐', file: 'prereq-networking', xp: 100 },
      { id: 'webapps', title: 'Web Applications Basics', icon: '🌍', file: 'prereq-webapps', xp: 100 },
      { id: 'pentesting-intro', title: 'Pentesting Introduction', icon: '🔓', file: 'prereq-pentesting', xp: 100 },
    ]
  },
  {
    id: 'section1',
    title: 'Assessment Methodologies',
    topics: [
      { id: 'info-gathering', title: 'Information Gathering', icon: '🔍', file: 's1-info-gathering', xp: 100 },
      { id: 'footprinting', title: 'Footprinting & Scanning', icon: '📡', file: 's1-footprinting', xp: 120 },
      { id: 'enumeration', title: 'Enumeration', icon: '📋', file: 's1-enumeration', xp: 120 },
      { id: 'vuln-assessment', title: 'Vulnerability Assessment', icon: '🎯', file: 's1-vuln-assessment', xp: 100 },
    ]
  },
  {
    id: 'section2',
    title: 'Auditing Fundamentals',
    topics: [
      { id: 'auditing', title: 'Auditing Fundamentals', icon: '📝', file: 's2-auditing', xp: 80 },
    ]
  },
  {
    id: 'section3',
    title: 'Host & Network Pentesting',
    topics: [
      { id: 'system-attacks', title: 'System/Host-Based Attacks', icon: '💻', file: 's3-system-attacks', xp: 150 },
      { id: 'network-attacks', title: 'Network-Based Attacks', icon: '📶', file: 's3-network-attacks', xp: 120 },
      { id: 'metasploit', title: 'The Metasploit Framework', icon: '⚔', file: 's3-metasploit', xp: 150 },
      { id: 'exploitation', title: 'Exploitation', icon: '💥', file: 's3-exploitation', xp: 130 },
      { id: 'post-exploitation', title: 'Post-Exploitation', icon: '🏴', file: 's3-post-exploitation', xp: 140 },
      { id: 'social-engineering', title: 'Social Engineering', icon: '🎭', file: 's3-social-engineering', xp: 80 },
    ]
  },
  {
    id: 'section4',
    title: 'Web App Pentesting',
    topics: [
      { id: 'http-protocol', title: 'HTTP Protocol Deep Dive', icon: '🔗', file: 's4-http-protocol', xp: 100 },
      { id: 'web-attacks', title: 'Web Application Attacks', icon: '🕷', file: 's4-web-attacks', xp: 150 },
    ]
  },
];

// Flatten for navigation
const ALL_TOPICS = COURSE.flatMap(s => s.topics);
const TOTAL_TOPICS = ALL_TOPICS.length;

// ==================== BOOT SEQUENCE ====================
async function boot() {
  const progress = getProgress();

  // Skip boot on repeat visits
  if (progress.bootSeen) {
    skipBoot();
    return;
  }

  const bootLines = [
    '[*] Initializing eJPTv2 Training Environment...',
    '[+] Loading exploit database... 2,376 modules',
    '[+] Loading auxiliary modules... 1,232 modules',
    '[+] Loading payloads... 1,388 payloads',
    '[*] Establishing encrypted tunnel...',
    '[+] Credentials verified. Access granted.',
    '[*] System ready. Good luck, operator.',
  ];

  const bootEl = document.getElementById('boot-lines');
  const bootScreen = document.getElementById('boot-screen');
  let skipped = false;

  // Click to skip
  const skipHandler = () => {
    if (skipped) return;
    skipped = true;
    progress.bootSeen = true;
    saveProgress(progress);
    bootScreen.classList.add('fade-out');
    setTimeout(() => {
      bootScreen.remove();
      document.getElementById('app').classList.remove('hidden');
      init();
    }, 300);
  };

  bootScreen.addEventListener('click', skipHandler);

  for (let i = 0; i < bootLines.length; i++) {
    if (skipped) return;
    await sleep(120 + Math.random() * 150);
    const line = document.createElement('div');
    line.className = 'boot-line';
    line.style.animationDelay = '0s';

    if (bootLines[i].startsWith('[+]')) {
      line.innerHTML = `<span style="color: var(--accent-green)">${bootLines[i]}</span>`;
    } else {
      line.innerHTML = `<span style="color: var(--accent-cyan)">${bootLines[i]}</span>`;
    }

    bootEl.appendChild(line);
  }

  if (skipped) return;
  await sleep(400);

  progress.bootSeen = true;
  saveProgress(progress);
  skipHandler();
}

function skipBoot() {
  const bootScreen = document.getElementById('boot-screen');
  if (bootScreen) bootScreen.remove();
  document.getElementById('app').classList.remove('hidden');
  init();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ==================== INITIALIZATION ====================
function init() {
  initAudio();
  const progress = getProgress();
  setMuted(progress.soundOn === false);

  updateStreak();
  renderHUD(TOTAL_TOPICS);
  renderMap();
  initTerminal();
  bindGlobalEvents();
  handleRoute();

  window.addEventListener('hashchange', () => {
    playNav();
    handleRoute();
  });

  // Scroll-triggered animations
  setupScrollAnimations();
}

function setupScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  // Observe elements after content loads
  window._scrollObserver = observer;
}

function observeNewContent() {
  if (!window._scrollObserver) return;
  document.querySelectorAll('.fade-in-section:not(.visible)').forEach(el => {
    window._scrollObserver.observe(el);
  });
}

// ==================== MISSION MAP ====================
function renderMap() {
  const container = document.getElementById('map-content');
  const progress = getProgress();

  let html = '';

  COURSE.forEach((section) => {
    const sectionDone = section.topics.filter(t => progress.completed.includes(t.id)).length;
    const sectionTotal = section.topics.length;
    const sectionPct = Math.round((sectionDone / sectionTotal) * 100);

    html += `<div class="map-section">`;
    html += `<div class="map-section-title">${section.title}</div>`;

    section.topics.forEach((topic) => {
      const completed = progress.completed.includes(topic.id);
      const quizScore = progress.quizScores[topic.id]?.best;
      const isCurrent = window.location.hash === `#/${topic.id}`;

      let statusClass = '';
      let statusText = '';

      if (completed) {
        statusClass = 'completed';
        statusText = quizScore !== undefined ? `${quizScore}%` : '✓';
      } else if (isCurrent) {
        statusClass = 'active';
        statusText = '▸';
      }

      html += `
        <a class="map-node ${statusClass}" href="#/${topic.id}" data-topic="${topic.id}">
          <span class="node-icon">${topic.icon}</span>
          <span class="node-title">${topic.title}</span>
          <span class="node-status ${completed ? 'done' : isCurrent ? 'current' : ''}">${statusText}</span>
        </a>`;
    });

    html += `</div>`;
  });

  container.innerHTML = html;
}

// ==================== ROUTING ====================
function handleRoute() {
  const hash = window.location.hash.replace('#/', '') || '';
  renderMap();

  if (!hash) {
    renderWelcome();
    updateNavButtons(null);
    return;
  }

  if (hash.startsWith('game-')) {
    loadGame(hash);
    updateNavButtons(null);
    return;
  }

  const topicIndex = ALL_TOPICS.findIndex(t => t.id === hash);
  if (topicIndex === -1) {
    renderWelcome();
    return;
  }

  const topic = ALL_TOPICS[topicIndex];
  loadTopic(topic);
  updateNavButtons(topicIndex);

  const progress = getProgress();
  progress.currentTopic = topic.id;
  saveProgress(progress);
}

function updateNavButtons(currentIndex) {
  const prevBtn = document.getElementById('nav-prev');
  const nextBtn = document.getElementById('nav-next');

  if (currentIndex === null) {
    prevBtn.disabled = true;
    nextBtn.disabled = ALL_TOPICS.length === 0;
    nextBtn.onclick = () => { window.location.hash = `#/${ALL_TOPICS[0].id}`; };
    return;
  }

  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === ALL_TOPICS.length - 1;

  prevBtn.onclick = () => {
    if (currentIndex > 0) window.location.hash = `#/${ALL_TOPICS[currentIndex - 1].id}`;
  };

  nextBtn.onclick = () => {
    if (currentIndex < ALL_TOPICS.length - 1) window.location.hash = `#/${ALL_TOPICS[currentIndex + 1].id}`;
  };
}

// ==================== WELCOME SCREEN ====================
function renderWelcome() {
  const viewport = document.getElementById('viewport');
  const progress = getProgress();
  const completedCount = progress.completed.length;
  const pct = Math.round((completedCount / TOTAL_TOPICS) * 100);

  let startLabel = 'Begin Mission';
  let startTarget = ALL_TOPICS[0].id;
  let tagline = '17 targets. Zero credentials. Time to work.';

  if (completedCount > 0 && progress.currentTopic) {
    startLabel = 'Continue Mission';
    startTarget = progress.currentTopic;
    tagline = `${TOTAL_TOPICS - completedCount} targets remaining. Keep moving.`;
  }

  if (pct === 100) {
    tagline = 'All targets compromised. You\'re ready for the exam.';
  }

  viewport.innerHTML = `
    <div class="welcome">
      <h1>eJPTv2 <span>Training</span></h1>
      <p class="subtitle">${tagline}</p>

      <div class="welcome-stats">
        <div class="welcome-stat">
          <div class="stat-num">${completedCount}/${TOTAL_TOPICS}</div>
          <div class="stat-label">Completed</div>
        </div>
        <div class="welcome-stat">
          <div class="stat-num">${pct}%</div>
          <div class="stat-label">Progress</div>
        </div>
        <div class="welcome-stat">
          <div class="stat-num">${progress.xp}</div>
          <div class="stat-label">XP</div>
        </div>
        <div class="welcome-stat">
          <div class="stat-num">${progress.streak.current}d</div>
          <div class="stat-label">Streak</div>
        </div>
      </div>

      <button class="btn-primary" onclick="window.location.hash='#/${startTarget}'">${startLabel}</button>

      ${renderGamesSection()}

      <div style="margin-top: 48px; text-align: left; max-width: 600px; margin-left: auto; margin-right: auto;">
        <h3 style="color: var(--accent-purple); margin-bottom: 16px; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; font-weight: 700;">Course Sections</h3>
        ${COURSE.map(section => {
          const sectionTopics = section.topics;
          const done = sectionTopics.filter(t => progress.completed.includes(t.id)).length;
          const sectionPct = Math.round((done / sectionTopics.length) * 100);
          const isComplete = done === sectionTopics.length;
          return `
            <div class="section-progress-item">
              <span class="section-progress-name">${section.title}</span>
              <div class="section-progress-bar">
                <div class="section-progress-fill ${isComplete ? 'complete' : ''}" style="width: ${sectionPct}%"></div>
              </div>
              <span class="section-progress-count" style="color: ${isComplete ? 'var(--accent-green)' : 'var(--text-dim)'}">${done}/${sectionTopics.length}</span>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  viewport.scrollTop = 0;
}

// ==================== LOAD GAME ====================
function loadGame(gameId) {
  const viewport = document.getElementById('viewport');
  viewport.innerHTML = `<div class="lesson" id="game-container"></div>`;
  viewport.scrollTop = 0;
  const container = document.getElementById('game-container');

  switch (gameId) {
    case 'game-ports': startPortScanner(container); break;
    case 'game-htb': startHackTheBox(container); break;
    case 'game-cmdbuild': startCommandBuilder(container); break;
    case 'game-flash': startFlashcards(container); break;
    default: renderWelcome();
  }
}

// ==================== LOAD TOPIC ====================
async function loadTopic(topic) {
  const viewport = document.getElementById('viewport');

  viewport.innerHTML = `
    <div style="text-align: center; padding: 80px 0; color: var(--text-dim);">
      <div style="font-family: var(--font-mono); font-size: 14px; color: var(--accent-cyan); margin-bottom: 8px;">Loading module</div>
      <div style="font-size: 24px; font-weight: 700; color: var(--text-bright);">${topic.title}</div>
    </div>
  `;

  try {
    const module = await import(`./content/${topic.file}.js`);
    const html = module.render();

    viewport.innerHTML = html;
    viewport.scrollTop = 0;

    // Bind quiz button if exists
    const quizBtn = document.getElementById('start-quiz-btn');
    if (quizBtn && module.quiz) {
      quizBtn.addEventListener('click', () => {
        startQuiz(module.quiz, (score) => {
          completeTopic(topic.id, score, TOTAL_TOPICS);
          renderMap();
          renderHUD(TOTAL_TOPICS);
        });
      });
    }

    // Bind "complete without quiz" button
    const completeBtn = document.getElementById('complete-topic-btn');
    if (completeBtn) {
      if (isCompleted(topic.id)) {
        completeBtn.textContent = 'Completed ✓';
        completeBtn.disabled = true;
        completeBtn.style.opacity = '0.4';
      }
      completeBtn.addEventListener('click', () => {
        completeTopic(topic.id, undefined, TOTAL_TOPICS);
        renderMap();
        renderHUD(TOTAL_TOPICS);
        playComplete();
        completeBtn.textContent = 'Completed ✓';
        completeBtn.disabled = true;
        completeBtn.style.opacity = '0.4';
      });
    }

    // Bind interactive elements
    if (module.bindInteractives) {
      module.bindInteractives();
    }

    // Bind try-it commands to open terminal
    document.querySelectorAll('.try-cmd').forEach(btn => {
      btn.addEventListener('click', () => {
        const termPanel = document.getElementById('terminal-panel');
        if (termPanel.classList.contains('terminal-hidden')) {
          toggleTerminal();
        }
        const input = document.getElementById('terminal-input');
        if (input) {
          input.value = btn.textContent.trim();
          input.focus();
        }
      });
    });

    // Setup scroll animations for new content
    observeNewContent();

  } catch (err) {
    viewport.innerHTML = `
      <div style="text-align: center; padding: 80px 0;">
        <div style="font-size: 48px; margin-bottom: 16px;">🚧</div>
        <h2 style="color: var(--text-bright); margin-bottom: 8px;">${topic.title}</h2>
        <p style="color: var(--text-dim);">This lesson is coming soon.</p>
        <p style="color: var(--text-dim); font-size: 13px; margin-top: 16px; font-family: var(--font-mono);">Module: ${topic.file}</p>
      </div>
    `;
  }
}

// ==================== GLOBAL EVENTS ====================
function bindGlobalEvents() {
  // Terminal toggle
  document.getElementById('terminal-toggle')?.addEventListener('click', toggleTerminal);
  document.getElementById('terminal-close')?.addEventListener('click', toggleTerminal);

  // Backtick shortcut
  document.addEventListener('keydown', (e) => {
    if (e.key === '`' && !e.target.matches('input, textarea')) {
      e.preventDefault();
      toggleTerminal();
    }
  });

  // Sound toggle
  const soundBtn = document.getElementById('sound-toggle');
  const progress = getProgress();
  soundBtn.textContent = progress.soundOn !== false ? '🔊' : '🔇';

  soundBtn?.addEventListener('click', () => {
    const p = getProgress();
    p.soundOn = p.soundOn === false ? true : false;
    saveProgress(p);
    setMuted(!p.soundOn);
    soundBtn.textContent = p.soundOn ? '🔊' : '🔇';
    if (p.soundOn) playClick();
  });

  // Map collapse
  const mapCollapseBtn = document.getElementById('map-collapse');
  mapCollapseBtn?.addEventListener('click', () => {
    document.getElementById('mission-map')?.classList.toggle('collapsed');
  });

  // Map button (nav bar) for mobile
  document.getElementById('nav-map')?.addEventListener('click', () => {
    const map = document.getElementById('mission-map');
    if (window.innerWidth <= 768) {
      map?.classList.toggle('mobile-open');
    }
  });
}

// ==================== EXPOSE TO WINDOW ====================
window.startQuizFromLesson = (quizData, topicId) => {
  startQuiz(quizData, (score) => {
    completeTopic(topicId, score, TOTAL_TOPICS);
    renderMap();
    renderHUD(TOTAL_TOPICS);
  });
};

// ==================== START ====================
document.addEventListener('DOMContentLoaded', boot);
