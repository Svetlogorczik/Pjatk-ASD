---
id: t07
num: 7
type: topic
title: QuickSort, the n log n barrier and linear-time sorting
short: QuickSort & linear sorts
desc: Hoare's quick sort, splitting (partition, Split, the Polish flag), QuickSort without recursion using a stack, decision trees and the lower bound, CountingSort, RadixSort and BucketSort.
sources: asd5.pdf (§2 QuickSort, §3 CountSort, RadixSort); asd6.pdf (QuickSort and the stack); Dziel-RzadzC.pdf (Quicksort, FlagaPolska); Wyklady 2009/wyklad_5.pdf (decision trees), asd 08 wyklad_6.pdf (linear-time sorting)
exercises: asd 05.pdf (tasks 2, 5), asd 06.pdf (tasks 1, 3)
---

## QuickSort — quick sort (Hoare, 1960)

QuickSort is one of the most widely used sorting algorithms — for "random" data it is considered the fastest. It is another example of **divide and conquer**, but with the work distributed the opposite way to MergeSort:

- in MergeSort **splitting is trivial** (into halves) and all the work is **merging**,
- in QuickSort all the work is **splitting** (partition), and "merging" is **empty** — after both parts are sorted, everything is already in place.

**Idea:**

1. choose a pivot v (for us: the first element of the fragment),
2. **split** the fragment so that v lands on its final position j, with elements ≤ v on the left and ≥ v on the right (the **partition** function known from topic 4),
3. recursively sort the left part `a[l..j−1]` and the right part `a[j+1..r]`.

```pseudo title="QuickSort (lecture)"
void QuickSort(int l, int r, IntCiag a)
// we sort a.ciag[l..r], l < r
{
  int j;
  j := partition(l, r);
  if j - 1 > l then QuickSort(l, j - 1, a);
  if r > j + 1 then QuickSort(j + 1, r, a);
}
```

:::def
The **correctness** of QuickSort relies on the fact that after `partition(l, r)`:
1. the element v = a[j] stands at its **final** place,
2. a[l..j−1] ≤ v,
3. v ≤ a[j+1..r].

Then it is enough to sort both parts (recursively) independently — nothing has to be moved between them any more.
:::

**Example** for `[9, 4, 7, 1, 8, 2, 6]` (in brackets — the pivot at its place):

```text title="Consecutive calls"
QS(0,6): pivot 9 → pos. 6   [6, 4, 7, 1, 8, 2, (9)]
  QS(0,5): pivot 6 → pos. 3 [1, 4, 2, (6), 8, 7, 9]
    QS(0,2): pivot 1 → pos. 0 [(1), 4, 2, 6, 8, 7, 9]
      QS(1,2): pivot 4 → pos. 2 [1, 2, (4), 6, 8, 7, 9]
    QS(4,5): pivot 8 → pos. 5 [1, 2, 4, 6, 7, (8), 9]
result: [1, 2, 4, 6, 7, 8, 9]
```

```java title="QuickSort.java"
@include t07-quicksort.java
```

### Analysis of QuickSort

The result of the lecture's analysis:

- **W(n) = ½n² + O(n)** — when the pivot is always extreme (e.g. **already sorted** data!), the split is maximally unequal (0 and n − 1),
- **Δ(n) = O(n²)**,
- **A(n) ≈ 1.4 · n log₂ n + O(n)** — on average only about 40% more comparisons than the optimal n log₂ n,
- **δ(n) ≈ 0.65 n** (the deviation is small compared with n log n — the algorithm usually runs close to the average).

:::warn
The QuickSort paradox: for the "pivot = first element" version the worst case is **already sorted** data (or sorted in reverse) — then it runs in quadratic time and the recursion depth is n.
:::

### How to avoid the worst case? {own}

:::own
These improvements are not discussed on the slides — they are standard practical tricks added by the site author.
:::

- **Random pivot** — swap a[l] with a random element of the fragment before partition. Then no specific data are "malicious"; the expected time is O(n log n) for every input.
- **Median of three** — pivot = the median of a[l], a[middle], a[r]. Protects against sorted data.
- **Small fragments** (e.g. < 10 elements) — sort them with InsertionSort, it is faster for them.

## Other ways of splitting: Split and the Polish flag

The lecture's partition uses two pointers moving towards each other. In classes it is compared with another split — **Split**.

:::info
The **Split** procedure appears in class tasks but not on the lecture slides. Below is the version found in Polish textbooks (one-directional, pivot = the first element). If your instructor gave a different version — stick to their definition.
:::

**Split(l, r):** v = a[l]; the pointer s marks the end of the "smaller than v" zone. Go with i from l+1 to r: if a[i] < v, move s by 1 and swap a[s] with a[i]. Finally swap a[l] with a[s] — the pivot lands at position s.

```pseudo title="Split"
Split(a, l, r):
{
  v := a[l];  s := l;
  for i := l+1 to r do
    if a[i] < v then {
      s := s + 1;
      swap(a[s], a[i])
    }
  swap(a[l], a[s]);
  return s
}
```

The "Divide and conquer" lecture calls splitting the **Polish flag** algorithm: "white" elements (≤ A[l]) should go to the left, "red" ones (≥ A[l]) to the right — like the two colours of the flag (compare the robot-and-balls task in topic 2). It works like partition: i goes right from `l + 1` over elements ≤ A[l], j goes left from `p` over elements ≥ A[l], and elements "on the wrong side" are swapped. Finally `Zamien(l, j)` (swap) puts the pivot at position j.

:::warn A note from the site author
In your own implementation watch the boundaries: the loop "go left while A[j] ≥ A[l]" must stop at position l at the latest (A[l] itself satisfies the equality!). The partition version from lecture asd5 (with `i <= r` and strict inequalities) is safe in this respect.
:::

All three versions do the same (split around the pivot in linear time) — they differ in the number of swaps and in where elements equal to v end up.

## QuickSort without recursion — the stack

Lecture asd6 asks: what really happens during recursive calls? Every call `QuickSort(l, r)` has local copies of `l, r, i, j, v, x`, which must be stored until it returns. Luckily, in QuickSort:

1. both recursive calls are **independent** — they can be executed in any order,
2. they are at the **end** of the function — so one of them can be replaced with a **loop**, and the parameters of the other stored on a **stack**.

On the stack we keep pairs of indices [l, r] of subsequences still to be sorted. **Push the longer subsequence and deal with the shorter one immediately.** Then each next subsequence on the stack is at least twice as short as the previous one, so there are at most about log₂ n pairs on the stack at once:

- **S(n) = O(log n)** extra memory.

The iterative version is in the code above (`quickSortIterative`).

:::def
A **stack** is an abstract data structure with the operations: `push(x)` — put x on top, `pop()` — remove and return the most recently pushed element, `top()` — look at it without removing, `size()`, `isEmpty()`. Rule: **last in — first out** (LIFO). Details in topic 9.
:::

## Can we sort faster than n log n? Decision trees

Every sorting algorithm **based on comparisons** (SelectionSort, InsertionSort, MergeSort, QuickSort, …) can be drawn as a **decision tree**:

:::def
A **decision tree** for a sequence of n elements: internal nodes contain comparisons "aᵢ : aⱼ?", each comparison has two outcomes (left and right child), and the **leaves** contain the results — sorted permutations. Running the algorithm on specific data is a **path from the root to a leaf**; the number of comparisons = the length of that path.
:::

The decision tree for n = 3 (elements a, b, c):

```tree caption="Decision tree for sorting 3 elements: node “a:b” asks whether a ≤ b (left = yes)."
a:b(b:c(abc,a:c(acb,cab)),a:c(bac,b:c(bca,cba)))
```

The lecture's reasoning:

1. the tree must have at least **n!** leaves (each of the n! input permutations needs a different answer),
2. a binary tree of height h has at most **2ʰ** leaves,
3. so 2ʰ ≥ n!, i.e. **h ≥ log₂(n!)**.

And log₂(n!) = Θ(n log n) (by Stirling's formula: log₂ n! ≈ n log₂ n − 1.44 n).

:::def
**Theorem:** every comparison-based sorting algorithm makes at least **⌈log₂ n!⌉ = Ω(n log n)** comparisons in the worst case. Also **on average** at least log₂ n! comparisons are needed.
:::

Consequence: **MergeSort and HeapSort are asymptotically optimal**, and QuickSort — on average.

## Sorting in linear time — without comparisons

The n log n theorem applies only to algorithms that **compare** elements. If we know more about the data (e.g. that they are small integers), we can **avoid comparing** them — and get down to linear time!

### CountingSort — sorting by counting

Assume we sort integers from the range **0…m−1**. For each value j we count how many times it occurs (`count[j]`). Then prefix sums tell **how many elements are ≤ j** — i.e. where the slot for value j ends in the result.

```pseudo title="CountSort (lecture, condensed)"
for j := 0 to m-1 do count[j] := 0;
for i := 0 to n-1 do count[a[i]]++;             // count[j] = occurrences of j
for j := 1 to m-1 do count[j] += count[j-1];    // count[j] = number of elements <= j
for i := n-1 downto 0 do {                       // from the end → stable
  p := a[i];
  count[p]--;
  t[count[p]] := p;
}
for i := 0 to n-1 do a[i] := t[i];
```

**Example** for `[3, 1, 4, 1, 5, 2, 6, 5, 3]` (m = 7):

| value j | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|---|
| count (occurrences) | 0 | 2 | 1 | 2 | 1 | 2 | 1 |
| count (sums ≤ j) | 0 | 2 | 3 | 5 | 6 | 8 | 9 |

Result: `[1, 1, 2, 3, 3, 4, 5, 5, 6]`.

The lecture's analysis:

- **W(n, m) = A(n, m) = O(n + m)**, Δ = δ = 0,
- **S(n, m) = n + m + O(1)** (the result array t and the count array),
- advantages: **speed** when m = O(n); the algorithm is **stable** (scanning from a[n−1] down to a[0] is essential for stability),
- drawback: extra memory; suitable only for **small m**.

### RadixSort — digit-by-digit sorting

For large m we split the keys into parts (digits or groups of bits) and sort with the **stable** CountingSort **first by the last (least significant) digit**, then by the second to last, …, finally by the first. Stability is crucial: if the leading digits are equal, the order is decided by the later ones — which were already arranged correctly in earlier passes.

- for n numbers with d digits in base k: **O(d · (n + k))**.

```java title="LinearSorts.java"
@include t07-counting.java
```

### BucketSort — bucket sort

From the 2009 slides: if the numbers are **uniformly distributed** over [0, 1), split the interval into n equal **buckets**, throw each number into its bucket (bucket ⌊n·x⌋), sort the buckets (they are small — on average 1 element each) and concatenate. **O(n) on average**, in the worst case as much as sorting one full bucket.

## Summary of sorting algorithms {own}

:::own
A summary table prepared by the site author from the lecture results.
:::

| Algorithm | Worst | Average | Extra memory | Stable |
|---|---|---|---|---|
| SelectionSort | n²/2 | n²/2 | O(1) | no |
| InsertionSort | n²/2 | n²/4 | O(1) | yes |
| MergeSort | n log n | n log n | O(n) | yes |
| QuickSort | n²/2 | 1.4 n log n | O(log n) (stack) | no |
| HeapSort (topic 12) | 2n log n | ~2n log n | O(1) | no |
| CountingSort | O(n + m) | O(n + m) | O(n + m) | yes |
| RadixSort | O(d(n + k)) | O(d(n + k)) | O(n + k) | yes |

=== summary ===

## QuickSort

- partition (pivot = a[l]) → pivot at position j; recursion on a[l..j−1] and a[j+1..r]; "merging" is empty.
- **W(n) = ½n² + O(n)** (sorted data!), **A(n) ≈ 1.4 n log n**, δ ≈ 0.65n, unstable.
- without recursion: a stack of pairs [l, r]; **push the longer, process the shorter** → S(n) = O(log n).
- improvements (by the author): random pivot, median of three, InsertionSort for small fragments.

## Splits

- **partition** — two pointers moving towards each other; **Split** — one pointer s (zone < v), finally swap a[l] with a[s]; **Polish flag** — ≤ v to the left, ≥ v to the right.

## Lower bound

- decision tree: ≥ n! leaves, height h ≥ log₂ n! = **Ω(n log n)** — for every comparison sort (worst case and average).

## Linear sorts (no comparisons)

- **CountingSort:** keys 0…m−1; count → prefix sums → from the end into t; O(n + m), S = n + m, **stable**.
- **RadixSort:** stable, digit by digit from the least significant; O(d(n + k)).
- **BucketSort:** uniform distribution on [0,1), n buckets; O(n) on average.

=== tasks ===

:::task level=2 source="Exercise 5, task 2 (modified)" title="Split and Partition on the same array"
Show how the **Split** and **Partition** procedures (both with pivot = the first element) work on the array

`[10, 4, 15, 12, 3, 11, 8, 16, 5, 6, 13]`.

Give the array state after each swap and the final position of the pivot.
::hint
Split: s starts at 0, i goes from 1 to 10; a swap only when a[i] < 10. Partition: i goes from the left to an element ≥ 10, j from the right to an element ≤ 10.
::solution
**Split** (v = 10, s — end of the "< 10" zone):

| i | a[i] | s | array |
|---|---|---|---|
| 1 | 4 | 1 | 10, 4, 15, 12, 3, 11, 8, 16, 5, 6, 13 (a[1] swapped with a[1]) |
| 4 | 3 | 2 | 10, 4, **3**, 12, **15**, 11, 8, 16, 5, 6, 13 |
| 6 | 8 | 3 | 10, 4, 3, **8**, 15, 11, **12**, 16, 5, 6, 13 |
| 8 | 5 | 4 | 10, 4, 3, 8, **5**, 11, 12, 16, **15**, 6, 13 |
| 9 | 6 | 5 | 10, 4, 3, 8, 5, **6**, 12, 16, 15, **11**, 13 |
| end | | 5 | swap a[0] with a[5]: **6, 4, 3, 8, 5, 10, 12, 16, 15, 11, 13** |

Pivot 10 at position **5**. Swaps: 5 (+ the final one).

**Partition** (v = 10):

| step | i | j | array after the swap |
|---|---|---|---|
| 1 | 2 (15) | 9 (6) | 10, 4, **6**, 12, 3, 11, 8, 16, 5, **15**, 13 |
| 2 | 3 (12) | 8 (5) | 10, 4, 6, **5**, 3, 11, 8, 16, **12**, 15, 13 |
| 3 | 5 (11) | 6 (8) | 10, 4, 6, 5, 3, **8**, **11**, 16, 12, 15, 13 |
| 4 | 6 (11) | 5 (8) | crossed — the loop ends |
| end | | | a[0] ↔ a[5]: **8, 4, 6, 5, 3, 10, 11, 16, 12, 15, 13** |

Pivot 10 is also at position **5** (it must be — that is its place in the sorted sequence), but the order of the other elements differs. Partition made only **3** swaps.
:::

:::task level=2 source="Exercise 5, task 5 / Exercise 6, task 1 (modified)" title="QuickSort step by step"
Show how **QuickSort** (with the lecture's partition) works on the sequence

`[12, 5, 3, 14, 8, 19, 6, 1, 15, 17, 16, 2, 13, 5, 27, 22]`.

List the consecutive calls QS(l, r), the position where the pivot lands, and the fragment after the split.
::hint
You already know the first split (pivot 12) from the Hoare's algorithm task in topic 4. First finish the whole left part, then the right one.
::solution
```text
QS(0,15): pivot 12 → 7   [1, 5, 3, 5, 8, 2, 6, (12), 15, 17, 16, 19, 13, 14, 27, 22]
  QS(0,6): pivot 1 → 0    [(1), 5, 3, 5, 8, 2, 6]
    QS(1,6): pivot 5 → 3  [2, 3, (5), 8, 5, 6]          (fragment a[1..6])
      QS(1,2): pivot 2 → 1  [(2), 3]
      QS(4,6): pivot 8 → 6  [6, 5, (8)]
        QS(4,5): pivot 6 → 5  [5, (6)]
  QS(8,15): pivot 15 → 10 [13, 14, (15), 19, 16, 17, 27, 22]
    QS(8,9): pivot 13 → 8   [(13), 14]
    QS(11,15): pivot 19 → 13 [17, 16, (19), 27, 22]
      QS(11,12): pivot 17 → 12 [16, (17)]
      QS(14,15): pivot 27 → 15 [22, (27)]
result: [1, 2, 3, 5, 5, 6, 8, 12, 13, 14, 15, 16, 17, 19, 22, 27]
```
One-element fragments are not called any more (conditions `j−1 > l` and `r > j+1`).
:::

:::task level=1 source="Exercise 6, task 3 (modified)" title="CountingSort"
Show how **CountingSort** works on the sequence

`[2, 3, 1, 4, 4, 3, 5, 1, 2, 4, 6, 3, 2, 5, 1, 4, 3, 6, 2, 4]` (values 1…6, m = 7).

Give the `count` array after counting, after the prefix sums, and the resulting sequence.
::hint
First count how many times each value occurs. Prefix sums: count[j] := count[j] + count[j−1].
::solution
| j | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|---|
| count after counting | 0 | 3 | 4 | 4 | 5 | 2 | 2 |
| count after sums (≤ j) | 0 | 3 | 7 | 11 | 16 | 18 | 20 |

Interpretation: value 1 takes positions 0–2, value 2 — positions 3–6, value 3 — 7–10, value 4 — 11–15, value 5 — 16–17, value 6 — 18–19.

Result: `[1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 6, 6]`.

Scanning the data from the end (a[19] = 4 goes to position count[4]−1 = 15, then a[18] = 2 to position 6, …) keeps equal elements in order — the sort is stable.
:::

:::task level=2 source="own" title="QuickSort's worst case"
How many element comparisons does the lecture's QuickSort make on **already sorted** data `[1, 2, 3, 4, 5, 6, 7, 8]`? What is the recursion depth? What would a random choice of pivot change?
::hint
For a sorted fragment of length m the pivot is the smallest: pointer i stops immediately, while j walks through the whole fragment.
::solution
For a fragment of length m partition makes **m + 1** comparisons (1 on the i side, m on the j side), and the pivot stays at the beginning — the next fragment has length m − 1. In total for m = 8, 7, …, 2:

9 + 8 + 7 + 6 + 5 + 4 + 3 = **42 comparisons**, recursion depth **7** (= n − 1). This is exactly W(n) = ½n² + O(n).

With a random pivot sorted data stop being "malicious": the expected number of comparisons is ≈ 1.4 n log₂ n and the expected recursion depth — O(log n).
:::

:::task level=1 source="own" title="Decision tree"
How many leaves must the decision tree of any comparison sort have for **n = 4** elements? What is the smallest possible height of this tree (i.e. the smallest worst-case number of comparisons)? And for n = 5?
::hint
Number of leaves ≥ n!, and a binary tree of height h has ≤ 2ʰ leaves.
::solution
- n = 4: at least **4! = 24** leaves; 2ʰ ≥ 24 ⇒ h ≥ ⌈log₂ 24⌉ = **5** comparisons.
- n = 5: **120** leaves; ⌈log₂ 120⌉ = **7** comparisons.

(For n = 5 there is an algorithm that really sorts with 7 comparisons — the bound is achievable.)
:::

:::task level=2 source="own" title="RadixSort"
Sort with **RadixSort** (decimal digits, from the least significant, stable sorting in each pass) the sequence

`[512, 38, 407, 263, 91, 145, 700, 386]`.

Give the sequence after each pass.
::hint
Treat the numbers as three-digit: 038, 091. In each pass keep the order from the previous pass for equal digits.
::solution
- after the units digit: `700, 091, 512, 263, 145, 386, 407, 038`
- after the tens digit: `700, 407, 512, 038, 145, 263, 386, 091`
- after the hundreds digit: `038, 091, 145, 263, 386, 407, 512, 700` ✓

Note in the second pass: 700 and 407 have the same tens digit (0) — they stay in the order from the previous pass (700 before 407). That is exactly why stability is needed.
:::
