// Mock data for the admin dashboard

export interface Order {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered";
  date: string;
}

export const recentOrders: Order[] = [
  { id: "INV-1047", customer: "Priya Sharma", product: "Cozy Penguin", amount: 199, status: "delivered", date: "2026-03-21" },
  { id: "INV-1046", customer: "Ankit Verma", product: "Peacock Bookmark", amount: 249, status: "shipped", date: "2026-03-21" },
  { id: "INV-1045", customer: "Meera Nair", product: "Panda Keychain", amount: 179, status: "confirmed", date: "2026-03-20" },
  { id: "INV-1044", customer: "Rohan Das", product: "Pink Penguin Keychain", amount: 199, status: "pending", date: "2026-03-20" },
  { id: "INV-1043", customer: "Sneha Iyer", product: "Cozy Penguin", amount: 199, status: "delivered", date: "2026-03-19" },
  { id: "INV-1042", customer: "Kavya Joshi", product: "Peacock Bookmark", amount: 249, status: "delivered", date: "2026-03-18" },
  { id: "INV-1041", customer: "Arjun Patel", product: "Panda Keychain", amount: 179, status: "shipped", date: "2026-03-17" },
];

export const topProducts = [
  { name: "Cozy Penguin", orders: 34 },
  { name: "Peacock Bookmark", orders: 28 },
  { name: "Panda Keychain", orders: 21 },
  { name: "Pink Penguin Keychain", orders: 18 },
];

export const dailyRevenue = [
  { label: "Mar 16", value: 648 },
  { label: "Mar 17", value: 428 },
  { label: "Mar 18", value: 897 },
  { label: "Mar 19", value: 547 },
  { label: "Mar 20", value: 378 },
  { label: "Mar 21", value: 746 },
  { label: "Mar 22", value: 199 },
];

export const weeklyRevenue = [
  { label: "Week 1", value: 3240 },
  { label: "Week 2", value: 4180 },
  { label: "Week 3", value: 3843 },
  { label: "Week 4", value: 2976 },
];

export const monthlyRevenue = [
  { label: "Oct", value: 8420 },
  { label: "Nov", value: 11340 },
  { label: "Dec", value: 14780 },
  { label: "Jan", value: 9630 },
  { label: "Feb", value: 12450 },
  { label: "Mar", value: 14239 },
];

export const orderStatusData = [
  { name: "Pending", value: 12, fill: "hsl(40 60% 70%)" },
  { name: "Confirmed", value: 18, fill: "hsl(200 50% 65%)" },
  { name: "Shipped", value: 24, fill: "hsl(350 35% 58%)" },
  { name: "Delivered", value: 46, fill: "hsl(150 40% 55%)" },
];

export const stats = {
  totalRevenue: 14239,
  totalOrders: 100,
  todayOrders: 4,
  pendingOrders: 12,
};
