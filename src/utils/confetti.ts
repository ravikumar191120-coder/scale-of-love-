import confetti from 'canvas-confetti';

export function triggerLoveConfettiExplosion() {
  if (typeof window === 'undefined') return;

  // Heart shape definition for canvas-confetti
  const heartShape = confetti.shapeFromPath({
    path: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
  });

  const starShape = confetti.shapeFromPath({
    path: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
  });

  const colors = ['#f43f5e', '#fb7185', '#fda4af', '#f472b6', '#ec4899', '#facc15', '#ffffff'];

  // 1. Center grand explosion
  confetti({
    particleCount: 80,
    spread: 100,
    origin: { y: 0.6 },
    shapes: [heartShape, starShape],
    colors,
    scalar: 2.2,
    ticks: 280,
    gravity: 0.8,
    drift: 0,
  });

  // 2. Left side cannon
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 70,
      origin: { x: 0.1, y: 0.7 },
      shapes: [heartShape, starShape],
      colors,
      scalar: 1.8,
      ticks: 240,
    });
  }, 250);

  // 3. Right side cannon
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 70,
      origin: { x: 0.9, y: 0.7 },
      shapes: [heartShape, starShape],
      colors,
      scalar: 1.8,
      ticks: 240,
    });
  }, 500);

  // 4. Romantic gentle stardust rain
  setTimeout(() => {
    confetti({
      particleCount: 60,
      spread: 140,
      origin: { y: 0.2 },
      shapes: [heartShape, starShape],
      colors,
      scalar: 1.6,
      ticks: 320,
      gravity: 0.6,
    });
  }, 850);
}
