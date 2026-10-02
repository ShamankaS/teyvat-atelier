"use client";

import { useEffect, useState } from "react";
import { weaponIconUrl } from "@/data/weapon-icons";
import { weaponName } from "@/data/weapons";

export function WeaponIcon({
  weaponKey,
  size = "md",
}: {
  weaponKey: string;
  size?: "sm" | "md";
}) {
  const src = weaponIconUrl(weaponKey);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  const dim = size === "sm" ? "size-9" : "size-11";
  const label = weaponName(weaponKey);
  const showImage = Boolean(src) && !failed;

  return (
    <div
      className={`relative flex ${dim} shrink-0 items-center justify-center overflow-hidden rounded-md bg-black/25 ring-1 ring-white/10`}
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
  );
}
