import { ELEMENT_LABELS } from "@/data/catalog";
import type { ElementKey } from "@/lib/good/types";

const COLORS: Record<ElementKey, string> = {
  pyro: "from-orange-500 to-red-700",
  hydro: "from-sky-400 to-blue-700",
  electro: "from-violet-400 to-purple-800",
  cryo: "from-cyan-200 to-sky-600",
  anemo: "from-teal-300 to-emerald-700",
  geo: "from-amber-300 to-yellow-700",
  dendro: "from-lime-400 to-green-800",
};

export function CharacterAvatar({
  name,
  element,
  size = "md",
}: {
  name: string;
  element?: ElementKey;
  size?: "sm" | "md" | "lg";
}) {
  const dim = size === "sm" ? "size-10 text-sm" : size === "lg" ? "size-16 text-xl" : "size-12 text-base";
  const letters = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return (
    <div
      className={`relative flex ${dim} items-center justify-center rounded-full bg-linear-to-br font-semibold text-white shadow-inner ${element ? COLORS[element] : "from-zinc-500 to-zinc-800"}`}
      title={element ? ELEMENT_LABELS[element] : name}
    >
      {letters}
    </div>
  );
}
