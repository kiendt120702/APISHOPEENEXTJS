/**
 * Auth Callback - Xử lý OAuth callback từ Shopee
 */

import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useShopeeAuth } from '@/hooks/useShopeeAuth';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handleCallback } = useShopeeAuth();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const processedRef = useRef(false);

  useEffect(() => {
    // Đợi auth load xong trước khi xử lý callback
    if (authLoading) return;
    
    // Tránh xử lý nhiều lần
    if (processedRef.current || isProcessing) return;

    const processCallback = async () => {
      const code = searchParams.get('code');
      const shopId = searchParams.get('shop_id');
      const errorParam = searchParams.get('error');

      if (errorParam) {
        const errorMsg = `Shopee authorization failed: ${errorParam}`;
        setError(errorMsg);
        toast({
          title: "Kết nối thất bại",
          description: errorMsg,
          variant: "destructive",
        });
        return;
      }

      if (!code) {
        const errorMsg = 'Missing authorization code';
        setError(errorMsg);
        toast({
          title: "Kết nối thất bại",
          description: "Thiếu mã xác thực từ Shopee",
          variant: "destructive",
        });
        return;
      }

      // Kiểm tra user đã đăng nhập chưa
      if (!isAuthenticated) {
        const errorMsg = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
        setError(errorMsg);
        toast({
          title: "Phiên đăng nhập hết hạn",
          description: "Vui lòng đăng nhập lại để tiếp tục",
          variant: "destructive",
        });
        return;
      }

      processedRef.current = true;
      setIsProcessing(true);

      try {
        await handleCallback(code, shopId ? Number(shopId) : undefined);
        
        // Hiển thị toast thành công
        toast({
          title: "Kết nối thành công! 🎉",
          description: "Shop Shopee đã được liên kết với tài khoản của bạn.",
        });
        
        // Dùng navigate với state để báo cho ShopsSettingsPage reload data
        // Thêm ?refresh param để trigger reload trong ShopManagementPanel
        navigate('/settings/shops?refresh=' + Date.now(), { replace: true });
      } catch (err) {
        processedRef.current = false;
        const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
        setError(errorMessage);
        
        // Hiển thị toast thất bại
        toast({
          title: "Kết nối thất bại",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    };

    processCallback();
  }, [searchParams, handleCallback, navigate, authLoading, isAuthenticated, isProcessing]);

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-800 mb-2">Xác thực thất bại</h1>
          <p className="text-slate-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/auth')}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Quay lại đăng nhập
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-600">Đang xác thực với Shopee...</p>
      </div>
    </div>
  );
}
