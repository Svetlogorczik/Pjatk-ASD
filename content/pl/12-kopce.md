---
id: t12
num: 12
type: topic
title: Kolejki priorytetowe, kopce i HeapSort
short: Kopce i HeapSort
desc: Kolejka priorytetowa, kopiec binarny w tablicy, upheap i downheap, budowa kopca w czasie liniowym, sortowanie przez kopcowanie oraz drzewa (kopce) lewicowe.
sources: asd10.pdf; Wyklady 2009/wyklad_9 kopce binarne.pdf; wyklad_10.pdf (kolejka priorytetowa — kopiec lewicowy)
exercises: asd 10.pdf („ASD 10b”: zad. 1–3)
---

:::exam Sprawdzian 2026/2027
Ten temat powstał na podstawie wykładów 2025/2026. **Na sprawdzianach 2026/2027 obowiązują wersje ze slajdów M. Sydowa** — znajdziesz je w sekcji [„Wersja z wykładu 2026/2027”](topic:t12#wersja-z-wykładu-2026-2027-m-sydow-kolejka-priorytetowa) na końcu tematu (kod przepisany ze slajdów). Zadania dopuszczeniowe i zadania treningowe: [Sprawdziany 2026/2027](page:exams).
:::

## Kolejka priorytetowa

W zwykłej kolejce obsługujemy tego, kto przyszedł najwcześniej. W **kolejce priorytetowej** — tego, kto jest **najważniejszy** (ma największy priorytet), bez względu na kolejność przybycia.

:::def
**Kolejka priorytetowa** (dynamiczny problem sortowania): podać strukturę dla elementów dynamicznego zbioru S, na którym wykonujemy:
1. `construct(q, S)` — mając dany ciąg q = [a₁, …, aₙ], utwórz zbiór S = {a₁, …, aₙ},
2. `insert(x, S)` — S := S ∪ {x},
3. `deletemax(S)` — usuń z S największy element (dualna operacja: `deletemin`).

Elementy pochodzą z uniwersum liniowo uporządkowanego.
:::

:::analogy
Izba przyjęć w szpitalu: pacjent z zawałem wchodzi przed pacjentem ze skręconą kostką, nawet jeśli przyszedł później. Priorytet decyduje, nie kolejność.
:::

Elementarne implementacje (wykład):

| Implementacja | construct | insert | deletemax | kiedy dobra |
|---|---|---|---|---|
| tablica nieuporządkowana | O(n) | O(1) | O(n) | dużo insert, mało deletemax |
| tablica uporządkowana | O(n log n) | O(n) | O(1) | dużo deletemax, mało insert |
| **kopiec** | **O(n)** | **O(log n)** | **O(log n)** | zawsze dobrze |

Ogólny schemat sortowania kolejką priorytetową: `construct(q, S)`, potem n razy `deletemax(S)`. Z kopcem daje to **HeapSort** o złożoności O(n log n).

## Kopiec

:::def
**Kopiec** (max) to drzewo binarne, w którego węzłach są elementy zbioru S i spełniony jest **warunek kopca**: jeśli x jest ojcem y, to **element w x jest niemniejszy niż element w y**.
:::

Wnioski:
- **największy element jest w korzeniu**,
- na każdej ścieżce od korzenia do liścia elementy są ułożone **nierosnąco**.

:::warn
Kopiec to **nie** BST! W kopcu nie ma żadnego porządku między lewym a prawym synem — wiemy tylko, że ojciec ≥ synowie. Dlatego w kopcu nie da się szybko wyszukać dowolnego elementu, ale maksimum jest zawsze „pod ręką”.
:::

### Kopiec zupełny i jego zapis w tablicy

**Kopiec zupełny** to kopiec będący **zupełnym** drzewem binarnym: wszystkie poziomy są wypełnione, z wyjątkiem co najwyżej ostatniego, który jest wypełniony **od lewej** bez dziur. Dla wysokości h i liczby węzłów n:

2ʰ ≤ n < 2ʰ⁺¹, czyli **h = ⌊log₂ n⌋**.

Regularny kształt pozwala zapisać kopiec w tablicy **bez żadnych wskaźników** — węzły numerujemy poziomami od lewej, od 1:

- następniki węzła k: **2k** i **2k + 1**,
- poprzednik węzła k (k > 1): **⌊k/2⌋**.

Przykład kopca i jego tablicy:

```tree
15(12(11(7,4),1),9(3,6))
```

```array
@idx 1
a: 15 12 9 11 1 3 6 7 4
```

:::tip
W Javie tablice są indeksowane od 0. Można albo zostawić a[0] pusty (jak na wykładzie), albo użyć wzorów „od zera”: synowie k to **2k + 1** i **2k + 2**, ojciec to **(k − 1)/2** (uwaga od autora strony).
:::

## Operacje na kopcu

### insert i upheap

Nowy element wstawiamy na **pierwsze wolne miejsce ostatniego poziomu** (a[n+1]), a potem przywracamy warunek kopca: jeśli jest większy od ojca, **idziemy w górę**, przesuwając mniejszych ojców w dół (procedura **upheap**).

Przykład: insert(13) do kopca powyżej. 13 trafia na pozycję 10 (syn 1), jest większe od 1 → w górę; większe od 12 → w górę; mniejsze od 15 → stop.

```tree caption="po insert(13)"
15(13(11(7,4),12(1,_)),9(3,6))
```

Pesymistycznie idziemy od liścia do korzenia: **W_insert(n) = O(log n)** (ok. ⌊log n⌋ + 1 porównań).

### deletemax i downheap

1. Zapamiętaj korzeń (maksimum).
2. Na jego miejsce przenieś **ostatni** element kopca (a[n]) i zmniejsz n.
3. Przywróć warunek kopca **idąc w dół**: porównaj element z **większym** z synów; jeśli jest od niego mniejszy — zamień i idź dalej (procedura **downheap**).

Przykład: deletemax z pierwotnego kopca — usuwamy 15, na górę idzie 4, potem 4 schodzi: zamiana z 12, z 11, z 7.

```tree caption="po deletemax"
12(11(7(4,_),1),9(3,6))
```

W każdym kroku są **dwa** porównania (który syn większy + czy zamienić), a kroków jest co najwyżej ⌊log n⌋: **W_deletemax(n) = 2⌊log n⌋**.

### construct w czasie liniowym

Budowanie kopca przez n operacji insert kosztowałoby O(n log n). Wykład pokazuje szybszy sposób — **od dołu**: liście (pozycje > n/2) już są kopcami. Dla i = ⌊n/2⌋, …, 1 wywołujemy `downheap(i)` — w tym momencie poddrzewa synów i są już kopcami, więc po downheap poddrzewo i też jest kopcem.

```pseudo title="construct (wykład)"
void construct()
{
  for i := n/2 downto 1 do
    downheap(i)
}
```

**Dlaczego to O(n)?** {own}

:::own
Uzasadnienie od autora strony (na slajdach podano tylko wynik).
:::

downheap z węzła na wysokości k kosztuje O(k). Węzłów na wysokości k jest ok. n/2ᵏ⁺¹. Suma: Σ k · n/2ᵏ⁺¹ = n · Σ k/2ᵏ⁺¹ ≤ n (bo Σ k/2ᵏ = 2). Większość węzłów jest nisko i „schodzi” tylko o krok czy dwa.

## HeapSort — sortowanie przez kopcowanie

```pseudo title="HeapSort (wykład)"
void HeapSort()
{
  construct();
  m := n;
  for i := n downto 2 do
    a[i] := deletemax();     // kopiec się kurczy, zwolnione miejsce dostaje maksimum
}
```

Analiza z wykładu: construct — O(n), n − 1 razy deletemax — O(n log n). Dokładniej **W(n) ≤ 2n log n + O(n)**.

- sortuje **w miejscu**: S(n) = O(1),
- **zawsze** O(n log n) (także pesymistycznie) — w przeciwieństwie do QuickSorta,
- **niestabilny**.

```java title="MaxHeap.java (według kodu z wykładu, indeksy od 1)"
@include t12-heap.java
```

## Drzewa (kopce) lewicowe

Kopiec binarny w tablicy ma jedną słabość: **scalenie dwóch kopców** wymaga O(n). Drzewa lewicowe (wykład asd10 i slajdy 2009 „Kolejka priorytetowa — kopiec lewicowy”) robią to w O(log n).

:::def
Dla węzła v niech **odl(v)** oznacza długość **skrajnie prawej ścieżki** od v do węzła zewnętrznego (pustego). **Drzewo lewicowe** to drzewo binarne, w którym dla każdego węzła wewnętrznego v skrajnie prawa ścieżka jest **najkrótszą** ze wszystkich ścieżek z v do węzła zewnętrznego — tzn. odl(lewy syn) ≥ odl(prawy syn).
:::

- długość skrajnie prawej ścieżki jest **≤ log₂(n + 1)** (drzewo jest „ciężkie” z lewej, a prawa ścieżka jest krótka),
- jeśli klucze ułożymy w **porządku kopcowym**, otrzymujemy **kopiec lewicowy**.

**Podstawowa operacja — scalanie** dwóch drzew lewicowych: scalamy rekurencyjnie **prawe ścieżki** (większy korzeń zostaje korzeniem, a jego prawe poddrzewo scalamy z drugim drzewem), a przy powrocie z rekursji **poprawiamy lewicowość** — jeśli trzeba, zamieniamy lewego syna z prawym.

Pozostałe operacje wyrażamy przez scalanie:
- `insert(x)` = scal(kopiec, drzewo jednoelementowe z x),
- `deletemax` = usuń korzeń i scal(lewe poddrzewo, prawe poddrzewo).

Koszt każdej operacji jest **logarytmiczny**.

```java title="LeftistHeap.java (według procedury Scal z wykładu)"
@include t12-leftist.java
```


## Wersja z wykładu 2026/2027 (M. Sydow) — „Kolejka priorytetowa”

:::exam
Kod upheap / downheap / construct ze slajdów jest dokładnie tym, który daje oficjalne odpowiedzi zadania dopuszczeniowego z kopcem typu min (kopiec w tablicy od indeksu 1). Zadania: wykonaj operację na kopcu i narysuj wynik, zastosuj construct — patrz [Sprawdziany 2026/2027](page:exams).
:::

:::def Kolejka priorytetowa
ADS do przetwarzania elementów z przypisanymi **priorytetami** (liczbami całkowitymi): **insert(e, p)**, **findMin()** (zwróć bez usuwania element o najmniejszym priorytecie), **delMin()** (zwróć z usunięciem). **Im niższa liczba, tym wyższy priorytet**; w odwrotnej interpretacji kolejka jest „typu max” (findMax, delMax).
:::

Implementacje: naiwne (tablice/listy), **kopiec binarny** (Williams, Floyd 1964), drzewo vEB, kopiec dwumianowy, Pairing Heap, kopiec Fibonacciego, … (na wykładzie tylko naiwne i kopiec binarny). **Naiwne:** priorytety **nieposortowane** — insert O(1), delMin O(n), construct O(n); **posortowane** — insert O(n), delMin O(1), construct O(n log n). Lista dowiązaniowa nie poprawia sytuacji.

:::def Kopiec binarny
**Binarne drzewo zupełne** (wypełniane od góry do dołu i na każdym poziomie od lewej do prawej) z **warunkiem porządku kopca**: priorytet w każdym węźle jest **niewiększy** niż priorytety w węzłach potomnych.
:::

Wnioski: minimalny priorytet jest zawsze w **korzeniu**; na każdej ścieżce od korzenia do liścia priorytety tworzą ciąg niemalejący; priorytety na poziomie **nie** są posortowane; wysokość n-elementowego kopca to **Θ(log n)**.

**Operacje:** insert(e) — dodaj w pierwszym wolnym od lewej miejscu ostatniego poziomu i przywróć porządek w górę (**upheap**); findMin() — korzeń; delMin() — usuń korzeń, wstaw do korzenia ostatni element (skrajnie prawy na ostatnim poziomie) i przywróć porządek w dół (**downheap**: zamieniaj z mniejszym synem, dopóki oba synowie nie są niemniejsi lub nie dojdziesz do ostatniego poziomu). Obie pomocnicze operacje zakładają, że warunek kopca zakłóca co najwyżej węzeł x. **Złożoność** (n — liczba elementów, op. dominująca — porównanie priorytetów): co najwyżej 1 (upheap) lub 2 (downheap) porównania na poziom → insert **O(log n)**, findMin **O(1)**, delMin **O(log n)**.

**Kopiec w tablicy** (dzięki zupełności, indeks 0 nieużywany, od góry do dołu i od lewej do prawej): $\text{parent}[i]=\lfloor i/2\rfloor$ (dzielenie całkowite), $\text{left}(i)=2i$, $\text{right}(i)=2i+1$. Przykład ze slajdów: kopiec 2(6(7(8, 10), 12), 3(9, 4)) to tablica [n, 2, 6, 3, 7, 12, 9, 4, 8, 10]; rodzic 12 (indeks 5) ma indeks 5/2 = 2.

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
```

**Szybkie construct:** zamiast n razy insert (Θ(n log n)) wpisujemy wszystkie elementy do tablicy w podanej kolejności i wykonujemy `for(i = n/2; i > 0; i--) downHeap(i)` — łącznie tylko **O(n)**.

**HeapSort:** wstaw wszystkie elementy do kolejki (`pq.insert`), potem dopóki niepusta — `result.add(pq.delMin())`; **Θ(n log n)** (stała większa niż w QuickSort). Inne zastosowania (algorytmy zachłanne): kod Huffmana, **Dijkstra**, **Prim**.

**Rozszerzenia.** Dynamiczna kolejka priorytetowa: construct, H insert (zwraca wskaźnik do elementu), findMin, delMin, **decreaseKey(H pointer, T newPriority)**, **delete(H pointer)**; złączalna — dodatkowo **merge(pq1, pq2)**.

| operacja | nieposort. | posort. | kopiec binarny | kopiec dwumianowy |
|---|---|---|---|---|
| insert | 1 | n | lg n | lg n |
| findMin | n | 1 | 1 | lg n |
| delMin | n | 1 | lg n | lg n |
| decreaseKey | 1 | n | lg n | lg n |
| delete | 1 | n | lg n | lg n |
| merge | 1 | n | **n** | **lg n** |

(wszystko w O(·))

### Przykładowe zadania ze slajdów

Definicja kolejki priorytetowej i kopca binarnego; analiza implementacji naiwnych; **wykonaj każdą operację na podanym kopcu i narysuj wynik**; **zastosuj construct do podanego ciągu i narysuj kopiec**; reprezentacja tablicowa; złożoność operacji na kopcu; zastosowania; rozszerzenia; złożoność decreaseKey, delete i merge na kopcu binarnym.

=== summary ===

## Wersja 2026/2027 (M. Sydow)

- PQ: insert(e, p), findMin, delMin. Kopiec: drzewo zupełne, rodzic ≤ dzieci; tablica od 1: parent i/2, synowie 2i, 2i+1.
- insert (upheap) O(log n), findMin O(1), delMin (ostatni do korzenia + downheap) O(log n); construct: downHeap(i) dla i = n/2..1 → O(n).
- HeapSort Θ(n log n); merge na kopcu binarnym O(n).


## Kolejka priorytetowa

- construct, insert, deletemax (lub deletemin).
- tablica nieuporządkowana: insert O(1), deletemax O(n); uporządkowana: odwrotnie; **kopiec: O(log n) oba, construct O(n)**.

## Kopiec

- warunek: ojciec ≥ syn ⇒ max w korzeniu; to **nie** BST.
- zupełny: poziomy pełne, ostatni od lewej; **h = ⌊log n⌋**.
- tablica od 1: synowie **2k, 2k+1**, ojciec **⌊k/2⌋** (od 0: 2k+1, 2k+2, (k−1)/2).
- **insert:** na koniec + **upheap** (w górę), O(log n).
- **deletemax:** korzeń ← ostatni, **downheap** (w dół, do większego syna), 2⌊log n⌋ porównań.
- **construct:** downheap dla i = n/2 … 1 — **O(n)**.

## HeapSort

construct + (n−1) × deletemax na koniec tablicy; **W ≤ 2n log n + O(n)**, w miejscu, zawsze n log n, niestabilny.

## Kopiec lewicowy

- odl(lewy) ≥ odl(prawy); prawa ścieżka ≤ log(n+1).
- **scal** po prawych ścieżkach + zamiana synów; insert i deletemax przez scal — O(log n).

=== tasks ===

:::task level=2 source="„ASD 10b”, zad. 1 (zmienione)" title="Budowa kopca na dwa sposoby"
Dla ciągu **{5, 8, 3, 10, 9, 4, 2, 7, 6}** (kopiec typu **min** — najmniejszy w korzeniu):

a) zbuduj kopiec kolejnymi operacjami **insert** („wolna” budowa),
b) wykonaj na nim operację **delmin**,
c) zbuduj kopiec z tych samych danych metodą **construct** („szybka” budowa, od dołu).

Podaj tablice po każdym kroku.
::hint
W kopcu typu min warunek jest odwrotny: ojciec ≤ syn, a upheap/downheap porównują „na mniejsze”. W construct zaczynasz od i = ⌊9/2⌋ = 4 (numeracja od 1).
::solution
**a) insert po kolei** (tablica od pozycji 1):

| wstawiony | tablica po upheap |
|---|---|
| 5 | 5 |
| 8 | 5, 8 |
| 3 | 3, 8, 5 |
| 10 | 3, 8, 5, 10 |
| 9 | 3, 8, 5, 10, 9 |
| 4 | 3, 8, 4, 10, 9, 5 |
| 2 | 2, 8, 3, 10, 9, 5, 4 |
| 7 | 2, 7, 3, 8, 9, 5, 4, 10 |
| 6 | 2, 6, 3, 7, 9, 5, 4, 10, 8 |

```tree
2(6(7(10,8),9),3(5,4))
```

**b) delmin:** usuwamy 2, na górę idzie ostatni (8), potem 8 schodzi do mniejszego syna: 8 ↔ 3, potem 8 ↔ 4. Wynik: **3, 6, 4, 7, 9, 5, 8, 10**.

**c) construct** (downheap dla i = 4, 3, 2, 1; start: 5, 8, 3, 10, 9, 4, 2, 7, 6):

| i | element | co się dzieje | tablica |
|---|---|---|---|
| 4 | 10 | synowie 7, 6 → zamiana z 6 | 5, 8, 3, 6, 9, 4, 2, 7, 10 |
| 3 | 3 | synowie 4, 2 → zamiana z 2 | 5, 8, 2, 6, 9, 4, 3, 7, 10 |
| 2 | 8 | synowie 6, 9 → z 6; potem synowie 7, 10 → z 7 | 5, 6, 2, 7, 9, 4, 3, 8, 10 |
| 1 | 5 | synowie 6, 2 → z 2; potem synowie 4, 3 → z 3 | **2, 6, 3, 7, 9, 4, 5, 8, 10** |

Szybka budowa wykonała **6** zamian (wolna — 8 przesunięć w górę) i dała **inny** (też poprawny) kopiec.
:::

:::task level=2 source="„ASD 10b”, zad. 2 (zmienione)" title="HeapSort krok po kroku"
Wykonaj algorytm **HeapSort** (kopiec typu max, jak na wykładzie) dla tablicy **{7, 12, 3, 15, 1, 9, 6, 11, 4}**. Podaj kopiec po construct i stan tablicy po każdym deletemax.
::hint
Po construct w korzeniu jest 15. Każdy deletemax przenosi maksimum na koniec aktualnego kopca, a kopiec kurczy się o 1.
::solution
**construct** (i = 4, 3, 2, 1): i = 4 — 15 już ≥ synów; i = 3 — 3 ↔ 9; i = 2 — 12 ↔ 15; i = 1 — 7 ↔ 15, 7 ↔ 12, 7 ↔ 11.

Kopiec: **15, 12, 9, 11, 1, 3, 6, 7, 4**

```tree
15(12(11(7,4),1),9(3,6))
```

Kolejne deletemax (kreska oddziela kopiec od posortowanej części):

| krok | tablica |
|---|---|
| 1 | 12, 11, 9, 7, 1, 3, 6, 4 \| 15 |
| 2 | 11, 7, 9, 4, 1, 3, 6 \| 12, 15 |
| 3 | 9, 7, 6, 4, 1, 3 \| 11, 12, 15 |
| 4 | 7, 4, 6, 3, 1 \| 9, 11, 12, 15 |
| 5 | 6, 4, 1, 3 \| 7, 9, 11, 12, 15 |
| 6 | 4, 3, 1 \| 6, 7, 9, 11, 12, 15 |
| 7 | 3, 1 \| 4, 6, 7, 9, 11, 12, 15 |
| 8 | 1 \| 3, 4, 6, 7, 9, 11, 12, 15 |

Wynik: **1, 3, 4, 6, 7, 9, 11, 12, 15**.
:::

:::task level=3 source="„ASD 10b”, zad. 3 (zmienione)" title="Prawda czy fałsz: szybka budowa kopca"
Niech kopiec H (typu **min**) będzie rezultatem działania algorytmu **construct** (szybka budowa, od dołu) dla tablicy

**E = [16, 12, 2, 13, 19, 8, 9, 1, 11, 4, 3]**.

Które zdania są prawdziwe?
1. Liczba zamian elementów wykonanych w trakcie budowy wynosi dokładnie 7.
2. Klucze kopca-drzewa H wypisane w kolejności PostOrder tworzą ciąg: 13, 12, 11, 16, 19, 4, 3, 8, 9, 2, 1.
3. Liczba wierzchołków wewnętrznych kopca-drzewa H wynosi dokładnie 6.
::hint
n = 11, więc downheap wykonujesz dla i = 5, 4, 3, 2, 1 (numeracja od 1). Licz każdą zamianę — także te przy schodzeniu o kilka poziomów.
::solution
| i | element | zamiany | tablica po kroku |
|---|---|---|---|
| 5 | 19 | 19 ↔ 3 | 16, 12, 2, 13, 3, 8, 9, 1, 11, 4, 19 |
| 4 | 13 | 13 ↔ 1 | 16, 12, 2, 1, 3, 8, 9, 13, 11, 4, 19 |
| 3 | 2 | — | bez zmian |
| 2 | 12 | 12 ↔ 1, 12 ↔ 11 | 16, 1, 2, 11, 3, 8, 9, 13, 12, 4, 19 |
| 1 | 16 | 16 ↔ 1, 16 ↔ 3, 16 ↔ 4 | **1, 3, 2, 11, 4, 8, 9, 13, 12, 16, 19** |

```tree
1(3(11(13,12),4(16,19)),2(8,9))
```

1. **Prawda** — zamian: 1 + 1 + 0 + 2 + 3 = **7**.
2. **Prawda** — postorder: 13, 12, 11, 16, 19, 4, 3, 8, 9, 2, 1.
3. **Fałsz** — węzły wewnętrzne to pozycje 1…⌊11/2⌋, czyli **5** (1, 3, 2, 11, 4).
:::

:::task level=1 source="own" title="Nawigacja po kopcu w tablicy"
Kopiec zupełny ma n = 30 elementów zapisanych w tablicy od indeksu 1. Podaj: indeks ojca i synów elementu na pozycji 13; które pozycje są liśćmi; jaka jest wysokość kopca.
::hint
Synowie k: 2k, 2k + 1; ojciec ⌊k/2⌋. Liście to pozycje, których synowie nie istnieją (2k > n).
::solution
- pozycja 13: ojciec **6**, synowie **26** i **27** (oba ≤ 30, istnieją),
- liście: pozycje **16…30** (dla k ≥ 16 mamy 2k > 30), węzły wewnętrzne: 1…15,
- wysokość: ⌊log₂ 30⌋ = **4**.
:::

:::task level=2 source="own" title="Dlaczego kopiec lewicowy?"
Wyjaśnij, dlaczego w kopcu lewicowym scalanie dwóch kopców o łącznie n elementach kosztuje O(log n), a w kopcu binarnym w tablicy — O(n).
::hint
Po której ścieżce przebiega rekurencja w procedurze Scal? Jak długa może być ta ścieżka?
::solution
Scal schodzi tylko **prawymi ścieżkami** obu drzew (w każdym kroku jedno z drzew traci korzeń i idziemy w jego prawe poddrzewo). W drzewie lewicowym prawa ścieżka jest najkrótszą ścieżką do węzła zewnętrznego, więc ma długość ≤ log₂(n + 1). Łączna długość obu prawych ścieżek to O(log n) — tyle jest kroków rekurencji, a każdy krok to O(1) pracy.

W kopcu binarnym w tablicy dwóch tablic nie da się „skleić” wskaźnikami — trzeba przepisać elementy do jednej tablicy i zbudować kopiec od nowa (construct) — **O(n)**.
:::
