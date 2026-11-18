import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function AdminLogin() {
  const { loginAdmin } = useStore();
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const ok = loginAdmin(pin.trim());
    if (!ok) {
      setError('Invalid Atelier PIN. Use 2026 or click Demo Access below.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-espresso px-6 text-alabaster">
      <div className="w-full max-w-md rounded-3xl border border-alabaster/15 bg-cocoa/35 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-alabaster/60 hover:text-gold-light"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Storefront
          </Link>
          <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-gold-light">
            Staff Only
          </span>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/20 text-gold">
          <Lock className="h-6 w-6" />
        </div>

        <h1 className="mt-5 font-serif text-3xl font-medium">
          Velvet &amp; Cone Admin
        </h1>
        <p className="mt-2 text-sm text-alabaster/65">
          Authenticate to manage seasonal batches, counter availability, live
          orders, and hero media.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-[0.16em] text-alabaster/60">
              Atelier Access PIN
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => {
                setError('');
                setPin(e.target.value);
              }}
              placeholder="Enter PIN (2026)"
              className="w-full rounded-xl border border-alabaster/20 bg-espresso/70 px-4 py-3 text-center font-mono text-lg tracking-[0.3em] text-alabaster outline-none focus:border-gold"
            />
          </div>

          {error && <p className="text-xs text-rose-300">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-full bg-gold py-3 text-xs font-semibold uppercase tracking-[0.18em] text-espresso transition hover:bg-gold-light"
          >
            Unlock Operations Portal
          </button>
        </form>

        <div className="mt-6 border-t border-alabaster/10 pt-5 text-center">
          <button
            type="button"
            onClick={() => loginAdmin('DEMO')}
            className="inline-flex items-center gap-2 text-xs font-medium text-gold-light underline underline-offset-4 hover:text-gold"
          >
            <ShieldCheck className="h-4 w-4" />
            Quick Demo Bypass (PIN: 2026)
          </button>
        </div>
      </div>
    </div>
  );
}
