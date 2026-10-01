---
id: t10
num: 10
type: topic
title: Słowniki, drzewa BST i obchodzenie drzew
short: Słowniki i drzewa BST
desc: Problem słownika i jego proste implementacje, drzewa poszukiwań binarnych (search, insert, min, max, następnik, delete), obchodzenie drzew preorder/inorder/postorder i sortowanie drzewem.
sources: asd8.pdf; Asd9.pdf; Wyklady 2009/wyklad_2.pdf (drzewa), asd 10 wyklad_8.pdf (słownik, BST)
exercises: asd 08.pdf (zad. 1–3), asd 09 a.pdf (zad. 1–3)
---

## Problem słownika

Najczęściej wykonywane operacje na zbiorze to **wstawianie**, **usuwanie** i **wyszukiwanie** elementu. Struktura, która to umożliwia, to **słownik**. Przykłady: bazy danych, tablice identyfikatorów w kompilatorach, słowniki języków naturalnych, kontakty w telefonie.

:::def
**Problem słownika:** podać strukturę danych dla elementów dynamicznego, skończonego zbioru S, na którym wykonujemy operacje:
1. `construct(S)` — S := ∅,
2. `search(v, S)` — czy v ∈ S? jeśli tak — gdzie jest,
3. `insert(v, S)` — S := S ∪ {v},
4. `delete(v, S)` — S := S − {v}.
:::

W praktyce elementem jest zwykle **rekord**, a wyszukujemy go po polu zwanym **kluczem**.

### Proste implementacje

| Implementacja | search | insert | delete |
|---|---|---|---|
| lista nieuporządkowana | O(n) | O(n)* | O(n) |
| tablica uporządkowana + wyszukiwanie binarne | **O(log n)** | O(n) | O(n) |
| drzewo BST (średnio) | O(log n) | O(log n) | O(log n) |
| drzewo AVL (temat 11) | O(log n) zawsze | O(log n) | O(log n) |

\* insert na liście wymaga sprawdzenia, czy elementu już nie ma.

- **Lista nieuporządkowana:** zaletą jest prostota i mało pamięci, wadą — długi czas.
- **Samoorganizacja listy** (wykład): element będący argumentem `search` lub `insert` przestawiamy **na początek** listy. Często używane elementy trzymają się blisko początku — przy nierównomiernym rozkładzie dostępów to działa szybko.
- **Tablica uporządkowana:** `search` metodą „dziel i zwyciężaj” (wyszukiwanie binarne): W(n) = log n + O(1), ale `insert` i `delete` wymagają przesuwania elementów: W(n) = O(n).

## Drzewa — słowniczek

:::def
- **Drzewo ukorzenione:** jeden wyróżniony węzeł — **korzeń**; każdy inny węzeł ma dokładnie jednego **ojca** (rodzica).
- **Syn** (dziecko), **liść** (węzeł bez synów), **węzeł wewnętrzny** (ma synów).
- **Głębokość** węzła — liczba krawędzi od korzenia do niego (korzeń ma głębokość 0).
- **Wysokość** drzewa — największa głębokość liścia (drzewo z jednym węzłem ma wysokość 0, puste: −1).
- **Drzewo binarne:** każdy węzeł ma co najwyżej dwóch synów — rozróżnianych jako **lewy** i **prawy**. Poddrzewo zaczepione w lewym synu to **lewe poddrzewo**.
:::

## Drzewa poszukiwań binarnych (BST)

:::def
**Drzewo BST** to drzewo binarne, w którego węzłach są klucze ułożone w **porządku symetrycznym**: dla każdego węzła x
- jeśli y leży w **lewym** poddrzewie x, to **key(y) < key(x)**,
- jeśli y leży w **prawym** poddrzewie x, to **key(x) < key(y)**.
:::

:::analogy
Gra „za mało / za dużo”: w każdym węźle pytasz „szukany klucz jest mniejszy czy większy?” i idziesz w lewo albo w prawo. BST to jakby zapisana na stałe strategia wyszukiwania binarnego.
:::

Przykładowe drzewo BST (klucze wstawione w kolejności 50, 30, 70, 20, 40, 60, 80):

```tree
50(30(20,40),70(60,80))
```

### Wyszukiwanie

Zaczynamy w korzeniu. Jeśli klucz jest mniejszy — idziemy w lewo, większy — w prawo, równy — znaleźliśmy. Jeśli dojdziemy do pustego miejsca (null) — klucza nie ma. Koszt: długość ścieżki, czyli **O(h)**, gdzie h to wysokość drzewa.

### Minimum i maksimum

- **min** — idziemy cały czas w **lewo**, aż się da,
- **max** — cały czas w **prawo**.

### Wstawianie

Szukamy klucza; w miejscu, gdzie wyszukiwanie „wypada” z drzewa (null), wstawiamy **nowy liść**. Kształt drzewa zależy więc od **kolejności** wstawiania!

### Następnik i poprzednik

**Następnik** klucza k to najmniejszy klucz większy od k (następny w porządku rosnącym):

- jeśli węzeł k ma **prawe poddrzewo** → następnik to **minimum prawego poddrzewa**,
- jeśli nie ma → następnik to najbliższy przodek, dla którego k leży w **lewym** poddrzewie (idąc od korzenia do k, zapamiętujemy ostatni węzeł, w którym skręciliśmy w lewo).

Poprzednik — symetrycznie (maksimum lewego poddrzewa albo ostatni skręt w prawo).

### Usuwanie — trzy przypadki

1. **Liść** — po prostu go usuwamy.
2. **Węzeł z jednym synem** — syn zajmuje jego miejsce.
3. **Węzeł z dwoma synami** — w jego miejsce wstawiamy **następnik** (minimum prawego poddrzewa) albo **poprzednik** (maksimum lewego poddrzewa), a tamten węzeł usuwamy (ma najwyżej jednego syna, więc to przypadek 1 lub 2).

:::info
W kodzie z wykładu wybór między poprzednikiem a następnikiem jest **losowy** (`b = random() % 2`) — dzięki temu przy wielu usunięciach drzewo nie „przechyla się” w jedną stronę. Na ćwiczeniach zwykle ustala się jedną regułę — **zapytaj prowadzącego, którą stosować** (w rozwiązaniach na tej stronie używamy następnika).
:::

Przykład — kolejne usunięcia z drzewa powyżej:

```tree caption="usuń 20 (liść)"
50(30(_,40),70(60,80))
```

```tree caption="usuń 30 (jeden syn — 40 zajmuje jego miejsce)"
50(40,70(60,80))
```

```tree caption="usuń 50 (dwóch synów — na jego miejsce następnik 60)"
60(40,70(_,80))
```

### Złożoność BST

Wszystkie operacje kosztują **O(h)**. A wysokość zależy od kolejności wstawiania:

- drzewo **zrównoważone**: h ≈ log₂ n,
- drzewo **zdegenerowane** (np. wstawianie 1, 2, 3, …, n — każdy klucz idzie w prawo): h = n − 1 — to po prostu lista!
- dla losowej kolejności wstawiania średnia głębokość węzła to ok. **1,39 log₂ n** — czyli średnio szybko.

Dlatego potrzebujemy drzew, które **same pilnują** swojej wysokości — to drzewa AVL (temat 11).

```java title="BST.java"
@include t10-bst.java
```

## Obchodzenie drzew binarnych

**Obieg drzewa** to algorytm, który odwiedza każdy węzeł i wykonuje w nim pewną akcję. Kolejność odwiedzania wyznacza trzy podstawowe obiegi:

| Obieg | Kolejność | Zapamiętaj |
|---|---|---|
| **preorder** (prefiksowy) | korzeń, lewe, prawe | korzeń **przed** poddrzewami |
| **inorder** (infiksowy) | lewe, korzeń, prawe | korzeń **pomiędzy** |
| **postorder** (postfiksowy) | lewe, prawe, korzeń | korzeń **po** poddrzewach |

Przykład:

```tree
A(B(D,E),C(_,F))
```

- preorder: **A B D E C F**
- inorder: **D B E A C F**
- postorder: **D E B F C A**

:::tip
Sztuczka do szybkiego wypisywania (od autora strony): obrysuj drzewo ołówkiem od lewej strony korzenia dookoła. **Preorder** — wypisz węzeł, gdy mijasz go z **lewej** strony; **inorder** — gdy mijasz go **od dołu**; **postorder** — gdy mijasz go z **prawej**.
:::

### Preorder — gdy informacja płynie od ojca do syna

Wykład: obliczanie **głębokości** wszystkich węzłów. Najpierw ustalamy głębokość ojca, potem przekazujemy ją synom:

```java title="Głębokość węzłów (preorder, wykład)"
public void licz_glebokosc(TreeNode v, int glebokosc_ojca) {
    if (v != null) {
        glebokosc_ojca++;
        v.info = glebokosc_ojca;              // depth of v
        licz_glebokosc(v.left, glebokosc_ojca);
        licz_glebokosc(v.right, glebokosc_ojca);
    }
}
// call: licz_glebokosc(root, -1)
```

### Inorder — porządek rosnący w BST

:::def
**Twierdzenie o infiksie w BST:** klucze dowolnego drzewa BST wypisane w porządku **inorder** są uporządkowane **rosnąco**.

*Dowód* (indukcja względem liczby węzłów n): dla n = 0 ciąg pusty jest uporządkowany. Dla drzewa o n węzłach z korzeniem r: lewe poddrzewo dₗ i prawe dₚ mają mniej niż n węzłów i są BST, więc z założenia indukcyjnego ich obiegi inorder są rosnące. Inorder całego drzewa to: inorder(dₗ), potem r (większy od wszystkiego w dₗ), potem inorder(dₚ) (większe od r). Całość jest rosnąca. ∎
:::

Wniosek — **sortowanie drzewem BST**: wstaw wszystkie elementy do BST, potem wypisz je inorder. Czas: średnio O(n log n), pesymistycznie O(n²) (drzewo zdegenerowane).

### Postorder — gdy ojciec potrzebuje wyników synów

Wykład: obliczanie **wysokości** każdego węzła (odległości do najdalszego liścia w poddrzewie). Żeby znać wysokość węzła, musimy znać wysokości synów — więc najpierw rekursja, potem obliczenie:

```java title="Wysokość (postorder, wykład)"
int wysokosc(TreeNode v) {
    int wys_l, wys_r;
    if (v == null) return -1;
    wys_l = wysokosc(v.left);
    wys_r = wysokosc(v.right);
    v.info = Math.max(wys_l, wys_r) + 1;
    return v.info;
}
```

### Odtwarzanie drzewa z obiegów {own}

:::own
Dopisane przez autora strony — przydaje się w zadaniach typu „jeśli preorder to …, to inorder to …”.
:::

- **preorder + inorder** (różne klucze) wyznaczają drzewo **jednoznacznie**: pierwszy element preorder to korzeń; w inorder dzieli on ciąg na lewe i prawe poddrzewo; dalej rekurencyjnie.
- dla **BST** wystarczy sam preorder (albo postorder) — inorder to po prostu posortowane klucze.
- sam preorder i postorder dla zwykłego drzewa **nie wystarczają** (np. drzewo „korzeń + jeden syn” — nie wiadomo, czy lewy, czy prawy).
- **Test na BST z obiegu:** ciąg jest obiegiem inorder jakiegoś BST ⇔ jest **ściśle rosnący**.

=== summary ===

## Słownik

- operacje: construct, search, insert, delete na zbiorze S (element = rekord, szukamy po kluczu).
- lista: O(n); lista samoorganizująca (element na początek); tablica posortowana: search log n, insert/delete O(n).

## BST

- porządek symetryczny: lewe poddrzewo < węzeł < prawe poddrzewo.
- search: lewo/prawo aż do trafienia albo null; min — skrajnie lewo; max — skrajnie prawo.
- insert: nowy liść tam, gdzie search wypada z drzewa.
- następnik: min prawego poddrzewa albo ostatni przodek, przy którym skręciliśmy w lewo.
- delete: liść — usuń; 1 syn — syn na miejsce; 2 synów — następnik (lub poprzednik) na miejsce.
- koszt O(h): log n … n − 1; losowo średnio ~1,39 log n.

## Obiegi

| Obieg | Kolejność | Typowe użycie |
|---|---|---|
| preorder | korzeń, L, P | głębokości |
| inorder | L, korzeń, P | BST → rosnąco (tw. o infiksie) |
| postorder | L, P, korzeń | wysokości |

- preorder + inorder ⇒ drzewo jednoznacznie; ciąg jest inorder BST ⇔ ściśle rosnący.

=== tasks ===

:::task level=2 source="Ćwiczenie 8, zad. 1 (zmienione)" title="Prawda czy fałsz: słowniki"
Słownik d traktujemy jak zbiór; `insert`, `delete` zwracają nowy słownik, a `member(d, e)` mówi, czy e ∈ d. Które zdania są prawdziwe?

a) member(insert(d, e), e) = prawda
b) delete(delete(d, e), e) = delete(d, e)
c) insert(delete(d, e), e) = d
d) ¬member(d, e) ⇒ delete(insert(d, e), e) = d
e) insert(insert(d, a), b) = insert(insert(d, b), a)
::hint
Słownik to zbiór — nie ma w nim kolejności ani powtórzeń. W c) pomyśl o słowniku, który **nie zawiera** e.
::solution
a) **Prawda** — po wstawieniu e na pewno należy do słownika.
b) **Prawda** — usunięcie drugi raz niczego nie zmienia.
c) **Fałsz** — jeśli e ∉ d, to lewa strona zawiera e, a d nie. (Prawda tylko, gdy e ∈ d.)
d) **Prawda** — wstawiamy nowy element i od razu go usuwamy.
e) **Prawda** — w zbiorze kolejność wstawiania nie ma znaczenia (inaczej niż w stosie i kolejce z tematu 9!).
:::

:::task level=2 source="Ćwiczenie 8, zad. 2 (zmienione)" title="Operacje na drzewie BST"
Dla ciągu **{15, 8, 22, 4, 11, 19, 27, 2, 9, 13, 25}**:

a) wstaw kolejne klucze do początkowo pustego drzewa BST (narysuj drzewo),
b) następnie: wyszukaj klucz 13 (podaj ścieżkę), znajdź minimum i maksimum, znajdź następnik i poprzednik klucza 11, usuń klucz 8, a potem klucz 15 (przy dwóch synach używaj następnika).
::hint
Każdy nowy klucz schodzi od korzenia i zostaje liściem. Następnik 11 szukaj w jego prawym poddrzewie.
::solution
**a)** Drzewo po wstawieniu (wysokość 3):

```tree
15(8(4(2,_),11(9,13)),22(19,27(25,_)))
```

**b)**
- search(13): ścieżka **15 → 8 → 11 → 13**,
- minimum: **2** (skrajnie w lewo: 15 → 8 → 4 → 2), maksimum: **27** (15 → 22 → 27),
- następnik 11: 11 ma prawe poddrzewo {13} → **13**; poprzednik 11: maksimum lewego poddrzewa {9} → **9**,
- delete(8): 8 ma dwóch synów; następnik = min prawego poddrzewa = **9**; 9 zajmuje miejsce 8, a stary liść 9 znika:

```tree caption="po usunięciu 8"
15(9(4(2,_),11(_,13)),22(19,27(25,_)))
```

- delete(15): dwóch synów; następnik = min prawego poddrzewa = **19** (liść) → 19 w korzeniu:

```tree caption="po usunięciu 15"
19(9(4(2,_),11(_,13)),22(_,27(25,_)))
```
:::

:::task level=2 source="Ćwiczenie 8, zad. 3 (zmienione)" title="Możliwe ścieżki wyszukiwania"
Drzewo BST zawiera jako klucze liczby naturalne od 1 do 3000. Szukamy klucza **1777**. Które ciągi mogą być ścieżkami wyszukiwania (kolejno odwiedzanymi kluczami)?

a) 2500, 400, 2100, 900, 1990, 1200, 1800, 1777
b) 100, 1650, 2400, 1700, 2200, 1750, 1800, 1777
c) 2900, 1300, 2700, 1400, 2600, 1500, 1790, 1760, 1777
d) 2950, 300, 2800, 350, 1900, 340, 1777
e) 1000, 2000, 1500, 1900, 1400, 1777
::hint
Śledź przedział (dolna granica, górna granica), w którym musi leżeć każdy kolejny klucz. Po kluczu x > 1777 idziemy w lewo, więc wszystkie dalsze klucze muszą być < x; po x < 1777 — wszystkie dalsze > x.
::solution
Śledzimy przedział dozwolonych wartości:

- **a) możliwa:** (−∞,∞) → 2500 → (−∞,2500) → 400 → (400,2500) → 2100 → (400,2100) → 900 → (900,2100) → 1990 → (900,1990) → 1200 → (1200,1990) → 1800 → (1200,1800) → 1777 ✓
- **b) możliwa:** 100 → (100,∞) → 1650 → (1650,∞) → 2400 → (1650,2400) → 1700 → (1700,2400) → 2200 → (1700,2200) → 1750 → (1750,2200) → 1800 → (1750,1800) → 1777 ✓
- **c) możliwa:** 2900 → 1300 → 2700 → 1400 → 2600 → 1500 → 1790 → (1500,1790) → 1760 → (1760,1790) → 1777 ✓
- **d) niemożliwa:** po 350 (< 1777) wszystkie dalsze klucze muszą być > 350, a pojawia się **340**.
- **e) niemożliwa:** po 1500 (< 1777) dalsze muszą być > 1500, a pojawia się **1400**.
:::

:::task level=1 source="Ćwiczenie 10 (asd 09 a), zad. 1 (zmienione)" title="Trzy obiegi drzewa"
Dla drzewa poniżej wypisz klucze w porządku **prefiksowym**, **infiksowym** i **postfiksowym**.

```tree
8(3(12,6(1,9)),15(_,10(4,7)))
```
::hint
Uwaga: to **nie jest** drzewo BST — nie próbuj sortować. Stosuj definicje: preorder = korzeń, L, P; inorder = L, korzeń, P; postorder = L, P, korzeń.
::solution
- preorder: **8, 3, 12, 6, 1, 9, 15, 10, 4, 7**
- inorder: **12, 3, 1, 6, 9, 8, 15, 4, 10, 7**
- postorder: **12, 1, 9, 6, 3, 4, 7, 10, 15, 8**
:::

:::task level=2 source="Ćwiczenie 10 (asd 09 a), zad. 2 (zmienione)" title="Czy takie BST istnieje?"
Czy istnieje drzewo BST, którego klucze w porządku **infiksowym** tworzą ciąg **2, 5, 3, 8, 9, 4, 10**? A w porządku **prefiksowym**?
::hint
Inorder BST jest zawsze rosnący. Dla preorder: pierwszy element to korzeń; mniejsze od niego muszą tworzyć spójny blok zaraz po nim, a potem same większe.
::solution
- **Inorder: nie.** Z twierdzenia o infiksie inorder BST jest rosnący, a tu 5 > 3.
- **Preorder: nie.** Korzeń 2 → wszystkie dalsze są > 2, więc to prawe poddrzewo z korzeniem 5. W nim elementy < 5 muszą wystąpić **bezpośrednio** po 5 (lewe poddrzewo), a potem tylko > 5. Mamy 3 (ok, lewe), potem 8, 9 (prawe, > 5), ale później pojawia się **4 < 5** — w prawym poddrzewie 5 to niemożliwe.
:::

:::task level=3 source="Ćwiczenie 10 (asd 09 a), zad. 3 (zmienione)" title="Pełne drzewo wysokości 2"
Niech T będzie **pełnym** drzewem binarnym wysokości 2 (7 węzłów, wszystkie poziomy zapełnione). Które zdania są prawdziwe?

1. Jeżeli w kolejności PreOrder wierzchołki T tworzą ciąg 20, 13, 9, 17, 25, 11, 30, to w kolejności InOrder tworzą ciąg 9, 13, 17, 20, 11, 25, 30.
2. Jeżeli w kolejności PostOrder wierzchołki T tworzą ciąg 9, 17, 13, 11, 30, 25, 20, to w kolejności PreOrder tworzą ciąg 20, 13, 9, 17, 25, 11, 30.
3. Jeżeli w kolejności InOrder wierzchołki T tworzą ciąg 9, 13, 17, 20, 11, 25, 30, to w kolejności PostOrder tworzą ciąg 9, 17, 13, 30, 11, 25, 20.
::hint
W pełnym drzewie wysokości 2 kształt jest znany, więc pozycje w każdym obiegu są ustalone: preorder = (korzeń, L, LL, LP, P, PL, PP).
::solution
Kształt jest ustalony, więc z dowolnego obiegu odtwarzamy drzewo:

```tree
20(13(9,17),25(11,30))
```

- preorder: 20, 13, 9, 17, 25, 11, 30,
- inorder: 9, 13, 17, 20, 11, 25, 30,
- postorder: 9, 17, 13, 11, 30, 25, 20.

1. **Prawda.**
2. **Prawda.**
3. **Fałsz** — poprawny postorder to 9, 17, 13, **11, 30**, 25, 20 (w zdaniu zamieniono kolejność 11 i 30).
:::

:::task level=2 source="own" title="Kształt BST zależy od kolejności"
Wstaw do pustego BST klucze 1, 2, 3, 4, 5, 6, 7 w tej kolejności, a potem w kolejności 4, 2, 6, 1, 3, 5, 7. Jaka jest wysokość obu drzew? Ile porównań wymaga wyszukanie klucza 7 w każdym z nich?
::hint
W pierwszym przypadku każdy nowy klucz jest większy od wszystkich poprzednich.
::solution
- Kolejność 1…7: każdy klucz idzie w prawo — drzewo to „łańcuch” 1 → 2 → … → 7, **wysokość 6**, szukanie 7: **7 porównań**.
- Kolejność 4, 2, 6, 1, 3, 5, 7: drzewo **pełne**, **wysokość 2**, szukanie 7: 4 → 6 → 7, **3 porównania**.

```tree
4(2(1,3),6(5,7))
```
:::
