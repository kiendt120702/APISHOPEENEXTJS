-- =============================================
-- Migration: Create Ads Shop-Level Performance Tables
-- Description: Bảng lưu tổng performance của TẤT CẢ ads (shop-level)
-- Dùng để hiển thị Overview chính xác như Shopee Seller Center
-- =============================================

-- 1. Bảng apishopee_ads_shop_performance_daily - Tổng performance theo ngày (shop-level)
-- Lưu dữ liệu từ API get_all_cpc_ads_daily_performance
-- Bao gồm TẤT CẢ loại ads và TẤT CẢ status có data
CREATE TABLE IF NOT EXISTS apishopee_ads_shop_performance_daily (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id BIGINT NOT NULL,
  
  -- Date (YYYY-MM-DD format)
  performance_date DATE NOT NULL,
  
  -- Performance metrics (tổng tất cả campaigns)
  impression BIGINT DEFAULT 0,
  clicks BIGINT DEFAULT 0,
  ctr DECIMAL(10,4) DEFAULT 0,
  expense DECIMAL(15,2) DEFAULT 0,
  direct_order INT DEFAULT 0,
  direct_gmv DECIMAL(15,2) DEFAULT 0,
  broad_order INT DEFAULT 0,
  broad_gmv DECIMAL(15,2) DEFAULT 0,
  direct_item_sold INT DEFAULT 0,
  broad_item_sold INT DEFAULT 0,
  
  -- Calculated metrics
  roas DECIMAL(10,4) DEFAULT 0,
  acos DECIMAL(10,4) DEFAULT 0,
  
  -- Metadata
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint: mỗi shop chỉ có 1 record cho mỗi ngày
  UNIQUE(shop_id, performance_date)
);

-- 2. Bảng apishopee_ads_shop_performance_hourly - Tổng performance theo giờ (shop-level)
-- Lưu dữ liệu từ API get_all_cpc_ads_hourly_performance
CREATE TABLE IF NOT EXISTS apishopee_ads_shop_performance_hourly (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id BIGINT NOT NULL,
  
  -- Date and hour
  performance_date DATE NOT NULL,
  hour INT NOT NULL CHECK (hour >= 0 AND hour <= 23),
  
  -- Performance metrics
  impression BIGINT DEFAULT 0,
  clicks BIGINT DEFAULT 0,
  ctr DECIMAL(10,4) DEFAULT 0,
  expense DECIMAL(15,2) DEFAULT 0,
  direct_order INT DEFAULT 0,
  direct_gmv DECIMAL(15,2) DEFAULT 0,
  broad_order INT DEFAULT 0,
  broad_gmv DECIMAL(15,2) DEFAULT 0,
  direct_item_sold INT DEFAULT 0,
  broad_item_sold INT DEFAULT 0,
  
  -- Calculated metrics
  roas DECIMAL(10,4) DEFAULT 0,
  acos DECIMAL(10,4) DEFAULT 0,
  
  -- Metadata
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint
  UNIQUE(shop_id, performance_date, hour)
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_ads_shop_perf_daily_shop ON apishopee_ads_shop_performance_daily(shop_id);
CREATE INDEX IF NOT EXISTS idx_ads_shop_perf_daily_date ON apishopee_ads_shop_performance_daily(performance_date DESC);
CREATE INDEX IF NOT EXISTS idx_ads_shop_perf_daily_shop_date ON apishopee_ads_shop_performance_daily(shop_id, performance_date DESC);

CREATE INDEX IF NOT EXISTS idx_ads_shop_perf_hourly_shop ON apishopee_ads_shop_performance_hourly(shop_id);
CREATE INDEX IF NOT EXISTS idx_ads_shop_perf_hourly_date ON apishopee_ads_shop_performance_hourly(performance_date DESC, hour);
CREATE INDEX IF NOT EXISTS idx_ads_shop_perf_hourly_shop_date ON apishopee_ads_shop_performance_hourly(shop_id, performance_date DESC);

-- 4. Enable RLS
ALTER TABLE apishopee_ads_shop_performance_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE apishopee_ads_shop_performance_hourly ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
CREATE POLICY "Users can view own shop ads performance daily" ON apishopee_ads_shop_performance_daily
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM apishopee_shops 
      WHERE apishopee_shops.shop_id = apishopee_ads_shop_performance_daily.shop_id 
      AND apishopee_shops.id IN (
        SELECT shop_id FROM apishopee_shop_members 
        WHERE profile_id = auth.uid() AND is_active = true
      )
    )
  );

CREATE POLICY "Users can view own shop ads performance hourly" ON apishopee_ads_shop_performance_hourly
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM apishopee_shops 
      WHERE apishopee_shops.shop_id = apishopee_ads_shop_performance_hourly.shop_id 
      AND apishopee_shops.id IN (
        SELECT shop_id FROM apishopee_shop_members 
        WHERE profile_id = auth.uid() AND is_active = true
      )
    )
  );

-- 6. Service role bypass policies
CREATE POLICY "Service role full access shop_performance_daily" ON apishopee_ads_shop_performance_daily
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access shop_performance_hourly" ON apishopee_ads_shop_performance_hourly
  FOR ALL USING (auth.role() = 'service_role');

-- 7. Enable Realtime
ALTER TABLE apishopee_ads_shop_performance_daily REPLICA IDENTITY FULL;
ALTER TABLE apishopee_ads_shop_performance_hourly REPLICA IDENTITY FULL;

-- 8. Comments
COMMENT ON TABLE apishopee_ads_shop_performance_daily IS 'Tổng performance quảng cáo theo ngày (shop-level) - từ get_all_cpc_ads_daily_performance';
COMMENT ON TABLE apishopee_ads_shop_performance_hourly IS 'Tổng performance quảng cáo theo giờ (shop-level) - từ get_all_cpc_ads_hourly_performance';
