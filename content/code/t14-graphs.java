import java.util.*;

public class WeightedGraphs {

    record Edge(int u, int v, int w) {}

    final int n;                                   // vertices 0..n-1
    final List<List<Edge>> adj = new ArrayList<>();
    final List<Edge> edges = new ArrayList<>();

    WeightedGraphs(int n) {
        this.n = n;
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
    }

    void addEdge(int u, int v, int w) {            // undirected edge with weight w >= 0
        Edge e = new Edge(u, v, w);
        edges.add(e);
        adj.get(u).add(e);
        adj.get(v).add(new Edge(v, u, w));
    }

    // DIJKSTRA: d[v] = length of the shortest path s -> v, p[v] = previous vertex on that path.
    // Greedy step: take the not-yet-final vertex with the smallest d and make it final.
    int[] dijkstra(int s, int[] p) {
        int[] d = new int[n];
        Arrays.fill(d, Integer.MAX_VALUE);
        Arrays.fill(p, -1);
        boolean[] done = new boolean[n];
        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(x -> x[1]));
        d[s] = 0;
        pq.add(new int[]{s, 0});
        while (!pq.isEmpty()) {
            int u = pq.poll()[0];
            if (done[u]) continue;                 // an outdated queue entry
            done[u] = true;
            for (Edge e : adj.get(u)) {
                if (!done[e.v()] && d[u] + e.w() < d[e.v()]) {    // relaxation
                    d[e.v()] = d[u] + e.w();
                    p[e.v()] = u;
                    pq.add(new int[]{e.v(), d[e.v()]});
                }
            }
        }
        return d;
    }

    // PRIM: grow one tree from s; always add the cheapest edge leaving the tree.
    int prim(int s, List<Edge> tree) {
        boolean[] in = new boolean[n];
        PriorityQueue<Edge> pq = new PriorityQueue<>(Comparator.comparingInt(Edge::w));
        in[s] = true;
        pq.addAll(adj.get(s));
        int total = 0;
        while (!pq.isEmpty() && tree.size() < n - 1) {
            Edge e = pq.poll();
            if (in[e.v()]) continue;               // both ends already in the tree
            in[e.v()] = true;
            tree.add(e);
            total += e.w();
            for (Edge f : adj.get(e.v())) if (!in[f.v()]) pq.add(f);
        }
        return total;
    }

    // KRUSKAL: edges from the lightest; take an edge if it joins two different trees (Find-Union).
    int kruskal(List<Edge> tree) {
        int[] parent = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
        List<Edge> sorted = new ArrayList<>(edges);
        sorted.sort(Comparator.comparingInt(Edge::w));
        int total = 0;
        for (Edge e : sorted) {
            int a = find(parent, e.u()), b = find(parent, e.v());
            if (a != b) {                          // no cycle
                parent[a] = b;                     // union
                tree.add(e);
                total += e.w();
            }
        }
        return total;
    }

    static int find(int[] parent, int x) {
        while (parent[x] != x) { parent[x] = parent[parent[x]]; x = parent[x]; }   // path halving
        return x;
    }

    public static void main(String[] args) {
        // A..H = 0..7
        WeightedGraphs g = new WeightedGraphs(8);
        int[][] es = {{0,1,4},{0,2,2},{1,2,5},{1,3,3},{2,4,6},{3,4,1},{3,5,6},{4,5,2},
                      {4,6,7},{5,7,3},{6,7,2},{2,6,9},{1,5,8}};
        for (int[] e : es) g.addEdge(e[0], e[1], e[2]);
        int[] p = new int[8];
        System.out.println("Dijkstra from G: " + Arrays.toString(g.dijkstra(6, p)));  // [11, 11, 9, 8, 7, 5, 0, 2]
        System.out.println("Prim from E: " + g.prim(4, new ArrayList<>()));           // 17
        System.out.println("Kruskal: " + g.kruskal(new ArrayList<>()));               // 17
    }
}
