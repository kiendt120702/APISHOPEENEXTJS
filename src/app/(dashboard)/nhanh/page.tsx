"use client";

/**
 * Nhanh.vn Dashboard - Redirect to Products
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUnifiedShop } from "@/contexts/UnifiedShopContext";

export default function NhanhPage() {
  const router = useRouter();
  const { selectedShop } = useUnifiedShop();

  useEffect(() => {
    // Redirect to products page
    router.replace("/nhanh/products");
  }, [router]);

  // Kiểm tra shop đang chọn có phải Nhanh không
  if (!selectedShop || selectedShop.platform !== 'nhanh') {
    return (
      <div className="p-6">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-amber-800 mb-2">Chưa chọn shop Nhanh.vn</h3>
          <p className="text-amber-600">
            Vui lòng chọn một shop Nhanh.vn từ menu Shop Switcher để xem dữ liệu.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
}
