import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { getSeoMetadata } from "@/config/seoMetadata";
import { installPublicIntentTracking, trackPublicPageView } from "@/lib/publicTracking";

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
    trackPublicPageView({
      navigationKey: location.key,
      pathname: location.pathname,
      title: metadata.title,
      noIndex: metadata.noIndex,
    });
  }, [location.key, location.pathname, location.search, metadata.title, metadata.noIndex]);

  useEffect(() => {
    if (metadata.noIndex) return undefined;
    return installPublicIntentTracking();
  }, [metadata.noIndex]);

  return null;
}
