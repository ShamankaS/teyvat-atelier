import {
  CHARACTERS,
  TWO_PC_STATS,
  WEAPONS,
  type CharacterInfo,
  type WeaponInfo,
} from "@/data/catalog";
import type { GoodAccount, GoodArtifact, GoodCharacter } from "@/lib/good/types";
import { mainstatValue } from "@/lib/stats";

const WEAPON_ALIASES: Record<string, string> = {
  DragonsBane: "DragonBane",
  DragonBane: "DragonBane",
};

export function resolveWeapon(key: string): WeaponInfo | undefined {
  return WEAPONS[key] ?? WEAPONS[WEAPON_ALIASES[key]] ?? WEAPONS[key.replace(/sBane/, "Bane")];
}

export interface BuiltStats {
  hp: number;
  atk: number;
  def: number;
  eleMas: number;
  enerRech_: number;
  critRate_: number;
  critDMG_: number;
  heal_: number;
  pyro_dmg_: number;
  hydro_dmg_: number;
  electro_dmg_: number;
  cryo_dmg_: number;
  anemo_dmg_: number;
  geo_dmg_: number;
  dendro_dmg_: number;
  physical_dmg_: number;
}

const EMPTY_STATS: BuiltStats = {
  hp: 0,
  atk: 0,
  def: 0,
  eleMas: 0,
  enerRech_: 100,
  critRate_: 5,
  critDMG_: 50,
  heal_: 0,
  pyro_dmg_: 0,
  hydro_dmg_: 0,
  electro_dmg_: 0,
  cryo_dmg_: 0,
  anemo_dmg_: 0,
  geo_dmg_: 0,
  dendro_dmg_: 0,
  physical_dmg_: 0,
};

export function equippedWeapon(account: GoodAccount, characterKey: string) {
  return account.weapons.find((w) => w.location === characterKey);
}

export function equippedArtifacts(account: GoodAccount, characterKey: string) {
  return account.artifacts.filter((a) => a.location === characterKey);
}

export function inventoryWeapons(account: GoodAccount, characterKey: string, type: string) {
  return account.weapons.filter((w) => {
    const info = resolveWeapon(w.key);
    if (!info || info.type !== type) return false;
    return w.location !== characterKey;
  });
}

export function setCounts(artifacts: GoodArtifact[]) {
  const counts: Record<string, number> = {};
  for (const a of artifacts) {
    counts[a.setKey] = (counts[a.setKey] ?? 0) + 1;
  }
  return counts;
}

export function describeSets(artifacts: GoodArtifact[]) {
  const counts = setCounts(artifacts);
  const parts = Object.entries(counts)
    .filter(([, n]) => n >= 2)
    .sort((a, b) => b[1] - a[1])
    .map(([set, n]) => ({ set, count: (n >= 4 ? 4 : 2) as 2 | 4 }));
  return parts;
}

export function setSignature(artifacts: GoodArtifact[]) {
  return describeSets(artifacts)
    .map((p) => `${p.set}:${p.count}`)
    .join("+");
}

function addFlat(stats: BuiltStats, key: string, value: number) {
  if (key in stats) {
    (stats[key as keyof BuiltStats] as number) += value;
  }
}

export function computeBuild(
  account: GoodAccount,
  character: GoodCharacter,
  options: { combatBuffs: boolean } = { combatBuffs: true },
) {
  const info: CharacterInfo | undefined = CHARACTERS[character.key];
  const weaponGood = equippedWeapon(account, character.key);
  const weaponInfo = weaponGood ? resolveWeapon(weaponGood.key) : undefined;
  const artifacts = equippedArtifacts(account, character.key);

  const levelMul = Math.min(1, character.level / 90);
  const baseHp = (info?.baseHp90 ?? 10000) * levelMul;
  const baseAtkChar = (info?.baseAtk90 ?? 200) * levelMul;
  const baseDef = (info?.baseDef90 ?? 600) * levelMul;
  const weaponAtk = weaponInfo ? weaponInfo.baseAtk90 * Math.min(1, (weaponGood?.level ?? 90) / 90) : 0;
  const baseAtk = baseAtkChar + weaponAtk;

  const stats: BuiltStats = { ...EMPTY_STATS };
  const hpPercent: number[] = [];
  const atkPercent: number[] = [];
  const defPercent: number[] = [];

  if (weaponInfo && weaponGood) {
    const subMul = Math.min(1, weaponGood.level / 90);
    const sub = weaponInfo.substat90 * subMul;
    if (weaponInfo.substat === "hp_") hpPercent.push(sub);
    else if (weaponInfo.substat === "atk_") atkPercent.push(sub);
    else if (weaponInfo.substat === "def_") defPercent.push(sub);
    else addFlat(stats, weaponInfo.substat, sub);
  }

  const slotMain: Record<string, string> = {};

  for (const art of artifacts) {
    const main = art.mainStatKey;
    slotMain[art.slotKey] = main;
    const mv = mainstatValue(main, art.level, art.rarity);
    if (main === "hp_") hpPercent.push(mv);
    else if (main === "atk_") atkPercent.push(mv);
    else if (main === "def_") defPercent.push(mv);
    else if (main === "hp") stats.hp += mv;
    else if (main === "atk") stats.atk += mv;
    else if (main === "def") stats.def += mv;
    else addFlat(stats, main, mv);

    for (const sub of art.substats) {
      if (sub.key === "hp_") hpPercent.push(sub.value);
      else if (sub.key === "atk_") atkPercent.push(sub.value);
      else if (sub.key === "def_") defPercent.push(sub.value);
      else if (sub.key === "hp") stats.hp += sub.value;
      else if (sub.key === "atk") stats.atk += sub.value;
      else if (sub.key === "def") stats.def += sub.value;
      else addFlat(stats, sub.key, sub.value);
    }
  }

  const counts = setCounts(artifacts);
  for (const [set, n] of Object.entries(counts)) {
    if (n < 2) continue;
    const bonus = TWO_PC_STATS[set];
    if (!bonus) continue;
    if (bonus.key === "hp_") hpPercent.push(bonus.value);
    else if (bonus.key === "atk_") atkPercent.push(bonus.value);
    else if (bonus.key === "def_") defPercent.push(bonus.value);
    else if (bonus.key !== "skill" && bonus.key !== "burst" && bonus.key !== "na") {
      addFlat(stats, bonus.key, bonus.value);
    }
  }

  if (options.combatBuffs) {
    if ((counts.MarechausseeHunter ?? 0) >= 4) stats.critRate_ += 36;
    if ((counts.ObsidianCodex ?? 0) >= 4) stats.critRate_ += 40;
    if ((counts.BlizzardStrayer ?? 0) >= 4) stats.critRate_ += 20;
  }

  const hpPct = hpPercent.reduce((a, b) => a + b, 0);
  const atkPct = atkPercent.reduce((a, b) => a + b, 0);
  const defPct = defPercent.reduce((a, b) => a + b, 0);

  stats.hp += baseHp * (1 + hpPct / 100);
  stats.atk += baseAtk * (1 + atkPct / 100);
  stats.def += baseDef * (1 + defPct / 100);

  return {
    info,
    weaponGood,
    weaponInfo: weaponInfo as WeaponInfo | undefined,
    artifacts,
    stats,
    slotMain,
    setPieces: describeSets(artifacts),
    setCounts: counts,
    baseAtk,
    baseHp,
  };
}

export type ComputedBuild = ReturnType<typeof computeBuild>;
