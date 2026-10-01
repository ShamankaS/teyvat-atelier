import type { StatKey, TalentKey } from "@/lib/good/types";

export interface WeaponRank {
  key: string;
  /** Team DPS относительно BiS R1 в указанной пачке. 100 = лучшее. */
  relative: number;
  notes: string;
}

export interface SetRank {
  id: string;
  pieces: { set: string; count: 2 | 4 }[];
  relative: number;
  notes: string;
}

export interface StatCap {
  key: StatKey;
  target: number;
  softCap?: number;
  priority: "mandatory" | "recommended" | "luxury";
  why: string;
}

export interface CharacterGuide {
  key: string;
  role: string;
  scenario: string;
  team: string;
  sources: string[];
  talentPriority: TalentKey[];
  recommendedLevel: number;
  recommendedTalents: { auto: number; skill: number; burst: number };
  weapons: WeaponRank[];
  sets: SetRank[];
  mainstats: {
    sands: StatKey[];
    goblet: StatKey[];
    circlet: StatKey[];
  };
  caps: StatCap[];
  notes: string;
}

/**
 * Относительная эффективность оружия и сетов собрана как типичный
 * team DPS vs BiS R1 в указанной пачке (не соло-DPS).
 * Источники: KQM, TCL, популярные кальки сообщества 2024–2025.
 * Это не живой симулятор — проценты округлены до 1%.
 */
export const GUIDES: Record<string, CharacterGuide> = {
  HuTao: {
    key: "HuTao",
    role: "Он-филд ДПС (пар)",
    scenario: "Ху Тао / Е Лань / Син Цю / Чжун Ли, C0, R1 сигнатурки",
    team: "Двойной гидро пар",
    sources: ["KQM Hu Tao", "TCL weapon sheets", "community vape calcs"],
    talentPriority: ["skill", "auto", "burst"],
    recommendedLevel: 90,
    recommendedTalents: { auto: 9, skill: 9, burst: 6 },
    weapons: [
      { key: "StaffOfHoma", relative: 100, notes: "BiS. HP-конверт + крит. урон." },
      { key: "StaffOfTheScarletSands", relative: 99, notes: "Почти паритет при высоком МС, хуже на низком HP." },
      { key: "DragonBane", relative: 96, notes: "R5 в паре — лучший 4★. R1 ≈ 90%." },
      { key: "BalladOfTheFjords", relative: 94, notes: "Боевой пропуск. Нужны 3 стихии в пачке." },
      { key: "Deathmatch", relative: 93, notes: "Стабильный крит. шанс, чуть ниже паровой Грозы." },
      { key: "LithicSpear", relative: 91, notes: "Сильна в лиюэ-пачках (R5 + стаки)." },
      { key: "BlackcliffPole", relative: 88, notes: "Крит. урон, но без пассивного парения." },
      { key: "WhiteTassel", relative: 85, notes: "Лучший 3★. Крит. шанс + обычные атаки." },
      { key: "MissiveWindspear", relative: 84, notes: "Ивентовое, ATK/EM после реакции." },
      { key: "KitainCrossSpear", relative: 80, notes: "Переходный вариант, энергия для ульты." },
      { key: "FavoniusLance", relative: 74, notes: "Для комфорта пачки, минус личный урон." },
    ],
    sets: [
      {
        id: "mh4-furina",
        pieces: [{ set: "MarechausseeHunter", count: 4 }],
        relative: 103,
        notes: "Если в пачке Фурина — фактически новый BiS за счёт крит. шанса.",
      },
      {
        id: "cw4",
        pieces: [{ set: "CrimsonWitchOfFlames", count: 4 }],
        relative: 100,
        notes: "Классический BiS без Фурины. Пар + пиро бонус.",
      },
      {
        id: "shim4",
        pieces: [{ set: "ShimenawasReminiscence", count: 4 }],
        relative: 99,
        notes: "Почти паритет, но режет ульту. Удобно фармить.",
      },
      {
        id: "cw2-shim2",
        pieces: [
          { set: "CrimsonWitchOfFlames", count: 2 },
          { set: "ShimenawasReminiscence", count: 2 },
        ],
        relative: 95,
        notes: "Сильный 2+2, пока нет 4pc.",
      },
      {
        id: "gilded4",
        pieces: [{ set: "GildedDreams", count: 4 }],
        relative: 94,
        notes: "МС-сборка в паре, чуть ниже классики.",
      },
      {
        id: "cw2-wanderer2",
        pieces: [
          { set: "CrimsonWitchOfFlames", count: 2 },
          { set: "WanderersTroupe", count: 2 },
        ],
        relative: 93,
        notes: "Пиро + МС, переходный сет.",
      },
    ],
    mainstats: {
      sands: ["hp_", "eleMas"],
      goblet: ["pyro_dmg_"],
      circlet: ["critRate_", "critDMG_"],
    },
    caps: [
      {
        key: "critRate_",
        target: 70,
        softCap: 85,
        priority: "mandatory",
        why: "Баланс 1:2 с крит. уроном. С Хомой цель ближе к 60–70%.",
      },
      {
        key: "critDMG_",
        target: 180,
        softCap: 250,
        priority: "recommended",
        why: "Основной множитель ударов в окне навыка.",
      },
      {
        key: "hp",
        target: 30000,
        softCap: 35000,
        priority: "mandatory",
        why: "Конверт навыка от HP. Ниже 30к — заметная просадка.",
      },
      {
        key: "eleMas",
        target: 100,
        softCap: 300,
        priority: "recommended",
        why: "Пар масштабируется от МС. 100–250 — рабочий диапазон.",
      },
      {
        key: "enerRech_",
        target: 110,
        softCap: 130,
        priority: "recommended",
        why: "Ульта не ядро урона, но нужна для пиро-ауры и лечения.",
      },
    ],
    notes: "Играйте ниже 50% HP. Песок HP% обычно лучше ATK%. Ульту не обязательно качать выше 6.",
  },
  RaidenShogun: {
    key: "RaidenShogun",
    role: "Гиперкерри / батарейка",
    scenario: "Рационал: Райдэн / Сян Лин / Беннет / Син Цю",
    team: "Рационал",
    sources: ["KQM Raiden", "TCL Rational sheets"],
    talentPriority: ["burst", "auto", "skill"],
    recommendedLevel: 90,
    recommendedTalents: { auto: 8, skill: 8, burst: 10 },
    weapons: [
      { key: "EngulfingLightning", relative: 100, notes: "BiS. VE → ATK + энергия." },
      { key: "TheCatch", relative: 94, notes: "Лучший F2P. R5 почти догоняет сигнатурку." },
      { key: "StaffOfHoma", relative: 93, notes: "Сильна как стат-стик, без энергии." },
      { key: "StaffOfTheScarletSands", relative: 92, notes: "Крит + МС, в рационале чуть ниже Улова." },
      { key: "WavebreakersFin", relative: 91, notes: "R5 при дорогих ультах пачки." },
      { key: "Deathmatch", relative: 88, notes: "Крит. шанс, средняя энергия." },
      { key: "KitainCrossSpear", relative: 84, notes: "Переходный, энергия навыка." },
      { key: "FavoniusLance", relative: 80, notes: "На батарейку пачки, минус личный урон." },
    ],
    sets: [
      {
        id: "emblem4",
        pieces: [{ set: "EmblemOfSeveredFate", count: 4 }],
        relative: 100,
        notes: "Единственный полноценный BiS: VE конвертится в урон ульты.",
      },
      {
        id: "emblem2-atk2",
        pieces: [
          { set: "EmblemOfSeveredFate", count: 2 },
          { set: "ShimenawasReminiscence", count: 2 },
        ],
        relative: 89,
        notes: "Пока нет 4pc Эмблемы.",
      },
      {
        id: "tf4",
        pieces: [{ set: "ThunderingFury", count: 4 }],
        relative: 86,
        notes: "Гиперблоссом/аггравация, не рационал.",
      },
    ],
    mainstats: {
      sands: ["enerRech_", "atk_"],
      goblet: ["electro_dmg_", "atk_"],
      circlet: ["critRate_", "critDMG_"],
    },
    caps: [
      {
        key: "enerRech_",
        target: 250,
        softCap: 280,
        priority: "mandatory",
        why: "С Эмблемой 4pc VE — и урон, и батарея. Ниже 220% ротация сыпется.",
      },
      {
        key: "critRate_",
        target: 70,
        softCap: 80,
        priority: "mandatory",
        why: "Ульта — пачка ударов, крит. шанс критичен.",
      },
      {
        key: "critDMG_",
        target: 140,
        softCap: 180,
        priority: "recommended",
        why: "Держите 1:2 к шансу.",
      },
      {
        key: "atk",
        target: 2000,
        softCap: 2500,
        priority: "recommended",
        why: "База урона ульты. С Сияющей жатвой набирается из VE.",
      },
    ],
    notes: "Корона в ульту окупается. «Улов» R5 — редкий случай, когда 4★ близко к 5★.",
  },
  Nahida: {
    key: "Nahida",
    role: "Дендро-апплай / офф-филд ДПС",
    scenario: "Распространение / гиперблоссом, C0",
    team: "Спред / гиперблоссом",
    sources: ["KQM Nahida", "TCL EM sheets"],
    talentPriority: ["skill", "burst", "auto"],
    recommendedLevel: 90,
    recommendedTalents: { auto: 1, skill: 9, burst: 6 },
    weapons: [
      { key: "AThousandFloatingDreams", relative: 100, notes: "BiS. МС пачке + личный урон." },
      { key: "SacrificialFragments", relative: 95, notes: "R5 аптайм навыка + МС. Лучший 4★." },
      { key: "WanderingEvenstar", relative: 93, notes: "Бафф ATK пачке, чуть меньше личного." },
      { key: "MagicGuide", relative: 90, notes: "Лучший 3★ против гидро/электро целей." },
      { key: "TheWidsith", relative: 88, notes: "Сильный стат-стик, рандомный бафф." },
      { key: "KagurasVerity", relative: 92, notes: "Крит. урон, если навык успевает стакаться." },
    ],
    sets: [
      {
        id: "deepwood4",
        pieces: [{ set: "DeepwoodMemories", count: 4 }],
        relative: 100,
        notes: "Если никто другой не носит Deepwood — обязательный сет пачки.",
      },
      {
        id: "gilded4",
        pieces: [{ set: "GildedDreams", count: 4 }],
        relative: 108,
        notes: "Личный урон выше, если Deepwood уже на саппорте.",
      },
      {
        id: "paradise4",
        pieces: [{ set: "FlowerOfParadiseLost", count: 4 }],
        relative: 102,
        notes: "Гиперблоссом, если Нахида триггерит зерна.",
      },
      {
        id: "deepwood2-em2",
        pieces: [
          { set: "DeepwoodMemories", count: 2 },
          { set: "GildedDreams", count: 2 },
        ],
        relative: 92,
        notes: "Переходный 2+2.",
      },
    ],
    mainstats: {
      sands: ["eleMas"],
      goblet: ["eleMas", "dendro_dmg_"],
      circlet: ["eleMas", "critRate_", "critDMG_"],
    },
    caps: [
      {
        key: "eleMas",
        target: 900,
        softCap: 1000,
        priority: "mandatory",
        why: "Ульта шарит до 250 МС. Личный спред растёт до ~1000.",
      },
      {
        key: "critRate_",
        target: 50,
        softCap: 70,
        priority: "recommended",
        why: "На тройном МС-круге криты вторичны. На крит-круге цель 70/140.",
      },
      {
        key: "enerRech_",
        target: 120,
        softCap: 140,
        priority: "recommended",
        why: "Навык дешёвый, ульта для шаринга МС.",
      },
    ],
    notes: "Сначала наденьте Deepwood на кого-то в пачке. Обычные атаки почти не качают.",
  },
  Furina: {
    key: "Furina",
    role: "Буфер / офф-филд ДПС",
    scenario: "Универсальный саб-ДПС с фанатской аурой",
    team: "Любая пачка с лечением",
    sources: ["KQM Furina", "community fanfare sheets"],
    talentPriority: ["burst", "skill", "auto"],
    recommendedLevel: 90,
    recommendedTalents: { auto: 1, skill: 9, burst: 9 },
    weapons: [
      { key: "SplendorOfTranquilWaters", relative: 100, notes: "BiS. HP + крит. урон под её механику." },
      { key: "PrimordialJadeCutter", relative: 97, notes: "HP→ATK не нужен, но крит. шанс и база отличны." },
      { key: "FavoniusSword", relative: 93, notes: "Лучший саппорт-вариант: энергия пачке." },
      { key: "FleuveCendreFerryman", relative: 92, notes: "Рыбалка. VE + крит навыка. Отличный F2P." },
      { key: "WolfFang", relative: 91, notes: "Боевой пропуск, криты навыка/ульты." },
      { key: "HarbingerOfDawn", relative: 86, notes: "3★ криты, если HP не падает ниже 90% (редко на Фурине)." },
    ],
    sets: [
      {
        id: "gt4",
        pieces: [{ set: "GoldenTroupe", count: 4 }],
        relative: 100,
        notes: "BiS офф-филд. Навык — основной урон.",
      },
      {
        id: "gt2-hydro2",
        pieces: [
          { set: "GoldenTroupe", count: 2 },
          { set: "HeartOfDepth", count: 2 },
        ],
        relative: 90,
        notes: "Пока нет 4pc.",
      },
      {
        id: "tenacity4",
        pieces: [{ set: "TenacityOfTheMillelith", count: 4 }],
        relative: 84,
        notes: "Если нужен ATK-бафф пачке, а не личный урон.",
      },
    ],
    mainstats: {
      sands: ["hp_", "enerRech_"],
      goblet: ["hp_", "hydro_dmg_"],
      circlet: ["critRate_", "critDMG_", "hp_"],
    },
    caps: [
      {
        key: "enerRech_",
        target: 180,
        softCap: 220,
        priority: "mandatory",
        why: "Ульта 60/80 энергии. Без VE нет фанатского баффа.",
      },
      {
        key: "hp",
        target: 35000,
        softCap: 40000,
        priority: "mandatory",
        why: "Скалькировка навыка и ульты от HP.",
      },
      {
        key: "critRate_",
        target: 60,
        softCap: 80,
        priority: "recommended",
        why: "Офф-филд удары салонов/певцов.",
      },
      {
        key: "critDMG_",
        target: 140,
        softCap: 200,
        priority: "recommended",
        why: "С сигнатуркой легко набрать 180+.",
      },
    ],
    notes: "В пачке обязательно лечение, иначе фанаты не копятся. Корона в ульту — бафф пачке.",
  },
  Neuvillette: {
    key: "Neuvillette",
    role: "Он-филд чард-ДПС",
    scenario: "Гиперкерри с реакциями / Фурина",
    team: "Гиперкерри / тройной гидро",
    sources: ["KQM Neuvillette", "charged-atk sheets"],
    talentPriority: ["auto", "burst", "skill"],
    recommendedLevel: 90,
    recommendedTalents: { auto: 10, skill: 6, burst: 8 },
    weapons: [
      { key: "TomeOfTheEternalFlow", relative: 100, notes: "BiS. Крит. урон + стаки чард-атак." },
      { key: "SacrificialJade", relative: 94, notes: "Боевой пропуск. HP + крит. Лучший 4★." },
      { key: "PrototypeAmber", relative: 90, notes: "Крафт. HP, энергия, лечение — комфорт пачки." },
      { key: "TheWidsith", relative: 88, notes: "Крит. урон, рандомный бафф." },
      { key: "SacrificialFragments", relative: 82, notes: "МС полезен только в реакциях, не в гиперкерри." },
    ],
    sets: [
      {
        id: "mh4",
        pieces: [{ set: "MarechausseeHunter", count: 4 }],
        relative: 100,
        notes: "BiS. HP-дренаж зарядов сам стакает крит. шанс.",
      },
      {
        id: "whimsy4",
        pieces: [{ set: "FragmentOfHarmonicWhimsy", count: 4 }],
        relative: 97,
        notes: "Чуть ниже MH, но не требует HP-изменений.",
      },
      {
        id: "hod4",
        pieces: [{ set: "HeartOfDepth", count: 4 }],
        relative: 91,
        notes: "Старый сет чард-атак.",
      },
    ],
    mainstats: {
      sands: ["hp_"],
      goblet: ["hydro_dmg_", "hp_"],
      circlet: ["critDMG_", "critRate_"],
    },
    caps: [
      {
        key: "hp",
        target: 40000,
        softCap: 45000,
        priority: "mandatory",
        why: "Весь урон от HP. 40к — рабочий минимум на 90 lvl.",
      },
      {
        key: "critRate_",
        target: 40,
        softCap: 64,
        priority: "mandatory",
        why: "MH 4pc даёт до 36% крит. шанса. В профиль достаточно ~40%.",
      },
      {
        key: "critDMG_",
        target: 200,
        softCap: 280,
        priority: "recommended",
        why: "Основной стат круга и оружия.",
      },
      {
        key: "enerRech_",
        target: 110,
        softCap: 140,
        priority: "recommended",
        why: "С Янтарём можно ниже. Без него ~130% комфортнее.",
      },
    ],
    notes: "Корона в обычные (заряды). Гидро-кубок обычно лучше HP-кубка на 3–6%.",
  },
  Arlecchino: {
    key: "Arlecchino",
    role: "Он-филд ДПС (обычные атаки)",
    scenario: "Пар / моно-пиро, C0",
    team: "Пар с Иань / моно-пиро",
    sources: ["KQM Arlecchino", "NA pyro sheets"],
    talentPriority: ["auto", "skill", "burst"],
    recommendedLevel: 90,
    recommendedTalents: { auto: 10, skill: 8, burst: 6 },
    weapons: [
      { key: "CrimsonMoonsSemblance", relative: 100, notes: "Сигнатурка. Bond of Life → урон." },
      { key: "StaffOfHoma", relative: 96, notes: "Ближайшая чужая сигнатурка." },
      { key: "PrimordialJadeWingedSpear", relative: 94, notes: "Крит + стаки ATK." },
      { key: "StaffOfTheScarletSands", relative: 93, notes: "В паре почти Хома." },
      { key: "WhiteTassel", relative: 88, notes: "Лучший 3★, обычные атаки." },
      { key: "Deathmatch", relative: 90, notes: "Стабильный 4★." },
      { key: "BalladOfTheFjords", relative: 91, notes: "В пачке из 3 стихий." },
      { key: "DragonBane", relative: 89, notes: "R5 только в паре." },
    ],
    sets: [
      {
        id: "whimsy4",
        pieces: [{ set: "FragmentOfHarmonicWhimsy", count: 4 }],
        relative: 100,
        notes: "BiS под Bond of Life.",
      },
      {
        id: "glad4",
        pieces: [{ set: "GladiatorsFinale", count: 4 }],
        relative: 94,
        notes: "Сильный универсальный 4pc на обычные.",
      },
      {
        id: "shim4",
        pieces: [{ set: "ShimenawasReminiscence", count: 4 }],
        relative: 93,
        notes: "Обычные, но режет ульту.",
      },
      {
        id: "cw4",
        pieces: [{ set: "CrimsonWitchOfFlames", count: 4 }],
        relative: 92,
        notes: "В паре. Без парения ниже.",
      },
    ],
    mainstats: {
      sands: ["atk_"],
      goblet: ["pyro_dmg_"],
      circlet: ["critRate_", "critDMG_"],
    },
    caps: [
      {
        key: "atk",
        target: 2000,
        softCap: 2400,
        priority: "mandatory",
        why: "Скалькировка обычных атак от ATK, не от HP.",
      },
      {
        key: "critRate_",
        target: 75,
        softCap: 85,
        priority: "mandatory",
        why: "Многохитовый он-филд.",
      },
      {
        key: "critDMG_",
        target: 160,
        softCap: 220,
        priority: "recommended",
        why: "1:2 к шансу.",
      },
      {
        key: "enerRech_",
        target: 110,
        softCap: 130,
        priority: "recommended",
        why: "Ульта для лечения/перезарядки BoL, не ядро урона.",
      },
    ],
    notes: "Не лечитесь аптечкой во время окна — Bond of Life это ресурс урона.",
  },
  Yelan: {
    key: "Yelan",
    role: "Офф-филд гидро ДПС / батарейка",
    scenario: "Пар-пачки, C0",
    team: "Двойной гидро / Ху Тао / Рационал",
    sources: ["KQM Yelan"],
    talentPriority: ["burst", "skill", "auto"],
    recommendedLevel: 90,
    recommendedTalents: { auto: 1, skill: 8, burst: 9 },
    weapons: [
      { key: "AquaSimulacra", relative: 100, notes: "BiS. HP + крит. урон." },
      { key: "ElegyForTheEnd", relative: 96, notes: "Командный бафф, чуть меньше личного." },
      { key: "FavoniusWarbow", relative: 92, notes: "Лучший саппорт F2P: энергия ей и пачке." },
      { key: "TheStringless", relative: 90, notes: "Навык/ульта. Сильна с реакциями." },
      { key: "SacrificialBow", relative: 88, notes: "Двойной навык — батарея и частицы." },
      { key: "Slingshot", relative: 84, notes: "3★ крит. шанс, если бьёте вблизи." },
      { key: "FadingTwilight", relative: 86, notes: "Ивент, VE и урон." },
    ],
    sets: [
      {
        id: "emblem4",
        pieces: [{ set: "EmblemOfSeveredFate", count: 4 }],
        relative: 100,
        notes: "BiS. Ульта масштабируется от VE.",
      },
      {
        id: "gt4",
        pieces: [{ set: "GoldenTroupe", count: 4 }],
        relative: 93,
        notes: "Если упор в навык (редкая сборка).",
      },
      {
        id: "noblesse4",
        pieces: [{ set: "NoblesseOblige", count: 4 }],
        relative: 90,
        notes: "Бафф пачке, если никто другой не носит.",
      },
    ],
    mainstats: {
      sands: ["hp_", "enerRech_"],
      goblet: ["hydro_dmg_"],
      circlet: ["critRate_", "critDMG_"],
    },
    caps: [
      {
        key: "enerRech_",
        target: 180,
        softCap: 220,
        priority: "mandatory",
        why: "Без второго гидро цель ближе к 200–220%. С Син Цю — 160–180%.",
      },
      {
        key: "hp",
        target: 30000,
        softCap: 35000,
        priority: "mandatory",
        why: "Ульта от HP.",
      },
      {
        key: "critRate_",
        target: 70,
        softCap: 80,
        priority: "mandatory",
        why: "Многохитовая ульта.",
      },
      {
        key: "critDMG_",
        target: 140,
        softCap: 200,
        priority: "recommended",
        why: "С Аква симулякрум легко 200+.",
      },
    ],
    notes: "Фавоний часто даёт пачке больше, чем лишние 8% личного DPS.",
  },
  Xiangling: {
    key: "Xiangling",
    role: "Офф-филд пиро ДПС",
    scenario: "Рационал / вэйп / расплав",
    team: "Рационал / национал",
    sources: ["KQM Xiangling", "Rational ER calcs"],
    talentPriority: ["burst", "skill", "auto"],
    recommendedLevel: 90,
    recommendedTalents: { auto: 1, skill: 8, burst: 10 },
    weapons: [
      { key: "TheCatch", relative: 100, notes: "Фактический BiS F2P и часто лучше чужих 5★." },
      { key: "EngulfingLightning", relative: 99, notes: "Чуть выше личного, но «Улов» обычно на ней." },
      { key: "StaffOfHoma", relative: 96, notes: "Стат-стик без энергии." },
      { key: "DragonBane", relative: 95, notes: "R5 в паре. R1 заметно слабее." },
      { key: "WavebreakersFin", relative: 97, notes: "R5 в дорогих ультах рационала." },
      { key: "KitainCrossSpear", relative: 88, notes: "Энергия навыка, переходный." },
      { key: "FavoniusLance", relative: 86, notes: "Если VE не набирается." },
    ],
    sets: [
      {
        id: "emblem4",
        pieces: [{ set: "EmblemOfSeveredFate", count: 4 }],
        relative: 100,
        notes: "BiS почти во всех пачках.",
      },
      {
        id: "cw4",
        pieces: [{ set: "CrimsonWitchOfFlames", count: 4 }],
        relative: 96,
        notes: "В паре, если VE уже избыток.",
      },
      {
        id: "crimson2-emblem2",
        pieces: [
          { set: "CrimsonWitchOfFlames", count: 2 },
          { set: "EmblemOfSeveredFate", count: 2 },
        ],
        relative: 90,
        notes: "Переходный 2+2.",
      },
    ],
    mainstats: {
      sands: ["enerRech_", "atk_", "eleMas"],
      goblet: ["pyro_dmg_"],
      circlet: ["critRate_", "critDMG_"],
    },
    caps: [
      {
        key: "enerRech_",
        target: 200,
        softCap: 240,
        priority: "mandatory",
        why: "Ульта 80 энергии. В рационале 180–210%, без Райдэн 220–240%.",
      },
      {
        key: "critRate_",
        target: 70,
        softCap: 80,
        priority: "mandatory",
        why: "Гуоба крутится долго — криты обязательны.",
      },
      {
        key: "eleMas",
        target: 100,
        softCap: 220,
        priority: "recommended",
        why: "Пар/расплав. Не в ущерб VE и критам.",
      },
      {
        key: "atk",
        target: 1600,
        softCap: 2000,
        priority: "recommended",
        why: "С Беннетом ATK закрывается баффом — приоритет VE/криты.",
      },
    ],
    notes: "Корона в ульту. «Улов» почти всегда надевайте на Сян Лин, а не на Райдэн, если одно на двоих.",
  },
  Bennett: {
    key: "Bennett",
    role: "Буфер / хилер / батарея",
    scenario: "Универсальный саппорт, C1+ предпочтительно",
    team: "Любая ATK-пачка",
    sources: ["KQM Bennett"],
    talentPriority: ["burst", "skill", "auto"],
    recommendedLevel: 90,
    recommendedTalents: { auto: 1, skill: 6, burst: 9 },
    weapons: [
      { key: "MistsplitterReforged", relative: 100, notes: "Максимальная база ATK → максимальный бафф круга." },
      { key: "AquilaFavonia", relative: 99, notes: "Высокая база. Aquila нет в каталоге как приоритет крафта." },
      { key: "SapwoodBlade", relative: 96, notes: "Высокая база + VE + дендро-осколок. Лучший крафт." },
      { key: "FavoniusSword", relative: 94, notes: "Батарея пачки, чуть ниже база баффа." },
      { key: "PrototypeRancour", relative: 82, notes: "Физ. кубок на оружии бесполезен. Только как высокая база." },
      { key: "HarbingerOfDawn", relative: 78, notes: "Низкая база — слабый бафф круга." },
    ],
    sets: [
      {
        id: "noblesse4",
        pieces: [{ set: "NoblesseOblige", count: 4 }],
        relative: 100,
        notes: "Стандарт. ATK пачке после ульты.",
      },
      {
        id: "instructor4",
        pieces: [{ set: "Instructor", count: 4 }],
        relative: 98,
        notes: "В реакционных пачках (пар/расплав) часто лучше Ноblesse.",
      },
      {
        id: "scroll4",
        pieces: [{ set: "ScrollOfTheHeroOfCinderCity", count: 4 }],
        relative: 102,
        notes: "Натланские пачки: рес-шард элементальный урон.",
      },
    ],
    mainstats: {
      sands: ["enerRech_"],
      goblet: ["hp_", "pyro_dmg_"],
      circlet: ["hp_", "heal_", "critRate_"],
    },
    caps: [
      {
        key: "enerRech_",
        target: 200,
        softCap: 260,
        priority: "mandatory",
        why: "Круг должен быть доступен каждый ротейшн. 180% с Фавонием, 220%+ без.",
      },
      {
        key: "hp",
        target: 25000,
        softCap: 35000,
        priority: "recommended",
        why: "Лечение от HP. Бафф круга зависит от БАЗОВОЙ атаки, не от HP.",
      },
      {
        key: "critRate_",
        target: 30,
        softCap: 60,
        priority: "recommended",
        why: "Если меч Фавония — крит. шанс обязателен для проков.",
      },
    ],
    notes: "Бафф круга = базовая атака персонажа + базовая атака оружия. Артефактный ATK% круг не усиливает.",
  },
  Xingqiu: {
    key: "Xingqiu",
    role: "Офф-филд гидро / сопротивление прерыванию",
    scenario: "Национал / пар",
    team: "Национал / Ху Тао",
    sources: ["KQM Xingqiu"],
    talentPriority: ["burst", "skill", "auto"],
    recommendedLevel: 90,
    recommendedTalents: { auto: 1, skill: 8, burst: 9 },
    weapons: [
      { key: "SacrificialSword", relative: 100, notes: "BiS комфорт: второй навык = энергия и аптайм." },
      { key: "FavoniusSword", relative: 96, notes: "Батарея пачке." },
      { key: "PrimordialJadeCutter", relative: 98, notes: "Личный урон выше, энергия хуже Церemonial." },
      { key: "FleuveCendreFerryman", relative: 93, notes: "VE и крит навыка." },
      { key: "IronSting", relative: 88, notes: "МС для парения, без энергии." },
    ],
    sets: [
      {
        id: "emblem4",
        pieces: [{ set: "EmblemOfSeveredFate", count: 4 }],
        relative: 100,
        notes: "BiS урона ульты.",
      },
      {
        id: "noblesse4",
        pieces: [{ set: "NoblesseOblige", count: 4 }],
        relative: 92,
        notes: "Если бафф пачке важнее мечей.",
      },
      {
        id: "hod2-noblesse2",
        pieces: [
          { set: "HeartOfDepth", count: 2 },
          { set: "NoblesseOblige", count: 2 },
        ],
        relative: 90,
        notes: "Переходный.",
      },
    ],
    mainstats: {
      sands: ["enerRech_", "atk_"],
      goblet: ["hydro_dmg_"],
      circlet: ["critRate_", "critDMG_"],
    },
    caps: [
      {
        key: "enerRech_",
        target: 180,
        softCap: 220,
        priority: "mandatory",
        why: "C6 и Церemonial снижают потребность. Без них 200%+.",
      },
      {
        key: "critRate_",
        target: 60,
        softCap: 75,
        priority: "recommended",
        why: "Мечи бьют часто.",
      },
      {
        key: "atk",
        target: 1500,
        softCap: 2000,
        priority: "recommended",
        why: "Скалькировка мечей от ATK.",
      },
    ],
    notes: "C6 сильно меняет ценность. На C0 энергия важнее критов.",
  },
  Zhongli: {
    key: "Zhongli",
    role: "Щит / шейвер / универсальный саппорт",
    scenario: "Щитовой комфорт, C0",
    team: "Любая пачка, где нужен щит",
    sources: ["KQM Zhongli"],
    talentPriority: ["skill", "burst", "auto"],
    recommendedLevel: 90,
    recommendedTalents: { auto: 1, skill: 9, burst: 8 },
    weapons: [
      { key: "BlackTassel", relative: 100, notes: "3★ HP%. Лучший щит за звёзды." },
      { key: "FavoniusLance", relative: 98, notes: "Энергия пачке, щит чуть тоньше." },
      { key: "StaffOfHoma", relative: 96, notes: "Избыток, если не хотите личный урон." },
      { key: "RightfulReward", relative: 94, notes: "HP% на копье, крафт Фонтейна." },
      { key: "VortexVanquisher", relative: 90, notes: "Сигнатурка слабее как щит, чем Белая кисть HP." },
    ],
    sets: [
      {
        id: "tenacity4",
        pieces: [{ set: "TenacityOfTheMillelith", count: 4 }],
        relative: 100,
        notes: "HP + ATK пачке, пока столб стоит.",
      },
      {
        id: "petra4",
        pieces: [{ set: "ArchaicPetra", count: 4 }],
        relative: 97,
        notes: "Если кристаллизуете нужный элемент — сильный командный сет.",
      },
      {
        id: "hp2-hp2",
        pieces: [
          { set: "TenacityOfTheMillelith", count: 2 },
          { set: "VourukashasGlow", count: 2 },
        ],
        relative: 95,
        notes: "Толстый щит без командного баффа.",
      },
    ],
    mainstats: {
      sands: ["hp_"],
      goblet: ["hp_"],
      circlet: ["hp_"],
    },
    caps: [
      {
        key: "hp",
        target: 40000,
        softCap: 50000,
        priority: "mandatory",
        why: "Прочность щита от HP. 40к — рабочий щит бездны, 50к — комфорт.",
      },
      {
        key: "enerRech_",
        target: 110,
        softCap: 140,
        priority: "recommended",
        why: "Ульта необязательна каждый ротейшн на чистом щите.",
      },
    ],
    notes: "Black Tassel нет в GOOD как BlackTassel — добавим алиас. Для урона — Хома + криты, это другая сборка (~щит −15%).",
  },
  KaedeharaKazuha: {
    key: "KaedeharaKazuha",
    role: "Группировка / VV / EM-бафф",
    scenario: "Элементальный саппорт C0",
    team: "Почти любая элементальная пачка",
    sources: ["KQM Kazuha"],
    talentPriority: ["skill", "burst", "auto"],
    recommendedLevel: 90,
    recommendedTalents: { auto: 6, skill: 9, burst: 9 },
    weapons: [
      { key: "FreedomSworn", relative: 100, notes: "BiS саппорт: МС + бафф пачке." },
      { key: "XiphosMoonlight", relative: 96, notes: "МС и VE пачке. Отличный 4★." },
      { key: "IronSting", relative: 95, notes: "Крафт МС. Рабочая лошадка." },
      { key: "TheAlleyFlash", relative: 94, notes: "МС, если не теряете пассивку." },
      { key: "FavoniusSword", relative: 92, notes: "Энергия важнее личного урона в саппорт-сборке." },
      { key: "SacrificialSword", relative: 90, notes: "Двойной навык для группировки." },
    ],
    sets: [
      {
        id: "vv4",
        pieces: [{ set: "ViridescentVenerer", count: 4 }],
        relative: 100,
        notes: "Обязательный сет. Шред сопротивления незаменим.",
      },
    ],
    mainstats: {
      sands: ["eleMas", "enerRech_"],
      goblet: ["eleMas"],
      circlet: ["eleMas"],
    },
    caps: [
      {
        key: "eleMas",
        target: 800,
        softCap: 1000,
        priority: "mandatory",
        why: "А4 бафает элементальный урон пачки от МС. 800+ — рабочая цель.",
      },
      {
        key: "enerRech_",
        target: 160,
        softCap: 190,
        priority: "mandatory",
        why: "Ульта для группировки и аптайма VV.",
      },
    ],
    notes: "Не собирайте крит-Кадзуху в саппорт-пачке: −бафф пачке сильно бьёт по team DPS.",
  },
  Mavuika: {
    key: "Mavuika",
    role: "Он-филд / офф-филд пиро ДПС",
    scenario: "Натланский керри, C0",
    team: "Натлан + расплав/пар",
    sources: ["community Mavuika sheets 5.x"],
    talentPriority: ["burst", "auto", "skill"],
    recommendedLevel: 90,
    recommendedTalents: { auto: 9, skill: 8, burst: 9 },
    weapons: [
      { key: "AThousandBlazingSuns", relative: 100, notes: "Сигнатурка." },
      { key: "BeaconOfTheReedSea", relative: 94, notes: "Крит. шанс, высокая база." },
      { key: "SerpentSpine", relative: 93, notes: "Боевой пропуск — лучший 4★." },
      { key: "WolfsGravestone", relative: 92, notes: "ATK пачке и себе." },
      { key: "EarthShaker", relative: 88, notes: "Натланский крафт, пиро-пассивка." },
    ],
    sets: [
      {
        id: "obsidian4",
        pieces: [{ set: "ObsidianCodex", count: 4 }],
        relative: 100,
        notes: "BiS натланца: крит. шанс в ночном духе.",
      },
      {
        id: "cw4",
        pieces: [{ set: "CrimsonWitchOfFlames", count: 4 }],
        relative: 90,
        notes: "Вне Натлана / без ночного духа.",
      },
      {
        id: "scroll4",
        pieces: [{ set: "ScrollOfTheHeroOfCinderCity", count: 4 }],
        relative: 86,
        notes: "Саппорт-сборка, не керри.",
      },
    ],
    mainstats: {
      sands: ["atk_"],
      goblet: ["pyro_dmg_"],
      circlet: ["critDMG_", "critRate_"],
    },
    caps: [
      {
        key: "critRate_",
        target: 40,
        softCap: 70,
        priority: "mandatory",
        why: "Кодекс 4pc даёт 40% крит. шанса в бою. В профиле достаточно ~40–50%.",
      },
      {
        key: "critDMG_",
        target: 200,
        softCap: 260,
        priority: "recommended",
        why: "Основной стат при Кодексе.",
      },
      {
        key: "atk",
        target: 2000,
        softCap: 2500,
        priority: "recommended",
        why: "База пиро-ударов.",
      },
    ],
    notes: "Проценты 5.x менее стабильны, чем у классических персонажей — сверяйте патч.",
  },
  Kinich: {
    key: "Kinich",
    role: "Он-филд дендро (пушка)",
    scenario: "Бёрн / спред, C0",
    team: "Бёрн Натлан",
    sources: ["community Kinich sheets 5.x"],
    talentPriority: ["skill", "burst", "auto"],
    recommendedLevel: 90,
    recommendedTalents: { auto: 6, skill: 9, burst: 8 },
    weapons: [
      { key: "FangOfTheMountainKing", relative: 100, notes: "Сигнатурка." },
      { key: "BeaconOfTheReedSea", relative: 94, notes: "Универсальный 5★." },
      { key: "SerpentSpine", relative: 93, notes: "Лучший 4★." },
      { key: "EarthShaker", relative: 87, notes: "Крафт Натлана." },
      { key: "Rainslasher", relative: 84, notes: "МС в реакциях." },
    ],
    sets: [
      {
        id: "obsidian4",
        pieces: [{ set: "ObsidianCodex", count: 4 }],
        relative: 100,
        notes: "BiS ночного духа.",
      },
      {
        id: "gilded4",
        pieces: [{ set: "GildedDreams", count: 4 }],
        relative: 90,
        notes: "Реакционная сборка без Кодекса.",
      },
      {
        id: "deepwood4",
        pieces: [{ set: "DeepwoodMemories", count: 4 }],
        relative: 86,
        notes: "Только если никто не носит шред.",
      },
    ],
    mainstats: {
      sands: ["atk_"],
      goblet: ["dendro_dmg_"],
      circlet: ["critRate_", "critDMG_"],
    },
    caps: [
      {
        key: "critRate_",
        target: 40,
        softCap: 70,
        priority: "mandatory",
        why: "Кодекс закрывает крит. шанс в бою.",
      },
      {
        key: "critDMG_",
        target: 200,
        softCap: 250,
        priority: "recommended",
        why: "Пушка — критовые тычки.",
      },
      {
        key: "atk",
        target: 2000,
        softCap: 2400,
        priority: "recommended",
        why: "Скалькировка навыка от ATK.",
      },
      {
        key: "enerRech_",
        target: 120,
        softCap: 140,
        priority: "recommended",
        why: "Ульта для ядра и энергии.",
      },
    ],
    notes: "Без Натланского напарника проседает генерация Fighting Spirit.",
  },
  Navia: {
    key: "Navia",
    role: "Он-филд гео (залпы)",
    scenario: "Кристаллизация, C0",
    team: "Двойной гео / Фурина",
    sources: ["KQM Navia"],
    talentPriority: ["skill", "auto", "burst"],
    recommendedLevel: 90,
    recommendedTalents: { auto: 8, skill: 9, burst: 6 },
    weapons: [
      { key: "Verdict", relative: 100, notes: "Сигнатурка под кристаллы." },
      { key: "BeaconOfTheReedSea", relative: 96, notes: "Близко, проще достать." },
      { key: "SerpentSpine", relative: 94, notes: "Лучший 4★." },
      { key: "TidalShadow", relative: 88, notes: "Крафт Фонтейна, ATK после лечения." },
      { key: "PortablePowerSaw", relative: 86, notes: "HP-субстат слабее ATK-сборок." },
      { key: "WolfsGravestone", relative: 93, notes: "ATK и командный бафф." },
    ],
    sets: [
      {
        id: "nighttime4",
        pieces: [{ set: "NighttimeWhispersInTheEchoingWoods", count: 4 }],
        relative: 100,
        notes: "BiS под кристаллизацию.",
      },
      {
        id: "glad4",
        pieces: [{ set: "GladiatorsFinale", count: 4 }],
        relative: 93,
        notes: "Универсальный ATK 4pc.",
      },
      {
        id: "golden4",
        pieces: [{ set: "GoldenTroupe", count: 4 }],
        relative: 95,
        notes: "Навык — основной залп.",
      },
      {
        id: "atk2-atk2",
        pieces: [
          { set: "GladiatorsFinale", count: 2 },
          { set: "NighttimeWhispersInTheEchoingWoods", count: 2 },
        ],
        relative: 91,
        notes: "2+2 ATK.",
      },
    ],
    mainstats: {
      sands: ["atk_"],
      goblet: ["geo_dmg_"],
      circlet: ["critRate_", "critDMG_"],
    },
    caps: [
      {
        key: "atk",
        target: 2200,
        softCap: 2800,
        priority: "mandatory",
        why: "Залпы от ATK.",
      },
      {
        key: "critRate_",
        target: 70,
        softCap: 85,
        priority: "mandatory",
        why: "Мало ударов — каждый крит дорог.",
      },
      {
        key: "critDMG_",
        target: 160,
        softCap: 220,
        priority: "recommended",
        why: "1:2.",
      },
    ],
    notes: "Собирайте кристаллы до навыка. Без кристаллов сет Навий недобирает проценты.",
  },
  Alhaitham: {
    key: "Alhaitham",
    role: "Он-филд дендро (зеркала)",
    scenario: "Спред / гиперблоссом, C0",
    team: "Быстрый спред",
    sources: ["KQM Alhaitham"],
    talentPriority: ["skill", "auto", "burst"],
    recommendedLevel: 90,
    recommendedTalents: { auto: 8, skill: 9, burst: 8 },
    weapons: [
      { key: "LightOfFoliarIncision", relative: 100, notes: "Сигнатурка под МС-конверт." },
      { key: "HaranGeppakuFutsu", relative: 97, notes: "Обычные атаки + крит." },
      { key: "PrimordialJadeCutter", relative: 96, notes: "Крит. шанс." },
      { key: "UrakuMisugiri", relative: 95, notes: "Обычные и навык." },
      { key: "IronSting", relative: 90, notes: "Лучший крафт." },
      { key: "HarbingerOfDawn", relative: 86, notes: "3★ криты при полном HP." },
      { key: "WolfFang", relative: 91, notes: "Боевой пропуск." },
    ],
    sets: [
      {
        id: "gilded4",
        pieces: [{ set: "GildedDreams", count: 4 }],
        relative: 100,
        notes: "BiS спреда.",
      },
      {
        id: "tf4",
        pieces: [{ set: "ThunderingFury", count: 4 }],
        relative: 99,
        notes: "Быстрый спред с укороченным навыком — почти паритет.",
      },
      {
        id: "desert4",
        pieces: [{ set: "DesertPavilionChronicle", count: 4 }],
        relative: 94,
        notes: "Обычные атаки, слабее реакций.",
      },
      {
        id: "em2-em2",
        pieces: [
          { set: "GildedDreams", count: 2 },
          { set: "WanderersTroupe", count: 2 },
        ],
        relative: 93,
        notes: "2+2 МС.",
      },
    ],
    mainstats: {
      sands: ["eleMas", "atk_"],
      goblet: ["dendro_dmg_"],
      circlet: ["critRate_", "critDMG_"],
    },
    caps: [
      {
        key: "eleMas",
        target: 250,
        softCap: 400,
        priority: "mandatory",
        why: "Зеркала конвертят МС. 200–400 — сладкая зона.",
      },
      {
        key: "critRate_",
        target: 70,
        softCap: 80,
        priority: "mandatory",
        why: "Многохитовый он-филд.",
      },
      {
        key: "critDMG_",
        target: 150,
        softCap: 200,
        priority: "recommended",
        why: "1:2.",
      },
      {
        key: "enerRech_",
        target: 120,
        softCap: 140,
        priority: "recommended",
        why: "Ульта обновляет зеркала.",
      },
    ],
    notes: "Держите 3 зеркала. Песок МС или ATK% зависит от оружия: на Жале чаще ATK%.",
  },
};

export const GUIDE_KEYS = Object.keys(GUIDES);
