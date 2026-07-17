"use client";

import { useEffect, useRef } from "react";

export function GalaxyParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      color: string;
    }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const numParticles = Math.floor((canvas.width * canvas.height) / 8000);
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5 + 0.1,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          color: `rgba(${Math.floor(Math.random() * 50) + 100}, ${
            Math.floor(Math.random() * 100) + 150
          }, 255, ${Math.random() * 0.8 + 0.2})`, // Blueish/cyan colors
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      particles.forEach((p) => {
        // Calculate distance and angle for slight galaxy rotation
        const dx = p.x - cx;
        const dy = p.y - cy;
        const angle = Math.atan2(dy, dx);

        // Add a gentle rotation based on distance (closer = faster rotation)
        const rotationSpeed = 0.5 / (Math.sqrt(dx * dx + dy * dy) * 0.05 + 1);

        p.x += Math.cos(angle + Math.PI / 2) * rotationSpeed + p.vx;
        p.y += Math.sin(angle + Math.PI / 2) * rotationSpeed + p.vy;

        // Wrap around screen
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Add a glow effect to some particles
        if (p.radius > 1) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
        } else {
          ctx.shadowBlur = 0;
        }
      });
      animationFrameId = requestAnimationFrame(drawParticles);
    };

    window.addEventListener("resize", resize);
    resize();
    drawParticles();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none opacity-60 mix-blend-screen"
    />
  );
}
