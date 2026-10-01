---
id: t04
num: 4
type: topic
title: Wyszukiwanie i wybór — sekwencyjnie, binarnie, k-ty element
short: Wyszukiwanie i wybór
desc: Wyszukiwanie ze strażnikiem i binarne, dolne ograniczenie dla maksimum, min i max naraz, drugi największy (turniej) oraz algorytm Hoare'a wyboru k-tego elementu.
sources: asd3.pdf; Dziel-RzadzC.pdf (min-max); Wyklady 2009/wyklad_3.pdf i asd 07 wyklad_4.pdf (Problem wyszukania I i II)
exercises: asd 03.pdf (zad. 3), asd 05.pdf (zad. 4)
---

:::exam Sprawdzian 2026/2027
Ten temat powstał na podstawie wykładów 2025/2026. **Na sprawdzianach 2026/2027 obowiązują wersje ze slajdów M. Sydowa** — znajdziesz je w sekcji [„Wersja z wykładu 2026/2027”](topic:t04#wersja-z-wykładu-2026-2027-m-sydow-wyszukiwanie) na końcu tematu (kod przepisany ze slajdów). Zadania dopuszczeniowe i zadania treningowe: [Sprawdziany 2026/2027](page:exams).
:::

## Problem wyszukiwania

Mamy ciąg (tablicę) i pytamy: **czy jest w nim element a, a jeśli tak — na której pozycji?** To jedno z najczęstszych zadań w informatyce: szukanie kontaktu w telefonie, produktu w sklepie, słowa w słowniku.

To, jak szybko umiemy szukać, zależy od tego, **co wiemy o danych**:

- dane **nieuporządkowane** → trzeba (w najgorszym razie) obejrzeć wszystko,
- dane **posortowane** → można szukać dużo sprytniej.

## Wyszukiwanie sekwencyjne (liniowe)

Oglądamy elementy po kolei, od lewej. Znamy już wersję **ze strażnikiem** z tematu 3: na koniec tablicy wstawiamy szukane `a`, dzięki czemu pętla nie musi sprawdzać, czy nie wyszła poza tablicę.

- W(n) = n + 1 porównań, A(n) = (n + 1)/2.

**Czy da się lepiej dla danych nieuporządkowanych?** Nie. Wykład uzasadnia to tak: jeśli jedyną dostępną operacją jest porównanie szukanego elementu z elementem tablicy, to algorytm, który **nie obejrzał** którejś pozycji, nie może wiedzieć, czy właśnie tam nie ma `a`. Więc n porównań jest **niezbędnych**.

## Wyszukiwanie binarne

Załóżmy, że tablica jest **posortowana niemalejąco**. Teraz porównanie z jednym elementem daje nam dużo więcej informacji!

:::analogy
Zgadywanka „pomyślałem liczbę od 1 do 100”. Nie pytasz „czy to 1? czy 2? czy 3?”, tylko „czy większa niż 50?”. Każde pytanie **odcina połowę** możliwości, więc po ok. 7 pytaniach wiesz wszystko (2⁷ = 128 ≥ 100). Tak samo szukasz słowa w papierowym słowniku.
:::

Pomysł (ten sam co przy pierwiastku z tematu 2): trzymamy przedział `[l, p]`, w którym **na pewno** jest `a` (jeśli w ogóle jest w tablicy), i porównujemy `a` z elementem **środkowym** `L[s]`:

- jeśli `a > L[s]` — nie ma czego szukać na lewo od s (włącznie), więc `l := s + 1`,
- w przeciwnym razie — `a` (jeśli jest) leży w `[l, s]`, więc `p := s`.

Kończymy, gdy przedział ma długość 1.

:::def
**Niezmiennik** wyszukiwania binarnego: *jeśli `a` jest w tablicy L, to przynajmniej jedna jego kopia leży w badanym przedziale `L[l..p]`.* Gdy na końcu przedział jest jednoelementowy, wystarczy sprawdzić ten jeden element.
:::

```pseudo title="SzukajBin (wersja z wykładu)"
Algorytm SzukajBin(L, N, a):
  Dane:  N > 0, L[0..N-1] posortowana niemalejąco, a - szukany element
  Wynik: i takie, że L[i] = a (0 ≤ i ≤ N-1), albo N, gdy a nie ma w L
{
  l := 0;  p := N - 1;
  while l < p do {
    // Nzm.: a ∈ L  ⇔  a ∈ L[l..p]
    s := (l + p) div 2;          // div = dzielenie całkowite
    if a > L[s] then
      l := s + 1
    else
      p := s;
  }
  if a = L[l] then return l
  else return N
}
```

**Przykład:** szukamy 17 w `[1, 3, 5, 10, 17, 30, 35, 99]`:

```array
@idx
start: 1 3 5 [10] 17 30 35 99
l=4: ~1~ ~3~ ~5~ ~10~ 17 [30] 35 99
p=5: ~1~ ~3~ ~5~ ~10~ [17] 30 ~35~ ~99~
p=4: ~1~ ~3~ ~5~ ~10~ {17} ~30~ ~35~ ~99~
```

1. l = 0, p = 7, s = 3: 17 > 10 → l = 4,
2. l = 4, p = 7, s = 5: 17 ≤ 30 → p = 5,
3. l = 4, p = 5, s = 4: 17 ≤ 17 → p = 4,
4. l = p = 4: `L[4] = 17` → wynik **4**.

### Złożoność

Każdy obrót pętli zmniejsza przedział (mniej więcej) **o połowę**. Z przedziału długości N po k obrotach zostaje ok. N/2ᵏ, więc pętla wykona się ok. **⌈log₂ N⌉ razy** (plus jedno porównanie na końcu). Dla miliona elementów to tylko ~20 porównań zamiast miliona!

- **W(N) ≈ log₂ N** — złożoność **logarytmiczna**.
- **Stop:** wartość p − l jest naturalna i w każdym obrocie ostro maleje (bo l ≤ s < p).

:::tip
Ta wersja zawsze zwraca **pierwsze** wystąpienie `a` (najmniejszy indeks), nawet jeśli `a` występuje w tablicy wiele razy — bo przy równości (`a ≤ L[s]`) zawsze idziemy w lewo (`p := s`).
:::

:::warn
Wyszukiwanie binarne działa **tylko na posortowanej** tablicy. Na nieposortowanej może nie znaleźć elementu, który w niej jest.
:::

```java title="Search.java"
@include t04-search.java
```

### Inne metody dla danych posortowanych

Starsze slajdy (2009, „Problem wyszukania I”) pokazują jeszcze dwie metody:

- **Skoki co k** — sprawdzamy co k-ty element, a gdy „przeskoczymy” `a`, przeszukujemy liniowo ostatni blok. Najlepsze k to ok. **√n**, a złożoność to **O(√n)**.
- **Wyszukiwanie interpolacyjne** — zamiast środka sprawdzamy pozycję „proporcjonalną” do wartości (jak w książce telefonicznej: nazwisko na „W” szukasz bliżej końca). Dla danych o **równomiernym rozkładzie** średnio **O(log log n)**, ale w najgorszym przypadku **O(n)**.

## Maksimum: n − 1 porównań to minimum

Znalezienie największego elementu wymaga n − 1 porównań (każdy element poza zwycięzcą musi z kimś „przegrać”). Czy da się mniej? Wykład dowodzi, że **nie**:

:::def
Zbudujmy graf: wierzchołki to elementy, a krawędź łączy dwa elementy, które algorytm ze sobą porównał. Graf o n wierzchołkach i mniej niż n − 1 krawędziach **nie jest spójny** — ma co najmniej dwie części, których elementy nigdy nie były ze sobą porównywane. Maksimum może być w każdej z nich, więc algorytm nie może być pewny wyniku. Zatem **złożoność problemu maksimum wynosi n − 1 porównań**.
:::

Zwróć uwagę na ważne pojęcie: mówiąc o **złożoności problemu**, rozważamy **wszystkie możliwe** algorytmy, a nie tylko jeden.

## Minimum i maksimum naraz — dziel i rządź

Gdybyśmy szukali minimum i maksimum osobno, zrobilibyśmy 2n − 2 porównań. Wykład „Dziel i rządź” pokazuje lepszy sposób: podziel tablicę na dwie połówki, znajdź (min, max) w każdej, a potem połącz: min z dwóch minimów, max z dwóch maksimów.

- T(1) = 0, T(2) = 1, T(n) = 2T(n/2) + 2,
- rozwiązanie dla n = 2ᵏ: **T(n) = (3/2)·n − 2**.

:::def
**Twierdzenie Pohla:** problemu jednoczesnego znalezienia minimum i maksimum nie da się rozwiązać za pomocą mniej niż **⌈3n/2⌉ − 2** porównań. (Dowód: L. Banachowski, A. Kreczmar „Elementy analizy algorytmów”.)
:::

Ten sam wynik można uzyskać bez rekurencji — porównując elementy **parami** (to wersja od autora strony, łatwiejsza do zaprogramowania):

```java title="MinMax.java"
@include t04-minmax.java
```

Każda para kosztuje 3 porównania (wewnątrz pary, mniejszy z min, większy z max), czyli ok. 3n/2 zamiast 2n.

## Drugi co do wielkości — turniej

Ze slajdów 2009: szukamy **drugiego największego** elementu. Pomysł z turnieju tenisowego: elementy grają „mecze” parami, zwycięzca (większy) idzie dalej. Po n − 1 meczach znamy mistrza (maksimum).

Kto jest drugi? **Tylko ktoś, kto przegrał bezpośrednio z mistrzem!** (Każdy inny przegrał z kimś, kto nie jest mistrzem, więc jest co najwyżej trzeci.) Mistrz rozegrał ⌈log₂ n⌉ meczów, więc wybieramy maksimum z ⌈log₂ n⌉ kandydatów.

- łącznie: **n + ⌈log₂ n⌉ − 2** porównań (zamiast 2n − 3 przy naiwnym podejściu).

```text title="Turniej dla [7, 3, 12, 9, 15, 4, 11, 6]"
runda 1:   7  3 | 12  9 | 15  4 | 11  6     →   7, 12, 15, 11
runda 2:     7 12   |     15 11             →   12, 15
finał:           12  15                     →   15 (maksimum)
przegrali z 15:  4 (r1), 11 (r2), 12 (finał)  →  drugi = max(4, 11, 12) = 12
porównań: 7 (turniej) + 2 (kandydaci) = 9 = 8 + 3 - 2
```

## Wybór k-tego elementu — algorytm Hoare'a

**Problem:** znajdź element, który byłby na k-tej pozycji, gdyby ciąg posortować (np. **medianę**: k = ⌈n/2⌉). Oczywiście można posortować (O(n log n)) i wziąć k-ty. Ale da się szybciej — **średnio w czasie liniowym**.

### Funkcja partition (podział)

Najważniejsza część algorytmu. Bierzemy **element dzielący** (pivot) `v = a[l]` i przestawiamy fragment `a[l..r]` tak, żeby:

1. `v` stanął na swoim **ostatecznym** miejscu j (tam, gdzie byłby po posortowaniu),
2. na lewo od j były elementy **≤ v**,
3. na prawo od j były elementy **≥ v**.

Robimy to dwoma wskaźnikami: `i` idzie od lewej i zatrzymuje się na elemencie ≥ v, `j` idzie od prawej i zatrzymuje się na elemencie ≤ v. Te dwa elementy są „nie po swojej stronie” — zamieniamy je. Gdy wskaźniki się miną, wstawiamy v na pozycję j.

Przykład: partition dla `[7, 2, 9, 4, 8, 1, 6]`, v = 7:

```array
@idx
start: (7) 2 [9] 4 8 1 [6]
zamiana: (7) 2 6 4 [8] [1] 9
zamiana: (7) 2 6 4 1 8 9
koniec: 1 2 6 4 {7} 8 9
```

1. i zatrzymuje się na 9 (poz. 2), j na 6 (poz. 6) → zamiana,
2. i zatrzymuje się na 8 (poz. 4), j na 1 (poz. 5) → zamiana,
3. i zatrzymuje się na 8 (poz. 5), j na 1 (poz. 4) — minęły się → koniec pętli,
4. zamieniamy pivot z `a[j] = a[4]`: 7 trafia na pozycję **4** — i to jest jego miejsce w posortowanym ciągu.

### Algorytm Select

Po partition wiemy, że pivot jest na pozycji j, a w `a[l..j]` jest `j − l + 1` elementów (pivot i mniejsze). Porównujemy to z k:

- `k = j − l + 1` → **pivot jest szukanym elementem**,
- `k < j − l + 1` → szukamy dalej **w lewej części** `a[l..j−1]`,
- `k > j − l + 1` → szukamy w **prawej części** `a[j+1..p]`, ale teraz jako (k − (j − l + 1))-tego (bo tyle mniejszych elementów „odrzuciliśmy”).

```pseudo title="Select — algorytm Hoare'a"
Algorytm Select(a, n, k):
// a[0..n-1] - dany ciąg, k - "ranga" szukanego elementu (1..n)
{
  l := 0;  p := n - 1;
  jest := false;
  while not jest do {
    j := partition(a, l, p);
    // a[l..j-1] <= a[j] <= a[j+1..p]
    if k = j - l + 1 then jest := true
    else if k <= j - l then
      p := j - 1                   // k-ty jest w lewym podciągu
    else {
      k := k - (j - l + 1);        // pomijamy j-l+1 najmniejszych
      l := j + 1
    }
  }
  return a[j]
}
```

```java title="HoareSelect.java"
@include t04-select.java
```

### Złożoność algorytmu Hoare'a

- partition na fragmencie długości n wykonuje ok. n porównań,
- **pesymistycznie** pivot jest zawsze skrajny i fragment maleje tylko o 1: W(1) = 0, W(n) = (n + 1) + W(n − 1), stąd **W(n) = ½n² + O(n)**,
- **optymistycznie** trafiamy od razu: n + 1 porównań,
- **średnio** algorytm działa w **czasie liniowym**: A(n) = O(n) (fragment maleje średnio o stały ułamek).

:::info
Starsze slajdy (2009, „Problem wyszukania II”) wspominają algorytm **„magicznych piątek”** (Blum, Floyd, Pratt, Rivest, Tarjan): pivot wybiera się jako medianę median grup po 5 elementów. Gwarantuje to dobry podział i **liniowy czas także w najgorszym przypadku**, ale ze sporą stałą — w praktyce częściej używa się algorytmu Hoare'a.
:::

:::exam
Na ćwiczeniach często trzeba „przedstawić działanie algorytmu Hoare'a” — czyli wypisać **kolejne wywołania partition**: przedział (l, p), pivot, wynikową pozycję j, stan tablicy po podziale i nowe k. Zapisuj to w tabelce — tak jak w rozwiązaniu zadania 3 poniżej.
:::


## Wersja z wykładu 2026/2027 (M. Sydow) — „Wyszukiwanie”

:::exam
Na sprawdzianach 2026/2027 obowiązują poniższe specyfikacje i kod ze slajdów. Kod `search` (wyszukiwanie binarne) trzeba umieć **napisać z pamięci** i **zasymulować** na danych — patrz też [Sprawdziany 2026/2027](page:exams).
:::

**Dziel i rządź** — technika **projektowania** algorytmów: dzielimy problem na podproblemy (mniejsze dane) i wyjaśniamy, jak z ich rozwiązań otrzymać rozwiązanie całości. Często implementowana za pomocą **rekursji** (technika **programowania**: funkcja wywołuje samą siebie dla mniejszych danych).

:::def Problem wyszukiwania — search(S, len, key)
- **Input:** S — ciąg liczb całkowitych; len — długość ciągu; key (klucz) — liczba całkowita.
- **Output:** indeks (liczba naturalna mniejsza od len), pod którym w S znajduje się key (S[index] == key), **albo −1**, jeśli klucza nie ma.
- Przykład: S = (3,5,8,2,1,8,4,2,9): search(S, 9, 2) → 3; search(S, 9, 7) → −1.
:::

Naturalna **operacja dominująca** to **porównanie** klucza z elementem, **rozmiar danych** — długość ciągu len (może też obejmować inne parametry, np. k w algorytmie skoków). **Wyszukiwanie sekwencyjne** (indeksy 0..len−1) ma **W(len) = len**, i tej pesymistycznej złożoności **nie poprawi** zmiana kolejności przeglądania — szukany element zawsze może być pod ostatnim sprawdzanym indeksem.

**Ciąg posortowany.** Dodatkowa własność — **uporządkowanie** — pozwala szukać szybciej. Zmieniona specyfikacja: Input: S — ciąg **niemalejąco posortowanych** liczb całkowitych (wartości mogą się powtarzać), indeksowanych od 0; reszta bez zmian.

**Algorytm skoków co k.** Sprawdzamy co k-ty indeks (pomijając k−1 elementów w każdym „skoku”); po znalezieniu pierwszego elementu większego od klucza wystarczy sprawdzić ostatnie „przeskoczone” k−1 elementów. Dla len → ∞ jest w przeciętnym przypadku **asymptotycznie k razy szybszy** od sekwencyjnego (dla niewielkich k). Przy dobrym k (ćwiczenie: k = √len) W(len) = (1/k)·Θ(len) — ale to **wciąż złożoność liniowa**, tego samego rzędu.

**Wyszukiwanie binarne — idea:** (1) dopóki długość ciągu jest dodatnia: (2) porównaj klucz ze środkowym elementem; (3) równość → zwróć bieżący indeks; (4) klucz mniejszy → szukaj tylko w lewym podciągu; (5) większy → tylko w prawym; (6) wróć do 1; (7) długość spadła do zera → klucza nie ma.

```pseudo
search(S, len, key){

  l = 0
  r = len - 1

  while(l <= r){
    m = (l + r)/2
    if(S[m] == key) return m
    else
      if(S[m] > key) r = m - 1
      else l = m + 1
  }

  return -1
}
```

Zakłada się, że cały ciąg jest w **pamięci RAM** (o dostępie swobodnym) — sprawdzenie dowolnego S[m] ma czas stały. **Analiza:** rozmiar danych — len; operacja dominująca — porównanie `S[m] == key`; z każdą iteracją bieżący ciąg staje się **2 razy krótszy**, więc **W(len) = Θ(log₂ len)**, **A(len) = Θ(log₂ len)**, **S(len) = O(1)**. (Na liście dowiązaniowej lub „wolnym” dysku dostęp do S[m] nie jest stały — wtedy ta analiza nie działa.)

### Statystyki pozycyjne

**k-ta statystyka pozycyjna** — k-ty najmniejszy (lub największy) element ciągu; minimum to przypadek k = 1. W ciągu posortowanym zadanie jest trywialne, więc rozważamy ciągi **nieuporządkowane**.

**Drugi najmniejszy — second(S, len)** (elementy różne). Rozwiązanie proste: znajdź minimum, usuń je, znajdź minimum ponownie — **2·len − 1** porównań. **Algorytm turniejowy (dziel i rządź):** elementy grają w parach, mniejszy przechodzi dalej; zwycięzca = minimum. Drugi najmniejszy jest wśród elementów, które **przegrały ze zwycięzcą** (tylko z nim mógł przegrać). Turniej to drzewo binarne o **Θ(log₂ len)** poziomach; w pierwszej fazie **len − 1** porównań (każde porównanie eliminuje dokładnie jeden element), w drugiej szukamy minimum wśród ok. log₂ len kandydatów: **W(len) = len − 1 + Θ(log₂ len)** — asymptotycznie 2 razy szybciej niż dwukrotne szukanie minimum.

**k-ty najmniejszy — kthSmallest(S, len, k)** (1 ≤ k ≤ len, nic nie zakładamy o S). Naiwnie: k razy szukamy minimum — ok. k·len porównań.

:::def Procedura partition(S, l, r)
Bierze **pierwszy** element m podciągu S[l..r] i przestawia elementy tak, że na lewo od m są elementy **niewiększe**, a na prawo **niemniejsze** (niekoniecznie posortowane). **Zwraca** ostateczną pozycję i elementu m. Operacja dominująca: porównanie 2 elementów; rozmiar danych n = r − l + 1; można ją zaprojektować z **W(n) = n + O(1)** i **S(n) = O(1)** (kod — w wykładzie o QuickSort, [temat 7](topic:t07)).
:::

**Algorytm Hoare'a:** wykonaj partition; jeśli zwrócony indeks i = k, zwróć S[k]; jeśli i < k — powtarzaj na części na prawo od i, w przeciwnym razie na lewo („dziel i rządź”, jak w binSearch, ale podział rzadko jest w połowie). Dzięki liniowej partition **przeciętna** złożoność jest **liniowa — Θ(n) niezależnie od k**. Pesymistycznie jest **kwadratowa** (gdy partition za każdym razem trafia na koniec podciągu, który maleje tylko o 1).

### Przykładowe pytania ze slajdów

- Specyfikacja problemu wyszukiwania; algorytm skoków co k (specyfikacja, działanie, poprawność, złożoność, symulacja).
- Wyszukiwanie binarne: specyfikacja, działanie, **kod z pamięci (wersja z wykładu)**, poprawność, złożoność, symulacja.
- Statystyka pozycyjna; algorytm turniejowy; specyfikacja i złożoność partition; idea algorytmu Hoare'a; **dlaczego Hoare ma kwadratową pesymistyczną złożoność?**

=== summary ===

## Wersja 2026/2027 (M. Sydow)

- search: l = 0, r = len − 1, m = (l + r)/2; równość → m; S[m] > key → r = m − 1, wpp. l = m + 1; brak → −1.
- binarne: W = A = Θ(log len), S = O(1) (zakładamy RAM); sekwencyjne W = len; skoki co k: liniowo, ~k razy szybciej (k = √len).
- drugi najmniejszy: proste 2len − 1; turniej len − 1 + Θ(log len).
- partition: W(n) = n + O(1), S = O(1); Hoare: A = Θ(n) niezależnie od k, W = Θ(n²).


## Wyszukiwanie

| Metoda | Wymaganie | Złożoność |
|---|---|---|
| sekwencyjne (ze strażnikiem) | brak | W = n + 1, A = (n+1)/2 |
| binarne | tablica posortowana | ~⌈log₂ n⌉ obrotów + 1 porównanie |
| skoki co √n | posortowana | O(√n) |
| interpolacyjne | posortowana, rozkład równomierny | średnio O(log log n), najgorzej O(n) |

- Nieuporządkowane dane: n porównań jest niezbędne.
- **SzukajBin:** `s := (l+p) div 2; if a > L[s] then l := s+1 else p := s`; niezmiennik: a ∈ L ⇔ a ∈ L[l..p]; zwraca **pierwsze** wystąpienie; funkcja malejąca p − l.

## Wybór

- **max:** n − 1 porównań — to złożoność **problemu** (dowód grafowy: < n − 1 krawędzi ⇒ graf niespójny).
- **min i max naraz:** T(n) = 2T(n/2) + 2 ⇒ **3n/2 − 2**; tw. Pohla: ≥ ⌈3n/2⌉ − 2.
- **drugi największy:** turniej, **n + ⌈log₂ n⌉ − 2** (kandydaci = przegrani z mistrzem).

## Hoare (k-ty element)

- **partition(l, r):** v = a[l]; i od lewej do ≥ v, j od prawej do ≤ v, zamiana; na końcu v na pozycję j.
- k = j − l + 1 → znaleziony; k ≤ j − l → p := j − 1; inaczej k := k − (j − l + 1), l := j + 1.
- W(n) = ½n² + O(n), A(n) = O(n); „magiczne piątki” — O(n) nawet pesymistycznie.

=== tasks ===

:::task level=1 source="Ćwiczenia 3, zad. 3 (zmienione)" title="Ślad wyszukiwania binarnego"
Dana jest niemalejąca tablica

`E = [2, 4, 7, 9, 11, 14, 18, 21, 23, 27, 30, 33, 36, 40, 44, 48]` (indeksy 0…15).

Wykonaj algorytm **SzukajBin** z wykładu dla klucza **a = 30**, a potem dla **a = 20**. Wypisz ciąg sprawdzanych indeksów s (z wartościami l i p) oraz zwracaną wartość.
::hint
Pamiętaj: `s := (l + p) div 2`; jeśli `a > E[s]` to `l := s + 1`, w przeciwnym razie `p := s`. Pętla działa, dopóki `l < p`. Na końcu jest jeszcze jedno porównanie `a = E[l]`.
::solution
**a = 30:**

| krok | l | p | s | E[s] | decyzja |
|---|---|---|---|---|---|
| 1 | 0 | 15 | 7 | 21 | 30 > 21 → l = 8 |
| 2 | 8 | 15 | 11 | 33 | 30 ≤ 33 → p = 11 |
| 3 | 8 | 11 | 9 | 27 | 30 > 27 → l = 10 |
| 4 | 10 | 11 | 10 | 30 | 30 ≤ 30 → p = 10 |
| koniec | 10 | 10 | | | E[10] = 30 → **zwraca 10** |

Sprawdzane indeksy: **7, 11, 9, 10**, potem porównanie z E[10].

**a = 20:**

| krok | l | p | s | E[s] | decyzja |
|---|---|---|---|---|---|
| 1 | 0 | 15 | 7 | 21 | 20 ≤ 21 → p = 7 |
| 2 | 0 | 7 | 3 | 9 | 20 > 9 → l = 4 |
| 3 | 4 | 7 | 5 | 14 | 20 > 14 → l = 6 |
| 4 | 6 | 7 | 6 | 18 | 20 > 18 → l = 7 |
| koniec | 7 | 7 | | | E[7] = 21 ≠ 20 → **zwraca N = 16** („nie ma”) |

W obu przypadkach 4 obroty pętli = log₂ 16.
:::

:::task level=2 source="Ćwiczenia 3, zad. 3 — druga część (zmienione)" title="Poprawność i złożoność SzukajBin"
Udowodnij całkowitą poprawność algorytmu SzukajBin (niezmiennik + własność stopu) i oszacuj jego pesymistyczną złożoność dla tablicy długości N.
::hint
Niezmiennik: „jeśli a jest w tablicy, to jest w L[l..p]”. Pokaż, że żadna z dwóch gałęzi `if` nie wyrzuca z przedziału jedynego możliwego miejsca a. Funkcja malejąca: p − l.
::solution
**α:** N > 0, L posortowana niemalejąco. **β:** wynik i z L[i] = a, gdy a ∈ L; wynik N, gdy a ∉ L.

**Niezmiennik** g: (a ∈ L ⇒ a ∈ L[l..p]) ∧ 0 ≤ l ≤ p ≤ N − 1.
- **start:** l = 0, p = N − 1 — przedział to cała tablica ✓.
- **obrót:** s = (l+p) div 2, więc l ≤ s < p.
  - jeśli a > L[s], to (bo L posortowana) a > L[l..s], więc a nie ma w L[l..s]; po l := s + 1 niezmiennik trwa ✓,
  - jeśli a ≤ L[s], to wszystkie elementy L[s+1..p] są ≥ L[s] ≥ a — jeśli a jest w L[l..p], to pierwsze jego wystąpienie jest w L[l..s]; po p := s niezmiennik trwa ✓.
- **koniec:** ¬(l < p) i l ≤ p ⇒ l = p. Z g: jeśli a ∈ L, to a = L[l]. Instrukcja `if a = L[l]` zwraca więc poprawny wynik ✓.

**Stop:** f = p − l ∈ ℕ; ponieważ l ≤ s < p, w gałęzi „l := s + 1” l ostro rośnie, a w gałęzi „p := s” p ostro maleje — f ostro maleje ✓.

**Złożoność:** po każdym obrocie długość przedziału (p − l + 1) spada z m do co najwyżej ⌈m/2⌉. Po ⌈log₂ N⌉ obrotach zostaje 1 element. W(N) = **⌈log₂ N⌉ + 1** porównań (+1 to porównanie końcowe) = **Θ(log N)**.
:::

:::task level=2 source="Ćwiczenie 5, zad. 4 (zmienione)" title="Algorytm Hoare'a krok po kroku"
Przedstaw działanie algorytmu Hoare'a (z funkcją partition z wykładu, pivot = pierwszy element przedziału) przy wyszukiwaniu **6. co do wielkości (6. najmniejszego)** elementu w tablicy

`S = [12, 5, 3, 14, 8, 19, 6, 1, 15, 17, 16, 2, 13, 5, 27, 22]`.
::hint
Po każdym partition policz rangę pivota w przedziale: j − l + 1, i porównaj z k. Pamiętaj o zmniejszeniu k, gdy idziesz w prawo.
::solution
**1. partition(0, 15)**, v = 12:
- i staje na 14 (poz. 3), j na 5 (poz. 13) → zamiana,
- i staje na 19 (poz. 5), j na 2 (poz. 11) → zamiana,
- i staje na 15 (poz. 8), j na 1 (poz. 7) — minęły się,
- 12 na pozycję 7:

```array
@idx
po 1.: 1 5 3 5 8 2 6 {12} 15 17 16 19 13 14 27 22
```
Ranga pivota = 7 − 0 + 1 = 8; k = 6 < 8 → **lewa część**, p = 6.

**2. partition(0, 6)**, v = 1: nic mniejszego — 1 zostaje na pozycji 0. Ranga = 1; k = 6 > 1 → **prawa część**: k = 6 − 1 = **5**, l = 1.

**3. partition(1, 6)**, v = 5 (fragment `[5, 3, 5, 8, 2, 6]`):
- i staje na 5 (poz. 3), j na 2 (poz. 5) → zamiana → `[5, 3, 2, 8, 5, 6]`,
- i staje na 8 (poz. 4), j na 2 (poz. 3) — minęły się,
- 5 na pozycję 3 → fragment `[2, 3, 5, 8, 5, 6]`.

Ranga = 3 − 1 + 1 = 3; k = 5 > 3 → **prawa część**: k = 5 − 3 = **2**, l = 4.

**4. partition(4, 6)**, v = 8 (fragment `[8, 5, 6]`): nic większego → 8 na pozycję 6, fragment `[6, 5, 8]`. Ranga = 3; k = 2 ≤ 2 → **lewa część**, p = 5.

**5. partition(4, 5)**, v = 6 (fragment `[6, 5]`): 6 na pozycję 5 → `[5, 6]`. Ranga = 5 − 4 + 1 = 2 = k → **znaleziony**.

```array
@idx
koniec: 1 2 3 5 5 {6} 8 12 15 17 16 19 13 14 27 22
```

**Wynik: 6.** (Sprawdzenie: posortowany ciąg to 1, 2, 3, 5, 5, **6**, 8, 12, … — szósty element to 6 ✓.)
:::

:::task level=1 source="own" title="Ile porównań dla min i max?"
Ile porównań wykona metoda „parami” (lub dziel i rządź), szukając jednocześnie minimum i maksimum w tablicy o **n = 10** elementach, a ile dla **n = 11**? Ile porównań wykonałoby naiwne podejście (osobno min, osobno max)?
::hint
Dla n parzystego: 1 porównanie pierwszej pary + 3 porównania na każdą kolejną parę. Dla nieparzystego pierwszy element jest od razu min i max.
::solution
- n = 10: 1 + 3 · 4 = **13** = 3·10/2 − 2.
- n = 11: 0 + 3 · 5 = **15** = ⌈3·11/2⌉ − 2.
- Naiwnie: 2n − 2 → **18** i **20**.

Według twierdzenia Pohla mniej się nie da.
:::

:::task level=2 source="own" title="Drugi największy w turnieju"
Dla tablicy `[21, 8, 14, 30, 5, 17, 26, 11]` znajdź drugi co do wielkości element metodą turniejową. Wypisz rundy, kandydatów i policz porównania. Porównaj z wzorem n + ⌈log₂ n⌉ − 2.
::hint
Zwycięzca meczu = większy element. Kandydaci na drugie miejsce to tylko ci, którzy przegrali bezpośrednio z mistrzem.
::solution
- runda 1: (21, 8) → 21, (14, 30) → 30, (5, 17) → 17, (26, 11) → 26 — 4 porównania,
- runda 2: (21, 30) → 30, (17, 26) → 26 — 2 porównania,
- finał: (30, 26) → **30** — 1 porównanie.

Z mistrzem 30 przegrali: **14** (r1), **21** (r2), **26** (finał). Maksimum z nich: 2 porównania → **26**.

Razem: 7 + 2 = **9** = 8 + 3 − 2 ✓ (naiwnie: 7 + 6 = 13).
:::
