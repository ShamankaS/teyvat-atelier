"use client";

import Link from "next/link";
import { characterName } from "@/data/catalog";
import { GUIDES } from "@/data/guides";
import { CharacterAvatar } from "@/components/character-avatar";
import { ScoreRing } from "@/components/score-ring";
import { useAccount } from "@/components/account-provider";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";

export function RosterGrid() {
  const { analyses } = useAccount();
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    return analyses.filter((a) => {
      const name = characterName(a.character.key).toLowerCase();
      return !query || name.includes(query) || a.character.key.toLowerCase().includes(query);
    });
  }, [analyses, q]);

  if (analyses.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Персонажи на аккаунте</h2>
          <p className="text-sm text-muted-foreground">
            Сначала те, кому оптимизация даст больше всего. Оценка — смесь оружия, сета, капов и талантов.
          </p>
        </div>
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Поиск…"
          className="sm:max-w-56"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {rows.map((a) => {
          const name = characterName(a.character.key);
          const hasGuide = Boolean(GUIDES[a.character.key]);
          const issues = a.suggestions.filter((s) => s.severity === "high").length;
          return (
            <Link
              key={a.character.key}
              href={`/c/${a.character.key}`}
              className="group rounded-2xl border border-white/10 bg-white/4 p-4 transition hover:border-primary/40 hover:bg-white/8"
            >
              <div className="flex items-center gap-3">
                <CharacterAvatar name={name} element={a.build.info?.element} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium">{name}</p>
                    <Badge variant="outline">C{a.character.constellation}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Ур. {a.character.level} · таланты {a.character.talent.auto}/{a.character.talent.skill}/
                    {a.character.talent.burst}
                  </p>
                </div>
                <ScoreRing score={a.overall} />
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {hasGuide ? (
                  <Badge variant="secondary">гайд есть</Badge>
                ) : (
                  <Badge variant="outline">без таблицы %</Badge>
                )}
                {issues > 0 ? (
                  <Badge variant="destructive">{issues} сильных замечаний</Badge>
                ) : (
                  <Badge className="bg-emerald-600/80">в порядке</Badge>
                )}
                {a.build.weaponInfo ? (
                  <span className="text-muted-foreground">{a.build.weaponInfo.name}</span>
                ) : (
                  <span className="text-rose-300">нет оружия</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
