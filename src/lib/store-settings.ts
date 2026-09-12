import { useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "./supabase";

export interface StoreSettings {
  announcementBadge: string;
  announcementText: string;
  announcementLink: string;
  announcementLinkLabel: string;
  isStoreOpen: boolean;
  storeNotice: string;
  freeShippingThreshold: number;
  supportPhone: string;
  instagramHandle: string;
}

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  announcementBadge: "Limited Slots",
  announcementText: "Online Checkout with Razorpay is OPEN! Custom crochet made to order.",
  announcementLink: "/how-to-order",
  announcementLinkLabel: "How to order →",
  isStoreOpen: true,
  storeNotice: "",
  freeShippingThreshold: 1999,
  supportPhone: "",
  instagramHandle: "@inventivequeen",
};

const STORAGE_KEY = "inventive_queen_store_settings";
const SETTINGS_EVENT = "inventive_queen_store_settings_updated";

export function getStoreSettings(): StoreSettings {
  if (typeof window === "undefined") {
    return DEFAULT_STORE_SETTINGS;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STORE_SETTINGS;
    return { ...DEFAULT_STORE_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STORE_SETTINGS;
  }
}

export function saveStoreSettings(settings: StoreSettings): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent(SETTINGS_EVENT, { detail: settings }));

    // Optional Supabase cloud persistence if site_settings table exists
    if (isSupabaseConfigured) {
      supabase
        .from("site_settings")
        .upsert({ id: "global", settings, updated_at: new Date().toISOString() })
        .then(({ error }) => {
          if (error && error.code !== "42P01") {
            // Ignore missing table error 42P01, log other errors
            console.warn("Could not sync settings to Supabase site_settings table:", error.message);
          }
        })
        .then(
          () => {},
          () => {},
        );
    }
  } catch (err) {
    console.error("Failed to save store settings:", err);
  }
}

export function useStoreSettings(): {
  settings: StoreSettings;
  updateSettings: (patch: Partial<StoreSettings>) => void;
  resetSettings: () => void;
} {
  const [settings, setSettings] = useState<StoreSettings>(() => getStoreSettings());

  useEffect(() => {
    // Initial fetch from localStorage
    setSettings(getStoreSettings());

    // Listen for cross-tab or local updates
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<StoreSettings>;
      if (customEvent.detail) {
        setSettings(customEvent.detail);
      } else {
        setSettings(getStoreSettings());
      }
    };

    window.addEventListener(SETTINGS_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);

    // Also attempt fetching from Supabase on mount if configured
    if (isSupabaseConfigured) {
      supabase
        .from("site_settings")
        .select("settings")
        .eq("id", "global")
        .single()
        .then(({ data, error }) => {
          if (!error && data?.settings) {
            const merged = { ...DEFAULT_STORE_SETTINGS, ...data.settings };
            setSettings(merged);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          }
        })
        .then(
          () => {},
          () => {},
        );
    }

    return () => {
      window.removeEventListener(SETTINGS_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const updateSettings = (patch: Partial<StoreSettings>) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    saveStoreSettings(next);
  };

  const resetSettings = () => {
    setSettings(DEFAULT_STORE_SETTINGS);
    saveStoreSettings(DEFAULT_STORE_SETTINGS);
  };

  return { settings, updateSettings, resetSettings };
}
