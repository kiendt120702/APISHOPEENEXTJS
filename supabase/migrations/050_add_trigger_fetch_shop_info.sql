-- Migration: Tự động fetch shop info khi tạo shop mới
-- Tạo trigger để gọi edge function fetch shop info sau khi insert shop

-- Function để gọi edge function fetch shop info
CREATE OR REPLACE FUNCTION fetch_shop_info_after_insert()
RETURNS TRIGGER AS $$
BEGIN
  -- Chỉ fetch nếu shop_name hoặc shop_logo NULL
  IF NEW.shop_name IS NULL OR NEW.shop_logo IS NULL THEN
    -- Gọi edge function qua pg_net (nếu có extension)
    -- Hoặc để client tự fetch sau khi insert
    -- Ở đây ta chỉ log để debug
    RAISE NOTICE 'Shop % needs info fetch: shop_name=%, shop_logo=%', 
      NEW.shop_id, NEW.shop_name, NEW.shop_logo;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Tạo trigger
DROP TRIGGER IF EXISTS trigger_fetch_shop_info ON apishopee_shops;
CREATE TRIGGER trigger_fetch_shop_info
  AFTER INSERT ON apishopee_shops
  FOR EACH ROW
  EXECUTE FUNCTION fetch_shop_info_after_insert();

-- Comment
COMMENT ON FUNCTION fetch_shop_info_after_insert() IS 
  'Log when a shop needs info fetch after insert. Client should call shopee-shop edge function.';
