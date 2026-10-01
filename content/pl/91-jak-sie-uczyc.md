---
id: howto
type: page
title: Jak uczyć się ASD — plan i dobre nawyki
short: Jak się uczyć
icon: 💡
eyebrow: Rekomendacje autora strony
desc: Praktyczny plan nauki, kolejność tematów, typowe błędy i sposób pracy z zadaniami.
---

:::own
Cała ta strona to **rekomendacje autora strony** — nie pochodzą z wykładów ani z zasad zaliczenia.
:::

## Plan na semestr

Wykład i ćwiczenia idą mniej więcej w tej kolejności — warto być **o jeden temat przed** ćwiczeniami.

| Tydzień | Tematy | Na co zwrócić uwagę |
|---|---|---|
| 1–2 | [1. Wprowadzenie](topic:t01), [3. Złożoność](topic:t03) | logarytmy, O/Ω/Θ, liczenie pętli |
| 3–4 | [2. Poprawność](topic:t02), [4. Wyszukiwanie](topic:t04) | niezmienniki, funkcja malejąca, BinSearch |
| 5–6 | [5. Sortowanie proste](topic:t05), [6. Rekursja](topic:t06) | ślady sortowań, MergeSort, twierdzenie o rekurencji |
| 7 | [7. QuickSort](topic:t07), [8. Karacuba i FFT](topic:t08) | partition, dolne ograniczenie, CountingSort |
| 8 | [9. Stos, kolejka, listy](topic:t09) | aksjomaty, ciągi operacji |
| 9–10 | [10. BST](topic:t10), [11. AVL](topic:t11) | operacje na BST, obiegi, rotacje |
| 11 | [12. Kopce](topic:t12) | upheap/downheap, construct, HeapSort |
| 12–13 | [13. Grafy](topic:t13), [14. Zachłanne](topic:t14) | DFS/BFS, Dijkstra, Prim, Kruskal |

## Jak pracować z jednym tematem

1. **Przeczytaj tekst** z ołówkiem w ręku — przy każdym przykładzie przelicz go sam.
2. **Przepisz kod** (nie kopiuj!) i uruchom go dla własnych danych. Dopisz wypisywanie stanu tablicy po każdym kroku.
3. Zrób **zadania** z końca tematu. Podpowiedź otwieraj dopiero po 5–10 minutach własnych prób.
4. Wieczór przed ćwiczeniami przeczytaj **konspekt** (2–3 minuty).
5. Po tygodniu wróć do konspektu jeszcze raz — powtórka po czasie działa dużo lepiej niż jednorazowa nauka.

## Typowe błędy (i jak ich uniknąć)

- **Błąd o jeden** w pętlach i indeksach (`to n-1` w pseudokodzie vs `< n` w Javie; indeksy od 0 czy od 1 w kopcu).
- **Mylenie W(n) z A(n)** — pesymistyczna to najgorsze dane, oczekiwana to średnia.
- **Rozmiar danych dla liczb** to liczba cyfr, nie wartość — algorytm z n obrotami jest wykładniczy względem bitów.
- **Zapominanie o stabilności** (`<=` zamiast `<` w scalaniu decyduje o stabilności MergeSort).
- **BST a kopiec** — w kopcu nie ma porządku lewy/prawy.
- **Rotacje AVL** — szukaj **pierwszego od dołu** węzła z |BF| = 2 i sprawdź znak BF jego syna (pojedyncza czy podwójna rotacja?).
- **Dijkstra** — wierzchołek „gotowy” już się nie zmienia; nie relaksuj krawędzi do gotowych.

## Sprawdzone narzędzia {own}

- Rysuj! Drzewa, grafy i tablice na kartce są szybsze niż w głowie.
- Wizualizacje algorytmów (np. serwis VisuAlgo) pomagają zobaczyć ruch elementów — ale na teście trzeba umieć to zrobić ręcznie.
- Własne testy w Javie: porównaj wynik swojego sortowania z `Arrays.sort` dla tysięcy losowych tablic.
