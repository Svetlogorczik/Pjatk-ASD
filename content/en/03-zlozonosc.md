---
id: t03
num: 3
type: topic
title: Computational complexity — measuring the speed of an algorithm
short: Computational complexity
desc: The dominant operation, worst-case and expected complexity, sensitivity, the O, Ω, Θ notations, the hierarchy of functions and why exponential algorithms are useless.
sources: asd2.pdf (§0.1, §1); Algorytmika.pdf (complexity); Wyklady 2009/wyklad_1.pdf (asymptotic notation)
exercises: asd 01.pdf ("Ćwiczenia 4": tasks 1–5)
---

## Why measure complexity?

We want to compare algorithms **independently of the computer**, the programming language and the programmer's skill. So we do not measure seconds but the **number of operations** the algorithm performs.

:::def
The **computational complexity** (*złożoność obliczeniowa*) of an algorithm is the amount of computer resources needed to run it. The two basic resources are **time** (time complexity) and **memory** (space complexity — extra memory beyond the input data).
:::

### Input size

We express complexity as a function of the **input size n**. What the size is depends on the problem:

| Problem | Input size |
|---|---|
| sorting, searching an array | number of elements |
| traversing a tree | number of nodes |
| computations on numbers | **number of digits** (bits), not the value itself! |
| evaluating a polynomial | degree of the polynomial |
| graphs | number of vertices and edges |

### The dominant operation

We do not count all operations — that would be tedious and depend on details. We choose a **dominant operation** (*operacja dominująca*): one such that the total number of all operations is **proportional** to the number of its executions.

- sorting → **comparison** of two elements (sometimes also a swap),
- traversing a tree → moving along an edge,
- polynomial computations → arithmetic operations +, −, ·, /.

The **unit of complexity** is one execution of the dominant operation.

## Worst-case and expected complexity

The same algorithm may run for different lengths of time on different inputs of the same size (e.g. the searched element is at the beginning or at the end). Hence two measures:

:::def
Notation: **Dₙ** — the set of all inputs of size n; **t(d)** — the number of dominant operations for input d; **Xₙ** — a random variable with values t(d); **pₙₖ** — the probability that the algorithm performs k dominant operations.

- **Worst-case** (*pesymistyczna*) time complexity: **W(n) = sup { t(d) : d ∈ Dₙ }** — "the worst case".
- **Expected** (average, *oczekiwana*) time complexity: **A(n) = Σ k · pₙₖ** — the expected value of Xₙ, "the typical case".
:::

We also talk about the **sensitivity** (*wrażliwość*) of an algorithm, i.e. how much its running time "jumps" depending on the data:

- **worst-case sensitivity:** Δ(n) = sup { t(d₁) − t(d₂) : d₁, d₂ ∈ Dₙ } (difference between worst and best),
- **expected sensitivity:** δ(n) = dev(Xₙ) — the standard deviation of Xₙ.

The larger Δ and δ, the **less predictable** the algorithm.

:::analogy
Your commute to university: W(n) is the time on the worst day (traffic jam, tram breakdown), A(n) is the average time over many days, and sensitivity tells how much those times differ. Before an important test you plan by W(n); when counting how much time per month you spend commuting — by A(n).
:::

### Lecture example: sequential search

We search for `a` in the array `L[0..N−1]`. The trick: at the end of the array we place a **sentinel** `L[N] := a`, so the loop certainly stops and does not have to check for the end of the array.

```pseudo title="Sequential search with a sentinel"
Algorytm Szukaj(L, N, a):
  Dane:  N ≥ 0, a - the searched element, L[0..N] (slot L[N] is free)
  Wynik: i such that L[i] = a (0 ≤ i ≤ N-1), or N when a is not in L
{
  L[N] := a;  i := 0;
  while L[i] <> a do
    i := i + 1;
  return i
}
```

- input size: n = N,
- dominant operation: the comparison `L[i] ≠ a`,
- **W(n) = n + 1** (a is not in the array — we reach the sentinel),
- **Δ(n) = n** (at best 1 comparison, at worst n + 1),
- **A(n) = (n + 1)/2** (assuming a is in the array and every position is equally likely),
- **δ(n) ≈ 0.29 n**.

## Asymptotic notation: O, Ω, Θ

Exact formulas (e.g. W(n) = 3n² + 7n + 12) are inconvenient. We care about the **order of magnitude**, i.e. the behaviour for very large n. Constants and lower-order terms are dropped.

:::def
Let f, g : ℕ → ℝ₊ ∪ {0}.
- **f(n) = O(g(n))** ("f is at most of order g") if there are constants **c > 0** and **n₀** such that **f(n) ≤ c · g(n)** for every n > n₀.
- **f(n) = Ω(g(n))** ("f is at least of order g") if g(n) = O(f(n)).
- **f(n) = Θ(g(n))** ("f is exactly of order g") if f = O(g) and f = Ω(g).
:::

Lecture example: **n² + 2n = O(n²)**, because n² + 2n ≤ 3n² for every n ≥ 1 (c = 3, n₀ = 1).

:::analogy
O(g) is the "ceiling", Ω(g) the "floor" and Θ(g) the "exact size". Saying "the algorithm is O(n²)" we promise it will not be worse than quadratic (but it may be better). Saying "Θ(n²)" — that it is exactly quadratic.
:::

:::warn
"f = O(g)" is **not** an equality in the usual sense. From n = O(n²) and n² = O(n²) it does not follow that n = n². Read the "=" sign as "belongs to the class".
:::

### The most common complexity classes

| Order | Name | Example |
|---|---|---|
| 1 | constant | access to `A[i]` |
| log n | logarithmic | binary search |
| n | linear | sequential search, maximum |
| n log n | linearithmic | MergeSort, HeapSort |
| n² | quadratic | SelectionSort, InsertionSort |
| n³, n⁴, … | polynomial | "schoolbook" matrix multiplication (n³) |
| n^(log n) | subexponential | |
| 2ⁿ | exponential | checking all subsets |
| n! | factorial | checking all permutations |

Order: **1 ≺ log n ≺ √n ≺ n ≺ n log n ≺ n² ≺ n³ ≺ n^(log n) ≺ 2ⁿ ≺ n!**

### Useful rules {own}

:::own
These rules follow directly from the definition but are not listed on the slides — the site author collected them because they are needed in the tasks.
:::

- **Constants do not matter:** 100·n² = Θ(n²), n/1000 = Θ(n).
- **The fastest-growing term wins:** 3n³ + 50n² + 7 = Θ(n³).
- **The base of the logarithm does not matter:** log₂ n = Θ(log₁₀ n), since they differ by a constant factor (log₂ n = log₁₀ n / log₁₀ 2).
- **Every polynomial loses to an exponential:** n¹⁰⁰ = O(1.01ⁿ). **Every power of a logarithm loses to a power of n:** (log n)¹⁰ = O(√n).
- **Stirling's formula:** n! ≈ √(2πn)·(n/e)ⁿ, so **log(n!) = Θ(n log n)** (useful for the sorting lower bound).

### Complexity of composed programs {own}

:::own
Quick rules for computing the complexity of code (added by the author; needed e.g. for class task 5).
:::

- **Statements in sequence:** complexities **add up** → the largest wins. Θ(n) + Θ(n²) = Θ(n²).
- **A loop executed k times:** **multiply** the body's complexity **by k**. A loop running n times with a Θ(log n) body → Θ(n log n).
- **Nested loops:** multiply the iteration counts. `for i < n { for j < n {…} }` → n · n = n².
- **A loop whose counter is halved** (`i := i div 2`) → log n iterations.
- **The expected value of a sum = the sum of expected values**, so the average complexities of consecutive calls simply add up.
- If we know only a **lower bound** (Ω) of some part, the whole is also known only from below.

Example: how many times does the loop body run for typical code shapes?

```java title="Growth.java"
@include t03-growth.java
```

```text title="Program output"
       n      log n            n        n log n              n^2
      16          4           16             64              256
      64          6           64            384             4096
     256          8          256           2048            65536
    1024         10         1024          10240          1048576
    4096         12         4096          49152         16777216
   16384         14        16384         229376        268435456
```

Look: when n grows **4 times**, log n grows by **2**, n — 4 times, and n² — as much as **16 times**.

## Why exponential algorithms are useless

The table from the lecture: the running time of an algorithm performing **2ⁿ** operations on a computer doing 10⁶ or 10⁹ operations per second.

| Size n | 20 | 50 | 100 | 200 |
|---|---|---|---|---|
| 10⁶ operations/s | 1.04 s | 35.7 years | 4·10¹⁴ centuries | 5·10⁴⁴ centuries |
| 10⁹ operations/s | 0.001 s | 13 days | 4·10¹¹ centuries | 5·10⁴¹ centuries |

Even a **1000-fold** faster computer gives nothing: for n = 100 instead of 4·10¹⁴ centuries we wait "only" 4·10¹¹ centuries.

:::def
An algorithm is called **impractical** (infeasible) when its complexity is exponential in the input size. For large inputs such an algorithm cannot be used — regardless of the computer's power.
:::

### A faster computer vs larger inputs {own}

:::own
Computing "how a faster computer affects the input size" is a typical class task, while the lecture only hints at it with the table — here is the method step by step.
:::

Assume time = c · f(n), where c is the time of one "unit". If for input size x the time is t, then **c = t / f(x)**. Then:

- **time for another size y:** c · f(y),
- **maximum size within time t':** the largest n with c · f(n) ≤ t',
- **a computer p times faster:** divide the time by p.

| f(n) | A 1000× faster computer lets n grow… |
|---|---|
| n | 1000 times |
| n² | about 31.6 times (√1000) |
| n³ | 10 times (∛1000) |
| 2ⁿ | only by about **10** (because 2¹⁰ ≈ 1000) |

## The square root again: the input size is the number of digits

Let us go back to the two ⌊√n⌋ algorithms from topic 2. Take the comparison in the loop guard as the dominant operation.

- **Linear version:** W(n) = √n, Δ(n) = 0, A(n) = √n, δ(n) = 0.
- **Binary version:** about log₂ n iterations.

But careful: for numbers **the input size is the number of digits** d ≈ log n, not the value n itself! Then:

- linear version: **W(d) = 2^(d/2)** — **exponential** complexity!
- binary version: **W(d) = d** — **linear** complexity.

The difference is enormous for big numbers (e.g. 100-digit ones).

:::exam
Question "what is the complexity of an algorithm on numbers?" — always make sure whether it is complexity **with respect to the value** n or **with respect to the input size** (number of digits/bits). An algorithm that looks "linear" (n iterations) is exponential in the number of bits.
:::

## When complexity is not everything

The lecture reminds us of the limits of this analysis:

1. the algorithm and its implementation (program) are written in different languages — constants may differ,
2. sensitivity to data may make the program behave differently on **our** data than W(n) and A(n) suggest,
3. the real data distribution (Xₙ) is hard to predict,
4. for some algorithms exact estimates of A(n) are unknown,
5. sometimes one algorithm is better for some data and another for other data.

**Simplicity** is also an important property. A simpler algorithm is worth choosing when the program will be run **only a few times** or only for **small inputs**.


## 2026/2027 lecture version (M. Sydow) — definitions for the tests

:::exam
The 2026/2027 tests use M. Sydow's wording. The main differences from the text above: the notations **W(n)**, **A(n)**, **S(n)** (no "sensitivity" Δ, δ), **five** variants of asymptotic notation (also **o** and **ω**) and an alternative definition via the **limit of the ratio**. A complexity analysis without stating the **dominant operation** and the **data size** is incomplete.
:::

A good algorithm has two features: it returns a **correct result** (total correctness — [topic 2](topic:t02)) and it is **efficient** — it achieves the result with minimal use of resources: amount of work (time) and memory. Lower complexity = a more efficient algorithm. A measure of speed should be **independent of the language/platform** and as **independent of the data** as possible — so we **count basic operations**.

:::def Dominant operations
A set of **dominant operations** is a set of operations whose number is **proportional to the number of all operations** performed by the whole algorithm. A dominant operation is **not**, e.g., an operation executed only once; on the other hand, **every loop** or branch of a conditional statement should contain a dominant operation.
:::

Example from the slides — `find(arr, len, key)` (returns the index of the key or −1):

```pseudo
find(arr, len, key){
  i = 0
  while(i < len){
    if(arr[i] == key)
      return i
    i++
  }
  return -1
}
```

| Candidate | Dominant? |
|---|---|
| assignment `i = 0` | no (executed once) |
| comparison `i < len` | yes |
| comparison `arr[i] == key` | yes |
| both together | yes (though not necessary) |
| `return i` | no (at most once) |
| `i++` | yes |

**Two steps required before a complexity analysis:** (1) determine the set of **dominant operations**, (2) determine the function of the arguments that is the **size of the input data**. In `find` the data size is the **length of the array** (len = n).

:::def Time and space complexity
- **Time complexity** — the number of dominant operations the algorithm performs, **as a function of the data size**.
- **Worst-case (pessimistic) time complexity:** **W(n) = sup { t(d) : d ∈ Dₙ }**, where Dₙ is the set of all inputs of size n and t(d) the number of dominant operations for input d (W — *worst*).
- **Average time complexity:** **A(n) = Σ_{k≥0} pₙₖ · k = Σ P(Xₙ = k) · k = E(Xₙ)** — the expected value of the random variable Xₙ (the number of dominant operations for random input of size n); it requires assuming a **model of data randomness** (the distribution pₙₖ) (A — *average*).
- **Space complexity S(n)** — the number of memory units used by the algorithm as a function of the data size; analogously worst-case **SW(n)** and average **SA(n)**. When memory does not depend on the data: **S(n) = const = O(1)**.
:::

For `find` the number of comparisons `arr[i] == key` ranges from 1 (key at the start — the "optimistic" case) to n (at the end or missing — "pessimistic"), so **W(n) = n**. Assuming the key is at each position with equal probability 1/n (k-th position → k comparisons): **A(n) = Σ_{k=1..n} (1/n)·k = (n+1)/2** — "on average in the middle of the array". Memory: **SA(n) = O(1)**.

### Five variants of asymptotic notation

We are interested in the **character of the growth rate**, not the specific function: e.g. in A(n) = 3.45·n + 2 the "+2" is irrelevant, and if we only care that the function is **linear**, so is the constant 3.45.

| Notation | Analogue | Meaning |
|---|---|---|
| f = **Θ(g)** | = | the same order: f = O(g) ∧ g = O(f) |
| f = **O(g)** ("big O") | ≤ | **non-strict** upper bound |
| f = **Ω(g)** ("big omega") | ≥ | **non-strict** lower bound |
| f = **o(g)** ("little o") | < | **strict** upper bound |
| f = **ω(g)** ("little omega") | > | **strict** lower bound |

Capital letters — bounds "with equality" (non-strict), small letters — strict. The analogy with numbers is not complete, because numbers are linearly ordered and orders of functions are not.

:::def Definitions
- **f(n) = O(g(n)) ⇔ ∃ c>0 ∃ n₀ ∀ n≥n₀: f(n) ≤ c·g(n)** — g is an upper bound on the order of f.
- **f(n) = Θ(g(n)) ⇔ f(n) = O(g(n)) ∧ g(n) = O(f(n))** — the same order of magnitude.
- f(n) = Ω(g(n)) ⇔ ∃ c>0 ∃ n₀ ∀ n≥n₀: f(n) ≥ c·g(n) (equivalently g = O(f)).
- f(n) = o(g(n)) ⇔ ∀ c>0 ∃ n₀ ∀ n≥n₀: f(n) ≤ c·g(n) (for **every** constant, not for some).
- f(n) = ω(g(n)) ⇔ ∀ c>0 ∃ n₀ ∀ n≥n₀: f(n) ≥ c·g(n).
:::

:::own
The slides give the quantifier definitions of O and Θ and the meaning of the other symbols; the definitions of Ω, o, ω in the same form were added by the site author (standard, as in Cormen's textbook).
:::

**Definition via a limit** (equivalent; f, g positive): compute lim_{n→∞} f(n)/g(n). If the limit exists, then:
- **∞** → f has a **higher** order: f = ω(g),
- **a positive constant** → the orders are **equal**: f = Θ(g),
- **0** → f has a **lower** order: f = o(g).

**Examples from the slides:** A(n) = (n+1)/2 = O(n); SA(n) = O(1); f(n) = 3n² + 2n − 7 is **not** O(n), but it is O(n²) and also O(n³) (a less precise bound); n² + n − 3 = Θ(n²) — it is enough to focus on the **dominant** term. W(n) = o(n) means: "the order of the worst-case complexity is significantly lower than linear".

:::warn Remarks on the notation
The "=" in f(n) = O(g(n)) does **not** mean ordinary equality — it is just a kind of notation. You cannot, e.g., subtract both sides, and the notation is used mainly on the **right-hand side** of "=". Writing "O(f(n)) = n" or "O(f(n)) = O(g(n))" **makes no sense**. An extended form is allowed, e.g. **f(n) = g(n) + O(h(n))**, meaning f(n) − g(n) = O(h(n)).
:::

### The most common orders (from the slides)

constant (S(n) = 3 = Θ(1)) ≺ logarithmic (W(n) = 2 + lg₂ n = Θ(log n)) ≺ linear (A(n) = 2n + 1 = Θ(n)) ≺ linear-logarithmic (1.44·n log n = Θ(n log n)) ≺ quadratic (3n² + 4 = Θ(n²)) ≺ cubic (Θ(n³)) ≺ sub-exponential (Θ(n^(log n))) ≺ exponential (Θ(2ⁿ)) ≺ factorial (Θ(n!)).

Algorithms with time complexity higher than polynomial are considered **impractical** except for small inputs.

**Practical rules (from the slides):**
- a sum of several terms → the order is determined by the **dominant term**; a polynomial has the order of its highest-degree term,
- every power function n^α (α ∈ ℝ) has a **different** order, depending on α,
- there is only **one** logarithmic order — the base of the logarithm does not matter,
- log_β n has a strictly lower order than **any** power n^α (even α = 0.0001),
- every exponential function γⁿ has a different order depending on γ, and every one (γ > 1) has a strictly higher order than every power n^α.

### Control questions (from the slides)

- What do we measure the "speed" of an algorithm with? Which 2 steps must be done before a time-complexity analysis?
- Definition by heart and determining for a given algorithm: dominant operation, data size, W(n), A(n) (for very simple algorithms), space complexity.
- What is the purpose of asymptotic notation? Definitions (by heart) and interpretation of the 5 variants.
- Prove from the definition that an expression with asymptotic notation is true or false — e.g. **n² + 5n + 2 = O(n²)** (c = 8, n₀ = 1), but **≠ O(n)** (solution: [Tests 2026/2027](page:exams)).

=== summary ===

## 2026/2027 version (M. Sydow)

- Before the analysis: **dominant operations** + **data size**.
- **W(n) = sup{t(d) : d ∈ Dₙ}**, **A(n) = Σ pₙₖ·k = E(Xₙ)**, **S(n)** (SW, SA); constant memory: S(n) = O(1).
- 5 notations: Θ (=), O (≤), Ω (≥), o (<), ω (>); O: ∃c>0 ∃n₀ ∀n≥n₀ f ≤ c·g; Θ: O both ways.
- Limit of f/g: ∞ → ω, constant > 0 → Θ, 0 → o.
- find: W(n) = n, A(n) = (n+1)/2, SA(n) = O(1).


## Basics

- **Complexity** = resource usage (time, extra memory) as a function of the **input size n**.
- **Dominant operation** — the number of all operations is proportional to it (sorting: comparisons).
- Numbers: size = **number of digits/bits** (d ≈ log n).

## Measures

| Symbol | Name | Formula |
|---|---|---|
| W(n) | worst case | sup { t(d) : d ∈ Dₙ } |
| A(n) | expected | Σ k·pₙₖ |
| Δ(n) | worst-case sensitivity | sup { t(d₁) − t(d₂) } |
| δ(n) | expected sensitivity | dev(Xₙ) |

Sequential search with a sentinel: W = n+1, A = (n+1)/2, Δ = n, δ ≈ 0.29n.

## Notations

- f = **O(g)**: ∃ c > 0, n₀: f(n) ≤ c·g(n) for n > n₀.
- f = **Ω(g)** ⇔ g = O(f); f = **Θ(g)** ⇔ both O and Ω.
- 1 ≺ log n ≺ √n ≺ n ≺ n log n ≺ n² ≺ n³ ≺ 2ⁿ ≺ n!.
- drop constants and lower terms; log base irrelevant; log n! = Θ(n log n).

## Computing the complexity of code

- sequence → **sum** (the largest wins), loop k times → **times k**, nested loops → product, halving counter → log n.
- p× faster computer: time / p; for 2ⁿ the size grows only by log₂ p.
- c = t / f(x); time for y: c·f(y).

## Exponential = infeasible

2ⁿ for n = 100 at 10⁹ op/s ≈ 4·10¹¹ centuries. Faster hardware does not help — a better algorithm does.

=== tasks ===

:::task level=1 source="“Ćwiczenia 4”, task 1 (modified)" title="Complexity of three simple algorithms"
Estimate the **average** and **worst-case** time complexity (dominant operation: the arithmetic operation in the loop body). Give it with respect to the value n and with respect to the input size d (number of bits of n).

```pseudo
a) sumTo(n) {
     i := 1; s := 0;
     while i <= n do { s := s + i; i := i + 1 }
     return s
   }

b) sumDown(n) {
     s := 0;
     while n > 0 do { s := s + n; n := n - 1 }
     return s
   }

c) countBits(n) {
     c := 0;
     while n > 0 do { c := c + 1; n := n div 2 }
     return c
   }
```
::hint
In a) and b) the number of iterations does not depend on the "kind" of data — only on n. In c) n is halved. Remember: n ≈ 2ᵈ.
::solution
For each value of n the number of iterations is **fixed**, so W(n) = A(n) (sensitivity 0).

- **a)** n iterations → W(n) = A(n) = **Θ(n)**. In bits: n ≈ 2ᵈ → **Θ(2ᵈ)** (exponential!).
- **b)** also n iterations → **Θ(n)**, i.e. **Θ(2ᵈ)** in bits. Dropping the variable `i` does not change the complexity.
- **c)** n halved down to 0 → ⌊log₂ n⌋ + 1 iterations → **Θ(log n)**, and in bits exactly **d**, i.e. **Θ(d)** (linear).

Takeaway: (a) and (b) compute the same thing (the sum 1+…+n), but using the formula n(n+1)/2 we would get Θ(1) arithmetic operations.
:::

:::task level=1 source="“Ćwiczenia 4”, task 2 (modified)" title="True or false: orders of functions"
Consider functions of a variable n ∈ ℕ. Which statements are true?

1. The sequence of functions n², √n · log n, log¹⁰ n, log log n is **strictly decreasing** with respect to orders.
2. The sequence of functions n^(1/50), n^(1/3), n⁴, 2^(n/3) is **strictly increasing** with respect to orders.
3. n^√2 + n^√5 + n⁵ + n⁹ = O(10^(n/2) + 2^(n/3) + n^(1/2) + n^π).
4. n³ = O(n² · log n).
::hint
Compare in pairs, e.g. by dividing one function by the other and computing the limit. Remember: every power of log loses to any power of n, and every power of n loses to an exponential function.
::solution
1. **True.** n² ≻ √n·log n (since n²/(√n log n) = n^1.5/log n → ∞); √n·log n ≻ log¹⁰ n (a power of n beats a power of log); log¹⁰ n ≻ log log n.
2. **True.** 1/50 < 1/3 < 4, and 2^(n/3) is exponential, so it grows faster than n⁴.
3. **True.** The left side = Θ(n⁹), the right side contains 10^(n/2) = (√10)ⁿ — exponential, so it dominates any polynomial.
4. **False.** n³/(n² log n) = n/log n → ∞, so n³ grows faster than n² log n.
:::

:::task level=2 source="“Ćwiczenia 4”, task 3 (modified)" title="True or false: lower bounds"
"g is a correct lower bound of f" means f = Ω(g); "tight" — f = Θ(g). Which statements are true?

1. The function n! is a correct lower bound of 50ⁿ + n⁵⁰ + 2^√n.
2. The function n² is a correct (but not tight) lower bound of n³ + log n.
3. The function n⁵⁰ is a correct lower bound of 2^√n.
4. The function n³ is a correct and tight lower bound of n³ + 5n² log n.
::hint
In 1 compare n! with 50ⁿ (what happens when n > 100?). In 3 take logarithms of both: √n versus 50 · log₂ n.
::solution
1. **False.** The dominant term is 50ⁿ, and n! grows faster than cⁿ for every constant c (e.g. n!/50ⁿ → ∞). So it is not true that f = Ω(n!).
2. **True.** n³ + log n ≥ n² from some point on, so f = Ω(n²); it is not tight because f ≠ O(n²).
3. **True.** log₂(2^√n) = √n, log₂(n⁵⁰) = 50 log₂ n, and √n grows faster than 50 log n. So 2^√n = Ω(n⁵⁰) (it holds "from some n on" — for small n it is the other way round, but asymptotic notation allows that).
4. **True.** n³ + 5n² log n = Θ(n³), since 5n² log n = o(n³).
:::

:::task level=2 source="“Ćwiczenia 4”, task 4 (modified)" title="A faster computer, larger inputs"
Algorithm Alg has complexity f(n). For input size x on computer K it runs t seconds. Answer:
- how long will it take on K for inputs **p times smaller**,
- what is the **maximum** input size it can process on K within t' seconds,
- how long will it take on computer K', **p' times faster**, for input size x'.

a) f(n) = log₂ n, x = 256, t = 8 s, p = 4, t' = 10 s, p' = 4, x' = 1024
b) f(n) = n³, x = 10, t = 20 s, p = 2, t' = 160 s, p' = 8, x' = 40
c) f(n) = 2ⁿ, x = 6, t = 128 s, p = 2, t' = 2048 s, p' = 16, x' = 12
::hint
First compute c = t / f(x) — the time of one "unit" of work. Then everything is c · f(…).
::solution
**a)** c = 8 / log₂ 256 = 8/8 = 1 s.
- input 256/4 = 64: 1 · log₂ 64 = **6 s**,
- log₂ n ≤ 10 ⇒ n = **1024**,
- 1 · log₂ 1024 / 4 = 10/4 = **2.5 s**.

**b)** c = 20 / 10³ = 0.02 s.
- input 5: 0.02 · 125 = **2.5 s**,
- 0.02 · n³ ≤ 160 ⇒ n³ ≤ 8000 ⇒ n = **20**,
- 0.02 · 40³ / 8 = 0.02 · 64000 / 8 = **160 s**.

**c)** c = 128 / 2⁶ = 2 s.
- input 3: 2 · 2³ = **16 s**,
- 2 · 2ⁿ ≤ 2048 ⇒ 2ⁿ ≤ 1024 ⇒ n = **10**,
- 2 · 2¹² / 16 = 8192/16 = **512 s**.

Observation: for 2ⁿ a 16 times faster computer lets the input grow by only log₂ 16 = 4 elements.
:::

:::task level=3 source="“Ćwiczenia 4”, task 5 (modified)" title="Complexity of programs built from other algorithms"
Algorithms Alg₁, Alg₂, Alg₃ have complexity:
- T(Alg₁, n) = Θ(√n),
- A(Alg₂, n) = Θ(log n), W(Alg₂, n) = O(n),
- A(Alg₃, n) = Θ(n), W(Alg₃, n) = Ω(n²).

Determine (as precisely as possible) the average and worst-case complexity of:

```java
// (a)
void P(int n) { int i = n; while (i > 0) { Alg1(n); i--; } }

// (b)
void Q(int n) { for (int i = 0; i < n; i++) { Alg3(n); Alg2(n); } }

// (c)
void R(int n) {
    for (int i = 0; i < n; i++) Alg1(n);
    for (int i = 0; i < n; i++) { Alg2(n); Alg3(n); }
}

// (d)
void S(int n) {
    for (int i = 0; i < n; i++) {
        Alg1(n);
        for (int j = 0; j < n; j++) { Alg2(n); Alg3(n); }
    }
}
```
::hint
Average complexities add up and get multiplied by the number of iterations. For the worst case: if some part is known only from below (Ω), the result is also known only from below.
::solution
- **(a)** n times Θ(√n) → A = W = **Θ(n√n)**.
- **(b)** A = n · (Θ(n) + Θ(log n)) = **Θ(n²)**. W: each call of Alg₃ may cost Ω(n²), so W = **Ω(n³)** (no upper bound is known, since about W(Alg₃) we only know it is at least n²).
- **(c)** A = n·√n + n·(log n + n) = **Θ(n²)**. W = **Ω(n³)** (from the second loop).
- **(d)** A = n · (√n + n·(log n + n)) = **Θ(n³)**. W = **Ω(n⁴)**.

Note that always W ≥ A, so e.g. in (b) we know immediately that W = Ω(n²) — but we know the better bound Ω(n³).
:::
