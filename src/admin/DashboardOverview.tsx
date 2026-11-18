import React from 'react';
import {
  ShoppingBag,
  Sparkles,
  AlertTriangle,
  DollarSign,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface MetricCard {
  label: string;
  value: string | number;
  sub: string;
  icon: LucideIcon;
  tone: string;
}

export default function DashboardOverview() {
  const { flavors, orders } = useStore();

  const activeFlavorsCount = flavors.filter((f) => f.inStock).length;
  const soldOutCount = flavors.length - activeFlavorsCount;
  const dailyRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status !== 'Completed').length;

  const cards: MetricCard[] = [
    {
      label: 'Total Daily Orders',
      value: orders.length,
      sub: `${pendingOrders} active in fulfillment`,
      icon: ShoppingBag,
      tone: 'text-espresso',
    },
    {
      label: 'Active Flavors',
      value: `${activeFlavorsCount} / ${flavors.length}`,
      sub: 'Live on storefront menu',
      icon: Sparkles,
      tone: 'text-emerald-700',
    },
    {
      label: 'Inventory Alerts',
      value: soldOutCount,
      sub: soldOutCount > 0 ? 'Batches marked Sold Out' : 'All batches stocked',
      icon: AlertTriangle,
      tone: soldOutCount > 0 ? 'text-amber-700' : 'text-emerald-700',
    },
    {
      label: 'Daily Revenue',
      value: `$${dailyRevenue.toFixed(2)}`,
      sub: 'Across 3 boutique ateliers',
      icon: DollarSign,
      tone: 'text-espresso',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-3xl font-medium text-espresso">
          Operations Overview
        </h2>
        <p className="mt-1 text-sm text-taupe">
          Real-time snapshot synchronized across customer storefront &amp;
          boutique counters.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-2xl border border-espresso/10 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-taupe">
                  {card.label}
                </span>
                <Icon className="h-5 w-5 text-gold" />
              </div>
              <p className={`mt-4 font-serif text-4xl font-semibold ${card.tone}`}>
                {card.value}
              </p>
              <p className="mt-2 text-xs text-taupe">{card.sub}</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-espresso/10 bg-white p-6 shadow-sm">
        <h3 className="font-serif text-2xl font-medium text-espresso">
          Latest Incoming Orders
        </h3>
        <div className="mt-4 divide-y divide-espresso/10">
          {orders.slice(0, 4).map((order) => (
            <div
              key={order.id}
              className="flex flex-wrap items-center justify-between gap-4 py-3.5 text-sm"
            >
              <div>
                <span className="font-mono font-semibold text-espresso">
                  {order.id}
                </span>{' '}
                · <span className="font-medium">{order.customerName}</span>
                <span className="block text-xs text-taupe">
                  {order.locationName} · {order.pickupTime}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="rounded-full bg-cream px-3 py-1 text-xs font-semibold text-espresso">
                  {order.status}
                </span>
                <span className="font-semibold">${order.total.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
