import { MessageCircle } from 'lucide-react';
import { WHATSAPP_NUMBERS } from '@/lib/types';
import { whatsappPlainLink } from '@/lib/utils';
import { useState } from 'react';

export function WhatsAppFloat() {
  const [showNumbers, setShowNumbers] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {showNumbers && (
        <div className="flex flex-col gap-2 rounded-2xl bg-white p-3 shadow-2xl ring-1 ring-green-200">
          <p className="px-2 pb-1 text-sm font-semibold text-stone-700">Send a message to:</p>
          {WHATSAPP_NUMBERS.map((num, i) => (
            <a
              key={num}
              href={whatsappPlainLink(`Hello! I have a question about your products.`, i)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-2.5 font-medium text-green-700 transition-colors hover:bg-green-100"
            >
              <MessageCircle className="h-4 w-4" />
              {num}
            </a>
          ))}
        </div>
      )}
      <button
        onClick={() => setShowNumbers(!showNumbers)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white shadow-2xl shadow-green-900/40 transition-transform hover:scale-110"
        aria-label="WhatsApp"
      >
        <MessageCircle className="h-7 w-7" />
      </button>
    </div>
  );
}
