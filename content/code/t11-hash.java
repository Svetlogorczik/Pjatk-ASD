import java.util.LinkedList;

public class HashTables {

    // 1) Chaining: every cell holds a list of keys with the same hash value.
    static class ChainedTable {
        private final LinkedList<Integer>[] table;
        @SuppressWarnings("unchecked")
        ChainedTable(int m) {
            table = new LinkedList[m];
            for (int i = 0; i < m; i++) table[i] = new LinkedList<>();
        }
        private int h(int k) { return Math.floorMod(k, table.length); }
        void insert(int k)     { if (!search(k)) table[h(k)].add(k); }
        boolean search(int k)  { return table[h(k)].contains(k); }
        void delete(int k)     { table[h(k)].remove(Integer.valueOf(k)); }
    }

    // 2) Open addressing with linear probing: on a collision try the next cell (cyclically).
    static class LinearProbingTable {
        private static final int EMPTY = Integer.MIN_VALUE, DELETED = Integer.MIN_VALUE + 1;
        private final int[] table;
        LinearProbingTable(int m) {
            table = new int[m];
            java.util.Arrays.fill(table, EMPTY);
        }
        private int h(int k) { return Math.floorMod(k, table.length); }

        boolean insert(int k) {
            if (find(k) >= 0) return false;                   // already there
            int m = table.length;
            for (int i = 0; i < m; i++) {
                int j = (h(k) + i) % m;                        // h(k, i) = (h(k) + i) mod m
                if (table[j] == EMPTY || table[j] == DELETED) { table[j] = k; return true; }
            }
            return false;                                     // the table is full
        }

        int find(int k) {                                     // index of k or -1
            int m = table.length;
            for (int i = 0; i < m; i++) {
                int j = (h(k) + i) % m;
                if (table[j] == EMPTY) return -1;             // a truly empty cell ends the search
                if (table[j] == k) return j;
            }
            return -1;
        }

        void delete(int k) {
            int j = find(k);
            if (j >= 0) table[j] = DELETED;                   // a marker, NOT "empty"!
        }
    }

    public static void main(String[] args) {
        LinearProbingTable t = new LinearProbingTable(13);
        for (int k : new int[]{18, 41, 22, 44, 59, 32, 31, 73}) t.insert(k);
        System.out.println(t.find(31) + " " + t.find(73) + " " + t.find(99));   // 10 11 -1
        ChainedTable c = new ChainedTable(13);
        for (int k : new int[]{18, 44, 31}) c.insert(k);                       // all in cell 5
        System.out.println(c.search(44) + " " + c.search(57));                  // true false
    }
}
