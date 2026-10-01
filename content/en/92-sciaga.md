---
id: cheatsheet
type: page
title: Cheat sheet 2026/2027 — all complexities and formulas on one page
short: Cheat sheet
icon: 📋
eyebrow: Summary of the whole course · 2026/2027
desc: Complexities and formulas from M. Sydow's lectures (2026/2027) in one place — for revision before entry quizzes and tests.
---

:::own
Compiled by the site author from the 2026/2027 slides (details in the topics and summaries). Practice: [Practice tests](page:mock).
:::

## Before you compute a complexity

:::formula Two steps + measures
1. **dominant operation**, 2. **data size**.
$$W(n)=\sup\{t(d):d\in D_n\} \qquad A(n)=\sum_k p_{nk}\,k=E(X_n) \qquad S(n)\text{ — memory}$$
:::

| | means | definition |
|---|---|---|
| $O$ | ≤ | $\exists_{c>0}\exists_{n_0}\forall_{n\ge n_0}\,f\le c\,g$ |
| $\Omega$ | ≥ | $\exists_{c>0}\exists_{n_0}\forall_{n\ge n_0}\,f\ge c\,g$ |
| $\Theta$ | = | $O$ both ways |
| $o$ / $\omega$ | < / > | $\forall_{c>0}$ instead of $\exists_{c>0}$ |

$$1 \prec \log n \prec \sqrt n \prec n \prec n\log n \prec n^2 \prec n^3 \prec 2^n \prec n!$$

## Searching

| Algorithm | Complexity |
|---|---|
| sequential | $W=len$, $A=\frac{len+1}{2}$ |
| jumps of $k$ | $\frac1k\Theta(len)$, best $k=\sqrt{len}$ |
| binary (sorted, RAM) | $\Theta(\log_2 len)$, $S=O(1)$ |
| 2nd smallest — tournament | $len-1+\Theta(\log len)$ |
| partition | $W=n+O(1)$, $S=O(1)$ |
| Hoare (k-th) | $A=\Theta(n)$, $W=\Theta(n^2)$ |

## Sorting (operation: comparison)

| Algorithm | W | A | memory | stable |
|---|---|---|---|---|
| Selection | $\frac{n(n-1)}{2}$ | $=W$ | $O(1)$ | no |
| Insertion | $\frac{n(n-1)}{2}$ | $\frac14n^2+\Theta(n)$ | $O(1)$ | yes |
| MergeSort | $\Theta(n\log n)$ | $\Theta(n\log n)$ | $\Theta(n)$ | yes* |
| QuickSort | $\Theta(n^2)$ | $\Theta(n\log n)$ (≈1.44) | in place | no |
| HeapSort | $\Theta(n\log n)$ | $\Theta(n\log n)$ | — | no |
| CountSort | $\Theta(n+m)$ | $\Theta(n+m)$ | $\Theta(n+m)$ | yes |
| RadixSort | $\Theta(d(n+10))$ | | | yes |

\* with `<=` in merge; the slide version with `<` takes from the right sequence on ties. **Comparison lower bound:** $\log_2 n!=\Theta(n\log n)$.

## Recursion

| Equation | Solution |
|---|---|
| $t(n)=t(n/2)+c$ | $\Theta(\log n)$ |
| $t(n)=2t(n/2)+c$ | $\Theta(n)$ |
| $t(n)=2t(n/2)+cn$ | $\Theta(n\log n)$ |
| hanoi | $2^n-1$ |

**Master theorem** $T(n)=aT(n/b)+f(n)$ — compare $f$ with $n^{\log_b a}$: smaller → $\Theta(n^{\log_b a})$, equal → $\cdot\log n$, larger → $\Theta(f)$.

## Data structures

| Structure | Operations |
|---|---|
| stack / queue / deque | $O(1)$ (singly linked list / cyclic array / doubly linked list) |
| linked list | splice, insert/remove at a node $O(1)$; access $O(n)$ |
| dictionary — naive arrays | unsorted: search $O(n)$, insert $O(1)$; sorted: search $O(\log n)$, insert $O(n)$ |
| hash table | $O(\alpha)$, $\alpha=n/m$ |
| BST | $A=O(\log n)$, $W=O(n)$ |
| AVL | everything $W=O(\log n)$; $bf\in\{-1,0,1\}$ |
| binary heap (min) | insert, delMin $O(\log n)$; findMin $O(1)$; construct $O(n)$; merge $O(n)$ |

**Heap in an array from 1:** parent $\lfloor i/2
floor$, sons $2i$, $2i+1$.

## Graphs

| Algorithm | Complexity |
|---|---|
| representations | matrix $\Theta(n^2)$, lists $\Theta(n+m)$, incidence $\Theta(nm)$ |
| BFS, DFS | $O(n+m)$ |
| shortest paths in a DAG | $O(n+m)$ |
| Dijkstra (binary heap) | $O((n+m)\log n)$; Fibonacci: $O(m+n\log n)$ |
| Bellman-Ford | $O(nm)$ |
| Prim | $O((n+m)\log n)$ |
| Kruskal | $O(m\log m)$ |

## Test conventions (easy points to lose)

:::warn Remember
- binSearch: `m = (l+r)/2` rounded **down**; MergeSort: `m = len/2` — **left shorter**,
- partition: the **last** swap counts; CountSort: phase 3 **from the end**,
- heap from index **1**; `construct` ≠ n × `insert`,
- BST: equal key goes **right**; DFS: `time` from **0**,
- neighbours and ties (Kruskal, Prim) — **alphabetically**.
:::
