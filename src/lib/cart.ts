export interface CartItem {
  id: string;
  name: string;
  price: string;
  numericPrice: number;
  image: string;
  quantity: number;
  note?: string;
}

const CART_STORAGE_KEY = "inventive_queen_cart_v1";

export function parsePrice(priceStr: string): number {
  if (!priceStr) return 0;
  const match = priceStr.match(/[\d,]+/);
  if (match) {
    const num = parseInt(match[0].replace(/,/g, ""), 10);
    return isNaN(num) ? 0 : num;
  }
  return 0;
}

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to load cart", e);
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("cart-updated"));
  } catch (e) {
    console.error("Failed to save cart", e);
  }
}

export function addToCart(item: Omit<CartItem, "quantity">, quantity: number = 1): void {
  const cart = getCart();
  const existingIndex = cart.findIndex((i) => i.id === item.id || i.name === item.name);
  if (existingIndex > -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({ ...item, quantity });
  }
  saveCart(cart);
}

export function updateCartQuantity(id: string, quantity: number): void {
  const cart = getCart();
  if (quantity <= 0) {
    const filtered = cart.filter((i) => i.id !== id && i.name !== id);
    saveCart(filtered);
  } else {
    const item = cart.find((i) => i.id === id || i.name === id);
    if (item) {
      item.quantity = quantity;
      saveCart(cart);
    }
  }
}

export function removeFromCart(id: string): void {
  const cart = getCart().filter((i) => i.id !== id && i.name !== id);
  saveCart(cart);
}

export function clearCart(): void {
  saveCart([]);
}

export function getCartCount(): number {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartTotal(): number {
  return getCart().reduce((sum, item) => sum + item.numericPrice * item.quantity, 0);
}
