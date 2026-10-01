---
id: t09
num: 9
type: topic
title: Struktury liniowe — stos, kolejka, listy
short: Stos, kolejka, listy
desc: Abstrakcyjne struktury danych, stos (LIFO) i kolejka (FIFO), aksjomaty operacji, listy dwukierunkowe z atrapami, odwrotna notacja polska, sito Eratostenesa i sortowanie list przez scalanie z kolejką.
sources: asd6.pdf (stos); asd7.pdf (listy); Wyklady 2009/asd 09 wyklad_7.pdf (lista, stos, kolejka, wyrażenia)
exercises: asd 07.pdf (zad. 1–3)
---

## Abstrakcyjna struktura danych

Wykład asd6 wprowadza ważną myśl: **najpierw definiujemy, co struktura umie** (jakie ma operacje i jak się one zachowują), a **dopiero potem**, osobno, jak ją zaimplementować.

:::def
**Abstrakcyjna struktura danych** (ADT) to zbiór wartości razem z operacjami na nich, opisany **bez** mówienia o implementacji. Od jakości implementacji zależy efektywność programów, które z tej struktury korzystają — ale program korzystający z ADT nie musi znać szczegółów.
:::

:::analogy
Pilot do telewizora ma przyciski „głośniej”, „ciszej”, „następny kanał”. Nie musisz wiedzieć, co jest w środku, żeby go używać. Przyciski to **interfejs** (ADT), a elektronika w środku to **implementacja**.
:::

## Stos (LIFO)

:::def
**Stos** S to struktura, na której wykonujemy operacje:
- `push(x)` — włóż x na wierzch stosu,
- `pop()` — zdejmij i zwróć element włożony **najpóźniej**,
- `top()` — zwróć element włożony najpóźniej, **nie** usuwając go,
- `size()` — liczba elementów,
- `isEmpty()` — TRUE wtedy i tylko wtedy, gdy stos jest pusty.

Zasada: **ostatni wszedł — pierwszy wyjdzie** (Last In, First Out).
:::

:::analogy
Stos talerzy w szafce: odkładasz talerz na górę i zawsze bierzesz ten z góry. Talerza z samego dołu nie wyjmiesz bez zdjęcia wszystkich wyższych.
:::

**Gdzie się używa stosu?**

- **wywołania funkcji** i rekursja (temat 6) — każde wywołanie odkłada swoje zmienne na stos,
- QuickSort bez rekursji (temat 7),
- obliczanie wartości wyrażeń (niżej),
- przeszukiwanie grafu w głąb — DFS (temat 13),
- przycisk „Cofnij” w edytorze.

**Implementacje:** w tablicy (indeks wierzchołka) albo na liście dowiązaniowej (wierzchołek = pierwszy węzeł). W obu **wszystkie operacje są O(1)**.

## Kolejka (FIFO)

:::def
**Kolejka** Q to struktura z operacjami:
- `inject(x)` (in, dodaj) — wstaw x na **koniec** kolejki,
- `front()` (first) — zwróć element z **początku**,
- `pop()` (out, usuń) — usuń element z **początku**,
- `isEmpty()`.

Zasada: **pierwszy wszedł — pierwszy wyjdzie** (First In, First Out).
:::

:::analogy
Kolejka w sklepie: nowi ustawiają się na końcu, a obsługiwany jest ten, kto stoi najdłużej (na początku).
:::

**Gdzie się używa kolejki?** Przeszukiwanie grafu **wszerz** — BFS (temat 13), bufory (drukarka, klawiatura), symulacje, algorytm Huffmana dla danych posortowanych (temat 14).

**Implementacje:** lista z dowiązaniami do początku i końca albo **tablica cykliczna** (indeks początku „zawija się” modulo rozmiar tablicy). Wszystkie operacje **O(1)**.

```java title="StackQueue.java — stos, kolejka cykliczna i ONP"
@include t09-stack-queue.java
```

## Aksjomaty stosu i kolejki {own}

:::own
Na ćwiczeniach pojawiają się pytania „które zdania są prawdziwe w strukturze stosów / kolejek”. Poniżej wyjaśnienie autora strony, jak o tym myśleć (w zestawach wykładowych tego nie było wprost).
:::

W takim zapisie operacje traktujemy jak **funkcje zwracające nową wartość** (nie zmieniamy obiektu w miejscu):

- stos: `push(s, e)` — nowy stos, `pop(s)` — stos bez wierzchołka, `top(s)` — element, `empty(s)` — prawda/fałsz,
- kolejka: `in(q, e)` — nowa kolejka z e na końcu, `out(q)` — kolejka bez pierwszego, `first(q)` — pierwszy element, `empty(q)`.

**Podstawowe prawa stosu:**
- `top(push(s, e)) = e`,
- `pop(push(s, e)) = s`,
- `¬empty(s) ⇒ push(pop(s), top(s)) = s` (zdejmij i odłóż z powrotem — nic się nie zmienia),
- `empty(push(s, e)) = fałsz`.

**Podstawowe prawa kolejki:**
- `empty(q) ⇒ first(in(q, e)) = e` (w pustej kolejce nowy element jest pierwszy),
- `¬empty(q) ⇒ first(in(q, e)) = first(q)` (dodanie na koniec nie zmienia początku),
- `empty(q) ⇒ out(in(q, e)) = q`,
- `¬empty(q) ⇒ out(in(q, e)) = in(out(q), e)` (dodawanie na końcu i usuwanie z początku można zamienić kolejnością).

:::tip
Sprawdzając zdanie, weź **mały konkretny przykład** (np. stos [1, 2] z wierzchołkiem 2) i policz obie strony równości. Jeśli choć jeden przykład daje różne wyniki — zdanie jest fałszywe. Pamiętaj o założeniach typu `¬empty(s)` — bez nich `pop` i `top` nie mają sensu.
:::

## Wyrażenia arytmetyczne i odwrotna notacja polska

Ze slajdów 2009: stos świetnie nadaje się do **obliczania wartości wyrażeń**. Najprościej, gdy wyrażenie jest zapisane w **odwrotnej notacji polskiej** (ONP, RPN) — operator stoi **po** argumentach: zamiast `(2 + 3) * 4` piszemy `2 3 + 4 *`. Nawiasy są niepotrzebne!

**Algorytm:** czytamy symbole od lewej:
- liczba → `push` na stos,
- operator → zdejmij dwie liczby (najpierw prawy argument b, potem lewy a), oblicz `a op b`, wynik `push`.

Na końcu na stosie jest jedna liczba — wynik.

| symbol | stos po kroku |
|---|---|
| 2 | 2 |
| 3 | 2 3 |
| + | 5 |
| 4 | 5 4 |
| * | 20 |

:::info
Zamianę zwykłego zapisu (z nawiasami) na ONP też robi się stosem — to tzw. algorytm stacji rozrządowej (Dijkstry). To wiadomość od autora strony: na slajdach jest tylko obliczanie wartości.
:::

## Listy

:::def
**Lista** to skończony ciąg elementów L = [x₁, x₂, …, xₙ]. x₁ i xₙ to **końce** listy (lewy/głowa i prawy/ogon), |L| = n to **długość**; lista pusta: L = []. Z każdym elementem xᵢ związany jest **klucz** kᵢ, który go identyfikuje.
:::

Podstawowe operacje (wykład asd7):

| Operacja | Znaczenie |
|---|---|
| `Locate(k, L)` | znajdź element o kluczu k (lub NULL) |
| `Retrieve(p, L)` | zwróć element z pozycji p (NULL, gdy p > \|L\|) |
| `Insert(x, p, L)` | wstaw x na pozycję p (dla p > \|L\| + 1 wynik nieokreślony) |
| `Delete(p, L)` | usuń p-ty element |

Szczególne przypadki na **końcach** listy:

| na początku | na końcu |
|---|---|
| `Push(x, L)` — wstaw | `Inject(x, L)` — wstaw |
| `Pop(L)` — usuń | `Eject(L)` — usuń |
| `Front(L)` — podaj | `Rear(L)` — podaj |

- lista z operacjami **Inject, Front, Pop** = **kolejka**,
- lista z operacjami **Front, Push, Pop** = **stos**.

### Implementacja: lista dwukierunkowa z atrapami

Każdy **węzeł** przechowuje element, klucz oraz dowiązania do **następnego** i **poprzedniego** węzła. Wykład stosuje sprytny trik: na początku i na końcu listy stoją dwa **puste węzły — atrapy** (strażnicy). Dzięki nim wstawianie i usuwanie wyglądają zawsze tak samo — nie trzeba osobno obsługiwać pustej listy ani końców.

```text title="Lista [A, X, B] z atrapami"
atrapa ⇄ A ⇄ X ⇄ B ⇄ atrapa
 first                  last
```

Wstawienie za węzłem v to zmiana **czterech dowiązań** — O(1). Za to dojście do p-tej pozycji wymaga przejścia p węzłów — O(p).

```java title="DoubleLinkedList.java (uproszczona wersja klasy z wykładu)"
@include t09-linkedlist.java
```

### Lista czy tablica? {own}

:::own
Porównanie przygotowane przez autora strony.
:::

| Operacja | Tablica | Lista dwukierunkowa |
|---|---|---|
| dostęp do i-tego elementu | **O(1)** | O(i) |
| wstawienie/usunięcie na początku | O(n) (przesuwanie) | **O(1)** |
| wstawienie/usunięcie na końcu | O(1) (zamortyzowane) | **O(1)** |
| wstawienie w środku (mając węzeł) | O(n) | **O(1)** |
| wyszukiwanie po kluczu | O(n) (O(log n), gdy posortowana) | O(n) |
| dodatkowa pamięć | brak | 2 dowiązania na element |

## Dwa algorytmy na listach z wykładu

### Sito Eratostenesa

Tworzymy listę liczb 2, 3, …, n. Pierwsza liczba na liście jest zawsze **pierwsza** (nie dzieli jej żadna mniejsza, bo wszystkie wielokrotności mniejszych już usunęliśmy). Zapisujemy ją i **usuwamy z listy wszystkie jej wielokrotności**. Powtarzamy, aż lista się opróżni.

```text title="n = 20"
start: 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20
p = 2: 3 5 7 9 11 13 15 17 19
p = 3: 5 7 11 13 17 19
p = 5: 7 11 13 17 19
… pozostałe są pierwsze: 7 11 13 17 19
liczby pierwsze: 2 3 5 7 11 13 17 19
```

### Sortowanie listy przez scalanie z kolejką

Ciekawy wariant MergeSortu bez rekursji: wkładamy do **kolejki** jednoelementowe listy. Dopóki kolejka ma więcej niż jedną listę: **zdejmij dwie z początku, scal je i wstaw wynik na koniec**. Każdy element bierze udział w O(log n) scaleniach, więc łącznie **O(n log n)**.

```java title="ListAlgorithms.java"
@include t09-list-algorithms.java
```

=== summary ===

## ADT

Najpierw operacje i ich zachowanie, potem implementacja.

## Stos (LIFO)

- `push, pop, top, size, isEmpty` — wszystkie **O(1)** (tablica lub lista).
- zastosowania: rekursja, QuickSort bez rekursji, ONP, DFS, „cofnij”.
- prawa: top(push(s,e)) = e; pop(push(s,e)) = s; ¬empty(s) ⇒ push(pop(s), top(s)) = s.

## Kolejka (FIFO)

- `inject (in), front (first), pop (out), isEmpty` — **O(1)** (lista z głową i ogonem lub tablica cykliczna).
- zastosowania: BFS, bufory, Huffman.
- prawa: empty(q) ⇒ first(in(q,e)) = e; ¬empty(q) ⇒ first(in(q,e)) = first(q); ¬empty(q) ⇒ out(in(q,e)) = in(out(q),e).

## ONP

liczba → push; operator → b = pop, a = pop, push(a op b). `2 3 + 4 *` = 20.

## Listy

- Locate, Retrieve, Insert, Delete; końce: Push/Pop/Front i Inject/Eject/Rear.
- Inject+Front+Pop = kolejka; Front+Push+Pop = stos.
- lista dwukierunkowa z **atrapami**: wstaw/usuń O(1), dostęp do pozycji p — O(p).
- sito Eratostenesa na liście; MergeSort list z kolejką — O(n log n).

=== tasks ===

:::task level=2 source="Ćwiczenie 7, zad. 1 (zmienione)" title="Prawda czy fałsz: stosy"
Które zdania są prawdziwe w strukturze stosów (s — dowolny stos, e, a, b — elementy)?

a) ¬empty(s) ⇒ push(pop(s), top(s)) = s
b) top(push(s, e)) = e
c) ¬empty(s) ⇒ pop(push(pop(s), e)) = pop(s)
d) push(push(s, a), b) = push(push(s, b), a)
::hint
Weź przykład s = [1, 2] (wierzchołek 2) i policz obie strony. W d) spróbuj a = 5, b = 7.
::solution
a) **Prawda.** pop(s) = [1], top(s) = 2, push([1], 2) = [1, 2] = s.
b) **Prawda.** Włożony element jest na wierzchu.
c) **Prawda.** push(pop(s), e) kładzie e na pop(s), a pop zdejmuje je z powrotem — zostaje pop(s).
d) **Fałsz** (w ogólności). push(push(s,5),7) ma wierzchołek 7, a push(push(s,7),5) — wierzchołek 5. Równość zachodzi tylko dla a = b.
:::

:::task level=2 source="Ćwiczenie 7, zad. 1 (zmienione)" title="Prawda czy fałsz: kolejki"
Które zdania są prawdziwe w strukturze kolejek (q — dowolna kolejka)?

a) ¬empty(q) ⇒ first(in(q, e)) = first(q)
b) empty(q) ⇒ first(in(q, e)) = e
c) ¬empty(q) ⇒ in(out(q), first(q)) = q
d) in(in(q, a), b) = in(in(q, b), a)
::hint
W c) weź q = [1, 2, 3] (1 na początku). Co się stanie z pierwszym elementem?
::solution
a) **Prawda.** Dodanie na koniec nie zmienia początku niepustej kolejki.
b) **Prawda.** W pustej kolejce nowy element jest jednocześnie pierwszy.
c) **Fałsz** (w ogólności). Dla q = [1, 2, 3]: out(q) = [2, 3], in([2, 3], 1) = [2, 3, 1] ≠ q. To „obrót” kolejki; równość zachodzi np. dla kolejki jednoelementowej.
d) **Fałsz** (w ogólności). Kolejność dodawania ma znaczenie: [..., a, b] ≠ [..., b, a] dla a ≠ b.
:::

:::task level=2 source="Ćwiczenie 7, zad. 2 (zmienione)" title="Ciąg operacji na kolejce"
Kolejkę Q zbudowano, wstawiając kolejno elementy **7, 3, 12, 5, 9, 1, 14, 6, 10, 2** (7 jest na początku). Następnie wykonano:

1. IN(Q, FIRST(Q))
2. OUT(Q)
3. OUT(Q)
4. IN(Q, 20)
5. IN(Q, FIRST(Q))
6. OUT(Q)

Które zdania są prawdziwe?
- FIRST(Q) po wykonaniu wszystkich operacji wynosi 5.
- Maksymalna długość kolejki w trakcie wynosiła 11.
- Końcowa długość kolejki wynosi 9.
::hint
Rozpisz zawartość kolejki po każdej operacji. FIRST nie zmienia kolejki, tylko podaje element.
::solution
| krok | kolejka (początek po lewej) | długość |
|---|---|---|
| start | 7 3 12 5 9 1 14 6 10 2 | 10 |
| 1. IN(Q, 7) | 7 3 12 5 9 1 14 6 10 2 7 | 11 |
| 2. OUT | 3 12 5 9 1 14 6 10 2 7 | 10 |
| 3. OUT | 12 5 9 1 14 6 10 2 7 | 9 |
| 4. IN(Q, 20) | 12 5 9 1 14 6 10 2 7 20 | 10 |
| 5. IN(Q, 12) | 12 5 9 1 14 6 10 2 7 20 12 | 11 |
| 6. OUT | 5 9 1 14 6 10 2 7 20 12 | 10 |

- FIRST(Q) = 5 → **prawda**,
- maksymalna długość 11 → **prawda**,
- końcowa długość 9 → **fałsz** (jest 10).
:::

:::task level=2 source="Ćwiczenie 7, zad. 3 (zmienione)" title="Ciąg operacji na stosie"
Stos S zbudowano, wkładając kolejno **4, 11, 6, 2, 9, 15, 3, 8** (8 jest na wierzchu). Następnie wykonano:

1. PUSH(S, TOP(S))
2. POP(S)
3. POP(S)
4. PUSH(S, 17)
5. PUSH(S, TOP(S))
6. POP(S)

Które zdania są prawdziwe?
- Końcowa wysokość stosu wynosi 8.
- TOP(S) na końcu wynosi 3.
- Maksymalna wysokość w trakcie wynosiła 9.
::hint
Rozpisz stos po każdej operacji (wierzchołek po prawej).
::solution
| krok | stos (wierzchołek po prawej) | wysokość |
|---|---|---|
| start | 4 11 6 2 9 15 3 8 | 8 |
| 1. PUSH(8) | 4 11 6 2 9 15 3 8 8 | 9 |
| 2. POP | 4 11 6 2 9 15 3 8 | 8 |
| 3. POP | 4 11 6 2 9 15 3 | 7 |
| 4. PUSH(17) | 4 11 6 2 9 15 3 17 | 8 |
| 5. PUSH(17) | 4 11 6 2 9 15 3 17 17 | 9 |
| 6. POP | 4 11 6 2 9 15 3 17 | 8 |

- wysokość 8 → **prawda**,
- TOP = 3 → **fałsz** (TOP = 17),
- maksymalna wysokość 9 → **prawda**.
:::

:::task level=1 source="own" title="Odwrotna notacja polska"
Oblicz wartość wyrażenia w ONP: **6 2 3 + * 4 2 / −**. Pokaż stan stosu po każdym symbolu. Jak wygląda to wyrażenie w zwykłym zapisie?
::hint
Przy operatorze zdejmij najpierw b (wierzchołek), potem a, i oblicz a op b — kolejność ma znaczenie dla − i /.
::solution
| symbol | stos |
|---|---|
| 6 | 6 |
| 2 | 6 2 |
| 3 | 6 2 3 |
| + | 6 5 |
| * | 30 |
| 4 | 30 4 |
| 2 | 30 4 2 |
| / | 30 2 |
| − | 28 |

Wynik: **28**. Zwykły zapis: **6 · (2 + 3) − 4 / 2**.
:::

:::task level=2 source="own" title="Sortowanie listy przez scalanie z kolejką"
Wykonaj algorytm „MergeSort z kolejką” dla danych **[5, 2, 8, 1, 9, 3]**. Wypisz zawartość kolejki po każdym scaleniu. Ile scaleń wykonano?
::hint
Na starcie kolejka zawiera 6 list jednoelementowych. Zawsze bierzesz dwie z początku i wynik wstawiasz na koniec.
::solution
| krok | scalane | kolejka po kroku |
|---|---|---|
| start | | [5] [2] [8] [1] [9] [3] |
| 1 | [5] + [2] | [8] [1] [9] [3] [2,5] |
| 2 | [8] + [1] | [9] [3] [2,5] [1,8] |
| 3 | [9] + [3] | [2,5] [1,8] [3,9] |
| 4 | [2,5] + [1,8] | [3,9] [1,2,5,8] |
| 5 | [3,9] + [1,2,5,8] | [1,2,3,5,8,9] |

**5 scaleń** (zawsze n − 1, bo każde scalenie zmniejsza liczbę list o 1).
:::

:::task level=3 source="own" title="Kolejka z dwóch stosów"
Zaprojektuj kolejkę (inject, front, pop), mając do dyspozycji **tylko dwa stosy**. Uzasadnij, że każda operacja kosztuje **średnio** (w sumie po wielu operacjach) O(1).
::hint
Jeden stos „przyjmuje” nowe elementy, drugi „wydaje”. Kiedy stos wydający jest pusty, przełóż do niego wszystko z przyjmującego — kolejność się odwróci.
::solution
Stosy `IN` i `OUT`:
- `inject(x)`: `IN.push(x)`,
- `pop()` / `front()`: jeśli `OUT` pusty — przekładaj `IN.pop()` na `OUT.push(...)`, aż `IN` będzie pusty; potem `OUT.pop()` / `OUT.top()`.

Przełożenie odwraca kolejność, więc na wierzchu `OUT` jest najstarszy element — FIFO się zgadza. Każdy element jest **raz** wkładany do IN, **raz** przekładany i **raz** zdejmowany z OUT — 3 operacje stosowe na element, więc n operacji kolejki kosztuje O(n), czyli **O(1) zamortyzowanie** na operację (pojedyncza operacja może trwać długo, ale rzadko).
:::
