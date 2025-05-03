# Vytváření úkolu (Task Create)

## Přehled

Tato funkcionalita umožňuje uživatelům vytvářet nové úkoly v rámci seznamu úkolů. Vytváření úkolů je základní funkcí pro efektivní plánování práce a řízení projektových úkolů.

## Komponenty

### CreateTaskModal.jsx

Modální okno s formulářem pro vytvoření nového úkolu.

**Vlastnosti (props):**
- `isOpen` - Boolean určující, zda je modální okno otevřené
- `taskListId` - ID seznamu úkolů, do kterého bude nový úkol přidán
- `onClose` - Funkce, která se volá při zavření modálního okna 
- `onTaskCreate` - Callback funkce, která se volá po úspěšném vytvoření úkolu

**Funkcionalita:**
- Zobrazuje formulář pro zadání údajů o novém úkolu:
  - Název úkolu (povinný)
  - Popis úkolu
  - Priorita (nízká, normální, vysoká)
  - Termín dokončení
- Validuje vstupní data před odesláním
- Zpracovává formátování textového obsahu úkolu

## Postup použití

1. Uživatel klikne na tlačítko "Vytvořit úkol" v komponentě TaskList
2. Otevře se modální okno s formulářem CreateTaskModal
3. Uživatel vyplní formulář:
   - Zadá název úkolu (povinné pole)
   - Volitelně doplní popis úkolu
   - Zvolí prioritu z rozbalovacího seznamu (výchozí hodnota: normální)
   - Volitelně nastaví termín dokončení pomocí datepickeru
4. Kliknutím na tlačítko "Vytvořit" se úkol vytvoří
5. Po úspěšném vytvoření se modální okno zavře a nový úkol se objeví v seznamu otevřených úkolů

## Formát dat

Při vytvoření úkolu se shromažďují následující údaje:

```jsx
const taskData = {
  name: "Název úkolu",
  description: "Podrobný popis úkolu",
  priority: "normal", // "low", "normal", "high"
  dueDate: "2023-05-15" // ISO formát data
};

// Formátování dat do textové podoby
const formattedText = `Název: ${taskData.name}\nPopis: ${taskData.description}\nPriorita: ${taskData.priority}\nTermín: ${taskData.dueDate}`;
```

## Stavová logika

1. Stav `isOpen` určuje, zda je modální okno viditelné
2. Lokální stav formuláře uchovává hodnoty zadané uživatelem
3. Validace se provádí před odesláním a zobrazuje chybové zprávy u neplatných polí
4. Po úspěšném vytvoření úkolu se volá callback `onTaskCreate` a modální okno se zavře

## Styly a vzhled

- Modální okno je centrováno na obrazovce s překrytím pozadí
- Formulářová pole jsou uspořádána vertikálně pod sebou
- Validační chyby jsou zobrazeny červeně pod příslušnými poli
- Tlačítka "Zrušit" a "Vytvořit" jsou umístěna ve spodní části

