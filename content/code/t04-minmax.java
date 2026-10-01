public class MinMax {

    // Minimum and maximum together with about 3n/2 comparisons (processing elements in pairs).
    static int[] minMax(int[] a) {                 // requires a.length >= 1
        int n = a.length, min, max, i;
        if (n % 2 == 1) { min = max = a[0]; i = 1; }
        else {
            if (a[0] < a[1]) { min = a[0]; max = a[1]; } else { min = a[1]; max = a[0]; }
            i = 2;
        }
        for (; i + 1 < n; i += 2) {
            int small = a[i], big = a[i + 1];
            if (small > big) { small = a[i + 1]; big = a[i]; }   // 1 comparison inside the pair
            if (small < min) min = small;                        // 1 comparison with min
            if (big > max) max = big;                            // 1 comparison with max
        }
        return new int[]{min, max};
    }

    public static void main(String[] args) {
        int[] r = minMax(new int[]{9, 4, 17, 2, 11, 6, 20, 8});
        System.out.println("min = " + r[0] + ", max = " + r[1]);   // min = 2, max = 20
    }
}
