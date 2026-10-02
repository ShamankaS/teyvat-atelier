import type { ElementKey, WeaponType } from "@/lib/good/types";

export const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  hp_: "HP%",
  atk: "Сила атаки",
  atk_: "Сила атаки%",
  def: "Защита",
  def_: "Защита%",
  eleMas: "Мастерство стихий",
  enerRech_: "Восстановление энергии%",
  critRate_: "Крит. шанс%",
  critDMG_: "Крит. урон%",
  heal_: "Бонус лечения%",
  pyro_dmg_: "Пиро урон%",
  hydro_dmg_: "Гидро урон%",
  electro_dmg_: "Электро урон%",
  cryo_dmg_: "Крио урон%",
  anemo_dmg_: "Анемо урон%",
  geo_dmg_: "Гео урон%",
  dendro_dmg_: "Дендро урон%",
  physical_dmg_: "Физ. урон%",
};

export const ELEMENT_LABELS: Record<ElementKey, string> = {
  pyro: "Пиро",
  hydro: "Гидро",
  electro: "Электро",
  cryo: "Крио",
  anemo: "Анемо",
  geo: "Гео",
  dendro: "Дендро",
};

export const WEAPON_TYPE_LABELS: Record<WeaponType, string> = {
  sword: "Меч",
  claymore: "Двуручный меч",
  polearm: "Древковое",
  bow: "Стрелковое",
  catalyst: "Катализатор",
};

export function statLabel(key: string) {
  return STAT_LABELS[key] ?? key;
}
