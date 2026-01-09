/**
 * Products Page - Quản lý sản phẩm
 */

import { Package, Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Sản phẩm</h1>
            <p className="text-sm text-slate-500">Quản lý sản phẩm trên các shop</p>
          </div>
        </div>
        <Button className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600">
          <Plus className="w-4 h-4 mr-2" />
          Thêm sản phẩm
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Bộ lọc
        </Button>
      </div>

      {/* Products List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">Danh sách sản phẩm</h2>
        </div>
        
        {/* Empty State */}
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-700 mb-2">Chưa có sản phẩm nào</h3>
          <p className="text-slate-500 mb-4">Đồng bộ sản phẩm từ shop hoặc thêm sản phẩm mới</p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline">
              Đồng bộ từ Shop
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Thêm sản phẩm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
