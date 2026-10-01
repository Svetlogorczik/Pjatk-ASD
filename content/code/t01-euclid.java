public class Gcd {

    // Euclid 1: repeated subtraction. Correct, but may be astronomically slow (e.g. n = 10^30, m = 1).
    static long gcdSubtract(long m, long n) {       // requires 0 <= m, n > 0
        while (m > 0) {
            if (m > n) { long t = m; m = n; n = t; } // keep m <= n
            n = n - m;
        }
        return n;
    }

    // Euclid 2: the whole series of subtractions is just "n mod m".
    static long gcdMod(long m, long n) {
        while (m > 0) {
            long r = n % m;
            n = m;
            m = r;
        }
        return n;
    }

    // Euclid 3 (binary): only parity tests, halving, doubling and subtraction.
    static long gcdBinary(long m, long n) {
        if (m == 0) return n;
        if (n == 0) return m;
        if (m % 2 == 0 && n % 2 == 0) return 2 * gcdBinary(m / 2, n / 2);
        if (m % 2 == 0) return gcdBinary(m / 2, n);
        if (n % 2 == 0) return gcdBinary(m, n / 2);
        return m <= n ? gcdBinary((n - m) / 2, m) : gcdBinary((m - n) / 2, n);
    }

    public static void main(String[] args) {
        System.out.println(gcdSubtract(84, 120)); // 12
        System.out.println(gcdMod(55, 89));       // 1  (9 loop iterations: worst case below 100)
        System.out.println(gcdBinary(84, 120));   // 12
    }
}
