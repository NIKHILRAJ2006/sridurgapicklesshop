import { Leaf, Drumstick } from 'lucide-react';
import type { Product } from '@/lib/types';
import { formatINR } from '@/lib/utils';
import { Plus, Minus } from 'lucide-react';
import { ProductReviews } from './ProductReviews';


const LOCAL_IMAGE_BY_NAME: Record<string, string> = {
  // Veg Pickles
  'gongura pickle': '/images/pickles/gongura-pickle.jpg',
  'avakaya mango pickle': '/images/pickles/avakaya-mango-pickle.jpg',
  'tomato pickle': '/images/pickles/tomato-pickle.jpg',
  'amla pickle': '/images/pickles/amla-pickle.jpg',
  'raw tamarind pickle': '/images/pickles/raw-tamarind-pickle.jpg',
  'carrot pickle': '/images/pickles/carrot-pickle.jpg',
  'green chilli pickle': '/images/pickles/green-chilli-pickle.jpg',
  'garlic pickle': '/images/pickles/garlic-pickle.jpg',
  'small cut mango pickle': '/images/pickles/small-cut-mango-pickle.jpg',
  'ginger pickle': '/images/pickles/ginger-pickle.jpg',
  'bitter gourd pickle': '/images/pickles/bitter-gourd-pickle.jpg',
  'mixed veg pickle': '/images/pickles/mixed-veg-pickle.jpg',
  'grated amla pickle': '/images/pickles/grated-amla-pickle.jpg',
  'red chilli pickle': '/images/pickles/red-chilli-pickle.jpg',
  'mango biryani pickle': '/images/pickles/mango-biryani-pickle.jpg',
  'drumsticks pickle': '/images/pickles/drumsticks-pickle.jpg',
  'beetroot pickle': '/images/pickles/beetroot-pickle.jpg',
  'lemon pickle': '/images/pickles/lemon-pickle.jpg',

  // Non-Veg Pickles
  'small prawns pickle': '/images/nonveg-pickles/small-prawns-pickle.jpg',
  'mutton pickle': '/images/nonveg-pickles/mutton-pickle.jpg',
  'sea bass fish pickle': '/images/nonveg-pickles/sea-bass-fish-pickle.jpg',
  'boneless mutton pickle': '/images/nonveg-pickles/boneless-mutton-pickle.jpg',
  'chicken joint biryani pickle': '/images/nonveg-pickles/chicken-joint-biryani-pickle.jpg',
  'crab pickle': '/images/nonveg-pickles/crab-pickle.jpg',
  'large prawns pickle': '/images/nonveg-pickles/large-prawns-pickle.jpg',
  'murrel fish pickle': '/images/nonveg-pickles/murrel-fish-pickle.jpg',
  'chicken pickle': '/images/WhatsApp_Image_2026-09-04_at_1.48.47_PM.jpeg',
  'boneless chicken pickle': '/images/WhatsApp_Image_2026-09-04_at_1.48.47_PM.jpeg',
  'country chicken pickle': '/images/WhatsApp_Image_2026-09-04_at_1.48.47_PM.jpeg',
// Karam Podulu
'kandi podi': '/images/karam-podulu/KANDI-PODI-580x560.jpg',
'idly karam podi': '/images/karam-podulu/idly-karam-podi.jpg',
'toor dal karappodi': '/images/karam-podulu/Toor Dal Karappodi.jpg',

'rice karappodi': '/images/karam-podulu/Rice Karappodi.jpg',

'drumstick leaves karappodi': '/images/karam-podulu/Munagaku-Podi.jpg',

'bitter gourd karappodi': '/images/karam-podulu/Bitter Gourd Karappodi.jpg',

'curry leaves karappodi': '/images/karam-podulu/Curry Leaves Karappodi.jpg',

'coriander karappodi': '/images/karam-podulu/Coriander Karappodi.jpg',

'mint leaves karappodi': '/images/karam-podulu/Mint Leaves Karappodi.jpg',

'groundnut karappodi': '/images/karam-podulu/Groundnut Karappodi.jpg',

'garlic karappodi': '/images/karam-podulu/Garlic Karappodi.jpg',

'roasted dal karappodi': '/images/karam-podulu/Roasted Dal Karappodi.jpg',

'nalleru karappodi': '/images/karam-podulu/Nalleru Karappodi.jpg',

'flax seeds karappodi': '/images/karam-podulu/Flax Seeds Karappodi.jpg',

'sambar podi': '/images/karam-podulu/sambar-podi.jpg',

'kura karam': '/images/karam-podulu/Kura Karam.webp',

  // Snacks
  'dootha pakodi': '/images/snacks/dootha-pakodi.jpg',
  'jantikalu': '/images/snacks/jantikalu.jpg',
  'dry fruit laddu': '/images/snacks/Dry Fruit Laddu.png',
  'palli pakodi': '/images/snacks/Palli Pakodi.png',
  'pure honey': '/images/snacks/Pure Honey.png',
  'palli chikki': '/images/snacks/Palli Chikki.png',
  'ragi laddu': '/images/snacks/ragi-laddu.jpg',
  'nuvvula ariselu': '/images/snacks/nuvvula-ariselu.jpg',
  'challa jantikalu': '/images/snacks/challa-jantikalu.jpg',
  'pure ghee': '/images/snacks/pure-ghee.jpg',
};

interface ProductCardProps {
  product: Product;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
  displayPrice?: number;
}

export function ProductCard({ product, quantity, onAdd, onRemove, displayPrice }: ProductCardProps) {
  const imageKey = product.name.trim().toLowerCase();
  const imageSrc = LOCAL_IMAGE_BY_NAME[imageKey] ?? product.image_url;
  const shownPrice = displayPrice ?? product.price;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-amber-900/5 transition-all hover:shadow-xl hover:ring-amber-400/30">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-amber-50">
        <img
          src={imageSrc}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Veg / Non-veg indicator */}
        <div className="absolute left-3 top-3 flex items-center gap-1 rounded-lg bg-white/95 px-2 py-1 text-xs font-medium shadow-sm backdrop-blur">
          {product.is_vegetarian ? (
            <>
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded-sm border-2 border-green-600">
                <Leaf className="h-2 w-2 text-green-600" />
              </span>
              <span className="text-green-700">Veg</span>
            </>
          ) : (
            <>
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded-sm border-2 border-red-600">
                <Drumstick className="h-2 w-2 text-red-600" />
              </span>
              <span className="text-red-700">Non-Veg</span>
            </>
          )}
        </div>
        {/* Category badge */}
        <div className="absolute right-3 top-3 rounded-lg bg-amber-950/80 px-2.5 py-1 text-xs font-medium text-amber-200 backdrop-blur">
          {product.category}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-serif text-lg font-bold text-stone-800">{product.name}</h3>
        <p className="mt-1 flex-1 text-sm text-stone-500 line-clamp-2">{product.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-amber-900">{formatINR(shownPrice)}</span>
            <span className="ml-1 text-xs text-stone-400">/ {product.weight}</span>
          </div>
          {quantity > 0 ? (
            <div className="flex items-center gap-2 rounded-full bg-amber-100 px-2 py-1">
              <button onClick={onRemove} className="rounded-full bg-amber-600 p-1 text-white transition-colors hover:bg-amber-700" aria-label="Remove one">
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="min-w-[1.5rem] text-center text-sm font-bold text-amber-900">{quantity}</span>
              <button onClick={onAdd} className="rounded-full bg-amber-600 p-1 text-white transition-colors hover:bg-amber-700" aria-label="Add one">
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onAdd}
              className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition-transform hover:scale-105"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          )}
        </div>
        <ProductReviews productId={product.id} />
      </div>
    </div>
  );
}
