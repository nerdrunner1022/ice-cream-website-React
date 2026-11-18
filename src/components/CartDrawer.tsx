import React, { useState } from 'react';
import { X, Plus, Minus, CheckCircle2, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import type { Order } from '../types/store';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQty,
    locations,
    placeOrder,
  } = useStore();

  const [customerName, setCustomerName] = useState<string>('');
  const [selectedLoc, setSelectedLoc] = useState<string>(locations[0].name);
  const [selectedTime, setSelectedTime] = useState<string>(
    locations[0].slots[1]
  );
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const currentLocationObj =
    locations.find((l) => l.name === selectedLoc) ?? locations[0];

  const handleCheckout = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (cart.length === 0) return;
    const order = placeOrder({
      customerName: customerName.trim() || 'Atelier Guest',
      locationName: selectedLoc,
      pickupTime: `Today, ${selectedTime}`,
      items: cart.map(({ flavorId, name, qty, price }) => ({
        flavorId,
        name,
        qty,
        price,
      })),
    });
    setConfirmedOrder(order);
    setCustomerName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-espresso/60 backdrop-blur-sm">
      <div className="flex h-full w-full max-w-md flex-col bg-alabaster shadow-2xl">
        <div className="flex items-center justify-between border-b border-espresso/10 px-6 py-5">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="h-5 w-5 text-gold" />
            <h3 className="font-serif text-2xl font-medium">Pickup Bag</h3>
          </div>
          <button
            type="button"
            onClick={() => {
              setConfirmedOrder(null);
              setIsCartOpen(false);
            }}
            className="rounded-full p-2 text-taupe hover:bg-cream hover:text-espresso"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {confirmedOrder ? (
            <div className="rounded-2xl border border-gold/40 bg-cream p-6 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-700" />
              <h4 className="mt-4 font-serif text-2xl font-semibold">
                Order {confirmedOrder.id} Confirmed
              </h4>
              <p className="mt-2 text-sm text-cocoa/80">
                Queued for hand-packing at{' '}
                <strong>{confirmedOrder.locationName}</strong> for{' '}
                <strong>{confirmedOrder.pickupTime}</strong>.
              </p>
              <p className="mt-4 rounded-xl bg-alabaster p-3 text-xs text-taupe">
                Live sync active: Open <strong>/admin</strong> to track or advance
                this order across the Fulfillment Board.
              </p>
              <button
                type="button"
                onClick={() => {
                  setConfirmedOrder(null);
                  setIsCartOpen(false);
                }}
                className="mt-6 w-full rounded-full bg-espresso py-3 text-xs font-semibold uppercase tracking-[0.16em] text-alabaster"
              >
                Continue Exploring
              </button>
            </div>
          ) : cart.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-serif text-2xl text-taupe">
                Your tasting bag is empty.
              </p>
              <p className="mt-2 text-sm text-taupe/80">
                Select scoops or pints from our seasonal menu to schedule an
                express boutique pickup.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.flavorId}
                    className="flex items-center justify-between rounded-2xl border border-espresso/10 bg-cream/60 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="h-10 w-10 rounded-xl border border-espresso/10"
                        style={{ backgroundColor: item.swatch }}
                      />
                      <div>
                        <h4 className="font-serif text-lg font-medium leading-tight">
                          {item.name}
                        </h4>
                        <span className="text-xs text-taupe">
                          ${item.price.toFixed(2)} each
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateCartQty(item.flavorId, -1)}
                        className="rounded-full border border-espresso/15 p-1 hover:bg-alabaster"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-5 text-center text-sm font-medium">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQty(item.flavorId, 1)}
                        className="rounded-full border border-espresso/15 p-1 hover:bg-alabaster"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleCheckout} className="mt-8 space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-taupe">
                    Guest Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Camille Laurent"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full rounded-xl border border-espresso/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-taupe">
                    Boutique Location
                  </label>
                  <select
                    value={selectedLoc}
                    onChange={(e) => {
                      const loc = locations.find(
                        (l) => l.name === e.target.value
                      );
                      setSelectedLoc(e.target.value);
                      if (loc) setSelectedTime(loc.slots[0]);
                    }}
                    className="w-full rounded-xl border border-espresso/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-gold"
                  >
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.name}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-taupe">
                    Pickup Time Slot
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {currentLocationObj.slots.map((slot) => (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => setSelectedTime(slot)}
                        className={`rounded-xl border py-2 text-xs font-medium transition ${
                          selectedTime === slot
                            ? 'border-espresso bg-espresso text-alabaster'
                            : 'border-espresso/15 bg-white text-espresso hover:border-gold'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-espresso/10 pt-4">
                  <div className="mb-4 flex items-center justify-between text-base">
                    <span className="font-medium text-taupe">Total</span>
                    <span className="font-serif text-2xl font-semibold">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-full bg-espresso py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-alabaster transition hover:bg-cocoa"
                  >
                    Reserve Pickup Order
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
