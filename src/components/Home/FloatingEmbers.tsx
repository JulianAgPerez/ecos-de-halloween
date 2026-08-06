const EMBERS = [
  { left: "8%", delay: "0s", duration: "11s", size: 6 },
  { left: "18%", delay: "2.5s", duration: "14s", size: 4 },
  { left: "28%", delay: "5s", duration: "10s", size: 7 },
  { left: "40%", delay: "1s", duration: "16s", size: 5 },
  { left: "52%", delay: "4s", duration: "12s", size: 8 },
  { left: "62%", delay: "0.5s", duration: "13s", size: 4 },
  { left: "72%", delay: "3s", duration: "15s", size: 6 },
  { left: "84%", delay: "6s", duration: "11s", size: 5 },
  { left: "92%", delay: "1.5s", duration: "14s", size: 7 },
];

const FloatingEmbers = () => (
  <div
    className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
    aria-hidden="true"
  >
    {EMBERS.map((e, i) => (
      <span
        key={i}
        className="absolute bottom-[-10px] rounded-full bg-orange-500/80 shadow-[0_0_10px_2px_rgba(249,115,22,0.7)]"
        style={{
          left: e.left,
          width: e.size,
          height: e.size,
          animation: `ember-rise ${e.duration} linear ${e.delay} infinite`,
        }}
      />
    ))}
  </div>
);

export default FloatingEmbers;