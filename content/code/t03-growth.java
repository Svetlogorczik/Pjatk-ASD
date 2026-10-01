public class Growth {

    // Counts how many times the innermost statement runs for typical loop shapes.
    public static void main(String[] args) {
        System.out.printf("%8s %10s %12s %14s %16s%n", "n", "log n", "n", "n log n", "n^2");
        for (int n = 16; n <= 16_384; n *= 4) {
            long logLoop = 0;
            for (int i = n; i > 1; i /= 2) logLoop++;                    // halving: ~log2 n

            long linear = 0;
            for (int i = 0; i < n; i++) linear++;                         // single loop: n

            long nLogN = 0;
            for (int i = 0; i < n; i++)
                for (int j = n; j > 1; j /= 2) nLogN++;                   // n * log2 n

            long square = 0;
            for (int i = 0; i < n; i++)
                for (int j = 0; j < n; j++) square++;                     // nested loops: n^2

            System.out.printf("%8d %10d %12d %14d %16d%n", n, logLoop, linear, nLogN, square);
        }
    }
}
