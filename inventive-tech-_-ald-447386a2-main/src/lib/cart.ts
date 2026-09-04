import type { Product } from "@/lib/products";

const CART_KEY = "iq_cart";
export const CART_UPDATED_EVENT = "iq_cart_updated";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
  color?: string;
  flowers?: string[];
  custom?: string;
}

export interface CartItemOptions {
  color?: string | null;
  flowers?: string[];
  custom?: string;
}

function emitCartUpdated() {
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}

function createCartItemId(productId: string, options: CartItemOptions = {}) {
  return [
    productId,
    options.color ?? "",
    (options.flowers ?? []).join(","),
    options.custom?.trim() ?? "",
  ].join("|");
}

export function getCartItems(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCartItems(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  emitCartUpdated();
}

export function addCartItem(product: Product, options: CartItemOptions = {}) {
  const id = createCartItemId(product.id, options);
  const current = getCartItems();
  const existing = current.find((item) => item.id === id);

  if (existing) {
    const next = current.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    saveCartItems(next);
    return next;
  }

  const next: CartItem[] = [
    ...current,
    {
      id,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1,
      color: options.color ?? undefined,
      flowers: options.flowers?.length ? options.flowers : undefined,
      custom: options.custom?.trim() || undefined,
    },
  ];
  saveCartItems(next);
  return next;
}

export function updateCartItemQuantity(id: string, quantity: number) {
  const next = getCartItems()
    .map((item) => (item.id === id ? { ...item, quantity } : item))
    .filter((item) => item.quantity > 0);
  saveCartItems(next);
  return next;
}

export function removeCartItem(id: string) {
  const next = getCartItems().filter((item) => item.id !== id);
  saveCartItems(next);
  return next;
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
  emitCartUpdated();
}

export function getCartCount(items = getCartItems()) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function parsePrice(price: string) {
  const digits = price.replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}

export function getCartTotal(items = getCartItems()) {
  return items.reduce((sum, item) => sum + parsePrice(item.price) * item.quantity, 0);
}

export const CART_DRAWER_OPEN_EVENT = "iq_cart_drawer_open";
export const FREE_SHIPPING_THRESHOLD = 999;

export function openCartDrawer() {
  window.dispatchEvent(new Event(CART_DRAWER_OPEN_EVENT));
}

