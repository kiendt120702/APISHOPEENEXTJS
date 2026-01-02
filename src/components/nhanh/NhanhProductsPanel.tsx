"use client";

/**
 * Nhanh.vn Products Panel
 * Hiển thị danh sách sản phẩm từ Nhanh.vn
 */

import { useState, useEffect, useCallback } from "react";
import { useUnifiedShop } from "@/contexts/UnifiedShopContext";
import { getNhanhProducts, getNhanhCategories, getStoredNhanhToken } from "@/lib/nhanh";
import type { NhanhProduct, NhanhCategory } from "@/lib/nhanh";

export function NhanhProductsPanel() {
  const { selectedShop } = useUnifiedShop();
  const [products, setProducts] = useState<NhanhProduct[]>([]);
  const [categories, setCategories] = useState<NhanhCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters & Pagination
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [hasMore, setHasMore] = useState(false);
  const [paginatorNext, setPaginatorNext] = useState<Record<string, unknown> | null>(null);
  const [loadMoreTrigger, setLoadMoreTrigger] = useState(0); // Trigger để load thêm

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

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      const params = await getApiParams();
      if (!params) return;

      getNhanhCategories(params)
        .then((res) => setCategories(res.categories))
        .catch(console.error);
    };
    loadCategories();
  }, [getApiParams]);

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      const params = await getApiParams();
      if (!params) {
        setError('Thiếu thông tin xác thực');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      const options: { pageSize: number; keyword?: string; categoryId?: number; paginatorNext?: Record<string, unknown> } = {
        pageSize: 20,
      };
      
      if (keyword) options.keyword = keyword;
      if (selectedCategory) options.categoryId = selectedCategory;
      if (paginatorNext) options.paginatorNext = paginatorNext;

      getNhanhProducts(params, options)
        .then((res) => {
          if (paginatorNext) {
            // Append to existing products
            setProducts(prev => [...prev, ...res.products]);
          } else {
            setProducts(res.products);
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
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getApiParams, keyword, selectedCategory, loadMoreTrigger]);

  const handleSearch = () => {
    setKeyword(searchInput);
    setProducts([]);
    setPaginatorNext(null);
  };

  const formatPrice = (price?: number) => {
    if (price === undefined || price === null) return '-';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Helper để lấy giá bán (ưu tiên retail, fallback sang import nếu không có)
  const getRetailPrice = (product: NhanhProduct) => {
    // Ưu tiên giá bán lẻ, nếu không có thì lấy giá nhập
    return product.prices?.retail || product.price || product.prices?.import || 0;
  };

  // Helper để lấy giá nhập
  const getImportPrice = (product: NhanhProduct) => {
    return product.prices?.import || 0;
  };

  // Helper để lấy giá cũ
  const getOldPrice = (product: NhanhProduct) => {
    return product.prices?.old ?? product.oldPrice;
  };

  // Helper để lấy tồn kho
  const getInventoryRemain = (product: NhanhProduct) => {
    if (typeof product.inventory === 'object' && product.inventory !== null) {
      return product.inventory.remain ?? product.inventory.available ?? 0;
    }
    return product.inventory ?? 0;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Sản phẩm</h1>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <svg className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory || ''}
            onChange={(e) => {
              setSelectedCategory(e.target.value ? Number(e.target.value) : null);
              setProducts([]);
              setPaginatorNext(null);
            }}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600">
          {error}
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Mã SP
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Giá bán
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
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-slate-200 rounded-lg" />
                        <div className="h-4 bg-slate-200 rounded w-48" />
                      </div>
                    </td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-20" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-24 ml-auto" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-16 ml-auto" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-20 mx-auto" /></td>
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Không tìm thấy sản phẩm nào
                  </td>
                </tr>
              ) : (
                products.map((product, index) => (
                  <tr key={`${product.id}-${index}`} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* Product Image */}
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                          {product.images?.avatar ? (
                            <img 
                              src={product.images.avatar} 
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        {/* Product Info */}
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-slate-800 truncate">{product.name}</p>
                          {product.barcode && (
                            <p className="text-xs text-slate-500">Barcode: {product.barcode}</p>
                          )}
                          {/* Attributes (Size, Color, etc.) */}
                          {product.attributes && product.attributes.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {product.attributes.map((attr, i) => (
                                <span key={i} className="inline-flex px-1.5 py-0.5 text-xs bg-slate-100 text-slate-600 rounded">
                                  {attr.name}: {attr.value}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-600">{product.code || '-'}</p>
                      {product.shipping?.weight && (
                        <p className="text-xs text-slate-400 mt-1">{product.shipping.weight}g</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-medium text-slate-800">{formatPrice(getRetailPrice(product))}</p>
                      {getOldPrice(product) && getOldPrice(product)! > getRetailPrice(product) && (
                        <p className="text-sm text-slate-400 line-through">{formatPrice(getOldPrice(product))}</p>
                      )}
                      {getImportPrice(product) > 0 && getImportPrice(product) !== getRetailPrice(product) && (
                        <p className="text-xs text-slate-500 mt-0.5">Nhập: {formatPrice(getImportPrice(product))}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-medium text-slate-800">{getInventoryRemain(product)}</p>
                      {typeof product.inventory === 'object' && product.inventory?.shipping && product.inventory.shipping > 0 && (
                        <p className="text-xs text-orange-600">Đang giao: {product.inventory.shipping}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        product.status === 1 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {product.status === 1 ? 'Đang bán' : 'Ngừng bán'}
                      </span>
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
