---
id: t06
num: 6
type: topic
title: Rekursja i „dziel i rządź”, MergeSort
short: Rekursja i dziel i rządź
desc: Jak działa rekursja, wieże Hanoi, generowanie permutacji, zasada „dziel i rządź”, sortowanie przez scalanie i rozwiązywanie równań rekurencyjnych (twierdzenie o rekurencji uniwersalnej).
sources: asd4.pdf; asd5.pdf (§1 MergeSort); asd6.pdf (rekursja a stos); Dziel-RzadzC.pdf; Wyklady 2009/wyklad_2.pdf (rekurencja, tw. o rekurencji uniwersalnej)
exercises: asd 05.pdf (zad. 3), asd 06.pdf (zad. 2)
---

:::exam Sprawdzian 2026/2027
Ten temat powstał na podstawie wykładów 2025/2026. **Na sprawdzianach 2026/2027 obowiązują wersje ze slajdów M. Sydowa** — znajdziesz je w sekcji [„Wersja z wykładu 2026/2027”](topic:t06#wersja-z-wykładu-2026-2027-m-sydow-sortowanie-1-mergesort-i-) na końcu tematu (kod przepisany ze slajdów). Zadania dopuszczeniowe i zadania treningowe: [Sprawdziany 2026/2027](page:exams).
:::

## Czym jest rekursja?

:::def
Funkcja (metoda) jest **rekurencyjna**, jeśli wywołuje **samą siebie** — bezpośrednio albo pośrednio (przez inne funkcje).
:::

Rekursja często prowadzi do dużo **krótszych i czytelniejszych** algorytmów niż wersja bez niej. Każda poprawna funkcja rekurencyjna ma dwie części:

1. **przypadek bazowy** — tak małe dane, że wynik znamy od razu (bez rekursji),
2. **krok rekurencyjny** — sprowadzamy problem do **mniejszego** problemu tego samego typu.

:::analogy
Matrioszka: żeby zobaczyć najmniejszą laleczkę, otwierasz dużą, w środku jest mniejsza — robisz z nią **to samo**. Kończysz, gdy trafisz na laleczkę, której nie da się otworzyć (przypadek bazowy).
:::

:::warn
Brak przypadku bazowego (albo krok, który **nie zmniejsza** problemu) = nieskończona rekursja i błąd `StackOverflowError`.
:::

### Jak komputer wykonuje rekursję? Stos wywołań

Wykład asd6 zwraca uwagę: każde wywołanie działa na **własnych, lokalnych kopiach** parametrów i zmiennych. Po powrocie z wywołania rekurencyjnego trzeba kontynuować obliczenia na **poprzednich** wartościach — więc muszą być gdzieś przechowane. Taką strukturą jest **stos** (więcej o nim w temacie 9): każde wywołanie odkłada na stos swoje dane, a po zakończeniu je zdejmuje.

## Przykład 1: liczba w systemie dwójkowym

**Zadanie:** wypisz liczbę całkowitą x > 0 w systemie dwójkowym.

Ostatnią cyfrą binarną jest `x % 2`. Pozostałe cyfry to zapis binarny liczby `x / 2`. Musimy je wypisać **przed** ostatnią cyfrą — więc najpierw wywołujemy rekurencję, a dopiero potem drukujemy.

```text title="Wywołania dla x = 27"
dwojkowy(27): cyfra = 1, wywołaj dwojkowy(13)
  dwojkowy(13): cyfra = 1, wywołaj dwojkowy(6)
    dwojkowy(6): cyfra = 0, wywołaj dwojkowy(3)
      dwojkowy(3): cyfra = 1, wywołaj dwojkowy(1)
        dwojkowy(1): cyfra = 1  (x/2 = 0 — koniec rekursji)
        wypisz 1
      wypisz 1
    wypisz 0
  wypisz 1
wypisz 1                              → 11011
```

Zauważ, że cyfry wypisują się „w drodze powrotnej” — od najgłębszego wywołania.

## Przykład 2: wieże Hanoi

Mamy trzy pręty A, B, C. Na pręcie A leży n krążków o różnych średnicach — od największego na dole do najmniejszego na górze. Trzeba przenieść wszystkie krążki na pręt C, przestrzegając zasad:

- w jednym ruchu przenosimy **tylko jeden** (górny) krążek,
- **nigdy** nie kładziemy większego krążka na mniejszym,
- można korzystać z pręta B jako pomocniczego.

**Rekurencyjne rozwiązanie** (tak prosto, że aż zaskakuje): żeby przenieść n krążków z A na C:

1. przenieś (rekurencyjnie) **n − 1** górnych krążków z A na **B** (używając C),
2. przenieś **największy** krążek z A na C,
3. przenieś (rekurencyjnie) **n − 1** krążków z B na **C** (używając A).

```text title="Ruchy dla n = 3 (z A na C)"
A->C  A->B  C->B  A->C  B->A  B->C  A->C      (7 ruchów)
```

### Ile ruchów? {own}

:::own
Wyprowadzenie wzoru nie było na slajdach, ale często pojawia się na ćwiczeniach.
:::

Niech H(n) to liczba ruchów. Z opisu: H(0) = 0, **H(n) = 2·H(n − 1) + 1**. Kolejno: 1, 3, 7, 15, 31, … czyli **H(n) = 2ⁿ − 1** (dowód indukcyjny: 2·(2ⁿ⁻¹ − 1) + 1 = 2ⁿ − 1). To złożoność **wykładnicza** — i lepiej się nie da (największy krążek musi się ruszyć, a wcześniej wszystkie inne muszą „zejść mu z drogi”). Dla 64 krążków: 2⁶⁴ − 1 ≈ 1,8·10¹⁹ ruchów.

## Przykład 3: generowanie wszystkich permutacji

Ze slajdów 2009: wypisz wszystkie permutacje elementów tablicy. Pomysł: na ostatnią pozycję (k − 1) po kolei wstawiamy każdy z elementów, a pozostałe k − 1 pozycji permutujemy rekurencyjnie.

```text title="Wynik dla [1, 2, 3] (kolejność generowania)"
231  321  312  132  213  123
```

- liczba wypisanych permutacji: **n!**,
- złożoność czasowa: **Θ(n!)** (co najmniej tyle, ile wyników trzeba wypisać),
- dodatkowa pamięć: głębokość rekursji n, czyli **O(n)**.

```java title="Recursion.java — wszystkie trzy przykłady"
@include t06-recursion.java
```

## Zasada „dziel i rządź”

Starożytni Rzymianie mówili *divide et impera* — łatwiej rządzić, gdy poddani są podzieleni. W programowaniu robimy to „bardziej humanitarnie”:

:::def
**Dziel i rządź:**
1. umiemy rozwiązać problem dla **małych** danych (przypadek bazowy),
2. duże dane **dzielimy** tak, by sprowadzić problem do kilku **mniejszych** podproblemów,
3. rozwiązujemy podproblemy (zwykle rekurencyjnie),
4. **scalamy** ich wyniki w rozwiązanie całego problemu.
:::

Już znamy przykłady:

| Algorytm | Podział | Scalanie |
|---|---|---|
| min i max (temat 4) | na połowy | 2 porównania |
| InsertionSort rekurencyjnie (temat 5) | 1 ; n−1 | wstawienie elementu |
| **MergeSort** | na połowy | scalenie ciągów — liniowo |
| QuickSort (temat 7) | względem pivota | nic (wszystko robi podział) |

## MergeSort — sortowanie przez scalanie

**Pomysł:** podziel ciąg na dwie **połowy**, posortuj każdą (rekurencyjnie), a potem **scal** dwa posortowane ciągi w jeden.

:::analogy
Dwie posortowane talie kart leżą przed Tobą odkryte, najmniejsze karty na wierzchu. Porównujesz dwie górne karty, mniejszą odkładasz na stos wynikowy. Powtarzasz, aż któraś talia się skończy — resztę drugiej dokładasz na koniec. Tak działa scalanie.
:::

### Scalanie

Mamy posortowane fragmenty `c[l..s]` i `c[s+1..p]`. Trzymamy wskaźnik i na pierwszym, j na drugim i za każdym razem przepisujemy **mniejszy** z `c[i]`, `c[j]` do tablicy pomocniczej `b`.

- **Niezmiennik:** `b[l..k]` = scalone `c[l..i−1]` i `c[s+1..j−1]` (posortowane).
- Scalanie ciągów o długościach p i q wymaga **co najwyżej p + q − 1** porównań.

```array
lewy: {3} 27 38 43
prawy: {9} 10 82
b: 3 _ _ _ _ _ _
b: 3 9 10 27 38 43 82
```

### Algorytm

```pseudo title="MergeSort (wykład)"
Algorytm MergeSort(c, n)
{
  if n > 1 then Sortuj(0, n-1)
}

Sortuj(l, p):              // sortuje c[l..p]
{
  if l < p then {
    s := (l + p) div 2;
    Sortuj(l, s);
    Sortuj(s+1, p);
    Scal(l, s, p);          // scala c[l..s] z c[s+1..p]
  }
}
```

**Przykład** dla `[38, 27, 43, 3, 9, 82, 10]`:

```text title="Podziały i scalenia"
                [38 27 43 3 9 82 10]
           [38 27 43 3]        [9 82 10]
         [38 27]  [43 3]      [9 82]  [10]
        [38] [27] [43] [3]   [9] [82]
scal:   [27 38]   [3 43]     [9 82]
scal:      [3 27 38 43]      [9 10 82]
scal:          [3 9 10 27 38 43 82]
```

```java title="MergeSort.java"
@include t06-mergesort.java
```

### Analiza MergeSort

Najważniejsze jest scalanie — dla fragmentu `c[l..p]` wykonuje się ono za pomocą co najwyżej p − l porównań. Stąd równanie na liczbę porównań w **najgorszym** przypadku:

- T(1) = 0,
- **T(n) = T(⌊n/2⌋) + T(⌈n/2⌉) + n − 1**.

Rozwiązaniem jest **T(n) = n log₂ n + O(n)** (dla n = 2ᵏ dokładnie n log₂ n − n + 1). To **dużo** lepiej niż n²/2 algorytmów z tematu 5!

- **Wada:** potrzebna **dodatkowa pamięć O(n)** (tablica pomocnicza do scalania) i sporo przepisywania.
- **Zaleta:** czas n log n **zawsze** (także pesymistycznie), algorytm jest **stabilny** (przy równych kluczach bierzemy element z lewej części — `<=`).
- Wykład wspomina ciekawy problem: czy da się scalać **w miejscu**, bez dodatkowej tablicy? Przez lata był otwarty — został rozwiązany (twierdząco), ale takie metody są skomplikowane.

## Równania rekurencyjne — jak je rozwiązywać

Złożoność algorytmu rekurencyjnego zapisujemy **równaniem rekurencyjnym**. Oto trzy sposoby na jego rozwiązanie.

### 1. Rozwijanie (podstawianie) {own}

:::own
Metoda „rozwijania” to standardowa technika — na slajdach wynik był podany bez rachunków, więc dopisuję je dla jasności.
:::

Dla T(n) = 2T(n/2) + n − 1, n = 2ᵏ:

T(n) = 2T(n/2) + (n − 1)
 = 4T(n/4) + (n − 2) + (n − 1)
 = 8T(n/8) + (n − 4) + (n − 2) + (n − 1)
 = … = 2ᵏ·T(1) + k·n − (1 + 2 + … + 2ᵏ⁻¹)
 = 0 + n log₂ n − (n − 1).

### 2. Drzewo rekursji {own}

Narysuj drzewo wywołań i zapisz w każdym węźle koszt „własnej pracy” (bez wywołań). Dla MergeSort: na każdym z **log₂ n** poziomów łączny koszt scalania to ok. **n**, więc razem ok. **n log₂ n**.

### 3. Twierdzenie o rekurencji uniwersalnej

Ze slajdów 2009 — gotowy przepis na równania postaci **T(n) = a·T(n/b) + f(n)** (a ≥ 1, b > 1):

:::def
Porównaj f(n) z funkcją **n^(log_b a)**:
1. jeśli f(n) = O(n^(log_b a − ε)) dla pewnego ε > 0 (f rośnie **wolniej**), to **T(n) = Θ(n^(log_b a))**,
2. jeśli f(n) = Θ(n^(log_b a)) (tak samo szybko), to **T(n) = Θ(n^(log_b a) · log n)**,
3. jeśli f(n) = Ω(n^(log_b a + ε)) dla pewnego ε > 0 (f rośnie **szybciej**) oraz a·f(n/b) ≤ c·f(n) dla stałej c < 1, to **T(n) = Θ(f(n))**.
:::

:::analogy
Kto „wygrywa”: praca rozdzielona na liście drzewa rekursji (n^(log_b a)) czy praca wykonywana przy dzieleniu/scalaniu (f(n))? Jeśli liście — przypadek 1; remis — przypadek 2 (dochodzi log n, bo tyle jest poziomów); jeśli scalanie — przypadek 3.
:::

| Równanie | n^(log_b a) | Przypadek | Wynik | Przykład |
|---|---|---|---|---|
| T(n) = 2T(n/2) + n | n | 2 | Θ(n log n) | MergeSort |
| T(n) = T(n/2) + 1 | 1 | 2 | Θ(log n) | wyszukiwanie binarne |
| T(n) = 2T(n/2) + 2 | n | 1 | Θ(n) | min-max |
| T(n) = 3T(n/2) + n | n^1,585 | 1 | Θ(n^(log₂ 3)) | Karacuba (temat 8) |
| T(n) = 2T(n/2) + n² | n | 3 | Θ(n²) | |

:::warn
Twierdzenie **nie obejmuje** równań typu T(n) = T(n − 1) + n (podział „1 ; n−1”) — tam nie ma dzielenia przez b. Takie równania rozwiązujemy rozwijaniem: T(n) = n + (n−1) + … = Θ(n²).
:::


## Wersja z wykładu 2026/2027 (M. Sydow) — „Sortowanie 1” (MergeSort) i „Rekurencja”

:::exam
Na sprawdzianach obowiązuje poniższy **mergeSort(S, len)** ze slajdów: **m = len/2**, więc przy nieparzystej długości **lewa połowa jest krótsza** (7 → 3 | 4). `merge` używa ostrej nierówności `a1[i] < a2[j]`. Zadanie dopuszczeniowe: liczba porównań i ciągi przy ostatnim `merge()` — rozwiązane na stronie [Sprawdziany 2026/2027](page:exams).
:::

**Merge Sort** — „dziel i rządź”: (1) podziel ciąg na 2 połowy, (2) posortuj każdą połówkę oddzielnie (rekurencyjnie, dopóki mają długość > 1), (3) połącz posortowane połówki — złączenie dwóch posortowanych ciągów wymaga tylko liniowo wielu porównań.

```pseudo
mergeSort(S, len){
  if(len <= 1) return S[0:len]
  m = len/2
  return merge(mergeSort(S[0:m], m), m,
               mergeSort(S[m:len], len-m), len-m)
}
```

S[a:b] (notacja jak w Pythonie) to podciąg elementów S[i], a ≤ i < b; `merge(a1, len1, a2, len2)` złącza dwa posortowane podciągi i zwraca połączony posortowany ciąg:

```pseudo
merge(a1, len1, a2, len2){

  i = j = k = 0;
  result[len1 + len2] // (alokacja pamięci)

  while((i < len1) && (j < len2))
    if(a1[i] < a2[j]) result[k++] = a1[i++];
    else result[k++] = a2[j++];

  while(i < len1) result[k++] = a1[i++];

  while(j < len2) result[k++] = a2[j++];

  return result;
}
```

**Analiza merge:** operacja dominująca — porównanie 2 elementów lub indeksów; rozmiar danych n = len1 + len2; $W(n)=A(n)=\Theta(n)$; niestety $S(n)=\Theta(n)$ (alokujemy tablicę na połączone ciągi — można tego uniknąć na **listach dowiązaniowych**). **Analiza mergeSort:** na każdym poziomie rekurencji wywołania merge działają na ciągach o łącznej długości len, a poziomów jest log₂(len): $W(len)=A(len)=\Theta(len\cdot\log len)$ — złożoność **liniowo-logarytmiczna**. Przykład ze slajdów: 100 mln logów, 10⁹ porównań/s: insertionSort ≈ (10⁸)²/10⁹ s = 10⁷ s (**115 dni**), mergeSort ≈ 2,65·10⁹/10⁹ s (**2,65 sekundy**).

**Listy dowiązaniowe w mergeSort.** Węzły połączone dowiązaniami (wskaźnikami): `początek -> (2)-> (3)-> (5)-> (8)-> null`. Wystarczą listy **jednokierunkowe** (merge przechodzi każdą listę w jednym kierunku). Merge na listach tylko przestawia dowiązania, więc **nie zużywa dodatkowej pamięci** (poza stosem rekurencji), przy tej samej złożoności czasowej. Tablice: szybki dostęp bezpośredni, mało pamięci, ale wstawienie w środek — liniowe; listy: wstawienie/usunięcie podlisty w czasie **stałym**, ale wolny (liniowy) dostęp i pamięć na dowiązania.

### Rekurencja (wykład „Rekurencja”)

Aspekty rekurencji: **matematyczny** (definicja odwołująca się do samej siebie — niezbędny **przypadek bazowy**), **algorytmiczny** (technika „dziel i zwyciężaj”) i **programistyczny** (rekursja — funkcja wywołująca samą siebie). Przykład: n! = (n−1)!·n, 0! = 1 — bez przypadku bazowego definicja „rozwija się w nieskończoność” (2! = 1!·2 = 0!·1·2 = (−1)!·0·1·2…).

**Fibonacci:** F(0) = 0, F(1) = 1, F(n+1) = F(n) + F(n−1): 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, …

```pseudo
fibonacci(n){
   if (n < 2) return n;
   else return (fibonacci(n-1) + fibonacci(n-2));
}
```

Liczba wywołań rekurencyjnych jest **wykładniczą** funkcją n — fibonacci(50) liczy się zaskakująco długo (może zabraknąć pamięci na stos). Lepszy jest wzór **nierekurencyjny**. Rekurencji należy unikać, jeśli to możliwe i nie komplikuje bardzo algorytmu (koszt czasowy i pamięciowy — stos wywołań).

:::def Liniowe równanie rekurencyjne 2. rzędu
Jeśli $s_n=a\,s_{n-1}+b\,s_{n-2}$, rozwiązujemy **równanie charakterystyczne** $x^2-ax-b=0$:
1. jeden pierwiastek r: $s_n=c_1r^n+c_2\,n\,r^n$,
2. dwa pierwiastki r₁, r₂: $s_n=c_1r_1^n+c_2r_2^n$,

stałe c₁, c₂ wyznaczamy z wartości bazowych (n = 0, n = 1). Dla Fibonacciego (a = b = 1) daje to **wzór Bineta**: 
$$F(n)=\frac{1}{\sqrt5}\left(\left(\frac{1+\sqrt5}{2}\right)^{n}-\left(\frac{1-\sqrt5}{2}\right)^{n}\right),\qquad F(50)=12\,586\,269\,025$$

:::

**Wieże Hanoi.** n krążków na drążku A (największy na dole), przenieść na C, jeden ruch = jeden krążek z wierzchu, nigdy większy na mniejszym, pomocniczy drążek B. hanoi(0) = 0, hanoi(1) = 1, hanoi(2) = 3. Rekurencyjnie: przenieś n−1 krążków na B, największy na C, n−1 krążków z B na C: $\text{hanoi}(1)=1,\;\; \text{hanoi}(n)=2\cdot\text{hanoi}(n-1)+1$. „Rozwijanie sumy”: $\text{hanoi}(n)=\sum_{i=0}^{n-1}2^i=2^n-1$; hanoi(10) = 1023 (rośnie szybciej niż Fibonacci). Wzór dało się wyznaczyć **dzięki rekurencyjnemu ujęciu problemu**.

### Trzy często spotykane przypadki (n = 2ᵏ, t(1) = 0, c > 0 stała)

| Równanie | Rozwiązanie | Przykład |
|---|---|---|
| $t(n)=t(n/2)+c$ | $c\log n=\Theta(\log n)$ | rekurencyjny binSearch |
| $t(n)=t(\lfloor n/2\rfloor)+t(\lceil n/2\rceil)+c$ | $c(n-1)=\Theta(n)$ | rekurencyjne maksimum (max z lewej i prawej połowy) |
| $t(n)=t(\lfloor n/2\rfloor)+t(\lceil n/2\rceil)+cn$ | $c\,n\log n=\Theta(n\log n)$ | mergeSort |

:::def Twierdzenie o rekurencji uniwersalnej
$T(n)=a\,T(n/b)+f(n)$, a ≥ 1, b > 1 stałe, n/b to ⌊n/b⌋ lub ⌈n/b⌉, f asymptotycznie dodatnia:
1. $f(n)=O(n^{\log_b a-\varepsilon})$ dla pewnego ε > 0 ⇒ $T(n)=\Theta(n^{\log_b a})$,
2. $f(n)=\Theta(n^{\log_b a})$ ⇒ $T(n)=\Theta(n^{\log_b a}\log n)$,
3. $f(n)=\Omega(n^{\log_b a+\varepsilon})$ dla pewnego ε > 0 i $a\,f(n/b)\le c\,f(n)$ dla pewnego c < 1 („warunek regularności”) ⇒ $T(n)=\Theta(f(n))$.

Interpretacja: porównujemy rząd narzutu f(n) z $n^{\log_b a}$ — wyższy z nich wyznacza rząd T(n); przy równych dochodzi czynnik Θ(log n). (Dowód: Cormen i in., rozdz. 4.4.) MergeSort: a = 2, b = 2, f(n) = Θ(n) → przypadek 2 → Θ(n log n).
:::

### Zadania ze slajdów

- Pozytywne i negatywne aspekty rekurencji; rekurencyjna definicja Fibonacciego i pierwsze wyrazy; sekwencja ruchów Hanoi dla n = 3 i n = 4.
- Twierdzenie o równaniach liniowych 2. rzędu dla Fibonacciego; 3 schematy równań z przykładami algorytmów.
- Rekurencyjny binSearch i rekurencyjne minimum: kod, złożoność czasowa i pamięciowa, porównanie z wersją nierekurencyjną.
- Twierdzenie o rekurencji uniwersalnej dla mergeSort i rekurencyjnego binSearch (od autora strony: a = 1, b = 2, f = Θ(1) → przypadek 2 → Θ(log n)).

=== summary ===

## Wersja 2026/2027 (M. Sydow)

- mergeSort(S, len): m = len/2 (lewa krótsza), merge z `<`; merge: W = A = Θ(n), S = Θ(n); mergeSort Θ(len log len).
- Hanoi: hanoi(n) = 2·hanoi(n−1) + 1 = 2ⁿ − 1. Fibonacci rekurencyjnie — wykładniczo wiele wywołań; wzór Bineta.
- t(n/2) + c → Θ(log n); 2t(n/2) + c → Θ(n); 2t(n/2) + cn → Θ(n log n).
- Tw. uniwersalne: f vs n^(log_b a): mniejszy → Θ(n^(log_b a)); równy → ·log n; większy (+ regularność) → Θ(f).


## Rekursja

- funkcja wywołuje samą siebie; **przypadek bazowy** + **krok zmniejszający** problem.
- każde wywołanie ma lokalne kopie zmiennych → **stos wywołań**; pamięć = głębokość rekursji.

## Przykłady

- **dwójkowy(x):** cyfra x%2, najpierw rekursja dla x/2, potem wypisanie.
- **Hanoi:** n−1 na pomocniczy, największy na cel, n−1 na cel; **H(n) = 2H(n−1) + 1 = 2ⁿ − 1**.
- **Permutacje:** n! wyników, czas Θ(n!), pamięć O(n).

## Dziel i rządź

małe dane → wprost; duże → podziel, rozwiąż podproblemy, scal.

## MergeSort

- podział na połowy, rekursja, **scalanie** (≤ p + q − 1 porównań).
- T(n) = T(⌊n/2⌋) + T(⌈n/2⌉) + n − 1 = **n log₂ n + O(n)** (także pesymistycznie).
- pamięć **O(n)**, **stabilny**.

## Twierdzenie o rekurencji uniwersalnej: T(n) = aT(n/b) + f(n)

| f(n) vs n^(log_b a) | T(n) |
|---|---|
| wolniej | Θ(n^(log_b a)) |
| tak samo | Θ(n^(log_b a) log n) |
| szybciej (+ warunek regularności) | Θ(f(n)) |

Nie dotyczy T(n) = T(n−1) + … — tu rozwijamy.

=== tasks ===

:::task level=1 source="Ćwiczenie 5, zad. 3 (zmienione)" title="Wieże Hanoi dla n = 3 i n = 4"
Pręty nazywają się **L** (lewy), **M** (środkowy) i **R** (prawy). Na pręcie **L** leżą krążki. Przenieś je wszystkie na pręt **M**, używając **R** jako pomocniczego. Wypisz kolejne ruchy dla n = 3 oraz dla n = 4. Ile ich jest?
::hint
Dla n = 3: najpierw przenieś 2 krążki z L na **R** (pomocniczy dla tego kroku to M), potem największy z L na M, potem 2 krążki z R na M. Dla n = 4 użyj rozwiązania dla n = 3 dwa razy.
::solution
**n = 3** (7 ruchów):

L→M, L→R, M→R, L→M, R→L, R→M, L→M

**n = 4** (15 ruchów):

L→R, L→M, R→M, L→R, M→L, M→R, L→R, **L→M**, R→M, R→L, M→L, R→M, L→R, L→M, R→M

Pierwsze 7 ruchów przenosi 3 krążki z L na R, ruch 8 (pogrubiony) przenosi największy krążek z L na M, ostatnie 7 przenosi 3 krążki z R na M. Liczba ruchów: 2³ − 1 = 7 i 2⁴ − 1 = 15.
:::

:::task level=2 source="Ćwiczenie 6, zad. 2 (zmienione)" title="MergeSort krok po kroku"
Przedstaw działanie algorytmu **MergeSort** (wersja z wykładu, s = (l + p) div 2) na ciągu

`[12, 5, 3, 14, 8, 19, 6, 1, 15, 17, 16, 2, 13, 5, 27, 22]`.

Wypisz wszystkie scalenia w kolejności, w jakiej wykonuje je algorytm.
::hint
Algorytm najpierw schodzi rekurencyjnie do lewej połowy do końca, dopiero potem zajmuje się prawą. Pierwsze scalenie to [12] z [5].
::solution
Scalenia w kolejności wykonywania (wcięcie = głębokość rekursji):

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

Uwaga na dwie piątki: w ostatnim scaleniu 5 z lewej części (pierwotnie na pozycji 1) trafia **przed** 5 z prawej (pozycja 13) — MergeSort jest stabilny.
:::

:::task level=1 source="own" title="Rekursja na papierze"
Wykonaj „na papierze” funkcję `dwojkowy(45)` z wykładu. Wypisz drzewo wywołań i kolejność drukowanych cyfr. Jaka jest maksymalna głębokość rekursji dla liczby x?
::hint
Zapisz dla każdego wywołania: x, cyfrę x % 2 i x / 2. Cyfry drukuje się po powrocie z wywołania.
::solution
```text
dwojkowy(45): cyfra 1 → dwojkowy(22)
  dwojkowy(22): cyfra 0 → dwojkowy(11)
    dwojkowy(11): cyfra 1 → dwojkowy(5)
      dwojkowy(5): cyfra 1 → dwojkowy(2)
        dwojkowy(2): cyfra 0 → dwojkowy(1)
          dwojkowy(1): cyfra 1 (koniec)
          wypisz 1
        wypisz 0
      wypisz 1
    wypisz 1
  wypisz 0
wypisz 1
```
Wynik: **101101** (32 + 8 + 4 + 1 = 45 ✓). Głębokość rekursji = liczba cyfr binarnych = **⌊log₂ x⌋ + 1** (tu 6).
:::

:::task level=2 source="own" title="Twierdzenie o rekurencji uniwersalnej"
Rozwiąż (podaj rząd Θ):

a) T(n) = 4T(n/2) + n  b) T(n) = 4T(n/2) + n²  c) T(n) = 4T(n/2) + n³  d) T(n) = 8T(n/2) + n²  e) T(n) = T(n/3) + 1  f) T(n) = T(n − 1) + 1
::hint
Policz n^(log_b a) i porównaj z f(n). Uważaj na f) — to nie jest postać a·T(n/b).
::solution
a) n^(log₂ 4) = n², f = n rośnie wolniej → **Θ(n²)** (przypadek 1).
b) f = n² = n^(log₂ 4) → **Θ(n² log n)** (przypadek 2).
c) f = n³ rośnie szybciej; 4·(n/2)³ = n³/2 ≤ ½·n³ → **Θ(n³)** (przypadek 3).
d) n^(log₂ 8) = n³, f = n² wolniej → **Θ(n³)**.
e) n^(log₃ 1) = n⁰ = 1, f = 1 → **Θ(log n)** (przypadek 2).
f) twierdzenie nie działa; rozwijając: T(n) = T(0) + n → **Θ(n)**.
:::

:::task level=2 source="own" title="Ile porównań przy scalaniu?"
Scalamy posortowany ciąg długości p z posortowanym ciągiem długości q. Ile porównań wykona procedura Scal **najmniej**, a ile **najwięcej**? Podaj przykłady danych dla p = q = 3.
::hint
Scalanie kończy się, gdy jeden z ciągów się wyczerpie — resztę drugiego przepisujemy bez porównań.
::solution
- **Najmniej: min(p, q)** — gdy wszystkie elementy krótszego ciągu są mniejsze od wszystkich w drugim, np. `[1, 2, 3]` + `[4, 5, 6]` → 3 porównania.
- **Najwięcej: p + q − 1** — gdy elementy się „przeplatają” i oba ciągi kończą się prawie jednocześnie, np. `[1, 3, 5]` + `[2, 4, 6]` → 5 porównań.
:::

:::task level=3 source="own" title="Permutacje — ile wywołań?"
Dla procedury `permutations(a, k)` z wykładu (kod w Javie wyżej) policz, ile razy zostanie wywołana dla tablicy 4-elementowej (`permutations(a, 4)`), a ile permutacji wypisze. Znajdź wzór rekurencyjny na liczbę wywołań C(n).
::hint
Wywołanie z parametrem k (k > 1) wykonuje k wywołań z parametrem k − 1. Wywołanie z k = 1 tylko wypisuje.
::solution
C(1) = 1, **C(n) = 1 + n · C(n − 1)**. Stąd: C(2) = 3, C(3) = 10, **C(4) = 41** wywołań, a wypisanych permutacji **4! = 24**. Liczba wywołań to 1 + 4 + 4·3 + 4·3·2 = 41 (suma po poziomach drzewa rekursji).
:::
