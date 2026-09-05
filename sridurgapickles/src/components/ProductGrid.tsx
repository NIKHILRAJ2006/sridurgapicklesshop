import { useMemo } from 'react';
import type { Product, ProductCategory } from '@/lib/types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  category: ProductCategory;
  cart: Record<string, number>;
  onAdd: (product: Product) => void;
  onRemove: (product: Product) => void;
  priceAdjustment?: number;
}

export function ProductGrid({ products, category, cart, onAdd, onRemove, priceAdjustment = 0 }: ProductGridProps) {
  const filtered = useMemo(
    () => products.filter((p) => p.category === category),
    [products, category],
  );

  const sectionId =
    category === 'Veg Pickles' || category === 'Non-Veg Pickles'
      ? 'pickles'
      : category === 'Karam Podulu'
        ? 'podulu'
        : 'snacks';

  const subtitle =
    category === 'Veg Pickles'
      ? 'Traditional vegetarian pickles packed in our signature jars'
      : category === 'Non-Veg Pickles'
        ? 'Bold, meaty pickles for the adventurous palate'
        : category === 'Karam Podulu'
          ? 'Roasted spice powders for rice, idli & dosa'
          : 'Crunchy savouries perfect with evening tea';

  return (
    <section id={sectionId} className="scroll-mt-20">
      <div className="mb-6 text-center">
        <h2 className="font-serif text-3xl font-bold text-amber-900">{category}</h2>
        <p className="mt-1 text-stone-500">{subtitle}</p>
      </div>
      {filtered.length === 0 ? (
        <p className="py-12 text-center text-stone-400">No items in this category yet. Please check back soon!</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              quantity={cart[product.id] || 0}
              onAdd={() => onAdd(product)}
              onRemove={() => onRemove(product)}
              displayPrice={product.price + priceAdjustment}
            />
          ))}
        </div>
      )}
    </section>
  );
}
