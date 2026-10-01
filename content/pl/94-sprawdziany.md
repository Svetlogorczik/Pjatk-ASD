---
id: exams
type: page
title: Sprawdziany 2026/2027 — praktyczny i wiedzy
short: Sprawdziany 2026/2027
icon: 📝
eyebrow: Przygotowanie do zaliczenia · 2026/2027
desc: Typy zadań dopuszczeniowych (binSearch, MergeSort, partition, CountSort, kopiec, a^b), oficjalne przykładowe dane rozwiązane krok po kroku, wersje algorytmów zgodne z odpowiedziami, zadania treningowe i wskazówki do sprawdzianu wiedzy.
---

:::info Skąd jest ta strona
**Treści zadań, przykładowe dane z wynikami i wskazówki do części teoretycznej** pochodzą z materiałów prowadzącego na rok 2026/2027 (M. Sydow). **Rozpisanie rozwiązań krok po kroku, pseudokody i zadania treningowe** przygotował autor strony — każdy wynik został sprawdzony programem symulującym algorytm. Zasady punktacji: [Zaliczenie przedmiotu](page:course).
:::

:::warn Wersje algorytmów
Prowadzący wymaga **dokładnie wersji algorytmów ze slajdów**. Pseudokody poniżej autor strony dobrał tak, żeby dawały **dokładnie oficjalne przykładowe odpowiedzi** — ale to nie są kopie slajdów. Jeśli slajd mówi inaczej, **obowiązuje slajd**. Szczególnie porównaj: sposób wyboru środka w binSearch i MergeSort, zachowanie partition dla elementów równych pivotowi oraz kierunek ostatniej pętli w CountSort.
:::

## Jak wyglądają zadania dopuszczeniowe

Na sprawdzianie praktycznym jest ok. 10 zadań, głównie na **znajomość działania algorytmów**. Oficjalna lista typów zadań dopuszczeniowych:

| # | Zadanie | Co trzeba podać |
|---|---|---|
| 1 | **Binary Search** na tablicy S, klucz Key | a) indeksy elementów porównywanych z Key (po kolei), b) zwróconą wartość |
| 2 | **Merge Sort** (wersja z wykładu) | a) łączną liczbę porównań między elementami, b) ciągi lewy i prawy przy **ostatnim** wywołaniu `merge()` |
| 3 | **partition()** z QuickSort (wersja z wykładu) | a) zwrócony indeks, b) pierwszy element tablicy po partition, c) liczbę `swap()` — **łącznie z ostatnim** |
| 4 | **Count Sort** (wersja z wykładu) | tablicę `counts` (zakres 0..max) a) po zliczaniu, b) po sumowaniu, c) po wypisaniu do tablicy wyjściowej |
| 5 | **Kopiec binarny typu min** (tablica od indeksu 1) | a) po kolejnych `insert()` elementów S, b) jak a) + `delMin()`, c) po jednym `construct()` z S |
| 6 | prosty algorytm **a^b** | a) specyfikacja, b) pseudokod (b-krotne mnożenie) |
| 7 | ciąg dalszy 6 | c) analiza **poprawności całkowitej**, d) złożoność **czasowa i pamięciowa** (operacja dominująca, rozmiar danych!) |

Pełny zakres sprawdzianu praktycznego: rzędy funkcji / notacja O, binSearch, selection sort, insertion sort, mergeSort, quickSort/partition, countSort, radixSort, minHeap, BST, in/pre/post-order, BFS/DFS, Kruskal.

## 1. Binary Search

```pseudo
binSearch(S, len, key){
  l = 0
  r = len - 1
  while(l <= r){
    m = (l + r) / 2          // dzielenie całkowite (w dół)
    if(S[m] == key) return m
    if(S[m] < key) l = m + 1
    else r = m - 1
  }
  return -1                  // brak klucza
}
```

**Oficjalny przykład:** S = 7, 13, 17, 25, 30, 41, 52, 58, 60, 61, 80, 85; Key = 60.

```array
@idx
S: 7 13 17 25 30 [41] 52 58 60 61 80 85
```

| Krok | l | r | m | S[m] | Decyzja |
|---|---|---|---|---|---|
| 1 | 0 | 11 | **5** | 41 | 41 < 60 → l = 6 |
| 2 | 6 | 11 | **8** | 60 | znaleziono → return 8 |

**Odpowiedź:** a) **5, 8**; b) **8**.

:::tip
Na sprawdzianie zawsze zapisuj tabelkę l, r, m — jedna pomyłka w dzieleniu (np. (6+11)/2 = 8, nie 9) psuje cały wynik. Przy braku klucza zwracane jest −1, a indeksów porównań jest ok. log₂ n.
:::

## 2. Merge Sort

```pseudo
mergeSort(S, l, r){
  if(l < r){
    m = (l + r) / 2          // lewa połowa S[l..m] jest o 1 dłuższa przy nieparzystej długości
    mergeSort(S, l, m)
    mergeSort(S, m + 1, r)
    merge(S, l, m, r)        // scala posortowane S[l..m] i S[m+1..r]
  }
}
```

`merge` porównuje pierwsze elementy obu ciągów i przepisuje mniejszy; **gdy jeden ciąg się skończy, resztę drugiego przepisuje bez porównań**. Liczba porównań w jednym `merge` = liczba elementów wypisanych, zanim któryś ciąg się wyczerpie.

**Oficjalny przykład:** S = 6, 2, 4, 0, 3, 8, 7, 5.

| Wywołanie merge | Wynik | Porównania |
|---|---|---|
| (6) + (2) | 2, 6 | 1 |
| (4) + (0) | 0, 4 | 1 |
| (2, 6) + (0, 4) | 0, 2, 4, 6 | 3 (0<2, 2<4, 4<6; potem 6 bez porównania) |
| (3) + (8) | 3, 8 | 1 |
| (7) + (5) | 5, 7 | 1 |
| (3, 8) + (5, 7) | 3, 5, 7, 8 | 3 (3<5, 5<8, 7<8; potem 8) |
| **(0, 2, 4, 6) + (3, 5, 7, 8)** | 0, 2, 3, 4, 5, 6, 7, 8 | 6 (lewy kończy się po 6; 7, 8 bez porównań) |

**Odpowiedź:** a) 1+1+3+1+1+3+6 = **16**; b) ostatni merge: **0, 2, 4, 6 | 3, 5, 7, 8**.

:::tip
Ostatni `merge()` zawsze scala **dwie posortowane połowy całej tablicy** — wystarczy posortować osobno lewą i prawą połowę. Liczba porównań w merge ciągów długości p i q jest między min(p, q) a p + q − 1.
:::

## 3. partition() z QuickSort

Pivotem jest **pierwszy element**. Dwa indeksy idą do siebie: lewy szuka elementu **większego** od pivota, prawy — **mniejszego**; jeśli się nie minęły, zamieniamy. Na końcu pivot wymieniamy z elementem na granicy (to też jest `swap`).

```pseudo
partition(a, l, r){
  m = a[l]                   // pivot
  i = l + 1
  j = r
  do{
    while(i < r && a[i] <= m) i++
    while(j > i && a[j] >= m) j--
    if(i < j) swap(a, i, j)
  } while(i < j)
  if(a[i] > m) p = i - 1
  else p = i
  swap(a, l, p)              // ostatni swap — liczy się!
  return p
}
```

**Oficjalny przykład:** S = 6, 5, 9, 4, 8, 3, 1, 7, 2, 0 (pivot 6).

```array
@idx
start: (6) 5 [9] 4 8 3 1 7 2 [0]
swap 1: (6) 5 0 4 [8] 3 1 7 [2] 9
swap 2: (6) 5 0 4 2 3 [1] [7] 8 9
swap 3: 1 5 0 4 2 3 {6} 7 8 9
```

1. i zatrzymuje się na 9 (indeks 2), j na 0 (indeks 9) → swap(2, 9).
2. i zatrzymuje się na 8 (indeks 4), j na 2 (indeks 8) → swap(4, 8).
3. i przechodzi przez 2, 3, 1 i staje na 7 (indeks 7); j schodzi do i — koniec pętli. a[7] = 7 > 6, więc p = 6 → swap(0, 6).

**Odpowiedź:** a) **6**; b) **1**; c) **3** swapy.

:::tip Szybkie sprawdzenie
Zwrócony indeks = **liczba elementów mniejszych od pivota** (gdy elementy są różne): w przykładzie 5, 4, 3, 1, 2, 0 → 6. Liczba swapów = liczba zamian „par” + 1.
:::

## 4. Count Sort

```pseudo
countSort(S, len, k){        // elementy z zakresu 0..k
  counts[0..k] = 0
  // faza 1: zliczanie
  for(i = 0; i < len; i++) counts[S[i]]++
  // faza 2: sumowanie (sumy prefiksowe)
  for(j = 1; j <= k; j++) counts[j] += counts[j - 1]
  // faza 3: wypisywanie od końca (dzięki temu sortowanie jest stabilne)
  for(i = len - 1; i >= 0; i--){
    counts[S[i]]--
    result[counts[S[i]]] = S[i]
  }
  return result
}
```

**Oficjalny przykład:** S = 2, 2, 4, 2, 5, 3, 5, 2, 1, 0, 1, 5, 0, 2, 0 (max = 5, więc counts ma indeksy 0..5).

| Indeks | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| a) po zliczaniu | 3 | 2 | 5 | 1 | 1 | 3 |
| b) po sumowaniu | 3 | 5 | 10 | 11 | 12 | 15 |
| c) po wypisaniu | 0 | 3 | 5 | 10 | 11 | 12 |

:::tip
Po fazie 3 każde `counts[v]` jest zmniejszone dokładnie tyle razy, ile razy v występuje — więc c) to po prostu b) **przesunięte o jedno miejsce w prawo** z 0 na początku (= indeks, od którego zaczynają się v w wyniku). Ostatnia wartość b) to zawsze len.
:::

## 5. Kopiec binarny typu min

Kopiec w tablicy od **indeksu 1**: dzieci węzła i to 2i i 2i+1, rodzic to i/2. W kopcu min każdy rodzic ≤ dzieci.

- `insert(x)`: wstaw na koniec, potem **upheap** — zamieniaj z rodzicem, dopóki rodzic > x.
- `delMin()`: zabierz korzeń, **ostatni element przenieś do korzenia**, potem **downheap** — zamieniaj z **mniejszym** dzieckiem, dopóki ono jest mniejsze.
- `construct()`: (budowa z całej tablicy naraz) wykonaj downheap dla i = n/2, n/2 − 1, …, 1.

**Oficjalny przykład:** S = 15, 17, 3, 0, 16, 2, 19, 5.

**a) Kolejne insert():**

| Wstawiamy | Tablica po upheap |
|---|---|
| 15 | 15 |
| 17 | 15, 17 |
| 3 | 3, 17, 15 |
| 0 | 0, 3, 15, 17 |
| 16 | 0, 3, 15, 17, 16 |
| 2 | 0, 3, 2, 17, 16, 15 |
| 19 | 0, 3, 2, 17, 16, 15, 19 |
| 5 | **0, 3, 2, 5, 16, 15, 19, 17** |

```tree
0(3(5(17,_),16),2(15,19))
```

**b) delMin():** 17 idzie do korzenia: 17, 3, 2, 5, 16, 15, 19 → mniejsze dziecko 2 → 2, 3, 17, 5, 16, 15, 19 → mniejsze dziecko 15 → **2, 3, 15, 5, 16, 17, 19**.

**c) construct()** na 15, 17, 3, 0, 16, 2, 19, 5 (n = 8, start od i = 4):

| i | Węzeł | Działanie | Tablica |
|---|---|---|---|
| 4 | 0 | dziecko 5 — bez zmian | 15, 17, 3, 0, 16, 2, 19, 5 |
| 3 | 3 | dzieci 2, 19 → zamiana z 2 | 15, 17, 2, 0, 16, 3, 19, 5 |
| 2 | 17 | dzieci 0, 16 → z 0; dalej dziecko 5 → z 5 | 15, 0, 2, 5, 16, 3, 19, 17 |
| 1 | 15 | dzieci 0, 2 → z 0; dzieci 5, 16 → z 5; dziecko 17 — stop | **0, 5, 2, 15, 16, 3, 19, 17** |

:::warn
Wyniki a) i c) są **różne**, choć oba są poprawnymi kopcami — to częsty haczyk. `construct()` to nie to samo co n razy `insert()`.
:::

## 6–7. Algorytm a^b: specyfikacja, pseudokod, poprawność, złożoność

To zadanie sprawdza definicje z wykładów 1 (poprawność) i 2 (złożoność) — patrz [temat 2](topic:t02) i [temat 3](topic:t03), sekcje „wersja z wykładu 2026/2027”.

**a) Specyfikacja**
- **nazwa i argumenty:** `power(a, b)`
- **warunek początkowy:** a, b — liczby naturalne, a > 0 (b może być równe 0)
- **warunek końcowy:** algorytm zwraca liczbę a^b (w szczególności 1, gdy b = 0)

**b) Pseudokod**

```pseudo
power(a, b){
  result = 1
  i = 0
  while(i < b){
    result = result * a
    i++
  }
  return result
}
```

**c) Poprawność całkowita** = własność stopu + częściowa poprawność.

1. **Własność stopu.** Pętla kończy się, gdy i ≥ b. Wartość b jest **stała i skończona** (liczba naturalna), i startuje od 0 i w każdej iteracji **rośnie o 1**. Zatem po dokładnie b iteracjach i = b i algorytm się zatrzymuje.
2. **Częściowa poprawność — niezmiennik pętli:** `result == a^i  ∧  i <= b`.
   - **przed pierwszą iteracją:** i = 0, result = 1 = a⁰; i = 0 ≤ b, bo b jest naturalne ✓
   - **zachowanie:** jeśli przed iteracją result = a^i i i < b (warunek pętli), to po niej result' = a^i · a = a^(i+1) oraz i' = i + 1 ≤ b ✓
   - **po wyjściu z pętli:** niezmiennik i ¬(i < b) dają i = b, więc result = a^b — to jest warunek końcowy ✓

Skoro algorytm ma własność stopu i jest częściowo poprawny, jest **całkowicie poprawny**.

**d) Złożoność**
- **rozmiar danych:** wartość wykładnika **b** (a nie wpływa na liczbę operacji — przy założeniu, że mnożenie to jedna operacja),
- **operacja dominująca:** mnożenie `result * a` (może być też porównanie `i < b`),
- **złożoność czasowa:** W(b) = A(b) = b, czyli **Θ(b)** — liniowa (porównań jest b + 1, też Θ(b)),
- **złożoność pamięciowa:** stała liczba zmiennych (result, i) → **S(b) = O(1)**.

:::exam
Bez wskazania **operacji dominującej** i **rozmiaru danych** analiza złożoności jest niepełna — prowadzący wprost o tym przypomina. Dopisek na „plus”: względem **liczby bitów** wykładnika (≈ log₂ b) ten algorytm jest wykładniczy (porównaj [temat 3](topic:t03)).
:::

## Sprawdzian wiedzy — na co się przygotować

Wskazówki prowadzącego do części teoretycznej (streszczone wiernie):

1. **Poprawność.** Bardzo dobrze znać i **rozumieć logiczny sens** definicji: całkowita/częściowa poprawność, własność stopu, specyfikacja, warunek początkowy/końcowy, niezmiennik. Przećwiczyć uzasadnianie **własności stopu**, a dla prostych algorytmów — dowód częściowej poprawności niezmiennikiem (ten ostatni raczej nie będzie wymagany do oceny 4,0).
2. **Złożoność.** Definicje złożoności czasowej i pamięciowej, operacji dominującej, rozmiaru danych, złożoności pesymistycznej i przeciętnej, oznaczenia **W(), A(), S()**. Definicje i sens wszystkich **5 odmian notacji asymptotycznej** (O, o, Θ, Ω, ω). Umieć określić rząd funkcji; przećwiczyć dowody z definicji (np. **n² + 5n + 2 = O(n²), ale nie O(n)**). Znać **hierarchię rzędów** (stała, logarytmiczna, dowolna potęga n — także ułamkowa, wykładnicze). Przy analizie zawsze wyjaśniać, **co jest rozmiarem danych** (czasem kilka zmiennych) i **co jest operacją dominującą** (czasem kilka, np. przy kilku kolejnych pętlach).
3. **Wyszukiwanie.** Działanie i **specyfikacje** (co zakładają o danych) wyszukiwania sekwencyjnego, **skoki co k** i binarnego; jak działałyby na **tablicy, a jak na liście dowiązaniowej**; złożoności, w tym zależność skoków co k od k; dla jakich danych algorytm działa najdłużej.
4. **Sortowanie.** Dokładne działanie selection, insertion, merge sort (i merge), quicksort (i partition), count sort, radix sort — nie tylko złożoności na pamięć. Dla jakich danych najwolniej/najszybciej, jak na tablicach, a jak na listach; **porównanie każdej pary** algorytmów; **stabilność** (które są stabilne i dlaczego); **dolne ograniczenie** na sortowanie przez porównania (Ω(n log n)).
5. **Abstrakcyjne struktury danych.** Odróżniać ADS od konkretnych struktur (tablica, lista, drzewo binarne). Definicje i efektywne implementacje: **stos, kolejka, deque, kolejka priorytetowa, słownik**; stos/kolejka na tablicy vs na liście (jedno- czy dwukierunkowej?) i złożoności operacji. W szczególności: kolejka priorytetowa jako **kopiec binarny**, słownik jako **tablica mieszająca** albo **BST** — definicje, własności i działanie operacji.

Gdzie na stronie: [2. Poprawność](topic:t02), [3. Złożoność](topic:t03), [4. Wyszukiwanie](topic:t04), [5. Sortowanie proste](topic:t05), [6. MergeSort](topic:t06), [7. QuickSort i sortowania liniowe](topic:t07), [9. Stos, kolejka, listy](topic:t09), [10. BST](topic:t10), [11. Haszowanie](topic:t11), [12. Kopce](topic:t12).

### Lista kontrolna ze slajdów {own}

:::own
Połączone listy „Co na pewno należy umieć” i „Pytania/zadania kontrolne” z dwóch pierwszych wykładów 2026/2027 — w formie do odhaczania.
:::

- Podaj z pamięci **dokładne** definicje: specyfikacji, poprawnych danych wejściowych i wyjściowych, całkowitej i częściowej poprawności, niezmiennika pętli.
- Dla danego zadania obliczeniowego stwórz **ścisłą specyfikację**.
- Podaj przykład algorytmu **częściowo poprawnego bez własności stopu** — i odwrotnie (zatrzymuje się, ale zwraca zły wynik).
- Udowodnij **własność stopu** podanego algorytmu; znajdź **niezmiennik** prostej pętli i udowodnij, że nim jest; użyj go do dowodu częściowej poprawności.
- Czym mierzymy „szybkość” algorytmu? Jakie **2 kroki** trzeba wykonać przed analizą złożoności (operacje dominujące, rozmiar danych)?
- Definicje i wyznaczanie: operacji dominującej, rozmiaru danych, W(n), A(n) (dla bardzo prostych algorytmów), złożoności pamięciowej.
- Jaki jest **cel** notacji asymptotycznej? Definicje i interpretacja **5 wariantów**; dowód z definicji, że dane wyrażenie jest prawdziwe lub fałszywe.

=== tasks ===

:::task level=1 source=own title="Binary Search — trzy tablice"
Dla każdej tablicy podaj indeksy elementów porównywanych z Key oraz zwróconą wartość.

a) S = 3, 8, 11, 19, 24, 27, 33, 40, 46, 52, 59, 63, 71, 88; Key = 24

b) S = 2, 5, 9, 14, 20, 26, 31, 37, 42, 48, 55; Key = 50
::hint
Zapisuj l, r, m w tabelce. W b) klucza nie ma — algorytm kończy się, gdy l > r.
::solution
**a)** l=0, r=13 → m=6 (33 > 24) → r=5; m=2 (11 < 24) → l=3; m=4 (24) — znaleziono. Indeksy: **6, 2, 4**; wynik **4**.

**b)** l=0, r=10 → m=5 (26 < 50) → l=6; m=8 (42 < 50) → l=9; m=9 (48 < 50) → l=10; m=10 (55 > 50) → r=9; l > r. Indeksy: **5, 8, 9, 10**; wynik **−1**.
:::

:::task level=1 source=own title="Merge Sort — liczba porównań i ostatni merge"
Dla ciągów policz łączną liczbę porównań i podaj ciągi przy ostatnim `merge()`:

a) S = 9, 1, 6, 3, 8, 2, 7 (długość nieparzysta — lewa połowa ma 4 elementy)

b) S = 5, 1, 8, 3, 9, 4, 0, 6, 2, 7
::hint
Najpierw podziel aż do pojedynczych elementów, potem scalaj od dołu i licz porównania w każdym merge osobno.
::solution
**a)** Podział: (9, 1, 6, 3) | (8, 2, 7) → (9, 1)(6, 3) | (8, 2)(7).

Merge: (9)+(1): 1; (6)+(3): 1; (1, 9)+(3, 6): 1 vs 3 → 1; 9 vs 3 → 3; 9 vs 6 → 6; zostaje 9 → **3**. (8)+(2): 1; (2, 8)+(7): 2 vs 7 → 2; 8 vs 7 → 7; zostaje 8 → **2**. Ostatni: (1, 3, 6, 9)+(2, 7, 8): 1v2, 3v2, 3v7, 6v7, 9v7, 9v8 → **6**, zostaje 9.

Razem 1+1+3+1+2+6 = **14**; ostatni merge: **1, 3, 6, 9 | 2, 7, 8**.

**b)** Razem **24** porównania; ostatni merge: **1, 3, 5, 8, 9 | 0, 2, 4, 6, 7**.
:::

:::task level=2 source=own title="partition() — dwie tablice"
Wykonaj partition (pivot = pierwszy element). Podaj zwrócony indeks, pierwszy element tablicy po partition i liczbę swapów (z ostatnim).

a) S = 5, 8, 1, 9, 3, 7, 2, 6, 4

b) S = 7, 2, 9, 1, 8, 3, 10, 5, 4, 6
::hint
Sprawdzenie: zwrócony indeks = liczba elementów mniejszych od pivota.
::solution
**a)** swap(1, 8): 5, 4, 1, 9, 3, 7, 2, 6, 8; swap(3, 6): 5, 4, 1, 2, 3, 7, 9, 6, 8; i staje na 7 (indeks 5) → p = 4; swap(0, 4): **3, 4, 1, 2, 5, 7, 9, 6, 8**.

Indeks **4**, pierwszy element **3**, swapów **3**.

**b)** swap(2, 9): 7, 2, 6, 1, 8, 3, 10, 5, 4, 9; swap(4, 8): 7, 2, 6, 1, 4, 3, 10, 5, 8, 9; swap(6, 7): 7, 2, 6, 1, 4, 3, 5, 10, 8, 9; p = 6; swap(0, 6): **5, 2, 6, 1, 4, 3, 7, 10, 8, 9**.

Indeks **6**, pierwszy element **5**, swapów **4**.
:::

:::task level=1 source=own title="Count Sort — tablica counts w trzech fazach"
a) S = 3, 1, 4, 1, 0, 3, 4, 2, 4, 1, 3

b) S = 1, 4, 0, 4, 2, 1, 6, 4, 0, 2, 1, 5
::hint
W b) jedna z wartości z zakresu 0..6 nie występuje — counts ma tam 0, a po sumowaniu powtarza się poprzednia suma.
::solution
**a)** zliczanie: 1, 3, 1, 3, 3; sumowanie: 1, 4, 5, 8, 11; po wypisaniu: 0, 1, 4, 5, 8.

**b)** zliczanie: 2, 3, 2, 0, 3, 1, 1; sumowanie: 2, 5, 7, 7, 10, 11, 12; po wypisaniu: 0, 2, 5, 7, 7, 10, 11.
:::

:::task level=2 source=own title="Kopiec min — insert, delMin, construct"
Dla S = 12, 7, 9, 4, 15, 1, 10, 6 oraz dla S = 20, 14, 8, 11, 3, 17, 5, 9, 1 podaj tablicę kopca (od indeksu 1): a) po kolejnych insert(), b) po a) + delMin(), c) po construct().
::hint
W construct() zacznij od i = ⌊n/2⌋ i idź w dół do 1; każdy element „spychaj” tak głęboko, jak trzeba.
::solution
**S = 12, 7, 9, 4, 15, 1, 10, 6:**

a) **1, 6, 4, 7, 15, 9, 10, 12**; b) **4, 6, 9, 7, 15, 12, 10**; c) **1, 4, 9, 6, 15, 12, 10, 7**.

**S = 20, 14, 8, 11, 3, 17, 5, 9, 1:**

a) **1, 3, 5, 8, 11, 17, 14, 20, 9**; b) **3, 8, 5, 9, 11, 17, 14, 20**; c) **1, 3, 5, 9, 20, 17, 8, 14, 11**.
:::

:::task level=1 source=own title="Selection sort i insertion sort — stan po każdym przebiegu"
a) Posortuj selection sort (szukamy minimum i zamieniamy z pierwszym nieposortowanym): 29, 10, 14, 37, 13, 5.

b) Posortuj insertion sort: 8, 3, 10, 1, 6, 4. Ile jest porównań elementów?
::solution
**a)** 5, 10, 14, 37, 13, 29 → 5, 10, 14, 37, 13, 29 (10 już na miejscu) → 5, 10, 13, 37, 14, 29 → 5, 10, 13, 14, 37, 29 → 5, 10, 13, 14, 29, 37.

**b)** 3, 8, 10, 1, 6, 4 → 3, 8, 10, 1, 6, 4 → 1, 3, 8, 10, 6, 4 → 1, 3, 6, 8, 10, 4 → 1, 3, 4, 6, 8, 10. Porównań: 1 + 1 + 3 + 3 + 4 = **12** (liczymy też porównanie, które zatrzymuje przesuwanie).
:::

:::task level=1 source=own title="Radix sort (LSD, podstawa 10)"
Posortuj 329, 457, 657, 839, 436, 720, 355, 41 — podaj ciąg po każdej fazie (jedności, dziesiątki, setki). Sortowanie po cyfrze musi być stabilne.
::solution
po jednościach: 720, 41, 355, 436, 457, 657, 329, 839

po dziesiątkach: 720, 329, 436, 839, 41, 355, 457, 657

po setkach: 41, 329, 355, 436, 457, 657, 720, 839
:::

:::task level=1 source=own title="BST i obchody drzewa"
Wstaw do pustego BST po kolei: 50, 30, 70, 20, 40, 60, 80, 35, 45, 65. Podaj obchody pre-, in- i post-order oraz wysokość drzewa.
::solution
```tree
50(30(20,40(35,45)),70(60(_,65),80))
```
pre-order: 50, 30, 20, 40, 35, 45, 70, 60, 65, 80

in-order: 20, 30, 35, 40, 45, 50, 60, 65, 70, 80 (zawsze posortowane!)

post-order: 20, 35, 45, 40, 30, 65, 60, 80, 70, 50

wysokość: **3** (liczona w krawędziach).
:::

:::task level=2 source=own title="BFS, DFS i Kruskal na jednym grafie"
Graf nieskierowany z wagami: 1–2 (7), 1–3 (3), 1–4 (5), 2–5 (2), 3–5 (6), 3–6 (4), 4–6 (1), 5–7 (8), 6–7 (9), 2–3 (10).

a) Podaj kolejność odwiedzania BFS i DFS od wierzchołka 1 (sąsiadów rozpatrujemy rosnąco).

b) Podaj kolejność krawędzi dodawanych przez algorytm Kruskala i wagę drzewa.
```graph
1 60 140
2 180 40
3 180 140
4 180 260
5 320 60
6 320 220
7 440 140
1-2 7
1-3 3
1-4 5
2-5 2
3-5 6
3-6 4
4-6 1
5-7 8
6-7 9
2-3 10
```
::solution
**a)** BFS: **1, 2, 3, 4, 5, 6, 7**. DFS: **1, 2, 3, 5, 7, 6, 4**.

**b)** Krawędzie po wagach: 4–6 (1) ✓, 2–5 (2) ✓, 1–3 (3) ✓, 3–6 (4) ✓, 1–4 (5) ✗ cykl 1-3-6-4, 3–5 (6) ✓, 1–2 (7) ✗ cykl, 5–7 (8) ✓ — mamy 6 krawędzi dla 7 wierzchołków, koniec. Waga: 1 + 2 + 3 + 4 + 6 + 8 = **24**.
:::

:::task level=2 source="Wskazówki prowadzącego (przykład)" title="Notacja O z definicji"
Udowodnij z definicji, że n² + 5n + 2 = O(n²), ale n² + 5n + 2 ≠ O(n).
::solution
**O(n²):** dla n ≥ 1 mamy 5n ≤ 5n² i 2 ≤ 2n², więc n² + 5n + 2 ≤ 8n². Stałe: **c = 8, n₀ = 1** ✓.

**Nie O(n):** przypuśćmy, że istnieją c > 0 i n₀, takie że n² + 5n + 2 ≤ c·n dla n ≥ n₀. Dzieląc przez n: n + 5 + 2/n ≤ c, czyli n ≤ c dla wszystkich n ≥ n₀ — sprzeczność (weź n > max(c, n₀)). ∎
:::
