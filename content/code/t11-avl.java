public class AVL {

    static class Node {
        int key, height;                       // height of the subtree rooted here (leaf = 0)
        Node left, right;
        Node(int k) { key = k; }
    }

    static int h(Node v) { return v == null ? -1 : v.height; }
    static int bf(Node v) { return h(v.left) - h(v.right); }          // balance factor
    static void update(Node v) { v.height = 1 + Math.max(h(v.left), h(v.right)); }

    //      y              x
    //     / \            / \
    //    x   C   ==>    A   y          right rotation (fixes the LL case)
    //   / \                / \
    //  A   B              B   C
    static Node rotateRight(Node y) {
        Node x = y.left;
        y.left = x.right;
        x.right = y;
        update(y); update(x);
        return x;
    }

    static Node rotateLeft(Node x) {                                    // mirror image (RR case)
        Node y = x.right;
        x.right = y.left;
        y.left = x;
        update(x); update(y);
        return y;
    }

    // Restores the AVL condition in v (|bf| <= 1), assuming both subtrees are AVL trees.
    static Node balance(Node v) {
        update(v);
        if (bf(v) == 2) {                                   // too high on the left
            if (bf(v.left) < 0) v.left = rotateLeft(v.left); // LR: first turn it into LL
            return rotateRight(v);                          // LL
        }
        if (bf(v) == -2) {                                  // too high on the right
            if (bf(v.right) > 0) v.right = rotateRight(v.right); // RL: first turn it into RR
            return rotateLeft(v);                           // RR
        }
        return v;
    }

    static Node insert(Node v, int key) {
        if (v == null) return new Node(key);
        if (key < v.key) v.left = insert(v.left, key);
        else if (key > v.key) v.right = insert(v.right, key);
        return balance(v);                                  // on the way back up
    }

    static Node delete(Node v, int key) {
        if (v == null) return null;
        if (key < v.key) v.left = delete(v.left, key);
        else if (key > v.key) v.right = delete(v.right, key);
        else {
            if (v.left == null) return v.right;
            if (v.right == null) return v.left;
            Node s = v.right;
            while (s.left != null) s = s.left;              // successor
            v.key = s.key;
            v.right = delete(v.right, s.key);
        }
        return balance(v);
    }

    static String show(Node v) {                            // e.g. 20(10,30)
        if (v == null) return "_";
        if (v.left == null && v.right == null) return "" + v.key;
        return v.key + "(" + show(v.left) + "," + show(v.right) + ")";
    }

    public static void main(String[] args) {
        Node root = null;
        for (int k : new int[]{1, 2, 3, 4, 5, 6, 7}) root = insert(root, k);
        System.out.println(show(root));   // 4(2(1,3),6(5,7)) - balanced, although the input was sorted
    }
}
