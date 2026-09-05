import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/useAuth';
import type { Product, CartItem } from '@/lib/types';
import { CATEGORIES } from '@/lib/types';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { ProductGrid } from '@/components/ProductGrid';
import { About } from '@/components/About';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { WhatsAppFloat } from '@/components/WhatsAppFloat';
import { AdminPanel } from '@/components/AdminPanel';
import { AuthModal } from '@/components/AuthModal';
import { LocationPricing } from '@/components/LocationPricing';
import { PickleQuote } from '@/components/PickleQuote';
import type { LocationPricingResult } from '@/lib/locationPricing';

function App() {
  const { session, profile, loading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [locationPricing, setLocationPricing] = useState<LocationPricingResult | null>(null);

  const isAdmin = profile?.role === 'admin';

  const loadProducts = useCallback(async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_available', true)
      .order('created_at', { ascending: true });
    if (!error && data) {
      setProducts((data as Product[]) || []);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleAdd = useCallback((product: Product) => {
    setCart((prev) => ({ ...prev, [product.id]: (prev[product.id] || 0) + 1 }));
  }, []);

  const handleRemove = useCallback((product: Product) => {
    setCart((prev) => {
      const next = { ...prev };
      const current = next[product.id] || 0;
      if (current <= 1) {
        delete next[product.id];
      } else {
        next[product.id] = current - 1;
      }
      return next;
    });
  }, []);

  const handleRemoveFromCart = useCallback((id: string) => {
    setCart((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const handleClearCart = useCallback(() => {
    setCart({});
  }, []);

  const cartItems: CartItem[] = products
    .filter((p) => cart[p.id] > 0)
    .map((p) => ({ ...p, quantity: cart[p.id] }));

  const cartCount = Object.values(cart).reduce((sum, q) => sum + q, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price + (locationPricing?.priceAdjustment ?? 0)) * item.quantity, 0);

  function handleAdminClick() {
    if (loading) return;
    if (session && isAdmin) {
      setAdminOpen(true);
    } else {
      setAuthOpen(true);
    }
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <Header
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
        onAdminClick={handleAdminClick}
        isAdmin={isAdmin}
        onSignInClick={() => setAuthOpen(true)}
      />

      <main>
        <Hero />

        <div className="mx-auto max-w-7xl px-4 pt-8">
          <LocationPricing onPricingChange={setLocationPricing} />
        </div>

        <div className="mx-auto max-w-7xl space-y-16 px-4 py-16">
          {CATEGORIES.map((category) => (
            <ProductGrid
              key={category}
              products={products}
              category={category}
              cart={cart}
              onAdd={handleAdd}
              onRemove={handleRemove}
              priceAdjustment={locationPricing?.priceAdjustment ?? 0}
            />
          ))}
        </div>

        <About />
        <PickleQuote />
      </main>

      <Footer />

      <WhatsAppFloat />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        total={cartTotal}
        onRemove={handleRemoveFromCart}
        onClear={handleClearCart}
        priceAdjustment={locationPricing?.priceAdjustment ?? 0}
        deliveryCharge={locationPricing?.deliveryCharge ?? 0}
        locationLabel={locationPricing?.label}
      />

      <AdminPanel open={adminOpen} onClose={() => setAdminOpen(false)} onProductsChanged={loadProducts} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}

export default App;
