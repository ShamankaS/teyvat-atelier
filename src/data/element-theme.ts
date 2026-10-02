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

/** Soft page wash (radial) — low chroma so text stays readable. */
export const ELEMENT_PAGE_WASH: Record<ElementKey, string> = {
  pyro: "rgba(234, 88, 12, 0.22)",
  hydro: "rgba(14, 165, 233, 0.22)",
  electro: "rgba(139, 92, 246, 0.24)",
  cryo: "rgba(125, 211, 252, 0.20)",
  anemo: "rgba(45, 212, 191, 0.20)",
  geo: "rgba(234, 179, 8, 0.20)",
  dendro: "rgba(132, 204, 22, 0.20)",
};

/** Hero card border / accent tint. */
export const ELEMENT_HERO_BORDER: Record<ElementKey, string> = {
  pyro: "border-orange-400/35",
  hydro: "border-sky-400/35",
  electro: "border-violet-400/35",
  cryo: "border-cyan-300/35",
  anemo: "border-teal-300/35",
  geo: "border-amber-300/35",
  dendro: "border-lime-400/35",
};

export const ELEMENT_HERO_WASH: Record<ElementKey, string> = {
  pyro: "from-orange-500/15 via-transparent to-transparent",
  hydro: "from-sky-500/15 via-transparent to-transparent",
  electro: "from-violet-500/18 via-transparent to-transparent",
  cryo: "from-cyan-400/15 via-transparent to-transparent",
  anemo: "from-teal-400/15 via-transparent to-transparent",
  geo: "from-amber-400/15 via-transparent to-transparent",
  dendro: "from-lime-500/15 via-transparent to-transparent",
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
    backgroundImage: `radial-gradient(ellipse 90% 70% at 70% 0%, ${wash}, transparent 65%), radial-gradient(ellipse 60% 50% at 10% 80%, ${wash}, transparent 55%)`,
  };
}
