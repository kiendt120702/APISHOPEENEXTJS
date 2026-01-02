"use client";

/**
 * Danh sách các kết nối Nhanh.vn
 */

import { useNhanhAuth } from "@/hooks/useNhanhAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ConnectNhanhDialog } from "./ConnectNhanhDialog";
import { 
  Building2, 
  MoreVertical, 
  Trash2, 
  RefreshCw,
  CheckCircle2,
  Loader2,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

export function NhanhConnectionsList() {
  const { 
    connections, 
    selectedBusinessId, 
    isLoading, 
    switchBusiness, 
    removeConnection,
    refreshConnections,
    error,
  } = useNhanhAuth();
  
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Debug log
  console.log('[NhanhConnectionsList] connections:', connections);
  console.log('[NhanhConnectionsList] isLoading:', isLoading);
  console.log('[NhanhConnectionsList] error:', error);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshConnections();
    setIsRefreshing(false);
  };

  const handleDelete = async (businessId: number) => {
    await removeConnection(businessId);
    setDeleteConfirm(null);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-lg flex items-center gap-2">
            <img 
              src="https://nhanh.vn/favicon.ico" 
              alt="Nhanh.vn" 
              className="h-5 w-5"
            />
            Kết nối Nhanh.vn
          </CardTitle>
          <CardDescription>
            Quản lý các doanh nghiệp đã kết nối
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          <ConnectNhanhDialog 
            trigger={
              <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                Thêm
              </Button>
            }
            onSuccess={handleRefresh}
          />
        </div>
      </CardHeader>
      <CardContent>
        {connections.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Building2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Chưa có kết nối nào</p>
            <p className="text-sm mt-1">Nhấn "Thêm" để kết nối với Nhanh.vn</p>
          </div>
        ) : (
          <div className="space-y-3">
            {connections.map((conn) => (
              <div
                key={conn.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  selectedBusinessId === conn.businessId
                    ? 'border-primary bg-primary/5'
                    : 'hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {conn.businessName || `Business #${conn.businessId}`}
                      </span>
                      {selectedBusinessId === conn.businessId && (
                        <Badge variant="secondary" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Đang dùng
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {conn.appName && <span>{conn.appName} • </span>}
                      <span>ID: {conn.businessId}</span>
                      {conn.connectedAt && (
                        <span>
                          {" "}• Kết nối{" "}
                          {formatDistanceToNow(new Date(conn.connectedAt), {
                            addSuffix: true,
                            locale: vi,
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {selectedBusinessId !== conn.businessId && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => switchBusiness(conn.businessId)}
                    >
                      Chọn
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => setDeleteConfirm(conn.businessId)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Xóa kết nối
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteConfirm !== null} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa kết nối</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa kết nối này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
