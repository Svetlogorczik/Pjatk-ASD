---
id: t07
num: 7
type: topic
title: QuickSort, granica n log n i sortowanie w czasie liniowym
short: QuickSort i sortowania liniowe
desc: Szybkie sortowanie Hoare'a, podział (partition, Split, flaga polska), QuickSort bez rekursji ze stosem, drzewa decyzyjne i dolne ograniczenie, CountingSort, RadixSort i BucketSort.
sources: asd5.pdf (§2 QuickSort, §3 CountSort, RadixSort); asd6.pdf (QuickSort i stos); Dziel-RzadzC.pdf (Quicksort, FlagaPolska); Wyklady 2009/wyklad_5.pdf (drzewa decyzyjne), asd 08 wyklad_6.pdf (sortowanie w czasie liniowym)
exercises: asd 05.pdf (zad. 2, 5), asd 06.pdf (zad. 1, 3)
---

## QuickSort — szybkie sortowanie (Hoare, 1960)

QuickSort to jeden z najczęściej używanych algorytmów sortowania — dla „losowych” danych jest uważany za najszybszy. To kolejny przykład zasady **dziel i rządź**, ale z odwrotnym rozłożeniem pracy niż w MergeSort:

- w MergeSort **dzielenie jest trywialne** (na połowy), a cała praca to **scalanie**,
- w QuickSort cała praca to **podział** (partition), a „scalanie” jest **puste** — po posortowaniu obu części wszystko jest już na miejscu.

**Pomysł:**

1. wybierz element dzielący v (u nas: pierwszy element fragmentu),
2. **podziel** fragment tak, żeby v stanął na swoim ostatecznym miejscu j, a na lewo były elementy ≤ v, na prawo ≥ v (to jest znana z tematu 4 funkcja **partition**),
3. posortuj rekurencyjnie lewą część `a[l..j−1]` i prawą część `a[j+1..r]`.

```pseudo title="QuickSort (wykład)"
void QuickSort(int l, int r, IntCiag a)
// sortujemy a.ciag[l..r], l < r
{
  int j;
  j := partition(l, r);
  if j - 1 > l then QuickSort(l, j - 1, a);
  if r > j + 1 then QuickSort(j + 1, r, a);
}
```

:::def
**Poprawność** QuickSort opiera się na tym, że po `partition(l, r)`:
1. element v = a[j] stoi na swoim **ostatecznym** miejscu,
2. a[l..j−1] ≤ v,
3. v ≤ a[j+1..r].

Wtedy wystarczy (rekurencyjnie) posortować obie części niezależnie — nic już nie trzeba przenosić między nimi.
:::

**Przykład** dla `[9, 4, 7, 1, 8, 2, 6]` (w nawiasie — pivot na swoim miejscu):

```text title="Kolejne wywołania"
QS(0,6): pivot 9 → poz. 6   [6, 4, 7, 1, 8, 2, (9)]
  QS(0,5): pivot 6 → poz. 3 [1, 4, 2, (6), 8, 7, 9]
    QS(0,2): pivot 1 → poz. 0 [(1), 4, 2, 6, 8, 7, 9]
      QS(1,2): pivot 4 → poz. 2 [1, 2, (4), 6, 8, 7, 9]
    QS(4,5): pivot 8 → poz. 5 [1, 2, 4, 6, 7, (8), 9]
wynik: [1, 2, 4, 6, 7, 8, 9]
```

```java title="QuickSort.java"
@include t07-quicksort.java
```

### Analiza QuickSort

Wynik analizy z wykładu:

- **W(n) = ½n² + O(n)** — gdy pivot jest zawsze skrajny (np. dane **już posortowane**!), podział jest skrajnie nierówny (0 i n − 1),
- **Δ(n) = O(n²)**,
- **A(n) ≈ 1,4 · n log₂ n + O(n)** — średnio tylko o ok. 40% więcej porównań niż optymalne n log₂ n,
- **δ(n) ≈ 0,65 n** (odchylenie jest małe w porównaniu z n log n — algorytm zwykle działa blisko średniej).

:::warn
Paradoks QuickSortu: najgorszym przypadkiem dla wersji „pivot = pierwszy element” są dane **już posortowane** (albo posortowane odwrotnie) — wtedy działa kwadratowo, a głębokość rekursji wynosi n.
:::

### Jak uniknąć najgorszego przypadku? {own}

:::own
Te ulepszenia nie są omówione na slajdach — to standardowe praktyczne triki dopisane przez autora strony.
:::

- **Losowy pivot** — zamień a[l] z losowym elementem fragmentu przed partition. Wtedy żadne konkretne dane nie są „złośliwe”; oczekiwany czas O(n log n) dla każdych danych.
- **Mediana z trzech** — pivot = mediana z a[l], a[środek], a[r]. Chroni przed danymi posortowanymi.
- **Małe fragmenty** (np. < 10 elementów) sortuj InsertionSortem — dla nich jest szybszy.

## Inne sposoby podziału: Split i flaga polska

Funkcja partition z wykładu używa dwóch wskaźników idących do siebie. Na ćwiczeniach porównuje się ją z innym podziałem — **Split**.

:::info
Procedura **Split** pojawia się w zadaniach z ćwiczeń, ale nie ma jej na slajdach wykładu. Poniżej wersja spotykana w polskich podręcznikach (jednokierunkowa, pivot = pierwszy element). Jeśli prowadzący podał inną wersję — trzymaj się jego definicji.
:::

**Split(l, r):** v = a[l]; wskaźnik s oznacza koniec strefy „mniejszych od v”. Idziemy i od l+1 do r: jeśli a[i] < v, to przesuwamy s o 1 i zamieniamy a[s] z a[i]. Na koniec zamieniamy a[l] z a[s] — pivot staje na pozycji s.

```pseudo title="Split"
Split(a, l, r):
{
  v := a[l];  s := l;
  for i := l+1 to r do
    if a[i] < v then {
      s := s + 1;
      zamień(a[s], a[i])
    }
  zamień(a[l], a[s]);
  return s
}
```

Wykład „Dziel i rządź” nazywa podział algorytmem **flagi polskiej**: elementy „białe” (≤ A[l]) mają trafić na lewo, „czerwone” (≥ A[l]) na prawo — jak dwa kolory flagi (porównaj zadanie o robocie z kulami w temacie 2). Działa jak partition: i idzie od `l + 1` w prawo po elementach ≤ A[l], j idzie od `p` w lewo po elementach ≥ A[l], a elementy „nie po swojej stronie” są zamieniane. Na końcu `Zamien(l, j)` stawia element dzielący na miejscu j.

:::warn Uwaga od autora strony
Przy własnej implementacji uważaj na granice: pętla „idź w lewo, dopóki A[j] ≥ A[l]” musi się zatrzymać najpóźniej na pozycji l (sam A[l] spełnia warunek równości!). Wersja partition z wykładu asd5 (z `i <= r` i ostrymi nierównościami) jest pod tym względem bezpieczna.
:::

Wszystkie trzy wersje robią to samo (dzielą względem pivota w czasie liniowym) — różnią się liczbą zamian i tym, gdzie trafiają elementy równe v.

## QuickSort bez rekursji — stos

Wykład asd6 pyta: co naprawdę dzieje się przy wywołaniach rekurencyjnych? Każde wywołanie `QuickSort(l, r)` ma lokalne kopie `l, r, i, j, v, x`, które muszą być przechowane do powrotu. Szczęśliwie w QuickSorcie:

1. oba wywołania rekurencyjne są **niezależne** — mogą być wykonane w dowolnej kolejności,
2. są na **końcu** funkcji — więc jedno z nich można zastąpić **pętlą**, a parametry drugiego zapamiętać na **stosie**.

Na stosie trzymamy pary indeksów [l, r] podciągów, które trzeba jeszcze posortować. **Kładziemy na stos dłuższy podciąg, a krótszym zajmujemy się od razu.** Wtedy każdy kolejny podciąg na stosie jest co najmniej dwa razy krótszy od poprzedniego, więc na stosie jest naraz najwyżej ok. log₂ n par:

- **S(n) = O(log n)** dodatkowej pamięci.

Wersja iteracyjna jest w kodzie powyżej (`quickSortIterative`).

:::def
**Stos** (ang. stack) to abstrakcyjna struktura danych z operacjami: `push(x)` — włóż x na wierzch, `pop()` — zdejmij i zwróć ostatnio włożony element, `top()` — podejrzyj go bez zdejmowania, `size()`, `isEmpty()`. Zasada: **ostatni wszedł — pierwszy wyjdzie** (LIFO). Szczegóły w temacie 9.
:::

## Czy można sortować szybciej niż n log n? Drzewa decyzyjne

Każdy algorytm sortujący **przez porównania** (SelectionSort, InsertionSort, MergeSort, QuickSort, …) można narysować jako **drzewo decyzyjne**:

:::def
**Drzewo decyzyjne** dla ciągu n elementów: w węzłach wewnętrznych są porównania „aᵢ : aⱼ?”, każde porównanie ma dwa wyniki (lewy i prawy syn), a w **liściach** są wyniki — posortowane permutacje. Wykonanie algorytmu dla konkretnych danych to **ścieżka od korzenia do liścia**; liczba porównań = długość tej ścieżki.
:::

Drzewo decyzyjne dla n = 3 (elementy a, b, c):

```tree caption="Drzewo decyzyjne sortowania 3 elementów: w węźle „a:b” pytamy, czy a ≤ b (lewo = tak)."
a:b(b:c(abc,a:c(acb,cab)),a:c(bac,b:c(bca,cba)))
```

Rozumowanie z wykładu:

1. drzewo musi mieć co najmniej **n!** liści (każda z n! permutacji danych wymaga innej odpowiedzi),
2. drzewo binarne o wysokości h ma co najwyżej **2ʰ** liści,
3. więc 2ʰ ≥ n!, czyli **h ≥ log₂(n!)**.

A log₂(n!) = Θ(n log n) (ze wzoru Stirlinga: log₂ n! ≈ n log₂ n − 1,44 n).

:::def
**Twierdzenie:** każdy algorytm sortujący przez porównania wykonuje w najgorszym przypadku co najmniej **⌈log₂ n!⌉ = Ω(n log n)** porównań. Także **średnio** potrzeba co najmniej log₂ n! porównań.
:::

Wniosek: **MergeSort i HeapSort są asymptotycznie optymalne**, a QuickSort — średnio.

## Sortowanie w czasie liniowym — bez porównań

Twierdzenie o n log n dotyczy tylko algorytmów, które **porównują** elementy. Jeśli wiemy coś więcej o danych (np. że to małe liczby całkowite), możemy ich **nie porównywać** — i zejść do czasu liniowego!

### CountingSort — sortowanie przez zliczanie

Załóżmy, że sortujemy liczby całkowite z przedziału **0…m−1**. Dla każdej wartości j liczymy, ile razy występuje w ciągu (`count[j]`). Potem sumy prefiksowe mówią, **ile elementów jest ≤ j** — czyli gdzie kończy się miejsce na wartości j w wyniku.

```pseudo title="CountSort (wykład, w skrócie)"
for j := 0 to m-1 do count[j] := 0;
for i := 0 to n-1 do count[a[i]]++;             // count[j] = liczba wystąpień j
for j := 1 to m-1 do count[j] += count[j-1];    // count[j] = liczba elementów <= j
for i := n-1 downto 0 do {                       // od końca → stabilnie
  p := a[i];
  count[p]--;
  t[count[p]] := p;
}
for i := 0 to n-1 do a[i] := t[i];
```

**Przykład** dla `[3, 1, 4, 1, 5, 2, 6, 5, 3]` (m = 7):

| wartość j | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|---|
| count (wystąpienia) | 0 | 2 | 1 | 2 | 1 | 2 | 1 |
| count (sumy ≤ j) | 0 | 2 | 3 | 5 | 6 | 8 | 9 |

Wynik: `[1, 1, 2, 3, 3, 4, 5, 5, 6]`.

Analiza z wykładu:

- **W(n, m) = A(n, m) = O(n + m)**, Δ = δ = 0,
- **S(n, m) = n + m + O(1)** (tablica wynikowa t i tablica count),
- zalety: **szybkość**, gdy m = O(n); algorytm jest **stabilny** (dla stabilności istotne jest przeglądanie od a[n−1] do a[0]),
- wada: dodatkowa pamięć; nadaje się tylko dla **niedużych m**.

### RadixSort — sortowanie pozycyjne

Dla dużych m dzielimy klucze na części (cyfry albo grupy bitów) i sortujemy **stabilnym** CountingSortem **najpierw względem ostatniej (najmniej znaczącej) cyfry**, potem przedostatniej, …, na końcu względem pierwszej. Stabilność jest kluczowa: jeśli pierwsze cyfry są równe, o kolejności decydują dalsze — a te zostały już dobrze ustawione we wcześniejszych przebiegach.

- dla n liczb o d cyfrach w systemie o podstawie k: **O(d · (n + k))**.

```java title="LinearSorts.java"
@include t07-counting.java
```

### BucketSort — sortowanie kubełkowe

Ze slajdów 2009: jeśli liczby mają **rozkład równomierny** na przedziale [0, 1), dzielimy go na n równych **kubełków**, wrzucamy każdą liczbę do jej kubełka (kubełek ⌊n·x⌋), sortujemy kubełki (są małe — średnio po 1 elemencie) i sklejamy. **Średnio O(n)**, pesymistycznie tyle, ile sortowanie jednego pełnego kubełka.

## Podsumowanie algorytmów sortowania {own}

:::own
Zbiorcza tabela przygotowana przez autora strony na podstawie wyników z wykładów.
:::

| Algorytm | Najgorzej | Średnio | Dodatkowa pamięć | Stabilny |
|---|---|---|---|---|
| SelectionSort | n²/2 | n²/2 | O(1) | nie |
| InsertionSort | n²/2 | n²/4 | O(1) | tak |
| MergeSort | n log n | n log n | O(n) | tak |
| QuickSort | n²/2 | 1,4 n log n | O(log n) (stos) | nie |
| HeapSort (temat 12) | 2n log n | ~2n log n | O(1) | nie |
| CountingSort | O(n + m) | O(n + m) | O(n + m) | tak |
| RadixSort | O(d(n + k)) | O(d(n + k)) | O(n + k) | tak |

=== summary ===

## QuickSort

- partition (pivot = a[l]) → pivot na miejscu j; rekurencja na a[l..j−1] i a[j+1..r]; „scalanie” puste.
- **W(n) = ½n² + O(n)** (dane posortowane!), **A(n) ≈ 1,4 n log n**, δ ≈ 0,65n, niestabilny.
- bez rekursji: stos par [l, r]; **na stos dłuższy, od razu krótszy** → S(n) = O(log n).
- ulepszenia (od autora): losowy pivot, mediana z trzech, InsertionSort dla małych fragmentów.

## Podziały

- **partition** — dwa wskaźniki do siebie; **Split** — jeden wskaźnik s (strefa < v), na końcu zamiana a[l] z a[s]; **flaga polska** — ≤ v na lewo, ≥ v na prawo.

## Dolne ograniczenie

- drzewo decyzyjne: ≥ n! liści, wysokość h ≥ log₂ n! = **Ω(n log n)** — dla każdego sortowania przez porównania (pesymistycznie i średnio).

## Sortowania liniowe (bez porównań)

- **CountingSort:** klucze 0…m−1; count → sumy prefiksowe → od końca do t; O(n + m), S = n + m, **stabilny**.
- **RadixSort:** stabilnie po cyfrach od najmniej znaczącej; O(d(n + k)).
- **BucketSort:** rozkład równomierny na [0,1), n kubełków; średnio O(n).

=== tasks ===

:::task level=2 source="Ćwiczenie 5, zad. 2 (zmienione)" title="Split i Partition na tej samej tablicy"
Przedstaw działanie procedur **Split** i **Partition** (obie z pivotem = pierwszy element) na tablicy

`[10, 4, 15, 12, 3, 11, 8, 16, 5, 6, 13]`.

Podaj stan tablicy po każdej zamianie i końcową pozycję pivota.
::hint
Split: s zaczyna od 0, i idzie od 1 do 10; zamiana tylko gdy a[i] < 10. Partition: i idzie od lewej do elementu ≥ 10, j od prawej do elementu ≤ 10.
::solution
**Split** (v = 10, s — koniec strefy „< 10”):

| i | a[i] | s | tablica |
|---|---|---|---|
| 1 | 4 | 1 | 10, 4, 15, 12, 3, 11, 8, 16, 5, 6, 13 (zamiana a[1] z a[1]) |
| 4 | 3 | 2 | 10, 4, **3**, 12, **15**, 11, 8, 16, 5, 6, 13 |
| 6 | 8 | 3 | 10, 4, 3, **8**, 15, 11, **12**, 16, 5, 6, 13 |
| 8 | 5 | 4 | 10, 4, 3, 8, **5**, 11, 12, 16, **15**, 6, 13 |
| 9 | 6 | 5 | 10, 4, 3, 8, 5, **6**, 12, 16, 15, **11**, 13 |
| koniec | | 5 | zamiana a[0] z a[5]: **6, 4, 3, 8, 5, 10, 12, 16, 15, 11, 13** |

Pivot 10 na pozycji **5**. Zamian: 5 (+ końcowa).

**Partition** (v = 10):

| krok | i | j | tablica po zamianie |
|---|---|---|---|
| 1 | 2 (15) | 9 (6) | 10, 4, **6**, 12, 3, 11, 8, 16, 5, **15**, 13 |
| 2 | 3 (12) | 8 (5) | 10, 4, 6, **5**, 3, 11, 8, 16, **12**, 15, 13 |
| 3 | 5 (11) | 6 (8) | 10, 4, 6, 5, 3, **8**, **11**, 16, 12, 15, 13 |
| 4 | 6 (11) | 5 (8) | minęły się — koniec pętli |
| koniec | | | a[0] ↔ a[5]: **8, 4, 6, 5, 3, 10, 11, 16, 12, 15, 13** |

Pivot 10 też na pozycji **5** (musi — to jego miejsce w posortowanym ciągu), ale kolejność pozostałych elementów jest inna. Partition wykonała tylko **3** zamiany.
:::

:::task level=2 source="Ćwiczenie 5, zad. 5 / Ćwiczenie 6, zad. 1 (zmienione)" title="QuickSort krok po kroku"
Przedstaw działanie algorytmu **QuickSort** (z partition z wykładu) na ciągu

`[12, 5, 3, 14, 8, 19, 6, 1, 15, 17, 16, 2, 13, 5, 27, 22]`.

Wypisz kolejne wywołania QS(l, r), pozycję, na którą trafia pivot, i stan fragmentu po podziale.
::hint
Pierwszy podział (pivot 12) już znasz z zadania o algorytmie Hoare'a w temacie 4. Najpierw kończysz całą lewą część, potem prawą.
::solution
```text
QS(0,15): pivot 12 → 7   [1, 5, 3, 5, 8, 2, 6, (12), 15, 17, 16, 19, 13, 14, 27, 22]
  QS(0,6): pivot 1 → 0    [(1), 5, 3, 5, 8, 2, 6]
    QS(1,6): pivot 5 → 3  [2, 3, (5), 8, 5, 6]          (fragment a[1..6])
      QS(1,2): pivot 2 → 1  [(2), 3]
      QS(4,6): pivot 8 → 6  [6, 5, (8)]
        QS(4,5): pivot 6 → 5  [5, (6)]
  QS(8,15): pivot 15 → 10 [13, 14, (15), 19, 16, 17, 27, 22]
    QS(8,9): pivot 13 → 8   [(13), 14]
    QS(11,15): pivot 19 → 13 [17, 16, (19), 27, 22]
      QS(11,12): pivot 17 → 12 [16, (17)]
      QS(14,15): pivot 27 → 15 [22, (27)]
wynik: [1, 2, 3, 5, 5, 6, 8, 12, 13, 14, 15, 16, 17, 19, 22, 27]
```
Fragmenty jednoelementowe nie są już wywoływane (warunki `j−1 > l` oraz `r > j+1`).
:::

:::task level=1 source="Ćwiczenie 6, zad. 3 (zmienione)" title="CountingSort"
Przedstaw działanie algorytmu **CountingSort** na ciągu

`[2, 3, 1, 4, 4, 3, 5, 1, 2, 4, 6, 3, 2, 5, 1, 4, 3, 6, 2, 4]` (wartości 1…6, m = 7).

Podaj tablicę `count` po zliczeniu, po sumach prefiksowych i ciąg wynikowy.
::hint
Najpierw policz, ile razy występuje każda wartość. Sumy prefiksowe: count[j] := count[j] + count[j−1].
::solution
| j | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|---|
| count po zliczeniu | 0 | 3 | 4 | 4 | 5 | 2 | 2 |
| count po sumach (≤ j) | 0 | 3 | 7 | 11 | 16 | 18 | 20 |

Interpretacja: wartości 1 zajmą pozycje 0–2, wartości 2 — pozycje 3–6, wartości 3 — 7–10, wartości 4 — 11–15, wartości 5 — 16–17, wartości 6 — 18–19.

Wynik: `[1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 6, 6]`.

Przeglądając dane od końca (a[19] = 4 trafia na pozycję count[4]−1 = 15, potem a[18] = 2 na pozycję 6, …), zachowujemy kolejność równych elementów — sortowanie jest stabilne.
:::

:::task level=2 source="own" title="Najgorszy przypadek QuickSortu"
Ile porównań elementów wykona QuickSort z wykładu dla danych **już posortowanych** `[1, 2, 3, 4, 5, 6, 7, 8]`? Jaka będzie głębokość rekursji? Co zmieniłby losowy wybór pivota?
::hint
Dla posortowanego fragmentu długości m pivot jest najmniejszy: wskaźnik i zatrzymuje się od razu, a j przechodzi cały fragment.
::solution
Dla fragmentu długości m partition wykonuje **m + 1** porównań (1 po stronie i, m po stronie j), a pivot zostaje na początku — kolejny fragment ma długość m − 1. Razem dla m = 8, 7, …, 2:

9 + 8 + 7 + 6 + 5 + 4 + 3 = **42 porównania**, głębokość rekursji **7** (= n − 1). To właśnie W(n) = ½n² + O(n).

Z losowym pivotem posortowane dane przestają być „złośliwe”: oczekiwana liczba porównań to ≈ 1,4 n log₂ n, a oczekiwana głębokość rekursji — O(log n).
:::

:::task level=1 source="own" title="Drzewo decyzyjne"
Ile liści musi mieć drzewo decyzyjne dowolnego algorytmu sortującego przez porównania dla **n = 4** elementów? Jaka jest minimalna możliwa wysokość tego drzewa (czyli minimalna pesymistyczna liczba porównań)? A dla n = 5?
::hint
Liczba liści ≥ n!, a drzewo binarne o wysokości h ma ≤ 2ʰ liści.
::solution
- n = 4: co najmniej **4! = 24** liście; 2ʰ ≥ 24 ⇒ h ≥ ⌈log₂ 24⌉ = **5** porównań.
- n = 5: **120** liści; ⌈log₂ 120⌉ = **7** porównań.

(Dla n = 5 istnieje algorytm, który rzeczywiście sortuje za pomocą 7 porównań — granica jest osiągalna.)
:::

:::task level=2 source="own" title="RadixSort"
Posortuj algorytmem **RadixSort** (cyfry dziesiętne, od najmniej znaczącej, stabilne sortowanie w każdym przebiegu) ciąg

`[512, 38, 407, 263, 91, 145, 700, 386]`.

Podaj ciąg po każdym przebiegu.
::hint
Traktuj liczby jako trzycyfrowe: 038, 091. W każdym przebiegu przy równych cyfrach zachowaj kolejność z poprzedniego przebiegu.
::solution
- po cyfrze jedności: `700, 091, 512, 263, 145, 386, 407, 038`
- po cyfrze dziesiątek: `700, 407, 512, 038, 145, 263, 386, 091`
- po cyfrze setek: `038, 091, 145, 263, 386, 407, 512, 700` ✓

Zauważ w drugim przebiegu: 700 i 407 mają tę samą cyfrę dziesiątek (0) — zostają w kolejności z poprzedniego przebiegu (700 przed 407). Właśnie dlatego potrzebna jest stabilność.
:::
