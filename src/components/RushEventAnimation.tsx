import React, { useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';

interface RushEventAnimationProps {
  event: { id: string; name: string; duration: number; startedAt: number };
  onComplete?: () => void;
  localCenter?: boolean;
  backgroundLayer?: boolean;
}

// --- Meteor Shower Animation ---
const METEOR_COLORS = [
  'rgba(255,255,255,0.98)', // white
  'rgba(120,180,255,0.98)', // blue
  'rgba(255,140,0,0.98)' // orange
];

const METEOR_MIN_LEN = 100;
const METEOR_MAX_LEN = 220;
const METEOR_MIN_SPEED = 10;
const METEOR_MAX_SPEED = 18;
const METEOR_SPAWN_INTERVAL = 200; // ms (slower, more subtle)
const METEOR_THICKNESS = 5; // thinner

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

const MeteorShower: React.FC<{ active: boolean }> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const meteors = useRef<any[]>([]);
  const animationFrame = useRef<number>();

  useEffect(() => {
    if (!active) {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Resize handler
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    // Animation loop
    let lastSpawn = 0;
    const animate = (now: number) => {
      ctx.clearRect(0, 0, width, height);
      // Spawn meteors every ~120ms
      if (now - lastSpawn > 120) {
        meteors.current.push({
          x: Math.random() * width,
          y: -40 + Math.random() * (height * 0.5),
          angle: (-Math.PI / 6) + (Math.random() - 0.5) * 0.1,
          len: 120 + Math.random() * 60,
          speed: 8 + Math.random() * 4,
          alpha: 1,
        });
        lastSpawn = now;
      }
      meteors.current.forEach((m) => {
        // Trail
        ctx.save();
        ctx.globalAlpha = m.alpha * 0.7;
        ctx.strokeStyle = 'orange';
        ctx.shadowColor = 'orange';
        ctx.shadowBlur = 12;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x - Math.cos(m.angle) * m.len, m.y - Math.sin(m.angle) * m.len);
        ctx.stroke();
        ctx.restore();
        // Animate
        m.x += Math.cos(m.angle) * m.speed;
        m.y += Math.sin(m.angle) * m.speed;
        m.alpha *= 0.98;
      });
      meteors.current = meteors.current.filter(m => m.x < width + 100 && m.y < height + 100 && m.alpha > 0.05);
      animationFrame.current = requestAnimationFrame(animate);
    };
    animationFrame.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
      meteors.current = [];
    };
  }, [active]);

  return (
    <>
      {active && (
        <div className="rush-meteor" style={{position: 'fixed', top: 0, left: 0, width: 1, height: 1, opacity: 0, pointerEvents: 'none', zIndex: 100}} aria-hidden="true" />
      )}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-10"
        style={{ width: '100vw', height: '100vh' }}
      />
    </>
  );
};

// --- Black Hole Animation ---
const BlackHole: React.FC<{ duration: number; onComplete?: () => void; localCenter?: boolean; backgroundLayer?: boolean }> = ({ duration, onComplete, localCenter, backgroundLayer }) => {
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
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    // Center
    let cx = width / 2;
    let cy = height / 2;
    let t = 0;

    // Handle resize
    const handleResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
      cx = width / 2;
      cy = height / 2;
    };
    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      // Multi-layered glowing ring inspired by the provided image, now animated
      // Outer purple glow (rotates and pulses)
      const purpleAngle = t * 0.008;
      const purpleRadius = Math.min(width, height) * (0.36 + 0.01 * Math.sin(t * 0.012));
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, purpleRadius, purpleAngle, purpleAngle + Math.PI * 2 * 0.98);
      ctx.strokeStyle = 'rgba(120,80,255,0.35)';
      ctx.lineWidth = Math.min(width, height) * 0.10;
      ctx.shadowColor = 'rgba(120,80,255,0.7)';
      ctx.shadowBlur = 40 + 10 * Math.sin(t * 0.01);
      ctx.globalAlpha = 1;
      ctx.stroke();
      ctx.restore();
      // Orange ring (rotates and pulses)
      const orangeAngle = -t * 0.012;
      const orangeRadius = Math.min(width, height) * (0.33 + 0.008 * Math.cos(t * 0.015));
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, orangeRadius, orangeAngle, orangeAngle + Math.PI * 2 * 0.97);
      ctx.strokeStyle = 'rgba(255,140,0,0.95)';
      ctx.lineWidth = Math.min(width, height) * 0.07;
      ctx.shadowColor = 'rgba(255,140,0,1)';
      ctx.shadowBlur = 40 + 8 * Math.cos(t * 0.013);
      ctx.globalAlpha = 1;
      ctx.stroke();
      ctx.restore();
      // Yellow ring (rotates and pulses)
      const yellowAngle = t * 0.015;
      const yellowRadius = Math.min(width, height) * (0.305 + 0.006 * Math.sin(t * 0.018));
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, yellowRadius, yellowAngle, yellowAngle + Math.PI * 2 * 0.96);
      ctx.strokeStyle = 'rgba(255,220,80,0.85)';
      ctx.lineWidth = Math.min(width, height) * 0.04;
      ctx.shadowColor = 'rgba(255,220,80,0.7)';
      ctx.shadowBlur = 20 + 6 * Math.sin(t * 0.017);
      ctx.globalAlpha = 1;
      ctx.stroke();
      ctx.restore();
      // Bright white inner edge (shimmers)
      const whiteRadius = Math.min(width, height) * (0.29 + 0.003 * Math.sin(t * 0.021));
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, whiteRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,' + (0.85 + 0.15 * Math.sin(t * 0.025)) + ')';
      ctx.lineWidth = Math.min(width, height) * 0.018;
      ctx.shadowColor = 'rgba(255,255,255,0.7)';
      ctx.shadowBlur = 10 + 4 * Math.cos(t * 0.019);
      ctx.globalAlpha = 1;
      ctx.stroke();
      ctx.restore();
      // Black hole core (unchanged)
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(width, height) * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = 'black';
      ctx.shadowColor = '#7c3aed';
      ctx.shadowBlur = 60;
      ctx.globalAlpha = 1;
      ctx.fill();
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
      if (onComplete) onComplete();
    }, duration * 1000);

    return () => {
      running.current = false;
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrame.current!);
      clearTimeout(endTimeout.current);
    };
  }, [duration, onComplete]);

  return (
    <div
      className={backgroundLayer
        ? 'rush-blackhole absolute inset-0 pointer-events-none z-0 flex items-center justify-center'
        : localCenter
        ? 'rush-blackhole absolute inset-0 pointer-events-none z-40 flex items-center justify-center'
        : 'rush-blackhole fixed inset-0 pointer-events-none z-40 flex items-center justify-center'}
      style={localCenter || backgroundLayer ? {} : { marginLeft: '25vw', width: '75vw', maxWidth: '1200px' }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

const RushEventAnimation: React.FC<RushEventAnimationProps> = ({ event, onComplete, localCenter, backgroundLayer }) => {
  if (event.id === 'meteorShower') {
    return <MeteorShower active={true} />;
  }
  if (event.id === 'blackHoleRift') {
    return <BlackHole duration={event.duration} onComplete={onComplete} localCenter={localCenter} backgroundLayer={backgroundLayer} />;
  }
  return null;
};

export default RushEventAnimation;
