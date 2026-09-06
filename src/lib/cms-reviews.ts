import { useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "./supabase";

export interface ReviewItem {
  id: string;
  handle: string;
  location: string;
  text: string;
  rating: number;
  item: string;
  category: "doll" | "bouquet" | "plushie" | "keychain" | "misc";
  tag: string;
  date: string;
  isApproved: boolean;
  isFeatured?: boolean | undefined;
}

export const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: "rev-1",
    handle: "@ananya_r",
    location: "Mumbai",
    text: "The custom anime doll turned out EXACTLY like my reference artwork! Every single detail of the hair and outfit was matched with mind-blowing precision. My friend was in tears!",
    rating: 5,
    item: "Custom Chibi Doll",
    category: "doll",
    tag: "Verified Order",
    date: "2 weeks ago",
    isApproved: true,
    isFeatured: true,
  },
  {
    id: "rev-2",
    handle: "@kavya_m",
    location: "Bengaluru",
    text: "The pastel bouquet arrived gorgeously packaged with satin ribbons and wax seal. The flowers will stay vibrant forever! Best anniversary surprise ever.",
    rating: 5,
    item: "Signature Pastel Bouquet",
    category: "bouquet",
    tag: "Verified Order",
    date: "1 month ago",
    isApproved: true,
    isFeatured: true,
  },
  {
    id: "rev-3",
    handle: "@riya_s",
    location: "New Delhi",
    text: "Such a sweet, accommodating artist! The purple teddy bear is velvety soft, squishy and the stitches are so tidy and uniform. Truly royal quality!",
    rating: 5,
    item: "Velvet Cuddle Bear",
    category: "plushie",
    tag: "Verified Order",
    date: "3 weeks ago",
    isApproved: true,
    isFeatured: true,
  },
  {
    id: "rev-4",
    handle: "@tanvi_p",
    location: "Hyderabad",
    text: "Ordered the Mixed Rose Grand Bouquet for my mother's 50th birthday. She couldn't believe they were crocheted by hand! The stems are wired so they sit gracefully in any vase.",
    rating: 5,
    item: "Mixed Rose Grand Atelier Bouquet",
    category: "bouquet",
    tag: "Verified Order",
    date: "1 month ago",
    isApproved: true,
    isFeatured: false,
  },
  {
    id: "rev-5",
    handle: "@meera_k",
    location: "Kolkata",
    text: "The Strawberry Cow charm is literally the cutest thing ever. It hangs on my canvas tote bag and I get compliments almost every day! The gold hardware is also super sturdy.",
    rating: 5,
    item: "Strawberry Milk Cow Charm",
    category: "keychain",
    tag: "Verified Order",
    date: "2 months ago",
    isApproved: true,
    isFeatured: false,
  },
  {
    id: "rev-6",
    handle: "@sneha_b",
    location: "Pune",
    text: "Bought the Royal Peacock bookmark for my book club companion. The colors are so rich and vibrant, and the tail tassel adds the most regal touch. Highly recommended!",
    rating: 5,
    item: "Royal Peacock Bookmark",
    category: "misc",
    tag: "Verified Order",
    date: "2 months ago",
    isApproved: true,
    isFeatured: false,
  },
  {
    id: "rev-7",
    handle: "@aarav_d",
    location: "Chennai",
    text: "Requested a couple doll set as a wedding gift. Alishba matched the sherwani and lehenga patterns down to the embroidery thread colors! Fast shipping and safe box packaging.",
    rating: 5,
    item: "Custom Wedding Dolls Set",
    category: "doll",
    tag: "Verified Order",
    date: "3 weeks ago",
    isApproved: true,
    isFeatured: true,
  },
];

const STORAGE_KEY = "inventive_queen_cms_reviews";
const REVIEWS_EVENT = "inventive_queen_reviews_updated";

export function getReviews(): ReviewItem[] {
  if (typeof window === "undefined") {
    return INITIAL_REVIEWS;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_REVIEWS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_REVIEWS;
  } catch {
    return INITIAL_REVIEWS;
  }
}

export function saveReviews(reviews: ReviewItem[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    window.dispatchEvent(new CustomEvent(REVIEWS_EVENT, { detail: reviews }));

    if (isSupabaseConfigured) {
      // Backup to site_settings
      supabase
        .from("site_settings")
        .upsert({ id: "reviews_cms", settings: reviews, updated_at: new Date().toISOString() })
        .then(
          () => {},
          () => {},
        );

      // Upsert into dedicated reviews table
      const rows = reviews.map((r) => ({
        id: r.id,
        author_name: r.handle.replace(/^@/, ""),
        author_handle: r.handle,
        location: r.location,
        rating: Math.max(1, Math.min(5, r.rating)),
        item_name: r.item,
        category: r.category,
        review_text: r.text,
        is_approved: r.isApproved,
        is_featured: Boolean(r.isFeatured),
      }));
      supabase
        .from("reviews")
        .upsert(rows, { onConflict: "id" })
        .then(
          () => {},
          () => {},
        );
    }
  } catch (err) {
    console.error("Failed to save reviews to storage:", err);
  }
}

export function useReviews(): {
  reviews: ReviewItem[];
  approvedReviews: ReviewItem[];
  addReview: (review: Omit<ReviewItem, "id">) => void;
  updateReview: (id: string, patch: Partial<ReviewItem>) => void;
  deleteReview: (id: string) => void;
  resetReviews: () => void;
} {
  const [reviews, setReviews] = useState<ReviewItem[]>(() => getReviews());

  useEffect(() => {
    setReviews(getReviews());

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<ReviewItem[]>;
      if (customEvent.detail) {
        setReviews(customEvent.detail);
      } else {
        setReviews(getReviews());
      }
    };

    window.addEventListener(REVIEWS_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);

    if (isSupabaseConfigured) {
      supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false })
        .then(({ data, error }) => {
          if (!error && Array.isArray(data) && data.length > 0) {
            const mapped: ReviewItem[] = data.map((row: Record<string, unknown>, idx: number) => ({
              id: (row["id"] as string) || `rev-${idx}`,
              handle:
                (row["author_handle"] as string) ||
                `@${String(row["author_name"] ?? "patron")
                  .toLowerCase()
                  .replace(/\s+/g, "_")}`,
              location: (row["location"] as string) || "India",
              text: (row["review_text"] as string) || "",
              rating: Number(row["rating"]) || 5,
              item: (row["item_name"] as string) || "Custom Keepsake",
              category:
                (row["category"] as "doll" | "bouquet" | "plushie" | "keychain" | "misc") || "doll",
              tag: "Verified Order",
              date: row["created_at"]
                ? new Date(row["created_at"] as string).toLocaleDateString("en-IN", {
                    month: "short",
                    year: "numeric",
                  })
                : "Recently",
              isApproved: Boolean(row["is_approved"]),
              isFeatured: Boolean(row["is_featured"]),
            }));
            setReviews(mapped);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
            return;
          }

          // Fallback to site_settings
          supabase
            .from("site_settings")
            .select("settings")
            .eq("id", "reviews_cms")
            .single()
            .then(({ data: settingData, error: settingErr }) => {
              if (
                !settingErr &&
                Array.isArray(settingData?.settings) &&
                settingData.settings.length > 0
              ) {
                setReviews(settingData.settings);
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
      window.removeEventListener(REVIEWS_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const addReview = (newReview: Omit<ReviewItem, "id">) => {
    const item: ReviewItem = {
      ...newReview,
      id: `rev-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    };
    const next = [item, ...reviews];
    setReviews(next);
    saveReviews(next);
  };

  const updateReview = (id: string, patch: Partial<ReviewItem>) => {
    const next = reviews.map((r) => (r.id === id ? { ...r, ...patch } : r));
    setReviews(next);
    saveReviews(next);
  };

  const deleteReview = (id: string) => {
    const next = reviews.filter((r) => r.id !== id);
    setReviews(next);
    saveReviews(next);
  };

  const resetReviews = () => {
    setReviews(INITIAL_REVIEWS);
    saveReviews(INITIAL_REVIEWS);
  };

  const approvedReviews = reviews.filter((r) => r.isApproved);

  return {
    reviews,
    approvedReviews,
    addReview,
    updateReview,
    deleteReview,
    resetReviews,
  };
}
