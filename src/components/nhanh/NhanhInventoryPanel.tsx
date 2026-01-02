"use client";

/**
 * Nhanh.vn Inventory Panel
 * Hiển thị tồn kho từ Nhanh.vn
 */

import { useState, useEffect, useCallback } from "react";
import { useUnifiedShop } from "@/contexts/UnifiedShopContext";
import { getNhanhInventory, getNhanhWarehouses, getStoredNhanhToken } from "@/lib/nhanh";
import type { NhanhWarehouse, NhanhInventoryItem } from "@/lib/nhanh";

export function NhanhInventoryPanel() {
  const { selectedShop } = useUnifiedShop();
  const [inventory, setInventory] = useState<NhanhInventoryItem[]>([]);
  const [warehouses, setWarehouses] = useState<NhanhWarehouse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters & Pagination
  const [selectedWarehouse, setSelectedWarehouse] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [paginatorNext, setPaginatorNext] = useState<Record<string, unknown> | null>(null);
  const [loadMoreTrigger, setLoadMoreTrigger] = useState(0);

  const getApiParams = useCallback(async () => {
    if (!selectedShop || selectedShop.platform !== 'nhanh') return null;
    
    const metadata = selectedShop.metadata as { appId?: string } | undefined;
    const appId = metadata?.appId;
    
    if (!appId) return null;

    const token = await getStoredNhanhToken();
    
    if (!token?.accessToken) return null;

    return {
      accessToken: token.accessToken,
      appId,
      businessId: Number(selectedShop.platformShopId),
    };
  }, [selectedShop]);

  // Load warehouses
  useEffect(() => {
    const loadWarehouses = async () => {
      const params = await getApiParams();
      if (!params) return;

      getNhanhWarehouses(params)
        .then((res) => setWarehouses(res.warehouses))
        .catch(console.error);
    };
    loadWarehouses();
  }, [getApiParams]);

  // Load inventory
  useEffect(() => {
    const loadInventory = async () => {
      const params = await getApiParams();
      if (!params) {
        setError('Thiếu thông tin xác thực');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      const options: { pageSize: number; depotId?: number; paginatorNext?: Record<string, unknown> } = {
        pageSize: 50,
      };
      
      if (selectedWarehouse) options.depotId = selectedWarehouse;
      if (paginatorNext) options.paginatorNext = paginatorNext;

      getNhanhInventory(params, options)
        .then((res) => {
          if (paginatorNext) {
            setInventory(prev => [...prev, ...res.inventory]);
          } else {
            setInventory(res.inventory);
          }
          setHasMore(res.pagination.hasMore);
          setPaginatorNext(res.pagination.next);
        })
        .catch((err) => {
          setError(err.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };
    loadInventory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getApiParams, selectedWarehouse, loadMoreTrigger]);

  // Summary stats
  const totalItems = inventory.length;
  const lowStockItems = inventory.filter(item => item.remain > 0 && item.remain <= 10).length;
  const outOfStockItems = inventory.filter(item => item.remain <= 0).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Tồn kho</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{totalItems}</p>
              <p className="text-sm text-slate-500">Sản phẩm</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{lowStockItems}</p>
              <p className="text-sm text-slate-500">Sắp hết hàng</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{outOfStockItems}</p>
              <p className="text-sm text-slate-500">Hết hàng</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-wrap gap-4">
          {/* Warehouse Filter */}
          <select
            value={selectedWarehouse || ''}
            onChange={(e) => {
              setSelectedWarehouse(e.target.value ? Number(e.target.value) : null);
              setInventory([]);
              setPaginatorNext(null);
            }}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Tất cả kho</option>
            {warehouses.map((wh) => (
              <option key={wh.id} value={wh.id}>{wh.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600">
          {error}
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Kho
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Tồn kho
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-48" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-24" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-16 ml-auto" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-20 mx-auto" /></td>
                  </tr>
                ))
              ) : inventory.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    Không có dữ liệu tồn kho
                  </td>
                </tr>
              ) : (
                inventory.map((item, index) => (
                  <tr key={`${item.productId}-${item.depotId}-${index}`} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-800">{item.productName}</p>
                      <p className="text-sm text-slate-500">ID: {item.productId}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {item.depotName || `Kho ${item.depotId}`}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-bold ${
                        item.remain <= 0 ? 'text-red-600' :
                        item.remain <= 10 ? 'text-amber-600' :
                        'text-slate-800'
                      }`}>
                        {item.remain}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.remain <= 0 ? (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                          Hết hàng
                        </span>
                      ) : item.remain <= 10 ? (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700">
                          Sắp hết
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                          Còn hàng
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Load More */}
        {hasMore && !isLoading && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-center">
            <button
              onClick={() => setLoadMoreTrigger(prev => prev + 1)}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Tải thêm
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
