# Změna stavu úkolu (Task Set State)

## Přehled

Tato funkcionalita umožňuje uživatelům měnit stav úkolů mezi jednotlivými sloupci (Otevřené, Probíhající a Dokončené) prostřednictvím intuitivního drag-and-drop rozhraní.

## Stavy úkolů

V systému existují tři základní stavy úkolů:

- **Otevřené** - Úkoly, které byly vytvořeny, ale dosud nezačala práce na jejich řešení
- **Probíhající** - Úkoly, na kterých se aktuálně pracuje
- **Dokončené** - Úkoly, které byly úspěšně dokončeny

## Komponenty

### TaskList.jsx

Hlavní komponenta zobrazující seznamy úkolů ve sloupcích podle jejich stavu.

**Vlastnosti (props):**
- `tasks` - Objekt obsahující seznamy úkolů podle jednotlivých stavů
- `onTaskMove` - Funkce, která se volá při přesunutí úkolu mezi sloupci

**Funkcionalita:**
- Zobrazuje úkoly ve třech sloupcích podle stavu (otevřené, probíhající, dokončené)
- Implementuje logiku pro drag-and-drop operace
- Vizuálně indikuje aktuálně přetahovaný úkol a cílovou oblast
- Aktualizuje lokální stav při přetažení úkolu

### TaskColumn.jsx

Komponenta reprezentující jeden sloupec úkolů (jeden stav).

**Vlastnosti (props):**
- `title` - Název sloupce
- `tasks` - Pole úkolů, které mají být zobrazeny ve sloupci
- `state` - Číselný identifikátor stavu (0, 1, 2)
- `onDragStart`, `onDragOver`, `onDrop` - Handlery pro drag-and-drop události

**Funkcionalita:**
- Vizuálně reprezentuje jeden stav úkolů
- Přijímá drag-and-drop události a předává je nadřazené komponentě
- Zobrazuje vizuální indikaci při přetahování úkolu nad sloupcem

### TaskCard.jsx

Komponenta reprezentující jeden úkol ve sloupci.

**Vlastnosti (props):**
- `task` - Objekt úkolu obsahující jeho data
- `onDragStart` - Funkce volaná při zahájení přetahování
- `onClick` - Funkce volaná při kliknutí na úkol (obvykle otevře detail)

**Funkcionalita:**
- Zobrazuje základní informace o úkolu (název, priorita)
- Obsahuje atribut `draggable` pro umožnění přetahování
- Při přetahování mění vizuální styl pro indikaci aktuálního stavu

## Implementace drag-and-drop

Funkcionalita využívá nativní HTML5 Drag and Drop API

## Postup změny stavu úkolu

1. Uživatel uchopí kartu úkolu (TaskCard) ve zdrojovém sloupci
2. Přetáhne ji nad cílový sloupec
3. Když pustí kartu nad cílovým sloupcem, vyvolá se událost `drop`
4. Systém zpracuje událost:
   - Aktualizuje lokální stav UI pro okamžitou zpětnou vazbu
   - Přesune úkol do nového sloupce v UI
   - Odešle informaci o změně stavu do nadřazené komponenty

## Vizuální indikace při přetahování

- Přetahovaný úkol: Snížená průhlednost a transformace velikosti
- Cílový sloupec: Změna barvy pozadí pro indikaci akceptování přetahovaného úkolu
- Hranice mezi úkoly: Zvýrazněná linie pro indikaci konkrétního místa vložení

## Omezení

- Dokončené úkoly nelze přetahovat (jsou uzamčeny ve sloupci Dokončené)
- Přetahování funguje pouze v rámci jednoho seznamu úkolů

## Styly a vzhled

- Sloupce jsou uspořádány horizontálně vedle sebe
- Každý sloupec má odlišnou barvu záhlaví pro snadnou identifikaci
- Karty úkolů mají stínování a zaoblené rohy
- Při přetahování se aplikují vizuální efekty pomocí CSS tříd
