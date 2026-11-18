import React from 'react';
import { ArrowRight, Clock, MapPin } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import type { OrderStatus } from '../types/store';

const STATUS_COLUMNS: OrderStatus[] = [
  'Received',
  'Churning',
  'Ready for Pickup',
  'Completed',
];

export default function OrderBoard() {
  const { orders, updateOrderStatus } = useStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-3xl font-medium text-espresso">
          Order Fulfillment Board
        </h2>
        <p className="mt-1 text-sm text-taupe">
          Advance customer pickup orders through kitchen churning and counter
          hand-off.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {STATUS_COLUMNS.map((status) => {
          const columnOrders = orders.filter((o) => o.status === status);
          const nextIndex = STATUS_COLUMNS.indexOf(status) + 1;
          const nextStatus: OrderStatus | undefined = STATUS_COLUMNS[nextIndex];

          return (
            <div
              key={status}
              className="flex flex-col rounded-2xl border border-espresso/10 bg-cream/60 p-4"
            >
              <div className="mb-4 flex items-center justify-between border-b border-espresso/10 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-espresso">
                  {status}
                </h3>
                <span className="flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-espresso text-xs font-semibold text-alabaster">
                  {columnOrders.length}
                </span>
              </div>

              <div className="space-y-3">
                {columnOrders.length === 0 ? (
                  <p className="py-8 text-center text-xs text-taupe">
                    No orders in {status}
                  </p>
                ) : (
                  columnOrders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-xl border border-espresso/10 bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-gold">
                          {order.id}
                        </span>
                        <span className="text-xs text-taupe">
                          {order.createdAt}
                        </span>
                      </div>

                      <h4 className="mt-1 font-serif text-xl font-medium text-espresso">
                        {order.customerName}
                      </h4>

                      <div className="mt-2 space-y-1 text-xs text-taupe">
                        <p className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {order.locationName}
                        </p>
                        <p className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {order.pickupTime}
                        </p>
                      </div>

                      <ul className="mt-3 space-y-1 border-t border-espresso/10 pt-2.5 text-xs text-cocoa">
                        {order.items.map((item, idx) => (
                          <li key={idx} className="flex justify-between">
                            <span>
                              {item.qty}× {item.name}
                            </span>
                            <span>${(item.price * item.qty).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-3 flex items-center justify-between border-t border-espresso/10 pt-3">
                        <span className="font-semibold text-espresso">
                          ${order.total.toFixed(2)}
                        </span>

                        {nextStatus && (
                          <button
                            type="button"
                            onClick={() =>
                              updateOrderStatus(order.id, nextStatus)
                            }
                            className="inline-flex items-center gap-1 rounded-full bg-espresso px-3 py-1.5 text-[11px] font-semibold text-alabaster transition hover:bg-cocoa"
                          >
                            Move to {nextStatus.split(' ')[0]}
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
