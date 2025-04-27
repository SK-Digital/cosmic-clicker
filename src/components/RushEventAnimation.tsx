import React, { useEffect, useRef } from 'react';

interface RushEventAnimationProps {
  event: { id: string; name: string; duration: number; startedAt: number };
  onComplete: () => void;
}

// --- Meteor Shower Animation ---
const METEOR_COLORS = [
  'rgba(255,255,255,0.95)', // white
  'rgba(255,180,80,0.95)',  // orange
  'rgba(120,180,255,0.95)', // blue
];
const METEOR_MIN_LEN = 80;
const METEOR_MAX_LEN = 180;
const METEOR_MIN_SPEED = 7;
const METEOR_MAX_SPEED = 13;
const METEOR_SPAWN_INTERVAL = 180; // ms
const METEOR_THICKNESS = 3;

function randomMeteor(canvasWidth: number, canvasHeight: number) {
  // Meteors streak diagonally from random X at top, angle ~-30deg
  const startX = Math.random() * canvasWidth;
  const startY = -30;
  const angle = (-Math.PI / 6) + (Math.random() - 0.5) * 0.2; // -30deg ± ~6deg
  const len = METEOR_MIN_LEN + Math.random() * (METEOR_MAX_LEN - METEOR_MIN_LEN);
  const speed = METEOR_MIN_SPEED + Math.random() * (METEOR_MAX_SPEED - METEOR_MIN_SPEED);
  const color = METEOR_COLORS[Math.floor(Math.random() * METEOR_COLORS.length)];
  return {
    x: startX,
    y: startY,
    angle,
    len,
    speed,
    color,
    alpha: 1,
  };
}

const MeteorShower: React.FC<{ duration: number; onComplete: () => void }> = ({ duration, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const meteors = useRef<any[]>([]);
  const running = useRef(true);
  const animationFrame = useRef<number>();
  const spawnInterval = useRef<number>();
  const endTimeout = useRef<number>();

  useEffect(() => {
    running.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Handle resize
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    // Spawn meteors
    spawnInterval.current = window.setInterval(() => {
      if (!running.current) return;
      meteors.current.push(randomMeteor(width, height));
    }, METEOR_SPAWN_INTERVAL);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      meteors.current.forEach((m, i) => {
        // Move meteor
        m.x += Math.cos(m.angle) * m.speed;
        m.y += Math.sin(m.angle) * m.speed;
        m.alpha *= 0.985;
        // Draw trail
        ctx.save();
        ctx.globalAlpha = m.alpha;
        ctx.strokeStyle = m.color;
        ctx.shadowColor = m.color;
        ctx.shadowBlur = 16;
        ctx.lineWidth = METEOR_THICKNESS;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x - Math.cos(m.angle) * m.len, m.y - Math.sin(m.angle) * m.len);
        ctx.stroke();
        ctx.restore();
      });
      // Remove meteors that are off screen or faded
      meteors.current = meteors.current.filter(m => m.x < width + 100 && m.y < height + 100 && m.alpha > 0.05);
      if (running.current) animationFrame.current = requestAnimationFrame(animate);
    };
    animationFrame.current = requestAnimationFrame(animate);

    // End event after duration
    endTimeout.current = window.setTimeout(() => {
      running.current = false;
      window.removeEventListener('resize', handleResize);
      clearInterval(spawnInterval.current);
      cancelAnimationFrame(animationFrame.current!);
      onComplete();
    }, duration * 1000);

    return () => {
      running.current = false;
      window.removeEventListener('resize', handleResize);
      clearInterval(spawnInterval.current);
      cancelAnimationFrame(animationFrame.current!);
      clearTimeout(endTimeout.current);
    };
  }, [duration, onComplete]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-40"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
};

// --- Black Hole Animation ---
const BlackHole: React.FC<{ duration: number; onComplete: () => void }> = ({ duration, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const running = useRef(true);
  const animationFrame = useRef<number>();
  const endTimeout = useRef<number>();

  useEffect(() => {
    running.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Center
    const cx = width / 2;
    const cy = height / 2;
    let t = 0;

    // Handle resize
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      // Swirling accretion disk
      for (let i = 0; i < 32; i++) {
        const angle = (t * 0.03 + i * (Math.PI * 2) / 32);
        const r1 = 120 + Math.sin(t * 0.01 + i) * 8;
        const r2 = 160 + Math.cos(t * 0.012 + i) * 12;
        ctx.save();
        ctx.globalAlpha = 0.13 + 0.07 * Math.sin(t * 0.02 + i);
        ctx.strokeStyle = `hsl(${260 + i * 4}, 90%, 70%)`;
        ctx.shadowColor = '#a78bfa';
        ctx.shadowBlur = 24;
        ctx.lineWidth = 8 + 2 * Math.sin(t * 0.03 + i);
        ctx.beginPath();
        ctx.arc(cx, cy, r1 + (r2 - r1) * 0.5, angle, angle + 0.25);
        ctx.stroke();
        ctx.restore();
      }
      // Black hole core
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, 80, 0, Math.PI * 2);
      ctx.fillStyle = 'black';
      ctx.shadowColor = '#7c3aed';
      ctx.shadowBlur = 60;
      ctx.globalAlpha = 1;
      ctx.fill();
      ctx.restore();
      // Intense glow
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, 100, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(120,80,255,0.25)';
      ctx.lineWidth = 40;
      ctx.shadowColor = '#a78bfa';
      ctx.shadowBlur = 80;
      ctx.globalAlpha = 0.7;
      ctx.stroke();
      ctx.restore();
      t++;
      if (running.current) animationFrame.current = requestAnimationFrame(animate);
    };
    animationFrame.current = requestAnimationFrame(animate);

    // End event after duration
    endTimeout.current = window.setTimeout(() => {
      running.current = false;
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrame.current!);
      onComplete();
    }, duration * 1000);

    return () => {
      running.current = false;
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrame.current!);
      clearTimeout(endTimeout.current);
    };
  }, [duration, onComplete]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
};

const RushEventAnimation: React.FC<RushEventAnimationProps> = ({ event, onComplete }) => {
  if (event.id === 'meteorShower') {
    return <MeteorShower duration={event.duration} onComplete={onComplete} />;
  }
  if (event.id === 'blackHoleRift') {
    return <BlackHole duration={event.duration} onComplete={onComplete} />;
  }
  return null;
};

export default RushEventAnimation;
