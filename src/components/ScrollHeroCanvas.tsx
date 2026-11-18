import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import type { ProceduralTheme } from '../types/store';

const TOTAL_FRAMES = 180;

interface ThemePalette {
  bgTop: string;
  bgBottom: string;
  swirlPrimary: string;
  swirlSecondary: string;
  highlight: string;
  cone: string;
}

const THEME_PALETTES: Record<ProceduralTheme, ThemePalette> = {
  criollo: {
    bgTop: '#160F0B',
    bgBottom: '#2B1B13',
    swirlPrimary: '#4A2C1D',
    swirlSecondary: '#7B4E35',
    highlight: '#C69C6D',
    cone: '#B58352',
  },
  vanilla: {
    bgTop: '#1E1611',
    bgBottom: '#352920',
    swirlPrimary: '#EAE0D0',
    swirlSecondary: '#D8C5A8',
    highlight: '#C69C6D',
    cone: '#A9794A',
  },
  pistachio: {
    bgTop: '#141B13',
    bgBottom: '#232F21',
    swirlPrimary: '#7B8F5E',
    swirlSecondary: '#A2B484',
    highlight: '#DFC097',
    cone: '#B58352',
  },
};

interface EditorialCallout {
  id: string;
  range: [number, number];
  milestone: string;
  eyebrow: string;
  title: string;
  body: string;
  align: 'left' | 'right' | 'center';
}

const CALLOUTS: EditorialCallout[] = [
  {
    id: 'step-1',
    range: [0.04, 0.24],
    milestone: '10%',
    eyebrow: '01 · Raw Alchemy',
    title: 'Single-Origin Cacao & Pasture Cream',
    body: 'Steeped for 36 hours with whole Madagascar vanilla pods and 72% Chuao Valley cacao.',
    align: 'left',
  },
  {
    id: 'step-2',
    range: [0.28, 0.49],
    milestone: '38%',
    eyebrow: '02 · Copper Churning',
    title: 'Slow-Frozen at -14°C',
    body: 'Minimal overrun preserves dense, silk-like viscosity without artificial stabilizers.',
    align: 'right',
  },
  {
    id: 'step-3',
    range: [0.56, 0.77],
    milestone: '68%',
    eyebrow: '03 · Hand-Rolled Waffle',
    title: 'Warm Brown-Butter Cones',
    body: 'Pressed to order on cast-iron plates with organic stone-ground spelt and sea salt.',
    align: 'left',
  },
  {
    id: 'step-4',
    range: [0.82, 0.99],
    milestone: '90%',
    eyebrow: '04 · The Final Pour',
    title: 'Crafted for Quiet Indulgence',
    body: 'Explore today’s small-batch counter menu or reserve a curated flight.',
    align: 'center',
  },
];

export default function ScrollHeroCanvas() {
  const { heroMedia, customVideoUrl } = useStore();
  const containerRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [progress, setProgress] = useState<number>(0);
  const targetProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);

  const isVideoMode = heroMedia.mode === 'video' && Boolean(customVideoUrl);
  const palette =
    THEME_PALETTES[heroMedia.proceduralTheme] ?? THEME_PALETTES.criollo;

  useEffect(() => {
    const handleScroll = (): void => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollableDistance = el.offsetHeight - window.innerHeight;
      if (scrollableDistance <= 0) return;
      const raw = Math.min(Math.max(-rect.top / scrollableDistance, 0), 1);
      targetProgressRef.current = raw;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let rafId = 0;
    const canvas = canvasRef.current;
    const ctx = canvas ? canvas.getContext('2d') : null;

    const resizeCanvas = (): void => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const drawProceduralFrame = (p: number): void => {
      if (!ctx || !canvas) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const frameIndex = Math.round(p * TOTAL_FRAMES);
      const cx = w / 2;
      const cy = h / 2;

      // 1. Luxury Espresso Radial Backdrop
      const bgGrad = ctx.createRadialGradient(
        cx,
        cy * 0.85,
        40,
        cx,
        cy,
        Math.max(w, h) * 0.78
      );
      bgGrad.addColorStop(0, palette.bgBottom);
      bgGrad.addColorStop(1, palette.bgTop);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Warm golden aura
      const auraRadius = Math.min(w, h) * (0.24 + p * 0.14);
      const aura = ctx.createRadialGradient(cx, cy, 10, cx, cy, auraRadius * 1.6);
      aura.addColorStop(0, 'rgba(198, 156, 109, 0.22)');
      aura.addColorStop(1, 'rgba(198, 156, 109, 0)');
      ctx.fillStyle = aura;
      ctx.fillRect(0, 0, w, h);

      // 2. Churning Velvet Ribbons
      const ribbonCount = 5;
      for (let i = 0; i < ribbonCount; i++) {
        ctx.save();
        ctx.beginPath();
        const phase = p * Math.PI * 3.5 + i * 1.15;
        const amp = Math.min(w, h) * (0.08 + (1 - p) * 0.14);

        for (let x = -40; x <= w + 40; x += 28) {
          const norm = x / w;
          const y =
            cy +
            Math.sin(norm * 5 + phase) * amp +
            Math.cos(norm * 2.5 - phase * 0.6) * (amp * 0.45) +
            (i - 2) * 26 * (1 - p * 0.5);
          if (x === -40) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.strokeStyle =
          i % 2 === 0 ? palette.swirlPrimary : palette.swirlSecondary;
        ctx.globalAlpha = 0.25 + p * 0.35;
        ctx.lineWidth = 24 - i * 3;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.restore();
      }

      // 3. Artisanal Waffle Cone Silhouette
      const coneOpacity = Math.min(Math.max((p - 0.35) / 0.35, 0), 1);
      if (coneOpacity > 0) {
        ctx.save();
        ctx.globalAlpha = coneOpacity;
        const coneTopY = cy + 30;
        const coneTipY = cy + Math.min(h * 0.32, 230);
        const coneHalfW = Math.min(w * 0.11, 88);

        const coneGrad = ctx.createLinearGradient(
          cx - coneHalfW,
          coneTopY,
          cx + coneHalfW,
          coneTipY
        );
        coneGrad.addColorStop(0, '#D4A574');
        coneGrad.addColorStop(0.5, palette.cone);
        coneGrad.addColorStop(1, '#754C29');

        ctx.beginPath();
        ctx.moveTo(cx - coneHalfW, coneTopY);
        ctx.lineTo(cx + coneHalfW, coneTopY);
        ctx.lineTo(cx, coneTipY);
        ctx.closePath();
        ctx.fillStyle = coneGrad;
        ctx.fill();

        ctx.clip();
        ctx.strokeStyle = 'rgba(30, 22, 17, 0.28)';
        ctx.lineWidth = 1.4;
        for (let offset = -140; offset <= 140; offset += 20) {
          ctx.beginPath();
          ctx.moveTo(cx + offset - 60, coneTopY);
          ctx.lineTo(cx + offset + 80, coneTipY);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(cx + offset + 60, coneTopY);
          ctx.lineTo(cx + offset - 80, coneTipY);
          ctx.stroke();
        }
        ctx.restore();
      }

      // 4. Sculpted Gelato Scoop Sphere
      const scoopScale =
        0.55 + Math.sin(Math.min(p * 1.15, 1) * Math.PI * 0.5) * 0.45;
      const scoopRadius = Math.min(w, h) * 0.135 * scoopScale;
      const scoopY = cy - 45 + (1 - p) * 28;

      ctx.save();
      const scoopGrad = ctx.createRadialGradient(
        cx - scoopRadius * 0.35,
        scoopY - scoopRadius * 0.35,
        scoopRadius * 0.1,
        cx,
        scoopY,
        scoopRadius * 1.1
      );
      scoopGrad.addColorStop(0, palette.swirlSecondary);
      scoopGrad.addColorStop(0.6, palette.swirlPrimary);
      scoopGrad.addColorStop(1, '#120B08');

      ctx.beginPath();
      ctx.arc(cx, scoopY, scoopRadius, 0, Math.PI * 2);
      ctx.fillStyle = scoopGrad;
      ctx.shadowColor = 'rgba(0,0,0,0.55)';
      ctx.shadowBlur = 45;
      ctx.fill();

      ctx.beginPath();
      for (let a = 0; a <= Math.PI * 2 + 0.1; a += 0.2) {
        const wave = Math.sin(a * 6 + p * 8) * 5;
        const rx = cx + Math.cos(a) * (scoopRadius + wave);
        const ry = scoopY + Math.sin(a) * (scoopRadius * 0.92 + wave);
        if (a === 0) ctx.moveTo(rx, ry);
        else ctx.lineTo(rx, ry);
      }
      ctx.strokeStyle = 'rgba(223, 192, 151, 0.25)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // 5. Gold Leaf & Cacao Nib Particles
      const particleCount = 26;
      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2 + p * 2.2;
        const dist =
          Math.min(w, h) * (0.18 + ((i * 37) % 100) / 300) * (0.7 + p * 0.5);
        const px = cx + Math.cos(angle) * dist;
        const py = cy + Math.sin(angle * 0.9) * dist * 0.72 - p * 35;
        const size = 1.8 + (i % 4);

        ctx.save();
        ctx.fillStyle = i % 3 === 0 ? '#DFC097' : '#C69C6D';
        ctx.globalAlpha = 0.25 + Math.sin(p * Math.PI + i) * 0.45;
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 6. Frame Telemetry Watermark
      ctx.save();
      ctx.fillStyle = 'rgba(250, 246, 240, 0.42)';
      ctx.font = '500 11px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(
        `CHURN SEQUENCE · FRAME ${String(frameIndex).padStart(3, '0')} / ${TOTAL_FRAMES}`,
        w - 28,
        h - 24
      );
      ctx.restore();
    };

    const tick = (): void => {
      currentProgressRef.current +=
        (targetProgressRef.current - currentProgressRef.current) * 0.085;

      const p = currentProgressRef.current;
      setProgress(p);

      if (isVideoMode && videoRef.current && videoRef.current.duration) {
        const targetTime = p * videoRef.current.duration;
        if (Math.abs(videoRef.current.currentTime - targetTime) > 0.03) {
          videoRef.current.currentTime = targetTime;
        }
      } else {
        drawProceduralFrame(p);
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isVideoMode, palette]);

  return (
    <section ref={containerRef} className="relative h-[450vh] bg-espresso">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {isVideoMode && customVideoUrl ? (
          <video
            ref={videoRef}
            src={customVideoUrl}
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 block h-full w-full"
          />
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-espresso/50 via-transparent to-espresso/75" />

        {/* Initial Hero Title */}
        <div
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center transition-opacity duration-300"
          style={{ opacity: Math.max(1 - progress * 7, 0) }}
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-espresso/60 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-gold-light backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            Artisanal Creamery · Est. 2019
          </span>
          <h1 className="max-w-4xl font-serif text-5xl font-medium tracking-tight text-alabaster sm:text-7xl md:text-8xl">
            {heroMedia.posterHeadline}
          </h1>
          <p className="mt-4 max-w-xl text-sm font-light tracking-wide text-alabaster/80 sm:text-base">
            {heroMedia.heroTagline}
          </p>
          <div className="mt-10 flex flex-col items-center gap-2 text-xs uppercase tracking-[0.22em] text-gold-light/80">
            <span>Scroll to Churn</span>
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </div>
        </div>

        {/* Scroll-Synced Glassmorphic Callouts */}
        {CALLOUTS.map((callout) => {
          const [start, end] = callout.range;
          const mid = (start + end) / 2;
          const halfSpan = (end - start) / 2;
          const dist = Math.abs(progress - mid);
          const opacity = Math.max(0, Math.min(1, 1 - (dist / halfSpan) * 1.15));
          const translateY = (progress - mid) * -45;

          const positionClasses =
            callout.align === 'left'
              ? 'left-6 md:left-16 bottom-20 md:bottom-auto md:top-1/2 md:-translate-y-1/2'
              : callout.align === 'right'
              ? 'right-6 md:right-16 bottom-20 md:bottom-auto md:top-1/2 md:-translate-y-1/2'
              : 'left-1/2 -translate-x-1/2 bottom-20 text-center';

          return (
            <div
              key={callout.id}
              style={{
                opacity,
                transform:
                  callout.align === 'center'
                    ? `translate(-50%, ${translateY}px)`
                    : `translateY(${translateY}px)`,
                pointerEvents: opacity > 0.25 ? 'auto' : 'none',
              }}
              className={`absolute z-20 w-[calc(100%-3rem)] max-w-md rounded-2xl border border-alabaster/15 bg-espresso/55 p-6 text-alabaster shadow-2xl backdrop-blur-xl transition-opacity duration-150 sm:p-8 ${positionClasses}`}
            >
              <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-gold-light">
                <span>{callout.eyebrow}</span>
                <span className="font-mono text-alabaster/50">
                  {callout.milestone}
                </span>
              </div>
              <h2 className="font-serif text-2xl font-medium leading-snug text-alabaster sm:text-3xl">
                {callout.title}
              </h2>
              <p className="mt-2.5 text-sm leading-relaxed text-alabaster/75">
                {callout.body}
              </p>

              {callout.id === 'step-4' && (
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <Link
                    to="/flavors"
                    className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-espresso transition hover:bg-gold-light"
                  >
                    Explore Flavors
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    to="/locations"
                    className="inline-flex items-center gap-2 rounded-full border border-alabaster/30 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-alabaster transition hover:border-gold hover:text-gold-light"
                  >
                    Schedule Pickup
                  </Link>
                </div>
              )}
            </div>
          );
        })}

        {/* Scroll Progress Telemetry */}
        <div className="pointer-events-none absolute bottom-6 left-6 z-20 flex items-center gap-3">
          <div className="h-1 w-28 overflow-hidden rounded-full bg-alabaster/15">
            <div
              className="h-full bg-gold transition-all duration-75"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
          <span className="font-mono text-[11px] text-alabaster/60">
            {Math.round(progress * 100)}%
          </span>
        </div>
      </div>
    </section>
  );
}
