/**
 * Dashboard Page - Trang tổng quan
 */

import { LayoutDashboard, Store, Package, ShoppingCart, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    { title: 'Tổng Shop', value: '5', icon: Store, color: 'bg-blue-500' },
    { title: 'Sản phẩm', value: '1,234', icon: Package, color: 'bg-green-500' },
    { title: 'Đơn hàng hôm nay', value: '89', icon: ShoppingCart, color: 'bg-orange-500' },
    { title: 'Doanh thu', value: '12.5M', icon: TrendingUp, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg">
          <LayoutDashboard className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-sm text-slate-500">Tổng quan hoạt động kinh doanh</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Placeholder Content */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Hoạt động gần đây</h2>
        <p className="text-slate-500">Chưa có dữ liệu hoạt động.</p>
      </div>
    </div>
  );
}
