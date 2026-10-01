---
id: mock
type: page
title: Practice tests — entry quizzes and tests 2026/2027
short: Practice tests
icon: 🧪
eyebrow: Preparing to pass · all 2026/2027 material
desc: 13 entry quizzes (one per lecture), two variants of a mock practical test and a mock knowledge test — all with step-by-step solutions and answers.
---

:::info How to use this page
The tests were written by the site author based on **the 2026/2027 scope and task types** (rules: [Passing the course](page:course), task types: [Tests 2026/2027](page:exams)). The real tests may look different. All algorithm results were checked with a program that works **exactly like the slide versions**.
:::

:::tip The best way to study
1. Do a test **on paper, without notes**, with a timer.
2. Only then open the **Solution** and compare step by step.
3. Count your points (pass threshold for a test: **10 of 20**). Revise weak topics from the summary (the "Summary" button in each topic).
:::

| Part | What it checks | Points | Threshold |
|---|---|---|---|
| [Entry quizzes](page:mock#entry-quizzes-one-per-lecture) | definitions and simple tasks from the **previous lecture** | 12 × 1 | 5 |
| [Practical test](page:mock#mock-practical-test-variant-a) | how algorithms work on data | 20 | 10 |
| [Knowledge test](page:mock#mock-knowledge-test) | definitions, complexities, code analysis, pseudocode | 20 | 10 |

## Entry quizzes — one per lecture

Each takes about 5 minutes. Answer briefly, then check.

:::task level=1 source=own title="Q1 · Correctness of algorithms"
1. Give the definition of **partial correctness**.
2. How does **total correctness** differ from it?
3. Is the algorithm `sum = 0; i = 0; while(i < len) sum += a[i]; return sum` (no `i++`) partially correct? Is it totally correct?
::solution
1. An algorithm is partially correct if **if it stops** (on correct input), **then** it returns a correct result.
2. Total = partial correctness **+ the stop property** (it stops for every correct input).
:::answer
3. **Partially correct — yes** (it stops only for len = 0 and then returns the correct 0). **Totally — no** (for len > 0 the loop is infinite).
:::
:::

:::task level=1 source=own title="Q2 · Computational complexity"
1. What is a **dominant operation**?
2. Give the definition of $f(n)=O(g(n))$.
3. Order by increasing growth: $n\log n$, $\sqrt n$, $2^n$, $\log n$, $n^2$.
::solution
1. An operation (set of operations) whose count is **proportional to the number of all operations** of the algorithm.
2. $f(n)=O(g(n)) \iff \exists_{c>0}\,\exists_{n_0}\,\forall_{n\ge n_0}\; f(n)\le c\cdot g(n)$.
:::answer
3. $\log n \prec \sqrt n \prec n\log n \prec n^2 \prec 2^n$.
:::
:::

:::task level=1 source=own title="Q3 · Searching"
1. What must the data satisfy for binary search?
2. Give the indices compared with the key and the result: S = 1, 3, 5, 7, 9, 11, 13; key = 11.
3. Give $W(len)$ of sequential and binary search.
::solution
1. The sequence is **sorted non-decreasingly** (and in random-access memory — RAM).
2. l=0, r=6 → m=3 (7 < 11) → l=4; m=5 (11) — found.
:::answer
2. Indices **3, 5**, result **5**. 3. Sequential $W=len$, binary $W=\Theta(\log_2 len)$.
:::
:::

:::task level=1 source=own title="Q4 · Sorting 1"
1. Give the array after **2 passes** of insertion sort on 5, 2, 4, 1.
2. What are $W$ and $A$ of selection sort?
3. What is the space complexity of `merge` (on arrays) and why?
::solution
1. Pass 1: 2, 5, 4, 1. Pass 2: 2, 4, 5, 1.
2. $W=A=\frac{n(n-1)}{2}=\Theta(n^2)$ — the number of comparisons does not depend on the data.
:::answer
1. **2, 4, 5, 1**. 2. $W=A=\Theta(n^2)$. 3. $S(n)=\Theta(n)$ — we allocate a `result` array for the merged sequences.
:::
:::

:::task level=1 source=own title="Q5 · Sorting 2"
1. When is a sorting algorithm **stable**?
2. Run `partition` (pivot = first) on 4, 7, 1, 6, 2: returned index, array, number of swaps.
3. What is the lower bound for comparison sorting?
::solution
1. When it keeps the relative order of elements with **equal** values.
2. swap(1, 4): 4, 2, 1, 6, 7; i stops at 6 (index 3), j goes down to i; a[3] = 6 > 4 → the pivot goes to index 2.
:::answer
2. Index **2**, array **1, 2, 4, 6, 7**, swaps **2**. 3. $\Theta(n\log n)$ (since $\log_2 n! = \Theta(n\log n)$).
:::
:::

:::task level=1 source=own title="Q6 · Recursion"
1. How many moves does hanoi(4) need?
2. Solve $t(n)=t(n/2)+c$, $t(1)=0$.
3. Apply the master theorem to $T(n)=2T(n/2)+\Theta(n)$.
::solution
1. $\text{hanoi}(n)=2^n-1$.
2. $n=2^k$: $t(2^k)=t(2^{k-1})+c=\dots=kc=c\log n$.
3. $a=b=2$: $n^{\log_2 2}=n$, $f(n)=\Theta(n)$ — case 2.
:::answer
1. **15**. 2. $\Theta(\log n)$. 3. $\Theta(n\log n)$ (mergeSort).
:::
:::

:::task level=1 source=own title="Q7 · Lists and abstract data structures"
1. What is an abstract data structure?
2. Give the stack interface and its rule.
3. Why is a deque implemented on a **doubly** linked list?
::solution
1. A structure defined by a **set of operations** (interface), without going into the implementation.
2. `push(e)`, `pop()`, `top()` — **LIFO**.
:::answer
3. Because `popBack` on a singly linked list requires traversing the whole list ($O(n)$); on a doubly linked one all operations are $O(1)$.
:::
:::

:::task level=1 source=own title="Q8 · Priority queue"
1. Give the definition of a binary (min) heap.
2. Give the formulas for the parent and sons index in an array from 1.
3. Insert 5 into the heap [2, 6, 3, 7, 12, 9, 4, 8, 10] (array from index 1).
::solution
1. A **complete** binary tree with the condition: priority in a node ≤ priorities in its descendants.
2. parent $\lfloor i/2\rfloor$, sons $2i$, $2i+1$.
3. 5 at index 10; parent (5) = 12 > 5 → swap; parent (2) = 6 > 5 → swap; parent (1) = 2 — stop.
:::answer
3. **[2, 5, 3, 7, 6, 9, 4, 8, 10, 12]**.
:::
:::

:::task level=1 source=own title="Q9 · Dictionaries, BST, hashing"
1. Give the BST order condition.
2. Insert 8, 3, 12, 6, 15, 5 into an empty BST and give the in-order traversal.
3. What is the load factor α and what is the complexity of hash-table operations?
::solution
1. For every node $x$: keys of the left subtree $\le x \le$ keys of the right one.
2. Tree: 8(3(_, 6(5, _)), 12(_, 15)).
:::answer
2. in-order: **3, 5, 6, 8, 12, 15**. 3. $\alpha=n/m$, operations $O(\alpha)$.
:::
:::

:::task level=1 source=own title="Q10 · Introduction to graphs"
1. Give two equivalent characterisations of a tree with n vertices.
2. What is the memory cost of an adjacency matrix and adjacency lists?
3. When is a digraph strongly connected?
::solution
1. E.g.: connected with $n-1$ edges; acyclic with $n-1$ edges; every two vertices joined by exactly one elementary path.
2. Matrix $\Theta(n^2)$, lists $\Theta(n+m)$.
:::answer
3. When for **every ordered pair** of distinct vertices there is a directed path from the first to the second.
:::
:::

:::task level=1 source=own title="Q11 · BFS and DFS"
Undirected graph: A–B, A–C, B–D, C–D, D–E (neighbours alphabetically).
1. BFS order from A and distances `d`.
2. DFS (recursive) order from A and times `d/f`.
3. Which data structure does BFS use, and which DFS?
::solution
1. A (0); B, C (1); D (2, via B); E (3).
2. A → B → D → C (D's neighbours are B, C, E) → back → E.
:::answer
1. **A, B, C, D, E**; d: A 0, B 1, C 1, D 2, E 3. 2. **A, B, D, C, E**; d/f: A 0/9, B 1/8, D 2/7, C 3/4, E 5/6. 3. BFS — a **queue**, DFS — a **stack** (recursion).
:::
:::

:::task level=1 source=own title="Q12 · Shortest paths"
1. Write the relaxation of edge (u, v).
2. When must Dijkstra's algorithm not be used?
3. Give the complexity of: DAG, Dijkstra (binary heap), Bellman-Ford.
::solution
1. `if u.distance + w(u,v) < v.distance: v.distance = u.distance + w(u,v); v.parent = u`.
2. When the graph has **negative** edge weights.
:::answer
3. DAG $O(n+m)$; Dijkstra $O((n+m)\log n)$; Bellman-Ford $O(nm)$.
:::
:::

:::task level=1 source=own title="Q13 · Minimum spanning trees"
1. What is a spanning tree?
2. State the cut property.
3. Kruskal on the graph A–B (1), B–C (2), A–C (2), C–D (3), B–D (3): edges in order of acceptance (ties alphabetically).
::solution
1. A subgraph of a connected graph that is a tree and contains **all** vertices.
2. The lightest edge of any cut belongs to some MST.
3. A–B (1) ✓; A–C (2) ✓ (before B–C alphabetically); B–C (2) ✗ cycle; B–D (3) ✓ (before C–D); C–D (3) ✗.
:::answer
3. **A–B, A–C, B–D**, weight **6**.
:::
:::

## Mock practical test — variant A

10 tasks × 2 points. Threshold: **10 points**. Neighbours and ties — **alphabetically**.

:::task level=1 source=own title="A1 · Orders of functions"
a) Order increasingly: $3n^2$, $\log_2 n$, $2^n$, $n\log n$, $\sqrt n$, $100n$, $n!$, $n^3$.

b) True or false: $n^2=O(n^3)$; $2^n=O(n^{100})$; $\log_2 n=\Theta(\log_{10} n)$; $n\log n=o(n^2)$; $5n+3=\Omega(n^2)$.
::solution
:::answer
a) $\log_2 n \prec \sqrt n \prec 100n \prec n\log n \prec 3n^2 \prec n^3 \prec 2^n \prec n!$

b) **T, F, T, T, F**.
:::
:::

:::task level=1 source=own title="A2 · Binary search"
S = 4, 9, 15, 21, 28, 33, 40, 47, 52, 66, 71, 80, 94. Give the indices compared with the key and the result for a) key = 47, b) key = 10.
::solution
a) l=0, r=12 → m=6 (40 < 47) → l=7; m=9 (66 > 47) → r=8; m=7 (47) ✓.

b) m=6 (40 > 10) → r=5; m=2 (15 > 10) → r=1; m=0 (4 < 10) → l=1; m=1 (9 < 10) → l=2 > r.
:::answer
a) **6, 9, 7** → **7**. b) **6, 2, 0, 1** → **−1**.
:::
:::

:::task level=1 source=own title="A3 · Selection and insertion sort"
For 34, 12, 45, 3, 27, 8: a) the array after **2 passes** of selection sort, b) the array after **3 passes** of insertion sort and the total number of comparisons of the whole insertion sort.
::solution
a) 3, 12, 45, 34, 27, 8 → 3, 8, 45, 34, 27, 12.

b) 12, 34, 45, 3, 27, 8 → 12, 34, 45, 3, 27, 8 → 3, 12, 34, 45, 27, 8 (comparisons: 1 + 1 + 3 = 5); then 27: 3 comparisons, 8: 5 comparisons.
:::answer
a) **3, 8, 45, 34, 27, 12**. b) **3, 12, 34, 45, 27, 8**; **13** comparisons in total.
:::
:::

:::task level=2 source=own title="A4 · Merge sort"
S = 8, 3, 5, 1, 9, 6, 2, 7, 4. Give the total number of comparisons and the sequences in the last `merge()`.
::hint
m = 9/2 = 4: the left part has 4 elements, the right 5.
::solution
Left (8, 3, 5, 1): (8)+(3): 1, (5)+(1): 1, (3, 8)+(1, 5): 3 → 5 comparisons. Right (9, 6, 2, 7, 4) → (9, 6) | (2, 7, 4): (9)+(6): 1; (2) | (7, 4): (7)+(4): 1, (2)+(4, 7): 1; (6, 9)+(2, 4, 7): 4 → 7 comparisons. Last merge (1, 3, 5, 8)+(2, 4, 6, 7, 9): 8 comparisons.
:::answer
**20** comparisons; last merge: **1, 3, 5, 8 | 2, 4, 6, 7, 9**.
:::
:::

:::task level=2 source=own title="A5 · partition"
S = 7, 3, 10, 1, 9, 5, 12, 2, 8, 6. Give the returned index, the first element after partition and the number of swaps (including the last).
::solution
swap(2, 9): 7, 3, 6, 1, 9, 5, 12, 2, 8, 10; swap(4, 7): 7, 3, 6, 1, 2, 5, 12, 9, 8, 10; i stops at 12 (index 6) → p = 5; pivot to index 5: 5, 3, 6, 1, 2, 7, 12, 9, 8, 10.
:::answer
Index **5**, first element **5**, swaps **3**.
:::
:::

:::task level=1 source=own title="A6 · Count sort"
S = 3, 0, 2, 3, 1, 4, 2, 0, 3, 1, 4, 3. Give `counts` after each of the 3 phases.
::solution
:::answer
counting: **2, 2, 2, 4, 2**; summing: **2, 4, 6, 10, 12**; after output: **0, 2, 4, 6, 10**.
:::
:::

:::task level=1 source=own title="A7 · Radix sort"
Sort 512, 033, 908, 247, 061, 380, 124, 075 (LSD, base 10) — the sequence after each phase.
::solution
:::answer
units: **380, 61, 512, 33, 124, 75, 247, 908**; tens: **908, 512, 124, 33, 247, 61, 75, 380**; hundreds: **33, 61, 75, 124, 247, 380, 512, 908**.
:::
:::

:::task level=2 source=own title="A8 · Min-heap"
S = 9, 4, 12, 7, 1, 8, 3, 10 (array from 1). a) after successive inserts, b) a) + delMin, c) construct.
::solution
a) insert 7 swaps with 9; insert 1 travels from index 5 to the root; insert 8 swaps with 12; insert 3 — with 8.

b) 10 to the root → swap with 3 → swap with 8.

c) i = 4: 7 vs 10 — no change; i = 3: 12 ↔ 3; i = 2: 4 ↔ 1; i = 1: 9 ↔ 1, then 9 ↔ 4 (no further sons).
:::answer
a) **1, 4, 3, 9, 7, 12, 8, 10**; b) **3, 4, 8, 9, 7, 12, 10**; c) **1, 4, 3, 7, 9, 8, 12, 10**.
:::
:::

:::task level=2 source=own title="A9 · BST"
Insert into an empty BST: 40, 20, 60, 10, 30, 50, 70, 25, 35, 65. a) pre/in/post-order traversals, b) the tree after delete(20) — the predecessor and the successor variant.
::solution
```tree
40(20(10,30(25,35)),60(50,70(65,_)))
```
b) predecessor of 20 = 10 (max of the left subtree): 40(10(_, 30(25, 35)), 60(…)); successor of 20 = 25 (min of the right): 40(25(10, 30(_, 35)), 60(…)).
:::answer
pre: **40, 20, 10, 30, 25, 35, 60, 50, 70, 65**; in: **10, 20, 25, 30, 35, 40, 50, 60, 65, 70**; post: **10, 25, 35, 30, 20, 50, 65, 70, 60, 40**.
:::
:::

:::task level=3 source=own title="A10 · Graph: BFS, DFS, Kruskal"
Undirected graph: A–B (4), A–C (2), B–D (3), C–E (4), D–E (2), D–F (6), E–F (3), E–G (7), F–G (4), C–D (8). a) BFS and DFS from A (order, `d` for BFS, `d/f` for DFS); b) Kruskal — edges in order of acceptance and the weight.
```graph
A 40 140
B 160 40
C 160 240
D 300 100
E 300 240
F 440 140
G 520 260
A-B 4
A-C 2
B-D 3
C-E 4
D-E 2
D-F 6
E-F 3
E-G 7
F-G 4
C-D 8
```
::solution
a) BFS: A; B, C; D (from B), E (from C); F (from D), G (from E). DFS: A → B → D → C → E → F → G.

b) Weight 2: A–C, D–E (alphabetically) ✓✓; 3: B–D ✓, E–F ✓; 4: **A–B ✓** (joins {A, C} with the rest), C–E ✗ (cycle), F–G ✓ — 6 edges, done.
:::warn Watch the tie
If C–E were considered before A–B, the MST would have **the same weight but different edges**. That is why the alphabetical rule matters.
:::
:::answer
a) BFS **A, B, C, D, E, F, G**, d: 0, 1, 1, 2, 2, 3, 3. DFS **A, B, D, C, E, F, G**, d/f: A 0/13, B 1/12, D 2/11, C 3/10, E 4/9, F 5/8, G 6/7.

b) **A–C, D–E, B–D, E–F, A–B, F–G**, weight **18**.
:::
:::

## Mock practical test — variant B

:::task level=1 source=own title="B1 · Orders of functions"
a) Order increasingly: $n^2$, $n^{1.5}$, $10\log n$, $n/100$, $2^n$, $1$, $n\log n$, $3^n$.

b) True or false: $n\log n=O(n^{1.5})$; $2^n=\Theta(3^n)$; $n=\omega(\sqrt n)$; $(n+1)^2=\Theta(n^2)$; $\log n=\Omega(\sqrt n)$.
::solution
:::answer
a) $1 \prec 10\log n \prec n/100 \prec n\log n \prec n^{1.5} \prec n^2 \prec 2^n \prec 3^n$

b) **T, F, T, T, F**.
:::
:::

:::task level=1 source=own title="B2 · Binary search"
S = 2, 6, 11, 14, 19, 23, 30, 37, 41, 45, 58, 62. a) key = 41, b) key = 60.
::solution
a) m=5 (23 < 41) → l=6; m=8 (41) ✓. b) m=5 → l=6; m=8 (41 < 60) → l=9; m=10 (58 < 60) → l=11; m=11 (62 > 60) → r=10 < l.
:::answer
a) **5, 8** → **8**. b) **5, 8, 10, 11** → **−1**.
:::
:::

:::task level=1 source=own title="B3 · Selection and insertion sort"
For 19, 7, 25, 2, 14, 10: a) after 2 passes of selection sort, b) after 3 passes of insertion sort + the number of comparisons of the whole insertion sort.
::solution
a) 2, 7, 25, 19, 14, 10 → (7 already in place, swap with itself) 2, 7, 25, 19, 14, 10.

b) 7, 19, 25, 2, 14, 10 → 7, 19, 25, … → 2, 7, 19, 25, 14, 10.
:::answer
a) **2, 7, 25, 19, 14, 10**. b) **2, 7, 19, 25, 14, 10**; **12** comparisons.
:::
:::

:::task level=2 source=own title="B4 · Merge sort"
S = 6, 1, 9, 4, 7, 2, 8, 3 — number of comparisons and the last merge.
::solution
:::answer
**17** comparisons; last merge: **1, 4, 6, 9 | 2, 3, 7, 8**.
:::
:::

:::task level=2 source=own title="B5 · partition"
S = 5, 9, 2, 7, 1, 8, 3, 6, 4 — index, first element, swaps.
::solution
swap(1, 8): 5, 4, 2, 7, 1, 8, 3, 6, 9; swap(3, 6): 5, 4, 2, 3, 1, 8, 7, 6, 9; i stops at 8 (index 5) → p = 4: 1, 4, 2, 3, 5, 8, 7, 6, 9.
:::answer
Index **4**, first element **1**, swaps **3**.
:::
:::

:::task level=1 source=own title="B6 · Count sort"
S = 1, 3, 1, 0, 2, 5, 3, 1, 2, 5, 0 — `counts` after the 3 phases.
::solution
:::answer
**2, 3, 2, 2, 0, 2** → **2, 5, 7, 9, 9, 11** → **0, 2, 5, 7, 9, 9**.
:::
:::

:::task level=1 source=own title="B7 · Radix sort"
Sort 170, 045, 075, 090, 802, 024, 002, 066 — the sequence after each phase.
::solution
:::answer
**170, 90, 802, 2, 24, 45, 75, 66** → **802, 2, 24, 45, 66, 170, 75, 90** → **2, 24, 45, 66, 75, 90, 170, 802**.
:::
:::

:::task level=2 source=own title="B8 · Min-heap"
S = 11, 5, 8, 3, 14, 2, 9, 6, 1: a) insert, b) + delMin, c) construct.
::solution
:::answer
a) **1, 2, 3, 5, 14, 8, 9, 11, 6**; b) **2, 5, 3, 6, 14, 8, 9, 11**; c) **1, 3, 2, 5, 14, 8, 9, 6, 11**.
:::
:::

:::task level=2 source=own title="B9 · BST and AVL"
Insert 55, 30, 80, 20, 45, 70, 90, 40, 50, 85. a) traversals, b) delete(30) in both variants, c) bf of all nodes — is it AVL?
::solution
```tree
55(30(20,45(40,50)),80(70,90(85,_)))
```
b) predecessor of 30 = 20: 55(20(_, 45(40, 50)), 80(…)); successor = 40: 55(40(20, 45(_, 50)), 80(…)).
:::answer
a) pre **55, 30, 20, 45, 40, 50, 80, 70, 90, 85**; in **20, 30, 40, 45, 50, 55, 70, 80, 85, 90**; post **20, 40, 50, 45, 30, 70, 85, 90, 80, 55**. c) bf: 55 → 0, 30 → −1, 80 → −1, 90 → +1, others 0 — **AVL: yes**.
:::
:::

:::task level=3 source=own title="B10 · Graph: BFS, DFS, Kruskal, Prim, Dijkstra"
Graph: A–B (3), A–D (5), B–C (2), B–D (4), B–E (6), C–E (3), D–E (2), D–F (7), E–F (5), C–F (8). a) BFS and DFS from A; b) Kruskal; c) Prim from A; d) Dijkstra from A (`distance`, `parent`).
::solution
:::answer
a) BFS **A, B, D, C, E, F** (d: 0, 1, 1, 2, 2, 2); DFS **A, B, C, E, D, F** (d/f: A 0/11, B 1/10, C 2/9, E 3/8, D 4/7, F 5/6).

b) **B–C, D–E, A–B, C–E, E–F**, weight **15** (B–D, A–D rejected — cycles).

c) Prim: **A–B, B–C, C–E, E–D, E–F** — the same tree.

d) distance: B 3, C 5, D 5, E 7 (via D), F 12 (via D); parent: B ← A, C ← B, D ← A, E ← D, F ← D.
:::
:::

## Mock knowledge test

10 questions × 2 points. Answer in full sentences: definition + justification.

:::task level=1 source=own title="K1 · Correctness"
Give the definitions of total and partial correctness. Give an example of an algorithm that has the stop property but is not partially correct.
::solution
Definitions — as in the [summary of topic 2](topic:t02). Example: `sum(array, len)` returning `sum + 1` — it always stops (loop with `i++`), but the result is wrong.
:::

:::task level=2 source=own title="K2 · Specification and pseudocode"
Write the specification and pseudocode of `count(arr, len, key)` returning the number of occurrences of `key` in the array. Give the dominant operation, data size and complexity.
::solution
- **precondition:** arr — an array of integers, len — a natural number (length), key — an integer,
- **postcondition:** the number of indices $0\le i<len$ with `arr[i] == key` (0 for an empty array).
```pseudo
count(arr, len, key){
  c = 0
  i = 0
  while(i < len){
    if(arr[i] == key) c++
    i++
  }
  return c
}
```
:::answer
Dominant operation: the comparison `arr[i] == key`; size: len; $W(len)=A(len)=len=\Theta(len)$, $S=O(1)$.
:::
:::

:::task level=2 source=own title="K3 · Code analysis"
Give the time and space complexity:
```pseudo
f(n){
  s = 0
  for(i = 0; i < n; i++){
    j = 1
    while(j < n){ s++; j = j * 2 }
  }
  return s
}
```
::solution
Dominant operation: `s++`; data size: $n$. Inner loop: $j = 1, 2, 4, \dots < n$ — about $\lceil\log_2 n\rceil$ turns; outer: $n$ times.
:::answer
$W(n)=A(n)=\Theta(n\log n)$, $S(n)=O(1)$.
:::
:::

:::task level=2 source=own title="K4 · Invariant"
For the algorithm summing an array (`sum = 0; i = 0; while(i < len){ sum += a[i]; i++ }`) give an invariant and prove total correctness.
::solution
**Stop:** $i$ grows by 1, $len$ constant and finite. **Invariant:** $\text{sum}=\sum_{j=0}^{i-1} a[j] \wedge i\le len$. Before the loop: $i=0$, empty sum $=0$ ✓. Step: after an iteration $\text{sum}'=\sum_{j=0}^{i-1}a[j]+a[i]=\sum_{j=0}^{i}a[j]$, $i'=i+1$ ✓. End: $i=len$ ⇒ $\text{sum}=\sum_{j=0}^{len-1}a[j]$ ✓.
:::

:::task level=2 source=own title="K5 · Asymptotic notation"
Give the definitions of $O$ and $\Theta$. Prove from the definition that $3n+5=\Theta(n)$.
::solution
$3n+5\le 8n$ for $n\ge1$ ⇒ $O(n)$ ($c=8$, $n_0=1$); $n\le 3n+5$ for $n\ge 1$ ⇒ $n=O(3n+5)$ ($c=1$). Both directions ⇒ $\Theta(n)$.
:::

:::task level=2 source=own title="K6 · Comparing sorts"
Compare insertion sort, merge sort and quick sort: W, A, memory, stability. When is insertion sort the best?
::solution
| | W | A | memory | stable |
|---|---|---|---|---|
| insertion | $\Theta(n^2)$ | $\Theta(n^2)$ | $O(1)$ | yes |
| merge | $\Theta(n\log n)$ | $\Theta(n\log n)$ | $\Theta(n)$ | yes (depends on `<`/`<=` in merge) |
| quick | $\Theta(n^2)$ | $\Theta(n\log n)$ | in place | no |

Insertion — for **nearly sorted** data (sorted: $n-1$ comparisons) and small $n$.
:::

:::task level=2 source=own title="K7 · Stack and queue"
How do you implement a queue on an array and on a list so that all operations are $O(1)$? Why is a plain array not enough?
::solution
A singly linked list with head and tail pointers (inject at the end, out from the front) or a **cyclic array** (front and end indices, arithmetic mod $n$). In a plain array removing from the front requires shifting the elements — $O(n)$.
:::

:::task level=2 source=own title="K8 · Hash tables"
Describe the required properties of a hash function, collision resolution methods and the complexity. Why is a hash table not a good implementation of an ordered dictionary?
::solution
Fast (constant time) and uniform; repeated hashing or chaining; operations $O(\alpha)$, $\alpha=n/m$. Minimum, maximum, successor, predecessor need scanning the whole table — linear (the hash function destroys the key order).
:::

:::task level=2 source=own title="K9 · BST and AVL"
Compare W and A of operations on a BST and an AVL tree. What is bf and what condition does AVL satisfy? Why does it give $O(\log n)$?
::solution
BST: $A=O(\log n)$, $W=O(n)$ (one branch). AVL: $bf(x)=h(L)-h(R)\in\{-1,0,1\}$ for every node ⇒ height $O(\log n)$ ⇒ all operations $W=O(\log n)$ (fixed by $O(1)$ rotations).
:::

:::task level=2 source=own title="K10 · Choosing a graph algorithm"
Which shortest-path algorithm do you choose and with what complexity: a) a directed acyclic graph with negative weights, b) a road network (weights ≥ 0), c) a graph with negative weights and cycles? What is Kruskal for and what is its complexity?
::solution
:::answer
a) **DAG** (topological sort + relaxation) $O(n+m)$ — negative weights are fine. b) **Dijkstra** $O((n+m)\log n)$. c) **Bellman-Ford** $O(nm)$ (+ negative-cycle detection). Kruskal — minimum spanning tree, $O(m\log m)$.
:::
:::
