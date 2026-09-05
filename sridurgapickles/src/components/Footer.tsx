import { SHOP_NAME, SHOP_LOCATION, SHOP_MAPS_URL, WHATSAPP_NUMBERS, UPI_ID, INSTAGRAM_PAGE } from '@/lib/types';
import { whatsappPlainLink } from '@/lib/utils';
import { MapPin, MessageCircle, CreditCard, Clock, Instagram } from 'lucide-react';

export function Footer() {

  return (
    <footer id="contact" className="scroll-mt-20 bg-gradient-to-b from-stone-900 to-amber-950 text-amber-100">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <img src="/images/logo-laddu.png" alt="Sree Durga logo" className="h-12 w-12 rounded-full object-cover ring-2 ring-amber-300/50" />
              <div className="font-serif text-lg font-bold text-amber-100">{SHOP_NAME}</div>
            </div>
            <p className="mt-4 text-sm text-amber-100/60">
              Bringing the authentic taste of Andhra to your home. Every jar is made with traditional recipes and the freshest ingredients.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-semibold text-amber-200">Get in Touch</h3>
            <div className="space-y-3 text-sm">
              <a
                href={SHOP_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 text-amber-100/70 transition-colors hover:text-amber-300"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                <span className="underline decoration-amber-400/30 underline-offset-2">{SHOP_LOCATION}</span>
              </a>
              <div className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                <span className="text-amber-100/70">Mon - Sat: 9 AM - 8 PM</span>
              </div>
              <div className="flex items-start gap-2">
                <CreditCard className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                <span className="text-amber-100/70">UPI: {UPI_ID}</span>
              </div>
            </div>
          </div>

          {/* WhatsApp */}
          <div>
            <h3 className="mb-4 font-semibold text-amber-200">WhatsApp Us</h3>
            <p className="mb-3 text-sm text-amber-100/60">Click to send a message directly:</p>
            <div className="space-y-2">
              {WHATSAPP_NUMBERS.map((num, i) => (
                <a
                  key={num}
                  href={whatsappPlainLink(`Hello ${SHOP_NAME}! I would like to know more about your products.`, i)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl bg-green-600/20 px-4 py-2.5 text-sm font-medium text-green-300 transition-colors hover:bg-green-600/30"
                >
                  <MessageCircle className="h-4 w-4" />
                  {num}
                </a>
              ))}
            </div>
          </div>

          {/* Instagram */}
          <div>
            <h3 className="mb-4 font-semibold text-amber-200">Follow Us</h3>
            <p className="mb-3 text-sm text-amber-100/60">See our latest reels and updates:</p>
            <a
              href={INSTAGRAM_PAGE}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-600/30 to-purple-600/30 px-4 py-2.5 text-sm font-medium text-pink-200 transition-colors hover:from-pink-600/40 hover:to-purple-600/40"
            >
              <Instagram className="h-4 w-4" />
              @picklemart.bg
            </a>
          </div>
        </div>

        <div className="mt-10 border-t border-amber-800/40 pt-6 text-center text-sm text-amber-100/40">
          &copy; {new Date().getFullYear()} {SHOP_NAME}. All rights reserved. Made with love.
        </div>
      </div>
    </footer>
  );
}
