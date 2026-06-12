'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product, User } from '@/lib/data';
import { translations, TranslationKey } from '@/lib/i18n';
import { AdminOrder } from '@/lib/adminData';

type CartItem = {
  product: Product;
  size: string;
  quantity: number;
};

interface StoreContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  cart: CartItem[];
  addToCart: (product: Product, size: string) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateCartQuantity: (productId: string, size: string, quantity: number) => void;
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  user: User | null;
  login: (email: string, role: 'admin' | 'customer') => void;
  logout: () => void;
  language: 'en' | 'ar';
  location: string;
  setPreferences: (lang: 'en' | 'ar', loc: string) => void;
  t: (key: TranslationKey) => string;
  globalDiscount: number;
  setGlobalDiscount: React.Dispatch<React.SetStateAction<number>>;
  
  // Admin Contexts
  adminOrders: AdminOrder[];
  setAdminOrders: React.Dispatch<React.SetStateAction<AdminOrder[]>>;
  adminCustomers: any[];
  setAdminCustomers: React.Dispatch<React.SetStateAction<any[]>>;
  adminCampaigns: any[];
  setAdminCampaigns: React.Dispatch<React.SetStateAction<any[]>>;
  adminPromotions: any[];
  setAdminPromotions: React.Dispatch<React.SetStateAction<any[]>>;
  adminLogistics: any[];
  setAdminLogistics: React.Dispatch<React.SetStateAction<any[]>>;
  adminSupplyChain: any[];
  setAdminSupplyChain: React.Dispatch<React.SetStateAction<any[]>>;
  adminWebhooks: any[];
  setAdminWebhooks: React.Dispatch<React.SetStateAction<any[]>>;
  adminTasks: any[];
  setAdminTasks: React.Dispatch<React.SetStateAction<any[]>>;
  adminChannels: any[];
  setAdminChannels: React.Dispatch<React.SetStateAction<any[]>>;
  adminSalesHistory: any[];
  setAdminSalesHistory: React.Dispatch<React.SetStateAction<any[]>>;
  adminConversionData: any[];
  setAdminConversionData: React.Dispatch<React.SetStateAction<any[]>>;
  adminLtvCacTrend: any[];
  setAdminLtvCacTrend: React.Dispatch<React.SetStateAction<any[]>>;
  adminRegionalSales: any[];
  setAdminRegionalSales: React.Dispatch<React.SetStateAction<any[]>>;
  adminCohorts: any[];
  setAdminCohorts: React.Dispatch<React.SetStateAction<any[]>>;
  adminCoupons: any[];
  setAdminCoupons: React.Dispatch<React.SetStateAction<any[]>>;
  adminRoles: any[];
  setAdminRoles: React.Dispatch<React.SetStateAction<any[]>>;
  logisticsMetrics: any;
  setLogisticsMetrics: React.Dispatch<React.SetStateAction<any>>;
  adminApiKey: string;
  setAdminApiKey: React.Dispatch<React.SetStateAction<string>>;
  adminLiveEvents: any[];
  setAdminLiveEvents: React.Dispatch<React.SetStateAction<any[]>>;
  adminWaves: any[];
  setAdminWaves: React.Dispatch<React.SetStateAction<any[]>>;
  hypeAnalytics: { signups: number; wishlisted: number };
  setHypeAnalytics: React.Dispatch<React.SetStateAction<{ signups: number; wishlisted: number }>>;
  adminTaxonomy: any[];
  setAdminTaxonomy: React.Dispatch<React.SetStateAction<any[]>>;
  adminHero: any;
  setAdminHero: React.Dispatch<React.SetStateAction<any>>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  // Use lazy initialization for state backed by localStorage
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [location, setLocation] = useState<string>('UAE');
  const [globalDiscount, setGlobalDiscount] = useState<number>(0);

  // Admin States
  const [adminOrders, setAdminOrders] = useState<AdminOrder[]>([]);
  const [adminCustomers, setAdminCustomers] = useState<any[]>([]);
  const [adminCampaigns, setAdminCampaigns] = useState<any[]>([]);
  const [adminPromotions, setAdminPromotions] = useState<any[]>([]);
  const [adminLogistics, setAdminLogistics] = useState<any[]>([]);
  const [adminSupplyChain, setAdminSupplyChain] = useState<any[]>([]);
  const [adminWebhooks, setAdminWebhooks] = useState<any[]>([]);
  const [adminTasks, setAdminTasks] = useState<any[]>([]);
  const [adminChannels, setAdminChannels] = useState<any[]>([]);
  const [adminSalesHistory, setAdminSalesHistory] = useState<any[]>([]);
  const [adminConversionData, setAdminConversionData] = useState<any[]>([]);
  const [adminLtvCacTrend, setAdminLtvCacTrend] = useState<any[]>([]);
  const [adminRegionalSales, setAdminRegionalSales] = useState<any[]>([]);
  const [adminCohorts, setAdminCohorts] = useState<any[]>([]);
  const [adminCoupons, setAdminCoupons] = useState<any[]>([]);
  const [adminRoles, setAdminRoles] = useState<any[]>([]);
  const [logisticsMetrics, setLogisticsMetrics] = useState<any>({ activeShipments: 0, avgSla: 0, rtoRate: 0 });
  const [adminApiKey, setAdminApiKey] = useState<string>('pk_test_placeholder');
  const [adminLiveEvents, setAdminLiveEvents] = useState<any[]>([]);
  const [adminWaves, setAdminWaves] = useState<any[]>([]);
  const [hypeAnalytics, setHypeAnalytics] = useState<{ signups: number; wishlisted: number }>({ signups: 0, wishlisted: 0 });
  const [adminTaxonomy, setAdminTaxonomy] = useState<any[]>([]);
  const [adminHero, setAdminHero] = useState<any>({
    left: { text: 'Girls', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1000&auto=format&fit=crop', link: 'Girls' },
    right: { text: 'Boys', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop', link: 'Boys' }
  });

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem('trivioz_products');
      if (storedProducts) setProducts(JSON.parse(storedProducts));

      const storedWishlist = localStorage.getItem('trivioz_wishlist');
      if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
      
      const storedOrders = localStorage.getItem('trivioz_orders');
      if (storedOrders) setAdminOrders(JSON.parse(storedOrders));

      const storedCustomers = localStorage.getItem('trivioz_customers');
      if (storedCustomers) setAdminCustomers(JSON.parse(storedCustomers));

      const storedCampaigns = localStorage.getItem('trivioz_campaigns');
      if (storedCampaigns) setAdminCampaigns(JSON.parse(storedCampaigns));

      const storedPromotions = localStorage.getItem('trivioz_promotions');
      if (storedPromotions) setAdminPromotions(JSON.parse(storedPromotions));

      const storedLogistics = localStorage.getItem('trivioz_logistics');
      if (storedLogistics) setAdminLogistics(JSON.parse(storedLogistics));

      const storedSupply = localStorage.getItem('trivioz_supplychain');
      if (storedSupply) setAdminSupplyChain(JSON.parse(storedSupply));

      const storedWebhooks = localStorage.getItem('trivioz_webhooks');
      if (storedWebhooks) setAdminWebhooks(JSON.parse(storedWebhooks));

      const storedTasks = localStorage.getItem('trivioz_tasks');
      if (storedTasks) setAdminTasks(JSON.parse(storedTasks));

      const storedChannels = localStorage.getItem('trivioz_channels');
      if (storedChannels) setAdminChannels(JSON.parse(storedChannels));

      const storedSalesHistory = localStorage.getItem('trivioz_sales_history');
      if (storedSalesHistory) setAdminSalesHistory(JSON.parse(storedSalesHistory));

      const storedConversionData = localStorage.getItem('trivioz_conversion_data');
      if (storedConversionData) setAdminConversionData(JSON.parse(storedConversionData));

      const storedLtvCacTrend = localStorage.getItem('trivioz_ltv_cac_trend');
      if (storedLtvCacTrend) setAdminLtvCacTrend(JSON.parse(storedLtvCacTrend));

      const storedRegionalSales = localStorage.getItem('trivioz_regional_sales');
      if (storedRegionalSales) setAdminRegionalSales(JSON.parse(storedRegionalSales));

      const storedCohorts = localStorage.getItem('trivioz_cohorts');
      if (storedCohorts) setAdminCohorts(JSON.parse(storedCohorts));

      const storedCoupons = localStorage.getItem('trivioz_coupons');
      if (storedCoupons) setAdminCoupons(JSON.parse(storedCoupons));

      const storedRoles = localStorage.getItem('trivioz_roles');
      if (storedRoles) setAdminRoles(JSON.parse(storedRoles));

      const storedLogisticsMetrics = localStorage.getItem('trivioz_logistics_metrics');
      if (storedLogisticsMetrics) setLogisticsMetrics(JSON.parse(storedLogisticsMetrics));

      const storedApiKey = localStorage.getItem('trivioz_api_key');
      if (storedApiKey) setAdminApiKey(storedApiKey);

      const storedLiveEvents = localStorage.getItem('trivioz_live_events');
      if (storedLiveEvents) setAdminLiveEvents(JSON.parse(storedLiveEvents));

      const storedWaves = localStorage.getItem('trivioz_waves');
      if (storedWaves) {
        setAdminWaves(JSON.parse(storedWaves));
      } else {
        setAdminWaves([
          { id: 'w1', name: 'Wave 1 (Private)', cohort: 'Press & Influencers', routing: 'Hidden URLs', time: 'T-Minus 24 Hrs', status: 'PENDING', isGlobal: false },
          { id: 'w2', name: 'Wave 2 (Early Access)', cohort: 'App Users (VIP)', routing: 'Mobile App Only', time: '09:00 AM AST', status: 'PENDING', isGlobal: false },
          { 
            id: 'w3', 
            name: 'Wave 3 (Global)', 
            cohort: 'General Public', 
            routing: 'Web, App, POS', 
            time: '12:00 PM AST', 
            targetTime: Date.now() + 86400 * 3 * 1000, 
            status: 'PENDING', 
            isGlobal: true,
            imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200&auto=format&fit=crop',
            benefit1Title: 'Early Notification',
            benefit1Desc: 'Get pinged 15 minutes before the drop goes live globally.',
            benefit2Title: 'Secure Your Size',
            benefit2Desc: 'High risk of immediate stockout on core sizes. Lock yours in.'
          },
        ]);
      }

      const storedHype = localStorage.getItem('trivioz_hype_analytics');
      if (storedHype) {
        setHypeAnalytics(JSON.parse(storedHype));
      }

      const storedTaxonomy = localStorage.getItem('trivioz_taxonomy_v4');
      if (storedTaxonomy) {
        setAdminTaxonomy(JSON.parse(storedTaxonomy));
      } else {
        setAdminTaxonomy([
          { id: 't1', department: 'Girls', group: 'Featured', name: 'New', isBold: true },
          { id: 't2', department: 'Girls', group: 'Featured', name: 'Edited by Lennon Sorrenti', isBold: true },
          { id: 't3', department: 'Girls', group: 'Featured', name: 'Festivals', isBold: true },
          { id: 't4', department: 'Girls', group: 'Collection', name: 'Promotions', isSpecial: true },
          { id: 't5', department: 'Girls', group: 'Collection', name: 'Mix & Match 10% off' },
          { id: 't6', department: 'Girls', group: 'Collection', name: 'Swimwear' },
          { id: 't7', department: 'Girls', group: 'Collection', name: 'Striped' },
          { id: 't8', department: 'Girls', group: 'Collection', name: 'Jeans' },
          { id: 't9', department: 'Girls', group: 'Collection', name: 'Trousers' },
          { id: 't10', department: 'Girls', group: 'Collection', name: 'T-shirts' },
          { id: 't11', department: 'Girls', group: 'Collection', name: 'Tops | Bodysuits' },
          { id: 't12', department: 'Girls', group: 'Collection', name: 'Dresses' },
          { id: 't13', department: 'Girls', group: 'Collection', name: 'Jackets | Trench Coats' },
          { id: 't14', department: 'Girls', group: 'Collection', name: 'Blazers' },
          { id: 't15', department: 'Girls', group: 'Collection', name: 'Shirts | Blouses' },
          { id: 't16', department: 'Girls', group: 'Collection', name: 'Sweatshirts | Hoodies' },
          { id: 't17', department: 'Girls', group: 'Collection', name: 'Shoes' },
          { id: 't18', department: 'Girls', group: 'Collection', name: 'Bags | Backpacks' },
          { id: 't19', department: 'Girls', group: 'Collection', name: 'Accessories' },
          { id: 't20', department: 'Girls', group: 'Collection', name: 'Perfumes' },
          { id: 't21', department: 'Girls', group: 'Collection', name: 'Knitwear | Crochet' },
          { id: 't22', department: 'Girls', group: 'Collection', name: 'Skirts' },
          { id: 't23', department: 'Girls', group: 'Collection', name: 'Shorts | Bermuda shorts' },
          { id: 't24', department: 'Girls', group: 'Be Inspired', name: 'Parties and events' },
          { id: 't25', department: 'Girls', group: 'Be Inspired', name: 'Holiday' },
          { id: 't26', department: 'Girls', group: 'Be Inspired', name: 'Collaborations' },
          { id: 't27', department: 'Girls', group: 'Be Inspired', name: 'Special Collection' },
          { id: 't28', department: 'Girls', group: 'Be Inspired Sub', name: 'Pacific Republic' },
          { id: 't29', department: 'Girls', group: 'Be Inspired Sub', name: 'STWD' },
          // Add basic ones for Boys
          { id: 'm1', department: 'Boys', group: 'Featured', name: 'New In', isBold: true },
          { id: 'm2', department: 'Boys', group: 'Collection', name: 'T-Shirts' },
          { id: 'm3', department: 'Boys', group: 'Collection', name: 'Jeans' },
          { id: 'm4', department: 'Boys', group: 'Collection', name: 'Hoodies' },
          { id: 'm5', department: 'Boys', group: 'Be Inspired', name: 'Streetwear' },
        ]);
      }

      const storedHero = localStorage.getItem('trivioz_hero_v4');
      if (storedHero) {
        setAdminHero(JSON.parse(storedHero));
      }
    } catch (e) {
      console.error('Failed to load from local storage', e);
    }
  }, []);

  // Sync to LocalStorage on change
  useEffect(() => {
    localStorage.setItem('trivioz_products', JSON.stringify(products));
    localStorage.setItem('trivioz_orders', JSON.stringify(adminOrders));
    localStorage.setItem('trivioz_customers', JSON.stringify(adminCustomers));
    localStorage.setItem('trivioz_campaigns', JSON.stringify(adminCampaigns));
    localStorage.setItem('trivioz_promotions', JSON.stringify(adminPromotions));
    localStorage.setItem('trivioz_logistics', JSON.stringify(adminLogistics));
    localStorage.setItem('trivioz_supplychain', JSON.stringify(adminSupplyChain));
    localStorage.setItem('trivioz_webhooks', JSON.stringify(adminWebhooks));
    localStorage.setItem('trivioz_tasks', JSON.stringify(adminTasks));
    localStorage.setItem('trivioz_channels', JSON.stringify(adminChannels));
    localStorage.setItem('trivioz_sales_history', JSON.stringify(adminSalesHistory));
    localStorage.setItem('trivioz_conversion_data', JSON.stringify(adminConversionData));
    localStorage.setItem('trivioz_ltv_cac_trend', JSON.stringify(adminLtvCacTrend));
    localStorage.setItem('trivioz_regional_sales', JSON.stringify(adminRegionalSales));
    localStorage.setItem('trivioz_cohorts', JSON.stringify(adminCohorts));
    localStorage.setItem('trivioz_coupons', JSON.stringify(adminCoupons));
    localStorage.setItem('trivioz_roles', JSON.stringify(adminRoles));
    localStorage.setItem('trivioz_logistics_metrics', JSON.stringify(logisticsMetrics));
    localStorage.setItem('trivioz_api_key', adminApiKey);
    localStorage.setItem('trivioz_live_events', JSON.stringify(adminLiveEvents));
    localStorage.setItem('trivioz_waves', JSON.stringify(adminWaves));
    localStorage.setItem('trivioz_hype_analytics', JSON.stringify(hypeAnalytics));
    localStorage.setItem('trivioz_taxonomy_v4', JSON.stringify(adminTaxonomy));
    localStorage.setItem('trivioz_hero_v4', JSON.stringify(adminHero));
    localStorage.setItem('trivioz_wishlist', JSON.stringify(wishlist));
  }, [
    products, adminOrders, adminCustomers, adminCampaigns, adminPromotions, 
    adminLogistics, adminSupplyChain, adminWebhooks, adminTasks, adminChannels, 
    adminSalesHistory, adminConversionData, adminLtvCacTrend, adminRegionalSales, 
    adminCohorts, adminCoupons, adminRoles, logisticsMetrics, adminApiKey, adminLiveEvents, adminWaves, hypeAnalytics, adminTaxonomy, adminHero, wishlist
  ]);

  const addToCart = (product: Product, size: string) => {
    setCart((prev) => {
      const existing = prev.find(item => item.product.id === product.id && item.size === size);
      if (existing) {
        if (existing.quantity >= product.stock) {
          alert('Cannot add more of this item, stock limit reached.');
          return prev;
        }
        return prev.map(item => 
          item.product.id === product.id && item.size === size 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      if (product.stock <= 0) {
        alert('This item is currently out of stock.');
        return prev;
      }
      return [...prev, { product, size, quantity: 1 }];
    });
  };

  const updateCartQuantity = (productId: string, size: string, quantity: number) => {
    setCart((prev) => prev.map(item => {
      if (item.product.id === productId && item.size === size) {
        const newQty = Math.max(1, Math.min(quantity, item.product.stock));
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart((prev) => prev.filter(item => !(item.product.id === productId && item.size === size)));
  };

  const addToWishlist = (product: Product) => {
    setWishlist((prev) => {
      if (prev.find(p => p.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter(p => p.id !== productId));
  };

  const login = (email: string, role: 'admin' | 'customer') => {
    setUser({ id: 'u1', email, role });
  };

  const logout = () => {
    setUser(null);
  };

  const setPreferences = (lang: 'en' | 'ar', loc: string) => {
    setLanguage(lang);
    setLocation(loc);
  };

  const t = (key: TranslationKey) => {
    return translations[language][key] || key;
  };

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  return (
    <StoreContext.Provider value={{ 
      products, setProducts, cart, addToCart, removeFromCart, updateCartQuantity, wishlist, addToWishlist, removeFromWishlist, user, login, logout, language, location, setPreferences, t, globalDiscount, setGlobalDiscount,
      adminOrders, setAdminOrders, adminCustomers, setAdminCustomers, adminCampaigns, setAdminCampaigns, adminPromotions, setAdminPromotions,
      adminLogistics, setAdminLogistics, adminSupplyChain, setAdminSupplyChain, adminWebhooks, setAdminWebhooks,
      adminTasks, setAdminTasks, adminChannels, setAdminChannels, adminSalesHistory, setAdminSalesHistory,
      adminConversionData, setAdminConversionData, adminLtvCacTrend, setAdminLtvCacTrend, adminRegionalSales, setAdminRegionalSales,
      adminCohorts, setAdminCohorts, adminCoupons, setAdminCoupons, adminRoles, setAdminRoles, logisticsMetrics, setLogisticsMetrics,
      adminApiKey, setAdminApiKey, adminLiveEvents, setAdminLiveEvents, adminWaves, setAdminWaves,
      hypeAnalytics, setHypeAnalytics, adminTaxonomy, setAdminTaxonomy, adminHero, setAdminHero
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
