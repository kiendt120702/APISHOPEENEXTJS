/**
 * Nhanh.vn API Configuration
 */

// API Base URLs
export const NHANH_API_URLS = {
  // POS API (Quản lý bán hàng)
  POS: 'https://pos.open.nhanh.vn',
  // Vpage API (Quản lý fanpage)
  VPAGE: 'https://vpage.open.nhanh.vn',
  // Auth URL
  AUTH: 'https://nhanh.vn',
  // App management
  APP_MANAGEMENT: 'https://nhanh.vn/app/manage',
} as const;

// API Version
export const NHANH_API_VERSION = 'v3.0';

// Rate limit config
export const NHANH_RATE_LIMIT = {
  maxRequests: 150,
  windowSeconds: 30,
} as const;

// Default config từ env
export const NHANH_CONFIG = {
  appId: process.env.NEXT_PUBLIC_NHANH_APP_ID || '',
  secretKey: process.env.NEXT_PUBLIC_NHANH_SECRET_KEY || '',
  callbackUrl: process.env.NEXT_PUBLIC_NHANH_CALLBACK_URL || 
    (typeof window !== 'undefined' 
      ? `${window.location.origin}/auth/nhanh/callback` 
      : 'https://apishopeenextjs.vercel.app/auth/nhanh/callback'),
};

/**
 * Kiểm tra config hợp lệ
 */
export function isNhanhConfigValid(): boolean {
  return NHANH_CONFIG.appId.length > 0 && NHANH_CONFIG.secretKey.length > 0;
}

/**
 * Tạo URL đăng nhập cấp quyền Nhanh.vn
 * @param appId - App ID từ Nhanh.vn
 * @param redirectUrl - URL callback sau khi cấp quyền
 */
export function getNhanhAuthUrl(appId: string, redirectUrl: string): string {
  const params = new URLSearchParams({
    version: '3.0',
    appId,
    returnLink: redirectUrl,
  });
  
  return `${NHANH_API_URLS.AUTH}/oauth?${params.toString()}`;
}

/**
 * Tạo API URL với version
 */
export function getNhanhApiUrl(
  service: 'POS' | 'VPAGE',
  endpoint: string,
  appId: string,
  businessId: number
): string {
  const baseUrl = NHANH_API_URLS[service];
  const params = new URLSearchParams({
    appId,
    businessId: businessId.toString(),
  });
  
  return `${baseUrl}/${NHANH_API_VERSION}/${endpoint}?${params.toString()}`;
}
