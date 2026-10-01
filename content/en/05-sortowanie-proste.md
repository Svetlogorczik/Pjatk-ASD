---
id: t05
num: 5
type: topic
title: Sorting — the problem and simple algorithms (Selection, Insertion)
short: Simple sorting
desc: What sorting is, what we count, what "in place" and "stable" mean. SelectionSort and InsertionSort step by step, with complexity analysis.
sources: 2026/2027 (M. Sydow): sortOne4-pl.pdf · 2025/2026: asd2.pdf (§2 Sorting); Dziel-RzadzC.pdf (recursive InsertionSort); Wyklady 2009/wyklad_5.pdf (The sorting problem I), asd 08 wyklad_6.pdf (stability)
exercises: asd 05.pdf (task 1)
---

:::exam 2026/2027 tests
This topic was written from the 2025/2026 lectures. **The 2026/2027 tests use the versions from M. Sydow's slides** — you will find them in the section ["2026/2027 lecture version"](topic:t05#2026-2027-lecture-version-m-sydow-sorting-1) at the end of the topic (code copied from the slides). Qualifying tasks and practice tasks: [Tests 2026/2027](page:exams).
:::

## The sorting problem

Sorting is one of the problems computers solve most often. The reason is simple: **ordered data are much easier to use** (think of a dictionary, a phone book, or binary search from topic 4).

:::def
**Sorting:** given a sequence q = [a₀, a₁, …, aₙ₋₁] of elements of a linearly ordered set, find a rearrangement (permutation) of the elements that gives a **non-decreasing** sequence: a₀ ≤ a₁ ≤ … ≤ aₙ₋₁.
:::

Conventions from the lecture:

- **dominant operation:** a comparison of two elements (sometimes we also count swaps/moves),
- **space complexity S(n):** how much **extra** memory is needed (beyond the sequence itself),
- elements are kept in an array `a[i]`, 0 ≤ i < n,
- for the average analysis we assume **every permutation** of the data is equally likely.

### Two important properties of sorting algorithms

:::def
- An algorithm sorts **in place** (*w miejscu*) if it needs only **constant** extra memory: S(n) = O(1).
- An algorithm is **stable** (*stabilny*) if elements with **equal** keys stay in the same relative order as before sorting.
:::

:::analogy
Stability: you have a list of students sorted alphabetically and now sort it by grade. A stable algorithm keeps the alphabetical order among people with the same grade. An unstable one may "shuffle" them.
:::

## SelectionSort — sorting by selection

**Idea:** find the smallest element and put it first. Then find the smallest of the rest and put it second. And so on.

:::analogy
You lay cards on a table: you look through all of them, take the smallest and put it first. From the rest you again choose the smallest — until the end.
:::

```pseudo title="SelectionSort (lecture)"
Algorytm SelectionSort(a, n)
{
  for i := 0 to n-2 do {
    min := i;
    for j := i+1 to n-1 do
      if a[j] < a[min] then
        min := j;
    x := a[min];  a[min] := a[i];  a[i] := x;     // swap
  }
}
```

**Example** for `[29, 10, 14, 37, 13]` (green — the already sorted part, yellow — the minimum found):

```array
@idx
start: 29 [10] 14 37 13
pass 0: {10} 29 14 37 [13]
pass 1: {10} {13} [14] 37 29
pass 2: {10} {13} {14} 37 [29]
pass 3: {10} {13} {14} {29} {37}
```

### Analysis of SelectionSort

In pass i we compare a[min] with elements i+1…n−1, i.e. we make n − 1 − i comparisons. In total:

- **W(n) = A(n) = (n−1) + (n−2) + … + 1 = n(n−1)/2 = ½n² + O(n)** — always the same, regardless of the data,
- **Δ(n) = δ(n) = 0** — the algorithm is completely predictable,
- **S(n) = O(1)** — it sorts in place.

Advantages listed in the lecture:

1. **optimal in the number of moves** — only n − 1 swaps (useful when moving is expensive, e.g. large records),
2. simple to write,
3. fast enough for small n.

:::warn
SelectionSort **is not stable**. Example: `[2ᵃ, 2ᵇ, 1]` — in the first pass 2ᵃ is swapped with 1 and lands behind 2ᵇ: `[1, 2ᵇ, 2ᵃ]`.
:::

## InsertionSort — sorting by insertion

**Idea:** keep a **sorted fragment** at the beginning of the array. Take the next element and **insert** it into the right place of that fragment, shifting larger elements one place to the right.

:::analogy
This is how you arrange cards in your hand while they are dealt: you slide each new card between the ones already arranged, so that everything is in order.
:::

```pseudo title="InsertionSort (lecture)"
Algorytm InsertionSort(a, n)
{
  for i := 1 to n-1 do {
    j := i;
    x := a[i];
    while (j > 0) AND (a[j-1] > x) do {
      a[j] := a[j-1];          // shift a bigger element right
      j := j - 1;
    }
    a[j] := x;                 // put x into the freed slot
  }
}
```

**Example** for `[29, 10, 14, 37, 13]` (yellow — the inserted element at its new place):

```array
@idx
start: 29 10 14 37 13
i=1: [10] 29 14 37 13
i=2: 10 [14] 29 37 13
i=3: 10 14 29 [37] 13
i=4: 10 [13] 14 29 37
```

### Analysis of InsertionSort

The number of comparisons in step i depends on how far `x` must be moved:

- **best case** (array already sorted): 1 comparison per step → **n − 1** comparisons,
- **worst case** (array sorted in reverse): i comparisons in step i → **W(n) = n(n−1)/2**,
- **average:** x travels on average through half of the sorted fragment → **A(n) ≈ n²/4**,
- **S(n) = O(1)**, the algorithm is **stable** (we shift only elements **strictly** greater than x).

:::tip
The number of shifts in InsertionSort equals the **number of inversions** in the sequence, i.e. pairs (i < j) with a[i] > a[j]. That is why the algorithm is very fast for **almost sorted** data — in practice it is often used to "finish off" small fragments inside faster algorithms.
:::

### InsertionSort as "divide and conquer"

The "Divide and conquer" lecture shows the same algorithm recursively: we split the task into **1 and n−1** elements. Recursively sort the first n−1 elements, then **merge** the result with the last element (i.e. insert it in place).

- T(1) = 0, T(n) = T(n − 1) + (n − 1) ⇒ T(n) = n(n−1)/2 = O(n²).

```java title="ElementarySorts.java"
@include t05-elementary.java
```

```text title="Program output"
pass 0: [10, 29, 14, 37, 13]
pass 1: [10, 13, 14, 37, 29]
pass 2: [10, 13, 14, 37, 29]
pass 3: [10, 13, 14, 29, 37]
i = 1: [10, 29, 14, 37, 13]
i = 2: [10, 14, 29, 37, 13]
i = 3: [10, 14, 29, 37, 13]
i = 4: [10, 13, 14, 29, 37]
```

## Comparison

| | SelectionSort | InsertionSort |
|---|---|---|
| comparisons — best | n(n−1)/2 | n − 1 |
| comparisons — average | n(n−1)/2 | ≈ n²/4 |
| comparisons — worst | n(n−1)/2 | n(n−1)/2 |
| moves | n − 1 swaps | = number of inversions (up to n²/2) |
| memory S(n) | O(1) | O(1) |
| stable | no | yes |
| good when | moving is expensive, small n | data almost sorted, small n |

Both are **quadratic** — too slow for large n. In the next topics we meet O(n log n) sorts (MergeSort, QuickSort, HeapSort) and learn that **you cannot do better than n log n comparisons** (decision trees).

## How to write down a sorting trace in class {own}

:::own
The site author's tips for tasks like "show how algorithm … works on the array …".
:::

- Write **the state of the whole array after every pass** of the outer loop (after every i).
- Mark the boundary of the sorted part (e.g. with a bar `|`).
- In SelectionSort also give **which element was the minimum** and what it was swapped with.
- In InsertionSort give **the inserted element x** and how many elements were shifted.
- Finally count the comparisons — instructors often ask for it.


## 2026/2027 lecture version (M. Sydow) — "Sorting 1"

:::exam
The tests use the versions of **selectionSort** and **insertionSort** from the slides below (arrays from 0, the counter `next`, the condition `temp < arr[curr - 1]`). Questions from the slides: the idea, operation, **code** and analysis of each algorithm.
:::

:::def The sorting problem
- **Input:** S — a sequence of elements that can be ordered by a linear order relation ≤_R (e.g. natural numbers); len — its length (a natural number).
- **Output:** S' — a sequence of the same elements as S, ordered **non-decreasingly** (∀ 0 < i < len: S[i−1] ≤_R S[i]).
:::

For simplicity the course sorts natural numbers — apart from CountSort this does not affect the algorithms. Sorting speeds up searching and database operations, helps visualisation and computing statistics.

**Selection Sort** — find the minimum, swap it with the first element and repeat on the sequence from the next index, while the current sequence has more than 1 element.

```pseudo
selectionSort(S, len){
  i = 0
  while(i < len){
    mini = indexOfMin(S, i, len)
    swap(S, i, mini)
    i++
  }
}
```

`indexOfMin(S, i, len)` returns the index of the minimum among S[j], i ≤ j < len; `swap(S, i, mini)` swaps S[i] and S[mini]. **Analysis:** dominant operation — comparison of 2 elements; data size — len. In the i-th iteration we look for the minimum in a sequence of length len − i: $W(len)=\sum_{i=1}^{len-1} i=\frac{len(len-1)}{2}=\Theta(len^2)$. $A(len)=W(len)$ — the algorithm always does the same number of comparisons, **even for an already sorted sequence**.

**Insertion Sort** — from the second position (`next`) we "push" the current element backwards (comparing) until it finds its place and the first next + 1 elements are sorted.

```pseudo
insertionSort(arr, len){

  for(next = 1; next < len; next++){

    curr = next;
    temp = arr[next];

    while((curr > 0) && (temp < arr[curr - 1])){

      arr[curr] = arr[curr - 1];
      curr--;
    }

    arr[curr] = temp;
  }
}
```

The invariant of the outer loop is analogous to SelectionSort (the initial fragment is sorted). **Worst case:** **reverse-sorted** data: $W(n)=\frac{n(n-1)}{2}=\frac{1}{2}n^2+\Theta(n)=\Theta(n^2)$. For **already sorted** data **n − 1** comparisons suffice — the algorithm "**adapts the amount of work**" to how sorted the data is. **On average** (every permutation of 1..n equally likely) the i-th iteration makes on average $\frac{1}{i}\sum_{j=1}^{i} j=\frac{i+1}{2}$ comparisons, in total $A(n)=\sum_{i=1}^{n-1}\frac{i+1}{2}=\frac{1}{4}n^2+\Theta(n)=\Theta(n^2)$ — 2 times faster than SelectionSort, but still quadratic (3 times more data → about 9 times longer).

Quadratic complexity is too high for large data — e.g. a billion numbers is only 8 GB in RAM. The solution: **MergeSort** ([topic 6](topic:t06)).

### Sample questions from the slides

The essence of the sorting problem and its uses; selectionSort, insertionSort, mergeSort — idea, operation, code, analysis; lists vs arrays (pros and cons); the merge function on lists instead of arrays.

=== summary ===

:::exam What you must know
The array after successive passes of selection/insertion sort; W and A analysis; comparison with MergeSort.
:::

## Selection sort

Find the minimum of the unsorted part, swap it with its first element (`indexOfMin` + `swap`), `i++`.

## Insertion sort

"Push" `arr[next]` left while `temp < arr[curr-1]`; the first `next+1` elements are sorted.

```pseudo
for(next = 1; next < len; next++){
  curr = next; temp = arr[next];
  while((curr > 0) && (temp < arr[curr - 1])){
    arr[curr] = arr[curr - 1]; curr--;
  }
  arr[curr] = temp;
}
```

## Complexities (operation: comparison)

| | W | A | best | memory | stable |
|---|---|---|---|---|---|
| Selection | $\frac{n(n-1)}{2}$ | $=W$ | $=W$ (even for sorted) | $O(1)$ | no |
| Insertion | $\frac{n(n-1)}{2}$ (reverse sorted) | $\frac14 n^2+\Theta(n)$ | $n-1$ (sorted) | $O(1)$ | yes |

:::tip Remember
Insertion "adapts the amount of work" to how sorted the data is; on average 2× faster than Selection, but still $\Theta(n^2)$.
:::

:::warn Common mistakes
- in insertion also count the comparison that **stops** the shifting,
- selection swaps even when the minimum is already in place (the array does not change).
:::

=== tasks ===

:::task level=1 source="Exercise 5, task 1 (modified)" title="SelectionSort and InsertionSort on an array"
Show how **SelectionSort** and **InsertionSort** (lecture versions) work on the array

`[12, 5, 17, 3, 8, 14, 1, 10, 6, 2]`.

Give the array state after each pass of the outer loop and count the element comparisons.
::hint
SelectionSort has 9 passes (i = 0…8). InsertionSort has 9 steps (i = 1…9). In InsertionSort count the comparison `a[j−1] > x` every time it is performed (including the last one that ends the loop).
::solution
**SelectionSort** (the minimum found in brackets):

| pass | min | array after the pass |
|---|---|---|
| i = 0 | 1 | 1, 5, 17, 3, 8, 14, 12, 10, 6, 2 |
| i = 1 | 2 | 1, 2, 17, 3, 8, 14, 12, 10, 6, 5 |
| i = 2 | 3 | 1, 2, 3, 17, 8, 14, 12, 10, 6, 5 |
| i = 3 | 5 | 1, 2, 3, 5, 8, 14, 12, 10, 6, 17 |
| i = 4 | 6 | 1, 2, 3, 5, 6, 14, 12, 10, 8, 17 |
| i = 5 | 8 | 1, 2, 3, 5, 6, 8, 12, 10, 14, 17 |
| i = 6 | 10 | 1, 2, 3, 5, 6, 8, 10, 12, 14, 17 |
| i = 7 | 12 | unchanged (12 already in place) |
| i = 8 | 14 | unchanged |

Comparisons: 9 + 8 + … + 1 = **45**, swaps: **9** (the last two swap an element with itself).

**InsertionSort** (x — the inserted element):

| step | x | array after the step |
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

Comparisons `a[j−1] > x`: **35**, shifts: **29** (as many as there are inversions in the data).
:::

:::task level=1 source="own" title="Best and worst data"
For n = 6 give an example of data for which InsertionSort makes the **fewest**, and one for which it makes the **most** comparisons. How many will there be? Do such data exist for SelectionSort too?
::hint
Think about when x does not have to be moved at all, and when it has to be moved to the very beginning.
::solution
- **Fewest:** data sorted ascending, e.g. `[1, 2, 3, 4, 5, 6]` → 1 comparison per step → **5** comparisons.
- **Most:** data sorted descending, e.g. `[6, 5, 4, 3, 2, 1]` → step i makes i comparisons → 1 + 2 + 3 + 4 + 5 = **15** = 6·5/2.
- **SelectionSort** always makes **15** comparisons (Δ(n) = 0) — there are no better or worse data. Only the number of "real" swaps differs (swapping an element with itself).
:::

:::task level=2 source="own" title="Stability in practice"
We have records (grade, surname) sorted alphabetically by surname:

`(4, Adamska), (3, Kowal), (4, Nowak), (3, Wiśniewski), (5, Zieliński)`

Sort them ascending **by grade** with InsertionSort and with SelectionSort. In which result are people with the same grade still in alphabetical order?
::hint
Run both algorithms comparing only the grades. In SelectionSort watch the first swap.
::solution
**InsertionSort** (stable): `(3, Kowal), (3, Wiśniewski), (4, Adamska), (4, Nowak), (5, Zieliński)` — in groups "3" and "4" the alphabetical order is kept ✓.

**SelectionSort:**
- i = 0: the minimum is (3, Kowal) at pos. 1 → swap with (4, Adamska): `(3,K), (4,A), (4,N), (3,W), (5,Z)`,
- i = 1: the minimum is (3, Wiśniewski) at pos. 3 → swap with (4, Adamska): `(3,K), (3,W), (4,N), (4,A), (5,Z)`,
- i = 2, 3: no change.

Result: `(3, Kowal), (3, Wiśniewski), (4, Nowak), (4, Adamska), (5, Zieliński)` — **Nowak before Adamska**, the alphabetical order in group "4" is broken ✗. SelectionSort is not stable.
:::

:::task level=2 source="own" title="Inversions"
How many inversions does `[4, 1, 3, 2]` have? How many shifts will InsertionSort make? What is the largest possible number of inversions of a sequence of length n?
::hint
An inversion is a pair of positions (i < j) with a[i] > a[j]. List all pairs.
::solution
Pairs with a[i] > a[j]: (4,1), (4,3), (4,2), (3,2) → **4 inversions**, so InsertionSort makes **4 shifts**. The largest number of inversions is the number of all pairs: **n(n−1)/2** (a decreasing sequence).
:::
