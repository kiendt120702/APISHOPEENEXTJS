-- =====================================================
-- Migration: Cleanup Unused Tables - Keep Only Shop Management
-- Date: 2025-01-09
-- Description: Xóa tất cả các bảng không liên quan đến chức năng
--              quản lý shop Shopee. Chỉ giữ lại:
--              - sys_profiles
--              - apishopee_shops
--              - apishopee_shop_members
--              - apishopee_roles
--              - apishopee_token_refresh_logs
-- =====================================================

-- Disable triggers temporarily
SET session_replication_role = 'replica';

-- =====================================================
-- DROP APISHOPEE TABLES (không cần thiết)
-- =====================================================

-- Drop keyword tracking tables
DROP TABLE IF EXISTS apishopee_keyword_volume_history CASCADE;
DROP TABLE IF EXISTS apishopee_keyword_tracking CASCADE;
DROP TABLE IF EXISTS apishopee_keyword_history CASCADE;

-- Drop products table
DROP TABLE IF EXISTS apishopee_products CASCADE;

-- Drop sync tables
DROP TABLE IF EXISTS apishopee_sync_jobs CASCADE;
DROP TABLE IF EXISTS apishopee_sync_status CASCADE;

-- Drop scheduler tables
DROP TABLE IF EXISTS apishopee_scheduler_logs CASCADE;
DROP TABLE IF EXISTS apishopee_scheduled_flash_sales CASCADE;

-- Drop flash sale tables
DROP TABLE IF EXISTS apishopee_flash_sale_data CASCADE;

-- Drop ads tables
DROP TABLE IF EXISTS apishopee_ads_budget_logs CASCADE;
DROP TABLE IF EXISTS apishopee_scheduled_ads_budget CASCADE;
DROP TABLE IF EXISTS apishopee_ads_campaign_data CASCADE;

-- Drop account health table
DROP TABLE IF EXISTS apishopee_account_health_data CASCADE;

-- =====================================================
-- DROP EDUCATION TABLES
-- =====================================================

DROP TABLE IF EXISTS edu_attendance_permissions CASCADE;
DROP TABLE IF EXISTS edu_test_answers CASCADE;
DROP TABLE IF EXISTS edu_test_submissions CASCADE;
DROP TABLE IF EXISTS edu_test_permissions CASCADE;
DROP TABLE IF EXISTS edu_test_config_questions CASCADE;
DROP TABLE IF EXISTS edu_test_config_lesson_sources CASCADE;
DROP TABLE IF EXISTS edu_test_configs CASCADE;
DROP TABLE IF EXISTS edu_test_questions CASCADE;
DROP TABLE IF EXISTS edu_watch_progress CASCADE;
DROP TABLE IF EXISTS edu_learning_sessions CASCADE;
DROP TABLE IF EXISTS edu_lesson_ranks CASCADE;
DROP TABLE IF EXISTS edu_lesson_recaps CASCADE;
DROP TABLE IF EXISTS edu_lesson_submissions CASCADE;
DROP TABLE IF EXISTS lesson_pinned_documents CASCADE;
DROP TABLE IF EXISTS edu_offline_registrations CASCADE;
DROP TABLE IF EXISTS edu_offline_schedules CASCADE;
DROP TABLE IF EXISTS edu_module_enrollments CASCADE;
DROP TABLE IF EXISTS edu_module_individual_access CASCADE;
DROP TABLE IF EXISTS edu_module_role_access CASCADE;
DROP TABLE IF EXISTS edu_module_department_access CASCADE;
DROP TABLE IF EXISTS edu_module_access_audit CASCADE;
DROP TABLE IF EXISTS edu_module_access_policies CASCADE;
DROP TABLE IF EXISTS edu_lessons CASCADE;
DROP TABLE IF EXISTS edu_modules CASCADE;

-- =====================================================
-- DROP REPOSITORY TABLES
-- =====================================================

DROP TABLE IF EXISTS repository_item_permissions CASCADE;
DROP TABLE IF EXISTS repository_items CASCADE;
DROP TABLE IF EXISTS repository_categories CASCADE;

-- =====================================================
-- DROP VELAS E-COMMERCE TABLES
-- =====================================================

DROP TABLE IF EXISTS velas_promotion_settings CASCADE;
DROP TABLE IF EXISTS velas_promotions CASCADE;
DROP TABLE IF EXISTS velas_faqs CASCADE;
DROP TABLE IF EXISTS velas_stores CASCADE;
DROP TABLE IF EXISTS velas_site_content CASCADE;
DROP TABLE IF EXISTS velas_orders CASCADE;
DROP TABLE IF EXISTS velas_wishlist_items CASCADE;
DROP TABLE IF EXISTS velas_cart_items CASCADE;
DROP TABLE IF EXISTS velas_spotlight_items CASCADE;
DROP TABLE IF EXISTS velas_featured_banners CASCADE;
DROP TABLE IF EXISTS velas_hero_images CASCADE;
DROP TABLE IF EXISTS velas_products CASCADE;
DROP TABLE IF EXISTS velas_categories CASCADE;
DROP TABLE IF EXISTS velas_profiles CASCADE;

-- =====================================================
-- DROP SHOPEE/TIKTOK SHOP MANAGEMENT TABLES
-- =====================================================

DROP TABLE IF EXISTS shopee_reports CASCADE;
DROP TABLE IF EXISTS shopee_comprehensive_reports CASCADE;
DROP TABLE IF EXISTS shopee_shops CASCADE;
DROP TABLE IF EXISTS tiktok_comprehensive_reports CASCADE;
DROP TABLE IF EXISTS tiktok_shops CASCADE;

-- =====================================================
-- DROP BOOKING & THUMBNAIL TABLES
-- =====================================================

DROP TABLE IF EXISTS booking_data CASCADE;
DROP TABLE IF EXISTS thumbnail_banners CASCADE;
DROP TABLE IF EXISTS thumbnail_categories CASCADE;
DROP TABLE IF EXISTS thumbnail_types CASCADE;

-- =====================================================
-- DROP NHANH CONNECTION TABLE
-- =====================================================

DROP TABLE IF EXISTS nhanh_connections CASCADE;

-- =====================================================
-- DROP SYSTEM TABLES (không cần thiết)
-- =====================================================

DROP TABLE IF EXISTS sys_lark_notification_log CASCADE;
DROP TABLE IF EXISTS sys_lark_config CASCADE;
DROP TABLE IF EXISTS sys_profile_departments CASCADE;
DROP TABLE IF EXISTS sys_roles CASCADE;
DROP TABLE IF EXISTS sys_departments CASCADE;

-- =====================================================
-- DROP API KEYS TABLE
-- =====================================================

DROP TABLE IF EXISTS api_keys CASCADE;

-- =====================================================
-- CLEAN UP ENUMS (không còn dùng)
-- =====================================================

DROP TYPE IF EXISTS banner_status CASCADE;
DROP TYPE IF EXISTS edu_lesson_type CASCADE;
DROP TYPE IF EXISTS shopee_shop_status CASCADE;
DROP TYPE IF EXISTS tiktok_shop_status CASCADE;
DROP TYPE IF EXISTS tiktok_shop_type CASCADE;
DROP TYPE IF EXISTS work_type CASCADE;

-- =====================================================
-- VERIFY REMAINING TABLES
-- =====================================================

-- Chỉ còn lại 5 bảng:
-- 1. sys_profiles
-- 2. apishopee_shops
-- 3. apishopee_shop_members
-- 4. apishopee_roles
-- 5. apishopee_token_refresh_logs

-- Re-enable triggers
SET session_replication_role = 'origin';

-- Add comment
COMMENT ON TABLE sys_profiles IS 'User profiles - linked to auth.users';
COMMENT ON TABLE apishopee_shops IS 'Shopee shops connected via OAuth';
COMMENT ON TABLE apishopee_shop_members IS 'User-shop relationships with roles';
COMMENT ON TABLE apishopee_roles IS 'Roles for shop members (admin, member)';
COMMENT ON TABLE apishopee_token_refresh_logs IS 'Logs for automatic token refresh';
