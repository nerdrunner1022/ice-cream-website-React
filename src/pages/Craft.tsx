import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame, Droplets, Snowflake } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface CraftSpec {
  label: string;
  value: string;
}

interface CraftChapter {
  id: 'dairy' | 'cacao' | 'churn';
  number: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  copy: string;
  specs: CraftSpec[];
}

const CHAPTERS: CraftChapter[] = [
  {
    id: 'dairy',
    number: '01',
    icon: Droplets,
    title: 'Pasture-Raised Heritage Cream',
    subtitle: 'Hudson Valley & Normandy Milkfat',
    copy: 'Richness begins in the soil. We partner with micro-dairies raising heritage Jersey cows on rotational clover pastures. Their milk naturally holds higher beta-carotene and butterfat, eliminating any need for gums, carrageenan, or synthetic emulsifiers.',
    specs: [
      { label: 'Butterfat Ratio', value: '16.5% Heritage Cream' },
      { label: 'Pasteurization', value: 'Low-Temp Vat Batch (63°C)' },
      { label: 'Stabilizers', value: 'Zero Artificial Gums' },
    ],
  },
  {
    id: 'cacao',
    number: '02',
    icon: Flame,
    title: 'Single-Origin Cacao & Stone Milling',
    subtitle: 'Chuao Valley · Bronte · Uji',
    copy: 'Instead of commercial flavor extracts, we roast whole Venezuelan Criollo cacao nibs in-house and infuse them directly into warm cream. Pistachios from Sicily are stone-milled for 14 hours until they release their emerald oils.',
    specs: [
      { label: 'Steep Duration', value: '36-Hour Cold Infusion' },
      { label: 'Roast Profile', value: 'Light-Medium Fruit Forward' },
      { label: 'Milling', value: 'Granite Melanger · 18 Microns' },
    ],
  },
  {
    id: 'churn',
    number: '03',
    icon: Snowflake,
    title: 'Copper-Barrel Batch Freezing',
    subtitle: 'Drawn at -14°C · Micro-Crystal Texture',
    copy: 'High-speed continuous freezers pump up to 50% air into industrial ice cream. Our vertical copper batch freezers turn slowly at 60 RPM, locking in micro-ice crystals smaller than 25 microns for an unmistakably dense velvet finish.',
    specs: [
      { label: 'Overrun (Air)', value: '18% – 22% Dense Velvet' },
      { label: 'Draw Temperature', value: '-14.0°C' },
      { label: 'Serving Window', value: '48 Hours Max Freshness' },
    ],
  },
];

export default function Craft() {
  const [activeId, setActiveId] = useState<CraftChapter['id']>('dairy');
  const active = CHAPTERS.find((c) => c.id === activeId) ?? CHAPTERS[0];

  return (
    <div className="min-h-screen bg-alabaster pt-28 pb-24">
      <section className="mx-auto max-w-7xl px-6">
        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">
          Our Craft &amp; Provenance
        </span>
        <h1 className="mt-4 max-w-4xl font-serif text-5xl font-medium leading-[1.08] text-espresso sm:text-7xl">
          Patience is our primary ingredient.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-cocoa/80 sm:text-lg">
          Each pint of Velvet &amp; Cone takes three days from raw botanical
          steeping to final copper-barrel extraction. Discover the standards
          behind every scoop.
        </p>

        <div className="mt-16 grid gap-10 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-5">
            {CHAPTERS.map((chap) => {
              const Icon = chap.icon;
              const isSelected = chap.id === activeId;
              return (
                <button
                  type="button"
                  key={chap.id}
                  onClick={() => setActiveId(chap.id)}
                  className={`w-full rounded-3xl border p-6 text-left transition ${
                    isSelected
                      ? 'border-espresso bg-espresso text-alabaster shadow-xl'
                      : 'border-espresso/10 bg-cream/70 text-espresso hover:border-gold'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-mono text-xs ${
                        isSelected ? 'text-gold' : 'text-taupe'
                      }`}
                    >
                      CHAPTER {chap.number}
                    </span>
                    <Icon
                      className={`h-5 w-5 ${
                        isSelected ? 'text-gold' : 'text-taupe'
                      }`}
                    />
                  </div>
                  <h3 className="mt-3 font-serif text-2xl font-medium">
                    {chap.title}
                  </h3>
                  <p
                    className={`mt-1 text-xs ${
                      isSelected ? 'text-alabaster/70' : 'text-taupe'
                    }`}
                  >
                    {chap.subtitle}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col justify-between rounded-3xl border border-espresso/10 bg-cream p-8 sm:p-12 lg:col-span-7">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                Atelier Standard · {active.number}
              </span>
              <h2 className="mt-3 font-serif text-4xl font-medium text-espresso">
                {active.title}
              </h2>
              <p className="mt-6 text-base leading-relaxed text-cocoa/85">
                {active.copy}
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {active.specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="rounded-2xl border border-espresso/10 bg-alabaster p-4"
                  >
                    <span className="block text-[11px] uppercase tracking-[0.14em] text-taupe">
                      {spec.label}
                    </span>
                    <span className="mt-1.5 block font-serif text-xl font-semibold text-espresso">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 flex items-center justify-between border-t border-espresso/10 pt-6">
              <span className="text-xs uppercase tracking-[0.16em] text-taupe">
                Taste the technique
              </span>
              <Link
                to="/flavors"
                className="inline-flex items-center gap-2 rounded-full bg-espresso px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-alabaster transition hover:bg-cocoa"
              >
                Explore Today’s Menu
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
