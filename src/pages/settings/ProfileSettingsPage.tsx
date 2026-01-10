/**
 * Profile Settings Page - Hiển thị danh sách shop đã kết nối
 */

import ShopManagementPanel from '@/components/profile/ShopManagementPanel';

export default function ProfileSettingsPage() {
  return (
    <div className="space-y-6 bg-white min-h-full">
      {/* Shop Management Panel */}
      <ShopManagementPanel />
    </div>
  );
}
