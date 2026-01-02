"use client";

import { useEffect } from "react";
import { ShopManagementPanel } from "@/components/profile/ShopManagementPanel";
import { NhanhConnectionsList } from "@/components/nhanh/NhanhConnectionsList";
import { useUnifiedShop } from "@/contexts/UnifiedShopContext";

export default function ShopsManagementPage() {
    const { refreshShops } = useUnifiedShop();

    // Refresh danh sách shop khi vào trang này
    useEffect(() => {
        refreshShops();
    }, [refreshShops]);

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <ShopManagementPanel />
            <NhanhConnectionsList />
        </div>
    );
}
