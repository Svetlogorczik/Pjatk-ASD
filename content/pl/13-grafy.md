---
id: t13
num: 13
type: topic
title: Grafy — reprezentacje, przeszukiwanie w głąb i wszerz, Find-Union
short: Grafy, DFS, BFS
desc: Czym jest graf, listy i macierz sąsiedztwa, ogólny schemat przechodzenia grafu, DFS ze stosem, BFS z kolejką, metoda kolejnych uściśleń oraz struktura Find-Union (zbiory rozłączne).
sources: asd11.pdf; Wyklady 2009/wyklad_2.pdf (grafy), asd 09 wyklad_7.pdf (DFS, BFS); wyklad_10.pdf (struktura Find-Union)
exercises: brak osobnego zestawu — zadania od autora strony (grafy ważone są w temacie 14)
---

:::exam Sprawdzian 2026/2027
Ten temat powstał na podstawie wykładów 2025/2026. **Na sprawdzianach 2026/2027 obowiązują wersje ze slajdów M. Sydowa** — znajdziesz je w sekcji [„Wersja z wykładu 2026/2027”](topic:t13#wersja-z-wykładu-2026-2027-m-sydow-wprowadzenie-do-grafów-i-) na końcu tematu (kod przepisany ze slajdów). Zadania dopuszczeniowe i zadania treningowe: [Sprawdziany 2026/2027](page:exams).
:::

## Czym jest graf?

:::def
**Graf** to para **G = (V, E)**, gdzie V jest skończonym zbiorem **wierzchołków** (węzłów), a E zbiorem **krawędzi**:
- w grafie **nieskierowanym** krawędź to para nieuporządkowana {x, y} (x ≠ y),
- w grafie **skierowanym** — para uporządkowana (x, y), czyli strzałka od x do y.

Krawędź łączącą x i y zapisujemy (x, y). **Rozmiar grafu** to dwie liczby: **n = |V|** i **m = |E|**.
:::

Dla grafu nieskierowanego **m ≤ n(n − 1)/2**, dla skierowanego **m ≤ n(n − 1)**.

:::analogy
Mapa miast i dróg: miasta to wierzchołki, drogi to krawędzie. Drogi dwukierunkowe — graf nieskierowany; ulice jednokierunkowe — skierowany. Znajomi na portalu społecznościowym — graf nieskierowany; „obserwowani” — skierowany.
:::

## Reprezentacje grafu

Zakładamy, że V = {1, 2, …, n} — wierzchołki są indeksami tablic.

- **Listy sąsiedztwa:** dla każdego x ∈ V lista **L[x]** wierzchołków y, dla których (x, y) ∈ E. Pamięć: **O(n + m)**.
- **Macierz sąsiedztwa:** A[x, y] = 1, gdy (x, y) jest krawędzią, i 0 w przeciwnym razie. Pamięć: **O(n²)**.

```graph
1 40 20
2 160 20
3 40 120
4 160 120
1-2
1-3
2-4
3-4
2-3
```

Dla grafu powyżej:

| x | L[x] |
|---|---|
| 1 | 2, 3 |
| 2 | 1, 3, 4 |
| 3 | 1, 2, 4 |
| 4 | 2, 3 |

| A | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| **1** | 0 | 1 | 1 | 0 |
| **2** | 1 | 0 | 1 | 1 |
| **3** | 1 | 1 | 0 | 1 |
| **4** | 0 | 1 | 1 | 0 |

### Co wybrać? {own}

:::own
Porównanie od autora strony.
:::

| Pytanie / operacja | Listy | Macierz |
|---|---|---|
| pamięć | O(n + m) | O(n²) |
| czy (x, y) ∈ E? | O(stopień x) | **O(1)** |
| przejrzyj sąsiadów x | **O(stopień x)** | O(n) |
| przejście całego grafu | **O(n + m)** | O(n²) |
| kiedy lepsze | grafy **rzadkie** (m ≪ n²) — większość praktycznych | grafy **gęste** |

## Ogólny schemat przechodzenia grafu

Wykład asd11 zaczyna od **ogólnego schematu**, z którego później otrzymujemy konkretne algorytmy. Chcemy, wychodząc z wierzchołka p, odwiedzić każdy wierzchołek i każdą krawędź osiągalne z p. Dozwolony ruch: przejście krawędzią wychodzącą z **już odwiedzonego** wierzchołka.

1. Odwiedź p i zaznacz go jako odwiedzony.
2. Dopóki z któregoś odwiedzonego wierzchołka wychodzi nieodwiedzona krawędź:
   - (a) wybierz odwiedzony wierzchołek v, z którego wychodzi nieodwiedzona krawędź,
   - (b) wybierz dowolną nieodwiedzoną krawędź (v, w),
   - (c) zaznacz ją jako odwiedzoną,
   - (d) jeśli w nie był odwiedzony — odwiedź go i zaznacz.

Stosując indukcję względem odległości od p można udowodnić, że algorytm odwiedza **każdy** wierzchołek i **każdą** krawędź osiągalne z p (i każdy wierzchołek dokładnie raz). Złożoność jest **proporcjonalna do łącznej liczby wierzchołków i krawędzi** — czyli **liniowa**: O(n + m).

Żeby dostać konkretny algorytm, trzeba ustalić:
1. reprezentację grafu (np. listy sąsiedztwa),
2. jak zaznaczać odwiedzone wierzchołki (tablica `visited[v]`),
3. **jak wybierać** wierzchołek v w kroku (a) — np. trzymając kandydatów na **stosie** albo w **kolejce**,
4. jak odróżniać krawędzie odwiedzone od nieodwiedzonych — np. wskaźnik **current[v]** do pierwszej nieodwiedzonej krawędzi na liście L[v].

## DFS — przeszukiwanie w głąb (stos)

Jeśli kandydatów trzymamy na **stosie**, zawsze bierzemy ten wierzchołek, który został odwiedzony **najpóźniej**. Idziemy więc „jak najgłębiej” w graf, a dopiero gdy nie ma dokąd iść — cofamy się.

:::analogy
Zwiedzanie labiryntu z kłębkiem nici: idziesz korytarzem, dopóki się da; w ślepym zaułku cofasz się do ostatniego rozwidlenia, z którego jest jeszcze nieodwiedzona droga.
:::

```pseudo title="DFS (wykład)"
void DFS(graf G) {
  for (v = 1; v <= n; v++) {
    visited[v] = FALSE;
    current[v] = wsk. na pierwszy element listy L[v];
  }
  visit(p); visited[p] = TRUE;
  if (current[p] != NULL) {
    S = []; Push(S, p);
    while (!Empty(S)) {
      v = Front(S);                         // wierzchołek na szczycie stosu
      niech w będzie wierzchołkiem wskazywanym przez current[v];
      przesuń wskaźnik current[v] do następnego wierzchołka na liście L[v];
      if (current[v] == NULL) Pop(S);       // z v nie wychodzą już nowe krawędzie
      if (!visited[w]) {
        visit(w); visited[w] = TRUE;
        if (current[w] != NULL) Push(S, w);
      }
    }
  }
}
```

## BFS — przeszukiwanie wszerz (kolejka)

Jeśli kandydatów trzymamy w **kolejce**, najpierw „wyczerpujemy” sąsiadów wierzchołka, który został odwiedzony **najwcześniej**. Wierzchołki są więc odwiedzane **warstwami**: najpierw p, potem wszyscy sąsiedzi p (odległość 1), potem ich sąsiedzi (odległość 2) itd.

:::analogy
Fale na wodzie po wrzuceniu kamienia: najpierw zmoczone są punkty najbliżej, potem coraz dalsze pierścienie.
:::

W kodzie zmienia się tylko struktura: zamiast `Push` jest `Inject` (dodaj na koniec kolejki), a `Front`/`Pop` działają na początku kolejki.

:::tip
**BFS znajduje najkrótsze ścieżki** (w sensie liczby krawędzi) od p do wszystkich wierzchołków: wystarczy zapamiętać dist[w] = dist[v] + 1 w chwili odwiedzenia w. Dla grafów z wagami potrzebny jest algorytm Dijkstry (temat 14).
:::

**Przykład** (sąsiedzi przeglądani w kolejności alfabetycznej, start w A):

```graph
A 30 70
B 130 20
C 130 120
D 230 70
E 330 70
F 430 70
A-B
A-C
B-D
C-D
D-E
E-F
```

- **DFS:** A, B, D, C, E, F — z A do B, z B do D, z D do C (ślepy zaułek: A i D odwiedzone), powrót do D, dalej E, F.
- **BFS:** A, B, C, D, E, F — warstwy: {A}, {B, C}, {D}, {E}, {F}; odległości: A 0, B 1, C 1, D 2, E 3, F 4.

```java title="GraphSearch.java — DFS rekurencyjny, DFS ze stosem (jak na wykładzie), BFS"
@include t13-graph.java
```

### Metoda kolejnych uściśleń

Wykład podkreśla, **jak** powstały procedury DFS i BFS: zaczęliśmy od ogólnego schematu, a potem krok po kroku **uściślaliśmy** wybory (reprezentacja, zaznaczanie, stos czy kolejka, wskaźniki current). To **metoda kolejnych uściśleń** (ang. *stepwise refinement*). W procedurach zostało jeszcze kilka rzeczy „do dopracowania” (np. dokładna obsługa list i wskaźników) — ostatecznych przekształceń do kodu maszynowego dokonuje kompilator.

### Zastosowania DFS i BFS {own}

:::own
Przegląd zastosowań od autora strony — wszystkie działają w czasie O(n + m).
:::

- **spójność:** graf nieskierowany jest spójny ⇔ jeden DFS/BFS odwiedza wszystkie wierzchołki; liczba uruchomień DFS dla nieodwiedzonych wierzchołków = liczba **składowych spójności**,
- **najkrótsze ścieżki** bez wag — BFS,
- **wykrywanie cykli**, **sortowanie topologiczne** grafu skierowanego acyklicznego — DFS,
- **labirynty, gry** (np. najmniejsza liczba ruchów) — BFS.

## Struktura Find-Union (zbiory rozłączne)

Slajdy 2009 (wykład X) omawiają strukturę potrzebną m.in. w algorytmie Kruskala (temat 14).

:::def
**Problem Find-Union:** mamy elementy 1, …, n podzielone na **rozłączne** zbiory (na początku każdy element tworzy osobny zbiór). Operacje:
- **find(x)** — podaj nazwę (reprezentanta) zbioru, do którego należy x,
- **union(A, B)** — połącz zbiory A i B w jeden.
:::

:::analogy
Grupy znajomych na imprezie: na początku każdy stoi sam. Gdy dwie osoby się poznają, ich grupy łączą się w jedną (union). find(x) odpowiada na pytanie „kto jest szefem grupy x?” — dwie osoby są w tej samej grupie, gdy mają tego samego szefa.
:::

Implementacje (od najprostszej):

1. **Tablica nazw** name[x]: find — O(1), ale union musi przemianować cały zbiór — O(n).
2. **Listy z balansowaniem:** każdy zbiór to lista; przy union przemianowujemy **mniejszą** listę. Element zmienia nazwę tylko wtedy, gdy jego zbiór co najmniej się podwaja — więc najwyżej log n razy. n − 1 operacji union kosztuje łącznie **O(n log n)**.
3. **Drzewa (n-arne) z balansowaniem i kompresją ścieżek:** każdy zbiór to drzewo, korzeń jest reprezentantem, każdy węzeł wskazuje na ojca.
   - find(x) — idziemy od x do korzenia,
   - union — korzeń **niższego** drzewa podczepiamy pod korzeń wyższego → wysokość drzew ≤ log n,
   - **kompresja ścieżek** — podczas find podczepiamy wszystkie mijane węzły **bezpośrednio pod korzeń**; kolejne find są wtedy prawie natychmiastowe.

Z balansowaniem i kompresją ciąg m operacji kosztuje **O(m · α(n))**, gdzie α to niezwykle wolno rosnąca funkcja (odwrotność funkcji Ackermanna; w praktyce α(n) ≤ 4) — czyli **prawie stały czas** na operację.

```java title="FindUnion.java"
@include t13-findunion.java
```


## Wersja z wykładu 2026/2027 (M. Sydow) — „Wprowadzenie do grafów” i „Przeglądanie grafów”

:::exam
Na sprawdzianach: definicje (graf, digraf, drogi, cykle, spójność, drzewa), reprezentacje i ich koszty oraz **symulacja BFS/DFS w wersji ze slajdów** — kolejność odwiedzania, odległości `d` (BFS), czasy `d/f` (DFS, `time` od 0), las przeszukiwania i klasyfikacja krawędzi. Zadanie treningowe: [Sprawdziany 2026/2027](page:exams).
:::

:::def Graf i digraf
**Graf** (nieskierowany) G = (V, E): V — zbiór **wierzchołków**, E — zbiór **krawędzi**; krawędź e = {v, w} to **nieuporządkowana** para wierzchołków (jej **końców**). Mówimy: e **łączy** v i w, v i w są **sąsiednie**, e jest **incydentna** z v i w. Graf nieskierowany reprezentuje relację **symetryczną**; graf z pustymi V i E — **zerowy**.
**Graf skierowany** G = (V, E): krawędź (łuk) e = (v, w) to **uporządkowana** para (**początek**, **koniec**) — e biegnie od v do w (wychodzi z v, wchodzi do w); reprezentuje **dowolną** relację binarną.
:::

Rysunek to tylko jedna z nieskończenie wielu reprezentacji graficznych — trzeba odróżniać graf (obiekt abstrakcyjny) od rysunku.

- **Graf prosty:** bez **pętli** (v, v) i **krawędzi wielokrotnych** (w digrafie (v, w) i (w, v) to różne krawędzie). **Stopień** deg(v) — liczba krawędzi incydentnych (pętla liczy się 2 razy); stopień 0 — wierzchołek **izolowany**.
- **Droga (ścieżka):** naprzemienny ciąg wierzchołków i krawędzi (v₀, e₀, v₁, …, eₖ, vₗ), gdzie eₖ łączy vₖ i vₖ₊₁ (analogicznie droga skierowana). **Prosta** — nie powtarzają się krawędzie; **elementarna** — nie powtarzają się wierzchołki; **długość** — liczba krawędzi (długość 0 — pojedynczy wierzchołek).
- **Cykl:** droga długości co najmniej 3 z v₀ == vₗ; **cykl elementarny** (poza pierwszym/ostatnim) i **prosty**; **obwód** grafu — długość najkrótszego cyklu elementarnego.
- **Spójny** ⇔ każde dwa różne wierzchołki są połączone drogą (⇔ niepusty graf nie jest sumą dwóch niepustych grafów). **Składowa spójna** — maksymalny spójny podgraf; c(G) — liczba składowych. Digraf **silnie spójny** ⇔ dla każdej uporządkowanej pary różnych wierzchołków istnieje droga skierowana z pierwszego do drugiego (silna ⇒ słaba spójność, nie odwrotnie); składowe silnie/słabo spójne.
- **Drzewo** — graf spójny i acykliczny; **las** — acykliczny; **liść** — wierzchołek stopnia 1, pozostałe — **wewnętrzne**.

:::def Charakteryzacja drzew (warunki równoważne)
T jest drzewem o n wierzchołkach ⇔ T ma n−1 krawędzi i jest acykliczny ⇔ T jest spójny i ma n−1 krawędzi ⇔ każde dwa wierzchołki łączy **dokładnie jedna** droga elementarna ⇔ T jest acykliczny, ale dodanie dowolnej krawędzi tworzy dokładnie jeden cykl.
:::

**Drzewa ukorzenione:** wyróżniony **korzeń**; **głębokość (poziom)** — odległość od korzenia; **wysokość** — maksymalna głębokość; przodek/potomek, rodzic/dziecko, bliźniak (brat), liście (bez dzieci), poddrzewo. Reprezentacja: **tablica rodziców** (n[i] — etykieta rodzica i). **Drzewo d-arne** — każdy wierzchołek ma ≤ d dzieci; **zupełne** — liście różnią się głębokością o ≤ 1; na poziomie l jest ≤ dˡ wierzchołków; dla wysokości h: **h + 1 ≤ n ≤ (d^(h+1) − 1)/(d − 1)**. **Drzewo uporządkowane** — dzieci mają porządek liniowy (rysowane od lewej do prawej; porządek standardowy — po poziomach, potem według dzieci). **Drzewo binarne** — 2-arne uporządkowane z określeniem, które dziecko jest lewe, a które prawe.

**Reprezentacje grafów:** **macierz sąsiedztwa** A[i, j] = 1 ⇔ i, j połączone (pętla — 2); dla grafu nieskierowanego symetryczna, dla prostego — zera na przekątnej; suma w wierszu/kolumnie — stopień (wyjściowy/wejściowy); Aᵀ — odwrócenie krawędzi. **Macierz incydencji** I[v, e] = 1 ⇔ v incydentny z e (digraf: 1 wchodzące, −1 wychodzące). **Listy sąsiedztwa** (dla digrafu — wierzchołki, do których wchodzą krawędzie wychodzące). Także lista krawędzi, reprezentacja obiektowa, „gd0” (binarna). **Rozmiar grafu** — para (n, m); graf **rzadki** — m = O(n).

| reprezentacja | pamięć |
|---|---|
| macierz sąsiedztwa | Θ(n²) — zawsze |
| listy sąsiedztwa | Θ(n + m) — dostosowuje się do liczby krawędzi |
| macierz incydencji | Θ(n·m) |

### Przeszukiwanie grafów

Systematyczne odwiedzenie: start z wierzchołka startowego, ruch tylko po krawędzi, każdy wierzchołek i krawędź **dokładnie raz** (grafy nieskierowane i skierowane). **Schemat ogólny:** umieść start w strukturze X; dopóki X niepusta: (1) wyjmij v i odwiedź go, (2) włóż do X kolejno wszystkich nieodwiedzonych sąsiadów v. Wariant zależy od X (**kolejka → BFS, stos → DFS**) i kolejności sąsiadów (np. alfabetycznie). Jedno wykonanie daje **drzewo przeszukiwania**; powtarzane aż do odwiedzenia wszystkiego — **las przeszukiwania**. Kolory: **biały** (nieodwiedzony), **szary** (odwiedzony, przetwarzany), **czarny** (zakończony).

**Klasyfikacja krawędzi (u, v):** **drzewowa (T)** — v odwiedzony z u przez (u, v); **w przód (F)** — nie drzewowa, v potomkiem u; **w tył (B)** — v przodkiem u; **poprzeczna (C)** — pozostałe.

```pseudo
for-each node in V:
  node.color = white; node.d = infinity; node.p = null

s.color = gray; s.d = 0; queue.in(s)

while(!queue.empty()){
  currNode = queue.out()

  process(currNode)

  for-each node in currNode.adjList:
     if (node.color == white):
        queue.in(node)
        node.color = gray
        node.d = currNode.d + 1
        node.p = currNode

  currNode.color = black
}
```

**BFS** odwiedza wierzchołki „we wszystkich kierunkach” według rosnącej odległości: atrybut `d` — odległość od startu, `p` — drzewo. Zastosowania: składowe spójne, odległości, domknięcie przechodnie (n×BFS). Złożoność **O(|V| + |E|)**. Graf nieskierowany: brak krawędzi w przód i wstecz; drzewowa: v.d = u.d + 1; poprzeczna: v.d = u.d lub u.d + 1. Skierowany: brak w przód; drzewowa: v.d = u.d + 1; poprzeczna: v.d ≤ u.d + 1; wsteczna: 0 ≤ v.d ≤ u.d.

```pseudo
DFS(){
  time = 0
  for-each v in V:
     v.color = white; v.parent = null
  for-each v in V:
     if (v.color == white):
        recursiveDFS(v)
}
recursiveDFS(GraphNode v){
  v.d = time++
  v.color = gray
  process(v)
  for-each u in v.adjList:
     if (u.color == white):
        u.parent = v
        recursiveDFS(u)
  v.color = black
  v.f = time++
}
```

**DFS** (stos lub rekurencja — równoważne co do idei, ale kolejność odwiedzania może się różnić): **czas odwiedzenia v.d** (staje się szary) i **zakończenia v.f** (czarny). Złożoność **O(|V| + |E|)**. **Struktura nawiasowa:** przedziały [u.d, u.f] i [v.d, v.f] są rozłączne albo jeden zawiera się w drugim. **Twierdzenie o białej ścieżce:** v jest potomkiem u w drzewie DFS ⇔ w chwili u.d istnieje ścieżka z u do v z samych białych wierzchołków. Graf nieskierowany: brak krawędzi w przód i poprzecznych. Skierowany — wszystkie 4 rodzaje; przy przejściu (u, v): **drzewowa**, jeśli v biały; **wstecz**, jeśli szary; **w przód lub poprzeczna**, jeśli czarny. Przez czasy: (v, w) drzewowa lub w przód ⇔ v.d < w.d < w.f < v.f; w tył ⇔ w.d < v.d < v.f < w.f; poprzeczna ⇔ w.d < w.f < v.d < v.f. Zastosowania: test acykliczności (brak krawędzi wstecz), **sortowanie topologiczne**, składowe silnie spójne, punkty artykulacji, mosty, bloki.

### Przykładowe pytania/ćwiczenia ze slajdów

Definicje grafów, dróg i cykli; spójność, silna/słaba spójność, składowe; rodzaje drzew i ich własności; reprezentacje i ich złożoności; kolejność pre/in/post-order; **kolejność odwiedzanych wierzchołków, odległości (BFS), czasy odwiedzenia i zakończenia (DFS), las przeszukiwania i klasyfikacja krawędzi**; algorytm wychodzenia z labiryntu — BFS czy DFS?

=== summary ===

## Wersja 2026/2027 (M. Sydow)

- Drzewo ⇔ spójny i n−1 krawędzi ⇔ acykliczny i n−1 krawędzi ⇔ dokładnie jedna droga elementarna.
- Pamięć: macierz sąsiedztwa Θ(n²), listy Θ(n + m), macierz incydencji Θ(n·m).
- BFS (kolejka): d, p; DFS (rekurencja): d/f od time = 0; oba O(|V| + |E|).
- Krawędzie T/F/B/C; DFS skierowany: v biały → T, szary → B, czarny → F lub C.


## Grafy

- G = (V, E), n = |V|, m = |E|; nieskierowany: m ≤ n(n−1)/2, skierowany: m ≤ n(n−1).
- **listy sąsiedztwa** O(n + m) — grafy rzadkie; **macierz** O(n²) — gęste, test krawędzi O(1).

## Przechodzenie grafu

- schemat: odwiedź p; dopóki jest nieodwiedzona krawędź z odwiedzonego v — przejdź nią; każdy wierzchołek i krawędź raz → **O(n + m)**.
- **DFS** — kandydaci na **stosie** (w głąb, z powrotami); **BFS** — w **kolejce** (warstwami).
- BFS daje najkrótsze ścieżki (liczba krawędzi): dist[w] = dist[v] + 1.
- metoda **kolejnych uściśleń** (stepwise refinement).

## Find-Union

- find(x), union(A, B) na zbiorach rozłącznych.
- tablica nazw: union O(n); listy z balansowaniem: n−1 union O(n log n); **drzewa + balansowanie + kompresja ścieżek: prawie O(1)** (O(m α(n))).
- zastosowanie: algorytm Kruskala, składowe spójności.

=== tasks ===

:::task level=1 source="own" title="Reprezentacja w pamięci"
Graf nieskierowany ma **n = 1000** wierzchołków i **m = 3000** krawędzi. Ile komórek zajmie macierz sąsiedztwa, a ile elementów łącznie wszystkie listy sąsiedztwa? Ile najwięcej krawędzi mógłby mieć ten graf?
::hint
W grafie nieskierowanym każda krawędź pojawia się na dwóch listach.
::solution
- macierz: n² = **1 000 000** komórek,
- listy: każda krawędź na dwóch listach → 2m = **6000** elementów (+ 1000 początków list),
- maksymalna liczba krawędzi: n(n − 1)/2 = **499 500**.

Graf ma tylko 3000 z 499 500 możliwych krawędzi — jest **rzadki**, więc listy są dużo lepsze.
:::

:::task level=2 source="own" title="DFS i BFS krok po kroku"
Dla grafu poniżej wykonaj **DFS** i **BFS** z wierzchołka **1**. Sąsiadów przeglądaj w kolejności rosnącej. Podaj kolejność odwiedzania oraz (dla BFS) odległości od 1.

```graph
1 40 110
2 150 30
3 150 110
5 150 190
4 260 60
6 260 170
7 370 110
8 480 110
1-2
1-3
1-5
2-4
3-4
3-6
4-7
5-6
6-7
7-8
```
::hint
Listy sąsiedztwa: 1: 2, 3, 5; 2: 1, 4; 3: 1, 4, 6; 4: 2, 3, 7; 5: 1, 6; 6: 3, 5, 7; 7: 4, 6, 8; 8: 7.
::solution
**DFS:** 1 → 2 → 4 → 3 → 6 → 5 (ślepy zaułek: 1 i 6 odwiedzone) → powrót do 6 → 7 → 8.

Kolejność: **1, 2, 4, 3, 6, 5, 7, 8**.

**BFS:** kolejka: [1] → odwiedzamy 2, 3, 5 → z 2: 4 → z 3: 6 (4 już jest) → z 5: nic → z 4: 7 → z 6: nic → z 7: 8.

Kolejność: **1, 2, 3, 5, 4, 6, 7, 8**.

| wierzchołek | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| odległość | 0 | 1 | 1 | 2 | 1 | 2 | 3 | 4 |
:::

:::task level=2 source="own" title="Składowe spójności"
Graf ma wierzchołki 1…9 i krawędzie: {1,2}, {2,3}, {4,5}, {6,7}, {7,8}, {8,6}. Ile ma składowych spójności? Opisz, jak je znaleźć za pomocą DFS i ile razy trzeba będzie go uruchomić.
::hint
Przejdź pętlą po wszystkich wierzchołkach; dla każdego jeszcze nieodwiedzonego uruchom DFS.
::solution
Składowe: {1, 2, 3}, {4, 5}, {6, 7, 8}, {9} → **4 składowe**.

Algorytm: `for v := 1 to n do if not visited[v] then { licznik++; DFS(v) }`. DFS zostanie uruchomiony **4 razy** (dla 1, 4, 6, 9), a łączny koszt to O(n + m), bo każdy wierzchołek i krawędź są odwiedzane raz.
:::

:::task level=3 source="own" title="Find-Union z balansowaniem i kompresją"
Mamy elementy 1…8, każdy w osobnym zbiorze. Wykonaj kolejno: union(1,2), union(3,4), union(5,6), union(7,8), union(1,3), union(5,7), union(1,5), a potem find(8). Przy union podczepiaj korzeń niższego drzewa pod korzeń wyższego (przy równych wysokościach — drugi pod pierwszy), a find wykonuj z kompresją ścieżki. Narysuj drzewo przed i po find(8).
::hint
Po czterech pierwszych union są cztery drzewa wysokości 1. Po union(1,3) i union(5,7) — dwa drzewa wysokości 2.
::solution
- union(1,2): 2 pod 1; union(3,4): 4 pod 3; union(5,6): 6 pod 5; union(7,8): 8 pod 7.
- union(1,3): równe wysokości → 3 pod 1; union(5,7): 7 pod 5.
- union(1,5): równe wysokości (2) → 5 pod 1. Wysokość drzewa = 3.

```tree caption="przed find(8)"
1(2,3(4,_),5(6,7(8,_)))
```

Uwaga: to drzewo **n-arne** — węzeł 1 ma trzech synów (2, 3, 5); rysunek pokazuje je jako kolejne gałęzie.

find(8) idzie ścieżką 8 → 7 → 5 → 1 i zwraca **1**. Kompresja: 8 i 7 zostają podczepione bezpośrednio pod 1.

```text title="po find(8): ojcowie węzłów"
węzeł:  1  2  3  4  5  6  7  8
ojciec: 1  1  1  3  1  5  1  1
```
:::
