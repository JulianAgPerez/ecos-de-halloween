import { ClassicStoryDTO, StoryDTO } from "../types";

// El dominio no está declarado en ningún lado, así que las URLs absolutas se
// derivan del origen real en el que se está sirviendo la app.
export const absoluteUrl = (path: string): string =>
  new URL(path, window.location.origin).toString();

// Solo se declara lo que se puede sacar del dato. Las historias de la comunidad
// no tienen autor en el DTO, así que no se inventa.
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
