---
id: t14
num: 14
type: topic
title: Greedy programming — Huffman, knapsack, Dijkstra, Prim, Kruskal
short: Greedy algorithms
desc: When the locally best choice gives the global optimum and when it does not. Activity selection, Huffman codes, the knapsack problem, shortest paths (Dijkstra) and minimum spanning trees (Prim, Kruskal).
sources: ProgramowanieZachlanne.pdf; wyklad_11.pdf (Greedy method I); wyklad_10.pdf (Find-Union)
exercises: asd 12.pdf (tasks 1–3)
---

:::exam 2026/2027 practical test
The algorithms in this topic are within the scope of the **2026/2027 practical test**. **The versions from M. Sydow's slides** apply — they may differ in details from the 2025/2026 versions described here. Versions that reproduce the official sample answers, plus practice tasks: [Tests 2026/2027](page:exams).
:::

## Optimisation problems and the greedy strategy

In an **optimisation problem** we look, among many possible solutions, for the **best** one with respect to some property. Usually a solution is built as a **sequence of decisions** made one after another.

:::def
- An **evaluation function** f : W → ℝ assigns a number to every result; result a is better than b when f(a) > f(b). The problem is solved when the algorithm returns opt ∈ W with f(opt) = sup{ f(a) : a ∈ W }.
- **Greedy strategy** (*strategia zachłanna*): at every step choose what improves the evaluation function the most **right now**, and never undo that choice.
- A greedy algorithm is **correct** when such a sequence of locally best choices always leads to a **globally** best solution.
:::

### When does the greedy strategy fail? "Usually!"

Lecture: a mountain hike aiming to get as high as possible — always walking "uphill", you can easily get stuck on a low peak from which every step goes down (a **local maximum**).

**Crossing the bridge** (lecture): at night 4 people must cross a damaged bridge; at most 2 may go at once, they have one torch which must be carried back. Times: grandfather 10 min, father 5, mother 2, son 1 (a pair walks at the slower one's pace).

| | Greedy: the fastest always escorts | Better |
|---|---|---|
| 1 | son + grandfather → 10 | son + mother → 2 |
| 2 | son returns → 1 | son returns → 1 |
| 3 | son + father → 5 | father + grandfather → 10 |
| 4 | son returns → 1 | mother returns → 2 |
| 5 | son + mother → 2 | son + mother → 2 |
| total | **19 min** | **17 min** |

The "proof" that the greedy version is optimal ("minimise returns by always sending back the fastest") was wrong — the two slowest should cross **together**.

:::warn
A greedy algorithm must always be **proved**. It works only in lucky cases or in known, verified problems — those are the rest of this topic.
:::

## The activity selection problem

An organiser offers many lectures in different rooms on one day. We want to attend each from beginning to end and go to **as many** as possible.

:::def
Given n intervals [pᵢ, kᵢ) (start, end), choose the **largest** subset of pairwise **disjoint** intervals.
:::

**The greedy solution (lecture):**
1. sort the activities by **finishing time**,
2. choose the activity that **ends earliest**,
3. discard the activities that collide with it,
4. repeat until nothing is left to choose.

Intuition: the activity ending earliest leaves **the most time** for the rest of the day. (Other "greedy" rules such as "shortest activity" or "starts earliest" are **not** correct.) Complexity: O(n log n) for sorting + O(n).

## Optimal coding — Huffman's algorithm

We want to encode the characters of an alphabet with bits so that the **expected code length** is as small as possible. If character aₖ has probability p(k) and a code of length d(k), the expected length is **Σ p(k)·d(k)**.

- **Morse code** is "poor": frequent letters (e.g. H, L) have long codes and rare ones (G, K, M) short ones. Moreover, Morse is **not a binary code** — it needs a third sign: a pause (end of word). Without it `-..-` could mean X, TEET, NA, DT, TU…

:::def
**The Fano condition (prefix code):** no code word may be a **prefix** of another code word. Then a bit string can be decoded uniquely without separators.

In terms of trees: codes are paths from the root (left = 0, right = 1), and code words end **only at leaves**.
:::

**Huffman's algorithm:**
1. create a forest — each symbol is a one-node tree with its frequency,
2. while the forest has more than one tree: take out the **two rarest**, hang them under a new node whose frequency is their **sum**, and put it back.

Lecture example: A 1/8, B 1/8, C 1/8, D 1/4, E 3/8.

```tree caption="Huffman tree (left = 0, right = 1)"
1(3/8(1/4(A,B),C),5/8(D,E))
```

Codes: **A 000, B 001, C 01, D 10, E 11**. Average length: 3·(1/8) + 3·(1/8) + 2·(1/8) + 2·(1/4) + 2·(3/8) = **2.25 bits** (instead of 3 bits of a fixed-length code for 5 symbols).

**Implementation and cost:**
- a priority queue in a **heap**: building < 4n, each loop iteration is two extractions and one insertion — in total about **5n(log n + 4/5)** comparisons, i.e. O(n log n),
- if the frequencies are **already sorted** — a **stack and a queue** suffice: symbols on the stack (rarest on top), sums go to the end of the queue — they grow, so the queue stays sorted; the two smallest elements are always among ≤ 4 candidates (two on top of the stack and two at the front of the queue) → **O(n)**.

**Correctness** (sketch from the lecture, three lemmas):
1. in an optimal code tree every internal node has **two** children (otherwise codes could be shortened),
2. there is an optimal tree in which the two **rarest** symbols are **siblings** (on the lowest level),
3. if a pair of siblings a₁, a₂ is replaced with one symbol of frequency p(a₁) + p(a₂) and the tree is optimal for that alphabet, then after "expanding" the leaf back into a₁, a₂ the tree is optimal for the original alphabet.

## The knapsack problem

From the 2009 slides: a knapsack has capacity W, items have weights wᵢ and values vᵢ. We want to carry the most valuable load.

- **Continuous version** (items can be split — e.g. bulk goods): greedily take items by **decreasing ratio vᵢ/wᵢ** (value per kilogram), and of the last one only as much as fits. This is **optimal**.
- **Discrete 0/1 version** (an item is taken whole or not at all): the same strategy **may fail** (see task 4). This problem is solved by other methods (e.g. dynamic programming).

## Shortest paths — Dijkstra's algorithm

:::def
Given a graph G = (V, E) with **non-negative** edge weights c(e) ≥ 0 and a start vertex s. A **shortest-path tree** rooted at s is a spanning tree in which the path from s to every v is a shortest path from s to v in G.
:::

**Dijkstra's algorithm** (lecture): for every vertex we keep
- **d[v]** — the length of the shortest path from s to v known so far (initially ∞, d[s] = 0),
- **p[v]** — the predecessor of v on that path.

Repeat until all vertices are "final":
1. choose the **non-final** vertex u with the **smallest** d[u] and declare it final (the greedy choice!),
2. for every (non-final) neighbour w: if d[u] + c(u, w) < d[w], then d[w] := d[u] + c(u, w), p[w] := u (**relaxation**).

:::warn
Dijkstra requires **non-negative** weights. With a negative edge a "final" vertex might later get a shorter path — the greedy decision would be wrong.
:::

Complexity: with an array O(n²); with a priority queue (heap) **O((n + m) log n)**.

## Minimum spanning tree (MST)

:::def
A **spanning tree** of a connected graph G is a subgraph that is a tree and contains **all** vertices (it has n − 1 edges). A **minimum spanning tree** is one whose total edge weight is the smallest.
:::

:::analogy
We connect n buildings with cable; the cost of cable between each pair is known. We want all of them connected (directly or indirectly) as cheaply as possible — that is an MST.
:::

**Prim's algorithm:** start from one vertex; at each step add to the tree the **cheapest edge** joining a tree vertex with a vertex outside the tree. Complexity: O(n²) with an array, **O(m log n)** with a heap.

**Kruskal's algorithm:** sort the edges by increasing weight and scan them in order; add an edge if it **does not create a cycle** with the ones already chosen (it joins two different trees of the forest). To check "in the same tree?" we use the **Find-Union** structure (topic 13). Complexity: **O(m log m)** (mainly sorting).

### Why does it work? {own}

:::own
A short justification from the site author (not on the slides).
:::

**The cut property:** split the vertices into two groups. The lightest edge joining the groups belongs to some MST. Prim always takes the lightest edge between "the tree" and "the rest", and Kruskal — the lightest edge between two different trees of the forest; so both decisions are safe.

```java title="WeightedGraphs.java — Dijkstra, Prim, Kruskal"
@include t14-graphs.java
```

```java title="Greedy.java — activity selection, continuous knapsack, Huffman"
@include t14-greedy.java
```

=== summary ===

## Greediness

- the locally best choice at every step, no undoing; correctness **must be proved**.
- counterexample: the bridge (10, 5, 2, 1) — greedy 19 min, optimum 17.

## Correct greedy algorithms

| Problem | Choice rule | Cost |
|---|---|---|
| activity selection | earliest **end** | O(n log n) |
| continuous knapsack | largest **v/w** | O(n log n) |
| Huffman | merge **the two rarest** | O(n log n); sorted — stack+queue O(n) |
| Dijkstra (weights ≥ 0) | non-final with the smallest **d** | O(n²) or O((n+m) log n) |
| Prim | cheapest edge **from the tree outward** | O(m log n) |
| Kruskal | cheapest edge **without a cycle** (Find-Union) | O(m log m) |

- **Fano:** no code word is a prefix of another; codes = leaves of a tree.
- **0/1** knapsack — greediness fails.
- Dijkstra: d[v], p[v], relaxation d[w] := min(d[w], d[u] + c(u,w)).

=== tasks ===

:::task level=2 source="Exercise 12, task 1 (modified)" title="Dijkstra's algorithm"
For the graph below show how **Dijkstra's** algorithm works from the start vertex **G**. Give the d and p arrays and the queue contents (non-final vertices with finite d) after each step. On equal d choose the alphabetically earlier vertex.

```graph
A 70 50
B 250 50
C 70 200
D 270 150
E 190 260
F 390 260
G 110 380
H 330 380
A-B 4
A-C 2
B-C 5
B-D 3
C-E 6
D-E 1
D-F 6
E-F 2
E-G 7
F-H 3
G-H 2
C-G 9
B-F 8
```
::hint
Start: d[G] = 0, the rest ∞. The first step updates G's neighbours: C (9), E (7), H (2).
::solution
Notation d/p; asterisk = final vertex.

| step | take | A | B | C | D | E | F | H | queue after the step |
|---|---|---|---|---|---|---|---|---|---|
| 1 | G (0) | ∞ | ∞ | 9/G | ∞ | 7/G | ∞ | 2/G | H2, E7, C9 |
| 2 | H (2) | ∞ | ∞ | 9/G | ∞ | 7/G | 5/H | 2* | F5, E7, C9 |
| 3 | F (5) | ∞ | 13/F | 9/G | 11/F | 7/G | 5* | | E7, C9, D11, B13 |
| 4 | E (7) | ∞ | 13/F | 9/G | **8/E** | 7* | | | D8, C9, B13 |
| 5 | D (8) | ∞ | **11/D** | 9/G | 8* | | | | C9, B11 |
| 6 | C (9) | 11/C | 11/D | 9* | | | | | A11, B11 |
| 7 | A (11) | 11* | 11/D | | | | | | B11 |
| 8 | B (11) | | 11* | | | | | | — |

Result: d = A 11, B 11, C 9, D 8, E 7, F 5, G 0, H 2.
Shortest-path tree (from p): G–H, H–F, G–E, E–D, D–B, G–C, C–A. E.g. the shortest path to B: G → E → D → B (7 + 1 + 3 = 11).
:::

:::task level=2 source="Exercise 12, task 2 (modified)" title="Prim's algorithm"
For the same graph show how **Prim's** algorithm works starting from vertex **E**. Give the order in which vertices are added, the MST edges and its total weight. (On equal weights choose the alphabetically earlier vertex.)
::hint
From E the cheapest edge is E–D (1).
::solution
| step | edge added | vertex | weight |
|---|---|---|---|
| 1 | E–D | D | 1 |
| 2 | E–F | F | 2 |
| 3 | D–B | B | 3 (tie with F–H = 3 → B alphabetically) |
| 4 | F–H | H | 3 |
| 5 | H–G | G | 2 |
| 6 | B–A | A | 4 |
| 7 | A–C | C | 2 |

Order: **E, D, F, B, H, G, A, C**; MST weight = 1 + 2 + 3 + 3 + 2 + 4 + 2 = **17**.
:::

:::task level=2 source="Exercise 12, task 3 (modified)" title="Kruskal's algorithm"
For the same graph show how **Kruskal's** algorithm works: the edges considered in turn, the decision (take / cycle) and the state of the forest.
::hint
Sort the edges: D–E 1, A–C 2, E–F 2, G–H 2, B–D 3, F–H 3, A–B 4, B–C 5, …
::solution
| edge | decision | forest (trees) |
|---|---|---|
| D–E 1 | take | {D,E}, the rest single |
| A–C 2 | take | {A,C}, {D,E} |
| E–F 2 | take | {A,C}, {D,E,F} |
| G–H 2 | take | {A,C}, {D,E,F}, {G,H} |
| B–D 3 | take | {A,C}, {B,D,E,F}, {G,H} |
| F–H 3 | take | {A,C}, {B,D,E,F,G,H} |
| A–B 4 | take | one tree — 7 edges = n − 1, done |

The remaining edges (B–C 5, C–E 6, D–F 6, E–G 7, B–F 8, C–G 9) would create cycles. MST weight = **17** — the same as with Prim (here even the same tree).
:::

:::task level=1 source="own" title="Activity selection"
Given the activities (intervals [p, k)):

| no. | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| p | 1 | 2 | 4 | 1 | 5 | 8 | 9 | 11 | 10 | 13 | 12 |
| k | 3 | 5 | 7 | 8 | 9 | 10 | 11 | 14 | 15 | 16 | 13 |

Run the greedy algorithm. How many activities can be chosen?
::hint
Sort by k: 1(3), 2(5), 3(7), 4(8), 5(9), 6(10), 7(11), 11(13), 8(14), 9(15), 10(16).
::solution
- take **1** [1,3) — end 3,
- 2 (p = 2 < 3) — collision; **3** [4,7) — take, end 7,
- 4, 5 — collisions; **6** [8,10) — take, end 10,
- 7 [9,11) — collision; **11** [12,13) — take, end 13,
- 8, 9 — collisions; **10** [13,16) — take (13 ≥ 13).

Chosen: **1, 3, 6, 11, 10 → 5 activities**.
:::

:::task level=2 source="own" title="Huffman codes"
Characters occur in a text with frequencies **K 7, L 3, M 12, N 5, O 20, P 9** (56 in total). Build the Huffman tree, give the codes and the average code length. Compare with a fixed-length code.
::hint
The first merge: L (3) + N (5) = 8.
::solution
Merges: L3 + N5 = 8; K7 + (LN)8 = 15; P9 + M12 = 21; (K,LN)15 + O20 = 35; (PM)21 + 35 = 56.

```tree
56(21(P,M),35(15(K,8(L,N)),O))
```

Codes: **P 00, M 01, K 100, L 1010, N 1011, O 11**.

Cost: 9·2 + 12·2 + 7·3 + 3·4 + 5·4 + 20·2 = **135 bits**, on average 135/56 ≈ **2.41 bits** per character. A fixed code for 6 characters needs 3 bits → 168 bits.

(On ties in the queue the codes may differ, but the total cost is always 135.)
:::

:::task level=2 source="own" title="Knapsack: continuous vs 0/1"
The knapsack has capacity **40 kg**. Items: A (10 kg, 50 €), B (20 kg, 80 €), C (30 kg, 105 €). Solve the continuous version greedily. Then apply the same rule to the 0/1 version and compare with the optimum.
::hint
Ratios v/w: A 5, B 4, C 3.5 €/kg.
::solution
- **Continuous:** all of A (10 kg, 50), all of B (20 kg, 80), of C only 10 kg out of 30 → 35. Total **165** — optimal.
- **0/1 greedy:** A, B (30 kg, 130), C does not fit → **130**.
- **0/1 optimum:** A + C = 40 kg, **155**. Greediness failed.
:::

:::task level=1 source="own" title="The bridge — once more"
The crossing times of four people are 1, 2, 6 and 9 minutes (conditions as in the lecture). How long does the crossing take with the "the fastest always escorts" strategy, and how long at best?
::hint
Try letting the two slowest people go together.
::solution
- greedy: 1+9 → 9, 1 returns → 1, 1+6 → 6, 1 returns → 1, 1+2 → 2: **19 min**,
- better: 1+2 → 2, 1 returns → 1, 6+9 → 9, 2 returns → 2, 1+2 → 2: **16 min**.
:::
