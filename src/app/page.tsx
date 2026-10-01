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
              Загрузите JSON (пока GOOD, как в Genshin Optimizer). Приложение смотрит уровень, таланты,
              оружие и артефакты и предлагает замены: это копьё слабее Хомы на 10%, этот сет — на 6% ниже
              референса, вот обязательный кап VE.
            </p>
            <ImportPanel />
          </div>
          <aside className="space-y-4 rounded-2xl border border-white/10 bg-white/4 p-5 text-sm">
            <h2 className="text-base font-semibold">Как считаются проценты</h2>
            <ul className="list-disc space-y-2 pl-4 text-muted-foreground">
              <li>100% — лучшее оружие или сет в указанной пачке, R1 сигнатурки, team DPS, не соло.</li>
              <li>
                Цифры агрегированы по KQM / TCL / популярным калькам. Это не живой симулятор ротации.
              </li>
              <li>
                Предложение «+8 п.п.» — разница табличных процентов, а не гарантия бездны.
              </li>
              <li>Данные остаются в браузере. Серверу JSON не отправляется.</li>
            </ul>
            <h2 className="pt-2 text-base font-semibold">Что уже умеет прототип</h2>
            <ul className="list-disc space-y-2 pl-4 text-muted-foreground">
              <li>16 персонажей с таблицами оружия, сетов и капов.</li>
              <li>Подсказки с инвентаря: если Хома лежит без владельца — скажет надеть.</li>
              <li>Демо-аккаунт с «кривыми» билдами, чтобы было что чинить.</li>
            </ul>
          </aside>
        </section>
        <RosterGrid />
      </main>
    </div>
  );
}
