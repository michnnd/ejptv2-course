// ============================================
// eJPTv2 Progress & Gamification Engine
// ============================================

const STORAGE_KEY = 'ejpt_progress';

const RANKS = [
  { level: 1, title: 'Script Kiddie', xp: 0 },
  { level: 2, title: 'Recon Analyst', xp: 100 },
  { level: 3, title: 'Exploit Dev', xp: 300 },
  { level: 4, title: 'Pentester', xp: 600 },
  { level: 5, title: 'Red Teamer', xp: 1000 },
  { level: 6, title: 'APT Operator', xp: 1500 },
  { level: 7, title: 'Shadow Admin', xp: 2200 },
];

const ACHIEVEMENTS = {
  first_blood: { title: 'First Blood', desc: 'Complete your first topic', icon: '🩸' },
  streak_3: { title: 'On Fire', desc: '3-day learning streak', icon: '🔥' },
  streak_7: { title: 'Unstoppable', desc: '7-day learning streak', icon: '⚡' },
  perfect_quiz: { title: 'Flawless', desc: 'Score 100% on a quiz', icon: '💎' },
  section_1: { title: 'Recon Master', desc: 'Complete all prerequisites', icon: '🔍' },
  halfway: { title: 'Halfway There', desc: 'Complete 50% of the course', icon: '🏔' },
  full_course: { title: 'eJPT Ready', desc: 'Complete the entire course', icon: '🏆' },
};

const DEFAULT_PROGRESS = {
  xp: 0,
  completed: [],
  quizScores: {},
  currentTopic: null,
  streak: { current: 0, lastDate: null, best: 0 },
  achievements: [],
  soundOn: true,
};

export function getProgress() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? { ...DEFAULT_PROGRESS, ...JSON.parse(data) } : { ...DEFAULT_PROGRESS };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function getRank(xp) {
  let rank = RANKS[0];
  for (const r of RANKS) {
    if (xp >= r.xp) rank = r;
  }
  return rank;
}

export function getNextRank(xp) {
  for (const r of RANKS) {
    if (xp < r.xp) return r;
  }
  return null;
}

export function addXP(amount, totalTopics) {
  const progress = getProgress();
  const oldRank = getRank(progress.xp);
  progress.xp += amount;
  const newRank = getRank(progress.xp);
  saveProgress(progress);
  renderHUD(totalTopics);

  // Show XP toast
  showXPToast(amount);

  // Level up?
  if (newRank.level > oldRank.level) {
    showLevelUp(newRank);
  }

  return progress;
}

export function completeTopic(topicId, quizScore, totalTopics) {
  const progress = getProgress();

  if (!progress.completed.includes(topicId)) {
    progress.completed.push(topicId);
  }

  if (quizScore !== undefined) {
    const prev = progress.quizScores[topicId];
    if (!prev || quizScore > prev.best) {
      progress.quizScores[topicId] = {
        best: quizScore,
        attempts: (prev?.attempts || 0) + 1,
        lastAttempt: new Date().toISOString(),
      };
    } else {
      progress.quizScores[topicId].attempts += 1;
      progress.quizScores[topicId].lastAttempt = new Date().toISOString();
    }
  }

  saveProgress(progress);

  // Award XP
  let xpEarned = 50;
  if (quizScore >= 90) xpEarned = 100;
  else if (quizScore >= 70) xpEarned = 75;

  // Check achievements
  if (progress.completed.length === 1) unlockAchievement('first_blood');
  if (quizScore === 100) unlockAchievement('perfect_quiz');

  const pct = totalTopics > 0 ? progress.completed.length / totalTopics : 0;
  if (pct >= 0.5) unlockAchievement('halfway');
  if (pct >= 1) unlockAchievement('full_course');

  addXP(xpEarned, totalTopics);
  return progress;
}

export function updateStreak() {
  const progress = getProgress();
  const today = new Date().toISOString().split('T')[0];

  if (progress.streak.lastDate === today) return progress;

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (progress.streak.lastDate === yesterday) {
    progress.streak.current += 1;
  } else {
    progress.streak.current = 1;
  }

  progress.streak.lastDate = today;
  if (progress.streak.current > progress.streak.best) {
    progress.streak.best = progress.streak.current;
  }

  // Streak achievements
  if (progress.streak.current >= 3) unlockAchievement('streak_3');
  if (progress.streak.current >= 7) unlockAchievement('streak_7');

  saveProgress(progress);
  return progress;
}

export function unlockAchievement(id) {
  const progress = getProgress();
  if (progress.achievements.includes(id)) return;
  progress.achievements.push(id);
  saveProgress(progress);

  const ach = ACHIEVEMENTS[id];
  if (ach) {
    showAchievementToast(ach);
  }
}

export function renderHUD(totalTopics) {
  const progress = getProgress();
  const rank = getRank(progress.xp);

  const hudXP = document.getElementById('hud-xp');
  const hudLevel = document.getElementById('hud-level');
  const hudRank = document.getElementById('hud-rank');
  const hudProgress = document.getElementById('hud-progress');
  const hudStreak = document.getElementById('hud-streak');
  const streakFlame = document.getElementById('streak-flame');

  if (hudXP) hudXP.textContent = progress.xp;
  if (hudLevel) hudLevel.textContent = rank.level;
  if (hudRank) hudRank.textContent = rank.title;

  const pct = totalTopics > 0
    ? Math.round((progress.completed.length / totalTopics) * 100)
    : 0;
  if (hudProgress) hudProgress.textContent = pct + '%';

  if (hudStreak) hudStreak.textContent = progress.streak.current;
  if (streakFlame) {
    streakFlame.className = 'streak-flame';
    if (progress.streak.current >= 14) streakFlame.classList.add('s3');
    else if (progress.streak.current >= 7) streakFlame.classList.add('s2');
    else if (progress.streak.current >= 1) streakFlame.classList.add('s1');
    else streakFlame.classList.add('s0');
  }
}

function showXPToast(amount) {
  const toast = document.getElementById('xp-toast');
  const text = document.getElementById('xp-toast-text');
  if (!toast || !text) return;

  text.textContent = `+${amount} XP`;
  toast.classList.remove('toast-hidden');
  toast.style.animation = 'none';
  toast.offsetHeight; // trigger reflow
  toast.style.animation = '';

  setTimeout(() => toast.classList.add('toast-hidden'), 1500);
}

function showLevelUp(rank) {
  const modal = document.getElementById('levelup-modal');
  const rankEl = document.getElementById('levelup-rank');
  const levelEl = document.getElementById('levelup-level');
  if (!modal) return;

  rankEl.textContent = rank.title;
  levelEl.textContent = `Level ${rank.level}`;
  modal.classList.remove('overlay-hidden');

  // Confetti
  spawnConfetti();

  document.getElementById('levelup-dismiss').onclick = () => {
    modal.classList.add('overlay-hidden');
  };
}

function showAchievementToast(ach) {
  const toast = document.getElementById('xp-toast');
  const text = document.getElementById('xp-toast-text');
  if (!toast || !text) return;

  setTimeout(() => {
    text.textContent = `${ach.icon} ${ach.title}!`;
    toast.classList.remove('toast-hidden');
    toast.style.animation = 'none';
    toast.offsetHeight;
    toast.style.animation = '';
    setTimeout(() => toast.classList.add('toast-hidden'), 2000);
  }, 1600);
}

function spawnConfetti() {
  const colors = ['#00ff88', '#00d4ff', '#ff3366', '#ff8800', '#a855f7', '#fbbf24'];
  for (let i = 0; i < 40; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.top = '-10px';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = Math.random() * 0.5 + 's';
    piece.style.animationDuration = 1.5 + Math.random() * 1.5 + 's';
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 3000);
  }
}

export function isCompleted(topicId) {
  return getProgress().completed.includes(topicId);
}

export function getQuizScore(topicId) {
  return getProgress().quizScores[topicId]?.best;
}

export { ACHIEVEMENTS, RANKS };
