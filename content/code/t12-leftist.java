public class LeftistHeap {

    static class Node {
        int key;
        int dist;            // "odl": number of edges on the rightmost path to an external node
        Node left, right;
        Node(int k) { key = k; dist = 1; }
    }

    // Merge of two leftist max-heaps (lecture: "Scal"). Runs along the right paths: O(log n).
    static Node merge(Node q1, Node q2) {
        if (q1 == null) return q2;
        if (q2 == null) return q1;
        if (q1.key < q2.key) { Node p = q1; q1 = q2; q2 = p; }  // q1 keeps the bigger root
        q1.right = merge(q1.right, q2);                         // merge into the right subtree
        if (q1.left == null) {                                  // restore "leftness"
            q1.left = q1.right;
            q1.right = null;
            q1.dist = 1;
        } else {
            if (q1.left.dist < q1.right.dist) { Node p = q1.left; q1.left = q1.right; q1.right = p; }
            q1.dist = q1.right.dist + 1;
        }
        return q1;
    }

    // The other priority-queue operations are expressed by merge.
    static Node insert(Node root, int key) { return merge(root, new Node(key)); }
    static Node deleteMax(Node root)       { return merge(root.left, root.right); }  // root.key = max

    public static void main(String[] args) {
        Node h = null;
        for (int k : new int[]{5, 17, 3, 12, 9}) h = insert(h, k);
        StringBuilder out = new StringBuilder();
        while (h != null) { out.append(h.key).append(' '); h = deleteMax(h); }
        System.out.println(out);                                // 17 12 9 5 3
    }
}
