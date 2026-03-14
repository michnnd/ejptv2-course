// ============================================
// Sound Engine - Web Audio API (no files needed)
// ============================================

let audioCtx = null;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function playTone(freq, duration, type = 'sine', volume = 0.15) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = volume;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {}
}

export function playCorrect() {
  playTone(523, 0.1, 'sine', 0.12);
  setTimeout(() => playTone(659, 0.1, 'sine', 0.12), 80);
  setTimeout(() => playTone(784, 0.15, 'sine', 0.12), 160);
}

export function playWrong() {
  playTone(200, 0.25, 'square', 0.08);
}

export function playLevelUp() {
  playTone(523, 0.12, 'sine', 0.12);
  setTimeout(() => playTone(659, 0.12, 'sine', 0.12), 100);
  setTimeout(() => playTone(784, 0.12, 'sine', 0.12), 200);
  setTimeout(() => playTone(1047, 0.25, 'sine', 0.15), 300);
}

export function playClick() {
  playTone(800, 0.03, 'square', 0.05);
}

export function playXP() {
  playTone(880, 0.08, 'sine', 0.1);
  setTimeout(() => playTone(1100, 0.1, 'sine', 0.1), 60);
}

export function playKeypress() {
  playTone(600 + Math.random() * 200, 0.02, 'square', 0.03);
}
