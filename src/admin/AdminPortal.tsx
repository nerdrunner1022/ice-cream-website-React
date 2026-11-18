import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  ClipboardList,
  Video,
  ArrowLeft,
  LogOut,
  RotateCcw,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import AdminLogin from './AdminLogin';
import DashboardOverview from './DashboardOverview';
import FlavorManager from './FlavorManager';
import OrderBoard from './OrderBoard';
import MediaManager from './MediaManager';

type AdminTabId = 'overview' | 'flavors' | 'orders' | 'media';

interface AdminTab {
  id: AdminTabId;
  label: string;
  icon: LucideIcon;
}

const TABS: AdminTab[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'flavors', label: 'Flavor Manager', icon: Sparkles },
  { id: 'orders', label: 'Order Fulfillment', icon: ClipboardList },
  { id: 'media', label: 'Hero Media', icon: Video },
];

export default function AdminPortal() {
  const { isAdminAuthenticated, logoutAdmin, resetAllData } = useStore();
  const [activeTab, setActiveTab] = useState<AdminTabId>('overview');

  if (!isAdminAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-alabaster md:flex-row">
      <aside className="flex w-full flex-col justify-between border-b border-espresso/10 bg-espresso p-6 text-alabaster md:w-72 md:border-b-0 md:border-r">
        <div>
          <div className="mb-8 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">
                Operations Suite
              </span>
              <h1 className="font-serif text-2xl font-semibold uppercase tracking-wider">
                Velvet &amp; Cone
              </h1>
            </div>
          </div>

          <nav className="flex gap-2 overflow-x-auto md:flex-col">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] transition ${
                    active
                      ? 'bg-gold text-espresso'
                      : 'text-alabaster/75 hover:bg-cocoa/60 hover:text-alabaster'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-8 space-y-2 border-t border-alabaster/10 pt-5">
          <Link
            to="/"
            className="flex w-full items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-medium text-gold-light transition hover:bg-cocoa/50"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Storefront
          </Link>
          <button
            type="button"
            onClick={resetAllData}
            className="flex w-full items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-medium text-alabaster/60 transition hover:bg-cocoa/50 hover:text-alabaster"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Demo Data
          </button>
          <button
            type="button"
            onClick={logoutAdmin}
            className="flex w-full items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-medium text-rose-300 transition hover:bg-rose-950/40"
          >
            <LogOut className="h-4 w-4" />
            Lock Portal
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 sm:p-10">
        {activeTab === 'overview' && <DashboardOverview />}
        {activeTab === 'flavors' && <FlavorManager />}
        {activeTab === 'orders' && <OrderBoard />}
        {activeTab === 'media' && <MediaManager />}
      </main>
    </div>
  );
}
