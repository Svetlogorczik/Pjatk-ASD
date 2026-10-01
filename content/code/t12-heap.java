import java.util.Arrays;

public class MaxHeap {

    // Heap in an array, indexed from 1 as in the lecture: children of k are 2k and 2k+1, parent is k/2.
    private int[] a;
    private int n = 0;

    MaxHeap(int capacity) { a = new int[capacity + 1]; }

    // Moves a[k] up while it is bigger than its parent.
    private void upheap(int k) {
        int v = a[k];
        int l = k / 2;
        while (l != 0 && a[l] < v) {
            a[k] = a[l];              // the parent goes down
            k = l;
            l = l / 2;
        }
        a[k] = v;
    }

    // Moves a[k] down, always towards the bigger child, until the heap condition holds.
    private void downheap(int k) {
        int v = a[k];
        int l = 2 * k;
        while (l <= n) {
            if (l < n && a[l] < a[l + 1]) l = l + 1;   // the bigger of the two children
            if (v < a[l]) {
                a[k] = a[l];
                k = l;
                l = 2 * l;
            } else break;
        }
        a[k] = v;
    }

    void insert(int x) {              // W = O(log n)
        a[++n] = x;
        upheap(n);
    }

    int deleteMax() {                 // W = 2 * floor(log n) comparisons
        int max = a[1];
        a[1] = a[n--];
        if (n > 0) downheap(1);
        return max;
    }

    // Builds a heap from arbitrary data in linear time (bottom-up).
    void construct(int[] data) {
        n = data.length;
        a = new int[n + 1];
        System.arraycopy(data, 0, a, 1, n);
        for (int i = n / 2; i > 0; i--) downheap(i);
    }

    // HeapSort (in place): construct, then n-1 times deleteMax; the heap shrinks by one,
    // so the freed last cell receives the maximum.
    static void heapSort(int[] data) {
        MaxHeap h = new MaxHeap(data.length);
        h.construct(data);                       // copying only because Java arrays start at 0
        for (int i = h.n; i > 1; i--) {
            int max = h.deleteMax();
            h.a[i] = max;
        }
        System.arraycopy(h.a, 1, data, 0, data.length);
    }

    public static void main(String[] args) {
        int[] t = {7, 12, 3, 15, 1, 9, 6, 11, 4};
        MaxHeap h = new MaxHeap(t.length);
        h.construct(t);
        System.out.println(Arrays.toString(Arrays.copyOfRange(h.a, 1, h.n + 1))); // [15, 12, 9, 11, 1, 3, 6, 7, 4]
        heapSort(t);
        System.out.println(Arrays.toString(t));                                   // [1, 3, 4, 6, 7, 9, 11, 12, 15]
    }
}
