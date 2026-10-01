---
id: t12
num: 12
type: topic
title: Priority queues, heaps and HeapSort
short: Heaps and HeapSort
desc: The priority queue, a binary heap in an array, upheap and downheap, building a heap in linear time, heap sort and leftist trees (heaps).
sources: asd10.pdf; Wyklady 2009/wyklad_9 kopce binarne.pdf; wyklad_10.pdf (priority queue — leftist heap)
exercises: asd 10.pdf ("ASD 10b": tasks 1–3)
---

## The priority queue

In an ordinary queue we serve whoever came first. In a **priority queue** — whoever is **most important** (has the highest priority), regardless of arrival order.

:::def
**Priority queue** (the dynamic sorting problem): give a structure for the elements of a dynamic set S supporting:
1. `construct(q, S)` — given a sequence q = [a₁, …, aₙ], create the set S = {a₁, …, aₙ},
2. `insert(x, S)` — S := S ∪ {x},
3. `deletemax(S)` — remove the largest element from S (the dual operation: `deletemin`).

The elements come from a linearly ordered universe.
:::

:::analogy
A hospital emergency room: a heart-attack patient goes in before a sprained ankle, even if they arrived later. Priority decides, not arrival order.
:::

Elementary implementations (lecture):

| Implementation | construct | insert | deletemax | good when |
|---|---|---|---|---|
| unsorted array | O(n) | O(1) | O(n) | many inserts, few deletemax |
| sorted array | O(n log n) | O(n) | O(1) | many deletemax, few inserts |
| **heap** | **O(n)** | **O(log n)** | **O(log n)** | always good |

The general scheme of sorting with a priority queue: `construct(q, S)`, then n times `deletemax(S)`. With a heap this gives **HeapSort** with complexity O(n log n).

## The heap

:::def
A (max-)**heap** (*kopiec*) is a binary tree whose nodes hold the elements of S and which satisfies the **heap condition**: if x is the parent of y, then **the element in x is not smaller than the element in y**.
:::

Consequences:
- **the largest element is at the root**,
- along every path from the root to a leaf the elements are **non-increasing**.

:::warn
A heap is **not** a BST! There is no order between the left and right child in a heap — we only know parent ≥ children. That is why you cannot quickly search for an arbitrary element in a heap, but the maximum is always "at hand".
:::

### The complete heap and its array representation

A **complete heap** is a heap that is a **complete** binary tree: all levels are full except possibly the last, which is filled **from the left** without gaps. For height h and n nodes:

2ʰ ≤ n < 2ʰ⁺¹, i.e. **h = ⌊log₂ n⌋**.

The regular shape lets us store the heap in an array **without any pointers** — nodes are numbered level by level from the left, starting at 1:

- the children of node k: **2k** and **2k + 1**,
- the parent of node k (k > 1): **⌊k/2⌋**.

An example heap and its array:

```tree
15(12(11(7,4),1),9(3,6))
```

```array
@idx 1
a: 15 12 9 11 1 3 6 7 4
```

:::tip
Java arrays are indexed from 0. You can either leave a[0] empty (as in the lecture), or use the "from zero" formulas: the children of k are **2k + 1** and **2k + 2**, the parent is **(k − 1)/2** (a note from the site author).
:::

## Heap operations

### insert and upheap

A new element goes into **the first free slot of the last level** (a[n+1]), and then we restore the heap condition: if it is larger than its parent, **we move up**, shifting smaller parents down (the **upheap** procedure).

Example: insert(13) into the heap above. 13 lands at position 10 (a child of 1), is larger than 1 → up; larger than 12 → up; smaller than 15 → stop.

```tree caption="after insert(13)"
15(13(11(7,4),12(1,_)),9(3,6))
```

In the worst case we go from a leaf to the root: **W_insert(n) = O(log n)** (about ⌊log n⌋ + 1 comparisons).

### deletemax and downheap

1. Remember the root (the maximum).
2. Move the **last** element of the heap (a[n]) into its place and decrease n.
3. Restore the heap condition **going down**: compare the element with the **larger** child; if it is smaller — swap and continue (the **downheap** procedure).

Example: deletemax on the original heap — remove 15, 4 goes to the top, then 4 sinks: swapped with 12, with 11, with 7.

```tree caption="after deletemax"
12(11(7(4,_),1),9(3,6))
```

Each step has **two** comparisons (which child is larger + whether to swap), and there are at most ⌊log n⌋ steps: **W_deletemax(n) = 2⌊log n⌋**.

### construct in linear time

Building a heap with n insert operations would cost O(n log n). The lecture shows a faster way — **bottom-up**: the leaves (positions > n/2) are already heaps. For i = ⌊n/2⌋, …, 1 we call `downheap(i)` — at that moment the subtrees of i's children are already heaps, so after downheap the subtree of i is a heap too.

```pseudo title="construct (lecture)"
void construct()
{
  for i := n/2 downto 1 do
    downheap(i)
}
```

**Why is it O(n)?** {own}

:::own
A justification from the site author (the slides give only the result).
:::

downheap from a node at height k costs O(k). There are about n/2ᵏ⁺¹ nodes at height k. The sum: Σ k · n/2ᵏ⁺¹ = n · Σ k/2ᵏ⁺¹ ≤ n (since Σ k/2ᵏ = 2). Most nodes are low and "sink" only a step or two.

## HeapSort — sorting by heap

```pseudo title="HeapSort (lecture)"
void HeapSort()
{
  construct();
  m := n;
  for i := n downto 2 do
    a[i] := deletemax();     // the heap shrinks, the freed slot receives the maximum
}
```

The lecture's analysis: construct — O(n), n − 1 times deletemax — O(n log n). More precisely **W(n) ≤ 2n log n + O(n)**.

- sorts **in place**: S(n) = O(1),
- **always** O(n log n) (also in the worst case) — unlike QuickSort,
- **unstable**.

```java title="MaxHeap.java (following the lecture's code, indices from 1)"
@include t12-heap.java
```

## Leftist trees (heaps)

A binary heap in an array has one weakness: **merging two heaps** takes O(n). Leftist trees (lecture asd10 and the 2009 slides "Priority queue — leftist heap") do it in O(log n).

:::def
For a node v let **odl(v)** (dist) be the length of the **rightmost path** from v to an external (empty) node. A **leftist tree** is a binary tree in which for every internal node v the rightmost path is the **shortest** of all paths from v to an external node — i.e. odl(left child) ≥ odl(right child).
:::

- the length of the rightmost path is **≤ log₂(n + 1)** (the tree is "heavy" on the left and the right path is short),
- if the keys are arranged in **heap order**, we get a **leftist heap**.

**The basic operation — merging** two leftist trees: recursively merge the **right paths** (the larger root stays the root, and its right subtree is merged with the other tree), and on the way back from the recursion **restore leftness** — swap the left and right child if necessary.

The other operations are expressed by merging:
- `insert(x)` = merge(heap, a one-element tree with x),
- `deletemax` = remove the root and merge(left subtree, right subtree).

Every operation costs **logarithmic** time.

```java title="LeftistHeap.java (following the lecture's Scal (merge) procedure)"
@include t12-leftist.java
```

=== summary ===

## Priority queue

- construct, insert, deletemax (or deletemin).
- unsorted array: insert O(1), deletemax O(n); sorted: the other way round; **heap: O(log n) both, construct O(n)**.

## Heap

- condition: parent ≥ child ⇒ max at the root; it is **not** a BST.
- complete: levels full, the last one from the left; **h = ⌊log n⌋**.
- array from 1: children **2k, 2k+1**, parent **⌊k/2⌋** (from 0: 2k+1, 2k+2, (k−1)/2).
- **insert:** at the end + **upheap** (up), O(log n).
- **deletemax:** root ← last, **downheap** (down, to the larger child), 2⌊log n⌋ comparisons.
- **construct:** downheap for i = n/2 … 1 — **O(n)**.

## HeapSort

construct + (n−1) × deletemax to the end of the array; **W ≤ 2n log n + O(n)**, in place, always n log n, unstable.

## Leftist heap

- odl(left) ≥ odl(right); right path ≤ log(n+1).
- **merge** along right paths + swapping children; insert and deletemax via merge — O(log n).

=== tasks ===

:::task level=2 source="“ASD 10b”, task 1 (modified)" title="Building a heap in two ways"
For the sequence **{5, 8, 3, 10, 9, 4, 2, 7, 6}** (a **min**-heap — the smallest at the root):

a) build a heap with consecutive **insert** operations ("slow" construction),
b) perform **delmin** on it,
c) build a heap from the same data with **construct** ("fast" construction, bottom-up).

Give the arrays after each step.
::hint
In a min-heap the condition is reversed: parent ≤ child, and upheap/downheap compare "towards smaller". In construct you start from i = ⌊9/2⌋ = 4 (numbering from 1).
::solution
**a) inserting one by one** (array from position 1):

| inserted | array after upheap |
|---|---|
| 5 | 5 |
| 8 | 5, 8 |
| 3 | 3, 8, 5 |
| 10 | 3, 8, 5, 10 |
| 9 | 3, 8, 5, 10, 9 |
| 4 | 3, 8, 4, 10, 9, 5 |
| 2 | 2, 8, 3, 10, 9, 5, 4 |
| 7 | 2, 7, 3, 8, 9, 5, 4, 10 |
| 6 | 2, 6, 3, 7, 9, 5, 4, 10, 8 |

```tree
2(6(7(10,8),9),3(5,4))
```

**b) delmin:** remove 2, the last element (8) goes to the top, then 8 sinks to the smaller child: 8 ↔ 3, then 8 ↔ 4. Result: **3, 6, 4, 7, 9, 5, 8, 10**.

**c) construct** (downheap for i = 4, 3, 2, 1; start: 5, 8, 3, 10, 9, 4, 2, 7, 6):

| i | element | what happens | array |
|---|---|---|---|
| 4 | 10 | children 7, 6 → swap with 6 | 5, 8, 3, 6, 9, 4, 2, 7, 10 |
| 3 | 3 | children 4, 2 → swap with 2 | 5, 8, 2, 6, 9, 4, 3, 7, 10 |
| 2 | 8 | children 6, 9 → with 6; then children 7, 10 → with 7 | 5, 6, 2, 7, 9, 4, 3, 8, 10 |
| 1 | 5 | children 6, 2 → with 2; then children 4, 3 → with 3 | **2, 6, 3, 7, 9, 4, 5, 8, 10** |

The fast construction made **6** swaps (the slow one — 8 upward moves) and produced a **different** (also correct) heap.
:::

:::task level=2 source="“ASD 10b”, task 2 (modified)" title="HeapSort step by step"
Run **HeapSort** (max-heap, as in the lecture) on the array **{7, 12, 3, 15, 1, 9, 6, 11, 4}**. Give the heap after construct and the array after each deletemax.
::hint
After construct the root holds 15. Each deletemax moves the maximum to the end of the current heap, and the heap shrinks by 1.
::solution
**construct** (i = 4, 3, 2, 1): i = 4 — 15 is already ≥ its children; i = 3 — 3 ↔ 9; i = 2 — 12 ↔ 15; i = 1 — 7 ↔ 15, 7 ↔ 12, 7 ↔ 11.

Heap: **15, 12, 9, 11, 1, 3, 6, 7, 4**

```tree
15(12(11(7,4),1),9(3,6))
```

Consecutive deletemax operations (the bar separates the heap from the sorted part):

| step | array |
|---|---|
| 1 | 12, 11, 9, 7, 1, 3, 6, 4 \| 15 |
| 2 | 11, 7, 9, 4, 1, 3, 6 \| 12, 15 |
| 3 | 9, 7, 6, 4, 1, 3 \| 11, 12, 15 |
| 4 | 7, 4, 6, 3, 1 \| 9, 11, 12, 15 |
| 5 | 6, 4, 1, 3 \| 7, 9, 11, 12, 15 |
| 6 | 4, 3, 1 \| 6, 7, 9, 11, 12, 15 |
| 7 | 3, 1 \| 4, 6, 7, 9, 11, 12, 15 |
| 8 | 1 \| 3, 4, 6, 7, 9, 11, 12, 15 |

Result: **1, 3, 4, 6, 7, 9, 11, 12, 15**.
:::

:::task level=3 source="“ASD 10b”, task 3 (modified)" title="True or false: fast heap construction"
Let the heap H (a **min**-heap) be the result of the **construct** algorithm (fast, bottom-up) on the array

**E = [16, 12, 2, 13, 19, 8, 9, 1, 11, 4, 3]**.

Which statements are true?
1. The number of element swaps performed during construction is exactly 7.
2. The keys of the heap-tree H written in PostOrder form the sequence: 13, 12, 11, 16, 19, 4, 3, 8, 9, 2, 1.
3. The number of internal vertices of the heap-tree H is exactly 6.
::hint
n = 11, so downheap is run for i = 5, 4, 3, 2, 1 (numbering from 1). Count every swap — including those when sinking several levels.
::solution
| i | element | swaps | array after the step |
|---|---|---|---|
| 5 | 19 | 19 ↔ 3 | 16, 12, 2, 13, 3, 8, 9, 1, 11, 4, 19 |
| 4 | 13 | 13 ↔ 1 | 16, 12, 2, 1, 3, 8, 9, 13, 11, 4, 19 |
| 3 | 2 | — | unchanged |
| 2 | 12 | 12 ↔ 1, 12 ↔ 11 | 16, 1, 2, 11, 3, 8, 9, 13, 12, 4, 19 |
| 1 | 16 | 16 ↔ 1, 16 ↔ 3, 16 ↔ 4 | **1, 3, 2, 11, 4, 8, 9, 13, 12, 16, 19** |

```tree
1(3(11(13,12),4(16,19)),2(8,9))
```

1. **True** — swaps: 1 + 1 + 0 + 2 + 3 = **7**.
2. **True** — postorder: 13, 12, 11, 16, 19, 4, 3, 8, 9, 2, 1.
3. **False** — the internal nodes are positions 1…⌊11/2⌋, i.e. **5** (1, 3, 2, 11, 4).
:::

:::task level=1 source="own" title="Navigating a heap in an array"
A complete heap has n = 30 elements stored in an array from index 1. Give: the index of the parent and the children of the element at position 13; which positions are leaves; what the height of the heap is.
::hint
Children of k: 2k, 2k + 1; parent ⌊k/2⌋. Leaves are positions whose children do not exist (2k > n).
::solution
- position 13: parent **6**, children **26** and **27** (both ≤ 30, they exist),
- leaves: positions **16…30** (for k ≥ 16 we have 2k > 30), internal nodes: 1…15,
- height: ⌊log₂ 30⌋ = **4**.
:::

:::task level=2 source="own" title="Why a leftist heap?"
Explain why merging two leftist heaps with n elements in total costs O(log n), while for a binary heap in an array it costs O(n).
::hint
Along which path does the recursion in the Scal (merge) procedure go? How long can that path be?
::solution
Scal goes down only the **right paths** of both trees (at each step one of the trees loses its root and we go into its right subtree). In a leftist tree the right path is the shortest path to an external node, so its length is ≤ log₂(n + 1). The total length of both right paths is O(log n) — that many recursion steps, each doing O(1) work.

With binary heaps in arrays two arrays cannot be "glued" with pointers — the elements must be copied into one array and the heap rebuilt (construct) — **O(n)**.
:::
