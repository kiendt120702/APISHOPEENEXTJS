/**
 * Nhanh.vn Authentication Edge Function
 * Xử lý OAuth flow với Nhanh.vn API v3.0
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Nhanh.vn API URLs
const NHANH_API_URL = 'https://pos.open.nhanh.vn';
const NHANH_API_VERSION = 'v3.0';

interface RequestBody {
  action: 'get-token' | 'validate-token' | 'get-business-info' | 'check-token';
  accessCode?: string;
  accessToken?: string;
  appId?: string;
  secretKey?: string;
  businessId?: number;
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body: RequestBody = await req.json();
    const { action } = body;

    console.log('[nhanh-auth] Action:', action);

    switch (action) {
      case 'get-token':
        return await handleGetToken(body);
      
      case 'validate-token':
      case 'check-token':
        return await handleCheckToken(body);
      
      case 'get-business-info':
        return await handleGetBusinessInfo(body);
      
      default:
        return new Response(
          JSON.stringify({ code: 0, errorCode: 'INVALID_ACTION', messages: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('[nhanh-auth] Error:', error);
    return new Response(
      JSON.stringify({ 
        code: 0, 
        errorCode: 'INTERNAL_ERROR', 
        messages: error instanceof Error ? error.message : 'Internal server error' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

/**
 * Đổi accessCode lấy accessToken
 * API v3.0: POST /v3.0/app/getaccesstoken?appId={{appId}}
 * Body: { accessCode, secretKey }
 */
async function handleGetToken(body: RequestBody) {
  const { accessCode, appId, secretKey } = body;

  if (!accessCode || !appId || !secretKey) {
    return new Response(
      JSON.stringify({ 
        code: 0, 
        errorCode: 'MISSING_PARAMS', 
        messages: 'Missing accessCode, appId or secretKey' 
      }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  console.log('[nhanh-auth] Getting token for appId:', appId);

  try {
    // Nhanh.vn API v3.0 để đổi accessCode lấy accessToken
    // POST /v3.0/app/getaccesstoken?appId={{appId}}
    const url = `${NHANH_API_URL}/${NHANH_API_VERSION}/app/getaccesstoken?appId=${appId}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accessCode,
        secretKey,
      }),
    });

    const data = await response.json();
    console.log('[nhanh-auth] Nhanh.vn response:', JSON.stringify(data));

    if (data.code === 0) {
      return new Response(
        JSON.stringify(data),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Response format từ Nhanh.vn v3.0:
    // { code: 1, data: { accessToken, version, expiredAt, businessId, depotIds, pageIds, permissions } }
    const tokenData = data.data || data;
    
    return new Response(
      JSON.stringify({
        code: 1,
        data: {
          accessToken: tokenData.accessToken,
          businessId: tokenData.businessId,
          businessName: tokenData.businessName || null,
          expiredAt: tokenData.expiredAt,
          depotIds: tokenData.depotIds || [],
          pageIds: tokenData.pageIds || [],
          permissions: tokenData.permissions || [],
          version: tokenData.version || '3.0',
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[nhanh-auth] Get token error:', error);
    return new Response(
      JSON.stringify({ 
        code: 0, 
        errorCode: 'API_ERROR', 
        messages: error instanceof Error ? error.message : 'Failed to get token' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * Kiểm tra accessToken
 * API v3.0: POST /v3.0/app/checkaccesstoken?appId={{appId}}&businessId={{businessId}}
 * Headers: Authorization: {{accessToken}}
 * Body: { secretKey }
 */
async function handleCheckToken(body: RequestBody) {
  const { accessToken, appId, secretKey, businessId } = body;

  if (!accessToken || !appId || !secretKey || !businessId) {
    return new Response(
      JSON.stringify({ 
        code: 0, 
        errorCode: 'MISSING_PARAMS', 
        messages: 'Missing accessToken, appId, secretKey or businessId' 
      }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const url = `${NHANH_API_URL}/${NHANH_API_VERSION}/app/checkaccesstoken?appId=${appId}&businessId=${businessId}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': accessToken,
      },
      body: JSON.stringify({
        secretKey,
      }),
    });

    const data = await response.json();

    if (data.code === 1) {
      return new Response(
        JSON.stringify({ code: 1, data: { valid: true, ...data.data } }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ code: 0, data: { valid: false }, errorCode: data.errorCode, messages: data.messages }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[nhanh-auth] Check token error:', error);
    return new Response(
      JSON.stringify({ code: 0, data: { valid: false } }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * Lấy thông tin business
 */
async function handleGetBusinessInfo(body: RequestBody) {
  const { accessToken, appId, businessId } = body;

  if (!accessToken || !appId || !businessId) {
    return new Response(
      JSON.stringify({ 
        code: 0, 
        errorCode: 'MISSING_PARAMS', 
        messages: 'Missing accessToken, appId or businessId' 
      }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Gọi API lấy danh sách kho để lấy thông tin business
    const url = `${NHANH_API_URL}/${NHANH_API_VERSION}/depot/list?appId=${appId}&businessId=${businessId}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': accessToken,
      },
      body: JSON.stringify({}),
    });

    const data = await response.json();

    if (data.code === 0) {
      return new Response(
        JSON.stringify(data),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        code: 1,
        data: {
          businessId,
          depots: data.data,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[nhanh-auth] Get business info error:', error);
    return new Response(
      JSON.stringify({ 
        code: 0, 
        errorCode: 'API_ERROR', 
        messages: error instanceof Error ? error.message : 'Failed to get business info' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
