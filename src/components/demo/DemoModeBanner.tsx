/**
 * Demo Mode Banner - Hiển thị khi đang ở chế độ demo
 */

import { cn } from '@/lib/utils';

interface DemoModeBannerProps {
  className?: string;
}

export function DemoModeBanner({ className }: DemoModeBannerProps) {
  return (
    <div className={cn(
      "bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 text-center text-sm",
      className
    )}>
      <div className="flex items-center justify-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>
          <strong>Demo Mode</strong> - Đây là dữ liệu mẫu để minh họa tính năng. 
          Kết nối shop Shopee thật để sử dụng đầy đủ chức năng.
        </span>
      </div>
    </div>
  );
}

export default DemoModeBanner;
