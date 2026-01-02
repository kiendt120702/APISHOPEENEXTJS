"use client";

/**
 * Nhanh.vn - Tồn kho
 */

import { useUnifiedShop } from "@/contexts/UnifiedShopContext";
import { NhanhInventoryPanel } from "@/components/nhanh/NhanhInventoryPanel";

export default function NhanhInventoryPage() {
  const { selectedShop } = useUnifiedShop();

  if (!selectedShop || selectedShop.platform !== 'nhanh') {
    return (
      <div className="p-6">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold text-amber-800 mb-2">Chưa chọn shop Nhanh.vn</h3>
          <p className="text-amber-600">Vui lòng chọn một shop Nhanh.vn để xem tồn kho.</p>
        </div>
      </div>
    );
  }

  return <NhanhInventoryPanel />;
}
