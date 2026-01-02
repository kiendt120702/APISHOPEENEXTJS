/**
 * Nhanh.vn API Client via Supabase Edge Functions
 * Gọi backend API để xử lý Nhanh.vn authentication
 */

import { supabase, isSupabaseConfigured } from '../supabase';
import type { NhanhAccessToken, NhanhAppCredentials, NhanhBusiness } from './types';
import { getNhanhAuthUrl } from './config';

export { isSupabaseConfigured };

/**
 * Lấy URL xác thực OAuth từ Nhanh.vn
 * @param credentials - App credentials (appId, secretKey)
 * @param redirectUrl - URL callback sau khi cấp quyền
 */
export async function getNhanhAuthorizationUrl(
  credentials: NhanhAppCredentials,
  redirectUrl: string
): Promise<string> {
  console.log('[Nhanh] getNhanhAuthorizationUrl called');
  console.log('[Nhanh] appId:', credentials.appId);
  console.log('[Nhanh] redirectUrl:', redirectUrl);

  // Nhanh.vn sử dụng OAuth đơn giản - chỉ cần redirect đến URL với appId và returnLink
  const authUrl = getNhanhAuthUrl(credentials.appId, redirectUrl);
  
  console.log('[Nhanh] Auth URL:', authUrl);
  return authUrl;
}

/**
 * Đổi accessCode lấy accessToken
 * @param accessCode - Code nhận được từ callback
 * @param credentials - App credentials
 */
export async function authenticateWithAccessCode(
  accessCode: string,
  credentials: NhanhAppCredentials
): Promise<NhanhAccessToken> {
  console.log('[Nhanh] authenticateWithAccessCode called');
  console.log('[Nhanh] accessCode:', accessCode.substring(0, 10) + '...');

  const { data, error } = await supabase.functions.invoke('nhanh-auth', {
    body: {
      action: 'get-token',
      accessCode,
      appId: credentials.appId,
      secretKey: credentials.secretKey,
    },
  });

  console.log('[Nhanh] authenticateWithAccessCode response:', { data, error });

  if (error) {
    throw new Error(error.message || 'Failed to authenticate with Nhanh.vn');
  }

  if (data.code === 0) {
    throw new Error(data.messages || data.errorCode || 'Authentication failed');
  }

  const token: NhanhAccessToken = {
    accessToken: data.data.accessToken,
    businessId: data.data.businessId,
    businessName: data.data.businessName,
    permissions: data.data.permissions,
    createdAt: Date.now(),
  };

  return token;
}

/**
 * Lấy thông tin business từ Nhanh.vn
 */
export async function getNhanhBusinessInfo(
  accessToken: string,
  appId: string,
  businessId: number
): Promise<NhanhBusiness> {
  const { data, error } = await supabase.functions.invoke('nhanh-auth', {
    body: {
      action: 'get-business-info',
      accessToken,
      appId,
      businessId,
    },
  });

  if (error) {
    throw new Error(error.message || 'Failed to get business info');
  }

  if (data.code === 0) {
    throw new Error(data.messages || 'Failed to get business info');
  }

  return data.data as NhanhBusiness;
}

/**
 * Kiểm tra accessToken còn hợp lệ không
 * Nhanh.vn accessToken không hết hạn, nhưng có thể bị revoke
 */
export async function validateNhanhToken(
  accessToken: string,
  appId: string,
  businessId: number
): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke('nhanh-auth', {
      body: {
        action: 'validate-token',
        accessToken,
        appId,
        businessId,
      },
    });

    if (error || data.code === 0) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Lưu thông tin kết nối Nhanh.vn vào database
 */
export async function saveNhanhConnection(
  userId: string,
  token: NhanhAccessToken,
  credentials: NhanhAppCredentials
): Promise<void> {
  console.log('[Nhanh] saveNhanhConnection called');
  console.log('[Nhanh] userId:', userId);
  console.log('[Nhanh] businessId:', token.businessId);
  console.log('[Nhanh] appId:', credentials.appId);

  const connectionData = {
    user_id: userId,
    business_id: token.businessId,
    business_name: token.businessName,
    access_token: token.accessToken,
    app_id: credentials.appId,
    app_name: credentials.appName,
    secret_key: credentials.secretKey,
    permissions: token.permissions || [],
    expired_at: token.expiredAt,
    depot_ids: token.depotIds || [],
    page_ids: token.pageIds || [],
    version: token.version || '3.0',
    is_active: true,
    connected_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  console.log('[Nhanh] Connection data:', JSON.stringify(connectionData, null, 2));

  const { data, error } = await supabase
    .from('nhanh_connections')
    .upsert(connectionData, {
      onConflict: 'user_id,business_id',
    })
    .select();

  if (error) {
    console.error('[Nhanh] Failed to save connection:', error);
    console.error('[Nhanh] Error details:', JSON.stringify(error, null, 2));
    throw error;
  }

  console.log('[Nhanh] Connection saved successfully:', data);
}

/**
 * Lấy danh sách kết nối Nhanh.vn của user
 */
export async function getUserNhanhConnections(userId: string) {
  const { data, error } = await supabase
    .from('nhanh_connections')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('connected_at', { ascending: false });

  if (error) {
    console.error('[Nhanh] Failed to get connections:', error);
    return [];
  }

  return data || [];
}

/**
 * Xóa kết nối Nhanh.vn
 */
export async function removeNhanhConnection(
  userId: string,
  businessId: number
): Promise<void> {
  const { error } = await supabase
    .from('nhanh_connections')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('business_id', businessId);

  if (error) {
    console.error('[Nhanh] Failed to remove connection:', error);
    throw error;
  }
}
