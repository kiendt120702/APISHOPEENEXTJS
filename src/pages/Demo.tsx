/**
 * Demo Page - Trang demo cho Shopee API Review
 * Hiển thị đầy đủ tính năng e-commerce mà không cần đăng nhập
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  DEMO_SHOP,
  DEMO_FLASH_SALES,
  DEMO_CAMPAIGNS,
  DEMO_PRODUCTS,
  DEMO_STATS,
  DEMO_BUDGET_SCHEDULES,
} from '@/lib/demoData';

type TabId = 'dashboard' | 'flash-sale' | 'ads';

export default function DemoPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium">
                🎯 Demo Mode - Shopee Open Platform Integration
              </p>
              <p className="text-sm text-blue-100">
                Đây là giao diện demo với dữ liệu mẫu. Đăng nhập để sử dụng với
                shop thật.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            Đăng nhập
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-60px)]">
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <img
                src="/logo_betacom.png"
                alt="BETACOM"
                className="w-10 h-10 rounded-xl"
              />
              <div>
                <h1 className="font-bold text-slate-800">BETACOM</h1>
                <p className="text-xs text-slate-500">Shopee Management</p>
              </div>
            </div>
          </div>

          {/* Shop Info */}
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs text-slate-500">Shop đang kết nối</p>
                <p className="font-medium text-slate-800 text-sm">
                  {DEMO_SHOP.shop_name}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-2 space-y-1">
            {[
              { id: 'dashboard' as TabId, label: 'Tổng quan', icon: '📊' },
              { id: 'flash-sale' as TabId, label: 'Flash Sale', icon: '⚡' },
              { id: 'ads' as TabId, label: 'Quảng cáo', icon: '📈' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                    : 'text-slate-600 hover:bg-slate-50'
                )}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* API Info */}
          <div className="p-4 mt-4">
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span className="font-medium text-green-800 text-sm">
                  Shopee API
                </span>
              </div>
              <p className="text-xs text-green-700">
                Tích hợp chính thức với Shopee Open Platform API
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === 'dashboard' && (
            <DashboardContent
              formatPrice={formatPrice}
              onNavigate={setActiveTab}
            />
          )}
          {activeTab === 'flash-sale' && (
            <FlashSaleContent formatPrice={formatPrice} formatTime={formatTime} />
          )}
          {activeTab === 'ads' && <AdsContent formatPrice={formatPrice} />}
        </main>
      </div>
    </div>
  );
}

// Dashboard Content
function DashboardContent({
  formatPrice,
  onNavigate,
}: {
  formatPrice: (p: number) => string;
  onNavigate: (tab: TabId) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon="📦"
          label="Sản phẩm"
          value={DEMO_STATS.total_products.toString()}
          color="blue"
        />
        <StatCard
          icon="🛒"
          label="Đơn hàng hôm nay"
          value={DEMO_STATS.total_orders_today.toString()}
          color="green"
        />
        <StatCard
          icon="💰"
          label="Doanh thu hôm nay"
          value={formatPrice(DEMO_STATS.total_revenue_today)}
          color="orange"
        />
        <StatCard
          icon="⚡"
          label="Flash Sale đang chạy"
          value={DEMO_STATS.total_flash_sales_active.toString()}
          color="red"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <QuickActionCard
          title="Flash Sale Manager"
          description="Quản lý và hẹn giờ đăng ký Flash Sale tự động"
          icon="⚡"
          color="orange"
          features={[
            'Xem danh sách Flash Sale đang mở',
            'Hẹn giờ đăng ký sản phẩm tự động',
            'Theo dõi trạng thái đăng ký',
          ]}
          onClick={() => onNavigate('flash-sale')}
        />
        <QuickActionCard
          title="Ads Manager"
          description="Quản lý chiến dịch quảng cáo Shopee Ads"
          icon="📈"
          color="blue"
          features={[
            'Quản lý campaigns quảng cáo',
            'Lên lịch thay đổi ngân sách tự động',
            'Bật/tắt chiến dịch nhanh chóng',
          ]}
          onClick={() => onNavigate('ads')}
        />
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-800 mb-4">
          🏆 Sản phẩm bán chạy
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-slate-500 border-b">
                <th className="pb-3">Sản phẩm</th>
                <th className="pb-3 text-right">Giá</th>
                <th className="pb-3 text-right">Đã bán</th>
                <th className="pb-3 text-right">Tồn kho</th>
                <th className="pb-3 text-right">Đánh giá</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_PRODUCTS.map((product) => (
                <tr key={product.item_id} className="border-b border-slate-50">
                  <td className="py-3">
                    <p className="font-medium text-slate-700">{product.name}</p>
                    <p className="text-xs text-slate-400">
                      ID: {product.item_id}
                    </p>
                  </td>
                  <td className="py-3 text-right text-sm">
                    {formatPrice(product.price)}
                  </td>
                  <td className="py-3 text-right text-sm font-medium text-green-600">
                    {product.sold}
                  </td>
                  <td className="py-3 text-right text-sm">{product.stock}</td>
                  <td className="py-3 text-right">
                    <span className="text-amber-500">⭐ {product.rating}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Flash Sale Content
function FlashSaleContent({
  formatPrice,
  formatTime,
}: {
  formatPrice: (p: number) => string;
  formatTime: (t: number) => string;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">
          ⚡ Flash Sale Manager
        </h2>
        <span className="text-sm text-slate-500">
          Tích hợp Shopee Flash Sale API
        </span>
      </div>

      {DEMO_FLASH_SALES.map((sale) => (
        <div
          key={sale.flash_sale_id}
          className="bg-white rounded-xl border border-slate-200 overflow-hidden"
        >
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  'px-3 py-1 rounded-full text-sm font-medium',
                  sale.status === 'ongoing'
                    ? 'bg-green-100 text-green-700'
                    : sale.status === 'upcoming'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600'
                )}
              >
                {sale.status === 'ongoing'
                  ? '🔥 Đang diễn ra'
                  : sale.status === 'upcoming'
                    ? '⏰ Sắp diễn ra'
                    : '✓ Đã kết thúc'}
              </span>
              <span className="text-sm text-slate-500">
                {formatTime(sale.start_time)} - {formatTime(sale.end_time)}
              </span>
            </div>
            <span className="text-sm font-medium text-slate-700">
              {sale.items.length} sản phẩm
            </span>
          </div>

          <div className="p-4 space-y-3">
            {sale.items.map((item) => (
              <div
                key={item.item_id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-slate-700">{item.name}</p>
                  <p className="text-xs text-slate-500">ID: {item.item_id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">
                    <span className="line-through text-slate-400">
                      {formatPrice(item.original_price)}
                    </span>
                    <span className="ml-2 font-medium text-red-600">
                      {formatPrice(item.flash_sale_price)}
                    </span>
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 rounded-full"
                        style={{ width: `${(item.sold / item.stock) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500">
                      {item.sold}/{item.stock}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Ads Content
function AdsContent({ formatPrice }: { formatPrice: (p: number) => string }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">📈 Ads Manager</h2>
        <span className="text-sm text-slate-500">
          Tích hợp Shopee Marketing API
        </span>
      </div>

      {/* Budget Schedules */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <h3 className="font-semibold text-slate-800 mb-4">
          ⏰ Lịch ngân sách tự động
        </h3>
        <div className="space-y-3">
          {DEMO_BUDGET_SCHEDULES.map((schedule) => (
            <div
              key={schedule.id}
              className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-100"
            >
              <div>
                <p className="font-medium text-slate-700">
                  {schedule.campaign_name}
                </p>
                <p className="text-xs text-slate-500">
                  {new Date(schedule.scheduled_time).toLocaleString('vi-VN')}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-emerald-600">
                  {formatPrice(schedule.budget)}
                </p>
                <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">
                  Đang chờ
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Campaigns */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">
            Chiến dịch quảng cáo ({DEMO_CAMPAIGNS.length})
          </h3>
        </div>
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs text-slate-500">
              <th className="px-4 py-3">Chiến dịch</th>
              <th className="px-4 py-3 text-center">Loại</th>
              <th className="px-4 py-3 text-center">Trạng thái</th>
              <th className="px-4 py-3 text-right">Ngân sách/ngày</th>
            </tr>
          </thead>
          <tbody>
            {DEMO_CAMPAIGNS.map((campaign) => (
              <tr
                key={campaign.campaign_id}
                className="border-t border-slate-100"
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-700">{campaign.name}</p>
                  <p className="text-xs text-slate-400">
                    ID: {campaign.campaign_id}
                  </p>
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={cn(
                      'text-xs px-2 py-1 rounded-full',
                      campaign.ad_type === 'auto'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-indigo-100 text-indigo-700'
                    )}
                  >
                    {campaign.ad_type === 'auto' ? 'Tự động' : 'Thủ công'}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={cn(
                      'text-xs px-2 py-1 rounded-full',
                      campaign.status === 'ongoing'
                        ? 'bg-green-100 text-green-700'
                        : campaign.status === 'paused'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-600'
                    )}
                  >
                    {campaign.status === 'ongoing'
                      ? 'Đang chạy'
                      : campaign.status === 'paused'
                        ? 'Tạm dừng'
                        : 'Kết thúc'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-medium">
                  {formatPrice(campaign.common_info?.campaign_budget || 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Stat Card
function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    orange: 'bg-orange-100',
    red: 'bg-red-100',
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center text-xl',
            colorClasses[color]
          )}
        >
          {icon}
        </div>
        <div>
          <p className="text-xs text-slate-500">{label}</p>
          <p className="text-lg font-bold text-slate-800">{value}</p>
        </div>
      </div>
    </div>
  );
}

// Quick Action Card
function QuickActionCard({
  title,
  description,
  icon,
  color,
  features,
  onClick,
}: {
  title: string;
  description: string;
  icon: string;
  color: string;
  features: string[];
  onClick: () => void;
}) {
  const colorClasses: Record<string, string> = {
    orange: 'bg-orange-100 text-orange-600',
    blue: 'bg-blue-100 text-blue-600',
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center text-2xl',
            colorClasses[color]
          )}
        >
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-slate-800">{title}</h3>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
      </div>
      <ul className="space-y-2 mb-4">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
            <span className="text-green-500">✓</span>
            {feature}
          </li>
        ))}
      </ul>
      <button
        onClick={onClick}
        className={cn(
          'w-full py-2 rounded-lg font-medium transition-colors',
          color === 'orange'
            ? 'bg-orange-500 text-white hover:bg-orange-600'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        )}
      >
        Xem chi tiết →
      </button>
    </div>
  );
}
