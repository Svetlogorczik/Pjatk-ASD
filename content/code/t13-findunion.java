public class FindUnion {

    private final int[] parent, rank;

    // Each element 1..n starts in its own one-element set (it is its own root).
    FindUnion(int n) {
        parent = new int[n + 1];
        rank = new int[n + 1];
        for (int i = 1; i <= n; i++) parent[i] = i;
    }

    // FIND with path compression: every node on the way is attached directly to the root.
    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }

    // UNION with balancing (by rank = upper bound of the tree height):
    // the lower tree is attached under the root of the higher one.
    boolean union(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return false;                  // already in the same set
        if (rank[ra] < rank[rb]) { int t = ra; ra = rb; rb = t; }
        parent[rb] = ra;
        if (rank[ra] == rank[rb]) rank[ra]++;
        return true;
    }

    public static void main(String[] args) {
        FindUnion fu = new FindUnion(8);
        int[][] ops = {{1, 2}, {3, 4}, {5, 6}, {7, 8}, {1, 3}, {5, 7}, {1, 5}};
        for (int[] op : ops) fu.union(op[0], op[1]);
        System.out.println(fu.find(8) + " " + fu.find(4));          // 1 1 - one set
        System.out.println(java.util.Arrays.toString(fu.parent));  // after compressing the path of 8
    }
}
