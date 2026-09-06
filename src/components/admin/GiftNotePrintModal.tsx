import { Crown, Mail, Printer, Sparkles, X } from "lucide-react";
import logo from "@/assets/logo.png";
import type { DbOrder } from "@/lib/supabase";

interface GiftNotePrintModalProps {
  order: DbOrder | null;
  onClose: () => void;
}

export function GiftNotePrintModal({ order, onClose }: GiftNotePrintModalProps) {
  if (!order || !order.gift_note) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto print:p-0 print:bg-white print:fixed-none">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 print:border-none print:shadow-none print:rounded-none print:p-0">
        {/* Actions Bar (hidden on print) */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 print:hidden">
          <div className="flex items-center gap-2">
            <Mail className="size-5 text-lilac-deep" />
            <h3 className="font-display font-extrabold text-lilac-deep text-sm">
              Royal Calligraphy Gift Card Studio
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="clay-primary liquid-btn rounded-full px-4 py-2 text-xs font-bold shadow-md inline-flex items-center gap-1.5"
            >
              <Printer className="size-4" /> Print Note Card
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Printable Royal Card (Parchment Aesthetic) */}
        <div className="printable-gift-card relative overflow-hidden rounded-2xl bg-[#FCFBF7] p-8 border-4 border-double border-amber-700/40 text-center space-y-6 shadow-inner">
          {/* Corner Flourishes */}
          <span className="absolute top-2 left-2 text-amber-600/40">
            <Sparkles className="size-3" />
          </span>
          <span className="absolute top-2 right-2 text-amber-600/40">
            <Sparkles className="size-3" />
          </span>
          <span className="absolute bottom-2 left-2 text-amber-600/40">
            <Sparkles className="size-3" />
          </span>
          <span className="absolute bottom-2 right-2 text-amber-600/40">
            <Sparkles className="size-3" />
          </span>

          {/* Header Crest */}
          <div className="flex flex-col items-center">
            <img
              src={logo}
              alt=""
              className="size-12 rounded-full object-cover ring-2 ring-amber-500/30 mb-2"
            />
            <span className="font-display text-xs font-extrabold uppercase tracking-widest text-amber-900">
              Inventive Queen Royal Atelier
            </span>
            <h2 className="font-serif text-2xl font-normal text-slate-900 mt-1 italic">
              A Gift of Handcrafted Love
            </h2>
          </div>

          {/* For Recipient */}
          <div className="border-t border-b border-amber-900/10 py-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-900/60 block">
              Specially Crafted For
            </span>
            <p className="font-serif text-lg font-bold text-slate-900 mt-0.5">
              {order.customer_name}
            </p>
          </div>

          {/* Gift Message in Serif Italic */}
          <div className="px-4 py-2">
            <p className="font-serif text-base text-slate-800 italic leading-relaxed whitespace-pre-wrap">
              "{order.gift_note}"
            </p>
          </div>

          {/* Wax Seal Graphic */}
          <div className="pt-2 flex flex-col items-center justify-center">
            <div className="size-14 rounded-full bg-gradient-to-br from-[#881337] via-[#9F1239] to-[#4C0519] text-amber-200 flex flex-col items-center justify-center shadow-lg border-2 border-rose-950/40 transform rotate-[-6deg]">
              <Crown className="size-5 text-amber-200" />
              <span className="text-[7px] font-black uppercase tracking-tighter mt-0.5">
                IQ SEAL
              </span>
            </div>
            <p className="text-[9px] text-amber-900/60 uppercase tracking-wider font-semibold mt-2">
              Order #{order.order_number} · Artisanal Amigurumi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
