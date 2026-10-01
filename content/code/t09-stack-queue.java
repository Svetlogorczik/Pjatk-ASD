public class StackQueue {

    // Stack on an array: the top is at index size-1. All operations O(1).
    static class ArrayStack {
        private int[] data = new int[4];
        private int size = 0;

        void push(int x) {
            if (size == data.length) data = java.util.Arrays.copyOf(data, 2 * size); // grow when full
            data[size++] = x;
        }
        int pop() {
            if (isEmpty()) throw new IllegalStateException("stack is empty");
            return data[--size];
        }
        int top() {
            if (isEmpty()) throw new IllegalStateException("stack is empty");
            return data[size - 1];
        }
        int size() { return size; }
        boolean isEmpty() { return size == 0; }
    }

    // Queue on a circular array: head = index of the first element. All operations O(1).
    static class ArrayQueue {
        private int[] data = new int[8];
        private int head = 0, size = 0;

        void inject(int x) {                          // add at the end (enqueue / IN)
            if (size == data.length) grow();
            data[(head + size) % data.length] = x;
            size++;
        }
        int pop() {                                   // remove from the front (dequeue / OUT)
            if (size == 0) throw new IllegalStateException("queue is empty");
            int x = data[head];
            head = (head + 1) % data.length;
            size--;
            return x;
        }
        int front() {                                 // FIRST
            if (size == 0) throw new IllegalStateException("queue is empty");
            return data[head];
        }
        boolean isEmpty() { return size == 0; }
        private void grow() {
            int[] bigger = new int[2 * data.length];
            for (int i = 0; i < size; i++) bigger[i] = data[(head + i) % data.length];
            data = bigger;
            head = 0;
        }
    }

    // Value of an expression in Reverse Polish Notation, e.g. "6 2 3 + * 4 2 / -".
    static int evalRPN(String expr) {
        ArrayStack s = new ArrayStack();
        for (String tok : expr.trim().split("\\s+")) {
            if (tok.matches("-?\\d+")) {
                s.push(Integer.parseInt(tok));          // a number goes on the stack
            } else {
                int b = s.pop(), a = s.pop();           // an operator takes two arguments
                switch (tok) {
                    case "+": s.push(a + b); break;
                    case "-": s.push(a - b); break;
                    case "*": s.push(a * b); break;
                    case "/": s.push(a / b); break;
                    default: throw new IllegalArgumentException("unknown token " + tok);
                }
            }
        }
        return s.pop();
    }

    public static void main(String[] args) {
        System.out.println(evalRPN("6 2 3 + * 4 2 / -"));   // 28
        ArrayQueue q = new ArrayQueue();
        for (int x : new int[]{7, 3, 12}) q.inject(x);
        q.inject(q.front());                                // 7 3 12 7
        System.out.println(q.pop() + " " + q.front());      // 7 3
    }
}
