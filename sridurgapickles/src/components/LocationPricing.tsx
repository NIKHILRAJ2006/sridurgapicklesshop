import { useState } from 'react';
import { MapPin, Navigation, Truck, CheckCircle2 } from 'lucide-react';
import { formatINR } from '@/lib/utils';

import type { LocationPricingResult } from '@/lib/locationPricing';
import { getLocationPricing } from '@/lib/locationPricing';

function getPricingFromPincode(pincode: string): LocationPricingResult | null {
  if (pincode === '517644') return { zone: 'Srikalahasti', label: 'Srikalahasti', priceAdjustment: 0, deliveryCharge: 0, distanceKm: 0 };
  if (pincode === '517501' || pincode.startsWith('5175')) return { zone: 'Tirupati', label: 'Tirupati', priceAdjustment: -20, deliveryCharge: 60, distanceKm: 35 };
  if (pincode.startsWith('5176')) return { zone: 'Nearby', label: 'Nearby delivery area', priceAdjustment: 10, deliveryCharge: 40, distanceKm: 20 };
  if (/^\d{6}$/.test(pincode)) return { zone: 'Far', label: 'Extended delivery area', priceAdjustment: 30, deliveryCharge: 90, distanceKm: null };
  return null;
}

interface LocationPricingProps {
  onPricingChange: (pricing: LocationPricingResult | null) => void;
}

export function LocationPricing({ onPricingChange }: LocationPricingProps) {
  const [pincode, setPincode] = useState('');
  const [result, setResult] = useState<LocationPricingResult | null>(null);
  const [detecting, setDetecting] = useState(false);
  const [message, setMessage] = useState('');

  function applyPricing(pricing: LocationPricingResult) {
    setResult(pricing);
    onPricingChange(pricing);
    setMessage('');
  }

  function checkPincode() {
    const pricing = getPricingFromPincode(pincode.trim());
    if (!pricing) {
      setResult(null);
      onPricingChange(null);
      setMessage('Enter a valid 6-digit pincode to calculate the local price.');
      return;
    }
    applyPricing(pricing);
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setMessage('Location detection is not supported in this browser. Use your pincode instead.');
      return;
    }
    setDetecting(true);
    setMessage('Detecting your location…');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        applyPricing(getLocationPricing(coords.latitude, coords.longitude));
        setDetecting(false);
      },
      () => {
        setDetecting(false);
        setMessage('Location permission was not available. Enter your pincode instead.');
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  }

  return (
    <section className="rounded-2xl border border-amber-200 bg-white/90 p-5 shadow-md backdrop-blur">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="flex items-center gap-2 font-serif text-2xl font-bold text-amber-950">
            <MapPin className="h-6 w-6 text-amber-600" /> Check your local price & delivery
          </h2>
          <p className="mt-1 text-sm text-stone-500">Prices and delivery charges are calculated from Sri Durga to your location.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="flex overflow-hidden rounded-xl border border-stone-200 bg-white">
            <input
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              onKeyDown={(e) => { if (e.key === 'Enter') checkPincode(); }}
              placeholder="Enter pincode"
              inputMode="numeric"
              className="w-40 px-3 py-2.5 text-sm outline-none"
              aria-label="Delivery pincode"
            />
            <button onClick={checkPincode} className="bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-700">Check</button>
          </div>
          <button
            onClick={useMyLocation}
            disabled={detecting}
            className="flex items-center justify-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-900 hover:bg-amber-100 disabled:opacity-60"
          >
            <Navigation className="h-4 w-4" /> {detecting ? 'Detecting…' : 'Use my location'}
          </button>
        </div>
      </div>

      {message && <p className="mt-3 text-sm text-stone-500">{message}</p>}

      {result && (
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-amber-50 p-3">
            <p className="text-xs text-stone-500">Delivery area</p>
            <p className="font-semibold text-amber-950">{result.label}</p>
          </div>
          <div className="rounded-xl bg-amber-50 p-3">
            <p className="text-xs text-stone-500">Location price adjustment</p>
            <p className="font-semibold text-amber-950">{result.priceAdjustment === 0 ? 'Local shop price' : `${result.priceAdjustment > 0 ? '+' : '-'}${formatINR(Math.abs(result.priceAdjustment))} per item`}</p>
          </div>
          <div className="rounded-xl bg-amber-50 p-3">
            <p className="text-xs text-stone-500">Delivery charge</p>
            <p className="flex items-center gap-1 font-semibold text-amber-950"><Truck className="h-4 w-4" /> {result.deliveryCharge === 0 ? 'Free' : formatINR(result.deliveryCharge)}</p>
          </div>
        </div>
      )}
      {result && (
        <p className="mt-3 flex items-center gap-2 text-xs text-green-700">
          <CheckCircle2 className="h-4 w-4" /> Your selected location will be used for product pricing and delivery calculation.
        </p>
      )}
    </section>
  );
}
