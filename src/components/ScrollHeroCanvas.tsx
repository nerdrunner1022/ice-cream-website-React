import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import type { ProceduralTheme } from '../types/store';

const HeroIceCreamModel = lazy(() => import('./HeroIceCreamModel'));

interface EditorialCallout {
  id: string;
  range: [number, number];
  milestone: string;
  eyebrow: string;
  title: string;
  body: string;
}

const CALLOUTS: EditorialCallout[] = [
  {
    id: 'step-1',
    range: [0.12, 0.32],
    milestone: '01 / 04',
    eyebrow: 'Raw Alchemy',
    title: 'Single-Origin Cacao & Pasture Cream',
    body: 'Steeped for 36 hours with whole Madagascar vanilla pods and 72% Chuao Valley cacao.',
  },
  {
    id: 'step-2',
    range: [0.32, 0.55],
    milestone: '02 / 04',
    eyebrow: 'Copper Churning',
    title: 'Slow-Frozen at -14°C',
    body: 'Minimal overrun preserves dense, silk-like viscosity without artificial stabilizers.',
  },
  {
    id: 'step-3',
    range: [0.55, 0.78],
    milestone: '03 / 04',
    eyebrow: 'Hand-Rolled Waffle',
    title: 'Warm Brown-Butter Cones',
    body: 'Pressed to order on cast-iron plates with organic stone-ground spelt and sea salt.',
  },
  {
    id: 'step-4',
    range: [0.78, 1],
    milestone: '04 / 04',
    eyebrow: 'The Final Pour',
    title: 'Crafted for Quiet Indulgence',
    body: 'Explore today’s small-batch counter menu or reserve a curated flight.',
  },
];

const THEME_GLOWS: Record<ProceduralTheme, string> = {
  criollo: 'rgba(137, 79, 45, 0.34)',
  vanilla: 'rgba(198, 156, 109, 0.3)',
  pistachio: 'rgba(105, 127, 81, 0.3)',
};

export default function ScrollHeroCanvas() {
  const { heroMedia, customVideoUrl } = useStore();
  const containerRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const animationFrameRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const [heroModelReady, setHeroModelReady] = useState(false);

  const isVideoMode = heroMedia.mode === 'video' && Boolean(customVideoUrl);
  const glow = THEME_GLOWS[heroMedia.proceduralTheme] ?? THEME_GLOWS.criollo;

  useEffect(() => {
    const animateProgress = (): void => {
      const current = currentProgressRef.current;
      const target = targetProgressRef.current;
      const next = current + (target - current) * 0.12;
      currentProgressRef.current = Math.abs(target - next) < 0.001 ? target : next;
      setProgress(currentProgressRef.current);

      if (currentProgressRef.current !== target) {
        animationFrameRef.current = requestAnimationFrame(animateProgress);
      } else {
        animationFrameRef.current = 0;
      }
    };

    const handleScroll = (): void => {
      const section = containerRef.current;
      if (!section) return;
      const scrollableDistance = section.offsetHeight - window.innerHeight;
      targetProgressRef.current =
        scrollableDistance > 0
          ? Math.min(Math.max(-section.getBoundingClientRect().top / scrollableDistance, 0), 1)
          : 0;

      if (!animationFrameRef.current) {
        animationFrameRef.current = requestAnimationFrame(animateProgress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = 0;
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!isVideoMode || !video?.duration) return;
    const targetTime = progress * video.duration;
    if (Math.abs(video.currentTime - targetTime) > 0.03) {
      video.currentTime = targetTime;
    }
  }, [isVideoMode, progress]);

  const activeCalloutIndex = CALLOUTS.findIndex(({ range }, index) => {
    const isLast = index === CALLOUTS.length - 1;
    return progress >= range[0] && (progress < range[1] || isLast);
  });
  const activeCallout =
    activeCalloutIndex >= 0 ? CALLOUTS[activeCalloutIndex] : null;
  const activeCalloutRange = activeCallout?.range;
  const calloutProgress = activeCalloutRange
    ? Math.min(
        Math.max(
          (progress - activeCalloutRange[0]) /
            (activeCalloutRange[1] - activeCalloutRange[0]),
          0
        ),
        1
      )
    : 0;
  const calloutOpacity = Math.min(
    Math.min(calloutProgress / 0.18, 1),
    Math.max((1 - calloutProgress) / 0.3, 0)
  );
  const calloutExitOffset = Math.max(
    (calloutProgress - 0.7) / 0.3,
    0
  ) * window.innerHeight * 0.25;

  return (
    <section ref={containerRef} className="relative h-[360vh] bg-espresso">
      <div
        data-home-reveal
        className="sticky top-0 h-[100svh] min-h-[38rem] w-full overflow-hidden"
      >
        {isVideoMode && customVideoUrl ? (
          <video
            ref={videoRef}
            src={customVideoUrl}
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}

        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 74% 48%, ${glow} 0%, transparent 42%), linear-gradient(115deg, #130d09 0%, #21150f 48%, #120c09 100%)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-espresso/75 via-espresso/10 to-transparent" />
        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(rgba(223,192,151,0.8)_0.7px,transparent_0.7px)] [background-size:54px_54px]" />

        <Suspense fallback={null}>
          <HeroIceCreamModel
            onReady={() => setHeroModelReady(true)}
            onError={() => setHeroModelReady(true)}
            className="right-[-2%] top-[2%] z-[1] h-[94%] w-[70%] max-lg:right-1/2 max-lg:top-0 max-lg:h-[76%] max-lg:w-full max-lg:translate-x-1/2"
          />
        </Suspense>

        <div
          aria-live="polite"
          aria-hidden={heroModelReady}
          className={`absolute inset-0 z-30 flex flex-col items-center justify-center gap-5 bg-[#17100c] text-center transition-opacity duration-700 ${
            heroModelReady ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
        >
          <span className="h-9 w-9 animate-spin rounded-full border border-alabaster/20 border-t-gold" />
          <div>
            <p className="font-serif text-2xl text-alabaster">Preparing your scoop</p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.24em] text-gold-light/65">
              A little indulgence is on its way
            </p>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-b from-espresso/20 via-transparent to-espresso/65" />

        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-end px-6 pb-32 text-center transition-opacity duration-300 lg:items-start lg:justify-center lg:pb-0 lg:pl-[8vw] lg:pr-[57vw] lg:text-left"
          style={{ opacity: Math.max(1 - progress * 7, 0) }}
        >
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-espresso/55 px-4 py-1.5 text-[10px] uppercase tracking-[0.24em] text-gold-light backdrop-blur-md sm:text-xs">
            <Sparkles className="h-3.5 w-3.5" />
            Artisanal Creamery · Est. 2019
          </span>
          <h1 className="max-w-3xl font-serif text-5xl font-medium leading-[0.9] tracking-tight text-alabaster sm:text-7xl lg:text-8xl">
            {heroMedia.posterHeadline}
          </h1>
          <p className="mt-5 max-w-md text-sm font-light leading-relaxed tracking-wide text-alabaster/75 sm:text-base">
            {heroMedia.heroTagline}
          </p>
          <div className="mt-9 flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-gold-light/80">
            <span>Scroll to discover</span>
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </div>
        </div>

        {activeCallout && (
          <div
            key={activeCallout.id}
            style={{
              opacity: calloutOpacity,
              transform: `translateY(${calloutExitOffset}px)`,
            }}
            className="absolute bottom-20 left-1/2 z-10 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 transition-[opacity,translate] duration-300 sm:p-0 lg:bottom-auto lg:left-[8vw] lg:top-1/2 lg:w-[38vw] lg:-translate-y-1/2 lg:translate-x-0"
          >
            <div className="animate-[hero-callout-in_650ms_cubic-bezier(0.22,1,0.36,1)_both] rounded-3xl border border-alabaster/15 bg-espresso/65 p-6 text-alabaster shadow-2xl backdrop-blur-xl sm:p-8">
              <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-[0.23em] text-gold-light">
                <span>{activeCallout.eyebrow}</span>
                <span className="font-mono text-alabaster/50">{activeCallout.milestone}</span>
              </div>
              <h2 className="font-serif text-3xl font-medium leading-tight sm:text-4xl">
                {activeCallout.title}
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-alabaster/75">
                {activeCallout.body}
              </p>
              {activeCallout.id === 'step-4' && (
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to="/flavors"
                    className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-espresso transition hover:bg-gold-light"
                  >
                    Explore Flavors
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    to="/locations"
                    className="inline-flex items-center gap-2 rounded-full border border-alabaster/30 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-alabaster transition hover:border-gold hover:text-gold-light"
                  >
                    Schedule Pickup
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="pointer-events-none absolute bottom-6 left-6 z-20 flex items-center gap-3">
          <div className="h-px w-20 overflow-hidden bg-alabaster/20 sm:w-28">
            <div
              className="h-full bg-gold transition-[width] duration-100"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
          <span className="font-mono text-[10px] text-alabaster/50">
            {String(Math.round(progress * 100)).padStart(2, '0')}%
          </span>
        </div>
        <span className="pointer-events-none absolute bottom-6 right-6 z-20 hidden text-[9px] uppercase tracking-[0.2em] text-alabaster/35 sm:block">
          Velvet &amp; Cone · Small Batch, Slow Churn
        </span>
      </div>
    </section>
  );
}
