---
id: howto
type: page
title: How to study ASD — a plan and good habits
short: How to study
icon: 💡
eyebrow: Recommendations from the site author
desc: A practical study plan, the order of topics, typical mistakes and how to work with the tasks.
---

:::own
This whole page consists of **recommendations from the site author** — they do not come from the lectures or the passing rules.
:::

## A plan for the semester

Lectures and classes go roughly in this order — it pays to be **one topic ahead** of the classes.

| Week | Topics | What to focus on |
|---|---|---|
| 1–2 | [1. Introduction](topic:t01), [3. Complexity](topic:t03) | logarithms, O/Ω/Θ, counting loops |
| 3–4 | [2. Correctness](topic:t02), [4. Searching](topic:t04) | invariants, decreasing function, BinSearch |
| 5–6 | [5. Simple sorting](topic:t05), [6. Recursion](topic:t06) | sorting traces, MergeSort, master theorem |
| 7 | [7. QuickSort](topic:t07), [8. Karatsuba and FFT](topic:t08) | partition, lower bound, CountingSort |
| 8 | [9. Stack, queue, lists](topic:t09) | axioms, operation sequences |
| 9–10 | [10. BST](topic:t10), [11. AVL](topic:t11) | BST operations, traversals, rotations |
| 11 | [12. Heaps](topic:t12) | upheap/downheap, construct, HeapSort |
| 12–13 | [13. Graphs](topic:t13), [14. Greedy](topic:t14) | DFS/BFS, Dijkstra, Prim, Kruskal |

## How to work through one topic

1. **Read the text** with a pencil in hand — recompute every example yourself.
2. **Retype the code** (don't copy!) and run it on your own data. Add printing of the array state after every step.
3. Do the **tasks** at the end of the topic. Open the hint only after 5–10 minutes of your own attempts.
4. The evening before the class read the **cheat notes** (2–3 minutes).
5. Return to the cheat notes again a week later — spaced repetition works much better than one-off learning.

## Typical mistakes (and how to avoid them)

- **Off-by-one errors** in loops and indices (`to n-1` in pseudocode vs `< n` in Java; heap indices from 0 or from 1).
- **Confusing W(n) with A(n)** — worst case means the worst data, expected means the average.
- **Input size for numbers** is the number of digits, not the value — an algorithm with n iterations is exponential in bits.
- **Forgetting stability** (`<=` instead of `<` in merging decides MergeSort's stability).
- **BST vs heap** — a heap has no left/right order.
- **AVL rotations** — look for the **lowest** node with |BF| = 2 and check the sign of its child's BF (single or double rotation?).
- **Dijkstra** — a "final" vertex never changes again; don't relax edges into final vertices.

## Proven tools {own}

- Draw! Trees, graphs and arrays on paper are faster than in your head.
- Algorithm visualisations (e.g. the VisuAlgo site) help to see how elements move — but in a test you must be able to do it by hand.
- Your own tests in Java: compare the output of your sort with `Arrays.sort` for thousands of random arrays.
