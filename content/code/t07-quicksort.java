import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.Deque;

public class QuickSort {

    // Partition a[l..r] around v = a[l] (lecture version). Returns the final position of v.
    static int partition(int[] a, int l, int r) {
        int v = a[l], i = l, j = r + 1;
        do {
            do i++; while (i <= r && a[i] < v);
            do j--; while (a[j] > v);
            if (i < j) { int t = a[i]; a[i] = a[j]; a[j] = t; }
        } while (i < j);
        a[l] = a[j];
        a[j] = v;
        return j;
    }

    // Recursive QuickSort (Hoare 1960).
    static void quickSort(int[] a, int l, int r) {
        int j = partition(a, l, r);
        if (j - 1 > l) quickSort(a, l, j - 1);
        if (r > j + 1) quickSort(a, j + 1, r);
    }

    // The same without recursion: pending fragments [l, r] are kept on a stack.
    // The LONGER part goes on the stack, we continue with the shorter one,
    // so the stack never holds more than about log2(n) pairs.
    static void quickSortIterative(int[] a) {
        Deque<int[]> stack = new ArrayDeque<>();
        int l = 0, r = a.length - 1;
        while (true) {
            while (l < r) {
                int j = partition(a, l, r);
                if (j - l < r - j) {                 // left part is shorter
                    stack.push(new int[]{j + 1, r});
                    r = j - 1;
                } else {
                    stack.push(new int[]{l, j - 1});
                    l = j + 1;
                }
            }
            if (stack.isEmpty()) return;
            int[] next = stack.pop();
            l = next[0];
            r = next[1];
        }
    }

    public static void main(String[] args) {
        int[] t = {9, 4, 7, 1, 8, 2, 6};
        quickSort(t, 0, t.length - 1);
        System.out.println(Arrays.toString(t));      // [1, 2, 4, 6, 7, 8, 9]

        int[] u = {5, 3, 8, 3, 1, 9, 2};
        quickSortIterative(u);
        System.out.println(Arrays.toString(u));      // [1, 2, 3, 3, 5, 8, 9]
    }
}
