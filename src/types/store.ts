export type DietaryTag = 'Vegan' | 'Nut-Free';
export type FlavorCategory = 'Signature' | 'Seasonal';
export type OrderStatus =
  | 'Received'
  | 'Churning'
  | 'Ready for Pickup'
  | 'Completed';

export type HeroMediaMode = 'procedural' | 'video';
export type ProceduralTheme = 'criollo' | 'vanilla' | 'pistachio';

export interface Flavor {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  tastingNotes: string[];
  origin: string;
  price: number;
  category: FlavorCategory;
  dietary: DietaryTag[];
  inStock: boolean;
  featured: boolean;
  swatch: string;
  accent: string;
  calories: number;
}

export type NewFlavorInput = Omit<Flavor, 'id' | 'accent' | 'calories'> & {
  accent?: string;
  calories?: number;
};

export interface OrderItem {
  flavorId: string;
  name: string;
  qty: number;
  price: number;
}

export interface CartItem extends OrderItem {
  swatch: string;
}

export interface Order {
  id: string;
  customerName: string;
  locationName: string;
  pickupTime: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export interface PlaceOrderPayload {
  customerName: string;
  locationName: string;
  pickupTime: string;
  items: OrderItem[];
}

export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  hours: string;
  phone: string;
  specialty: string;
  slots: string[];
}

export interface HeroMediaConfig {
  mode: HeroMediaMode;
  proceduralTheme: ProceduralTheme;
  heroTagline: string;
  customVideoName: string;
  posterHeadline: string;
}
