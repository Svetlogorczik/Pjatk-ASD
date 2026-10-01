import java.util.Arrays;

public class ElementarySorts {

    // Selection sort: in pass i find the minimum of a[i..n-1] and put it at position i.
    static void selectionSort(int[] a) {
        int n = a.length;
        for (int i = 0; i < n - 1; i++) {
            int min = i;
            for (int j = i + 1; j < n; j++) {
                if (a[j] < a[min]) min = j;       // dominant operation: comparison
            }
            int x = a[min]; a[min] = a[i]; a[i] = x;   // exactly one swap per pass
            System.out.println("pass " + i + ": " + Arrays.toString(a));
        }
    }

    // Insertion sort: a[0..i-1] is already sorted; insert x = a[i] into it.
    static void insertionSort(int[] a) {
        int n = a.length;
        for (int i = 1; i < n; i++) {
            int x = a[i];
            int j = i;
            while (j > 0 && a[j - 1] > x) {       // shift bigger elements one place right
                a[j] = a[j - 1];
                j--;
            }
            a[j] = x;
            System.out.println("i = " + i + ": " + Arrays.toString(a));
        }
    }

    public static void main(String[] args) {
        int[] data = {29, 10, 14, 37, 13};
        selectionSort(data.clone());
        insertionSort(data.clone());
    }
}
