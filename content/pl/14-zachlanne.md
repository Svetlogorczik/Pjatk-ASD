---
id: t14
num: 14
type: topic
title: Programowanie zachłanne — Huffman, plecak, Dijkstra, Prim, Kruskal
short: Algorytmy zachłanne
desc: Kiedy wybór najlepszy lokalnie daje optimum globalne, a kiedy nie. Wybór zajęć, kody Huffmana, problem plecakowy, najkrótsze ścieżki (Dijkstra) i minimalne drzewo rozpinające (Prim, Kruskal).
sources: 2026/2027 (M. Sydow): shortestPaths12-pl.pdf, mst-pl.pdf · 2025/2026: ProgramowanieZachlanne.pdf; wyklad_11.pdf (Metoda zachłanna I); wyklad_10.pdf (Find-Union)
exercises: asd 12.pdf (zad. 1–3)
---

:::exam Sprawdzian 2026/2027
Ten temat powstał na podstawie wykładów 2025/2026. **Na sprawdzianach 2026/2027 obowiązują wersje ze slajdów M. Sydowa** — znajdziesz je w sekcji [„Wersja z wykładu 2026/2027”](topic:t14#wersja-z-wykładu-2026-2027-m-sydow-znajdowanie-najkrótszych-) na końcu tematu (kod przepisany ze slajdów). Zadania dopuszczeniowe i zadania treningowe: [Sprawdziany 2026/2027](page:exams).
:::

:::info Poza programem 2026/2027
Huffman, problem plecakowy i wybór zajęć to materiał 2025/2026 — **poza programem 2026/2027**. Obowiązujące: najkrótsze ścieżki i MST (sekcje na końcu tematu).
:::

## Problemy optymalizacyjne i strategia zachłanna

W **problemie optymalizacyjnym** spośród wielu możliwych rozwiązań szukamy **najlepszego** ze względu na jakąś cechę. Najczęściej rozwiązanie powstaje jako **ciąg decyzji** podejmowanych po kolei.

:::def
- **Funkcja oceny** f : W → ℝ przypisuje każdemu wynikowi liczbę; wynik a jest lepszy od b, gdy f(a) > f(b). Problem jest rozwiązany, gdy algorytm daje opt ∈ W z f(opt) = sup{ f(a) : a ∈ W }.
- **Strategia zachłanna:** w każdym kroku wybieramy to, co **w tej chwili** najbardziej polepsza funkcję oceny, i nigdy tego wyboru nie cofamy.
- Algorytm zachłanny jest **poprawny**, gdy taki ciąg wyborów lokalnie najlepszych zawsze prowadzi do rozwiązania **globalnie** najlepszego.
:::

### Kiedy strategia zachłanna nie działa? „Zazwyczaj!”

Wykład: wycieczka w góry z zamiarem wejścia jak najwyżej — idąc zawsze „w górę”, łatwo utknąć na niskim szczycie, z którego każdy krok prowadzi w dół (**maksimum lokalne**).

**Przeprawa przez most** (wykład): nocą 4 osoby muszą przejść przez dziurawy most; naraz mogą iść najwyżej 2 osoby, mają jedną latarkę, którą trzeba odnosić. Czasy: dziadek 10 min, ojciec 5, matka 2, syn 1 (para idzie w tempie wolniejszego).

| | Zachłannie: zawsze odprowadza najszybszy | Lepiej |
|---|---|---|
| 1 | syn + dziadek → 10 | syn + matka → 2 |
| 2 | wraca syn → 1 | wraca syn → 1 |
| 3 | syn + ojciec → 5 | ojciec + dziadek → 10 |
| 4 | wraca syn → 1 | wraca matka → 2 |
| 5 | syn + matka → 2 | syn + matka → 2 |
| razem | **19 min** | **17 min** |

„Dowód”, że wersja zachłanna jest optymalna („minimalizujemy powroty, wracając zawsze najszybszym”), był błędny — dwaj najwolniejsi powinni iść **razem**.

:::warn
Algorytm zachłanny zawsze trzeba **udowodnić**. Działa tylko w szczęśliwych przypadkach albo w znanych, sprawdzonych problemach — o nich jest dalsza część tematu.
:::

## Problem wyboru zajęć

Organizator oferuje danego dnia wiele wykładów w różnych salach. Każdego chcemy słuchać od początku do końca i chcemy pójść na **jak najwięcej** z nich.

:::def
Dane: n odcinków [pᵢ, kᵢ) (początek, koniec). Wybierz **największy** podzbiór parami **rozłącznych** odcinków.
:::

**Rozwiązanie zachłanne (wykład):**
1. posortuj zajęcia według **czasu zakończenia**,
2. wybierz zajęcia, które **kończą się najwcześniej**,
3. odrzuć zajęcia, które z nimi kolidują,
4. powtarzaj, aż nie zostanie nic do wyboru.

Intuicja: zajęcia, które kończą się najwcześniej, zostawiają **najwięcej czasu** na resztę dnia. (Inne „chciwe” reguły, np. „najkrótsze zajęcia” czy „najwcześniej zaczynające się”, **nie** są poprawne.) Złożoność: O(n log n) na sortowanie + O(n).

## Optymalne kodowanie — algorytm Huffmana

Chcemy zakodować znaki alfabetu bitami tak, żeby **oczekiwana długość kodu** była jak najmniejsza. Jeśli znak aₖ ma prawdopodobieństwo p(k) i kod długości d(k), to oczekiwana długość to **Σ p(k)·d(k)**.

- **Alfabet Morse'a** jest „kiepski”: często występujące litery (np. H, L) mają długie kody, a rzadkie (G, K, M) — krótkie. Co więcej, Morse **nie jest kodem binarnym** — potrzebny jest trzeci znak: przerwa (koniec słowa). Bez niej `-..-` mogłoby oznaczać X, TEET, NA, DT, TU…

:::def
**Warunek Fano (kod prefiksowy):** żadne słowo kodowe nie może być **początkiem** innego słowa kodowego. Wtedy ciąg bitów da się odkodować jednoznacznie bez separatorów.

W języku drzew: kody to ścieżki od korzenia (lewo = 0, prawo = 1), a słowa kodowe kończą się **tylko w liściach**.
:::

**Algorytm Huffmana:**
1. utwórz las — z każdym symbolem związane jest jednowęzłowe drzewo z jego częstością,
2. dopóki w lesie jest więcej niż jedno drzewo: wyjmij **dwa najrzadsze**, podwieś je pod nowym węzłem o częstości równej **sumie** i włóż z powrotem.

Przykład z wykładu: A 1/8, B 1/8, C 1/8, D 1/4, E 3/8.

```tree caption="Drzewo Huffmana (lewo = 0, prawo = 1)"
1(3/8(1/4(A,B),C),5/8(D,E))
```

Kody: **A 000, B 001, C 01, D 10, E 11**. Średnia długość: 3·(1/8) + 3·(1/8) + 2·(1/8) + 2·(1/4) + 2·(3/8) = **2,25 bitu** (zamiast 3 bitów kodu o stałej długości dla 5 symboli).

**Implementacja i koszt:**
- kolejka priorytetowa w **kopcu**: budowa < 4n, każdy obrót pętli to dwa pobrania i jedno wstawienie — łącznie ok. **5n(log n + 4/5)** porównań, czyli O(n log n),
- jeśli częstości są **już posortowane** — wystarczą **stos i kolejka**: na stosie symbole (najrzadsze na górze), sumy wkładamy na koniec kolejki — rosną, więc kolejka sama jest posortowana; dwa najmniejsze elementy są zawsze wśród ≤ 4 kandydatów (dwóch na szczycie stosu i dwóch na początku kolejki) → **O(n)**.

**Poprawność** (szkic z wykładu, trzy lematy):
1. w optymalnym drzewie kodowym każdy węzeł wewnętrzny ma **dwóch** synów (inaczej można skrócić kody),
2. istnieje optymalne drzewo, w którym dwa **najrzadsze** symbole są **braćmi** (na najniższym poziomie),
3. jeśli zastąpimy parę braci a₁, a₂ jednym symbolem o częstości p(a₁) + p(a₂) i dla takiego alfabetu drzewo jest optymalne, to po „rozwinięciu” liścia z powrotem w a₁, a₂ drzewo jest optymalne dla pierwotnego alfabetu.

## Problem plecakowy

Ze slajdów 2009: plecak ma pojemność W, przedmioty mają wagi wᵢ i wartości vᵢ. Chcemy zabrać jak najcenniejszy ładunek.

- **Wersja ciągła** (przedmioty można dzielić — np. sypki towar): zachłannie bierzemy przedmioty według **malejącego stosunku vᵢ/wᵢ** (wartość na kilogram), a z ostatniego tylko tyle, ile się zmieści. To jest **optymalne**.
- **Wersja dyskretna 0/1** (przedmiot bierzemy w całości albo wcale): ta sama strategia **może zawieść** (patrz zadanie 4). Ten problem rozwiązuje się innymi metodami (np. programowaniem dynamicznym).

## Najkrótsze ścieżki — algorytm Dijkstry

:::def
Dany jest graf G = (V, E) z **nieujemnymi** wagami krawędzi c(e) ≥ 0 i wierzchołek startowy s. **Drzewo najkrótszych ścieżek** z korzeniem s to drzewo rozpinające, w którym ścieżka od s do każdego v jest najkrótszą ścieżką z s do v w G.
:::

**Algorytm Dijkstry** (wykład): dla każdego wierzchołka trzymamy
- **d[v]** — długość najkrótszej znanej dotąd ścieżki z s do v (na początku ∞, d[s] = 0),
- **p[v]** — poprzednik v na tej ścieżce.

Powtarzaj, aż wszystkie wierzchołki będą „gotowe”:
1. wybierz **niegotowy** wierzchołek u o **najmniejszym** d[u] i uznaj go za gotowy (zachłanny wybór!),
2. dla każdego sąsiada w (niegotowego): jeśli d[u] + c(u, w) < d[w], to d[w] := d[u] + c(u, w), p[w] := u (**relaksacja**).

:::warn
Dijkstra wymaga **nieujemnych** wag. Przy ujemnej krawędzi „gotowy” wierzchołek mógłby później dostać krótszą ścieżkę — zachłanna decyzja byłaby błędna.
:::

Złożoność: z tablicą O(n²); z kolejką priorytetową (kopcem) **O((n + m) log n)**.

## Minimalne drzewo rozpinające (MST)

:::def
**Drzewo rozpinające** grafu spójnego G to podgraf będący drzewem i zawierający **wszystkie** wierzchołki (ma n − 1 krawędzi). **Minimalne drzewo rozpinające** to takie, którego suma wag krawędzi jest najmniejsza.
:::

:::analogy
Łączymy kablem n budynków; koszt kabla między parami jest znany. Chcemy, żeby wszystkie były połączone (pośrednio lub bezpośrednio) jak najtaniej — to MST.
:::

**Algorytm Prima:** zaczynamy od jednego wierzchołka; w każdym kroku dołączamy do drzewa **najtańszą krawędź** łączącą wierzchołek drzewa z wierzchołkiem spoza drzewa. Złożoność: O(n²) z tablicą, **O(m log n)** z kopcem.

**Algorytm Kruskala:** sortujemy krawędzie rosnąco według wag i przeglądamy je po kolei; krawędź dodajemy, jeśli **nie tworzy cyklu** z już wybranymi (łączy dwa różne drzewa lasu). Do sprawdzania „czy w tym samym drzewie?” używamy struktury **Find-Union** (temat 13). Złożoność: **O(m log m)** (głównie sortowanie).

### Dlaczego to działa? {own}

:::own
Krótkie uzasadnienie od autora strony (na slajdach go nie ma).
:::

**Własność przekroju:** podzielmy wierzchołki na dwie grupy. Najlżejsza krawędź łącząca te grupy należy do pewnego MST. Prim zawsze bierze najlżejszą krawędź między „drzewem” a „resztą”, a Kruskal — najlżejszą krawędź między dwoma różnymi drzewami lasu; obie decyzje są więc bezpieczne.

```java title="WeightedGraphs.java — Dijkstra, Prim, Kruskal"
@include t14-graphs.java
```

```java title="Greedy.java — wybór zajęć, plecak ciągły, Huffman"
@include t14-greedy.java
```


## Wersja z wykładu 2026/2027 (M. Sydow) — „Znajdowanie najkrótszych ścieżek”

:::exam
Na sprawdzianie wiedzy: specyfikacja problemu, relaksacja, sortowanie topologiczne, **trzy warianty (DAG, Dijkstra, Bellman-Ford)** z kodem i złożonościami, wybór najlepszego algorytmu dla danego grafu, **symulacja Dijkstry** (wartości `distance` i `parent`). Zadanie treningowe (Dijkstra + Kruskal): [Sprawdziany 2026/2027](page:exams). Minimalne drzewa rozpinające (Prim, Kruskal) — w sekcji poniżej.
:::

:::def Problem najkrótszych ścieżek z jednym źródłem
**Wejście:** skierowany graf G = (V, E) z wagami krawędzi w : E → ℝ i wierzchołek startowy s ∈ V. **Wyjście:** dla każdego v ∈ V — długość najkrótszej ścieżki $\mu(s,v)$ z s do v (jeśli istnieje) oraz **rodzic** w drzewie najkrótszych ścieżek.
:::

Najkrótsza ścieżka może nie istnieć: v nieosiągalny z s ($\mu=+\infty$) albo istnieje ścieżka przez **ujemny cykl** ($\mu=-\infty$); w pozostałych przypadkach μ = d ∈ ℝ. **Lemat:** podścieżka najkrótszej ścieżki jest najkrótszą ścieżką. Warianty zależą od własności grafu: skierowany czy nie, **acykliczny** (najszybciej), **wagi nieujemne** (szybciej; dla wag całkowitych — jeszcze lepsza struktura danych).

**Idea (jak BFS):** każdy wierzchołek ma `distance` (najkrótsza znana odległość) i `parent`. Inicjalizacja: s.distance = 0, s.parent = s, pozostałe distance = +∞, parent = null. Wartości są „propagowane” przez krawędzie — **relaksacja**:

```pseudo
relax((u,v))          # (u,v) jest krawędzią w grafie
  if u.distance + w(u,v) < v.distance
    v.distance = u.distance + w(u,v)
    v.parent = u
```

Po dowolnym ciągu relaksacji ∀v: v.distance ≥ μ(v) (nie spada poniżej prawdziwej odległości — indukcja). **Lemat (poprawność):** jeśli ciąg relaksacji zawiera (jako podciąg) najkrótszą ścieżkę p = (e₁, …, eₖ) z s do v, to v.distance = μ(s, v) (indukcja po krawędziach ścieżki).

**Sortowanie topologiczne** (tylko digrafy): ustawienie wierzchołków w ciąg tak, by dla każdej krawędzi (u, v) u było przed v. Możliwe ⇔ graf **nie ma cykli**. Sposób: wykonaj **DFS** i ustaw wierzchołki od **największego czasu zakończenia** do najmniejszego (lub iteracyjnie usuwaj wierzchołki o stopniu wejściowym 0 — też liniowo).

**1. DAG:** posortuj topologicznie (O(m + n)), potem dla s = vⱼ relaksuj wszystkie krawędzie wychodzące z vⱼ, vⱼ₊₁, … aż do vₙ. Każda krawędź relaksowana co najwyżej raz → $O(m+n)$. Wierzchołki przed s w porządku są nieosiągalne.

**2. Dijkstra (wagi nieujemne):** bez ujemnych krawędzi nie ma ujemnych cykli, ale zwykłe cykle mogą być (nie da się sortować topologicznie). Relaksujemy w kolejności **niemalejących najkrótszych odległości** od źródła — zapewnia to **kolejka priorytetowa** (priorytet = distance). Analogia: podnoszenie ze stołu sznurków połączonych węzełkami.

```pseudo
s.distance = 0
pq.insert(s)
s.parent = s

for-each v in V except s:
   v.distance = INFINITY
   v.parent = null

while(!pq.isEmpty())
   scannedNode = pq.delMin()
   for-each v in scannedNode.adjList:
      if (v.distance > scannedNode.distance + w(scannedNode, v))
         v.distance = scannedNode.distance + w(scannedNode, v)
         v.parent = scannedNode
         if (pq.contains(v)) pq.decreaseKey(v)
         else pq.insert(v)
```

(pq z operacją decreaseKey — **adresowalna** kolejka priorytetowa, ze słownikiem mapującym wierzchołki na pozycje.) **Analiza:** n = |V|, m = |E|; operacja dominująca — porównanie priorytetów, aktualizacja atrybutów; inicjalizacja O(n); pętla $O(n\times(\text{delMin}+\text{insert})+m\times\text{decreaseKey})=O(n\log n)+O(m\log n)$ = $O((n+m)\log n)$ dla kopca binarnego. Przeciętnie decreaseKey wykonuje się O(n log(m/n)) razy → $O(m+n\log(m/n)\log n)$ (liniowo dla gęstych grafów). Kopiec Fibonacciego (decreaseKey zamortyzowane O(1)): $O(m+n\log n)$. Wagi całkowite ≤ C: $O(m+nC)$ (monotoniczna kolejka bukietowa).

**3. Bellman-Ford (dowolne wagi):** podejście „siłowe” — najkrótsza ścieżka ma ≤ n − 1 krawędzi, więc (n − 1)-krotna relaksacja wszystkich m krawędzi (w ustalonym ciągu) zawiera każdą najkrótszą ścieżkę jako podciąg: $O(nm)$. Nieosiągalne mają d = ∞. Potem jeszcze raz m relaksacji — jeśli distance nadal maleje, wierzchołek leży na ścieżce z ujemnym cyklem → ustawiamy −∞ (liniowo).

```pseudo
%% (initialise as in Dijkstra)

for(i = 1; i <= (n-1); i++)
   for each e in E
      relax(e)

for each e=(u,v) in E
   if (u.distance + w(u,v) < v.distance)
      identifyNegativeCycle(v)

***

identifyNegativeCycle(v)
   if (v.distance > -infinity)
      v.distance = -infinity
      for each w in v.adjList
         identifyNegativeCycle(w)
```

| wariant | warunek | złożoność |
|---|---|---|
| DAG | graf acykliczny | O(n + m) |
| Dijkstra | wagi nieujemne | O((n + m) log n) (kopiec binarny) |
| Bellman-Ford | dowolne wagi | O(nm) |

### Przykładowe zadania ze slajdów

Specyfikacja problemu najkrótszych ścieżek z jednym źródłem i 2 przykłady zastosowań; na czym polega relaksacja; specyfikacja sortowania topologicznego, kiedy możliwe i jak (2 sposoby); **sortowanie topologiczne danego DAG za pomocą DFS**; który z 3 algorytmów będzie najefektywniejszy dla danego grafu; **Dijkstra na danym grafie — wartości wszystkich atrybutów**; Bellman-Ford na danym grafie; analiza złożoności 3 algorytmów.


## Wersja z wykładu 2026/2027 (M. Sydow) — „Minimalne drzewa rozpinające”

:::exam
**Kruskal** jest w zakresie sprawdzianu praktycznego. Typowe zadanie ze slajdów: *mając dany graf z wagami, zastosuj algorytm Prima/Kruskala i wypisz krawędzie w kolejności, w jakiej zostały zaakceptowane* — **przy remisie wag decyduje kolejność alfabetyczna etykiet**. Zadanie treningowe (Kruskal i Prim na jednym grafie): [Sprawdziany 2026/2027](page:exams).
:::

:::def Drzewo i las rozpinający src="slajdy MST"
**Drzewo rozpinające** spójnego, nieskierowanego grafu prostego $G=(V,E)$ to taki podgraf $T$, który **jest drzewem** i **zawiera wszystkie wierzchołki** grafu.
- graf niespójny nie ma drzewa rozpinającego; suma drzew rozpinających jego składowych (po jednym na składową) to **las rozpinający**,
- drzewo rozpinające dostaniemy, usuwając kolejno krawędzie aż do uzyskania drzewa; drzew rozpinających może być wiele,
- każde drzewo rozpinające danego grafu ma tyle samo krawędzi: $|V|-1$.
:::

:::def Problem MST
- **Wejście:** nieskierowany graf $G$ z wagami na krawędziach (liczby wymierne).
- **Wyjście:** drzewo rozpinające o **minimalnym łącznym koszcie krawędzi** — **minimalne drzewo rozpinające** (*Minimum Spanning Tree*).

Problem jest rozwiązywalny w czasie wielomianowym. Kruskal opiera się na własnościach cykli i rozcięć, Prim — na modyfikacji BFS i Dijkstry.
:::

### Rozcięcia i cykle

:::def Rozcięcie
Dla spójnego grafu $G=(V,E)$ z wagami i podzbioru $S\subseteq V$ **rozcięcie** to zbiór krawędzi $E'\subseteq E$ mających **dokładnie jeden koniec w $S$**, a drugi w $V\setminus S$.
:::

:::formula Własność rozcięcia src="lemat"
Jeśli $E'$ jest rozcięciem i $e$ jest krawędzią o **minimalnej wadze w $E'$**, to istnieje MST zawierające $e$. Co więcej, jeśli $T'$ jest zawarty w pewnym MST i nie zawiera żadnej krawędzi z $E'$, to $T'\cup\{e\}$ też jest zawarty w pewnym MST — krawędź $e$ jest **„przydatna”**.
:::

:::formula Własność cyklu src="lemat"
Niech $S$ będzie podzbiorem krawędzi pewnego MST, a $C$ cyklem w $G$. Jeśli $e=(u,v)\in C$ ma **maksymalny koszt w $C$**, $u$ styka się z $S$, a $v$ nie, to istnieje MST zawierające $S$ i **niezawierające $e$** — krawędź $e$ jest **zbędna**.
:::

Dowody — np. w podręczniku K. Mehlhorna. **Ogólny schemat:** (1) $T=\emptyset$; (2) dopóki $T$ nie jest MST, dodaj krawędź o minimalnym koszcie z pewnego rozcięcia $E'$ rozłącznego z $T$. Własność rozcięcia gwarantuje poprawność; różne wybory $E'$ dają Prima i Kruskala.

### Algorytm Prima

Zaczyna od wierzchołka $s$ i powiększa drzewo; $S$ — wierzchołki drzewa (na początku $\{s\}$). Krawędzie z dokładnie jednym końcem w $S$ tworzą rozcięcie — w każdym kroku dodajemy drugi koniec **najlżejszej** krawędzi z tego rozcięcia. Kolejka priorytetowa trzyma wierzchołki z priorytetem = waga najlżejszej krawędzi łączącej je z $S$ (`dist`); po dodaniu wierzchołka relaksujemy jego krawędzie. Drzewo — w atrybutach `parent`.

```pseudo
MSTPrim(V,w,s){
  PriorityQueue pq
  s.dist = 0
  s.parent = null
  pq.insert(s)
  for each u in V\{s}:
    u.dist = INFINITY

  while(!pq.isEmpty()):
    u = pq.deleteMin()
    u.dist = 0
    for each v in u.adjList:
      if (w(u,v) < v.dist):
        v.dist = w(u,v)
        v.parent = u
        if (pq.contains(v)): pq.decreaseKey(v)
        else pq.insert(v)
}
```

:::formula Złożoność Prima
Rozmiar danych $n=|V|$, $m=|E|$; operacja dominująca: przypisania i porównania priorytetów. Inicjalizacja $O(n)$, pętla: $n\times\text{delMin} + m\times\text{decreaseKey}$.
$$\text{kopiec binarny: } O(n\log n)+O(m\log n)=O\big((n+m)\log n\big)$$
$$\text{kopiec Fibonacciego: } O(n\log n + m)$$
:::

:::own
Dlaczego `u.dist = 0` po zdjęciu z kolejki? (wyjaśnienie autora strony) To „zamyka” wierzchołek: przy dodatnich wagach warunek `w(u,v) < v.dist` nigdy już nie zmieni jego rodzica, więc wierzchołki drzewa nie są relaksowane ponownie.
:::

### Algorytm Kruskala

1. początkowo $T=\emptyset$,
2. rozpatruj krawędzie w kolejności **niemalejących wag** i dodawaj te, które **nie tworzą cyklu** z dotychczas dodanymi; pozostałe odrzucaj — aż $T$ będzie drzewem rozpinającym.

Problem: szybko sprawdzić, czy krawędź tworzy cykl. $T$ jest w każdej chwili **lasem**, a krawędź $(u,v)$ tworzyłaby cykl ⇔ $u$ i $v$ są **w tym samym drzewie** lasu — stąd struktura **union-find**.

```pseudo
kruskalMST(V,E,w){
  T = 0
  UnionFind uf
  foreach edge (u,v) in non-decreasing order of weight:
    if (uf.find(u) != uf.find(v)):
      T = T + (u,v)
      uf.union(uf.find(u),uf.find(v))
  return T
}
```

:::formula Złożoność Kruskala
Szybka (drzewowa) implementacja union-find: `union` w czasie stałym, `find` w prawie stałym czasie zamortyzowanym. Całość jest zdominowana przez **sortowanie krawędzi**:
$$O(m\log m)$$
:::

### Przykładowe pytania ze slajdów

Definicje drzewa i lasu rozpinającego, rozcięcia i cyklu; własność rozcięcia i cyklu oraz ich interpretacja w MST i w algorytmach; idee Prima i Kruskala; analiza złożoności; **Prim/Kruskal na danym grafie — krawędzie w kolejności akceptacji (remisy: kolejność alfabetyczna)**.

=== summary ===

:::exam Co trzeba umieć
**Kruskal** (sprawdzian praktyczny): krawędzie w kolejności akceptacji, **remisy — alfabetycznie**. Prim, Dijkstra (wartości `distance`, `parent`), relaksacja, wybór algorytmu.
:::

## Minimalne drzewo rozpinające (MST)

:::formula Własności
**Rozcięcia:** najlżejsza krawędź rozcięcia należy do pewnego MST. **Cyklu:** najcięższa krawędź cyklu jest zbędna.
:::

| | idea | złożoność |
|---|---|---|
| **Kruskal** | krawędzie rosnąco po wadze; bierz, jeśli nie tworzy cyklu (**union-find**) | $O(m\log m)$ |
| **Prim** | rośnij drzewo od $s$; PQ z wagą najlżejszej krawędzi do drzewa (`dist`) | $O((n+m)\log n)$ |

## Najkrótsze ścieżki z jednego źródła

:::formula Relaksacja krawędzi (u, v)
$$\text{if } u.d + w(u,v) < v.d:\quad v.d = u.d + w(u,v),\;\; v.\text{parent}=u$$
:::

| wariant | kiedy | złożoność |
|---|---|---|
| DAG | graf acykliczny (sortowanie topologiczne: DFS, malejące `f`) | $O(n+m)$ |
| **Dijkstra** | wagi **nieujemne**; PQ po `distance` | $O((n+m)\log n)$ |
| Bellman-Ford | dowolne wagi; $n-1$ rund relaksacji + wykrycie ujemnego cyklu | $O(nm)$ |

$\mu(s,v)=+\infty$ — nieosiągalny; $-\infty$ — ścieżka przez ujemny cykl.

:::warn Typowe błędy
- Kruskal bez reguły **alfabetycznej** przy równych wagach (zmienia odpowiedź!),
- Dijkstra przy ujemnych wagach,
- w Dijkstrze relaksacja ostra (`>`): przy remisie rodzic się **nie** zmienia.
:::

:::info Poza programem 2026/2027
Huffman, problem plecakowy i wybór zajęć z tego tematu to materiał z 2025/2026 (nie ma ich na slajdach M. Sydowa).
:::

=== tasks ===

:::task level=2 source="Ćwiczenie 12, zad. 1 (zmienione)" title="Algorytm Dijkstry"
Dla grafu poniżej pokaż działanie algorytmu **Dijkstry** z wierzchołka startowego **G**. Podaj stan tablicy d i p oraz zawartość kolejki (wierzchołki niegotowe o skończonym d) po każdym kroku. Przy równych d wybieraj wierzchołek wcześniejszy alfabetycznie.

```graph
A 70 50
B 250 50
C 70 200
D 270 150
E 190 260
F 390 260
G 110 380
H 330 380
A-B 4
A-C 2
B-C 5
B-D 3
C-E 6
D-E 1
D-F 6
E-F 2
E-G 7
F-H 3
G-H 2
C-G 9
B-F 8
```
::hint
Start: d[G] = 0, reszta ∞. Pierwszy krok aktualizuje sąsiadów G: C (9), E (7), H (2).
::solution
Zapis d/p; gwiazdka = wierzchołek gotowy.

| krok | bierzemy | A | B | C | D | E | F | H | kolejka po kroku |
|---|---|---|---|---|---|---|---|---|---|
| 1 | G (0) | ∞ | ∞ | 9/G | ∞ | 7/G | ∞ | 2/G | H2, E7, C9 |
| 2 | H (2) | ∞ | ∞ | 9/G | ∞ | 7/G | 5/H | 2* | F5, E7, C9 |
| 3 | F (5) | ∞ | 13/F | 9/G | 11/F | 7/G | 5* | | E7, C9, D11, B13 |
| 4 | E (7) | ∞ | 13/F | 9/G | **8/E** | 7* | | | D8, C9, B13 |
| 5 | D (8) | ∞ | **11/D** | 9/G | 8* | | | | C9, B11 |
| 6 | C (9) | 11/C | 11/D | 9* | | | | | A11, B11 |
| 7 | A (11) | 11* | 11/D | | | | | | B11 |
| 8 | B (11) | | 11* | | | | | | — |

Wynik: d = A 11, B 11, C 9, D 8, E 7, F 5, G 0, H 2.
Drzewo najkrótszych ścieżek (z p): G–H, H–F, G–E, E–D, D–B, G–C, C–A. Np. najkrótsza ścieżka do B: G → E → D → B (7 + 1 + 3 = 11).
:::

:::task level=2 source="Ćwiczenie 12, zad. 2 (zmienione)" title="Algorytm Prima"
Dla tego samego grafu pokaż działanie algorytmu **Prima** startując od wierzchołka **E**. Podaj kolejność dodawania wierzchołków i krawędzie MST oraz jego łączną wagę. (Przy równych wagach wybieraj wierzchołek wcześniejszy alfabetycznie.)
::hint
Z E najtańsza krawędź to E–D (1).
::solution
| krok | dodana krawędź | wierzchołek | waga |
|---|---|---|---|
| 1 | E–D | D | 1 |
| 2 | E–F | F | 2 |
| 3 | D–B | B | 3 (remis z F–H = 3 → B alfabetycznie) |
| 4 | F–H | H | 3 |
| 5 | H–G | G | 2 |
| 6 | B–A | A | 4 |
| 7 | A–C | C | 2 |

Kolejność: **E, D, F, B, H, G, A, C**; waga MST = 1 + 2 + 3 + 3 + 2 + 4 + 2 = **17**.
:::

:::task level=2 source="Ćwiczenie 12, zad. 3 (zmienione)" title="Algorytm Kruskala"
Dla tego samego grafu pokaż działanie algorytmu **Kruskala**: kolejno rozważane krawędzie, decyzję (bierzemy / cykl) i stan lasu.
::hint
Posortuj krawędzie: D–E 1, A–C 2, E–F 2, G–H 2, B–D 3, F–H 3, A–B 4, B–C 5, …
::solution
| krawędź | decyzja | las (drzewa) |
|---|---|---|
| D–E 1 | bierzemy | {D,E}, reszta pojedynczo |
| A–C 2 | bierzemy | {A,C}, {D,E} |
| E–F 2 | bierzemy | {A,C}, {D,E,F} |
| G–H 2 | bierzemy | {A,C}, {D,E,F}, {G,H} |
| B–D 3 | bierzemy | {A,C}, {B,D,E,F}, {G,H} |
| F–H 3 | bierzemy | {A,C}, {B,D,E,F,G,H} |
| A–B 4 | bierzemy | jedno drzewo — 7 krawędzi = n − 1, koniec |

Pozostałe krawędzie (B–C 5, C–E 6, D–F 6, E–G 7, B–F 8, C–G 9) tworzyłyby cykle. Waga MST = **17** — tyle samo co u Prima (tu nawet to samo drzewo).
:::

:::task level=1 source="own" title="Wybór zajęć"
Dane są zajęcia (odcinki [p, k)):

| nr | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| p | 1 | 2 | 4 | 1 | 5 | 8 | 9 | 11 | 10 | 13 | 12 |
| k | 3 | 5 | 7 | 8 | 9 | 10 | 11 | 14 | 15 | 16 | 13 |

Wykonaj algorytm zachłanny. Ile zajęć można wybrać?
::hint
Posortuj po k: 1(3), 2(5), 3(7), 4(8), 5(9), 6(10), 7(11), 11(13), 8(14), 9(15), 10(16).
::solution
- bierzemy **1** [1,3) — koniec 3,
- 2 (p = 2 < 3) — kolizja; **3** [4,7) — bierzemy, koniec 7,
- 4, 5 — kolizje; **6** [8,10) — bierzemy, koniec 10,
- 7 [9,11) — kolizja; **11** [12,13) — bierzemy, koniec 13,
- 8, 9 — kolizje; **10** [13,16) — bierzemy (13 ≥ 13).

Wybrane: **1, 3, 6, 11, 10 → 5 zajęć**.
:::

:::task level=2 source="own" title="Kody Huffmana"
Znaki występują w tekście z częstościami: **K 7, L 3, M 12, N 5, O 20, P 9** (łącznie 56). Zbuduj drzewo Huffmana, podaj kody i średnią długość kodu. Porównaj z kodem o stałej długości.
::hint
Pierwsze scalenie: L (3) + N (5) = 8.
::solution
Scalenia: L3 + N5 = 8; K7 + (LN)8 = 15; P9 + M12 = 21; (K,LN)15 + O20 = 35; (PM)21 + 35 = 56.

```tree
56(21(P,M),35(15(K,8(L,N)),O))
```

Kody: **P 00, M 01, K 100, L 1010, N 1011, O 11**.

Koszt: 9·2 + 12·2 + 7·3 + 3·4 + 5·4 + 20·2 = **135 bitów**, średnio 135/56 ≈ **2,41 bitu** na znak. Kod stały dla 6 znaków potrzebuje 3 bitów → 168 bitów.

(Przy remisach w kolejce kody mogą wyjść inne, ale łączny koszt zawsze będzie 135.)
:::

:::task level=2 source="own" title="Plecak: ciągły kontra 0/1"
Plecak ma pojemność **40 kg**. Przedmioty: A (10 kg, 50 zł), B (20 kg, 80 zł), C (30 kg, 105 zł). Rozwiąż wersję ciągłą zachłannie. Potem zastosuj tę samą regułę do wersji 0/1 i porównaj z optimum.
::hint
Stosunki v/w: A 5, B 4, C 3,5 zł/kg.
::solution
- **Ciągła:** A cały (10 kg, 50), B cały (20 kg, 80), z C tylko 10 kg z 30 → 35 zł. Razem **165 zł** — optimum.
- **0/1 zachłannie:** A, B (30 kg, 130 zł), C się nie mieści → **130 zł**.
- **0/1 optimum:** A + C = 40 kg, **155 zł**. Zachłanność zawiodła.
:::

:::task level=1 source="own" title="Most — jeszcze raz"
Czasy przejścia czterech osób to 1, 2, 6 i 9 minut (warunki jak na wykładzie). Ile trwa przeprawa wg strategii „zawsze odprowadza najszybszy”, a ile najlepsza?
::hint
Spróbuj, żeby dwie najwolniejsze osoby szły razem.
::solution
- zachłannie: 1+9 → 9, wraca 1 → 1, 1+6 → 6, wraca 1 → 1, 1+2 → 2: **19 min**,
- lepiej: 1+2 → 2, wraca 1 → 1, 6+9 → 9, wraca 2 → 2, 1+2 → 2: **16 min**.
:::
