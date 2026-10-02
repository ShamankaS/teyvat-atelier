"use client";

import { useEffect, useState } from "react";
import { weaponIconUrl } from "@/data/weapon-icons";
import { WEAPONS, weaponName } from "@/data/weapons";

/** Genshin-style rarity chrome for weapon icon frames. */
const RARITY_FRAME: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: "bg-linear-to-b from-zinc-400/40 to-zinc-700/50 ring-zinc-400/40",
  2: "bg-linear-to-b from-green-400/35 to-green-800/45 ring-green-400/35",
  3: "bg-linear-to-b from-sky-400/40 to-blue-800/50 ring-sky-400/40",
  4: "bg-linear-to-b from-violet-400/45 to-purple-900/55 ring-violet-400/45",
  5: "bg-linear-to-b from-amber-300/50 to-orange-800/55 ring-amber-300/50",
};

const WEAPON_KEY_ALIASES: Record<string, string> = {
  DragonsBane: "DragonBane",
  DragonBane: "DragonBane",
  WolfsGravestone: "WolfsGravestone",
  WolfGravestone: "WolfsGravestone",
  TheStringless: "TheStringless",
  Stringless: "TheStringless",
};

export function weaponRarity(weaponKey: string): 1 | 2 | 3 | 4 | 5 | undefined {
  return (WEAPONS[weaponKey] ?? WEAPONS[WEAPON_KEY_ALIASES[weaponKey]])?.rarity;
}

export function WeaponIcon({
  weaponKey,
  size = "md",
  showStars = true,
}: {
  weaponKey: string;
  size?: "sm" | "md";
  showStars?: boolean;
}) {
  const src = weaponIconUrl(weaponKey);
  const rarity = weaponRarity(weaponKey) ?? 3;
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  const dim = size === "sm" ? "size-9" : "size-11";
  const label = `${weaponName(weaponKey)}, ${rarity}★`;
  const showImage = Boolean(src) && !failed;

  return (
    <div className="flex shrink-0 flex-col items-center gap-0.5">
      <div
        className={`relative flex ${dim} items-center justify-center overflow-hidden rounded-md ring-1 ${RARITY_FRAME[rarity]}`}
        title={label}
      >
        {showImage ? (
          // Enka CDN weapon icons
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src!}
            alt=""
            className="size-full object-contain p-0.5"
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
          />
        ) : (
          <span className="text-[10px] font-medium text-muted-foreground" aria-hidden>
            ?
          </span>
        )}
        <span className="sr-only">{label}</span>
      </div>
      {showStars ? (
        <span
          className="tabular-nums text-[10px] leading-none tracking-tight text-amber-200/90"
          aria-hidden
        >
          {"★".repeat(rarity)}
        </span>
      ) : null}
    </div>
  );
}
