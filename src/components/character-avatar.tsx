"use client";

import { useEffect, useState } from "react";
import { characterElement, characterIconUrl } from "@/data/characters";
import { ELEMENT_AVATAR_GRADIENT } from "@/data/element-theme";
import { ELEMENT_LABELS } from "@/data/catalog";
import type { ElementKey } from "@/lib/good/types";

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
  const gradient = resolved
    ? ELEMENT_AVATAR_GRADIENT[resolved]
    : "from-zinc-500 to-zinc-800";

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
