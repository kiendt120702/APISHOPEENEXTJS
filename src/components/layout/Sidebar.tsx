/**
 * Sidebar Component - Menu điều hướng chính
 */

import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Zap,
  Megaphone,
  Package,
  ShoppingCart,
  Store,
  LayoutDashboard,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
  },
  {
    title: 'Quản lý Shop',
    icon: Store,
    path: '/shops',
  },
  {
    title: 'Flash Sale',
    icon: Zap,
    path: '/flash-sale',
  },
  {
    title: 'Quảng cáo (ADS)',
    icon: Megaphone,
    path: '/ads',
  },
  {
    title: 'Sản phẩm',
    icon: Package,
    path: '/products',
  },
  {
    title: 'Đơn hàng',
    icon: ShoppingCart,
    path: '/orders',
  },
  {
    title: 'Cài đặt',
    icon: Settings,
    path: '/settings',
  },
];

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        'fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-slate-200 transition-all duration-300 z-20',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-6 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:bg-slate-50 transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4 text-slate-500" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-slate-500" />
        )}
      </button>

      {/* Menu Items */}
      <nav className="p-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100'
              )}
            >
              <Icon className={cn('w-5 h-5 flex-shrink-0', isActive ? 'text-white' : 'text-slate-500')} />
              {!collapsed && (
                <span className={cn('font-medium text-sm', isActive ? 'text-white' : 'text-slate-700')}>
                  {item.title}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
