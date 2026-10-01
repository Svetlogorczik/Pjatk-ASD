---
id: t01
num: 1
type: topic
title: What is an algorithm? Introduction to algorithmics
short: Introduction to algorithmics
desc: What an algorithm is, the algorithmic domain, three versions of Euclid's algorithm, pseudocode and the maths you need from the very first class.
sources: 2026/2027 (M. Sydow): correctness1-pl.pdf (organizacja, pseudokod) · 2025/2026: Algorytmika.pdf; asd1.pdf (§1 Pseudo-code); Wyklady 2009/wyklad_1.pdf
exercises: asd 00.pdf (Exercise 0)
---

:::info Outside the 2026/2027 programme
Euclid's algorithm, the algorithmic domain and part of the maths come from the 2025/2026 lectures — **they are not on the 2026/2027 slides**. Binding material: the pseudocode section and the [summary](topic:t01).
:::

## Algorithm — what is it all about?

An **algorithm** (*algorytm*) is a precise recipe for solving a problem step by step. "Precise" really means precise here: a computer is very fast, but it never guesses. If you don't tell it something, it won't do it. If you say it vaguely, it will do something other than you wanted.

**Algorithmics** (*algorytmika*) is the part of computer science that teaches:

- how to **design** algorithms (invent the recipe),
- how to choose **data structures** for them (where to keep the data so that everything is fast),
- how to **analyse** algorithms — whether they are **correct** and whether they are **fast**.

The lecture stresses an important idea: a good algorithm gives far more than a faster computer. In a moment you will see an example where changing the algorithm turns "billions of years" into "a fraction of a second".

:::analogy
An algorithm is like a pancake recipe for someone who has never been in a kitchen. Writing "make the batter" is not enough. You have to write: "crack 2 eggs into a bowl, pour in 1 glass of milk, stir until there are no lumps". Every step must be understandable and doable, and the recipe must **end** at some point (it cannot tell you to stir forever).
:::

### Where does the word "algorithm" come from?

From the name of the Persian mathematician **al-Khwarizmi** (c. 780–850). In his book he described methods of solving equations, including quadratic ones. The Latin form of his name — *Algoritmi* — gave its name to the whole field. That is why the word sounds similar in almost every language.

## The algorithmic domain: what are we allowed to do?

Before we design an algorithm we must know **which operations we may use**. The set of "objects + allowed operations" is called an **algorithmic domain** (*dziedzina algorytmiczna*).

:::def
An **algorithmic domain** is a system made of: a set of objects we work on (the carrier), and a set of operations and relations that we are allowed to use on these objects.
:::

### An example from antiquity: Platonic constructions

The ancient Greeks were the first "algorithm designers". They solved construction problems: draw something with a compass and a straightedge. The objects are **points, lines and circles**, and there are exactly five allowed operations:

1. `line(X, Y)` — the line through two points,
2. `circle(O, Y)` — the circle with centre `O` passing through `Y`,
3. the intersection of two lines (a point),
4. the intersections of a line and a circle (points),
5. the intersections of two circles (points).

And **nothing more**. You may not, for example, "place the ruler and slide it until it touches the circle" — that would be cheating, because there is no such operation on the list. Note also that these operations are **partial**: two parallel lines have no intersection point.

**Problem from the lecture:** given a circle `o` with centre `O` and a point `A` outside it, draw a line through `A` tangent to the circle. The solution is simply a **sequence of operations** — that is, an algorithm:

```pseudo title="Tangent to a circle through point A"
l  := line(O, A)          // line joining the centre with A
o1 := circle(O, A)        // circle with centre O, radius OA
o2 := circle(A, O)        // circle with centre A, radius AO
(P, Q) := o1 ∩ o2         // the two intersection points
k  := line(P, Q)          // perpendicular bisector of OA
X  := l ∩ k               // midpoint of OA
o3 := circle(X, O)        // circle with diameter OA
(R, S) := o ∩ o3          // points of tangency
s  := line(R, A)          // the tangent (the other one: line(S, A))
```

:::info
The same can be written as one long expression (by composing functions). The lecture points out that **this is roughly what functional programming looks like** — instead of a sequence of instructions we have one composed expression.
:::

### Unsolvable problems

The Greeks could not perform three constructions: **squaring the circle**, **trisecting an angle** (dividing any angle into 3 equal parts) and **doubling the cube**. Only in the 19th century was it proved that these constructions **cannot** be done with those five operations.

In the 20th century **Alan Turing** showed something even stronger: there are problems that **no** algorithm on **any** computer can solve. The lecture's example is the **Post correspondence problem**: we have pairs of words (xᵢ, yᵢ); can we choose a sequence of indices for which the concatenated x-words and the concatenated y-words are identical? For specific data we can sometimes answer, but **there is no general algorithm** (the problem is undecidable).

## Euclid's algorithm — three versions of one idea

This is the most important example of the first lecture. We want to compute **GCD(m, n)** (Polish: NWD) — the greatest common divisor of two natural numbers. There is no simple formula for it, but Euclid noticed a fact (not obvious at all):

:::def
If we subtract the smaller number from the larger one, their GCD **does not change**: GCD(m, n) = GCD(n − m, m) for 0 < m ≤ n. Also GCD(0, n) = n.
:::

### Version 1: subtraction

Repeat: if `m > n`, swap them; then `n := n − m`. Stop when `m = 0` — the result is `n`.

Example for (84, 120): (84,120) → (84,36) → swap (36,84) → (36,48) → (36,12) → swap (12,36) → (12,24) → (12,12) → (12,0) → swap (0,12) → **GCD = 12**.

**Problem:** for `n = 10³⁰` and `m = 1` the loop runs about 10³⁰ times. The lecture calculates: even a computer doing 10¹² operations per second would need **more than 790 billion years** — dozens of times the age of the Universe. And RSA encryption uses numbers of the order of 10²⁰⁰!

### Version 2: the remainder

Key observation: the series of subtractions of `m` from `n` ends when `n` drops below `m`. What remains is simply the **remainder of the division** `n mod m`. So the whole sequence of subtractions can be replaced with one operation:

:::def
GCD(0, n) = n, and for m > 0: GCD(m, n) = GCD(n mod m, m).
:::

Now the data (10³⁰, 1) are trivial: one division, remainder 0, done.

### How many loop iterations in the worst case? Fibonacci numbers

We look for the **most malicious** data, i.e. the ones for which the loop runs the longest. The lecture turns the question around: *which smallest numbers force k iterations of the loop?*

| loop iterations | smallest pair (m, n) |
|---|---|
| 1 | (1, 1) |
| 2 | (2, 3) |
| 3 | (3, 5) |
| 4 | (5, 8) |
| 5 | (8, 13) |
| … | … |
| 9 | (55, 89) |

These are consecutive **Fibonacci numbers**: F₀ = 0, F₁ = 1, Fₙ = Fₙ₋₁ + Fₙ₋₂ (0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144…). The worst data are two neighbouring Fibonacci numbers — then every quotient equals 1, so the "progress" is the smallest possible. The pair (Fₙ₋₁, Fₙ) gives n − 2 iterations.

Fibonacci numbers grow **exponentially** — from some point on each one is more than 60% larger than the previous. The Euler–Binet formula says Fₙ ≈ φⁿ/√5, where φ = (1+√5)/2 ≈ 1.618. Hence for 30-digit numbers: φⁿ/√5 < 10³⁰ gives n ≈ 150, i.e. **at most about 148 iterations**. Compare this with 10³⁰ iterations of version 1!

:::tip
Takeaway: the number of iterations of Euclid's algorithm (the `mod` version) grows like the **logarithm** of the values, i.e. linearly in the number of digits. That is a huge difference compared with the subtraction version.
:::

### Version 3: binary Euclid

For 0 ≤ m ≤ n the lecture also gives a version that uses only parity tests, halving/doubling and subtraction (very cheap operations for a computer, because they work on bits):

- GCD(m, n) = 2 · GCD(m/2, n/2) when m and n are even,
- GCD(m, n) = GCD(m/2, n) when m is even and n is odd,
- GCD(m, n) = GCD(m, n/2) when m is odd and n is even,
- GCD(m, n) = GCD((n − m)/2, m) when both are odd.

### Code: all three versions

```java title="Gcd.java"
@include t01-euclid.java
```

:::info
Each version uses a **different algorithmic domain** (a different set of operations). The lecture writes them as: Euclid 1 — (ℕ, 0, ≤, −, swap); Euclid 2 — (ℕ, >0, mod); Euclid 3 — (ℕ, 0, >, parity, ·2, /2, −, swap). This shows that "how fast an algorithm is" also depends on which operations we consider elementary.
:::

## Pseudocode — how we will write algorithms

In the lectures algorithms are written in **pseudocode**. It is "almost a programming language": it lets you forget about semicolons and types and focus on the idea. At the same time it must be precise enough to be easily rewritten in a real language (for us: Java).

Pseudocode rules from the lecture:

| Element | Notation | Meaning |
|---|---|---|
| Assignment | `x := 5` | `:=` is assignment, `=` is an ordinary comparison |
| Declaration | `Algorytm nazwa(p1, p2, …)` | a method called "nazwa" (name) with parameters |
| Choice | `if war then I1 [else I2]` | brackets `[ ]` = optional part |
| Loops | `while cond do I`, `repeat I until cond`, `for i := a to b do I` | compound instructions in braces `{ }` |
| Arrays | `A[i]` | an n-element array has indices from `0` to `n − 1` |
| Result | `return wart` | returns a value |

An example from the lecture — the maximum of an array (`Dane` = input, `Wynik` = output):

```pseudo title="Max_w_tablicy (max in array)"
Algorytm Max_w_tablicy(A, n):
  Dane:  array A of n integers (n > 0)
  Wynik: the largest element of A
{
  dotychczas_naj := A[0];      // "best so far"
  for i := 1 to n-1 do
    if dotychczas_naj < A[i] then
      dotychczas_naj := A[i];
  return dotychczas_naj
}
```

And the same algorithm in Java:

```java title="MaxDemo.java"
@include t01-max.java
```

:::warn
In pseudocode the loop `for i := 1 to n-1` **includes** the value `n − 1`. In Java we write it as `for (int i = 1; i < n; i++)` or `i <= n - 1`. Off-by-one errors are easy to make when translating.
:::

## What will we study about algorithms?

The lecture lists four basic questions:

1. Can the problem be **solved** on a computer at all (in the available time and memory)?
2. Which of the known algorithms should we **choose** in a given situation?
3. Is there a **better** algorithm? Is ours **optimal**?
4. How do we **justify** that the algorithm really solves the task (i.e. that it is **correct**)?

That is why the next topics deal with **correctness** (topic 2) and **complexity** (topic 3). It is worth knowing the basic terms already:

- **Time complexity** — how many operations the algorithm performs. We count only the **dominant operation** (the most frequent and most expensive one, e.g. `mod` in Euclid 2).
- **Worst-case complexity** (*pesymistyczna*) — for the most malicious data; **average** (*średnia*) — for typical data.
- **Space complexity** (*pamięciowa*) — how much **extra** memory is needed.
- **Complexity of a problem** — the complexity of the **best** possible algorithm for that problem.
- **Input size** — we measure "how many bits the data take": for an array it is its length, for a number — the number of digits, for a graph — the number of vertices and edges.

## Maths you need from the first class {own}

The first exercise class uses logarithms, powers, number of digits and limits. The lectures do not cover this separately — here is a short practical cheat sheet.

:::own
This section was added by the site author, because Exercise 0 requires this knowledge and the slides do not explain it.
:::

### The logarithm in one sentence

**log_a b = c** means exactly: **a to the power c gives b** (aᶜ = b). A logarithm answers "to which power must I raise the base to get the number?".

- log₂ 8 = 3, because 2³ = 8
- log₂ 1 = 0, because 2⁰ = 1
- log₂ (1/8) = −3, because 2⁻³ = 1/8
- log₂ (−8) — **does not exist** (a power of a positive number is always positive)
- log₄ 8 = 3/2, because 4^(3/2) = (√4)³ = 8

The most important rules (a, b, x, y > 0, a ≠ 1):

| Rule | Example |
|---|---|
| log(x·y) = log x + log y | log₂ 12 = log₂ 4 + log₂ 3 = 2 + log₂ 3 |
| log(x/y) = log x − log y | log₂ 0.75 = log₂ 3 − log₂ 4 |
| log(xᵏ) = k · log x | log₂ 9 = 2 · log₂ 3 |
| log_a x = log_b x / log_b a | log₄ 8 = log₂ 8 / log₂ 4 = 3/2 |

:::tip
In computer science "log" without a base almost always means **log₂**. Intuition: log₂ n is **how many times you must halve n to get down to 1**. For n = 1024 that is 10 times, for a million — about 20 times. That is why "logarithmic" algorithms are so fast.
:::

### How many digits does a number have?

A natural number x > 0 has **⌊log₁₀ x⌋ + 1** decimal digits (⌊·⌋ = rounding down). Example: 2¹⁰⁰ has ⌊100 · log₁₀ 2⌋ + 1 = ⌊100 · 0.30103⌋ + 1 = 30 + 1 = **31** digits. Similarly, the number of bits is ⌊log₂ x⌋ + 1.

### Limits of sequences — the quick way

For a fraction of two polynomials divide the numerator and the denominator by the **highest power of n** in the denominator:

- (5n + 1)/(2n − 3) → 5/2 (same degrees → ratio of the leading coefficients),
- (n + 7)/n² → 0 (the denominator grows faster),
- n²/(10n) → ∞ (the numerator grows faster).

The order "who grows faster" (slowest first): **log n ≺ √n ≺ n ≺ n log n ≺ n² ≺ n³ ≺ 2ⁿ ≺ n!**. Hence e.g. (100 · log n)/n → 0. This order comes back in the complexity topic.

=== summary ===

:::exam What you must know
What an algorithm is, what pseudocode is (and its conventions), and the 3 parts of the course.
:::

## Algorithm and algorithmics

- **Algorithm** — a precise description (list of steps) of how to do something. The word comes from *al-Khwarizmi* (780–850).
- **Algorithmics** is "the heart of computer science"; its role grows in the *big data* era.

## Pseudocode (lecture conventions)

| Element | Notation |
|---|---|
| variables | no declarations |
| arrays | `[ ]`, indexed **from 0** |
| operators | `=`, `==`, `<`, `&&`, `||`, `!`, `+=`, `++` |
| control | `if / else`, `while`, `for`, `return` |
| compound arguments | passed by reference |

## Three parts of the course

1. **Analysis** — given code: what does it do and how efficiently?
2. **Design** — given a **specification**: design a correct and efficient algorithm.
3. **Data structures** — efficient organisation of data and operations.

:::info Outside the 2026/2027 programme
Euclid, the algorithmic domain and logarithms in this topic come from 2025/2026 — useful background, but not directly on the 2026/2027 slides.
:::

=== tasks ===

:::task level=1 source="Exercise 0, task 1 (modified)" title="The first negative number"
Write, in pseudocode, an algorithm that for an array `T[0..n−1]` of integers returns **the index of the first negative number**, or `−1` if there is none. Then answer:

1. How many comparisons with zero does the algorithm make in the **best** and in the **worst** case?
2. What do the most "malicious" data look like?
::hint
Scan the array from left to right and stop at the first hit. The worst case is when you have to look at everything.
::solution
```pseudo
Algorytm FirstNegative(T, n):
  Dane:  array T[0..n-1] of integers, n ≥ 0
  Wynik: the smallest i with T[i] < 0, or -1
{
  i := 0;
  while i < n do {
    if T[i] < 0 then return i;
    i := i + 1;
  }
  return -1
}
```

- **Best case:** `T[0] < 0` → **1 comparison**.
- **Worst case:** no negative numbers, or the only negative one is last → **n comparisons** (each element checked once).
- Malicious data: an array without negative numbers, e.g. `[3, 0, 8, 1]`.

So the worst-case complexity is **linear**: W(n) = n.
:::

:::task level=1 source="Exercise 0, task 2 (modified)" title="Parcels in a courier depot"
In a courier depot parcels arrive on a conveyor belt in random order. Each has a label with the number of one of **20 loading ramps** (1–20). A worker takes the parcels one by one and must make sure that each ramp holds only the parcels with its number.

1. Propose a procedure (algorithm) for the worker.
2. How many times does the worker "move" a parcel if there are n parcels? Does it depend on the order on the belt?
3. Why is this problem easier than "arrange all parcels in one queue from the smallest shipment number to the largest"?
::hint
Notice that the worker never has to compare parcels with each other — reading the ramp number is enough.
::solution
1. For each parcel from the belt: read the ramp number `r`, put the parcel on ramp `r`. That's all.
2. Each parcel is moved **exactly once**, so we make **n moves** — regardless of the order on the belt (linear complexity).
3. There are only 20 possible "categories" and we do not have to order parcels **within** a ramp. This is **distributing into buckets** — an idea that returns with counting sort and bucket sort (topic 7). Fully ordering all n parcels by comparisons needs, in the worst case, on the order of n log n comparisons.
:::

:::task level=1 source="Exercise 0, task 3 (modified)" title="Compute the logarithms"
Compute (or justify that the value does not exist):

a) log₂ 256  b) log₂ (−256)  c) log₃ (1/81)  d) log₄ 32  e) log₁₀ 0.001
::hint
Turn every question into "to which power…?". In d) write 4 and 32 as powers of two.
::solution
a) 2⁸ = 256 → **8**
b) **does not exist** — a power of 2 is always positive
c) 3⁻⁴ = 1/81 → **−4**
d) 4 = 2², 32 = 2⁵, so 4ˣ = 2²ˣ = 2⁵ → x = **5/2**
e) 10⁻³ = 0.001 → **−3**
:::

:::task level=2 source="Exercise 0, task 4 (modified)" title="Logarithm algebra"
Let **log₃ 2 = a**, **log₃ 5 = b**, **log₅ 7 = c**. Express using a, b, c:

log₃ 10, log₃ 50, log₃ 20, log₃ 2.5, log₃ 7, log₃ 0.4, log₃ 28, log₅ 2, log₅ 18.
::hint
Factor the numbers into 2, 3, 5, 7. Remember that log₃ 3 = 1. For log₃ 7 use the change of base: log₅ 7 = log₃ 7 / log₃ 5.
::solution
- log₃ 10 = log₃ 2 + log₃ 5 = **a + b**
- log₃ 50 = log₃ 2 + 2·log₃ 5 = **a + 2b**
- log₃ 20 = 2·log₃ 2 + log₃ 5 = **2a + b**
- log₃ 2.5 = log₃ (5/2) = **b − a**
- log₃ 7 = log₅ 7 · log₃ 5 = **bc**
- log₃ 0.4 = log₃ (2/5) = **a − b**
- log₃ 28 = log₃ (4·7) = **2a + bc**
- log₅ 2 = log₃ 2 / log₃ 5 = **a / b**
- log₅ 18 = log₃ (2·3²) / log₃ 5 = **(a + 2) / b**
:::

:::task level=2 source="Exercise 0, task 5 (modified)" title="How many digits?"
How many decimal digits do the numbers **2²⁰²⁶** and **7¹⁰⁰** have? Assume log₁₀ 2 ≈ 0.30103 and log₁₀ 7 ≈ 0.845098.
::hint
The number of digits of x is ⌊log₁₀ x⌋ + 1, and log₁₀ (aᵏ) = k · log₁₀ a.
::solution
- log₁₀ 2²⁰²⁶ = 2026 · 0.30103 ≈ 609.89 → ⌊609.89⌋ + 1 = **610 digits**.
- log₁₀ 7¹⁰⁰ = 100 · 0.845098 ≈ 84.51 → ⌊84.51⌋ + 1 = **85 digits**.

(Both answers were checked with exact big-number arithmetic.)
:::

:::task level=2 source="Exercise 0, task 6 (modified)" title="Limits"
Compute the limits as n → ∞:

a) (6n + 2026) / (2n − 7)  b) (n + 9) / (5n²)  c) (n² + 3n + 1) / (4n)  d) (500 · log₂ n) / (0.1 · n)
::hint
Divide the numerator and the denominator by the highest power of n in the denominator. In d) remember that log n grows more slowly than n.
::solution
a) divide by n: (6 + 2026/n)/(2 − 7/n) → **3**
b) divide by n²: (1/n + 9/n²)/5 → **0**
c) divide by n: (n + 3 + 1/n)/4 → **∞**
d) the constant 500/0.1 = 5000 does not matter, and log₂ n / n → 0, so the limit is **0**. (Takeaway: an algorithm costing 500·log n is much faster for large n than one costing 0.1·n, despite the "uglier" constant.)
:::
