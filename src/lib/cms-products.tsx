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
  size: string | null;
  tagline: string;
  description: string;
  images: string[];
  badge: string | null;
  is_new_arrival: boolean;
  new_arrival_days: number;
  new_arrival_started_at: string | null;
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

function rowToProduct(row: CmsProductRow): Product {
  const fallback = fallbackById.get(row.id);
  const fallbackProduct = fallback?.product;
  const images = row.images?.filter(Boolean) ?? [];
  const sellingPrice = row.selling_price || row.price;

  return {
    id: row.id,
    name: row.name,
    price: sellingPrice,
    originalPrice: row.original_price ?? "",
    sellingPrice,
    discountPercent: row.discount_percent ?? 0,
    type: row.type || fallbackProduct?.type || "doll",
    size: row.size ?? fallbackProduct?.size ?? "",
    tagline: row.tagline || fallbackProduct?.tagline || "",
    description: row.description || fallbackProduct?.description || "",
    images: images.length > 0 ? images : fallbackProduct?.images ?? [],
    badge: row.badge ?? fallbackProduct?.badge ?? "",
    isNewArrival: row.is_new_arrival,
    newArrivalDays: row.new_arrival_days,
    newArrivalStartedAt: row.new_arrival_started_at,
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
    size: product.size ?? null,
    tagline: product.tagline || "",
    description: product.description || "",
    images: product.images.filter(Boolean).slice(0, 10),
    badge: product.badge ?? null,
    is_new_arrival: product.isNewArrival ?? false,
    new_arrival_days: product.newArrivalDays ?? 30,
    new_arrival_started_at: product.isNewArrival ? product.newArrivalStartedAt ?? new Date().toISOString() : null,
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
    if (!isSupabaseConfigured || typeof window === "undefined") {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from("cms_products")
        .select("*")
        .order("sort_order", { ascending: true });

      if (fetchError) {
        // Table might not exist yet or empty
        setError(fetchError.message);
        setCmsRows([]);
      } else {
        setError("");
        setCmsRows((data ?? []) as CmsProductRow[]);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to fetch CMS products");
    } finally {
      setLoading(false);
    }
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
    try {
      const { data, error: idError } = await supabase.rpc("reserve_product_id", { product_type: type });
      if (!idError && typeof data === "string") return data;
    } catch {
      // Fallback
    }
    const prefix = type.slice(0, 3).toUpperCase();
    return `IQ-${prefix}-${Date.now().toString().slice(-4)}`;
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
      generateProductId: async (type: ProductType) => `IQ-${type.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
    } satisfies ProductsContextValue;
  }
  return context;
}
