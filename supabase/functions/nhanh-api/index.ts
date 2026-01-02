/**
 * Nhanh.vn Data API Edge Function
 * Xử lý các API lấy dữ liệu từ Nhanh.vn API v3.0
 * 
 * API Format v3.0:
 * - URL: https://pos.open.nhanh.vn/v3.0/{endpoint}?appId={appId}&businessId={businessId}
 * - Headers: Authorization: {accessToken}, Content-Type: application/json
 * - Body: JSON với filters và paginator
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const NHANH_API_URL = 'https://pos.open.nhanh.vn';
const NHANH_API_VERSION = 'v3.0';

type ApiAction = 
  | 'get-products'
  | 'get-orders'
  | 'get-warehouses'
  | 'get-categories'
  | 'get-order-detail'
  | 'get-inventory';

interface RequestBody {
  action: ApiAction;
  accessToken: string;
  appId: string;
  businessId: number;
  // Pagination params
  page?: number;
  pageSize?: number;
  // Filter params
  fromDate?: string;
  toDate?: string;
  status?: number;
  orderId?: number;
  depotId?: number;
  categoryId?: number;
  keyword?: string;
  // Paginator next for pagination
  paginatorNext?: Record<string, unknown>;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body: RequestBody = await req.json();
    const { action, accessToken, appId, businessId } = body;

    if (!accessToken || !appId || !businessId) {
      return jsonResponse({ code: 0, errorCode: 'MISSING_AUTH', messages: 'Missing authentication params' }, 400);
    }

    console.log('[nhanh-api] Action:', action, 'BusinessId:', businessId);

    switch (action) {
      case 'get-products':
        return await handleGetProducts(body);
      case 'get-orders':
        return await handleGetOrders(body);
      case 'get-warehouses':
        return await handleGetWarehouses(body);
      case 'get-categories':
        return await handleGetCategories(body);
      case 'get-order-detail':
        return await handleGetOrderDetail(body);
      case 'get-inventory':
        return await handleGetInventory(body);
      default:
        return jsonResponse({ code: 0, errorCode: 'INVALID_ACTION', messages: 'Invalid action' }, 400);
    }
  } catch (error) {
    console.error('[nhanh-api] Error:', error);
    return jsonResponse({ 
      code: 0, 
      errorCode: 'INTERNAL_ERROR', 
      messages: error instanceof Error ? error.message : 'Internal server error' 
    }, 500);
  }
});

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

/**
 * Gọi Nhanh.vn API v3.0
 * Format: POST /v3.0/{endpoint}?appId={appId}&businessId={businessId}
 * Headers: Authorization: {accessToken}
 * Body: JSON với filters và paginator
 */
async function callNhanhApi(
  endpoint: string, 
  body: RequestBody, 
  requestBody: Record<string, unknown> = {}
) {
  const { accessToken, appId, businessId } = body;
  const url = `${NHANH_API_URL}/${NHANH_API_VERSION}/${endpoint}?appId=${appId}&businessId=${businessId}`;
  
  console.log('[nhanh-api] Calling:', url);
  console.log('[nhanh-api] Request body:', JSON.stringify(requestBody));
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': accessToken, // Không có prefix Bearer
      },
      body: JSON.stringify(requestBody),
    });

    const text = await response.text();
    console.log('[nhanh-api] Response status:', response.status);
    console.log('[nhanh-api] Response text:', text.substring(0, 500));
    
    // Parse JSON
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error('[nhanh-api] Failed to parse JSON:', text);
      return { code: 0, errorCode: 'PARSE_ERROR', messages: 'Invalid JSON response from Nhanh.vn' };
    }
    
    return data;
  } catch (error) {
    console.error('[nhanh-api] Fetch error:', error);
    return { 
      code: 0, 
      errorCode: 'FETCH_ERROR', 
      messages: error instanceof Error ? error.message : 'Network error' 
    };
  }
}

/**
 * Lấy danh sách sản phẩm
 * API: POST /v3.0/product/list
 */
async function handleGetProducts(body: RequestBody) {
  const { pageSize = 50, categoryId, keyword, paginatorNext } = body;
  
  // Build filters
  const filters: Record<string, unknown> = {};
  if (categoryId) filters.categoryId = categoryId;
  if (keyword) filters.name = keyword;

  // Build paginator
  const paginator: Record<string, unknown> = {
    size: Math.min(pageSize, 100), // Max 100
    sort: { id: 'desc' },
  };
  if (paginatorNext) {
    paginator.next = paginatorNext;
  }

  const requestBody: Record<string, unknown> = { paginator };
  if (Object.keys(filters).length > 0) {
    requestBody.filters = filters;
  }

  const data = await callNhanhApi('product/list', body, requestBody);
  
  if (data.code === 0) {
    return jsonResponse(data, 400);
  }

  // Transform data - v3.0 trả về array trực tiếp trong data
  const rawProducts = Array.isArray(data.data) ? data.data : Object.values(data.data || {});
  
  // Log first product to debug structure - full detail
  if (rawProducts.length > 0) {
    console.log('[nhanh-api] Sample RAW product:', JSON.stringify(rawProducts[0], null, 2));
    console.log('[nhanh-api] Product keys:', Object.keys(rawProducts[0]));
  }

  // Transform to match our interface - Nhanh v3.0 field mapping
  const products = rawProducts.map((p: Record<string, unknown>) => {
    // v3.0 prices nằm trong object prices
    const prices = p.prices as Record<string, unknown> | undefined;
    // v3.0 inventory là object
    const inventory = p.inventory as Record<string, unknown> | undefined;
    // v3.0 images
    const images = p.images as Record<string, unknown> | undefined;
    
    // Debug log for first few products
    if (rawProducts.indexOf(p) < 2) {
      console.log(`[nhanh-api] Product ${p.id}: prices=`, prices, 'inventory=', inventory, 'images=', images);
    }
    
    return {
      id: p.id || p.productId,
      parentId: p.parentId,
      code: p.code || '',
      barcode: p.barcode || '',
      name: p.name || '',
      otherName: p.otherName,
      status: p.status ?? 1,
      vat: p.vat,
      categoryId: p.categoryId,
      internalCategoryId: p.internalCategoryId,
      brandId: p.brandId,
      type: p.type,
      countryName: p.countryName,
      // Prices - v3.0 format
      prices: prices ? {
        retail: Number(prices.retail) || 0,
        import: Number(prices.import) || 0,
        old: Number(prices.old) || 0,
        wholesale: Number(prices.wholesale) || 0,
        avgCost: Number(prices.avgCost) || 0,
      } : undefined,
      // Legacy price fields for backward compatibility
      price: Number(prices?.retail) || Number(p.price) || 0,
      oldPrice: Number(prices?.old) || Number(p.oldPrice) || 0,
      // Inventory - có thể là object hoặc number
      inventory: inventory ? {
        remain: Number(inventory.remain) || 0,
        shipping: Number(inventory.shipping) || 0,
        damaged: Number(inventory.damaged) || 0,
        holding: Number(inventory.holding) || 0,
        transfering: Number(inventory.transfering) || 0,
        available: Number(inventory.available) || 0,
        depots: inventory.depots,
      } : (typeof p.inventory === 'number' ? p.inventory : 0),
      // Images - v3.0 format
      images: images ? {
        avatar: images.avatar as string || null,
        others: images.others as string[] || [],
      } : null,
      // Shipping
      shipping: p.shipping,
      // Attributes
      attributes: p.attributes,
      // Timestamps
      updatedAt: p.updatedAt,
      createdAt: p.createdAt,
    };
  });

  return jsonResponse({
    code: 1,
    data: {
      products,
      pagination: {
        pageSize,
        hasMore: !!data.paginator?.next,
        next: data.paginator?.next || null,
      },
    },
  });
}

/**
 * Lấy danh sách đơn hàng
 * API: POST /v3.0/order/list
 */
async function handleGetOrders(body: RequestBody) {
  const { pageSize = 50, fromDate, toDate, status, paginatorNext } = body;
  
  // Build filters
  const filters: Record<string, unknown> = {};
  if (fromDate) filters.createdAtFrom = fromDate;
  if (toDate) filters.createdAtTo = toDate;
  if (status) filters.status = status;

  // Build paginator
  const paginator: Record<string, unknown> = {
    size: Math.min(pageSize, 100),
    sort: { id: 'desc' },
  };
  if (paginatorNext) {
    paginator.next = paginatorNext;
  }

  const requestBody: Record<string, unknown> = { paginator };
  if (Object.keys(filters).length > 0) {
    requestBody.filters = filters;
  }

  const data = await callNhanhApi('order/list', body, requestBody);
  
  if (data.code === 0) {
    return jsonResponse(data, 400);
  }

  const orders = Array.isArray(data.data) ? data.data : Object.values(data.data || {});

  return jsonResponse({
    code: 1,
    data: {
      orders,
      pagination: {
        pageSize,
        hasMore: !!data.paginator?.next,
        next: data.paginator?.next || null,
      },
    },
  });
}

/**
 * Lấy chi tiết đơn hàng
 * API: POST /v3.0/order/detail
 */
async function handleGetOrderDetail(body: RequestBody) {
  const { orderId } = body;
  
  if (!orderId) {
    return jsonResponse({ code: 0, errorCode: 'MISSING_ORDER_ID', messages: 'Missing orderId' }, 400);
  }

  const data = await callNhanhApi('order/detail', body, { id: orderId });
  
  if (data.code === 0) {
    return jsonResponse(data, 400);
  }

  return jsonResponse({
    code: 1,
    data: data.data,
  });
}

/**
 * Lấy danh sách kho
 * API: POST /v3.0/config/depot
 * Fallback: POST /v3.0/depot/list
 */
async function handleGetWarehouses(body: RequestBody) {
  // Try config/depot first (v3.0 endpoint)
  let data = await callNhanhApi('config/depot', body, {});
  
  // If config/depot fails, try depot/list as fallback
  if (data.code === 0 && (data.errorCode === 'ERR_404' || data.errorCode === 'ERR_INVALID_FORM_FIELDS')) {
    console.log('[nhanh-api] config/depot failed, trying depot/list');
    data = await callNhanhApi('depot/list', body, {});
  }
  
  if (data.code === 0) {
    // Return empty warehouses instead of error to not break the UI
    console.log('[nhanh-api] Warehouse API error:', data.errorCode, data.messages);
    return jsonResponse({
      code: 1,
      data: {
        warehouses: [],
        error: data.messages || 'Không thể lấy danh sách kho. Vui lòng kiểm tra quyền truy cập.',
      },
    });
  }

  const warehouses = Array.isArray(data.data) ? data.data : Object.values(data.data || {});

  return jsonResponse({
    code: 1,
    data: {
      warehouses,
    },
  });
}

/**
 * Lấy danh sách danh mục
 * API: POST /v3.0/product/category
 */
async function handleGetCategories(body: RequestBody) {
  const data = await callNhanhApi('product/category', body, {});
  
  if (data.code === 0) {
    return jsonResponse(data, 400);
  }

  const categories = Array.isArray(data.data) ? data.data : Object.values(data.data || {});

  return jsonResponse({
    code: 1,
    data: {
      categories,
    },
  });
}

/**
 * Lấy tồn kho
 * API: POST /v3.0/product/inventory
 */
async function handleGetInventory(body: RequestBody) {
  const { pageSize = 50, depotId, paginatorNext } = body;
  
  // Build filters
  const filters: Record<string, unknown> = {};
  if (depotId) filters.depotId = depotId;

  // Build paginator
  const paginator: Record<string, unknown> = {
    size: Math.min(pageSize, 100),
  };
  if (paginatorNext) {
    paginator.next = paginatorNext;
  }

  const requestBody: Record<string, unknown> = { paginator };
  if (Object.keys(filters).length > 0) {
    requestBody.filters = filters;
  }

  const data = await callNhanhApi('product/inventory', body, requestBody);
  
  if (data.code === 0) {
    return jsonResponse(data, 400);
  }

  // Transform data từ API response
  const products = Array.isArray(data.data) ? data.data : Object.values(data.data || {});
  const inventory = products.map((p: Record<string, unknown>) => {
    const inv = p.inventory as Record<string, unknown> || {};
    return {
      productId: p.productId,
      productName: p.name,
      barcode: p.barcode,
      remain: inv.remain || 0,
      shipping: inv.shipping || 0,
      available: inv.available || 0,
      depots: inv.depots || [],
    };
  });

  return jsonResponse({
    code: 1,
    data: {
      inventory,
      pagination: {
        pageSize,
        hasMore: !!data.paginator?.next,
        next: data.paginator?.next || null,
      },
    },
  });
}
