---
id: t08
num: 8
type: topic
title: Multiplying numbers and polynomials — Karatsuba's algorithm and FFT
short: Karatsuba and FFT
desc: Why schoolbook multiplication is quadratic, how divide and conquer with three multiplications gives n^1.585, and how the fast Fourier transform gets down to n log n.
sources: Dziel-Rzadz-FFT.pdf
exercises: no class problem set — tasks by the site author
---

## Schoolbook multiplication is quadratic

Multiplying two n-digit numbers "in columns", we multiply **every digit by every digit**:

```text title="5491 · 1234 in columns"
      5491
    × 1234
    ------
     21964
    16473
   10982
+ 5491
----------
   6775894
```

That is **n² multiplications** of single digits (and about n² additions), and the result has 2n or 2n − 1 digits. For numbers with a million digits that is 10¹² operations. Can it be done faster?

## Multiplying polynomials

A number written in digits is almost a polynomial: 5491 = 1 + 9·10 + 4·10² + 5·10³ (x = 10). That is why the lecture deals with **multiplying polynomials** — it is the same problem.

:::def
For A(x) = Σᵢ₌₀ⁿ⁻¹ aᵢxⁱ and B(x) = Σᵢ₌₀ⁿ⁻¹ bᵢxⁱ the product C(x) = A(x)·B(x) = Σᵢ₌₀²ⁿ⁻² cᵢxⁱ, where

**cᵢ = Σⱼ aⱼ · bᵢ₋ⱼ**, i.e. c₀ = a₀b₀, c₁ = a₀b₁ + a₁b₀, c₂ = a₀b₂ + a₁b₁ + a₂b₀, …
:::

Computing it directly from the formula again takes **n²** coefficient multiplications.

## First idea: plain divide and conquer — no gain

Let n = 2ᵏ (pad with zeros if needed). Split each polynomial into the **lower** and **upper** half of its coefficients:

- A(x) = Aₗ(x) + x^(n/2)·Aₕ(x), B(x) = Bₗ(x) + x^(n/2)·Bₕ(x).

Example: W(x) = 7x⁷ + 6x⁶ + 5x⁵ + 4x⁴ + 3x³ + 2x² + x − 1 has Wₕ(x) = 7x³ + 6x² + 5x + 4 and Wₗ(x) = 3x³ + 2x² + x − 1, and W(x) = Wₗ(x) + x⁴·Wₕ(x).

Then:

**A·B = AₗBₗ + x^(n/2)·(AₗBₕ + AₕBₗ) + xⁿ·AₕBₕ** — four multiplications of polynomials half the size.

Number of multiplications: T(1) = 1, T(n) = 4T(n/2), i.e. **T(n) = n²**. No gain — we need a cleverer idea.

## Karatsuba's algorithm — three multiplications instead of four

We start the same way, but compute only **three** products:

- **L(x) := Aₗ(x)·Bₗ(x)**
- **H(x) := Aₕ(x)·Bₕ(x)**
- **S(x) := (Aₗ(x) + Aₕ(x))·(Bₗ(x) + Bₕ(x))**

Note that S = AₗBₗ + AₗBₕ + AₕBₗ + AₕBₕ, so **the middle part** AₗBₕ + AₕBₗ = **S − L − H** — without an extra multiplication! Therefore:

:::def
**A(x)·B(x) = L(x) + x^(n/2)·(S(x) − L(x) − H(x)) + xⁿ·H(x)**
:::

**Lecture example:** A(x) = 1 + 2x, B(x) = 3 + 4x (n = 2), so Aₗ = 1, Aₕ = 2, Bₗ = 3, Bₕ = 4.

| Quantity | Value |
|---|---|
| L = AₗBₗ | 1 · 3 = 3 |
| H = AₕBₕ | 2 · 4 = 8 |
| S = (Aₗ + Aₕ)(Bₗ + Bₕ) | 3 · 7 = 21 |
| M = S − L − H | 21 − 3 − 8 = 10 |

Result: A·B = 3 + 10x + 8x² ✓ (check: (1 + 2x)(3 + 4x) = 3 + 4x + 6x + 8x²).

### Complexity

K(1) = 1, **K(n) = 3·K(n/2)** ⇒ for n = 2ᵏ: **K(n) = 3ᵏ = n^(log₂ 3) ≈ n^1.585**.

We owe the success to reducing the number of multiplications **from 4 to 3** when going down to n/2. There are a few more additions, but only O(n) per level. The lecture says Karatsuba's algorithm pays off for numbers with **a few hundred bits** (from about 320 bits).

:::analogy
Instead of four expensive visits to four specialists you make three and "subtract" their results to work out what the fourth would have said. Saving a quarter on every recursion level adds up to a huge difference: for n = 1024 it is 59,049 instead of 1,048,576 multiplications.
:::

```java title="Karatsuba.java (implementation by the site author)"
@include t08-karatsuba.java
```

## The big challenge: down to two multiplications?

To go even lower we need **a different idea** — the lecture turns to **interpolation**.

:::def
**The interpolation property:** there is **exactly one** polynomial of degree n whose graph passes through n + 1 given points with distinct x-coordinates.
:::

Moreover, for every x: **C(x) = A(x)·B(x)**. So if we know the values of A and B at 2n − 1 points, the values of C at those points take **2n − 1 ordinary number multiplications**, and from them — uniquely — the polynomial C.

**Problems:**

1. evaluating a polynomial of degree n at one point takes O(n) multiplications (**Horner's scheme**), so at n points — **O(n²)**,
2. recovering the coefficients from the values is **interpolation** — Lagrange's formula: A(x) = Σᵢ yᵢ · Πⱼ≠ᵢ (x − xⱼ)/(xᵢ − xⱼ) — also O(n²).

Maybe keep polynomials as **values at points** from the start? Then multiplication and addition are linear… but we lose almost everything else (easily computing values at new points, derivatives, roots, readability) — "a bucket of cold water".

**A spark of hope:** the fact that one value costs O(n) does not mean that n values must cost O(n²). We are **free to choose the points** — maybe they can be chosen so that computations at some points are reused at others?

## FFT — the fast Fourier transform (Cooley, Tukey, 1965)

Cooley and Tukey showed that the best points are the **n-th roots of unity** in the complex plane: ω⁰, ω¹, …, ωⁿ⁻¹, where ω = e^(2πi/n).

:::def
Properties (n = 2ᵏ, exponents taken modulo n):
- (ωⁱ)ʲ = ωⁱ ʲ, ωⁱ · ωʲ = ωⁱ⁺ʲ,
- **(ωₙⁱ)² = ωₙ/₂ⁱ** — the squares of the n-th roots of unity are the n/2-th roots of unity (each appears twice),
- ω^(n/2) = −1, so ω^(k + n/2) = −ωᵏ.
:::

:::analogy
The roots of unity are n points spread evenly on a circle like hours on a clock face. Squaring "doubles the angle" — and suddenly 8 points turn into only 4 different ones. That is exactly what lets us split the problem in half.
:::

### Splitting into even and odd parts

We split the polynomial into terms with **even** and **odd** powers. From the odd ones we factor out x:

A(x) = a₀ + a₁x + a₂x² + … + a₇x⁷
 = (a₀ + a₂x² + a₄x⁴ + a₆x⁶) + x·(a₁ + a₃x² + a₅x⁴ + a₇x⁶)
 = **Aₑ(x²) + x·Aₒ(x²)**,

where Aₑ and Aₒ have degree n/2 − 1 (in the variable y = x²).

For n = 8:

| point | formula |
|---|---|
| A(ω⁰) | Aₑ(ω₄⁰) + ω⁰·Aₒ(ω₄⁰) |
| A(ω¹) | Aₑ(ω₄¹) + ω¹·Aₒ(ω₄¹) |
| A(ω²) | Aₑ(ω₄²) + ω²·Aₒ(ω₄²) |
| A(ω³) | Aₑ(ω₄³) + ω³·Aₒ(ω₄³) |
| A(ω⁴) | Aₑ(ω₄⁰) + ω⁴·Aₒ(ω₄⁰) |
| A(ω⁵) | Aₑ(ω₄¹) + ω⁵·Aₒ(ω₄¹) |
| A(ω⁶) | Aₑ(ω₄²) + ω⁶·Aₒ(ω₄²) |
| A(ω⁷) | Aₑ(ω₄³) + ω⁷·Aₒ(ω₄³) |

It is enough to compute the values of **two polynomials of degree n/2 − 1 at n/2 points** (recursively, the same way) and perform **n multiplications**:

- T(1) = 1, **T(n) = 2T(n/2) + n** ⇒ **T(n) = O(n log n)**.

### Multiplying polynomials with FFT

1. FFT: values of A at the n roots of unity — O(n log n),
2. FFT: values of B — O(n log n),
3. multiply the values: sₖ = A(ωᵏ)·B(ωᵏ) — n multiplications,
4. **interpolation** — recover the coefficients of C from the values s₀, …, sₙ₋₁.

So far a "half success": 2(n log n + n) multiplications, but a fast interpolation is missing.

### The key idea: interpolation is also an FFT

Let the unknown polynomial be R(x) = Σⱼ rⱼxʲ, with known values R(ωⁱ) = sᵢ. Build the polynomial S(x) = Σⱼ sⱼxʲ **with the known values as coefficients** and evaluate it at ω⁻ᵗ (the point symmetric to ωᵗ with respect to the real axis). The lecture's computation gives:

**S(ω⁻ᵗ) = n · rₜ**, i.e. **rₜ = S(ω⁻ᵗ) / n**.

So interpolation at the roots of unity is:

1. form S(x) from the values s₀, …, sₙ₋₁,
2. compute the **FFT** of S (at the points ω⁻ᵗ),
3. divide the results by n.

The total cost of multiplying polynomials: **3n log n + n multiplications** — i.e. **O(n log n)** instead of n²!

```java title="FFT.java (implementation by the site author)"
@include t08-fft.java
```

:::info
The FFT has had an "extraordinary career" — it is used in signal, sound and image processing (e.g. compression), and for multiplying huge numbers (e.g. when searching for record prime numbers).
:::

:::warn A note from the site author
In practice FFT works with floating-point numbers — the result must be **rounded** (`Math.round`), and for very large inputs rounding errors may interfere. Then a version working modulo a prime (NTT) is used.
:::

=== summary ===

## Multiplication

- schoolbook: **n²** digit multiplications; polynomials: cᵢ = Σⱼ aⱼbᵢ₋ⱼ.
- split A = Aₗ + x^(n/2)Aₕ; 4 products → T(n) = 4T(n/2) = **n²** (no gain).

## Karatsuba

- L = AₗBₗ, H = AₕBₕ, S = (Aₗ + Aₕ)(Bₗ + Bₕ), middle = **S − L − H**.
- **A·B = L + x^(n/2)(S − L − H) + xⁿH**.
- K(n) = 3K(n/2) ⇒ **n^(log₂ 3) ≈ n^1.585**; pays off from ~320 bits.
- (1 + 2x)(3 + 4x): L = 3, H = 8, S = 21, M = 10 → 3 + 10x + 8x².

## Interpolation

- a polynomial of degree n ⇔ its values at n + 1 points; C(x) = A(x)B(x) pointwise.
- Horner O(n) per point; Lagrange O(n²).

## FFT (Cooley–Tukey 1965)

- points: n-th roots of unity; (ωₙⁱ)² = ωₙ/₂ⁱ; ω^(n/2) = −1.
- **A(x) = Aₑ(x²) + x·Aₒ(x²)**; T(n) = 2T(n/2) + n = **O(n log n)**.
- interpolation: **rₜ = S(ω⁻ᵗ)/n** — also an FFT.
- polynomial multiplication: 2× FFT + n multiplications + inverse FFT ≈ 3n log n + n.

=== tasks ===

:::task level=1 source="own" title="Karatsuba for two binomials"
Multiply with Karatsuba's algorithm the polynomials **A(x) = 3 + 5x** and **B(x) = 2 + 7x**. Give L, H, S, M and the result. Check by multiplying directly.
::hint
Aₗ = 3, Aₕ = 5, Bₗ = 2, Bₕ = 7.
::solution
- L = 3 · 2 = **6**
- H = 5 · 7 = **35**
- S = (3 + 5)(2 + 7) = 8 · 9 = **72**
- M = S − L − H = 72 − 6 − 35 = **31**

A·B = **6 + 31x + 35x²**. Check: (3 + 5x)(2 + 7x) = 6 + 21x + 10x + 35x² ✓. We used 3 multiplications instead of 4.
:::

:::task level=2 source="own" title="Karatsuba on numbers"
Compute **47 · 63** with Karatsuba's method, treating the numbers as polynomials in x = 10 (47 = 7 + 4x, 63 = 3 + 6x).
::hint
After computing the coefficients c₀, c₁, c₂ substitute x = 10 (the carries "compute themselves").
::solution
- L = 7 · 3 = 21, H = 4 · 6 = 24, S = (7 + 4)(3 + 6) = 11 · 9 = 99, M = 99 − 21 − 24 = 54.
- Polynomial: 21 + 54x + 24x².
- For x = 10: 21 + 540 + 2400 = **2961** ✓ (47 · 63 = 2961).
:::

:::task level=1 source="own" title="How many multiplications?"
How many coefficient multiplications does Karatsuba's algorithm make for polynomials with **n = 8** and **n = 16** coefficients? How many would the schoolbook method make? How many times fewer is it for n = 1024?
::hint
K(n) = 3K(n/2), K(1) = 1, so K(2ᵏ) = 3ᵏ.
::solution
- n = 8 = 2³: K = 3³ = **27** (schoolbook 64),
- n = 16 = 2⁴: K = 3⁴ = **81** (schoolbook 256),
- n = 1024 = 2¹⁰: K = 3¹⁰ = **59,049** vs 1,048,576 — about **17.8 times** fewer.
:::

:::task level=2 source="own" title="Values at the roots of unity"
For **A(x) = 1 + 2x + 3x² + 4x³** compute the values at the four fourth roots of unity: 1, i, −1, −i. Do it the FFT way: write A(x) = Aₑ(x²) + x·Aₒ(x²).
::hint
Aₑ(y) = 1 + 3y, Aₒ(y) = 2 + 4y. For x = ±1 we have y = x² = 1, for x = ±i we have y = −1 — so two values of Aₑ and two of Aₒ are enough.
::solution
- y = 1: Aₑ(1) = 4, Aₒ(1) = 6; y = −1: Aₑ(−1) = −2, Aₒ(−1) = −2.
- A(1) = 4 + 1·6 = **10**
- A(i) = −2 + i·(−2) = **−2 − 2i**
- A(−1) = 4 + (−1)·6 = **−2**
- A(−i) = −2 + (−i)·(−2) = **−2 + 2i**

Check e.g. A(i) = 1 + 2i + 3i² + 4i³ = 1 + 2i − 3 − 4i = −2 − 2i ✓. Note that the pairs (1, −1) and (i, −i) use the same values of Aₑ, Aₒ — that is where FFT saves work.
:::

:::task level=3 source="own" title="Why roots of unity?"
Explain in your own words why FFT needs the points to be n-th roots of unity (and n to be a power of two). What would happen if we chose the points 1, 2, …, n?
::hint
What happens to the set of points after squaring them?
::solution
The recursion A(x) = Aₑ(x²) + x·Aₒ(x²) requires evaluating Aₑ and Aₒ at the points **x²**. For the n-th roots of unity the set of squares has only **n/2** elements and is the set of **n/2-th roots of unity** — exactly the same problem half the size (and so on down to n = 1, hence n = 2ᵏ). Therefore T(n) = 2T(n/2) + n = O(n log n).

For the points 1, 2, …, n the squares 1, 4, 9, …, n² are **all different** — the problem does not shrink at all (still n points), so there is no saving: the cost stays O(n²).
:::
