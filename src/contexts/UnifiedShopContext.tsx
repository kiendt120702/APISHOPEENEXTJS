"use client";

/**
 * Unified Shop Context
 * Quản lý tất cả shop từ nhiều nền tảng (Shopee, Nhanh.vn, v.v.)
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { storeToken, clearToken, getStoredToken } from '@/lib/shopee';
import { storeNhanhToken, clearNhanhToken, getStoredNhanhToken } from '@/lib/nhanh';
import type { AccessToken } from '@/lib/shopee';
import type { NhanhAccessToken } from '@/lib/nhanh';

// Định nghĩa các platform
export type ShopPlatform = 'shopee' | 'nhanh' | 'tiktok' | 'lazada';

// Interface chung cho tất cả shop
export interface UnifiedShop {
  id: string; // UUID từ database
  platform: ShopPlatform;
  platformShopId: string | number; // shop_id (Shopee) hoặc business_id (Nhanh)
  name: string;
  logo?: string | null;
  region?: string | null;
  isActive: boolean;
  connectedAt: string;
  // Metadata riêng cho từng platform
  metadata?: Record<string, unknown>;
}

interface UnifiedShopContextValue {
  // State
  shops: UnifiedShop[];
  selectedShop: UnifiedShop | null;
  isLoading: boolean;
  error: string | null;
  userId: string | null;
  
  // Actions
  selectShop: (shop: UnifiedShop) => Promise<void>;
  refreshShops: () => Promise<void>;
  getShopsByPlatform: (platform: ShopPlatform) => UnifiedShop[];
}

const UnifiedShopContext = createContext<UnifiedShopContextValue | null>(null);

// Storage key cho selected shop
const SELECTED_SHOP_KEY = 'unified_selected_shop';

export function UnifiedShopProvider({ children }: { children: ReactNode }) {
  const [shops, setShops] = useState<UnifiedShop[]>([]);
  const [selectedShop, setSelectedShop] = useState<UnifiedShop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Load shops từ tất cả các platform
  const loadAllShops = useCallback(async (uid: string) => {
    try {
      const allShops: UnifiedShop[] = [];

      // 1. Load Shopee shops
      const { data: shopeeMembers } = await supabase
        .from('apishopee_shop_members')
        .select(`
          shop_id,
          apishopee_shops(id, shop_id, shop_name, shop_logo, region, created_at)
        `)
        .eq('profile_id', uid)
        .eq('is_active', true);

      if (shopeeMembers) {
        for (const member of shopeeMembers) {
          const shop = member.apishopee_shops as any;
          if (shop) {
            allShops.push({
              id: shop.id,
              platform: 'shopee',
              platformShopId: shop.shop_id,
              name: shop.shop_name || `Shop ${shop.shop_id}`,
              logo: shop.shop_logo,
              region: shop.region,
              isActive: true,
              connectedAt: shop.created_at,
            });
          }
        }
      }

      // 2. Load Nhanh.vn connections
      const { data: nhanhConnections } = await supabase
        .from('nhanh_connections')
        .select('*')
        .eq('user_id', uid)
        .eq('is_active', true);

      if (nhanhConnections) {
        for (const conn of nhanhConnections) {
          allShops.push({
            id: conn.id,
            platform: 'nhanh',
            platformShopId: conn.business_id,
            name: conn.business_name || conn.app_name || `Business ${conn.business_id}`,
            logo: null, // Nhanh.vn không có logo
            region: 'VN',
            isActive: true,
            connectedAt: conn.connected_at,
            metadata: {
              appId: conn.app_id,
              appName: conn.app_name,
              permissions: conn.permissions,
            },
          });
        }
      }

      // TODO: Load từ các platform khác (TikTok, Lazada, v.v.)

      setShops(allShops);
      return allShops;
    } catch (err) {
      console.error('[UnifiedShop] Error loading shops:', err);
      setError('Không thể tải danh sách shop');
      return [];
    }
  }, []);

  // Restore selected shop từ localStorage
  const restoreSelectedShop = useCallback(async (allShops: UnifiedShop[]) => {
    try {
      const stored = localStorage.getItem(SELECTED_SHOP_KEY);
      if (stored) {
        const { id, platform } = JSON.parse(stored);
        const shop = allShops.find(s => s.id === id && s.platform === platform);
        if (shop) {
          // Load token cho shop được restore
          await loadTokenForShop(shop);
          setSelectedShop(shop);
          return shop;
        }
      }

      // Nếu không có stored hoặc không tìm thấy, chọn shop đầu tiên
      if (allShops.length > 0) {
        // Ưu tiên Shopee shop nếu có
        const shopeeShop = allShops.find(s => s.platform === 'shopee');
        const defaultShop = shopeeShop || allShops[0];
        // Load token cho default shop
        await loadTokenForShop(defaultShop);
        setSelectedShop(defaultShop);
        localStorage.setItem(SELECTED_SHOP_KEY, JSON.stringify({
          id: defaultShop.id,
          platform: defaultShop.platform,
        }));
        return defaultShop;
      }

      return null;
    } catch (err) {
      console.error('[UnifiedShop] Error restoring selected shop:', err);
      return null;
    }
  }, []);

  // Helper function để load token cho shop
  const loadTokenForShop = async (shop: UnifiedShop) => {
    try {
      // Clear token cũ
      await clearToken();
      await clearNhanhToken();

      if (shop.platform === 'shopee') {
        const { data: shopData } = await supabase
          .from('apishopee_shops')
          .select('shop_id, access_token, refresh_token, expired_at, merchant_id')
          .eq('id', shop.id)
          .single();

        if (shopData?.access_token) {
          const token: AccessToken = {
            access_token: shopData.access_token,
            refresh_token: shopData.refresh_token,
            shop_id: shopData.shop_id,
            expired_at: shopData.expired_at,
            expire_in: 14400,
            merchant_id: shopData.merchant_id,
          };
          await storeToken(token);
        }
      } else if (shop.platform === 'nhanh') {
        const { data: connData } = await supabase
          .from('nhanh_connections')
          .select('access_token, business_id, business_name, permissions, app_id')
          .eq('id', shop.id)
          .single();

        if (connData?.access_token) {
          const token: NhanhAccessToken = {
            accessToken: connData.access_token,
            businessId: connData.business_id,
            businessName: connData.business_name,
            permissions: connData.permissions,
          };
          await storeNhanhToken(token);
          console.log('[UnifiedShop] Nhanh token loaded for business:', connData.business_id);
        }
      }
    } catch (err) {
      console.error('[UnifiedShop] Error loading token for shop:', err);
    }
  };

  // Select shop và load token tương ứng
  const selectShop = useCallback(async (shop: UnifiedShop) => {
    if (selectedShop?.id === shop.id && selectedShop?.platform === shop.platform) {
      return; // Already selected
    }

    setIsLoading(true);
    setError(null);

    try {
      // Load token cho shop mới
      await loadTokenForShop(shop);

      // Update state
      setSelectedShop(shop);
      localStorage.setItem(SELECTED_SHOP_KEY, JSON.stringify({
        id: shop.id,
        platform: shop.platform,
      }));

      console.log('[UnifiedShop] Switched to:', shop.platform, shop.platformShopId);
    } catch (err) {
      console.error('[UnifiedShop] Error selecting shop:', err);
      setError('Không thể chuyển shop');
    } finally {
      setIsLoading(false);
    }
  }, [selectedShop]);

  // Refresh danh sách shops
  const refreshShops = useCallback(async () => {
    if (!userId) return;
    
    setIsLoading(true);
    const allShops = await loadAllShops(userId);
    await restoreSelectedShop(allShops);
    setIsLoading(false);
  }, [userId, loadAllShops, restoreSelectedShop]);

  // Get shops by platform
  const getShopsByPlatform = useCallback((platform: ShopPlatform) => {
    return shops.filter(s => s.platform === platform);
  }, [shops]);

  // Initialize
  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted && session?.user) {
          setUserId(session.user.id);
          const allShops = await loadAllShops(session.user.id);
          await restoreSelectedShop(allShops);
        }
      } catch (err) {
        console.error('[UnifiedShop] Init error:', err);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    init();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        if (event === 'SIGNED_IN' && session?.user) {
          setUserId(session.user.id);
          const allShops = await loadAllShops(session.user.id);
          await restoreSelectedShop(allShops);
        } else if (event === 'SIGNED_OUT') {
          setUserId(null);
          setShops([]);
          setSelectedShop(null);
          localStorage.removeItem(SELECTED_SHOP_KEY);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadAllShops, restoreSelectedShop]);

  return (
    <UnifiedShopContext.Provider
      value={{
        shops,
        selectedShop,
        isLoading,
        error,
        userId,
        selectShop,
        refreshShops,
        getShopsByPlatform,
      }}
    >
      {children}
    </UnifiedShopContext.Provider>
  );
}

export function useUnifiedShop() {
  const context = useContext(UnifiedShopContext);
  if (!context) {
    throw new Error('useUnifiedShop must be used within UnifiedShopProvider');
  }
  return context;
}
