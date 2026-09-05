import { Heart, Leaf, Drumstick, FlaskConical as Jar } from 'lucide-react';

export function About() {
  return (
    <section id="about" className="scroll-mt-20 bg-amber-50 py-16">
      <div className="mx-auto max-w-5xl px-4">
        <div className="text-center">
          <h2 className="mt-4 font-serif text-3xl font-bold text-amber-900">Our Story</h2>
          <p className="mx-auto mt-4 max-w-2xl text-stone-600">
            Sri Durga Pickles & Snacks began as a small home kitchen with a simple mission: to share the authentic
            flavours of Andhra Pradesh. Every pickle is handcrafted in small batches using time-honoured family recipes,
            sun-dried spices, and the freshest local ingredients. We pack them in our signature jars — the same jars
            that arrive at your doorstep, sealed with care.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 text-center shadow-md">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
              <Leaf className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-800">Veg Pickles</h3>
            <p className="mt-1 text-sm text-stone-500">Mango, gongura, tomato & more — pure vegetarian delights.</p>
          </div>
          <div className="rounded-2xl bg-white p-6 text-center shadow-md">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <Drumstick className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-800">Non-Veg Pickles</h3>
            <p className="mt-1 text-sm text-stone-500">Chicken, mutton, and fish pickles for bold palates.</p>
          </div>
          <div className="rounded-2xl bg-white p-6 text-center shadow-md">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
              <Jar className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-800">In Every Jar</h3>
            <p className="mt-1 text-sm text-stone-500">Sealed fresh in our signature jars, ready for your table.</p>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center gap-2 text-amber-700">
          <Heart className="h-5 w-5 fill-amber-500 text-amber-500" />
          <span className="font-medium">Made fresh in small batches with love and tradition.</span>
        </div>
      </div>
    </section>
  );
}
