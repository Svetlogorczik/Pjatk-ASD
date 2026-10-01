import java.util.ArrayDeque;
import java.util.Deque;
import java.util.LinkedList;

public class ListAlgorithms {

    // Sieve of Eratosthenes on a list: the head of the list is always a prime,
    // then all its multiples are removed from the rest of the list.
    static LinkedList<Integer> primesUpTo(int n) {
        LinkedList<Integer> list = new LinkedList<>();
        for (int i = 2; i <= n; i++) list.add(i);
        LinkedList<Integer> primes = new LinkedList<>();
        while (!list.isEmpty()) {
            int p = list.removeFirst();                // the smallest remaining number is prime
            primes.add(p);
            list.removeIf(x -> x % p == 0);            // cross out the multiples of p
        }
        return primes;
    }

    // Merging two sorted lists.
    static LinkedList<Integer> merge(LinkedList<Integer> a, LinkedList<Integer> b) {
        LinkedList<Integer> out = new LinkedList<>();
        while (!a.isEmpty() && !b.isEmpty())
            out.add(a.peekFirst() <= b.peekFirst() ? a.removeFirst() : b.removeFirst());
        out.addAll(a);
        out.addAll(b);
        return out;
    }

    // Merge sort of a list using a QUEUE of sorted lists:
    // start with one-element lists; take two from the front, merge, put the result at the end.
    static LinkedList<Integer> queueMergeSort(int[] data) {
        Deque<LinkedList<Integer>> queue = new ArrayDeque<>();
        for (int x : data) {
            LinkedList<Integer> single = new LinkedList<>();
            single.add(x);
            queue.addLast(single);                     // inject
        }
        if (queue.isEmpty()) return new LinkedList<>();
        while (queue.size() > 1) {
            LinkedList<Integer> a = queue.pollFirst(); // front + pop
            LinkedList<Integer> b = queue.pollFirst();
            queue.addLast(merge(a, b));                // inject the merged list
        }
        return queue.pollFirst();
    }

    public static void main(String[] args) {
        System.out.println(primesUpTo(30));                          // [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
        System.out.println(queueMergeSort(new int[]{5, 2, 8, 1, 9, 3})); // [1, 2, 3, 5, 8, 9]
    }
}
