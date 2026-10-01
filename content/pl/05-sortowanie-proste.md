---
id: t05
num: 5
type: topic
title: Sortowanie — problem i proste algorytmy (Selection, Insertion)
short: Sortowanie proste
desc: Czym jest sortowanie, co liczymy, co znaczy „w miejscu” i „stabilnie”. SelectionSort i InsertionSort krok po kroku, z analizą złożoności.
sources: asd2.pdf (§2 Sortowanie); Dziel-RzadzC.pdf (InsertionSort rekurencyjnie); Wyklady 2009/wyklad_5.pdf (Problem sortowania I), asd 08 wyklad_6.pdf (stabilność)
exercises: asd 05.pdf (zad. 1)
---

## Problem sortowania

Sortowanie to jeden z najczęściej rozwiązywanych problemów na komputerach. Powód jest prosty: **z uporządkowanych danych dużo łatwiej korzystać** (pomyśl o słowniku, książce telefonicznej albo o wyszukiwaniu binarnym z tematu 4).

:::def
**Sortowanie:** dany jest ciąg q = [a₀, a₁, …, aₙ₋₁] elementów zbioru liniowo uporządkowanego. Należy znaleźć takie przestawienie (permutację) elementów, żeby otrzymać ciąg **niemalejący**: a₀ ≤ a₁ ≤ … ≤ aₙ₋₁.
:::

Ustalenia z wykładu:

- **operacja dominująca:** porównanie dwóch elementów (czasem liczymy też zamiany/przestawienia),
- **złożoność pamięciowa S(n):** ile **dodatkowej** pamięci potrzeba (poza miejscem na sam ciąg),
- elementy trzymamy w tablicy `a[i]`, 0 ≤ i < n,
- przy analizie średniej zakładamy, że **każda permutacja** danych jest jednakowo prawdopodobna.

### Dwie ważne cechy algorytmów sortowania

:::def
- Algorytm sortuje **w miejscu**, jeśli potrzebuje tylko **stałej** dodatkowej pamięci: S(n) = O(1).
- Algorytm jest **stabilny**, jeśli elementy o **równych** kluczach zostają w tej samej kolejności względem siebie, co przed sortowaniem.
:::

:::analogy
Stabilność: masz listę studentów posortowaną alfabetycznie i sortujesz ją teraz po ocenie. Algorytm stabilny zachowa kolejność alfabetyczną wśród osób z tą samą oceną. Niestabilny może je „pomieszać”.
:::

## SelectionSort — sortowanie przez wybór

**Pomysł:** znajdź najmniejszy element i postaw go na początku. Potem znajdź najmniejszy z pozostałych i postaw go na drugim miejscu. I tak dalej.

:::analogy
Układasz karty na stole: przeglądasz wszystkie, bierzesz najmniejszą i kładziesz ją jako pierwszą. Z pozostałych znowu wybierasz najmniejszą — i tak aż do końca.
:::

```pseudo title="SelectionSort (wykład)"
Algorytm SelectionSort(a, n)
{
  for i := 0 to n-2 do {
    min := i;
    for j := i+1 to n-1 do
      if a[j] < a[min] then
        min := j;
    x := a[min];  a[min] := a[i];  a[i] := x;     // zamiana
  }
}
```

**Przykład** dla `[29, 10, 14, 37, 13]` (na zielono — część już posortowana, na żółto — znalezione minimum):

```array
@idx
start: 29 [10] 14 37 13
przebieg 0: {10} 29 14 37 [13]
przebieg 1: {10} {13} [14] 37 29
przebieg 2: {10} {13} {14} 37 [29]
przebieg 3: {10} {13} {14} {29} {37}
```

### Analiza SelectionSort

W przebiegu i porównujemy a[min] z elementami i+1…n−1, czyli wykonujemy n − 1 − i porównań. Razem:

- **W(n) = A(n) = (n−1) + (n−2) + … + 1 = n(n−1)/2 = ½n² + O(n)** — zawsze tyle samo, niezależnie od danych,
- **Δ(n) = δ(n) = 0** — algorytm jest całkowicie przewidywalny,
- **S(n) = O(1)** — sortuje w miejscu.

Zalety wymienione na wykładzie:

1. **optymalny pod względem liczby przestawień** — tylko n − 1 zamian (przydatne, gdy przestawianie jest drogie, np. duże rekordy),
2. prosty do napisania,
3. zadowalająco szybki dla małych n.

:::warn
SelectionSort **nie jest stabilny**. Przykład: `[2ᵃ, 2ᵇ, 1]` — w pierwszym przebiegu 2ᵃ zamienia się z 1 i ląduje za 2ᵇ: `[1, 2ᵇ, 2ᵃ]`.
:::

## InsertionSort — sortowanie przez wstawianie

**Pomysł:** trzymamy na początku tablicy **posortowany fragment**. Bierzemy kolejny element i **wstawiamy** go we właściwe miejsce tego fragmentu, przesuwając większe elementy o jedno miejsce w prawo.

:::analogy
Tak układa się karty w ręce podczas rozdawania: każdą nową kartę wsuwasz między już ułożone, tak żeby wszystko było po kolei.
:::

```pseudo title="InsertionSort (wykład)"
Algorytm InsertionSort(a, n)
{
  for i := 1 to n-1 do {
    j := i;
    x := a[i];
    while (j > 0) AND (a[j-1] > x) do {
      a[j] := a[j-1];          // przesuń większy element w prawo
      j := j - 1;
    }
    a[j] := x;                 // wstaw x na zwolnione miejsce
  }
}
```

**Przykład** dla `[29, 10, 14, 37, 13]` (na żółto — wstawiany element w nowym miejscu):

```array
@idx
start: 29 10 14 37 13
i=1: [10] 29 14 37 13
i=2: 10 [14] 29 37 13
i=3: 10 14 29 [37] 13
i=4: 10 [13] 14 29 37
```

### Analiza InsertionSort

Liczba porównań w kroku i zależy od tego, jak daleko trzeba przesunąć `x`:

- **najlepiej** (tablica już posortowana): po 1 porównaniu na krok → **n − 1** porównań,
- **najgorzej** (tablica posortowana odwrotnie): i porównań w kroku i → **W(n) = n(n−1)/2**,
- **średnio:** x wędruje średnio przez połowę posortowanego fragmentu → **A(n) ≈ n²/4**,
- **S(n) = O(1)**, algorytm jest **stabilny** (przesuwamy tylko elementy **ostro** większe od x).

:::tip
Liczba przesunięć w InsertionSort jest równa **liczbie inwersji** w ciągu, czyli par (i < j) z a[i] > a[j]. Dlatego algorytm jest bardzo szybki dla danych **prawie posortowanych** — w praktyce często używa się go do „wykończenia” małych fragmentów w szybszych algorytmach.
:::

### InsertionSort jako „dziel i rządź”

Wykład „Dziel i rządź” pokazuje ten sam algorytm rekurencyjnie: dzielimy zadanie na **1 i n−1** elementów. Posortuj rekurencyjnie pierwsze n−1 elementów, a potem **scal** wynik z ostatnim elementem (czyli wstaw go na miejsce).

- T(1) = 0, T(n) = T(n − 1) + (n − 1) ⇒ T(n) = n(n−1)/2 = O(n²).

```java title="ElementarySorts.java"
@include t05-elementary.java
```

```text title="Wynik programu"
pass 0: [10, 29, 14, 37, 13]
pass 1: [10, 13, 14, 37, 29]
pass 2: [10, 13, 14, 37, 29]
pass 3: [10, 13, 14, 29, 37]
i = 1: [10, 29, 14, 37, 13]
i = 2: [10, 14, 29, 37, 13]
i = 3: [10, 14, 29, 37, 13]
i = 4: [10, 13, 14, 29, 37]
```

## Porównanie

| | SelectionSort | InsertionSort |
|---|---|---|
| porównania — najlepiej | n(n−1)/2 | n − 1 |
| porównania — średnio | n(n−1)/2 | ≈ n²/4 |
| porównania — najgorzej | n(n−1)/2 | n(n−1)/2 |
| przestawienia | n − 1 zamian | = liczba inwersji (do n²/2) |
| pamięć S(n) | O(1) | O(1) |
| stabilny | nie | tak |
| kiedy dobry | drogie przestawianie, małe n | dane prawie posortowane, małe n |

Oba są **kwadratowe** — dla dużych n za wolne. W kolejnych tematach poznamy sortowania O(n log n) (MergeSort, QuickSort, HeapSort) i dowiemy się, że **lepiej niż n log n porównań się nie da** (drzewa decyzyjne).

## Jak zapisywać przebieg sortowania na ćwiczeniach {own}

:::own
Wskazówki autora strony do zadań typu „przedstaw działanie algorytmu … na tablicy …”.
:::

- Wypisuj **stan całej tablicy po każdym przebiegu** pętli zewnętrznej (po każdym i).
- Zaznaczaj granicę części posortowanej (np. kreską `|`).
- W SelectionSort podaj też, **który element był minimum** i z czym go zamieniono.
- W InsertionSort podaj **wstawiany element x** i ile elementów przesunięto.
- Na końcu policz porównania — prowadzący często o to pytają.

=== summary ===

## Pojęcia

- Sortowanie: permutacja dająca ciąg niemalejący; operacja dominująca — **porównanie**.
- **W miejscu:** S(n) = O(1). **Stabilny:** równe klucze zachowują kolejność.
- Analiza średnia: każda permutacja jednakowo prawdopodobna.

## SelectionSort

- przebieg i: znajdź min w a[i..n−1], zamień z a[i].
- W = A = n(n−1)/2, Δ = δ = 0, **n − 1 zamian** (optymalnie), S = O(1), **niestabilny**.

## InsertionSort

- a[0..i−1] posortowane; x = a[i] wstaw, przesuwając większe w prawo.
- najlepiej n − 1, średnio ≈ n²/4, najgorzej n(n−1)/2 porównań; S = O(1); **stabilny**.
- liczba przesunięć = liczba **inwersji**; świetny dla danych prawie posortowanych.
- rekurencyjnie: podział 1 ; n−1, T(n) = T(n−1) + n − 1.

## Na ćwiczeniach

Stan tablicy po każdym przebiegu + granica części posortowanej + liczba porównań.

=== tasks ===

:::task level=1 source="Ćwiczenie 5, zad. 1 (zmienione)" title="SelectionSort i InsertionSort na tablicy"
Przedstaw działanie algorytmów **SelectionSort** i **InsertionSort** (wersje z wykładu) na tablicy

`[12, 5, 17, 3, 8, 14, 1, 10, 6, 2]`.

Podaj stan tablicy po każdym przebiegu pętli zewnętrznej i policz porównania elementów.
::hint
SelectionSort ma 9 przebiegów (i = 0…8). InsertionSort ma 9 kroków (i = 1…9). W InsertionSort licz porównanie `a[j−1] > x` za każdym razem, gdy jest wykonywane (także to ostatnie, które kończy pętlę).
::solution
**SelectionSort** (w nawiasie: znalezione minimum):

| przebieg | min | tablica po przebiegu |
|---|---|---|
| i = 0 | 1 | 1, 5, 17, 3, 8, 14, 12, 10, 6, 2 |
| i = 1 | 2 | 1, 2, 17, 3, 8, 14, 12, 10, 6, 5 |
| i = 2 | 3 | 1, 2, 3, 17, 8, 14, 12, 10, 6, 5 |
| i = 3 | 5 | 1, 2, 3, 5, 8, 14, 12, 10, 6, 17 |
| i = 4 | 6 | 1, 2, 3, 5, 6, 14, 12, 10, 8, 17 |
| i = 5 | 8 | 1, 2, 3, 5, 6, 8, 12, 10, 14, 17 |
| i = 6 | 10 | 1, 2, 3, 5, 6, 8, 10, 12, 14, 17 |
| i = 7 | 12 | bez zmian (12 już na miejscu) |
| i = 8 | 14 | bez zmian |

Porównań: 9 + 8 + … + 1 = **45**, zamian: **9** (dwie ostatnie to zamiana elementu z samym sobą).

**InsertionSort** (x — wstawiany element):

| krok | x | tablica po kroku |
|---|---|---|
| i = 1 | 5 | 5, 12, 17, 3, 8, 14, 1, 10, 6, 2 |
| i = 2 | 17 | 5, 12, 17, 3, 8, 14, 1, 10, 6, 2 |
| i = 3 | 3 | 3, 5, 12, 17, 8, 14, 1, 10, 6, 2 |
| i = 4 | 8 | 3, 5, 8, 12, 17, 14, 1, 10, 6, 2 |
| i = 5 | 14 | 3, 5, 8, 12, 14, 17, 1, 10, 6, 2 |
| i = 6 | 1 | 1, 3, 5, 8, 12, 14, 17, 10, 6, 2 |
| i = 7 | 10 | 1, 3, 5, 8, 10, 12, 14, 17, 6, 2 |
| i = 8 | 6 | 1, 3, 5, 6, 8, 10, 12, 14, 17, 2 |
| i = 9 | 2 | 1, 2, 3, 5, 6, 8, 10, 12, 14, 17 |

Porównań `a[j−1] > x`: **35**, przesunięć: **29** (tyle, ile inwersji w danych).
:::

:::task level=1 source="own" title="Najlepsze i najgorsze dane"
Dla n = 6 podaj przykład danych, dla których InsertionSort wykona **najmniej**, a dla których **najwięcej** porównań. Ile ich będzie? Czy dla SelectionSort takie dane też istnieją?
::hint
Zastanów się, kiedy x nie trzeba w ogóle przesuwać, a kiedy trzeba go przesunąć na sam początek.
::solution
- **Najmniej:** dane posortowane rosnąco, np. `[1, 2, 3, 4, 5, 6]` → w każdym kroku 1 porównanie → **5** porównań.
- **Najwięcej:** dane posortowane malejąco, np. `[6, 5, 4, 3, 2, 1]` → w kroku i jest i porównań → 1 + 2 + 3 + 4 + 5 = **15** = 6·5/2.
- **SelectionSort** zawsze wykonuje **15** porównań (Δ(n) = 0) — nie ma danych lepszych ani gorszych. Różni się tylko liczba „prawdziwych” zamian (zamiana elementu z samym sobą).
:::

:::task level=2 source="own" title="Stabilność w praktyce"
Mamy rekordy (ocena, nazwisko) posortowane alfabetycznie po nazwisku:

`(4, Adamska), (3, Kowal), (4, Nowak), (3, Wiśniewski), (5, Zieliński)`

Posortuj je rosnąco **po ocenie** algorytmem InsertionSort i algorytmem SelectionSort. W którym wyniku osoby z tą samą oceną nadal są w kolejności alfabetycznej?
::hint
Wykonaj oba algorytmy, porównując tylko oceny. W SelectionSort zwróć uwagę na pierwszą zamianę.
::solution
**InsertionSort** (stabilny): `(3, Kowal), (3, Wiśniewski), (4, Adamska), (4, Nowak), (5, Zieliński)` — w grupach „3” i „4” kolejność alfabetyczna zachowana ✓.

**SelectionSort:**
- i = 0: minimum to (3, Kowal) na poz. 1 → zamiana z (4, Adamska): `(3,K), (4,A), (4,N), (3,W), (5,Z)`,
- i = 1: minimum to (3, Wiśniewski) na poz. 3 → zamiana z (4, Adamska): `(3,K), (3,W), (4,N), (4,A), (5,Z)`,
- i = 2, 3: bez zmian.

Wynik: `(3, Kowal), (3, Wiśniewski), (4, Nowak), (4, Adamska), (5, Zieliński)` — **Nowak przed Adamską**, kolejność alfabetyczna w grupie „4” zepsuta ✗. SelectionSort nie jest stabilny.
:::

:::task level=2 source="own" title="Inwersje"
Ile inwersji ma ciąg `[4, 1, 3, 2]`? Ile przesunięć wykona InsertionSort? Jaka jest największa możliwa liczba inwersji ciągu długości n?
::hint
Inwersja to para pozycji (i < j), w której a[i] > a[j]. Wypisz wszystkie pary.
::solution
Pary z a[i] > a[j]: (4,1), (4,3), (4,2), (3,2) → **4 inwersje**, więc InsertionSort wykona **4 przesunięcia**. Największa liczba inwersji to liczba wszystkich par: **n(n−1)/2** (ciąg malejący).
:::
