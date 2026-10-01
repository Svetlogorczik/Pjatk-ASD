---
id: howto
type: page
title: Jak uczyć się ASD w 2026/2027 — plan i dobre nawyki
short: Jak się uczyć
icon: 💡
eyebrow: Rekomendacje autora strony
desc: Plan nauki pod wykłady M. Sydowa (2026/2027), wejściówki i oba sprawdziany, sposób pracy z konspektami i testami próbnymi, typowe błędy.
---

:::own
Cała ta strona to **rekomendacje autora strony** — nie pochodzą z wykładów ani z zasad zaliczenia ([Zaliczenie przedmiotu](page:course)).
:::

## Plan na semestr (kolejność wykładów 2026/2027)

Wejściówka na ćwiczeniach dotyczy **poprzedniego wykładu** — po każdym wykładzie przerób odpowiedni temat i jego konspekt.

| Wykład | Temat na stronie | Wejściówka próbna | Na co zwrócić uwagę |
|---|---|---|---|
| 1. Poprawność | [2](topic:t02) | W1 | definicje, stop, niezmiennik |
| 2. Złożoność | [3](topic:t03) | W2 | W, A, S, 5 notacji, dowód z definicji |
| 3. Wyszukiwanie | [4](topic:t04) | W3 | kod `search`, turniej, Hoare |
| 4. Sortowanie 1 | [5](topic:t05), [6](topic:t06) | W4 | selection, insertion, mergeSort (`m = len/2`) |
| 5. Sortowanie 2 | [7](topic:t07) | W5 | partition, CountSort, RadixSort, stabilność |
| 6. Rekurencja | [6](topic:t06) | W6 | Hanoi, 3 schematy, tw. uniwersalne |
| 7. Listy, ADS | [9](topic:t09) | W7 | stos, kolejka, deque, splice |
| 8. Kolejka priorytetowa | [12](topic:t12) | W8 | kopiec **min** od indeksu 1, construct |
| 9. Słowniki | [10](topic:t10), [11](topic:t11) | W9 | BST insert/delete, haszowanie, bf w AVL |
| 10. Grafy | [13](topic:t13) | W10 | definicje, reprezentacje |
| 10b. Przeglądanie | [10](topic:t10), [13](topic:t13) | W11 | pre/in/post-order, BFS, DFS, d/f |
| 12. Najkrótsze ścieżki | [14](topic:t14) | W12 | relaksacja, Dijkstra, Bellman-Ford |
| MST | [14](topic:t14) | W13 | Kruskal, Prim, remisy alfabetycznie |

Wejściówki próbne: [Testy próbne](page:mock).

## Jak pracować z jednym tematem

1. **Po wykładzie:** przeczytaj sekcję „wersja z wykładu 2026/2027” w temacie — to jest obowiązujący materiał.
2. **Konspekt** (przycisk na górze tematu) — 5 minut: definicje, wzory, typowe błędy. Przeczytaj go **przed każdą wejściówką**.
3. **Zadania** z końca tematu: najpierw sam(a), podpowiedź po 5–10 minutach.
4. **Wejściówka próbna** z [Testów próbnych](page:mock) — sprawdź się w 5 minut.
5. Po tygodniu wróć do konspektu — powtórka po czasie działa lepiej niż jednorazowa nauka.

## Przygotowanie do sprawdzianów

:::tip Sprawdzian praktyczny (20 p., próg 10)
- przejdź **wszystkie typy zadań** na stronie [Sprawdziany 2026/2027](page:exams),
- rozwiąż **oba warianty** próbnego sprawdzianu na [Testach próbnych](page:mock) — na czas, bez notatek,
- przy każdym algorytmie zapisuj stan po **każdym kroku** (tabelka l/r/m, tablica po przebiegu, kopiec po operacji).
:::

:::tip Sprawdzian wiedzy (20 p., próg 10)
- naucz się **na pamięć** definicji z tematów [2](topic:t02) i [3](topic:t03) i specyfikacji algorytmów,
- ćwicz **analizę kodu** (operacja dominująca + rozmiar danych + W/A/S) i **pisanie pseudokodu**,
- rozwiąż [próbny sprawdzian wiedzy](page:mock) i porównaj z wzorcowymi odpowiedziami,
- przejrzyj [ściągę](page:cheatsheet) — wszystkie złożoności w jednym miejscu.
:::

## Typowe błędy (i jak ich uniknąć)

- **Brak operacji dominującej i rozmiaru danych** w analizie — analiza jest wtedy niepełna.
- **Mylenie W(n) z A(n)** — pesymistyczna to najgorsze dane, przeciętna to wartość oczekiwana.
- **MergeSort:** lewa połowa jest **krótsza** (`m = len/2`); porównań nie liczy się przy przepisywaniu reszty.
- **partition:** zapomniany **ostatni** swap (wstawienie pivota).
- **CountSort:** faza 3 od **końca**; `counts` obejmuje też wartości, których nie ma.
- **Kopiec:** indeksy od **1**, typ **min**; `construct` daje inny kopiec niż n × `insert`.
- **BST:** równy klucz idzie **w prawo**; przy usuwaniu nie myl poprzednika z następnikiem.
- **Grafy:** sąsiedzi i remisy (Kruskal, Prim) — **alfabetycznie**; w DFS `time` od 0.

## Materiał poza programem 2026/2027 {own}

Tematy z 2025/2026, których nie ma na slajdach M. Sydowa: [Karacuba i FFT](topic:t08), rotacje AVL, kopiec lewicowy, Huffman, problem plecakowy, wybór zajęć, algorytm Euklidesa. Zostały na stronie jako materiał dodatkowy — **nie musisz się ich uczyć** na sprawdziany 2026/2027.
