import { useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "./supabase";

export interface InventoryItem {
  id: string;
  name: string;
  category: "yarn" | "hardware" | "packaging" | "acc";
  quantity: number;
  unit: string;
  minThreshold: number;
  colorHex?: string | undefined;
  costPerUnit: number;
  supplier?: string | undefined;
  updatedAt?: string | undefined;
}

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: "inv-1",
    name: "Milk Cotton Yarn — Royal Lilac",
    category: "yarn",
    quantity: 14,
    unit: "spools",
    minThreshold: 4,
    colorHex: "#7E57C2",
    costPerUnit: 95,
    supplier: "Vardhman Premium",
  },
  {
    id: "inv-2",
    name: "Milk Cotton Yarn — Pastel Buttercup",
    category: "yarn",
    quantity: 9,
    unit: "spools",
    minThreshold: 4,
    colorHex: "#FBBF24",
    costPerUnit: 95,
    supplier: "Vardhman Premium",
  },
  {
    id: "inv-3",
    name: "Milk Cotton Yarn — Baby Pink Blossom",
    category: "yarn",
    quantity: 22,
    unit: "spools",
    minThreshold: 5,
    colorHex: "#F472B6",
    costPerUnit: 95,
    supplier: "Ganga Soft",
  },
  {
    id: "inv-4",
    name: "Milk Cotton Yarn — Sage Leaf Green",
    category: "yarn",
    quantity: 3,
    unit: "spools",
    minThreshold: 5,
    colorHex: "#10B981",
    costPerUnit: 95,
    supplier: "Ganga Soft",
  },
  {
    id: "inv-5",
    name: "Safety Doll Eyes (9mm & 12mm)",
    category: "hardware",
    quantity: 65,
    unit: "pairs",
    minThreshold: 20,
    costPerUnit: 8,
    supplier: "CraftSupplies Mumbai",
  },
  {
    id: "inv-6",
    name: "Gold Swivel Clasp Keychain Rings",
    category: "hardware",
    quantity: 48,
    unit: "pcs",
    minThreshold: 15,
    costPerUnit: 14,
    supplier: "CraftSupplies Mumbai",
  },
  {
    id: "inv-7",
    name: "Royal Purple Wax Seal Beads",
    category: "acc",
    quantity: 180,
    unit: "beads",
    minThreshold: 50,
    costPerUnit: 2,
    supplier: "Atelier Wax Co",
  },
  {
    id: "inv-8",
    name: "Inventive Queen Custom Gift Boxes",
    category: "packaging",
    quantity: 19,
    unit: "boxes",
    minThreshold: 10,
    costPerUnit: 45,
    supplier: "Crown Packagings",
  },
  {
    id: "inv-9",
    name: "Luxury Satin Ribbon Rolls (Lilac)",
    category: "packaging",
    quantity: 4,
    unit: "rolls",
    minThreshold: 2,
    costPerUnit: 85,
    supplier: "Ribbon Hub",
  },
];

const STORAGE_KEY = "inventive_queen_cms_inventory";
const INVENTORY_EVENT = "inventive_queen_inventory_updated";

export function getInventory(): InventoryItem[] {
  if (typeof window === "undefined") {
    return INITIAL_INVENTORY;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_INVENTORY;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_INVENTORY;
  } catch {
    return INITIAL_INVENTORY;
  }
}

export function saveInventory(items: InventoryItem[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent(INVENTORY_EVENT, { detail: items }));

    if (isSupabaseConfigured) {
      // Backup to site_settings
      supabase
        .from("site_settings")
        .upsert({ id: "inventory_cms", settings: items, updated_at: new Date().toISOString() })
        .then(
          () => {},
          () => {},
        );

      // Upsert into dedicated inventory_items table
      const rows = items.map((it) => ({
        id: it.id,
        name: it.name,
        category: it.category,
        quantity: it.quantity,
        unit: it.unit,
        min_threshold: it.minThreshold,
        cost_per_unit: it.costPerUnit,
        supplier: it.supplier || null,
        color_hex: it.colorHex || null,
        updated_at: new Date().toISOString(),
      }));
      supabase
        .from("inventory_items")
        .upsert(rows, { onConflict: "id" })
        .then(
          () => {},
          () => {},
        );
    }
  } catch (err) {
    console.error("Failed to save inventory to storage:", err);
  }
}

export function useInventory(): {
  inventory: InventoryItem[];
  lowStockItems: InventoryItem[];
  totalValue: number;
  adjustQuantity: (id: string, delta: number) => void;
  addItem: (item: Omit<InventoryItem, "id">) => void;
  updateItem: (id: string, patch: Partial<InventoryItem>) => void;
  deleteItem: (id: string) => void;
  resetInventory: () => void;
} {
  const [inventory, setInventory] = useState<InventoryItem[]>(() => getInventory());

  useEffect(() => {
    setInventory(getInventory());

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<InventoryItem[]>;
      if (customEvent.detail) {
        setInventory(customEvent.detail);
      } else {
        setInventory(getInventory());
      }
    };

    window.addEventListener(INVENTORY_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);

    if (isSupabaseConfigured) {
      supabase
        .from("inventory_items")
        .select("*")
        .then(({ data, error }) => {
          if (!error && Array.isArray(data) && data.length > 0) {
            const mapped: InventoryItem[] = data.map((row: Record<string, unknown>) => ({
              id: String(row["id"]),
              name: String(row["name"]),
              category: (row["category"] as "yarn" | "hardware" | "packaging" | "acc") || "yarn",
              quantity: Number(row["quantity"]) || 0,
              unit: String(row["unit"] || "spools"),
              minThreshold: Number(row["min_threshold"]) || 5,
              costPerUnit: Number(row["cost_per_unit"]) || 0,
              supplier: (row["supplier"] as string) || undefined,
              colorHex: (row["color_hex"] as string) || undefined,
              updatedAt: (row["updated_at"] as string) || undefined,
            }));
            setInventory(mapped);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
            return;
          }

          // Fallback to site_settings
          supabase
            .from("site_settings")
            .select("settings")
            .eq("id", "inventory_cms")
            .single()
            .then(({ data: settingData, error: settingErr }) => {
              if (
                !settingErr &&
                Array.isArray(settingData?.settings) &&
                settingData.settings.length > 0
              ) {
                setInventory(settingData.settings);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(settingData.settings));
              }
            })
            .then(
              () => {},
              () => {},
            );
        })
        .then(
          () => {},
          () => {},
        );
    }

    return () => {
      window.removeEventListener(INVENTORY_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const adjustQuantity = (id: string, delta: number) => {
    const next = inventory.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item,
    );
    setInventory(next);
    saveInventory(next);
  };

  const addItem = (item: Omit<InventoryItem, "id">) => {
    const newItem: InventoryItem = {
      ...item,
      id: `inv-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    const next = [newItem, ...inventory];
    setInventory(next);
    saveInventory(next);
  };

  const updateItem = (id: string, patch: Partial<InventoryItem>) => {
    const next = inventory.map((i) => (i.id === id ? { ...i, ...patch } : i));
    setInventory(next);
    saveInventory(next);
  };

  const deleteItem = (id: string) => {
    const next = inventory.filter((i) => i.id !== id);
    setInventory(next);
    saveInventory(next);
  };

  const resetInventory = () => {
    setInventory(INITIAL_INVENTORY);
    saveInventory(INITIAL_INVENTORY);
  };

  const lowStockItems = inventory.filter((i) => i.quantity <= i.minThreshold);
  const totalValue = inventory.reduce((sum, i) => sum + i.quantity * i.costPerUnit, 0);

  return {
    inventory,
    lowStockItems,
    totalValue,
    adjustQuantity,
    addItem,
    updateItem,
    deleteItem,
    resetInventory,
  };
}
