import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  Instagram,
  RefreshCw,
  RotateCcw,
  ShieldAlert,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { INSTAGRAM_URL, SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/payment-failed")({
  component: PaymentFailedPage,
  validateSearch: (
    search: Record<string, unknown>,
  ): {
    orderId?: string | undefined;
    orderNumber?: string | undefined;
    reason?: string | undefined;
    code?: string | undefined;
  } => ({
    orderId: (search["orderId"] as string) || undefined,
    orderNumber: (search["orderNumber"] as string) || undefined,
    reason: (search["reason"] as string) || undefined,
    code: (search["code"] as string) || undefined,
  }),
  head: () => ({
    meta: [
      { title: "Payment Not Completed — Inventive Queen" },
      {
        name: "description",
        content:
          "Your payment was interrupted or cancelled. Here is what happened and how to complete your order.",
      },
    ],
  }),
});

function PaymentFailedPage() {
  const search = useSearch({ from: "/payment-failed" });
  const { orderId, orderNumber, reason, code } = search;

  const failureReason =
    reason || "The transaction was interrupted, timed out, or declined by the issuing bank.";

  return (
    <SiteLayout>
      <div className="mx-auto max-w-2xl px-4 py-16 sm:py-24 text-center">
        <div className="liquid-glass relative overflow-hidden rounded-4xl p-8 sm:p-12 shadow-2xl border border-white/60">
          <div className="blob absolute -top-16 -right-16 size-48 bg-rose-300/30 pointer-events-none" />
          <div className="blob absolute -bottom-16 -left-16 size-48 bg-amber-200/30 pointer-events-none" />

          {/* Failure Shield Icon */}
          <div className="relative inline-flex size-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-rose-400 to-amber-200 text-white shadow-lg mb-6">
            <ShieldAlert className="size-10 text-rose-950" />
          </div>

          <span className="liquid-glass relative inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold text-rose-700 mb-3 bg-rose-50/80 border-rose-200">
            <AlertTriangle className="size-3 text-rose-600" /> Payment Incomplete
          </span>

          <h1 className="sheen-text relative font-display text-3xl sm:text-4xl font-extrabold text-lilac-deep">
            Payment Could Not Be Processed
          </h1>
          <p className="relative mt-2 text-sm text-muted-foreground leading-relaxed">
            Your transaction was not completed. Don't worry, your basket items have not been lost!
          </p>

          {/* Failure Reference Card */}
          <div className="relative mt-8 rounded-2xl bg-white/75 p-5 border border-white/90 shadow-sm text-left space-y-3">
            {orderNumber && (
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/60">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Order Reference
                </span>
                <span className="font-mono text-sm font-black text-lilac-deep">{orderNumber}</span>
              </div>
            )}

            <div className="text-xs">
              <span className="font-bold text-muted-foreground uppercase tracking-wider">
                Bank / Gateway Message
              </span>
              <p className="mt-1 rounded-xl bg-rose-50/70 border border-rose-100 p-3 font-semibold text-rose-800">
                {failureReason}
              </p>
            </div>

            {code && (
              <p className="text-[11px] text-muted-foreground">
                Error Code: <span className="font-mono font-semibold">{code}</span>
              </p>
            )}
          </div>

          {/* Bank Debit Reassurance Callout */}
          <div className="relative mt-6 rounded-2xl bg-amber-50/80 border border-amber-200 p-4 text-left flex items-start gap-3">
            <div className="clay-soft flex size-8 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
              <RotateCcw className="size-4" />
            </div>
            <div className="text-xs">
              <h3 className="font-bold text-amber-900">Was money debited from your bank?</h3>
              <p className="mt-0.5 text-amber-800 leading-relaxed">
                If funds were deducted from your bank account, banking guidelines ensure that the
                amount will be automatically reversed back to your source account within{" "}
                <strong>3–5 business days</strong>.
              </p>
            </div>
          </div>

          {/* Common reasons list */}
          <div className="relative mt-8 pt-6 border-t border-white/50 text-left">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
              <HelpCircle className="size-3.5 text-lilac-deep" /> Common Reasons for Payment
              Declines:
            </h3>
            <ul className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
              <li className="flex items-start gap-2">
                <span className="size-1.5 rounded-full bg-lilac-deep mt-1.5 shrink-0" />
                <span>Bank OTP expired or incorrect entry</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="size-1.5 rounded-full bg-lilac-deep mt-1.5 shrink-0" />
                <span>UPI app connection timeout or server lag</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="size-1.5 rounded-full bg-lilac-deep mt-1.5 shrink-0" />
                <span>Daily transaction or netbanking limit reached</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="size-1.5 rounded-full bg-lilac-deep mt-1.5 shrink-0" />
                <span>Bank temporary downtime or maintenance</span>
              </li>
            </ul>
          </div>

          {/* Primary Action Buttons */}
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/checkout"
              className="clay-primary liquid-btn inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white shadow-xl hover:scale-102 transition-transform"
            >
              <RefreshCw className="size-4" /> Retry Payment in Checkout
            </Link>

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="clay inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-pink-900 bg-pink-50/80 border-pink-200 hover:bg-pink-100 transition-colors"
            >
              <Instagram className="size-4 text-pink-600" /> Instagram Support
            </a>
          </div>

          <div className="relative mt-5">
            <Link
              to="/orders"
              className="text-xs font-semibold text-muted-foreground hover:text-lilac-deep transition-colors inline-flex items-center gap-1"
            >
              Check My Orders <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
