---
id: howto
type: page
title: How to study ASD in 2026/2027 — plan and good habits
short: How to study
icon: 💡
eyebrow: Recommendations from the site author
desc: A study plan for M. Sydow's lectures (2026/2027), the entry quizzes and both tests, how to work with summaries and practice tests, common mistakes.
---

:::own
This whole page contains **recommendations by the site author** — they do not come from the lectures or the passing rules ([Passing the course](page:course)).
:::

## Semester plan (2026/2027 lecture order)

An entry quiz in class is about the **previous lecture** — after every lecture work through the matching topic and its summary.

| Lecture | Topic on the site | Practice quiz | Focus on |
|---|---|---|---|
| 1. Correctness | [2](topic:t02) | Q1 | definitions, stop, invariant |
| 2. Complexity | [3](topic:t03) | Q2 | W, A, S, 5 notations, proof from the definition |
| 3. Searching | [4](topic:t04) | Q3 | `search` code, tournament, Hoare |
| 4. Sorting 1 | [5](topic:t05), [6](topic:t06) | Q4 | selection, insertion, mergeSort (`m = len/2`) |
| 5. Sorting 2 | [7](topic:t07) | Q5 | partition, CountSort, RadixSort, stability |
| 6. Recursion | [6](topic:t06) | Q6 | Hanoi, 3 schemes, master theorem |
| 7. Lists, ADS | [9](topic:t09) | Q7 | stack, queue, deque, splice |
| 8. Priority queue | [12](topic:t12) | Q8 | **min** heap from index 1, construct |
| 9. Dictionaries | [10](topic:t10), [11](topic:t11) | Q9 | BST insert/delete, hashing, AVL bf |
| 10. Graphs | [13](topic:t13) | Q10 | definitions, representations |
| 10b. Traversal | [10](topic:t10), [13](topic:t13) | Q11 | pre/in/post-order, BFS, DFS, d/f |
| 12. Shortest paths | [14](topic:t14) | Q12 | relaxation, Dijkstra, Bellman-Ford |
| MST | [14](topic:t14) | Q13 | Kruskal, Prim, alphabetical ties |

Practice quizzes: [Practice tests](page:mock).

## How to work with one topic

1. **After the lecture:** read the "2026/2027 lecture version" section in the topic — that is the binding material.
2. **Summary** (button at the top of the topic) — 5 minutes: definitions, formulas, common mistakes. Read it **before every entry quiz**.
3. **Exercises** at the end of the topic: on your own first, the hint after 5–10 minutes.
4. **Practice quiz** from [Practice tests](page:mock) — check yourself in 5 minutes.
5. Come back to the summary a week later — spaced revision works better than one-off learning.

## Preparing for the tests

:::tip Practical test (20 pts, threshold 10)
- go through **all task types** on [Tests 2026/2027](page:exams),
- solve **both variants** of the mock practical test on [Practice tests](page:mock) — timed, without notes,
- for every algorithm write down the state after **each step** (l/r/m table, array after a pass, heap after an operation).
:::

:::tip Knowledge test (20 pts, threshold 10)
- learn the definitions from topics [2](topic:t02) and [3](topic:t03) and the algorithm specifications **by heart**,
- practise **code analysis** (dominant operation + data size + W/A/S) and **writing pseudocode**,
- do the [mock knowledge test](page:mock) and compare with the model answers,
- go through the [cheat sheet](page:cheatsheet) — all complexities in one place.
:::

## Common mistakes (and how to avoid them)

- **No dominant operation and data size** in an analysis — the analysis is then incomplete.
- **Confusing W(n) with A(n)** — worst case is the worst input, average is the expected value.
- **MergeSort:** the left half is **shorter** (`m = len/2`); no comparisons are counted while copying the rest.
- **partition:** forgetting the **last** swap (placing the pivot).
- **CountSort:** phase 3 from the **end**; `counts` also covers values that do not occur.
- **Heap:** indices from **1**, **min** type; `construct` gives a different heap than n × `insert`.
- **BST:** an equal key goes **right**; when deleting do not confuse the predecessor with the successor.
- **Graphs:** neighbours and ties (Kruskal, Prim) — **alphabetically**; in DFS `time` starts at 0.

## Material outside the 2026/2027 programme {own}

Topics from 2025/2026 that are not on M. Sydow's slides: [Karatsuba and FFT](topic:t08), AVL rotations, the leftist heap, Huffman, the knapsack problem, activity selection, Euclid's algorithm. They stay on the site as extra material — **you do not need them** for the 2026/2027 tests.
