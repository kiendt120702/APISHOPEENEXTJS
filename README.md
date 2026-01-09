# BETACOM - Shopee Shop Manager

Ứng dụng quản lý shop Shopee với React + Vite + Supabase

## 🚀 Bắt đầu

### 1. Cài đặt dependencies

```bash
pnpm install
```

### 2. Cấu hình Environment Variables

Tạo file `.env.local` trong thư mục root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Shopee API Configuration
VITE_SHOPEE_PARTNER_ID=123456
VITE_SHOPEE_PARTNER_KEY=your_partner_key_here
VITE_SHOPEE_CALLBACK_URL=http://localhost:5173/auth/callback

# Optional
VITE_SHOPEE_SHOP_ID=
VITE_TOKEN_ENCRYPTION_KEY=your_encryption_key_here
```

### 3. Chạy ứng dụng

```bash
pnpm dev
```

Truy cập http://localhost:5173

## 📁 Cấu trúc dự án

```
.
├── src/
│   ├── pages/              # Các trang chính
│   │   ├── AuthPage.tsx
│   │   ├── AuthCallback.tsx
│   │   ├── ProfileShopsPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── components/         # UI Components
│   │   ├── ui/            # Shadcn UI components
│   │   ├── auth/          # Auth components
│   │   ├── shop/          # Shop components
│   │   └── profile/       # Profile components
│   ├── contexts/          # React contexts
│   │   └── AuthContext.tsx
│   ├── hooks/             # Custom React hooks
│   │   ├── useAuth.ts
│   │   └── useShopeeAuth.ts
│   ├── lib/               # Utilities và services
│   │   ├── shopee/        # Shopee SDK integration
│   │   └── supabase.ts    # Supabase client
│   ├── utils/             # Helper functions
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Entry point
├── supabase/              # Supabase backend
│   ├── functions/         # Edge Functions
│   └── migrations/        # Database migrations
├── public/                # Static assets
└── package.json
```

## 🔧 Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool
- **TypeScript** - Type safety
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching & caching
- **Supabase** - Backend & Database
- **Tailwind CSS** - Styling
- **Shadcn UI** - UI components

## 📝 Features

- ✅ Xác thực người dùng (Authentication)
- ✅ Kết nối Shop Shopee với OAuth
- ✅ Quản lý danh sách Shop
- ✅ Auto refresh Shopee token

## 🛠 Commands

```bash
# Development
pnpm dev

# Build
pnpm build

# Preview production build
pnpm preview

# Lint
pnpm lint
```

## 📚 Tài liệu tham khảo

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Supabase](https://supabase.com/docs)
- [Shopee Open Platform](https://open.shopee.com)
