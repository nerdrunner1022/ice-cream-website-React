import React from 'react';
import { X, MapPin, Sparkles, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import type { Flavor } from '../types/store';

interface FlavorModalProps {
  flavor: Flavor | null;
  onClose: () => void;
}

export default function FlavorModal({ flavor, onClose }: FlavorModalProps) {
  const { addToCart } = useStore();
  if (!flavor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-espresso/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-espresso/10 bg-alabaster shadow-2xl">
        <div
          className="relative flex h-44 items-end p-8"
          style={{ backgroundColor: flavor.swatch }}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 rounded-full bg-espresso/40 p-2 text-alabaster backdrop-blur-md transition hover:bg-espresso/70"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="rounded-xl bg-espresso/65 px-4 py-2 text-alabaster backdrop-blur-md">
            <span className="text-[11px] uppercase tracking-[0.2em] text-gold-light">
              {flavor.category} Batch
            </span>
          </div>
        </div>

        <div className="p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-serif text-3xl font-semibold text-espresso">
                {flavor.name}
              </h2>
              <p className="mt-1 text-sm text-taupe">{flavor.subtitle}</p>
            </div>
            <span className="font-serif text-2xl font-semibold text-espresso">
              ${flavor.price.toFixed(2)}
            </span>
          </div>

          <p className="mt-5 text-sm leading-relaxed text-cocoa/90">
            {flavor.description}
          </p>

          <div className="mt-6">
            <h4 className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-taupe">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              Tasting Profile
            </h4>
            <div className="flex flex-wrap gap-2">
              {flavor.tastingNotes.map((note) => (
                <span
                  key={note}
                  className="rounded-full border border-espresso/15 bg-cream px-3.5 py-1 text-xs font-medium text-espresso"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl bg-cream/80 p-4 text-xs">
            <div>
              <span className="block uppercase tracking-[0.14em] text-taupe">
                Provenance
              </span>
              <span className="mt-1 inline-flex items-center gap-1 font-medium text-espresso">
                <MapPin className="h-3 w-3 text-gold" />
                {flavor.origin}
              </span>
            </div>
            <div>
              <span className="block uppercase tracking-[0.14em] text-taupe">
                Per Single Scoop
              </span>
              <span className="mt-1 block font-medium text-espresso">
                {flavor.calories} kcal ·{' '}
                {flavor.dietary.length > 0
                  ? flavor.dietary.join(', ')
                  : 'Classic Dairy'}
              </span>
            </div>
          </div>

          <div className="mt-7 flex items-center justify-between gap-4">
            <span
              className={`text-xs font-semibold uppercase tracking-[0.16em] ${
                flavor.inStock ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              {flavor.inStock ? '● Churned Fresh Today' : '○ Currently Sold Out'}
            </span>

            <button
              type="button"
              disabled={!flavor.inStock}
              onClick={() => {
                addToCart(flavor);
                onClose();
              }}
              className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] transition ${
                flavor.inStock
                  ? 'bg-espresso text-alabaster hover:bg-cocoa'
                  : 'cursor-not-allowed bg-espresso/20 text-espresso/40'
              }`}
            >
              <ShoppingBag className="h-4 w-4" />
              {flavor.inStock ? 'Add to Pickup Order' : 'Sold Out'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
