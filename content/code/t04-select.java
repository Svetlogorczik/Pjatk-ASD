import java.util.Arrays;

public class HoareSelect {

    // Partition of a[l..r] around the pivot v = a[l] (the version used in the lectures).
    // After it: a[j] = v, a[l..j-1] <= v, a[j+1..r] >= v. Returns j.
    static int partition(int[] a, int l, int r) {
        int v = a[l], i = l, j = r + 1;
        do {
            do i++; while (i <= r && a[i] < v);  // from the left: stop at an element >= v
            do j--; while (a[j] > v);            // from the right: stop at an element <= v
            if (i < j) { int t = a[i]; a[i] = a[j]; a[j] = t; }
        } while (i < j);
        a[l] = a[j];
        a[j] = v;                                // the pivot lands on its final place
        return j;
    }

    // Hoare's algorithm: the k-th smallest element (k = 1..n). Rearranges the array.
    static int select(int[] a, int k) {
        int l = 0, p = a.length - 1;
        while (true) {
            int j = partition(a, l, p);
            int rank = j - l + 1;                // rank of the pivot inside a[l..p]
            if (k == rank) return a[j];
            if (k < rank) p = j - 1;             // the answer is on the left
            else { k -= rank; l = j + 1; }       // skip rank smaller elements
        }
    }

    public static void main(String[] args) {
        int[] s = {12, 5, 3, 14, 8, 19, 6, 1, 15, 17, 16, 2, 13, 5, 27, 22};
        System.out.println("6th smallest = " + select(s.clone(), 6));   // 6
        int[] sorted = s.clone();
        Arrays.sort(sorted);
        System.out.println("check: " + sorted[5]);                      // 6
    }
}
