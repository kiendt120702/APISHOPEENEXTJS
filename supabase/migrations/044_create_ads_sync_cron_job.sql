-- Migration: Create cron job for ads sync
-- Tự động sync dữ liệu quảng cáo từ Shopee API
-- 
-- CHIẾN LƯỢC SYNC:
-- 1. Realtime sync (15 phút/lần): Chỉ sync ongoing campaigns, chỉ hôm nay → nhanh
-- 2. Incremental backfill (mỗi ngày 2AM): Sync từng ngày một, 7 ngày → tránh timeout
--
-- LÝ DO INCREMENTAL:
-- - Shopee API có giới hạn URL length (~2000 chars)
-- - Shops có nhiều campaigns (100-900+) sẽ timeout nếu sync 7 ngày cùng lúc
-- - Chia nhỏ: mỗi lần sync 1 ngày, 50 campaigns/batch → ổn định

-- 1. Tạo function để sync ads cho tất cả shops (REALTIME - chỉ ongoing campaigns, chỉ hôm nay)
CREATE OR REPLACE FUNCTION sync_all_shops_ads()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  shop_record RECORD;
  result JSONB;
BEGIN
  FOR shop_record IN 
    SELECT shop_id 
    FROM apishopee_shops 
    WHERE access_token IS NOT NULL 
      AND access_token != ''
  LOOP
    BEGIN
      SELECT net.http_post(
        url := 'https://ohlwhhxhgpotlwfgqhhu.supabase.co/functions/v1/apishopee-ads-sync',
        headers := '{"Content-Type": "application/json"}'::jsonb,
        body := jsonb_build_object('action', 'sync', 'shop_id', shop_record.shop_id)
      ) INTO result;
      RAISE NOTICE 'Synced ads for shop %', shop_record.shop_id;
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'Failed to sync ads for shop %: %', shop_record.shop_id, SQLERRM;
    END;
  END LOOP;
END;
$$;

-- 2. Tạo function để INCREMENTAL backfill ads cho 1 ngày cụ thể
CREATE OR REPLACE FUNCTION backfill_all_shops_ads_day(days_ago INTEGER DEFAULT 0)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  shop_record RECORD;
  result JSONB;
BEGIN
  RAISE NOTICE 'Starting incremental backfill for day % ago', days_ago;
  
  FOR shop_record IN 
    SELECT shop_id 
    FROM apishopee_shops 
    WHERE access_token IS NOT NULL 
      AND access_token != ''
  LOOP
    BEGIN
      SELECT net.http_post(
        url := 'https://ohlwhhxhgpotlwfgqhhu.supabase.co/functions/v1/apishopee-ads-sync',
        headers := '{"Content-Type": "application/json"}'::jsonb,
        body := jsonb_build_object(
          'action', 'sync_day',
          'shop_id', shop_record.shop_id,
          'days_ago', days_ago,
          'use_all_campaigns', true
        )
      ) INTO result;
      RAISE NOTICE 'Backfilled day % for shop %', days_ago, shop_record.shop_id;
      PERFORM pg_sleep(1);
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'Failed to backfill day % for shop %: %', days_ago, shop_record.shop_id, SQLERRM;
    END;
  END LOOP;
END;
$$;

-- 3. Tạo function wrapper để backfill 7 ngày (gọi incremental 7 lần)
CREATE OR REPLACE FUNCTION backfill_all_shops_ads_7days()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RAISE NOTICE '=== Starting 7-day incremental backfill ===';
  
  PERFORM backfill_all_shops_ads_day(0);
  PERFORM pg_sleep(5);
  PERFORM backfill_all_shops_ads_day(1);
  PERFORM pg_sleep(5);
  PERFORM backfill_all_shops_ads_day(2);
  PERFORM pg_sleep(5);
  PERFORM backfill_all_shops_ads_day(3);
  PERFORM pg_sleep(5);
  PERFORM backfill_all_shops_ads_day(4);
  PERFORM pg_sleep(5);
  PERFORM backfill_all_shops_ads_day(5);
  PERFORM pg_sleep(5);
  PERFORM backfill_all_shops_ads_day(6);
  
  RAISE NOTICE '=== 7-day incremental backfill completed ===';
END;
$$;


-- 4. Tạo cron job sync ads mỗi 15 phút (realtime mode - nhanh)
SELECT cron.schedule(
  'ads-sync-job',
  '*/15 * * * *',
  $$SELECT sync_all_shops_ads();$$
);

-- 5. Tạo cron job backfill ads mỗi ngày lúc 2:00 AM Vietnam (19:00 UTC)
SELECT cron.schedule(
  'ads-backfill-job',
  '0 19 * * *',
  $$SELECT backfill_all_shops_ads_7days();$$
);

-- 6. Comments
COMMENT ON FUNCTION sync_all_shops_ads() IS 'Realtime sync: Chỉ ongoing campaigns, chỉ hôm nay (15 phút/lần)';
COMMENT ON FUNCTION backfill_all_shops_ads_day(INTEGER) IS 'Incremental backfill: Sync 1 ngày cụ thể cho tất cả shops';
COMMENT ON FUNCTION backfill_all_shops_ads_7days() IS 'Full backfill: Sync 7 ngày incremental để cập nhật GMV attribution (1 lần/ngày, 2AM)';