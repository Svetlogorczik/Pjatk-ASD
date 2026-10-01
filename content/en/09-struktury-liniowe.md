---
id: t09
num: 9
type: topic
title: Linear structures — stack, queue, lists
short: Stack, queue, lists
desc: Abstract data types, the stack (LIFO) and the queue (FIFO), axioms of their operations, doubly linked lists with sentinels, reverse Polish notation, the sieve of Eratosthenes and merge-sorting lists with a queue.
sources: asd6.pdf (stack); asd7.pdf (lists); Wyklady 2009/asd 09 wyklad_7.pdf (list, stack, queue, expressions)
exercises: asd 07.pdf (tasks 1–3)
---

## Abstract data type

Lecture asd6 introduces an important idea: **first define what a structure can do** (which operations it has and how they behave), and **only then**, separately, how to implement it.

:::def
An **abstract data type** (ADT) is a set of values together with operations on them, described **without** talking about the implementation. The efficiency of programs using the structure depends on the quality of the implementation — but a program using the ADT does not need to know the details.
:::

:::analogy
A TV remote has the buttons "louder", "quieter", "next channel". You don't need to know what's inside to use it. The buttons are the **interface** (the ADT), the electronics inside is the **implementation**.
:::

## Stack (LIFO)

:::def
A **stack** S is a structure with the operations:
- `push(x)` — put x on top of the stack,
- `pop()` — remove and return the element inserted **most recently**,
- `top()` — return the most recently inserted element **without** removing it,
- `size()` — number of elements,
- `isEmpty()` — TRUE if and only if the stack is empty.

Rule: **last in — first out** (LIFO).
:::

:::analogy
A pile of plates in a cupboard: you put a plate on top and always take the one from the top. You cannot take the bottom plate without removing all the ones above it.
:::

**Where are stacks used?**

- **function calls** and recursion (topic 6) — each call pushes its variables on the stack,
- QuickSort without recursion (topic 7),
- evaluating expressions (below),
- depth-first graph search — DFS (topic 13),
- the "Undo" button in an editor.

**Implementations:** in an array (index of the top) or in a linked list (top = first node). In both **all operations are O(1)**.

## Queue (FIFO)

:::def
A **queue** Q is a structure with the operations:
- `inject(x)` (in, enqueue) — put x at the **end** of the queue,
- `front()` (first) — return the element at the **front**,
- `pop()` (out, dequeue) — remove the element at the **front**,
- `isEmpty()`.

Rule: **first in — first out** (FIFO).
:::

:::analogy
A queue in a shop: newcomers join at the end, and the person who has waited longest (at the front) is served.
:::

**Where are queues used?** Breadth-first graph search — BFS (topic 13), buffers (printer, keyboard), simulations, Huffman's algorithm for sorted data (topic 14).

**Implementations:** a list with references to the head and the tail, or a **circular array** (the head index "wraps around" modulo the array size). All operations **O(1)**.

```java title="StackQueue.java — stack, circular queue and RPN"
@include t09-stack-queue.java
```

## Stack and queue axioms {own}

:::own
Class tasks ask "which statements are true in the structure of stacks / queues". Below is the site author's explanation of how to think about it (the lecture sets did not cover it directly).
:::

In this notation the operations are treated as **functions returning a new value** (we do not modify the object in place):

- stack: `push(s, e)` — a new stack, `pop(s)` — the stack without its top, `top(s)` — an element, `empty(s)` — true/false,
- queue: `in(q, e)` — a new queue with e at the end, `out(q)` — the queue without its first element, `first(q)` — the first element, `empty(q)`.

**Basic stack laws:**
- `top(push(s, e)) = e`,
- `pop(push(s, e)) = s`,
- `¬empty(s) ⇒ push(pop(s), top(s)) = s` (take it off and put it back — nothing changes),
- `empty(push(s, e)) = false`.

**Basic queue laws:**
- `empty(q) ⇒ first(in(q, e)) = e` (in an empty queue the new element is first),
- `¬empty(q) ⇒ first(in(q, e)) = first(q)` (adding at the end does not change the front),
- `empty(q) ⇒ out(in(q, e)) = q`,
- `¬empty(q) ⇒ out(in(q, e)) = in(out(q), e)` (adding at the end and removing from the front can be swapped).

:::tip
When checking a statement, take a **small concrete example** (e.g. the stack [1, 2] with top 2) and compute both sides. If even one example gives different results — the statement is false. Remember assumptions like `¬empty(s)` — without them `pop` and `top` make no sense.
:::

## Arithmetic expressions and reverse Polish notation

From the 2009 slides: a stack is great for **evaluating expressions**. It is easiest when the expression is written in **reverse Polish notation** (RPN) — the operator comes **after** its arguments: instead of `(2 + 3) * 4` we write `2 3 + 4 *`. No brackets needed!

**Algorithm:** read symbols from the left:
- a number → `push` it on the stack,
- an operator → pop two numbers (first the right argument b, then the left a), compute `a op b`, `push` the result.

At the end the stack holds one number — the result.

| symbol | stack after the step |
|---|---|
| 2 | 2 |
| 3 | 2 3 |
| + | 5 |
| 4 | 5 4 |
| * | 20 |

:::info
Converting the usual notation (with brackets) to RPN is also done with a stack — the so-called shunting-yard algorithm (Dijkstra's). This is a note from the site author: the slides cover only the evaluation.
:::

## Lists

:::def
A **list** is a finite sequence of elements L = [x₁, x₂, …, xₙ]. x₁ and xₙ are the **ends** of the list (left/head and right/tail), |L| = n is the **length**; the empty list: L = []. Each element xᵢ has a **key** kᵢ that identifies it.
:::

Basic operations (lecture asd7):

| Operation | Meaning |
|---|---|
| `Locate(k, L)` | find the element with key k (or NULL) |
| `Retrieve(p, L)` | return the element at position p (NULL when p > \|L\|) |
| `Insert(x, p, L)` | insert x at position p (undefined for p > \|L\| + 1) |
| `Delete(p, L)` | remove the p-th element |

Special cases at the **ends** of the list:

| at the front | at the end |
|---|---|
| `Push(x, L)` — insert | `Inject(x, L)` — insert |
| `Pop(L)` — remove | `Eject(L)` — remove |
| `Front(L)` — return | `Rear(L)` — return |

- a list with the operations **Inject, Front, Pop** = a **queue**,
- a list with the operations **Front, Push, Pop** = a **stack**.

### Implementation: a doubly linked list with sentinels

Each **node** stores an element, a key and references to the **next** and **previous** node. The lecture uses a clever trick: at the beginning and at the end of the list there are two **empty nodes — sentinels** (*atrapy*). Thanks to them inserting and deleting always look the same — no special handling of the empty list or of the ends.

```text title="The list [A, X, B] with sentinels"
sentinel ⇄ A ⇄ X ⇄ B ⇄ sentinel
  first                   last
```

Inserting after a node v means changing **four references** — O(1). Reaching the p-th position, however, requires walking through p nodes — O(p).

```java title="DoubleLinkedList.java (a simplified version of the lecture's class)"
@include t09-linkedlist.java
```

### List or array? {own}

:::own
A comparison prepared by the site author.
:::

| Operation | Array | Doubly linked list |
|---|---|---|
| access to the i-th element | **O(1)** | O(i) |
| insert/delete at the front | O(n) (shifting) | **O(1)** |
| insert/delete at the end | O(1) (amortised) | **O(1)** |
| insert in the middle (given the node) | O(n) | **O(1)** |
| search by key | O(n) (O(log n) if sorted) | O(n) |
| extra memory | none | 2 references per element |

## Two list algorithms from the lecture

### The sieve of Eratosthenes

Create the list of numbers 2, 3, …, n. The first number on the list is always **prime** (no smaller number divides it, because all multiples of smaller ones were already removed). Record it and **remove all its multiples from the list**. Repeat until the list is empty.

```text title="n = 20"
start: 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20
p = 2: 3 5 7 9 11 13 15 17 19
p = 3: 5 7 11 13 17 19
p = 5: 7 11 13 17 19
… the rest are prime: 7 11 13 17 19
primes: 2 3 5 7 11 13 17 19
```

### Merge-sorting a list with a queue

An interesting variant of MergeSort without recursion: put one-element lists into a **queue**. While the queue has more than one list: **take two from the front, merge them and put the result at the end**. Each element takes part in O(log n) merges, so in total **O(n log n)**.

```java title="ListAlgorithms.java"
@include t09-list-algorithms.java
```

=== summary ===

## ADT

First the operations and their behaviour, then the implementation.

## Stack (LIFO)

- `push, pop, top, size, isEmpty` — all **O(1)** (array or list).
- uses: recursion, QuickSort without recursion, RPN, DFS, "undo".
- laws: top(push(s,e)) = e; pop(push(s,e)) = s; ¬empty(s) ⇒ push(pop(s), top(s)) = s.

## Queue (FIFO)

- `inject (in), front (first), pop (out), isEmpty` — **O(1)** (list with head and tail, or circular array).
- uses: BFS, buffers, Huffman.
- laws: empty(q) ⇒ first(in(q,e)) = e; ¬empty(q) ⇒ first(in(q,e)) = first(q); ¬empty(q) ⇒ out(in(q,e)) = in(out(q),e).

## RPN

number → push; operator → b = pop, a = pop, push(a op b). `2 3 + 4 *` = 20.

## Lists

- Locate, Retrieve, Insert, Delete; ends: Push/Pop/Front and Inject/Eject/Rear.
- Inject+Front+Pop = queue; Front+Push+Pop = stack.
- doubly linked list with **sentinels**: insert/delete O(1), access to position p — O(p).
- sieve of Eratosthenes on a list; list MergeSort with a queue — O(n log n).

=== tasks ===

:::task level=2 source="Exercise 7, task 1 (modified)" title="True or false: stacks"
Which statements are true in the structure of stacks (s — any stack, e, a, b — elements)?

a) ¬empty(s) ⇒ push(pop(s), top(s)) = s
b) top(push(s, e)) = e
c) ¬empty(s) ⇒ pop(push(pop(s), e)) = pop(s)
d) push(push(s, a), b) = push(push(s, b), a)
::hint
Take the example s = [1, 2] (top 2) and compute both sides. In d) try a = 5, b = 7.
::solution
a) **True.** pop(s) = [1], top(s) = 2, push([1], 2) = [1, 2] = s.
b) **True.** The pushed element is on top.
c) **True.** push(pop(s), e) puts e on pop(s), and pop removes it again — pop(s) remains.
d) **False** (in general). push(push(s,5),7) has top 7, while push(push(s,7),5) — top 5. Equality holds only for a = b.
:::

:::task level=2 source="Exercise 7, task 1 (modified)" title="True or false: queues"
Which statements are true in the structure of queues (q — any queue)?

a) ¬empty(q) ⇒ first(in(q, e)) = first(q)
b) empty(q) ⇒ first(in(q, e)) = e
c) ¬empty(q) ⇒ in(out(q), first(q)) = q
d) in(in(q, a), b) = in(in(q, b), a)
::hint
In c) take q = [1, 2, 3] (1 at the front). What happens to the first element?
::solution
a) **True.** Adding at the end does not change the front of a non-empty queue.
b) **True.** In an empty queue the new element is also the first.
c) **False** (in general). For q = [1, 2, 3]: out(q) = [2, 3], in([2, 3], 1) = [2, 3, 1] ≠ q. This "rotates" the queue; equality holds e.g. for a one-element queue.
d) **False** (in general). The order of adding matters: [..., a, b] ≠ [..., b, a] for a ≠ b.
:::

:::task level=2 source="Exercise 7, task 2 (modified)" title="A sequence of queue operations"
Queue Q was built by inserting in turn **7, 3, 12, 5, 9, 1, 14, 6, 10, 2** (7 is at the front). Then the following were performed:

1. IN(Q, FIRST(Q))
2. OUT(Q)
3. OUT(Q)
4. IN(Q, 20)
5. IN(Q, FIRST(Q))
6. OUT(Q)

Which statements are true?
- FIRST(Q) after all operations equals 5.
- The maximum length of the queue during the process was 11.
- The final length of the queue is 9.
::hint
Write down the queue after every operation. FIRST does not change the queue, it only returns an element.
::solution
| step | queue (front on the left) | length |
|---|---|---|
| start | 7 3 12 5 9 1 14 6 10 2 | 10 |
| 1. IN(Q, 7) | 7 3 12 5 9 1 14 6 10 2 7 | 11 |
| 2. OUT | 3 12 5 9 1 14 6 10 2 7 | 10 |
| 3. OUT | 12 5 9 1 14 6 10 2 7 | 9 |
| 4. IN(Q, 20) | 12 5 9 1 14 6 10 2 7 20 | 10 |
| 5. IN(Q, 12) | 12 5 9 1 14 6 10 2 7 20 12 | 11 |
| 6. OUT | 5 9 1 14 6 10 2 7 20 12 | 10 |

- FIRST(Q) = 5 → **true**,
- maximum length 11 → **true**,
- final length 9 → **false** (it is 10).
:::

:::task level=2 source="Exercise 7, task 3 (modified)" title="A sequence of stack operations"
Stack S was built by pushing in turn **4, 11, 6, 2, 9, 15, 3, 8** (8 is on top). Then the following were performed:

1. PUSH(S, TOP(S))
2. POP(S)
3. POP(S)
4. PUSH(S, 17)
5. PUSH(S, TOP(S))
6. POP(S)

Which statements are true?
- The final height of the stack is 8.
- TOP(S) at the end equals 3.
- The maximum height during the process was 9.
::hint
Write down the stack after every operation (top on the right).
::solution
| step | stack (top on the right) | height |
|---|---|---|
| start | 4 11 6 2 9 15 3 8 | 8 |
| 1. PUSH(8) | 4 11 6 2 9 15 3 8 8 | 9 |
| 2. POP | 4 11 6 2 9 15 3 8 | 8 |
| 3. POP | 4 11 6 2 9 15 3 | 7 |
| 4. PUSH(17) | 4 11 6 2 9 15 3 17 | 8 |
| 5. PUSH(17) | 4 11 6 2 9 15 3 17 17 | 9 |
| 6. POP | 4 11 6 2 9 15 3 17 | 8 |

- height 8 → **true**,
- TOP = 3 → **false** (TOP = 17),
- maximum height 9 → **true**.
:::

:::task level=1 source="own" title="Reverse Polish notation"
Evaluate the RPN expression **6 2 3 + * 4 2 / −**. Show the stack after each symbol. What does the expression look like in ordinary notation?
::hint
For an operator pop b first (the top), then a, and compute a op b — the order matters for − and /.
::solution
| symbol | stack |
|---|---|
| 6 | 6 |
| 2 | 6 2 |
| 3 | 6 2 3 |
| + | 6 5 |
| * | 30 |
| 4 | 30 4 |
| 2 | 30 4 2 |
| / | 30 2 |
| − | 28 |

Result: **28**. Ordinary notation: **6 · (2 + 3) − 4 / 2**.
:::

:::task level=2 source="own" title="Merge-sorting a list with a queue"
Run the "MergeSort with a queue" algorithm on **[5, 2, 8, 1, 9, 3]**. Write the queue contents after each merge. How many merges were performed?
::hint
At the start the queue holds 6 one-element lists. You always take two from the front and put the result at the end.
::solution
| step | merged | queue after the step |
|---|---|---|
| start | | [5] [2] [8] [1] [9] [3] |
| 1 | [5] + [2] | [8] [1] [9] [3] [2,5] |
| 2 | [8] + [1] | [9] [3] [2,5] [1,8] |
| 3 | [9] + [3] | [2,5] [1,8] [3,9] |
| 4 | [2,5] + [1,8] | [3,9] [1,2,5,8] |
| 5 | [3,9] + [1,2,5,8] | [1,2,3,5,8,9] |

**5 merges** (always n − 1, since each merge reduces the number of lists by 1).
:::

:::task level=3 source="own" title="A queue from two stacks"
Design a queue (inject, front, pop) using **only two stacks**. Justify that each operation costs O(1) **on average** (summed over many operations).
::hint
One stack "receives" new elements, the other "hands them out". When the handing-out stack is empty, move everything from the receiving one into it — the order gets reversed.
::solution
Stacks `IN` and `OUT`:
- `inject(x)`: `IN.push(x)`,
- `pop()` / `front()`: if `OUT` is empty — move `IN.pop()` to `OUT.push(...)` until `IN` is empty; then `OUT.pop()` / `OUT.top()`.

Moving reverses the order, so the oldest element is on top of `OUT` — FIFO holds. Every element is pushed onto IN **once**, moved **once** and popped from OUT **once** — 3 stack operations per element, so n queue operations cost O(n), i.e. **O(1) amortised** per operation (a single operation may take long, but rarely).
:::
