/**
 * Settings Page - Cài đặt hệ thống
 */

import { Settings, User, Bell, Shield, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

export default function SettingsPage() {
  const settingSections = [
    {
      title: 'Tài khoản',
      icon: User,
      description: 'Quản lý thông tin cá nhân và tài khoản',
    },
    {
      title: 'Thông báo',
      icon: Bell,
      description: 'Cài đặt thông báo và cảnh báo',
    },
    {
      title: 'Bảo mật',
      icon: Shield,
      description: 'Mật khẩu và xác thực 2 lớp',
    },
    {
      title: 'Giao diện',
      icon: Palette,
      description: 'Tùy chỉnh giao diện hiển thị',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-slate-600 to-slate-800 rounded-lg">
          <Settings className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Cài đặt</h1>
          <p className="text-sm text-slate-500">Quản lý cài đặt hệ thống</p>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {settingSections.map((section) => {
          const Icon = section.icon;
          return (
            <div
              key={section.title}
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <Icon className="w-5 h-5 text-slate-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800">{section.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">{section.description}</p>
                </div>
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Settings */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">Cài đặt nhanh</h2>
        </div>
        <div className="divide-y divide-slate-100">
          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-700">Thông báo email</p>
              <p className="text-sm text-slate-500">Nhận thông báo qua email</p>
            </div>
            <Switch />
          </div>
          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-700">Tự động đồng bộ</p>
              <p className="text-sm text-slate-500">Tự động đồng bộ dữ liệu từ Shopee</p>
            </div>
            <Switch />
          </div>
          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-700">Chế độ tối</p>
              <p className="text-sm text-slate-500">Sử dụng giao diện tối</p>
            </div>
            <Switch />
          </div>
        </div>
      </div>
    </div>
  );
}
