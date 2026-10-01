---
id: cheatsheet
type: page
title: Ściąga 2026/2027 — wszystkie złożoności i wzory na jednej stronie
short: Ściąga
icon: 📋
eyebrow: Podsumowanie całego kursu · 2026/2027
desc: Złożoności i wzory z wykładów M. Sydowa (2026/2027) zebrane w jednym miejscu — do powtórki przed wejściówkami i sprawdzianami.
---

:::own
Zestawienie autora strony na podstawie slajdów 2026/2027 (szczegóły — w tematach i konspektach). Ćwiczenie: [Testy próbne](page:mock).
:::

## Zanim policzysz złożoność

:::formula Dwa kroki + miary
1. **operacja dominująca**, 2. **rozmiar danych**.
$$W(n)=\sup\{t(d):d\in D_n\} \qquad A(n)=\sum_k p_{nk}\,k=E(X_n) \qquad S(n)\text{ — pamięć}$$
:::

| | znaczy | definicja |
|---|---|---|
| $O$ | ≤ | $\exists_{c>0}\exists_{n_0}\forall_{n\ge n_0}\,f\le c\,g$ |
| $\Omega$ | ≥ | $\exists_{c>0}\exists_{n_0}\forall_{n\ge n_0}\,f\ge c\,g$ |
| $\Theta$ | = | $O$ w obie strony |
| $o$ / $\omega$ | < / > | $\forall_{c>0}$ zamiast $\exists_{c>0}$ |

$$1 \prec \log n \prec \sqrt n \prec n \prec n\log n \prec n^2 \prec n^3 \prec 2^n \prec n!$$

## Wyszukiwanie

| Algorytm | Złożoność |
|---|---|
| sekwencyjne | $W=len$, $A=\frac{len+1}{2}$ |
| skoki co $k$ | $\frac1k\Theta(len)$, najlepiej $k=\sqrt{len}$ |
| binarne (posortowany, RAM) | $\Theta(\log_2 len)$, $S=O(1)$ |
| 2. najmniejszy — turniej | $len-1+\Theta(\log len)$ |
| partition | $W=n+O(1)$, $S=O(1)$ |
| Hoare (k-ty) | $A=\Theta(n)$, $W=\Theta(n^2)$ |

## Sortowanie (operacja: porównanie)

| Algorytm | W | A | pamięć | stabilny |
|---|---|---|---|---|
| Selection | $\frac{n(n-1)}{2}$ | $=W$ | $O(1)$ | nie |
| Insertion | $\frac{n(n-1)}{2}$ | $\frac14n^2+\Theta(n)$ | $O(1)$ | tak |
| MergeSort | $\Theta(n\log n)$ | $\Theta(n\log n)$ | $\Theta(n)$ | tak* |
| QuickSort | $\Theta(n^2)$ | $\Theta(n\log n)$ (≈1,44) | w miejscu | nie |
| HeapSort | $\Theta(n\log n)$ | $\Theta(n\log n)$ | — | nie |
| CountSort | $\Theta(n+m)$ | $\Theta(n+m)$ | $\Theta(n+m)$ | tak |
| RadixSort | $\Theta(d(n+10))$ | | | tak |

\* przy `<=` w merge; wersja ze slajdu z `<` przy równych bierze z prawego ciągu. **Dolna granica przez porównania:** $\log_2 n!=\Theta(n\log n)$.

## Rekurencja

| Równanie | Rozwiązanie |
|---|---|
| $t(n)=t(n/2)+c$ | $\Theta(\log n)$ |
| $t(n)=2t(n/2)+c$ | $\Theta(n)$ |
| $t(n)=2t(n/2)+cn$ | $\Theta(n\log n)$ |
| hanoi | $2^n-1$ |

**Tw. uniwersalne** $T(n)=aT(n/b)+f(n)$ — porównaj $f$ z $n^{\log_b a}$: mniejsze → $\Theta(n^{\log_b a})$, równe → $\cdot\log n$, większe → $\Theta(f)$.

## Struktury danych

| Struktura | Operacje |
|---|---|
| stos / kolejka / deque | $O(1)$ (lista 1-kier. / tablica cykliczna / lista 2-kier.) |
| lista dowiązaniowa | splice, wstaw/usuń przy węźle $O(1)$; dostęp $O(n)$ |
| słownik — tablice naiwne | nieposort.: search $O(n)$, insert $O(1)$; posort.: search $O(\log n)$, insert $O(n)$ |
| tablica mieszająca | $O(\alpha)$, $\alpha=n/m$ |
| BST | $A=O(\log n)$, $W=O(n)$ |
| AVL | wszystko $W=O(\log n)$; $bf\in\{-1,0,1\}$ |
| kopiec binarny (min) | insert, delMin $O(\log n)$; findMin $O(1)$; construct $O(n)$; merge $O(n)$ |

**Kopiec w tablicy od 1:** rodzic $\lfloor i/2
floor$, synowie $2i$, $2i+1$.

## Grafy

| Algorytm | Złożoność |
|---|---|
| reprezentacje | macierz $\Theta(n^2)$, listy $\Theta(n+m)$, incydencji $\Theta(nm)$ |
| BFS, DFS | $O(n+m)$ |
| najkrótsze ścieżki w DAG | $O(n+m)$ |
| Dijkstra (kopiec binarny) | $O((n+m)\log n)$; Fibonacci: $O(m+n\log n)$ |
| Bellman-Ford | $O(nm)$ |
| Prim | $O((n+m)\log n)$ |
| Kruskal | $O(m\log m)$ |

## Konwencje sprawdzianu (łatwo stracić punkty)

:::warn Zapamiętaj
- binSearch: `m = (l+r)/2` **w dół**; MergeSort: `m = len/2` — **lewa krótsza**,
- partition: liczy się **ostatni** swap; CountSort: faza 3 **od końca**,
- kopiec od indeksu **1**; `construct` ≠ n × `insert`,
- BST: równy klucz **w prawo**; DFS: `time` od **0**,
- sąsiedzi i remisy (Kruskal, Prim) — **alfabetycznie**.
:::
