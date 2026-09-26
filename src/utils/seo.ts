import { ClassicStoryDTO, StoryDTO } from "../types";

// No hay dominio declarado en el proyecto, sale del origen real.
export const absoluteUrl = (path: string): string =>
  new URL(path, window.location.origin).toString();

// El DTO de historias de la comunidad no trae autor, así que no se declara.
export const classicBookJsonLd = (story: ClassicStoryDTO, path: string) => ({
  "@context": "https://schema.org",
  "@type": "Book",
  name: story.title,
  author: { "@type": "Person", name: story.author },
  inLanguage: "es",
  url: absoluteUrl(path),
  ...(story.year ? { datePublished: String(story.year) } : {}),
  ...(story.licenseUrl ? { license: story.licenseUrl } : {}),
  ...(story.sourceUrl ? { sameAs: story.sourceUrl } : {}),
});

export const userStoryJsonLd = (story: StoryDTO, path: string) => ({
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  name: story.title,
  inLanguage: "es",
  url: absoluteUrl(path),
  ...(story.description ? { description: story.description } : {}),
});
