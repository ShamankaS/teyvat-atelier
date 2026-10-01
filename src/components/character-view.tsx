"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { characterName, setName, statLabel, weaponName } from "@/data/catalog";
import { CharacterAvatar } from "@/components/character-avatar";
import { ScoreRing } from "@/components/score-ring";
import { useAccount } from "@/components/account-provider";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatStatValue } from "@/lib/stats";
import type { Analysis } from "@/lib/analyze";

const KIND_LABEL = {
  weapon: "Оружие",
  set: "Сет",
  mainstat: "Основной стат",
  talent: "Талант",
  level: "Уровень",
  cap: "Кап стата",
};

function Suggestions({ analysis }: { analysis: Analysis }) {
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
          className="rounded-xl border border-white/10 bg-white/3 p-4"
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
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

      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/4 p-5 sm:flex-row sm:items-center">
        <CharacterAvatar
          characterKey={character.key}
          name={name}
          element={build.info?.element}
          size="lg"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold">{name}</h1>
            <Badge>C{character.constellation}</Badge>
            {guide ? <Badge variant="secondary">{guide.role}</Badge> : null}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Ур. {character.level} · {character.talent.auto}/{character.talent.skill}/{character.talent.burst}
            {guide ? ` · пачка: ${guide.team}` : null}
          </p>
          {guide ? (
            <p className="mt-2 text-sm text-muted-foreground">{guide.notes}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right text-sm">
            <p className="text-muted-foreground">Оценка билда</p>
            <p className="text-xs text-muted-foreground">оружие {analysis.weaponRelative.toFixed(0)}% · сет {analysis.setRelative.toFixed(0)}%</p>
          </div>
          <ScoreRing score={analysis.overall} size={72} />
        </div>
      </div>

      <Tabs defaultValue="optimize">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="optimize">Оптимизация</TabsTrigger>
          <TabsTrigger value="loadout">Как одет</TabsTrigger>
          <TabsTrigger value="guide">Таблицы %</TabsTrigger>
        </TabsList>

        <TabsContent value="optimize" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Что менять в первую очередь</CardTitle>
              <CardDescription>
                Прирост — процентные пункты team DPS относительно текущего билда в сценарии гайда
                {guide ? ` («${guide.scenario}»).` : "."} Это не соло-DPS и не обещание бездны.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suggestions analysis={analysis} />
            </CardContent>
          </Card>

          {analysis.capResults.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Капы статов</CardTitle>
                <CardDescription>Обязательные цели из гайда. Значения с артефактов, оружия и 2pc бонусов; боевые 4pc (MH, Кодекс) включены.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysis.capResults.map((c) => (
                  <div key={c.key}>
                    <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2 text-sm">
                      <span className="font-medium">
                        {statLabel(c.key)}{" "}
                        <Badge variant={c.priority === "mandatory" ? "destructive" : "outline"} className="ml-1">
                          {c.priority === "mandatory" ? "обязательный" : c.priority === "recommended" ? "желательный" : "люкс"}
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
            </Card>
          ) : null}
        </TabsContent>

        <TabsContent value="loadout" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
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
            </Card>
            <Card>
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
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Артефакты</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {slots.map((slot) => {
                const art = build.artifacts.find((a) => a.slotKey === slot);
                return (
                  <div key={slot} className="rounded-xl border border-white/10 p-3">
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
          </Card>
          <Card>
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
                <div key={k} className="rounded-lg bg-white/5 px-3 py-2">
                  <p className="text-xs text-muted-foreground">{statLabel(k)}</p>
                  <p className="tabular-nums font-medium">{formatStatValue(k, v)}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guide">
          {guide ? (
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Оружие относительно BiS</CardTitle>
                  <CardDescription>{guide.scenario}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {guide.weapons.map((w) => {
                      const active =
                        build.weaponGood &&
                        (build.weaponGood.key === w.key || build.weaponInfo?.key === w.key);
                      return (
                        <li
                          key={w.key}
                          className={`rounded-lg px-3 py-2 ${active ? "bg-primary/15 ring-1 ring-primary/40" : "bg-white/4"}`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-medium">
                              {weaponName(w.key)}
                              {active ? " · на персонаже" : ""}
                            </span>
                            <span className="tabular-nums text-sm text-primary">{w.relative}%</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{w.notes}</p>
                          <Progress value={w.relative} className="mt-2 h-1.5" />
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Сеты относительно референса</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {guide.sets.map((s) => (
                      <li key={s.id} className="rounded-lg bg-white/4 px-3 py-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium">
                            {s.pieces.map((p) => `${p.count}pc ${setName(p.set)}`).join(" + ")}
                          </span>
                          <span className="tabular-nums text-sm text-primary">{s.relative}%</span>
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
                    .
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Для этого персонажа процентная таблица ещё не заведена.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
