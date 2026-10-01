import java.util.Arrays;

public class LinearSorts {

    // Counting sort of integers from the range 0..m-1 (stable). Returns a new sorted array.
    static int[] countingSort(int[] a, int m) {
        int[] count = new int[m];
        for (int x : a) count[x]++;                    // count[j] = how many times j occurs
        for (int j = 1; j < m; j++) count[j] += count[j - 1];   // count[j] = how many elements <= j
        int[] t = new int[a.length];
        for (int i = a.length - 1; i >= 0; i--) {      // from the end -> the sort is stable
            count[a[i]]--;
            t[count[a[i]]] = a[i];
        }
        return t;
    }

    // Radix sort (LSD) of non-negative integers: a stable counting sort by each decimal digit,
    // starting from the least significant one.
    static int[] radixSort(int[] a, int digits) {
        int[] cur = a.clone();
        for (int d = 0, p = 1; d < digits; d++, p *= 10) {
            int[] count = new int[10];
            for (int x : cur) count[(x / p) % 10]++;
            for (int j = 1; j < 10; j++) count[j] += count[j - 1];
            int[] t = new int[cur.length];
            for (int i = cur.length - 1; i >= 0; i--) {
                int digit = (cur[i] / p) % 10;
                t[--count[digit]] = cur[i];
            }
            cur = t;
            System.out.println("after digit " + d + ": " + Arrays.toString(cur));
        }
        return cur;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(countingSort(new int[]{3, 1, 4, 1, 5, 2, 6, 5, 3}, 7)));
        radixSort(new int[]{512, 38, 407, 263, 91, 145, 700, 386}, 3);
    }
}
