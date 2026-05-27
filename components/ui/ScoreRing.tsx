"use client";

export function ScoreRing({ score }: { score: number }) {
    const pct = Math.round(score * 10);
    const color = pct >= 70 ? "#21d07a" : pct >= 50 ? "#d2d531" : "#db2360";
    const r = 18;
    const circ = 2 * Math.PI * r;
    const dash = (pct / 100) * circ;
    return (
        <div className="relative h-14 w-14">
            <svg viewBox="0 0 44 44" className="h-full w-full -rotate-90">
                <circle
                    cx="22"
                    cy="22"
                    r={r}
                    fill="#081c22"
                    stroke="#204529"
                    strokeWidth="4"
                />
                <circle
                    cx="22"
                    cy="22"
                    r={r}
                    fill="none"
                    stroke={color}
                    strokeWidth="4"
                    strokeDasharray={`${dash} ${circ - dash}`}
                    strokeLinecap="round"
                />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                {pct}
                <sup className="text-[8px]">%</sup>
            </span>
        </div>
    );
}
