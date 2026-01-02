/**
 * Nhanh.vn API Client
 * Gọi Edge Function để lấy dữ liệu từ Nhanh.vn
 */

import { supabase } from '../supabase';
import type { NhanhProduct, NhanhOrder, NhanhWarehouse } from './types';

interface NhanhApiParams {
  accessToken: string;
  appId: string;
  businessId: number;
}

interface PaginationParams {
  pageSize?: number;
  paginatorNext?: Record<string, unknown>;
}

interface DateRangeParams {
  fromDate?: string;
  toDate?: string;
}

// Response types
export interface NhanhProductsResponse {
  products: NhanhProduct[];
  pagination: {
    pageSize: number;
    hasMore: boolean;
    next: Record<string, unknown> | null;
  };
}

export interface NhanhOrdersResponse {
  orders: NhanhOrder[];
  pagination: {
    pageSize: number;
    hasMore: boolean;
    next: Record<string, unknown> | null;
  };
}

export interface NhanhWarehousesResponse {
  warehouses: NhanhWarehouse[];
}

export interface NhanhCategory {
  id: number;
  name: string;
  parentId?: number;
  level?: number;
}

export interface NhanhCategoriesResponse {
  categories: NhanhCategory[];
}

export interface NhanhInventoryItem {
  productId: number;
  productName: string;
  remain: number;
  depotId: number;
  depotName?: string;
}

export interface NhanhInventoryResponse {
  inventory: NhanhInventoryItem[];
  pagination: {
    pageSize: number;
    hasMore: boolean;
    next: Record<string, unknown> | null;
  };
}

/**
 * Gọi Nhanh API Edge Function
 */
async function callNhanhApi<T>(
  action: string,
  params: NhanhApiParams,
  extraParams: Record<string, unknown> = {}
): Promise<T> {
  const { data, error } = await supabase.functions.invoke('nhanh-api', {
    body: {
      action,
      ...params,
      ...extraParams,
    },
  });

  if (error) {
    console.error('[NhanhAPI] Error:', error);
    throw new Error(error.message || 'API call failed');
  }

  if (data.code === 0) {
    throw new Error(data.messages || data.errorCode || 'API error');
  }

  return data.data as T;
}

/**
 * Lấy danh sách sản phẩm
 */
export async function getNhanhProducts(
  params: NhanhApiParams,
  options: PaginationParams & { categoryId?: number; keyword?: string } = {}
): Promise<NhanhProductsResponse> {
  return callNhanhApi<NhanhProductsResponse>('get-products', params, { ...options });
}

/**
 * Lấy danh sách đơn hàng
 */
export async function getNhanhOrders(
  params: NhanhApiParams,
  options: PaginationParams & DateRangeParams & { status?: number } = {}
): Promise<NhanhOrdersResponse> {
  return callNhanhApi<NhanhOrdersResponse>('get-orders', params, { ...options });
}

/**
 * Lấy chi tiết đơn hàng
 */
export async function getNhanhOrderDetail(
  params: NhanhApiParams,
  orderId: number
): Promise<NhanhOrder> {
  return callNhanhApi<NhanhOrder>('get-order-detail', params, { orderId });
}

/**
 * Lấy danh sách kho
 */
export async function getNhanhWarehouses(
  params: NhanhApiParams
): Promise<NhanhWarehousesResponse> {
  return callNhanhApi<NhanhWarehousesResponse>('get-warehouses', params);
}

/**
 * Lấy danh sách danh mục
 */
export async function getNhanhCategories(
  params: NhanhApiParams
): Promise<NhanhCategoriesResponse> {
  return callNhanhApi<NhanhCategoriesResponse>('get-categories', params);
}

/**
 * Lấy tồn kho
 */
export async function getNhanhInventory(
  params: NhanhApiParams,
  options: PaginationParams & { depotId?: number } = {}
): Promise<NhanhInventoryResponse> {
  return callNhanhApi<NhanhInventoryResponse>('get-inventory', params, { ...options });
}
