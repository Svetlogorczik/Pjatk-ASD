---
id: t11
num: 11
type: topic
title: AVL trees and hash tables
short: AVL and hashing
desc: How to keep a BST balanced — the balance factor and AVL rotations; the minimum and maximum number of nodes; a dictionary in a hash table — hash function, chaining, open addressing.
sources: Wyklady 2009/asd 10 wyklad_8.pdf (dictionary: hash table, BST, AVL); Asd9.pdf (intro: AVL trees)
exercises: asd 09.pdf (tasks 1–3)
---

:::exam 2026/2027 tests
This topic was written from the 2025/2026 lectures. **The 2026/2027 tests use the versions from M. Sydow's slides** — you will find them in the section ["2026/2027 lecture version"](topic:t11#2026-2027-lecture-version-m-sydow-dictionaries-hash-tables-a) at the end of the topic (code copied from the slides). Qualifying tasks and practice tasks: [Tests 2026/2027](page:exams).
:::

## Why balance trees?

From topic 10 we know that BST operations cost O(h), and h can be as large as n − 1 (e.g. when inserting sorted data). Lecture asd9 announces the solution: **AVL trees**, which guarantee search, insert and delete in **O(log n)** time always.

## AVL tree

:::def
An **AVL tree** (Adelson-Velsky and Landis, 1962) is a BST in which for **every** node the heights of the left and right subtrees differ **by at most 1**.

The **balance factor** of a node v:
**BF(v) = h(left subtree) − h(right subtree)**, and in an AVL tree **BF(v) ∈ {−1, 0, +1}**.
(The height of an empty subtree = −1.)
:::

:::analogy
Picture a mobile hanging over a baby's cot: every arm must be reasonably balanced. If one side becomes two "levels" heavier, you have to re-hang the pieces — that is a **rotation**.
:::

An example AVL tree with balance factors written in (the small red number):

```tree
20[0](10[1](5[0],_),30[-1](_,40[0]))
```

### How many nodes does an AVL tree of height h have?

- **at most:** a full binary tree — **2ʰ⁺¹ − 1** nodes,
- **at least:** denote it by N(h). The sparsest AVL tree of height h has a root, one subtree of height h − 1 and the other of height h − 2 (both also sparsest):

**N(0) = 1, N(1) = 2, N(h) = N(h − 1) + N(h − 2) + 1.**

In turn: 1, 2, 4, 7, 12, 20, 33, … These are Fibonacci numbers minus 1: **N(h) = Fₕ₊₃ − 1**. Since Fibonacci grows exponentially (φʰ), the height of an AVL tree with n nodes is **logarithmic**: h < 1.44·log₂(n + 2), i.e. **h = O(log n)**.

:::tip
Fibonacci numbers again — just like in the worst case of Euclid's algorithm (topic 1)! A nice example of the same mathematics appearing in very different places.
:::

## Inserting into an AVL tree

1. Insert the key as into an ordinary BST (a new leaf).
2. Go back up the path from the new leaf to the root, **recomputing BF**.
3. Fix the first node with |BF| = 2 with a **rotation**. After one rotation (single or double) on insertion, the whole tree is AVL again.

There are four cases (the name says where the "excess" is: in the **L**eft subtree of the **L**eft child, etc.):

| Case | BF of the node | BF of the child on the heavier side | Fix |
|---|---|---|---|
| **LL** | +2 | +1 (or 0) | single **right** rotation |
| **RR** | −2 | −1 (or 0) | single **left** rotation |
| **LR** | +2 | −1 | double: left on the child, then right |
| **RL** | −2 | +1 | double: right on the child, then left |

### Single rotation (the LL case)

Node y has a too-high left subtree, and the "excess" is on the left side of its left child x. We rotate: x goes up, y goes down to the right, and the middle subtree B moves from x to y (the BST order A < x < B < y < C is preserved).

```tree caption="before: the LL case at node y"
y(x(A,B),C)
```

```tree caption="after the right rotation"
x(A,y(B,C))
```

### Double rotation (the LR case)

The excess is on the **right** side of the left child x (in its right child y). One rotation is not enough — we do two: first left around x, then right around z. Effect: y moves to the top.

```tree caption="before: the LR case at node z"
z(x(A,y(B,C)),D)
```

```tree caption="after the double rotation"
y(x(A,B),z(C,D))
```

:::exam
A typical class task: "insert the elements one by one into an empty AVL tree, recompute BF and perform rotations". Do it **one element at a time**: insert → recompute BF on the way up → if ±2 somewhere, name the case (LL/RR/LR/RL) and draw the tree after the rotation.
:::

## Deleting from an AVL tree

1. Delete as in a BST (leaf / one child / successor).
2. Go back up, recomputing BF; wherever |BF| = 2 — a rotation.

Differences from insertion:
- deletion may require **several rotations** (even on every level — O(log n)),
- a case appears where the child on the heavier side has **BF = 0** — then a **single** rotation suffices.

```java title="AVL.java (implementation by the site author, following the lecture's description)"
@include t11-avl.java
```

## A dictionary in a hash table

Trees give O(log n). Can we do better? Yes — **O(1) on average** — if we don't need order (e.g. min, max, successor), only search/insert/delete. The idea from the 2009 slides: keep the elements in an array T[0..m−1], and a **hash function** decides the position.

:::def
- A **hash function** h: key → {0, 1, …, m−1}, e.g. **h(k) = k mod m**.
- A **collision** — two different keys have the same value of h.
- The **load factor** α = n/m (n — number of elements, m — table size).
:::

:::analogy
A theatre cloakroom: the ticket number points you straight to the hook — you don't search through all the coats. The hash function "hands out the tickets". Trouble starts when two people get the same number — a collision.
:::

:::tip
It is best to choose the table size m as a **prime** not close to a power of two — then k mod m spreads keys better (a tip from the site author).
:::

### Chaining

Each cell T[i] holds a **list** of the elements with h(k) = i. Insert — append to the list, search/delete — scan one list.

- average cost: **O(1 + α)**; for α = O(1) — constant,
- worst case: all keys in one list — O(n).

### Open addressing

All elements live in the table itself. On a collision we check further cells according to a fixed rule (the **probe sequence**):

- **linear:** h(k, i) = (h(k) + i) mod m — consecutive cells; simple, but "clusters" form,
- **quadratic:** h(k, i) = (h(k) + c₁i + c₂i²) mod m,
- **double hashing:** h(k, i) = (h₁(k) + i·h₂(k)) mod m — spreads keys best.

:::warn
In open addressing you **must not** simply clear a cell on deletion — that would break the probe sequence and other keys would become "invisible". A deleted cell is marked with a special **"deleted"** marker (search goes past it, insert may reuse it).
:::

```java title="HashTables.java"
@include t11-hash.java
```

### Comparing dictionary implementations {own}

:::own
A summary prepared by the site author.
:::

| Structure | search | insert | delete | order (min, max, successor) |
|---|---|---|---|---|
| list | O(n) | O(n) | O(n) | no |
| sorted array | O(log n) | O(n) | O(n) | yes |
| BST | O(h): O(log n) average, O(n) worst | O(h) | O(h) | yes |
| **AVL** | **O(log n)** | **O(log n)** | **O(log n)** | yes |
| hash table | **O(1) average**, O(n) worst | O(1) average | O(1) average | **no** |


## 2026/2027 lecture version (M. Sydow) — "Dictionaries" (hash tables, AVL)

:::exam
In the knowledge test: hash tables (hash function, collisions, load factor α, complexity O(α)) and the **definition and idea of an AVL tree** — a typical task: **compute bf for all nodes and decide whether it is AVL**. Rotations are **not** covered. Practice task: [Tests 2026/2027](page:exams).
:::

**Direct addressing.** If keys are natural numbers from [0, …, m−1], the dictionary is an array indexed by the key — all operations **O(1)**. Two problems: memory proportional to the largest possible key value (m), not the number of stored keys; it works only for natural keys.

:::def Hash table
Extends direct addressing with a **hash function** hash : U → [0, …, m−1] (U — the universe of keys) that turns a key into an index. Memory is proportional to m (not |U|), and the key type can be anything.
:::

**Collisions.** Usually m < |U|, so the function is not injective: for some k1 ≠ k2 hash(k1) == hash(k2) — a **collision**. Methods: **repeated hashing** (if the slot is taken, hash again in a reproducible way until a free slot; drawback: at most m elements) and **chaining** (each slot holds a list of elements, searched linearly).

**Required properties of a hash function:** (1) computable very fast (in constant time); (2) **uniform load** — for a key drawn uniformly from U each value in [0, …, m−1] is equally likely. **Load factor α = n/m** (n — number of pairs in the table). Thanks to (2) the worst-case complexity of operations is close to **O(α)** (lists have length close to α). The simplest function for integers: **hash(key) = key mod m** (fast — for m a power of 2 just take the last log₂(m) bits; uniform). Sometimes it must also be hard to invert (e.g. MD5) — modulo does not satisfy that.

**Summary:** hash tables give dictionary operations in **O(α)** and let you balance time and memory with m (larger m — faster, but more memory). They do **not** efficiently support ordered-dictionary operations (minimum, maximum, successor, predecessor — linear).

:::def AVL tree
(Adelson-Velsky, Landis) — a BST with an extra condition. The **balance factor** of node x: **bf(x) = height of the left subtree of x − height of the right subtree of x**. An AVL tree is a BST in which every node has **bf(x) ∈ {−1, 0, 1}**.
:::

One can prove that the worst-case height of an AVL tree is **O(log n)**, so all ordered-dictionary operations have **logarithmic worst-case complexity**. Example from the slides: in the tree 8(3(_, 6(5, _)), 12(_, 15(13, 20))) bf(8) = 0, bf(3) = −2, bf(12) = −2, bf(6) = +1, the rest 0 — **not AVL**. **Implementation:** after each modifying operation (as in a BST) we check bf going **up** from the modified node (only there could bf change, by at most 1); with bf = 2 or −2 the fragment is fixed by a **rotation** costing O(1). Hence W(n) = O(log n) for all operations. Other structures exist too (self-organising trees, B-trees, AB-trees, B+…).

### Sample questions from the slides

Hash tables; properties of a hash function; analysis of dictionary operations on a hash table; collision resolution methods; definition, motivation and idea of an AVL tree; **for a given binary tree compute bf of all nodes and say whether it is AVL**; how AVL balance is maintained and what it gives.

=== summary ===

## 2026/2027 version (M. Sydow)

- Hash: U → [0..m−1]; collisions: repeated hashing / chaining; α = n/m; operations O(α); hash = key mod m.
- AVL: bf(x) = h(left) − h(right) ∈ {−1, 0, 1}; height O(log n), W = O(log n); fixed by O(1) rotations.


## AVL

- a BST where for every node **|h(L) − h(R)| ≤ 1**; **BF = h(L) − h(R) ∈ {−1, 0, 1}**.
- max nodes at height h: **2ʰ⁺¹ − 1**; min: **N(h) = N(h−1) + N(h−2) + 1**, N(0) = 1, N(1) = 2 (1, 2, 4, 7, 12, 20, 33) = Fₕ₊₃ − 1 ⇒ **h = O(log n)** (< 1.44 log₂ n).
- insert: BST insert + recompute BF upwards + **one** (single or double) rotation.
- cases: **LL** → right rotation; **RR** → left; **LR** → left on the child + right; **RL** → right on the child + left.
- delete: BST delete + rotations upwards (possibly many); a child with BF = 0 → single rotation.

## Hashing

- h(k) = k mod m; collisions; α = n/m.
- **chaining:** a list in every cell; O(1 + α) on average.
- **open addressing:** linear (h(k)+i), quadratic, double; deletion = a "deleted" marker.
- O(1) on average, but no order (min, max, successor — expensive).

=== tasks ===

:::task level=3 source="Exercise 9, task 1 (modified)" title="Inserting into an AVL tree"
Insert the elements of the sequence one by one into an initially empty AVL tree. After each insertion recompute the balance factors and perform the necessary rotations:

**30, 20, 10, 25, 28, 5, 3, 40, 35, 38**
::hint
Rotations will be needed when inserting 10, 28, 3, 35 and 38. For 28 and 35 they are **double** rotations.
::solution
| inserted | problem | rotation | tree after the operation |
|---|---|---|---|
| 30 | — | — | 30 |
| 20 | — | — | 30(20, _) |
| 10 | BF(30) = +2, BF(20) = +1 | **LL** → right around 30 | 20(10, 30) |
| 25 | — | — | 20(10, 30(25, _)) |
| 28 | BF(30) = +2, BF(25) = −1 | **LR** → left around 25, right around 30 | 20(10, 28(25, 30)) |
| 5 | — | — | 20(10(5, _), 28(25, 30)) |
| 3 | BF(10) = +2, BF(5) = +1 | **LL** → right around 10 | 20(5(3, 10), 28(25, 30)) |
| 40 | — | — | 20(5(3, 10), 28(25, 30(_, 40))) |
| 35 | BF(30) = −2, BF(40) = +1 | **RL** → right around 40, left around 30 | 20(5(3, 10), 28(25, 35(30, 40))) |
| 38 | BF(28) = −2, BF(35) = −1 | **RR** → left around 28 | 20(5(3, 10), 35(28(25, 30), 40(38, _))) |

The final tree with BF:

```tree
20[-1](5[0](3[0],10[0]),35[0](28[0](25[0],30[0]),40[1](38[0],_)))
```
:::

:::task level=3 source="Exercise 9, task 2 (modified)" title="Deleting from an AVL tree"
From the tree obtained in the previous task delete first the node **5**, then the node **3**. Recompute BF and perform the necessary rotations (use the successor for two children).
::hint
5 has two children — its successor is 10. After deleting 3 the root's left subtree will "shrink" a lot.
::solution
**delete(5):** 5 has children 3 and 10 → the successor 10 takes the place of 5 → subtree 10(3, _), BF(10) = +1, BF(20) = h(L) − h(R) = 1 − 2 = −1 — **no rotation**:

```tree
20[-1](10[1](3,_),35[0](28(25,30),40[1](38,_)))
```

**delete(3):** 10 becomes a leaf (height 0), while the root's right subtree has height 2 → **BF(20) = −2**. The right child 35 has BF = 0 → a **single left rotation** around 20 suffices (a case that happens only on deletion):

```tree
35[1](20[-1](10,28(25,30)),40[1](38,_))
```

The tree is AVL again (BF(35) = 2 − 1 = +1, BF(20) = 0 − 1 = −1).
:::

:::task level=2 source="Exercise 9, task 3 (modified)" title="How many nodes can an AVL tree have?"
a) What is the **largest** number of nodes in an AVL tree of height h? Give the value for h = 4.
b) What is the **smallest** number of nodes in an AVL tree of height h? Give the recurrence and the value for h = 4. Draw such a sparsest tree for h = 3.
::hint
The sparsest tree of height h: root + the sparsest tree of height h − 1 + the sparsest tree of height h − 2.
::solution
a) A full tree: **2ʰ⁺¹ − 1**; for h = 4: **31**.

b) **N(0) = 1, N(1) = 2, N(h) = N(h−1) + N(h−2) + 1**: 1, 2, 4, 7, **12** — for h = 4 at least **12** nodes (in general N(h) = Fₕ₊₃ − 1).

A sparsest AVL tree for h = 3 (7 nodes), an example shape:

```tree
d(b(a(x,_),c),e(_,f))
```

The left subtree has height 2 (4 nodes), the right one — height 1 (2 nodes): 1 + 4 + 2 = 7 ✓. (Letters instead of keys — only the shape matters; keys can be filled in so that it is a BST.)
:::

:::task level=2 source="own" title="A hash table"
Insert the keys **18, 41, 22, 44, 59, 32, 31, 73** (in this order) into a table of size **m = 13** with h(k) = k mod 13:

a) using chaining,
b) using linear open addressing.

How many probes (visited cells / list elements) does searching for a key that is in the table take on average in each version?
::hint
First compute h(k) for all keys: 18 → 5, 41 → 2, 22 → 9, 44 → 5, 59 → 7, 32 → 6, 31 → 5, 73 → 8.
::solution
**a) Chaining:**

| cell | list |
|---|---|
| 2 | 41 |
| 5 | 18 → 44 → 31 |
| 6 | 32 |
| 7 | 59 |
| 8 | 73 |
| 9 | 22 |

Searching: 18, 41, 22, 59, 32, 73 — 1 probe each, 44 — 2, 31 — 3. Average: 11/8 ≈ **1.375**.

**b) Linear addressing:**

| key | h(k) | collisions | lands in |
|---|---|---|---|
| 18 | 5 | 0 | 5 |
| 41 | 2 | 0 | 2 |
| 22 | 9 | 0 | 9 |
| 44 | 5 | 1 (5) | 6 |
| 59 | 7 | 0 | 7 |
| 32 | 6 | 2 (6, 7) | 8 |
| 31 | 5 | 5 (5, 6, 7, 8, 9) | 10 |
| 73 | 8 | 3 (8, 9, 10) | 11 |

Table: 2: 41, 5: 18, 6: 44, 7: 59, 8: 32, 9: 22, 10: 31, 11: 73 (the rest empty).

Probes when searching: 1 + 1 + 1 + 2 + 1 + 3 + 6 + 4 = 19, on average **19/8 ≈ 2.375**. You can see the "clustering" of keys (cluster 5–11) in linear addressing.
:::

:::task level=1 source="own" title="Name the case"
In an AVL tree, after inserting a new key, the first unbalanced node v has BF(v) = −2, and its right child has BF = +1. Which case is it and which rotations are needed? And if the right child had BF = −1?
::hint
Minus means "too high on the right". The sign of the child's BF tells on which side of the child the excess is.
::solution
- BF(v) = −2, BF(right child) = +1 → case **RL**: first a **right** rotation around the right child, then a **left** rotation around v.
- BF(right child) = −1 → case **RR**: one **left** rotation around v.
:::
