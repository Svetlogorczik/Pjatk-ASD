---
id: exams
type: page
title: Tests 2026/2027 — practical and knowledge
short: Tests 2026/2027
icon: 📝
eyebrow: Preparing to pass · 2026/2027
desc: Qualifying-task types (binSearch, MergeSort, partition, CountSort, heap, a^b), the official sample data solved step by step, algorithm versions that match the answers, practice tasks and hints for the knowledge test.
---

:::info Where this page comes from
**The task wording, the sample data with answers and the hints for the theory part** come from the lecturer's 2026/2027 materials (M. Sydow). **The pseudocode** (except the heap) is copied from the 2026/2027 slides; **the step-by-step solutions and the practice tasks** were prepared by the site author — every result was checked with a program that simulates the algorithm. Scoring rules: [Passing the course](page:course).
:::

:::warn Algorithm versions
The lecturer requires **exactly the versions of the algorithms from the slides**. The pseudocode of **search (binSearch), mergeSort/merge, partition/quicksort and countSort** below is **copied from the 2026/2027 slides** (lectures "Wyszukiwanie", "Sortowanie 1", "Sortowanie 2") and gives exactly the official answers. The description of the **binary heap** is still the site author's reconstruction matched to the official answers (there have been no heap slides yet) — if a slide says otherwise, **the slide wins**.
:::

## What the qualifying tasks look like

The practical test has about 10 tasks, mainly on **knowing how algorithms work**. The official list of qualifying task types (*zadania dopuszczeniowe*):

| # | Task | What you must give |
|---|---|---|
| 1 | **Binary Search** on array S, key Key | a) the indices of the elements compared with Key (in order), b) the returned value |
| 2 | **Merge Sort** (lecture version) | a) the total number of comparisons between elements, b) the left and right sequences in the **last** call of `merge()` |
| 3 | **partition()** from QuickSort (lecture version) | a) the returned index, b) the first element of the array after partition, c) the number of `swap()`s — **including the last one** |
| 4 | **Count Sort** (lecture version) | the `counts` array (range 0..max) a) after counting, b) after summing, c) after writing to the output array |
| 5 | **Binary min-heap** (array from index 1) | a) after consecutive `insert()`s of S, b) as a) + `delMin()`, c) after one `construct()` from S |
| 6 | a simple **a^b** algorithm | a) specification, b) pseudocode (multiplying b times) |
| 7 | continuation of 6 | c) analysis of **total correctness**, d) **time and space** complexity (dominant operation, data size!) |

Full scope of the practical test: orders of functions / O notation, binSearch, selection sort, insertion sort, mergeSort, quickSort/partition, countSort, radixSort, minHeap, BST, in/pre/post-order, BFS/DFS, Kruskal.

## 1. Binary Search

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

**Official example:** S = 7, 13, 17, 25, 30, 41, 52, 58, 60, 61, 80, 85; Key = 60.

```array
@idx
S: 7 13 17 25 30 [41] 52 58 60 61 80 85
```

| Step | l | r | m | S[m] | Decision |
|---|---|---|---|---|---|
| 1 | 0 | 11 | **5** | 41 | 41 < 60 → l = 6 |
| 2 | 6 | 11 | **8** | 60 | found → return 8 |

**Answer:** a) **5, 8**; b) **8**.

:::tip
In the test always write the l, r, m table — one slip in the division (e.g. (6+11)/2 = 8, not 9) ruins the whole result. If the key is missing, −1 is returned, and there are about log₂ n compared indices.
:::

## 2. Merge Sort

```pseudo
mergeSort(S, len){
  if(len <= 1) return S[0:len]
  m = len/2
  return merge(mergeSort(S[0:m], m), m,
               mergeSort(S[m:len], len-m), len-m)
}

merge(a1, len1, a2, len2){
  i = j = k = 0;
  result[len1 + len2] // (alokacja pamięci)
  while((i < len1) && (j < len2))
    if(a1[i] < a2[j]) result[k++] = a1[i++];
    else result[k++] = a2[j++];
  while(i < len1) result[k++] = a1[i++];
  while(j < len2) result[k++] = a2[j++];
  return result;
}
```

Watch the split: **m = len/2 (rounded down)**, the left part is S[0:m] — for odd length **the left half is shorter by 1** (e.g. for 7 elements: 3 | 4). S[a:b] means the elements S[i] with a ≤ i < b.

`merge` compares the first elements of both sequences and copies the smaller one; **once one sequence runs out, the rest of the other is copied without comparisons**. The number of comparisons in one `merge` = the number of elements output before one of the sequences is exhausted. For **equal** elements the condition `a1[i] < a2[j]` is false, so the element from the **right** sequence goes first — this version is not stable (changing `<` to `<=` makes it stable; the slides ask which place in the code decides stability).

**Official example:** S = 6, 2, 4, 0, 3, 8, 7, 5.

| merge call | Result | Comparisons |
|---|---|---|
| (6) + (2) | 2, 6 | 1 |
| (4) + (0) | 0, 4 | 1 |
| (2, 6) + (0, 4) | 0, 2, 4, 6 | 3 (0<2, 2<4, 4<6; then 6 without comparison) |
| (3) + (8) | 3, 8 | 1 |
| (7) + (5) | 5, 7 | 1 |
| (3, 8) + (5, 7) | 3, 5, 7, 8 | 3 (3<5, 5<8, 7<8; then 8) |
| **(0, 2, 4, 6) + (3, 5, 7, 8)** | 0, 2, 3, 4, 5, 6, 7, 8 | 6 (left ends after 6; 7, 8 without comparisons) |

**Answer:** a) 1+1+3+1+1+3+6 = **16**; b) last merge: **0, 2, 4, 6 | 3, 5, 7, 8**.

:::tip
The last `merge()` always merges **the two sorted halves of the whole array** — just sort the left and right halves separately. The number of comparisons when merging sequences of lengths p and q is between min(p, q) and p + q − 1.
:::

## 3. partition() from QuickSort

The pivot is **the first element**. Two indices move towards each other: the left one looks for an element **greater** than the pivot, the right one — **smaller**; if they haven't crossed, we swap. At the end the pivot is swapped with the element at the boundary (that is also a `swap`).

```pseudo
partition(a, l, r){
  i = l + 1;
  j = r;
  p = a[l]; //"pivot"
  temp;
  do{
    while((i < r) && (a[i] <= p)) i++;
    while((j > i) && (a[j] >= p)) j--;
    if(i < j) {temp = a[i]; a[i] = a[j]; a[j] = temp;}
  }while(i < j);
  // when (i==r):
  if(a[i] > p) {a[l] = a[i - 1]; a[i - 1] = p; return i - 1;}
  else {a[l] = a[i]; a[i] = p; return i;}
}

quicksort(a, l, r){
  if(l >= r) return;
  k = partition(a, l, r);
  quicksort(a, l, k - 1);
  quicksort(a, k + 1, r);
}
```

On the slide a pair swap is three assignments via `temp`, and the final placement of the pivot (`a[l] = …; … = p`) is a swap too — in the qualifying tasks it counts as the last `swap()`. Example from the slides: 5,2,1,7,2,6,1,3,4,8,6,0 → 3,2,1,0,2,4,1,5,6,8,6,7 (returns 7).

**Official example:** S = 6, 5, 9, 4, 8, 3, 1, 7, 2, 0 (pivot 6).

```array
@idx
start: (6) 5 [9] 4 8 3 1 7 2 [0]
swap 1: (6) 5 0 4 [8] 3 1 7 [2] 9
swap 2: (6) 5 0 4 2 3 [1] [7] 8 9
swap 3: 1 5 0 4 2 3 {6} 7 8 9
```

1. i stops at 9 (index 2), j at 0 (index 9) → swap(2, 9).
2. i stops at 8 (index 4), j at 2 (index 8) → swap(4, 8).
3. i passes 2, 3, 1 and stops at 7 (index 7); j goes down to i — the loop ends. a[7] = 7 > 6, so p = 6 → swap(0, 6).

**Answer:** a) **6**; b) **1**; c) **3** swaps.

:::tip Quick check
The returned index = **the number of elements smaller than the pivot** (when the elements are distinct): in the example 5, 4, 3, 1, 2, 0 → 6. The number of swaps = the number of pair swaps + 1.
:::

## 4. Count Sort

```pseudo
countSort(a, l){
  max = maxValue(a, l);
  l1 = max + 1;
  counts[l1];
  result[l];
  for(i = 0; i < l1; i++) counts[i] = 0;

  for(i = 0; i < l; i++) counts[a[i]]++;
  for(i = 1; i < l1; i++) counts[i] += counts[i - 1];
  for(i = l - 1; i >= 0; i--)
    result[--counts[a[i]]] = a[i];
}
```

Example from the slides: for (3,2,5,1,2,6,8,1,2,4) max = 8, counts after phase 1: 0,2,3,1,1,1,1,0,1, after phase 2: 0,2,5,6,7,8,9,9,10. The prefix `--counts[a[i]]` first decrements the counter and then uses it as the index.

**Official example:** S = 2, 2, 4, 2, 5, 3, 5, 2, 1, 0, 1, 5, 0, 2, 0 (max = 5, so counts has indices 0..5).

| Index | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| a) after counting | 3 | 2 | 5 | 1 | 1 | 3 |
| b) after summing | 3 | 5 | 10 | 11 | 12 | 15 |
| c) after output | 0 | 3 | 5 | 10 | 11 | 12 |

:::tip
In phase 3 every `counts[v]` is decreased exactly as many times as v occurs — so c) is simply b) **shifted one place to the right** with 0 at the front (= the index where the v's start in the result). The last value of b) is always len.
:::

## 5. Binary min-heap

A heap in an array from **index 1**: the children of node i are 2i and 2i+1, the parent is i/2. In a min-heap every parent ≤ its children.

- `insert(x)`: put it at the end, then **upheap** — swap with the parent while the parent > x.
- `delMin()`: take the root, **move the last element to the root**, then **downheap** — swap with the **smaller** child while it is smaller.
- `construct()`: (build from the whole array at once) run downheap for i = n/2, n/2 − 1, …, 1.

**Official example:** S = 15, 17, 3, 0, 16, 2, 19, 5.

**a) Consecutive insert()s:**

| Inserted | Array after upheap |
|---|---|
| 15 | 15 |
| 17 | 15, 17 |
| 3 | 3, 17, 15 |
| 0 | 0, 3, 15, 17 |
| 16 | 0, 3, 15, 17, 16 |
| 2 | 0, 3, 2, 17, 16, 15 |
| 19 | 0, 3, 2, 17, 16, 15, 19 |
| 5 | **0, 3, 2, 5, 16, 15, 19, 17** |

```tree
0(3(5(17,_),16),2(15,19))
```

**b) delMin():** 17 goes to the root: 17, 3, 2, 5, 16, 15, 19 → smaller child 2 → 2, 3, 17, 5, 16, 15, 19 → smaller child 15 → **2, 3, 15, 5, 16, 17, 19**.

**c) construct()** on 15, 17, 3, 0, 16, 2, 19, 5 (n = 8, start from i = 4):

| i | Node | Action | Array |
|---|---|---|---|
| 4 | 0 | child 5 — no change | 15, 17, 3, 0, 16, 2, 19, 5 |
| 3 | 3 | children 2, 19 → swap with 2 | 15, 17, 2, 0, 16, 3, 19, 5 |
| 2 | 17 | children 0, 16 → with 0; then child 5 → with 5 | 15, 0, 2, 5, 16, 3, 19, 17 |
| 1 | 15 | children 0, 2 → with 0; children 5, 16 → with 5; child 17 — stop | **0, 5, 2, 15, 16, 3, 19, 17** |

:::warn
The results of a) and c) are **different**, although both are valid heaps — a common trap. `construct()` is not the same as n `insert()`s.
:::

## 6–7. The a^b algorithm: specification, pseudocode, correctness, complexity

This task checks the definitions from lectures 1 (correctness) and 2 (complexity) — see [topic 2](topic:t02) and [topic 3](topic:t03), sections "2026/2027 lecture version".

**a) Specification**
- **name and arguments:** `power(a, b)`
- **precondition:** a, b — natural numbers, a > 0 (b may be 0)
- **postcondition:** the algorithm returns the number a^b (in particular 1 when b = 0)

**b) Pseudocode**

```pseudo
power(a, b){
  result = 1
  i = 0
  while(i < b){
    result = result * a
    i++
  }
  return result
}
```

**c) Total correctness** = stop property + partial correctness.

1. **Stop property.** The loop ends when i ≥ b. The value b is **constant and finite** (a natural number), i starts at 0 and **grows by 1** in every iteration. So after exactly b iterations i = b and the algorithm stops.
2. **Partial correctness — loop invariant:** `result == a^i  ∧  i <= b`.
   - **before the first iteration:** i = 0, result = 1 = a⁰; i = 0 ≤ b, because b is natural ✓
   - **preservation:** if before an iteration result = a^i and i < b (the loop condition), then after it result' = a^i · a = a^(i+1) and i' = i + 1 ≤ b ✓
   - **after leaving the loop:** the invariant and ¬(i < b) give i = b, so result = a^b — the postcondition ✓

Since the algorithm has the stop property and is partially correct, it is **totally correct**.

**d) Complexity**
- **data size:** the value of the exponent **b** (a does not affect the number of operations — assuming multiplication is one operation),
- **dominant operation:** the multiplication `result * a` (the comparison `i < b` works too),
- **time complexity:** W(b) = A(b) = b, i.e. **Θ(b)** — linear (there are b + 1 comparisons, also Θ(b)),
- **space complexity:** a constant number of variables (result, i) → **S(b) = O(1)**.

:::exam
Without naming the **dominant operation** and the **data size** the complexity analysis is incomplete — the lecturer explicitly reminds you of that. A bonus remark: with respect to the **number of bits** of the exponent (≈ log₂ b) this algorithm is exponential (compare [topic 3](topic:t03)).
:::

## Knowledge test — what to prepare

The lecturer's hints for the theory part (faithfully summarised):

1. **Correctness.** Know very well and **understand the logical meaning** of the definitions: total/partial correctness, stop property, specification, precondition/postcondition, invariant. Practise justifying the **stop property**, and for simple algorithms — proving partial correctness with an invariant (the latter will rather not be required for a 4.0).
2. **Complexity.** Definitions of time and space complexity, dominant operation, data size, worst-case and average complexity, the notations **W(), A(), S()**. Definitions and meaning of all **5 kinds of asymptotic notation** (O, o, Θ, Ω, ω). Be able to determine the order of a function; practise proofs from the definition (e.g. **n² + 5n + 2 = O(n²), but not O(n)**). Know the **hierarchy of orders** (constant, logarithmic, any power of n — fractional too, exponential). In every analysis explain **what the data size is** (sometimes several variables) and **what the dominant operation is** (sometimes several, e.g. with several consecutive loops).
3. **Searching.** How sequential search, **jumps of k** and binary search work and their **specifications** (what they assume about the data); how they would work on an **array vs a linked list**; their complexities, including how jumps of k depend on k; for which data the algorithm runs longest.
4. **Sorting.** Exactly how selection, insertion, merge sort (and merge), quicksort (and partition), count sort and radix sort work — not just their complexities by heart. For which data they are slowest/fastest, how they work on arrays and how on lists; **compare every pair** of algorithms; **stability** (which are stable and why); the **lower bound** for comparison sorting (Ω(n log n)).
5. **Abstract data structures.** Distinguish an ADS from concrete structures (array, list, binary tree). Definitions and efficient implementations: **stack, queue, deque, priority queue, dictionary**; a stack/queue on an array vs on a list (singly or doubly linked?) and the complexities of the operations. In particular: a priority queue as a **binary heap**, a dictionary as a **hash table** or a **BST** — definitions, properties and how the operations work.

Where on the site: [2. Correctness](topic:t02), [3. Complexity](topic:t03), [4. Searching](topic:t04), [5. Simple sorting](topic:t05), [6. MergeSort](topic:t06), [7. QuickSort and linear sorts](topic:t07), [9. Stack, queue, lists](topic:t09), [10. BST](topic:t10), [11. Hashing](topic:t11), [12. Heaps](topic:t12).

### Checklist from the slides {own}

:::own
The lists "What you must know" and "Control questions/tasks" from the first two 2026/2027 lectures, merged into a tick-off form.
:::

- Give from memory the **exact** definitions of: specification, correct input and output data, total and partial correctness, loop invariant.
- For a given computational task, write a **precise specification**.
- Give an example of an algorithm that is **partially correct without the stop property** — and vice versa (it stops but returns a wrong result).
- Prove the **stop property** of a given algorithm; find an **invariant** of a simple loop and prove that it is one; use it to prove partial correctness.
- What do we measure the "speed" of an algorithm with? Which **2 steps** must be done before analysing complexity (dominant operations, data size)?
- Definitions and determining: dominant operation, data size, W(n), A(n) (for very simple algorithms), space complexity.
- What is the **purpose** of asymptotic notation? Definitions and interpretation of the **5 variants**; prove from the definition that a given expression is true or false.

=== tasks ===

:::task level=1 source=own title="Binary Search — two arrays"
For each array give the indices of the elements compared with Key and the returned value.

a) S = 3, 8, 11, 19, 24, 27, 33, 40, 46, 52, 59, 63, 71, 88; Key = 24

b) S = 2, 5, 9, 14, 20, 26, 31, 37, 42, 48, 55; Key = 50
::hint
Write l, r, m in a table. In b) the key is missing — the algorithm ends when l > r.
::solution
**a)** l=0, r=13 → m=6 (33 > 24) → r=5; m=2 (11 < 24) → l=3; m=4 (24) — found. Indices: **6, 2, 4**; result **4**.

**b)** l=0, r=10 → m=5 (26 < 50) → l=6; m=8 (42 < 50) → l=9; m=9 (48 < 50) → l=10; m=10 (55 > 50) → r=9; l > r. Indices: **5, 8, 9, 10**; result **−1**.
:::

:::task level=1 source=own title="Merge Sort — number of comparisons and the last merge"
For the sequences count the total number of comparisons and give the sequences in the last `merge()`:

a) S = 9, 1, 6, 3, 8, 2, 7 (odd length — m = 7/2 = 3, the left part has 3 elements)

b) S = 5, 1, 8, 3, 9, 4, 0, 6, 2, 7
::hint
First split down to single elements, then merge bottom-up and count the comparisons in each merge separately.
::solution
**a)** Split: (9, 1, 6) | (3, 8, 2, 7) → (9) | (1, 6) and (3, 8) | (2, 7).

Merges: (1)+(6): 1; (9)+(1, 6): 9v1, 9v6 → **2**, 9 remains; (3)+(8): 1; (2)+(7): 1; (3, 8)+(2, 7): 3v2, 3v7, 8v7 → **3**, 8 remains. Last: (1, 6, 9)+(2, 3, 7, 8): 1v2, 6v2, 6v3, 6v7, 9v7, 9v8 → **6**, 9 remains.

Total 1+2+1+1+3+6 = **14**; last merge: **1, 6, 9 | 2, 3, 7, 8**.

**b)** Total **22** comparisons; last merge: **1, 3, 5, 8, 9 | 0, 2, 4, 6, 7**.
:::

:::task level=2 source=own title="partition() — two arrays"
Run partition (pivot = first element). Give the returned index, the first element of the array after partition and the number of swaps (including the last one).

a) S = 5, 8, 1, 9, 3, 7, 2, 6, 4

b) S = 7, 2, 9, 1, 8, 3, 10, 5, 4, 6
::hint
Check: the returned index = the number of elements smaller than the pivot.
::solution
**a)** swap(1, 8): 5, 4, 1, 9, 3, 7, 2, 6, 8; swap(3, 6): 5, 4, 1, 2, 3, 7, 9, 6, 8; i stops at 7 (index 5) → p = 4; swap(0, 4): **3, 4, 1, 2, 5, 7, 9, 6, 8**.

Index **4**, first element **3**, swaps **3**.

**b)** swap(2, 9): 7, 2, 6, 1, 8, 3, 10, 5, 4, 9; swap(4, 8): 7, 2, 6, 1, 4, 3, 10, 5, 8, 9; swap(6, 7): 7, 2, 6, 1, 4, 3, 5, 10, 8, 9; p = 6; swap(0, 6): **5, 2, 6, 1, 4, 3, 7, 10, 8, 9**.

Index **6**, first element **5**, swaps **4**.
:::

:::task level=1 source=own title="Count Sort — the counts array in three phases"
a) S = 3, 1, 4, 1, 0, 3, 4, 2, 4, 1, 3

b) S = 1, 4, 0, 4, 2, 1, 6, 4, 0, 2, 1, 5
::hint
In b) one value from the range 0..6 does not occur — counts has 0 there, and after summing the previous sum repeats.
::solution
**a)** counting: 1, 3, 1, 3, 3; summing: 1, 4, 5, 8, 11; after output: 0, 1, 4, 5, 8.

**b)** counting: 2, 3, 2, 0, 3, 1, 1; summing: 2, 5, 7, 7, 10, 11, 12; after output: 0, 2, 5, 7, 7, 10, 11.
:::

:::task level=2 source=own title="Min-heap — insert, delMin, construct"
For S = 12, 7, 9, 4, 15, 1, 10, 6 and for S = 20, 14, 8, 11, 3, 17, 5, 9, 1 give the heap array (from index 1): a) after consecutive insert()s, b) after a) + delMin(), c) after construct().
::hint
In construct() start from i = ⌊n/2⌋ and go down to 1; push each element down as deep as needed.
::solution
**S = 12, 7, 9, 4, 15, 1, 10, 6:**

a) **1, 6, 4, 7, 15, 9, 10, 12**; b) **4, 6, 9, 7, 15, 12, 10**; c) **1, 4, 9, 6, 15, 12, 10, 7**.

**S = 20, 14, 8, 11, 3, 17, 5, 9, 1:**

a) **1, 3, 5, 8, 11, 17, 14, 20, 9**; b) **3, 8, 5, 9, 11, 17, 14, 20**; c) **1, 3, 5, 9, 20, 17, 8, 14, 11**.
:::

:::task level=1 source=own title="Selection sort and insertion sort — state after each pass"
a) Sort with selection sort (find the minimum and swap it with the first unsorted element): 29, 10, 14, 37, 13, 5.

b) Sort with insertion sort: 8, 3, 10, 1, 6, 4. How many element comparisons are there?
::solution
**a)** 5, 10, 14, 37, 13, 29 → 5, 10, 14, 37, 13, 29 (10 already in place) → 5, 10, 13, 37, 14, 29 → 5, 10, 13, 14, 37, 29 → 5, 10, 13, 14, 29, 37.

**b)** 3, 8, 10, 1, 6, 4 → 3, 8, 10, 1, 6, 4 → 1, 3, 8, 10, 6, 4 → 1, 3, 6, 8, 10, 4 → 1, 3, 4, 6, 8, 10. Comparisons: 1 + 1 + 3 + 3 + 4 = **12** (we also count the comparison that stops the shifting).
:::

:::task level=1 source=own title="Radix sort (LSD, base 10)"
Sort 329, 457, 657, 839, 436, 720, 355, 41 — give the sequence after each phase (units, tens, hundreds). Sorting by a digit must be stable.
::solution
after units: 720, 41, 355, 436, 457, 657, 329, 839

after tens: 720, 329, 436, 839, 41, 355, 457, 657

after hundreds: 41, 329, 355, 436, 457, 657, 720, 839
:::

:::task level=1 source=own title="BST and tree traversals"
Insert into an empty BST in order: 50, 30, 70, 20, 40, 60, 80, 35, 45, 65. Give the pre-, in- and post-order traversals and the height of the tree.
::solution
```tree
50(30(20,40(35,45)),70(60(_,65),80))
```
pre-order: 50, 30, 20, 40, 35, 45, 70, 60, 65, 80

in-order: 20, 30, 35, 40, 45, 50, 60, 65, 70, 80 (always sorted!)

post-order: 20, 35, 45, 40, 30, 65, 60, 80, 70, 50

height: **3** (counted in edges).
:::

:::task level=2 source=own title="BFS, DFS and Kruskal on one graph"
An undirected weighted graph: 1–2 (7), 1–3 (3), 1–4 (5), 2–5 (2), 3–5 (6), 3–6 (4), 4–6 (1), 5–7 (8), 6–7 (9), 2–3 (10).

a) Give the BFS and DFS visiting order from vertex 1 (neighbours in increasing order).

b) Give the order of edges added by Kruskal's algorithm and the weight of the tree.
```graph
1 60 140
2 180 40
3 180 140
4 180 260
5 320 60
6 320 220
7 440 140
1-2 7
1-3 3
1-4 5
2-5 2
3-5 6
3-6 4
4-6 1
5-7 8
6-7 9
2-3 10
```
::solution
**a)** BFS: **1, 2, 3, 4, 5, 6, 7**. DFS: **1, 2, 3, 5, 7, 6, 4**.

**b)** Edges by weight: 4–6 (1) ✓, 2–5 (2) ✓, 1–3 (3) ✓, 3–6 (4) ✓, 1–4 (5) ✗ cycle 1-3-6-4, 3–5 (6) ✓, 1–2 (7) ✗ cycle, 5–7 (8) ✓ — we have 6 edges for 7 vertices, done. Weight: 1 + 2 + 3 + 4 + 6 + 8 = **24**.
:::

:::task level=2 source="Lecturer's hints (example)" title="O notation from the definition"
Prove from the definition that n² + 5n + 2 = O(n²), but n² + 5n + 2 ≠ O(n).
::solution
**O(n²):** for n ≥ 1 we have 5n ≤ 5n² and 2 ≤ 2n², so n² + 5n + 2 ≤ 8n². Constants: **c = 8, n₀ = 1** ✓.

**Not O(n):** suppose there are c > 0 and n₀ such that n² + 5n + 2 ≤ c·n for n ≥ n₀. Dividing by n: n + 5 + 2/n ≤ c, so n ≤ c for all n ≥ n₀ — a contradiction (take n > max(c, n₀)). ∎
:::
