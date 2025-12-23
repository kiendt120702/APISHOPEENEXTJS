/**
 * Demo Data - Dữ liệu mẫu cho Shopee API Review
 * Hiển thị khi đăng nhập với tài khoản test để chứng minh tính năng e-commerce
 */

// Demo Shop Info
export const DEMO_SHOP = {
  shop_id: 123456789,
  shop_name: 'BETACOM Demo Shop',
  shop_logo: 'https://cf.shopee.vn/file/default_shop_logo',
  region: 'VN',
  is_active: true,
};

// Demo Flash Sales
export const DEMO_FLASH_SALES = [
  {
    flash_sale_id: 1001,
    start_time: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
    end_time: Math.floor(Date.now() / 1000) + 7200,
    status: 'upcoming',
    type: 'flash_sale',
    items: [
      { item_id: 10001, name: 'Áo thun nam cao cấp', original_price: 250000, flash_sale_price: 149000, stock: 100, sold: 45 },
      { item_id: 10002, name: 'Quần jean nữ slim fit', original_price: 450000, flash_sale_price: 299000, stock: 50, sold: 32 },
      { item_id: 10003, name: 'Giày sneaker unisex', original_price: 650000, flash_sale_price: 399000, stock: 30, sold: 18 },
    ],
  },
  {
    flash_sale_id: 1002,
    start_time: Math.floor(Date.now() / 1000) - 1800, // Started 30 mins ago
    end_time: Math.floor(Date.now() / 1000) + 1800,
    status: 'ongoing',
    type: 'flash_sale',
    items: [
      { item_id: 10004, name: 'Túi xách nữ thời trang', original_price: 350000, flash_sale_price: 199000, stock: 80, sold: 67 },
      { item_id: 10005, name: 'Đồng hồ nam dây da', original_price: 890000, flash_sale_price: 499000, stock: 25, sold: 21 },
    ],
  },
  {
    flash_sale_id: 1003,
    start_time: Math.floor(Date.now() / 1000) - 86400, // Yesterday
    end_time: Math.floor(Date.now() / 1000) - 82800,
    status: 'ended',
    type: 'flash_sale',
    items: [
      { item_id: 10006, name: 'Balo laptop chống nước', original_price: 550000, flash_sale_price: 329000, stock: 40, sold: 40 },
    ],
  },
];

// Demo Scheduled Tasks
export const DEMO_SCHEDULED_TASKS = [
  {
    id: 'task-001',
    flash_sale_id: 1001,
    item_id: 10001,
    item_name: 'Áo thun nam cao cấp',
    scheduled_time: new Date(Date.now() + 3600000).toISOString(),
    status: 'pending',
    action: 'register',
  },
  {
    id: 'task-002',
    flash_sale_id: 1001,
    item_id: 10002,
    item_name: 'Quần jean nữ slim fit',
    scheduled_time: new Date(Date.now() + 3600000).toISOString(),
    status: 'pending',
    action: 'register',
  },
  {
    id: 'task-003',
    flash_sale_id: 1002,
    item_id: 10004,
    item_name: 'Túi xách nữ thời trang',
    scheduled_time: new Date(Date.now() - 1800000).toISOString(),
    status: 'completed',
    action: 'register',
  },
];

// Demo Ads Campaigns
export const DEMO_CAMPAIGNS = [
  {
    campaign_id: 2001,
    ad_type: 'auto' as const,
    name: 'Chiến dịch tự động - Áo thun',
    status: 'ongoing',
    common_info: {
      ad_type: 'auto' as const,
      ad_name: 'Chiến dịch tự động - Áo thun',
      campaign_status: 'ongoing',
      campaign_placement: 'all',
      bidding_method: 'auto',
      campaign_budget: 500000,
      campaign_duration: {
        start_time: Math.floor(Date.now() / 1000) - 86400 * 7,
        end_time: Math.floor(Date.now() / 1000) + 86400 * 23,
      },
      item_id_list: [10001, 10002, 10003],
    },
    roas_target: 3.5,
  },
  {
    campaign_id: 2002,
    ad_type: 'manual' as const,
    name: 'Chiến dịch thủ công - Giày dép',
    status: 'ongoing',
    common_info: {
      ad_type: 'manual' as const,
      ad_name: 'Chiến dịch thủ công - Giày dép',
      campaign_status: 'ongoing',
      campaign_placement: 'search',
      bidding_method: 'manual',
      campaign_budget: 300000,
      campaign_duration: {
        start_time: Math.floor(Date.now() / 1000) - 86400 * 3,
        end_time: Math.floor(Date.now() / 1000) + 86400 * 27,
      },
      item_id_list: [10003],
    },
  },
  {
    campaign_id: 2003,
    ad_type: 'auto' as const,
    name: 'Chiến dịch Flash Sale',
    status: 'paused',
    common_info: {
      ad_type: 'auto' as const,
      ad_name: 'Chiến dịch Flash Sale',
      campaign_status: 'paused',
      campaign_placement: 'discovery',
      bidding_method: 'auto',
      campaign_budget: 200000,
      campaign_duration: {
        start_time: Math.floor(Date.now() / 1000) - 86400 * 14,
        end_time: Math.floor(Date.now() / 1000) + 86400 * 16,
      },
      item_id_list: [10004, 10005],
    },
    roas_target: 2.8,
  },
];

// Demo Budget Schedules
export const DEMO_BUDGET_SCHEDULES = [
  {
    id: 'schedule-001',
    campaign_id: 2001,
    campaign_name: 'Chiến dịch tự động - Áo thun',
    budget: 800000,
    scheduled_time: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    status: 'pending',
  },
  {
    id: 'schedule-002',
    campaign_id: 2002,
    campaign_name: 'Chiến dịch thủ công - Giày dép',
    budget: 500000,
    scheduled_time: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
    status: 'pending',
  },
];

// Demo Products
export const DEMO_PRODUCTS = [
  { item_id: 10001, name: 'Áo thun nam cao cấp', price: 250000, stock: 500, sold: 1234, rating: 4.8 },
  { item_id: 10002, name: 'Quần jean nữ slim fit', price: 450000, stock: 300, sold: 856, rating: 4.7 },
  { item_id: 10003, name: 'Giày sneaker unisex', price: 650000, stock: 200, sold: 567, rating: 4.9 },
  { item_id: 10004, name: 'Túi xách nữ thời trang', price: 350000, stock: 400, sold: 2341, rating: 4.6 },
  { item_id: 10005, name: 'Đồng hồ nam dây da', price: 890000, stock: 150, sold: 432, rating: 4.8 },
  { item_id: 10006, name: 'Balo laptop chống nước', price: 550000, stock: 250, sold: 789, rating: 4.7 },
];

// Demo Statistics
export const DEMO_STATS = {
  total_products: 156,
  total_orders_today: 47,
  total_revenue_today: 12500000,
  total_flash_sales_active: 2,
  total_campaigns_active: 2,
  conversion_rate: 3.2,
};

// Check if current user is demo account
export function isDemoAccount(email?: string): boolean {
  if (!email) return false;
  
  const emailLower = email.toLowerCase();
  
  // Danh sách email demo cụ thể
  const demoEmails = [
    'kiendt120702@gmail.com',
    'demo@betacom.agency',
    'test@betacom.agency',
    'reviewer@shopee.com',
    'admin@betacom.agency',
  ];
  
  if (demoEmails.includes(emailLower)) return true;
  
  // Cho phép tất cả email có pattern demo/test/review
  if (emailLower.includes('demo') || 
      emailLower.includes('test') || 
      emailLower.includes('review') ||
      emailLower.includes('shopee')) {
    return true;
  }
  
  return false;
}

// Demo Token for demo mode
export const DEMO_TOKEN = {
  access_token: 'demo_access_token_for_review',
  refresh_token: 'demo_refresh_token_for_review',
  shop_id: DEMO_SHOP.shop_id,
  expired_at: Math.floor(Date.now() / 1000) + 86400 * 30, // 30 days
  expire_in: 86400 * 30,
};
