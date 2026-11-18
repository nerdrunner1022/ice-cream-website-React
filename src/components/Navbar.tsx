import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, Lock } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface NavLinkItem {
  to: string;
  label: string;
}

const NAV_LINKS: NavLinkItem[] = [
  { to: '/', label: 'Home' },
  { to: '/craft', label: 'Our Craft' },
  { to: '/flavors', label: 'Flavors' },
  { to: '/locations', label: 'Visit & Pickup' },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const { cart, setIsCartOpen } = useStore();
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  const isHomeTop = pathname === '/' && !scrolled;
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  useEffect(() => {
    const onScroll = (): void => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (pathname.startsWith('/admin')) return null;

  return (
    <header
      className={`fixed top-0 z-40 w-full transition-all duration-300 ${
        isHomeTop
          ? 'bg-transparent text-alabaster'
          : 'border-b border-espresso/10 bg-alabaster/90 text-espresso backdrop-blur-lg'
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link
          to="/"
          className="font-serif text-2xl font-semibold uppercase tracking-[0.12em]"
        >
          Velvet <span className="text-gold">&amp;</span> Cone
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`text-xs font-medium uppercase tracking-[0.18em] transition hover:text-gold ${
                  active ? 'text-gold underline underline-offset-8' : ''
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className={`relative inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] transition ${
              isHomeTop
                ? 'border-alabaster/25 hover:border-gold hover:text-gold-light'
                : 'border-espresso/20 hover:border-espresso'
            }`}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Order</span>
            {totalItems > 0 && (
              <span className="flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-espresso">
                {totalItems}
              </span>
            )}
          </button>

          <Link
            to="/admin"
            title="Admin Portal"
            className={`hidden items-center gap-1.5 rounded-full px-3 py-2 text-[11px] uppercase tracking-[0.15em] transition sm:inline-flex ${
              isHomeTop
                ? 'text-alabaster/70 hover:text-gold-light'
                : 'text-taupe hover:text-espresso'
            }`}
          >
            <Lock className="h-3 w-3" />
            Atelier Admin
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="rounded-lg p-2 md:hidden"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-espresso/10 bg-alabaster px-6 py-6 text-espresso md:hidden">
          <div className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="font-serif text-2xl font-medium"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/admin"
              className="mt-2 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-taupe"
            >
              <Lock className="h-3.5 w-3.5" />
              Admin Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
