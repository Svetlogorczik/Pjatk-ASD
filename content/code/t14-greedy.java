import java.util.*;

public class Greedy {

    // 1) Activity selection: sort by finishing time, take every activity that fits.
    static List<int[]> selectActivities(int[][] acts) {          // acts[i] = {start, end}, [start, end)
        int[][] a = acts.clone();
        Arrays.sort(a, Comparator.comparingInt(x -> x[1]));       // earliest end first
        List<int[]> chosen = new ArrayList<>();
        int lastEnd = Integer.MIN_VALUE;
        for (int[] x : a) {
            if (x[0] >= lastEnd) {                                // does not collide with the chosen ones
                chosen.add(x);
                lastEnd = x[1];
            }
        }
        return chosen;
    }

    // 2) Fractional knapsack: take items by decreasing value/weight ratio (a part of the last one).
    static double fractionalKnapsack(double[] w, double[] v, double capacity) {
        Integer[] idx = new Integer[w.length];
        for (int i = 0; i < idx.length; i++) idx[i] = i;
        Arrays.sort(idx, (i, j) -> Double.compare(v[j] / w[j], v[i] / w[i]));
        double total = 0;
        for (int i : idx) {
            if (capacity <= 0) break;
            double take = Math.min(w[i], capacity);
            total += v[i] * take / w[i];
            capacity -= take;
        }
        return total;
    }

    // 3) Huffman codes: repeatedly merge the two rarest trees (priority queue = min-heap).
    static class HNode {
        final int freq; final Character sym; final HNode left, right;
        HNode(int f, Character s, HNode l, HNode r) { freq = f; sym = s; left = l; right = r; }
    }

    static Map<Character, String> huffman(Map<Character, Integer> freq) {
        PriorityQueue<HNode> pq = new PriorityQueue<>(Comparator.comparingInt(n -> n.freq));
        freq.forEach((s, f) -> pq.add(new HNode(f, s, null, null)));
        while (pq.size() > 1) {
            HNode a = pq.poll(), b = pq.poll();                  // the two rarest
            pq.add(new HNode(a.freq + b.freq, null, a, b));      // hang them under a new node
        }
        Map<Character, String> codes = new TreeMap<>();
        assign(pq.poll(), "", codes);
        return codes;
    }

    static void assign(HNode n, String code, Map<Character, String> codes) {
        if (n.sym != null) { codes.put(n.sym, code.isEmpty() ? "0" : code); return; }
        assign(n.left, code + "0", codes);                        // left edge = 0
        assign(n.right, code + "1", codes);                       // right edge = 1
    }

    public static void main(String[] args) {
        int[][] acts = {{1, 4}, {3, 5}, {0, 6}, {5, 7}, {6, 9}, {8, 10}};
        for (int[] a : selectActivities(acts)) System.out.print(Arrays.toString(a) + " ");
        System.out.println();                                     // [1, 4] [5, 7] [8, 10]

        System.out.println(fractionalKnapsack(new double[]{10, 20, 30}, new double[]{50, 80, 105}, 40)); // 165.0

        Map<Character, Integer> f = new LinkedHashMap<>();
        f.put('A', 1); f.put('B', 1); f.put('C', 1); f.put('D', 2); f.put('E', 3);  // in eighths
        System.out.println(huffman(f));   // code lengths: A, B - 3 bits; C, D, E - 2 bits (exact bits may differ on ties)
    }
}
