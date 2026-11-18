import React, { useState } from 'react';
import { Plus, Trash2, Check, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import type { DietaryTag, FlavorCategory } from '../types/store';

interface NewFlavorFormState {
  name: string;
  subtitle: string;
  description: string;
  tastingNotes: string;
  origin: string;
  price: string;
  category: FlavorCategory;
  dietary: DietaryTag[];
  inStock: boolean;
  featured: boolean;
  swatch: string;
}

const DIETARY_OPTIONS: DietaryTag[] = ['Vegan', 'Nut-Free'];

export default function FlavorManager() {
  const {
    flavors,
    addFlavor,
    toggleFlavorStock,
    updateFlavorPrice,
    deleteFlavor,
  } = useStore();

  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [priceDraft, setPriceDraft] = useState<string>('');

  const [newFlavor, setNewFlavor] = useState<NewFlavorFormState>({
    name: '',
    subtitle: 'Limited Small-Batch Release',
    description: '',
    tastingNotes: 'Caramel, Sea Salt, Cream',
    origin: 'Atelier Test Kitchen',
    price: '8.00',
    category: 'Seasonal',
    dietary: [],
    inStock: true,
    featured: true,
    swatch: '#9B6B43',
  });

  const handleAddSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!newFlavor.name.trim()) return;
    addFlavor({
      name: newFlavor.name.trim(),
      subtitle: newFlavor.subtitle,
      description: newFlavor.description.trim(),
      origin: newFlavor.origin,
      price: parseFloat(newFlavor.price) || 8.0,
      category: newFlavor.category,
      dietary: newFlavor.dietary,
      inStock: newFlavor.inStock,
      featured: newFlavor.featured,
      swatch: newFlavor.swatch,
      tastingNotes: newFlavor.tastingNotes
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    });
    setNewFlavor((prev) => ({
      ...prev,
      name: '',
      description: '',
    }));
    setShowAddForm(false);
  };

  const toggleDietaryOption = (tag: DietaryTag): void => {
    setNewFlavor((prev) => ({
      ...prev,
      dietary: prev.dietary.includes(tag)
        ? prev.dietary.filter((t) => t !== tag)
        : [...prev.dietary, tag],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl font-medium text-espresso">
            Flavor &amp; Batch Manager
          </h2>
          <p className="mt-1 text-sm text-taupe">
            Any edits below immediately update the customer-facing{' '}
            <code className="rounded bg-cream px-1.5 py-0.5 text-xs">
              /flavors
            </code>{' '}
            menu.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm((prev) => !prev)}
          className="inline-flex items-center gap-2 rounded-full bg-espresso px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-alabaster transition hover:bg-cocoa"
        >
          <Plus className="h-4 w-4" />
          Add Seasonal Flavor
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleAddSubmit}
          className="rounded-2xl border border-gold/40 bg-white p-6 shadow-sm"
        >
          <h3 className="font-serif text-2xl font-medium">
            Launch New Seasonal Churn
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <input
              required
              type="text"
              placeholder="Flavor Name (e.g., Lavender Honey)"
              value={newFlavor.name}
              onChange={(e) =>
                setNewFlavor({ ...newFlavor, name: e.target.value })
              }
              className="rounded-xl border border-espresso/15 px-4 py-2.5 text-sm outline-none focus:border-gold"
            />
            <input
              type="text"
              placeholder="Origin (e.g., Provence, France)"
              value={newFlavor.origin}
              onChange={(e) =>
                setNewFlavor({ ...newFlavor, origin: e.target.value })
              }
              className="rounded-xl border border-espresso/15 px-4 py-2.5 text-sm outline-none focus:border-gold"
            />
            <input
              required
              type="number"
              step="0.25"
              placeholder="Price ($)"
              value={newFlavor.price}
              onChange={(e) =>
                setNewFlavor({ ...newFlavor, price: e.target.value })
              }
              className="rounded-xl border border-espresso/15 px-4 py-2.5 text-sm outline-none focus:border-gold"
            />
            <input
              type="text"
              placeholder="Tasting notes (comma separated)"
              value={newFlavor.tastingNotes}
              onChange={(e) =>
                setNewFlavor({ ...newFlavor, tastingNotes: e.target.value })
              }
              className="rounded-xl border border-espresso/15 px-4 py-2.5 text-sm outline-none focus:border-gold sm:col-span-2"
            />
            <div className="flex items-center gap-3">
              <label className="text-xs font-medium text-taupe">Swatch:</label>
              <input
                type="color"
                value={newFlavor.swatch}
                onChange={(e) =>
                  setNewFlavor({ ...newFlavor, swatch: e.target.value })
                }
                className="h-9 w-16 cursor-pointer rounded border border-espresso/15"
              />
            </div>
          </div>

          <textarea
            required
            rows={2}
            placeholder="Editorial flavor description..."
            value={newFlavor.description}
            onChange={(e) =>
              setNewFlavor({ ...newFlavor, description: e.target.value })
            }
            className="mt-4 w-full rounded-xl border border-espresso/15 px-4 py-2.5 text-sm outline-none focus:border-gold"
          />

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {DIETARY_OPTIONS.map((tag) => (
                <label
                  key={tag}
                  className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium"
                >
                  <input
                    type="checkbox"
                    checked={newFlavor.dietary.includes(tag)}
                    onChange={() => toggleDietaryOption(tag)}
                    className="accent-espresso"
                  />
                  {tag}
                </label>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="rounded-full border border-espresso/20 px-4 py-2 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-full bg-gold px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-espresso"
              >
                Publish to Menu
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-2xl border border-espresso/10 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-espresso/10 bg-cream/60 text-xs uppercase tracking-[0.14em] text-taupe">
              <tr>
                <th className="px-6 py-4">Flavor</th>
                <th className="px-6 py-4">Category &amp; Tags</th>
                <th className="px-6 py-4">Scoop Price</th>
                <th className="px-6 py-4">Availability</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-espresso/10">
              {flavors.map((flavor) => (
                <tr key={flavor.id} className="hover:bg-cream/25">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className="h-9 w-9 shrink-0 rounded-xl border border-espresso/15"
                        style={{ backgroundColor: flavor.swatch }}
                      />
                      <div>
                        <p className="font-serif text-lg font-medium text-espresso">
                          {flavor.name}
                        </p>
                        <p className="text-xs text-taupe">{flavor.origin}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-md bg-cream px-2.5 py-1 text-xs font-medium text-espresso">
                      {flavor.category}
                    </span>
                    {flavor.dietary.map((d) => (
                      <span
                        key={d}
                        className="ml-1.5 rounded-md bg-gold/20 px-2 py-1 text-xs font-medium text-espresso"
                      >
                        {d}
                      </span>
                    ))}
                  </td>

                  <td className="px-6 py-4">
                    {editingId === flavor.id ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          step="0.25"
                          value={priceDraft}
                          onChange={(e) => setPriceDraft(e.target.value)}
                          className="w-20 rounded-lg border border-gold px-2 py-1 text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            updateFlavorPrice(flavor.id, priceDraft);
                            setEditingId(null);
                          }}
                          className="rounded p-1 text-emerald-700 hover:bg-emerald-50"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="rounded p-1 text-rose-700 hover:bg-rose-50"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(flavor.id);
                          setPriceDraft(flavor.price.toFixed(2));
                        }}
                        title="Click to edit price"
                        className="font-semibold text-espresso underline decoration-gold/60 decoration-dashed underline-offset-4 hover:text-gold"
                      >
                        ${flavor.price.toFixed(2)}
                      </button>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => toggleFlavorStock(flavor.id)}
                      className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                        flavor.inStock
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          flavor.inStock ? 'bg-emerald-600' : 'bg-rose-600'
                        }`}
                      />
                      {flavor.inStock ? 'In Stock' : 'Sold Out'}
                    </button>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => deleteFlavor(flavor.id)}
                      className="rounded-lg p-2 text-taupe transition hover:bg-rose-50 hover:text-rose-700"
                      title="Remove flavor"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
