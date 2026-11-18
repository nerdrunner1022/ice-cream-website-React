import React, { useState } from 'react';
import { MapPin, Clock, Phone, CheckCircle2, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import type { Order } from '../types/store';

export default function Locations() {
  const { locations, flavors, placeOrder } = useStore();
  const [selectedLocId, setSelectedLocId] = useState<string>(locations[0].id);
  const [selectedSlot, setSelectedSlot] = useState<string>(
    locations[0].slots[0]
  );
  const [guestName, setGuestName] = useState<string>('');
  const [selectedFlavorId, setSelectedFlavorId] = useState<string>(
    flavors.find((f) => f.inStock)?.id ?? flavors[0]?.id ?? ''
  );
  const [scheduledReceipt, setScheduledReceipt] = useState<Order | null>(null);

  const activeLoc =
    locations.find((l) => l.id === selectedLocId) ?? locations[0];
  const inStockFlavors = flavors.filter((f) => f.inStock);

  const handleSchedule = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const chosenFlavor = flavors.find((f) => f.id === selectedFlavorId);
    if (!chosenFlavor) return;

    const order = placeOrder({
      customerName: guestName.trim() || 'Boutique Guest',
      locationName: activeLoc.name,
      pickupTime: `Today, ${selectedSlot}`,
      items: [
        {
          flavorId: chosenFlavor.id,
          name: chosenFlavor.name,
          price: chosenFlavor.price,
          qty: 2,
        },
      ],
    });
    setScheduledReceipt(order);
    setGuestName('');
  };

  return (
    <div className="min-h-screen bg-alabaster pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-6">
        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">
          Visit Our Creameries
        </span>
        <h1 className="mt-3 font-serif text-5xl font-medium text-espresso sm:text-6xl">
          Ateliers &amp; Express Pickup
        </h1>

        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-5">
            {locations.map((loc) => {
              const active = loc.id === activeLoc.id;
              return (
                <button
                  type="button"
                  key={loc.id}
                  onClick={() => {
                    setSelectedLocId(loc.id);
                    setSelectedSlot(loc.slots[0]);
                    setScheduledReceipt(null);
                  }}
                  className={`w-full rounded-3xl border p-6 text-left transition ${
                    active
                      ? 'border-espresso bg-espresso text-alabaster shadow-xl'
                      : 'border-espresso/10 bg-cream/70 text-espresso hover:border-gold'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <h3 className="font-serif text-2xl font-medium">
                      {loc.name}
                    </h3>
                    <MapPin
                      className={`h-5 w-5 ${
                        active ? 'text-gold' : 'text-taupe'
                      }`}
                    />
                  </div>
                  <p
                    className={`mt-2 text-sm ${
                      active ? 'text-alabaster/80' : 'text-cocoa/80'
                    }`}
                  >
                    {loc.address}
                  </p>
                  <div
                    className={`mt-4 flex flex-wrap gap-4 text-xs ${
                      active ? 'text-gold-light' : 'text-taupe'
                    }`}
                  >
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {loc.hours}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5" />
                      {loc.phone}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="rounded-3xl border border-espresso/10 bg-cream p-8 sm:p-10 lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-espresso/10 pb-6">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                  <Sparkles className="h-3.5 w-3.5" />
                  {activeLoc.specialty}
                </span>
                <h2 className="mt-2 font-serif text-3xl font-medium text-espresso">
                  Reserve Tasting Flight at {activeLoc.name}
                </h2>
              </div>
            </div>

            {scheduledReceipt ? (
              <div className="mt-8 rounded-2xl border border-gold/40 bg-alabaster p-8 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-700" />
                <h3 className="mt-4 font-serif text-3xl font-medium">
                  Pickup Scheduled ({scheduledReceipt.id})
                </h3>
                <p className="mt-2 text-sm text-cocoa/80">
                  Reserved for <strong>{scheduledReceipt.customerName}</strong>{' '}
                  at <strong>{scheduledReceipt.pickupTime}</strong>. Your
                  hand-packed order is now visible in the Admin Order Board.
                </p>
                <button
                  type="button"
                  onClick={() => setScheduledReceipt(null)}
                  className="mt-6 rounded-full bg-espresso px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-alabaster"
                >
                  Schedule Another Pickup
                </button>
              </div>
            ) : (
              <form onSubmit={handleSchedule} className="mt-8 space-y-6">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-taupe">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter name for cup sleeve"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full rounded-xl border border-espresso/15 bg-white px-4 py-3 text-sm outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-taupe">
                      Featured Duo Flavor (2 Scoops)
                    </label>
                    <select
                      value={selectedFlavorId}
                      onChange={(e) => setSelectedFlavorId(e.target.value)}
                      className="w-full rounded-xl border border-espresso/15 bg-white px-4 py-3 text-sm outline-none focus:border-gold"
                    >
                      {inStockFlavors.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name} (${f.price.toFixed(2)})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-taupe">
                    Select Today’s Counter Window
                  </label>
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                    {activeLoc.slots.map((slot) => (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`rounded-xl border py-2.5 text-xs font-semibold transition ${
                          selectedSlot === slot
                            ? 'border-espresso bg-espresso text-alabaster'
                            : 'border-espresso/15 bg-white text-espresso hover:border-gold'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full bg-espresso py-4 text-xs font-semibold uppercase tracking-[0.18em] text-alabaster transition hover:bg-cocoa"
                >
                  Confirm Boutique Pickup
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
