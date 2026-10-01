---
id: t10
num: 10
type: topic
title: Dictionaries, BST trees and tree traversals
short: Dictionaries and BST
desc: The dictionary problem and its simple implementations, binary search trees (search, insert, min, max, successor, delete), preorder/inorder/postorder traversals and tree sort.
sources: asd8.pdf; Asd9.pdf; Wyklady 2009/wyklad_2.pdf (trees), asd 10 wyklad_8.pdf (dictionary, BST)
exercises: asd 08.pdf (tasks 1–3), asd 09 a.pdf (tasks 1–3)
---

## The dictionary problem

The most frequent operations on a set are **inserting**, **deleting** and **searching** for an element. A structure that supports them is a **dictionary** (*słownik*). Examples: databases, identifier tables in compilers, natural-language dictionaries, phone contacts.

:::def
**The dictionary problem:** give a data structure for the elements of a dynamic, finite set S, supporting the operations:
1. `construct(S)` — S := ∅,
2. `search(v, S)` — is v ∈ S? if so — where is it,
3. `insert(v, S)` — S := S ∪ {v},
4. `delete(v, S)` — S := S − {v}.
:::

In practice an element is usually a **record**, and we search for it by a field called the **key**.

### Simple implementations

| Implementation | search | insert | delete |
|---|---|---|---|
| unordered list | O(n) | O(n)* | O(n) |
| sorted array + binary search | **O(log n)** | O(n) | O(n) |
| BST tree (average) | O(log n) | O(log n) | O(log n) |
| AVL tree (topic 11) | O(log n) always | O(log n) | O(log n) |

\* insert into a list must check whether the element is already there.

- **Unordered list:** the advantage is simplicity and little memory, the drawback — long running time.
- **Self-organising list** (lecture): the argument of `search` or `insert` is moved **to the front** of the list. Frequently used elements stay near the front — with an uneven access distribution this works fast.
- **Sorted array:** `search` by "divide and conquer" (binary search): W(n) = log n + O(1), but `insert` and `delete` require shifting elements: W(n) = O(n).

## Trees — a glossary

:::def
- **Rooted tree:** one distinguished node — the **root**; every other node has exactly one **parent** (father).
- **Child** (son), **leaf** (a node without children), **internal node** (has children).
- **Depth** of a node — the number of edges from the root to it (the root has depth 0).
- **Height** of a tree — the greatest depth of a leaf (a one-node tree has height 0, the empty tree: −1).
- **Binary tree:** every node has at most two children — distinguished as **left** and **right**. The subtree rooted at the left child is the **left subtree**.
:::

## Binary search trees (BST)

:::def
A **BST** is a binary tree whose nodes hold keys arranged in **symmetric order**: for every node x
- if y lies in the **left** subtree of x, then **key(y) < key(x)**,
- if y lies in the **right** subtree of x, then **key(x) < key(y)**.
:::

:::analogy
The "too low / too high" game: in every node you ask "is the searched key smaller or larger?" and go left or right. A BST is like a permanently recorded binary-search strategy.
:::

An example BST (keys inserted in the order 50, 30, 70, 20, 40, 60, 80):

```tree
50(30(20,40),70(60,80))
```

### Searching

Start at the root. If the key is smaller — go left, larger — go right, equal — found. If we reach an empty place (null) — the key is not there. Cost: the length of the path, i.e. **O(h)**, where h is the height of the tree.

### Minimum and maximum

- **min** — keep going **left** as long as possible,
- **max** — keep going **right**.

### Inserting

Search for the key; where the search "falls out" of the tree (null), insert a **new leaf**. So the shape of the tree depends on the **order** of insertion!

### Successor and predecessor

The **successor** of key k is the smallest key greater than k (the next one in increasing order):

- if node k has a **right subtree** → the successor is **the minimum of the right subtree**,
- if not → the successor is the nearest ancestor for which k lies in its **left** subtree (going from the root to k, remember the last node where we turned left).

The predecessor — symmetrically (the maximum of the left subtree, or the last turn to the right).

### Deleting — three cases

1. **A leaf** — simply remove it.
2. **A node with one child** — the child takes its place.
3. **A node with two children** — replace it with its **successor** (the minimum of the right subtree) or **predecessor** (the maximum of the left subtree), and remove that node (it has at most one child, so it is case 1 or 2).

:::info
In the lecture code the choice between predecessor and successor is **random** (`b = random() % 2`) — so that after many deletions the tree does not "lean" to one side. In classes one rule is usually fixed — **ask your instructor which one to use** (the solutions on this site use the successor).
:::

Example — consecutive deletions from the tree above:

```tree caption="delete 20 (a leaf)"
50(30(_,40),70(60,80))
```

```tree caption="delete 30 (one child — 40 takes its place)"
50(40,70(60,80))
```

```tree caption="delete 50 (two children — the successor 60 takes its place)"
60(40,70(_,80))
```

### Complexity of BST

All operations cost **O(h)**. And the height depends on the insertion order:

- a **balanced** tree: h ≈ log₂ n,
- a **degenerate** tree (e.g. inserting 1, 2, 3, …, n — every key goes right): h = n − 1 — just a list!
- for a random insertion order the average node depth is about **1.39 log₂ n** — fast on average.

That is why we need trees that **watch** their height themselves — AVL trees (topic 11).

```java title="BST.java"
@include t10-bst.java
```

## Traversing binary trees

A **tree traversal** is an algorithm that visits every node and performs some action in it. The visiting order defines the three basic traversals:

| Traversal | Order | Remember |
|---|---|---|
| **preorder** (prefix) | root, left, right | root **before** subtrees |
| **inorder** (infix) | left, root, right | root **in between** |
| **postorder** (postfix) | left, right, root | root **after** subtrees |

Example:

```tree
A(B(D,E),C(_,F))
```

- preorder: **A B D E C F**
- inorder: **D B E A C F**
- postorder: **D E B F C A**

:::tip
A trick for writing them out quickly (from the site author): trace around the tree with a pencil starting at the left of the root. **Preorder** — write a node when you pass it on its **left**; **inorder** — when you pass **under** it; **postorder** — when you pass it on its **right**.
:::

### Preorder — when information flows from parent to child

Lecture: computing the **depth** of all nodes. First set the parent's depth, then pass it to the children:

```java title="Node depths (preorder, lecture)"
public void licz_glebokosc(TreeNode v, int glebokosc_ojca) {
    if (v != null) {
        glebokosc_ojca++;
        v.info = glebokosc_ojca;              // depth of v
        licz_glebokosc(v.left, glebokosc_ojca);
        licz_glebokosc(v.right, glebokosc_ojca);
    }
}
// call: licz_glebokosc(root, -1)
```

### Inorder — increasing order in a BST

:::def
**The inorder theorem for BST:** the keys of any BST written in **inorder** are in **increasing** order.

*Proof* (induction on the number of nodes n): for n = 0 the empty sequence is ordered. For a tree with n nodes and root r: the left subtree dₗ and the right subtree dₚ have fewer than n nodes and are BSTs, so by the induction hypothesis their inorder traversals are increasing. The inorder of the whole tree is: inorder(dₗ), then r (greater than everything in dₗ), then inorder(dₚ) (greater than r). The whole is increasing. ∎
:::

Consequence — **tree sort**: insert all elements into a BST, then write them out in inorder. Time: O(n log n) on average, O(n²) in the worst case (a degenerate tree).

### Postorder — when a parent needs its children's results

Lecture: computing the **height** of every node (the distance to the farthest leaf in its subtree). To know the height of a node we must know the heights of its children — so first the recursion, then the computation:

```java title="Height (postorder, lecture)"
int wysokosc(TreeNode v) {
    int wys_l, wys_r;
    if (v == null) return -1;
    wys_l = wysokosc(v.left);
    wys_r = wysokosc(v.right);
    v.info = Math.max(wys_l, wys_r) + 1;
    return v.info;
}
```

### Rebuilding a tree from traversals {own}

:::own
Added by the site author — useful in tasks like "if preorder is …, then inorder is …".
:::

- **preorder + inorder** (distinct keys) determine the tree **uniquely**: the first element of preorder is the root; in inorder it splits the sequence into the left and right subtree; continue recursively.
- for a **BST** preorder (or postorder) alone is enough — inorder is simply the sorted keys.
- preorder and postorder alone are **not enough** for an ordinary tree (e.g. a tree "root + one child" — is the child left or right?).
- **BST test from a traversal:** a sequence is the inorder of some BST ⇔ it is **strictly increasing**.

=== summary ===

## Dictionary

- operations: construct, search, insert, delete on a set S (element = record, searched by key).
- list: O(n); self-organising list (element to the front); sorted array: search log n, insert/delete O(n).

## BST

- symmetric order: left subtree < node < right subtree.
- search: left/right until a hit or null; min — leftmost; max — rightmost.
- insert: a new leaf where search falls out of the tree.
- successor: min of the right subtree, or the last ancestor where we turned left.
- delete: leaf — remove; 1 child — the child takes its place; 2 children — successor (or predecessor) takes its place.
- cost O(h): log n … n − 1; random order ~1.39 log n on average.

## Traversals

| Traversal | Order | Typical use |
|---|---|---|
| preorder | root, L, R | depths |
| inorder | L, root, R | BST → increasing (inorder theorem) |
| postorder | L, R, root | heights |

- preorder + inorder ⇒ unique tree; a sequence is the inorder of a BST ⇔ strictly increasing.

=== tasks ===

:::task level=2 source="Exercise 8, task 1 (modified)" title="True or false: dictionaries"
We treat a dictionary d as a set; `insert`, `delete` return a new dictionary, and `member(d, e)` tells whether e ∈ d. Which statements are true?

a) member(insert(d, e), e) = true
b) delete(delete(d, e), e) = delete(d, e)
c) insert(delete(d, e), e) = d
d) ¬member(d, e) ⇒ delete(insert(d, e), e) = d
e) insert(insert(d, a), b) = insert(insert(d, b), a)
::hint
A dictionary is a set — it has no order and no duplicates. In c) think about a dictionary that **does not contain** e.
::solution
a) **True** — after inserting, e surely belongs to the dictionary.
b) **True** — deleting a second time changes nothing.
c) **False** — if e ∉ d, the left side contains e while d does not. (True only when e ∈ d.)
d) **True** — we insert a new element and immediately delete it.
e) **True** — in a set the insertion order does not matter (unlike the stack and queue in topic 9!).
:::

:::task level=2 source="Exercise 8, task 2 (modified)" title="Operations on a BST"
For the sequence **{15, 8, 22, 4, 11, 19, 27, 2, 9, 13, 25}**:

a) insert the keys one by one into an initially empty BST (draw the tree),
b) then: search for key 13 (give the path), find the minimum and maximum, find the successor and predecessor of key 11, delete key 8 and then key 15 (use the successor for two children).
::hint
Each new key goes down from the root and becomes a leaf. Look for the successor of 11 in its right subtree.
::solution
**a)** The tree after insertion (height 3):

```tree
15(8(4(2,_),11(9,13)),22(19,27(25,_)))
```

**b)**
- search(13): path **15 → 8 → 11 → 13**,
- minimum: **2** (leftmost: 15 → 8 → 4 → 2), maximum: **27** (15 → 22 → 27),
- successor of 11: 11 has a right subtree {13} → **13**; predecessor of 11: the maximum of the left subtree {9} → **9**,
- delete(8): 8 has two children; successor = min of the right subtree = **9**; 9 takes the place of 8, and the old leaf 9 disappears:

```tree caption="after deleting 8"
15(9(4(2,_),11(_,13)),22(19,27(25,_)))
```

- delete(15): two children; successor = min of the right subtree = **19** (a leaf) → 19 at the root:

```tree caption="after deleting 15"
19(9(4(2,_),11(_,13)),22(_,27(25,_)))
```
:::

:::task level=2 source="Exercise 8, task 3 (modified)" title="Possible search paths"
A BST holds the natural numbers from 1 to 3000 as keys. We search for the key **1777**. Which sequences can be search paths (keys visited in turn)?

a) 2500, 400, 2100, 900, 1990, 1200, 1800, 1777
b) 100, 1650, 2400, 1700, 2200, 1750, 1800, 1777
c) 2900, 1300, 2700, 1400, 2600, 1500, 1790, 1760, 1777
d) 2950, 300, 2800, 350, 1900, 340, 1777
e) 1000, 2000, 1500, 1900, 1400, 1777
::hint
Track the interval (lower bound, upper bound) in which each next key must lie. After a key x > 1777 we go left, so all later keys must be < x; after x < 1777 — all later keys must be > x.
::solution
We track the interval of allowed values:

- **a) possible:** (−∞,∞) → 2500 → (−∞,2500) → 400 → (400,2500) → 2100 → (400,2100) → 900 → (900,2100) → 1990 → (900,1990) → 1200 → (1200,1990) → 1800 → (1200,1800) → 1777 ✓
- **b) possible:** 100 → (100,∞) → 1650 → (1650,∞) → 2400 → (1650,2400) → 1700 → (1700,2400) → 2200 → (1700,2200) → 1750 → (1750,2200) → 1800 → (1750,1800) → 1777 ✓
- **c) possible:** 2900 → 1300 → 2700 → 1400 → 2600 → 1500 → 1790 → (1500,1790) → 1760 → (1760,1790) → 1777 ✓
- **d) impossible:** after 350 (< 1777) all later keys must be > 350, but **340** appears.
- **e) impossible:** after 1500 (< 1777) later keys must be > 1500, but **1400** appears.
:::

:::task level=1 source="Exercise 10 (asd 09 a), task 1 (modified)" title="Three traversals of a tree"
For the tree below write the keys in **prefix**, **infix** and **postfix** order.

```tree
8(3(12,6(1,9)),15(_,10(4,7)))
```
::hint
Careful: this is **not** a BST — don't try to sort. Use the definitions: preorder = root, L, R; inorder = L, root, R; postorder = L, R, root.
::solution
- preorder: **8, 3, 12, 6, 1, 9, 15, 10, 4, 7**
- inorder: **12, 3, 1, 6, 9, 8, 15, 4, 10, 7**
- postorder: **12, 1, 9, 6, 3, 4, 7, 10, 15, 8**
:::

:::task level=2 source="Exercise 10 (asd 09 a), task 2 (modified)" title="Does such a BST exist?"
Is there a BST whose keys in **infix** order form the sequence **2, 5, 3, 8, 9, 4, 10**? And in **prefix** order?
::hint
The inorder of a BST is always increasing. For preorder: the first element is the root; the smaller ones must form a contiguous block right after it, followed only by larger ones.
::solution
- **Inorder: no.** By the inorder theorem the inorder of a BST is increasing, but here 5 > 3.
- **Preorder: no.** Root 2 → all later keys are > 2, so they form the right subtree with root 5. In it, elements < 5 must come **immediately** after 5 (the left subtree), and then only > 5. We have 3 (ok, left), then 8, 9 (right, > 5), but later **4 < 5** appears — impossible in the right subtree of 5.
:::

:::task level=3 source="Exercise 10 (asd 09 a), task 3 (modified)" title="A full tree of height 2"
Let T be a **full** binary tree of height 2 (7 nodes, all levels filled). Which statements are true?

1. If in PreOrder the vertices of T form the sequence 20, 13, 9, 17, 25, 11, 30, then in InOrder they form 9, 13, 17, 20, 11, 25, 30.
2. If in PostOrder the vertices of T form the sequence 9, 17, 13, 11, 30, 25, 20, then in PreOrder they form 20, 13, 9, 17, 25, 11, 30.
3. If in InOrder the vertices of T form the sequence 9, 13, 17, 20, 11, 25, 30, then in PostOrder they form 9, 17, 13, 30, 11, 25, 20.
::hint
In a full tree of height 2 the shape is known, so the positions in each traversal are fixed: preorder = (root, L, LL, LR, R, RL, RR).
::solution
The shape is fixed, so we can rebuild the tree from any traversal:

```tree
20(13(9,17),25(11,30))
```

- preorder: 20, 13, 9, 17, 25, 11, 30,
- inorder: 9, 13, 17, 20, 11, 25, 30,
- postorder: 9, 17, 13, 11, 30, 25, 20.

1. **True.**
2. **True.**
3. **False** — the correct postorder is 9, 17, 13, **11, 30**, 25, 20 (the statement swaps 11 and 30).
:::

:::task level=2 source="own" title="The shape of a BST depends on the order"
Insert into an empty BST the keys 1, 2, 3, 4, 5, 6, 7 in this order, and then in the order 4, 2, 6, 1, 3, 5, 7. What is the height of both trees? How many comparisons does searching for 7 take in each?
::hint
In the first case each new key is larger than all the previous ones.
::solution
- Order 1…7: every key goes right — the tree is a "chain" 1 → 2 → … → 7, **height 6**, searching for 7: **7 comparisons**.
- Order 4, 2, 6, 1, 3, 5, 7: a **full** tree, **height 2**, searching for 7: 4 → 6 → 7, **3 comparisons**.

```tree
4(2(1,3),6(5,7))
```
:::
