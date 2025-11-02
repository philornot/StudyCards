# Study Cards - Przewodnik Użytkownika

## Wprowadzenie

Study Cards to aplikacja do efektywnej nauki wykorzystująca technikę fiszek (flashcards) oraz algorytm spaced repetition (powtarzania w odstępach czasu).

## Jak zacząć?

### 1. Tworzenie zestawu

1. Kliknij przycisk "Utwórz zestaw" na stronie głównej
2. Wypełnij tytuł zestawu (wymagane) i opcjonalny opis
3. Dodaj fiszki - minimum jedna fiszka jest wymagana
4. Każda fiszka składa się z:
   - **Pojęcia** (term) - pytanie lub słowo do nauki
   - **Definicji** (definition) - odpowiedź lub tłumaczenie
5. Kliknij "Zapisz zestaw"

### 2. Tryby nauki

#### Tryb Fiszek (Flashcards)
- Klasyczna nauka z kartami do przerzucania
- Kliknij fiszkę lub naciśnij Spację, aby zobaczyć odpowiedź
- Nawiguj strzałkami ← → lub przyciskami
- Idealny do szybkiego przejrzenia materiału

#### Tryb Spaced Repetition (SR)
- Inteligentny system powtórek
- Algorytm SM-2 dostosowuje harmonogram do Twoich potrzeb
- Po obejrzeniu odpowiedzi oceń trudność:
  - **Again** (1/Z) - nie pamiętam, resetuje postęp
  - **Hard** (2/X) - trudne, skraca interwał
  - **Good** (3/C) - dobrze, standardowy interwał
  - **Easy** (4/V) - łatwo, wydłuża interwał

## Jak działa Spaced Repetition?

### Algorytm SM-2

Study Cards używa sprawdzonego algorytmu SuperMemo 2:

1. **Nowe fiszki** zaczynają z ease factor = 2.5
2. Po każdej ocenie:
   - Fiszka dostaje nowy **interwał** (ile dni do następnej powtórki)
   - **Ease factor** się zmienia (trudność fiszki)
   - **Liczba powtórzeń** rośnie

3. Im lepiej pamiętasz, tym dłuższe interwały:
   - Po ocenie "Good": 1 dzień → 6 dni → 15 dni → 37 dni...
   - Po ocenie "Easy": jeszcze dłuższe interwały
   - Po ocenie "Again": reset do początku

### Kategorie fiszek

- **Nowe** ✨ - nigdy nie przeglądane
- **W nauce** 📖 - < 3 powtórzenia lub ease < 2.0
- **Opanowane** ⭐ - ≥ 3 powtórzenia i ease ≥ 2.0

## Statystyki

Na stronie szczegółów zestawu znajdziesz:
- Liczbę fiszek w każdej kategorii
- Średnią trudność (ease factor)
- Dokładność odpowiedzi (% Good/Easy)
- Liczbę przeglądów (dzisiaj/w tym tygodniu/ogółem)
- Streak (ile dni pod rząd się uczysz) 🔥

## Wskazówki

### Efektywna nauka

1. **Regularność** - ucz się codziennie, nawet jeśli tylko 10 minut
2. **Oceniaj szczerze** - jeśli nie pamiętasz, kliknij "Again"
3. **Nie pomiń powtórek** - zaległe fiszki pojawiają się pierwsze
4. **Limit nowych fiszek** - domyślnie 20/dzień, aby nie przytłoczyć

### Tworzenie dobrych fiszek

1. **Jedna idea na fiszkę** - nie łącz wielu pojęć
2. **Używaj prostego języka**
3. **Dodawaj kontekst** gdy potrzebny
4. **Regularnie aktualizuj** - poprawiaj niejasne fiszki

### Skróty klawiszowe

#### Tryb Fiszek
- `Spacja` - odwróć fiszkę
- `←` - poprzednia fiszka
- `→` lub `Enter` - następna fiszka
- `Esc` - zakończ naukę

#### Tryb SR
- `Spacja` - odwróć fiszkę
- `1` lub `Z` - Again
- `2` lub `X` - Hard
- `3` lub `C` - Good
- `4` lub `V` - Easy
- `Esc` - zakończ naukę

## FAQ

**Q: Jak często powinienem się uczyć?**
A: Najlepiej codziennie. System pokazuje tylko fiszki, które są "due" (należy je powtórzyć).

**Q: Co jeśli nie mam czasu na wszystkie fiszki?**
A: Zaległe fiszki są pokazywane w pierwszej kolejności. Zrób ile możesz - każda powtórka się liczy!

**Q: Mogę zresetować postęp?**
A: Tak, w menu zestawu jest opcja "Resetuj postęp". UWAGA: to jest nieodwracalne!

**Q: Jak długo trwa nauka zestawu?**
A: Zależy od liczby fiszek i Twojej pamięci. Zazwyczaj po 2-3 tygodniach regularnej nauki większość fiszek będzie opanowana.

**Q: Co oznaczają gwiazdki przy trudności?**
A: Więcej gwiazdek = łatwiejsza fiszka dla Ciebie. To ease factor wizualizowany (1.3 = 1★, 2.5 = 5★).

## Wsparcie

Jeśli masz pytania lub napotkasz problemy:
- Sprawdź dokumentację w repozytorium
- Zgłoś issue na GitHubie
- Skontaktuj się z zespołem deweloperskim

## Powodzenia w nauce! 🎓
