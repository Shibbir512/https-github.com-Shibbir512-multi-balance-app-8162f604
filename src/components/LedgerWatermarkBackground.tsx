import { BookOpen } from "lucide-react";

export default function LedgerWatermarkBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* ── LEFT SIDE: BOTANICAL LEAF VINE RUNNING UP THE EDGE ── */}
      <svg
        className="absolute left-0 bottom-16 w-36 sm:w-48 lg:w-56 h-[560px] text-primary opacity-[0.065] dark:opacity-[0.045] pointer-events-none"
        viewBox="0 0 160 520"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Curving central vine stem */}
        <path
          d="M 25 520 Q 45 370 35 260 T 55 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* Alternating soft organic leaves */}
        {/* Pair 1 (bottom) */}
        <path d="M 28 475 C 10 460 2 440 0 415 C 16 425 24 445 30 470 Z" />
        <path d="M 31 445 C 50 430 70 425 90 430 C 80 450 60 460 32 450 Z" />
        {/* Pair 2 (mid-low) */}
        <path d="M 35 385 C 12 370 4 345 2 320 C 20 330 32 350 36 380 Z" />
        <path d="M 37 355 C 62 340 85 337 105 345 C 93 365 70 373 39 360 Z" />
        {/* Pair 3 (middle) */}
        <path d="M 36 295 C 10 282 3 255 3 230 C 23 240 35 262 38 290 Z" />
        <path d="M 38 265 C 65 250 90 250 112 260 C 96 280 75 285 40 270 Z" />
        {/* Pair 4 (upper-mid) */}
        <path d="M 42 205 C 18 192 12 165 14 140 C 32 152 44 175 44 200 Z" />
        <path d="M 44 175 C 72 160 98 162 118 175 C 100 192 78 196 46 180 Z" />
        {/* Pair 5 (top) */}
        <path d="M 48 115 C 26 102 22 76 26 54 C 42 66 52 86 50 110 Z" />
        <path d="M 52 70 C 60 48 64 25 56 8 C 49 26 48 45 51 66 Z" />
      </svg>

      {/* ── BOTTOM LEFT: TILTED OPEN BOOK OUTLINE ── */}
      <div className="absolute -bottom-10 -left-10 w-64 h-64 sm:w-72 sm:h-72 text-primary opacity-[0.06] dark:opacity-[0.04] pointer-events-none transform -rotate-12">
        <BookOpen className="w-full h-full" strokeWidth={0.9} />
      </div>

      {/* ── BOTTOM RIGHT: CONCENTRIC CURVED WAVES / RIPPLES ── */}
      <svg
        className="absolute -right-24 -bottom-24 w-[420px] sm:w-[520px] h-[420px] sm:h-[520px] text-primary opacity-[0.045] dark:opacity-[0.03] pointer-events-none"
        viewBox="0 0 400 400"
        fill="none"
        stroke="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="360" cy="360" r="110" strokeWidth="2.5" />
        <circle cx="360" cy="360" r="170" strokeWidth="2.5" />
        <circle cx="360" cy="360" r="230" strokeWidth="2" />
        <circle cx="360" cy="360" r="290" strokeWidth="2" />
        <circle cx="360" cy="360" r="350" strokeWidth="1.5" strokeDasharray="6 6" />
      </svg>
    </div>
  );
}
