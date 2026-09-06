import { Printer, X } from "lucide-react";
import logo from "@/assets/logo.png";
import type { DbOrder } from "@/lib/supabase";
import { parseAdminNotes } from "@/lib/order-utils";

interface PackingSlipModalProps {
  order: DbOrder | null;
  onClose: () => void;
}

export function PackingSlipModal({ order, onClose }: PackingSlipModalProps) {
  if (!order) return null;

  const notes = parseAdminNotes(order.admin_notes);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto print:p-0 print:bg-white print:fixed-none">
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl text-foreground border border-slate-200 print:border-none print:shadow-none print:rounded-none print:max-w-none print:p-6">
        {/* Screen-only Close & Print Actions */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xl">👑</span>
            <span className="font-display font-extrabold text-lilac-deep text-sm">
              Royal Packing Slip Preview
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="clay-primary liquid-btn rounded-full px-4 py-2 text-xs font-bold shadow-md inline-flex items-center gap-1.5"
            >
              <Printer className="size-4" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Printable Packing Slip Layout */}
        <div className="printable-slip space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-lilac-deep/20 pb-5">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="Inventive Queen logo"
                className="size-14 rounded-full object-cover ring-2 ring-lilac-deep/30"
              />
              <div>
                <h1 className="font-display text-xl font-black text-lilac-deep tracking-tight">
                  Inventive Queen
                </h1>
                <p className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground">
                  Artisanal Handcrafted Crochet Atelier
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Instagram: @inventivequeen · Web: inventivequeen.in
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block bg-lilac-deep text-white px-3 py-1 rounded-full text-xs font-black tracking-wide">
                PACKING SLIP / INVOICE
              </span>
              <p className="font-mono text-sm font-black text-slate-900 mt-2">
                #{order.order_number}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {new Date(order.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Customer & Shipping Details */}
          <div className="grid grid-cols-2 gap-6 text-xs">
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 space-y-1">
              <span className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">
                Ship To (Royal Delivery)
              </span>
              <p className="font-bold text-sm text-slate-900">{order.customer_name}</p>
              <p className="text-slate-700 leading-relaxed">{order.address}</p>
              <p className="font-bold text-slate-900">Pincode: {order.pincode}</p>
              <p className="text-slate-700">Phone: +91 {order.phone}</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 space-y-1.5">
              <span className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">
                Order &amp; Payment Status
              </span>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Payment Status:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                  {order.payment_status.toUpperCase()} (Razorpay)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Transaction ID:</span>
                <span className="font-mono text-[10px] text-slate-700">
                  {order.payment_id || "Verified"}
                </span>
              </div>
              {notes.courier && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Courier Partner:</span>
                  <span className="font-bold text-slate-800">{notes.courier}</span>
                </div>
              )}
              {notes.trackingNumber && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Tracking / AWB:</span>
                  <span className="font-mono font-bold text-slate-900">{notes.trackingNumber}</span>
                </div>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div>
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b-2 border-slate-200 text-[11px] font-bold text-slate-600">
                  <th className="py-2 px-1">Item Description</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Unit Price</th>
                  <th className="py-2 text-right px-1">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(order.order_items || []).map((item) => (
                  <tr key={item.id} className="text-slate-800">
                    <td className="py-3 px-1">
                      <div className="flex items-center gap-2.5">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt=""
                            className="size-8 rounded-md object-cover border border-slate-200"
                          />
                        ) : null}
                        <span className="font-semibold text-slate-900">{item.product_name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-center font-bold">{item.quantity}</td>
                    <td className="py-3 text-right">₹{item.unit_price}</td>
                    <td className="py-3 text-right font-bold px-1">
                      ₹{((item.quantity || 1) * (item.unit_price || 0)).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-200 font-bold text-sm">
                  <td colSpan={3} className="py-3 text-right pr-4 text-slate-700">
                    Grand Total Paid:
                  </td>
                  <td className="py-3 text-right text-lilac-deep font-black px-1">
                    ₹{order.amount_total?.toLocaleString("en-IN")}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Wax-Sealed Gift Note (if present) */}
          {order.gift_note && (
            <div className="rounded-2xl bg-amber-50/80 p-4 border border-amber-200/80 text-xs space-y-1">
              <span className="font-bold text-amber-900 text-[11px] flex items-center gap-1.5">
                👑 Wax-Sealed Gift Note Enclosed:
              </span>
              <p className="italic text-amber-950 font-serif leading-relaxed">
                "{order.gift_note}"
              </p>
            </div>
          )}

          {/* Footer Artisanal Guarantee */}
          <div className="border-t border-slate-200 pt-4 text-center text-[10px] text-muted-foreground space-y-1">
            <p className="font-bold text-slate-700">
              Handcrafted with royal passion &amp; love in our atelier.
            </p>
            <p>
              For any questions or custom inquiries, message us on Instagram @inventivequeen or
              email help@inventivequeen.in
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
