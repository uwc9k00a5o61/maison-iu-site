export function AnnounceBar() {
  const items = [
    "By appointment",
    "Moscow",
    "Dubai",
    "Provenance verified",
    "RU / EN",
  ];
  return (
    <div className="bg-ink text-cream/90">
      <div className="mx-auto flex max-w-[1480px] flex-wrap items-center justify-center gap-x-3 gap-y-1 px-5 py-2 text-center text-[10.5px] font-semibold uppercase tracking-[0.18em]">
        {items.map((item, i) => (
          <span key={item} className="flex items-center gap-x-3">
            {i > 0 && <span className="text-champ/70">·</span>}
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
