---
id: t01
num: 1
type: topic
title: Czym jest algorytm? Wprowadzenie do algorytmiki
short: Wprowadzenie do algorytmiki
desc: Co to jest algorytm, dziedzina algorytmiczna, trzy wersje algorytmu Euklidesa, pseudokod i matematyka potrzebna od pierwszych zajęć.
sources: 2026/2027 (M. Sydow): correctness1-pl.pdf (organizacja, pseudokod) · 2025/2026: Algorytmika.pdf; asd1.pdf (§1 Pseudo-kod); Wyklady 2009/wyklad_1.pdf
exercises: asd 00.pdf (Ćwiczenie 0)
---

:::info Poza programem 2026/2027
Algorytm Euklidesa, dziedzina algorytmiczna i część matematyki pochodzą z wykładów 2025/2026 — **nie ma ich na slajdach 2026/2027**. Obowiązujący materiał: sekcja o pseudokodzie i [konspekt](topic:t01).
:::

## Algorytm — o co w ogóle chodzi?

**Algorytm** to dokładny przepis, jak krok po kroku rozwiązać jakiś problem. „Dokładny” znaczy tutaj naprawdę dokładny: komputer jest urządzeniem bardzo szybkim, ale kompletnie się nie domyśla. Jeśli czegoś mu nie powiesz — nie zrobi tego. Jeśli powiesz niejasno — zrobi coś innego, niż chciałeś.

**Algorytmika** to dział informatyki, który uczy:

- jak **układać** algorytmy (wymyślać przepis),
- jak dobierać do nich **struktury danych** (w czym trzymać dane, żeby było szybko),
- jak **analizować** algorytmy — czy są **poprawne** i czy są **szybkie**.

Wykład podkreśla ważną myśl: dobry algorytm daje dużo więcej niż szybszy komputer. Za chwilę zobaczysz przykład, w którym zmiana algorytmu zamienia „miliardy lat” na „ułamek sekundy”.

:::analogy
Algorytm jest jak przepis na naleśniki dla kogoś, kto nigdy nie był w kuchni. Nie wystarczy napisać „zrób ciasto”. Trzeba napisać: „wbij 2 jajka do miski, wlej 1 szklankę mleka, mieszaj, aż nie będzie grudek”. Każdy krok musi być zrozumiały i wykonalny, a przepis musi się kiedyś **skończyć** (nie może kazać mieszać w nieskończoność).
:::

### Skąd słowo „algorytm”?

Od imienia perskiego matematyka **Al-Chuwarizmiego** (ok. 780–850). W swojej księdze opisał sposoby rozwiązywania równań, także kwadratowych. Łacińskie tłumaczenie jego imienia — *Algoritmi* — dało nazwę całej dziedzinie. Dlatego słowo „algorytm” brzmi podobnie w prawie wszystkich językach.

## Dziedzina algorytmiczna: co wolno nam robić?

Zanim zaczniemy układać algorytm, musimy wiedzieć, **jakich operacji wolno użyć**. Zestaw „obiektów + dozwolonych operacji” nazywamy **dziedziną algorytmiczną**.

:::def
**Dziedzina algorytmiczna** to system złożony z: zbioru obiektów (nośnika), na którym pracujemy, oraz zbioru operacji i relacji, których wolno nam na tych obiektach używać.
:::

### Przykład ze starożytności: konstrukcje platońskie

Pierwszymi „algorytmikami” byli starożytni Grecy. Rozwiązywali zadania konstrukcyjne: narysuj coś za pomocą cyrkla i linijki. Obiekty to **punkty, proste i okręgi**, a dozwolonych operacji jest dokładnie pięć:

1. `line(X, Y)` — prosta przez dwa punkty,
2. `circle(O, Y)` — okrąg o środku `O` przechodzący przez `Y`,
3. przecięcie dwóch prostych (punkt),
4. przecięcia prostej i okręgu (punkty),
5. przecięcia dwóch okręgów (punkty).

I **nic ponadto**. Nie wolno np. „przykładać linijki i przesuwać jej, aż dotknie okręgu” — to byłoby oszustwo, bo takiej operacji nie ma na liście. Zauważ też, że te operacje są **częściowe**: dwie proste równoległe nie mają punktu przecięcia.

**Zadanie z wykładu:** dany jest okrąg `o` o środku `O` i punkt `A` poza nim. Poprowadź prostą przez `A` styczną do okręgu. Rozwiązanie to po prostu **ciąg operacji** — czyli algorytm:

```pseudo title="Styczna do okręgu przez punkt A"
l  := line(O, A)          // prosta łącząca środek z punktem A
o1 := circle(O, A)        // okrąg o środku O, promień OA
o2 := circle(A, O)        // okrąg o środku A, promień AO
(P, Q) := o1 ∩ o2         // dwa punkty przecięcia okręgów
k  := line(P, Q)          // symetralna odcinka OA
X  := l ∩ k               // środek odcinka OA
o3 := circle(X, O)        // okrąg o średnicy OA
(R, S) := o ∩ o3          // punkty styczności
s  := line(R, A)          // szukana styczna (druga: line(S, A))
```

:::info
To samo można zapisać jednym, długim wyrażeniem (składając funkcje w siebie). Wykład zwraca uwagę, że **tak mniej więcej wygląda programowanie funkcyjne** — zamiast ciągu instrukcji mamy jedno złożone wyrażenie.
:::

### Problemy nierozwiązywalne

Grecy nie umieli wykonać trzech konstrukcji: **kwadratury koła**, **trysekcji kąta** (podziału dowolnego kąta na 3 równe części) i **podwojenia sześcianu**. Dopiero w XIX wieku udowodniono, że tych konstrukcji **nie da się** wykonać tymi pięcioma operacjami.

W XX wieku **Alan Turing** pokazał coś jeszcze mocniejszego: istnieją problemy, których nie rozwiąże **żaden** algorytm na **żadnym** komputerze. Przykład z wykładu to **problem odpowiedniości Posta**: mamy pary słów (xᵢ, yᵢ); czy da się wybrać ciąg indeksów, dla którego sklejone słowa x i sklejone słowa y są identyczne? Dla konkretnych danych czasem umiemy odpowiedzieć, ale **ogólnego algorytmu nie ma** (problem jest nierozstrzygalny).

## Algorytm Euklidesa — trzy wersje jednego pomysłu

To najważniejszy przykład z pierwszego wykładu. Chcemy obliczyć **NWD(m, n)** — największy wspólny dzielnik dwóch liczb naturalnych. Nie ma na to prostego wzoru, ale Euklides zauważył fakt (wcale nie oczywisty):

:::def
Jeśli od większej liczby odejmiemy mniejszą, to ich NWD **się nie zmieni**: NWD(m, n) = NWD(n − m, m) dla 0 < m ≤ n. Poza tym NWD(0, n) = n.
:::

### Wersja 1: odejmowanie

Powtarzamy: jeśli `m > n`, zamień je miejscami; potem `n := n − m`. Kończymy, gdy `m = 0` — wtedy wynik to `n`.

Przykład dla (84, 120): (84,120) → (84,36) → zamiana (36,84) → (36,48) → (36,12) → zamiana (12,36) → (12,24) → (12,12) → (12,0) → zamiana (0,12) → **NWD = 12**.

**Problem:** dla `n = 10³⁰` i `m = 1` pętla wykona się około 10³⁰ razy. Wykład liczy: nawet komputer wykonujący 10¹² operacji na sekundę potrzebowałby **ponad 790 miliardów lat** — kilkadziesiąt razy więcej niż wiek Wszechświata. A w szyfrowaniu RSA używa się liczb rzędu 10²⁰⁰!

### Wersja 2: reszta z dzielenia

Kluczowa obserwacja: seria odejmowań `m` od `n` kończy się, gdy `n` spadnie poniżej `m`. To, co zostaje, to po prostu **reszta z dzielenia** `n mod m`. Czyli cały ciąg odejmowań można zastąpić jedną operacją:

:::def
NWD(0, n) = n, a dla m > 0: NWD(m, n) = NWD(n mod m, m).
:::

Teraz dane (10³⁰, 1) są banalne: jedno dzielenie, reszta 0, koniec.

### Ile obrotów pętli w najgorszym razie? Liczby Fibonacciego

Szukamy danych **najbardziej złośliwych**, czyli takich, dla których pętla kręci się najdłużej. Wykład odwraca pytanie: *jakie najmniejsze liczby wymuszą k obrotów pętli?*

| obroty pętli | najmniejsza para (m, n) |
|---|---|
| 1 | (1, 1) |
| 2 | (2, 3) |
| 3 | (3, 5) |
| 4 | (5, 8) |
| 5 | (8, 13) |
| … | … |
| 9 | (55, 89) |

To są kolejne **liczby Fibonacciego**: F₀ = 0, F₁ = 1, Fₙ = Fₙ₋₁ + Fₙ₋₂ (0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144…). Najgorsze dane to dwie sąsiednie liczby Fibonacciego — wtedy każdy iloraz wynosi 1, więc „postęp” jest najmniejszy możliwy. Para (Fₙ₋₁, Fₙ) daje n − 2 obroty.

Liczby Fibonacciego rosną **wykładniczo** — każda kolejna jest (od pewnego momentu) o ponad 60% większa od poprzedniej. Wzór Eulera–Bineta mówi, że Fₙ ≈ φⁿ/√5, gdzie φ = (1+√5)/2 ≈ 1,618. Stąd dla liczb 30-cyfrowych: φⁿ/√5 < 10³⁰ daje n ≈ 150, czyli **najwyżej ok. 148 obrotów pętli**. Porównaj to z 10³⁰ obrotami wersji 1!

:::tip
Wniosek do zapamiętania: liczba obrotów algorytmu Euklidesa (wersja z `mod`) rośnie jak **logarytm** z wartości liczb, czyli liniowo względem liczby cyfr. To jest ogromna różnica w porównaniu z wersją odejmowaniową.
:::

### Wersja 3: binarny Euklides

Dla 0 ≤ m ≤ n wykład podaje też wersję, która używa tylko sprawdzania parzystości, dzielenia i mnożenia przez 2 oraz odejmowania (to bardzo tanie operacje dla komputera, bo działa na bitach):

- NWD(m, n) = 2 · NWD(m/2, n/2), gdy m i n parzyste,
- NWD(m, n) = NWD(m/2, n), gdy m parzyste, n nieparzyste,
- NWD(m, n) = NWD(m, n/2), gdy m nieparzyste, n parzyste,
- NWD(m, n) = NWD((n − m)/2, m), gdy obie nieparzyste.

### Kod: wszystkie trzy wersje

```java title="Gcd.java"
@include t01-euclid.java
```

:::info
Każda wersja używa **innej dziedziny algorytmicznej** (innego zestawu operacji). Wykład zapisuje je tak: Euklides 1 — (ℕ, 0, ≤, −, zamień); Euklides 2 — (ℕ, >0, mod); Euklides 3 — (ℕ, 0, >, parzystość, ·2, /2, −, zamień). To pokazuje, że „jak szybki jest algorytm” zależy też od tego, jakie operacje uznajemy za elementarne.
:::

## Pseudokod — jak będziemy zapisywać algorytmy

Na wykładzie algorytmy zapisujemy w **pseudokodzie**. To „prawie język programowania”: pozwala zapomnieć o średnikach i typach, a skupić się na samym pomyśle. Jednocześnie ma być na tyle precyzyjny, żeby łatwo go przepisać na prawdziwy język (u nas: Java).

Reguły pseudokodu z wykładu:

| Element | Zapis | Znaczenie |
|---|---|---|
| Przypisanie | `x := 5` | `:=` to przypisanie, a `=` to zwykłe porównanie |
| Deklaracja | `Algorytm nazwa(p1, p2, …)` | metoda o nazwie „nazwa” i parametrach |
| Wybór | `if war then I1 [else I2]` | nawiasy `[ ]` = część opcjonalna |
| Pętle | `while warunek do I`, `repeat I until warunek`, `for i := a to b do I` | złożone instrukcje w klamrach `{ }` |
| Tablice | `A[i]` | tablica n-elementowa ma indeksy od `0` do `n − 1` |
| Wynik | `return wart` | zwraca wartość |

Przykład z wykładu — maksimum w tablicy (`Dane` = wejście, `Wynik` = wyjście):

```pseudo title="Max_w_tablicy"
Algorytm Max_w_tablicy(A, n):
  Dane:  tablica A, n liczb całkowitych (n > 0)
  Wynik: największy element w A
{
  dotychczas_naj := A[0];
  for i := 1 to n-1 do
    if dotychczas_naj < A[i] then
      dotychczas_naj := A[i];
  return dotychczas_naj
}
```

I ten sam algorytm w Javie:

```java title="MaxDemo.java"
@include t01-max.java
```

:::warn
W pseudokodzie pętla `for i := 1 to n-1` **obejmuje** wartość `n − 1`. W Javie to samo zapisujemy jako `for (int i = 1; i < n; i++)` albo `i <= n - 1`. Przy przepisywaniu łatwo o błąd „o jeden”.
:::

## Co będziemy badać w algorytmach?

Wykład wymienia cztery podstawowe pytania:

1. Czy dany problem w ogóle **da się rozwiązać** na komputerze (w dostępnym czasie i pamięci)?
2. Który ze znanych algorytmów **wybrać** w danej sytuacji?
3. Czy istnieje **lepszy** algorytm? Czy nasz jest **optymalny**?
4. Jak **uzasadnić**, że algorytm naprawdę rozwiązuje zadanie (czyli jest **poprawny**)?

Dlatego w kolejnych tematach zajmiemy się **poprawnością** (temat 2) i **złożonością** (temat 3). Już teraz warto znać podstawowe pojęcia:

- **Złożoność czasowa** — ile operacji wykona algorytm. Liczymy tylko operację **dominującą** (najczęstszą i najdroższą, np. `mod` w Euklidesie 2).
- **Złożoność pesymistyczna** — dla danych najbardziej złośliwych; **średnia** — dla danych typowych.
- **Złożoność pamięciowa** — ile **dodatkowej** pamięci potrzeba.
- **Złożoność problemu** — złożoność **najlepszego** możliwego algorytmu dla tego problemu.
- **Rozmiar danych** — mierzymy „ile bitów zajmują dane”: dla tablicy to jej długość, dla liczby — liczba cyfr, dla grafu — liczba wierzchołków i krawędzi.

## Matematyka, której potrzebujesz od pierwszych zajęć {own}

Na pierwszych ćwiczeniach pojawiają się logarytmy, potęgi, liczba cyfr i granice. W wykładach nie ma tego osobno omówionego — poniżej krótka, praktyczna ściąga.

:::own
Ta sekcja została dopisana przez autora strony, bo ćwiczenie 0 wymaga tej wiedzy, a slajdy jej nie tłumaczą.
:::

### Logarytm w jednym zdaniu

**log_a b = c** znaczy dokładnie: **a do potęgi c daje b** (aᶜ = b). Logarytm odpowiada na pytanie „do której potęgi trzeba podnieść podstawę, żeby dostać liczbę?”.

- log₂ 8 = 3, bo 2³ = 8
- log₂ 1 = 0, bo 2⁰ = 1
- log₂ (1/8) = −3, bo 2⁻³ = 1/8
- log₂ (−8) — **nie istnieje** (potęga liczby dodatniej zawsze jest dodatnia)
- log₄ 8 = 3/2, bo 4^(3/2) = (√4)³ = 8

Najważniejsze wzory (a, b, x, y > 0, a ≠ 1):

| Wzór | Przykład |
|---|---|
| log(x·y) = log x + log y | log₂ 12 = log₂ 4 + log₂ 3 = 2 + log₂ 3 |
| log(x/y) = log x − log y | log₂ 0,75 = log₂ 3 − log₂ 4 |
| log(xᵏ) = k · log x | log₂ 9 = 2 · log₂ 3 |
| log_a x = log_b x / log_b a | log₄ 8 = log₂ 8 / log₂ 4 = 3/2 |

:::tip
W informatyce „log” bez podstawy prawie zawsze oznacza **log₂**. Intuicja: log₂ n to **ile razy trzeba podzielić n na pół, żeby dojść do 1**. Dla n = 1024 to 10 razy, dla miliona — ok. 20 razy. Dlatego algorytmy „logarytmiczne” są tak szybkie.
:::

### Ile cyfr ma liczba?

Liczba naturalna x > 0 ma **⌊log₁₀ x⌋ + 1** cyfr dziesiętnych (⌊·⌋ = część całkowita w dół). Przykład: 2¹⁰⁰ ma ⌊100 · log₁₀ 2⌋ + 1 = ⌊100 · 0,30103⌋ + 1 = 30 + 1 = **31** cyfr. Analogicznie liczba bitów to ⌊log₂ x⌋ + 1.

### Granice ciągów — szybki sposób

Przy ułamku dwóch wielomianów dzielimy licznik i mianownik przez **najwyższą potęgę n** z mianownika:

- (5n + 1)/(2n − 3) → 5/2 (te same stopnie → iloraz współczynników przy najwyższych potęgach),
- (n + 7)/n² → 0 (mianownik rośnie szybciej),
- n²/(10n) → ∞ (licznik rośnie szybciej).

Kolejność „kto rośnie szybciej” (od najwolniejszej): **log n ≺ √n ≺ n ≺ n log n ≺ n² ≺ n³ ≺ 2ⁿ ≺ n!**. Stąd np. (100 · log n)/n → 0. Ta kolejność wróci w temacie o złożoności.

=== summary ===

:::exam Co trzeba umieć
Wiedzieć, czym jest algorytm, czym jest pseudokod (i jakie ma konwencje) oraz z jakich 3 części składa się kurs.
:::

## Algorytm i algorytmika

- **Algorytm** — dokładny opis (lista kroków), jak coś wykonać. Słowo od nazwiska *al-Khwarizmi* (780–850).
- **Algorytmika** to „serce informatyki”; jej rola rośnie w epoce *big data*.

## Pseudokod (konwencje z wykładu)

| Element | Zapis |
|---|---|
| zmienne | bez deklaracji |
| tablice | `[ ]`, indeksowane **od 0** |
| operatory | `=`, `==`, `<`, `&&`, `||`, `!`, `+=`, `++` |
| sterowanie | `if / else`, `while`, `for`, `return` |
| argumenty złożone | przekazywane przez referencję |

## Trzy części kursu

1. **Analiza** — dany kod: co robi i jak efektywnie?
2. **Projektowanie** — dana **specyfikacja**: zaprojektuj poprawny i efektywny algorytm.
3. **Struktury danych** — efektywna organizacja danych i operacji.

:::info Poza programem 2026/2027
Euklides, dziedzina algorytmiczna i logarytmy z tego tematu to materiał z 2025/2026 — przydaje się jako tło, ale nie jest wprost na slajdach 2026/2027.
:::

=== tasks ===

:::task level=1 source="Ćwiczenie 0, zad. 1 (zmienione)" title="Pierwsza liczba ujemna"
Napisz w pseudokodzie algorytm, który dla tablicy `T[0..n−1]` liczb całkowitych zwraca **indeks pierwszej liczby ujemnej**, a jeśli takiej nie ma — zwraca `−1`. Następnie odpowiedz:

1. Ile porównań elementów z zerem wykona algorytm w **najlepszym**, a ile w **najgorszym** przypadku?
2. Jak wyglądają dane najbardziej „złośliwe”?
::hint
Przeglądaj tablicę od lewej do prawej i zatrzymaj się przy pierwszym trafieniu. Najgorzej jest wtedy, gdy trzeba obejrzeć wszystko.
::solution
```pseudo
Algorytm PierwszaUjemna(T, n):
  Dane:  tablica T[0..n-1] liczb całkowitych, n ≥ 0
  Wynik: najmniejsze i takie, że T[i] < 0, albo -1
{
  i := 0;
  while i < n do {
    if T[i] < 0 then return i;
    i := i + 1;
  }
  return -1
}
```

- **Najlepszy przypadek:** `T[0] < 0` → **1 porównanie**.
- **Najgorszy przypadek:** brak liczb ujemnych albo jedyna ujemna na końcu → **n porównań** (każdy element sprawdzony raz).
- Złośliwe dane: tablica bez liczb ujemnych, np. `[3, 0, 8, 1]`.

Złożoność pesymistyczna jest więc **liniowa**: W(n) = n.
:::

:::task level=1 source="Ćwiczenie 0, zad. 2 (zmienione)" title="Paczki w sortowni kurierskiej"
W sortowni kuriera paczki przyjeżdżają taśmą w przypadkowej kolejności. Każda ma naklejony numer jednej z **20 ramp** wyjazdowych (1–20). Pracownik bierze paczki po kolei i ma sprawić, żeby na każdej rampie leżały tylko paczki z jej numerem.

1. Zaproponuj sposób działania (algorytm) pracownika.
2. Ile razy musi on „przenieść” paczkę, jeśli paczek jest n? Czy zależy to od kolejności na taśmie?
3. Czemu ten problem jest łatwiejszy niż „ułóż wszystkie paczki w jednej kolejce od najmniejszego numeru przesyłki do największego”?
::hint
Zwróć uwagę, że pracownik nie musi porównywać paczek między sobą — wystarczy mu przeczytać numer rampy.
::solution
1. Dla każdej paczki z taśmy: przeczytaj numer rampy `r`, połóż paczkę na rampie `r`. To wszystko.
2. Każda paczka jest przenoszona **dokładnie raz**, więc wykonujemy **n przeniesień** — niezależnie od kolejności na taśmie (złożoność liniowa).
3. Mamy tylko 20 możliwych „kategorii” i nie musimy porządkować paczek **wewnątrz** rampy. To tzw. **rozdzielanie do kubełków** — idea, która wróci przy sortowaniu przez zliczanie i kubełkowym (temat 7). Pełne uporządkowanie wszystkich n paczek metodą porównań wymaga w najgorszym razie rzędu n log n porównań.
:::

:::task level=1 source="Ćwiczenie 0, zad. 3 (zmienione)" title="Policz logarytmy"
Oblicz (albo uzasadnij, że wartość nie istnieje):

a) log₂ 256  b) log₂ (−256)  c) log₃ (1/81)  d) log₄ 32  e) log₁₀ 0,001
::hint
Zamień każde pytanie na „do jakiej potęgi…?”. W d) zapisz 4 i 32 jako potęgi dwójki.
::solution
a) 2⁸ = 256 → **8**
b) **nie istnieje** — potęga liczby 2 jest zawsze dodatnia
c) 3⁻⁴ = 1/81 → **−4**
d) 4 = 2², 32 = 2⁵, więc 4ˣ = 2²ˣ = 2⁵ → x = **5/2**
e) 10⁻³ = 0,001 → **−3**
:::

:::task level=2 source="Ćwiczenie 0, zad. 4 (zmienione)" title="Algebra logarytmów"
Niech **log₃ 2 = a**, **log₃ 5 = b**, **log₅ 7 = c**. Wyraź za pomocą a, b, c:

log₃ 10, log₃ 50, log₃ 20, log₃ 2,5, log₃ 7, log₃ 0,4, log₃ 28, log₅ 2, log₅ 18.
::hint
Rozłóż liczby na czynniki 2, 3, 5, 7. Pamiętaj, że log₃ 3 = 1. Do log₃ 7 użyj zamiany podstawy: log₅ 7 = log₃ 7 / log₃ 5.
::solution
- log₃ 10 = log₃ 2 + log₃ 5 = **a + b**
- log₃ 50 = log₃ 2 + 2·log₃ 5 = **a + 2b**
- log₃ 20 = 2·log₃ 2 + log₃ 5 = **2a + b**
- log₃ 2,5 = log₃ (5/2) = **b − a**
- log₃ 7 = log₅ 7 · log₃ 5 = **bc**
- log₃ 0,4 = log₃ (2/5) = **a − b**
- log₃ 28 = log₃ (4·7) = **2a + bc**
- log₅ 2 = log₃ 2 / log₃ 5 = **a / b**
- log₅ 18 = log₃ (2·3²) / log₃ 5 = **(a + 2) / b**
:::

:::task level=2 source="Ćwiczenie 0, zad. 5 (zmienione)" title="Ile cyfr?"
Ile cyfr dziesiętnych mają liczby **2²⁰²⁶** oraz **7¹⁰⁰**? Przyjmij log₁₀ 2 ≈ 0,30103 i log₁₀ 7 ≈ 0,845098.
::hint
Liczba cyfr x to ⌊log₁₀ x⌋ + 1, a log₁₀ (aᵏ) = k · log₁₀ a.
::solution
- log₁₀ 2²⁰²⁶ = 2026 · 0,30103 ≈ 609,89 → ⌊609,89⌋ + 1 = **610 cyfr**.
- log₁₀ 7¹⁰⁰ = 100 · 0,845098 ≈ 84,51 → ⌊84,51⌋ + 1 = **85 cyfr**.

(Obie odpowiedzi zostały sprawdzone dokładnym rachunkiem na dużych liczbach.)
:::

:::task level=2 source="Ćwiczenie 0, zad. 6 (zmienione)" title="Granice"
Oblicz granice przy n → ∞:

a) (6n + 2026) / (2n − 7)  b) (n + 9) / (5n²)  c) (n² + 3n + 1) / (4n)  d) (500 · log₂ n) / (0,1 · n)
::hint
Podziel licznik i mianownik przez najwyższą potęgę n z mianownika. W d) przypomnij sobie, że log n rośnie wolniej niż n.
::solution
a) dzielimy przez n: (6 + 2026/n)/(2 − 7/n) → **3**
b) dzielimy przez n²: (1/n + 9/n²)/5 → **0**
c) dzielimy przez n: (n + 3 + 1/n)/4 → **∞**
d) stała 500/0,1 = 5000 nie ma znaczenia, a log₂ n / n → 0, więc granica to **0**. (Wniosek: algorytm o koszcie 500·log n jest dla dużych n dużo szybszy niż taki o koszcie 0,1·n, mimo „brzydszej” stałej.)
:::
