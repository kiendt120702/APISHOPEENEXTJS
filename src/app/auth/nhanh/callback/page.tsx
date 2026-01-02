"use client";

/**
 * Nhanh.vn OAuth Callback Page
 * Xử lý callback từ Nhanh.vn sau khi user cấp quyền
 */

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  saveNhanhConnection, 
  storeNhanhToken,
  getStoredNhanhCredentials,
} from "@/lib/nhanh";
import type { NhanhAccessToken, NhanhAppCredentials } from "@/lib/nhanh";

function NhanhCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Đang xử lý kết nối Nhanh.vn...");

  useEffect(() => {
    async function processCallback() {
      // Nhanh.vn trả về accessCode trong URL
      const accessCode = searchParams.get("accessCode");

      if (!accessCode) {
        setStatus("error");
        setMessage("Không tìm thấy mã xác thực từ Nhanh.vn");
        return;
      }

      try {
        // Lấy credentials từ sessionStorage
        let credentials: NhanhAppCredentials | null = null;
        const storedCreds = sessionStorage.getItem('nhanh_credentials');
        if (storedCreds) {
          credentials = JSON.parse(storedCreds);
        } else {
          // Thử lấy từ localStorage
          credentials = await getStoredNhanhCredentials();
        }

        if (!credentials) {
          setStatus("error");
          setMessage("Không tìm thấy thông tin App. Vui lòng thử kết nối lại.");
          return;
        }

        setMessage("Đang đổi mã xác thực lấy access token...");

        // Gọi Edge Function để đổi accessCode lấy accessToken
        const { data, error } = await supabase.functions.invoke('nhanh-auth', {
          body: {
            action: 'get-token',
            accessCode,
            appId: credentials.appId,
            secretKey: credentials.secretKey,
          },
        });

        if (error) {
          throw new Error(error.message || 'Không thể kết nối với server');
        }

        if (data.code === 0) {
          throw new Error(
            Array.isArray(data.messages) 
              ? data.messages.join(', ') 
              : data.messages || data.errorCode || 'Lấy access token thất bại'
          );
        }

        const tokenData = data.data;
        const newToken: NhanhAccessToken = {
          accessToken: tokenData.accessToken,
          businessId: tokenData.businessId,
          businessName: tokenData.businessName,
          expiredAt: tokenData.expiredAt,
          depotIds: tokenData.depotIds,
          pageIds: tokenData.pageIds,
          permissions: tokenData.permissions,
          version: tokenData.version || '3.0',
          createdAt: Date.now(),
        };
        
        // Lưu token locally
        await storeNhanhToken(newToken);
        console.log('[NhanhCallback] Token stored locally');

        // Lưu vào database nếu user đã đăng nhập
        const { data: { user } } = await supabase.auth.getUser();
        console.log('[NhanhCallback] Current user:', user?.id);
        
        if (user) {
          try {
            console.log('[NhanhCallback] Saving connection to database...');
            await saveNhanhConnection(user.id, newToken, credentials);
            console.log('[NhanhCallback] Connection saved successfully');
          } catch (saveError) {
            console.error('[NhanhCallback] Failed to save connection:', saveError);
            // Vẫn tiếp tục vì token đã được lưu locally
          }
        } else {
          console.warn('[NhanhCallback] No user logged in, skipping database save');
        }

        // Clear sessionStorage
        sessionStorage.removeItem('nhanh_credentials');

        setStatus("success");
        setMessage(`Kết nối thành công! Business ID: ${newToken.businessId}`);

        // Redirect về trang quản lý shop sau 2 giây
        setTimeout(() => router.push("/profile/shops"), 2000);
      } catch (error) {
        console.error('[NhanhCallback] Error:', error);
        setStatus("error");
        setMessage(
          error instanceof Error ? error.message : "Kết nối thất bại"
        );
      }
    }

    processCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md text-center">
        {status === "loading" && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <p className="text-green-600 font-medium">{message}</p>
            <p className="text-gray-500 text-sm mt-2">Đang chuyển hướng...</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-red-500 text-5xl mb-4">✗</div>
            <p className="text-red-600 font-medium">{message}</p>
            <button
              onClick={() => router.push("/profile/shops")}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Quay lại
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
        <p className="text-gray-600">Đang tải...</p>
      </div>
    </div>
  );
}

export default function NhanhCallbackPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <NhanhCallbackContent />
    </Suspense>
  );
}
