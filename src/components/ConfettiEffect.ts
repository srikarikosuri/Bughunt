import confetti from 'canvas-confetti';

export function fireSuccessConfetti() {
  // Center blast
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#a855f7', '#06b6d4', '#3b82f6', '#10b981', '#f59e0b'],
  });

  // Left cannon
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#8b5cf6', '#38bdf8', '#ec4899'],
    });
  }, 200);

  // Right cannon
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#8b5cf6', '#38bdf8', '#ec4899'],
    });
  }, 350);
}

export function fireLevelUpConfetti() {
  const duration = 2.5 * 1000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ['#f59e0b', '#8b5cf6', '#06b6d4'],
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ['#f59e0b', '#8b5cf6', '#06b6d4'],
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}
