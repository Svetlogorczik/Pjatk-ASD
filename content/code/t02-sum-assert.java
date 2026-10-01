public class SumWithInvariant {

    // Sum of a[0..n-1]. The invariant is checked with assert (run with: java -ea SumWithInvariant).
    static int sum(int[] a) {
        int n = a.length;
        int s = 0;
        int i = 0;
        assert s == partialSum(a, i);            // 1) the invariant holds before the loop
        while (i < n) {
            s = s + a[i];
            i = i + 1;
            assert s == partialSum(a, i);        // 2) the loop body preserves it
        }
        // 3) invariant + (i == n)  =>  s == a[0] + ... + a[n-1]
        return s;
    }

    // Helper used only for checking: a[0] + ... + a[k-1]
    static int partialSum(int[] a, int k) {
        int t = 0;
        for (int j = 0; j < k; j++) t += a[j];
        return t;
    }

    public static void main(String[] args) {
        System.out.println(sum(new int[]{4, -1, 7, 2}));   // 12
    }
}
