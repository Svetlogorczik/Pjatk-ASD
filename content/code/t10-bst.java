import java.util.ArrayList;
import java.util.List;

public class BST {

    static class TreeNode {
        int key;
        TreeNode left, right;
        TreeNode(int k) { key = k; }
    }

    private TreeNode root;

    // SEARCH: go left when the key is smaller, right when it is bigger. O(h).
    TreeNode search(int key) {
        TreeNode v = root;
        while (v != null && v.key != key) v = key < v.key ? v.left : v.right;
        return v;
    }

    // INSERT: find the place where the search would fail and attach a new leaf there. O(h).
    void insert(int key) { root = insert(root, key); }
    private TreeNode insert(TreeNode v, int key) {
        if (v == null) return new TreeNode(key);
        if (key < v.key) v.left = insert(v.left, key);
        else if (key > v.key) v.right = insert(v.right, key);
        return v;                                    // equal key: already in the dictionary
    }

    // MIN / MAX: the leftmost / the rightmost node.
    static TreeNode min(TreeNode v) { while (v.left != null) v = v.left; return v; }
    static TreeNode max(TreeNode v) { while (v.right != null) v = v.right; return v; }

    // SUCCESSOR: the smallest key greater than "key" (or null).
    TreeNode successor(int key) {
        TreeNode v = root, candidate = null;
        while (v != null) {
            if (key < v.key) { candidate = v; v = v.left; }   // v may be the successor
            else v = v.right;
        }
        return candidate;
    }

    // DELETE: leaf -> remove; one child -> the child takes the place;
    // two children -> copy the successor (min of the right subtree) and delete it there.
    void delete(int key) { root = delete(root, key); }
    private TreeNode delete(TreeNode v, int key) {
        if (v == null) return null;
        if (key < v.key) v.left = delete(v.left, key);
        else if (key > v.key) v.right = delete(v.right, key);
        else {
            if (v.left == null) return v.right;
            if (v.right == null) return v.left;
            TreeNode s = min(v.right);
            v.key = s.key;
            v.right = delete(v.right, s.key);
        }
        return v;
    }

    // Traversals.
    static void preorder(TreeNode v, List<Integer> out) {
        if (v == null) return;
        out.add(v.key); preorder(v.left, out); preorder(v.right, out);
    }
    static void inorder(TreeNode v, List<Integer> out) {       // sorted order for a BST
        if (v == null) return;
        inorder(v.left, out); out.add(v.key); inorder(v.right, out);
    }
    static void postorder(TreeNode v, List<Integer> out) {
        if (v == null) return;
        postorder(v.left, out); postorder(v.right, out); out.add(v.key);
    }
    static int height(TreeNode v) {                              // postorder: children first
        if (v == null) return -1;                                // empty tree has height -1
        return 1 + Math.max(height(v.left), height(v.right));
    }

    public static void main(String[] args) {
        BST t = new BST();
        for (int k : new int[]{50, 30, 70, 20, 40, 60, 80}) t.insert(k);
        List<Integer> in = new ArrayList<>();
        inorder(t.root, in);
        System.out.println("inorder = " + in);                          // sorted
        System.out.println("successor(40) = " + t.successor(40).key);   // 50
        t.delete(30);
        List<Integer> pre = new ArrayList<>();
        preorder(t.root, pre);
        System.out.println("preorder after delete(30) = " + pre + ", height = " + height(t.root));
    }
}
