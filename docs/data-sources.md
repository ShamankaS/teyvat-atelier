# Источники данных Teyvat Atelier

Куда ходить за цифрами и названиями при обновлении `src/data/*`.
Ключи сущностей — **GOOD** (как в Genshin Optimizer / Irminsul).

## Приоритет (что важнее)

| Задача | 1-й источник | Запасной | Файл |
|--------|--------------|----------|------|
| RU-имя персонажа / оружия / сета | **HoYoWiki** `ru-ru` | — | `characters.ts`, `weapons.ts`, `sets.ts` → `name` |
| База HP/ATK/DEF персонажа L90 A6 | **Genshin Optimizer** datamine | HoYoWiki «Возвысить» | `characters.ts` |
| База ATK + сабстат оружия на макс. уровне | **GO** `Weapons/*/data.json` + `expCurve.json` | HoYoWiki «Возвысить» | `weapons.ts` |
| Редкость сета (3/4/5) | **GO** `artifact_set.json` → `max(rarities)` | — | `sets.ts` → `rarity` |
| 2pc-бонус сета | Игра / wiki «Комплект» / известные значения | GO effects | `sets.ts` → `twoPc` |
| Таблицы % оружия/сетов, капы статов | **Prydwen.gg** | KQM, TCL, community sheets | `guides.ts` |
| Иконки / элемент (аватар) | Enka suffix в каталоге | — | `characters.ts` → `icon`, `element` |

Не брать RU-локализацию с **Fandom / Honey Hunter** — только официальная HoYoWiki.

---

## 1. HoYoWiki (официально)

UI:

| Тип | Aggregate |
|-----|-----------|
| Персонажи | https://wiki.hoyolab.com/pc/genshin/aggregate/2 |
| Оружие | https://wiki.hoyolab.com/pc/genshin/aggregate/4 |
| Артефакты (сеты) | https://wiki.hoyolab.com/pc/genshin/aggregate/5 |

API:

```http
POST https://sg-wiki-api.hoyolab.com/hoyowiki/genshin/wapi/get_entry_page_list
Content-Type: application/json
x-rpc-language: ru-ru
x-rpc-wiki_app: genshin

{"filters":[],"menu_id":"2","page_num":1,"page_size":50,"use_mi18n":true}
```

`menu_id`: `"2"` персонажи, `"4"` оружие, `"5"` сеты.

Карточка сущности:

```http
GET https://sg-wiki-api.hoyolab.com/hoyowiki/genshin/wapi/entry_page?entry_page_id={id}
x-rpc-language: ru-ru
x-rpc-wiki_app: genshin
```

Полезные модули на странице:

- **Возвысить** — таблица по уровням; для L90 брать строку `Ур. 90` / `Ур.90`
  - персонаж: `combatList` → «Базовое HP», «Базовая атака», «Базовая защита»
  - оружие: заголовки в первой строке, значения во второй (ATK до/после возвышения + сабстат)
- **Комплект** / `reliquary_set_effect` — текст 2pc / 4pc
- `filter_values` — редкость, тип оружия, глаз бога и т.п.

Анрелизное (нет в GO) — статы и имена только отсюда.

**Не добавлять** Manekin / Manekina в каталог (фильтр на импорте GOOD).

---

## 2. Genshin Optimizer (datamine)

Репозиторий: https://github.com/frzyc/genshin-optimizer  

Полезные пути:

| Данные | Путь |
|--------|------|
| Оружие | `libs/gi/stats/Data/Weapons/{Sword\|Claymore\|Polearm\|Bow\|Catalyst}/{Key}/data.json` |
| Кривые оружия | `libs/gi/stats/Data/Weapons/expCurve.json` |
| Сеты | `libs/gi/stats/Data/Artifacts/artifact_set.json` (`rarities`, `slots`) |
| Персонажи | `libs/gi/stats/Data/Characters/...` (+ character `expCurve.json`) |

Формула оружия L90 (3★+; для 1–2★ макс. ур. 70):

```
atk90 = base * curve[level] + ascensionBonus.atk[6]
sub90 = subBase * subCurve[level]   # % статы × 100 для отображения
```

Ключи папок = GOOD keys (`StaffOfHoma`, `WolfsGravestone`, …).  
Алиасы GOOD держать в каталоге или в `resolveWeapon` (`DragonBane` / `DragonsBane`, `Stringless` / `TheStringless`).

Sparse-clone только нужной папки:

```bash
git clone --depth 1 --filter=blob:none --sparse https://github.com/frzyc/genshin-optimizer.git
cd genshin-optimizer && git sparse-checkout set libs/gi/stats/Data/Weapons libs/gi/stats/Data/Artifacts
```

---

## 3. Prydwen.gg (гайды)

- Хаб: https://www.prydwen.gg/genshin-impact  
- Карточка персонажа: `https://www.prydwen.gg/genshin-impact/characters/{slug}`  
- В `guides.ts`: поле `sourceUrl` + `sources` (Prydwen первым, где есть full build)  
- Если full build ещё нет — опираться на **Enka usage** с Prydwen и помечать в `notes`  
- Проценты в таблицах = относительный **team DPS vs R1 BiS** в указанной реф-пачке, округлённо

Вторичные источники гайдов: **KQM**, **TCL**, community sheets — только для сверки или дыр в Prydwen.

---

## 4. Что лежит в каких файлах

| Файл | Содержимое |
|------|------------|
| `src/data/characters.ts` | GOOD key → имя, элемент, тип оружия, `rarity`, Enka `icon`, `baseHp90` / `baseAtk90` / `baseDef90` |
| `src/data/weapons.ts` | GOOD key → имя, тип, rarity, `baseAtk90`, substat |
| `src/data/sets.ts` | GOOD key → имя, `rarity` (max), опционально `twoPc` |
| `src/data/guides.ts` | таблицы % и капы для guided-персонажей |
| `src/data/catalog.ts` | только лейблы статов / элементов / типов оружия |
| `src/data/element-theme.ts` | Цвета стихий для аватара, hero и фона страницы |

Формат хранения — **TypeScript** (типы + хелперы `characterName` / `weaponName` / `setName`).

---

## 5. Чеклист при добавлении сущности

1. GOOD-ключ совпадает с экспортом Irminsul/GO.  
2. RU-имя свернуть с HoYoWiki aggregate.  
3. Статы L90: GO → иначе wiki «Возвысить»; `rarity` и Enka `icon` suffix.  
4. Для сета: `rarity = max(rarities)`; `twoPc` только если бонус мапится в наши статы (`StatKey` / skill / burst / na).  
5. Для гайда: Prydwen URL + таблица; ключи оружия/сетов уже есть в `weapons.ts` / `sets.ts`.  
6. `tsc --noEmit` без ошибок.
