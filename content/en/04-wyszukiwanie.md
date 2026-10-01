---
id: t04
num: 4
type: topic
title: Searching and selection — sequential, binary, the k-th element
short: Searching and selection
desc: Sentinel and binary search, the lower bound for the maximum, min and max together, the second largest (tournament) and Hoare's algorithm for the k-th element.
sources: asd3.pdf; Dziel-RzadzC.pdf (min-max); Wyklady 2009/wyklad_3.pdf and asd 07 wyklad_4.pdf (The search problem I and II)
exercises: asd 03.pdf (task 3), asd 05.pdf (task 4)
---

:::exam 2026/2027 tests
This topic was written from the 2025/2026 lectures. **The 2026/2027 tests use the versions from M. Sydow's slides** — you will find them in the section ["2026/2027 lecture version"](topic:t04#2026-2027-lecture-version-m-sydow-searching) at the end of the topic (code copied from the slides). Qualifying tasks and practice tasks: [Tests 2026/2027](page:exams).
:::

## The search problem

We have a sequence (an array) and ask: **is the element a in it, and if so — at which position?** It is one of the most common tasks in computing: looking up a contact in your phone, a product in a shop, a word in a dictionary.

How fast we can search depends on **what we know about the data**:

- **unordered** data → we must (in the worst case) look at everything,
- **sorted** data → we can search much more cleverly.

## Sequential (linear) search

We look at the elements one by one from the left. We already know the version **with a sentinel** from topic 3: we put the searched `a` at the end of the array, so the loop does not have to check whether it left the array.

- W(n) = n + 1 comparisons, A(n) = (n + 1)/2.

**Can we do better for unordered data?** No. The lecture justifies it like this: if the only available operation is comparing the searched element with an array element, then an algorithm that **did not look** at some position cannot know whether `a` is not exactly there. So n comparisons are **necessary**.

## Binary search

Assume the array is **sorted non-decreasingly**. Now a comparison with one element gives us much more information!

:::analogy
The game "I'm thinking of a number from 1 to 100". You don't ask "is it 1? is it 2? is it 3?", but "is it bigger than 50?". Every question **cuts off half** of the possibilities, so after about 7 questions you know everything (2⁷ = 128 ≥ 100). You search a paper dictionary the same way.
:::

The idea (the same as for the square root in topic 2): keep an interval `[l, p]` in which `a` **certainly** is (if it is in the array at all), and compare `a` with the **middle** element `L[s]`:

- if `a > L[s]` — there is nothing to look for to the left of s (inclusive), so `l := s + 1`,
- otherwise — `a` (if present) lies in `[l, s]`, so `p := s`.

We stop when the interval has length 1.

:::def
**The invariant** of binary search: *if `a` is in the array L, then at least one of its copies lies in the examined interval `L[l..p]`.* When at the end the interval has one element, it is enough to check that one element.
:::

```pseudo title="SzukajBin (lecture version)"
Algorytm SzukajBin(L, N, a):
  Dane:  N > 0, L[0..N-1] sorted non-decreasingly, a - the searched element
  Wynik: i such that L[i] = a (0 ≤ i ≤ N-1), or N when a is not in L
{
  l := 0;  p := N - 1;
  while l < p do {
    // Inv.: a ∈ L  ⇔  a ∈ L[l..p]
    s := (l + p) div 2;          // div = integer division
    if a > L[s] then
      l := s + 1
    else
      p := s;
  }
  if a = L[l] then return l
  else return N
}
```

**Example:** searching for 17 in `[1, 3, 5, 10, 17, 30, 35, 99]`:

```array
@idx
start: 1 3 5 [10] 17 30 35 99
l=4: ~1~ ~3~ ~5~ ~10~ 17 [30] 35 99
p=5: ~1~ ~3~ ~5~ ~10~ [17] 30 ~35~ ~99~
p=4: ~1~ ~3~ ~5~ ~10~ {17} ~30~ ~35~ ~99~
```

1. l = 0, p = 7, s = 3: 17 > 10 → l = 4,
2. l = 4, p = 7, s = 5: 17 ≤ 30 → p = 5,
3. l = 4, p = 5, s = 4: 17 ≤ 17 → p = 4,
4. l = p = 4: `L[4] = 17` → result **4**.

### Complexity

Each iteration shrinks the interval (roughly) **by half**. From an interval of length N after k iterations about N/2ᵏ remains, so the loop runs about **⌈log₂ N⌉ times** (plus one comparison at the end). For a million elements that is only ~20 comparisons instead of a million!

- **W(N) ≈ log₂ N** — **logarithmic** complexity.
- **Termination:** the value p − l is natural and strictly decreases every iteration (because l ≤ s < p).

:::tip
This version always returns the **first** occurrence of `a` (the smallest index), even if `a` occurs many times — because on equality (`a ≤ L[s]`) we always go left (`p := s`).
:::

:::warn
Binary search works **only on a sorted** array. On an unsorted one it may fail to find an element that is there.
:::

```java title="Search.java"
@include t04-search.java
```

### Other methods for sorted data

The older slides (2009, "The search problem I") show two more methods:

- **Jumps of k** — check every k-th element and, once we "jump over" `a`, search the last block linearly. The best k is about **√n**, and the complexity is **O(√n)**.
- **Interpolation search** — instead of the middle, check the position "proportional" to the value (like a phone book: a surname starting with "W" is near the end). For **uniformly distributed** data it takes **O(log log n)** on average, but **O(n)** in the worst case.

## Maximum: n − 1 comparisons is the minimum

Finding the largest element takes n − 1 comparisons (every element except the winner must "lose" to someone). Can it be done with fewer? The lecture proves that **no**:

:::def
Build a graph: vertices are the elements, and an edge joins two elements the algorithm compared. A graph with n vertices and fewer than n − 1 edges **is not connected** — it has at least two parts whose elements were never compared with each other. The maximum may be in either of them, so the algorithm cannot be sure of the result. Hence **the complexity of the maximum problem is n − 1 comparisons**.
:::

Note the important notion: speaking of the **complexity of a problem** we consider **all possible** algorithms, not just one.

## Minimum and maximum together — divide and conquer

If we looked for the minimum and maximum separately, we would make 2n − 2 comparisons. The "Divide and conquer" lecture shows a better way: split the array into two halves, find (min, max) in each, then combine: min of the two minima, max of the two maxima.

- T(1) = 0, T(2) = 1, T(n) = 2T(n/2) + 2,
- the solution for n = 2ᵏ: **T(n) = (3/2)·n − 2**.

:::def
**Pohl's theorem:** the problem of finding the minimum and maximum simultaneously cannot be solved with fewer than **⌈3n/2⌉ − 2** comparisons. (Proof: L. Banachowski, A. Kreczmar "Elementy analizy algorytmów".)
:::

The same result can be obtained without recursion — by comparing elements **in pairs** (a version by the site author, easier to program):

```java title="MinMax.java"
@include t04-minmax.java
```

Each pair costs 3 comparisons (inside the pair, the smaller with min, the larger with max), i.e. about 3n/2 instead of 2n.

## The second largest — a tournament

From the 2009 slides: we look for the **second largest** element. The idea of a tennis tournament: elements play "matches" in pairs, the winner (the larger) goes on. After n − 1 matches we know the champion (the maximum).

Who is second? **Only someone who lost directly to the champion!** (Everyone else lost to someone who is not the champion, so is at best third.) The champion played ⌈log₂ n⌉ matches, so we take the maximum of ⌈log₂ n⌉ candidates.

- in total: **n + ⌈log₂ n⌉ − 2** comparisons (instead of 2n − 3 naively).

```text title="Tournament for [7, 3, 12, 9, 15, 4, 11, 6]"
round 1:   7  3 | 12  9 | 15  4 | 11  6     →   7, 12, 15, 11
round 2:     7 12   |     15 11             →   12, 15
final:           12  15                     →   15 (maximum)
lost to 15:  4 (r1), 11 (r2), 12 (final)   →  second = max(4, 11, 12) = 12
comparisons: 7 (tournament) + 2 (candidates) = 9 = 8 + 3 - 2
```

## Selecting the k-th element — Hoare's algorithm

**Problem:** find the element that would be at position k if the sequence were sorted (e.g. the **median**: k = ⌈n/2⌉). We could of course sort (O(n log n)) and take the k-th. But it can be done faster — **in linear time on average**.

### The partition function

The most important part of the algorithm. We take a **pivot** (*element dzielący*) `v = a[l]` and rearrange the fragment `a[l..r]` so that:

1. `v` lands on its **final** position j (where it would be after sorting),
2. to the left of j there are elements **≤ v**,
3. to the right of j there are elements **≥ v**.

We do it with two pointers: `i` goes from the left and stops at an element ≥ v, `j` goes from the right and stops at an element ≤ v. Those two elements are "on the wrong side" — we swap them. When the pointers cross, we put v at position j.

Example: partition of `[7, 2, 9, 4, 8, 1, 6]`, v = 7:

```array
@idx
start: (7) 2 [9] 4 8 1 [6]
swap: (7) 2 6 4 [8] [1] 9
swap: (7) 2 6 4 1 8 9
end: 1 2 6 4 {7} 8 9
```

1. i stops at 9 (pos. 2), j at 6 (pos. 6) → swap,
2. i stops at 8 (pos. 4), j at 1 (pos. 5) → swap,
3. i stops at 8 (pos. 5), j at 1 (pos. 4) — they crossed → the loop ends,
4. swap the pivot with `a[j] = a[4]`: 7 lands at position **4** — its place in the sorted sequence.

### The Select algorithm

After partition we know that the pivot is at position j, and `a[l..j]` holds `j − l + 1` elements (the pivot and the smaller ones). We compare this with k:

- `k = j − l + 1` → **the pivot is the answer**,
- `k < j − l + 1` → keep searching **in the left part** `a[l..j−1]`,
- `k > j − l + 1` → search in the **right part** `a[j+1..p]`, but now for the (k − (j − l + 1))-th element (that many smaller elements were "thrown away").

```pseudo title="Select — Hoare's algorithm"
Algorytm Select(a, n, k):
// a[0..n-1] - the sequence, k - "rank" of the searched element (1..n)
{
  l := 0;  p := n - 1;
  jest := false;                   // "found"
  while not jest do {
    j := partition(a, l, p);
    // a[l..j-1] <= a[j] <= a[j+1..p]
    if k = j - l + 1 then jest := true
    else if k <= j - l then
      p := j - 1                   // the k-th is in the left part
    else {
      k := k - (j - l + 1);        // skip the j-l+1 smallest
      l := j + 1
    }
  }
  return a[j]
}
```

```java title="HoareSelect.java"
@include t04-select.java
```

### Complexity of Hoare's algorithm

- partition on a fragment of length n makes about n comparisons,
- **in the worst case** the pivot is always extreme and the fragment shrinks by only 1: W(1) = 0, W(n) = (n + 1) + W(n − 1), hence **W(n) = ½n² + O(n)**,
- **in the best case** we hit it at once: n + 1 comparisons,
- **on average** the algorithm runs in **linear time**: A(n) = O(n) (the fragment shrinks by a constant fraction on average).

:::info
The older slides (2009, "The search problem II") mention the **"magic fives"** algorithm (Blum, Floyd, Pratt, Rivest, Tarjan): the pivot is chosen as the median of medians of groups of 5 elements. This guarantees a good split and **linear time even in the worst case**, but with a large constant — in practice Hoare's algorithm is used more often.
:::

:::exam
In classes you often have to "show how Hoare's algorithm works" — i.e. list the **consecutive calls of partition**: the interval (l, p), the pivot, the resulting position j, the array after the split and the new k. Write it as a table — as in the solution of task 3 below.
:::


## 2026/2027 lecture version (M. Sydow) — "Searching"

:::exam
The 2026/2027 tests use the specifications and code from the slides below. You must be able to **write the `search` code (binary search) from memory** and **simulate** it on data — see also [Tests 2026/2027](page:exams).
:::

**Divide and conquer** — an algorithm **design** technique: split the problem into subproblems (smaller inputs) and explain how to get the solution of the whole from their solutions. Often implemented with **recursion** (a **programming** technique: a function calls itself on smaller input).

:::def The search problem — search(S, len, key)
- **Input:** S — a sequence of integers; len — its length; key — an integer.
- **Output:** the index (a natural number less than len) at which key is in S (S[index] == key), **or −1** if the key is absent.
- Example: S = (3,5,8,2,1,8,4,2,9): search(S, 9, 2) → 3; search(S, 9, 7) → −1.
:::

The natural **dominant operation** is **comparison** of the key with an element, the **data size** is the length len (it may include other parameters, e.g. k in the jump algorithm). **Sequential search** (indices 0..len−1) has $W(len)=len$, and changing the order of checking **cannot improve** this worst case — the key can always be at the last checked index.

**Sorted sequence.** An extra property — **ordering** — allows faster search. Modified specification: Input: S — a sequence of integers **sorted non-decreasingly** (values may repeat), indexed from 0; the rest unchanged.

**Jumps of k.** Check every k-th index (skipping k−1 elements per "jump"); after finding the first element greater than the key, it is enough to check the last k−1 "jumped-over" elements. For len → ∞ it is on average **asymptotically k times faster** than sequential search (for small k). With a good k (exercise: k = √len) $W(len)=\frac{1}{k}\cdot\Theta(len)$ — but this is **still linear**, the same order.

**Binary search — idea:** (1) while the sequence length is positive: (2) compare the key with the middle element; (3) equal → return the current index; (4) key smaller → search only the left subsequence; (5) greater → only the right one; (6) go back to 1; (7) the length dropped to zero → no key.

```pseudo
search(S, len, key){

  l = 0
  r = len - 1

  while(l <= r){
    m = (l + r)/2
    if(S[m] == key) return m
    else
      if(S[m] > key) r = m - 1
      else l = m + 1
  }

  return -1
}
```

It is assumed that the whole sequence is in **RAM** (random access) — checking any S[m] takes constant time. **Analysis:** data size — len; dominant operation — the comparison `S[m] == key`; with each iteration the current sequence becomes **2 times shorter**, so $W(len)=\Theta(\log_2 len)$, $A(len)=\Theta(\log_2 len)$, $S(len)=O(1)$. (On a linked list or a "slow" disk access to S[m] is not constant — then this analysis fails.)

### Order statistics

The **k-th order statistic** is the k-th smallest (or largest) element; the minimum is the case k = 1. In a sorted sequence the task is trivial, so we consider **unordered** sequences.

**Second smallest — second(S, len)** (distinct elements). Simple solution: find the minimum, remove it, find the minimum again — $2\cdot len-1$ comparisons. **Tournament algorithm (divide and conquer):** elements play in pairs, the smaller goes on; the winner = the minimum. The second smallest is among the elements that **lost to the winner** (it could only lose to it). The tournament is a binary tree with **Θ(log₂ len)** levels; the first phase takes **len − 1** comparisons (each comparison eliminates exactly one element), the second finds the minimum among about log₂ len candidates: $W(len)=len-1+\Theta(\log_2 len)$ — asymptotically 2 times faster than searching for the minimum twice.

**k-th smallest — kthSmallest(S, len, k)** (1 ≤ k ≤ len, nothing assumed about S). Naively: find the minimum k times — about k·len comparisons.

:::def The partition(S, l, r) procedure
Takes the **first** element m of the subsequence S[l..r] and rearranges the elements so that to the left of m there are **not greater** elements and to the right **not smaller** ones (not necessarily sorted). It **returns** the final position i of m. Dominant operation: comparison of 2 elements; data size n = r − l + 1; it can be designed with $W(n)=n+O(1)$ and $S(n)=O(1)$ (code — in the QuickSort lecture, [topic 7](topic:t07)).
:::

**Hoare's algorithm:** run partition; if the returned index i = k, return S[k]; if i < k, repeat on the part to the right of i, otherwise to the left ("divide and conquer", like binSearch, but the split is rarely in the middle). Thanks to linear partition the **average** complexity is **linear — Θ(n) regardless of k**. In the worst case it is **quadratic** (when partition always ends at an end of the subsequence, which shrinks by only 1).

### Sample questions from the slides

- The specification of the search problem; the jumps-of-k algorithm (specification, operation, correctness, complexity, simulation).
- Binary search: specification, operation, **code from memory (lecture version)**, correctness, complexity, simulation.
- Order statistic; the tournament algorithm; specification and complexity of partition; the idea of Hoare's algorithm; **why does Hoare have quadratic worst-case complexity?**

=== summary ===

## 2026/2027 version (M. Sydow)

- search: l = 0, r = len − 1, m = (l + r)/2; equal → m; S[m] > key → r = m − 1, else l = m + 1; absent → −1.
- binary: W = A = Θ(log len), S = O(1) (assuming RAM); sequential W = len; jumps of k: linear, ~k times faster (k = √len).
- second smallest: simple 2len − 1; tournament len − 1 + Θ(log len).
- partition: W(n) = n + O(1), S = O(1); Hoare: A = Θ(n) regardless of k, W = Θ(n²).


## Searching

| Method | Requirement | Complexity |
|---|---|---|
| sequential (with sentinel) | none | W = n + 1, A = (n+1)/2 |
| binary | sorted array | ~⌈log₂ n⌉ iterations + 1 comparison |
| jumps of √n | sorted | O(√n) |
| interpolation | sorted, uniform distribution | average O(log log n), worst O(n) |

- Unordered data: n comparisons are necessary.
- **SzukajBin:** `s := (l+p) div 2; if a > L[s] then l := s+1 else p := s`; invariant: a ∈ L ⇔ a ∈ L[l..p]; returns the **first** occurrence; decreasing function p − l.

## Selection

- **max:** n − 1 comparisons — the complexity of the **problem** (graph proof: < n − 1 edges ⇒ disconnected).
- **min and max together:** T(n) = 2T(n/2) + 2 ⇒ **3n/2 − 2**; Pohl: ≥ ⌈3n/2⌉ − 2.
- **second largest:** tournament, **n + ⌈log₂ n⌉ − 2** (candidates = those who lost to the champion).

## Hoare (k-th element)

- **partition(l, r):** v = a[l]; i from the left to ≥ v, j from the right to ≤ v, swap; finally v goes to position j.
- k = j − l + 1 → found; k ≤ j − l → p := j − 1; otherwise k := k − (j − l + 1), l := j + 1.
- W(n) = ½n² + O(n), A(n) = O(n); "magic fives" — O(n) even in the worst case.

=== tasks ===

:::task level=1 source="Exercise 3, task 3 (modified)" title="Trace of binary search"
Given the non-decreasing array

`E = [2, 4, 7, 9, 11, 14, 18, 21, 23, 27, 30, 33, 36, 40, 44, 48]` (indices 0…15).

Run the lecture's **SzukajBin** algorithm for the key **a = 30**, and then for **a = 20**. List the sequence of checked indices s (with the values of l and p) and the returned value.
::hint
Remember: `s := (l + p) div 2`; if `a > E[s]` then `l := s + 1`, otherwise `p := s`. The loop runs while `l < p`. At the end there is one more comparison `a = E[l]`.
::solution
**a = 30:**

| step | l | p | s | E[s] | decision |
|---|---|---|---|---|---|
| 1 | 0 | 15 | 7 | 21 | 30 > 21 → l = 8 |
| 2 | 8 | 15 | 11 | 33 | 30 ≤ 33 → p = 11 |
| 3 | 8 | 11 | 9 | 27 | 30 > 27 → l = 10 |
| 4 | 10 | 11 | 10 | 30 | 30 ≤ 30 → p = 10 |
| end | 10 | 10 | | | E[10] = 30 → **returns 10** |

Checked indices: **7, 11, 9, 10**, then the comparison with E[10].

**a = 20:**

| step | l | p | s | E[s] | decision |
|---|---|---|---|---|---|
| 1 | 0 | 15 | 7 | 21 | 20 ≤ 21 → p = 7 |
| 2 | 0 | 7 | 3 | 9 | 20 > 9 → l = 4 |
| 3 | 4 | 7 | 5 | 14 | 20 > 14 → l = 6 |
| 4 | 6 | 7 | 6 | 18 | 20 > 18 → l = 7 |
| end | 7 | 7 | | | E[7] = 21 ≠ 20 → **returns N = 16** ("not found") |

In both cases 4 loop iterations = log₂ 16.
:::

:::task level=2 source="Exercise 3, task 3 — second part (modified)" title="Correctness and complexity of SzukajBin"
Prove the total correctness of SzukajBin (invariant + termination) and estimate its worst-case complexity for an array of length N.
::hint
Invariant: "if a is in the array, then it is in L[l..p]". Show that neither `if` branch throws the only possible place of a out of the interval. Decreasing function: p − l.
::solution
**α:** N > 0, L sorted non-decreasingly. **β:** result i with L[i] = a when a ∈ L; result N when a ∉ L.

**Invariant** g: (a ∈ L ⇒ a ∈ L[l..p]) ∧ 0 ≤ l ≤ p ≤ N − 1.
- **start:** l = 0, p = N − 1 — the interval is the whole array ✓.
- **iteration:** s = (l+p) div 2, so l ≤ s < p.
  - if a > L[s], then (L is sorted) a > L[l..s], so a is not in L[l..s]; after l := s + 1 the invariant holds ✓,
  - if a ≤ L[s], then all elements of L[s+1..p] are ≥ L[s] ≥ a — if a is in L[l..p], its first occurrence is in L[l..s]; after p := s the invariant holds ✓.
- **end:** ¬(l < p) and l ≤ p ⇒ l = p. From g: if a ∈ L, then a = L[l]. So the `if a = L[l]` instruction returns the correct result ✓.

**Termination:** f = p − l ∈ ℕ; since l ≤ s < p, in the "l := s + 1" branch l strictly grows, and in the "p := s" branch p strictly drops — f strictly decreases ✓.

**Complexity:** after every iteration the interval length (p − l + 1) drops from m to at most ⌈m/2⌉. After ⌈log₂ N⌉ iterations 1 element remains. W(N) = **⌈log₂ N⌉ + 1** comparisons (+1 is the final comparison) = **Θ(log N)**.
:::

:::task level=2 source="Exercise 5, task 4 (modified)" title="Hoare's algorithm step by step"
Show how Hoare's algorithm works (with the lecture's partition function, pivot = the first element of the interval) when searching for the **6th smallest** element of the array

`S = [12, 5, 3, 14, 8, 19, 6, 1, 15, 17, 16, 2, 13, 5, 27, 22]`.
::hint
After every partition compute the pivot's rank within the interval: j − l + 1, and compare it with k. Remember to decrease k when you go right.
::solution
**1. partition(0, 15)**, v = 12:
- i stops at 14 (pos. 3), j at 5 (pos. 13) → swap,
- i stops at 19 (pos. 5), j at 2 (pos. 11) → swap,
- i stops at 15 (pos. 8), j at 1 (pos. 7) — they crossed,
- 12 goes to position 7:

```array
@idx
after 1.: 1 5 3 5 8 2 6 {12} 15 17 16 19 13 14 27 22
```
Pivot rank = 7 − 0 + 1 = 8; k = 6 < 8 → **left part**, p = 6.

**2. partition(0, 6)**, v = 1: nothing smaller — 1 stays at position 0. Rank = 1; k = 6 > 1 → **right part**: k = 6 − 1 = **5**, l = 1.

**3. partition(1, 6)**, v = 5 (fragment `[5, 3, 5, 8, 2, 6]`):
- i stops at 5 (pos. 3), j at 2 (pos. 5) → swap → `[5, 3, 2, 8, 5, 6]`,
- i stops at 8 (pos. 4), j at 2 (pos. 3) — they crossed,
- 5 goes to position 3 → fragment `[2, 3, 5, 8, 5, 6]`.

Rank = 3 − 1 + 1 = 3; k = 5 > 3 → **right part**: k = 5 − 3 = **2**, l = 4.

**4. partition(4, 6)**, v = 8 (fragment `[8, 5, 6]`): nothing larger → 8 goes to position 6, fragment `[6, 5, 8]`. Rank = 3; k = 2 ≤ 2 → **left part**, p = 5.

**5. partition(4, 5)**, v = 6 (fragment `[6, 5]`): 6 goes to position 5 → `[5, 6]`. Rank = 5 − 4 + 1 = 2 = k → **found**.

```array
@idx
end: 1 2 3 5 5 {6} 8 12 15 17 16 19 13 14 27 22
```

**Result: 6.** (Check: the sorted sequence is 1, 2, 3, 5, 5, **6**, 8, 12, … — the sixth element is 6 ✓.)
:::

:::task level=1 source="own" title="How many comparisons for min and max?"
How many comparisons does the "pairs" method (or divide and conquer) make when looking for the minimum and maximum of an array of **n = 10** elements, and how many for **n = 11**? How many would the naive approach (min separately, max separately) make?
::hint
For even n: 1 comparison of the first pair + 3 comparisons per each further pair. For odd n the first element is both min and max right away.
::solution
- n = 10: 1 + 3 · 4 = **13** = 3·10/2 − 2.
- n = 11: 0 + 3 · 5 = **15** = ⌈3·11/2⌉ − 2.
- Naively: 2n − 2 → **18** and **20**.

By Pohl's theorem it cannot be done with fewer.
:::

:::task level=2 source="own" title="The second largest in a tournament"
For the array `[21, 8, 14, 30, 5, 17, 26, 11]` find the second largest element with the tournament method. List the rounds, the candidates and count the comparisons. Compare with the formula n + ⌈log₂ n⌉ − 2.
::hint
The winner of a match = the larger element. The only candidates for second place are those who lost directly to the champion.
::solution
- round 1: (21, 8) → 21, (14, 30) → 30, (5, 17) → 17, (26, 11) → 26 — 4 comparisons,
- round 2: (21, 30) → 30, (17, 26) → 26 — 2 comparisons,
- final: (30, 26) → **30** — 1 comparison.

Those who lost to the champion 30: **14** (r1), **21** (r2), **26** (final). Their maximum: 2 comparisons → **26**.

Total: 7 + 2 = **9** = 8 + 3 − 2 ✓ (naively: 7 + 6 = 13).
:::
