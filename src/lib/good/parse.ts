import type { GoodAccount, GoodArtifact, GoodCharacter, GoodWeapon } from "@/lib/good/types";

function asCharacter(raw: unknown): GoodCharacter | null {
  if (!raw || typeof raw !== "object") return null;
  const c = raw as Record<string, unknown>;
  if (typeof c.key !== "string") return null;
  const talent = (c.talent ?? {}) as Record<string, unknown>;
  return {
    key: c.key,
    level: Number(c.level) || 1,
    constellation: Number(c.constellation) || 0,
    ascension: Number(c.ascension) || 0,
    talent: {
      auto: Number(talent.auto) || 1,
      skill: Number(talent.skill) || 1,
      burst: Number(talent.burst) || 1,
    },
  };
}

function asWeapon(raw: unknown): GoodWeapon | null {
  if (!raw || typeof raw !== "object") return null;
  const w = raw as Record<string, unknown>;
  if (typeof w.key !== "string") return null;
  return {
    key: w.key,
    level: Number(w.level) || 1,
    ascension: Number(w.ascension) || 0,
    refinement: Number(w.refinement) || 1,
    location: typeof w.location === "string" ? w.location : "",
    lock: Boolean(w.lock),
  };
}

function asArtifact(raw: unknown): GoodArtifact | null {
  if (!raw || typeof raw !== "object") return null;
  const a = raw as Record<string, unknown>;
  if (typeof a.setKey !== "string" || typeof a.slotKey !== "string") return null;
  const substats = Array.isArray(a.substats)
    ? a.substats
        .map((s) => {
          if (!s || typeof s !== "object") return null;
          const sub = s as Record<string, unknown>;
          if (typeof sub.key !== "string") return null;
          return { key: sub.key, value: Number(sub.value) || 0 };
        })
        .filter((x): x is { key: string; value: number } => Boolean(x))
    : [];
  return {
    setKey: a.setKey,
    slotKey: a.slotKey,
    level: Number(a.level) || 0,
    rarity: Number(a.rarity) || 5,
    mainStatKey: typeof a.mainStatKey === "string" ? a.mainStatKey : "hp",
    location: typeof a.location === "string" ? a.location : "",
    lock: Boolean(a.lock),
    substats,
  };
}

const HIDDEN_CHARACTERS = new Set(["Manekin", "Manekina"]);

function isHiddenCharacter(key: string) {
  return HIDDEN_CHARACTERS.has(key);
}

function remapTraveler(account: GoodAccount) {
  const travelers = account.characters.filter((c) => c.key.startsWith("Traveler"));
  if (travelers.length !== 1) return;
  const dest = travelers[0].key;
  for (const w of account.weapons) {
    if (w.location === "Traveler") w.location = dest;
  }
  for (const a of account.artifacts) {
    if (a.location === "Traveler") a.location = dest;
  }
}

/** Drop mannequins / practice characters — they are not real roster entries. */
function stripHiddenCharacters(account: GoodAccount) {
  account.characters = account.characters.filter((c) => !isHiddenCharacter(c.key));
  for (const w of account.weapons) {
    if (isHiddenCharacter(w.location)) w.location = "";
  }
  for (const a of account.artifacts) {
    if (isHiddenCharacter(a.location)) a.location = "";
  }
}

export function parseAccountJson(text: string): { account: GoodAccount } | { error: string } {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { error: "Файл не является валидным JSON." };
  }
  return parseAccount(raw);
}

export function parseAccount(raw: unknown): { account: GoodAccount } | { error: string } {
  if (!raw || typeof raw !== "object") {
    return { error: "Ожидался объект аккаунта." };
  }
  const v = raw as Record<string, unknown>;
  if (!Array.isArray(v.characters) || !Array.isArray(v.weapons) || !Array.isArray(v.artifacts)) {
    return {
      error:
        "Нужны массивы characters, weapons и artifacts. Подходит GOOD v2/v3 (Genshin Optimizer, Irminsul).",
    };
  }

  const characters = v.characters.map(asCharacter).filter((x): x is GoodCharacter => Boolean(x));
  const weapons = v.weapons.map(asWeapon).filter((x): x is GoodWeapon => Boolean(x));
  const artifacts = v.artifacts.map(asArtifact).filter((x): x is GoodArtifact => Boolean(x));

  if (characters.length === 0) {
    return { error: "В JSON нет персонажей." };
  }

  const account: GoodAccount = {
    format: typeof v.format === "string" ? v.format : "GOOD",
    version: typeof v.version === "number" ? v.version : 3,
    source: typeof v.source === "string" ? v.source : "import",
    characters,
    weapons,
    artifacts,
  };
  remapTraveler(account);
  stripHiddenCharacters(account);
  if (account.characters.length === 0) {
    return { error: "В JSON нет персонажей." };
  }
  return { account };
}
