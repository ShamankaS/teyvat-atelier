import { GUIDES, type CharacterGuide, type SetRank, type WeaponRank } from "@/data/guides";
import { characterName, setName, statLabel, weaponName } from "@/data/catalog";
import type { GoodAccount, GoodCharacter, StatKey } from "@/lib/good/types";
import {
  computeBuild,
  inventoryWeapons,
  resolveWeapon,
  type ComputedBuild,
} from "@/lib/compute";
import { formatStatValue } from "@/lib/stats";

export type SuggestionKind = "weapon" | "set" | "mainstat" | "talent" | "level" | "cap";

export interface Suggestion {
  id: string;
  kind: SuggestionKind;
  title: string;
  detail: string;
  /** Ожидаемый прирост team DPS, процентные пункты относительно текущего. */
  deltaPct: number;
  severity: "high" | "medium" | "low";
}

export interface CapResult {
  key: StatKey;
  current: number;
  target: number;
  softCap?: number;
  ratio: number;
  priority: CharacterGuide["caps"][number]["priority"];
  why: string;
  met: boolean;
}

export interface Analysis {
  character: GoodCharacter;
  guide?: CharacterGuide;
  build: ComputedBuild;
  weaponRank?: WeaponRank;
  weaponRelative: number;
  setRank?: SetRank;
  setRelative: number;
  talentScore: number;
  capResults: CapResult[];
  capScore: number;
  overall: number;
  suggestions: Suggestion[];
}

function matchSet(guide: CharacterGuide, pieces: { set: string; count: 2 | 4 }[]) {
  const have = new Map(pieces.map((p) => [p.set, p.count]));
  let best: SetRank | undefined;
  for (const rank of guide.sets) {
    const ok = rank.pieces.every((p) => (have.get(p.set) ?? 0) >= p.count);
    if (!ok) continue;
    if (!best || rank.relative > best.relative) best = rank;
  }
  return best;
}

function capValue(stats: ComputedBuild["stats"], key: StatKey) {
  return (stats[key as keyof ComputedBuild["stats"]] as number) ?? 0;
}

function talentGapPct(char: GoodCharacter, guide: CharacterGuide) {
  const rec = guide.recommendedTalents;
  const weights: Record<string, number> = { auto: 1, skill: 1, burst: 1 };
  const order = guide.talentPriority;
  weights[order[0]] = 1.4;
  if (order[1]) weights[order[1]] = 1.0;
  if (order[2]) weights[order[2]] = 0.5;
  let score = 0;
  let max = 0;
  (["auto", "skill", "burst"] as const).forEach((t) => {
    const w = weights[t];
    max += w * rec[t];
    score += w * Math.min(char.talent[t], rec[t]);
  });
  return max === 0 ? 100 : (score / max) * 100;
}

export function analyzeCharacter(account: GoodAccount, character: GoodCharacter): Analysis {
  const guide = GUIDES[character.key];
  const build = computeBuild(account, character);
  if (!guide) {
    return {
      character,
      build,
      weaponRelative: 70,
      setRelative: 70,
      talentScore: 70,
      capResults: [],
      capScore: 70,
      overall: 70,
      suggestions: [
        {
          id: "no-guide",
          kind: "set",
          title: "Нет карточки гайда",
          detail: `${characterName(character.key)} пока без процентных таблиц. Загрузите JSON — разбор статов всё равно посчитается, когда добавим гайд.`,
          deltaPct: 0,
          severity: "low",
        },
      ],
    };
  }

  const weaponRank = guide.weapons.find((w) => {
    if (!build.weaponGood) return false;
    const a = resolveWeapon(build.weaponGood.key);
    const b = resolveWeapon(w.key);
    return build.weaponGood.key === w.key || a?.key === b?.key;
  });

  let weaponRelative = weaponRank?.relative ?? 72;
  if (
    character.key === "HuTao" &&
    (build.weaponGood?.key === "DragonBane" || build.weaponGood?.key === "DragonsBane")
  ) {
    const refine = build.weaponGood.refinement ?? 1;
    weaponRelative = 90 + ((refine - 1) / 4) * 6;
  }

  const setRank = matchSet(guide, build.setPieces);
  const setRelative = setRank?.relative ?? (build.artifacts.length >= 5 ? 78 : 60);

  const talentScore = talentGapPct(character, guide);
  const capResults: CapResult[] = guide.caps.map((cap) => {
    const current = capValue(build.stats, cap.key);
    const ratio = cap.target === 0 ? 1 : current / cap.target;
    return {
      key: cap.key,
      current,
      target: cap.target,
      softCap: cap.softCap,
      ratio,
      priority: cap.priority,
      why: cap.why,
      met: ratio >= 0.95,
    };
  });

  const capScore =
    capResults.length === 0
      ? 100
      : (capResults.reduce((s, c) => {
          const w = c.priority === "mandatory" ? 1.4 : c.priority === "recommended" ? 1 : 0.5;
          return s + Math.min(1.05, c.ratio) * w;
        }, 0) /
          capResults.reduce(
            (s, c) => s + (c.priority === "mandatory" ? 1.4 : c.priority === "recommended" ? 1 : 0.5),
            0,
          )) *
        100;

  const levelScore = Math.min(100, (character.level / guide.recommendedLevel) * 100);
  const overall = Math.round(
    weaponRelative * 0.32 + setRelative * 0.24 + talentScore * 0.12 + capScore * 0.24 + levelScore * 0.08,
  );

  const suggestions: Suggestion[] = [];

  const bis = guide.weapons[0];
  if (build.weaponGood && weaponRelative < bis.relative - 1) {
    const betterOwned = inventoryWeapons(account, character.key, build.info?.weaponType ?? "").
      map((w) => {
        const rank = guide.weapons.find((r) => r.key === w.key || resolveWeapon(w.key)?.key === r.key);
        return { w, rank, rel: rank?.relative ?? 0 };
      })
      .filter((x) => x.rel > weaponRelative + 1)
      .sort((a, b) => b.rel - a.rel);

    if (betterOwned[0]) {
      const top = betterOwned[0];
      const loc = top.w.location ? `сейчас на ${characterName(top.w.location)}` : "лежит в инвентаре";
      suggestions.push({
        id: "swap-weapon",
        kind: "weapon",
        title: `Сменить оружие на ${weaponName(top.w.key)}`,
        detail: `${weaponName(build.weaponGood.key)} даёт около ${weaponRelative.toFixed(0)}% от BiS. ${weaponName(top.w.key)} (${loc}, R${top.w.refinement}) — около ${top.rel}%. Прирост ~${(top.rel - weaponRelative).toFixed(0)} п.п. team DPS.`,
        deltaPct: top.rel - weaponRelative,
        severity: top.rel - weaponRelative >= 8 ? "high" : "medium",
      });
    } else {
      suggestions.push({
        id: "farm-weapon",
        kind: "weapon",
        title: `Оружие слабее BiS на ${(bis.relative - weaponRelative).toFixed(0)}%`,
        detail: `${weaponName(build.weaponGood.key)} ≈ ${weaponRelative.toFixed(0)}% team DPS. ${weaponName(bis.key)} = 100%. ${bis.notes} Ближайшие альтернативы: ${guide.weapons
          .slice(1, 4)
          .map((w) => `${weaponName(w.key)} ${w.relative}%`)
          .join(", ")}.`,
        deltaPct: bis.relative - weaponRelative,
        severity: bis.relative - weaponRelative >= 10 ? "high" : "medium",
      });
    }
  }

  const bestSet = guide.sets[0];
  if (bestSet && setRelative < bestSet.relative - 1) {
    const label = bestSet.pieces.map((p) => `${p.count}pc ${setName(p.set)}`).join(" + ");
    suggestions.push({
      id: "upgrade-set",
      kind: "set",
      title: `Сет: переход на ${label}`,
      detail: `Текущая комбинация ≈ ${setRelative.toFixed(0)}% от референса. ${label} ≈ ${bestSet.relative}% (${bestSet.notes}) Ожидаемый прирост ~${(bestSet.relative - setRelative).toFixed(0)} п.п.`,
      deltaPct: bestSet.relative - setRelative,
      severity: bestSet.relative - setRelative >= 8 ? "high" : "medium",
    });
  }

  const main = guide.mainstats;
  const sands = build.slotMain.sands;
  const goblet = build.slotMain.goblet;
  const circlet = build.slotMain.circlet;
  if (sands && !main.sands.includes(sands as StatKey)) {
    suggestions.push({
      id: "sands",
      kind: "mainstat",
      title: `Пески: ${statLabel(sands)} хуже рекомендуемых`,
      detail: `Для этой сборки пески: ${main.sands.map(statLabel).join(" или ")}. Смена основного стата обычно даёт 6–12% урона.`,
      deltaPct: 8,
      severity: "high",
    });
  }
  if (goblet && !main.goblet.includes(goblet as StatKey)) {
    suggestions.push({
      id: "goblet",
      kind: "mainstat",
      title: `Кубок: ${statLabel(goblet)} не из гайда`,
      detail: `Держите ${main.goblet.map(statLabel).join(" / ")}. Элементальный кубок против ATK%/HP% — часто 8–15% разницы.`,
      deltaPct: 10,
      severity: "high",
    });
  }
  if (circlet && !main.circlet.includes(circlet as StatKey)) {
    suggestions.push({
      id: "circlet",
      kind: "mainstat",
      title: `Корона: ${statLabel(circlet)}`,
      detail: `Рекомендуется ${main.circlet.map(statLabel).join(" или ")}.`,
      deltaPct: 7,
      severity: "medium",
    });
  }

  if (character.level < guide.recommendedLevel) {
    const d = ((guide.recommendedLevel - character.level) / guide.recommendedLevel) * 12;
    suggestions.push({
      id: "level",
      kind: "level",
      title: `Поднять уровень ${character.level} → ${guide.recommendedLevel}`,
      detail: "Базовые HP/ATK и множители талантов растут до 90. Для HP-скейлеров 90 почти обязателен.",
      deltaPct: d,
      severity: character.level < 80 ? "high" : "medium",
    });
  }

  (["auto", "skill", "burst"] as const).forEach((t, i) => {
    const rec = guide.recommendedTalents[t];
    const cur = character.talent[t];
    if (cur < rec) {
      const weight = i === 0 || guide.talentPriority[0] === t ? 2.2 : 1.2;
      suggestions.push({
        id: `talent-${t}`,
        kind: "talent",
        title: `Талант ${t === "auto" ? "обычных" : t === "skill" ? "навыка" : "взрыва"} ${cur} → ${rec}`,
        detail: `Приоритет: ${guide.talentPriority.map((x) => (x === "auto" ? "авто" : x === "skill" ? "навык" : "ульта")).join(" > ")}. Один уровень ключевого таланта ≈ 1.5–2.5% личного урона.`,
        deltaPct: (rec - cur) * weight,
        severity: guide.talentPriority[0] === t ? "high" : "medium",
      });
    }
  });

  for (const cap of capResults) {
    if (cap.met) continue;
    const missing = Math.max(0, cap.target - cap.current);
    const delta = cap.priority === "mandatory" ? (1 - Math.min(1, cap.ratio)) * 14 : (1 - Math.min(1, cap.ratio)) * 7;
    suggestions.push({
      id: `cap-${cap.key}`,
      kind: "cap",
      title: `${statLabel(cap.key)}: ${formatStatValue(cap.key, cap.current)} при цели ${formatStatValue(cap.key, cap.target)}`,
      detail: `${cap.why} Не хватает ${formatStatValue(cap.key, missing)}.`,
      deltaPct: delta,
      severity: cap.priority === "mandatory" && cap.ratio < 0.85 ? "high" : "medium",
    });
  }

  suggestions.sort((a, b) => b.deltaPct - a.deltaPct);

  return {
    character,
    guide,
    build,
    weaponRank,
    weaponRelative,
    setRank,
    setRelative,
    talentScore,
    capResults,
    capScore,
    overall,
    suggestions,
  };
}

export function analyzeAccount(account: GoodAccount) {
  return account.characters
    .map((c) => analyzeCharacter(account, c))
    .sort((a, b) => {
      const ag = a.guide ? 0 : 1;
      const bg = b.guide ? 0 : 1;
      if (ag !== bg) return ag - bg;
      return a.overall - b.overall;
    });
}
