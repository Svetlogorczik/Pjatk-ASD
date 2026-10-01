---
id: t03
num: 3
type: topic
title: Złożoność obliczeniowa — jak mierzyć szybkość algorytmu
short: Złożoność obliczeniowa
desc: Operacja dominująca, złożoność pesymistyczna i oczekiwana, wrażliwość, notacje O, Ω, Θ, hierarchia funkcji i dlaczego algorytmy wykładnicze są bezużyteczne.
sources: asd2.pdf (§0.1, §1); Algorytmika.pdf (złożoność); Wyklady 2009/wyklad_1.pdf (notacja asymptotyczna)
exercises: asd 01.pdf („Ćwiczenia 4”: zad. 1–5)
---

## Po co mierzyć złożoność?

Chcemy porównywać algorytmy **niezależnie od komputera**, języka programowania i umiejętności programisty. Nie mierzymy więc sekund, tylko **liczbę operacji**, które algorytm wykona.

:::def
**Złożoność obliczeniowa** algorytmu to ilość zasobów komputerowych potrzebnych do jego wykonania. Dwa podstawowe zasoby to **czas** (złożoność czasowa) i **pamięć** (złożoność pamięciowa — dodatkowa pamięć poza danymi wejściowymi).
:::

### Rozmiar danych

Złożoność wyrażamy jako funkcję **rozmiaru danych n**. Co jest rozmiarem — zależy od problemu:

| Problem | Rozmiar danych |
|---|---|
| sortowanie, wyszukiwanie w tablicy | liczba elementów ciągu |
| przeglądanie drzewa | liczba węzłów |
| obliczenia na liczbach | **liczba cyfr** (bitów), nie sama wartość! |
| obliczanie wartości wielomianu | stopień wielomianu |
| grafy | liczba wierzchołków i krawędzi |

### Operacja dominująca

Nie liczymy wszystkich operacji — to byłoby nudne i zależne od szczegółów. Wybieramy **operację dominującą**: taką, że łączna liczba wszystkich operacji jest **proporcjonalna** do liczby jej wykonań.

- sortowanie → **porównanie** dwóch elementów (czasem też zamiana),
- przeglądanie drzewa → przejście krawędzią,
- obliczenia na wielomianach → operacje arytmetyczne +, −, ·, /.

**Jednostką złożoności** jest jedno wykonanie operacji dominującej.

## Złożoność pesymistyczna i oczekiwana

Ten sam algorytm dla różnych danych tego samego rozmiaru może działać różnie długo (np. szukany element jest na początku albo na końcu). Stąd dwie miary:

:::def
Oznaczenia: **Dₙ** — zbiór wszystkich zestawów danych rozmiaru n; **t(d)** — liczba operacji dominujących dla zestawu d; **Xₙ** — zmienna losowa o wartościach t(d); **pₙₖ** — prawdopodobieństwo, że algorytm wykona k operacji dominujących.

- **Pesymistyczna** złożoność czasowa: **W(n) = sup { t(d) : d ∈ Dₙ }** — „najgorszy przypadek”.
- **Oczekiwana** (średnia) złożoność czasowa: **A(n) = Σ k · pₙₖ** — wartość oczekiwana Xₙ, „typowy przypadek”.
:::

Mówi się też o **wrażliwości** algorytmu, czyli o tym, jak bardzo jego czas „skacze” w zależności od danych:

- **pesymistyczna wrażliwość:** Δ(n) = sup { t(d₁) − t(d₂) : d₁, d₂ ∈ Dₙ } (różnica między najgorszym a najlepszym),
- **oczekiwana wrażliwość:** δ(n) = dev(Xₙ) — odchylenie standardowe Xₙ.

Im większe Δ i δ, tym **mniej przewidywalny** jest algorytm.

:::analogy
Dojazd do uczelni: W(n) to czas w najgorszy dzień (korek, awaria tramwaju), A(n) — średni czas z wielu dni, a wrażliwość mówi, jak bardzo te czasy się różnią. Jeśli masz ważny test, planujesz według W(n); jeśli liczysz, ile czasu w miesiącu spędzasz w drodze — według A(n).
:::

### Przykład z wykładu: wyszukiwanie sekwencyjne

Szukamy `a` w tablicy `L[0..N−1]`. Sztuczka: na końcu tablicy kładziemy **strażnika** `L[N] := a`, więc pętla na pewno się zatrzyma i nie musi sprawdzać końca tablicy.

```pseudo title="Wyszukiwanie sekwencyjne ze strażnikiem"
Algorytm Szukaj(L, N, a):
  Dane:  N ≥ 0, a - szukany element, L[0..N] (miejsce L[N] jest wolne)
  Wynik: i takie, że L[i] = a (0 ≤ i ≤ N-1), albo N, gdy a nie ma w L
{
  L[N] := a;  i := 0;
  while L[i] <> a do
    i := i + 1;
  return i
}
```

- rozmiar danych: n = N,
- operacja dominująca: porównanie `L[i] ≠ a`,
- **W(n) = n + 1** (a nie ma w tablicy — dochodzimy do strażnika),
- **Δ(n) = n** (najlepiej 1 porównanie, najgorzej n + 1),
- **A(n) = (n + 1)/2** (przy założeniu, że a jest w tablicy i każda pozycja jest jednakowo prawdopodobna),
- **δ(n) ≈ 0,29 n**.

## Notacja asymptotyczna: O, Ω, Θ

Dokładne wzory (np. W(n) = 3n² + 7n + 12) są niewygodne. Interesuje nas **rząd wielkości**, czyli zachowanie dla bardzo dużych n. Stałe i składniki niższego rzędu pomijamy.

:::def
Niech f, g : ℕ → ℝ₊ ∪ {0}.
- **f(n) = O(g(n))** („f jest co najwyżej rzędu g”), jeśli istnieją stałe **c > 0** i **n₀** takie, że **f(n) ≤ c · g(n)** dla każdego n > n₀.
- **f(n) = Ω(g(n))** („f jest co najmniej rzędu g”), jeśli g(n) = O(f(n)).
- **f(n) = Θ(g(n))** („f jest dokładnie rzędu g”), jeśli f = O(g) i f = Ω(g).
:::

Przykład z wykładu: **n² + 2n = O(n²)**, bo n² + 2n ≤ 3n² dla każdego n ≥ 1 (c = 3, n₀ = 1).

:::analogy
O(g) to „sufit”, Ω(g) to „podłoga”, a Θ(g) to „dokładny wymiar”. Mówiąc „algorytm jest O(n²)”, obiecujemy, że nie będzie gorszy niż kwadratowy (ale może być lepszy). Mówiąc „Θ(n²)” — że jest dokładnie kwadratowy.
:::

:::warn
„f = O(g)” to **nie jest** równość w zwykłym sensie. Z n = O(n²) i n² = O(n²) nie wynika n = n². Czytaj znak „=” jako „należy do klasy”.
:::

### Najczęstsze klasy złożoności

| Rząd | Nazwa | Przykład |
|---|---|---|
| 1 | stała | dostęp do `A[i]` |
| log n | logarytmiczna | wyszukiwanie binarne |
| n | liniowa | wyszukiwanie sekwencyjne, maksimum |
| n log n | liniowo-logarytmiczna | MergeSort, HeapSort |
| n² | kwadratowa | SelectionSort, InsertionSort |
| n³, n⁴, … | wielomianowa | mnożenie macierzy „szkolnie” (n³) |
| n^(log n) | podwykładnicza | |
| 2ⁿ | wykładnicza | przegląd wszystkich podzbiorów |
| n! | silnia | przegląd wszystkich permutacji |

Porządek: **1 ≺ log n ≺ √n ≺ n ≺ n log n ≺ n² ≺ n³ ≺ n^(log n) ≺ 2ⁿ ≺ n!**

### Przydatne reguły {own}

:::own
Te reguły wynikają bezpośrednio z definicji, ale nie są wypisane na slajdach — zebrał je autor strony, bo są potrzebne w zadaniach.
:::

- **Stałe nie mają znaczenia:** 100·n² = Θ(n²), n/1000 = Θ(n).
- **Liczy się najszybciej rosnący składnik:** 3n³ + 50n² + 7 = Θ(n³).
- **Podstawa logarytmu nie ma znaczenia:** log₂ n = Θ(log₁₀ n), bo różnią się o stały czynnik (log₂ n = log₁₀ n / log₁₀ 2).
- **Każdy wielomian przegrywa z wykładniczą:** n¹⁰⁰ = O(1,01ⁿ). **Każda potęga logarytmu przegrywa z potęgą n:** (log n)¹⁰ = O(√n).
- **Wzór Stirlinga:** n! ≈ √(2πn)·(n/e)ⁿ, więc **log(n!) = Θ(n log n)** (przyda się przy dolnym ograniczeniu sortowania).

### Złożoność złożonych programów {own}

:::own
Szybkie zasady liczenia złożoności kodu (dopisane przez autora; potrzebne np. do zadania 5 z ćwiczeń).
:::

- **Instrukcje po kolei:** złożoności się **dodają** → wygrywa największa. Θ(n) + Θ(n²) = Θ(n²).
- **Pętla wykonywana k razy:** złożoność ciała **mnożymy przez k**. Pętla n razy z ciałem Θ(log n) → Θ(n log n).
- **Pętle zagnieżdżone:** mnożymy liczby obrotów. `for i < n { for j < n {…} }` → n · n = n².
- **Pętla, w której licznik się dzieli** (`i := i div 2`) → log n obrotów.
- **Wartość oczekiwana sumy = suma wartości oczekiwanych**, więc średnie złożoności kolejnych wywołań też po prostu dodajemy.
- Jeśli znamy tylko **ograniczenie dolne** (Ω) jakiegoś kawałka, całość też znamy tylko z dołu.

Przykład: ile razy wykona się wnętrze pętli dla typowych kształtów kodu?

```java title="Growth.java"
@include t03-growth.java
```

```text title="Wynik programu"
       n      log n            n        n log n              n^2
      16          4           16             64              256
      64          6           64            384             4096
     256          8          256           2048            65536
    1024         10         1024          10240          1048576
    4096         12         4096          49152         16777216
   16384         14        16384         229376        268435456
```

Zobacz: gdy n rośnie **4 razy**, log n rośnie o **2**, n — 4 razy, a n² — aż **16 razy**.

## Dlaczego algorytmy wykładnicze są bezużyteczne

Tabela z wykładu: czas działania algorytmu wykonującego **2ⁿ** operacji na komputerze wykonującym 10⁶ albo 10⁹ operacji na sekundę.

| Rozmiar n | 20 | 50 | 100 | 200 |
|---|---|---|---|---|
| 10⁶ operacji/s | 1,04 s | 35,7 lat | 4·10¹⁴ wieków | 5·10⁴⁴ wieków |
| 10⁹ operacji/s | 0,001 s | 13 dni | 4·10¹¹ wieków | 5·10⁴¹ wieków |

Nawet **1000-krotne** przyspieszenie komputera nic nie daje: dla n = 100 zamiast 4·10¹⁴ wieków czekamy „tylko” 4·10¹¹ wieków.

:::def
Algorytm nazywamy **niepraktycznym** (nierealizowalnym), gdy jego złożoność jest wykładnicza względem rozmiaru danych. Dla dużych danych takiego algorytmu nie da się użyć — bez względu na moc komputera.
:::

### Szybszy komputer a większe dane {own}

:::own
Rachunek „jak szybszy komputer wpływa na rozmiar danych” jest typowym zadaniem z ćwiczeń, a na wykładzie jest tylko zasygnalizowany tabelą — poniżej metoda krok po kroku.
:::

Zakładamy, że czas = c · f(n), gdzie c to czas jednej „jednostki”. Jeśli dla danych rozmiaru x czas wynosi t, to **c = t / f(x)**. Dalej:

- **czas dla innego rozmiaru y:** c · f(y),
- **maksymalny rozmiar w czasie t':** największe n z c · f(n) ≤ t',
- **komputer p razy szybszy:** czas dzielimy przez p.

| f(n) | Komputer 1000× szybszy pozwala zwiększyć n… |
|---|---|
| n | 1000 razy |
| n² | ok. 31,6 razy (√1000) |
| n³ | 10 razy (∛1000) |
| 2ⁿ | tylko o ok. **10** (bo 2¹⁰ ≈ 1000) |

## Pierwiastek jeszcze raz: rozmiar danych to liczba cyfr

Wróćmy do dwóch algorytmów ⌊√n⌋ z tematu 2. Za operację dominującą weźmy porównanie w dozorze pętli.

- **Wersja liniowa:** W(n) = √n, Δ(n) = 0, A(n) = √n, δ(n) = 0.
- **Wersja binarna:** około log₂ n obrotów.

Ale uwaga: dla liczb **rozmiarem danych jest liczba cyfr** d ≈ log n, a nie sama wartość n! Wtedy:

- wersja liniowa: **W(d) = 2^(d/2)** — złożoność **wykładnicza**!
- wersja binarna: **W(d) = d** — złożoność **liniowa**.

Różnica jest kolosalna dla dużych liczb (np. 100-cyfrowych).

:::exam
Pytanie „jaka jest złożoność algorytmu na liczbach?” — zawsze upewnij się, czy chodzi o złożoność **względem wartości** n, czy **względem rozmiaru danych** (liczby cyfr/bitów). Algorytm, który wygląda na „liniowy” (n obrotów), jest wykładniczy względem liczby bitów.
:::

## Kiedy złożoność to nie wszystko

Wykład przypomina o ograniczeniach tej analizy:

1. algorytm i jego realizacja (program) są zapisane w różnych językach — stałe mogą się różnić,
2. wrażliwość na dane może sprawić, że program na **naszych** danych zachowuje się inaczej niż W(n) i A(n),
3. trudno przewidzieć rzeczywisty rozkład danych (Xₙ),
4. dla niektórych algorytmów nie znamy dokładnych oszacowań A(n),
5. czasem jeden algorytm jest lepszy dla jednych danych, a drugi dla innych.

Ważną cechą jest też **prostota** algorytmu. Prostszy algorytm warto wybrać, gdy program będzie uruchamiany **tylko kilka razy** albo tylko dla **małych danych**.

=== summary ===

## Podstawy

- **Złożoność** = zużycie zasobów (czas, dodatkowa pamięć) jako funkcja **rozmiaru danych n**.
- **Operacja dominująca** — liczba wszystkich operacji jest do niej proporcjonalna (sortowanie: porównania).
- Liczby: rozmiar = **liczba cyfr/bitów** (d ≈ log n).

## Miary

| Symbol | Nazwa | Wzór |
|---|---|---|
| W(n) | pesymistyczna | sup { t(d) : d ∈ Dₙ } |
| A(n) | oczekiwana | Σ k·pₙₖ |
| Δ(n) | wrażliwość pesymistyczna | sup { t(d₁) − t(d₂) } |
| δ(n) | wrażliwość oczekiwana | dev(Xₙ) |

Wyszukiwanie sekwencyjne ze strażnikiem: W = n+1, A = (n+1)/2, Δ = n, δ ≈ 0,29n.

## Notacje

- f = **O(g)**: ∃ c > 0, n₀: f(n) ≤ c·g(n) dla n > n₀.
- f = **Ω(g)** ⇔ g = O(f); f = **Θ(g)** ⇔ O i Ω.
- 1 ≺ log n ≺ √n ≺ n ≺ n log n ≺ n² ≺ n³ ≺ 2ⁿ ≺ n!.
- stałe i niższe składniki pomijamy; podstawa logarytmu nieważna; log n! = Θ(n log n).

## Liczenie złożoności kodu

- sekwencja → **suma** (wygrywa największa), pętla k razy → **razy k**, pętle zagnieżdżone → iloczyn, dzielenie licznika → log n.
- szybszy komputer p×: czas / p; dla 2ⁿ rozmiar rośnie tylko o log₂ p.
- c = t / f(x); czas dla y: c·f(y).

## Wykładnicze = nierealizowalne

2ⁿ dla n = 100 przy 10⁹ op/s ≈ 4·10¹¹ wieków. Szybszy sprzęt nie pomaga — pomaga lepszy algorytm.

=== tasks ===

:::task level=1 source="„Ćwiczenia 4”, zad. 1 (zmienione)" title="Złożoność trzech prostych algorytmów"
Oszacuj **średnią** i **pesymistyczną** złożoność czasową (operacja dominująca: operacja arytmetyczna w ciele pętli). Podaj ją względem wartości n oraz względem rozmiaru danych d (liczby bitów n).

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
W a) i b) liczba obrotów nie zależy od „rodzaju” danych — tylko od n. W c) n jest dzielone przez 2. Pamiętaj: n ≈ 2ᵈ.
::solution
Dla każdej wartości n liczba obrotów jest **ustalona**, więc W(n) = A(n) (wrażliwość 0).

- **a)** n obrotów → W(n) = A(n) = **Θ(n)**. Względem bitów: n ≈ 2ᵈ → **Θ(2ᵈ)** (wykładniczo!).
- **b)** również n obrotów → **Θ(n)**, czyli **Θ(2ᵈ)** względem bitów. Brak zmiennej `i` nie zmienia złożoności.
- **c)** n dzielone przez 2 aż do 0 → ⌊log₂ n⌋ + 1 obrotów → **Θ(log n)**, a względem bitów dokładnie **d**, czyli **Θ(d)** (liniowo).

Wniosek: (a) i (b) liczą to samo (sumę 1+…+n), ale gdyby użyć wzoru n(n+1)/2, dostalibyśmy Θ(1) operacji arytmetycznych.
:::

:::task level=1 source="„Ćwiczenia 4”, zad. 2 (zmienione)" title="Prawda czy fałsz: rzędy funkcji"
Rozważmy funkcje zmiennej n ∈ ℕ. Które zdania są prawdziwe?

1. Ciąg funkcji n², √n · log n, log¹⁰ n, log log n jest **ściśle malejący** względem rzędów.
2. Ciąg funkcji n^(1/50), n^(1/3), n⁴, 2^(n/3) jest **ściśle rosnący** względem rzędów.
3. n^√2 + n^√5 + n⁵ + n⁹ = O(10^(n/2) + 2^(n/3) + n^(1/2) + n^π).
4. n³ = O(n² · log n).
::hint
Porównuj parami, np. dzieląc jedną funkcję przez drugą i licząc granicę. Pamiętaj: każda potęga log przegrywa z dowolną potęgą n, a każda potęga n przegrywa z funkcją wykładniczą.
::solution
1. **Prawda.** n² ≻ √n·log n (bo n²/(√n log n) = n^1,5/log n → ∞); √n·log n ≻ log¹⁰ n (potęga n wygrywa z potęgą log); log¹⁰ n ≻ log log n.
2. **Prawda.** 1/50 < 1/3 < 4, a 2^(n/3) jest wykładnicza, więc rośnie szybciej niż n⁴.
3. **Prawda.** Lewa strona = Θ(n⁹), prawa zawiera 10^(n/2) = (√10)ⁿ — wykładnicza, więc dominuje każdy wielomian.
4. **Fałsz.** n³/(n² log n) = n/log n → ∞, więc n³ rośnie szybciej niż n² log n.
:::

:::task level=2 source="„Ćwiczenia 4”, zad. 3 (zmienione)" title="Prawda czy fałsz: ograniczenia dolne"
„g jest poprawnym dolnym ograniczeniem f” znaczy f = Ω(g); „dokładnym” — f = Θ(g). Które zdania są prawdziwe?

1. Funkcja n! jest poprawnym dolnym ograniczeniem funkcji 50ⁿ + n⁵⁰ + 2^√n.
2. Funkcja n² jest poprawnym (ale nie dokładnym) dolnym ograniczeniem funkcji n³ + log n.
3. Funkcja n⁵⁰ jest poprawnym dolnym ograniczeniem funkcji 2^√n.
4. Funkcja n³ jest poprawnym i dokładnym dolnym ograniczeniem funkcji n³ + 5n² log n.
::hint
W 1 porównaj n! z 50ⁿ (co się dzieje, gdy n > 100?). W 3 zlogarytmuj obie funkcje: √n kontra 50 · log₂ n.
::solution
1. **Fałsz.** Dominującym składnikiem jest 50ⁿ, a n! rośnie szybciej niż cⁿ dla każdego stałego c (np. n!/50ⁿ → ∞). Nie jest więc prawdą, że f = Ω(n!).
2. **Prawda.** n³ + log n ≥ n² od pewnego miejsca, więc f = Ω(n²); nie jest dokładne, bo f ≠ O(n²).
3. **Prawda.** log₂(2^√n) = √n, log₂(n⁵⁰) = 50 log₂ n, a √n rośnie szybciej niż 50 log n. Zatem 2^√n = Ω(n⁵⁰) (to zdanie jest „od pewnego n” — dla małych n jest odwrotnie, ale notacja asymptotyczna na to pozwala).
4. **Prawda.** n³ + 5n² log n = Θ(n³), bo 5n² log n = o(n³).
:::

:::task level=2 source="„Ćwiczenia 4”, zad. 4 (zmienione)" title="Szybszy komputer, większe dane"
Algorytm Alg ma złożoność f(n). Dla danych rozmiaru x na komputerze K działa t sekund. Odpowiedz:
- ile czasu zajmie na K dla danych **p-krotnie mniejszych**,
- jaki jest **maksymalny** rozmiar danych, który zdąży przetworzyć na K w ciągu t' sekund,
- ile czasu zajmie na komputerze K', **p'-krotnie szybszym**, dla danych rozmiaru x'.

a) f(n) = log₂ n, x = 256, t = 8 s, p = 4, t' = 10 s, p' = 4, x' = 1024
b) f(n) = n³, x = 10, t = 20 s, p = 2, t' = 160 s, p' = 8, x' = 40
c) f(n) = 2ⁿ, x = 6, t = 128 s, p = 2, t' = 2048 s, p' = 16, x' = 12
::hint
Najpierw policz c = t / f(x) — czas jednej „jednostki” pracy. Potem wszystko liczy się jako c · f(…).
::solution
**a)** c = 8 / log₂ 256 = 8/8 = 1 s.
- dane 256/4 = 64: 1 · log₂ 64 = **6 s**,
- log₂ n ≤ 10 ⇒ n = **1024**,
- 1 · log₂ 1024 / 4 = 10/4 = **2,5 s**.

**b)** c = 20 / 10³ = 0,02 s.
- dane 5: 0,02 · 125 = **2,5 s**,
- 0,02 · n³ ≤ 160 ⇒ n³ ≤ 8000 ⇒ n = **20**,
- 0,02 · 40³ / 8 = 0,02 · 64000 / 8 = **160 s**.

**c)** c = 128 / 2⁶ = 2 s.
- dane 3: 2 · 2³ = **16 s**,
- 2 · 2ⁿ ≤ 2048 ⇒ 2ⁿ ≤ 1024 ⇒ n = **10**,
- 2 · 2¹² / 16 = 8192/16 = **512 s**.

Obserwacja: dla 2ⁿ komputer 16 razy szybszy pozwala zwiększyć dane tylko o log₂ 16 = 4 elementy.
:::

:::task level=3 source="„Ćwiczenia 4”, zad. 5 (zmienione)" title="Złożoność programów zbudowanych z innych algorytmów"
Algorytmy Alg₁, Alg₂, Alg₃ mają złożoność:
- T(Alg₁, n) = Θ(√n),
- A(Alg₂, n) = Θ(log n), W(Alg₂, n) = O(n),
- A(Alg₃, n) = Θ(n), W(Alg₃, n) = Ω(n²).

Określ (możliwie dokładnie) średnią i pesymistyczną złożoność:

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
Średnie złożoności się sumują i mnożą przez liczbę obrotów. Dla pesymistycznej: jeśli jakiś składnik jest znany tylko z dołu (Ω), to wynik też będzie znany tylko z dołu.
::solution
- **(a)** n razy Θ(√n) → A = W = **Θ(n√n)**.
- **(b)** A = n · (Θ(n) + Θ(log n)) = **Θ(n²)**. W: każde wywołanie Alg₃ może kosztować Ω(n²), więc W = **Ω(n³)** (górnego ograniczenia nie znamy, bo o W(Alg₃) wiemy tylko, że jest co najmniej n²).
- **(c)** A = n·√n + n·(log n + n) = **Θ(n²)**. W = **Ω(n³)** (z drugiej pętli).
- **(d)** A = n · (√n + n·(log n + n)) = **Θ(n³)**. W = **Ω(n⁴)**.

Zauważ, że zawsze W ≥ A, więc np. w (b) wiemy od razu, że W = Ω(n²) — ale znamy lepsze ograniczenie Ω(n³).
:::
