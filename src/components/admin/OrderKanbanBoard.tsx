import { useMemo } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ClipboardList,
  Clock,
  Crown,
  ExternalLink,
  Mail,
  MessageCircle,
  Package,
  Printer,
  Sparkles,
  Truck,
  type LucideIcon,
} from "lucide-react";
import type { DbOrder, OrderStatus } from "@/lib/supabase";
import { createWhatsAppChatUrl, parseAdminNotes, getOrderItemImageUrl } from "@/lib/order-utils";
import logo from "@/assets/logo.png";

interface OrderKanbanBoardProps {
  orders: DbOrder[];
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  onOpenPackingSlip: (order: DbOrder) => void;
  onOpenGiftNote?: (order: DbOrder) => void;
}

interface ColumnConfig {
  id: OrderStatus;
  title: string;
  icon: LucideIcon;
  accent: string;
  badgeBg: string;
  nextStatus?: OrderStatus;
  nextLabel?: string;
  prevStatus?: OrderStatus;
}

const COLUMNS: ColumnConfig[] = [
  {
    id: "pending",
    title: "New Orders & Pending",
    icon: ClipboardList,
    accent: "border-amber-300 bg-amber-50/50",
    badgeBg: "bg-amber-100 text-amber-800",
    nextStatus: "crafting",
    nextLabel: "Start Crafting",
  },
  {
    id: "crafting",
    title: "In Hand-Crafting (Workshop)",
    icon: Sparkles,
    accent: "border-purple-300 bg-purple-50/50",
    badgeBg: "bg-purple-100 text-purple-800",
    nextStatus: "shipped",
    nextLabel: "Mark Dispatched",
    prevStatus: "pending",
  },
  {
    id: "shipped",
    title: "Dispatched & In Transit",
    icon: Truck,
    accent: "border-blue-300 bg-blue-50/50",
    badgeBg: "bg-blue-100 text-blue-800",
    nextStatus: "delivered",
    nextLabel: "Mark Delivered",
    prevStatus: "crafting",
  },
  {
    id: "delivered",
    title: "Delivered & Cherished",
    icon: Crown,
    accent: "border-emerald-300 bg-emerald-50/50",
    badgeBg: "bg-emerald-100 text-emerald-800",
    prevStatus: "shipped",
  },
];

export function OrderKanbanBoard({
  orders,
  onStatusChange,
  onOpenPackingSlip,
  onOpenGiftNote,
}: OrderKanbanBoardProps) {
  const groupedOrders = useMemo(() => {
    const map: Record<OrderStatus, DbOrder[]> = {
      pending: [],
      confirmed: [],
      crafting: [],
      shipped: [],
      delivered: [],
      cancelled: [],
    };

    orders.forEach((o) => {
      // Map confirmed into crafting column for workshop simplicity if not set
      if (o.status === "confirmed") {
        map.pending.push(o);
      } else if (map[o.status]) {
        map[o.status].push(o);
      }
    });

    return map;
  }, [orders]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
      {COLUMNS.map((col) => {
        const columnOrders = groupedOrders[col.id] || [];
        const colTotal = columnOrders.reduce((sum, o) => sum + (o.amount_total || 0), 0);

        return (
          <div
            key={col.id}
            className={`rounded-3xl border p-4 shadow-sm flex flex-col max-h-[800px] overflow-hidden ${col.accent} backdrop-blur-md`}
          >
            {/* Column Header */}
            <div className="pb-3 border-b border-white/60 mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-lg bg-white/70 shadow-xs text-slate-700 shrink-0">
                  <col.icon className="size-3.5" />
                </span>
                <div>
                  <h3 className="font-display text-xs font-bold text-slate-800 leading-tight">
                    {col.title}
                  </h3>
                  <span className="text-[10px] text-muted-foreground">
                    ₹{colTotal.toLocaleString("en-IN")} total
                  </span>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-black ${col.badgeBg}`}>
                {columnOrders.length}
              </span>
            </div>

            {/* Scrollable Cards Container */}
            <div className="space-y-3 overflow-y-auto pr-1 flex-1">
              {columnOrders.length === 0 ? (
                <div className="py-8 text-center text-[11px] text-muted-foreground italic">
                  No orders in this stage.
                </div>
              ) : (
                columnOrders.map((order) => {
                  const notes = parseAdminNotes(order.admin_notes);

                  return (
                    <div
                      key={order.id}
                      className="liquid-glass rounded-2xl p-3.5 border border-white/80 shadow-sm space-y-2.5 transition-all hover:shadow-md bg-white/80"
                    >
                      {/* Top bar: Order #, date */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-black text-lilac-deep text-xs">
                          {order.order_number}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>

                      {/* Customer info */}
                      <div>
                        <p className="font-bold text-xs text-foreground line-clamp-1">
                          {order.customer_name}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate">
                          +91 {order.phone} · PIN {order.pincode}
                        </p>
                      </div>

                      {/* Items Thumbnails */}
                      <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                        {(order.order_items || []).map((item, idx) => (
                          <div
                            key={idx}
                            className="size-8 rounded-lg overflow-hidden border border-white shadow-xs flex-shrink-0 bg-lilac/20"
                            title={`${item.product_name} (x${item.quantity})`}
                          >
                            <img
                              src={getOrderItemImageUrl(item)}
                              alt={item.product_name}
                              className="size-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = logo;
                              }}
                            />
                          </div>
                        ))}
                        <span className="text-[10px] text-muted-foreground font-semibold ml-1">
                          {(order.order_items || []).length}{" "}
                          {(order.order_items || []).length === 1 ? "item" : "items"}
                        </span>
                      </div>

                      {/* Wax Gift Note pill */}
                      {order.gift_note && (
                        <button
                          type="button"
                          onClick={() => onOpenGiftNote && onOpenGiftNote(order)}
                          className="w-full text-left rounded-xl bg-amber-50 border border-amber-200 p-1.5 text-[10px] text-amber-900 font-medium hover:bg-amber-100 transition-colors flex items-center justify-between"
                        >
                          <span className="truncate inline-flex items-center gap-1">
                            <Mail className="size-3 text-amber-700 inline shrink-0" />
                            <span>Wax Note: "{order.gift_note}"</span>
                          </span>
                          <span className="text-[9px] font-bold underline flex-shrink-0 ml-1">
                            Print
                          </span>
                        </button>
                      )}

                      {/* Price & Courier status */}
                      <div className="flex items-center justify-between pt-1 border-t border-white/60 text-xs">
                        <span className="font-black text-slate-900">
                          ₹{order.amount_total?.toLocaleString("en-IN")}
                        </span>
                        {notes.courier && (
                          <span className="text-[9px] font-bold text-slate-600 bg-white px-1.5 py-0.5 rounded">
                            {notes.courier}
                          </span>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-between gap-1 pt-1">
                        <div className="flex items-center gap-1">
                          {/* WhatsApp */}
                          <a
                            href={createWhatsAppChatUrl(order)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="clay rounded-lg p-1.5 text-emerald-700 hover:bg-emerald-50"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle className="size-3" />
                          </a>

                          {/* Packing Slip */}
                          <button
                            type="button"
                            onClick={() => onOpenPackingSlip(order)}
                            className="clay rounded-lg p-1.5 text-lilac-deep hover:bg-white/60"
                            title="Print Packing Slip"
                          >
                            <Printer className="size-3" />
                          </button>
                        </div>

                        {/* Pipeline Stage Buttons */}
                        <div className="flex items-center gap-1">
                          {col.prevStatus && (
                            <button
                              type="button"
                              onClick={() => onStatusChange(order.id, col.prevStatus!)}
                              className="clay rounded-lg p-1 text-slate-500 hover:text-slate-800"
                              title="Move back"
                            >
                              <ArrowLeft className="size-3" />
                            </button>
                          )}

                          {col.nextStatus && (
                            <button
                              type="button"
                              onClick={() => onStatusChange(order.id, col.nextStatus!)}
                              className="clay-primary liquid-btn rounded-lg px-2.5 py-1 text-[10px] font-bold shadow-xs inline-flex items-center gap-1"
                            >
                              <span>{col.nextLabel || "Next"}</span>
                              <ArrowRight className="size-2.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
