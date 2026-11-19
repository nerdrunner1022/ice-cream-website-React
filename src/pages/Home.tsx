import React, { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Award,
  Leaf,
  ThermometerSnowflake,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import ScrollHeroCanvas from '../components/ScrollHeroCanvas';
import FlavorModal from '../components/FlavorModal';
import { useStore } from '../context/StoreContext';
import type { Flavor } from '../types/store';
import sundaeImage from '../images/pngtree-ice-cream-topped-with-chocolate-picture-image_2639907-4288302848.png';
import chocolateImage from '../images/ice-cream-chocolate.jpg';
import vanillaImage from '../images/Classic-Vanilla-Ice-Cream-2188165609.jpg';
import pistachioImage from '../images/2017-June-8th-Pistachio-Ice-Cream-002-3040025787.jpg';

const FLAVOR_IMAGES: Record<string, string> = {
  'flv-1': chocolateImage,
  'flv-2': vanillaImage,
  'flv-3': pistachioImage,
};

interface BrandPillar {
  icon: LucideIcon;
  title: string;
  copy: string;
}

const PILLARS: BrandPillar[] = [
  {
    icon: ThermometerSnowflake,
    title: '18% Overrun Density',
    copy: 'Whipped slowly to eliminate excess air, creating an opulent, truffle-like mouthfeel.',
  },
  {
    icon: Award,
    title: 'Single-Origin Harvests',
    copy: 'Direct-trade Chuao cacao, Kyoto Uji matcha, and Grade A Bourbon vanilla caviar.',
  },
  {
    icon: Leaf,
    title: 'Organic Meadow Dairy',
    copy: 'Grass-fed Jersey cream alongside house-crafted oat & coconut emulsions.',
  },
];

export default function Home() {
  const { flavors } = useStore();
  const homeRef = useRef<HTMLDivElement | null>(null);
  const [activeFlavor, setActiveFlavor] = useState<Flavor | null>(null);
  const [sundaeImageLoaded, setSundaeImageLoaded] = useState(false);

  const featuredFlavors = flavors.filter((f) => f.featured).slice(0, 3);

  useLayoutEffect(() => {
    const home = homeRef.current;
    if (!home) return;

    const sections = home.querySelectorAll<HTMLElement>('[data-home-reveal]');
    if (!('IntersectionObserver' in window)) {
      sections.forEach((section) => section.setAttribute('data-revealed', 'true'));
      return;
    }

    home.setAttribute('data-reveal-ready', 'true');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute('data-revealed', 'true');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={homeRef} className="bg-alabaster">
      <ScrollHeroCanvas />

      <section data-home-reveal className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid items-end gap-8 md:grid-cols-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
              The Creamery Philosophy
            </span>
            <h2 className="mt-3 font-serif text-4xl font-medium leading-tight text-espresso sm:text-5xl">
              An obsessive study in texture, origin, and temperature.
            </h2>
          </div>
          <p className="text-base leading-relaxed text-cocoa/80">
            Every batch of Velvet &amp; Cone begins before dawn. We mill our own
            roasted Sicilian pistachios, steep single-estate vanilla beans for
            thirty-six hours, and draw each pint directly from -14°C copper
            cylinders.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="rounded-3xl border border-espresso/10 bg-cream/60 p-8 transition hover:border-gold/50"
              >
                <Icon className="h-7 w-7 text-gold" />
                <h3 className="mt-5 font-serif text-2xl font-medium text-espresso">
                  {pillar.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-cocoa/75">
                  {pillar.copy}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section data-home-reveal className="relative isolate overflow-hidden bg-[radial-gradient(ellipse_at_78%_10%,rgba(137,79,45,0.28),transparent_38%),linear-gradient(120deg,#1e1611,#2b1b13_55%,#1a120e)] py-20 text-alabaster sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-8 md:grid-cols-[0.85fr_1.15fr]">
            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-gold">
                <Sparkles className="h-3.5 w-3.5" />
                Today’s Featured Churns
              </span>
              <h2 className="mt-3 max-w-lg font-serif text-4xl font-medium leading-[0.98] sm:text-5xl md:text-6xl">
                Poured fresh at our ateliers.
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-alabaster/65">
                A closer look at the scoops we make slowly, with ingredients worth seeking out.
              </p>
              <Link
                to="/flavors"
                className="mt-7 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-light transition hover:text-gold"
              >
                View Full Flavor Archive
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="relative flex h-[18rem] items-center justify-center sm:h-[24rem] md:h-[27rem]">
              <div className="absolute left-[16%] top-[18%] h-[64%] w-[68%] rounded-full bg-gold/10 blur-3xl" />
              <img
                src={sundaeImage}
                alt="Chocolate sundae topped with whipped cream, chocolate sauce, and cherries"
                loading="lazy"
                decoding="async"
                onLoad={() => setSundaeImageLoaded(true)}
                onError={() =>
                  console.error('Unable to load the featured sundae image.', sundaeImage)
                }
                className={`relative h-full w-full object-contain transition-opacity duration-1000 ease-out ${
                  sundaeImageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  maskImage:
                    'radial-gradient(ellipse 70% 76% at 50% 50%, #000 28%, rgba(0,0,0,0.92) 52%, transparent 100%)',
                  WebkitMaskImage:
                    'radial-gradient(ellipse 70% 76% at 50% 50%, #000 28%, rgba(0,0,0,0.92) 52%, transparent 100%)',
                }}
              />
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] uppercase tracking-[0.24em] text-alabaster/45">
                Churned daily · served slowly
              </span>
            </div>
          </div>

          <div className="mt-16 grid gap-5 md:mt-20 md:grid-cols-3">
            {featuredFlavors.map((flavor) => (
              <div
                key={flavor.id}
                onClick={() => setActiveFlavor(flavor)}
                className="group cursor-pointer rounded-3xl border border-alabaster/10 bg-[#211711]/75 p-6 transition hover:-translate-y-1 hover:border-gold/40"
              >
                <div
                  className="relative mb-6 flex h-44 items-end justify-between overflow-hidden rounded-2xl bg-cocoa p-5 sm:h-52"
                >
                  <img
                    src={FLAVOR_IMAGES[flavor.id] ?? chocolateImage}
                    alt={flavor.name}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-espresso/65 via-transparent to-espresso/10" />
                  <span className="relative rounded-full bg-espresso/75 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-alabaster backdrop-blur-md">
                    {flavor.inStock ? 'In Stock' : 'Sold Out'}
                  </span>
                  <span className="relative font-serif text-2xl font-semibold text-alabaster drop-shadow">
                    ${flavor.price.toFixed(2)}
                  </span>
                </div>

                <h3 className="font-serif text-2xl font-medium text-alabaster group-hover:text-gold-light">
                  {flavor.name}
                </h3>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-alabaster/60">
                  {flavor.origin}
                </p>
                <p className="mt-3 line-clamp-2 text-sm text-alabaster/75">
                  {flavor.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FlavorModal
        flavor={activeFlavor}
        onClose={() => setActiveFlavor(null)}
      />
    </div>
  );
}
