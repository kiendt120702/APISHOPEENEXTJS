"use client";

/**
 * Shop Switcher Component
 * Cho phép chuyển đổi giữa các shop từ nhiều nền tảng
 */

import { useState } from 'react';
import { useUnifiedShop, ShopPlatform, UnifiedShop } from '@/contexts/UnifiedShopContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronDown, 
  Store, 
  Check, 
  Loader2,
  Settings,
  Plus,
} from 'lucide-react';
import Link from 'next/link';

// Platform config
const platformConfig: Record<ShopPlatform, { name: string; icon: string; color: string }> = {
  shopee: { name: 'Shopee', icon: '🛒', color: 'bg-orange-500' },
  nhanh: { name: 'Nhanh.vn', icon: '⚡', color: 'bg-blue-500' },
  tiktok: { name: 'TikTok', icon: '🎵', color: 'bg-black' },
  lazada: { name: 'Lazada', icon: '🛍️', color: 'bg-purple-500' },
};

interface ShopSwitcherProps {
  className?: string;
  showPlatformBadge?: boolean;
}

export function ShopSwitcher({ className, showPlatformBadge = true }: ShopSwitcherProps) {
  const { shops, selectedShop, isLoading, selectShop, getShopsByPlatform } = useUnifiedShop();
  const [open, setOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  const handleSelectShop = async (shop: UnifiedShop) => {
    if (shop.id === selectedShop?.id) {
      setOpen(false);
      return;
    }

    setSwitching(true);
    await selectShop(shop);
    setSwitching(false);
    setOpen(false);
  };

  // Group shops by platform
  const shopeeShops = getShopsByPlatform('shopee');
  const nhanhShops = getShopsByPlatform('nhanh');
  // const tiktokShops = getShopsByPlatform('tiktok');
  // const lazadaShops = getShopsByPlatform('lazada');

  const hasShops = shops.length > 0;

  if (isLoading) {
    return (
      <Button variant="outline" disabled className={className}>
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        Đang tải...
      </Button>
    );
  }

  if (!hasShops) {
    return (
      <Button variant="outline" asChild className={className}>
        <Link href="/profile/shops">
          <Plus className="h-4 w-4 mr-2" />
          Kết nối Shop
        </Link>
      </Button>
    );
  }

  const currentPlatform = selectedShop ? platformConfig[selectedShop.platform] : null;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={`justify-between min-w-[200px] ${className}`}
          disabled={switching}
        >
          <div className="flex items-center gap-2 truncate">
            {switching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : selectedShop ? (
              <>
                {selectedShop.logo ? (
                  <img 
                    src={selectedShop.logo} 
                    alt="" 
                    className="h-5 w-5 rounded-full object-cover"
                  />
                ) : (
                  <div className={`h-5 w-5 rounded-full ${currentPlatform?.color} flex items-center justify-center text-xs text-white`}>
                    {currentPlatform?.icon}
                  </div>
                )}
                <span className="truncate max-w-[120px]">{selectedShop.name}</span>
                {showPlatformBadge && (
                  <Badge variant="secondary" className="text-[10px] px-1 py-0">
                    {currentPlatform?.name}
                  </Badge>
                )}
              </>
            ) : (
              <>
                <Store className="h-4 w-4" />
                <span>Chọn Shop</span>
              </>
            )}
          </div>
          <ChevronDown className="h-4 w-4 ml-2 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[280px]" align="start">
        {/* Shopee Shops */}
        {shopeeShops.length > 0 && (
          <>
            <DropdownMenuLabel className="flex items-center gap-2">
              <span className="text-lg">🛒</span>
              Shopee ({shopeeShops.length})
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              {shopeeShops.map((shop) => (
                <DropdownMenuItem
                  key={shop.id}
                  onClick={() => handleSelectShop(shop)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {shop.logo ? (
                      <img 
                        src={shop.logo} 
                        alt="" 
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                        <Store className="h-4 w-4 text-orange-600" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{shop.name}</p>
                      <p className="text-xs text-muted-foreground">
                        ID: {shop.platformShopId}
                      </p>
                    </div>
                    {selectedShop?.id === shop.id && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </>
        )}

        {/* Nhanh.vn Shops */}
        {nhanhShops.length > 0 && (
          <>
            {shopeeShops.length > 0 && <DropdownMenuSeparator />}
            <DropdownMenuLabel className="flex items-center gap-2">
              <span className="text-lg">⚡</span>
              Nhanh.vn ({nhanhShops.length})
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              {nhanhShops.map((shop) => (
                <DropdownMenuItem
                  key={shop.id}
                  onClick={() => handleSelectShop(shop)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-sm">⚡</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{shop.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Business ID: {shop.platformShopId}
                      </p>
                    </div>
                    {selectedShop?.id === shop.id && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </>
        )}

        <DropdownMenuSeparator />
        
        {/* Actions */}
        <DropdownMenuItem asChild>
          <Link href="/profile/shops" className="cursor-pointer">
            <Settings className="h-4 w-4 mr-2" />
            Quản lý Shop
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile/shops" className="cursor-pointer">
            <Plus className="h-4 w-4 mr-2" />
            Kết nối Shop mới
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
