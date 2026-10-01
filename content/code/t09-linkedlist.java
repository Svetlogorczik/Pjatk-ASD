public class DoubleLinkedList {

    // Node of a doubly linked list.
    static class Node {
        Object elem;
        Node next, prev;
        Node(Object e, Node n, Node p) { elem = e; next = n; prev = p; }
    }

    // Two sentinels ("atrapy"): first and last never hold data, so inserting and deleting
    // never needs special cases for an empty list or for the ends.
    private final Node first, last;
    private int size = 0;

    DoubleLinkedList() {
        first = new Node(null, null, null);
        last = new Node(null, null, first);
        first.next = last;
    }

    boolean isEmpty() { return size == 0; }
    int size() { return size; }

    // Push: insert at the front.  Inject: insert at the end.
    void push(Object x)   { insertAfter(first, x); }
    void inject(Object x) { insertAfter(last.prev, x); }

    // Pop: remove from the front.  Eject: remove from the end.
    Object pop()   { if (isEmpty()) throw new IllegalStateException(); return unlink(first.next); }
    Object eject() { if (isEmpty()) throw new IllegalStateException(); return unlink(last.prev); }

    Object front() { return isEmpty() ? null : first.next.elem; }
    Object rear()  { return isEmpty() ? null : last.prev.elem; }

    // Retrieve(p): element at position p (1..size), or null.
    Object retrieve(int p) {
        Node v = nodeAt(p);
        return v == null ? null : v.elem;
    }

    // Insert(x, p): x becomes the element at position p (1..size+1).
    void insert(Object x, int p) {
        if (p < 1 || p > size + 1) throw new IndexOutOfBoundsException();
        Node before = (p == 1) ? first : nodeAt(p - 1);
        insertAfter(before, x);
    }

    // Delete(p): removes the element at position p.
    Object delete(int p) {
        Node v = nodeAt(p);
        if (v == null) throw new IndexOutOfBoundsException();
        return unlink(v);
    }

    private Node nodeAt(int p) {                      // walk from the front: O(p)
        if (p < 1 || p > size) return null;
        Node v = first.next;
        for (int i = 1; i < p; i++) v = v.next;
        return v;
    }

    private void insertAfter(Node v, Object x) {      // O(1): only 4 references change
        Node w = new Node(x, v.next, v);
        v.next.prev = w;
        v.next = w;
        size++;
    }

    private Object unlink(Node v) {                   // O(1)
        v.prev.next = v.next;
        v.next.prev = v.prev;
        size--;
        return v.elem;
    }

    public static void main(String[] args) {
        DoubleLinkedList l = new DoubleLinkedList();
        l.inject("B"); l.inject("C"); l.push("A");   // A B C
        l.insert("X", 2);                            // A X B C
        System.out.println(l.retrieve(2) + " " + l.delete(3) + " " + l.eject() + " " + l.size()); // X B C 2
    }
}
