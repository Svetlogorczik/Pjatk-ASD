---
id: mock
type: page
title: Testy próbne — wejściówki i sprawdziany 2026/2027
short: Testy próbne
icon: 🧪
eyebrow: Przygotowanie do zaliczenia · cały materiał 2026/2027
desc: 13 wejściówek (po jednej na każdy wykład), dwa warianty próbnego sprawdzianu praktycznego i próbny sprawdzian wiedzy — wszystko z rozwiązaniami krok po kroku i odpowiedziami.
---

:::info Jak korzystać z tej strony
Testy ułożył autor strony na podstawie **zakresu i typów zadań z 2026/2027** (zasady: [Zaliczenie przedmiotu](page:course), typy zadań: [Sprawdziany 2026/2027](page:exams)). Prawdziwe testy mogą wyglądać inaczej. Wszystkie wyniki algorytmów sprawdzono programem działającym **dokładnie jak wersje ze slajdów**.
:::

:::tip Najlepszy sposób nauki
1. Rozwiąż test **na kartce, bez notatek**, z zegarkiem.
2. Dopiero potem otwórz **Rozwiązanie** i porównaj krok po kroku.
3. Policz punkty (próg zaliczenia sprawdzianu: **10 z 20**). Błędne tematy powtórz z konspektu (przycisk „Konspekt” w temacie).
:::

| Część | Co sprawdza | Punkty | Próg |
|---|---|---|---|
| [Wejściówki](page:mock#wejściówki-po-jednej-na-wykład) | definicje i proste zadania z **poprzedniego wykładu** | 12 × 1 | 5 |
| [Sprawdzian praktyczny](page:mock#próbny-sprawdzian-praktyczny-wariant-a) | działanie algorytmów na danych | 20 | 10 |
| [Sprawdzian wiedzy](page:mock#próbny-sprawdzian-wiedzy) | definicje, złożoności, analiza kodu, pseudokod | 20 | 10 |

## Wejściówki — po jednej na wykład

Każda to ok. 5 minut. Odpowiedz krótko, potem sprawdź.

:::task level=1 source=own title="W1 · Poprawność algorytmów"
1. Podaj definicję **częściowej poprawności**.
2. Czym różni się od niej **poprawność całkowita**?
3. Czy algorytm `sum = 0; i = 0; while(i < len) sum += a[i]; return sum` (brak `i++`) jest częściowo poprawny? Czy jest całkowicie poprawny?
::solution
1. Algorytm jest częściowo poprawny, jeśli **jeżeli się zatrzyma** (dla poprawnych danych), **to** zwraca poprawny wynik.
2. Całkowita = częściowa poprawność **+ własność stopu** (zatrzymuje się dla każdych poprawnych danych).
:::answer
3. **Częściowo poprawny — tak** (zatrzymuje się tylko dla len = 0 i wtedy zwraca poprawne 0). **Całkowicie — nie** (dla len > 0 pętla jest nieskończona).
:::
:::

:::task level=1 source=own title="W2 · Złożoność obliczeniowa"
1. Co to jest **operacja dominująca**?
2. Podaj definicję $f(n)=O(g(n))$.
3. Uszereguj rosnąco rzędami: $n\log n$, $\sqrt n$, $2^n$, $\log n$, $n^2$.
::solution
1. Operacja (zbiór operacji), której liczba jest **proporcjonalna do liczby wszystkich operacji** algorytmu.
2. $f(n)=O(g(n)) \iff \exists_{c>0}\,\exists_{n_0}\,\forall_{n\ge n_0}\; f(n)\le c\cdot g(n)$.
:::answer
3. $\log n \prec \sqrt n \prec n\log n \prec n^2 \prec 2^n$.
:::
:::

:::task level=1 source=own title="W3 · Wyszukiwanie"
1. Jakie założenie o danych musi spełniać wyszukiwanie binarne?
2. Podaj indeksy porównywane z kluczem i wynik: S = 1, 3, 5, 7, 9, 11, 13; key = 11.
3. Podaj $W(len)$ wyszukiwania sekwencyjnego i binarnego.
::solution
1. Ciąg **posortowany niemalejąco** (i w pamięci o dostępie swobodnym — RAM).
2. l=0, r=6 → m=3 (7 < 11) → l=4; m=5 (11) — znaleziono.
:::answer
2. Indeksy **3, 5**, wynik **5**. 3. Sekwencyjne $W=len$, binarne $W=\Theta(\log_2 len)$.
:::
:::

:::task level=1 source=own title="W4 · Sortowanie 1"
1. Podaj tablicę po **2 przebiegach** insertion sort dla 5, 2, 4, 1.
2. Ile wynosi $W$ i $A$ dla selection sort?
3. Jaka jest złożoność pamięciowa funkcji `merge` (na tablicach) i dlaczego?
::solution
1. Przebieg 1: 2, 5, 4, 1. Przebieg 2: 2, 4, 5, 1.
2. $W=A=\frac{n(n-1)}{2}=\Theta(n^2)$ — liczba porównań nie zależy od danych.
:::answer
1. **2, 4, 5, 1**. 2. $W=A=\Theta(n^2)$. 3. $S(n)=\Theta(n)$ — alokujemy tablicę `result` na połączone ciągi.
:::
:::

:::task level=1 source=own title="W5 · Sortowanie 2"
1. Kiedy algorytm sortujący jest **stabilny**?
2. Wykonaj `partition` (pivot = pierwszy) na 4, 7, 1, 6, 2: zwrócony indeks, tablica, liczba swapów.
3. Jaka jest dolna granica złożoności sortowania przez porównania?
::solution
1. Gdy zachowuje względną kolejność elementów o **równych** wartościach.
2. swap(1, 4): 4, 2, 1, 6, 7; i staje na 6 (indeks 3), j schodzi do i; a[3] = 6 > 4 → pivot na indeks 2.
:::answer
2. Indeks **2**, tablica **1, 2, 4, 6, 7**, swapy **2**. 3. $\Theta(n\log n)$ (bo $\log_2 n! = \Theta(n\log n)$).
:::
:::

:::task level=1 source=own title="W6 · Rekurencja"
1. Ile ruchów wymaga hanoi(4)?
2. Rozwiąż $t(n)=t(n/2)+c$, $t(1)=0$.
3. Zastosuj twierdzenie o rekurencji uniwersalnej do $T(n)=2T(n/2)+\Theta(n)$.
::solution
1. $\text{hanoi}(n)=2^n-1$.
2. $n=2^k$: $t(2^k)=t(2^{k-1})+c=\dots=kc=c\log n$.
3. $a=b=2$: $n^{\log_2 2}=n$, $f(n)=\Theta(n)$ — przypadek 2.
:::answer
1. **15**. 2. $\Theta(\log n)$. 3. $\Theta(n\log n)$ (mergeSort).
:::
:::

:::task level=1 source=own title="W7 · Listy i abstrakcyjne struktury danych"
1. Co to jest abstrakcyjna struktura danych?
2. Podaj interfejs stosu i jego zasadę.
3. Dlaczego kolejkę dwustronną implementuje się na liście **dwukierunkowej**?
::solution
1. Struktura zdefiniowana przez **zestaw operacji** (interfejs), bez wnikania w implementację.
2. `push(e)`, `pop()`, `top()` — **LIFO**.
:::answer
3. Bo `popBack` na liście jednokierunkowej wymaga przejścia całej listy ($O(n)$); na dwukierunkowej wszystkie operacje są $O(1)$.
:::
:::

:::task level=1 source=own title="W8 · Kolejka priorytetowa"
1. Podaj definicję kopca binarnego (typu min).
2. Podaj wzory na indeks rodzica i synów w tablicy od 1.
3. Wstaw 5 do kopca [2, 6, 3, 7, 12, 9, 4, 8, 10] (tablica od indeksu 1).
::solution
1. Drzewo binarne **zupełne** z warunkiem: priorytet w węźle ≤ priorytety w potomkach.
2. rodzic $\lfloor i/2\rfloor$, synowie $2i$, $2i+1$.
3. 5 na indeks 10; rodzic (5) = 12 > 5 → zamiana; rodzic (2) = 6 > 5 → zamiana; rodzic (1) = 2 — stop.
:::answer
3. **[2, 5, 3, 7, 6, 9, 4, 8, 10, 12]**.
:::
:::

:::task level=1 source=own title="W9 · Słowniki, BST, haszowanie"
1. Podaj warunek porządku BST.
2. Wstaw do pustego BST 8, 3, 12, 6, 15, 5 i podaj obchód in-order.
3. Co to jest współczynnik obciążenia α i jaka jest złożoność operacji na tablicy mieszającej?
::solution
1. Dla każdego węzła $x$: klucze lewego poddrzewa $\le x \le$ klucze prawego.
2. Drzewo: 8(3(_, 6(5, _)), 12(_, 15)).
:::answer
2. in-order: **3, 5, 6, 8, 12, 15**. 3. $\alpha=n/m$, operacje $O(\alpha)$.
:::
:::

:::task level=1 source=own title="W10 · Wprowadzenie do grafów"
1. Podaj dwie równoważne charakteryzacje drzewa o n wierzchołkach.
2. Jaki jest koszt pamięciowy macierzy sąsiedztwa i list sąsiedztwa?
3. Kiedy digraf jest silnie spójny?
::solution
1. Np.: spójny i ma $n-1$ krawędzi; acykliczny i ma $n-1$ krawędzi; każde dwa wierzchołki łączy dokładnie jedna droga elementarna.
2. Macierz $\Theta(n^2)$, listy $\Theta(n+m)$.
:::answer
3. Gdy dla **każdej uporządkowanej pary** różnych wierzchołków istnieje droga skierowana z pierwszego do drugiego.
:::
:::

:::task level=1 source=own title="W11 · BFS i DFS"
Graf nieskierowany: A–B, A–C, B–D, C–D, D–E (sąsiedzi alfabetycznie).
1. Kolejność BFS od A i odległości `d`.
2. Kolejność DFS (rekurencyjny) od A i czasy `d/f`.
3. Jakiej struktury danych używa BFS, a jakiej DFS?
::solution
1. A (0); B, C (1); D (2, przez B); E (3).
2. A → B → D → C (D ma sąsiadów B, C, E) → powrót → E.
:::answer
1. **A, B, C, D, E**; d: A 0, B 1, C 1, D 2, E 3. 2. **A, B, D, C, E**; d/f: A 0/9, B 1/8, D 2/7, C 3/4, E 5/6. 3. BFS — **kolejka**, DFS — **stos** (rekurencja).
:::
:::

:::task level=1 source=own title="W12 · Najkrótsze ścieżki"
1. Zapisz relaksację krawędzi (u, v).
2. Kiedy nie wolno użyć algorytmu Dijkstry?
3. Podaj złożoność: DAG, Dijkstra (kopiec binarny), Bellman-Ford.
::solution
1. `if u.distance + w(u,v) < v.distance: v.distance = u.distance + w(u,v); v.parent = u`.
2. Gdy w grafie są **ujemne wagi** krawędzi.
:::answer
3. DAG $O(n+m)$; Dijkstra $O((n+m)\log n)$; Bellman-Ford $O(nm)$.
:::
:::

:::task level=1 source=own title="W13 · Minimalne drzewa rozpinające"
1. Co to jest drzewo rozpinające?
2. Sformułuj własność rozcięcia.
3. Kruskal na grafie A–B (1), B–C (2), A–C (2), C–D (3), B–D (3): krawędzie w kolejności akceptacji (remisy alfabetycznie).
::solution
1. Podgraf spójnego grafu, który jest drzewem i zawiera **wszystkie** wierzchołki.
2. Najlżejsza krawędź dowolnego rozcięcia należy do pewnego MST.
3. A–B (1) ✓; A–C (2) ✓ (przed B–C alfabetycznie); B–C (2) ✗ cykl; B–D (3) ✓ (przed C–D); C–D (3) ✗.
:::answer
3. **A–B, A–C, B–D**, waga **6**.
:::
:::

## Próbny sprawdzian praktyczny — wariant A

10 zadań × 2 punkty. Próg: **10 punktów**. Sąsiedzi i remisy — **alfabetycznie**.

:::task level=1 source=own title="A1 · Rzędy funkcji"
a) Uszereguj rosnąco: $3n^2$, $\log_2 n$, $2^n$, $n\log n$, $\sqrt n$, $100n$, $n!$, $n^3$.

b) Prawda czy fałsz: $n^2=O(n^3)$; $2^n=O(n^{100})$; $\log_2 n=\Theta(\log_{10} n)$; $n\log n=o(n^2)$; $5n+3=\Omega(n^2)$.
::solution
:::answer
a) $\log_2 n \prec \sqrt n \prec 100n \prec n\log n \prec 3n^2 \prec n^3 \prec 2^n \prec n!$

b) **P, F, P, P, F**.
:::
:::

:::task level=1 source=own title="A2 · Binary search"
S = 4, 9, 15, 21, 28, 33, 40, 47, 52, 66, 71, 80, 94. Podaj indeksy porównywane z kluczem i wynik dla a) key = 47, b) key = 10.
::solution
a) l=0, r=12 → m=6 (40 < 47) → l=7; m=9 (66 > 47) → r=8; m=7 (47) ✓.

b) m=6 (40 > 10) → r=5; m=2 (15 > 10) → r=1; m=0 (4 < 10) → l=1; m=1 (9 < 10) → l=2 > r.
:::answer
a) **6, 9, 7** → **7**. b) **6, 2, 0, 1** → **−1**.
:::
:::

:::task level=1 source=own title="A3 · Selection i insertion sort"
Dla 34, 12, 45, 3, 27, 8: a) tablica po **2 przebiegach** selection sort, b) tablica po **3 przebiegach** insertion sort i łączna liczba porównań całego insertion sort.
::solution
a) 3, 12, 45, 34, 27, 8 → 3, 8, 45, 34, 27, 12.

b) 12, 34, 45, 3, 27, 8 → 12, 34, 45, 3, 27, 8 → 3, 12, 34, 45, 27, 8 (porównania: 1 + 1 + 3 = 5); dalej 27: 3 porównania, 8: 5 porównań.
:::answer
a) **3, 8, 45, 34, 27, 12**. b) **3, 12, 34, 45, 27, 8**; porównań łącznie **13**.
:::
:::

:::task level=2 source=own title="A4 · Merge sort"
S = 8, 3, 5, 1, 9, 6, 2, 7, 4. Podaj łączną liczbę porównań i ciągi przy ostatnim `merge()`.
::hint
m = 9/2 = 4: lewa część ma 4 elementy, prawa 5.
::solution
Lewa (8, 3, 5, 1): (8)+(3): 1, (5)+(1): 1, (3, 8)+(1, 5): 3 → 5 porównań. Prawa (9, 6, 2, 7, 4) → (9, 6) | (2, 7, 4): (9)+(6): 1; (2) | (7, 4): (7)+(4): 1, (2)+(4, 7): 1; (6, 9)+(2, 4, 7): 4 → 7 porównań. Ostatni merge (1, 3, 5, 8)+(2, 4, 6, 7, 9): 8 porównań.
:::answer
**20** porównań; ostatni merge: **1, 3, 5, 8 | 2, 4, 6, 7, 9**.
:::
:::

:::task level=2 source=own title="A5 · partition"
S = 7, 3, 10, 1, 9, 5, 12, 2, 8, 6. Podaj zwrócony indeks, pierwszy element po partition i liczbę swapów (z ostatnim).
::solution
swap(2, 9): 7, 3, 6, 1, 9, 5, 12, 2, 8, 10; swap(4, 7): 7, 3, 6, 1, 2, 5, 12, 9, 8, 10; i staje na 12 (indeks 6) → p = 5; pivot na indeks 5: 5, 3, 6, 1, 2, 7, 12, 9, 8, 10.
:::answer
Indeks **5**, pierwszy element **5**, swapów **3**.
:::
:::

:::task level=1 source=own title="A6 · Count sort"
S = 3, 0, 2, 3, 1, 4, 2, 0, 3, 1, 4, 3. Podaj `counts` po każdej z 3 faz.
::solution
:::answer
zliczanie: **2, 2, 2, 4, 2**; sumowanie: **2, 4, 6, 10, 12**; po wypisaniu: **0, 2, 4, 6, 10**.
:::
:::

:::task level=1 source=own title="A7 · Radix sort"
Posortuj 512, 033, 908, 247, 061, 380, 124, 075 (LSD, podstawa 10) — ciąg po każdej fazie.
::solution
:::answer
jedności: **380, 61, 512, 33, 124, 75, 247, 908**; dziesiątki: **908, 512, 124, 33, 247, 61, 75, 380**; setki: **33, 61, 75, 124, 247, 380, 512, 908**.
:::
:::

:::task level=2 source=own title="A8 · Kopiec typu min"
S = 9, 4, 12, 7, 1, 8, 3, 10 (tablica od 1). a) po kolejnych insert, b) a) + delMin, c) construct.
::solution
a) insert 7 zamienia się z 9; insert 1 wędruje z indeksu 5 do korzenia; insert 8 zamienia się z 12; insert 3 — z 8.

b) 10 do korzenia → zamiana z 3 → zamiana z 8.

c) i = 4: 7 vs 10 — bez zmian; i = 3: 12 ↔ 3; i = 2: 4 ↔ 1; i = 1: 9 ↔ 1, potem 9 ↔ 4 (dalej brak synów).
:::answer
a) **1, 4, 3, 9, 7, 12, 8, 10**; b) **3, 4, 8, 9, 7, 12, 10**; c) **1, 4, 3, 7, 9, 8, 12, 10**.
:::
:::

:::task level=2 source=own title="A9 · BST"
Wstaw do pustego BST: 40, 20, 60, 10, 30, 50, 70, 25, 35, 65. a) obchody pre/in/post-order, b) drzewo po delete(20) — wariant z poprzednikiem i z następnikiem.
::solution
```tree
40(20(10,30(25,35)),60(50,70(65,_)))
```
b) poprzednik 20 = 10 (max lewego poddrzewa): 40(10(_, 30(25, 35)), 60(…)); następnik 20 = 25 (min prawego): 40(25(10, 30(_, 35)), 60(…)).
:::answer
pre: **40, 20, 10, 30, 25, 35, 60, 50, 70, 65**; in: **10, 20, 25, 30, 35, 40, 50, 60, 65, 70**; post: **10, 25, 35, 30, 20, 50, 65, 70, 60, 40**.
:::
:::

:::task level=3 source=own title="A10 · Graf: BFS, DFS, Kruskal"
Graf nieskierowany: A–B (4), A–C (2), B–D (3), C–E (4), D–E (2), D–F (6), E–F (3), E–G (7), F–G (4), C–D (8). a) BFS i DFS od A (kolejność, `d` dla BFS, `d/f` dla DFS); b) Kruskal — krawędzie w kolejności akceptacji i waga.
```graph
A 40 140
B 160 40
C 160 240
D 300 100
E 300 240
F 440 140
G 520 260
A-B 4
A-C 2
B-D 3
C-E 4
D-E 2
D-F 6
E-F 3
E-G 7
F-G 4
C-D 8
```
::solution
a) BFS: A; B, C; D (z B), E (z C); F (z D), G (z E). DFS: A → B → D → C → E → F → G.

b) Wagi 2: A–C, D–E (alfabetycznie) ✓✓; 3: B–D ✓, E–F ✓; 4: **A–B ✓** (łączy {A, C} z resztą), C–E ✗ (cykl), F–G ✓ — 6 krawędzi, koniec.
:::warn Uwaga na remis
Gdyby C–E rozpatrzyć przed A–B, MST miałby **tę samą wagę, ale inne krawędzie**. Dlatego reguła alfabetyczna jest ważna.
:::
:::answer
a) BFS **A, B, C, D, E, F, G**, d: 0, 1, 1, 2, 2, 3, 3. DFS **A, B, D, C, E, F, G**, d/f: A 0/13, B 1/12, D 2/11, C 3/10, E 4/9, F 5/8, G 6/7.

b) **A–C, D–E, B–D, E–F, A–B, F–G**, waga **18**.
:::
:::

## Próbny sprawdzian praktyczny — wariant B

:::task level=1 source=own title="B1 · Rzędy funkcji"
a) Uszereguj rosnąco: $n^2$, $n^{1{,}5}$, $10\log n$, $n/100$, $2^n$, $1$, $n\log n$, $3^n$.

b) Prawda czy fałsz: $n\log n=O(n^{1{,}5})$; $2^n=\Theta(3^n)$; $n=\omega(\sqrt n)$; $(n+1)^2=\Theta(n^2)$; $\log n=\Omega(\sqrt n)$.
::solution
:::answer
a) $1 \prec 10\log n \prec n/100 \prec n\log n \prec n^{1{,}5} \prec n^2 \prec 2^n \prec 3^n$

b) **P, F, P, P, F**.
:::
:::

:::task level=1 source=own title="B2 · Binary search"
S = 2, 6, 11, 14, 19, 23, 30, 37, 41, 45, 58, 62. a) key = 41, b) key = 60.
::solution
a) m=5 (23 < 41) → l=6; m=8 (41) ✓. b) m=5 → l=6; m=8 (41 < 60) → l=9; m=10 (58 < 60) → l=11; m=11 (62 > 60) → r=10 < l.
:::answer
a) **5, 8** → **8**. b) **5, 8, 10, 11** → **−1**.
:::
:::

:::task level=1 source=own title="B3 · Selection i insertion sort"
Dla 19, 7, 25, 2, 14, 10: a) po 2 przebiegach selection sort, b) po 3 przebiegach insertion sort + liczba porównań całego insertion sort.
::solution
a) 2, 7, 25, 19, 14, 10 → (7 już na miejscu, swap sam ze sobą) 2, 7, 25, 19, 14, 10.

b) 7, 19, 25, 2, 14, 10 → 7, 19, 25, … → 2, 7, 19, 25, 14, 10.
:::answer
a) **2, 7, 25, 19, 14, 10**. b) **2, 7, 19, 25, 14, 10**; porównań **12**.
:::
:::

:::task level=2 source=own title="B4 · Merge sort"
S = 6, 1, 9, 4, 7, 2, 8, 3 — liczba porównań i ostatni merge.
::solution
:::answer
**17** porównań; ostatni merge: **1, 4, 6, 9 | 2, 3, 7, 8**.
:::
:::

:::task level=2 source=own title="B5 · partition"
S = 5, 9, 2, 7, 1, 8, 3, 6, 4 — indeks, pierwszy element, swapy.
::solution
swap(1, 8): 5, 4, 2, 7, 1, 8, 3, 6, 9; swap(3, 6): 5, 4, 2, 3, 1, 8, 7, 6, 9; i staje na 8 (indeks 5) → p = 4: 1, 4, 2, 3, 5, 8, 7, 6, 9.
:::answer
Indeks **4**, pierwszy element **1**, swapów **3**.
:::
:::

:::task level=1 source=own title="B6 · Count sort"
S = 1, 3, 1, 0, 2, 5, 3, 1, 2, 5, 0 — `counts` po 3 fazach.
::solution
:::answer
**2, 3, 2, 2, 0, 2** → **2, 5, 7, 9, 9, 11** → **0, 2, 5, 7, 9, 9**.
:::
:::

:::task level=1 source=own title="B7 · Radix sort"
Posortuj 170, 045, 075, 090, 802, 024, 002, 066 — ciąg po każdej fazie.
::solution
:::answer
**170, 90, 802, 2, 24, 45, 75, 66** → **802, 2, 24, 45, 66, 170, 75, 90** → **2, 24, 45, 66, 75, 90, 170, 802**.
:::
:::

:::task level=2 source=own title="B8 · Kopiec typu min"
S = 11, 5, 8, 3, 14, 2, 9, 6, 1: a) insert, b) + delMin, c) construct.
::solution
:::answer
a) **1, 2, 3, 5, 14, 8, 9, 11, 6**; b) **2, 5, 3, 6, 14, 8, 9, 11**; c) **1, 3, 2, 5, 14, 8, 9, 6, 11**.
:::
:::

:::task level=2 source=own title="B9 · BST i AVL"
Wstaw 55, 30, 80, 20, 45, 70, 90, 40, 50, 85. a) obchody, b) delete(30) w obu wariantach, c) bf wszystkich węzłów — czy to AVL?
::solution
```tree
55(30(20,45(40,50)),80(70,90(85,_)))
```
b) poprzednik 30 = 20: 55(20(_, 45(40, 50)), 80(…)); następnik = 40: 55(40(20, 45(_, 50)), 80(…)).
:::answer
a) pre **55, 30, 20, 45, 40, 50, 80, 70, 90, 85**; in **20, 30, 40, 45, 50, 55, 70, 80, 85, 90**; post **20, 40, 50, 45, 30, 70, 85, 90, 80, 55**. c) bf: 55 → 0, 30 → −1, 80 → −1, 90 → +1, pozostałe 0 — **AVL: tak**.
:::
:::

:::task level=3 source=own title="B10 · Graf: BFS, DFS, Kruskal, Prim, Dijkstra"
Graf: A–B (3), A–D (5), B–C (2), B–D (4), B–E (6), C–E (3), D–E (2), D–F (7), E–F (5), C–F (8). a) BFS i DFS od A; b) Kruskal; c) Prim od A; d) Dijkstra od A (`distance`, `parent`).
::solution
:::answer
a) BFS **A, B, D, C, E, F** (d: 0, 1, 1, 2, 2, 2); DFS **A, B, C, E, D, F** (d/f: A 0/11, B 1/10, C 2/9, E 3/8, D 4/7, F 5/6).

b) **B–C, D–E, A–B, C–E, E–F**, waga **15** (B–D, A–D odrzucone — cykle).

c) Prim: **A–B, B–C, C–E, E–D, E–F** — to samo drzewo.

d) distance: B 3, C 5, D 5, E 7 (przez D), F 12 (przez D); parent: B ← A, C ← B, D ← A, E ← D, F ← D.
:::
:::

## Próbny sprawdzian wiedzy

10 pytań × 2 punkty. Odpowiadaj pełnymi zdaniami: definicja + uzasadnienie.

:::task level=1 source=own title="K1 · Poprawność"
Podaj definicje poprawności całkowitej i częściowej. Podaj przykład algorytmu, który ma własność stopu, ale nie jest częściowo poprawny.
::solution
Definicje — jak w [konspekcie tematu 2](topic:t02). Przykład: `sum(array, len)` zwracający `sum + 1` — zawsze się zatrzymuje (pętla z `i++`), ale wynik jest błędny.
:::

:::task level=2 source=own title="K2 · Specyfikacja i pseudokod"
Napisz specyfikację i pseudokod funkcji `count(arr, len, key)` zwracającej liczbę wystąpień `key` w tablicy. Podaj operację dominującą, rozmiar danych i złożoność.
::solution
- **warunek początkowy:** arr — tablica liczb całkowitych, len — liczba naturalna (długość), key — liczba całkowita,
- **warunek końcowy:** liczba indeksów $0\le i<len$, dla których `arr[i] == key` (0 dla pustej tablicy).
```pseudo
count(arr, len, key){
  c = 0
  i = 0
  while(i < len){
    if(arr[i] == key) c++
    i++
  }
  return c
}
```
:::answer
Operacja dominująca: porównanie `arr[i] == key`; rozmiar: len; $W(len)=A(len)=len=\Theta(len)$, $S=O(1)$.
:::
:::

:::task level=2 source=own title="K3 · Analiza kodu"
Podaj złożoność czasową i pamięciową:
```pseudo
f(n){
  s = 0
  for(i = 0; i < n; i++){
    j = 1
    while(j < n){ s++; j = j * 2 }
  }
  return s
}
```
::solution
Operacja dominująca: `s++`; rozmiar danych: $n$. Pętla wewnętrzna: $j = 1, 2, 4, \dots < n$ — około $\lceil\log_2 n\rceil$ obrotów; zewnętrzna: $n$ razy.
:::answer
$W(n)=A(n)=\Theta(n\log n)$, $S(n)=O(1)$.
:::
:::

:::task level=2 source=own title="K4 · Niezmiennik"
Dla algorytmu sumujący elementy tablicy (`sum = 0; i = 0; while(i < len){ sum += a[i]; i++ }`) podaj niezmiennik i udowodnij całkowitą poprawność.
::solution
**Stop:** $i$ rośnie o 1, $len$ stałe i skończone. **Niezmiennik:** $\text{sum}=\sum_{j=0}^{i-1} a[j] \wedge i\le len$. Przed pętlą: $i=0$, suma pusta $=0$ ✓. Krok: po iteracji $\text{sum}'=\sum_{j=0}^{i-1}a[j]+a[i]=\sum_{j=0}^{i}a[j]$, $i'=i+1$ ✓. Koniec: $i=len$ ⇒ $\text{sum}=\sum_{j=0}^{len-1}a[j]$ ✓.
:::

:::task level=2 source=own title="K5 · Notacja asymptotyczna"
Podaj definicje $O$ i $\Theta$. Udowodnij z definicji, że $3n+5=\Theta(n)$.
::solution
$3n+5\le 8n$ dla $n\ge1$ ⇒ $O(n)$ ($c=8$, $n_0=1$); $n\le 3n+5$ dla $n\ge 1$ ⇒ $n=O(3n+5)$ ($c=1$). Oba kierunki ⇒ $\Theta(n)$.
:::

:::task level=2 source=own title="K6 · Porównanie sortowań"
Porównaj insertion sort, merge sort i quick sort: W, A, pamięć, stabilność. Kiedy insertion sort jest najlepszy?
::solution
| | W | A | pamięć | stabilny |
|---|---|---|---|---|
| insertion | $\Theta(n^2)$ | $\Theta(n^2)$ | $O(1)$ | tak |
| merge | $\Theta(n\log n)$ | $\Theta(n\log n)$ | $\Theta(n)$ | tak (zależy od `<`/`<=` w merge) |
| quick | $\Theta(n^2)$ | $\Theta(n\log n)$ | w miejscu | nie |

Insertion — dla danych **prawie posortowanych** (dla posortowanych $n-1$ porównań) i małych $n$.
:::

:::task level=2 source=own title="K7 · Stos i kolejka"
Jak zaimplementować kolejkę na tablicy i na liście, by wszystkie operacje były $O(1)$? Dlaczego zwykła tablica nie wystarcza?
::solution
Lista jednokierunkowa ze wskaźnikami na początek i koniec (inject na końcu, out z początku) albo **tablica cykliczna** (indeksy początku i końca, arytmetyka mod $n$). W zwykłej tablicy wyjęcie z początku wymaga przesunięcia elementów — $O(n)$.
:::

:::task level=2 source=own title="K8 · Tablice mieszające"
Opisz wymagane własności funkcji mieszającej, metody rozwiązywania kolizji i złożoność. Dlaczego tablica mieszająca nie jest dobrą implementacją słownika uporządkowanego?
::solution
Szybka (czas stały) i równomierna; mieszanie wielokrotne lub łańcuchowa; operacje $O(\alpha)$, $\alpha=n/m$. Minimum, maksimum, następnik, poprzednik wymagają przejrzenia całej tablicy — liniowo (funkcja mieszająca niszczy porządek kluczy).
:::

:::task level=2 source=own title="K9 · BST i AVL"
Porównaj W i A operacji na BST i AVL. Co to jest bf i jaki warunek spełnia AVL? Dlaczego to daje $O(\log n)$?
::solution
BST: $A=O(\log n)$, $W=O(n)$ (jedna gałąź). AVL: $bf(x)=h(L)-h(R)\in\{-1,0,1\}$ dla każdego węzła ⇒ wysokość $O(\log n)$ ⇒ wszystkie operacje $W=O(\log n)$ (naprawa rotacjami w $O(1)$).
:::

:::task level=2 source=own title="K10 · Wybór algorytmu na grafie"
Który algorytm najkrótszych ścieżek wybierzesz i z jaką złożonością: a) graf acykliczny skierowany z ujemnymi wagami, b) sieć drogowa (wagi ≥ 0), c) graf z ujemnymi wagami i cyklami? Do czego służy Kruskal i jaka jest jego złożoność?
::solution
:::answer
a) **DAG** (sortowanie topologiczne + relaksacja) $O(n+m)$ — ujemne wagi nie przeszkadzają. b) **Dijkstra** $O((n+m)\log n)$. c) **Bellman-Ford** $O(nm)$ (+ wykrycie ujemnych cykli). Kruskal — minimalne drzewo rozpinające, $O(m\log m)$.
:::
:::
