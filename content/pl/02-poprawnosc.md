---
id: t02
num: 2
type: topic
title: Poprawność algorytmów — specyfikacja, niezmienniki, własność stopu
short: Poprawność algorytmów
desc: Jak udowodnić, że algorytm robi to, co ma robić. Warunki początkowe i końcowe, poprawność częściowa i całkowita, metoda niezmienników i funkcja malejąca.
sources: asd1.pdf (§2 Analiza algorytmów, §3 Niezmienniki); Wyklady 2009/wyklad_1.pdf (poprawność)
exercises: asd 02.pdf, asd 02a.pdf, asd 03.pdf (zad. 1–2)
---

## Po co dowodzić poprawności?

Zwykle sprawdzamy program tak: piszemy go, uruchamiamy na kilku przykładach, poprawiamy błędy. Wykład wymienia trzy wady tej metody:

1. Czasem **nie da się** testować na prawdziwych danych (np. oprogramowanie rakiety — test jest „jednorazowy”).
2. Błędy pojawiające się po testach są **drogie** — im później znaleziony błąd, tym więcej kosztuje.
3. **Testowanie może pokazać, że błąd jest, ale nigdy, że go nie ma.** Nie da się sprawdzić wszystkich możliwych danych.

Dlatego uczymy się **dowodzić**, że algorytm jest poprawny — tak jak w matematyce dowodzi się twierdzeń.

## Specyfikacja: co algorytm dostaje i co ma zwrócić

Zanim powiemy „algorytm jest poprawny”, musimy powiedzieć **względem czego**. Tym „czymś” jest **specyfikacja**:

:::def
- **Warunek początkowy** (wejściowy) **α** — co zakładamy o danych wejściowych (np. „n > 0”, „tablica jest posortowana”).
- **Warunek końcowy** (wyjściowy) **β** — co ma być prawdą po zakończeniu algorytmu (np. „wynik = największy element tablicy”).
- Zapis **{α} K {β}** czytamy: „jeśli dane spełniają α i algorytm K się zakończy, to wyniki spełniają β”.
:::

Przykład: dla algorytmu `Max_w_tablicy(A, n)` z tematu 1:

- α: `n > 0`, `A` to tablica n liczb całkowitych,
- β: wynik jest elementem `A` i jest ≥ od każdego elementu `A`.

:::warn
Warunek początkowy to nie formalność. Dla `n = 0` algorytm Max odwołałby się do nieistniejącego `A[0]`. Specyfikacja mówi uczciwie: „dla takich danych nic nie obiecuję”.
:::

## Trzy własności: częściowa poprawność, określoność, stop

Wykład rozróżnia trzy rzeczy, które chcemy udowodnić:

1. **Częściowa poprawność** — jeśli dane spełniają α i obliczenie **dojdzie do końca**, to wyniki spełniają β.
2. **Określoność obliczeń** — dla danych spełniających α obliczenie **nie zostanie przerwane** błędem (np. dzielenie przez 0, wyjście poza tablicę).
3. **Własność stopu** — dla danych spełniających α obliczenie **nie jest nieskończone** (pętle się kończą).

:::def
Algorytm jest **całkowicie poprawny** względem α i β, gdy ma **częściową poprawność** i **własność stopu** (a obliczenia są określone). Innymi słowy: dla każdych dobrych danych **zatrzyma się** i da **dobry wynik**.
:::

:::analogy
Nawigacja samochodowa jest *częściowo poprawna*, jeśli za każdym razem, gdy dowiezie Cię do celu, to jest to właściwy adres. Ale może też… nigdy nie dojechać, bo krąży w kółko po rondzie. Jest *całkowicie poprawna*, gdy **zawsze dojedzie** i **zawsze na właściwy adres**.
:::

## Metoda niezmienników

Proste algorytmy bez pętli łatwo sprawdzić „na oko”. Kłopot sprawiają **pętle** — nie wiemy z góry, ile razy się wykonają. Na pętle mamy świetne narzędzie: **niezmiennik**.

:::def
**Niezmiennik pętli** to warunek g, który jest prawdziwy **za każdym razem**, gdy sterowanie dochodzi do sprawdzenia warunku pętli — przed pierwszym obrotem i po każdym kolejnym obrocie.
:::

Aby wykazać częściową poprawność pętli `{α} while W do K {β}` wystarczy pokazać **trzy rzeczy**:

1. **Inicjalizacja:** α ⇒ g — niezmiennik jest prawdziwy na starcie.
2. **Zachowanie:** {g ∧ W} K {g} — jeśli g jest prawdziwe i wchodzimy do pętli (W prawdziwe), to po wykonaniu jednego obrotu g nadal jest prawdziwe.
3. **Zakończenie:** g ∧ ¬W ⇒ β — gdy pętla się kończy (W fałszywe), niezmiennik razem z zaprzeczeniem warunku daje nam β.

:::analogy
To jak dowód przez indukcję o drabinie: (1) stoisz na pierwszym szczeblu, (2) z każdego szczebla umiesz wejść na następny, więc (3) gdy drabina się skończy, jesteś na szczycie. Niezmiennik to zdanie „stoję pewnie na drabinie” — prawdziwe na każdym szczeblu.
:::

### Jak wymyślić niezmiennik?

Niezmiennik zwykle mówi: **„to, co już zrobiłem, jest zrobione dobrze”**. Dla pętli przechodzącej po tablicy: „wynik dla przejrzanej części tablicy jest poprawny”. Na końcu „przejrzana część” = cała tablica, więc wynik jest poprawny dla całości.

### Przykład 1: maksimum w tablicy

```pseudo title="Max_w_tablicy z niezmiennikiem"
Algorytm Max_w_tablicy(A, n):
{
  // n > 0; A - tablica liczb całkowitych
  dotychczas_naj := A[0];
  for i := 1 to n-1 do
    // Nzm.: dotychczas_naj = MAX(A[0..i-1])
    if dotychczas_naj < A[i] then
      dotychczas_naj := A[i];
  // dotychczas_naj = MAX(A[0..n-1])
  return dotychczas_naj
}
```

1. **Start:** przed pierwszym obrotem i = 1, a `dotychczas_naj = A[0] = MAX(A[0..0])` ✓.
2. **Obrót:** jeśli `dotychczas_naj = MAX(A[0..i−1])`, to po porównaniu z `A[i]` mamy `MAX(A[0..i])` — i zwiększamy i ✓.
3. **Koniec:** pętla kończy się dla i = n, więc `dotychczas_naj = MAX(A[0..n−1])` ✓.

Stop: pętla `for` wykonuje się dokładnie n − 1 razy.

### Przykład 2: całkowity pierwiastek kwadratowy — wersja liniowa

Dla n ≥ 0 szukamy ⌊√n⌋, czyli **największej** liczby p takiej, że p² ≤ n. Równoważnie:

> p = ⌊√n⌋ ⇔ (p · p ≤ n) ∧ ((p + 1) · (p + 1) > n)

```pseudo title="sqrt — wersja liniowa"
Algorytm sqrt(n):
  Dane:  nieujemna liczba całkowita n
  Wynik: część całkowita z pierwiastka z n
{
  p := 0;
  while (p+1)*(p+1) <= n do
    // Nzm.: p*p <= n
    p := p + 1;
  // p = [sqrt(n)]
  return p
}
```

- **Start:** p = 0 i n ≥ 0, więc p² ≤ n ✓.
- **Obrót:** wchodzimy do pętli tylko gdy (p+1)² ≤ n; po `p := p+1` mamy znów p² ≤ n ✓.
- **Koniec:** pętla kończy się, gdy (p+1)² > n. Razem z niezmiennikiem p² ≤ n — to dokładnie definicja p = ⌊√n⌋ ✓.
- **Stop:** p rośnie o 1 w każdym obrocie, a (p+1)² ≤ n nie może być prawdą w nieskończoność.

### Przykład 3: pierwiastek szybciej — połowienie przedziału

Wersja liniowa robi ok. √n obrotów. Wykład pokazuje wersję z **wyszukiwaniem binarnym**: trzymamy przedział [l, r], w którym na pewno jest wynik, i za każdym razem dzielimy go na pół.

```pseudo title="sqrt — wersja z wyszukiwaniem binarnym"
Algorytm sqrt(n):
{
  l := 0;  r := n;           // lewy i prawy koniec przedziału
  while l < r do
  // Nzm.: l*l <= n  &  (r+1)*(r+1) > n  &  l <= r
  {
    s := [(l + r) / 2];      // część całkowita ze średniej
    if (s+1)*(s+1) <= n then
      l := s + 1             // pierwiastek jest > s
    else
      r := s;                // pierwiastek jest <= s
  }
  // l = [sqrt(n)]
  return l
}
```

Dowód według trzech kroków:

1. **Start:** l = 0 daje l² = 0 ≤ n. Dla r = n: (n+1)² = n² + 2n + 1 > n. Także l ≤ r ✓.
2. **Obrót:** jeśli (s+1)² ≤ n, to po `l := s+1` dalej l² ≤ n. Jeśli (s+1)² > n, to po `r := s` dalej (r+1)² > n. Ponieważ l ≤ s < r, warunek l ≤ r też zostaje zachowany ✓.
3. **Koniec:** ¬(l < r) i l ≤ r dają **l = r**. Wtedy l² ≤ n i (l+1)² > n, czyli l = ⌊√n⌋ ✓.

**Własność stopu — funkcja malejąca.** Rozważmy wartość f = r − l. Jest to liczba naturalna i w każdym obrocie **ostro maleje** (bo l ≤ s < r: albo l rośnie do s + 1 > l, albo r maleje do s < r). Ciąg liczb naturalnych nie może maleć w nieskończoność, więc pętla się kończy.

:::def
**Funkcja malejąca** (miara postępu) to wyrażenie o wartościach naturalnych, które w każdym obrocie pętli **ostro maleje**. Jej istnienie dowodzi **własności stopu**.
:::

:::exam
Na ćwiczeniach typowe zadanie brzmi: „zdefiniuj warunki początkowe i końcowe, udowodnij własność stopu, wskaż i udowodnij niezmiennik, udowodnij częściową i całkowitą poprawność”. Schemat odpowiedzi jest zawsze ten sam:
1. α i β,
2. funkcja malejąca → **stop**,
3. niezmiennik: start / obrót / koniec → **częściowa poprawność**,
4. stop + częściowa = **całkowita poprawność**.
:::

### Kod w Javie

```java title="IntSqrt.java"
@include t02-sqrt.java
```

## Sprawdzanie niezmienników w kodzie {own}

:::own
W Javie można „przypiąć” niezmiennik do kodu instrukcją `assert`. To nie jest dowód (dalej sprawdzamy tylko konkretne dane), ale świetnie pomaga znaleźć błędy i przyzwyczaja do myślenia niezmiennikami. Asercje włącza się flagą `java -ea`.
:::

```java title="SumWithInvariant.java"
@include t02-sum-assert.java
```

Zauważ, że trzy `assert`-y odpowiadają dokładnie trzem krokom metody niezmienników: przed pętlą, po każdym obrocie, a po pętli korzystamy z niezmiennika i warunku `i == n`.

## Przepis na zadanie z poprawności {own}

:::own
Poniższy schemat to podsumowanie autora strony — przydaje się przy każdym zadaniu „udowodnij całkowitą poprawność”.
:::

1. **Nazwij zmienne startowe.** Jeśli algorytm zmienia parametry (np. `n := n − 1`), zapisz ich początkowe wartości jako N, X, Y… — niezmiennik często ich potrzebuje.
2. **Napisz, co jest prawdą „w połowie pracy”.** Wypisz wartości zmiennych po 0, 1, 2, 3 obrotach na małym przykładzie i szukaj zależności, która się nie zmienia (np. `s = i · x`, `r + x·y = X·Y`).
3. **Sprawdź trzy kroki** (start / obrót / koniec). Przy „obrocie” rozważ osobno każdą gałąź `if`.
4. **Znajdź funkcję malejącą** (np. `n − i`, `y`, `r − l`) — musi być naturalna i ostro maleć.
5. **Policz złożoność:** ile razy maksymalnie może zmaleć funkcja malejąca?

=== summary ===

## Definicje

- **Specyfikacja:** warunek początkowy **α** (o danych) i końcowy **β** (o wynikach); zapis **{α} K {β}**.
- **Częściowa poprawność:** jeśli α i algorytm się zakończy ⇒ β.
- **Określoność:** brak błędów wykonania (dzielenie przez 0, zły indeks).
- **Własność stopu:** dla danych spełniających α algorytm się zatrzymuje.
- **Całkowita poprawność** = częściowa poprawność + stop.

## Metoda niezmienników (pętla `while W do K`)

1. **Start:** α ⇒ g
2. **Obrót:** {g ∧ W} K {g}
3. **Koniec:** g ∧ ¬W ⇒ β

**Stop:** funkcja malejąca — wartość naturalna, ostro maleje w każdym obrocie.

## Przykłady z wykładu

| Algorytm | Niezmiennik | Funkcja malejąca |
|---|---|---|
| Max w tablicy | `naj = MAX(A[0..i−1])` | n − i |
| sqrt liniowy | p² ≤ n | n − p² (lub ⌊√n⌋ − p) |
| sqrt binarny | l² ≤ n ∧ (r+1)² > n ∧ l ≤ r | r − l |

- p = ⌊√n⌋ ⇔ p² ≤ n < (p+1)².
- sqrt liniowy: ~√n obrotów; binarny: ~log₂ n obrotów.

## Schemat odpowiedzi na ćwiczeniach

α, β → funkcja malejąca (stop) → niezmiennik (start/obrót/koniec) → całkowita poprawność → złożoność (ile razy maleje funkcja malejąca).

=== tasks ===

:::task level=1 source="Ćwiczenie 2, zad. 1 (zmienione)" title="Specyfikacja i pseudokod"
Dla każdego problemu podaj specyfikację (nazwa metody, parametry, warunek początkowy, warunek końcowy) oraz rozwiązanie w pseudokodzie:

a) znaleźć **najmniejszą** liczbę w tablicy,
b) obliczyć **iloczyn** wszystkich liczb w tablicy,
c) policzyć, ile liczb w tablicy jest **parzystych**.
::hint
Pomyśl, co ma się stać dla pustej tablicy. Dla minimum pusta tablica nie ma sensu (trzeba ją wykluczyć w α), a iloczyn pustej tablicy to 1 (element neutralny mnożenia).
::solution
**a)** `Min(T, n)`; α: n ≥ 1, T[0..n−1] liczby całkowite; β: wynik m jest jednym z elementów T i m ≤ T[j] dla każdego j.
```pseudo
Algorytm Min(T, n):
{
  m := T[0];
  for i := 1 to n-1 do
    if T[i] < m then m := T[i];
  return m
}
```
**b)** `Iloczyn(T, n)`; α: n ≥ 0; β: wynik = T[0]·T[1]·…·T[n−1] (dla n = 0 wynik = 1).
```pseudo
Algorytm Iloczyn(T, n):
{
  p := 1;
  for i := 0 to n-1 do p := p * T[i];
  return p
}
```
**c)** `LiczParzyste(T, n)`; α: n ≥ 0; β: wynik = liczba indeksów i, dla których T[i] mod 2 = 0.
```pseudo
Algorytm LiczParzyste(T, n):
{
  c := 0;
  for i := 0 to n-1 do
    if T[i] mod 2 = 0 then c := c + 1;
  return c
}
```
:::

:::task level=1 source="Ćwiczenie 2, zad. 2 (zmienione)" title="Co jest po pętli?"
Rozważ fragment:
```pseudo
a := 10;
b := 0;
while a > 3 do {
  a := a - 1;
  b := b + 2;
}
// wykaż, że tutaj b = 14
```
Wykaż (niezmiennikiem, nie tylko „przeliczeniem”), że po pętli `b = 14`.
::hint
Zobacz, jak zmieniają się a i b razem: gdy a spada o 1, b rośnie o 2. Co się nie zmienia?
::solution
**Niezmiennik:** g ≡ (b = 2·(10 − a)) ∧ (a ≥ 3).

1. **Start:** a = 10, b = 0: 0 = 2·(10 − 10) ✓, 10 ≥ 3 ✓.
2. **Obrót:** zakładamy g i a > 3. Po `a := a − 1`, `b := b + 2` mamy b + 2 = 2·(10 − a) + 2 = 2·(10 − (a − 1)) ✓, a nowe a = a − 1 ≥ 3, bo a > 3 ✓.
3. **Koniec:** ¬(a > 3) daje a ≤ 3, a z g: a ≥ 3, więc a = 3 i b = 2·(10 − 3) = **14** ✓.

**Stop:** funkcja malejąca a − 3 ≥ 0 maleje o 1 w każdym obrocie (7 obrotów).
:::

:::task level=2 source="Ćwiczenie 2, zad. 3 (zmienione)" title="Mnożenie przez dodawanie"
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
a) Zdefiniuj warunki początkowe i końcowe.
b) Udowodnij własność stopu.
c) Wskaż i udowodnij niezmiennik pętli.
d) Udowodnij częściową i całkowitą poprawność.
::hint
Po k obrotach i = k, a s to x dodane k razy.
::solution
a) α: x całkowite, n całkowite, **n ≥ 0**. β: wynik = x · n.

b) **Stop:** f = n − i. Na starcie f = n ≥ 0; w każdym obrocie i rośnie o 1, więc f maleje o 1; pętla działa tylko gdy f > 0. Po n obrotach f = 0 i pętla się kończy.

c) **Niezmiennik:** g ≡ (s = i · x) ∧ (0 ≤ i ≤ n).
- start: i = 0, s = 0 = 0·x, 0 ≤ 0 ≤ n ✓;
- obrót: z g oraz i < n: nowe s = i·x + x = (i+1)·x, nowe i = i + 1 ≤ n ✓.

d) **Częściowa poprawność:** po pętli ¬(i < n), czyli i ≥ n; z g: i ≤ n, więc i = n i s = n·x = β ✓. **Całkowita poprawność** = częściowa poprawność + stop (b) ✓. Złożoność: dokładnie n dodawań.
:::

:::task level=2 source="Ćwiczenie 2, zad. 4 (zmienione)" title="Ta sama pętla bez licznika"
Zapisz algorytm z poprzedniego zadania **bez zmiennej i** (zmieniając parametr n) i przeprowadź dla niego dowód: stop, niezmiennik, częściowa i całkowita poprawność.
::hint
Oznacz początkową wartość n jako N. Niezmiennik musi łączyć „ile już dodałem” z „ile jeszcze zostało”.
::solution
```pseudo
Algorytm mult2(x, n):
{
  // N = początkowa wartość n, N >= 0
  s := 0;
  while n > 0 do {
    s := s + x;
    n := n - 1;
  }
  return s
}
```
- **Stop:** f = n ≥ 0 maleje o 1 w każdym obrocie.
- **Niezmiennik:** g ≡ (s + n·x = N·x) ∧ (n ≥ 0).
  - start: s = 0, n = N: 0 + N·x = N·x ✓;
  - obrót: (s + x) + (n − 1)·x = s + n·x = N·x ✓, a nowe n = n − 1 ≥ 0, bo n > 0 ✓.
- **Koniec:** ¬(n > 0) ∧ n ≥ 0 ⇒ n = 0, więc s = N·x ✓.
- Całkowita poprawność = częściowa + stop ✓.
:::

:::task level=3 source="Ćwiczenie 2a / 3, zad. 1 (zmienione)" title="Mnożenie „rosyjskich chłopów”"
```pseudo
Algorytm mul(x, y):
{
  // x, y całkowite, y >= 0
  r := 0;
  while y > 0 do {
    if y jest nieparzyste then r := r + x;
    y := y div 2;          // dzielenie całkowite
    x := x + x;
  }
  return r
}
```
Udowodnij całkowitą poprawność (wynik = X·Y, gdzie X, Y to wartości początkowe). Przeanalizuj złożoność: ile obrotów wykona pętla? Wykonaj algorytm dla `mul(13, 11)`.
::hint
Szukaj niezmiennika postaci „r + (coś z x i y) = X·Y”. Osobno rozważ y parzyste (y = 2k) i nieparzyste (y = 2k + 1).
::solution
**Niezmiennik:** g ≡ (r + x·y = X·Y) ∧ (y ≥ 0).

- **Start:** r = 0, x = X, y = Y ⇒ 0 + X·Y ✓.
- **Obrót, y = 2k (parzyste):** r bez zmian, nowe y = k, nowe x = 2x: r + 2x·k = r + x·y ✓.
- **Obrót, y = 2k + 1 (nieparzyste):** nowe r = r + x, y = k, x = 2x: (r + x) + 2x·k = r + x(2k+1) = r + x·y ✓.
- **Koniec:** y = 0 ⇒ r = X·Y ✓.
- **Stop:** funkcja malejąca y: dla y > 0 mamy y div 2 < y, wartości naturalne ⇒ pętla się kończy.

**Złożoność:** y jest dzielone przez 2 w każdym obrocie, więc liczba obrotów to liczba bitów Y: **⌊log₂ Y⌋ + 1** (dla Y > 0). Względem rozmiaru danych (liczby bitów) — liniowo.

**Przebieg `mul(13, 11)`:**

| obrót | x | y | r | uwagi |
|---|---|---|---|---|
| start | 13 | 11 | 0 | |
| 1 | 26 | 5 | 13 | 11 nieparzyste → r += 13 |
| 2 | 52 | 2 | 39 | 5 nieparzyste → r += 26 |
| 3 | 104 | 1 | 39 | 2 parzyste |
| 4 | 208 | 0 | 143 | 1 nieparzyste → r += 104 |

Wynik 143 = 13·11 ✓, 4 obroty = liczba bitów 11 (1011₂) ✓.
:::

:::task level=3 source="Ćwiczenie 2a / 3, zad. 2 (zmienione)" title="Robot i kule w pudełkach"
Na półce stoi n pudełek ponumerowanych 0…n−1, w każdym jedna kula: **zielona** albo **żółta**. Robot umie:
- `Color(i)` — otworzyć pudełko i i powiedzieć, jaki ma kolor kula (to **kosztowne**, więc chcemy robić to jak najrzadziej),
- `Swap(i, j)` — zamienić pudełka miejscami (uwaga: dla i = j robot się psuje!).

Cel: wszystkie zielone na lewo, wszystkie żółte na prawo.

```pseudo
l := 0;  r := n - 1;
while l < r do
  if Color(l) = ZIELONA then
    l := l + 1
  else {
    Swap(l, r);
    r := r - 1
  }
```
Udowodnij całkowitą poprawność. Ile razy wywołane zostanie `Color`, a ile razy `Swap` (najgorszy przypadek)? Czy robot może się zepsuć?
::hint
Narysuj półkę jako trzy strefy: [0..l−1] — już wiadomo, że zielone; [r+1..n−1] — już wiadomo, że żółte; środek — nieznany.
::solution
**Niezmiennik:** g ≡ wszystkie pudełka 0..l−1 mają kule zielone ∧ wszystkie pudełka r+1..n−1 mają kule żółte ∧ 0 ≤ l ≤ r + 1 ≤ n.

- **Start:** l = 0, r = n − 1 — obie strefy są puste, więc g jest prawdziwe ✓.
- **Obrót (zielona w l):** l := l + 1 — strefa zielona powiększa się o pudełko z zieloną kulą ✓.
- **Obrót (żółta w l):** po `Swap(l, r)` żółta kula jest w pudełku r, więc po r := r − 1 strefa żółta rośnie o żółte pudełko ✓. (Nie wiemy, co trafiło na pozycję l — dlatego nie zwiększamy l.)
- **Koniec:** ¬(l < r) i l ≤ r + 1 ⇒ l = r lub l = r + 1. Nieznana strefa ma ≤ 1 pudełko, a jedno pudełko „nie psuje” podziału — wszystkie zielone są na lewo, żółte na prawo ✓.
- **Stop:** f = r − l maleje o 1 w każdym obrocie (rośnie l albo maleje r) ✓.

**Złożoność:** r − l zaczyna od n − 1 i maleje o 1 na obrót, więc dla n ≥ 1 jest **dokładnie n − 1 obrotów** ⇒ **n − 1 wywołań `Color`** (to optimum dla tej metody). `Swap` — co najwyżej **n − 1** (gdy wszystkie kule są żółte).

**Czy robot się zepsuje?** Nie: `Swap(l, r)` wołamy tylko wewnątrz pętli, gdy l < r, więc zawsze l ≠ r.

:::own
Ciekawostka od autora: algorytm czasem zamienia żółtą z żółtą (niepotrzebnie). Można to poprawić, sprawdzając też kolor w r — ale wtedy rośnie liczba drogich wywołań `Color`. Tu optymalizujemy liczbę `Color`, więc prosty algorytm jest dobry.
:::
:::
