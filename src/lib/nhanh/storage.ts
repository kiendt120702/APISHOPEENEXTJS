/**
 * Nhanh.vn Token Storage
 * Lưu trữ accessToken và thông tin business
 */

import type { NhanhAccessToken, NhanhAppCredentials } from './types';

const STORAGE_KEYS = {
  TOKEN: 'nhanh_access_token',
  CREDENTIALS: 'nhanh_app_credentials',
  BUSINESS_ID: 'nhanh_business_id',
} as const;

/**
 * Lưu access token
 */
export async function storeNhanhToken(token: NhanhAccessToken): Promise<void> {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.TOKEN, JSON.stringify(token));
    if (token.businessId) {
      localStorage.setItem(STORAGE_KEYS.BUSINESS_ID, token.businessId.toString());
    }
  } catch (error) {
    console.error('[Nhanh] Failed to store token:', error);
  }
}

/**
 * Lấy access token đã lưu
 */
export async function getStoredNhanhToken(): Promise<NhanhAccessToken | null> {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (!stored) return null;
    
    return JSON.parse(stored) as NhanhAccessToken;
  } catch (error) {
    console.error('[Nhanh] Failed to get stored token:', error);
    return null;
  }
}

/**
 * Xóa token
 */
export async function clearNhanhToken(): Promise<void> {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.BUSINESS_ID);
  } catch (error) {
    console.error('[Nhanh] Failed to clear token:', error);
  }
}

/**
 * Lưu app credentials
 */
export async function storeNhanhCredentials(credentials: NhanhAppCredentials): Promise<void> {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.CREDENTIALS, JSON.stringify(credentials));
  } catch (error) {
    console.error('[Nhanh] Failed to store credentials:', error);
  }
}

/**
 * Lấy app credentials đã lưu
 */
export async function getStoredNhanhCredentials(): Promise<NhanhAppCredentials | null> {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CREDENTIALS);
    if (!stored) return null;
    
    return JSON.parse(stored) as NhanhAppCredentials;
  } catch (error) {
    console.error('[Nhanh] Failed to get stored credentials:', error);
    return null;
  }
}

/**
 * Xóa credentials
 */
export async function clearNhanhCredentials(): Promise<void> {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEYS.CREDENTIALS);
  } catch (error) {
    console.error('[Nhanh] Failed to clear credentials:', error);
  }
}

/**
 * Lấy business ID đã lưu
 */
export function getStoredBusinessId(): number | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.BUSINESS_ID);
    return stored ? parseInt(stored, 10) : null;
  } catch {
    return null;
  }
}
