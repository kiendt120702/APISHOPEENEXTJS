/**
 * Nhanh.vn SDK Module
 * Export tất cả functions cho browser
 */

// Config
export {
  NHANH_API_URLS,
  NHANH_API_VERSION,
  NHANH_RATE_LIMIT,
  NHANH_CONFIG,
  isNhanhConfigValid,
  getNhanhAuthUrl,
  getNhanhApiUrl,
} from './config';

// Storage
export {
  storeNhanhToken,
  getStoredNhanhToken,
  clearNhanhToken,
  storeNhanhCredentials,
  getStoredNhanhCredentials,
  clearNhanhCredentials,
  getStoredBusinessId,
} from './storage';

// Supabase Client
export {
  isSupabaseConfigured,
  getNhanhAuthorizationUrl,
  authenticateWithAccessCode,
  getNhanhBusinessInfo,
  validateNhanhToken,
  saveNhanhConnection,
  getUserNhanhConnections,
  removeNhanhConnection,
} from './supabase-client';

// API Client
export {
  getNhanhProducts,
  getNhanhOrders,
  getNhanhOrderDetail,
  getNhanhWarehouses,
  getNhanhCategories,
  getNhanhInventory,
} from './api-client';

export type {
  NhanhProductsResponse,
  NhanhOrdersResponse,
  NhanhWarehousesResponse,
  NhanhCategoriesResponse,
  NhanhInventoryResponse,
  NhanhCategory,
  NhanhInventoryItem,
} from './api-client';

// Types
export type {
  NhanhAccessToken,
  NhanhAppCredentials,
  NhanhBusiness,
  NhanhApiResponse,
  NhanhWarehouse,
  NhanhProduct,
  NhanhProductInventory,
  NhanhOrder,
} from './types';

export {
  NHANH_ERROR_CODES,
  NHANH_SALE_CHANNELS,
  NHANH_CARRIERS,
  NHANH_ORDER_STATUSES,
} from './types';
