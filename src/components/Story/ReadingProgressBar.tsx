import {
  type RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

const IDLE_MS = 1500;

const DAY_COLORS = {
  track: "rgba(201, 160, 106, 0.25)",
  progress: "#c9a06a",
};

const NIGHT_COLORS = {
  track: "rgba(230, 197, 143, 0.18)",
  progress: "#e6c58f",
};

const ReadingProgressBar = ({
  targetRef,
  nightMode = false,
}: {
  targetRef: RefObject<HTMLElement>;
  nightMode?: boolean;
}) => {
  const { scrollY } = useScroll();
  const [range, setRange] = useState({ start: 0, end: 1 });
  const idleTimer = useRef<number | null>(null);
  const opacity = useSpring(0.4, { stiffness: 250, damping: 30 });

  const { track, progress: progressColor } = nightMode
    ? NIGHT_COLORS
    : DAY_COLORS;

  useEffect(
    () => () => {
      if (idleTimer.current !== null) window.clearTimeout(idleTimer.current);
    },
    []
  );

  useMotionValueEvent(scrollY, "change", () => {
    opacity.set(1);
    if (idleTimer.current !== null) window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => opacity.set(0.4), IDLE_MS);
  });

  useLayoutEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    const measure = () => {
      const top = el.getBoundingClientRect().top + window.scrollY;
      const end = top + el.offsetHeight - window.innerHeight;
      setRange({ start: top, end: Math.max(end, top + 1) });
    };
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [targetRef]);

  const progress = useTransform(scrollY, [range.start, range.end], [0, 1], {
    clamp: true,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ opacity }}
      className="fixed bottom-0 left-0 right-0 z-20 h-[3px]"
    >
      <div className="h-full w-full" style={{ backgroundColor: track }} />
      <motion.div
        className="absolute inset-y-0 left-0 w-full origin-left"
        style={{ scaleX: progress, backgroundColor: progressColor }}
      />
    </motion.div>
  );
};

export default ReadingProgressBar;
