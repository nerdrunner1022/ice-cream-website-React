import React, { useState } from 'react';
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
  const [activeFlavor, setActiveFlavor] = useState<Flavor | null>(null);

  const featuredFlavors = flavors.filter((f) => f.featured).slice(0, 3);

  return (
    <div className="bg-alabaster">
      <ScrollHeroCanvas />

      <section className="mx-auto max-w-7xl px-6 py-24">
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

      <section className="bg-espresso py-24 text-alabaster">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-gold">
                <Sparkles className="h-3.5 w-3.5" />
                Today’s Featured Churns
              </span>
              <h2 className="mt-3 font-serif text-4xl font-medium sm:text-5xl">
                Poured fresh at our ateliers.
              </h2>
            </div>

            <Link
              to="/flavors"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-light transition hover:text-gold"
            >
              View Full Flavor Archive
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {featuredFlavors.map((flavor) => (
              <div
                key={flavor.id}
                onClick={() => setActiveFlavor(flavor)}
                className="group cursor-pointer rounded-3xl border border-alabaster/10 bg-cocoa/35 p-6 transition hover:border-gold/50"
              >
                <div
                  className="relative mb-6 flex h-52 items-end justify-between overflow-hidden rounded-2xl p-5"
                  style={{ backgroundColor: flavor.swatch }}
                >
                  <span className="rounded-full bg-espresso/75 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-alabaster backdrop-blur-md">
                    {flavor.inStock ? 'In Stock' : 'Sold Out'}
                  </span>
                  <span className="font-serif text-2xl font-semibold text-alabaster drop-shadow">
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
