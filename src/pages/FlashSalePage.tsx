/**
 * Flash Sale Page - Quản lý Flash Sale
 */

import { Zap, Plus, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FlashSalePage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Flash Sale</h1>
            <p className="text-sm text-slate-500">Quản lý các chương trình Flash Sale</p>
          </div>
        </div>
        <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
          <Plus className="w-4 h-4 mr-2" />
          Tạo Flash Sale
        </Button>
      </div>

      {/* Flash Sale List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">Danh sách Flash Sale</h2>
        </div>
        
        {/* Empty State */}
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-700 mb-2">Chưa có Flash Sale nào</h3>
          <p className="text-slate-500 mb-4">Tạo Flash Sale đầu tiên để tăng doanh số bán hàng</p>
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Tạo Flash Sale
          </Button>
        </div>
      </div>

      {/* Upcoming Flash Sales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold text-slate-800">Flash Sale sắp tới</h3>
          </div>
          <p className="text-slate-500 text-sm">Không có Flash Sale nào được lên lịch</p>
        </div>
        
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold text-slate-800">Đang diễn ra</h3>
          </div>
          <p className="text-slate-500 text-sm">Không có Flash Sale nào đang diễn ra</p>
        </div>
      </div>
    </div>
  );
}
