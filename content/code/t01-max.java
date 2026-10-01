public class MaxDemo {

    // Returns the largest element of a[0..n-1]; requires n > 0.
    static int maxInArray(int[] a, int n) {
        int best = a[0];                 // best so far = max of a[0..0]
        for (int i = 1; i < n; i++) {
            if (best < a[i]) {
                best = a[i];             // now best = max of a[0..i]
            }
        }
        return best;                     // best = max of a[0..n-1]
    }

    public static void main(String[] args) {
        int[] tab = {10, 6, 1, 7, 20, 3, 30, 15};
        System.out.println("Max = " + maxInArray(tab, tab.length)); // Max = 30
    }
}
