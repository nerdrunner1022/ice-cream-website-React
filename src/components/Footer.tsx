import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Footer() {
  const { pathname } = useLocation();
  if (pathname.startsWith('/admin')) return null;

  return (
    <footer className="border-t border-espresso/10 bg-espresso text-alabaster">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <h3 className="font-serif text-3xl uppercase tracking-[0.1em]">
              Velvet <span className="text-gold">&amp;</span> Cone
            </h3>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-alabaster/70">
              Small-batch artisanal gelato and custard churned daily using
              single-origin cacao, organic pasture dairy, and hand-rolled spelt
              waffle cones.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-alabaster/75">
              <li>
                <Link to="/craft" className="hover:text-gold">
                  Our Craft &amp; Sourcing
                </Link>
              </li>
              <li>
                <Link to="/flavors" className="hover:text-gold">
                  Seasonal Flavor Menu
                </Link>
              </li>
              <li>
                <Link to="/locations" className="hover:text-gold">
                  Boutiques &amp; Pickup
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Operations
            </h4>
            <ul className="space-y-2.5 text-sm text-alabaster/75">
              <li>SoHo · Venice · Boston</li>
              <li>Daily Churn: 8:00 AM</li>
              <li>
                <Link
                  to="/admin"
                  className="text-gold-light underline underline-offset-4 hover:text-gold"
                >
                  Staff &amp; Admin Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-alabaster/10 pt-8 text-xs text-alabaster/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Velvet &amp; Cone Creamery Atelier.</p>
          <p>
            Crafted with single-origin ingredients &amp; zero artificial
            stabilizers.
          </p>
        </div>
      </div>
    </footer>
  );
}
