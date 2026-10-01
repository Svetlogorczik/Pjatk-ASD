---
id: t11
num: 11
type: topic
title: Drzewa AVL i tablice haszujące
short: AVL i haszowanie
desc: Jak utrzymać drzewo BST w równowadze — współczynnik zrównoważenia i rotacje AVL; minimalna i maksymalna liczba węzłów; słownik w tablicy haszującej — funkcja haszująca, łańcuchy, adresowanie otwarte.
sources: Wyklady 2009/asd 10 wyklad_8.pdf (słownik: tablica haszująca, BST, AVL); Asd9.pdf (wstęp: drzewa AVL)
exercises: asd 09.pdf (zad. 1–3)
---

## Po co równoważyć drzewa?

Z tematu 10 wiemy, że operacje na BST kosztują O(h), a h może wynosić nawet n − 1 (np. gdy wstawiamy posortowane dane). Wykład asd9 zapowiada rozwiązanie: **drzewa AVL**, które gwarantują wykonanie search, insert i delete w czasie **O(log n)** zawsze.

## Drzewo AVL

:::def
**Drzewo AVL** (Adelson-Velski i Landis, 1962) to drzewo BST, w którym dla **każdego** węzła wysokości lewego i prawego poddrzewa różnią się **co najwyżej o 1**.

**Współczynnik zrównoważenia** (balance factor) węzła v:
**BF(v) = h(lewe poddrzewo) − h(prawe poddrzewo)**, a w drzewie AVL **BF(v) ∈ {−1, 0, +1}**.
(Wysokość pustego poddrzewa = −1.)
:::

:::analogy
Wyobraź sobie wieszak-mobil nad łóżeczkiem: każde ramię musi być w miarę wyważone. Jeśli jedna strona robi się o dwa „piętra” cięższa, trzeba przewiesić elementy — to właśnie **rotacja**.
:::

Przykład drzewa AVL z zapisanymi współczynnikami BF (mała czerwona liczba):

```tree
20[0](10[1](5[0],_),30[-1](_,40[0]))
```

### Ile węzłów ma drzewo AVL wysokości h?

- **najwięcej:** pełne drzewo binarne — **2ʰ⁺¹ − 1** węzłów,
- **najmniej:** oznaczmy przez N(h). Najrzadsze drzewo AVL wysokości h ma korzeń, jedno poddrzewo wysokości h − 1 i drugie wysokości h − 2 (oba też najrzadsze):

**N(0) = 1, N(1) = 2, N(h) = N(h − 1) + N(h − 2) + 1.**

Kolejno: 1, 2, 4, 7, 12, 20, 33, … To liczby Fibonacciego pomniejszone o 1: **N(h) = Fₕ₊₃ − 1**. Ponieważ Fibonacci rośnie wykładniczo (φʰ), wysokość drzewa AVL o n węzłach jest **logarytmiczna**: h < 1,44·log₂(n + 2), czyli **h = O(log n)**.

:::tip
Znowu liczby Fibonacciego — jak w najgorszym przypadku algorytmu Euklidesa (temat 1)! To dobry przykład, że ta sama matematyka pojawia się w bardzo różnych miejscach.
:::

## Wstawianie do AVL

1. Wstawiamy klucz jak do zwykłego BST (nowy liść).
2. Wracamy w górę ścieżką od nowego liścia do korzenia, **przeliczając BF**.
3. Pierwszy węzeł, w którym |BF| = 2, naprawiamy **rotacją**. Po jednej rotacji (pojedynczej lub podwójnej) przy wstawianiu całe drzewo znów jest AVL.

Są cztery przypadki (nazwa mówi, gdzie jest „nadwyżka”: w **L**ewym poddrzewie **L**ewego syna itd.):

| Przypadek | BF węzła | BF syna po cięższej stronie | Naprawa |
|---|---|---|---|
| **LL** | +2 | +1 (lub 0) | pojedyncza rotacja w **prawo** |
| **RR** | −2 | −1 (lub 0) | pojedyncza rotacja w **lewo** |
| **LR** | +2 | −1 | podwójna: w lewo na synu, potem w prawo |
| **RL** | −2 | +1 | podwójna: w prawo na synu, potem w lewo |

### Rotacja pojedyncza (przypadek LL)

Węzeł y ma za wysokie lewe poddrzewo, a „nadwyżka” jest po lewej stronie jego lewego syna x. Obracamy: x idzie w górę, y w dół w prawo, a środkowe poddrzewo B przechodzi z x do y (porządek BST: A < x < B < y < C zostaje zachowany).

```tree caption="przed: przypadek LL w węźle y"
y(x(A,B),C)
```

```tree caption="po rotacji w prawo"
x(A,y(B,C))
```

### Rotacja podwójna (przypadek LR)

Nadwyżka jest po **prawej** stronie lewego syna x (w jego prawym synu y). Jedna rotacja nie wystarczy — robimy dwie: najpierw w lewo wokół x, potem w prawo wokół z. Efekt: y wędruje na górę.

```tree caption="przed: przypadek LR w węźle z"
z(x(A,y(B,C)),D)
```

```tree caption="po podwójnej rotacji"
y(x(A,B),z(C,D))
```

:::exam
Na ćwiczeniach typowe zadanie: „wstawiaj kolejne elementy do pustego drzewa AVL, przeliczaj BF i wykonuj rotacje”. Rób to **po jednym elemencie**: wstaw → przelicz BF na ścieżce w górę → jeśli gdzieś ±2, nazwij przypadek (LL/RR/LR/RL) i narysuj drzewo po rotacji.
:::

## Usuwanie z AVL

1. Usuwamy jak z BST (liść / jeden syn / następnik).
2. Wracamy w górę, przeliczając BF; wszędzie, gdzie |BF| = 2 — rotacja.

Różnice względem wstawiania:
- przy usuwaniu może być potrzebne **kilka rotacji** (nawet na każdym poziomie — O(log n)),
- pojawia się przypadek, gdy syn po cięższej stronie ma **BF = 0** — wtedy wystarcza **pojedyncza** rotacja.

```java title="AVL.java (implementacja od autora strony, zgodna z opisem z wykładu)"
@include t11-avl.java
```

## Słownik w tablicy haszującej

Drzewa dają O(log n). Czy da się szybciej? Tak — **średnio O(1)** — jeśli nie potrzebujemy porządku (np. min, max, następnika), a tylko search/insert/delete. Pomysł ze slajdów 2009: trzymamy elementy w tablicy T[0..m−1], a o pozycji decyduje **funkcja haszująca**.

:::def
- **Funkcja haszująca** h: klucz → {0, 1, …, m−1}, np. **h(k) = k mod m**.
- **Kolizja** — dwa różne klucze mają tę samą wartość h.
- **Współczynnik zapełnienia** α = n/m (n — liczba elementów, m — rozmiar tablicy).
:::

:::analogy
Szatnia w teatrze: numerek wskazuje od razu wieszak — nie przeszukujesz wszystkich płaszczy. Funkcja haszująca to „wydawanie numerków”. Kłopot zaczyna się, gdy dwie osoby dostaną ten sam numer — to kolizja.
:::

:::tip
Rozmiar tablicy m najlepiej wybierać jako **liczbę pierwszą** niebliską potędze dwójki — wtedy k mod m lepiej rozrzuca klucze (wskazówka od autora strony).
:::

### Metoda łańcuchowa

W każdej komórce T[i] trzymamy **listę** elementów, dla których h(k) = i. Insert — dopisz do listy, search/delete — przejrzyj jedną listę.

- średni koszt: **O(1 + α)**; przy α = O(1) — stały,
- pesymistycznie: wszystkie klucze w jednej liście — O(n).

### Adresowanie otwarte

Wszystkie elementy w samej tablicy. Przy kolizji sprawdzamy kolejne komórki według ustalonej reguły (tzw. **ciąg próbkowania**):

- **liniowe:** h(k, i) = (h(k) + i) mod m — kolejne komórki; prosto, ale tworzą się „zlepy” (klastry),
- **kwadratowe:** h(k, i) = (h(k) + c₁i + c₂i²) mod m,
- **podwójne haszowanie:** h(k, i) = (h₁(k) + i·h₂(k)) mod m — najlepiej rozprasza klucze.

:::warn
W adresowaniu otwartym **nie wolno** po prostu wyczyścić komórki przy usuwaniu — przerwałoby to ciąg próbkowania i inne klucze stałyby się „niewidoczne”. Usuniętą komórkę oznacza się specjalnym znacznikiem **„usunięte”** (search idzie przez nią dalej, insert może ją zająć).
:::

```java title="HashTables.java"
@include t11-hash.java
```

### Porównanie implementacji słownika {own}

:::own
Zestawienie przygotowane przez autora strony.
:::

| Struktura | search | insert | delete | porządek (min, max, następnik) |
|---|---|---|---|---|
| lista | O(n) | O(n) | O(n) | nie |
| tablica posortowana | O(log n) | O(n) | O(n) | tak |
| BST | O(h): średnio O(log n), najgorzej O(n) | O(h) | O(h) | tak |
| **AVL** | **O(log n)** | **O(log n)** | **O(log n)** | tak |
| tablica haszująca | **średnio O(1)**, najgorzej O(n) | średnio O(1) | średnio O(1) | **nie** |

=== summary ===

## AVL

- BST, w którym dla każdego węzła **|h(L) − h(R)| ≤ 1**; **BF = h(L) − h(R) ∈ {−1, 0, 1}**.
- max węzłów przy wysokości h: **2ʰ⁺¹ − 1**; min: **N(h) = N(h−1) + N(h−2) + 1**, N(0) = 1, N(1) = 2 (1, 2, 4, 7, 12, 20, 33) = Fₕ₊₃ − 1 ⇒ **h = O(log n)** (< 1,44 log₂ n).
- insert: BST insert + przeliczenie BF w górę + **jedna** (pojedyncza lub podwójna) rotacja.
- przypadki: **LL** → rotacja w prawo; **RR** → w lewo; **LR** → lewo na synu + prawo; **RL** → prawo na synu + lewo.
- delete: BST delete + rotacje w górę (może być wiele); syn z BF = 0 → pojedyncza rotacja.

## Haszowanie

- h(k) = k mod m; kolizje; α = n/m.
- **łańcuchy:** lista w każdej komórce; średnio O(1 + α).
- **adresowanie otwarte:** liniowe (h(k)+i), kwadratowe, podwójne; usuwanie = znacznik „usunięte”.
- średnio O(1), ale brak porządku (min, max, następnik — kosztowne).

=== tasks ===

:::task level=3 source="Ćwiczenie 9, zad. 1 (zmienione)" title="Wstawianie do drzewa AVL"
Wstawiaj kolejne elementy ciągu do początkowo pustego drzewa AVL. Po każdym wstawieniu przelicz współczynniki BF i wykonaj potrzebne rotacje:

**30, 20, 10, 25, 28, 5, 3, 40, 35, 38**
::hint
Rotacje będą potrzebne przy wstawianiu 10, 28, 3, 35 i 38. Przy 28 i 35 są to rotacje **podwójne**.
::solution
| wstawiony | problem | rotacja | drzewo po operacji |
|---|---|---|---|
| 30 | — | — | 30 |
| 20 | — | — | 30(20, _) |
| 10 | BF(30) = +2, BF(20) = +1 | **LL** → w prawo wokół 30 | 20(10, 30) |
| 25 | — | — | 20(10, 30(25, _)) |
| 28 | BF(30) = +2, BF(25) = −1 | **LR** → w lewo wokół 25, w prawo wokół 30 | 20(10, 28(25, 30)) |
| 5 | — | — | 20(10(5, _), 28(25, 30)) |
| 3 | BF(10) = +2, BF(5) = +1 | **LL** → w prawo wokół 10 | 20(5(3, 10), 28(25, 30)) |
| 40 | — | — | 20(5(3, 10), 28(25, 30(_, 40))) |
| 35 | BF(30) = −2, BF(40) = +1 | **RL** → w prawo wokół 40, w lewo wokół 30 | 20(5(3, 10), 28(25, 35(30, 40))) |
| 38 | BF(28) = −2, BF(35) = −1 | **RR** → w lewo wokół 28 | 20(5(3, 10), 35(28(25, 30), 40(38, _))) |

Drzewo końcowe z BF:

```tree
20[-1](5[0](3[0],10[0]),35[0](28[0](25[0],30[0]),40[1](38[0],_)))
```
:::

:::task level=3 source="Ćwiczenie 9, zad. 2 (zmienione)" title="Usuwanie z drzewa AVL"
Z drzewa otrzymanego w poprzednim zadaniu usuń najpierw węzeł **5**, a potem węzeł **3**. Przelicz BF i wykonaj potrzebne rotacje (przy dwóch synach używaj następnika).
::hint
5 ma dwóch synów — jego następnikiem jest 10. Po usunięciu 3 lewe poddrzewo korzenia bardzo się „skurczy”.
::solution
**delete(5):** 5 ma synów 3 i 10 → następnik 10 zajmuje miejsce 5 → poddrzewo 10(3, _), BF(10) = +1, BF(20) = h(L) − h(R) = 1 − 2 = −1 — **bez rotacji**:

```tree
20[-1](10[1](3,_),35[0](28(25,30),40[1](38,_)))
```

**delete(3):** 10 staje się liściem (wysokość 0), a prawe poddrzewo korzenia ma wysokość 2 → **BF(20) = −2**. Prawy syn 35 ma BF = 0 → wystarczy **pojedyncza rotacja w lewo** wokół 20 (przypadek, który zdarza się tylko przy usuwaniu):

```tree
35[1](20[-1](10,28(25,30)),40[1](38,_))
```

Drzewo znów jest AVL (BF(35) = 2 − 1 = +1, BF(20) = 0 − 1 = −1).
:::

:::task level=2 source="Ćwiczenie 9, zad. 3 (zmienione)" title="Ile węzłów może mieć drzewo AVL?"
a) Ile wynosi **największa** liczba węzłów w drzewie AVL wysokości h? Podaj wartość dla h = 4.
b) Ile wynosi **najmniejsza** liczba węzłów w drzewie AVL wysokości h? Podaj wzór rekurencyjny i wartość dla h = 4. Narysuj takie najrzadsze drzewo dla h = 3.
::hint
Najrzadsze drzewo wysokości h: korzeń + najrzadsze drzewo wysokości h − 1 + najrzadsze drzewo wysokości h − 2.
::solution
a) Pełne drzewo: **2ʰ⁺¹ − 1**; dla h = 4: **31**.

b) **N(0) = 1, N(1) = 2, N(h) = N(h−1) + N(h−2) + 1**: 1, 2, 4, 7, **12** — dla h = 4 najmniej **12** węzłów (ogólnie N(h) = Fₕ₊₃ − 1).

Najrzadsze drzewo AVL dla h = 3 (7 węzłów), przykładowy kształt:

```tree
d(b(a(x,_),c),e(_,f))
```

Lewe poddrzewo ma wysokość 2 (4 węzły), prawe — wysokość 1 (2 węzły): 1 + 4 + 2 = 7 ✓. (Litery zamiast kluczy — liczy się tylko kształt; można w nie wpisać klucze tak, żeby było BST.)
:::

:::task level=2 source="own" title="Tablica haszująca"
Wstaw klucze **18, 41, 22, 44, 59, 32, 31, 73** (w tej kolejności) do tablicy rozmiaru **m = 13** z funkcją h(k) = k mod 13:

a) metodą łańcuchową,
b) z adresowaniem otwartym liniowym.

Ile średnio prób (odwiedzonych komórek / elementów listy) wymaga wyszukanie klucza, który jest w tablicy, w każdej wersji?
::hint
Najpierw policz h(k) dla wszystkich kluczy: 18 → 5, 41 → 2, 22 → 9, 44 → 5, 59 → 7, 32 → 6, 31 → 5, 73 → 8.
::solution
**a) Łańcuchy:**

| komórka | lista |
|---|---|
| 2 | 41 |
| 5 | 18 → 44 → 31 |
| 6 | 32 |
| 7 | 59 |
| 8 | 73 |
| 9 | 22 |

Wyszukiwanie: 18, 41, 22, 59, 32, 73 — po 1 próbie, 44 — 2, 31 — 3. Średnio: 11/8 ≈ **1,375**.

**b) Adresowanie liniowe:**

| klucz | h(k) | kolizje | trafia do |
|---|---|---|---|
| 18 | 5 | 0 | 5 |
| 41 | 2 | 0 | 2 |
| 22 | 9 | 0 | 9 |
| 44 | 5 | 1 (5) | 6 |
| 59 | 7 | 0 | 7 |
| 32 | 6 | 2 (6, 7) | 8 |
| 31 | 5 | 5 (5, 6, 7, 8, 9) | 10 |
| 73 | 8 | 3 (8, 9, 10) | 11 |

Tablica: 2: 41, 5: 18, 6: 44, 7: 59, 8: 32, 9: 22, 10: 31, 11: 73 (reszta pusta).

Próby przy wyszukiwaniu: 1 + 1 + 1 + 2 + 1 + 3 + 6 + 4 = 19, średnio **19/8 ≈ 2,375**. Widać efekt „zlepiania się” kluczy (klaster 5–11) w adresowaniu liniowym.
:::

:::task level=1 source="own" title="Nazwij przypadek"
W drzewie AVL po wstawieniu nowego klucza pierwszy niezrównoważony węzeł v ma BF(v) = −2, a jego prawy syn ma BF = +1. Jaki to przypadek i jakie rotacje trzeba wykonać? A gdyby prawy syn miał BF = −1?
::hint
Minus oznacza „za wysoko po prawej”. Znak BF syna mówi, po której stronie syna jest nadwyżka.
::solution
- BF(v) = −2, BF(prawy syn) = +1 → przypadek **RL**: najpierw rotacja **w prawo** wokół prawego syna, potem rotacja **w lewo** wokół v.
- BF(prawy syn) = −1 → przypadek **RR**: jedna rotacja **w lewo** wokół v.
:::
