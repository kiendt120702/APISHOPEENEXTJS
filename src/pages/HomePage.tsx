/**
 * Home Page - Dashboard tổng quan cho shop đang chọn
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Store,
  ArrowRight,
  Zap,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/contexts/AuthContext';
import { useShopeeAuth } from '@/hooks/useShopeeAuth';
import { useDashboardData, type DateRangeOption } from '@/hooks/useDashboardData';
import { useBestSellingProducts, type TopLimitOption } from '@/hooks/useBestSellingProducts';
import { useInventorySummary } from '@/hooks/useInventorySummary';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { BestSellingProducts } from '@/components/dashboard/BestSellingProducts';
import { InventorySummary } from '@/components/dashboard/InventorySummary';

export default function HomePage() {
  const { user } = useAuth();
  const { shops, selectedShopId, isLoading: isShopLoading } = useShopeeAuth();
  const [overviewDateRange, setOverviewDateRange] = useState<DateRangeOption>('today');
  const [chartDateRange, setChartDateRange] = useState<DateRangeOption>('14days');
  const [bestSellingDateRange, setBestSellingDateRange] = useState<DateRangeOption>('7days');
  const [bestSellingTopLimit, setBestSellingTopLimit] = useState<TopLimitOption>(10);

  // Dashboard data - uses overview date range for stats
  const { stats: overviewStats, loading: overviewLoading } = useDashboardData(
    selectedShopId || 0,
    user?.id || '',
    overviewDateRange
  );

  // Chart data - uses chart date range
  const { stats: chartStats, loading: chartLoading } = useDashboardData(
    selectedShopId || 0,
    user?.id || '',
    chartDateRange
  );

  // Best selling products
  const { products: bestSellingProducts, loading: bestSellingLoading } = useBestSellingProducts(
    selectedShopId || 0,
    user?.id || '',
    bestSellingDateRange,
    bestSellingTopLimit
  );

  // Inventory summary
  const { summary: inventorySummary, loading: inventoryLoading } = useInventorySummary(
    selectedShopId || 0,
    user?.id || ''
  );

  if (isShopLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  if (!user) {
    return <LandingContent />;
  }

  // Nếu chưa có shop nào
  if (shops.length === 0) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
                <Store className="w-10 h-10 text-slate-400" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800 mb-2">Chưa có shop nào</h2>
              <p className="text-slate-500 mb-6 max-w-md mx-auto">
                Kết nối shop Shopee của bạn để bắt đầu quản lý đơn hàng, sản phẩm và nhiều hơn nữa
              </p>
              <Link to="/settings/shops">
                <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 cursor-pointer">
                  <Store className="w-4 h-4 mr-2" />
                  Kết nối Shop Shopee
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Dashboard Overview */}
      <DashboardOverview
        stats={overviewStats}
        loading={overviewLoading}
        dateRange={overviewDateRange}
        onDateRangeChange={setOverviewDateRange}
      />

      {/* Revenue Chart */}
      <RevenueChart
        data={chartStats?.dailyStats || []}
        loading={chartLoading}
        dateRange={chartDateRange}
        onDateRangeChange={setChartDateRange}
      />

      {/* Best Selling Products */}
      <BestSellingProducts
        products={bestSellingProducts}
        loading={bestSellingLoading}
        dateRange={bestSellingDateRange}
        onDateRangeChange={setBestSellingDateRange}
        topLimit={bestSellingTopLimit}
        onTopLimitChange={setBestSellingTopLimit}
      />

      {/* Inventory Summary */}
      <InventorySummary
        summary={inventorySummary}
        loading={inventoryLoading}
      />
    </div>
  );
}

// Landing Content for non-logged in users
function LandingContent() {
  const features = [
    {
      title: 'Quản lý đa Shop',
      description: 'Kết nối và quản lý nhiều shop Shopee cùng lúc',
      icon: Store,
      color: 'from-orange-500 to-red-500',
    },
    {
      title: 'Tự động hóa',
      description: 'Flash Sale tự động, refresh token tự động',
      icon: Zap,
      color: 'from-amber-500 to-orange-500',
    },
    {
      title: 'Thống kê chi tiết',
      description: 'Theo dõi đơn hàng, doanh thu theo thời gian thực',
      icon: TrendingUp,
      color: 'from-blue-500 to-indigo-500',
    },
  ];

  return (
    <div className="space-y-8 p-6">
      <div className="text-center py-12">
        <img
          src="/logo_betacom.png"
          alt="BETACOM"
          className="w-20 h-20 rounded-2xl mx-auto mb-6 shadow-lg"
        />
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Chào mừng đến với{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
            BETACOM
          </span>
        </h1>
        <p className="text-lg text-slate-600 max-w-xl mx-auto">
          Nền tảng quản lý Shop Shopee chuyên nghiệp, giúp bạn tối ưu hóa kinh doanh
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.title} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-6">
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} mb-4`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center">
        <Link to="/auth">
          <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 cursor-pointer">
            Đăng nhập để bắt đầu
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
