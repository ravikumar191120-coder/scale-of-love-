import React, { useEffect, useRef } from 'react';

interface CosmicBackgroundProps {
  currentOrder: number;
  isHeartStage: boolean;
}

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  baseAlpha: number;
  twinkleSpeed: number;
  color: string;
  isBright: boolean;
}

interface AmbientLoveParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxAlpha: number;
  rotation: number;
  vRot: number;
  color: string;
  type: 'heart' | 'star' | 'orb';
}

interface TapRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

interface StardustSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

export const CosmicBackground: React.FC<CosmicBackgroundProps> = ({
  currentOrder,
  isHeartStage,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // 1. Parallax Cosmic Drift (Gyroscope / Mouse Tilt)
    let targetParallaxX = 0;
    let targetParallaxY = 0;
    let currentParallaxX = 0;
    let currentParallaxY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetParallaxX = (e.clientX / width - 0.5) * 2;
      targetParallaxY = (e.clientY / height - 0.5) * 2;
    };

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        targetParallaxX = Math.max(-1, Math.min(1, e.gamma / 30));
        targetParallaxY = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('deviceorientation', handleOrientation, { passive: true });

    // Interactive Stardust Magic Cursor & Tap Ripples
    const tapRipples: TapRipple[] = [];
    const stardustSparks: StardustSpark[] = [];

    const triggerTapMagic = (clientX: number, clientY: number) => {
      // Expanding stardust ripple ring
      tapRipples.push({
        x: clientX,
        y: clientY,
        radius: 4,
        maxRadius: Math.min(width, height) * 0.22,
        alpha: 0.85,
        color: isHeartStage ? '#fb7185' : '#c084fc',
      });

      // Burst of sparkles
      const colors = ['#fb7185', '#fda4af', '#f43f5e', '#facc15', '#ffffff'];
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const speed = Math.random() * 2.8 + 1.2;
        stardustSparks.push({
          x: clientX,
          y: clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 3 + 1.2,
          alpha: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    const handleClick = (e: MouseEvent) => {
      triggerTapMagic(e.clientX, e.clientY);
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) {
        triggerTapMagic(touch.clientX, touch.clientY);
        targetParallaxX = (touch.clientX / width - 0.5) * 1.5;
        targetParallaxY = (touch.clientY / height - 0.5) * 1.5;
      }
    };

    window.addEventListener('click', handleClick);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });

    // Multi-tier Starfield with 3D Z-depth
    const starCount = Math.min(250, Math.floor((width * height) / 5000));
    const starPalette = ['#ffffff', '#bae6fd', '#fed7aa', '#fbcfe8', '#e0e7ff', '#fef08a'];
    const stars: Star[] = Array.from({ length: starCount }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 1.8 + 0.4, // Depth factor for parallax
      size: Math.random() * 1.7 + 0.6,
      baseAlpha: Math.random() * 0.7 + 0.3,
      twinkleSpeed: Math.random() * 0.035 + 0.01,
      color: starPalette[Math.floor(Math.random() * starPalette.length)],
      isBright: i % 16 === 0,
    }));

    // Ambient floating love particles
    const loveParticles: AmbientLoveParticle[] = [];
    const maxLoveParticles = isHeartStage ? 48 : 28;

    const spawnLoveParticle = () => {
      const colors = ['#f43f5e', '#fb7185', '#fda4af', '#f472b6', '#facc15'];
      const types: ('heart' | 'star' | 'orb')[] = ['heart', 'heart', 'star', 'orb'];
      const chosenType = types[Math.floor(Math.random() * types.length)];

      loveParticles.push({
        x: Math.random() * width,
        y: height + 20,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -(Math.random() * 0.9 + 0.4),
        size: chosenType === 'heart' ? Math.random() * 8 + 6 : Math.random() * 4 + 2,
        alpha: 0,
        maxAlpha: Math.random() * 0.45 + 0.25,
        rotation: (Math.random() - 0.5) * 0.8,
        vRot: (Math.random() - 0.5) * 0.02,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: chosenType,
      });
    };

    // Pre-populate love particles
    for (let i = 0; i < 14; i++) {
      spawnLoveParticle();
      if (loveParticles[i]) {
        loveParticles[i].y = Math.random() * height;
        loveParticles[i].alpha = Math.random() * 0.35;
      }
    }

    const drawHeart = (
      context: CanvasRenderingContext2D,
      hx: number,
      hy: number,
      hSize: number,
      color: string,
      alpha: number,
      rot: number
    ) => {
      context.save();
      context.translate(hx, hy);
      context.rotate(rot);
      context.scale(hSize / 20, hSize / 20);
      context.fillStyle = color;
      context.globalAlpha = alpha;
      context.beginPath();
      context.moveTo(0, 5);
      context.bezierCurveTo(0, 0, -10, -5, -10, -12);
      context.bezierCurveTo(-10, -20, 0, -22, 0, -12);
      context.bezierCurveTo(0, -22, 10, -20, 10, -12);
      context.bezierCurveTo(10, -5, 0, 0, 0, 5);
      context.fill();
      context.restore();
    };

    let tick = 0;

    const render = () => {
      tick++;

      // Smooth Parallax Interpolation (Cosmic Drift)
      currentParallaxX += (targetParallaxX - currentParallaxX) * 0.05;
      currentParallaxY += (targetParallaxY - currentParallaxY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Deep Romantic Velvet Celestial Atmosphere
      const bgGrad = ctx.createRadialGradient(
        width * 0.5 + currentParallaxX * 25,
        height * 0.4 + currentParallaxY * 20,
        40,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.9
      );

      if (isHeartStage) {
        // Antim stage: Royal Wine, Ruby Heart & Amethyst Dust
        bgGrad.addColorStop(0, '#3d0421'); // Center warm ruby pulse
        bgGrad.addColorStop(0.35, '#230424'); // Deep wine velvet
        bgGrad.addColorStop(0.7, '#100219'); // Royal violet
        bgGrad.addColorStop(1, '#05010a'); // Deep celestial black
      } else if (currentOrder === 0 || currentOrder === 1) {
        // Aankhein & Height: Intimate Midnight Rose Velvet
        bgGrad.addColorStop(0, '#26061c'); // Soft rose center glow
        bgGrad.addColorStop(0.4, '#14041d'); // Midnight plum
        bgGrad.addColorStop(0.8, '#090212'); // Deep cosmic violet
        bgGrad.addColorStop(1, '#030107');
      } else if (currentOrder <= 4) {
        // Everest, India, Earth: Sapphire Twilight with Rose Dust
        bgGrad.addColorStop(0, '#0a1931'); // Deep twilight sapphire
        bgGrad.addColorStop(0.4, '#0d0d26'); // Cosmic indigo
        bgGrad.addColorStop(0.8, '#080314'); // Plum-tinted black
        bgGrad.addColorStop(1, '#020106');
      } else {
        // Deep Universe & Galaxies: Mystical Amethyst Nebula
        bgGrad.addColorStop(0, '#190a36'); // Center vibrant nebula purple
        bgGrad.addColorStop(0.45, '#0e0521'); // Deep amethyst void
        bgGrad.addColorStop(0.85, '#070212'); // Dark violet
        bgGrad.addColorStop(1, '#020106');
      }

      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Upper-right Nebula glow with parallax drift
      const nebPulse1 = Math.sin(tick * 0.012) * 0.15 + 0.85;
      const neb1X = width * 0.75 + currentParallaxX * 35;
      const neb1Y = height * 0.25 + currentParallaxY * 30;
      const nebGrad1 = ctx.createRadialGradient(neb1X, neb1Y, 10, neb1X, neb1Y, width * 0.45);
      nebGrad1.addColorStop(0, isHeartStage ? 'rgba(251, 113, 133, 0.22)' : 'rgba(192, 132, 252, 0.16)');
      nebGrad1.addColorStop(0.5, 'rgba(168, 85, 247, 0.08)');
      nebGrad1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.save();
      ctx.globalAlpha = nebPulse1;
      ctx.fillStyle = nebGrad1;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      // Lower-left Nebula glow with parallax drift
      const nebPulse2 = Math.cos(tick * 0.01) * 0.15 + 0.85;
      const neb2X = width * 0.2 - currentParallaxX * 30;
      const neb2Y = height * 0.7 - currentParallaxY * 25;
      const nebGrad2 = ctx.createRadialGradient(neb2X, neb2Y, 10, neb2X, neb2Y, width * 0.4);
      nebGrad2.addColorStop(0, isHeartStage ? 'rgba(244, 63, 94, 0.20)' : 'rgba(56, 189, 248, 0.12)');
      nebGrad2.addColorStop(0.6, 'rgba(244, 114, 182, 0.06)');
      nebGrad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.save();
      ctx.globalAlpha = nebPulse2;
      ctx.fillStyle = nebGrad2;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      // Render 3D Parallax Starfield
      stars.forEach((star) => {
        // Individual parallax offset based on z-depth
        const starOffsetX = currentParallaxX * star.z * 18;
        const starOffsetY = currentParallaxY * star.z * 18;
        let sx = star.x + starOffsetX;
        let sy = star.y + starOffsetY;

        // Wrap around borders gently
        if (sx < 0) sx += width;
        if (sx > width) sx -= width;
        if (sy < 0) sy += height;
        if (sy > height) sy -= height;

        const twinkle = Math.sin(tick * star.twinkleSpeed + star.x) * 0.35 + 0.65;
        const alpha = Math.min(1, Math.max(0.12, star.baseAlpha * twinkle));
        ctx.fillStyle = star.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Cross diffraction spikes on bright hero stars
        if (star.isBright && alpha > 0.6) {
          ctx.strokeStyle = star.color;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(sx - star.size * 3.5, sy);
          ctx.lineTo(sx + star.size * 3.5, sy);
          ctx.moveTo(sx, sy - star.size * 3.5);
          ctx.lineTo(sx, sy + star.size * 3.5);
          ctx.stroke();
        }
      });

      // Render & update ambient love particles
      if (loveParticles.length < maxLoveParticles && Math.random() < 0.08) {
        spawnLoveParticle();
      }

      for (let i = loveParticles.length - 1; i >= 0; i--) {
        const p = loveParticles[i];
        p.x += p.vx + currentParallaxX * 0.3;
        p.y += p.vy;
        p.rotation += p.vRot;

        if (p.y > height - 80) {
          p.alpha = Math.min(p.maxAlpha, p.alpha + 0.015);
        } else if (p.y < 120) {
          p.alpha = Math.max(0, p.alpha - 0.008);
        } else {
          p.alpha = Math.min(p.maxAlpha, p.alpha + 0.005);
        }

        if (p.alpha <= 0 || p.y < -30) {
          loveParticles.splice(i, 1);
          continue;
        }

        if (p.type === 'heart') {
          drawHeart(ctx, p.x, p.y, p.size, p.color, p.alpha, p.rotation);
        } else if (p.type === 'star') {
          ctx.save();
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          ctx.save();
          const radGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
          radGrad.addColorStop(0, p.color);
          radGrad.addColorStop(1, 'transparent');
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = radGrad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // Render & update Tap Ripples
      for (let i = tapRipples.length - 1; i >= 0; i--) {
        const rip = tapRipples[i];
        rip.radius += (rip.maxRadius - rip.radius) * 0.07;
        rip.alpha -= 0.022;

        if (rip.alpha <= 0 || rip.radius >= rip.maxRadius - 2) {
          tapRipples.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.strokeStyle = rip.color;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = rip.alpha;
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Render & update Stardust Magic Sparks
      for (let i = stardustSparks.length - 1; i >= 0; i--) {
        const sp = stardustSparks[i];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.alpha -= 0.028;

        if (sp.alpha <= 0) {
          stardustSparks.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.fillStyle = sp.color;
        ctx.globalAlpha = sp.alpha;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.globalAlpha = 1.0;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, [currentOrder, isHeartStage]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};
