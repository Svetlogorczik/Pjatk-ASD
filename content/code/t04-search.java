public class Search {

    // Sequential search with a sentinel. The array must have one free slot at index n.
    // Returns the index of a in l[0..n-1], or n if a is not there.
    static int sequential(int[] l, int n, int a) {
        l[n] = a;                    // sentinel: the loop surely stops
        int i = 0;
        while (l[i] != a) i++;
        return i;
    }

    // Binary search (lecture version "SzukajBin"): l[0..n-1] sorted non-decreasingly, n > 0.
    // Returns the index of the FIRST occurrence of a, or n if a is not there.
    static int binary(int[] l, int n, int a) {
        int left = 0, right = n - 1;
        while (left < right) {
            // Invariant: if a is in l, then one of its copies is in l[left..right]
            int s = (left + right) / 2;          // left <= s < right
            if (a > l[s]) left = s + 1;          // a cannot be in l[left..s]
            else right = s;                      // a (if present) is in l[left..s]
        }
        return l[left] == a ? left : n;
    }

    public static void main(String[] args) {
        int[] tab = {1, 3, 5, 10, 17, 30, 35, 99};
        int x = 3;
        int pos = binary(tab, tab.length, x);
        System.out.println(pos == tab.length ? x + " is not in the array" : x + " is at index " + pos);

        int[] withSlot = {7, 2, 9, 4, 0};        // 4 elements + 1 slot for the sentinel
        System.out.println(sequential(withSlot, 4, 9));   // 2
        System.out.println(sequential(withSlot, 4, 5));   // 4 = not found
    }
}
