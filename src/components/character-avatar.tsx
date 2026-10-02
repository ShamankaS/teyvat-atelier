"use client";

import { useEffect, useState } from "react";
import { characterElement } from "@/data/character-elements";
import { characterIconUrl } from "@/data/character-icons";
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

const SIZE = {
  sm: "size-10 text-sm",
  md: "size-12 text-base",
  lg: "size-16 text-xl",
} as const;

export function CharacterAvatar({
  characterKey,
  name,
  element,
  size = "md",
}: {
  characterKey?: string;
  name: string;
  element?: ElementKey;
  size?: "sm" | "md" | "lg";
}) {
  const src = characterKey ? characterIconUrl(characterKey) : null;
  const resolved = element ?? (characterKey ? characterElement(characterKey) : undefined);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  const letters = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  const showImage = Boolean(src) && !failed;
  const gradient = resolved ? COLORS[resolved] : "from-zinc-500 to-zinc-800";

  return (
    <div
      className={`relative flex ${SIZE[size]} shrink-0 items-center justify-center overflow-hidden rounded-full bg-linear-to-br font-semibold text-white shadow-inner ${gradient}`}
      title={resolved ? ELEMENT_LABELS[resolved] : name}
    >
      {showImage ? (
        // Enka CDN portraits — circular crop like seelie.me character icons
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src!}
          alt=""
          className="size-full object-cover object-[center_20%]"
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <span aria-hidden>{letters}</span>
      )}
      <span className="sr-only">{name}</span>
    </div>
  );
}
