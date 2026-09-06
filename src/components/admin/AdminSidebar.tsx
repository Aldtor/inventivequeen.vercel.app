import {
  Boxes,
  Crown,
  ExternalLink,
  LayoutDashboard,
  Megaphone,
  Package,
  Settings,
  ShoppingBag,
  Star,
  Tag,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png";

export type AdminTab =
  | "overview"
  | "orders"
  | "products"
  | "inventory"
  | "reviews"
  | "coupons"
  | "customers"
  | "store"
  | "settings";

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
}

const NAV_ITEMS: { id: AdminTab; title: string; icon: LucideIcon }[] = [
  { id: "overview", title: "Overview", icon: LayoutDashboard },
  { id: "orders", title: "Orders CMS", icon: ShoppingBag },
  { id: "products", title: "Products CMS", icon: Package },
  { id: "inventory", title: "Yarn & Supplies", icon: Boxes },
  { id: "reviews", title: "Reviews CMS", icon: Star },
  { id: "coupons", title: "Coupons CMS", icon: Tag },
  { id: "customers", title: "Patrons CRM", icon: Users },
  { id: "store", title: "Store & Banner", icon: Megaphone },
  { id: "settings", title: "Settings", icon: Settings },
];

export function AdminSidebar({ activeTab, onSelectTab }: AdminSidebarProps) {
  return (
    <aside className="w-64 border-r border-white/60 bg-white/40 backdrop-blur-xl p-4 flex flex-col justify-between flex-shrink-0">
      <div className="space-y-6">
        {/* Brand header */}
        <div className="flex items-center gap-3 px-2 pb-4 border-b border-white/50">
          <div className="relative">
            <img
              src={logo}
              alt="Inventive Queen logo"
              className="size-10 rounded-full object-cover shadow-sm ring-2 ring-lilac-deep/20"
            />
            <span className="absolute -bottom-1 -right-1 flex size-4 items-center justify-center rounded-full bg-amber-200 text-amber-900 shadow-xs border border-white">
              <Crown className="size-2.5" />
            </span>
          </div>
          <div>
            <h2 className="font-display text-sm font-extrabold text-lilac-deep leading-tight">
              Inventive Queen
            </h2>
            <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              Royal Atelier CMS
            </p>
          </div>
        </div>

        {/* Menu */}
        <div>
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Management
          </p>
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-lilac-deep text-white shadow-md"
                      : "text-muted-foreground hover:bg-white/60 hover:text-lilac-deep"
                  }`}
                >
                  <Icon className="size-4 flex-shrink-0" />
                  <span>{item.title}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Storefront Link */}
      <div className="pt-4 border-t border-white/50">
        <Link
          to="/"
          className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-muted-foreground hover:text-lilac-deep hover:bg-white/60 rounded-xl transition-all"
        >
          <ExternalLink className="size-4" />
          <span>View Live Storefront</span>
        </Link>
      </div>
    </aside>
  );
}
