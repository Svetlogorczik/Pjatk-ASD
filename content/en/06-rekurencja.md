---
id: t06
num: 6
type: topic
title: Recursion and "divide and conquer", MergeSort
short: Recursion, divide & conquer
desc: How recursion works, the Towers of Hanoi, generating permutations, the divide-and-conquer principle, merge sort and solving recurrences (the master theorem).
sources: asd4.pdf; asd5.pdf (§1 MergeSort); asd6.pdf (recursion and the stack); Dziel-RzadzC.pdf; Wyklady 2009/wyklad_2.pdf (recursion, master theorem)
exercises: asd 05.pdf (task 3), asd 06.pdf (task 2)
---

:::exam 2026/2027 practical test
The algorithms in this topic are within the scope of the **2026/2027 practical test**. **The versions from M. Sydow's slides** apply — they may differ in details from the 2025/2026 versions described here. Versions that reproduce the official sample answers, plus practice tasks: [Tests 2026/2027](page:exams).
:::

## What is recursion?

:::def
A function (method) is **recursive** if it calls **itself** — directly or indirectly (through other functions).
:::

Recursion often leads to much **shorter and clearer** algorithms than the version without it. Every correct recursive function has two parts:

1. **the base case** — data so small that we know the result immediately (without recursion),
2. **the recursive step** — reduce the problem to a **smaller** problem of the same kind.

:::analogy
A matryoshka doll: to see the smallest doll you open the big one, inside there is a smaller one — you do **the same** with it. You stop when you reach a doll that cannot be opened (the base case).
:::

:::warn
No base case (or a step that **does not reduce** the problem) = infinite recursion and a `StackOverflowError`.
:::

### How does the computer execute recursion? The call stack

Lecture asd6 points out: every call works on its **own, local copies** of parameters and variables. After returning from a recursive call we must continue with the **previous** values — so they must be stored somewhere. That structure is the **stack** (more in topic 9): each call pushes its data onto the stack and pops it when it finishes.

## Example 1: a number in binary

**Task:** print an integer x > 0 in binary.

The last binary digit is `x % 2`. The remaining digits are the binary form of `x / 2`. We must print them **before** the last digit — so first we recurse, and only then print.

```text title="Calls for x = 27"
dwojkowy(27): digit = 1, call dwojkowy(13)
  dwojkowy(13): digit = 1, call dwojkowy(6)
    dwojkowy(6): digit = 0, call dwojkowy(3)
      dwojkowy(3): digit = 1, call dwojkowy(1)
        dwojkowy(1): digit = 1  (x/2 = 0 — recursion ends)
        print 1
      print 1
    print 0
  print 1
print 1                              → 11011
```

Note that the digits are printed "on the way back" — starting from the deepest call.

## Example 2: the Towers of Hanoi

There are three pegs A, B, C. On peg A there are n rings of different diameters — from the largest at the bottom to the smallest on top. All rings must be moved to peg C following the rules:

- one move transfers **only one** (top) ring,
- **never** put a larger ring on a smaller one,
- peg B may be used as an auxiliary.

**The recursive solution** (surprisingly simple): to move n rings from A to C:

1. move (recursively) the **n − 1** top rings from A to **B** (using C),
2. move the **largest** ring from A to C,
3. move (recursively) the **n − 1** rings from B to **C** (using A).

```text title="Moves for n = 3 (from A to C)"
A->C  A->B  C->B  A->C  B->A  B->C  A->C      (7 moves)
```

### How many moves? {own}

:::own
The derivation of the formula was not on the slides, but it often appears in classes.
:::

Let H(n) be the number of moves. From the description: H(0) = 0, **H(n) = 2·H(n − 1) + 1**. In turn: 1, 3, 7, 15, 31, … i.e. **H(n) = 2ⁿ − 1** (induction: 2·(2ⁿ⁻¹ − 1) + 1 = 2ⁿ − 1). That is **exponential** — and you cannot do better (the largest ring must move, and before that all others must "get out of its way"). For 64 rings: 2⁶⁴ − 1 ≈ 1.8·10¹⁹ moves.

## Example 3: generating all permutations

From the 2009 slides: print all permutations of an array. The idea: put each of the elements in turn at the last position (k − 1), and permute the remaining k − 1 positions recursively.

```text title="Output for [1, 2, 3] (generation order)"
231  321  312  132  213  123
```

- number of printed permutations: **n!**,
- time complexity: **Θ(n!)** (at least as many as results to print),
- extra memory: recursion depth n, i.e. **O(n)**.

```java title="Recursion.java — all three examples"
@include t06-recursion.java
```

## The "divide and conquer" principle

The ancient Romans said *divide et impera* — it is easier to rule when your subjects are divided. In programming we do it "more humanely":

:::def
**Divide and conquer** (*dziel i rządź*):
1. we can solve the problem for **small** data (base case),
2. we **split** large data so that the problem reduces to several **smaller** subproblems,
3. we solve the subproblems (usually recursively),
4. we **combine** their results into a solution of the whole problem.
:::

We already know some examples:

| Algorithm | Split | Combining |
|---|---|---|
| min and max (topic 4) | into halves | 2 comparisons |
| recursive InsertionSort (topic 5) | 1 ; n−1 | inserting an element |
| **MergeSort** | into halves | merging sequences — linear |
| QuickSort (topic 7) | around a pivot | nothing (the split does all the work) |

## MergeSort — merge sort

**Idea:** split the sequence into two **halves**, sort each (recursively), then **merge** the two sorted sequences into one.

:::analogy
Two sorted decks of cards lie face up in front of you, smallest cards on top. You compare the two top cards and put the smaller one on the result pile. Repeat until one deck runs out — then put the rest of the other at the end. That is merging.
:::

### Merging

We have sorted fragments `c[l..s]` and `c[s+1..p]`. We keep a pointer i in the first, j in the second, and every time we copy the **smaller** of `c[i]`, `c[j]` into the auxiliary array `b`.

- **Invariant:** `b[l..k]` = merged `c[l..i−1]` and `c[s+1..j−1]` (sorted).
- Merging sequences of lengths p and q takes **at most p + q − 1** comparisons.

```array
left: {3} 27 38 43
right: {9} 10 82
b: 3 _ _ _ _ _ _
b: 3 9 10 27 38 43 82
```

### The algorithm

```pseudo title="MergeSort (lecture)"
Algorytm MergeSort(c, n)
{
  if n > 1 then Sortuj(0, n-1)
}

Sortuj(l, p):              // sorts c[l..p]
{
  if l < p then {
    s := (l + p) div 2;
    Sortuj(l, s);
    Sortuj(s+1, p);
    Scal(l, s, p);          // merges c[l..s] with c[s+1..p]
  }
}
```

**Example** for `[38, 27, 43, 3, 9, 82, 10]`:

```text title="Splits and merges"
                [38 27 43 3 9 82 10]
           [38 27 43 3]        [9 82 10]
         [38 27]  [43 3]      [9 82]  [10]
        [38] [27] [43] [3]   [9] [82]
merge:  [27 38]   [3 43]     [9 82]
merge:     [3 27 38 43]      [9 10 82]
merge:         [3 9 10 27 38 43 82]
```

```java title="MergeSort.java"
@include t06-mergesort.java
```

### Analysis of MergeSort

The key part is merging — for the fragment `c[l..p]` it takes at most p − l comparisons. Hence the recurrence for the number of comparisons in the **worst** case:

- T(1) = 0,
- **T(n) = T(⌊n/2⌋) + T(⌈n/2⌉) + n − 1**.

Its solution is **T(n) = n log₂ n + O(n)** (for n = 2ᵏ exactly n log₂ n − n + 1). That is **much** better than the n²/2 of the algorithms from topic 5!

- **Drawback:** **extra memory O(n)** is needed (the auxiliary merge array) and a lot of copying.
- **Advantage:** n log n time **always** (also in the worst case), the algorithm is **stable** (on equal keys we take the element from the left part — `<=`).
- The lecture mentions an interesting problem: can we merge **in place**, without an extra array? It was open for years — it has been solved (positively), but such methods are complicated.

## Recurrences — how to solve them

The complexity of a recursive algorithm is written as a **recurrence**. Here are three ways to solve it.

### 1. Unrolling (substitution) {own}

:::own
"Unrolling" is a standard technique — on the slides the result was given without computation, so I add it for clarity.
:::

For T(n) = 2T(n/2) + n − 1, n = 2ᵏ:

T(n) = 2T(n/2) + (n − 1)
 = 4T(n/4) + (n − 2) + (n − 1)
 = 8T(n/8) + (n − 4) + (n − 2) + (n − 1)
 = … = 2ᵏ·T(1) + k·n − (1 + 2 + … + 2ᵏ⁻¹)
 = 0 + n log₂ n − (n − 1).

### 2. The recursion tree {own}

Draw the tree of calls and write in every node the cost of its "own work" (without calls). For MergeSort: on each of the **log₂ n** levels the total merging cost is about **n**, so in total about **n log₂ n**.

### 3. The master theorem

From the 2009 slides — a ready recipe for recurrences of the form **T(n) = a·T(n/b) + f(n)** (a ≥ 1, b > 1):

:::def
Compare f(n) with the function **n^(log_b a)**:
1. if f(n) = O(n^(log_b a − ε)) for some ε > 0 (f grows **slower**), then **T(n) = Θ(n^(log_b a))**,
2. if f(n) = Θ(n^(log_b a)) (equally fast), then **T(n) = Θ(n^(log_b a) · log n)**,
3. if f(n) = Ω(n^(log_b a + ε)) for some ε > 0 (f grows **faster**) and a·f(n/b) ≤ c·f(n) for a constant c < 1, then **T(n) = Θ(f(n))**.
:::

:::analogy
Who "wins": the work spread over the leaves of the recursion tree (n^(log_b a)) or the work done when splitting/combining (f(n))? If the leaves — case 1; a tie — case 2 (log n appears, because that is the number of levels); if the combining — case 3.
:::

| Recurrence | n^(log_b a) | Case | Result | Example |
|---|---|---|---|---|
| T(n) = 2T(n/2) + n | n | 2 | Θ(n log n) | MergeSort |
| T(n) = T(n/2) + 1 | 1 | 2 | Θ(log n) | binary search |
| T(n) = 2T(n/2) + 2 | n | 1 | Θ(n) | min-max |
| T(n) = 3T(n/2) + n | n^1.585 | 1 | Θ(n^(log₂ 3)) | Karatsuba (topic 8) |
| T(n) = 2T(n/2) + n² | n | 3 | Θ(n²) | |

:::warn
The theorem **does not cover** recurrences like T(n) = T(n − 1) + n (the "1 ; n−1" split) — there is no division by b. Such recurrences are solved by unrolling: T(n) = n + (n−1) + … = Θ(n²).
:::

=== summary ===

## Recursion

- a function calls itself; **base case** + **step reducing** the problem.
- every call has local copies of variables → **call stack**; memory = recursion depth.

## Examples

- **binary(x):** digit x%2, first recurse on x/2, then print.
- **Hanoi:** n−1 to the auxiliary, the largest to the target, n−1 to the target; **H(n) = 2H(n−1) + 1 = 2ⁿ − 1**.
- **Permutations:** n! results, time Θ(n!), memory O(n).

## Divide and conquer

small data → directly; large → split, solve subproblems, combine.

## MergeSort

- split into halves, recursion, **merging** (≤ p + q − 1 comparisons).
- T(n) = T(⌊n/2⌋) + T(⌈n/2⌉) + n − 1 = **n log₂ n + O(n)** (also in the worst case).
- memory **O(n)**, **stable**.

## Master theorem: T(n) = aT(n/b) + f(n)

| f(n) vs n^(log_b a) | T(n) |
|---|---|
| slower | Θ(n^(log_b a)) |
| the same | Θ(n^(log_b a) log n) |
| faster (+ regularity condition) | Θ(f(n)) |

Does not apply to T(n) = T(n−1) + … — unroll instead.

=== tasks ===

:::task level=1 source="Exercise 5, task 3 (modified)" title="Towers of Hanoi for n = 3 and n = 4"
The pegs are called **L** (left), **M** (middle) and **R** (right). The rings are on peg **L**. Move them all to peg **M**, using **R** as the auxiliary. List the consecutive moves for n = 3 and for n = 4. How many are there?
::hint
For n = 3: first move 2 rings from L to **R** (the auxiliary for this step is M), then the largest from L to M, then 2 rings from R to M. For n = 4 use the solution for n = 3 twice.
::solution
**n = 3** (7 moves):

L→M, L→R, M→R, L→M, R→L, R→M, L→M

**n = 4** (15 moves):

L→R, L→M, R→M, L→R, M→L, M→R, L→R, **L→M**, R→M, R→L, M→L, R→M, L→R, L→M, R→M

The first 7 moves take 3 rings from L to R, move 8 (in bold) takes the largest ring from L to M, the last 7 take 3 rings from R to M. Number of moves: 2³ − 1 = 7 and 2⁴ − 1 = 15.
:::

:::task level=2 source="Exercise 6, task 2 (modified)" title="MergeSort step by step"
Show how **MergeSort** (lecture version, s = (l + p) div 2) works on the sequence

`[12, 5, 3, 14, 8, 19, 6, 1, 15, 17, 16, 2, 13, 5, 27, 22]`.

List all merges in the order in which the algorithm performs them.
::hint
The algorithm first goes recursively all the way down the left half, and only then deals with the right one. The first merge is [12] with [5].
::solution
Merges in execution order (indentation = recursion depth):

```text
      [12] + [5]                      = [5, 12]
      [3] + [14]                      = [3, 14]
    [5, 12] + [3, 14]                 = [3, 5, 12, 14]
      [8] + [19]                      = [8, 19]
      [6] + [1]                       = [1, 6]
    [8, 19] + [1, 6]                  = [1, 6, 8, 19]
  [3, 5, 12, 14] + [1, 6, 8, 19]      = [1, 3, 5, 6, 8, 12, 14, 19]
      [15] + [17]                     = [15, 17]
      [16] + [2]                      = [2, 16]
    [15, 17] + [2, 16]                = [2, 15, 16, 17]
      [13] + [5]                      = [5, 13]
      [27] + [22]                     = [22, 27]
    [5, 13] + [22, 27]                = [5, 13, 22, 27]
  [2, 15, 16, 17] + [5, 13, 22, 27]   = [2, 5, 13, 15, 16, 17, 22, 27]
[1, 3, 5, 6, 8, 12, 14, 19] + [2, 5, 13, 15, 16, 17, 22, 27]
                                      = [1, 2, 3, 5, 5, 6, 8, 12, 13, 14, 15, 16, 17, 19, 22, 27]
```

Note the two fives: in the last merge the 5 from the left part (originally at position 1) goes **before** the 5 from the right part (position 13) — MergeSort is stable.
:::

:::task level=1 source="own" title="Recursion on paper"
Run the lecture's `dwojkowy(45)` (binary) function "on paper". Draw the call tree and the order of printed digits. What is the maximum recursion depth for a number x?
::hint
For each call write: x, the digit x % 2 and x / 2. Digits are printed after returning from the call.
::solution
```text
dwojkowy(45): digit 1 → dwojkowy(22)
  dwojkowy(22): digit 0 → dwojkowy(11)
    dwojkowy(11): digit 1 → dwojkowy(5)
      dwojkowy(5): digit 1 → dwojkowy(2)
        dwojkowy(2): digit 0 → dwojkowy(1)
          dwojkowy(1): digit 1 (end)
          print 1
        print 0
      print 1
    print 1
  print 0
print 1
```
Result: **101101** (32 + 8 + 4 + 1 = 45 ✓). Recursion depth = number of binary digits = **⌊log₂ x⌋ + 1** (here 6).
:::

:::task level=2 source="own" title="The master theorem"
Solve (give the Θ order):

a) T(n) = 4T(n/2) + n  b) T(n) = 4T(n/2) + n²  c) T(n) = 4T(n/2) + n³  d) T(n) = 8T(n/2) + n²  e) T(n) = T(n/3) + 1  f) T(n) = T(n − 1) + 1
::hint
Compute n^(log_b a) and compare with f(n). Careful with f) — it is not of the form a·T(n/b).
::solution
a) n^(log₂ 4) = n², f = n grows slower → **Θ(n²)** (case 1).
b) f = n² = n^(log₂ 4) → **Θ(n² log n)** (case 2).
c) f = n³ grows faster; 4·(n/2)³ = n³/2 ≤ ½·n³ → **Θ(n³)** (case 3).
d) n^(log₂ 8) = n³, f = n² slower → **Θ(n³)**.
e) n^(log₃ 1) = n⁰ = 1, f = 1 → **Θ(log n)** (case 2).
f) the theorem does not apply; unrolling: T(n) = T(0) + n → **Θ(n)**.
:::

:::task level=2 source="own" title="How many comparisons in a merge?"
We merge a sorted sequence of length p with a sorted sequence of length q. What is the **smallest** and the **largest** number of comparisons made by Scal (merge)? Give example data for p = q = 3.
::hint
Merging ends when one of the sequences runs out — the rest of the other is copied without comparisons.
::solution
- **Fewest: min(p, q)** — when all elements of the shorter sequence are smaller than all of the other, e.g. `[1, 2, 3]` + `[4, 5, 6]` → 3 comparisons.
- **Most: p + q − 1** — when the elements "interleave" and both sequences end almost together, e.g. `[1, 3, 5]` + `[2, 4, 6]` → 5 comparisons.
:::

:::task level=3 source="own" title="Permutations — how many calls?"
For the lecture's `permutations(a, k)` procedure (Java code above) count how many times it is called for a 4-element array (`permutations(a, 4)`), and how many permutations it prints. Find a recurrence for the number of calls C(n).
::hint
A call with parameter k (k > 1) makes k calls with parameter k − 1. A call with k = 1 only prints.
::solution
C(1) = 1, **C(n) = 1 + n · C(n − 1)**. Hence: C(2) = 3, C(3) = 10, **C(4) = 41** calls, and **4! = 24** printed permutations. The number of calls is 1 + 4 + 4·3 + 4·3·2 = 41 (the sum over the levels of the recursion tree).
:::
