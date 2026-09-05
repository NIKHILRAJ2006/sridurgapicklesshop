export type ProductCategory = 'Veg Pickles' | 'Non-Veg Pickles' | 'Karam Podulu' | 'Snacks';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: number;
  weight: string;
  image_url: string;
  is_vegetarian: boolean;
  is_available: boolean;
  created_at: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export const CATEGORIES: ProductCategory[] = ['Veg Pickles', 'Non-Veg Pickles', 'Karam Podulu', 'Snacks'];

export const WHATSAPP_NUMBERS = ['+91 80191 70578', '+91 891-9396178'];
export const WHATSAPP_RAW = ['918019170578', '918919396178'];
export const UPI_ID = '8019170578@ybl';
export const SHOP_NAME = 'Sri Durga Pickles & Snacks';
export const SHOP_LOCATION = '17°31\'18.0"N 78°17\'59.3"E';
export const SHOP_MAPS_URL = 'https://maps.google.com/maps?q=17.5216533%2C78.2998146&z=17&hl=en';
export const INSTAGRAM_PAGE = 'https://www.instagram.com/picklemart.bg?igsi=OGN4d3duMzA5Y3Z2';

