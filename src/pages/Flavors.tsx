import React, { useState, useMemo } from 'react';
import { Search, ShoppingBag, Eye } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import FlavorModal from '../components/FlavorModal';
import type { Flavor, DietaryTag } from '../types/store';

type FlavorFilter = 'All' | 'Seasonal' | DietaryTag;
const FILTERS: FlavorFilter[] = ['All', 'Seasonal', 'Vegan', 'Nut-Free'];

export default function Flavors() {
  const { flavors, addToCart } = useStore();
  const [selectedFilter, setSelectedFilter] = useState<FlavorFilter>('All');
  const [query, setQuery] = useState<string>('');
  const [modalFlavor, setModalFlavor] = useState<Flavor | null>(null);

  const filteredFlavors = useMemo<Flavor[]>(() => {
    return flavors.filter((flavor) => {
      const matchesFilter =
        selectedFilter === 'All' ||
        flavor.category === selectedFilter ||
        (selectedFilter !== 'Seasonal' &&
          flavor.dietary.includes(selectedFilter));

      const lower = query.toLowerCase();
      const matchesQuery =
        flavor.name.toLowerCase().includes(lower) ||
        flavor.description.toLowerCase().includes(lower) ||
        flavor.tastingNotes.some((t) => t.toLowerCase().includes(lower));

      return matchesFilter && matchesQuery;
    });
  }, [flavors, selectedFilter, query]);

  return (
    <div className="min-h-screen bg-alabaster pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">
              Counter Archive &amp; Tasting Menu
            </span>
            <h1 className="mt-3 font-serif text-5xl font-medium text-espresso sm:text-6xl">
              Seasonal Flavors
            </h1>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-taupe" />
            <input
              type="text"
              placeholder="Search notes, cacao, matcha..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-full border border-espresso/15 bg-white py-2.5 pl-11 pr-4 text-sm outline-none focus:border-gold"
            />
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-2.5">
          {FILTERS.map((filter) => (
            <button
              type="button"
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition ${
                selectedFilter === filter
                  ? 'border-espresso bg-espresso text-alabaster'
                  : 'border-espresso/15 bg-cream/60 text-espresso hover:border-gold'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {filteredFlavors.length === 0 ? (
          <div className="mt-16 rounded-3xl border border-espresso/10 bg-cream/50 p-12 text-center">
            <p className="font-serif text-2xl text-taupe">
              No flavors match your current selection.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredFlavors.map((flavor) => (
              <div
                key={flavor.id}
                className="flex flex-col justify-between rounded-3xl border border-espresso/10 bg-cream/60 p-6 transition hover:border-gold/60 hover:shadow-lg"
              >
                <div>
                  <div
                    onClick={() => setModalFlavor(flavor)}
                    className="group relative mb-5 flex h-48 cursor-pointer items-end justify-between overflow-hidden rounded-2xl p-4"
                    style={{ backgroundColor: flavor.swatch }}
                  >
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] backdrop-blur-md ${
                        flavor.inStock
                          ? 'bg-espresso/70 text-alabaster'
                          : 'bg-rose-950/85 text-rose-100'
                      }`}
                    >
                      {flavor.inStock ? 'Available' : 'Sold Out'}
                    </span>

                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-full bg-alabaster/90 px-3 py-1.5 text-[11px] font-medium text-espresso opacity-0 transition group-hover:opacity-100"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Tasting Notes
                    </button>
                  </div>

                  <div className="mb-2 flex flex-wrap gap-1.5">
                    <span className="rounded-md bg-espresso/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-taupe">
                      {flavor.category}
                    </span>
                    {flavor.dietary.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-gold/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-espresso"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <h3
                      onClick={() => setModalFlavor(flavor)}
                      className="cursor-pointer font-serif text-2xl font-semibold text-espresso hover:text-gold"
                    >
                      {flavor.name}
                    </h3>
                    <span className="font-serif text-xl font-semibold text-espresso">
                      ${flavor.price.toFixed(2)}
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-relaxed text-cocoa/75">
                    {flavor.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-2 border-t border-espresso/10 pt-4">
                  <button
                    type="button"
                    onClick={() => setModalFlavor(flavor)}
                    className="flex-1 rounded-full border border-espresso/20 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-espresso transition hover:border-espresso"
                  >
                    Notes
                  </button>
                  <button
                    type="button"
                    disabled={!flavor.inStock}
                    onClick={() => addToCart(flavor)}
                    className={`inline-flex flex-[1.5] items-center justify-center gap-1.5 rounded-full py-2.5 text-xs font-semibold uppercase tracking-[0.14em] transition ${
                      flavor.inStock
                        ? 'bg-espresso text-alabaster hover:bg-cocoa'
                        : 'cursor-not-allowed bg-espresso/15 text-espresso/40'
                    }`}
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    {flavor.inStock ? 'Add Scoop' : 'Sold Out'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <FlavorModal
        flavor={modalFlavor}
        onClose={() => setModalFlavor(null)}
      />
    </div>
  );
}
