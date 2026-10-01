import type { StatKey } from "@/lib/good/types";

const MAIN_AT_20: Record<string, number> = {
  hp: 4780,
  atk: 311,
  def: 371,
  hp_: 46.6,
  atk_: 46.6,
  def_: 58.3,
  eleMas: 187,
  enerRech_: 51.8,
  critRate_: 31.1,
  critDMG_: 62.2,
  heal_: 35.9,
  pyro_dmg_: 46.6,
  hydro_dmg_: 46.6,
  electro_dmg_: 46.6,
  cryo_dmg_: 46.6,
  anemo_dmg_: 46.6,
  geo_dmg_: 46.6,
  dendro_dmg_: 46.6,
  physical_dmg_: 58.3,
};

const MAIN_AT_0: Record<string, number> = {
  hp: 717,
  atk: 47,
  def: 56,
  hp_: 7.0,
  atk_: 7.0,
  def_: 8.7,
  eleMas: 28,
  enerRech_: 7.8,
  critRate_: 4.7,
  critDMG_: 9.3,
  heal_: 5.4,
  pyro_dmg_: 7.0,
  hydro_dmg_: 7.0,
  electro_dmg_: 7.0,
  cryo_dmg_: 7.0,
  anemo_dmg_: 7.0,
  geo_dmg_: 7.0,
  dendro_dmg_: 7.0,
  physical_dmg_: 8.7,
};

export function mainstatValue(key: string, level: number, rarity = 5): number {
  const hi = MAIN_AT_20[key];
  const lo = MAIN_AT_0[key];
  if (hi == null || lo == null) return 0;
  const t = Math.min(20, Math.max(0, level)) / 20;
  const rarityMul = rarity >= 5 ? 1 : rarity === 4 ? 0.8 : 0.6;
  return (lo + (hi - lo) * t) * rarityMul;
}

export const PERCENT_STATS = new Set<string>([
  "hp_",
  "atk_",
  "def_",
  "enerRech_",
  "critRate_",
  "critDMG_",
  "heal_",
  "pyro_dmg_",
  "hydro_dmg_",
  "electro_dmg_",
  "cryo_dmg_",
  "anemo_dmg_",
  "geo_dmg_",
  "dendro_dmg_",
  "physical_dmg_",
]);

export function isPercentStat(key: string) {
  return PERCENT_STATS.has(key);
}

export function formatStatValue(key: string, value: number) {
  if (isPercentStat(key)) return `${value.toFixed(1)}%`;
  if (key === "eleMas") return Math.round(value).toString();
  return Math.round(value).toLocaleString("ru-RU");
}

export const ELEMENT_DAMAGE_STAT: Record<string, StatKey> = {
  pyro: "pyro_dmg_",
  hydro: "hydro_dmg_",
  electro: "electro_dmg_",
  cryo: "cryo_dmg_",
  anemo: "anemo_dmg_",
  geo: "geo_dmg_",
  dendro: "dendro_dmg_",
};
