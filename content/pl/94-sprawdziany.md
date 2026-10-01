---
id: exams
type: page
title: Sprawdziany 2026/2027 — praktyczny i wiedzy
short: Sprawdziany 2026/2027
icon: 📝
eyebrow: Przygotowanie do zaliczenia · 2026/2027
desc: Typy zadań dopuszczeniowych (binSearch, MergeSort, partition, CountSort, kopiec, aᵇ), oficjalne przykładowe dane rozwiązane krok po kroku, wersje algorytmów zgodne z odpowiedziami, zadania treningowe i wskazówki do sprawdzianu wiedzy.
---

:::info Skąd jest ta strona
**Treści zadań, przykładowe dane z wynikami i wskazówki do części teoretycznej** pochodzą z materiałów prowadzącego na rok 2026/2027 (M. Sydow). **Pseudokody** są przepisane ze slajdów 2026/2027; **rozpisanie rozwiązań krok po kroku i zadania treningowe** przygotował autor strony — każdy wynik został sprawdzony programem symulującym algorytm. Zasady punktacji: [Zaliczenie przedmiotu](page:course).
:::

:::warn Wersje algorytmów
Prowadzący wymaga **dokładnie wersji algorytmów ze slajdów**. Pseudokody **search (binSearch), mergeSort/merge, partition/quicksort i countSort** poniżej są **przepisane ze slajdów 2026/2027** (wykłady „Wyszukiwanie”, „Sortowanie 1”, „Sortowanie 2”) i dają dokładnie oficjalne odpowiedzi. To samo dotyczy **kopca binarnego** (upheap, downheap, construct — wykład „Kolejka priorytetowa”). Jeśli na kolejnych slajdach pojawi się coś innego, **obowiązuje slajd**.
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
| 6 | prosty algorytm **aᵇ** | a) specyfikacja, b) pseudokod (b-krotne mnożenie) |
| 7 | ciąg dalszy 6 | c) analiza **poprawności całkowitej**, d) złożoność **czasowa i pamięciowa** (operacja dominująca, rozmiar danych!) |

Pełny zakres sprawdzianu praktycznego: rzędy funkcji / notacja O, binSearch, selection sort, insertion sort, mergeSort, quickSort/partition, countSort, radixSort, minHeap, BST, in/pre/post-order, BFS/DFS, Kruskal.

:::tip Sprawdź się
Pełne próbne sprawdziany (2 warianty praktycznego, próbny sprawdzian wiedzy) i 13 wejściówek: [Testy próbne](page:mock).
:::

## 1. Binary Search

```pseudo
search(S, len, key){
  l = 0
  r = len - 1
  while(l <= r){
    m = (l + r)/2
    if(S[m] == key) return m
    else
      if(S[m] > key) r = m - 1
      else l = m + 1
  }
  return -1
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

:::answer
a) **5, 8**; b) **8**.
:::

:::tip
Na sprawdzianie zawsze zapisuj tabelkę l, r, m — jedna pomyłka w dzieleniu (np. (6+11)/2 = 8, nie 9) psuje cały wynik. Przy braku klucza zwracane jest −1, a indeksów porównań jest ok. log₂ n.
:::

## 2. Merge Sort

```pseudo
mergeSort(S, len){
  if(len <= 1) return S[0:len]
  m = len/2
  return merge(mergeSort(S[0:m], m), m,
               mergeSort(S[m:len], len-m), len-m)
}

merge(a1, len1, a2, len2){
  i = j = k = 0;
  result[len1 + len2] // (alokacja pamięci)
  while((i < len1) && (j < len2))
    if(a1[i] < a2[j]) result[k++] = a1[i++];
    else result[k++] = a2[j++];
  while(i < len1) result[k++] = a1[i++];
  while(j < len2) result[k++] = a2[j++];
  return result;
}
```

Uwaga na podział: **m = len/2 (w dół)**, lewa część to S[0:m] — przy nieparzystej długości **lewa połowa jest o 1 krótsza** (np. dla 7 elementów: 3 | 4). Zapis S[a:b] oznacza elementy S[i] dla a ≤ i < b.

`merge` porównuje pierwsze elementy obu ciągów i przepisuje mniejszy; **gdy jeden ciąg się skończy, resztę drugiego przepisuje bez porównań**. Liczba porównań w jednym `merge` = liczba elementów wypisanych, zanim któryś ciąg się wyczerpie. Przy **równych** elementach warunek `a1[i] < a2[j]` jest fałszywy, więc pierwszy idzie element z **prawego** ciągu — ta wersja nie jest stabilna (zamiana `<` na `<=` czyni ją stabilną; slajdy pytają, które miejsce kodu decyduje o stabilności).

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

:::answer
a) 1+1+3+1+1+3+6 = **16**; b) ostatni merge: **0, 2, 4, 6 | 3, 5, 7, 8**.
:::

:::tip
Ostatni `merge()` zawsze scala **dwie posortowane połowy całej tablicy** — wystarczy posortować osobno lewą i prawą połowę. Liczba porównań w merge ciągów długości p i q jest między min(p, q) a p + q − 1.
:::

## 3. partition() z QuickSort

Pivotem jest **pierwszy element**. Dwa indeksy idą do siebie: lewy szuka elementu **większego** od pivota, prawy — **mniejszego**; jeśli się nie minęły, zamieniamy. Na końcu pivot wymieniamy z elementem na granicy (to też jest `swap`).

```pseudo
partition(a, l, r){
  i = l + 1;
  j = r;
  p = a[l]; //"pivot"
  temp;
  do{
    while((i < r) && (a[i] <= p)) i++;
    while((j > i) && (a[j] >= p)) j--;
    if(i < j) {temp = a[i]; a[i] = a[j]; a[j] = temp;}
  }while(i < j);
  // when (i==r):
  if(a[i] > p) {a[l] = a[i - 1]; a[i - 1] = p; return i - 1;}
  else {a[l] = a[i]; a[i] = p; return i;}
}

quicksort(a, l, r){
  if(l >= r) return;
  k = partition(a, l, r);
  quicksort(a, l, k - 1);
  quicksort(a, k + 1, r);
}
```

Na slajdzie zamiana pary to trzy przypisania przez `temp`, a końcowe wstawienie pivota (`a[l] = …; … = p`) to też zamiana — w zadaniach dopuszczeniowych liczy się ją jako ostatni `swap()`. Przykład ze slajdów: 5,2,1,7,2,6,1,3,4,8,6,0 → 3,2,1,0,2,4,1,5,6,8,6,7 (zwraca 7).

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

:::answer
a) **6**; b) **1**; c) **3** swapy.
:::

:::tip Szybkie sprawdzenie
Zwrócony indeks = **liczba elementów mniejszych od pivota** (gdy elementy są różne): w przykładzie 5, 4, 3, 1, 2, 0 → 6. Liczba swapów = liczba zamian „par” + 1.
:::

## 4. Count Sort

```pseudo
countSort(a, l){
  max = maxValue(a, l);
  l1 = max + 1;
  counts[l1];
  result[l];
  for(i = 0; i < l1; i++) counts[i] = 0;

  for(i = 0; i < l; i++) counts[a[i]]++;
  for(i = 1; i < l1; i++) counts[i] += counts[i - 1];
  for(i = l - 1; i >= 0; i--)
    result[--counts[a[i]]] = a[i];
}
```

Przykład ze slajdów: dla (3,2,5,1,2,6,8,1,2,4) max = 8, counts po fazie 1: 0,2,3,1,1,1,1,0,1, po fazie 2: 0,2,5,6,7,8,9,9,10. Przedrostkowe `--counts[a[i]]` najpierw zmniejsza licznik, a potem używa go jako indeksu.

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

Kod ze slajdów (kopiec w tablicy, indeks 0 nieużywany; przy równych dzieciach downheap wybiera **lewe**, bo porównanie jest ostre):

```pseudo
upheap(i)        // i > 0
  key = heap[i]
  parent = i/2
  while((parent > 0) && (heap[parent] > key))
    heap[i] = heap[parent]
    i = parent
    parent /= 2
  heap[i] = key

downheap(i)
  l = 2i          // lewy syn
  r = 2i + 1      // prawy syn
  if l <= n and heap[l] < heap[i]:
    min = l
  else:
    min = i
  if r <= n and heap[r] < heap[min]: // n to rozmiar kopca
    min = r
  if min != i:
    swap(i,min)   // zamiana elementów, nie samych indeksów
    downheap(min) // kontynuuj niżej

construct: for(i = n/2; i > 0; i--) downHeap(i)
```

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

## 6–7. Algorytm aᵇ: specyfikacja, pseudokod, poprawność, złożoność

To zadanie sprawdza definicje z wykładów 1 (poprawność) i 2 (złożoność) — patrz [temat 2](topic:t02) i [temat 3](topic:t03), sekcje „wersja z wykładu 2026/2027”.

### a) Specyfikacja

:::def Specyfikacja power(a, b)
- **nazwa i argumenty:** `power(a, b)`
- **warunek początkowy:** $a, b \in \mathbb{N}$, $a > 0$ ($b$ może być równe 0)
- **warunek końcowy:** algorytm zwraca liczbę $a^b$ (w szczególności $1$, gdy $b = 0$)
:::

### b) Pseudokod

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

### c) Poprawność całkowita

Poprawność całkowita = **własność stopu** + **częściowa poprawność**. Dowodzimy obu części osobno.

**Krok 1 — własność stopu.** Pętla kończy się, gdy $i \ge b$. Wartość $b$ jest **stała i skończona** (liczba naturalna), a $i$ startuje od $0$ i w każdej iteracji **rośnie o 1**. Po dokładnie $b$ iteracjach $i = b$ i algorytm się zatrzymuje.

**Krok 2 — częściowa poprawność.** Używamy niezmiennika pętli:

:::formula Niezmiennik pętli
$$\text{result} = a^{i} \;\wedge\; i \le b$$
:::

1. **Przed pierwszą iteracją:** $i = 0$, $\text{result} = 1 = a^0$ oraz $0 \le b$, bo $b$ jest naturalne ✓
2. **Zachowanie:** jeśli przed iteracją $\text{result} = a^i$ i $i < b$ (warunek pętli), to po niej
$$\text{result}' = a^i \cdot a = a^{i+1}, \qquad i' = i + 1 \le b \;✓$$
3. **Po wyjściu z pętli:** niezmiennik i $\neg(i < b)$ dają $i = b$, więc $\text{result} = a^b$ — to warunek końcowy ✓

### d) Złożoność

- **rozmiar danych:** wartość wykładnika $b$ ($a$ nie wpływa na liczbę operacji, jeśli mnożenie to jedna operacja),
- **operacja dominująca:** mnożenie `result * a` (może być też porównanie `i < b`).

:::formula Złożoność czasowa i pamięciowa
$$W(b) = A(b) = b = \Theta(b) \qquad S(b) = O(1)$$
Porównań `i < b` jest $b + 1$ — też $\Theta(b)$. Pamięć: stała liczba zmiennych (`result`, `i`).
:::

:::answer
Algorytm ma własność stopu i jest częściowo poprawny (niezmiennik $\text{result} = a^i \wedge i \le b$), więc jest **całkowicie poprawny**. Złożoność: czasowa $\Theta(b)$ — liniowa względem wartości $b$, pamięciowa $O(1)$.
:::

:::exam
Bez wskazania **operacji dominującej** i **rozmiaru danych** analiza złożoności jest niepełna — prowadzący wprost o tym przypomina. Dopisek na „plus”: względem **liczby bitów** wykładnika ($\approx \log_2 b$) ten algorytm jest wykładniczy (porównaj [temat 3](topic:t03)).
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

a) S = 9, 1, 6, 3, 8, 2, 7 (długość nieparzysta — m = 7/2 = 3, lewa część ma 3 elementy)

b) S = 5, 1, 8, 3, 9, 4, 0, 6, 2, 7
::hint
Najpierw podziel aż do pojedynczych elementów, potem scalaj od dołu i licz porównania w każdym merge osobno.
::solution
**a)** Podział: (9, 1, 6) | (3, 8, 2, 7) → (9) | (1, 6) oraz (3, 8) | (2, 7).

Merge: (1)+(6): 1; (9)+(1, 6): 9v1, 9v6 → **2**, zostaje 9; (3)+(8): 1; (2)+(7): 1; (3, 8)+(2, 7): 3v2, 3v7, 8v7 → **3**, zostaje 8. Ostatni: (1, 6, 9)+(2, 3, 7, 8): 1v2, 6v2, 6v3, 6v7, 9v7, 9v8 → **6**, zostaje 9.

Razem 1+2+1+1+3+6 = **14**; ostatni merge: **1, 6, 9 | 2, 3, 7, 8**.

**b)** Razem **22** porównania; ostatni merge: **1, 3, 5, 8, 9 | 0, 2, 4, 6, 7**.
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

:::task level=2 source=own title="BFS, DFS, Kruskal, Dijkstra i Prim na jednym grafie"
Graf nieskierowany z wagami: 1–2 (7), 1–3 (3), 1–4 (5), 2–5 (2), 3–5 (6), 3–6 (4), 4–6 (1), 5–7 (8), 6–7 (9), 2–3 (10).

a) Wykonaj BFS i DFS (wersja rekurencyjna ze slajdów, `time` od 0) od wierzchołka 1, sąsiadów rozpatrując rosnąco. Podaj kolejność odwiedzania, dla BFS odległości `d` i rodziców `p`, dla DFS czasy odwiedzenia i zakończenia `d/f` oraz krawędzie niebędące drzewowymi (jakiego są typu?).

b) Podaj kolejność krawędzi dodawanych przez algorytm Kruskala i wagę drzewa.

c) Wykonaj algorytm Dijkstry od wierzchołka 1 (krawędzie działają w obie strony). Podaj kolejność zdejmowania wierzchołków z kolejki oraz końcowe `distance` i `parent`.

d) Wykonaj algorytm Prima ze slajdów od wierzchołka 1. Podaj krawędzie w kolejności akceptacji (dodania do drzewa) i porównaj z Kruskalem.
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
**a)** BFS: **1, 2, 3, 4, 5, 6, 7**; d: 1→0, 2→1, 3→1, 4→1, 5→2, 6→2, 7→3; p: 2, 3, 4 ← 1; 5 ← 2; 6 ← 3; 7 ← 5.

DFS: **1, 2, 3, 5, 7, 6, 4**; d/f: 1: 0/13, 2: 1/12, 3: 2/11, 5: 3/10, 7: 4/9, 6: 5/8, 4: 6/7. Krawędzie drzewowe: 1–2, 2–3, 3–5, 5–7, 7–6, 6–4. Pozostałe (1–3, 1–4, 2–5, 3–6) to krawędzie **w tył** — w grafie nieskierowanym DFS nie daje krawędzi w przód ani poprzecznych.

**b)** Krawędzie po wagach: 4–6 (1) ✓, 2–5 (2) ✓, 1–3 (3) ✓, 3–6 (4) ✓, 1–4 (5) ✗ cykl 1-3-6-4, 3–5 (6) ✓, 1–2 (7) ✗ cykl, 5–7 (8) ✓ — mamy 6 krawędzi dla 7 wierzchołków, koniec. Waga: 1 + 2 + 3 + 4 + 6 + 8 = **24**.

**c)** Zdejmowanie z kolejki (distance): 1 (0), 3 (3), 4 (5), 6 (6), 2 (7), 5 (9), 7 (15). Wynik: distance 2 = 7, 3 = 3, 4 = 5, 5 = 9, 6 = 6, 7 = 15; parent 2 ← 1, 3 ← 1, 4 ← 1, 5 ← 3, 6 ← 4, 7 ← 6. Uwaga: 6 najpierw dostaje 7 (przez 3), potem relaksacja z 4 poprawia na 6. Do 5 prowadzą dwie ścieżki długości 9 (przez 3 i przez 2) — warunek relaksacji jest ostry (`>`), więc zostaje rodzic 3.

**d)** Prim od 1 (zdejmowany wierzchołek ← rodzic, waga): 3 ← 1 (3); 6 ← 3 (4); 4 ← 6 (1) — 4 miało dist 5 (przez 1), po dodaniu 6 spada do 1; 5 ← 3 (6); 2 ← 5 (2) — 2 miało dist 7 (przez 1), po dodaniu 5 spada do 2; 7 ← 5 (8). Kolejność akceptacji: **1–3, 3–6, 6–4, 3–5, 5–2, 5–7**, waga $3 + 4 + 1 + 6 + 2 + 8 = 24$.

:::answer
Kruskal i Prim dają **to samo MST** o wadze **24** (wagi są różne, więc MST jest jednoznaczne), ale w innej kolejności krawędzi.
:::
:::

:::task level=2 source=own title="BST: usuwanie we wszystkich wariantach"
Dla drzewa BST z zadania o obchodach (wstawiono 50, 30, 70, 20, 40, 60, 80, 35, 45, 65) narysuj drzewo po każdej operacji wykonanej **osobno** na oryginalnym drzewie: a) delete(45), b) delete(60), c) delete(50) — w wariancie z poprzednikiem (jak w pseudokodzie ze slajdów) i z następnikiem.
::hint
Węzeł z dwoma synami: poprzednik = skrajnie prawy węzeł lewego poddrzewa, następnik = skrajnie lewy węzeł prawego poddrzewa. Ten węzeł ma najwyżej jednego syna, więc usuwa się go prosto (delete1).
::solution
**a)** 45 to liść — znika: 50(30(20, 40(35, _)), 70(60(_, 65), 80)).

**b)** 60 ma jednego syna (65) — „podpinamy” go do rodzica: 50(30(20, 40(35, 45)), 70(65, 80)).

**c)** poprzednik 50 to 45 (skrajnie prawy w lewym poddrzewie): klucz 45 trafia do korzenia, liść 45 znika:
```tree
45(30(20,40(35,_)),70(60(_,65),80))
```
następnik 50 to 60 (skrajnie lewy w prawym poddrzewie): klucz 60 trafia do korzenia, a jego jedyny syn 65 zostaje podpięty do 70:
```tree
60(30(20,40(35,45)),70(65,80))
```
:::

:::task level=2 source=own title="Współczynniki zrównoważenia (AVL)"
a) Oblicz bf = wysokość lewego poddrzewa − wysokość prawego dla każdego węzła drzewa z poprzedniego zadania (przed usuwaniem). Czy to drzewo AVL?
b) Wstaw do niego 66 (zwykły insert BST). Czy nadal jest AVL?
::solution
**a)** bf: 50 → 0, 30 → −1, 40 → 0, 70 → +1, 60 → −1, liście (20, 35, 45, 65, 80) → 0. Wszystkie w {−1, 0, 1} — **tak, to drzewo AVL**.

**b)** 66 ląduje jako prawy syn 65. Teraz bf(65) = −1, bf(60) = −2, bf(70) = +2 — **nie jest AVL** (w drzewie AVL naprawiłaby to rotacja w okolicy 60; rotacje nie są omawiane na wykładzie).
:::

:::task level=2 source="Wskazówki prowadzącego (przykład)" title="Notacja O z definicji"
Udowodnij z definicji, że n² + 5n + 2 = O(n²), ale n² + 5n + 2 ≠ O(n).
::solution
**Część 1: $n^2 + 5n + 2 = O(n^2)$.** Szukamy stałych $c > 0$ i $n_0$ z definicji. Dla $n \ge 1$ mamy $5n \le 5n^2$ oraz $2 \le 2n^2$, więc
$$n^2 + 5n + 2 \;\le\; n^2 + 5n^2 + 2n^2 \;=\; 8n^2 \qquad (n \ge 1)$$
**Część 2: $n^2 + 5n + 2 \ne O(n)$.** Przypuśćmy, że istnieją $c > 0$ i $n_0$, takie że $n^2 + 5n + 2 \le c \cdot n$ dla $n \ge n_0$. Dzieląc przez $n$:
$$n + 5 + \frac{2}{n} \le c \quad\Longrightarrow\quad n \le c \quad \text{dla każdego } n \ge n_0$$
— sprzeczność: wystarczy wziąć $n > \max(c, n_0)$. ∎
:::answer
$c = 8$, $n_0 = 1$ dowodzi $n^2 + 5n + 2 = O(n^2)$; ograniczenie liniowe $O(n)$ nie istnieje.
:::
:::
