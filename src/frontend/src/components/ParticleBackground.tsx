import { useCallback, useEffect, useRef } from "react";

export type ParticleMood =
  | "normal"
  | "stress"
  | "emergency"
  | "recovery"
  | "night";

interface ParticleBackgroundProps {
  isDarkMode: boolean;
  mood?: ParticleMood;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  targetOpacity: number;
  depth: number;
  hue: number;
}

const DESKTOP_COUNT = 80;
const MOBILE_COUNT = 30;
const CONNECTION_DIST = 120;
const CURSOR_REPEL_DIST = 100;
const FPS_CAP = 60;

function getMoodConfig(mood: ParticleMood, isDark: boolean) {
  switch (mood) {
    case "stress":
      return {
        maxOpacity: isDark ? 0.08 : 0.07,
        minOpacity: isDark ? 0.03 : 0.03,
        speedMult: 0.5,
        connectionOpacity: 0.03,
        tintR: isDark ? 180 : 100,
        tintG: isDark ? 100 : 120,
        tintB: isDark ? 140 : 200,
      };
    case "emergency":
      return {
        maxOpacity: isDark ? 0.1 : 0.08,
        minOpacity: isDark ? 0.05 : 0.04,
        speedMult: 0.8,
        connectionOpacity: 0.04,
        tintR: isDark ? 255 : 220,
        tintG: isDark ? 80 : 100,
        tintB: isDark ? 100 : 120,
      };
    case "recovery":
      return {
        maxOpacity: isDark ? 0.1 : 0.08,
        minOpacity: isDark ? 0.05 : 0.04,
        speedMult: 0.7,
        connectionOpacity: 0.04,
        tintR: isDark ? 80 : 120,
        tintG: isDark ? 160 : 180,
        tintB: isDark ? 255 : 240,
      };
    case "night":
      return {
        maxOpacity: isDark ? 0.09 : 0.06,
        minOpacity: isDark ? 0.04 : 0.02,
        speedMult: 0.4,
        connectionOpacity: 0.03,
        tintR: isDark ? 120 : 150,
        tintG: isDark ? 100 : 160,
        tintB: isDark ? 220 : 220,
      };
    default:
      return {
        maxOpacity: isDark ? 0.1 : 0.08,
        minOpacity: isDark ? 0.05 : 0.04,
        speedMult: 1.0,
        connectionOpacity: 0.04,
        tintR: isDark ? 255 : 120,
        tintG: isDark ? 168 : 150,
        tintB: isDark ? 201 : 255,
      };
  }
}

export default function ParticleBackground({
  isDarkMode,
  mood = "normal",
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef<{ x: number; y: number }>({ x: -9999, y: -9999 });
  const lastTimeRef = useRef<number>(0);
  const isDarkRef = useRef<boolean>(isDarkMode);
  const moodRef = useRef<ParticleMood>(mood);

  // Keep refs in sync
  useEffect(() => {
    isDarkRef.current = isDarkMode;
  }, [isDarkMode]);

  useEffect(() => {
    moodRef.current = mood;
  }, [mood]);

  const createParticles = useCallback((count: number, w: number, h: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const depth = 0.3 + Math.random() * 0.7;
      const baseSpeed = (0.1 + Math.random() * 0.25) * depth;
      const angle = Math.random() * Math.PI * 2;
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: Math.cos(angle) * baseSpeed,
        vy: Math.sin(angle) * baseSpeed,
        radius: 0.8 + Math.random() * 2.2,
        opacity: 0,
        targetOpacity: 0.05 + Math.random() * 0.05,
        depth,
        hue: Math.random() * 60 - 30,
      });
    }
    return particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile = window.innerWidth < 768;
    const count = isMobile ? MOBILE_COUNT : DESKTOP_COUNT;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const mobile = window.innerWidth < 768;
      const newCount = mobile ? MOBILE_COUNT : DESKTOP_COUNT;
      particlesRef.current = createParticles(
        newCount,
        canvas.width,
        canvas.height,
      );
    };

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particlesRef.current = createParticles(count, canvas.width, canvas.height);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    const minInterval = 1000 / FPS_CAP;

    const animate = (timestamp: number) => {
      if (document.hidden) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const elapsed = timestamp - lastTimeRef.current;
      if (elapsed < minInterval) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }
      lastTimeRef.current = timestamp;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;
      const dark = isDarkRef.current;
      const currentMood = moodRef.current;
      const cfg = getMoodConfig(currentMood, dark);
      const moodOpacityMax = cfg.maxOpacity;
      const moodOpacityMin = cfg.minOpacity;
      const speedMult = cfg.speedMult;

      ctx.clearRect(0, 0, w, h);

      const mouse = mouseRef.current;
      const particles = particlesRef.current;

      // Update and draw connections first (below particles)
      ctx.save();
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const alpha = cfg.connectionOpacity * (1 - dist / CONNECTION_DIST);
            const r = cfg.tintR;
            const g = cfg.tintG;
            const b = cfg.tintB;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      ctx.restore();

      // Update and draw particles
      for (const p of particles) {
        // Cursor repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CURSOR_REPEL_DIST && dist > 0) {
          const force = (CURSOR_REPEL_DIST - dist) / CURSOR_REPEL_DIST;
          p.vx += (dx / dist) * force * 0.04;
          p.vy += (dy / dist) * force * 0.04;
        }

        // Speed damping and limit
        const maxSpeed = 0.4 * speedMult;
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed;
          p.vy = (p.vy / speed) * maxSpeed;
        }

        // Damping
        p.vx *= 0.99;
        p.vy *= 0.99;

        // Depth-based parallax speed
        p.x += p.vx * speedMult;
        p.y += p.vy * speedMult;

        // Edge fade and wrap
        const edgeFadeZone = 60;
        let edgeFade = 1;
        if (p.x < edgeFadeZone)
          edgeFade = Math.min(edgeFade, p.x / edgeFadeZone);
        if (p.x > w - edgeFadeZone)
          edgeFade = Math.min(edgeFade, (w - p.x) / edgeFadeZone);
        if (p.y < edgeFadeZone)
          edgeFade = Math.min(edgeFade, p.y / edgeFadeZone);
        if (p.y > h - edgeFadeZone)
          edgeFade = Math.min(edgeFade, (h - p.y) / edgeFadeZone);
        edgeFade = Math.max(0, edgeFade);

        // Wrap particles
        if (p.x < -20) p.x = w + 10;
        if (p.x > w + 20) p.x = -10;
        if (p.y < -20) p.y = h + 10;
        if (p.y > h + 20) p.y = -10;

        // Fade in/out target
        p.targetOpacity =
          moodOpacityMin +
          Math.random() * 0.002 * (moodOpacityMax - moodOpacityMin) * 100;
        // Smooth opacity
        p.opacity += (p.targetOpacity - p.opacity) * 0.01;
        p.opacity = Math.max(
          moodOpacityMin,
          Math.min(moodOpacityMax, p.opacity),
        );

        const finalOpacity = p.opacity * edgeFade;
        const r = cfg.tintR;
        const g = cfg.tintG;
        const b = cfg.tintB;

        // Glow effect
        const glowRadius = p.radius * 3;
        const grad = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          glowRadius,
        );
        grad.addColorStop(0, `rgba(${r},${g},${b},${finalOpacity})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${finalOpacity * 2})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [createParticles]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        willChange: "transform",
      }}
    />
  );
}
