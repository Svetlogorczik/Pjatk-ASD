import java.util.Arrays;

public class FFT {

    // Recursive FFT: replaces (re, im) - coefficients of a polynomial of degree < n -
    // with its values at the n-th roots of unity w^0, w^1, ..., w^(n-1).
    // n must be a power of two. invert = true evaluates at w^(-k) (used for interpolation).
    static void fft(double[] re, double[] im, boolean invert) {
        int n = re.length;
        if (n == 1) return;
        int h = n / 2;
        double[] evRe = new double[h], evIm = new double[h], odRe = new double[h], odIm = new double[h];
        for (int i = 0; i < h; i++) {                  // A(x) = Ae(x^2) + x * Ao(x^2)
            evRe[i] = re[2 * i];     evIm[i] = im[2 * i];
            odRe[i] = re[2 * i + 1]; odIm[i] = im[2 * i + 1];
        }
        fft(evRe, evIm, invert);                        // values of Ae at the (n/2)-th roots
        fft(odRe, odIm, invert);                        // values of Ao at the (n/2)-th roots
        double angle = 2 * Math.PI / n * (invert ? -1 : 1);
        for (int k = 0; k < h; k++) {
            double wr = Math.cos(angle * k), wi = Math.sin(angle * k);     // w^k
            double tr = wr * odRe[k] - wi * odIm[k];                      // w^k * Ao(w^2k)
            double ti = wr * odIm[k] + wi * odRe[k];
            re[k] = evRe[k] + tr;      im[k] = evIm[k] + ti;              // A(w^k)
            re[k + h] = evRe[k] - tr;  im[k + h] = evIm[k] - ti;          // A(w^(k+n/2)), since w^(n/2) = -1
        }
    }

    // Product of integer polynomials in O(n log n).
    static long[] multiply(long[] a, long[] b) {
        int need = a.length + b.length - 1, n = 1;
        while (n < need) n *= 2;
        double[] ar = new double[n], ai = new double[n], br = new double[n], bi = new double[n];
        for (int i = 0; i < a.length; i++) ar[i] = a[i];
        for (int i = 0; i < b.length; i++) br[i] = b[i];
        fft(ar, ai, false);                             // 1) values of A
        fft(br, bi, false);                             // 2) values of B
        double[] cr = new double[n], ci = new double[n];
        for (int k = 0; k < n; k++) {                   // 3) values of C = A*B: n multiplications
            cr[k] = ar[k] * br[k] - ai[k] * bi[k];
            ci[k] = ar[k] * bi[k] + ai[k] * br[k];
        }
        fft(cr, ci, true);                              // 4) interpolation: evaluate at w^(-t) ...
        long[] c = new long[need];
        for (int t = 0; t < need; t++) c[t] = Math.round(cr[t] / n);   // ... and divide by n
        return c;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(multiply(new long[]{1, 2, 3}, new long[]{4, 5})));  // [4, 13, 22, 15]
    }
}
