"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { ArrowLeft, Star } from "lucide-react";
import { CHARACTERS, characterName } from "@/data/characters";
import { setName } from "@/data/sets";
import { weaponName } from "@/data/weapons";
import { ELEMENT_LABELS, WEAPON_TYPE_LABELS, statLabel } from "@/data/catalog";
import {
  ELEMENT_ACCENT_TEXT,
  ELEMENT_HERO_WASH,
  ELEMENT_PANEL,
  ELEMENT_SURFACE,
} from "@/data/element-theme";
import { CharacterAvatar } from "@/components/character-avatar";
import { WeaponIcon, weaponRarity } from "@/components/weapon-icon";
import { ScoreRing } from "@/components/score-ring";
import { useAccount } from "@/components/account-provider";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatStatValue } from "@/lib/stats";
import { weaponOwnership, type WeaponOwnership } from "@/lib/compute";
import { cn } from "@/lib/utils";
import type { Analysis } from "@/lib/analyze";
import type { ElementKey } from "@/lib/good/types";

const KIND_LABEL = {
  weapon: "Оружие",
  set: "Сет",
  mainstat: "Основной стат",
  talent: "Талант",
  level: "Уровень",
  cap: "Кап стата",
};

/** Ownership chrome tuned for element-tinted surfaces (not primary/sky which clash). */
const OWNERSHIP_ROW: Record<WeaponOwnership["status"], string> = {
  equipped: "border-2 border-white/85 bg-black/40",
  owned: "border border-emerald-300/55 bg-emerald-950/60",
  elsewhere: "border border-rose-400/55 bg-rose-950/55",
  missing: "border border-white/10 bg-black/45 opacity-55",
};

function ownershipLabel(own: WeaponOwnership): string {
  switch (own.status) {
    case "equipped":
      return `на персонаже · R${own.refinement}`;
    case "owned":
      return `в аккаунте · R${own.refinement}`;
    case "elsewhere":
      return `на ${characterName(own.location)} · R${own.refinement}`;
    case "missing":
      return "нет в аккаунте";
  }
}

function RarityStars({ rarity }: { rarity: 4 | 5 }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rarity}★`}>
      {Array.from({ length: rarity }, (_, i) => (
        <Star
          key={i}
          className="size-3.5 fill-amber-300 text-amber-300"
          aria-hidden
        />
      ))}
    </div>
  );
}

function surfaceClass(element?: ElementKey) {
  return element ? ELEMENT_SURFACE[element] : "border-white/10 bg-white/5 ring-white/10";
}

function panelClass(element?: ElementKey) {
  return element ? ELEMENT_PANEL[element] : "border-white/10 bg-white/5";
}

function ThemedCard({
  element,
  className,
  ...props
}: ComponentProps<typeof Card> & { element?: ElementKey }) {
  return (
    <Card
      className={cn("border bg-transparent ring-1", surfaceClass(element), className)}
      {...props}
    />
  );
}

function Suggestions({
  analysis,
  element,
}: {
  analysis: Analysis;
  element?: ElementKey;
}) {
  if (analysis.suggestions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Существенных дыр нет: оружие, сет и капы близки к референсу.
      </p>
    );
  }
  return (
    <ol className="space-y-3">
      {analysis.suggestions.map((s, i) => (
        <li
          key={s.id}
          className={cn("rounded-xl border p-4", panelClass(element))}
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex size-6 items-center justify-center rounded-full text-xs font-semibold",
                  element
                    ? cn("bg-white/10", ELEMENT_ACCENT_TEXT[element])
                    : "bg-primary/20 text-primary",
                )}
              >
                {i + 1}
              </span>
              <Badge variant="outline">{KIND_LABEL[s.kind]}</Badge>
              <span className="font-medium">{s.title}</span>
            </div>
            {s.deltaPct > 0 ? (
              <span
                className={`tabular-nums text-sm font-semibold ${
                  s.severity === "high" ? "text-amber-300" : "text-muted-foreground"
                }`}
              >
                +{s.deltaPct.toFixed(1)} п.п.
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{s.detail}</p>
        </li>
      ))}
    </ol>
  );
}

export function CharacterView({ characterKey }: { characterKey: string }) {
  const { account, analyses } = useAccount();
  const analysis = analyses.find((a) => a.character.key === characterKey);

  if (!account) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">Сначала загрузите JSON на главной.</p>
        <Link href="/" className={buttonVariants()}>
          К импорту
        </Link>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">Этого персонажа нет в загруженном аккаунте.</p>
        <Link href="/" className={buttonVariants({ variant: "secondary" })}>
          К списку
        </Link>
      </div>
    );
  }

  const { character, guide, build } = analysis;
  const name = characterName(character.key);
  const info = build.info ?? CHARACTERS[character.key];
  const element = info?.element;
  const weaponType = info?.weaponType;
  const rarity = info?.rarity;
  const slots = ["flower", "plume", "sands", "goblet", "circlet"] as const;
  const slotRu = {
    flower: "Цветок",
    plume: "Перо",
    sands: "Пески",
    goblet: "Кубок",
    circlet: "Корона",
  };

  return (
    <div className="space-y-6">
      <Link href="/" className={buttonVariants({ variant: "ghost", className: "-ml-2" })}>
        <ArrowLeft />
        Все персонажи
      </Link>

      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border ring-1",
          surfaceClass(element),
        )}
      >
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-linear-to-br",
            element ? ELEMENT_HERO_WASH[element] : "from-white/5 via-transparent to-transparent",
          )}
          aria-hidden
        />

        <div className="relative z-10 flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
          <CharacterAvatar
            characterKey={character.key}
            name={name}
            element={element}
            size="lg"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">{name}</h1>
              <Badge>C{character.constellation}</Badge>
              {guide ? <Badge variant="secondary">{guide.role}</Badge> : null}
            </div>
            {rarity ? (
              <div className="mt-1.5">
                <RarityStars rarity={rarity} />
              </div>
            ) : null}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {element ? (
                <Badge
                  variant="outline"
                  className={cn(panelClass(element), ELEMENT_ACCENT_TEXT[element])}
                >
                  {ELEMENT_LABELS[element]}
                </Badge>
              ) : null}
              {weaponType ? (
                <Badge variant="outline" className={panelClass(element)}>
                  {WEAPON_TYPE_LABELS[weaponType]}
                </Badge>
              ) : null}
              {rarity ? (
                <Badge variant="outline" className={panelClass(element)}>
                  {rarity}★
                </Badge>
              ) : null}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Ур. {character.level} · {character.talent.auto}/{character.talent.skill}/
              {character.talent.burst}
              {guide ? ` · пачка: ${guide.team}` : null}
            </p>
            {guide?.notes ? (
              <p className="mt-2 line-clamp-2 max-w-xl text-sm text-muted-foreground">
                {guide.notes}
              </p>
            ) : null}

            <div
              className={cn(
                "mt-4 inline-flex items-center gap-3 rounded-xl border px-3 py-2",
                panelClass(element),
              )}
            >
              <ScoreRing score={analysis.overall} size={56} />
              <div className="text-sm">
                <p className="font-medium">Оценка билда</p>
                <p className="text-xs text-muted-foreground">
                  оружие {analysis.weaponRelative.toFixed(0)}% · сет{" "}
                  {analysis.setRelative.toFixed(0)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="optimize">
        <TabsList
          className={cn(
            "w-full justify-start overflow-x-auto border ring-1",
            surfaceClass(element),
            "bg-transparent",
          )}
        >
          <TabsTrigger value="optimize">Оптимизация</TabsTrigger>
          <TabsTrigger value="loadout">Как одет</TabsTrigger>
          <TabsTrigger value="guide">Таблицы %</TabsTrigger>
        </TabsList>

        <TabsContent value="optimize" className="space-y-6">
          <ThemedCard element={element}>
            <CardHeader>
              <CardTitle>Что менять в первую очередь</CardTitle>
              <CardDescription>
                Прирост — процентные пункты team DPS относительно текущего билда в сценарии гайда
                {guide ? ` («${guide.scenario}»).` : "."} Это не соло-DPS и не обещание бездны.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suggestions analysis={analysis} element={element} />
            </CardContent>
          </ThemedCard>

          {analysis.capResults.length > 0 ? (
            <ThemedCard element={element}>
              <CardHeader>
                <CardTitle>Капы статов</CardTitle>
                <CardDescription>
                  Обязательные цели из гайда. Значения с артефактов, оружия и 2pc бонусов; боевые
                  4pc (MH, Кодекс) включены.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysis.capResults.map((c) => (
                  <div key={c.key}>
                    <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2 text-sm">
                      <span className="font-medium">
                        {statLabel(c.key)}{" "}
                        <Badge
                          variant={c.priority === "mandatory" ? "destructive" : "outline"}
                          className="ml-1"
                        >
                          {c.priority === "mandatory"
                            ? "обязательный"
                            : c.priority === "recommended"
                              ? "желательный"
                              : "люкс"}
                        </Badge>
                      </span>
                      <span className="tabular-nums text-muted-foreground">
                        {formatStatValue(c.key, c.current)} / {formatStatValue(c.key, c.target)}
                      </span>
                    </div>
                    <Progress value={Math.min(100, c.ratio * 100)} />
                    <p className="mt-1 text-xs text-muted-foreground">{c.why}</p>
                  </div>
                ))}
              </CardContent>
            </ThemedCard>
          ) : null}
        </TabsContent>

        <TabsContent value="loadout" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <ThemedCard element={element}>
              <CardHeader>
                <CardTitle>Оружие</CardTitle>
              </CardHeader>
              <CardContent>
                {build.weaponGood && build.weaponInfo ? (
                  <div>
                    <p className="font-medium">{weaponName(build.weaponGood.key)}</p>
                    <p className="text-sm text-muted-foreground">
                      Ур. {build.weaponGood.level} · R{build.weaponGood.refinement} ·{" "}
                      {analysis.weaponRelative.toFixed(0)}% от BiS
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-rose-300">Оружие не надето</p>
                )}
              </CardContent>
            </ThemedCard>
            <ThemedCard element={element}>
              <CardHeader>
                <CardTitle>Сеты</CardTitle>
              </CardHeader>
              <CardContent>
                {build.setPieces.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Нет 2pc/4pc</p>
                ) : (
                  <ul className="space-y-1 text-sm">
                    {build.setPieces.map((p) => (
                      <li key={p.set}>
                        {p.count}pc {setName(p.set)}
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-2 text-xs text-muted-foreground">
                  Эффективность сета ≈ {analysis.setRelative.toFixed(0)}%
                </p>
              </CardContent>
            </ThemedCard>
          </div>
          <ThemedCard element={element}>
            <CardHeader>
              <CardTitle>Артефакты</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {slots.map((slot) => {
                const art = build.artifacts.find((a) => a.slotKey === slot);
                return (
                  <div key={slot} className={cn("rounded-xl border p-3", panelClass(element))}>
                    <p className="text-xs text-muted-foreground">{slotRu[slot]}</p>
                    {art ? (
                      <>
                        <p className="text-sm font-medium">{setName(art.setKey)}</p>
                        <p className="text-xs">
                          +{art.level} · {statLabel(art.mainStatKey)}
                        </p>
                        <ul className="mt-2 space-y-0.5 text-xs text-muted-foreground">
                          {art.substats.map((s, i) => (
                            <li key={i}>
                              {statLabel(s.key)} {formatStatValue(s.key, s.value)}
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <p className="text-sm text-rose-300">пусто</p>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </ThemedCard>
          <ThemedCard element={element}>
            <CardHeader>
              <CardTitle>Сводка статов</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
              {(
                [
                  ["hp", build.stats.hp],
                  ["atk", build.stats.atk],
                  ["eleMas", build.stats.eleMas],
                  ["enerRech_", build.stats.enerRech_],
                  ["critRate_", build.stats.critRate_],
                  ["critDMG_", build.stats.critDMG_],
                ] as const
              ).map(([k, v]) => (
                <div key={k} className={cn("rounded-lg border px-3 py-2", panelClass(element))}>
                  <p className="text-xs text-muted-foreground">{statLabel(k)}</p>
                  <p className="tabular-nums font-medium">{formatStatValue(k, v)}</p>
                </div>
              ))}
            </CardContent>
          </ThemedCard>
        </TabsContent>

        <TabsContent value="guide">
          {guide ? (
            <div className="grid gap-4 lg:grid-cols-2">
                            <ThemedCard element={element}>
                <CardHeader>
                  <CardTitle>Оружие относительно BiS</CardTitle>
                  <CardDescription>{guide.scenario}</CardDescription>
                  <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <li className="flex items-center gap-1.5">
                      <span
                        className="size-2.5 rounded-[2px] border-2 border-white/85 bg-black/40"
                        aria-hidden
                      />
                      на персонаже
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-emerald-300" aria-hidden />
                      в аккаунте
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-rose-400" aria-hidden />
                      на другом
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-white/25" aria-hidden />
                      нет в аккаунте
                    </li>
                  </ul>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {guide.weapons.map((w) => {
                      const own = weaponOwnership(account, character.key, w.key);
                      return (
                        <li
                          key={w.key}
                          className={cn("rounded-lg px-3 py-2", OWNERSHIP_ROW[own.status])}
                        >
                          <div className="flex items-start gap-3">
                            <WeaponIcon weaponKey={w.key} />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-medium">
                                  {weaponName(w.key)}
                                  <span className="font-normal text-muted-foreground">
                                    {" "}
                                    · {weaponRarity(w.key) ?? "?"}★ · {ownershipLabel(own)}
                                  </span>
                                </span>
                                <span
                                  className={cn(
                                    "shrink-0 tabular-nums text-sm",
                                    element ? ELEMENT_ACCENT_TEXT[element] : "text-primary",
                                  )}
                                >
                                  {w.relative}%
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground">{w.notes}</p>
                              <Progress value={w.relative} className="mt-2 h-1.5" />
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </ThemedCard>
              <ThemedCard element={element}>
                <CardHeader>
                  <CardTitle>Сеты относительно референса</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {guide.sets.map((s) => (
                      <li key={s.id} className={cn("rounded-lg border px-3 py-2", panelClass(element))}>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium">
                            {s.pieces.map((p) => `${p.count}pc ${setName(p.set)}`).join(" + ")}
                          </span>
                          <span
                            className={cn(
                              "tabular-nums text-sm",
                              element ? ELEMENT_ACCENT_TEXT[element] : "text-primary",
                            )}
                          >
                            {s.relative}%
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{s.notes}</p>
                        <Progress value={Math.min(100, s.relative)} className="mt-2 h-1.5" />
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs text-muted-foreground">
                    Источники: {guide.sources.join(", ")}. Таланты:{" "}
                    {guide.talentPriority
                      .map((t) => (t === "auto" ? "авто" : t === "skill" ? "навык" : "ульта"))
                      .join(" > ")}
                    .{" "}
                    <a
                      href={guide.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "underline-offset-2 hover:underline",
                        element ? ELEMENT_ACCENT_TEXT[element] : "text-primary",
                      )}
                    >
                      Prydwen
                    </a>
                  </p>
                </CardContent>
              </ThemedCard>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Для этого персонажа процентная таблица ещё не заведена.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
