import { useEffect } from "react";
import { SITE_NAME } from "../config";
import { absoluteUrl } from "../utils/seo";

interface SeoProps {
  title: string;
  description: string;
  canonicalPath?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown>;
}

const upsertMeta = (
  attribute: "name" | "property",
  key: string,
  content: string,
): void => {
  const selector = `meta[${attribute}="${key}"]`;
  let meta = document.head.querySelector<HTMLMetaElement>(selector);
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute(attribute, key);
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
};

const removeHeadNode = (selector: string): void => {
  document.head.querySelector(selector)?.remove();
};

const setCanonical = (href: string | null): void => {
  removeHeadNode('link[rel="canonical"]');
  if (!href) return;
  const link = document.createElement("link");
  link.rel = "canonical";
  link.href = href;
  document.head.appendChild(link);
};

const JSON_LD_ID = "seo-json-ld";

const setJsonLd = (data: string | null): void => {
  document.getElementById(JSON_LD_ID)?.remove();
  if (!data) return;
  const script = document.createElement("script");
  script.id = JSON_LD_ID;
  script.type = "application/ld+json";
  script.textContent = data;
  document.head.appendChild(script);
};

export const useSeo = ({
  title,
  description,
  canonicalPath,
  noindex,
  jsonLd,
}: SeoProps) => {
  // Serializado para que el efecto no se dispare en cada render: el llamador
  // reconstruye el objeto, pero su contenido es estable.
  const jsonLdText = jsonLd ? JSON.stringify(jsonLd) : null;

  useEffect(() => {
    const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
    const url = canonicalPath
      ? absoluteUrl(canonicalPath)
      : window.location.href;

    document.title = fullTitle;
    upsertMeta("name", "description", description);
    upsertMeta(
      "name",
      "robots",
      noindex ? "noindex, nofollow" : "index, follow",
    );

    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("property", "og:locale", "es_ES");
    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", url);

    upsertMeta("name", "twitter:card", "summary");
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", description);

    setCanonical(canonicalPath ? absoluteUrl(canonicalPath) : null);
    setJsonLd(jsonLdText);

    return () => {
      removeHeadNode('meta[name="robots"]');
      setCanonical(null);
      setJsonLd(null);
    };
  }, [title, description, canonicalPath, noindex, jsonLdText]);
};
