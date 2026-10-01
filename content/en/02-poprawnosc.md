---
id: t02
num: 2
type: topic
title: Correctness of algorithms — specification, invariants, termination
short: Correctness of algorithms
desc: How to prove that an algorithm does what it should. Pre- and postconditions, partial and total correctness, the invariant method and the decreasing function.
sources: asd1.pdf (§2 Analysis of algorithms, §3 Invariants); Wyklady 2009/wyklad_1.pdf (correctness)
exercises: asd 02.pdf, asd 02a.pdf, asd 03.pdf (tasks 1–2)
---

## Why prove correctness?

Usually we check a program like this: write it, run it on a few examples, fix the bugs. The lecture lists three drawbacks of this method:

1. Sometimes testing on real data is **impossible** (e.g. rocket software — the test is "one-shot").
2. Bugs found after testing are **expensive** — the later a bug is found, the more it costs.
3. **Testing can show that a bug exists, but never that there is none.** You cannot check all possible inputs.

That is why we learn to **prove** that an algorithm is correct — just as theorems are proved in mathematics.

## Specification: what the algorithm gets and what it must return

Before we say "the algorithm is correct" we must say **with respect to what**. That "what" is the **specification**:

:::def
- **Precondition** (input condition, *warunek początkowy*) **α** — what we assume about the input data (e.g. "n > 0", "the array is sorted").
- **Postcondition** (output condition, *warunek końcowy*) **β** — what must be true after the algorithm finishes (e.g. "result = the largest element of the array").
- The notation **{α} K {β}** reads: "if the data satisfy α and algorithm K terminates, then the results satisfy β".
:::

Example: for `Max_w_tablicy(A, n)` from topic 1:

- α: `n > 0`, `A` is an array of n integers,
- β: the result is an element of `A` and is ≥ every element of `A`.

:::warn
The precondition is not a formality. For `n = 0` the Max algorithm would access the non-existent `A[0]`. The specification says honestly: "for such data I promise nothing".
:::

## Three properties: partial correctness, definedness, termination

The lecture distinguishes three things we want to prove:

1. **Partial correctness** (*częściowa poprawność*) — if the data satisfy α and the computation **reaches the end**, then the results satisfy β.
2. **Definedness of computations** (*określoność*) — for data satisfying α the computation **is not interrupted** by an error (e.g. division by 0, index out of the array).
3. **Termination / the stop property** (*własność stopu*) — for data satisfying α the computation **is not infinite** (loops end).

:::def
An algorithm is **totally correct** (*całkowicie poprawny*) with respect to α and β when it is **partially correct** and has the **stop property** (and its computations are defined). In other words: for all good inputs it **stops** and gives a **good result**.
:::

:::analogy
A car satnav is *partially correct* if every time it gets you somewhere, it is the right address. But it might also… never arrive, driving round and round a roundabout. It is *totally correct* when it **always arrives** and **always at the right address**.
:::

## The invariant method

Simple algorithms without loops are easy to check "by eye". **Loops** are the trouble — we don't know in advance how many times they run. For loops we have a great tool: the **invariant**.

:::def
A **loop invariant** (*niezmiennik*) is a condition g that is true **every time** control reaches the loop test — before the first iteration and after every iteration.
:::

To show partial correctness of a loop `{α} while W do K {β}` it is enough to show **three things**:

1. **Initialisation:** α ⇒ g — the invariant holds at the start.
2. **Preservation:** {g ∧ W} K {g} — if g holds and we enter the loop (W is true), then after one iteration g still holds.
3. **Termination step:** g ∧ ¬W ⇒ β — when the loop ends (W is false), the invariant together with the negated condition gives β.

:::analogy
It is like an induction proof about a ladder: (1) you stand on the first rung, (2) from every rung you can climb to the next one, so (3) when the ladder ends, you are at the top. The invariant is the sentence "I am standing safely on the ladder" — true on every rung.
:::

### How to come up with an invariant?

An invariant usually says: **"what I have done so far is done right"**. For a loop over an array: "the result for the already scanned part of the array is correct". At the end the "scanned part" = the whole array, so the result is correct for everything.

### Example 1: the maximum of an array

```pseudo title="Max_w_tablicy with an invariant"
Algorytm Max_w_tablicy(A, n):
{
  // n > 0; A - array of integers
  dotychczas_naj := A[0];
  for i := 1 to n-1 do
    // Inv.: dotychczas_naj = MAX(A[0..i-1])
    if dotychczas_naj < A[i] then
      dotychczas_naj := A[i];
  // dotychczas_naj = MAX(A[0..n-1])
  return dotychczas_naj
}
```

1. **Start:** before the first iteration i = 1 and `dotychczas_naj = A[0] = MAX(A[0..0])` ✓.
2. **Iteration:** if `dotychczas_naj = MAX(A[0..i−1])`, then after comparing with `A[i]` we have `MAX(A[0..i])` — and i increases ✓.
3. **End:** the loop ends with i = n, so `dotychczas_naj = MAX(A[0..n−1])` ✓.

Termination: the `for` loop runs exactly n − 1 times.

### Example 2: integer square root — linear version

For n ≥ 0 we look for ⌊√n⌋, i.e. the **largest** p with p² ≤ n. Equivalently:

> p = ⌊√n⌋ ⇔ (p · p ≤ n) ∧ ((p + 1) · (p + 1) > n)

```pseudo title="sqrt — linear version"
Algorytm sqrt(n):
  Dane:  a non-negative integer n
  Wynik: the integer part of the square root of n
{
  p := 0;
  while (p+1)*(p+1) <= n do
    // Inv.: p*p <= n
    p := p + 1;
  // p = [sqrt(n)]
  return p
}
```

- **Start:** p = 0 and n ≥ 0, so p² ≤ n ✓.
- **Iteration:** we enter the loop only when (p+1)² ≤ n; after `p := p+1` again p² ≤ n ✓.
- **End:** the loop ends when (p+1)² > n. Together with the invariant p² ≤ n — that is exactly the definition of p = ⌊√n⌋ ✓.
- **Termination:** p grows by 1 each iteration, and (p+1)² ≤ n cannot stay true forever.

### Example 3: a faster root — halving the interval

The linear version makes about √n iterations. The lecture shows a version with **binary search**: we keep an interval [l, r] that surely contains the result and halve it every time.

```pseudo title="sqrt — binary search version"
Algorytm sqrt(n):
{
  l := 0;  r := n;           // left and right end of the interval
  while l < r do
  // Inv.: l*l <= n  &  (r+1)*(r+1) > n  &  l <= r
  {
    s := [(l + r) / 2];      // integer part of the mean
    if (s+1)*(s+1) <= n then
      l := s + 1             // the root is > s
    else
      r := s;                // the root is <= s
  }
  // l = [sqrt(n)]
  return l
}
```

Proof in three steps:

1. **Start:** l = 0 gives l² = 0 ≤ n. For r = n: (n+1)² = n² + 2n + 1 > n. Also l ≤ r ✓.
2. **Iteration:** if (s+1)² ≤ n, then after `l := s+1` still l² ≤ n. If (s+1)² > n, then after `r := s` still (r+1)² > n. Since l ≤ s < r, the condition l ≤ r is also kept ✓.
3. **End:** ¬(l < r) and l ≤ r give **l = r**. Then l² ≤ n and (l+1)² > n, i.e. l = ⌊√n⌋ ✓.

**Termination — the decreasing function.** Consider f = r − l. It is a natural number and in every iteration it **strictly decreases** (because l ≤ s < r: either l grows to s + 1 > l, or r drops to s < r). A sequence of natural numbers cannot decrease forever, so the loop ends.

:::def
A **decreasing function** (a measure of progress, *funkcja malejąca*) is a natural-valued expression that **strictly decreases** in every loop iteration. Its existence proves **termination**.
:::

:::exam
A typical class task: "define the pre- and postconditions, prove termination, give and prove the loop invariant, prove partial and total correctness". The answer scheme is always the same:
1. α and β,
2. decreasing function → **termination**,
3. invariant: start / iteration / end → **partial correctness**,
4. termination + partial = **total correctness**.
:::

### Java code

```java title="IntSqrt.java"
@include t02-sqrt.java
```

## Checking invariants in code {own}

:::own
In Java you can "pin" an invariant to the code with the `assert` statement. It is not a proof (we still check only specific data), but it helps a lot in finding bugs and gets you used to thinking in invariants. Assertions are enabled with the `java -ea` flag.
:::

```java title="SumWithInvariant.java"
@include t02-sum-assert.java
```

Note that the three `assert`s correspond exactly to the three steps of the invariant method: before the loop, after every iteration, and after the loop we use the invariant plus the condition `i == n`.

## A recipe for correctness tasks {own}

:::own
The scheme below is the site author's summary — useful for every "prove total correctness" task.
:::

1. **Name the starting values.** If the algorithm changes its parameters (e.g. `n := n − 1`), write their initial values as N, X, Y… — the invariant often needs them.
2. **Write what is true "halfway through".** Write down the variable values after 0, 1, 2, 3 iterations on a small example and look for a relation that does not change (e.g. `s = i · x`, `r + x·y = X·Y`).
3. **Check the three steps** (start / iteration / end). For "iteration" consider each `if` branch separately.
4. **Find a decreasing function** (e.g. `n − i`, `y`, `r − l`) — it must be natural and strictly decrease.
5. **Compute the complexity:** how many times at most can the decreasing function decrease?


## 2026/2027 lecture version (M. Sydow) — definitions for the tests

:::exam
In 2026/2027 the lecture is given by M. Sydow, and the tests use **his wording and his pseudocode** (C/Java-like syntax, arrays indexed from 0). The text above (from the 2025/2026 lectures) is about the same things, but e.g. lists "definedness" as a separate property — for M. Sydow **total correctness = stop property + partial correctness**. Learn the definitions below **by heart**. The "spec + pseudocode + correctness + complexity for a^b" type of task is solved on the [Tests 2026/2027](page:exams) page.
:::

According to the slides, the course has three overlapping parts: **analysis of algorithms** (given code — understand what it does and how efficiently), **design of algorithms** (given a specification — design a correct and efficient algorithm) and **data structures**. Design and analysis are necessary steps **before** implementation.

:::def Specification of an algorithm
A specification expresses the **contract** of an algorithm ("what exactly the algorithm has to do") and consists of:
- (optionally) the **name** of the algorithm and the **list of arguments** in brackets,
- the **precondition** (input) — specifies exactly the types and allowed values of the **correct input data**,
- the **postcondition** (output) — specifies exactly the **correct result** (type and value(s)) that the algorithm must return as a function of the input data.

The conditions may be in natural language, as long as they are stated **precisely**.
:::

**Example from the slides.** "Return the sum of the numbers in an array of a given length":
- **name and arguments:** `sum(sequence, len)`
- **precondition:** `sequence` — an array of integers, `len` — a natural number, the declared length of the array
- **postcondition:** the algorithm returns an integer that is the sum of the first `len` elements of the array **or zero if the array is empty**

Since len is natural, the array can have length 0 — the specification **must** say what to return then. (If len had to be positive, this case would disappear, but the algorithm would be less general.) Likewise, in `find(arr, len, key)` you must add what is returned when the key is missing (e.g. −1) — otherwise the specification is **incomplete**.

:::def Total and partial correctness
- **Correct input data** satisfy the precondition; a **correct result** satisfies the postcondition.
- An algorithm is **totally correct** (for a given specification) ⇔ for **every** correct input: (1) it stops after a finite number of steps (**stop property**) and (2) when it stops, it returns a correct result (**partial correctness**).
- An algorithm is **partially correct** if: **if** it stops (for correct input), **then** it returns a correct result. Partial correctness **does not guarantee** stopping.
:::

**An example of a partially but not totally correct algorithm** (a deliberate bug — no `i++`):

```pseudo
sum(array, len){
  sum = 0
  i = 0
  while(i < len)
    sum += array[i]
  return sum
}
```

For len > 0 the loop never ends (no stop). It stops only for len = 0 — and then returns 0, a correct result. So it is **partially correct** but **not totally**. (The opposite example: an algorithm that always stops but returns e.g. `sum + 1` — it has the stop property but is not partially correct.)

**Proof of the stop property** for the correct version (with `i++`) — it is enough to note that:
1. the algorithm stops whenever `i >= len` holds,
2. `len` is a **constant and finite** natural number,
3. the value of `i` grows by 1 in every iteration,

so the algorithm stops after a finite number of iterations. **Every** detail matters: growth of the variable alone is not enough — it must grow by a **constant** amount; it is not enough that len is constant — it must also be **finite**.

:::def Loop invariant
A **loop invariant** is a logical predicate satisfying the condition: **if** it holds **before** entering (any) iteration of the loop, **then** it also holds **after leaving that iteration**.
:::

The analogy with **mathematical induction**: if the predicate is true just before the first iteration (the base case) and is an invariant (the inductive step), then it is also true after leaving the loop — regardless of the number of iterations. We build the invariant so that **when the loop ends it is equivalent to the postcondition**.

**How to find an invariant (technique from the slides):**
1. write a predicate expressing the **postcondition**,
2. transform it so that it contains all the important variables of the algorithm (especially the loop counter), expresses the **current** value of the returned variable, and satisfies the definition of an invariant,
3. check that it holds just **before the first iteration**.

**Example from the slides — `algor1`** (input: Arr — an array of integers, len > 0):

```pseudo
algor1(Arr, len){
  i = 1
  x = Arr[0]
  while(i < len){
    if(Arr[i] > x){
      x = Arr[i]
    }
    i++
  }
  return x
}
```

It returns the **maximum** of the first len numbers of the array. Proof of total correctness — the two standard steps:

1. **Stop** — as above: i grows by 1, len is constant and finite.
2. **Partial correctness.** Postcondition: `(∀ 0≤j<len: x ≥ Arr[j]) ∧ (∃ 0≤j<len: x == Arr[j])`. Invariant ("in the i-th iteration x is the maximum of the first i values"): `(∀ 0≤j<i: x ≥ Arr[j]) ∧ (∃ 0≤j<len: x == Arr[j])`.
   - before the first iteration: i = 1, x = Arr[0] — true,
   - it is an invariant thanks to the conditional update of x in the `if`,
   - when the loop stops (i == len) it takes the form of the postcondition.

### What you must know after lecture 1 (from the slides)

1. Give from memory the exact definitions of: specification, correct input and output data, total and partial correctness, loop invariant.
2. For a given computational task, create a precise specification.
3. Give an example of an algorithm that is partially correct but without the stop property, and vice versa.
4. Prove the stop property of a given algorithm.
5. Find an invariant for a simple loop and prove that it is an invariant.
6. Using an invariant, prove partial correctness of an algorithm.

=== summary ===

## 2026/2027 version (M. Sydow)

- **Specification** = (name + arguments) + **precondition** + **postcondition**.
- **Total correctness** = **stop property** + **partial correctness** (for every correct input).
- **Partial:** *if* it stops, *then* the result is correct (does not guarantee stopping).
- **Loop invariant:** true before an iteration ⇒ true after it (like the inductive step).
- **Stop:** the counter grows by a **constant**, the bound is **constant and finite**.


## Definitions

- **Specification:** precondition **α** (about the input) and postcondition **β** (about the results); notation **{α} K {β}**.
- **Partial correctness:** if α and the algorithm terminates ⇒ β.
- **Definedness:** no run-time errors (division by 0, bad index).
- **Termination (stop property):** for data satisfying α the algorithm stops.
- **Total correctness** = partial correctness + termination.

## The invariant method (loop `while W do K`)

1. **Start:** α ⇒ g
2. **Iteration:** {g ∧ W} K {g}
3. **End:** g ∧ ¬W ⇒ β

**Termination:** a decreasing function — a natural value strictly decreasing in every iteration.

## Lecture examples

| Algorithm | Invariant | Decreasing function |
|---|---|---|
| Max of an array | `best = MAX(A[0..i−1])` | n − i |
| linear sqrt | p² ≤ n | n − p² (or ⌊√n⌋ − p) |
| binary sqrt | l² ≤ n ∧ (r+1)² > n ∧ l ≤ r | r − l |

- p = ⌊√n⌋ ⇔ p² ≤ n < (p+1)².
- linear sqrt: ~√n iterations; binary: ~log₂ n iterations.

## Answer scheme for classes

α, β → decreasing function (termination) → invariant (start/iteration/end) → total correctness → complexity (how many times the decreasing function decreases).

=== tasks ===

:::task level=1 source="Exercise 2, task 1 (modified)" title="Specification and pseudocode"
For each problem give its specification (method name, parameters, precondition, postcondition) and a solution in pseudocode:

a) find the **smallest** number in an array,
b) compute the **product** of all numbers in an array,
c) count how many numbers in an array are **even**.
::hint
Think about what should happen for an empty array. For the minimum an empty array makes no sense (exclude it in α), while the product of an empty array is 1 (the neutral element of multiplication).
::solution
**a)** `Min(T, n)`; α: n ≥ 1, T[0..n−1] integers; β: the result m is one of the elements of T and m ≤ T[j] for every j.
```pseudo
Algorytm Min(T, n):
{
  m := T[0];
  for i := 1 to n-1 do
    if T[i] < m then m := T[i];
  return m
}
```
**b)** `Product(T, n)`; α: n ≥ 0; β: result = T[0]·T[1]·…·T[n−1] (for n = 0 the result = 1).
```pseudo
Algorytm Product(T, n):
{
  p := 1;
  for i := 0 to n-1 do p := p * T[i];
  return p
}
```
**c)** `CountEven(T, n)`; α: n ≥ 0; β: result = the number of indices i with T[i] mod 2 = 0.
```pseudo
Algorytm CountEven(T, n):
{
  c := 0;
  for i := 0 to n-1 do
    if T[i] mod 2 = 0 then c := c + 1;
  return c
}
```
:::

:::task level=1 source="Exercise 2, task 2 (modified)" title="What holds after the loop?"
Consider the fragment:
```pseudo
a := 10;
b := 0;
while a > 3 do {
  a := a - 1;
  b := b + 2;
}
// show that here b = 14
```
Show (with an invariant, not just by "recounting") that after the loop `b = 14`.
::hint
Look at how a and b change together: when a drops by 1, b grows by 2. What does not change?
::solution
**Invariant:** g ≡ (b = 2·(10 − a)) ∧ (a ≥ 3).

1. **Start:** a = 10, b = 0: 0 = 2·(10 − 10) ✓, 10 ≥ 3 ✓.
2. **Iteration:** assume g and a > 3. After `a := a − 1`, `b := b + 2` we have b + 2 = 2·(10 − a) + 2 = 2·(10 − (a − 1)) ✓, and the new a = a − 1 ≥ 3 because a > 3 ✓.
3. **End:** ¬(a > 3) gives a ≤ 3, and from g: a ≥ 3, so a = 3 and b = 2·(10 − 3) = **14** ✓.

**Termination:** the decreasing function a − 3 ≥ 0 drops by 1 each iteration (7 iterations).
:::

:::task level=2 source="Exercise 2, task 3 (modified)" title="Multiplication by addition"
```pseudo
Algorytm mult(x, n):
{
  i := 0;
  s := 0;
  while i < n do {
    s := s + x;
    i := i + 1;
  }
  return s
}
```
a) Define the pre- and postconditions.
b) Prove termination.
c) Give and prove the loop invariant.
d) Prove partial and total correctness.
::hint
After k iterations i = k and s is x added k times.
::solution
a) α: x an integer, n an integer, **n ≥ 0**. β: result = x · n.

b) **Termination:** f = n − i. At the start f = n ≥ 0; each iteration i grows by 1, so f drops by 1; the loop runs only while f > 0. After n iterations f = 0 and the loop ends.

c) **Invariant:** g ≡ (s = i · x) ∧ (0 ≤ i ≤ n).
- start: i = 0, s = 0 = 0·x, 0 ≤ 0 ≤ n ✓;
- iteration: from g and i < n: new s = i·x + x = (i+1)·x, new i = i + 1 ≤ n ✓.

d) **Partial correctness:** after the loop ¬(i < n), i.e. i ≥ n; from g: i ≤ n, so i = n and s = n·x = β ✓. **Total correctness** = partial correctness + termination (b) ✓. Complexity: exactly n additions.
:::

:::task level=2 source="Exercise 2, task 4 (modified)" title="The same loop without a counter"
Write the algorithm from the previous task **without the variable i** (changing the parameter n) and carry out the proof: termination, invariant, partial and total correctness.
::hint
Denote the initial value of n by N. The invariant must link "how much I have already added" with "how much is left".
::solution
```pseudo
Algorytm mult2(x, n):
{
  // N = initial value of n, N >= 0
  s := 0;
  while n > 0 do {
    s := s + x;
    n := n - 1;
  }
  return s
}
```
- **Termination:** f = n ≥ 0 drops by 1 each iteration.
- **Invariant:** g ≡ (s + n·x = N·x) ∧ (n ≥ 0).
  - start: s = 0, n = N: 0 + N·x = N·x ✓;
  - iteration: (s + x) + (n − 1)·x = s + n·x = N·x ✓, and the new n = n − 1 ≥ 0 because n > 0 ✓.
- **End:** ¬(n > 0) ∧ n ≥ 0 ⇒ n = 0, so s = N·x ✓.
- Total correctness = partial + termination ✓.
:::

:::task level=3 source="Exercise 2a / 3, task 1 (modified)" title="“Russian peasant” multiplication"
```pseudo
Algorytm mul(x, y):
{
  // x, y integers, y >= 0
  r := 0;
  while y > 0 do {
    if y is odd then r := r + x;
    y := y div 2;          // integer division
    x := x + x;
  }
  return r
}
```
Prove total correctness (result = X·Y, where X, Y are the initial values). Analyse the complexity: how many iterations will the loop make? Run the algorithm for `mul(13, 11)`.
::hint
Look for an invariant of the form "r + (something with x and y) = X·Y". Consider even y (y = 2k) and odd y (y = 2k + 1) separately.
::solution
**Invariant:** g ≡ (r + x·y = X·Y) ∧ (y ≥ 0).

- **Start:** r = 0, x = X, y = Y ⇒ 0 + X·Y ✓.
- **Iteration, y = 2k (even):** r unchanged, new y = k, new x = 2x: r + 2x·k = r + x·y ✓.
- **Iteration, y = 2k + 1 (odd):** new r = r + x, y = k, x = 2x: (r + x) + 2x·k = r + x(2k+1) = r + x·y ✓.
- **End:** y = 0 ⇒ r = X·Y ✓.
- **Termination:** decreasing function y: for y > 0 we have y div 2 < y, natural values ⇒ the loop ends.

**Complexity:** y is halved every iteration, so the number of iterations is the number of bits of Y: **⌊log₂ Y⌋ + 1** (for Y > 0). With respect to the input size (number of bits) — linear.

**Run of `mul(13, 11)`:**

| iteration | x | y | r | notes |
|---|---|---|---|---|
| start | 13 | 11 | 0 | |
| 1 | 26 | 5 | 13 | 11 odd → r += 13 |
| 2 | 52 | 2 | 39 | 5 odd → r += 26 |
| 3 | 104 | 1 | 39 | 2 even |
| 4 | 208 | 0 | 143 | 1 odd → r += 104 |

Result 143 = 13·11 ✓, 4 iterations = the number of bits of 11 (1011₂) ✓.
:::

:::task level=3 source="Exercise 2a / 3, task 2 (modified)" title="The robot and the balls in boxes"
There are n boxes on a shelf, numbered 0…n−1, each containing one ball: **green** or **yellow**. The robot can:
- `Color(i)` — open box i and tell the colour of the ball (this is **expensive**, so we want to do it as rarely as possible),
- `Swap(i, j)` — swap two boxes (careful: for i = j the robot breaks!).

Goal: all green balls on the left, all yellow on the right.

```pseudo
l := 0;  r := n - 1;
while l < r do
  if Color(l) = GREEN then
    l := l + 1
  else {
    Swap(l, r);
    r := r - 1
  }
```
Prove total correctness. How many times will `Color` be called, and how many times `Swap` (worst case)? Can the robot break?
::hint
Draw the shelf as three zones: [0..l−1] — known to be green; [r+1..n−1] — known to be yellow; the middle — unknown.
::solution
**Invariant:** g ≡ all boxes 0..l−1 contain green balls ∧ all boxes r+1..n−1 contain yellow balls ∧ 0 ≤ l ≤ r + 1 ≤ n.

- **Start:** l = 0, r = n − 1 — both zones are empty, so g holds ✓.
- **Iteration (green at l):** l := l + 1 — the green zone grows by a box with a green ball ✓.
- **Iteration (yellow at l):** after `Swap(l, r)` the yellow ball is in box r, so after r := r − 1 the yellow zone grows by a yellow box ✓. (We don't know what landed at position l — that is why we don't increase l.)
- **End:** ¬(l < r) and l ≤ r + 1 ⇒ l = r or l = r + 1. The unknown zone has ≤ 1 box, and one box cannot "spoil" the split — all green are on the left, yellow on the right ✓.
- **Termination:** f = r − l drops by 1 every iteration (l grows or r drops) ✓.

**Complexity:** r − l starts at n − 1 and drops by 1 per iteration, so for n ≥ 1 there are **exactly n − 1 iterations** ⇒ **n − 1 calls to `Color`** (optimal for this method). `Swap` — at most **n − 1** (when all balls are yellow).

**Can the robot break?** No: `Swap(l, r)` is called only inside the loop, when l < r, so always l ≠ r.

:::own
A remark from the author: the algorithm sometimes swaps a yellow with a yellow (needlessly). This can be improved by also checking the colour at r — but then the number of expensive `Color` calls grows. Here we optimise the number of `Color` calls, so the simple algorithm is good.
:::
:::
