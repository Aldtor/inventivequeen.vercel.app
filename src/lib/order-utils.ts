import type { DbOrder, OrderStatus } from "./supabase";

export interface ParsedAdminNotes {
  courier: string;
  trackingNumber: string;
  internalNotes: string;
}

/**
 * Parse courier, tracking number, and notes from order's admin_notes field.
 * Handles both JSON structured notes and simple text notes.
 */
export function parseAdminNotes(raw?: string | null): ParsedAdminNotes {
  if (!raw) {
    return { courier: "", trackingNumber: "", internalNotes: "" };
  }

  // Try parsing JSON format
  if (raw.trim().startsWith("{") && raw.trim().endsWith("}")) {
    try {
      const parsed = JSON.parse(raw);
      return {
        courier: parsed.courier || "",
        trackingNumber: parsed.trackingNumber || "",
        internalNotes: parsed.internalNotes || parsed.notes || "",
      };
    } catch {
      // Fall through to text parsing
    }
  }

  // Fallback: parse text with "Courier: X | Tracking: Y | Notes: Z"
  let courier = "";
  let trackingNumber = "";
  let internalNotes = raw;

  const courierMatch = raw.match(/Courier:\s*([^|\n]+)/i);
  if (courierMatch) courier = courierMatch[1]?.trim() ?? "";

  const trackingMatch = raw.match(/Tracking:\s*([^|\n]+)/i);
  if (trackingMatch) trackingNumber = trackingMatch[1]?.trim() ?? "";

  const notesMatch = raw.match(/Notes:\s*([\s\S]+)/i);
  if (notesMatch) internalNotes = notesMatch[1]?.trim() ?? "";
  else if (courierMatch || trackingMatch) {
    // Remove the Courier: and Tracking: parts from internalNotes
    internalNotes = raw
      .replace(/Courier:\s*[^|\n]+[|\n]?/gi, "")
      .replace(/Tracking:\s*[^|\n]+[|\n]?/gi, "")
      .trim();
  }

  return { courier, trackingNumber, internalNotes };
}

/**
 * Serialize courier, tracking, and notes into admin_notes field
 */
export function serializeAdminNotes(data: ParsedAdminNotes): string {
  return JSON.stringify({
    courier: data.courier.trim(),
    trackingNumber: data.trackingNumber.trim(),
    internalNotes: data.internalNotes.trim(),
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Generate a pre-filled WhatsApp customer chat URL
 */
export function createWhatsAppChatUrl(order: DbOrder, customMessage?: string): string {
  // Clean phone number (remove spaces, dashes, leading +)
  let phone = order.phone.replace(/[^0-9]/g, "");
  if (phone.length === 10) {
    phone = `91${phone}`; // Default to India country code
  }

  const defaultMsg =
    customMessage ||
    `Hello ${order.customer_name}! 👑\nThis is Inventive Queen regarding your royal crochet order ${order.order_number}.\n\nStatus: ${order.status.toUpperCase()}\nTotal: ₹${order.amount_total?.toLocaleString("en-IN")}\n\nThank you for choosing our handcrafted atelier!`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(defaultMsg)}`;
}

/**
 * Export orders array to a downloadable CSV file
 */
export function exportOrdersToCsv(orders: DbOrder[], filename = "inventive_queen_orders.csv"): void {
  const headers = [
    "Order Number",
    "Date",
    "Customer Name",
    "Phone",
    "Address",
    "Pincode",
    "Amount (INR)",
    "Status",
    "Payment Status",
    "Payment ID",
    "Courier",
    "Tracking Number",
    "Gift Note",
    "Items",
  ];

  const rows = orders.map((o) => {
    const notes = parseAdminNotes(o.admin_notes);
    const itemsSummary = (o.order_items || [])
      .map((i) => `${i.product_name} (x${i.quantity} @ ₹${i.unit_price})`)
      .join(" ; ");

    return [
      o.order_number,
      new Date(o.created_at).toISOString(),
      `"${(o.customer_name || "").replace(/"/g, '""')}"`,
      `"${o.phone || ""}"`,
      `"${(o.address || "").replace(/"/g, '""')}"`,
      o.pincode || "",
      o.amount_total || 0,
      o.status,
      o.payment_status,
      o.payment_id || "",
      `"${notes.courier.replace(/"/g, '""')}"`,
      `"${notes.trackingNumber.replace(/"/g, '""')}"`,
      `"${(o.gift_note || "").replace(/"/g, '""')}"`,
      `"${itemsSummary.replace(/"/g, '""')}"`,
    ].join(",");
  });

  const csvContent = [headers.join(","), ...rows].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Get next logical workflow status for an order
 */
export function getNextOrderStatus(current: OrderStatus): OrderStatus | null {
  switch (current) {
    case "pending":
      return "confirmed";
    case "confirmed":
      return "crafting";
    case "crafting":
      return "shipped";
    case "shipped":
      return "delivered";
    default:
      return null;
  }
}
