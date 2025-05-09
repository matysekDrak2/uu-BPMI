# Zobrazení detailu úkolu (Task Inspect)

## Přehled

Tato funkcionalita umožňuje uživatelům zobrazit detailní informace o konkrétním úkolu včetně jeho obsahu, komentářů a příloh. Po kliknutí na úkol v seznamu se otevře modální okno s detailními informacemi.

## Komponenty

### TaskDetailModal.jsx

Hlavní komponenta zodpovědná za zobrazení detailu úkolu.

**Vlastnosti (props):**
- `isOpen` - Boolean určující, zda je modální okno otevřené
- `task` - Objekt úkolu, který obsahuje všechny jeho informace
- `onClose` - Funkce, která se volá při zavření modálního okna

**Funkcionalita:**
- Zobrazuje detailní informace o úkolu (název, popis, priorita, termín)
- Umožňuje zobrazit a přidávat komentáře
- Poskytuje možnost stahovat přílohy

### TaskComments.jsx

Komponenta pro zobrazení a přidávání komentářů k úkolu.

**Vlastnosti (props):**
- `taskId` - ID úkolu, ke kterému se komentáře vztahují
- `comments` - Pole komentářů, které mají být zobrazeny

**Funkcionalita:**
- Zobrazuje seznam komentářů včetně informací o autorovi a času vytvoření
- Zobrazuje přílohy připojené ke komentářům
- Obsahuje formulář pro přidání nového komentáře
- Umožňuje přidat přílohu k novému komentáři

## Postup použití

1. Uživatel klikne na úkol v seznamu úkolů (TaskList)
2. Systém otevře modální okno s detailními informacemi úkolu
3. Zobrazí se následující informace:
   - Název úkolu
   - Popis úkolu
   - Priorita
   - Termín dokončení
   - Seznam komentářů
   - Přílohy spojené s komentáři
4. Uživatel může přidat nový komentář pomocí formuláře ve spodní části
5. K novému komentáři lze přidat přílohu kliknutím na ikonu přílohy
6. Po odeslání se komentář automaticky přidá do seznamu


## Stavová logika

1. Po kliknutí na úkol se jeho data načtou do stavu `selectedTask`
2. Stav `isDetailModalOpen` se nastaví na `true`, což způsobí zobrazení modálního okna
3. Při zavření modálního okna se stav `isDetailModalOpen` nastaví na `false`
4. Po úspěšném přidání komentáře se aktualizuje seznam komentářů

## Styly a vzhled

- Modální okno je centrováno na obrazovce s poloprůhledným překrytím pozadí
- Detail úkolu obsahuje záhlaví s názvem a tlačítkem pro zavření
- Popis, priorita a termín jsou přehledně zobrazeny ve struktuře
- Komentáře jsou zobrazeny chronologicky odspoda
- Přílohy jsou zobrazeny jako klikatelné odkazy se jménem souboru a ikonou
