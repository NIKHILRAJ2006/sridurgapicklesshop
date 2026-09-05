import { WHATSAPP_RAW, WHATSAPP_NUMBERS, UPI_ID, SHOP_NAME, type CartItem } from '@/lib/types';

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function buildWhatsAppMessage(items: CartItem[], total: number, deliveryCharge = 0, pincode = ""): string {
  const lines = items.map(
    (item, i) =>
      `*${i + 1}. ${item.name}* (${item.weight}) x${item.quantity} = *${formatINR(item.price * item.quantity)}*`,
  );
  const deliveryLine = deliveryCharge > 0 ? `Delivery (${pincode || 'location'}): *${formatINR(deliveryCharge)}*\n` : `Delivery: *To be confirmed*\n`;
  const text =
    `Hello ${SHOP_NAME}!\n\n` +
    `I would like to place an order:\n\n` +
    `${lines.join('\n')}\n\n` +
    `${deliveryLine}` +
    `*Total Amount: ${formatINR(total)}*\n\n` +
    `Payment: I will send payment via UPI to ${UPI_ID}.\n` +
    `Please confirm my order. Thank you!`;
  return encodeURIComponent(text);
}

export function whatsappOrderLink(items: CartItem[], total: number, numberIndex = 0, deliveryCharge = 0, pincode = ""): string {
  return `https://wa.me/${WHATSAPP_RAW[numberIndex]}?text=${buildWhatsAppMessage(items, total, deliveryCharge, pincode)}`;
}

export function whatsappPlainLink(message: string, numberIndex = 0): string {
  return `https://wa.me/${WHATSAPP_RAW[numberIndex]}?text=${encodeURIComponent(message)}`;
}

export function upiPaymentLink(amount: number, note: string): string {
  return `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(SHOP_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(
    note,
  )}`;
}

export { WHATSAPP_NUMBERS, UPI_ID, SHOP_NAME };
