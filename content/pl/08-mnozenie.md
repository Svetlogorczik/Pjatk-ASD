---
id: t08
num: 8
type: topic
title: Mnożenie liczb i wielomianów — algorytm Karacuby i FFT
short: Karacuba i FFT
desc: Dlaczego szkolne mnożenie jest kwadratowe, jak „dziel i rządź” z trzema mnożeniami daje n^1,585 i jak szybka transformata Fouriera schodzi do n log n.
sources: Dziel-Rzadz-FFT.pdf
exercises: brak zestawu na ćwiczeniach — zadania od autora strony
---

## Szkolne mnożenie jest kwadratowe

Mnożąc „w słupku” dwie liczby n-cyfrowe, mnożymy **każdą cyfrę przez każdą**:

```text title="5491 · 1234 w słupku"
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

To **n² mnożeń** pojedynczych cyfr (i ok. n² dodawań), a wynik ma 2n albo 2n − 1 cyfr. Dla liczb o milionie cyfr to 10¹² operacji. Czy da się szybciej?

## Mnożenie wielomianów

Liczba zapisana cyframi to prawie wielomian: 5491 = 1 + 9·10 + 4·10² + 5·10³ (x = 10). Dlatego wykład zajmuje się **mnożeniem wielomianów** — to ten sam problem.

:::def
Dla A(x) = Σᵢ₌₀ⁿ⁻¹ aᵢxⁱ i B(x) = Σᵢ₌₀ⁿ⁻¹ bᵢxⁱ iloczyn C(x) = A(x)·B(x) = Σᵢ₌₀²ⁿ⁻² cᵢxⁱ, gdzie

**cᵢ = Σⱼ aⱼ · bᵢ₋ⱼ**, czyli c₀ = a₀b₀, c₁ = a₀b₁ + a₁b₀, c₂ = a₀b₂ + a₁b₁ + a₂b₀, …
:::

Liczenie wprost ze wzoru to znowu **n²** mnożeń współczynników.

## Pierwszy pomysł: zwykłe „dziel i rządź” — nic nie zyskujemy

Niech n = 2ᵏ (w razie czego dopisujemy zera). Dzielimy każdy wielomian na **dolną** i **górną** połowę współczynników:

- A(x) = Aₗ(x) + x^(n/2)·Aₕ(x), B(x) = Bₗ(x) + x^(n/2)·Bₕ(x).

Przykład: W(x) = 7x⁷ + 6x⁶ + 5x⁵ + 4x⁴ + 3x³ + 2x² + x − 1 ma Wₕ(x) = 7x³ + 6x² + 5x + 4 i Wₗ(x) = 3x³ + 2x² + x − 1, a W(x) = Wₗ(x) + x⁴·Wₕ(x).

Wtedy:

**A·B = AₗBₗ + x^(n/2)·(AₗBₕ + AₕBₗ) + xⁿ·AₕBₕ** — cztery mnożenia wielomianów o połowę mniejszych.

Liczba mnożeń: T(1) = 1, T(n) = 4T(n/2), czyli **T(n) = n²**. Nic nie zyskaliśmy — potrzebny jest sprytniejszy pomysł.

## Algorytm Karacuby — trzy mnożenia zamiast czterech

Zaczynamy tak samo, ale liczymy tylko **trzy** iloczyny:

- **L(x) := Aₗ(x)·Bₗ(x)**
- **H(x) := Aₕ(x)·Bₕ(x)**
- **S(x) := (Aₗ(x) + Aₕ(x))·(Bₗ(x) + Bₕ(x))**

Zauważ, że S = AₗBₗ + AₗBₕ + AₕBₗ + AₕBₕ, więc **środkowa część** AₗBₕ + AₕBₗ = **S − L − H** — bez dodatkowego mnożenia! Zatem:

:::def
**A(x)·B(x) = L(x) + x^(n/2)·(S(x) − L(x) − H(x)) + xⁿ·H(x)**
:::

**Przykład z wykładu:** A(x) = 1 + 2x, B(x) = 3 + 4x (n = 2), więc Aₗ = 1, Aₕ = 2, Bₗ = 3, Bₕ = 4.

| Wielkość | Wartość |
|---|---|
| L = AₗBₗ | 1 · 3 = 3 |
| H = AₕBₕ | 2 · 4 = 8 |
| S = (Aₗ + Aₕ)(Bₗ + Bₕ) | 3 · 7 = 21 |
| M = S − L − H | 21 − 3 − 8 = 10 |

Wynik: A·B = 3 + 10x + 8x² ✓ (sprawdź: (1 + 2x)(3 + 4x) = 3 + 4x + 6x + 8x²).

### Złożoność

K(1) = 1, **K(n) = 3·K(n/2)** ⇒ dla n = 2ᵏ: **K(n) = 3ᵏ = n^(log₂ 3) ≈ n^1,585**.

Sukces zawdzięczamy temu, że przy przejściu do n/2 zmniejszyliśmy liczbę mnożeń **z 4 do 3**. Dodawań jest trochę więcej, ale to tylko O(n) na poziom. Wykład podaje, że algorytm Karacuby opłaca się dla liczb **kilkusetbitowych** (od ok. 320 bitów).

:::analogy
Zamiast czterech drogich wizyt u czterech specjalistów robisz trzy i z ich wyników „odejmowaniem” wyliczasz, co powiedziałby czwarty. Oszczędność jednej czwartej na każdym poziomie rekursji daje w sumie ogromną różnicę: dla n = 1024 to 59 049 zamiast 1 048 576 mnożeń.
:::

```java title="Karatsuba.java (implementacja od autora strony)"
@include t08-karatsuba.java
```

## Wielkie wyzwanie: zejść do dwóch mnożeń?

Żeby zejść jeszcze niżej, potrzeba **innego pomysłu** — wykład sięga po **interpolację**.

:::def
**Własność interpolacyjna:** istnieje **dokładnie jeden** wielomian stopnia n, którego wykres przechodzi przez n + 1 zadanych punktów o różnych odciętych.
:::

Ponadto dla każdego x: **C(x) = A(x)·B(x)**. Jeśli więc znamy wartości A i B w 2n − 1 punktach, to wartości C w tych punktach dostajemy za pomocą **2n − 1 zwykłych mnożeń liczb**, a z nich — jednoznacznie — wielomian C.

**Problemy:**

1. obliczenie wartości wielomianu stopnia n w jednym punkcie wymaga O(n) mnożeń (**schemat Hornera**), więc w n punktach — **O(n²)**,
2. odtworzenie współczynników z wartości to **interpolacja** — wzór Lagrange'a: A(x) = Σᵢ yᵢ · Πⱼ≠ᵢ (x − xⱼ)/(xᵢ − xⱼ) — też O(n²).

Może trzymać wielomiany od razu jako **wartości w punktach**? Wtedy mnożenie i dodawanie są liniowe… ale tracimy prawie wszystko inne (łatwe liczenie wartości w nowych punktach, pochodne, pierwiastki, czytelność) — „kubeł zimnej wody”.

**Iskierka nadziei:** to, że wartość w jednym punkcie kosztuje O(n), nie znaczy, że w n punktach musi kosztować O(n²). Mamy **swobodę wyboru punktów** — może da się je dobrać tak, żeby obliczenia w jednych punktach wykorzystać w innych?

## FFT — szybka transformata Fouriera (Cooley, Tukey, 1965)

Cooley i Tukey pokazali, że najlepsze punkty to **n-te pierwiastki z jedności** na płaszczyźnie zespolonej: ω⁰, ω¹, …, ωⁿ⁻¹, gdzie ω = e^(2πi/n).

:::def
Własności (n = 2ᵏ, wykładniki liczone modulo n):
- (ωⁱ)ʲ = ωⁱ ʲ, ωⁱ · ωʲ = ωⁱ⁺ʲ,
- **(ωₙⁱ)² = ωₙ/₂ⁱ** — kwadraty n-tych pierwiastków z jedności to n/2-te pierwiastki z jedności (każdy występuje dwa razy),
- ω^(n/2) = −1, więc ω^(k + n/2) = −ωᵏ.
:::

:::analogy
Pierwiastki z jedności to n punktów rozmieszczonych równo na okręgu jak godziny na zegarze. Podniesienie do kwadratu „podwaja kąt” — i nagle z 8 punktów robią się tylko 4 różne. To właśnie pozwala dzielić problem na pół.
:::

### Podział na części parzyste i nieparzyste

Dzielimy wielomian na składniki o **parzystych** i **nieparzystych** potęgach. Z nieparzystych wyciągamy x przed nawias:

A(x) = a₀ + a₁x + a₂x² + … + a₇x⁷
 = (a₀ + a₂x² + a₄x⁴ + a₆x⁶) + x·(a₁ + a₃x² + a₅x⁴ + a₇x⁶)
 = **Aₑ(x²) + x·Aₒ(x²)**,

gdzie Aₑ i Aₒ mają stopień n/2 − 1 (zmiennej y = x²).

Dla n = 8:

| punkt | wzór |
|---|---|
| A(ω⁰) | Aₑ(ω₄⁰) + ω⁰·Aₒ(ω₄⁰) |
| A(ω¹) | Aₑ(ω₄¹) + ω¹·Aₒ(ω₄¹) |
| A(ω²) | Aₑ(ω₄²) + ω²·Aₒ(ω₄²) |
| A(ω³) | Aₑ(ω₄³) + ω³·Aₒ(ω₄³) |
| A(ω⁴) | Aₑ(ω₄⁰) + ω⁴·Aₒ(ω₄⁰) |
| A(ω⁵) | Aₑ(ω₄¹) + ω⁵·Aₒ(ω₄¹) |
| A(ω⁶) | Aₑ(ω₄²) + ω⁶·Aₒ(ω₄²) |
| A(ω⁷) | Aₑ(ω₄³) + ω⁷·Aₒ(ω₄³) |

Widać, że wystarczy policzyć wartości **dwóch wielomianów stopnia n/2 − 1 w n/2 punktach** (rekurencyjnie tym samym sposobem) oraz wykonać **n mnożeń**:

- T(1) = 1, **T(n) = 2T(n/2) + n** ⇒ **T(n) = O(n log n)**.

### Mnożenie wielomianów przez FFT

1. FFT: wartości A w n pierwiastkach z jedności — O(n log n),
2. FFT: wartości B — O(n log n),
3. mnożymy wartości: sₖ = A(ωᵏ)·B(ωᵏ) — n mnożeń,
4. **interpolacja** — odtwarzamy współczynniki C z wartości s₀, …, sₙ₋₁.

Na razie mamy „sukces połowiczny”: 2(n log n + n) mnożeń, ale brakuje szybkiej interpolacji.

### Kluczowy pomysł: interpolacja to też FFT

Niech szukany wielomian to R(x) = Σⱼ rⱼxʲ, a jego wartości R(ωⁱ) = sᵢ są znane. Zbudujmy wielomian S(x) = Σⱼ sⱼxʲ **ze znanych wartości jako współczynników** i policzmy jego wartość w punkcie ω⁻ᵗ (symetrycznym do ωᵗ względem osi rzeczywistej). Rachunek z wykładu daje:

**S(ω⁻ᵗ) = n · rₜ**, czyli **rₜ = S(ω⁻ᵗ) / n**.

Zatem interpolacja w pierwiastkach z jedności to:

1. utwórz S(x) z wartości s₀, …, sₙ₋₁,
2. oblicz **FFT** wielomianu S (w punktach ω⁻ᵗ),
3. podziel wyniki przez n.

Łączny koszt mnożenia wielomianów: **3n log n + n mnożeń** — czyli **O(n log n)** zamiast n²!

```java title="FFT.java (implementacja od autora strony)"
@include t08-fft.java
```

:::info
Algorytm FFT zrobił „niebywałą karierę” — wykorzystuje się go w przetwarzaniu sygnałów, dźwięku i obrazów (np. kompresja), a także do mnożenia ogromnych liczb (np. przy szukaniu rekordowych liczb pierwszych).
:::

:::warn Uwaga od autora strony
W praktyce FFT liczy na liczbach zmiennoprzecinkowych — wynik trzeba **zaokrąglić** (`Math.round`), a dla bardzo dużych danych błędy zaokrągleń mogą przeszkadzać. Wtedy stosuje się wersję na liczbach modulo (NTT).
:::

=== summary ===

## Mnożenie

- szkolne: **n²** mnożeń cyfr; wielomiany: cᵢ = Σⱼ aⱼbᵢ₋ⱼ.
- podział A = Aₗ + x^(n/2)Aₕ; 4 iloczyny → T(n) = 4T(n/2) = **n²** (brak zysku).

## Karacuba

- L = AₗBₗ, H = AₕBₕ, S = (Aₗ + Aₕ)(Bₗ + Bₕ), środek = **S − L − H**.
- **A·B = L + x^(n/2)(S − L − H) + xⁿH**.
- K(n) = 3K(n/2) ⇒ **n^(log₂ 3) ≈ n^1,585**; opłaca się od ~320 bitów.
- (1 + 2x)(3 + 4x): L = 3, H = 8, S = 21, M = 10 → 3 + 10x + 8x².

## Interpolacja

- wielomian stopnia n ⇔ wartości w n + 1 punktach; C(x) = A(x)B(x) punktowo.
- Horner O(n) na punkt; Lagrange O(n²).

## FFT (Cooley–Tukey 1965)

- punkty: n-te pierwiastki z jedności; (ωₙⁱ)² = ωₙ/₂ⁱ; ω^(n/2) = −1.
- **A(x) = Aₑ(x²) + x·Aₒ(x²)**; T(n) = 2T(n/2) + n = **O(n log n)**.
- interpolacja: **rₜ = S(ω⁻ᵗ)/n** — też FFT.
- mnożenie wielomianów: 2× FFT + n mnożeń + FFT⁻¹ ≈ 3n log n + n.

=== tasks ===

:::task level=1 source="own" title="Karacuba dla dwóch dwumianów"
Pomnóż algorytmem Karacuby wielomiany **A(x) = 3 + 5x** i **B(x) = 2 + 7x**. Podaj L, H, S, M i wynik. Sprawdź mnożąc wprost.
::hint
Aₗ = 3, Aₕ = 5, Bₗ = 2, Bₕ = 7.
::solution
- L = 3 · 2 = **6**
- H = 5 · 7 = **35**
- S = (3 + 5)(2 + 7) = 8 · 9 = **72**
- M = S − L − H = 72 − 6 − 35 = **31**

A·B = **6 + 31x + 35x²**. Sprawdzenie: (3 + 5x)(2 + 7x) = 6 + 21x + 10x + 35x² ✓. Użyliśmy 3 mnożeń zamiast 4.
:::

:::task level=2 source="own" title="Karacuba na liczbach"
Oblicz **47 · 63** metodą Karacuby, traktując liczby jak wielomiany zmiennej x = 10 (47 = 7 + 4x, 63 = 3 + 6x).
::hint
Po wyliczeniu współczynników c₀, c₁, c₂ podstaw x = 10 (przeniesienia same się „policzą”).
::solution
- L = 7 · 3 = 21, H = 4 · 6 = 24, S = (7 + 4)(3 + 6) = 11 · 9 = 99, M = 99 − 21 − 24 = 54.
- Wielomian: 21 + 54x + 24x².
- Dla x = 10: 21 + 540 + 2400 = **2961** ✓ (47 · 63 = 2961).
:::

:::task level=1 source="own" title="Ile mnożeń?"
Ile mnożeń współczynników wykona algorytm Karacuby dla wielomianów o **n = 8** i **n = 16** współczynnikach? Ile mnożeń wykonałaby metoda szkolna? Ile razy mniej to dla n = 1024?
::hint
K(n) = 3K(n/2), K(1) = 1, więc K(2ᵏ) = 3ᵏ.
::solution
- n = 8 = 2³: K = 3³ = **27** (szkolnie 64),
- n = 16 = 2⁴: K = 3⁴ = **81** (szkolnie 256),
- n = 1024 = 2¹⁰: K = 3¹⁰ = **59 049** vs 1 048 576 — ok. **17,8 razy** mniej.
:::

:::task level=2 source="own" title="Wartości w pierwiastkach z jedności"
Dla **A(x) = 1 + 2x + 3x² + 4x³** oblicz wartości w czterech pierwiastkach czwartego stopnia z jedności: 1, i, −1, −i. Zrób to metodą z FFT: zapisz A(x) = Aₑ(x²) + x·Aₒ(x²).
::hint
Aₑ(y) = 1 + 3y, Aₒ(y) = 2 + 4y. Dla x = ±1 mamy y = x² = 1, dla x = ±i mamy y = −1 — wystarczą więc dwie wartości Aₑ i dwie Aₒ.
::solution
- y = 1: Aₑ(1) = 4, Aₒ(1) = 6; y = −1: Aₑ(−1) = −2, Aₒ(−1) = −2.
- A(1) = 4 + 1·6 = **10**
- A(i) = −2 + i·(−2) = **−2 − 2i**
- A(−1) = 4 + (−1)·6 = **−2**
- A(−i) = −2 + (−i)·(−2) = **−2 + 2i**

Sprawdzenie np. A(i) = 1 + 2i + 3i² + 4i³ = 1 + 2i − 3 − 4i = −2 − 2i ✓. Zauważ, że pary (1, −1) i (i, −i) korzystają z tych samych wartości Aₑ, Aₒ — w tym tkwi oszczędność FFT.
:::

:::task level=3 source="own" title="Dlaczego właśnie pierwiastki z jedności?"
Wyjaśnij własnymi słowami, dlaczego FFT wymaga, żeby punkty były n-tymi pierwiastkami z jedności (i n było potęgą dwójki). Co by się stało, gdybyśmy wybrali punkty 1, 2, …, n?
::hint
Co się dzieje ze zbiorem punktów po podniesieniu ich do kwadratu?
::solution
Rekurencja A(x) = Aₑ(x²) + x·Aₒ(x²) wymaga policzenia Aₑ i Aₒ w punktach **x²**. Dla n-tych pierwiastków z jedności zbiór kwadratów ma tylko **n/2** elementów i jest zbiorem **n/2-tych pierwiastków z jedności** — czyli dostajemy dokładnie ten sam problem o połowę mniejszy (i tak dalej aż do n = 1, dlatego n = 2ᵏ). Stąd T(n) = 2T(n/2) + n = O(n log n).

Dla punktów 1, 2, …, n kwadraty 1, 4, 9, …, n² są **wszystkie różne** — problem wcale się nie zmniejsza (dalej n punktów), więc nie ma oszczędności: koszt pozostaje O(n²).
:::
