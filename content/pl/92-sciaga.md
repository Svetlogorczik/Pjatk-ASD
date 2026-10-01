---
id: cheatsheet
type: page
title: Ściąga — wszystkie złożoności i wzory na jednej stronie
short: Ściąga
icon: 📋
eyebrow: Podsumowanie całego kursu
desc: Zebrane w jednym miejscu złożoności algorytmów i struktur danych oraz najważniejsze wzory z wykładów.
---

:::own
Zestawienie przygotował autor strony na podstawie wyników z wykładów (szczegóły i dowody — w poszczególnych tematach).
:::

## Notacje i wzory

- f = O(g) ⇔ ∃ c > 0, n₀: f(n) ≤ c·g(n) dla n > n₀; Ω — odwrotnie; Θ = O i Ω.
- 1 ≺ log n ≺ √n ≺ n ≺ n log n ≺ n² ≺ n³ ≺ 2ⁿ ≺ n!
- log(xy) = log x + log y; log xᵏ = k log x; log_a x = log_b x / log_b a; cyfr: ⌊log₁₀ x⌋ + 1.
- 1 + 2 + … + n = n(n+1)/2; 1 + 2 + 4 + … + 2ᵏ = 2ᵏ⁺¹ − 1; log n! = Θ(n log n).
- **Tw. o rekurencji uniwersalnej** T(n) = aT(n/b) + f(n): porównaj f z n^(log_b a) → wolniej: Θ(n^(log_b a)); tak samo: Θ(n^(log_b a) log n); szybciej: Θ(f).
- Fibonacci: Fₙ ≈ φⁿ/√5, φ ≈ 1,618 (Euklides, AVL).

## Wyszukiwanie i wybór

| Algorytm | Złożoność |
|---|---|
| sekwencyjne (strażnik) | W = n + 1, A = (n+1)/2 |
| binarne | ⌈log₂ n⌉ + 1 |
| max | n − 1 (optymalnie) |
| min i max | ⌈3n/2⌉ − 2 (optymalnie) |
| drugi największy | n + ⌈log₂ n⌉ − 2 |
| k-ty — Hoare | W = ½n² + O(n), A = O(n) |
| Euklides (mod) | O(log n) |

## Sortowanie

| Algorytm | Najgorzej | Średnio | Pamięć | Stabilny |
|---|---|---|---|---|
| SelectionSort | n²/2 | n²/2 | O(1) | nie |
| InsertionSort | n²/2 | n²/4 | O(1) | tak |
| MergeSort | n log n | n log n | O(n) | tak |
| QuickSort | n²/2 | 1,4 n log n | O(log n) | nie |
| HeapSort | 2n log n | ~2n log n | O(1) | nie |
| CountingSort | O(n + m) | O(n + m) | O(n + m) | tak |
| RadixSort | O(d(n + k)) | O(d(n + k)) | O(n + k) | tak |
| **dolne ograniczenie (porównania)** | ⌈log₂ n!⌉ = Ω(n log n) | | | |

## Struktury danych

| Struktura | Operacje |
|---|---|
| stos (tablica/lista) | push, pop, top — O(1) |
| kolejka (lista/tablica cykliczna) | inject, front, pop — O(1) |
| lista dwukierunkowa | wstaw/usuń przy węźle O(1); dostęp do pozycji p — O(p) |
| tablica posortowana | search O(log n); insert, delete O(n) |
| BST | O(h): średnio O(log n), najgorzej O(n) |
| AVL | search, insert, delete — O(log n); h < 1,44 log n |
| tablica haszująca | średnio O(1), najgorzej O(n) |
| kopiec | insert O(log n), deletemax 2⌊log n⌋, construct O(n) |
| kopiec lewicowy | scal, insert, deletemax — O(log n) |
| Find-Union (drzewa + kompresja) | prawie O(1) na operację |

## Grafy

| Algorytm | Złożoność |
|---|---|
| DFS, BFS (listy) | O(n + m) |
| Dijkstra | O(n²) lub O((n + m) log n) |
| Prim | O(n²) lub O(m log n) |
| Kruskal | O(m log m) |

## Mnożenie

| Algorytm | Liczba mnożeń |
|---|---|
| szkolne | n² |
| Karacuba | n^(log₂ 3) ≈ n^1,585 |
| FFT | O(n log n) |

## Ważne liczby

- Hanoi: 2ⁿ − 1 ruchów. Permutacje: n!.
- AVL: max 2ʰ⁺¹ − 1 węzłów, min N(h) = N(h−1) + N(h−2) + 1 (1, 2, 4, 7, 12, 20, 33).
- Kopiec: synowie 2k, 2k+1; ojciec ⌊k/2⌋; h = ⌊log n⌋; liście: pozycje > ⌊n/2⌋.
- Graf nieskierowany: m ≤ n(n−1)/2.
