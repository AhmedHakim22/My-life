import confetti from 'canvas-confetti';

/**
 * Fires a celebratory confetti cannon with brand-themed vibrant colors.
 */
export function fireConfettiSuccess() {
  try {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#38bdf8', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']
    });
  } catch (e) {
    // Graceful fallback if canvas is unavailable
    console.debug('Confetti skipped:', e);
  }
}

/**
 * Super celebratory double blast for level up or major milestones.
 */
export function fireConfettiLevelUp() {
  try {
    const end = Date.now() + 1000;
    const colors = ['#8b5cf6', '#38bdf8', '#ffd700'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  } catch (e) {
    console.debug('Confetti skipped:', e);
  }
}
