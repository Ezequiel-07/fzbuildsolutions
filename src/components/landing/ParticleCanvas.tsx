"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";

/* ─────────────────────────────────────────────────────────────
   ParticleCanvas v5.0 — The live technological universe.
   A mixture of 5 premium layers of animations:
   1. Universe deep nebulae (slow moving radial color gradients)
   2. Twinkling stars (300 tiny dots fading in/out)
   3. Neural network (nodes connected by dynamically fading lines)
   4. Luminous data streams (data packets/pulses shooting down connections)
   5. Gravitational lensing (visual coordinate warp around mouse) + ripples
───────────────────────────────────────────────────────────── */

const STAR_COUNT = 240; // Layer 2: small stars
const NODE_COUNT = 65; // Layer 3: neural nodes
const LINK_DIST = 145; // Neural link distance threshold
const BASE_SPEED = 0.3; // Drift speed
const LENS_RADIUS = 150; // Mouse gravitational lens radius
const LENS_STRENGTH = 20; // Lens warp displacement intensity
const PULSE_CHANCE = 0.007; // Spawning probability of a data stream packet per frame
const MAX_PULSES = 20; // Max concurrent data packets

interface Nebula {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  colorDark: string;
  colorLight: string;
}

interface TwinkleStar {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  phase: number;
  twinkleSpeed: number;
}

interface NeuralNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

interface DataPulse {
  fromNode: NeuralNode;
  toNode: NeuralNode;
  progress: number;
  speed: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const mousePrev = useRef({ x: -9999, y: -9999 });
  const raf = useRef<number>(0);
  const { isDark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    // Track mouse coordinates
    const onMove = (e: MouseEvent) => {
      mousePrev.current = { ...mouse.current };
      mouse.current = { x: e.clientX, y: e.clientY };

      // Removed ripple effect on hover
    };

    const onClick = () => {
      // Removed ripple effect on click
    };

    const onLeave = () => {
      mouse.current = { x: -9999, y: -9999 };
      mousePrev.current = { x: -9999, y: -9999 };
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("click", onClick, { passive: true });
    window.addEventListener("mouseleave", onLeave, { passive: true });

    // ── Layer 1: Nebulae Blobs ──
    const nebulas: Nebula[] = [
      {
        x: canvas.width * 0.2,
        y: canvas.height * 0.3,
        vx: 0.05,
        vy: 0.03,
        r: 320,
        colorDark: "rgba(30, 107, 255, 0.07)",
        colorLight: "rgba(30, 107, 255, 0.04)",
      },
      {
        x: canvas.width * 0.7,
        y: canvas.height * 0.6,
        vx: -0.04,
        vy: 0.04,
        r: 380,
        colorDark: "rgba(139, 92, 246, 0.06)",
        colorLight: "rgba(139, 92, 246, 0.03)",
      },
      {
        x: canvas.width * 0.5,
        y: canvas.height * 0.2,
        vx: 0.03,
        vy: -0.05,
        r: 280,
        colorDark: "rgba(0, 227, 253, 0.05)",
        colorLight: "rgba(0, 227, 253, 0.03)",
      },
    ];

    // ── Layer 2: Twinkling Stars ──
    const stars: TwinkleStar[] = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 0.9 + 0.3,
      baseAlpha: Math.random() * 0.4 + 0.15,
      phase: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.015 + 0.005,
    }));

    // ── Layer 3: Neural Nodes ──
    const nodes: NeuralNode[] = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * BASE_SPEED,
      vy: (Math.random() - 0.5) * BASE_SPEED,
      r: Math.random() * 1.2 + 1.1,
    }));

    // ── Layer 4: Data Streams & Packets ──
    const pulses: DataPulse[] = [];

    // ── Layer 5: Gravitational Ripples ──
    const ripples: Ripple[] = [];

    // Colors matching FZ Brand
    const nodeRGB = isDark ? "30, 107, 255" : "13, 27, 62";
    const lineRGB = isDark ? "30, 107, 255" : "13, 27, 62";
    const maxLineAlpha = isDark ? 0.24 : 0.15;

    // Helper for mouse warping (Layer 5: Gravitational lens)
    const warpCoordinates = (x: number, y: number) => {
      const mx = mouse.current.x;
      const my = mouse.current.y;
      if (mx < 0) return { x, y };

      const dx = x - mx;
      const dy = y - my;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < LENS_RADIUS && dist > 0) {
        // Warp nodes away or draw toward the mouse cursor smoothly
        const ratio = (LENS_RADIUS - dist) / LENS_RADIUS;
        const offset = ratio * LENS_STRENGTH;
        return {
          x: x + (dx / dist) * offset,
          y: y + (dy / dist) * offset,
        };
      }
      return { x, y };
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // ── LAYER 1: Deep Universe Nebulae ──
      for (const neb of nebulas) {
        neb.x += neb.vx;
        neb.y += neb.vy;

        // Wrap nebulae coordinates inside screen margins
        if (neb.x < -neb.r) neb.x = canvas.width + neb.r;
        if (neb.x > canvas.width + neb.r) neb.x = -neb.r;
        if (neb.y < -neb.r) neb.y = canvas.height + neb.r;
        if (neb.y > canvas.height + neb.r) neb.y = -neb.r;

        const radGrad = ctx.createRadialGradient(
          neb.x,
          neb.y,
          0,
          neb.x,
          neb.y,
          neb.r,
        );
        const color = isDark ? neb.colorDark : neb.colorLight;
        radGrad.addColorStop(0, color);
        radGrad.addColorStop(1, "transparent");

        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(neb.x, neb.y, neb.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── LAYER 2: Twinkling Stars (with mouse warps) ──
      for (const star of stars) {
        star.phase += star.twinkleSpeed;
        const currentAlpha = star.baseAlpha + Math.sin(star.phase) * 0.18;
        const warped = warpCoordinates(star.x, star.y);

        ctx.beginPath();
        ctx.arc(warped.x, warped.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${isDark ? "255, 255, 255" : "13, 27, 62"}, ${Math.max(0.05, Math.min(1, currentAlpha)).toFixed(3)})`;
        ctx.fill();
      }

      // ── LAYER 3: Neural Network (Update positions) ──
      const warpedNodes = nodes.map((n) => {
        // drift node coordinates
        n.x += n.vx;
        n.y += n.vy;

        // wrap edges
        if (n.x < 0) {
          n.x = 0;
          n.vx = Math.abs(n.vx);
        }
        if (n.x > canvas.width) {
          n.x = canvas.width;
          n.vx = -Math.abs(n.vx);
        }
        if (n.y < 0) {
          n.y = 0;
          n.vy = Math.abs(n.vy);
        }
        if (n.y > canvas.height) {
          n.y = canvas.height;
          n.vy = -Math.abs(n.vy);
        }

        return {
          node: n,
          warped: warpCoordinates(n.x, n.y),
        };
      });

      // Connections list
      const connections: {
        from: (typeof warpedNodes)[0];
        to: (typeof warpedNodes)[0];
        dist: number;
      }[] = [];

      // Draw Connection Lines
      for (let i = 0; i < warpedNodes.length; i++) {
        for (let j = i + 1; j < warpedNodes.length; j++) {
          const dx = warpedNodes[i].node.x - warpedNodes[j].node.x;
          const dy = warpedNodes[i].node.y - warpedNodes[j].node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < LINK_DIST) {
            connections.push({
              from: warpedNodes[i],
              to: warpedNodes[j],
              dist,
            });

            // Get line opacity based on proximity
            const lineAlpha = (1 - dist / LINK_DIST) * maxLineAlpha;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${lineRGB}, ${lineAlpha.toFixed(3)})`;
            ctx.lineWidth = (1 - dist / LINK_DIST) * 1.1;

            // Draw path using warped screen positions
            ctx.moveTo(warpedNodes[i].warped.x, warpedNodes[i].warped.y);
            ctx.lineTo(warpedNodes[j].warped.x, warpedNodes[j].warped.y);
            ctx.stroke();
          }
        }
      }

      // Draw Nodes
      for (const wn of warpedNodes) {
        ctx.beginPath();
        ctx.arc(wn.warped.x, wn.warped.y, wn.node.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${nodeRGB}, ${isDark ? "0.6" : "0.45"})`;
        ctx.fill();
      }

      // ── LAYER 4: Luminous Data Streams ──
      // Randomly spawn data packets down active connections
      if (
        connections.length > 0 &&
        pulses.length < MAX_PULSES &&
        Math.random() < PULSE_CHANCE
      ) {
        const conn =
          connections[Math.floor(Math.random() * connections.length)];

        // Ensure connection is not already housing an active pulse in this direction
        const exists = pulses.some(
          (p) => p.fromNode === conn.from.node && p.toNode === conn.to.node,
        );
        if (!exists) {
          pulses.push({
            fromNode: conn.from.node,
            toNode: conn.to.node,
            progress: 0,
            speed: Math.random() * 0.008 + 0.006,
          });
        }
      }

      // Draw & Update active data packets
      for (let k = pulses.length - 1; k >= 0; k--) {
        const p = pulses[k];
        p.progress += p.speed;

        if (p.progress >= 1) {
          pulses.splice(k, 1);
          continue;
        }

        // Project positions with lens warping factored in
        const fromWarped = warpCoordinates(p.fromNode.x, p.fromNode.y);
        const toWarped = warpCoordinates(p.toNode.x, p.toNode.y);

        const px = fromWarped.x + (toWarped.x - fromWarped.x) * p.progress;
        const py = fromWarped.y + (toWarped.y - fromWarped.y) * p.progress;

        // Draw glowing dot representing packet data
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? "#ffffff" : "#1e6bff";

        // Add subtle light glow effect
        ctx.shadowColor = isDark ? "#38bdf8" : "#1e6bff";
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0; // reset shadow immediately
      }

      // ── LAYER 5: Gravitational Waves / Ripples ──
      for (let r = ripples.length - 1; r >= 0; r--) {
        const rip = ripples[r];
        rip.radius += (rip.maxRadius - rip.radius) * 0.05;
        rip.alpha *= 0.96;

        if (rip.alpha < 0.005 || rip.radius >= rip.maxRadius - 1) {
          ripples.splice(r, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.strokeStyle = isDark
          ? `rgba(30, 107, 255, ${rip.alpha})`
          : `rgba(13, 27, 62, ${rip.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      raf.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 3 }}
    />
  );
}
