public class Recursion {

    // Prints x in binary: first the more significant digits (recursively), then the last one.
    static void binary(int x) {
        int digit = x % 2;          // the least significant binary digit of x
        x = x / 2;
        if (x > 0) binary(x);       // print the more significant digits first
        System.out.print(digit);
    }

    // Towers of Hanoi: move n rings from peg "from" to peg "to" using peg "via".
    static void move(int n, char from, char to, char via) {
        if (n > 0) {
            move(n - 1, from, via, to);                          // clear the way
            System.out.print(from + "->" + to + "  ");           // the biggest ring
            move(n - 1, via, to, from);                          // put the rest on top
        }
    }

    // All permutations of a[0..k-1] (the rest of the array stays fixed).
    static void permutations(int[] a, int k) {
        if (k == 1) {
            System.out.println(java.util.Arrays.toString(a));
            return;
        }
        for (int i = 0; i < k; i++) {
            swap(a, i, k - 1);          // choose the element for position k-1
            permutations(a, k - 1);
            swap(a, i, k - 1);          // undo the choice
        }
    }

    static void swap(int[] a, int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }

    public static void main(String[] args) {
        System.out.print("27 = ");
        binary(27);                                   // 11011
        System.out.println(" (binary)");
        move(3, 'A', 'C', 'B');                       // 7 moves
        System.out.println();
        permutations(new int[]{1, 2, 3}, 3);          // 6 permutations
    }
}
