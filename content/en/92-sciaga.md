---
id: cheatsheet
type: page
title: Cheat sheet — all complexities and formulas on one page
short: Cheat sheet
icon: 📋
eyebrow: Summary of the whole course
desc: The complexities of algorithms and data structures and the most important formulas from the lectures, gathered in one place.
---

:::own
Compiled by the site author from the lecture results (details and proofs are in the individual topics).
:::

## Notations and formulas

- f = O(g) ⇔ ∃ c > 0, n₀: f(n) ≤ c·g(n) for n > n₀; Ω — the other way round; Θ = O and Ω.
- 1 ≺ log n ≺ √n ≺ n ≺ n log n ≺ n² ≺ n³ ≺ 2ⁿ ≺ n!
- log(xy) = log x + log y; log xᵏ = k log x; log_a x = log_b x / log_b a; digits: ⌊log₁₀ x⌋ + 1.
- 1 + 2 + … + n = n(n+1)/2; 1 + 2 + 4 + … + 2ᵏ = 2ᵏ⁺¹ − 1; log n! = Θ(n log n).
- **Master theorem** T(n) = aT(n/b) + f(n): compare f with n^(log_b a) → slower: Θ(n^(log_b a)); equal: Θ(n^(log_b a) log n); faster: Θ(f).
- Fibonacci: Fₙ ≈ φⁿ/√5, φ ≈ 1.618 (Euclid, AVL).

## Searching and selection

| Algorithm | Complexity |
|---|---|
| sequential (sentinel) | W = n + 1, A = (n+1)/2 |
| binary | ⌈log₂ n⌉ + 1 |
| max | n − 1 (optimal) |
| min and max | ⌈3n/2⌉ − 2 (optimal) |
| second largest | n + ⌈log₂ n⌉ − 2 |
| k-th — Hoare | W = ½n² + O(n), A = O(n) |
| Euclid (mod) | O(log n) |

## Sorting

| Algorithm | Worst | Average | Memory | Stable |
|---|---|---|---|---|
| SelectionSort | n²/2 | n²/2 | O(1) | no |
| InsertionSort | n²/2 | n²/4 | O(1) | yes |
| MergeSort | n log n | n log n | O(n) | yes |
| QuickSort | n²/2 | 1.4 n log n | O(log n) | no |
| HeapSort | 2n log n | ~2n log n | O(1) | no |
| CountingSort | O(n + m) | O(n + m) | O(n + m) | yes |
| RadixSort | O(d(n + k)) | O(d(n + k)) | O(n + k) | yes |
| **lower bound (comparisons)** | ⌈log₂ n!⌉ = Ω(n log n) | | | |

## Data structures

| Structure | Operations |
|---|---|
| stack (array/list) | push, pop, top — O(1) |
| queue (list/circular array) | inject, front, pop — O(1) |
| doubly linked list | insert/delete at a node O(1); access to position p — O(p) |
| sorted array | search O(log n); insert, delete O(n) |
| BST | O(h): O(log n) on average, O(n) worst |
| AVL | search, insert, delete — O(log n); h < 1.44 log n |
| hash table | O(1) on average, O(n) worst |
| heap | insert O(log n), deletemax 2⌊log n⌋, construct O(n) |
| leftist heap | merge, insert, deletemax — O(log n) |
| Find-Union (trees + compression) | almost O(1) per operation |

## Graphs

| Algorithm | Complexity |
|---|---|
| DFS, BFS (lists) | O(n + m) |
| Dijkstra | O(n²) or O((n + m) log n) |
| Prim | O(n²) or O(m log n) |
| Kruskal | O(m log m) |

## Multiplication

| Algorithm | Number of multiplications |
|---|---|
| schoolbook | n² |
| Karatsuba | n^(log₂ 3) ≈ n^1.585 |
| FFT | O(n log n) |

## Important numbers

- Hanoi: 2ⁿ − 1 moves. Permutations: n!.
- AVL: max 2ʰ⁺¹ − 1 nodes, min N(h) = N(h−1) + N(h−2) + 1 (1, 2, 4, 7, 12, 20, 33).
- Heap: children 2k, 2k+1; parent ⌊k/2⌋; h = ⌊log n⌋; leaves: positions > ⌊n/2⌋.
- Undirected graph: m ≤ n(n−1)/2.
