/**
 * Demo Dashboard - Dashboard với dữ liệu mẫu cho Shopee reviewer
 */

import { DEMO_STATS, DEMO_FLASH_SALES, DEMO_CAMPAIGNS, DEMO_PRODUCTS } from '@/lib/demoData';

interface DemoDashboardProps {
  onNavigate: (path: string) => void;
}

export function DemoDashboard({ onNavigate }: DemoDashboardProps) {
  const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<PackageIcon />}
          label="Sản phẩm"
          value={DEMO_STATS.total_products.toString()}
          color="blue"
        />
        <StatCard
          icon={<OrderIcon />}
          label="Đơn hàng hôm nay"
          value={DEMO_STATS.total_orders_today.toString()}
          color="green"
        />
        <StatCard
          icon={<RevenueIcon />}
          label="Doanh thu hôm nay"
          value={formatPrice(DEMO_STATS.total_revenue_today)}
          color="orange"
        />
        <StatCard
          icon={<FlashIcon />}
          label="Flash Sale đang chạy"
          value={DEMO_STATS.total_flash_sales_active.toString()}
          color="red"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Flash Sales Section */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <FlashIcon className="w-4 h-4 text-orange-600" />
              </span>
              Flash Sale
            </h3>
            <button
              onClick={() => onNavigate('/flash-sale')}
              className="text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              Xem tất cả →
            </button>
          </div>
          <div className="space-y-3">
            {DEMO_FLASH_SALES.slice(0, 2).map((sale) => (
              <div key={sale.flash_sale_id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      sale.status === 'ongoing' ? 'bg-green-100 text-green-700' :
                      sale.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {sale.status === 'ongoing' ? 'Đang diễn ra' :
                       sale.status === 'upcoming' ? 'Sắp diễn ra' : 'Đã kết thúc'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">
                    {formatTime(sale.start_time)} - {formatTime(sale.end_time)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-800">{sale.items.length} sản phẩm</p>
                  <p className="text-xs text-slate-500">
                    Đã bán: {sale.items.reduce((sum, item) => sum + item.sold, 0)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ads Campaigns Section */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <AdsIcon className="w-4 h-4 text-blue-600" />
              </span>
              Quảng cáo
            </h3>
            <button
              onClick={() => onNavigate('/ads')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Xem tất cả →
            </button>
          </div>
          <div className="space-y-3">
            {DEMO_CAMPAIGNS.slice(0, 2).map((campaign) => (
              <div key={campaign.campaign_id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      campaign.ad_type === 'auto' ? 'bg-purple-100 text-purple-700' : 'bg-indigo-100 text-indigo-700'
                    }`}>
                      {campaign.ad_type === 'auto' ? 'Tự động' : 'Thủ công'}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      campaign.status === 'ongoing' ? 'bg-green-100 text-green-700' :
                      campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {campaign.status === 'ongoing' ? 'Đang chạy' :
                       campaign.status === 'paused' ? 'Tạm dừng' : 'Kết thúc'}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-700 mt-1 truncate max-w-[200px]">
                    {campaign.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-800">
                    {formatPrice(campaign.common_info?.campaign_budget || 0)}
                  </p>
                  <p className="text-xs text-slate-500">Ngân sách/ngày</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
            <TrendingIcon className="w-4 h-4 text-emerald-600" />
          </span>
          Sản phẩm bán chạy
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-slate-500 border-b border-slate-100">
                <th className="pb-3 font-medium">Sản phẩm</th>
                <th className="pb-3 font-medium text-right">Giá</th>
                <th className="pb-3 font-medium text-right">Đã bán</th>
                <th className="pb-3 font-medium text-right">Tồn kho</th>
                <th className="pb-3 font-medium text-right">Đánh giá</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_PRODUCTS.slice(0, 5).map((product) => (
                <tr key={product.item_id} className="border-b border-slate-50 last:border-0">
                  <td className="py-3">
                    <p className="text-sm font-medium text-slate-700">{product.name}</p>
                    <p className="text-xs text-slate-400">ID: {product.item_id}</p>
                  </td>
                  <td className="py-3 text-right text-sm text-slate-600">{formatPrice(product.price)}</td>
                  <td className="py-3 text-right text-sm font-medium text-slate-700">{product.sold}</td>
                  <td className="py-3 text-right text-sm text-slate-600">{product.stock}</td>
                  <td className="py-3 text-right">
                    <span className="inline-flex items-center gap-1 text-sm text-amber-600">
                      <StarIcon className="w-3 h-3" />
                      {product.rating}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Features Info */}
      <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200 p-6">
        <h3 className="font-semibold text-slate-800 mb-4">Tính năng tích hợp Shopee API</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FeatureCard
            icon={<FlashIcon className="w-5 h-5" />}
            title="Flash Sale Manager"
            description="Quản lý và hẹn giờ đăng ký Flash Sale tự động"
          />
          <FeatureCard
            icon={<AdsIcon className="w-5 h-5" />}
            title="Ads Budget Scheduler"
            description="Lên lịch thay đổi ngân sách quảng cáo tự động"
          />
          <FeatureCard
            icon={<SyncIcon className="w-5 h-5" />}
            title="Real-time Sync"
            description="Đồng bộ dữ liệu trực tiếp từ Shopee API"
          />
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color as keyof typeof colorClasses]}`}>
          {icon}
        </div>
        <div>
          <p className="text-xs text-slate-500">{label}</p>
          <p className="text-lg font-semibold text-slate-800">{value}</p>
        </div>
      </div>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white/60 rounded-lg p-4">
      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 mb-3">
        {icon}
      </div>
      <h4 className="font-medium text-slate-800 mb-1">{title}</h4>
      <p className="text-sm text-slate-600">{description}</p>
    </div>
  );
}

// Icons
function PackageIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}

function OrderIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  );
}

function RevenueIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function FlashIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

function AdsIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
    </svg>
  );
}

function TrendingIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}

function StarIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function SyncIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}

export default DemoDashboard;
