"use client";

/**
 * Nhanh.vn - Danh sách sản phẩm
 */

import { useUnifiedShop } from "@/contexts/UnifiedShopContext";
import { NhanhProductsPanel } from "@/components/nhanh/NhanhProductsPanel";

export default function NhanhProductsPage() {
  const { selectedShop } = useUnifiedShop();

  if (!selectedShop || selectedShop.platform !== 'nhanh') {
    return (
      <div className="p-6">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold text-amber-800 mb-2">Chưa chọn shop Nhanh.vn</h3>
          <p className="text-amber-600">Vui lòng chọn một shop Nhanh.vn để xem sản phẩm.</p>
        </div>
      </div>
    );
  }

  return <NhanhProductsPanel />;
}
