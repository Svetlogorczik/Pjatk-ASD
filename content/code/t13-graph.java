import java.util.*;

public class GraphSearch {

    private final List<List<Integer>> adj = new ArrayList<>();   // adjacency lists L[v]

    GraphSearch(int n) {
        for (int v = 0; v <= n; v++) adj.add(new ArrayList<>());  // vertices 1..n
    }

    void addEdge(int x, int y) {                                   // undirected edge {x, y}
        adj.get(x).add(y);
        adj.get(y).add(x);
    }

    // DFS - depth first: go as deep as possible, then come back (a STACK - here the call stack).
    void dfs(int v, boolean[] visited, List<Integer> order) {
        visited[v] = true;
        order.add(v);                                              // visit(v)
        for (int w : adj.get(v))
            if (!visited[w]) dfs(w, visited, order);
    }

    // The same DFS with an explicit stack of vertices and "current" positions in their lists
    // (this is the scheme from the lecture).
    List<Integer> dfsIterative(int p) {
        int n = adj.size() - 1;
        boolean[] visited = new boolean[n + 1];
        int[] current = new int[n + 1];                             // index in L[v] of the next edge
        List<Integer> order = new ArrayList<>();
        Deque<Integer> stack = new ArrayDeque<>();
        visited[p] = true; order.add(p);
        stack.push(p);
        while (!stack.isEmpty()) {
            int v = stack.peek();                                  // Front(S)
            if (current[v] == adj.get(v).size()) { stack.pop(); continue; }  // no unvisited edge left
            int w = adj.get(v).get(current[v]++);                  // take the edge (v, w)
            if (!visited[w]) {
                visited[w] = true; order.add(w);
                stack.push(w);
            }
        }
        return order;
    }

    // BFS - breadth first: visit vertices in the order of distance from p (a QUEUE).
    int[] bfs(int p, List<Integer> order) {
        int n = adj.size() - 1;
        int[] dist = new int[n + 1];
        Arrays.fill(dist, -1);                                     // -1 = not visited
        Deque<Integer> queue = new ArrayDeque<>();
        dist[p] = 0; order.add(p);
        queue.addLast(p);
        while (!queue.isEmpty()) {
            int v = queue.pollFirst();
            for (int w : adj.get(v)) {
                if (dist[w] == -1) {
                    dist[w] = dist[v] + 1;                         // one edge further than v
                    order.add(w);
                    queue.addLast(w);
                }
            }
        }
        return dist;
    }

    public static void main(String[] args) {
        GraphSearch g = new GraphSearch(6);
        int[][] edges = {{1, 2}, {1, 3}, {2, 4}, {3, 4}, {4, 5}, {5, 6}};
        for (int[] e : edges) g.addEdge(e[0], e[1]);
        List<Integer> d = new ArrayList<>();
        g.dfs(1, new boolean[7], d);
        System.out.println("DFS " + d + "  iterative " + g.dfsIterative(1));   // [1, 2, 4, 3, 5, 6]
        List<Integer> b = new ArrayList<>();
        int[] dist = g.bfs(1, b);
        System.out.println("BFS " + b + "  dist " + Arrays.toString(dist));   // [1, 2, 3, 4, 5, 6]
    }
}
