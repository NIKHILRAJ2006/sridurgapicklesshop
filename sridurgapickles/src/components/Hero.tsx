import { SHOP_MAPS_URL } from '@/lib/types';
import { Leaf, Flame, MapPin } from 'lucide-react';

const JAR_IMAGES = [
  { src: '/images/pickles/lemon-pickle.jpg', alt: 'Lemon Pickle' },
  { src: '/images/pickles/avakaya-mango-pickle.jpg', alt: 'Mango Pickle' },
  { src: '/images/pickles/garlic-pickle.jpg', alt: 'Garlic Pickle' },
];

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-amber-950 via-red-950 to-stone-900 pt-16">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `radial-gradient(circle at 20% 50%, #fbbf24 1px, transparent 1px), radial-gradient(circle at 80% 30%, #f97316 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div className="text-center md:text-left">
            <h1 className="font-serif text-4xl font-bold leading-tight text-amber-50 md:text-6xl">
              Taste of <span className="text-amber-400">Home</span>,<br />
              in Every Jar
            </h1>
            <p className="mt-4 text-lg text-amber-100/70 md:text-xl">
              Handcrafted pickles, karam podulu, and snacks made with love and authentic family recipes from the heart of Andhra.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4 md:justify-start">
              <a
                href="#pickles"
                className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-3 font-semibold text-white shadow-lg shadow-amber-900/50 transition-transform hover:scale-105"
              >
                Shop Pickles
              </a>
              <a
                href="#snacks"
                className="rounded-full border border-amber-400/40 bg-amber-500/10 px-8 py-3 font-semibold text-amber-100 backdrop-blur transition-colors hover:bg-amber-500/20"
              >
                Explore Snacks
              </a>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-amber-100/60 md:justify-start">
              <span className="flex items-center gap-2">
                <Leaf className="h-4 w-4 text-green-400" /> Veg &amp; Non-Veg
              </span>
              <span className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-orange-400" /> Fresh &amp; Spicy
              </span>
              <a
                href={SHOP_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 transition-colors hover:text-amber-300"
              >
                <MapPin className="h-4 w-4 text-amber-400" /> Find Us on Map
              </a>
            </div>
          </div>

          <div className="grid grid-cols-3 items-end gap-3">
            {JAR_IMAGES.map((jar, index) => (
              <div
                key={jar.src}
                className={`overflow-hidden rounded-2xl border border-amber-300/30 bg-black/20 shadow-2xl ${index === 1 ? 'mb-8' : ''}`}
              >
                <img
                  src={jar.src}
                  alt={jar.alt}
                  className="h-64 w-full object-cover transition-transform duration-500 hover:scale-105 md:h-80"
                />
                <div className="bg-stone-950/70 px-3 py-2 text-center text-sm font-medium text-amber-100">
                  {jar.alt}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <svg className="relative block w-full" viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ height: '60px' }}>
        <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#fef3c7" />
      </svg>
    </section>
  );
}
