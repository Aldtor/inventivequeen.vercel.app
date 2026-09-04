import { useParams } from "react-router-dom";
import ShopPage from "./ShopPage";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();

  // Map legacy slugs to category ids
  let normalized = slug || "bouquet";
  if (normalized === "bouquets" || normalized === "flowers") normalized = "bouquet";
  if (normalized === "dolls" || normalized === "plushies" || normalized === "plush" || normalized === "teddy") normalized = "doll";
  if (normalized === "keychains" || normalized === "charms") normalized = "keychain";
  if (normalized === "bookmarks") normalized = "bookmark";

  return <ShopPage initialCategory={normalized} />;
}
