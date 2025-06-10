// audio.js

// Простая обёртка над HTMLAudioElement
const flipSound = new Audio('assets/sfx/flip.wav');
flipSound.volume = 0.5;

const scoreSound = new Audio('assets/sfx/score.wav');
scoreSound.volume = 0.7;

/**
 * Воспроизводит звук смены гравитации.
 */
export function playFlip() {
  // Чтобы быстро флипать, клонируем элемент
  const s = flipSound.cloneNode();
  s.play().catch(() => {/* игнорируем ошибки autoplay */});
}

/**
 * Воспроизводит звук гола.
 */
export function playScore() {
  const s = scoreSound.cloneNode();
  s.play().catch(() => {/* игнорируем ошибки autoplay */});
}
