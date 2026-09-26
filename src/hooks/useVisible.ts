import { RefObject, useEffect, useRef, useState } from "react";

/** Gate nativo a propósito: framer-motion expone useInView, pero importarlo
    desde la ruta inicial reintroduce sus 122 KB en el critical path. */
export const useVisible = <T extends Element>(
  rootMargin = "200px",
): readonly [RefObject<T>, boolean] => {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  const [tabVisible, setTabVisible] = useState(
    () => !document.hidden,
  );

  useEffect(() => {
    const onVisibility = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () =>
      document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return [ref, inView && tabVisible] as const;
};
