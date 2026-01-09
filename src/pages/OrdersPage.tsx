/**
 * Orders Page - Quản lý đơn hàng
 */

import { ShoppingCart, Search, Filter, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function OrdersPage() {
  const orderStats = [
    { title: 'Chờ xác nhận', value: '0', icon: Clock, color: 'bg-yellow-500' },
    { title: 'Đang xử lý', value: '0', icon: CheckCircle, color: 'bg-blue-500' },
    { title: 'Đang giao', value: '0', icon: Truck, color: 'bg-purple-500' },
    { title: 'Đã hủy', value: '0', icon: XCircle, color: 'bg-red-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg">
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Đơn hàng</h1>
            <p className="text-sm text-slate-500">Quản lý đơn hàng từ tất cả các shop</p>
          </div>
        </div>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {orderStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">{stat.title}</p>
                  <p className="text-xl font-bold text-slate-800">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Tìm kiếm đơn hàng..."
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Bộ lọc
        </Button>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">Danh sách đơn hàng</h2>
        </div>
        
        {/* Empty State */}
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-700 mb-2">Chưa có đơn hàng nào</h3>
          <p className="text-slate-500 mb-4">Đơn hàng sẽ xuất hiện khi có khách đặt hàng</p>
          <Button variant="outline">
            Đồng bộ đơn hàng
          </Button>
        </div>
      </div>
    </div>
  );
}
