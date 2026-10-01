public class IntSqrt {

    // Linear version: try p = 0, 1, 2, ... while (p+1)^2 <= n.
    // Invariant: p*p <= n
    static long sqrtLinear(long n) {             // requires n >= 0
        long p = 0;
        while ((p + 1) * (p + 1) <= n) {
            p = p + 1;
        }
        return p;                                // p*p <= n < (p+1)*(p+1)
    }

    // Binary version: halve the interval [l, r] that surely contains the answer.
    // Invariant: l*l <= n  &&  (r+1)*(r+1) > n  &&  l <= r
    static long sqrtBinary(long n) {             // requires n >= 0
        long l = 0, r = n;
        while (l < r) {
            long s = (l + r) / 2;                // l <= s < r
            if ((s + 1) * (s + 1) <= n) {
                l = s + 1;                       // the root is > s
            } else {
                r = s;                           // the root is <= s
            }
        }
        return l;                                // l == r, so l = floor(sqrt(n))
    }

    public static void main(String[] args) {
        for (long n : new long[]{0, 1, 15, 16, 17, 1_000_000}) {
            System.out.println(n + " -> " + sqrtLinear(n) + " " + sqrtBinary(n));
        }
    }
}
