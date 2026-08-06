const CLOUDINARY_HOSTS = ["res.cloudinary.com"];
const TRANSFORMATION_MARKER = "/upload/";

export interface BackgroundUrlOptions {
  width?: number;
  dpr?: boolean;
}

const isCloudinaryUrl = (url: string): boolean =>
  CLOUDINARY_HOSTS.some((host) => url.includes(host));

const buildTransformations = (width: number, dpr: boolean): string =>
  [
    `w_${width}`,
    "q_auto",
    "f_auto",
    "fl_progressive",
    ...(dpr ? ["dpr_auto"] : []),
    "c_scale",
  ].join(",");

export const getOptimizedBackgroundUrl = (
  url: string,
  { width = 1920, dpr = true }: BackgroundUrlOptions = {},
): string => {
  if (!isCloudinaryUrl(url)) return url;
  const markerIndex = url.indexOf(TRANSFORMATION_MARKER);
  if (markerIndex === -1) return url;
  const after = url.slice(markerIndex + TRANSFORMATION_MARKER.length);
  if (!/^v\d+\//.test(after)) return url;
  return (
    url.slice(0, markerIndex + TRANSFORMATION_MARKER.length) +
    buildTransformations(width, dpr) +
    "/" +
    after
  );
};

export const BACKGROUND_SRC_SET_WIDTHS = [640, 960, 1280, 1600, 1920, 2560];

export const getBackgroundSrcSet = (url: string): string =>
  BACKGROUND_SRC_SET_WIDTHS.map(
    (width) =>
      `${getOptimizedBackgroundUrl(url, { width, dpr: false })} ${width}w`,
  ).join(", ");
