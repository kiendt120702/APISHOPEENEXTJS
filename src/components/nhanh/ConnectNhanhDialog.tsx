"use client";

/**
 * Dialog kết nối shop với Nhanh.vn
 */

import { useState } from "react";
import { useNhanhAuth } from "@/hooks/useNhanhAuth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Plus, ExternalLink, Info } from "lucide-react";

interface ConnectNhanhDialogProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function ConnectNhanhDialog({ trigger, onSuccess }: ConnectNhanhDialogProps) {
  const { login, isLoading, error } = useNhanhAuth();
  const [open, setOpen] = useState(false);
  const [appId, setAppId] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [appName, setAppName] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const handleConnect = async () => {
    setFormError(null);

    if (!appId.trim()) {
      setFormError("Vui lòng nhập App ID");
      return;
    }

    if (!secretKey.trim()) {
      setFormError("Vui lòng nhập Secret Key");
      return;
    }

    try {
      await login({
        appId: appId.trim(),
        secretKey: secretKey.trim(),
        appName: appName.trim() || undefined,
      });
      
      // Callback sẽ được xử lý ở trang callback
      onSuccess?.();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Kết nối thất bại");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Kết nối Nhanh.vn
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <img 
              src="https://nhanh.vn/favicon.ico" 
              alt="Nhanh.vn" 
              className="h-6 w-6"
            />
            Kết nối với Nhanh.vn
          </DialogTitle>
          <DialogDescription>
            Nhập thông tin App để kết nối với doanh nghiệp trên Nhanh.vn
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Hướng dẫn */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Để lấy App ID và Secret Key, bạn cần tạo App tại{" "}
              <a
                href="https://nhanh.vn/app/manage"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                Quản lý App Nhanh.vn
                <ExternalLink className="h-3 w-3" />
              </a>
            </AlertDescription>
          </Alert>

          {/* Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="appId">App ID *</Label>
              <Input
                id="appId"
                placeholder="Nhập App ID từ Nhanh.vn"
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="secretKey">Secret Key *</Label>
              <Input
                id="secretKey"
                type="password"
                placeholder="Nhập Secret Key"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="appName">Tên App (tùy chọn)</Label>
              <Input
                id="appName"
                placeholder="Đặt tên để dễ nhận biết"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Error messages */}
          {(formError || error) && (
            <Alert variant="destructive">
              <AlertDescription>{formError || error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
            Hủy
          </Button>
          <Button onClick={handleConnect} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang kết nối...
              </>
            ) : (
              "Kết nối"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
