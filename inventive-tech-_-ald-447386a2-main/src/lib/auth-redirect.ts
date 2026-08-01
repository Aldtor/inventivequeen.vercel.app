const productionUrl = "https://inventivequeen.vercel.app";

export function getAuthRedirectUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (typeof window === "undefined") return `${productionUrl}${normalizedPath}`;

  const origin = window.location.origin;
  const safeOrigin = origin.includes("localhost") || origin.includes("127.0.0.1") ? productionUrl : origin;
  return `${safeOrigin}${normalizedPath}`;
}
