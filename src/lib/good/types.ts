export type StatKey =
  | "hp"
  | "hp_"
  | "atk"
  | "atk_"
  | "def"
  | "def_"
  | "eleMas"
  | "enerRech_"
  | "critRate_"
  | "critDMG_"
  | "heal_"
  | "pyro_dmg_"
  | "hydro_dmg_"
  | "electro_dmg_"
  | "cryo_dmg_"
  | "anemo_dmg_"
  | "geo_dmg_"
  | "dendro_dmg_"
  | "physical_dmg_";

export type SlotKey = "flower" | "plume" | "sands" | "goblet" | "circlet";

export type TalentKey = "auto" | "skill" | "burst";

export type WeaponType = "sword" | "claymore" | "polearm" | "bow" | "catalyst";

export type ElementKey =
  | "pyro"
  | "hydro"
  | "electro"
  | "cryo"
  | "anemo"
  | "geo"
  | "dendro";

export interface GoodCharacter {
  key: string;
  level: number;
  constellation: number;
  ascension: number;
  talent: { auto: number; skill: number; burst: number };
}

export interface GoodWeapon {
  key: string;
  level: number;
  ascension: number;
  refinement: number;
  location: string;
  lock?: boolean;
}

export interface GoodSubstat {
  key: StatKey | string;
  value: number;
}

export interface GoodArtifact {
  setKey: string;
  slotKey: SlotKey | string;
  level: number;
  rarity: number;
  mainStatKey: StatKey | string;
  location: string;
  lock?: boolean;
  substats: GoodSubstat[];
}

export interface GoodAccount {
  format?: string;
  version?: number;
  source?: string;
  characters: GoodCharacter[];
  weapons: GoodWeapon[];
  artifacts: GoodArtifact[];
}

export function isGoodAccount(value: unknown): value is GoodAccount {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    Array.isArray(v.characters) &&
    Array.isArray(v.weapons) &&
    Array.isArray(v.artifacts)
  );
}
