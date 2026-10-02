import type { CSSProperties } from "react";
import type { ElementKey } from "@/lib/good/types";

/** Shared vision colors for avatars, hero chrome, and page wash. */
export const ELEMENT_AVATAR_GRADIENT: Record<ElementKey, string> = {
  pyro: "from-orange-500 to-red-700",
  hydro: "from-sky-400 to-blue-700",
  electro: "from-violet-400 to-purple-800",
  cryo: "from-cyan-200 to-sky-600",
  anemo: "from-teal-300 to-emerald-700",
  geo: "from-amber-300 to-yellow-700",
  dendro: "from-lime-400 to-green-800",
};

/** Solid page base — dark but clearly tinted by vision. */
export const ELEMENT_PAGE_BASE: Record<ElementKey, string> = {
  pyro: "oklch(0.17 0.055 40)",
  hydro: "oklch(0.17 0.055 230)",
  electro: "oklch(0.17 0.07 295)",
  cryo: "oklch(0.18 0.04 220)",
  anemo: "oklch(0.17 0.045 175)",
  geo: "oklch(0.17 0.05 85)",
  dendro: "oklch(0.17 0.055 135)",
};

/** Strong radial wash over the page base. */
export const ELEMENT_PAGE_WASH: Record<ElementKey, string> = {
  pyro: "rgba(249, 115, 22, 0.55)",
  hydro: "rgba(56, 189, 248, 0.50)",
  electro: "rgba(167, 139, 250, 0.55)",
  cryo: "rgba(125, 211, 252, 0.48)",
  anemo: "rgba(45, 212, 191, 0.48)",
  geo: "rgba(250, 204, 21, 0.45)",
  dendro: "rgba(163, 230, 53, 0.48)",
};

/** Cards / hero / tabs — tinted surfaces instead of neutral dark. */
export const ELEMENT_SURFACE: Record<ElementKey, string> = {
  pyro: "border-orange-400/45 bg-orange-950/70 ring-orange-400/25",
  hydro: "border-sky-400/45 bg-sky-950/70 ring-sky-400/25",
  electro: "border-violet-400/45 bg-violet-950/70 ring-violet-400/25",
  cryo: "border-cyan-300/45 bg-cyan-950/65 ring-cyan-300/25",
  anemo: "border-teal-300/45 bg-teal-950/70 ring-teal-300/25",
  geo: "border-amber-300/45 bg-amber-950/70 ring-amber-300/25",
  dendro: "border-lime-400/45 bg-lime-950/70 ring-lime-400/25",
};

/** Nested rows / chips / artifact slots. */
export const ELEMENT_PANEL: Record<ElementKey, string> = {
  pyro: "border-orange-400/30 bg-orange-900/40",
  hydro: "border-sky-400/30 bg-sky-900/40",
  electro: "border-violet-400/30 bg-violet-900/40",
  cryo: "border-cyan-300/30 bg-cyan-900/35",
  anemo: "border-teal-300/30 bg-teal-900/40",
  geo: "border-amber-300/30 bg-amber-900/40",
  dendro: "border-lime-400/30 bg-lime-900/40",
};

export const ELEMENT_HERO_WASH: Record<ElementKey, string> = {
  pyro: "from-orange-500/35 via-orange-600/10 to-transparent",
  hydro: "from-sky-400/35 via-sky-600/10 to-transparent",
  electro: "from-violet-400/40 via-violet-700/12 to-transparent",
  cryo: "from-cyan-300/35 via-sky-500/10 to-transparent",
  anemo: "from-teal-300/35 via-emerald-600/10 to-transparent",
  geo: "from-amber-300/35 via-yellow-600/10 to-transparent",
  dendro: "from-lime-400/35 via-green-700/10 to-transparent",
};

export const ELEMENT_ACCENT_TEXT: Record<ElementKey, string> = {
  pyro: "text-orange-300",
  hydro: "text-sky-300",
  electro: "text-violet-300",
  cryo: "text-cyan-200",
  anemo: "text-teal-300",
  geo: "text-amber-300",
  dendro: "text-lime-300",
};

export function elementPageStyle(element: ElementKey | undefined): CSSProperties | undefined {
  if (!element) return undefined;
  const wash = ELEMENT_PAGE_WASH[element];
  return {
    ["--char-wash" as string]: wash,
    backgroundColor: ELEMENT_PAGE_BASE[element],
    backgroundImage: [
      `radial-gradient(ellipse 100% 80% at 80% -10%, ${wash}, transparent 60%)`,
      `radial-gradient(ellipse 70% 55% at 0% 100%, ${wash}, transparent 55%)`,
      `radial-gradient(ellipse 50% 40% at 50% 50%, ${wash}, transparent 70%)`,
    ].join(", "),
  };
}
