-- Migration: Create cron job for products sync
-- Tự động sync dữ liệu sản phẩm từ Shopee API mỗi giờ

-- 1. Tạo function để sync products cho tất cả shops
CREATE OR REPLACE FUNCTION sync_all_shops_products()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  shop_record RECORD;
  user_record RECORD;
  result JSONB;
BEGIN
  -- Lấy tất cả shops có access_token hợp lệ kèm user_id
  FOR shop_record IN 
    SELECT DISTINCT s.shop_id, su.user_id
    FROM apishopee_shops s
    JOIN apishopee_shop_users su ON s.shop_id = su.shop_id
    WHERE s.access_token IS NOT NULL 
      AND s.access_token != ''
  LOOP
    BEGIN
      -- Gọi edge function để sync từng shop
      SELECT net.http_post(
        url := 'https://ohlwhhxhgpotlwfgqhhu.supabase.co/functions/v1/apishopee-product',
        headers := '{"Content-Type": "application/json"}'::jsonb,
        body := jsonb_build_object(
          'action', 'sync-products', 
          'shop_id', shop_record.shop_id,
          'user_id', shop_record.user_id
        ),
        timeout_milliseconds := 120000
      ) INTO result;
      
      RAISE NOTICE 'Synced products for shop % (user %)', shop_record.shop_id, shop_record.user_id;
      
      -- Delay 5 giây giữa các shop để tránh rate limit (product sync nặng hơn)
      PERFORM pg_sleep(5);
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'Failed to sync products for shop %: %', shop_record.shop_id, SQLERRM;
    END;
  END LOOP;
END;
$$;

-- 2. Tạo cron job sync products mỗi giờ
SELECT cron.schedule(
  'products-sync-job',
  '0 * * * *',  -- Mỗi giờ vào phút 0
  $$SELECT sync_all_shops_products();$$
);

-- 3. Comments
COMMENT ON FUNCTION sync_all_shops_products() IS 'Sync products data từ Shopee API cho tất cả shops - chạy mỗi giờ';
