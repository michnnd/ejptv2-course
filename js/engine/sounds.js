// ============================================
// Sound Engine - Web Audio API (no files needed)
// ============================================

let audioCtx = null;
let _muted = false;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Resume if suspended (browser autoplay policy)
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTone(freq, duration, type = 'sine', volume = 0.15) {
  if (_muted) return;
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Silently fail if audio not available
  }
}

export function playCorrect() {
  playTone(523, 0.12, 'sine', 0.15);
  setTimeout(() => playTone(659, 0.12, 'sine', 0.15), 100);
  setTimeout(() => playTone(784, 0.18, 'sine', 0.15), 200);
}

export function playWrong() {
  playTone(200, 0.3, 'square', 0.1);
  setTimeout(() => playTone(150, 0.3, 'square', 0.08), 150);
}

export function playLevelUp() {
  playTone(523, 0.15, 'sine', 0.15);
  setTimeout(() => playTone(659, 0.15, 'sine', 0.15), 120);
  setTimeout(() => playTone(784, 0.15, 'sine', 0.15), 240);
  setTimeout(() => playTone(1047, 0.3, 'sine', 0.18), 360);
}

export function playClick() {
  playTone(800, 0.04, 'square', 0.06);
}

export function playXP() {
  playTone(880, 0.1, 'sine', 0.12);
  setTimeout(() => playTone(1100, 0.12, 'sine', 0.12), 80);
}

export function playKeypress() {
  playTone(600 + Math.random() * 200, 0.025, 'square', 0.04);
}

export function playNav() {
  playTone(440, 0.05, 'sine', 0.08);
}

export function playComplete() {
  playTone(523, 0.1, 'sine', 0.12);
  setTimeout(() => playTone(659, 0.1, 'sine', 0.12), 100);
  setTimeout(() => playTone(784, 0.1, 'sine', 0.12), 200);
  setTimeout(() => playTone(1047, 0.1, 'sine', 0.12), 300);
  setTimeout(() => playTone(1318, 0.2, 'sine', 0.15), 400);
}

export function setMuted(muted) {
  _muted = muted;
}

export function isMuted() {
  return _muted;
}

// Initialize audio context on first user interaction (required by browsers)
export function initAudio() {
  const events = ['click', 'touchstart', 'keydown'];
  const handler = () => {
    getCtx();
    events.forEach(e => document.removeEventListener(e, handler));
  };
  events.forEach(e => document.addEventListener(e, handler, { once: false }));
}
