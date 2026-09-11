import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { getSeoMetadata } from "@/config/seoMetadata";

function upsertMeta(name, content) {
  if (!content) return;
  let element = document.head.querySelector('meta[name="' + name + '"]');
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("name", name);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

export default function RouteMeta() {
  const location = useLocation();
  const metadata = getSeoMetadata(location.pathname);

  useLayoutEffect(() => {
    document.title = metadata.title;
    upsertMeta("description", metadata.description);
    upsertMeta(
      "robots",
      metadata.noIndex
        ? "noindex, nofollow"
        : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    );

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", metadata.canonical);
  }, [location.pathname, metadata.title, metadata.description, metadata.noIndex, metadata.canonical]);

  useEffect(() => {
    // GA4 automatic page views are disabled in index.html. Record page views
    // only after this client-side route has been identified as a genuine
    // public, indexable page. This keeps redirect-only and internal legacy
    // URLs from contaminating public-site reporting.
    if (metadata.noIndex || typeof globalThis.gtag !== "function") return;

    globalThis.gtag("event", "page_view", {
      page_title: metadata.title,
      page_location: globalThis.location?.href || "",
      page_path: location.pathname,
      site_surface: "public",
    });
  }, [location.pathname, metadata.title, metadata.noIndex]);

  return null;
}
