import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { products as fallbackProducts, type Product, type ProductType } from "@/lib/products";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export interface CmsProductRow {
  id: string;
  name: string;
  price: string;
  original_price: string | null;
  selling_price: string | null;
  discount_percent: number | null;
  type: ProductType;
  tagline: string;
  description: string;
  images: string[];
  is_new_arrival: boolean;
  new_arrival_days: number;
  new_arrival_started_at: string | null;
  colors: { name: string; value: string }[] | null;
  flowers: string[] | null;
  flower_colors: { name: string; value: string }[] | null;
  is_active: boolean;
  sort_order: number;
}

type ProductInput = Product & {
  isActive?: boolean;
  sortOrder?: number;
};

interface ProductsContextValue {
  products: Product[];
  adminProducts: Product[];
  loading: boolean;
  error: string;
  refreshProducts: () => Promise<void>;
  saveProduct: (product: ProductInput) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  uploadProductImage: (productId: string, file: File) => Promise<string>;
  generateProductId: (type: ProductType) => Promise<string>;
}

const ProductsContext = createContext<ProductsContextValue | null>(null);

const fallbackById = new Map(fallbackProducts.map((product, index) => [product.id, { product, index }]));

function normalizeOptionList(value: unknown): { name: string; value: string }[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const options = value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const option = item as Record<string, unknown>;
      const name = typeof option.name === "string" ? option.name.trim() : "";
      const colorValue = typeof option.value === "string" ? option.value.trim() : "";
      return name && colorValue ? { name, value: colorValue } : null;
    })
    .filter(Boolean) as { name: string; value: string }[];

  return options.length > 0 ? options : undefined;
}

function normalizeTextArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const items = value.map((item) => (typeof item === "string" ? item.trim() : "")).filter(Boolean);
  return items.length > 0 ? items : undefined;
}

function rowToProduct(row: CmsProductRow): Product {
  const fallback = fallbackById.get(row.id);
  const fallbackProduct = fallback?.product;
  const images = row.images?.filter(Boolean) ?? [];
  const sellingPrice = row.selling_price || row.price;

  return {
    id: row.id,
    name: row.name,
    price: sellingPrice,
    originalPrice: row.original_price ?? undefined,
    sellingPrice,
    discountPercent: row.discount_percent ?? undefined,
    type: row.type,
    tagline: row.tagline,
    description: row.description,
    images: images.length > 0 ? images.slice(0, 10) : fallbackProduct?.images ?? [],
    isNewArrival: row.is_new_arrival,
    newArrivalDays: row.new_arrival_days,
    newArrivalStartedAt: row.new_arrival_started_at,
    colors: normalizeOptionList(row.colors) ?? fallbackProduct?.colors,
    flowers: normalizeTextArray(row.flowers) ?? fallbackProduct?.flowers,
    flowerColors: normalizeOptionList(row.flower_colors) ?? fallbackProduct?.flowerColors,
    isActive: row.is_active,
    sortOrder: row.sort_order,
    isCmsProduct: true,
  };
}

function productToRow(product: ProductInput): CmsProductRow {
  const sellingPrice = product.sellingPrice || product.price;

  return {
    id: product.id,
    name: product.name,
    price: sellingPrice,
    original_price: product.originalPrice ?? null,
    selling_price: sellingPrice,
    discount_percent: product.discountPercent ?? null,
    type: product.type,
    tagline: product.tagline,
    description: product.description,
    images: product.images.filter(Boolean).slice(0, 10),
    is_new_arrival: product.isNewArrival ?? false,
    new_arrival_days: product.newArrivalDays ?? 30,
    new_arrival_started_at: product.isNewArrival ? product.newArrivalStartedAt ?? new Date().toISOString() : null,
    colors: product.colors ?? null,
    flowers: product.flowers ?? null,
    flower_colors: product.flowerColors ?? null,
    is_active: product.isActive !== false,
    sort_order: product.sortOrder ?? fallbackById.get(product.id)?.index ?? fallbackProducts.length,
  };
}

function mergeProducts(cmsRows: CmsProductRow[]) {
  const cmsProducts = cmsRows.map(rowToProduct);
  const cmsById = new Map(cmsProducts.map((product) => [product.id, product]));
  const merged: Product[] = [];

  fallbackProducts.forEach((fallback, index) => {
    const cmsProduct = cmsById.get(fallback.id);
    merged.push(
      cmsProduct ?? {
        ...fallback,
        isActive: true,
        sortOrder: index,
        isCmsProduct: false,
      }
    );
  });

  cmsProducts.forEach((product) => {
    if (!fallbackById.has(product.id)) merged.push(product);
  });

  return merged.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.name.localeCompare(b.name));
}

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [cmsRows, setCmsRows] = useState<CmsProductRow[]>([]);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState("");

  const refreshProducts = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from("cms_products")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
      setCmsRows([]);
    } else {
      setError("");
      setCmsRows((data ?? []) as CmsProductRow[]);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  const adminProducts = useMemo(() => mergeProducts(cmsRows), [cmsRows]);
  const products = useMemo(() => adminProducts.filter((product) => product.isActive !== false), [adminProducts]);

  const saveProduct = useCallback(async (product: ProductInput) => {
    const row = productToRow(product);
    const { error: saveError } = await supabase.from("cms_products").upsert(row, { onConflict: "id" });
    if (saveError) throw new Error(saveError.message);
    await refreshProducts();
  }, [refreshProducts]);

  const deleteProduct = useCallback(async (id: string) => {
    const { error: deleteError } = await supabase.from("cms_products").delete().eq("id", id);
    if (deleteError) throw new Error(deleteError.message);
    await refreshProducts();
  }, [refreshProducts]);

  const generateProductId = useCallback(async (type: ProductType) => {
    const { data, error: idError } = await supabase.rpc("reserve_product_id", { product_type: type });
    if (idError || typeof data !== "string") throw new Error(idError?.message ?? "Could not generate product id.");
    return data;
  }, []);

  const uploadProductImage = useCallback(async (productId: string, file: File) => {
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const cleanId = productId.replace(/[^a-z0-9-]/gi, "-").toLowerCase();
    const path = `${cleanId}/${Date.now()}.${extension}`;
    const { error: uploadError } = await supabase.storage.from("cms-images").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (uploadError) throw new Error(uploadError.message);

    const { data } = supabase.storage.from("cms-images").getPublicUrl(path);
    return data.publicUrl;
  }, []);

  const value = useMemo(
    () => ({
      products,
      adminProducts,
      loading,
      error,
      refreshProducts,
      saveProduct,
      deleteProduct,
      uploadProductImage,
      generateProductId,
    }),
    [adminProducts, deleteProduct, error, generateProductId, loading, products, refreshProducts, saveProduct, uploadProductImage]
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    return {
      products: fallbackProducts,
      adminProducts: fallbackProducts.map((product, index) => ({
        ...product,
        isActive: true,
        sortOrder: index,
        isCmsProduct: false,
      })),
      loading: false,
      error: "",
      refreshProducts: async () => undefined,
      saveProduct: async () => {
        throw new Error("Product CMS is not ready.");
      },
      deleteProduct: async () => {
        throw new Error("Product CMS is not ready.");
      },
      uploadProductImage: async () => {
        throw new Error("Product image uploads are not ready.");
      },
      generateProductId: async () => {
        throw new Error("Product ID generation is not ready.");
      },
    } satisfies ProductsContextValue;
  }
  return context;
}