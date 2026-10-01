import { ImportPanel } from "@/components/import-panel";
import { RosterGrid } from "@/components/roster-grid";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-4 py-8 sm:px-6">
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="space-y-4">
            <p className="text-sm tracking-wide text-primary uppercase">Локальный разбор аккаунта</p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Сравните, как персонаж одет у вас, с гайдами в процентах
            </h1>
            <p className="max-w-xl text-muted-foreground">
              Загрузите JSON (GOOD v2/v3 — Irminsul или Genshin Optimizer). Сейчас разобран ваш экспорт:
              101 персонаж, оружие и артефакты. Предложения смотрят и на инвентарь: например, если «Улов»
              на Райдэн, а Сян Лин без него — это будет в очереди правок.
            </p>
            <ImportPanel />
          </div>
          <aside className="space-y-4 rounded-2xl border border-white/10 bg-white/4 p-5 text-sm">
            <h2 className="text-base font-semibold">Как считаются проценты</h2>
            <ul className="list-disc space-y-2 pl-4 text-muted-foreground">
              <li>100% — лучшее оружие или сет в указанной пачке, R1 сигнатурки, team DPS, не соло.</li>
              <li>
                Цифры сверены с{" "}
                <a
                  href="https://www.prydwen.gg/genshin-impact"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline-offset-2 hover:underline"
                >
                  Prydwen
                </a>
                , плюс KQM / TCL / community sheets. Это не живой симулятор ротации.
              </li>
              <li>
                Предложение «+8 п.п.» — разница табличных процентов, а не гарантия бездны.
              </li>
              <li>Данные остаются в браузере. Серверу JSON не отправляется.</li>
            </ul>
            <h2 className="pt-2 text-base font-semibold">Что уже умеет прототип</h2>
            <ul className="list-disc space-y-2 pl-4 text-muted-foreground">
              <li>Таблицы % на ядро аккаунта: Ху Тао, Райдэн, Нахида, Фурина, Аяка, Ёимия, Нилу, Шилонен и другие.</li>
              <li>Подсказки с инвентаря: свободная Хома или «Улов» на другом персонаже.</li>
              <li>Фильтр «Одетые», чтобы не смотреть 20-уровневых.</li>
            </ul>
          </aside>
        </section>
        <RosterGrid />
      </main>
    </div>
  );
}
