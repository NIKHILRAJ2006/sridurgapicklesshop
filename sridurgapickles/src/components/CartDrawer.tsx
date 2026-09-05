import { X, Trash2, MessageCircle, Smartphone, ShoppingBag } from 'lucide-react';
import type { CartItem } from '@/lib/types';
import { WHATSAPP_NUMBERS, UPI_ID, SHOP_NAME } from '@/lib/types';
import { formatINR, whatsappOrderLink, upiPaymentLink } from '@/lib/utils';
import { useState } from 'react';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  onRemove: (id: string) => void;
  onClear: () => void;
  priceAdjustment?: number;
  deliveryCharge?: number;
  locationLabel?: string;
}

export function CartDrawer({ open, onClose, items, total, onRemove, onClear, priceAdjustment = 0, deliveryCharge = 0, locationLabel = "" }: CartDrawerProps) {
  const [selectedNumber, setSelectedNumber] = useState(0);
  const [paymentStep, setPaymentStep] = useState<'cart' | 'payment'>('cart');
  const [paymentMessage, setPaymentMessage] = useState('');
  const [pincode] = useState('');

  if (!open) return null;

  const grandTotal = total + deliveryCharge;

  const handleWhatsAppOrder = () => {
    window.open(whatsappOrderLink(items, grandTotal, selectedNumber, deliveryCharge, pincode), '_blank');
  };

  const handleCopyUpi = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setPaymentMessage(`UPI ID copied. Pay ${formatINR(grandTotal)} to ${UPI_ID} in your UPI app.`);
    } catch {
      setPaymentMessage(`Use UPI ID ${UPI_ID} to pay ${formatINR(grandTotal)} from your phone.`);
    }
  };

  const handleUpiPay = async () => {
    await handleCopyUpi();
    const note = `Order from ${SHOP_NAME}`;
    window.location.href = upiPaymentLink(grandTotal, note);
  };

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-amber-50 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-200 bg-gradient-to-r from-amber-950 to-red-950 px-5 py-4">
          <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-amber-100">
            <ShoppingBag className="h-5 w-5" />
            {paymentStep === 'cart' ? 'Your Cart' : 'Payment'}
          </h2>
          <button onClick={() => { onClose(); setPaymentStep('cart'); }} className="text-amber-100 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>

        {paymentStep === 'cart' ? (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center text-stone-400">
                  <p className="text-lg font-medium">Your cart is empty</p>
                  <p className="mt-1 text-sm">Add some delicious pickles and snacks!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm ring-1 ring-amber-200/50">
                      <img src={item.image_url} alt={item.name} className="h-16 w-16 rounded-lg object-cover" />
                      <div className="flex-1">
                        <h4 className="font-medium text-stone-800">{item.name}</h4>
                        <p className="text-xs text-stone-400">{item.weight} x {item.quantity}</p>
                        <p className="text-sm font-bold text-amber-900">{formatINR((item.price + priceAdjustment) * item.quantity)}</p>
                      </div>
                      <button onClick={() => onRemove(item.id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50" aria-label="Remove item">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-amber-200 bg-white p-4">
                <div className="mb-3 flex items-center justify-between rounded-lg bg-amber-50 px-4 py-3">
                  <span className="text-lg font-semibold text-stone-700">Total</span>
                  <span className="text-2xl font-bold text-amber-900">{formatINR(total + priceAdjustment * items.reduce((sum, item) => sum + item.quantity, 0))}</span>
                </div>
                {locationLabel && <p className="mb-2 text-xs text-stone-500">Pricing for {locationLabel} · Delivery {deliveryCharge === 0 ? 'free' : formatINR(deliveryCharge)}</p>}
                <button
                  onClick={() => setPaymentStep('payment')}
                  className="w-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 py-3 font-semibold text-white shadow-lg transition-transform hover:scale-[1.02]"
                >
                  Proceed to Payment
                </button>
                <button onClick={onClear} className="mt-2 w-full text-center text-sm text-stone-400 hover:text-red-500">
                  Clear cart
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 overflow-y-auto p-5">
            {/* Order Summary - highlighted */}
            <div className="mb-5 rounded-xl border-2 border-amber-400 bg-gradient-to-br from-amber-50 to-orange-50 p-4 shadow-md">
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-amber-900">
                <ShoppingBag className="h-4 w-4" /> Order Summary
              </h3>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-lg bg-white/80 px-3 py-2 text-sm">
                    <span className="text-stone-700">
                      <span className="font-medium">{item.name}</span>
                      <span className="ml-1 text-stone-400">x{item.quantity}</span>
                    </span>
                    <span className="font-semibold text-amber-900">{formatINR((item.price + priceAdjustment) * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between border-t-2 border-amber-300 pt-3">
                <span className="text-base font-bold text-stone-700">Total Amount</span>
                <span className="text-2xl font-extrabold text-amber-900">{formatINR(grandTotal)}</span>
              </div>
            </div>

            {/* UPI Payment */}
            <div className="mb-5">
              <h3 className="mb-3 font-semibold text-stone-700">Option 1: Pay Online via UPI</h3>
              <div className="rounded-xl border-2 border-green-300 bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <Smartphone className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-stone-400">Our UPI ID</p>
                    <p className="font-mono font-bold text-stone-800">{UPI_ID}</p>
                  </div>
                </div>
                <button
                  onClick={handleUpiPay}
                  className="mt-4 w-full rounded-full bg-gradient-to-r from-green-500 to-green-600 py-3 font-semibold text-white shadow-lg transition-transform hover:scale-[1.02]"
                >
                  Pay {formatINR(grandTotal)} via UPI
                </button>
                <button
                  onClick={handleCopyUpi}
                  className="mt-2 w-full rounded-full border border-green-200 py-2 text-sm font-semibold text-green-700 transition-colors hover:bg-green-50"
                >
                  Copy UPI ID
                </button>
                <p className="mt-2 text-center text-xs text-stone-400">
                  On a phone this opens your UPI app. On a computer, copy the UPI ID and pay from your phone.
                </p>
                {paymentMessage && (
                  <p className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-center text-xs font-medium text-green-700">
                    {paymentMessage}
                  </p>
                )}
              </div>
            </div>

            {/* WhatsApp Order */}
            <div>
              <h3 className="mb-3 font-semibold text-stone-700">Option 2: Order via WhatsApp</h3>
              <p className="mb-3 text-sm text-stone-500">
                Send your order with all items, delivery charge and total to confirm:
              </p>
              <div className="space-y-2">
                {WHATSAPP_NUMBERS.map((num, i) => (
                  <button
                    key={num}
                    onClick={() => { setSelectedNumber(i); handleWhatsAppOrder(); }}
                    className={`flex w-full items-center justify-between rounded-xl border-2 p-4 transition-colors ${
                      selectedNumber === i ? 'border-green-500 bg-green-50' : 'border-stone-200 bg-white hover:border-green-300'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <MessageCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-stone-700">{num}</span>
                    </span>
                    <span className="text-sm text-green-600">Send &rarr;</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setPaymentStep('cart')}
              className="mt-6 w-full text-center text-sm text-stone-400 hover:text-stone-600"
            >
              &larr; Back to cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
