import type { StatKey } from "@/lib/good/types";

export type TwoPcBonusKey = StatKey | "skill" | "burst" | "na";

export interface TwoPcBonus {
  key: TwoPcBonusKey;
  value: number;
}

export interface SetInfo {
  key: string;
  name: string;
  /** Highest drop rarity for the set (3 / 4 / 5). */
  rarity: 3 | 4 | 5;
  /** 2-piece bonus when applicable (skipped for RES/shield-only sets). */
  twoPc?: TwoPcBonus;
}

/** Artifact sets: HoYoWiki RU names, rarity, + 2pc bonuses for stat compute. */
export const SETS: Record<string, SetInfo> = {
  ADayCarvedFromRisingWinds: {
    key: "ADayCarvedFromRisingWinds",
    name: "День восходящих ветров",
    rarity: 5,
    twoPc: { key: "anemo_dmg_", value: 15 },
  },
  Adventurer: {
    key: "Adventurer",
    name: "Искатель приключений",
    rarity: 3,
    twoPc: { key: "hp", value: 1000 },
  },
  ArchaicPetra: {
    key: "ArchaicPetra",
    name: "Архаичный камень",
    rarity: 5,
    twoPc: { key: "geo_dmg_", value: 15 },
  },
  AubadeOfMorningstarAndMoon: {
    key: "AubadeOfMorningstarAndMoon",
    name: "Рассветная песнь звезды и луны",
    rarity: 5,
    twoPc: { key: "hp_", value: 20 },
  },
  Berserker: {
    key: "Berserker",
    name: "Берсерк",
    rarity: 4,
    twoPc: { key: "critRate_", value: 12 },
  },
  BlizzardStrayer: {
    key: "BlizzardStrayer",
    name: "Заблудший в метели",
    rarity: 5,
    twoPc: { key: "cryo_dmg_", value: 15 },
  },
  BloodstainedChivalry: {
    key: "BloodstainedChivalry",
    name: "Рыцарь крови",
    rarity: 5,
    twoPc: { key: "physical_dmg_", value: 25 },
  },
  BraveHeart: {
    key: "BraveHeart",
    name: "Душа храбреца",
    rarity: 4,
    twoPc: { key: "atk_", value: 18 },
  },
  CelestialGift: {
    key: "CelestialGift",
    name: "Дар небес",
    rarity: 5,
    twoPc: { key: "enerRech_", value: 20 },
  },
  CrimsonWitchOfFlames: {
    key: "CrimsonWitchOfFlames",
    name: "Горящая алая ведьма",
    rarity: 5,
    twoPc: { key: "pyro_dmg_", value: 15 },
  },
  DeepwoodMemories: {
    key: "DeepwoodMemories",
    name: "Воспоминания дремучего леса",
    rarity: 5,
    twoPc: { key: "dendro_dmg_", value: 15 },
  },
  DefendersWill: {
    key: "DefendersWill",
    name: "Воля защитника",
    rarity: 4,
    twoPc: { key: "def_", value: 30 },
  },
  DesertPavilionChronicle: {
    key: "DesertPavilionChronicle",
    name: "Хроники Чертогов в пустыне",
    rarity: 5,
    twoPc: { key: "anemo_dmg_", value: 15 },
  },
  DisenchantmentInDeepShadow: {
    key: "DisenchantmentInDeepShadow",
    name: "Застывшее в тени разочарование",
    rarity: 5,
    twoPc: { key: "eleMas", value: 80 },
  },
  EchoesOfAnOffering: {
    key: "EchoesOfAnOffering",
    name: "Отголоски подношения",
    rarity: 5,
    twoPc: { key: "atk_", value: 18 },
  },
  EmblemOfSeveredFate: {
    key: "EmblemOfSeveredFate",
    name: "Эмблема рассечённой судьбы",
    rarity: 5,
    twoPc: { key: "enerRech_", value: 20 },
  },
  FinaleOfTheDeepGalleries: {
    key: "FinaleOfTheDeepGalleries",
    name: "Финал галерей глубин",
    rarity: 5,
    twoPc: { key: "cryo_dmg_", value: 15 },
  },
  FlowerOfParadiseLost: {
    key: "FlowerOfParadiseLost",
    name: "Цветок потерянного рая",
    rarity: 5,
    twoPc: { key: "eleMas", value: 80 },
  },
  FragmentOfHarmonicWhimsy: {
    key: "FragmentOfHarmonicWhimsy",
    name: "Фрагмент гармонической фантазии",
    rarity: 5,
    twoPc: { key: "atk_", value: 18 },
  },
  Gambler: {
    key: "Gambler",
    name: "Азартный игрок",
    rarity: 4,
    twoPc: { key: "skill", value: 20 },
  },
  GildedDreams: {
    key: "GildedDreams",
    name: "Позолоченные сны",
    rarity: 5,
    twoPc: { key: "eleMas", value: 80 },
  },
  GladiatorsFinale: {
    key: "GladiatorsFinale",
    name: "Конец гладиатора",
    rarity: 5,
    twoPc: { key: "atk_", value: 18 },
  },
  GoldenTroupe: {
    key: "GoldenTroupe",
    name: "Золотая труппа",
    rarity: 5,
    twoPc: { key: "skill", value: 20 },
  },
  HeartOfDepth: {
    key: "HeartOfDepth",
    name: "Сердце глубин",
    rarity: 5,
    twoPc: { key: "hydro_dmg_", value: 15 },
  },
  HeartOfTheFurnace: {
    key: "HeartOfTheFurnace",
    name: "Сердце горна",
    rarity: 5,
    twoPc: { key: "atk_", value: 18 },
  },
  HuskOfOpulentDreams: {
    key: "HuskOfOpulentDreams",
    name: "Кокон сладких грёз",
    rarity: 5,
    twoPc: { key: "def_", value: 30 },
  },
  Instructor: {
    key: "Instructor",
    name: "Инструктор",
    rarity: 4,
    twoPc: { key: "eleMas", value: 80 },
  },
  Lavawalker: {
    key: "Lavawalker",
    name: "Ступающий по лаве",
    rarity: 5,
  },
  LongNightsOath: {
    key: "LongNightsOath",
    name: "Клятва долгой ночи",
    rarity: 5,
    twoPc: { key: "na", value: 25 },
  },
  LuckyDog: {
    key: "LuckyDog",
    name: "Везунчик",
    rarity: 3,
    twoPc: { key: "def", value: 100 },
  },
  MaidenBeloved: {
    key: "MaidenBeloved",
    name: "Возлюбленная юная дева",
    rarity: 5,
    twoPc: { key: "heal_", value: 15 },
  },
  MarechausseeHunter: {
    key: "MarechausseeHunter",
    name: "Охотник Сумеречного двора",
    rarity: 5,
    twoPc: { key: "na", value: 15 },
  },
  MartialArtist: {
    key: "MartialArtist",
    name: "Воин",
    rarity: 4,
    twoPc: { key: "na", value: 15 },
  },
  NightOfTheSkysUnveiling: {
    key: "NightOfTheSkysUnveiling",
    name: "Ночь открытия неба",
    rarity: 5,
    twoPc: { key: "eleMas", value: 80 },
  },
  NighttimeWhispersInTheEchoingWoods: {
    key: "NighttimeWhispersInTheEchoingWoods",
    name: "Ночной шёпот в Лесу откликающегося эха",
    rarity: 5,
    twoPc: { key: "atk_", value: 18 },
  },
  NoblesseOblige: {
    key: "NoblesseOblige",
    name: "Церемония древней знати",
    rarity: 5,
    twoPc: { key: "burst", value: 20 },
  },
  NymphsDream: {
    key: "NymphsDream",
    name: "Сон нимфы",
    rarity: 5,
    twoPc: { key: "hydro_dmg_", value: 15 },
  },
  ObsidianCodex: {
    key: "ObsidianCodex",
    name: "Обсидиановый фолиант",
    rarity: 5,
    twoPc: { key: "na", value: 15 },
  },
  OceanHuedClam: {
    key: "OceanHuedClam",
    name: "Моллюск морских красок",
    rarity: 5,
    twoPc: { key: "heal_", value: 15 },
  },
  PaleFlame: {
    key: "PaleFlame",
    name: "Бледный огонь",
    rarity: 5,
    twoPc: { key: "physical_dmg_", value: 25 },
  },
  PrayersForDestiny: {
    key: "PrayersForDestiny",
    name: "Шаман воды",
    rarity: 4,
  },
  PrayersForIllumination: {
    key: "PrayersForIllumination",
    name: "Шаман огня",
    rarity: 4,
  },
  PrayersForWisdom: {
    key: "PrayersForWisdom",
    name: "Шаман молнии",
    rarity: 4,
  },
  PrayersToSpringtime: {
    key: "PrayersToSpringtime",
    name: "Шаман льда",
    rarity: 4,
  },
  ResolutionOfSojourner: {
    key: "ResolutionOfSojourner",
    name: "Решимость временщика",
    rarity: 4,
    twoPc: { key: "atk_", value: 18 },
  },
  RetracingBolide: {
    key: "RetracingBolide",
    name: "Встречная комета",
    rarity: 5,
  },
  ScarletProof: {
    key: "ScarletProof",
    name: "Багряное доказательство",
    rarity: 5,
    twoPc: { key: "atk_", value: 18 },
  },
  Scholar: {
    key: "Scholar",
    name: "Учёный",
    rarity: 4,
    twoPc: { key: "enerRech_", value: 20 },
  },
  ScrollOfTheHeroOfCinderCity: {
    key: "ScrollOfTheHeroOfCinderCity",
    name: "Свиток героя сожжённого города",
    rarity: 5,
    twoPc: { key: "enerRech_", value: 20 },
  },
  ShimenawasReminiscence: {
    key: "ShimenawasReminiscence",
    name: "Воспоминания Симэнавы",
    rarity: 5,
    twoPc: { key: "atk_", value: 18 },
  },
  SilkenMoonsSerenade: {
    key: "SilkenMoonsSerenade",
    name: "Серенада шёлковой луны",
    rarity: 5,
    twoPc: { key: "enerRech_", value: 20 },
  },
  SongOfDaysPast: {
    key: "SongOfDaysPast",
    name: "Песнь былых времён",
    rarity: 5,
    twoPc: { key: "heal_", value: 15 },
  },
  TenacityOfTheMillelith: {
    key: "TenacityOfTheMillelith",
    name: "Стойкость Миллелита",
    rarity: 5,
    twoPc: { key: "hp_", value: 20 },
  },
  TheExile: {
    key: "TheExile",
    name: "Изгнанник",
    rarity: 4,
    twoPc: { key: "enerRech_", value: 20 },
  },
  ThunderingFury: {
    key: "ThunderingFury",
    name: "Громогласный рёв ярости",
    rarity: 5,
    twoPc: { key: "electro_dmg_", value: 15 },
  },
  Thundersoother: {
    key: "Thundersoother",
    name: "Усмиряющий гром",
    rarity: 5,
  },
  TinyMiracle: {
    key: "TinyMiracle",
    name: "Маленькое чудо",
    rarity: 4,
  },
  TravelingDoctor: {
    key: "TravelingDoctor",
    name: "Целитель",
    rarity: 3,
  },
  UnfinishedReverie: {
    key: "UnfinishedReverie",
    name: "Незаконченные грёзы",
    rarity: 5,
    twoPc: { key: "atk_", value: 18 },
  },
  VermillionHereafter: {
    key: "VermillionHereafter",
    name: "Киноварное загробье",
    rarity: 5,
    twoPc: { key: "atk_", value: 18 },
  },
  ViridescentVenerer: {
    key: "ViridescentVenerer",
    name: "Изумрудная тень",
    rarity: 5,
    twoPc: { key: "anemo_dmg_", value: 15 },
  },
  VourukashasGlow: {
    key: "VourukashasGlow",
    name: "Сияние Вурукаши",
    rarity: 5,
    twoPc: { key: "hp_", value: 20 },
  },
  WanderersTroupe: {
    key: "WanderersTroupe",
    name: "Странствующий ансамбль",
    rarity: 5,
    twoPc: { key: "eleMas", value: 80 },
  },
  Whimsy: {
    key: "Whimsy",
    name: "Фрагмент гармонической фантазии",
    rarity: 5,
    twoPc: { key: "atk_", value: 18 },
  },
};

/** @deprecated Prefer SETS[key]?.twoPc */
export const TWO_PC_STATS: Record<string, TwoPcBonus> = Object.fromEntries(
  Object.values(SETS)
    .filter((s): s is SetInfo & { twoPc: TwoPcBonus } => !!s.twoPc)
    .map((s) => [s.key, s.twoPc]),
);

export function setName(key: string) {
  return SETS[key]?.name ?? key;
}
