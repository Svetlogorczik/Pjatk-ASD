import java.util.Arrays;

public class MergeSort {

    // Merges the sorted fragments c[l..s] and c[s+1..p] into one sorted fragment c[l..p].
    static void merge(int[] c, int l, int s, int p) {
        int[] b = new int[p - l + 1];            // auxiliary array
        int i = l, j = s + 1, k = 0;
        while (i <= s && j <= p) {
            // Invariant: b[0..k-1] = merged c[l..i-1] and c[s+1..j-1]
            if (c[i] <= c[j]) b[k++] = c[i++];   // "<=" keeps the sort stable
            else b[k++] = c[j++];
        }
        while (i <= s) b[k++] = c[i++];          // copy what is left (only one of these loops runs)
        while (j <= p) b[k++] = c[j++];
        for (k = 0; k < b.length; k++) c[l + k] = b[k];
    }

    // Sorts c[l..p].
    static void sort(int[] c, int l, int p) {
        if (l < p) {
            int s = (l + p) / 2;
            sort(c, l, s);                       // sort the left half
            sort(c, s + 1, p);                   // sort the right half
            merge(c, l, s, p);                   // merge the halves
        }
    }

    public static void main(String[] args) {
        int[] tab = {38, 27, 43, 3, 9, 82, 10};
        sort(tab, 0, tab.length - 1);
        System.out.println(Arrays.toString(tab));   // [3, 9, 10, 27, 38, 43, 82]
    }
}
