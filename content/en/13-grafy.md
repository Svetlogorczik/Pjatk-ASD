---
id: t13
num: 13
type: topic
title: Graphs — representations, depth-first and breadth-first search, Find-Union
short: Graphs, DFS, BFS
desc: What a graph is, adjacency lists and matrix, the general graph traversal scheme, DFS with a stack, BFS with a queue, stepwise refinement and the Find-Union (disjoint sets) structure.
sources: asd11.pdf; Wyklady 2009/wyklad_2.pdf (graphs), asd 09 wyklad_7.pdf (DFS, BFS); wyklad_10.pdf (Find-Union structure)
exercises: no separate problem set — tasks by the site author (weighted graphs are in topic 14)
---

:::exam 2026/2027 tests
This topic was written from the 2025/2026 lectures. **The 2026/2027 tests use the versions from M. Sydow's slides** — you will find them in the section ["2026/2027 lecture version"](topic:t13#2026-2027-lecture-version-m-sydow-introduction-to-graphs-and) at the end of the topic (code copied from the slides). Qualifying tasks and practice tasks: [Tests 2026/2027](page:exams).
:::

## What is a graph?

:::def
A **graph** is a pair **G = (V, E)**, where V is a finite set of **vertices** (nodes) and E a set of **edges**:
- in an **undirected** graph an edge is an unordered pair {x, y} (x ≠ y),
- in a **directed** graph — an ordered pair (x, y), i.e. an arrow from x to y.

We write an edge joining x and y as (x, y). **The size of a graph** is given by two numbers: **n = |V|** and **m = |E|**.
:::

For an undirected graph **m ≤ n(n − 1)/2**, for a directed one **m ≤ n(n − 1)**.

:::analogy
A map of cities and roads: cities are vertices, roads are edges. Two-way roads — an undirected graph; one-way streets — directed. Friends on a social network — undirected; "followed" accounts — directed.
:::

## Graph representations

We assume V = {1, 2, …, n} — vertices are array indices.

- **Adjacency lists:** for every x ∈ V a list **L[x]** of vertices y with (x, y) ∈ E. Memory: **O(n + m)**.
- **Adjacency matrix:** A[x, y] = 1 when (x, y) is an edge, and 0 otherwise. Memory: **O(n²)**.

```graph
1 40 20
2 160 20
3 40 120
4 160 120
1-2
1-3
2-4
3-4
2-3
```

For the graph above:

| x | L[x] |
|---|---|
| 1 | 2, 3 |
| 2 | 1, 3, 4 |
| 3 | 1, 2, 4 |
| 4 | 2, 3 |

| A | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| **1** | 0 | 1 | 1 | 0 |
| **2** | 1 | 0 | 1 | 1 |
| **3** | 1 | 1 | 0 | 1 |
| **4** | 0 | 1 | 1 | 0 |

### Which one to choose? {own}

:::own
A comparison from the site author.
:::

| Question / operation | Lists | Matrix |
|---|---|---|
| memory | O(n + m) | O(n²) |
| is (x, y) ∈ E? | O(degree of x) | **O(1)** |
| scan the neighbours of x | **O(degree of x)** | O(n) |
| traversing the whole graph | **O(n + m)** | O(n²) |
| better for | **sparse** graphs (m ≪ n²) — most practical ones | **dense** graphs |

## The general graph traversal scheme

Lecture asd11 starts from a **general scheme**, from which concrete algorithms are later derived. Starting from vertex p we want to visit every vertex and every edge reachable from p. Allowed move: following an edge leaving an **already visited** vertex.

1. Visit p and mark it as visited.
2. While some visited vertex has an unvisited outgoing edge:
   - (a) choose a visited vertex v with an unvisited outgoing edge,
   - (b) choose any unvisited edge (v, w),
   - (c) mark it as visited,
   - (d) if w was not visited — visit it and mark it.

By induction on the distance from p one can prove that the algorithm visits **every** vertex and **every** edge reachable from p (each vertex exactly once). The complexity is **proportional to the total number of vertices and edges** — i.e. **linear**: O(n + m).

To obtain a concrete algorithm we must decide:
1. the graph representation (e.g. adjacency lists),
2. how to mark visited vertices (an array `visited[v]`),
3. **how to choose** the vertex v in step (a) — e.g. keeping candidates on a **stack** or in a **queue**,
4. how to tell visited edges from unvisited ones — e.g. a pointer **current[v]** to the first unvisited edge on the list L[v].

## DFS — depth-first search (stack)

If candidates are kept on a **stack**, we always take the vertex that was visited **most recently**. So we go "as deep as possible" into the graph, and only when there is nowhere to go do we back up.

:::analogy
Exploring a maze with a ball of thread: walk along a corridor as long as you can; at a dead end go back to the last fork that still has an unexplored way.
:::

```pseudo title="DFS (lecture)"
void DFS(graf G) {
  for (v = 1; v <= n; v++) {
    visited[v] = FALSE;
    current[v] = pointer to the first element of L[v];
  }
  visit(p); visited[p] = TRUE;
  if (current[p] != NULL) {
    S = []; Push(S, p);
    while (!Empty(S)) {
      v = Front(S);                         // the vertex on top of the stack
      let w be the vertex pointed to by current[v];
      move current[v] to the next vertex on the list L[v];
      if (current[v] == NULL) Pop(S);       // no new edges leave v any more
      if (!visited[w]) {
        visit(w); visited[w] = TRUE;
        if (current[w] != NULL) Push(S, w);
      }
    }
  }
}
```

## BFS — breadth-first search (queue)

If candidates are kept in a **queue**, we first "exhaust" the neighbours of the vertex visited **earliest**. So vertices are visited **in layers**: first p, then all neighbours of p (distance 1), then their neighbours (distance 2), and so on.

:::analogy
Ripples on water after throwing a stone: first the nearest points get wet, then ever more distant rings.
:::

In the code only the structure changes: instead of `Push` there is `Inject` (add at the end of the queue), and `Front`/`Pop` act on the front of the queue.

:::tip
**BFS finds shortest paths** (in the number of edges) from p to all vertices: just record dist[w] = dist[v] + 1 when visiting w. For weighted graphs Dijkstra's algorithm is needed (topic 14).
:::

**Example** (neighbours scanned alphabetically, start at A):

```graph
A 30 70
B 130 20
C 130 120
D 230 70
E 330 70
F 430 70
A-B
A-C
B-D
C-D
D-E
E-F
```

- **DFS:** A, B, D, C, E, F — from A to B, from B to D, from D to C (a dead end: A and D visited), back to D, then E, F.
- **BFS:** A, B, C, D, E, F — layers: {A}, {B, C}, {D}, {E}, {F}; distances: A 0, B 1, C 1, D 2, E 3, F 4.

```java title="GraphSearch.java — recursive DFS, DFS with a stack (as in the lecture), BFS"
@include t13-graph.java
```

### Stepwise refinement

The lecture stresses **how** the DFS and BFS procedures were obtained: we started from the general scheme and then step by step **refined** the choices (representation, marking, stack or queue, current pointers). This is **stepwise refinement** (*metoda kolejnych uściśleń*). A few things in the procedures are still left "to polish" (e.g. the exact handling of lists and pointers) — the final transformations into machine code are done by the compiler.

### Applications of DFS and BFS {own}

:::own
An overview of applications from the site author — all run in O(n + m).
:::

- **connectivity:** an undirected graph is connected ⇔ one DFS/BFS visits all vertices; the number of DFS runs started from unvisited vertices = the number of **connected components**,
- **shortest paths** without weights — BFS,
- **cycle detection**, **topological sorting** of a directed acyclic graph — DFS,
- **mazes, games** (e.g. the minimum number of moves) — BFS.

## The Find-Union structure (disjoint sets)

The 2009 slides (lecture X) discuss a structure needed e.g. in Kruskal's algorithm (topic 14).

:::def
**The Find-Union problem:** elements 1, …, n are divided into **disjoint** sets (initially each element forms a separate set). Operations:
- **find(x)** — return the name (representative) of the set containing x,
- **union(A, B)** — merge sets A and B into one.
:::

:::analogy
Groups of friends at a party: at first everyone stands alone. When two people meet, their groups merge into one (union). find(x) answers "who is the boss of x's group?" — two people are in the same group when they have the same boss.
:::

Implementations (from the simplest):

1. **An array of names** name[x]: find — O(1), but union must rename the whole set — O(n).
2. **Lists with balancing:** each set is a list; on union we rename the **smaller** list. An element changes its name only when its set at least doubles — so at most log n times. n − 1 union operations cost **O(n log n)** in total.
3. **(n-ary) trees with balancing and path compression:** each set is a tree, the root is the representative, every node points to its parent.
   - find(x) — go from x up to the root,
   - union — the root of the **lower** tree is attached under the root of the higher one → tree height ≤ log n,
   - **path compression** — during find, attach all visited nodes **directly under the root**; subsequent finds are then almost instant.

With balancing and compression a sequence of m operations costs **O(m · α(n))**, where α is an extremely slowly growing function (the inverse of Ackermann's function; in practice α(n) ≤ 4) — i.e. **almost constant time** per operation.

```java title="FindUnion.java"
@include t13-findunion.java
```


## 2026/2027 lecture version (M. Sydow) — "Introduction to graphs" and "Graph traversal"

:::exam
In the tests: definitions (graph, digraph, paths, cycles, connectivity, trees), representations and their costs, and **simulating BFS/DFS in the slide version** — visiting order, distances `d` (BFS), times `d/f` (DFS, `time` from 0), the search forest and edge classification. Practice task: [Tests 2026/2027](page:exams).
:::

:::def Graph and digraph
A **graph** (undirected) G = (V, E): V — the set of **vertices**, E — the set of **edges**; an edge e = {v, w} is an **unordered** pair of vertices (its **ends**). We say: e **joins** v and w, v and w are **adjacent**, e is **incident** with v and w. An undirected graph represents a **symmetric** relation; a graph with empty V and E is the **null graph**.
A **directed graph** G = (V, E): an edge (arc) e = (v, w) is an **ordered** pair (**start**, **end**) — e goes from v to w (leaves v, enters w); it represents **any** binary relation.
:::

A drawing is only one of infinitely many graphical representations — distinguish the graph (an abstract object) from its drawing.

- **Simple graph:** no **loops** (v, v) and no **multiple edges** (in a digraph (v, w) and (w, v) are different edges). **Degree** deg(v) — the number of incident edges (a loop counts twice); degree 0 — an **isolated** vertex.
- **Path:** an alternating sequence of vertices and edges (v₀, e₀, v₁, …, eₖ, vₗ) where eₖ joins vₖ and vₖ₊₁ (similarly a directed path). **Simple** — no repeated edges; **elementary** — no repeated vertices; **length** — the number of edges (length 0 — a single vertex).
- **Cycle:** a path of length at least 3 with v₀ == vₗ; **elementary cycle** (except first/last) and **simple**; the **girth** — the length of the shortest elementary cycle.
- **Connected** ⇔ every two distinct vertices are joined by a path (⇔ a non-empty graph is not a union of two non-empty graphs). **Connected component** — a maximal connected subgraph; c(G) — the number of components. A digraph is **strongly connected** ⇔ for every ordered pair of distinct vertices there is a directed path from the first to the second (strong ⇒ weak connectivity, not conversely); strongly/weakly connected components.
- **Tree** — a connected acyclic graph; **forest** — acyclic; **leaf** — a vertex of degree 1, the others are **internal**.

:::def Characterisation of trees (equivalent conditions)
T is a tree with n vertices ⇔ T has n−1 edges and is acyclic ⇔ T is connected and has n−1 edges ⇔ every two vertices are joined by **exactly one** elementary path ⇔ T is acyclic, but adding any edge creates exactly one cycle.
:::

**Rooted trees:** a distinguished **root**; **depth (level)** — the distance from the root; **height** — the maximum depth; ancestor/descendant, parent/child, sibling, leaves (no children), subtree. Representation: **parent array** (n[i] — the label of i's parent). **d-ary tree** — every vertex has ≤ d children; **complete** — leaves differ in depth by ≤ 1; level l has ≤ dˡ vertices; for height h: **h + 1 ≤ n ≤ (d^(h+1) − 1)/(d − 1)**. **Ordered tree** — children are linearly ordered (drawn left to right; the standard order — by levels, then by children). **Binary tree** — a 2-ary ordered tree in which it is specified which child is left and which is right.

**Graph representations:** **adjacency matrix** A[i, j] = 1 ⇔ i, j are joined (a loop — 2); symmetric for an undirected graph, zeros on the diagonal for a simple one; the row/column sum — the (out/in) degree; Aᵀ — reversed edges. **Incidence matrix** I[v, e] = 1 ⇔ v is incident with e (digraph: 1 entering, −1 leaving). **Adjacency lists** (for a digraph — the vertices that the outgoing edges enter). Also an edge list, an object representation, "gd0" (binary). **Graph size** — the pair (n, m); a **sparse** graph — m = O(n).

| representation | memory |
|---|---|
| adjacency matrix | Θ(n²) — always |
| adjacency lists | Θ(n + m) — adapts to the number of edges |
| incidence matrix | Θ(n·m) |

### Graph traversal

A systematic visit: start from a start vertex, move only along edges, every vertex and edge **exactly once** (undirected and directed graphs). **General scheme:** put the start into a structure X; while X is non-empty: (1) take out v and visit it, (2) put all unvisited neighbours of v into X. The variant depends on X (**queue → BFS, stack → DFS**) and on the order of neighbours (e.g. alphabetical). One run gives a **search tree**; repeated until everything is visited — a **search forest**. Colours: **white** (unvisited), **grey** (visited, being processed), **black** (finished).

**Edge classification (u, v):** **tree (T)** — v visited from u via (u, v); **forward (F)** — not a tree edge, v is a descendant of u; **back (B)** — v is an ancestor of u; **cross (C)** — the rest.

```pseudo
for-each node in V:
  node.color = white; node.d = infinity; node.p = null

s.color = gray; s.d = 0; queue.in(s)

while(!queue.empty()){
  currNode = queue.out()

  process(currNode)

  for-each node in currNode.adjList:
     if (node.color == white):
        queue.in(node)
        node.color = gray
        node.d = currNode.d + 1
        node.p = currNode

  currNode.color = black
}
```

**BFS** visits vertices "in all directions" by increasing distance: attribute `d` — the distance from the start, `p` — the tree. Uses: connected components, distances, transitive closure (n×BFS). Complexity **O(|V| + |E|)**. Undirected graph: no forward or back edges; tree edge: v.d = u.d + 1; cross edge: v.d = u.d or u.d + 1. Directed: no forward edges; tree: v.d = u.d + 1; cross: v.d ≤ u.d + 1; back: 0 ≤ v.d ≤ u.d.

```pseudo
DFS(){
  time = 0
  for-each v in V:
     v.color = white; v.parent = null
  for-each v in V:
     if (v.color == white):
        recursiveDFS(v)
}
recursiveDFS(GraphNode v){
  v.d = time++
  v.color = gray
  process(v)
  for-each u in v.adjList:
     if (u.color == white):
        u.parent = v
        recursiveDFS(u)
  v.color = black
  v.f = time++
}
```

**DFS** (stack or recursion — the same idea, but the visiting order may differ): **discovery time v.d** (becomes grey) and **finishing time v.f** (black). Complexity **O(|V| + |E|)**. **Parenthesis structure:** the intervals [u.d, u.f] and [v.d, v.f] are disjoint or one contains the other. **White-path theorem:** v is a descendant of u in the DFS tree ⇔ at time u.d there is a path from u to v consisting of white vertices only. Undirected graph: no forward or cross edges. Directed — all 4 kinds; when traversing (u, v): **tree** if v is white; **back** if grey; **forward or cross** if black. By times: (v, w) is tree or forward ⇔ v.d < w.d < w.f < v.f; back ⇔ w.d < v.d < v.f < w.f; cross ⇔ w.d < w.f < v.d < v.f. Uses: acyclicity test (no back edges), **topological sort**, strongly connected components, articulation points, bridges, blocks.

### Sample questions/exercises from the slides

Definitions of graphs, paths and cycles; connectivity, strong/weak connectivity, components; kinds of trees and their properties; representations and their complexities; pre/in/post-order visiting order; **the order of visited vertices, distances (BFS), discovery and finishing times (DFS), the search forest and edge classification**; an algorithm for escaping a maze — BFS or DFS?

=== summary ===

## 2026/2027 version (M. Sydow)

- Tree ⇔ connected with n−1 edges ⇔ acyclic with n−1 edges ⇔ exactly one elementary path.
- Memory: adjacency matrix Θ(n²), lists Θ(n + m), incidence matrix Θ(n·m).
- BFS (queue): d, p; DFS (recursion): d/f from time = 0; both O(|V| + |E|).
- Edges T/F/B/C; directed DFS: v white → T, grey → B, black → F or C.


## Graphs

- G = (V, E), n = |V|, m = |E|; undirected: m ≤ n(n−1)/2, directed: m ≤ n(n−1).
- **adjacency lists** O(n + m) — sparse graphs; **matrix** O(n²) — dense, edge test O(1).

## Graph traversal

- scheme: visit p; while there is an unvisited edge from a visited v — follow it; every vertex and edge once → **O(n + m)**.
- **DFS** — candidates on a **stack** (deep, with backtracking); **BFS** — in a **queue** (in layers).
- BFS gives shortest paths (number of edges): dist[w] = dist[v] + 1.
- **stepwise refinement**.

## Find-Union

- find(x), union(A, B) on disjoint sets.
- array of names: union O(n); lists with balancing: n−1 unions O(n log n); **trees + balancing + path compression: almost O(1)** (O(m α(n))).
- use: Kruskal's algorithm, connected components.

=== tasks ===

:::task level=1 source="own" title="Memory representation"
An undirected graph has **n = 1000** vertices and **m = 3000** edges. How many cells does the adjacency matrix take, and how many elements do all adjacency lists hold together? What is the maximum number of edges this graph could have?
::hint
In an undirected graph every edge appears on two lists.
::solution
- matrix: n² = **1,000,000** cells,
- lists: each edge on two lists → 2m = **6000** elements (+ 1000 list heads),
- maximum number of edges: n(n − 1)/2 = **499,500**.

The graph has only 3000 of the 499,500 possible edges — it is **sparse**, so lists are much better.
:::

:::task level=2 source="own" title="DFS and BFS step by step"
For the graph below run **DFS** and **BFS** from vertex **1**. Scan the neighbours in increasing order. Give the visiting order and (for BFS) the distances from 1.

```graph
1 40 110
2 150 30
3 150 110
5 150 190
4 260 60
6 260 170
7 370 110
8 480 110
1-2
1-3
1-5
2-4
3-4
3-6
4-7
5-6
6-7
7-8
```
::hint
Adjacency lists: 1: 2, 3, 5; 2: 1, 4; 3: 1, 4, 6; 4: 2, 3, 7; 5: 1, 6; 6: 3, 5, 7; 7: 4, 6, 8; 8: 7.
::solution
**DFS:** 1 → 2 → 4 → 3 → 6 → 5 (a dead end: 1 and 6 visited) → back to 6 → 7 → 8.

Order: **1, 2, 4, 3, 6, 5, 7, 8**.

**BFS:** queue: [1] → visit 2, 3, 5 → from 2: 4 → from 3: 6 (4 already there) → from 5: nothing → from 4: 7 → from 6: nothing → from 7: 8.

Order: **1, 2, 3, 5, 4, 6, 7, 8**.

| vertex | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| distance | 0 | 1 | 1 | 2 | 1 | 2 | 3 | 4 |
:::

:::task level=2 source="own" title="Connected components"
A graph has vertices 1…9 and edges: {1,2}, {2,3}, {4,5}, {6,7}, {7,8}, {8,6}. How many connected components does it have? Describe how to find them with DFS and how many times it will be started.
::hint
Loop over all vertices; for each one that is still unvisited start a DFS.
::solution
Components: {1, 2, 3}, {4, 5}, {6, 7, 8}, {9} → **4 components**.

Algorithm: `for v := 1 to n do if not visited[v] then { counter++; DFS(v) }`. DFS will be started **4 times** (for 1, 4, 6, 9), and the total cost is O(n + m), since every vertex and edge is visited once.
:::

:::task level=3 source="own" title="Find-Union with balancing and compression"
We have elements 1…8, each in a separate set. Perform in turn: union(1,2), union(3,4), union(5,6), union(7,8), union(1,3), union(5,7), union(1,5), and then find(8). On union attach the root of the lower tree under the root of the higher one (for equal heights — the second under the first), and perform find with path compression. Draw the tree before and after find(8).
::hint
After the first four unions there are four trees of height 1. After union(1,3) and union(5,7) — two trees of height 2.
::solution
- union(1,2): 2 under 1; union(3,4): 4 under 3; union(5,6): 6 under 5; union(7,8): 8 under 7.
- union(1,3): equal heights → 3 under 1; union(5,7): 7 under 5.
- union(1,5): equal heights (2) → 5 under 1. Tree height = 3.

```tree caption="before find(8)"
1(2,3(4,_),5(6,7(8,_)))
```

Note: it is an **n-ary** tree — node 1 has three children (2, 3, 5).

find(8) follows the path 8 → 7 → 5 → 1 and returns **1**. Compression: 8 and 7 are attached directly under 1.

```text title="after find(8): parents of the nodes"
node:   1  2  3  4  5  6  7  8
parent: 1  1  1  3  1  5  1  1
```
:::
