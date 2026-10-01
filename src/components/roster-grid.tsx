"use client";

import Link from "next/link";
import { characterName } from "@/data/catalog";
import { GUIDES } from "@/data/guides";
import { CharacterAvatar } from "@/components/character-avatar";
import { ScoreRing } from "@/components/score-ring";
import { useAccount } from "@/components/account-provider";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";

type Filter = "built" | "guide" | "needs" | "all";

export function RosterGrid() {
  const { analyses, loading } = useAccount();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("guide");

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    return analyses.filter((a) => {
      const name = characterName(a.character.key).toLowerCase();
      const match = !query || name.includes(query) || a.character.key.toLowerCase().includes(query);
      if (!match) return false;
      const dressed = a.build.artifacts.length >= 5;
      const hasGuide = Boolean(GUIDES[a.character.key]);
      const needs = a.suggestions.some((s) => s.severity === "high");
      if (filter === "built") return dressed || a.character.level >= 80;
      if (filter === "guide") return hasGuide;
      if (filter === "needs") return needs && (dressed || a.character.level >= 70);
      return true;
    });
  }, [analyses, q, filter]);

  if (loading && analyses.length === 0) {
    return (
      <p className="text-sm text-muted-foreground" id="roster">
        Загружаю аккаунт…
      </p>
    );
  }

  if (analyses.length === 0) return null;

  const filters: { id: Filter; label: string }[] = [
    { id: "built", label: "Одетые" },
    { id: "needs", label: "Нужна работа" },
    { id: "guide", label: "Есть гайд" },
    { id: "all", label: `Все (${analyses.length})` },
  ];

  return (
    <section id="roster" className="scroll-mt-6 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Персонажи на аккаунте</h2>
          <p className="text-sm text-muted-foreground">
            Показано {rows.length}. Сначала те, кому оптимизация даст больше.
          </p>
        </div>
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Поиск…"
          className="sm:max-w-56"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={cn(
              buttonVariants({ variant: filter === f.id ? "default" : "outline", size: "sm" }),
            )}
          >
            {f.label}
          </button>
        ))}
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
