/**
 * Nhanh.vn Authentication Hook
 * React hook để quản lý authentication với Nhanh.vn
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import {
  getNhanhAuthorizationUrl,
  authenticateWithAccessCode,
  saveNhanhConnection,
  getUserNhanhConnections,
  removeNhanhConnection,
  storeNhanhToken,
  getStoredNhanhToken,
  clearNhanhToken,
  storeNhanhCredentials,
  getStoredNhanhCredentials,
  NHANH_CONFIG,
} from '@/lib/nhanh';
import type { NhanhAccessToken, NhanhAppCredentials } from '@/lib/nhanh';

interface NhanhConnectionInfo {
  id: string;
  businessId: number;
  businessName: string | null;
  appId: string;
  appName: string | null;
  isActive: boolean;
  connectedAt: string;
}

interface UseNhanhAuthReturn {
  token: NhanhAccessToken | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  connections: NhanhConnectionInfo[];
  selectedBusinessId: number | null;
  // Actions
  login: (credentials: NhanhAppCredentials, callbackUrl?: string) => Promise<void>;
  logout: () => Promise<void>;
  handleCallback: (accessCode: string, credentials?: NhanhAppCredentials) => Promise<void>;
  switchBusiness: (businessId: number) => Promise<void>;
  removeConnection: (businessId: number) => Promise<void>;
  refreshConnections: () => Promise<void>;
}

const DEFAULT_CALLBACK = NHANH_CONFIG.callbackUrl ||
  (typeof window !== 'undefined' 
    ? `${window.location.origin}/auth/nhanh/callback` 
    : 'https://ops.betacom.agency/auth/nhanh/callback');

export function useNhanhAuth(): UseNhanhAuthReturn {
  const [token, setToken] = useState<NhanhAccessToken | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connections, setConnections] = useState<NhanhConnectionInfo[]>([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const isAuthenticated = !!token && !error;

  // Load connections từ database
  const loadConnections = useCallback(async (uid: string) => {
    try {
      console.log('[NhanhAuth] loadConnections called for uid:', uid);
      const userConnections = await getUserNhanhConnections(uid);
      console.log('[NhanhAuth] userConnections from DB:', userConnections);
      const mapped: NhanhConnectionInfo[] = userConnections.map((conn: Record<string, unknown>) => ({
        id: conn.id as string,
        businessId: conn.business_id as number,
        businessName: conn.business_name as string | null,
        appId: conn.app_id as string,
        appName: conn.app_name as string | null,
        isActive: conn.is_active as boolean,
        connectedAt: conn.connected_at as string,
      }));
      console.log('[NhanhAuth] mapped connections:', mapped);
      setConnections(mapped);
      return mapped;
    } catch (err) {
      console.error('[NhanhAuth] Failed to load connections:', err);
      return [];
    }
  }, []);

  // Load token từ localStorage hoặc database
  const loadToken = useCallback(async (uid: string, targetBusinessId?: number) => {
    try {
      // Luôn load connections từ database trước
      const userConnections = await loadConnections(uid);
      
      // 1. Thử load từ localStorage trước (nếu không có targetBusinessId)
      const storedToken = await getStoredNhanhToken();
      if (storedToken && !targetBusinessId) {
        setToken(storedToken);
        setSelectedBusinessId(storedToken.businessId);
        return true;
      }

      // 2. Load từ database nếu có targetBusinessId hoặc không có stored token
      if (userConnections.length > 0) {
        const targetConn = targetBusinessId 
          ? userConnections.find(c => c.businessId === targetBusinessId)
          : userConnections[0];

        if (targetConn) {
          // Lấy token từ database
          const { data: connData } = await supabase
            .from('nhanh_connections')
            .select('access_token, business_id, business_name, permissions')
            .eq('id', targetConn.id)
            .single();

          if (connData?.access_token) {
            const dbToken: NhanhAccessToken = {
              accessToken: connData.access_token,
              businessId: connData.business_id,
              businessName: connData.business_name,
              permissions: connData.permissions,
            };
            
            await storeNhanhToken(dbToken);
            setToken(dbToken);
            setSelectedBusinessId(connData.business_id);
            return true;
          }
        }
      }      return false;
    } catch (err) {
      console.error('[NhanhAuth] Error loading token:', err);
      return false;
    }
  }, [loadConnections]);

  // Initialize on mount
  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted && session?.user) {
          setUserId(session.user.id);
          await loadToken(session.user.id);
        }
      } catch (err) {
        console.error('[NhanhAuth] Init error:', err);
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
          await loadToken(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setToken(null);
          setUserId(null);
          setConnections([]);
          setSelectedBusinessId(null);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadToken]);

  // Redirect to Nhanh.vn login
  const login = useCallback(
    async (credentials: NhanhAppCredentials, callbackUrl = DEFAULT_CALLBACK) => {
      console.log('[NhanhAuth] login() called');
      
      setIsLoading(true);
      setError(null);

      try {
        // Lưu credentials vào sessionStorage để dùng khi callback
        sessionStorage.setItem('nhanh_credentials', JSON.stringify(credentials));
        
        // Lưu credentials vào localStorage để dùng sau
        await storeNhanhCredentials(credentials);

        const authUrl = await getNhanhAuthorizationUrl(credentials, callbackUrl);
        console.log('[NhanhAuth] Redirecting to:', authUrl);
        
        window.location.href = authUrl;
      } catch (err) {
        console.error('[NhanhAuth] Login error:', err);
        setError(err instanceof Error ? err.message : 'Failed to get auth URL');
        setIsLoading(false);
      }
    },
    []
  );

  // Handle OAuth callback
  const handleCallback = useCallback(
    async (accessCode: string, credentials?: NhanhAppCredentials) => {
      setIsLoading(true);
      setError(null);

      try {
        // Lấy credentials từ sessionStorage nếu không được truyền vào
        let creds = credentials;
        if (!creds) {
          const storedCreds = sessionStorage.getItem('nhanh_credentials');
          if (storedCreds) {
            creds = JSON.parse(storedCreds);
          } else {
            // Thử lấy từ localStorage
            creds = await getStoredNhanhCredentials() || undefined;
          }
        }

        if (!creds) {
          throw new Error('Missing app credentials. Please try connecting again.');
        }

        // Đổi accessCode lấy accessToken
        const newToken = await authenticateWithAccessCode(accessCode, creds);
        
        // Lưu token locally
        await storeNhanhToken(newToken);
        setToken(newToken);
        setSelectedBusinessId(newToken.businessId);

        // Lưu vào database nếu user đã đăng nhập
        if (userId) {
          await saveNhanhConnection(userId, newToken, creds);
          await loadConnections(userId);
        }

        // Clear sessionStorage
        sessionStorage.removeItem('nhanh_credentials');

        console.log('[NhanhAuth] Authentication successful, businessId:', newToken.businessId);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Authentication failed';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [userId, loadConnections]
  );

  // Logout
  const logout = useCallback(async () => {
    try {
      await clearNhanhToken();
      setToken(null);
      setSelectedBusinessId(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to logout');
    }
  }, []);

  // Switch business
  const switchBusiness = useCallback(
    async (businessId: number) => {
      if (!userId) {
        setError('User not authenticated');
        return;
      }

      if (businessId === selectedBusinessId) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        await loadToken(userId, businessId);
        console.log('[NhanhAuth] Switched to business:', businessId);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to switch business');
      } finally {
        setIsLoading(false);
      }
    },
    [userId, selectedBusinessId, loadToken]
  );

  // Remove connection
  const removeConnectionHandler = useCallback(
    async (businessId: number) => {
      if (!userId) {
        setError('User not authenticated');
        return;
      }

      try {
        await removeNhanhConnection(userId, businessId);
        
        // Nếu đang dùng business này, clear token
        if (businessId === selectedBusinessId) {
          await clearNhanhToken();
          setToken(null);
          setSelectedBusinessId(null);
        }

        await loadConnections(userId);
        console.log('[NhanhAuth] Removed connection:', businessId);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to remove connection');
      }
    },
    [userId, selectedBusinessId, loadConnections]
  );

  // Refresh connections
  const refreshConnections = useCallback(async () => {
    if (userId) {
      await loadConnections(userId);
    }
  }, [userId, loadConnections]);

  return {
    token,
    isAuthenticated,
    isLoading,
    error,
    connections,
    selectedBusinessId,
    login,
    logout,
    handleCallback,
    switchBusiness,
    removeConnection: removeConnectionHandler,
    refreshConnections,
  };
}
