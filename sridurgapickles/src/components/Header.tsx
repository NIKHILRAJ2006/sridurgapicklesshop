import { useState } from 'react';
import { Menu, X, ShoppingBag, ShieldCheck } from 'lucide-react';
import { SHOP_NAME } from '@/lib/types';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  onAdminClick: () => void;
  isAdmin: boolean;
  onSignInClick?: () => void;
}

export function Header({ cartCount, onCartClick, onAdminClick, isAdmin, onSignInClick }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = (
    <>
      <a href="#home" className="text-amber-50/90 hover:text-amber-300 transition-colors" onClick={() => setMobileOpen(false)}>Home</a>
      <a href="#pickles" className="text-amber-50/90 hover:text-amber-300 transition-colors" onClick={() => setMobileOpen(false)}>Pickles</a>
      <a href="#podulu" className="text-amber-50/90 hover:text-amber-300 transition-colors" onClick={() => setMobileOpen(false)}>Karam Podulu</a>
      <a href="#snacks" className="text-amber-50/90 hover:text-amber-300 transition-colors" onClick={() => setMobileOpen(false)}>Snacks</a>
      <a href="#about" className="text-amber-50/90 hover:text-amber-300 transition-colors" onClick={() => setMobileOpen(false)}>About</a>
      <a href="#contact" className="text-amber-50/90 hover:text-amber-300 transition-colors" onClick={() => setMobileOpen(false)}>Contact</a>
    </>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-950 via-red-950 to-amber-950 shadow-lg shadow-black/30">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          <a href="#home" className="flex items-center gap-2 font-serif text-lg font-bold text-amber-100">
            <img src="/images/logo-laddu.png" alt="Sree Durga logo" className="h-10 w-10 rounded-full object-cover ring-2 ring-amber-300/50" />
            <span>{SHOP_NAME}</span>
          </a>

          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            {navLinks}
          </nav>

          <div className="flex items-center gap-3">
            {!isAdmin && onSignInClick && (
              <button onClick={onSignInClick} className="hidden rounded-full bg-amber-500/20 px-3 py-1.5 text-sm font-medium text-amber-200 hover:bg-amber-500/30 sm:block">Sign In</button>
            )}
            {isAdmin && (
              <button
                onClick={onAdminClick}
                className="hidden items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1.5 text-sm font-medium text-amber-200 hover:bg-amber-500/30 transition-colors sm:flex"
              >
                <ShieldCheck className="h-4 w-4" />
                Admin
              </button>
            )}
            <button
              onClick={onCartClick}
              className="relative rounded-full bg-amber-500/20 p-2.5 text-amber-200 hover:bg-amber-500/30 transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              className="text-amber-100 md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <nav className="flex flex-col gap-4 border-t border-amber-800/40 px-4 py-4 text-sm md:hidden">
          {navLinks}
          {!isAdmin && onSignInClick && (
            <button onClick={() => { onSignInClick(); setMobileOpen(false); }} className="flex items-center gap-1.5 text-amber-200">
              Sign In
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() => { onAdminClick(); setMobileOpen(false); }}
              className="flex items-center gap-1.5 text-amber-200"
            >
              <ShieldCheck className="h-4 w-4" /> Admin Panel
            </button>
          )}
        </nav>
      )}
    </header>
  );
}
