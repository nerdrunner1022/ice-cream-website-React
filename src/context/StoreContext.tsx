import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import {
  INITIAL_FLAVORS,
  INITIAL_ORDERS,
  INITIAL_LOCATIONS,
  INITIAL_HERO_MEDIA,
} from '../data/initialData';
import type {
  Flavor,
  NewFlavorInput,
  Order,
  OrderStatus,
  PlaceOrderPayload,
  CartItem,
  StoreLocation,
  HeroMediaConfig,
  ProceduralTheme,
} from '../types/store';

interface StoreContextValue {
  flavors: Flavor[];
  orders: Order[];
  locations: StoreLocation[];
  heroMedia: HeroMediaConfig;
  customVideoUrl: string | null;
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isAdminAuthenticated: boolean;
  addFlavor: (newFlavor: NewFlavorInput) => void;
  toggleFlavorStock: (id: string) => void;
  updateFlavorPrice: (id: string, newPrice: string | number) => void;
  deleteFlavor: (id: string) => void;
  updateOrderStatus: (orderId: string, nextStatus: OrderStatus) => void;
  placeOrder: (payload: PlaceOrderPayload) => Order;
  addToCart: (flavor: Flavor) => void;
  updateCartQty: (flavorId: string, delta: number) => void;
  uploadHeroVideo: (file: File) => void;
  resetHeroToProcedural: (theme?: ProceduralTheme) => void;
  updateHeroCopy: (updates: Partial<HeroMediaConfig>) => void;
  loginAdmin: (pin: string) => boolean;
  logoutAdmin: () => void;
  resetAllData: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

const STORAGE_KEYS = {
  FLAVORS: 'vc_flavors_v1',
  ORDERS: 'vc_orders_v1',
  MEDIA: 'vc_media_v1',
  ADMIN_AUTH: 'vc_admin_auth_v1',
} as const;

function readStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [flavors, setFlavors] = useState<Flavor[]>(() =>
    readStorage<Flavor[]>(STORAGE_KEYS.FLAVORS, INITIAL_FLAVORS)
  );

  const [orders, setOrders] = useState<Order[]>(() =>
    readStorage<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS)
  );

  const [heroMedia, setHeroMedia] = useState<HeroMediaConfig>(() =>
    readStorage<HeroMediaConfig>(STORAGE_KEYS.MEDIA, INITIAL_HERO_MEDIA)
  );

  const [customVideoUrl, setCustomVideoUrl] = useState<string | null>(null);

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(
    () => sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true'
  );

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FLAVORS, JSON.stringify(flavors));
  }, [flavors]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(heroMedia));
  }, [heroMedia]);

  const addFlavor = (newFlavor: NewFlavorInput): void => {
    const flavor: Flavor = {
      ...newFlavor,
      id: `flv-${Date.now()}`,
      price: Number(newFlavor.price) || 7.5,
      accent: newFlavor.accent ?? '#C69C6D',
      calories: Number(newFlavor.calories) || 260,
    };
    setFlavors((prev) => [flavor, ...prev]);
  };

  const toggleFlavorStock = (id: string): void => {
    setFlavors((prev) =>
      prev.map((f) => (f.id === id ? { ...f, inStock: !f.inStock } : f))
    );
  };

  const updateFlavorPrice = (id: string, newPrice: string | number): void => {
    const parsed = typeof newPrice === 'number' ? newPrice : parseFloat(newPrice);
    if (Number.isNaN(parsed) || parsed <= 0) return;
    setFlavors((prev) =>
      prev.map((f) => (f.id === id ? { ...f, price: parsed } : f))
    );
  };

  const deleteFlavor = (id: string): void => {
    setFlavors((prev) => prev.filter((f) => f.id !== id));
  };

  const updateOrderStatus = (orderId: string, nextStatus: OrderStatus): void => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
    );
  };

  const placeOrder = ({
    customerName,
    locationName,
    pickupTime,
    items,
  }: PlaceOrderPayload): Order => {
    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const newOrder: Order = {
      id: `VC-${Math.floor(4100 + Math.random() * 899)}`,
      customerName: customerName || 'Atelier Guest',
      locationName,
      pickupTime,
      items,
      total: Number(total.toFixed(2)),
      status: 'Received',
      createdAt: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    return newOrder;
  };

  const addToCart = (flavor: Flavor): void => {
    if (!flavor.inStock) return;
    setCart((prev) => {
      const existing = prev.find((i) => i.flavorId === flavor.id);
      if (existing) {
        return prev.map((i) =>
          i.flavorId === flavor.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [
        ...prev,
        {
          flavorId: flavor.id,
          name: flavor.name,
          price: flavor.price,
          swatch: flavor.swatch,
          qty: 1,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const updateCartQty = (flavorId: string, delta: number): void => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.flavorId === flavorId ? { ...i, qty: i.qty + delta } : i
        )
        .filter((i) => i.qty > 0)
    );
  };

  const uploadHeroVideo = (file: File): void => {
    if (customVideoUrl) URL.revokeObjectURL(customVideoUrl);
    const url = URL.createObjectURL(file);
    setCustomVideoUrl(url);
    setHeroMedia((prev) => ({
      ...prev,
      mode: 'video',
      customVideoName: file.name,
    }));
  };

  const resetHeroToProcedural = (theme: ProceduralTheme = 'criollo'): void => {
    setHeroMedia((prev) => ({
      ...prev,
      mode: 'procedural',
      proceduralTheme: theme,
    }));
  };

  const updateHeroCopy = (updates: Partial<HeroMediaConfig>): void => {
    setHeroMedia((prev) => ({ ...prev, ...updates }));
  };

  const loginAdmin = (pin: string): boolean => {
    if (pin === '1984' || pin === '2026' || pin === 'DEMO') {
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      setIsAdminAuthenticated(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = (): void => {
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    setIsAdminAuthenticated(false);
  };

  const resetAllData = (): void => {
    setFlavors(INITIAL_FLAVORS);
    setOrders(INITIAL_ORDERS);
    setHeroMedia(INITIAL_HERO_MEDIA);
    setCustomVideoUrl(null);
  };

  return (
    <StoreContext.Provider
      value={{
        flavors,
        orders,
        locations: INITIAL_LOCATIONS,
        heroMedia,
        customVideoUrl,
        cart,
        isCartOpen,
        setIsCartOpen,
        isAdminAuthenticated,
        addFlavor,
        toggleFlavorStock,
        updateFlavorPrice,
        deleteFlavor,
        updateOrderStatus,
        placeOrder,
        addToCart,
        updateCartQty,
        uploadHeroVideo,
        resetHeroToProcedural,
        updateHeroCopy,
        loginAdmin,
        logoutAdmin,
        resetAllData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
