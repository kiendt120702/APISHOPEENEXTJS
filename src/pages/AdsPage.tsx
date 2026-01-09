/**
 * ADS Page - Quản lý quảng cáo
 */

import { Megaphone, Plus, BarChart3, Target, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdsPage() {
  const stats = [
    { title: 'Chiến dịch đang chạy', value: '0', icon: Target, color: 'text-blue-500' },
    { title: 'Tổng chi tiêu', value: '0đ', icon: DollarSign, color: 'text-green-500' },
    { title: 'Lượt hiển thị', value: '0', icon: BarChart3, color: 'text-purple-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
            <Megaphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Quảng cáo (ADS)</h1>
            <p className="text-sm text-slate-500">Quản lý chiến dịch quảng cáo Shopee</p>
          </div>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
          <Plus className="w-4 h-4 mr-2" />
          Tạo chiến dịch
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-8 h-8 ${stat.color}`} />
                <div>
                  <p className="text-sm text-slate-500">{stat.title}</p>
                  <p className="text-xl font-bold text-slate-800">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Campaigns List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">Chiến dịch quảng cáo</h2>
        </div>
        
        {/* Empty State */}
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Megaphone className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-700 mb-2">Chưa có chiến dịch nào</h3>
          <p className="text-slate-500 mb-4">Tạo chiến dịch quảng cáo để tăng độ phủ sản phẩm</p>
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Tạo chiến dịch đầu tiên
          </Button>
        </div>
      </div>
    </div>
  );
}
