export type DeliveryZone = 'Srikalahasti' | 'Tirupati' | 'Nearby' | 'Far';

export interface LocationPricingResult {
  zone: DeliveryZone;
  label: string;
  priceAdjustment: number;
  deliveryCharge: number;
  distanceKm: number | null;
}

const SHOP_LAT = 13.7494;
const SHOP_LNG = 79.6982;
const TIRUPATI_LAT = 13.6288;
const TIRUPATI_LNG = 79.4192;

function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const rad = Math.PI / 180;
  const a =
    0.5 -
    Math.cos((lat2 - lat1) * rad) / 2 +
    (Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * (1 - Math.cos((lon2 - lon1) * rad))) / 2;
  return 12742 * Math.asin(Math.sqrt(a));
}

export function getLocationPricing(lat: number, lng: number): LocationPricingResult {
  const shopDistance = distanceKm(lat, lng, SHOP_LAT, SHOP_LNG);
  const tirupatiDistance = distanceKm(lat, lng, TIRUPATI_LAT, TIRUPATI_LNG);

  if (shopDistance <= 10) {
    return { zone: 'Srikalahasti', label: 'Srikalahasti', priceAdjustment: 0, deliveryCharge: 0, distanceKm: shopDistance };
  }
  if (tirupatiDistance <= 15) {
    return { zone: 'Tirupati', label: 'Tirupati', priceAdjustment: -20, deliveryCharge: 60, distanceKm: shopDistance };
  }
  if (shopDistance <= 25) {
    return { zone: 'Nearby', label: 'Nearby delivery area', priceAdjustment: 10, deliveryCharge: 40, distanceKm: shopDistance };
  }
  if (shopDistance <= 60) {
    return { zone: 'Far', label: 'Extended delivery area', priceAdjustment: 30, deliveryCharge: 90, distanceKm: shopDistance };
  }
  return { zone: 'Far', label: 'Outside local delivery zone', priceAdjustment: 50, deliveryCharge: 130, distanceKm: shopDistance };
}
