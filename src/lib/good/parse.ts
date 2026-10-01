import type { GoodAccount, GoodArtifact } from "@/lib/good/types";

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
        "Нужны массивы characters, weapons и artifacts. Формат — GOOD (Genshin Open Object Description), как в Genshin Optimizer.",
    };
  }

  const account: GoodAccount = {
    format: typeof v.format === "string" ? v.format : "GOOD",
    version: typeof v.version === "number" ? v.version : 2,
    source: typeof v.source === "string" ? v.source : "import",
    characters: v.characters as GoodAccount["characters"],
    weapons: v.weapons as GoodAccount["weapons"],
    artifacts: (v.artifacts as GoodArtifact[]).map((a) => ({
      ...a,
      substats: Array.isArray(a.substats) ? a.substats : [],
    })),
  };

  if (account.characters.length === 0) {
    return { error: "В JSON нет персонажей." };
  }

  return { account };
}
