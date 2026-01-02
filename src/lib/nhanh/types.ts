/**
 * Nhanh.vn API Types
 */

// Access Token từ Nhanh.vn (có hạn 1 năm)
export interface NhanhAccessToken {
  accessToken: string;
  businessId: number;
  businessName?: string;
  expiredAt?: number; // Unix timestamp
  depotIds?: number[] | 'All';
  pageIds?: number[] | 'All';
  permissions?: string[];
  version?: string;
  createdAt?: number;
}

// App credentials
export interface NhanhAppCredentials {
  appId: string;
  secretKey: string;
  appName?: string;
  redirectUrl?: string;
}

// Business info từ Nhanh.vn
export interface NhanhBusiness {
  id: number;
  name: string;
  logo?: string;
  phone?: string;
  email?: string;
  address?: string;
}

// API Response chung
export interface NhanhApiResponse<T = unknown> {
  code: 0 | 1;
  data?: T;
  errorCode?: string;
  messages?: string | Record<string, string>;
}

// Warehouse/Depot info
export interface NhanhWarehouse {
  id: number;
  name: string;
  address?: string;
  phone?: string;
  isDefault?: boolean;
}

// Product từ Nhanh.vn
export interface NhanhProduct {
  id: number;
  code?: string;
  barcode?: string;
  name: string;
  price: number;
  oldPrice?: number;
  status: number;
  categoryId?: number;
  brandId?: number;
  inventory?: number;
}

// Order từ Nhanh.vn
export interface NhanhOrder {
  id: number;
  orderId?: string;
  customerName?: string;
  customerMobile?: string;
  customerAddress?: string;
  status: number;
  statusName?: string;
  totalMoney: number;
  shipFee?: number;
  codFee?: number;
  carrierId?: number;
  carrierName?: string;
  createdDateTime?: string;
}

// Error codes
export const NHANH_ERROR_CODES = {
  ERR_INVALID_APP_ID: 'Invalid appId',
  ERR_INVALID_BUSINESS_ID: 'Invalid businessId',
  ERR_INVALID_ACCESS_TOKEN: 'Invalid access token',
  ERR_INVALID_VERSION: 'Invalid version',
  ERR_EXCEEDED_RATE_LIMIT: 'App exceeded the API Rate Limit',
  ERR_BUSINESS_NOT_ENABLE_API: 'Business has not enabled API',
  ERR_INVALID_FORM_FIELDS: 'Invalid form fields',
  ERR_INVALID_DATA: 'Invalid data',
  ERR_403: 'Access denied',
  ERR_429: 'Rate limit exceeded',
} as const;

// Sale channels
export const NHANH_SALE_CHANNELS = {
  1: 'Admin',
  2: 'Website',
  10: 'API',
  20: 'Facebook',
  21: 'Instagram',
  41: 'Lazada',
  42: 'Shopee',
  43: 'Sendo',
  45: 'Tiki',
  48: 'Tiktok',
  49: 'Zalo OA',
  50: 'Shopee chat',
  51: 'Lazada chat',
  52: 'Zalo cá nhân',
} as const;

// Carriers
export const NHANH_CARRIERS = {
  2: 'Viettel',
  5: 'Giao hàng nhanh',
  8: 'Giao hàng tiết kiệm',
  12: 'Tự vận chuyển',
  18: 'Ahamove',
  22: 'Việt Nam Post',
  24: 'JT Express',
  25: 'EMS',
  26: 'Best Express',
  27: 'NinjaVan',
  28: 'SuperShip',
  29: 'SPX',
  30: 'LEX',
  31: 'Grab',
} as const;

// Order statuses
export const NHANH_ORDER_STATUSES = {
  40: 'Đã đóng gói',
  42: 'Đang đóng gói',
  43: 'Chờ thu gom',
  54: 'Đơn mới',
  55: 'Đang xác nhận',
  56: 'Đã xác nhận',
  57: 'Chờ khách xác nhận',
  58: 'Hãng vận chuyển hủy đơn',
  59: 'Đang chuyển',
  60: 'Thành công',
  61: 'Thất bại',
  63: 'Khách hủy',
  64: 'Hệ thống hủy',
  68: 'Hết hàng',
  71: 'Đang chuyển hoàn',
  72: 'Đã chuyển hoàn',
  73: 'Đổi kho xuất hàng',
  74: 'Xác nhận hoàn',
} as const;
