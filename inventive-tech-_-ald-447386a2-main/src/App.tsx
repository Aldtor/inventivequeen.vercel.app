import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import { ProductsProvider } from "@/lib/cms-products";
import Index from "./pages/Index.tsx";

import { CartDrawer } from "@/components/CartDrawer";
import ShopPage from "./pages/ShopPage.tsx";

/* Code-split non-critical routes for smaller initial bundle */
const ProductPage = lazy(() => import("./pages/ProductPage.tsx"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage.tsx"));
const SuccessPage = lazy(() => import("./pages/SuccessPage.tsx"));
const CartPage = lazy(() => import("./pages/CartPage.tsx"));
const LoginPage = lazy(() => import("./pages/LoginPage.tsx"));
const AccountPage = lazy(() => import("./pages/AccountPage.tsx"));
const OrdersPage = lazy(() => import("./pages/OrdersPage.tsx"));
const AuthActionPage = lazy(() => import("./pages/AuthActionPage.tsx"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard.tsx"));
const PolicyPage = lazy(() => import("./pages/PolicyPage.tsx"));
const CustomOrdersPage = lazy(() => import("./pages/CustomOrdersPage.tsx"));
const CategoryPage = lazy(() => import("./pages/CategoryPage.tsx"));
const AboutAtelierPage = lazy(() => import("./pages/AboutAtelierPage.tsx"));
const ReviewsPage = lazy(() => import("./pages/ReviewsPage.tsx"));
const HowToOrderPage = lazy(() => import("./pages/HowToOrderPage.tsx"));
const FaqPage = lazy(() => import("./pages/FaqPage.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const queryClient = new QueryClient();

import heroBg from "@/assets/hero.jpg";

/** Minimal loading fallback that matches the site's visual style */
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
  </div>
);

/** Global Luxury Background using the hero atelier image */
const GlobalAtelierBackground = () => (
  <div className="fixed inset-0 pointer-events-none -z-50 overflow-hidden select-none" aria-hidden="true">
    <img
      src={heroBg}
      alt="Inventive Queen Atelier Background"
      className="w-full h-full object-cover object-right-top fixed inset-0 scale-100"
    />
    {/* Delicate ambient overlay: keeps text 100% readable while letting the lovely lavender silk & crochet companions shine through as the website background */}
    <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 via-55% to-white/30" />
    <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent via-50% to-[#FAF8F5]/90" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <ProductsProvider>
          <BrowserRouter>
            <GlobalAtelierBackground />
            <CartDrawer />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/shop/:slug" element={<ProductPage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/success" element={<SuccessPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/auth/verified" element={<AuthActionPage mode="verified" />} />
                <Route path="/auth/reset-password" element={<AuthActionPage mode="reset-password" />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/orders" element={<AdminDashboard />} />
                <Route path="/admin/products" element={<AdminDashboard />} />
                <Route path="/admin/settings" element={<AdminDashboard />} />
                <Route path="/policy/:slug" element={<PolicyPage />} />
                <Route path="/custom-orders" element={<CustomOrdersPage />} />
                <Route path="/category/:slug" element={<CategoryPage />} />
                <Route path="/about" element={<AboutAtelierPage />} />
                <Route path="/reviews" element={<ReviewsPage />} />
                <Route path="/how-to-order" element={<HowToOrderPage />} />
                <Route path="/faq" element={<FaqPage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </ProductsProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
