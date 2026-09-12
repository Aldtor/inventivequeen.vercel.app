<p align="center">
  <img src="public/logo.png" alt="Inventive Queen Logo" width="160" style="border-radius: 50%; box-shadow: 0 10px 30px rgba(124, 58, 237, 0.25);" />
</p>

<h1 align="center">👑 INVENTIVE QUEEN</h1>

<p align="center">
  <strong>The Royal Atelier for Handmade Crochet Dolls, Everlasting Bouquets & Bespoke Keepsakes</strong>
</p>

<p align="center">
  <a href="https://inventivequeen.vercel.app"><img src="https://img.shields.io/badge/Storefront-Live%20Website-7C3AED?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Website" /></a>
  <a href="#-technology-stack"><img src="https://img.shields.io/badge/TanStack%20Start-SSR%20%2B%20Streaming-FF4154?style=for-the-badge&logo=tanstack&logoColor=white" alt="TanStack Start" /></a>
  <a href="#-technology-stack"><img src="https://img.shields.io/badge/React%2019-Strict%20TypeScript-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" /></a>
  <a href="#-database--security-hardening"><img src="https://img.shields.io/badge/Supabase-Database%20%26%20RLS-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" /></a>
  <a href="#-payments--checkout"><img src="https://img.shields.io/badge/Razorpay-Verified%20Payments-02042B?style=for-the-badge&logo=razorpay&logoColor=00BAF2" alt="Razorpay" /></a>
  <a href="#-styling--design-system"><img src="https://img.shields.io/badge/Tailwind%20CSS%20v4-Artisan%20Theme-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" /></a>
</p>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Dedicated Product Subpage (`/product/$productId`)](#-dedicated-product-subpage-productproductid)
- [Royal Crochet Needle Mouse Pointer](#-royal-crochet-needle-mouse-pointer)
- [Admin CMS & Atelier Management](#-admin-cms--atelier-management)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database & Security Hardening](#-database--security-hardening)
- [Building & Deployment](#-building--deployment)
- [Contributing & License](#-license)

---

## 🌸 Overview

**Inventive Queen** is an artisanal e-commerce storefront and enterprise-grade administrative suite built for handcrafted crochet art, customized couple/portrait dolls, everlasting botanical bouquets, and plushies.

The platform combines a high-aesthetic luxury storefront (liquid glass morphism, soft pastel gradients, royal lilac accents, and a custom crochet needle cursor) with full server-side rendering, cryptographic payment validation via Razorpay, real-time Supabase order tracking, and an extensive administration back-office.

---

## ✨ Key Features

### 🛍️ Client Storefront
- **Artisan Showcase**: Curated catalogues for Dolls, Everlasting Bouquets, Characters & Plushies, and Keychains.
- **Interactive Multi-Photo Gallery**: High-res lightboxes with zoom for examining handmade milk-cotton stitches.
- **Dedicated Product Subpages (`/product/$productId`)**: Rich details, size dimensions, wash & care guides, materials breakdown, and personalized customization input notes.
- **Interactive Basket & Persistent Cart**: Real-time quantity management, subtotal calculation, coupon discounts, and instant checkout.
- **Live Parcel & Order Tracking**: Instant tracking screen (`/orders`) with live fulfillment status (`Pending` → `Confirmed` → `Crafting` → `Shipped` → `Delivered`), tracking numbers, and direct Instagram customer support.
- **Direct Instagram Inquiries**: 1-click customer consultation with the Queen on Instagram (@inventivequeen) for custom requests.

### 💳 Payments & Checkout
- **Razorpay Integration**: Seamless UPI (GPay, PhonePe, Paytm), credit/debit cards, and net banking support.
- **Dual Verification Layer**:
  - Cryptographic server-side HMAC-SHA256 signature verification.
  - Supabase atomic `confirm_order_payment` Security Definer function with integrity trigger protections.
- **Clean Failure & Cancel Handling**: Gracefully handles payment dismissals or cancellation without leaving invalid or ghost "paid" records.

### 🧵 Royal Crochet Needle Mouse Pointer
- Custom-designed crochet needle with golden metallic hook and ergonomic lavender handle.
- Pixel-precise `(1, 1)` hotspot alignment so the tip of the needle acts as the cursor.
- Transparent antialiased 32×32 PNG assets integrated with fallback cursors.

---

## 🔍 Dedicated Product Subpage (`/product/$productId`)

Every product across the entire website links to its own standalone subpage providing:
- **Resilient URL Resolution**: Supports both exact UUIDs/IDs (`regular-doll`, `mixed-rose-grand-bouquet`) and URL slugs.
- **Artisanal Specifications Tab**: Detailed breakdown of 100% Milk Cotton yarn, hypoallergenic polyfill, safety hardware, and sizes.
- **Customization Guide**: Clear step-by-step instructions on submitting reference portraits for custom amigurumi dolls.
- **Wash & Care Instructions**: Care rules for keeping hand-knitted pieces fresh and vibrant forever.
- **Packaging & Delivery Details**: Courier timeline and transit damage guarantee.
- **Sticky Mobile Quick-Bar**: Effortless Add to Basket / Buy Now actions for mobile visitors.

---

## 👑 Admin CMS & Atelier Management

The `/admin` portal provides store administrators with an all-in-one operations hub:

| Module | Description |
| :--- | :--- |
| **Order Kanban Board** | Drag-and-drop or 1-click status transitions through all production stages. |
| **Order Deletion** | Safely and permanently delete any order (confirmed or unconfirmed) with modal confirmation. |
| **Printable Packing Slips** | Auto-formatted printable slips complete with customer notes and address boxes. |
| **Gift Note Cards** | Beautiful printable gift note templates with wax seal borders. |
| **Product Catalogue Editor** | Add, edit, reorder, or toggle active products and badges (`Bestseller`, `New Arrival`). |
| **Promotional Coupon CMS** | Create percentage or flat discounts, usage limits, and minimum order values. |
| **Inventory Supplies Tracker** | Manage yarn spools, safety eyes, ribbons, and low-stock alerts. |
| **Analytics & Revenue Charts** | Monthly revenue trends, average order value, and order status distribution. |
| **CSV Export** | Export full order records to CSV for courier shipping logistics. |

---

## 🛠️ Technology Stack

```
Frontend:          React 19 · TypeScript · Tailwind CSS v4 · Lucide React · Radix UI
Routing & SSR:     TanStack Start · TanStack Router · TanStack React Query
Backend & Server:  Nitro Server Engine · Cloudflare / Node Workers
Database:          PostgreSQL · Supabase (Auth, RLS, Storage, RPCs)
Payment Gateway:   Razorpay API & Checkout SDK (HMAC-SHA256 Signature Verification)
Tooling:           Vite 8 · ESLint · Prettier
```

---

## 📁 Project Structure

```bash
├── public/                     # Static assets (logo, icons, cursor assets, robots.txt)
│   ├── cursor.png              # 32x32 transparent royal crochet needle cursor
│   ├── cursor-pointer.png      # Interactive element cursor
│   └── logo.png                # High-resolution atelier brand crest
├── src/
│   ├── assets/                 # Brand imagery and UI media
│   ├── components/
│   │   ├── admin/              # Admin dashboard widgets (Kanban, slips, charts, modals)
│   │   ├── site/               # Public site layout, navigation header, footer
│   │   └── ui/                 # Radix UI primitive components
│   ├── lib/
│   │   ├── auth.tsx            # Supabase auth context with strict admin privilege verification
│   │   ├── cart.ts             # Basket state, quantity calculations & local storage sync
│   │   ├── cms-coupons.ts      # Discount coupon validation and redemption logic
│   │   ├── cms-products.tsx    # Live Supabase catalogue sync with local fallback
│   │   ├── order-utils.ts      # Tracking serializations, order helpers & CSV export
│   │   ├── security.ts         # HMAC signature validation & input sanitizers
│   │   └── supabase.ts         # Supabase client singleton & TypeScript models
│   ├── routes/
│   │   ├── __root.tsx          # Root document, metadata, custom cursor styles
│   │   ├── index.tsx           # Atelier landing page & showcase
│   │   ├── product.$productId.tsx # Dedicated product subpage
│   │   ├── checkout.tsx        # Secure checkout & Razorpay payment orchestrator
│   │   ├── orders.tsx          # Customer live order tracking & parcel updates
│   │   ├── admin.tsx           # Atelier executive administration suite
│   │   ├── login.tsx           # Authentication portal (Sign In / Register)
│   │   └── ...                 # Category pages (dolls, flowers, characters, etc.)
│   ├── server/
│   │   ├── api.ts              # Server handlers (/api/create-razorpay-order, /api/verify-payment)
│   │   └── rate-limiter.ts     # Sliding-window IP rate limiter
│   ├── server.ts               # SSR entrypoint & security headers (CSP, HSTS, CSRF)
│   └── styles.css              # Custom themes, glassmorphism, and animations
├── supabase/
│   └── schema.sql              # Complete database schema, RLS policies, RPCs, seed data
├── package.json
└── vite.config.ts
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v20.x or higher
- **npm** (or **bun** / **pnpm**)
- A **Supabase** project (free tier works great)
- A **Razorpay** merchant account (test or live)

### 1. Clone the repository
```bash
git clone https://github.com/Aldtor/inventive-tech-_-ald-447386a2.git
cd inventive-tech-_-ald-447386a2
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your credentials (see [Environment Variables](#-environment-variables) below).

### 4. Setup the database
Run the SQL script located in [`supabase/schema.sql`](supabase/schema.sql) inside your Supabase project's **SQL Editor**. This will:
- Create tables (`profiles`, `orders`, `order_items`, `cms_products`, `admin_users`, etc.).
- Configure Row Level Security (RLS) policies.
- Install Security Definer RPC functions and anti-tamper triggers.
- Populate initial products and settings.

### 5. Launch development server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

---

## 🔑 Environment Variables

| Variable | Scope | Description |
| :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | Public (Client) | Your Supabase project URL (`https://xyz.supabase.co`) |
| `VITE_SUPABASE_ANON_KEY` | Public (Client) | Public anonymous key for client requests |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Public (Client) | Supabase publishable key |
| `VITE_RAZORPAY_KEY_ID` | Public (Client) | Razorpay Key ID (`rzp_test_...` or `rzp_live_...`) |
| `RAZORPAY_KEY_ID` | Private (Server) | Razorpay Key ID used by server API routes |
| `RAZORPAY_KEY_SECRET` | Private (Server) | Secret used for HMAC-SHA256 signature verification |
| `SUPABASE_SERVICE_ROLE_KEY` | Private (Server) | Optional: bypasses RLS for administrative operations |

---

## 🛡️ Database & Security Hardening

The application incorporates strict multi-layered security:

- **Row Level Security (RLS)**:
  - Users can strictly view and insert their own orders.
  - Scoped UPDATE/DELETE policies allow customers to remove or cancel incomplete orders without elevating privileges.
  - Administrative actions (`cms_products`, inventory, all orders) are locked to verified entries in `admin_users`.
- **Anti-Tampering Trigger (`trg_enforce_order_security`)**:
  - Rejects unauthorized client-side status escalations to `paid`.
  - Enforces order ownership immutability (`user_id` cannot be modified after creation).
  - Guarantees total order amounts cannot be modified post-creation.
- **Secure RPCs**:
  - `confirm_order_payment`: Atomic Security Definer function that confirms payment within a transaction-scoped flag.
  - Access is revoked from public `anon` role.
- **Server-Side Defenses**:
  - Strict Content Security Policy (CSP), HSTS, and X-Frame-Options headers.
  - Sliding-window IP rate limiting on API endpoints (20 req / minute).
  - 32KB payload size limit to prevent Denial-of-Service attacks.
  - Cross-Origin and Sec-Fetch-Site request filtering.

---

## 📦 Building & Deployment

### Build production bundle
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

### Deploy to Cloudflare / Vercel
The application is pre-configured with Nitro for instant zero-config deployments:
- **Cloudflare Pages / Workers**: Nitro emits ready-to-deploy `.wrangler` and `.output` worker bundles.
- **Vercel**: Import the GitHub repo; build command `npm run build` and output directory `.output` work out of the box.

---

## 📜 License

Created with care for **Inventive Queen**. All rights reserved. Handcrafted with love and royal elegance.
