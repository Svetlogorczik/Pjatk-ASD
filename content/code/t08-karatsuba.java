import java.util.Arrays;

public class Karatsuba {

    // Product of two polynomials given by coefficients a[0..n-1], b[0..n-1] (a[i] at x^i).
    // n must be a power of two (pad with zeros if necessary). Uses 3 recursive products instead of 4.
    static long[] multiply(long[] a, long[] b) {
        int n = a.length;
        long[] c = new long[2 * n - 1];
        if (n == 1) {
            c[0] = a[0] * b[0];
            return c;
        }
        int h = n / 2;
        long[] al = Arrays.copyOfRange(a, 0, h), ah = Arrays.copyOfRange(a, h, n);
        long[] bl = Arrays.copyOfRange(b, 0, h), bh = Arrays.copyOfRange(b, h, n);

        long[] low = multiply(al, bl);                    // L = Al * Bl
        long[] high = multiply(ah, bh);                   // H = Ah * Bh
        long[] sa = new long[h], sb = new long[h];
        for (int i = 0; i < h; i++) { sa[i] = al[i] + ah[i]; sb[i] = bl[i] + bh[i]; }
        long[] sum = multiply(sa, sb);                    // S = (Al + Ah)(Bl + Bh)

        // A*B = L + x^h * (S - L - H) + x^n * H
        for (int i = 0; i < low.length; i++) {
            c[i] += low[i];
            c[i + h] += sum[i] - low[i] - high[i];
            c[i + n] += high[i];
        }
        return c;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(multiply(new long[]{1, 2}, new long[]{3, 4})));   // [3, 10, 8]
        // 47 * 63 with base x = 10: 47 = 7 + 4x, 63 = 3 + 6x
        long[] c = multiply(new long[]{7, 4}, new long[]{3, 6});                          // [21, 54, 24]
        System.out.println(c[0] + c[1] * 10 + c[2] * 100);                                // 2961
    }
}
