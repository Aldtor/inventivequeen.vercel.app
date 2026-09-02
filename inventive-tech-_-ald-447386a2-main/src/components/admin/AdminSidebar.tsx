import { LayoutDashboard, ShoppingBag, Package, Settings, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import logo from "@/assets/logo.png";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Orders", url: "/admin/orders", icon: ShoppingBag },
  { title: "Products", url: "/admin/products", icon: Package },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-border/60 bg-card/80 backdrop-blur-xl">
      <SidebarContent className="pt-4">
        {!collapsed && (
          <div className="px-4 pb-4 flex items-center gap-3 border-b border-border/40 mb-2">
            <div className="relative">
              <img src={logo} alt="Inventive Queen" className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/30 shadow-sm" />
              <span className="absolute -bottom-1 -right-1 text-xs select-none">👑</span>
            </div>
            <div>
              <h2 className="font-display text-sm font-bold text-foreground leading-tight">
                Inventive Queen
              </h2>
              <p className="font-body text-[10px] text-primary uppercase tracking-wider font-bold">Royal Atelier CMS</p>
            </div>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupLabel className="font-body text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-4">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-2 space-y-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/admin"}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-secondary/70 hover:text-foreground transition-all"
                      activeClassName="bg-primary/10 text-primary font-bold shadow-sm"
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Back to store link */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    to="/"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-secondary/70 hover:text-primary transition-all mt-4 border-t border-border/30 pt-3"
                  >
                    <ExternalLink className="h-4 w-4 flex-shrink-0" />
                    {!collapsed && <span>View Live Website</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
