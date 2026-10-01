export function ScoreRing({
  score,
  size = 56,
}: {
  score: number;
  size?: number;
}) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, score));
  const dash = (clamped / 100) * c;
  const color =
    clamped >= 85 ? "stroke-emerald-400" : clamped >= 70 ? "stroke-amber-400" : "stroke-rose-400";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          className="fill-none stroke-white/10"
          strokeWidth={4}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          className={`fill-none ${color}`}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold tabular-nums">
        {Math.round(clamped)}
      </span>
    </div>
  );
}
