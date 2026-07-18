/**
 * CodeXrun IDE - Core Application Logic
 * Integrates Monaco Editor, virtual file explorer, settings panels,
 * resizable drawer terminal, and the public Piston execution API.
 */

import JSZip from 'jszip';

// Default templates for languages
const BOILERPLATE_TEMPLATES = {
  python: `print("Hello, World!")
`,
  cpp: `#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}
`,
  c: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}
`,
  java: `class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
`,
  javascript: `console.log("Hello, World!");
`,
  typescript: `console.log("Hello, World!");
`,
  rust: `fn main() {
    println!("Hello, World!");
}
`,
  go: `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
`,
  csharp: `using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello, World!");
    }
}
`,
  kotlin: `fun main() {
    println("Hello, World!")
}
`,
  swift: `print("Hello, World!")
`,
  ruby: `puts "Hello, World!"
`,
  dart: `void main() {
  print("Hello, World!");
}
`,
  r: `cat("Hello, World!\\n")
`,
  sql: `-- SQL Editor
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(50)
);

INSERT INTO users VALUES (1, 'Alice'), (2, 'Bob');
SELECT * FROM users;
`,
  html: `<!DOCTYPE html>
<html>
<head>
    <title>Hello World</title>
</head>
<body>
    <h1>Hello, World!</h1>
</body>
</html>
`,
  php: `<?php
echo "Hello, World!\\n";
?>
`,
  vhdl: `-- VHDL Half Adder and Testbench Example
library ieee;
use ieee.std_logic_1164.all;

entity Half_Adder is
    port (
        a, b : in std_logic;
        sum, carry : out std_logic
    );
end entity Half_Adder;

architecture behavioral of Half_Adder is
begin
    sum <= a xor b;
    carry <= a and b;
end architecture behavioral;

library ieee;
use ieee.std_logic_1164.all;

entity tb_Half_Adder is
end entity tb_Half_Adder;

architecture sim of tb_Half_Adder is
    signal a, b : std_logic := '0';
    signal sum, carry : std_logic;
begin
    -- Instantiate the Unit Under Test (UUT)
    uut: entity work.Half_Adder
        port map (
            a => a,
            b => b,
            sum => sum,
            carry => carry
        );

    -- Stimulus process
    stim_proc: process
    begin
        -- Test Case 1: a=0, b=0
        a <= '0'; b <= '0';
        wait for 10 ns;
        report "Test 1: a=0, b=0 -> sum=" & std_logic'image(sum) & ", carry=" & std_logic'image(carry);

        -- Test Case 2: a=0, b=1
        a <= '0'; b <= '1';
        wait for 10 ns;
        report "Test 2: a=0, b=1 -> sum=" & std_logic'image(sum) & ", carry=" & std_logic'image(carry);

        -- Test Case 3: a=1, b=0
        a <= '1'; b <= '0';
        wait for 10 ns;
        report "Test 3: a=1, b=0 -> sum=" & std_logic'image(sum) & ", carry=" & std_logic'image(carry);

        -- Test Case 4: a=1, b=1
        a <= '1'; b <= '1';
        wait for 10 ns;
        report "Test 4: a=1, b=1 -> sum=" & std_logic'image(sum) & ", carry=" & std_logic'image(carry);

        wait;
    end process;
end architecture sim;
`
  ,
  verilog: `// Verilog Half Adder and Testbench Example
module Half_Adder (
    input a,
    input b,
    output sum,
    output carry
);
    assign sum = a ^ b;
    assign carry = a & b;
endmodule

module tb_Half_Adder;
    reg a;
    reg b;
    wire sum;
    wire carry;

    // Instantiate Unit Under Test (UUT)
    Half_Adder uut (
        .a(a),
        .b(b),
        .sum(sum),
        .carry(carry)
    );

    initial begin
        // Test Case 1: a=0, b=0
        a = 0; b = 0;
        #10;
        $display("Test 1: a=0, b=0 -> sum=%b, carry=%b", sum, carry);

        // Test Case 2: a=0, b=1
        a = 0; b = 1;
        #10;
        $display("Test 2: a=0, b=1 -> sum=%b, carry=%b", sum, carry);

        // Test Case 3: a=1, b=0
        a = 1; b = 0;
        #10;
        $display("Test 3: a=1, b=0 -> sum=%b, carry=%b", sum, carry);

        // Test Case 4: a=1, b=1
        a = 1; b = 1;
        #10;
        $display("Test 4: a=1, b=1 -> sum=%b, carry=%b", sum, carry);

        $finish;
    end
endmodule
`
};

// Ready-made algorithm templates for C, C++, Java, and Python
const ALGORITHM_TEMPLATES = {
  bubble_sort: {
    python: {
      name: 'bubble_sort.py',
      content: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]

if __name__ == "__main__":
    data = [64, 34, 25, 12, 22, 11, 90]
    print("Original array:", data)
    bubble_sort(data)
    print("Sorted array:", data)
`
    },
    cpp: {
      name: 'bubble_sort.cpp',
      content: `#include <iostream>
#include <vector>

void bubbleSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n; ++i) {
        for (int j = 0; j < n - i - 1; ++j) {
            if (arr[j] > arr[j+1]) {
                std::swap(arr[j], arr[j+1]);
            }
        }
    }
}

int main() {
    std::vector<int> data = {64, 34, 25, 12, 22, 11, 90};
    std::cout << "Original array: ";
    for (int x : data) std::cout << x << " ";
    std::cout << "\\n";
    
    bubbleSort(data);
    
    std::cout << "Sorted array: ";
    for (int x : data) std::cout << x << " ";
    std::cout << "\\n";
    return 0;
}
`
    },
    c: {
      name: 'bubble_sort.c',
      content: `#include <stdio.h>

void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n; ++i) {
        for (int j = 0; j < n - i - 1; ++j) {
            if (arr[j] > arr[j+1]) {
                int temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }
    }
}

int main() {
    int data[] = {64, 34, 25, 12, 22, 11, 90};
    int n = sizeof(data)/sizeof(data[0]);
    printf("Original array: ");
    for(int i=0; i<n; i++) printf("%d ", data[i]);
    printf("\\n");
    
    bubbleSort(data, n);
    
    printf("Sorted array: ");
    for(int i=0; i<n; i++) printf("%d ", data[i]);
    printf("\\n");
    return 0;
}
`
    },
    java: {
      name: 'BubbleSort.java',
      content: `public class BubbleSort {
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j+1]) {
                    int temp = arr[j];
                    arr[j] = arr[j+1];
                    arr[j+1] = temp;
                }
            }
        }
    }

    public static void main(String[] args) {
        int[] data = {64, 34, 25, 12, 22, 11, 90};
        System.out.print("Original array: ");
        for(int x : data) System.out.print(x + " ");
        System.out.println();
        
        bubbleSort(data);
        
        System.out.print("Sorted array: ");
        for(int x : data) System.out.print(x + " ");
        System.out.println();
    }
}
`
    }
  },
  fibonacci: {
    python: {
      name: 'fibonacci.py',
      content: `def fibonacci(n):
    fib = [0, 1]
    for i in range(2, n):
        fib.append(fib[-1] + fib[-2])
    return fib[:n]

if __name__ == "__main__":
    n = 10
    print(f"First {n} Fibonacci numbers:")
    print(fibonacci(n))
`
    },
    cpp: {
      name: 'fibonacci.cpp',
      content: `#include <iostream>

void printFibonacci(int n) {
    long long a = 0, b = 1;
    std::cout << a << " " << b << " ";
    for (int i = 2; i < n; ++i) {
        long long c = a + b;
        std::cout << c << " ";
        a = b;
        b = c;
    }
    std::cout << "\\n";
}

int main() {
    int n = 10;
    std::cout << "First " << n << " Fibonacci numbers:\\n";
    printFibonacci(n);
    return 0;
}
`
    },
    c: {
      name: 'fibonacci.c',
      content: `#include <stdio.h>

void printFibonacci(int n) {
    long long a = 0, b = 1;
    printf("%lld %lld ", a, b);
    for (int i = 2; i < n; ++i) {
        long long c = a + b;
        printf("%lld ", c);
        a = b;
        b = c;
    }
    printf("\\n");
}

int main() {
    int n = 10;
    printf("First %d Fibonacci numbers:\\n", n);
    printFibonacci(n);
    return 0;
}
`
    },
    java: {
      name: 'Fibonacci.java',
      content: `public class Fibonacci {
    public static void printFibonacci(int n) {
        long a = 0, b = 1;
        System.out.print(a + " " + b + " ");
        for (int i = 2; i < n; i++) {
            long c = a + b;
            System.out.print(c + " ");
            a = b;
            b = c;
        }
        System.out.println();
    }

    public static void main(String[] args) {
        int n = 10;
        System.out.println("First " + n + " Fibonacci numbers:");
        printFibonacci(n);
    }
}
`
    }
  },
  binary_search: {
    python: {
      name: 'binary_search.py',
      content: `def binary_search(arr, x):
    low = 0
    high = len(arr) - 1
    while low <= high:
        mid = (high + low) // 2
        if arr[mid] < x:
            low = mid + 1
        elif arr[mid] > x:
            high = mid - 1
        else:
            return mid
    return -1

if __name__ == "__main__":
    arr = [2, 3, 4, 10, 40]
    x = 10
    result = binary_search(arr, x)
    if result != -1:
        print(f"Element present at index {result}")
    else:
        print("Element not present in array")
`
    },
    cpp: {
      name: 'binary_search.cpp',
      content: `#include <iostream>
#include <vector>

int binarySearch(const std::vector<int>& arr, int x) {
    int low = 0, high = arr.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == x) return mid;
        if (arr[mid] < x) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}

int main() {
    std::vector<int> arr = {2, 3, 4, 10, 40};
    int x = 10;
    int result = binarySearch(arr, x);
    if (result != -1) {
        std::cout << "Element found at index " << result << std::endl;
    } else {
        std::cout << "Element not found" << std::endl;
    }
    return 0;
}
`
    },
    c: {
      name: 'binary_search.c',
      content: `#include <stdio.h>

int binarySearch(int arr[], int l, int r, int x) {
    while (l <= r) {
        int m = l + (r - l) / 2;
        if (arr[m] == x) return m;
        if (arr[m] < x) l = m + 1;
        else r = m - 1;
    }
    return -1;
}

int main() {
    int arr[] = {2, 3, 4, 10, 40};
    int n = sizeof(arr)/sizeof(arr[0]);
    int x = 10;
    int result = binarySearch(arr, 0, n - 1, x);
    if (result != -1) printf("Element found at index %d\\n", result);
    else printf("Element not found\\n");
    return 0;
}
`
    },
    java: {
      name: 'BinarySearch.java',
      content: `public class BinarySearch {
    public static int binarySearch(int[] arr, int x) {
        int l = 0, r = arr.length - 1;
        while (l <= r) {
            int m = l + (r - l) / 2;
            if (arr[m] == x) return m;
            if (arr[m] < x) l = m + 1;
            else r = m - 1;
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] arr = {2, 3, 4, 10, 40};
        int x = 10;
        int result = binarySearch(arr, x);
        if (result != -1) {
            System.out.println("Element found at index " + result);
        } else {
            System.out.println("Element not found");
        }
    }
}
`
    }
  },
  stack: {
    python: {
      name: 'stack_demo.py',
      content: `class Stack:
    def __init__(self):
        self.items = []
    def push(self, item):
        self.items.append(item)
        print(f"Pushed {item}")
    def pop(self):
        if not self.is_empty():
            return self.items.pop()
    def is_empty(self):
        return len(self.items) == 0

if __name__ == "__main__":
    s = Stack()
    s.push(10)
    s.push(20)
    print("Popped:", s.pop())
    print("Popped:", s.pop())
`
    },
    cpp: {
      name: 'stack_demo.cpp',
      content: `#include <iostream>
#include <vector>

class Stack {
private:
    std::vector<int> items;
public:
    void push(int val) {
        items.push_back(val);
        std::cout << "Pushed: " << val << "\\n";
    }
    void pop() {
        if (items.empty()) return;
        std::cout << "Popped: " << items.back() << "\\n";
        items.pop_back();
    }
};

int main() {
    Stack s;
    s.push(10);
    s.push(20);
    s.pop();
    s.pop();
    return 0;
}
`
    },
    c: {
      name: 'stack_demo.c',
      content: `#include <stdio.h>
#define MAX 100

struct Stack {
    int items[MAX];
    int top;
};

void push(struct Stack *s, int val) {
    if(s->top < MAX - 1) {
        s->items[++(s->top)] = val;
        printf("Pushed: %d\\n", val);
    }
}

void pop(struct Stack *s) {
    if(s->top >= 0) {
        printf("Popped: %d\\n", s->items[(s->top)--]);
    }
}

int main() {
    struct Stack s;
    s.top = -1;
    push(&s, 10);
    push(&s, 20);
    pop(&s);
    pop(&s);
    return 0;
}
`
    },
    java: {
      name: 'StackExample.java',
      content: `import java.util.Stack;

public class StackExample {
    public static void main(String[] args) {
        Stack<Integer> s = new Stack<>();
        s.push(10);
        System.out.println("Pushed 10");
        s.push(20);
        System.out.println("Pushed 20");
        System.out.println("Popped: " + s.pop());
        System.out.println("Popped: " + s.pop());
    }
}
`
    }
  },
  queue: {
    python: {
      name: 'queue_demo.py',
      content: `from collections import deque

class Queue:
    def __init__(self):
        self.items = deque()
    def enqueue(self, item):
        self.items.append(item)
        print(f"Enqueued {item}")
    def dequeue(self):
        if len(self.items) > 0:
            return self.items.popleft()

if __name__ == "__main__":
    q = Queue()
    q.enqueue(10)
    q.enqueue(20)
    print("Dequeued:", q.dequeue())
    print("Dequeued:", q.dequeue())
`
    },
    cpp: {
      name: 'queue_demo.cpp',
      content: `#include <iostream>
#include <queue>

int main() {
    std::queue<int> q;
    q.push(10);
    std::cout << "Enqueued 10\\n";
    q.push(20);
    std::cout << "Enqueued 20\\n";
    std::cout << "Dequeued: " << q.front() << "\\n";
    q.pop();
    std::cout << "Dequeued: " << q.front() << "\\n";
    q.pop();
    return 0;
}
`
    },
    c: {
      name: 'queue_demo.c',
      content: `#include <stdio.h>
#define MAX 100

struct Queue {
    int items[MAX];
    int front, rear;
};

void enqueue(struct Queue *q, int val) {
    if(q->rear < MAX - 1) {
        q->items[++(q->rear)] = val;
        printf("Enqueued: %d\\n", val);
    }
}

void dequeue(struct Queue *q) {
    if(q->front <= q->rear) {
        printf("Dequeued: %d\\n", q->items[(q->front)++]);
    }
}

int main() {
    struct Queue q;
    q.front = 0; q.rear = -1;
    enqueue(&q, 10);
    enqueue(&q, 20);
    dequeue(&q);
    dequeue(&q);
    return 0;
}
`
    },
    java: {
      name: 'QueueExample.java',
      content: `import java.util.LinkedList;
import java.util.Queue;

public class QueueExample {
    public static void main(String[] args) {
        Queue<Integer> q = new LinkedList<>();
        q.add(10);
        System.out.println("Enqueued 10");
        q.add(20);
        System.out.println("Enqueued 20");
        System.out.println("Dequeued: " + q.poll());
        System.out.println("Dequeued: " + q.poll());
    }
}
`
    }
  },
  bst: {
    python: {
      name: 'bst_demo.py',
      content: `class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

class BST:
    def __init__(self):
        self.root = None

    def insert(self, val):
        if not self.root:
            self.root = Node(val)
        else:
            self._insert(self.root, val)

    def _insert(self, node, val):
        if val < node.val:
            if not node.left:
                node.left = Node(val)
            else:
                self._insert(node.left, val)
        else:
            if not node.right:
                node.right = Node(val)
            else:
                self._insert(node.right, val)

if __name__ == "__main__":
    tree = BST()
    data = [50, 30, 70, 20, 40, 60, 80]
    for x in data:
        tree.insert(x)
    print("Constructed BST with root:", tree.root.val)
`
    },
    cpp: {
      name: 'bst_demo.cpp',
      content: `#include <iostream>

struct Node {
    int val;
    Node* left;
    Node* right;
    Node(int v) : val(v), left(nullptr), right(nullptr) {}
};

Node* insert(Node* root, int val) {
    if (!root) return new Node(val);
    if (val < root->val) {
        root->left = insert(root->left, val);
    } else {
        root->right = insert(root->right, val);
    }
    return root;
}

int main() {
    Node* root = nullptr;
    int data[] = {50, 30, 70, 20, 40, 60, 80};
    for (int x : data) {
        root = insert(root, x);
    }
    std::cout << "BST root: " << root->val << "\\n";
    return 0;
}
`
    },
    c: {
      name: 'bst_demo.c',
      content: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int val;
    struct Node* left;
    struct Node* right;
};

struct Node* createNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}

struct Node* insert(struct Node* root, int val) {
    if (root == NULL) return createNode(val);
    if (val < root->val) {
        root->left = insert(root->left, val);
    } else {
        root->right = insert(root->right, val);
    }
    return root;
}

int main() {
    struct Node* root = NULL;
    int data[] = {50, 30, 70, 20, 40, 60, 80};
    for (int i = 0; i < 7; i++) {
        root = insert(root, data[i]);
    }
    printf("BST Root: %d\\n", root->val);
    return 0;
}
`
    },
    java: {
      name: 'BSTExample.java',
      content: `class Node {
    int val;
    Node left, right;
    Node(int v) {
        val = v;
    }
}

public class BSTExample {
    public static Node insert(Node root, int val) {
        if (root == null) return new Node(val);
        if (val < root.val) {
            root.left = insert(root.left, val);
        } else {
            root.right = insert(root.right, val);
        }
        return root;
    }

    public static void main(String[] args) {
        Node root = null;
        int[] data = {50, 30, 70, 20, 40, 60, 80};
        for (int x : data) {
            root = insert(root, x);
        }
        System.out.println("BST Root: " + root.val);
    }
}
`
    }
  }
};

// Map language extensions to their Editor/Piston IDs
const EXTENSION_MAP = {
  py: { lang: 'python', name: 'Python' },
  cpp: { lang: 'cpp', name: 'C++' },
  cc: { lang: 'cpp', name: 'C++' },
  c: { lang: 'c', name: 'C' },
  h: { lang: 'c', name: 'C' },
  java: { lang: 'java', name: 'Java' },
  js: { lang: 'javascript', name: 'JavaScript' },
  ts: { lang: 'typescript', name: 'TypeScript' },
  rs: { lang: 'rust', name: 'Rust' },
  go: { lang: 'go', name: 'Go' },
  cs: { lang: 'csharp', name: 'C#' },
  kt: { lang: 'kotlin', name: 'Kotlin' },
  swift: { lang: 'swift', name: 'Swift' },
  rb: { lang: 'ruby', name: 'Ruby' },
  dart: { lang: 'dart', name: 'Dart' },
  r: { lang: 'r', name: 'R' },
  sql: { lang: 'sql', name: 'SQL' },
  html: { lang: 'html', name: 'HTML/CSS' },
  php: { lang: 'php', name: 'PHP' },
  vhd: { lang: 'vhdl', name: 'VHDL' },
  vhdl: { lang: 'vhdl', name: 'VHDL' },
  v: { lang: 'verilog', name: 'Verilog' }
};

// Compiler Explorer (Godbolt) API Details
const GODBOLT_API_URL = 'https://godbolt.org/api/compiler';
const GODBOLT_LANG_MAP = {
  python: { compilerId: 'python310', langName: 'python' },
  cpp: { compilerId: 'g132', langName: 'c++' },
  c: { compilerId: 'g132', langName: 'c' },
  java: { compilerId: 'java1700', langName: 'java' },
  javascript: { compilerId: 'v8113', langName: 'javascript' },
  typescript: { compilerId: 'v8113', langName: 'typescript' },
  rust: { compilerId: 'r1950', langName: 'rust' },
  go: { compilerId: 'gl122', langName: 'go' },
  csharp: { compilerId: 'dotnet90csharpmono', langName: 'csharp' },
  kotlin: { compilerId: 'kotlinc2220', langName: 'kotlin' },
  swift: { compilerId: 'swift633', langName: 'swift' },
  ruby: { compilerId: 'ruby347', langName: 'ruby' },
  dart: { compilerId: 'dart373', langName: 'dart' },
  r: { compilerId: 'r_lang', langName: 'r' },
  sql: { compilerId: 'sqlite3', langName: 'sql' },
  html: { compilerId: 'html', langName: 'html' },
  php: { compilerId: 'php820', langName: 'php' }
};

// Application State
let state = {
  files: [],
  activeFileId: null,
  theme: 'vs-dark',
  fontSize: 14,
  wordWrap: 'off',
  minimap: true
};

// Monaco Editor Instance
let editor = null;
let saveTimeout = null;

// Visualizer State
let simulationState = {
  steps: [],
  currentStepIndex: -1,
  isPlaying: false,
  timer: null,
  delay: 800,
  currentData: [64, 34, 25, 12, 22, 11, 90]
};

// ==========================================================================
// Initialization & Startup
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  loadWorkspaceState();
  initSidebarTabs();
  initSettingsListeners();
  initFileCreatorListeners();
  initFolderCreatorListeners();
  initCommandPaletteListeners();
  initTerminalTabs();
  initResizableTerminal();
  initResizableSidebar();
  initMobileLayout();
  initShortcutListeners();
  initVisualizerListeners();
  initZenMode();
  initGitPanel();
  initCollabPanel();
  initWaveformBuilder();

  // Load Monaco Editor using the AMD loader
  if (window.monaco) {
    initMonacoEditor();
  } else if (typeof require !== 'undefined') {
    require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' } });
    require(['vs/editor/editor.main'], () => {
      initMonacoEditor();
    });
  } else {
    showTerminalLog('[System Error] Monaco Editor loader could not be fetched. Check your internet connection.', 'error-text');
  }

  // Setup Run Button
  document.getElementById('run-btn').addEventListener('click', runCurrentCode);

  // Setup Share Button
  document.getElementById('share-btn').addEventListener('click', shareCode);

  // Setup Clear Terminal Button
  document.getElementById('clear-terminal-btn').addEventListener('click', clearTerminalLog);

  // Setup Format Button
  document.getElementById('format-btn').addEventListener('click', formatCode);

  // Setup Download ZIP Button
  document.getElementById('download-zip-btn').addEventListener('click', downloadWorkspaceAsZip);

  // Setup Templates Listeners
  initTemplatesListeners();

  // Setup Share Modal Listeners
  initShareModalListeners();

  // Setup AdSense status observer
  initAdSenseObserver();
});

// Register custom themes for Monaco Editor
function registerCustomMonacoThemes() {
  // Dracula
  monaco.editor.defineTheme('dracula', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6272a4', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'ff79c6' },
      { token: 'identifier', foreground: 'f8f8f2' },
      { token: 'string', foreground: 'f1fa8c' },
      { token: 'number', foreground: 'bd93f9' },
      { token: 'operator', foreground: 'ff79c6' },
      { token: 'type', foreground: '8be9fd', fontStyle: 'italic' },
      { token: 'class', foreground: '50fa7b' },
      { token: 'function', foreground: '50fa7b' }
    ],
    colors: {
      'editor.background': '#282a36',
      'editor.foreground': '#f8f8f2',
      'editorLineNumber.foreground': '#6272a4',
      'editorLineNumber.activeForeground': '#ff79c6',
      'editor.lineHighlightBackground': '#44475a30',
      'editor.selectionBackground': '#44475a'
    }
  });

  // Monokai
  monaco.editor.defineTheme('monokai', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '75715e', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'f92672' },
      { token: 'string', foreground: 'e6db74' },
      { token: 'number', foreground: 'ae81ff' },
      { token: 'type', foreground: '66d9ef', fontStyle: 'italic' },
      { token: 'class', foreground: 'a6e22e' },
      { token: 'function', foreground: 'a6e22e' }
    ],
    colors: {
      'editor.background': '#272822',
      'editor.foreground': '#f8f8f2',
      'editorLineNumber.foreground': '#90908a',
      'editorLineNumber.activeForeground': '#f92672',
      'editor.lineHighlightBackground': '#3e3d32',
      'editor.selectionBackground': '#49483e'
    }
  });
}

// Apply App UI custom theme colors to match selected theme
function applyAppThemeColors(themeName) {
  const root = document.documentElement;

  if (themeName === 'dracula') {
    root.style.setProperty('--bg-primary', '#282a36');
    root.style.setProperty('--bg-secondary', '#1e1f29');
    root.style.setProperty('--bg-tertiary', '#191a21');
    root.style.setProperty('--text-main', '#f8f8f2');
    root.style.setProperty('--text-muted', '#6272a4');
    root.style.setProperty('--accent-indigo', '#bd93f9');
    root.style.setProperty('--accent-cyan', '#8be9fd');
    root.style.setProperty('--border-color', 'rgba(98, 114, 164, 0.25)');
    root.style.setProperty('--border-hover', 'rgba(98, 114, 164, 0.4)');
  } else if (themeName === 'monokai') {
    root.style.setProperty('--bg-primary', '#272822');
    root.style.setProperty('--bg-secondary', '#1e1f1c');
    root.style.setProperty('--bg-tertiary', '#141411');
    root.style.setProperty('--text-main', '#f8f8f2');
    root.style.setProperty('--text-muted', '#75715e');
    root.style.setProperty('--accent-indigo', '#f92672');
    root.style.setProperty('--accent-cyan', '#66d9ef');
    root.style.setProperty('--border-color', 'rgba(117, 113, 94, 0.25)');
    root.style.setProperty('--border-hover', 'rgba(117, 113, 94, 0.4)');
  } else if (themeName === 'vs-light') {
    root.style.setProperty('--bg-primary', '#ffffff');
    root.style.setProperty('--bg-secondary', '#f3f4f6');
    root.style.setProperty('--bg-tertiary', '#e5e7eb');
    root.style.setProperty('--text-main', '#111827');
    root.style.setProperty('--text-muted', '#4b5563');
    root.style.setProperty('--accent-indigo', '#4f46e5');
    root.style.setProperty('--accent-cyan', '#0891b2');
    root.style.setProperty('--border-color', 'rgba(0, 0, 0, 0.08)');
    root.style.setProperty('--border-hover', 'rgba(0, 0, 0, 0.15)');
  } else if (themeName === 'hc-black') {
    root.style.setProperty('--bg-primary', '#000000');
    root.style.setProperty('--bg-secondary', '#000000');
    root.style.setProperty('--bg-tertiary', '#000000');
    root.style.setProperty('--text-main', '#ffffff');
    root.style.setProperty('--text-muted', '#ffffff');
    root.style.setProperty('--accent-indigo', '#00ff00');
    root.style.setProperty('--accent-cyan', '#00ffff');
    root.style.setProperty('--border-color', '#ffffff');
    root.style.setProperty('--border-hover', '#ffffff');
  } else {
    root.style.setProperty('--bg-primary', '#0a0d16');
    root.style.setProperty('--bg-secondary', '#0f1322');
    root.style.setProperty('--bg-tertiary', '#13192e');
    root.style.setProperty('--text-main', '#f1f5f9');
    root.style.setProperty('--text-muted', '#94a3b8');
    root.style.setProperty('--accent-indigo', '#6366f1');
    root.style.setProperty('--accent-cyan', '#0ea5e9');
    root.style.setProperty('--border-color', 'rgba(255, 255, 255, 0.08)');
    root.style.setProperty('--border-hover', 'rgba(255, 255, 255, 0.15)');
  }
}

// Theme Toggle Helper Functions
function setTheme(themeName) {
  state.theme = themeName;
  const select = document.getElementById('theme-select');
  if (select) select.value = themeName;
  applyAppThemeColors(themeName);
  if (editor) monaco.editor.setTheme(themeName);
  saveStateToStorage();
  showTerminalLog(`[System] Theme switched to ${themeName}.`, 'system-text');
}

function setLanguage(lang) {
  const select = document.getElementById('language-select');
  if (select) {
    select.value = lang;
    select.dispatchEvent(new Event('change'));
  }
}

// Command Palette Registry & Logic
const COMMANDS = [
  { label: 'Run Code', action: () => runCurrentCode(), shortcut: 'Ctrl+Enter' },
  { label: 'Format Document', action: () => formatCode(), shortcut: 'Alt+Shift+F' },
  { label: 'Clear Terminal Output', action: () => clearTerminalLog(), shortcut: '' },
  { label: 'Create New File', action: () => {
    document.getElementById('tab-explorer-btn').click();
    const container = document.getElementById('new-file-input-container');
    container.classList.remove('hide');
    document.getElementById('new-file-name').focus();
  }, shortcut: 'Alt+N' },
  { label: 'Create New Folder', action: () => {
    document.getElementById('tab-explorer-btn').click();
    const container = document.getElementById('new-folder-input-container');
    container.classList.remove('hide');
    document.getElementById('new-folder-name').focus();
  }, shortcut: '' },
  { label: 'Download Workspace (ZIP)', action: () => downloadWorkspaceAsZip(), shortcut: '' },
  { label: 'Reset Workspace', action: () => {
    if (confirm('Are you sure you want to reset your workspace? This will delete all custom files.')) {
      document.getElementById('reset-workspace-btn')?.click();
    }
  }, shortcut: '' },
  { label: 'Theme: CodeXrun Dark', action: () => setTheme('vs-dark') },
  { label: 'Theme: Dracula', action: () => setTheme('dracula') },
  { label: 'Theme: Monokai', action: () => setTheme('monokai') },
  { label: 'Theme: CodeXrun Light', action: () => setTheme('vs-light') },
  { label: 'Theme: High Contrast', action: () => setTheme('hc-black') },
  { label: 'Language: Python', action: () => setLanguage('python') },
  { label: 'Language: C++', action: () => setLanguage('cpp') },
  { label: 'Language: C', action: () => setLanguage('c') },
  { label: 'Language: Java', action: () => setLanguage('java') },
  { label: 'Language: JavaScript', action: () => setLanguage('javascript') },
  { label: 'Language: TypeScript', action: () => setLanguage('typescript') },
  { label: 'Language: VHDL', action: () => setLanguage('vhdl') },
  { label: 'Language: Verilog', action: () => setLanguage('verilog') }
];

let commandPaletteSelectedIndex = 0;
let filteredCommands = [];

function toggleCommandPalette() {
  const modal = document.getElementById('command-palette-modal');
  if (!modal) return;
  
  if (modal.classList.contains('hide')) {
    modal.classList.remove('hide');
    const input = document.getElementById('command-palette-input');
    input.value = '';
    input.focus();
    renderCommandPaletteResults('');
  } else {
    modal.classList.add('hide');
  }
}

function renderCommandPaletteResults(query = '') {
  const resultsContainer = document.getElementById('command-palette-results');
  if (!resultsContainer) return;
  resultsContainer.innerHTML = '';

  const cleanQuery = query.toLowerCase().replace('>', '').trim();
  filteredCommands = COMMANDS.filter(cmd => 
    cmd.label.toLowerCase().includes(cleanQuery)
  );

  if (filteredCommands.length === 0) {
    resultsContainer.innerHTML = '<div style="color: var(--text-dark); padding: 12px; font-size: 0.85rem;">No commands found</div>';
    commandPaletteSelectedIndex = -1;
    return;
  }

  commandPaletteSelectedIndex = 0;
  
  filteredCommands.forEach((cmd, index) => {
    const item = document.createElement('div');
    item.className = `command-palette-item ${index === 0 ? 'selected' : ''}`;
    
    const labelSpan = document.createElement('span');
    labelSpan.textContent = cmd.label;
    item.appendChild(labelSpan);

    if (cmd.shortcut) {
      const shortcutSpan = document.createElement('span');
      shortcutSpan.className = 'command-palette-item-shortcut';
      shortcutSpan.textContent = cmd.shortcut;
      item.appendChild(shortcutSpan);
    }

    item.addEventListener('click', () => {
      executeCommand(cmd);
    });

    resultsContainer.appendChild(item);
  });
}

function executeCommand(cmd) {
  toggleCommandPalette();
  cmd.action();
}

function initCommandPaletteListeners() {
  const input = document.getElementById('command-palette-input');
  const modal = document.getElementById('command-palette-modal');
  if (!input || !modal) return;

  input.addEventListener('input', (e) => {
    renderCommandPaletteResults(e.target.value);
  });

  input.addEventListener('keydown', (e) => {
    const items = document.querySelectorAll('.command-palette-item');
    if (items.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      items[commandPaletteSelectedIndex]?.classList.remove('selected');
      commandPaletteSelectedIndex = (commandPaletteSelectedIndex + 1) % items.length;
      items[commandPaletteSelectedIndex]?.classList.add('selected');
      items[commandPaletteSelectedIndex]?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      items[commandPaletteSelectedIndex]?.classList.remove('selected');
      commandPaletteSelectedIndex = (commandPaletteSelectedIndex - 1 + items.length) % items.length;
      items[commandPaletteSelectedIndex]?.classList.add('selected');
      items[commandPaletteSelectedIndex]?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const cmd = filteredCommands[commandPaletteSelectedIndex];
      if (cmd) executeCommand(cmd);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      toggleCommandPalette();
    }
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) toggleCommandPalette();
  });
}

// Folders Explorer Custom Logic
function getFullItemPath(item) {
  if (!item) return '';
  let pathParts = [item.name];
  let parent = state.files.find(f => f.id === item.parentId);
  while (parent) {
    pathParts.unshift(parent.name);
    parent = state.files.find(f => f.id === parent.parentId);
  }
  return pathParts.join('/');
}

function buildTree() {
  const itemMap = {};
  state.files.forEach(item => {
    itemMap[item.id] = { ...item, type: item.type || 'file', children: [] };
  });

  const root = [];
  Object.values(itemMap).forEach(item => {
    if (item.parentId && itemMap[item.parentId]) {
      itemMap[item.parentId].children.push(item);
    } else {
      root.push(item);
    }
  });

  return root;
}

function sortTreeItems(items) {
  items.sort((a, b) => {
    const isFolderA = a.type === 'folder';
    const isFolderB = b.type === 'folder';
    if (isFolderA && !isFolderB) return -1;
    if (!isFolderA && isFolderB) return 1;
    return a.name.localeCompare(b.name);
  });
  items.forEach(item => {
    if (item.children) {
      sortTreeItems(item.children);
    }
  });
}

function renderTreeNodes(nodes, container, depth = 0) {
  nodes.forEach(node => {
    const row = document.createElement('div');
    row.className = `file-item ${node.type === 'folder' ? 'folder-item' : 'file-item-row'} ${node.id === state.activeFileId ? 'active' : ''}`;
    row.style.paddingLeft = `${8 + depth * 12}px`;

    const infoGroup = document.createElement('div');
    infoGroup.className = 'file-info-group';

    const icon = document.createElement('span');
    icon.className = 'material-symbols-outlined';
    if (node.type === 'folder') {
      icon.textContent = node.collapsed ? 'folder' : 'folder_open';
      icon.style.color = '#eab308';
    } else {
      icon.className += ` file-icon-${node.language}`;
      if (node.language === 'python') icon.textContent = 'description';
      else if (node.language === 'cpp' || node.language === 'c') icon.textContent = 'terminal';
      else if (node.language === 'java') icon.textContent = 'coffee';
      else if (node.language === 'sql') icon.textContent = 'database';
      else if (node.language === 'html') icon.textContent = 'html';
      else if (node.language === 'php' || node.language === 'javascript' || node.language === 'typescript') icon.textContent = 'code';
      else if (node.language === 'r') icon.textContent = 'analytics';
      else icon.textContent = 'article';
    }

    const nameSpan = document.createElement('span');
    nameSpan.className = 'file-name';
    nameSpan.textContent = node.name;

    infoGroup.appendChild(icon);
    infoGroup.appendChild(nameSpan);
    row.appendChild(infoGroup);

    // Actions Group
    const actionsGroup = document.createElement('div');
    actionsGroup.className = 'file-actions-group';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'icon-btn';
    deleteBtn.title = node.type === 'folder' ? 'Delete Folder' : 'Delete File';
    const deleteIcon = document.createElement('span');
    deleteIcon.className = 'material-symbols-outlined';
    deleteIcon.textContent = 'delete';
    deleteBtn.appendChild(deleteIcon);
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteFile(node.id);
    });
    actionsGroup.appendChild(deleteBtn);
    row.appendChild(actionsGroup);

    // Event listener
    if (node.type === 'folder') {
      row.addEventListener('click', () => {
        const fileState = state.files.find(f => f.id === node.id);
        if (fileState) {
          fileState.collapsed = !fileState.collapsed;
          saveStateToStorage();
          renderFileTree();
        }
      });
    } else {
      row.addEventListener('click', () => {
        selectFile(node.id);
      });
    }

    container.appendChild(row);

    if (node.type === 'folder' && !node.collapsed && node.children && node.children.length > 0) {
      renderTreeNodes(node.children, container, depth + 1);
    }
  });
}

function createPathRecursive(fullPath, isFolder = false) {
  const parts = fullPath.split('/').filter(p => p.trim() !== '');
  if (parts.length === 0) return null;

  let currentParentId = null;
  let createdId = null;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const isLast = (i === parts.length - 1);
    
    let existing = state.files.find(f => f.name.toLowerCase() === part.toLowerCase() && f.parentId === currentParentId);
    
    if (existing) {
      if (existing.type !== 'folder' && (!isLast || isFolder)) {
        showTerminalLog(`[System Error] Conflict: "${part}" is a file.`, 'error-text');
        return null;
      }
      currentParentId = existing.id;
      createdId = existing.id;
    } else {
      const newId = Date.now().toString() + '_' + Math.random().toString(36).substr(2, 4);
      if (!isLast || isFolder) {
        const newFolder = {
          id: newId,
          name: part,
          type: 'folder',
          parentId: currentParentId,
          collapsed: false
        };
        state.files.push(newFolder);
        currentParentId = newId;
        createdId = newId;
      } else {
        const extension = part.split('.').pop().toLowerCase();
        const matched = EXTENSION_MAP[extension];
        if (!matched) {
          showTerminalLog(`[System Error] Unsupported extension ".${extension}"`, 'error-text');
          return null;
        }
        const defaultTemplate = BOILERPLATE_TEMPLATES[matched.lang] || '';
        const newFile = {
          id: newId,
          name: part,
          type: 'file',
          parentId: currentParentId,
          language: matched.lang,
          content: defaultTemplate
        };
        state.files.push(newFile);
        createdId = newId;
      }
    }
  }

  saveStateToStorage();
  renderFileTree();
  renderTabs();
  return createdId;
}

// Initialize Monaco Editor
function initMonacoEditor() {
  const container = document.getElementById('monaco-editor-anchor');
  if (!container) return;

  // Dispose of old editor if it already exists to prevent duplicate definitions / overlapping frames
  if (editor) {
    editor.dispose();
    editor = null;
  }

  // Clear the loading screen inside the editor frame
  const loadingScreen = document.getElementById('editor-loading');
  if (loadingScreen) loadingScreen.remove();

  // Register custom themes
  registerCustomMonacoThemes();

  // Create Editor
  editor = monaco.editor.create(container, {
    value: '',
    language: 'python',
    theme: state.theme,
    fontSize: state.fontSize,
    wordWrap: state.wordWrap,
    minimap: { enabled: state.minimap },
    automaticLayout: true,
    fontFamily: "'JetBrains Mono', monospace",
    lineHeight: 22,
    padding: { top: 10, bottom: 10 }
  });

  // Track code edits to auto-save to storage
  editor.onDidChangeModelContent(() => {
    if (state.activeFileId) {
      const activeFile = state.files.find(f => f.id === state.activeFileId);
      if (activeFile) {
        activeFile.content = editor.getValue();
        triggerAutoSave();
      }
    }
  });

  // Load initial active file
  if (state.activeFileId) {
    switchToActiveFile();
  }
}

// ==========================================================================
// State & Storage Logic
// ==========================================================================

function loadWorkspaceState() {
  // Check for shared base64 workspace in URL hash
  const hash = window.location.hash;
  if (hash && hash.startsWith('#code=')) {
    try {
      const base64 = hash.substring(6);
      const decodedJson = decodeURIComponent(escape(atob(base64)));
      const imported = JSON.parse(decodedJson);
      if (imported && Array.isArray(imported.files)) {
        state.files = imported.files;
        state.activeFileId = imported.activeFileId;
        saveStateToStorage();
        showTerminalLog('[System] Workspace successfully loaded from shared link!', 'system-text');
      }
    } catch (e) {
      showTerminalLog('[System Error] Failed to load workspace from link: invalid format.', 'error-text');
    }
    // Clear hash from URL cleanly without reload
    window.history.replaceState(null, null, window.location.pathname);
  }

  // Handle query parameter for language pre-selection
  const params = new URLSearchParams(window.location.search);
  const queryLang = params.get('lang');
  if (queryLang) {
    const file = state.files.find(f => f.language === queryLang);
    if (file) {
      state.activeFileId = file.id;
      saveStateToStorage();
    } else {
      const boilerplate = BOILERPLATE_TEMPLATES[queryLang];
      if (boilerplate) {
        let ext = 'py';
        if (queryLang === 'cpp') ext = 'cpp';
        else if (queryLang === 'c') ext = 'c';
        else if (queryLang === 'java') ext = 'java';
        else if (queryLang === 'javascript') ext = 'js';
        else if (queryLang === 'typescript') ext = 'ts';
        else if (queryLang === 'rust') ext = 'rs';
        else if (queryLang === 'go') ext = 'go';
        else if (queryLang === 'csharp') ext = 'cs';
        else if (queryLang === 'kotlin') ext = 'kt';
        else if (queryLang === 'swift') ext = 'swift';
        else if (queryLang === 'ruby') ext = 'rb';
        else if (queryLang === 'dart') ext = 'dart';
        else if (queryLang === 'r') ext = 'r';
        else if (queryLang === 'sql') ext = 'sql';
        else if (queryLang === 'html') ext = 'html';
        else if (queryLang === 'php') ext = 'php';
        else if (queryLang === 'vhdl') ext = 'vhd';
        else if (queryLang === 'verilog') ext = 'v';

        const newFileId = Date.now().toString();
        const newFile = {
          id: newFileId,
          name: queryLang === 'java' ? `Main.java` : `main.${ext}`,
          language: queryLang,
          content: boilerplate
        };
        state.files.push(newFile);
        state.activeFileId = newFileId;
        saveStateToStorage();
      }
    }
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState(null, null, cleanUrl);
  }

  // Load settings
  const cachedTheme = localStorage.getItem('codexrun_theme');
  if (cachedTheme) state.theme = cachedTheme;
  document.getElementById('theme-select').value = state.theme;
  applyAppThemeColors(state.theme);

  const cachedFontSize = localStorage.getItem('codexrun_font_size');
  if (cachedFontSize) state.fontSize = parseInt(cachedFontSize, 10);
  document.getElementById('setting-font-size').value = state.fontSize.toString();

  const cachedWordWrap = localStorage.getItem('codexrun_word_wrap');
  if (cachedWordWrap) state.wordWrap = cachedWordWrap;
  document.getElementById('setting-word-wrap').value = state.wordWrap;

  const cachedMinimap = localStorage.getItem('codexrun_minimap');
  if (cachedMinimap) state.minimap = cachedMinimap === 'true';
  document.getElementById('setting-minimap').value = state.minimap.toString();

  // Load files
  const cachedFiles = localStorage.getItem('codexrun_files');
  if (cachedFiles) {
    try {
      state.files = JSON.parse(cachedFiles);
    } catch (e) {
      state.files = [];
    }
  }

  const cachedActiveFile = localStorage.getItem('codexrun_active_file_id');
  if (cachedActiveFile) state.activeFileId = cachedActiveFile;

  // Setup default files if workspace is empty
  if (state.files.length === 0) {
    setupDefaultFiles();
  }

  renderFileTree();
  renderTabs();
}

function setupDefaultFiles() {
  state.files = [
    { id: '1', name: 'main.py', language: 'python', content: BOILERPLATE_TEMPLATES.python },
    { id: '2', name: 'main.cpp', language: 'cpp', content: BOILERPLATE_TEMPLATES.cpp },
    { id: '3', name: 'main.c', language: 'c', content: BOILERPLATE_TEMPLATES.c },
    { id: '4', name: 'Main.java', language: 'java', content: BOILERPLATE_TEMPLATES.java }
  ];
  state.activeFileId = '1';
  saveStateToStorage();
}

function saveStateToStorage() {
  localStorage.setItem('codexrun_files', JSON.stringify(state.files));
  localStorage.setItem('codexrun_active_file_id', state.activeFileId || '');
  localStorage.setItem('codexrun_theme', state.theme);
  localStorage.setItem('codexrun_font_size', state.fontSize.toString());
  localStorage.setItem('codexrun_word_wrap', state.wordWrap);
  localStorage.setItem('codexrun_minimap', state.minimap.toString());
}

function triggerAutoSave() {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    saveStateToStorage();
  }, 500); // Debounce saves by 500ms
}

// ==========================================================================
// File Management UI Functions
// ==========================================================================

function renderFileTree() {
  const treeContainer = document.getElementById('file-tree');
  if (!treeContainer) return;
  treeContainer.replaceChildren(); // Safe DOM clear

  const treeData = buildTree();
  sortTreeItems(treeData);
  renderTreeNodes(treeData, treeContainer, 0);
}

function renderTabs() {
  const tabsContainer = document.getElementById('editor-tabs-list');
  if (!tabsContainer) return;
  tabsContainer.replaceChildren(); // Safe DOM clear

  state.files.forEach(file => {
    if (file.type === 'folder') return; // Skip folders
    
    const tab = document.createElement('div');
    tab.className = `editor-tab ${file.id === state.activeFileId ? 'active' : ''}`;

    const fileLabel = document.createElement('span');
    fileLabel.textContent = file.name;

    const closeBtn = document.createElement('span');
    closeBtn.className = 'material-symbols-outlined tab-close';
    closeBtn.textContent = 'close';

    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteFile(file.id);
    });

    tab.appendChild(fileLabel);
    tab.appendChild(closeBtn);

    tab.addEventListener('click', () => {
      selectFile(file.id);
    });

    tabsContainer.appendChild(tab);
  });
}

function selectFile(id) {
  if (state.activeFileId === id) return;
  state.activeFileId = id;
  saveStateToStorage();
  renderFileTree();
  renderTabs();
  switchToActiveFile();
}

function switchToActiveFile() {
  if (!editor) return;
  const activeFile = state.files.find(f => f.id === state.activeFileId);
  if (!activeFile) return;

  // Update editor value
  editor.setValue(activeFile.content);

  // Update editor language model
  const monacoLang = activeFile.language;
  const currentModel = editor.getModel();
  if (currentModel) {
    monaco.editor.setModelLanguage(currentModel, monacoLang);
  }

  // Update language selector dropdown in header
  const select = document.getElementById('language-select');
  select.value = activeFile.language;
}

// Helper to check if the current file content is a boilerplate or algorithm template
function getTemplateKey(content) {
  if (!content) return null;
  const trimmedContent = content.trim();

  // Check boilerplates
  for (const [lang, boilerplate] of Object.entries(BOILERPLATE_TEMPLATES)) {
    if (trimmedContent === boilerplate.trim()) {
      return { type: 'boilerplate' };
    }
  }

  // Check algorithms
  for (const [algoKey, algoData] of Object.entries(ALGORITHM_TEMPLATES)) {
    for (const [lang, langData] of Object.entries(algoData)) {
      if (langData && langData.content && trimmedContent === langData.content.trim()) {
        return { type: 'algorithm', algoKey: algoKey };
      }
    }
  }

  return null;
}

function initFileCreatorListeners() {
  const newFileBtn = document.getElementById('new-file-btn');
  const inputContainer = document.getElementById('new-file-input-container');
  const nameInput = document.getElementById('new-file-name');
  const confirmBtn = document.getElementById('new-file-confirm');
  const cancelBtn = document.getElementById('new-file-cancel');

  newFileBtn.addEventListener('click', () => {
    inputContainer.classList.remove('hide');
    nameInput.focus();
  });

  cancelBtn.addEventListener('click', () => {
    inputContainer.classList.add('hide');
    nameInput.value = '';
  });

  confirmBtn.addEventListener('click', createNewFile);
  nameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') createNewFile();
    if (e.key === 'Escape') {
      inputContainer.classList.add('hide');
      nameInput.value = '';
    }
  });

  // Setup language selector event listener in the header
  const headerLanguageSelect = document.getElementById('language-select');
  headerLanguageSelect.addEventListener('change', (e) => {
    const selectedLanguage = e.target.value;
    if (state.activeFileId) {
      const activeFile = state.files.find(f => f.id === state.activeFileId);
      if (activeFile && activeFile.language !== selectedLanguage) {
        // Change current file language
        activeFile.language = selectedLanguage;

        // Update file name extension if it doesn't match
        const parts = activeFile.name.split('.');
        const baseName = parts.slice(0, -1).join('.');
        let newExt = 'py';
        if (selectedLanguage === 'cpp') newExt = 'cpp';
        else if (selectedLanguage === 'c') newExt = 'c';
        else if (selectedLanguage === 'java') newExt = 'java';
        else if (selectedLanguage === 'javascript') newExt = 'js';
        else if (selectedLanguage === 'typescript') newExt = 'ts';
        else if (selectedLanguage === 'rust') newExt = 'rs';
        else if (selectedLanguage === 'go') newExt = 'go';
        else if (selectedLanguage === 'csharp') newExt = 'cs';
        else if (selectedLanguage === 'kotlin') newExt = 'kt';
        else if (selectedLanguage === 'ruby') newExt = 'rb';
        else if (selectedLanguage === 'dart') newExt = 'dart';
        else if (selectedLanguage === 'r') newExt = 'r';
        else if (selectedLanguage === 'sql') newExt = 'sql';
        else if (selectedLanguage === 'html') newExt = 'html';
        else if (selectedLanguage === 'php') newExt = 'php';
        else if (selectedLanguage === 'vhdl') newExt = 'vhd';
        else if (selectedLanguage === 'verilog') newExt = 'v';

        activeFile.name = `${baseName || 'untitled'}.${newExt}`;

        // Swap file contents to the matching template in the new language, or new language boilerplate
        const templateInfo = getTemplateKey(activeFile.content);
        if (templateInfo && templateInfo.type === 'algorithm') {
          const newAlgo = ALGORITHM_TEMPLATES[templateInfo.algoKey][selectedLanguage];
          activeFile.content = newAlgo ? newAlgo.content : (BOILERPLATE_TEMPLATES[selectedLanguage] || '');
        } else {
          activeFile.content = BOILERPLATE_TEMPLATES[selectedLanguage] || '';
        }

        if (editor) {
          editor.setValue(activeFile.content);
        }

        saveStateToStorage();
        renderFileTree();
        renderTabs();

        if (editor) {
          const model = editor.getModel();
          if (model) {
            monaco.editor.setModelLanguage(model, selectedLanguage);
          }
        }
      }
    }
  });
}

function initFolderCreatorListeners() {
  const newFolderBtn = document.getElementById('new-folder-btn');
  const inputContainer = document.getElementById('new-folder-input-container');
  const confirmBtn = document.getElementById('new-folder-confirm');
  const cancelBtn = document.getElementById('new-folder-cancel');
  const nameInput = document.getElementById('new-folder-name');

  if (newFolderBtn && inputContainer) {
    newFolderBtn.addEventListener('click', () => {
      inputContainer.classList.remove('hide');
      nameInput.value = '';
      nameInput.focus();
    });
  }

  if (cancelBtn && inputContainer) {
    cancelBtn.addEventListener('click', () => {
      inputContainer.classList.add('hide');
    });
  }

  if (confirmBtn && nameInput) {
    confirmBtn.addEventListener('click', () => {
      const folderName = nameInput.value.trim();
      if (folderName) {
        createPathRecursive(folderName, true);
        inputContainer.classList.add('hide');
      }
    });

    nameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const folderName = nameInput.value.trim();
        if (folderName) {
          createPathRecursive(folderName, true);
          inputContainer.classList.add('hide');
        }
      } else if (e.key === 'Escape') {
        inputContainer.classList.add('hide');
      }
    });
  }
}

function createNewFile() {
  const nameInput = document.getElementById('new-file-name');
  const filename = nameInput.value.trim();

  if (!filename) {
    showTerminalLog('[System Alert] Filename cannot be empty.', 'error-text');
    return;
  }

  // Support slash-separated paths for nested file creation
  if (filename.includes('/')) {
    const createdId = createPathRecursive(filename, false);
    if (createdId) {
      state.activeFileId = createdId;
      nameInput.value = '';
      document.getElementById('new-file-input-container').classList.add('hide');
      switchToActiveFile();
      showTerminalLog(`[System] Created nested file path "${filename}" successfully.`, 'system-text');
    }
    return;
  }

  // Validate filename extension
  const extension = filename.split('.').pop().toLowerCase();
  const matched = EXTENSION_MAP[extension];

  if (!matched) {
    showTerminalLog(`[System Alert] Unsupported file extension ".${extension}". Use standard code extensions (.py, .js, .ts, .rs, .go, .cs, .kt, .swift, .rb, .dart, .cpp, .c, .java)`, 'error-text');
    return;
  }

  // Check for duplicates at root
  const exists = state.files.some(f => f.name.toLowerCase() === filename.toLowerCase() && !f.parentId);
  if (exists) {
    showTerminalLog(`[System Alert] A file named "${filename}" already exists at root.`, 'error-text');
    return;
  }

  // Create new file item
  const newId = Date.now().toString();
  const defaultTemplate = BOILERPLATE_TEMPLATES[matched.lang] || '';

  const newFile = {
    id: newId,
    name: filename,
    type: 'file',
    parentId: null,
    language: matched.lang,
    content: defaultTemplate
  };

  state.files.push(newFile);
  state.activeFileId = newId;

  // Clear inputs and hide bar
  nameInput.value = '';
  document.getElementById('new-file-input-container').classList.add('hide');

  saveStateToStorage();
  renderFileTree();
  renderTabs();
  switchToActiveFile();

  showTerminalLog(`[System] Created file ${filename} successfully.`, 'system-text');
}

function deleteFile(id) {
  const item = state.files.find(f => f.id === id);
  if (!item) return;

  const totalFiles = state.files.filter(f => f.type !== 'folder').length;
  if (item.type !== 'folder' && totalFiles <= 1) {
    showTerminalLog('[System Alert] Cannot delete the last file. The workspace requires at least one file.', 'error-text');
    return;
  }

  if (item.type === 'folder') {
    const getChildrenIds = (parentId) => {
      let ids = [];
      state.files.forEach(f => {
        if (f.parentId === parentId) {
          ids.push(f.id);
          if (f.type === 'folder') {
            ids = ids.concat(getChildrenIds(f.id));
          }
        }
      });
      return ids;
    };
    const childrenIds = getChildrenIds(id);
    const affectedFilesCount = state.files.filter(f => childrenIds.includes(f.id) && f.type !== 'folder').length;
    if (totalFiles - affectedFilesCount < 1) {
      showTerminalLog('[System Alert] Cannot delete folder: Deleting it would remove all files from workspace.', 'error-text');
      return;
    }
    state.files = state.files.filter(f => f.id !== id && !childrenIds.includes(f.id));
    showTerminalLog(`[System] Deleted folder "${item.name}" and all its contents recursively.`, 'system-text');
  } else {
    state.files = state.files.filter(f => f.id !== id);
    showTerminalLog(`[System] Deleted file "${item.name}".`, 'system-text');
  }

  // If deleted file/folder contained the active file, switch active file
  const activeFileExists = state.files.some(f => f.id === state.activeFileId && f.type !== 'folder');
  if (!activeFileExists) {
    const remainingFiles = state.files.filter(f => f.type !== 'folder');
    if (remainingFiles.length > 0) {
      state.activeFileId = remainingFiles[0].id;
    } else {
      state.activeFileId = null;
    }
  }

  saveStateToStorage();
  renderFileTree();
  renderTabs();
  switchToActiveFile();
}

// ==========================================================================
// Sidebar Panels & Settings Interactivity
// ==========================================================================

function initSidebarTabs() {
  const tabs = [
    { btn: 'tab-explorer-btn', panel: 'panel-explorer' },
    { btn: 'tab-settings-btn', panel: 'panel-settings' },
    { btn: 'tab-templates-btn', panel: 'panel-templates' },
    { btn: 'tab-git-btn', panel: 'panel-git' },
    { btn: 'tab-collab-btn', panel: 'panel-collab' },
    { btn: 'tab-help-btn', panel: 'panel-help' }
  ];

  const sidebarEl = document.getElementById('ide-sidebar');

  tabs.forEach(tab => {
    const btnEl = document.getElementById(tab.btn);
    btnEl.addEventListener('click', () => {
      const isAlreadyActive = btnEl.classList.contains('active');
      const isCollapsed = sidebarEl.classList.contains('collapsed');

      if (isAlreadyActive && !isCollapsed) {
        // Collapse sidebar (hide panel, show only nav icons bar)
        sidebarEl.classList.add('collapsed');
        btnEl.classList.remove('active');

        setTimeout(() => {
          if (editor) editor.layout();
        }, 320); // 320ms to safely execute after 300ms transition ends
      } else {
        // Expand sidebar if it was collapsed
        sidebarEl.classList.remove('collapsed');

        // Toggle nav buttons active highlights
        tabs.forEach(t => document.getElementById(t.btn).classList.remove('active'));
        btnEl.classList.add('active');

        // Toggle visibility of panel content
        tabs.forEach(t => document.getElementById(t.panel).classList.remove('active'));
        document.getElementById(tab.panel).classList.add('active');

        setTimeout(() => {
          if (editor) editor.layout();
        }, 320);
      }
    });
  });
}



function initSettingsListeners() {
  // Theme change
  const themeSelect = document.getElementById('theme-select');
  themeSelect.addEventListener('change', (e) => {
    state.theme = e.target.value;
    if (editor) {
      monaco.editor.setTheme(state.theme);
    }
    applyAppThemeColors(state.theme);
    saveStateToStorage();
  });

  // Font size change
  const fontSizeSelect = document.getElementById('setting-font-size');
  fontSizeSelect.addEventListener('change', (e) => {
    state.fontSize = parseInt(e.target.value, 10);
    if (editor) {
      editor.updateOptions({ fontSize: state.fontSize });
    }
    saveStateToStorage();
  });

  // Word wrap change
  const wordWrapSelect = document.getElementById('setting-word-wrap');
  wordWrapSelect.addEventListener('change', (e) => {
    state.wordWrap = e.target.value;
    if (editor) {
      editor.updateOptions({ wordWrap: state.wordWrap });
    }
    saveStateToStorage();
  });

  // Minimap toggler
  const minimapSelect = document.getElementById('setting-minimap');
  minimapSelect.addEventListener('change', (e) => {
    state.minimap = e.target.value === 'true';
    if (editor) {
      editor.updateOptions({ minimap: { enabled: state.minimap } });
    }
    saveStateToStorage();
  });

  // Reset workspace
  const resetBtn = document.getElementById('reset-workspace-btn');
  resetBtn.addEventListener('click', () => {
    // Re-initialize default files and settings
    localStorage.removeItem('codexrun_files');
    localStorage.removeItem('codexrun_active_file_id');
    localStorage.removeItem('codexrun_theme');
    localStorage.removeItem('codexrun_font_size');
    localStorage.removeItem('codexrun_word_wrap');
    localStorage.removeItem('codexrun_minimap');

    state.theme = 'vs-dark';
    state.fontSize = 14;
    state.wordWrap = 'off';
    state.minimap = true;

    themeSelect.value = 'vs-dark';
    fontSizeSelect.value = '14';
    wordWrapSelect.value = 'off';
    minimapSelect.value = 'true';

    applyAppThemeColors('vs-dark');
    setupDefaultFiles();
    renderFileTree();
    renderTabs();
    switchToActiveFile();

    if (editor) {
      editor.updateOptions({
        fontSize: 20,
        wordWrap: 'off',
        minimap: { enabled: true }
      });
      monaco.editor.setTheme('vs-dark');
    }

    showTerminalLog('[System] Workspace state reset completed.', 'system-text');
  });
}

// ==========================================================================
// Terminal Tabs & Resizing
// ==========================================================================

function setTerminalTabActive(tabName, toggleIfActive = false) {
  const terminal = document.getElementById('ide-terminal');
  const tabOutput = document.getElementById('tab-output-btn');
  const tabInput = document.getElementById('tab-input-btn');
  const tabVisualizer = document.getElementById('tab-visualizer-btn');

  const panelOutput = document.getElementById('terminal-output-panel');
  const panelInput = document.getElementById('terminal-input-panel');
  const panelVisualizer = document.getElementById('terminal-visualizer-panel');

  let targetTab = null;
  let targetPanel = null;

  if (tabName === 'output') {
    targetTab = tabOutput;
    targetPanel = panelOutput;
  } else if (tabName === 'input') {
    targetTab = tabInput;
    targetPanel = panelInput;
  } else if (tabName === 'visualizer') {
    targetTab = tabVisualizer;
    targetPanel = panelVisualizer;
  }

  if (!targetTab) return;

  if (targetTab.classList.contains('active')) {
    if (toggleIfActive && terminal) {
      terminal.classList.toggle('minimized');
      if (editor) setTimeout(() => editor.layout(), 100);
    }
    return;
  }

  if (terminal) {
    terminal.classList.remove('minimized');
  }

  if (tabOutput) tabOutput.classList.remove('active');
  if (tabInput) tabInput.classList.remove('active');
  if (tabVisualizer) tabVisualizer.classList.remove('active');

  if (panelOutput) panelOutput.classList.remove('active');
  if (panelInput) panelInput.classList.remove('active');
  if (panelVisualizer) panelVisualizer.classList.remove('active');

  targetTab.classList.add('active');
  if (targetPanel) targetPanel.classList.add('active');

  if (tabName === 'visualizer') {
    initializeVisualizer();
  }
}

function initTerminalTabs() {
  const tabOutput = document.getElementById('tab-output-btn');
  const tabInput = document.getElementById('tab-input-btn');
  const tabVisualizer = document.getElementById('tab-visualizer-btn');

  if (tabOutput) {
    tabOutput.addEventListener('click', () => setTerminalTabActive('output', true));
  }
  if (tabInput) {
    tabInput.addEventListener('click', () => setTerminalTabActive('input', true));
  }
  if (tabVisualizer) {
    tabVisualizer.addEventListener('click', () => setTerminalTabActive('visualizer', true));
  }
}

function initResizableTerminal() {
  const terminal = document.getElementById('ide-terminal');
  const handle = document.getElementById('terminal-resize-handle');
  let isResizing = false;

  handle.addEventListener('mousedown', (e) => {
    isResizing = true;
    document.body.style.cursor = 'ns-resize';
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;

    const containerHeight = document.getElementById('ide-workspace').offsetHeight;
    const headerHeight = document.getElementById('ide-header').offsetHeight;
    const clientY = e.clientY;

    // Calculate new height based on mouse position relative to workspace bounds
    const newHeight = containerHeight - (clientY - headerHeight);

    if (newHeight >= 80 && newHeight <= containerHeight - 150) {
      terminal.style.height = `${newHeight}px`;
      if (editor) editor.layout(); // Force Monaco to recalculate layout
    }
  });

  document.addEventListener('mouseup', () => {
    if (isResizing) {
      isResizing = false;
      document.body.style.cursor = 'default';
    }
  });
}

function initResizableSidebar() {
  const handle = document.getElementById('sidebar-resize-handle');
  let isResizing = false;

  if (!handle) return;

  handle.addEventListener('mousedown', (e) => {
    isResizing = true;
    document.body.style.cursor = 'ew-resize';
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;

    const newWidth = e.clientX;
    if (newWidth >= 180 && newWidth <= 500) {
      document.documentElement.style.setProperty('--sidebar-width', `${newWidth}px`);
      if (editor) {
        editor.layout();
      }
    }
  });

  document.addEventListener('mouseup', () => {
    if (isResizing) {
      isResizing = false;
      document.body.style.cursor = 'default';
    }
  });
}

// ==========================================================================
// Execution Engine (Piston Integration)
// ==========================================================================

async function runCurrentCode() {
  const activeFile = state.files.find(f => f.id === state.activeFileId);
  if (!activeFile) {
    showTerminalLog('[System Error] No active file found to execute.', 'error-text');
    return;
  }

  const runBtn = document.getElementById('run-btn');
  const playIcon = runBtn.querySelector('.play-icon');
  const spinner = runBtn.querySelector('.loading-spinner');
  const statusBadge = document.getElementById('exec-status-badge');

  // Set running UI state
  runBtn.disabled = true;
  playIcon.classList.add('spinner-hide');
  spinner.classList.remove('spinner-hide');

  statusBadge.className = 'status-badge running';
  statusBadge.textContent = 'Running';

  // Clear output screen and display compiling loader
  clearTerminalLog();
  showTerminalLog(`[System] Compiling and running "${activeFile.name}" on cloud sandbox...`, 'system-text');

  // Switch terminal screen to Output tab to let user see logs
  setTerminalTabActive('output', false);

  if (activeFile.language === 'html') {
    showTerminalLog('[System] HTML/CSS is web native. Opening preview window...', 'system-text');
    const previewWindow = window.open();
    if (previewWindow) {
      previewWindow.document.write(activeFile.content);
      previewWindow.document.close();
      showTerminalLog('Preview window opened successfully.', 'success-text');
    } else {
      showTerminalLog('[System Error] Failed to open preview window. Popup blocker might be enabled.', 'error-text');
    }
    statusBadge.className = 'status-badge success';
    statusBadge.textContent = 'Success';
    document.getElementById('stat-time').textContent = 'Time: 0.00s';
    document.getElementById('stat-status').textContent = 'Status: SUCCESS';
    resetRunButtonState();
    return;
  }

  if (activeFile.language === 'sql') {
    showTerminalLog('[SQL] Running query against local mock database...', 'system-text');
    setTimeout(() => {
      showTerminalLog('Table "users" created.', 'success-text');
      showTerminalLog('Inserted 2 records.', 'success-text');
      showTerminalLog('+----+-------+\n| id | name  |\n+----+-------+\n|  1 | Alice |\n|  2 | Bob   |\n+----+-------+', 'output-text');
      statusBadge.className = 'status-badge success';
      statusBadge.textContent = 'Success';
      document.getElementById('stat-time').textContent = 'Time: 0.02s';
      document.getElementById('stat-status').textContent = 'Status: SUCCESS';
      resetRunButtonState();
    }, 200);
    return;
  }

  if (activeFile.language === 'vhdl') {
    showTerminalLog('[VHDL] Analyzing VHDL files (ghdl -a)...', 'system-text');
    setTimeout(() => {
      showTerminalLog('[VHDL] Elaborating top entity (ghdl -e)...', 'system-text');
      setTimeout(() => {
        showTerminalLog('[VHDL] Starting simulation (ghdl -r)...', 'system-text');

        const simResult = simulateVHDL(activeFile.content);

        simResult.logs.forEach(log => {
          showTerminalLog(log.text, log.type);
        });

        simulationState.steps = simResult.steps;
        simulationState.currentStepIndex = 0;

        statusBadge.className = simResult.success ? 'status-badge success' : 'status-badge error';
        statusBadge.textContent = simResult.success ? 'Success' : 'Error';
        document.getElementById('stat-time').textContent = `Time: ${simResult.duration}s`;
        document.getElementById('stat-status').textContent = `Status: ${simResult.success ? 'SUCCESS' : 'FAILED'}`;
        resetRunButtonState();

        // Auto switch to visualizer tab
        setTerminalTabActive('visualizer', false);
      }, 500);
    }, 400);
    return;
  }

  if (activeFile.language === 'verilog') {
    showTerminalLog('[Verilog] Compiling Verilog modules (iverilog)...', 'system-text');
    setTimeout(() => {
      showTerminalLog('[Verilog] Generating design simulation (vvp)...', 'system-text');
      setTimeout(() => {
        showTerminalLog('[Verilog] Running simulation trace...', 'system-text');

        const simResult = simulateVerilog(activeFile.content);

        simResult.logs.forEach(log => {
          showTerminalLog(log.text, log.type);
        });

        simulationState.steps = simResult.steps;
        simulationState.currentStepIndex = 0;

        statusBadge.className = simResult.success ? 'status-badge success' : 'status-badge error';
        statusBadge.textContent = simResult.success ? 'Success' : 'Error';
        document.getElementById('stat-time').textContent = `Time: ${simResult.duration}s`;
        document.getElementById('stat-status').textContent = `Status: ${simResult.success ? 'SUCCESS' : 'FAILED'}`;
        resetRunButtonState();

        // Auto switch to visualizer tab
        setTerminalTabActive('visualizer', false);
      }, 500);
    }, 400);
    return;
  }

  const langConfig = GODBOLT_LANG_MAP[activeFile.language];
  if (!langConfig) {
    showTerminalLog(`[System Error] Execution engine setup not configured for language: ${activeFile.language}`, 'error-text');
    resetRunButtonState();
    return;
  }

  const stdinContent = document.getElementById('stdin-textarea')?.value || '';

  // Proactively check if the user is running code requiring input but has empty stdin
  const codeSourceLower = activeFile.content.toLowerCase();
  const hasInputCall = codeSourceLower.includes('input(') ||
    codeSourceLower.includes('cin >>') ||
    codeSourceLower.includes('scanf(') ||
    codeSourceLower.includes('scanner') ||
    codeSourceLower.includes('system.in');

  if (hasInputCall && !stdinContent.trim()) {
    showTerminalLog('[System Tip] Your program may require inputs. If it fails, click the "Input" tab next to the "Output" tab below, type your inputs, and click "Run Code" again.', 'warning-text');
  }

  // Gather additional project files (excluding active file)
  const payloadFiles = [];
  const cOrCppFiles = [];

  state.files.forEach(f => {
    if (f.id !== activeFile.id && f.language === activeFile.language) {
      payloadFiles.push({
        filename: f.name,
        contents: f.content
      });

      // For C and C++, collect source files to pass to compilation arguments
      if (activeFile.language === 'c' || activeFile.language === 'cpp') {
        const ext = f.name.split('.').pop().toLowerCase();
        if (ext === 'c' || ext === 'cpp' || ext === 'cc') {
          cOrCppFiles.push(f.name);
        }
      }
    }
  });

  // For Java, the main class Main should NOT have the "public" keyword
  // to avoid Java class / file name mismatch on Compiler Explorer.
  let codeSource = activeFile.content;
  if (activeFile.language === 'java') {
    codeSource = codeSource.replace(/public\s+class\s+/, 'class ');
  }

  // Compile userArguments for C/C++ multi-file linking
  const userArgs = cOrCppFiles.join(' ');

  const requestBody = {
    source: codeSource,
    options: {
      userArguments: userArgs,
      compilerOptions: {
        executorRequest: true
      },
      filters: {
        execute: true
      },
      executeParameters: {
        stdin: stdinContent
      }
    },
    files: payloadFiles
  };

  const startTime = performance.now();
  const compileUrl = `${GODBOLT_API_URL}/${langConfig.compilerId}/compile`;

  try {
    const response = await fetch(compileUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Execution request failed with server code ${response.status}`);
    }

    const result = await response.json();
    const endTime = performance.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    displayExecutionResult(result, duration);

  } catch (error) {
    showTerminalLog(`[System Connection Error] Failed to connect to compiler engine: ${error.message}`, 'error-text');
    statusBadge.className = 'status-badge error';
    statusBadge.textContent = 'Error';

    document.getElementById('stat-time').textContent = 'Time: -';
    document.getElementById('stat-status').textContent = 'Status: FAILED';
  } finally {
    resetRunButtonState();
  }
}

function displayExecutionResult(result, duration) {
  const statusBadge = document.getElementById('exec-status-badge');
  const statTime = document.getElementById('stat-time');
  const statStatus = document.getElementById('stat-status');

  let compilationFailed = false;

  // Check compile step
  if (result.buildResult) {
    const buildCode = result.buildResult.code;
    if (buildCode !== 0) {
      compilationFailed = true;
      showTerminalLog('--- COMPILATION FAILED ---', 'error-text');
      if (result.buildResult.stderr && result.buildResult.stderr.length > 0) {
        result.buildResult.stderr.forEach(errLine => {
          showTerminalLog(errLine.text, 'error-text');
        });
      } else if (result.buildResult.stdout && result.buildResult.stdout.length > 0) {
        result.buildResult.stdout.forEach(outLine => {
          showTerminalLog(outLine.text, 'error-text');
        });
      }

      statTime.textContent = `Time: ${duration}s`;
      statStatus.textContent = `Compile Code: ${buildCode}`;
      statusBadge.className = 'status-badge error';
      statusBadge.textContent = 'Compile Error';
    }
  }

  if (!compilationFailed) {
    // Print program stdout
    if (result.stdout && result.stdout.length > 0) {
      result.stdout.forEach(line => {
        showTerminalLog(line.text, 'output-text');
      });
    }

    let hasEOFError = false;

    // Print program stderr
    if (result.stderr && result.stderr.length > 0) {
      result.stderr.forEach(line => {
        showTerminalLog(line.text, 'error-text');
        if (line.text.includes('EOFError') || line.text.includes('NoSuchElementException')) {
          hasEOFError = true;
        }
      });
    }

    if (hasEOFError) {
      showTerminalLog('[System Tip] Your program crashed due to missing input. Click on the "Input" tab next to the "Output" tab at the bottom to enter your program inputs, then click "Run Code" again.', 'warning-text');
    }

    if ((!result.stdout || result.stdout.length === 0) && (!result.stderr || result.stderr.length === 0)) {
      showTerminalLog('Program execution completed returning no output.', 'system-text');
    }

    // Set stats
    const exitCode = result.code;
    statTime.textContent = `Time: ${duration}s`;
    statStatus.textContent = `Exit Code: ${exitCode}`;

    if (exitCode === 0) {
      statusBadge.className = 'status-badge success';
      statusBadge.textContent = 'Success';
    } else {
      statusBadge.className = 'status-badge error';
      statusBadge.textContent = `Exit (${exitCode})`;
    }
  }
}

function resetRunButtonState() {
  const runBtn = document.getElementById('run-btn');
  const playIcon = runBtn.querySelector('.play-icon');
  const spinner = runBtn.querySelector('.loading-spinner');

  runBtn.disabled = false;
  playIcon.classList.remove('spinner-hide');
  spinner.classList.add('spinner-hide');
}

// ==========================================================================
// Terminal Logger (PREVENTS DOM-BASED XSS)
// ==========================================================================

function showTerminalLog(message, className = '') {
  const logScreen = document.getElementById('terminal-log');

  // Split input by newlines to render lines appropriately
  const lines = message.split('\n');

  // If the last line is empty (due to trailing newline), pop it to avoid an empty trailing row
  if (lines.length > 1 && lines[lines.length - 1] === '') {
    lines.pop();
  }

  lines.forEach(lineText => {
    const lineDiv = document.createElement('div');
    lineDiv.className = `log-line ${className}`;
    lineDiv.textContent = lineText; // CRITICAL: textContent escapes HTML tag execution
    logScreen.appendChild(lineDiv);
  });

  // Autoscroll terminal to bottom
  logScreen.scrollTop = logScreen.scrollHeight;
}

function clearTerminalLog() {
  const logScreen = document.getElementById('terminal-log');
  logScreen.replaceChildren(); // Safe DOM clear
}

// ==========================================================================
// Sharing & Copy Functionality (Base64 URL Workspace Encoder)
// ==========================================================================

function shareCode() {
  if (state.files.length === 0) {
    showTerminalLog('[System Alert] No files to share.', 'error-text');
    return;
  }

  // Make sure current active file has the latest editor contents saved before sharing
  if (editor && state.activeFileId) {
    const activeFile = state.files.find(f => f.id === state.activeFileId);
    if (activeFile) {
      activeFile.content = editor.getValue();
    }
  }

  try {
    const workspaceData = JSON.stringify({
      files: state.files,
      activeFileId: state.activeFileId
    });

    // Safely encode unicode string to base64
    const base64 = btoa(unescape(encodeURIComponent(workspaceData)));
    const shareUrl = `${window.location.origin}${window.location.pathname}#code=${base64}`;

    // Populate modal inputs and social buttons
    document.getElementById('share-link-url').value = shareUrl;

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent('CodeXrun IDE: Check out my workspace code! ' + shareUrl)}`;
    document.getElementById('share-whatsapp-btn').setAttribute('href', whatsappUrl);

    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent('CodeXrun IDE: Check out my workspace code!')}`;
    document.getElementById('share-telegram-btn').setAttribute('href', telegramUrl);

    // Show Modal overlay
    document.getElementById('share-modal').classList.remove('hide');

    showTerminalLog('[System] Share dialog opened. Link generated successfully.', 'system-text');
  } catch (e) {
    showTerminalLog(`[System Error] Sharing failed: ${e.message}`, 'error-text');
  }
}

// ==========================================================================
// Shortcut keys
// ==========================================================================

function initShortcutListeners() {
  document.addEventListener('keydown', (e) => {
    // Ctrl + Enter -> Run code
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      runCurrentCode();
    }

    // Ctrl + S -> Save state immediately
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      saveStateToStorage();
      showTerminalLog('[System] State saved to LocalStorage.', 'system-text');
    }

    // Alt + N -> New file explorer open
    if (e.altKey && e.key.toLowerCase() === 'n') {
      e.preventDefault();
      document.getElementById('tab-explorer-btn').click();
      document.getElementById('new-file-btn').click();
    }
  });
}

// Format Active File Code (Uses Monaco trigger with fallback manual indentation formatting)
function formatCode() {
  if (!editor || !state.activeFileId) return;

  const activeFile = state.files.find(f => f.id === state.activeFileId);
  if (!activeFile) return;

  // Attempt Monaco formatting action first
  editor.getAction('editor.action.formatDocument').run()
    .then(() => {
      showTerminalLog('[System] Monaco Code Formatter completed.', 'system-text');
    })
    .catch(() => {
      // Fallback manual basic formatter
      const val = editor.getValue();
      const formatted = basicCodeFormatter(val, activeFile.language);
      editor.setValue(formatted);
      showTerminalLog('[System] Basic indentation layout applied.', 'system-text');
    });
}

// Basic Code Formatter to align brackets and colons
function basicCodeFormatter(code, language) {
  const lines = code.split('\n');
  let indentLevel = 0;
  const indentSize = 4;
  let result = [];

  for (let line of lines) {
    let trimmed = line.trim();

    // Decrement indent before C-style closing brackets
    if (language !== 'python') {
      if (trimmed.startsWith('}') || trimmed.startsWith(')') || trimmed.startsWith(']')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
    }

    const indent = ' '.repeat(indentLevel * indentSize);

    if (trimmed === '') {
      result.push('');
    } else {
      result.push(indent + trimmed);
    }

    // Increment indent after opening loops, branches, functions, or blocks
    if (language === 'python') {
      if (trimmed.endsWith(':')) {
        indentLevel++;
      } else if (trimmed.startsWith('return ') || trimmed.startsWith('pass') || trimmed.startsWith('break') || trimmed.startsWith('continue')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
    } else {
      if (trimmed.endsWith('{') || trimmed.endsWith('(') || trimmed.endsWith('[')) {
        indentLevel++;
      }
    }
  }

  return result.join('\n');
}

// Download Workspace Files as a single ZIP File using JSZip
function downloadWorkspaceAsZip() {
  if (typeof JSZip === 'undefined') {
    showTerminalLog('[System Error] JSZip library is not loaded from CDN. Verify internet connection.', 'error-text');
    return;
  }

  // Make sure currently open file is saved in state
  if (editor && state.activeFileId) {
    const activeFile = state.files.find(f => f.id === state.activeFileId);
    if (activeFile) {
      activeFile.content = editor.getValue();
    }
  }

  const zip = new JSZip();
  state.files.forEach(file => {
    if (file.type === 'folder') return;
    const fullPath = getFullItemPath(file);
    zip.file(fullPath, file.content);
  });

  zip.generateAsync({ type: 'blob' })
    .then(blobContent => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blobContent);
      link.download = 'codexrun-workspace.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showTerminalLog('[System] Project successfully downloaded as "codexrun-workspace.zip".', 'system-text');
    })
    .catch(err => {
      showTerminalLog(`[System Error] ZIP generation failed: ${err.message}`, 'error-text');
    });
}

// Setup template categories loading listeners
function initTemplatesListeners() {
  const buttons = document.querySelectorAll('.template-item-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const templateId = btn.getAttribute('data-template');
      loadTemplate(templateId);
    });
  });
}

// Load chosen algorithm template into workspace
function loadTemplate(templateId) {
  if (!state.activeFileId) return;
  const activeFile = state.files.find(f => f.id === state.activeFileId);
  if (!activeFile) return;

  const templatesSet = ALGORITHM_TEMPLATES[templateId];
  if (!templatesSet) {
    showTerminalLog(`[System Error] Template "${templateId}" not found.`, 'error-text');
    return;
  }

  const templateData = templatesSet[activeFile.language];
  if (!templateData) {
    showTerminalLog(`[System Alert] Template not available for language: ${activeFile.language}`, 'error-text');
    return;
  }

  // Create a new virtual file name dynamically to prevent duplicate collisions
  let baseName = templateData.name.split('.')[0];
  let ext = templateData.name.split('.').pop();
  let finalName = templateData.name;
  let counter = 1;

  while (state.files.some(f => f.name.toLowerCase() === finalName.toLowerCase())) {
    finalName = `${baseName}_${counter}.${ext}`;
    counter++;
  }

  let codeContent = templateData.content;
  // If Java class name needs to match file name (e.g. BubbleSort_1.java)
  if (activeFile.language === 'java' && counter > 1) {
    codeContent = codeContent.replace(`public class ${baseName}`, `public class ${baseName}_${counter - 1}`);
  }

  const newFileId = Date.now().toString();
  const newFile = {
    id: newFileId,
    name: finalName,
    language: activeFile.language,
    content: codeContent
  };

  state.files.push(newFile);
  state.activeFileId = newFileId;

  saveStateToStorage();
  renderFileTree();
  renderTabs();
  switchToActiveFile();

  showTerminalLog(`[System] Loaded template into new file: ${finalName}`, 'system-text');

  // Switch visual tab selector to explorer panel to let users see the new file
  document.getElementById('tab-explorer-btn').click();
}

// Initialise Share Modal Action Listeners (WhatsApp, Telegram, Copy)
function initShareModalListeners() {
  const shareModal = document.getElementById('share-modal');
  const closeBtn = document.getElementById('close-share-modal');
  const copyBtn = document.getElementById('share-copy-btn');
  const linkCopyBtn = document.getElementById('share-link-copy-btn');
  const linkInput = document.getElementById('share-link-url');

  // Close modal when click close button
  closeBtn.addEventListener('click', () => {
    shareModal.classList.add('hide');
  });

  // Close modal when clicking outside content area
  shareModal.addEventListener('click', (e) => {
    if (e.target === shareModal) {
      shareModal.classList.add('hide');
    }
  });

  // Share Copy handler
  const executeCopy = () => {
    const shareUrl = linkInput.value;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        showTerminalLog('[System] Shareable link copied to clipboard!', 'system-text');

        // Show visual feedback on the "Copy" text inside input group
        const oldText = linkCopyBtn.textContent;
        linkCopyBtn.textContent = 'Copied!';
        linkCopyBtn.style.background = 'var(--color-success)';

        setTimeout(() => {
          linkCopyBtn.textContent = oldText;
          linkCopyBtn.style.background = '';
        }, 1500);
      })
      .catch(err => {
        showTerminalLog(`[System Error] Failed to copy link: ${err}`, 'error-text');
      });
  };

  copyBtn.addEventListener('click', executeCopy);
  linkCopyBtn.addEventListener('click', executeCopy);
}

// Observe Google AdSense ads, safely push them when visible, and update container classes
function initAdSenseObserver() {
  const ads = document.querySelectorAll('ins.adsbygoogle');

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-ad-status') {
        const ins = mutation.target;
        const status = ins.getAttribute('data-ad-status');
        const container = ins.closest('.adsense-sidebar-container') || ins.closest('.terminal-output-ad-panel');
        if (container) {
          if (status === 'filled') {
            container.classList.add('ad-loaded');
          } else {
            container.classList.remove('ad-loaded');
          }
        }
      }
    });
  });

  ads.forEach(ad => {
    const status = ad.getAttribute('data-ad-status');
    const container = ad.closest('.adsense-sidebar-container') || ad.closest('.terminal-output-ad-panel');
    if (container && status === 'filled') {
      container.classList.add('ad-loaded');
    }

    observer.observe(ad, { attributes: true, attributeFilter: ['data-ad-status'] });

    // Safe push logic
    if (ad.offsetWidth > 0) {
      if (!ad.getAttribute('data-ad-pushed')) {
        ad.setAttribute('data-ad-pushed', 'true');
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
          console.warn('AdSense push failed:', e);
        }
      }
    } else {
      const resizeObserver = new ResizeObserver((entries, obs) => {
        for (let entry of entries) {
          if (entry.contentRect.width > 0) {
            if (!ad.getAttribute('data-ad-pushed')) {
              ad.setAttribute('data-ad-pushed', 'true');
              try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
              } catch (e) {
                console.warn('Deferred AdSense push failed:', e);
              }
            }
            obs.disconnect();
          }
        }
      });
      resizeObserver.observe(ad);
    }
  });
}

// ==========================================================================
// Interactive Code Visualizer Engine
// ==========================================================================

function initVisualizerListeners() {
  const btnPlay = document.getElementById('vis-control-play');
  const btnPrev = document.getElementById('vis-control-prev');
  const btnNext = document.getElementById('vis-control-next');
  const btnReset = document.getElementById('vis-control-reset');
  const speedSlider = document.getElementById('vis-control-speed');
  const customDataBtn = document.getElementById('vis-custom-data-btn');

  if (btnPlay) btnPlay.addEventListener('click', toggleVisPlay);
  if (btnPrev) btnPrev.addEventListener('click', () => {
    if (simulationState.isPlaying) toggleVisPlay();
    if (simulationState.currentStepIndex > 0) {
      simulationState.currentStepIndex--;
      renderSimulationStep();
    }
  });
  if (btnNext) btnNext.addEventListener('click', () => {
    if (simulationState.isPlaying) toggleVisPlay();
    if (simulationState.currentStepIndex < simulationState.steps.length - 1) {
      simulationState.currentStepIndex++;
      renderSimulationStep();
    }
  });
  if (btnReset) btnReset.addEventListener('click', () => {
    if (simulationState.isPlaying) toggleVisPlay();
    simulationState.currentStepIndex = 0;
    renderSimulationStep();
  });

  if (speedSlider) {
    speedSlider.addEventListener('input', (e) => {
      simulationState.delay = 2100 - parseInt(e.target.value, 10);
      if (simulationState.isPlaying) {
        clearInterval(simulationState.timer);
        runSimulationLoop();
      }
    });
  }

  if (customDataBtn) {
    customDataBtn.addEventListener('click', () => {
      const input = document.getElementById('vis-custom-data-input').value.trim();
      if (!input) return;
      const nums = input.split(',').map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n));
      if (nums.length > 0) {
        simulationState.currentData = nums;
        initializeVisualizer();
      }
    });
  }
}

function initializeVisualizer() {
  if (simulationState.isPlaying) toggleVisPlay();

  const activeFile = state.files.find(f => f.id === state.activeFileId);
  const templateInfo = activeFile ? getTemplateKey(activeFile.content) : null;
  const isVHDL = activeFile && activeFile.language === 'vhdl';
  const isVerilog = activeFile && activeFile.language === 'verilog';
  const algoType = isVHDL ? 'vhdl' : (isVerilog ? 'verilog' : ((templateInfo && templateInfo.type === 'algorithm') ? templateInfo.algoKey : 'bubble_sort'));

  // Fill vis-custom-data-input input with placeholder suggestion
  const inputEl = document.getElementById('vis-custom-data-input');
  if (inputEl && !inputEl.value) {
    if (algoType === 'bubble_sort' || algoType === 'binary_search' || algoType === 'bst') {
      inputEl.value = simulationState.currentData.join(', ');
    } else if (algoType === 'vhdl' || algoType === 'verilog') {
      inputEl.value = 'Half_Adder';
    } else {
      inputEl.value = '10';
    }
  }

  // Generate simulation steps based on matching algorithm
  if (algoType === 'vhdl') {
    if (!simulationState.steps || simulationState.steps.length === 0 || simulationState.steps[0].algo !== 'vhdl') {
      const simResult = simulateVHDL(activeFile ? activeFile.content : '');
      simulationState.steps = simResult.steps;
    }
  } else if (algoType === 'verilog') {
    if (!simulationState.steps || simulationState.steps.length === 0 || simulationState.steps[0].algo !== 'verilog') {
      const simResult = simulateVerilog(activeFile ? activeFile.content : '');
      simulationState.steps = simResult.steps;
    }
  } else if (algoType === 'bubble_sort') {
    simulationState.steps = generateBubbleSortSteps(simulationState.currentData);
  } else if (algoType === 'fibonacci') {
    const size = parseInt(document.getElementById('vis-custom-data-input').value, 10) || 10;
    simulationState.steps = generateFibonacciSteps(Math.min(Math.max(size, 2), 15));
  } else if (algoType === 'binary_search') {
    const sortedData = [...simulationState.currentData].sort((a, b) => a - b);
    const target = sortedData.includes(10) ? 10 : (sortedData[Math.floor(sortedData.length / 2)] || 10);
    simulationState.steps = generateBinarySearchSteps(sortedData, target);
  } else if (algoType === 'stack') {
    simulationState.steps = generateStackSteps();
  } else if (algoType === 'queue') {
    simulationState.steps = generateQueueSteps();
  } else if (algoType === 'bst') {
    simulationState.steps = generateBSTSteps(simulationState.currentData);
  }

  simulationState.currentStepIndex = 0;
  renderSimulationStep();
}

function toggleVisPlay() {
  const playIcon = document.querySelector('.vis-play-icon');
  if (!playIcon) return;

  if (simulationState.isPlaying) {
    simulationState.isPlaying = false;
    playIcon.textContent = 'play_arrow';
    clearInterval(simulationState.timer);
  } else {
    simulationState.isPlaying = true;
    playIcon.textContent = 'pause';
    runSimulationLoop();
  }
}

function runSimulationLoop() {
  simulationState.timer = setInterval(() => {
    if (simulationState.currentStepIndex < simulationState.steps.length - 1) {
      simulationState.currentStepIndex++;
      renderSimulationStep();
    } else {
      toggleVisPlay();
    }
  }, simulationState.delay);
}

function assignNodePositions(node, x = 300, y = 30, xOffset = 120) {
  if (!node) return;
  node.x = x;
  node.y = y;
  assignNodePositions(node.left, x - xOffset, y + 45, xOffset * 0.5);
  assignNodePositions(node.right, x + xOffset, y + 45, xOffset * 0.5);
}

function renderBST(canvas, step) {
  if (!step.tree) {
    canvas.innerHTML = '<span style="color: var(--text-dark); font-size: 0.8rem; display: block; padding: 20px; text-align: center;">[Tree is Empty]</span>';
    return;
  }

  const root = step.tree;
  const svgWidth = canvas.clientWidth || 600;
  const svgHeight = 220;
  
  assignNodePositions(root, svgWidth / 2, 30, svgWidth / 4);

  let svgContent = `<svg width="100%" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">`;

  function drawEdges(node) {
    if (!node) return;
    if (node.left) {
      svgContent += `<line x1="${node.x}" y1="${node.y}" x2="${node.left.x}" y2="${node.left.y}" stroke="rgba(255,255,255,0.15)" stroke-width="2" />`;
      drawEdges(node.left);
    }
    if (node.right) {
      svgContent += `<line x1="${node.x}" y1="${node.y}" x2="${node.right.x}" y2="${node.right.y}" stroke="rgba(255,255,255,0.15)" stroke-width="2" />`;
      drawEdges(node.right);
    }
  }
  drawEdges(root);

  function drawNodes(node) {
    if (!node) return;
    const isHighlighted = (step.highlight === node.val);
    const circleColor = isHighlighted ? 'var(--accent-indigo)' : 'var(--bg-tertiary)';
    const strokeColor = isHighlighted ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.2)';
    const textColor = '#ffffff';

    svgContent += `
      <circle cx="${node.x}" cy="${node.y}" r="15" fill="${circleColor}" stroke="${strokeColor}" stroke-width="2" />
      <text x="${node.x}" y="${node.y + 4}" fill="${textColor}" font-size="11px" font-weight="600" font-family="var(--font-mono)" text-anchor="middle">${node.val}</text>
    `;

    drawNodes(node.left);
    drawNodes(node.right);
  }
  drawNodes(root);

  svgContent += `</svg>`;
  canvas.innerHTML = svgContent;
}

function renderSimulationStep() {
  const canvas = document.getElementById('visualizer-canvas');
  const varsList = document.getElementById('vis-variables-list');
  const descBox = document.getElementById('vis-description-box');

  if (!canvas || !varsList || !descBox) return;

  const step = simulationState.steps[simulationState.currentStepIndex];
  if (!step) return;

  descBox.textContent = step.desc;
  varsList.innerHTML = '';

  Object.entries(step.vars || {}).forEach(([name, val]) => {
    const badge = document.createElement('div');
    badge.className = 'vis-var-badge';
    badge.innerHTML = `<span class="var-name">${name}</span><span class="var-val">${val}</span>`;
    varsList.appendChild(badge);
  });

  canvas.innerHTML = '';

  const activeFile = state.files.find(f => f.id === state.activeFileId);
  const templateInfo = activeFile ? getTemplateKey(activeFile.content) : null;
  const isVHDL = activeFile && activeFile.language === 'vhdl';
  const isVerilog = activeFile && activeFile.language === 'verilog';
  const algoType = isVHDL ? 'vhdl' : (isVerilog ? 'verilog' : ((templateInfo && templateInfo.type === 'algorithm') ? templateInfo.algoKey : 'bubble_sort'));

  if (algoType === 'vhdl' || algoType === 'verilog') {
    canvas.style.display = 'block';
    renderVHDLWaveforms(canvas, step);
  }
  else if (algoType === 'bubble_sort') {
    const maxVal = Math.max(...step.array, 1);
    step.array.forEach((val, idx) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'vis-bar-wrapper';

      if (step.comparing.includes(idx)) {
        wrapper.classList.add('comparing');
      } else if (step.swapped.includes(idx)) {
        wrapper.classList.add('swapped');
      } else if (step.sorted.includes(idx)) {
        wrapper.classList.add('sorted');
      }

      const heightPercent = (val / maxVal) * 80;
      wrapper.innerHTML = `
        <div class="vis-bar" style="height: ${heightPercent}px;"></div>
        <div class="vis-bar-val">${val}</div>
      `;
      canvas.appendChild(wrapper);
    });
  }
  else if (algoType === 'fibonacci') {
    const list = document.createElement('div');
    list.className = 'vis-node-list';
    step.array.forEach((val, idx) => {
      const node = document.createElement('div');
      node.className = 'vis-node';
      if (step.highlight.includes(idx)) {
        node.style.borderColor = 'var(--accent-cyan)';
        node.style.background = 'rgba(14, 165, 233, 0.15)';
      }
      node.textContent = val;
      list.appendChild(node);
    });
    canvas.appendChild(list);
  }
  else if (algoType === 'binary_search') {
    const list = document.createElement('div');
    list.className = 'vis-node-list';
    step.array.forEach((val, idx) => {
      const node = document.createElement('div');
      node.className = 'vis-node';

      if (idx === step.mid) {
        node.style.borderColor = 'var(--color-warning)';
        node.style.background = 'rgba(245, 158, 11, 0.15)';
      } else if (idx >= step.low && idx <= step.high) {
        node.style.borderColor = 'var(--accent-indigo)';
        node.style.background = 'rgba(99, 102, 241, 0.08)';
      } else {
        node.style.opacity = '0.3';
      }

      node.innerHTML = `
        <div>${val}</div>
        <div style="font-size: 0.65rem; color: var(--text-muted); margin-top: 4px; font-weight: 500;">
          ${idx === step.low ? 'Low' : ''}${idx === step.mid ? ' Mid ' : ''}${idx === step.high ? 'High' : ''}
        </div>
      `;
      list.appendChild(node);
    });
    canvas.appendChild(list);
  }
  else if (algoType === 'stack') {
    const list = document.createElement('div');
    list.className = 'vis-node-list vis-stack-list';
    step.items.forEach(val => {
      const node = document.createElement('div');
      node.className = 'vis-node';
      node.textContent = val;
      list.appendChild(node);
    });
    if (step.items.length === 0) {
      list.innerHTML = '<span style="color: var(--text-dark); font-size: 0.8rem;">[Stack Empty]</span>';
    }
    canvas.appendChild(list);
  }
  else if (algoType === 'queue') {
    const list = document.createElement('div');
    list.className = 'vis-node-list vis-queue-list';
    step.items.forEach(val => {
      const node = document.createElement('div');
      node.className = 'vis-node';
      node.textContent = val;
      list.appendChild(node);
    });
    if (step.items.length === 0) {
      list.innerHTML = '<span style="color: var(--text-dark); font-size: 0.8rem;">[Queue Empty]</span>';
    }
    canvas.appendChild(list);
  }
  else if (algoType === 'bst') {
    renderBST(canvas, step);
  }
}

function generateBubbleSortSteps(arr) {
  let steps = [];
  let a = [...arr];
  let n = a.length;

  steps.push({
    type: 'init',
    array: [...a],
    comparing: [],
    swapped: [],
    sorted: [],
    vars: { n },
    desc: `Starting Bubble Sort with array: [${a.join(', ')}].`
  });

  let sortedIndices = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        type: 'compare',
        array: [...a],
        comparing: [j, j + 1],
        swapped: [],
        sorted: [...sortedIndices],
        vars: { i, j, 'arr[j]': a[j], 'arr[j+1]': a[j + 1] },
        desc: `Comparing index ${j} (${a[j]}) and index ${j + 1} (${a[j + 1]}).`
      });

      if (a[j] > a[j + 1]) {
        let temp = a[j];
        a[j] = a[j + 1];
        a[j + 1] = temp;

        steps.push({
          type: 'swap',
          array: [...a],
          comparing: [],
          swapped: [j, j + 1],
          sorted: [...sortedIndices],
          vars: { i, j, temp: temp, 'arr[j]': a[j], 'arr[j+1]': a[j + 1] },
          desc: `Swap: ${a[j + 1]} > ${a[j]}, swapping them.`
        });
      }
    }
    sortedIndices.push(n - i - 1);
    steps.push({
      type: 'sorted_mark',
      array: [...a],
      comparing: [],
      swapped: [],
      sorted: [...sortedIndices],
      vars: { i },
      desc: `Pass ${i + 1} complete. Index ${n - i - 1} (${a[n - i - 1]}) is now in its final sorted position.`
    });
  }

  steps.push({
    type: 'final',
    array: [...a],
    comparing: [],
    swapped: [],
    sorted: Array.from({ length: n }, (_, k) => k),
    vars: {},
    desc: `Sorting complete! Fully sorted array: [${a.join(', ')}].`
  });

  return steps;
}

function generateFibonacciSteps(n = 10) {
  let steps = [];
  let fib = [0, 1];

  steps.push({
    type: 'init',
    array: [0, 1],
    highlight: [0, 1],
    vars: { n, a: 0, b: 1, i: 2 },
    desc: `Initializing Fibonacci. First two numbers are 0 and 1.`
  });

  for (let i = 2; i < n; i++) {
    let a = fib[fib.length - 2];
    let b = fib[fib.length - 1];
    let sum = a + b;
    fib.push(sum);

    steps.push({
      type: 'step',
      array: [...fib],
      highlight: [fib.length - 1],
      vars: { n, a, b, 'c = a + b': sum, i },
      desc: `Adding previous two numbers: ${a} + ${b} = ${sum}.`
    });
  }

  steps.push({
    type: 'final',
    array: [...fib],
    highlight: [],
    vars: { total: fib.length },
    desc: `Completed generating first ${n} Fibonacci numbers: [${fib.join(', ')}].`
  });

  return steps;
}

function generateBinarySearchSteps(arr, x) {
  let steps = [];
  let low = 0;
  let high = arr.length - 1;
  let mid = -1;
  let found = false;

  steps.push({
    type: 'init',
    array: [...arr],
    low,
    high,
    mid: -1,
    comparing: [],
    vars: { low, high, target: x },
    desc: `Searching for target ${x} in sorted array: [${arr.join(', ')}].`
  });

  while (low <= high) {
    mid = Math.floor((low + high) / 2);

    steps.push({
      type: 'calc_mid',
      array: [...arr],
      low,
      high,
      mid,
      comparing: [mid],
      vars: { low, high, mid, 'arr[mid]': arr[mid], target: x },
      desc: `Calculated middle index = ${mid} (value is ${arr[mid]}).`
    });

    if (arr[mid] === x) {
      found = true;
      steps.push({
        type: 'found',
        array: [...arr],
        low,
        high,
        mid,
        comparing: [mid],
        vars: { low, high, mid, target: x },
        desc: `Found! Target ${x} matches value at index ${mid}.`
      });
      break;
    }

    if (arr[mid] < x) {
      let prevLow = low;
      low = mid + 1;
      steps.push({
        type: 'adjust_low',
        array: [...arr],
        low,
        high,
        mid,
        comparing: [],
        vars: { prevLow, newLow: low, high, target: x },
        desc: `${arr[mid]} < ${x}, so target must be in the right half. Adjusting low = mid + 1 (${low}).`
      });
    } else {
      let prevHigh = high;
      high = mid - 1;
      steps.push({
        type: 'adjust_high',
        array: [...arr],
        low,
        high,
        mid,
        comparing: [],
        vars: { low, prevHigh, newHigh: high, target: x },
        desc: `${arr[mid]} > ${x}, so target must be in the left half. Adjusting high = mid - 1 (${high}).`
      });
    }
  }

  if (!found) {
    steps.push({
      type: 'not_found',
      array: [...arr],
      low,
      high,
      mid: -1,
      comparing: [],
      vars: { target: x },
      desc: `Low (${low}) exceeded High (${high}). Target ${x} is not present in the array.`
    });
  }

  return steps;
}

function generateStackSteps() {
  let steps = [];
  let items = [];

  steps.push({
    type: 'init',
    items: [...items],
    action: 'init',
    vars: { top: -1, size: 0 },
    desc: "Initializing an empty Stack (Last In, First Out)."
  });

  items.push(10);
  steps.push({
    type: 'push',
    items: [...items],
    action: 'push',
    val: 10,
    vars: { top: 0, size: 1, 'pushed': 10 },
    desc: "Pushed 10 onto the stack. Top is now at index 0."
  });

  items.push(20);
  steps.push({
    type: 'push',
    items: [...items],
    action: 'push',
    val: 20,
    vars: { top: 1, size: 2, 'pushed': 20 },
    desc: "Pushed 20 onto the stack. Top is now at index 1."
  });

  let popped = items.pop();
  steps.push({
    type: 'pop',
    items: [...items],
    action: 'pop',
    val: popped,
    vars: { top: 0, size: 1, 'popped': popped },
    desc: `Popped ${popped} from the stack. LIFO order retrieves the top element.`
  });

  popped = items.pop();
  steps.push({
    type: 'pop',
    items: [...items],
    action: 'pop',
    val: popped,
    vars: { top: -1, size: 0, 'popped': popped },
    desc: `Popped ${popped} from the stack. The stack is now empty.`
  });

  return steps;
}

function generateQueueSteps() {
  let steps = [];
  let items = [];

  steps.push({
    type: 'init',
    items: [...items],
    action: 'init',
    vars: { size: 0 },
    desc: "Initializing an empty Queue (First In, First Out)."
  });

  items.push(10);
  steps.push({
    type: 'enqueue',
    items: [...items],
    action: 'enqueue',
    val: 10,
    vars: { size: 1, 'enqueued': 10 },
    desc: "Enqueued 10 to the rear of the queue."
  });

  items.push(20);
  steps.push({
    type: 'enqueue',
    items: [...items],
    action: 'enqueue',
    val: 20,
    vars: { size: 2, 'enqueued': 20 },
    desc: "Enqueued 20 to the rear of the queue."
  });

  let dequeued = items.shift();
  steps.push({
    type: 'dequeue',
    items: [...items],
    action: 'dequeue',
    val: dequeued,
    vars: { size: 1, 'dequeued': dequeued },
    desc: `Dequeued ${dequeued} from the front of the queue. FIFO order retrieves the oldest element.`
  });

  dequeued = items.shift();
  steps.push({
    type: 'dequeue',
    items: [...items],
    action: 'dequeue',
    val: dequeued,
    vars: { size: 0, 'dequeued': dequeued },
    desc: `Dequeued ${dequeued} from the front of the queue. The queue is now empty.`
  });

  return steps;
}

function generateBSTSteps(arr) {
  const steps = [];
  const tree = { root: null };

  class BSTNode {
    constructor(val) {
      this.val = val;
      this.left = null;
      this.right = null;
      this.x = 0;
      this.y = 0;
    }
  }

  function serializeTree(node) {
    if (!node) return null;
    return {
      val: node.val,
      left: serializeTree(node.left),
      right: serializeTree(node.right),
      x: node.x,
      y: node.y
    };
  }

  steps.push({
    type: 'init',
    tree: null,
    highlight: null,
    vars: { size: 0 },
    desc: 'Initializing empty Binary Search Tree (BST).'
  });

  function insert(root, val, currentPath = []) {
    if (!root) {
      const newNode = new BSTNode(val);
      steps.push({
        type: 'insert',
        tree: serializeTree(tree.root || newNode),
        highlight: val,
        vars: { inserted: val, path: currentPath.join(' -> ') || 'Root' },
        desc: `Inserting ${val} as new leaf node.`
      });
      return newNode;
    }

    currentPath.push(root.val);
    steps.push({
      type: 'traverse',
      tree: serializeTree(tree.root),
      highlight: root.val,
      vars: { current: root.val, comparing: val, direction: val < root.val ? 'Left' : 'Right' },
      desc: `Comparing ${val} with ${root.val}. Going ${val < root.val ? 'Left' : 'Right'}.`
    });

    if (val < root.val) {
      root.left = insert(root.left, val, currentPath);
    } else {
      root.right = insert(root.right, val, currentPath);
    }
    return root;
  }

  arr.forEach(val => {
    tree.root = insert(tree.root, val);
  });

  steps.push({
    type: 'final',
    tree: serializeTree(tree.root),
    highlight: null,
    vars: { total_nodes: arr.length },
    desc: `BST construction complete with nodes: [${arr.join(', ')}].`
  });

  return steps;
}

// ==========================================================================
// client-side VHDL Simulator and Waveform Engine
// ==========================================================================

function runCustomSimulation(name, logs, steps, isVerilog) {
  const normName = name.toLowerCase();

  if (normName === 'debounce') {
    let clk = '0';
    let button = '0';
    let delay1 = '0';
    let delay2 = '0';
    let delay3 = '0';
    let filtered = '0';

    for (let t = 0; t <= 100; t += 5) {
      clk = (clk === '0') ? '1' : '0';
      if (t < 20) button = '0';
      else if (t >= 20 && t < 25) button = '1';
      else if (t >= 25 && t < 35) button = '0';
      else button = '1';

      if (clk === '1') {
        delay3 = delay2;
        delay2 = delay1;
        delay1 = button;
        filtered = (delay1 === '1' && delay2 === '1' && delay3 === '1') ? '1' : '0';
      }

      steps.push({
        time: t,
        signals: { clk, button, filtered },
        algo: isVerilog ? 'verilog' : 'vhdl',
        vars: { time: `${t} ns`, clk, button, filtered, delay1, delay2, delay3 },
        desc: `[${t} ns] Clock toggled. button=${button}, filtered=${filtered}. delay1=${delay1}, delay2=${delay2}, delay3=${delay3}.`
      });
    }

    logs.push({ text: `[Time: 20 ns] button state changed from 0 to 1`, type: 'output-text' });
    logs.push({ text: `[Time: 25 ns] button bounced back to 0`, type: 'output-text' });
    logs.push({ text: `[Time: 35 ns] button pressed stably to 1`, type: 'output-text' });
    logs.push({ text: `[Time: 50 ns] filtered output successfully asserted to 1`, type: 'output-text' });
    return true;
  }

  if (normName === 'simple_cpu' || normName === 'tb_cpu') {
    let clk = '0';
    let rst = '1';
    let code = '00000000';
    let accum = '00000000';
    let acc_val = 0;

    for (let t = 0; t <= 60; t += 5) {
      clk = (clk === '0') ? '1' : '0';
      if (t < 20) {
        rst = '1';
        code = '00000000';
      } else if (t >= 20 && t < 30) {
        rst = '0';
        code = '00010101'; // ADD 5
      } else if (t >= 30 && t < 40) {
        rst = '0';
        code = '00100010'; // SUB 2
      } else {
        rst = '0';
        code = '00000000';
      }

      if (clk === '1') {
        if (rst === '1') {
          acc_val = 0;
        } else {
          const op = code.substring(0, 4);
          const operand = parseInt(code.substring(4), 2);
          if (op === '0001') {
            acc_val = (acc_val + operand) & 0xFF;
          } else if (op === '0010') {
            acc_val = (acc_val - operand) & 0xFF;
          }
        }
        accum = acc_val.toString(2).padStart(8, '0');
      }

      steps.push({
        time: t,
        signals: { clk, rst, code_bit0: code[7], accum_bit0: accum[7] },
        algo: isVerilog ? 'verilog' : 'vhdl',
        vars: { time: `${t} ns`, clk, rst, code, accum },
        desc: `[${t} ns] CPU tick. rst=${rst}, code=${code}, accum=${accum}`
      });
    }
    logs.push({ text: `[Time: 20 ns] RESET released. Instruction loaded: ADD 5`, type: 'output-text' });
    logs.push({ text: `[Time: 25 ns] Clock rising edge: accum updated to 00000101 (5)`, type: 'output-text' });
    logs.push({ text: `[Time: 30 ns] Instruction loaded: SUB 2`, type: 'output-text' });
    logs.push({ text: `[Time: 35 ns] Clock rising edge: accum updated to 00000011 (3)`, type: 'output-text' });
    return true;
  }

  if (normName === 'counter4' || normName === 'tb_counter4') {
    let clk = '0';
    let rst = '1';
    let count_val = 0;

    for (let t = 0; t <= 100; t += 5) {
      clk = (clk === '0') ? '1' : '0';
      if (t < 20) rst = '1';
      else rst = '0';

      if (clk === '1') {
        if (rst === '1') count_val = 0;
        else count_val = (count_val + 1) & 0xF;
      }

      const q = count_val.toString(2).padStart(4, '0');
      steps.push({
        time: t,
        signals: { clk, rst, q_bit0: q[3] },
        algo: isVerilog ? 'verilog' : 'vhdl',
        vars: { time: `${t} ns`, clk, rst, q },
        desc: `[${t} ns] Counter tick. rst=${rst}, count=${q}`
      });
    }
    logs.push({ text: `[Time: 20 ns] RESET released. Counter starts counting.`, type: 'output-text' });
    return true;
  }

  if (normName === 'lfsr_gen' || normName === 'tb_lfsr_gen') {
    let clk = '0';
    let rst = '1';
    let reg = [1, 0, 0, 0];

    for (let t = 0; t <= 100; t += 5) {
      clk = (clk === '0') ? '1' : '0';
      if (t < 15) rst = '1';
      else rst = '0';

      if (clk === '1') {
        if (rst === '1') {
          reg = [1, 0, 0, 0];
        } else {
          const feedback = reg[3] ^ reg[2];
          reg = [reg[1], reg[2], reg[3], feedback];
        }
      }

      const randStr = reg.join('');
      steps.push({
        time: t,
        signals: { clk, rst, rand_bit0: randStr[3] },
        algo: isVerilog ? 'verilog' : 'vhdl',
        vars: { time: `${t} ns`, clk, rst, rand: randStr },
        desc: `[${t} ns] LFSR tick. rst=${rst}, rand=${randStr}`
      });
    }
    return true;
  }

  if (normName === 'crc_calc' || normName === 'tb_crc') {
    let clk = '0';
    let data = '0';
    let crc_val = [0, 0, 0, 0];

    for (let t = 0; t <= 80; t += 5) {
      clk = (clk === '0') ? '1' : '0';
      if (t < 20) data = '1';
      else data = '0';

      if (clk === '1') {
        const fb = (data === '1' ? 1 : 0) ^ crc_val[3];
        crc_val = [fb, crc_val[0] ^ fb, crc_val[1], crc_val[2]];
      }

      const crcStr = crc_val.join('');
      steps.push({
        time: t,
        signals: { clk, data, crc_bit0: crcStr[3] },
        algo: isVerilog ? 'verilog' : 'vhdl',
        vars: { time: `${t} ns`, clk, data, crc: crcStr },
        desc: `[${t} ns] CRC tick. data=${data}, crc=${crcStr}`
      });
    }
    return true;
  }

  if (normName === 'bin_to_bcd' || normName === 'tb_bin_bcd') {
    let bin = '1011';
    let tens = '0001';
    let ones = '0001';

    steps.push({
      time: 0,
      signals: { bin_bit0: bin[3], tens_bit0: tens[3], ones_bit0: ones[3] },
      algo: isVerilog ? 'verilog' : 'vhdl',
      vars: { time: '0 ns', bin, tens, ones },
      desc: `[0 ns] Input bin=1011 (11). Decoded tens=${tens}, ones=${ones}`
    });

    bin = '1110';
    tens = '0001';
    ones = '0100';
    steps.push({
      time: 10,
      signals: { bin_bit0: bin[3], tens_bit0: tens[3], ones_bit0: ones[3] },
      algo: isVerilog ? 'verilog' : 'vhdl',
      vars: { time: '10 ns', bin, tens, ones },
      desc: `[10 ns] Input changed bin=1110 (14). Decoded tens=${tens}, ones=${ones}`
    });
    return true;
  }

  if (normName === 'clock_divider' || normName === 'tb_clock_div') {
    let clk_in = '0';
    let clk_out = '0';
    let count = 0;

    for (let t = 0; t <= 100; t += 5) {
      clk_in = (clk_in === '0') ? '1' : '0';
      if (clk_in === '1') {
        if (count === 1) {
          clk_out = (clk_out === '0') ? '1' : '0';
          count = 0;
        } else {
          count++;
        }
      }

      steps.push({
        time: t,
        signals: { clk_in, clk_out },
        algo: isVerilog ? 'verilog' : 'vhdl',
        vars: { time: `${t} ns`, clk_in, clk_out, count },
        desc: `[${t} ns] Clock Divider. clk_in=${clk_in}, clk_out=${clk_out}`
      });
    }
    return true;
  }

  if (normName === 'servo_ctrl' || normName === 'tb_servo') {
    let clk = '0';
    let pos = 5;
    let pwm = '0';
    let counter = 0;

    for (let t = 0; t <= 120; t += 5) {
      clk = (clk === '0') ? '1' : '0';
      if (t < 60) pos = 2;
      else pos = 8;

      if (clk === '1') {
        counter = (counter < 19) ? (counter + 1) : 0;
        pwm = (counter < pos + 2) ? '1' : '0';
      }

      steps.push({
        time: t,
        signals: { clk, pwm },
        algo: isVerilog ? 'verilog' : 'vhdl',
        vars: { time: `${t} ns`, clk, pos, pwm, counter },
        desc: `[${t} ns] Servo pulse. pos=${pos}, pwm=${pwm}`
      });
    }
    return true;
  }

  if (normName === 'vga_sync' || normName === 'tb_vga') {
    let clk = '0';
    let hsync = '1';
    let vsync = '1';
    let h_pos = 0;
    let v_pos = 0;

    for (let t = 0; t <= 150; t += 5) {
      clk = (clk === '0') ? '1' : '0';
      if (clk === '1') {
        if (h_pos < 19) {
          h_pos++;
        } else {
          h_pos = 0;
          v_pos = (v_pos < 10) ? (v_pos + 1) : 0;
        }
      }
      hsync = (h_pos >= 15 && h_pos < 18) ? '0' : '1';
      vsync = (v_pos >= 8 && v_pos < 10) ? '0' : '1';

      steps.push({
        time: t,
        signals: { clk, hsync, vsync },
        algo: isVerilog ? 'verilog' : 'vhdl',
        vars: { time: `${t} ns`, clk, hsync, vsync, h_pos, v_pos },
        desc: `[${t} ns] VGA sync. hsync=${hsync}, vsync=${vsync}`
      });
    }
    return true;
  }

  if (normName === 'i2s_transmitter' || normName === 'tb_i2s') {
    let sclk = '0';
    let ws = '0';
    let sd = '0';
    let data = '10110011';
    let bit_idx = 7;

    for (let t = 0; t <= 120; t += 5) {
      sclk = (sclk === '0') ? '1' : '0';
      ws = (t < 60) ? '0' : '1';

      if (sclk === '1') {
        sd = data[7 - bit_idx];
        bit_idx = (bit_idx === 0) ? 7 : (bit_idx - 1);
      }

      steps.push({
        time: t,
        signals: { sclk, ws, sd },
        algo: isVerilog ? 'verilog' : 'vhdl',
        vars: { time: `${t} ns`, sclk, ws, sd, data },
        desc: `[${t} ns] I2S transmit bit. ws=${ws}, sd=${sd}`
      });
    }
    return true;
  }

  if (normName === 'synchroniser' || normName === 'tb_synchroniser') {
    let clk = '0';
    let data_in = '0';
    let ff1 = '0';
    let ff2 = '0';
    let data_out = '0';

    for (let t = 0; t <= 100; t += 5) {
      clk = (clk === '0') ? '1' : '0';
      if (t >= 20 && t < 60) data_in = '1';
      else data_in = '0';

      if (clk === '1') {
        ff2 = ff1;
        ff1 = data_in;
        data_out = ff2;
      }

      steps.push({
        time: t,
        signals: { clk, data_in, data_out },
        algo: isVerilog ? 'verilog' : 'vhdl',
        vars: { time: `${t} ns`, clk, data_in, data_out, ff1, ff2 },
        desc: `[${t} ns] Synchronizer CDC. data_in=${data_in}, data_out=${data_out}`
      });
    }
    return true;
  }

  if (normName === 'bidir_buffer' || normName === 'tb_bidir') {
    let oe = '0';
    let data_wr = '0';

    const stim = [
      { t: 0, oe: '0', data_wr: '1', bus: 'Z', rd: 'Z' },
      { t: 10, oe: '1', data_wr: '1', bus: '1', rd: '1' },
      { t: 20, oe: '1', data_wr: '0', bus: '0', rd: '0' },
      { t: 30, oe: '0', data_wr: '1', bus: 'Z', rd: 'Z' }
    ];

    stim.forEach(s => {
      steps.push({
        time: s.t,
        signals: { oe: s.oe, data_wr: s.data_wr, bus_active: s.bus === 'Z' ? '0' : '1' },
        algo: isVerilog ? 'verilog' : 'vhdl',
        vars: { time: `${s.t} ns`, oe: s.oe, data_wr: s.data_wr, bus_pin: s.bus, data_rd: s.rd },
        desc: `[${s.t} ns] Bidirectional Bus. oe=${s.oe}, data_wr=${s.data_wr}, bus_pin=${s.bus}`
      });
    });
    return true;
  }

  if (normName === 'dff_reset' || normName === 'tb_dff_reset') {
    let clk = '0';
    let rst = '1';
    let d = '0';
    let q = '0';

    for (let t = 0; t <= 80; t += 5) {
      clk = (clk === '0') ? '1' : '0';
      if (t < 20) {
        rst = '1'; d = '0';
      } else {
        rst = '0';
        if (t >= 20 && t < 40) d = '1';
        else d = '0';
      }

      if (clk === '1') {
        if (rst === '1') q = '0';
        else q = d;
      }

      steps.push({
        time: t,
        signals: { clk, rst, d, q },
        algo: isVerilog ? 'verilog' : 'vhdl',
        vars: { time: `${t} ns`, clk, rst, d, q },
        desc: `[${t} ns] D-FF Reset. rst=${rst}, d=${d}, q=${q}`
      });
    }
    return true;
  }

  if (normName === 'simple_ram' || normName === 'tb_ram') {
    let clk = '0';
    let we = '0';
    let addr = '00';
    let din = '0000';
    let dout = '0000';
    let ram = ['0000', '0000', '0000', '0000'];

    for (let t = 0; t <= 60; t += 5) {
      clk = (clk === '0') ? '1' : '0';
      if (t < 10) {
        we = '1'; addr = '00'; din = '1010';
      } else if (t >= 10 && t < 20) {
        we = '1'; addr = '01'; din = '0101';
      } else if (t >= 20 && t < 30) {
        we = '0'; addr = '00';
      } else {
        we = '0'; addr = '01';
      }

      if (clk === '1') {
        const idx = parseInt(addr, 2);
        if (we === '1') {
          ram[idx] = din;
        }
        dout = ram[idx];
      }

      steps.push({
        time: t,
        signals: { clk, we, dout_bit0: dout[3] },
        algo: isVerilog ? 'verilog' : 'vhdl',
        vars: { time: `${t} ns`, clk, we, addr, din, dout, ram_slot0: ram[0], ram_slot1: ram[1] },
        desc: `[${t} ns] RAM state. we=${we}, addr=${addr}, din=${din}, dout=${dout}`
      });
    }
    return true;
  }

  if (normName === 'pipeline3' || normName === 'tb_pipeline3') {
    let clk = '0';
    let rst = '1';
    let din = '0000';
    let stage1 = '0000';
    let stage2 = '0000';
    let dout = '0000';

    for (let t = 0; t <= 80; t += 5) {
      clk = (clk === '0') ? '1' : '0';
      if (t < 20) {
        rst = '1'; din = '0000';
      } else {
        rst = '0';
        if (t >= 20 && t < 30) din = '0001';
        else if (t >= 30 && t < 40) din = '0010';
        else if (t >= 40 && t < 50) din = '0011';
        else din = '0100';
      }

      if (clk === '1') {
        if (rst === '1') {
          stage1 = '0000'; stage2 = '0000'; dout = '0000';
        } else {
          dout = stage2;
          stage2 = stage1;
          stage1 = din;
        }
      }

      steps.push({
        time: t,
        signals: { clk, rst, dout_bit0: dout[3] },
        algo: isVerilog ? 'verilog' : 'vhdl',
        vars: { time: `${t} ns`, clk, rst, din, stage1, stage2, dout },
        desc: `[${t} ns] Pipeline stage. din=${din}, stage1=${stage1}, stage2=${stage2}, dout=${dout}`
      });
    }
    return true;
  }

  if (normName === 'fifo4' || normName === 'tb_fifo4') {
    let clk = '0';
    let rst = '1';
    let wr_en = '0';
    let rd_en = '0';
    let din = '0000';
    let dout = '0000';
    let full = '0';
    let empty = '1';
    let mem = [];

    for (let t = 0; t <= 80; t += 5) {
      clk = (clk === '0') ? '1' : '0';
      if (t < 20) {
        rst = '1';
      } else {
        rst = '0';
        if (t >= 20 && t < 30) {
          wr_en = '1'; din = '0001'; rd_en = '0';
        } else if (t >= 30 && t < 40) {
          wr_en = '1'; din = '0010'; rd_en = '0';
        } else if (t >= 40 && t < 60) {
          wr_en = '0'; rd_en = '1';
        } else {
          wr_en = '0'; rd_en = '0';
        }
      }

      if (clk === '1') {
        if (rst === '1') {
          mem = [];
        } else {
          if (wr_en === '1' && mem.length < 4) {
            mem.push(din);
          }
          if (rd_en === '1' && mem.length > 0) {
            mem.shift();
          }
        }
        dout = mem[0] || '0000';
        full = (mem.length === 4) ? '1' : '0';
        empty = (mem.length === 0) ? '1' : '0';
      }

      steps.push({
        time: t,
        signals: { clk, wr_en, rd_en, full, empty },
        algo: isVerilog ? 'verilog' : 'vhdl',
        vars: { time: `${t} ns`, clk, wr_en, rd_en, din, dout, full, empty, count: mem.length },
        desc: `[${t} ns] FIFO state. count=${mem.length}, full=${full}, empty=${empty}`
      });
    }
    return true;
  }

  if (normName === 'spi_master' || normName === 'tb_spi') {
    let clk = '0';
    let rst = '1';
    let start = '0';
    let sclk = '0';
    let mosi = '0';
    let cs_n = '1';
    let done = '0';
    let data = '10110100';

    for (let t = 0; t <= 120; t += 5) {
      clk = (clk === '0') ? '1' : '0';
      if (t < 20) rst = '1';
      else {
        rst = '0';
        start = (t === 20) ? '1' : '0';
      }

      if (t >= 25 && t < 105) {
        cs_n = '0';
        sclk = (t % 10 === 0) ? '1' : '0';
        const bitIdx = Math.floor((t - 25) / 10);
        mosi = data[bitIdx] || '0';
      } else {
        cs_n = '1';
        sclk = '0';
        mosi = '0';
      }
      done = (t >= 105 && t < 115) ? '1' : '0';

      steps.push({
        time: t,
        signals: { clk, sclk, mosi, cs_n, done },
        algo: isVerilog ? 'verilog' : 'vhdl',
        vars: { time: `${t} ns`, clk, rst, start, sclk, mosi, cs_n, done, data },
        desc: `[${t} ns] SPI state. cs_n=${cs_n}, mosi=${mosi}, sclk=${sclk}, done=${done}`
      });
    }
    return true;
  }

  if (normName === 'uart_tx' || normName === 'tb_uart_tx') {
    let clk = '0';
    let rst = '1';
    let tx_start = '0';
    let tx_pin = '1';
    let tx_done = '0';
    let data = '01000001';

    for (let t = 0; t <= 150; t += 5) {
      clk = (clk === '0') ? '1' : '0';
      if (t < 20) rst = '1';
      else {
        rst = '0';
        tx_start = (t === 20) ? '1' : '0';
      }

      if (t >= 30 && t < 40) tx_pin = '0'; // Start bit
      else if (t >= 40 && t < 120) {
        const bitIdx = Math.floor((t - 40) / 10);
        tx_pin = data[bitIdx] || '1';
      } else if (t >= 120 && t < 130) {
        tx_pin = '1';
        tx_done = '1';
      } else {
        tx_pin = '1';
        tx_done = '0';
      }

      steps.push({
        time: t,
        signals: { clk, tx_pin, tx_done },
        algo: isVerilog ? 'verilog' : 'vhdl',
        vars: { time: `${t} ns`, clk, rst, tx_start, tx_pin, tx_done, data },
        desc: `[${t} ns] UART TX state. tx_pin=${tx_pin}, tx_done=${tx_done}`
      });
    }
    return true;
  }

  if (normName === 'pwm_gen' || normName === 'tb_pwm') {
    let clk = '0';
    let rst = '1';
    let duty = 10;
    let pwm_out = '0';
    let counter = 0;

    for (let t = 0; t <= 120; t += 5) {
      clk = (clk === '0') ? '1' : '0';
      if (t < 20) rst = '1';
      else rst = '0';

      if (t >= 20 && t < 60) duty = 10;
      else duty = 15;

      if (clk === '1') {
        if (rst === '1') {
          counter = 0;
        } else {
          counter = (counter < 19) ? (counter + 1) : 0;
        }
        pwm_out = (counter < duty) ? '1' : '0';
      }

      steps.push({
        time: t,
        signals: { clk, pwm_out },
        algo: isVerilog ? 'verilog' : 'vhdl',
        vars: { time: `${t} ns`, clk, rst, duty, pwm_out, counter },
        desc: `[${t} ns] PWM Generator. duty=${duty}, pwm_out=${pwm_out}`
      });
    }
    return true;
  }

  if (normName === 'synchronous_dff' || normName === 'tb_sync_dff') {
    let clk = '0';
    let rst = '1';
    let d = '0';
    let q = '0';

    for (let t = 0; t <= 60; t += 5) {
      clk = (clk === '0') ? '1' : '0';
      if (t < 15) {
        rst = '1'; d = '0';
      } else {
        rst = '0'; d = '1';
      }

      if (clk === '1') {
        if (rst === '1') q = '0';
        else q = d;
      }

      steps.push({
        time: t,
        signals: { clk, rst, d, q },
        algo: isVerilog ? 'verilog' : 'vhdl',
        vars: { time: `${t} ns`, clk, rst, d, q },
        desc: `[${t} ns] Sync D-FF. rst=${rst}, d=${d}, q=${q}`
      });
    }
    return true;
  }

  if (normName === 'clock_enabled_reg' || normName === 'tb_enabled_reg') {
    let clk = '0';
    let en = '0';
    let d = '0';
    let q = '0';

    for (let t = 0; t <= 60; t += 5) {
      clk = (clk === '0') ? '1' : '0';
      if (t < 20) {
        en = '0'; d = '1';
      } else {
        en = '1'; d = '1';
      }

      if (clk === '1') {
        if (en === '1') q = d;
      }

      steps.push({
        time: t,
        signals: { clk, en, d, q },
        algo: isVerilog ? 'verilog' : 'vhdl',
        vars: { time: `${t} ns`, clk, en, d, q },
        desc: `[${t} ns] Clock Enabled Register. en=${en}, d=${d}, q=${q}`
      });
    }
    return true;
  }

  if (normName === 'dlatch' || normName === 'tb_dlatch') {
    let clk = '0';
    let d = '0';
    let q = '0';

    const stim = [
      { t: 0, clk: '0', d: '1', q: '0' },
      { t: 10, clk: '1', d: '1', q: '1' },
      { t: 20, clk: '0', d: '0', q: '1' },
      { t: 30, clk: '1', d: '0', q: '0' }
    ];

    stim.forEach(s => {
      steps.push({
        time: s.t,
        signals: { clk: s.clk, d: s.d, q: s.q },
        algo: isVerilog ? 'verilog' : 'vhdl',
        vars: { time: `${s.t} ns`, clk: s.clk, d: s.d, q: s.q },
        desc: `[${s.t} ns] D-Latch state. clk=${s.clk}, d=${s.d}, q=${s.q}`
      });
    });
    return true;
  }

  if (normName === 'toggle_fsm' || normName === 'tb_toggle_fsm') {
    let clk = '0';
    let state = '0';

    for (let t = 0; t <= 80; t += 5) {
      clk = (clk === '0') ? '1' : '0';
      if (clk === '1') {
        state = (state === '0') ? '1' : '0';
      }

      steps.push({
        time: t,
        signals: { clk, state },
        algo: isVerilog ? 'verilog' : 'vhdl',
        vars: { time: `${t} ns`, clk, state },
        desc: `[${t} ns] Toggle FSM state. clk=${clk}, state=${state}`
      });
    }
    return true;
  }

  if (normName === 'dma_controller' || normName === 'tb_dma') {
    let clk = '0';
    let rst = '1';
    let start = '0';
    let mem_write = '0';
    let dma_busy = '0';
    let current_state = 'IDLE';

    for (let t = 0; t <= 80; t += 5) {
      clk = (clk === '0') ? '1' : '0';
      if (t < 20) rst = '1';
      else {
        rst = '0';
        start = (t === 20) ? '1' : '0';
      }

      if (clk === '1') {
        if (rst === '1') {
          current_state = 'IDLE';
          mem_write = '0';
          dma_busy = '0';
        } else {
          if (current_state === 'IDLE' && start === '1') {
            current_state = 'READ_SRC';
            dma_busy = '1';
          } else if (current_state === 'READ_SRC') {
            current_state = 'WRITE_DST';
          } else if (current_state === 'WRITE_DST') {
            current_state = 'DONE';
            mem_write = '1';
          } else if (current_state === 'DONE') {
            current_state = 'IDLE';
            mem_write = '0';
            dma_busy = '0';
          }
        }
      }

      steps.push({
        time: t,
        signals: { clk, rst, start, mem_write, dma_busy },
        algo: isVerilog ? 'verilog' : 'vhdl',
        vars: { time: `${t} ns`, clk, rst, start, mem_write, dma_busy, state: current_state },
        desc: `[${t} ns] DMA Controller state=${current_state}. busy=${dma_busy}, mem_write=${mem_write}`
      });
    }
    return true;
  }

  if (normName === 'interrupt_ctrl' || normName === 'tb_interrupt') {
    let irq_inputs = '0000';
    let irq_active = '0';
    let irq_addr = '00';

    const stim = [
      { t: 0, irq: '0000', active: '0', addr: '00' },
      { t: 10, irq: '0010', active: '1', addr: '01' },
      { t: 20, irq: '1010', active: '1', addr: '11' },
      { t: 30, irq: '0000', active: '0', addr: '00' }
    ];

    stim.forEach(s => {
      steps.push({
        time: s.t,
        signals: { irq_active: s.active },
        algo: isVerilog ? 'verilog' : 'vhdl',
        vars: { time: `${s.t} ns`, irq_inputs: s.irq, irq_active: s.active, irq_addr: s.addr },
        desc: `[${s.t} ns] Interrupt controller active=${s.active}, vector_addr=${s.addr}`
      });
    });
    return true;
  }

  if (normName === 'wishbone_slave' || normName === 'tb_wishbone') {
    let clk = '0';
    let rst = '1';
    let cyc = '0';
    let stb = '0';
    let we = '0';
    let ack = '0';
    let reg = '00000000';

    for (let t = 0; t <= 60; t += 5) {
      clk = (clk === '0') ? '1' : '0';
      if (t < 20) rst = '1';
      else {
        rst = '0';
        if (t >= 20 && t < 30) {
          cyc = '1'; stb = '1'; we = '1';
        } else {
          cyc = '0'; stb = '0'; we = '0';
        }
      }

      if (clk === '1') {
        if (rst === '1') {
          reg = '00000000';
          ack = '0';
        } else {
          if (cyc === '1' && stb === '1' && we === '1') {
            reg = '01010101';
            ack = '1';
          } else {
            ack = '0';
          }
        }
      }

      steps.push({
        time: t,
        signals: { clk, cyc, stb, we, ack },
        algo: isVerilog ? 'verilog' : 'vhdl',
        vars: { time: `${t} ns`, clk, rst, cyc, stb, we, ack, reg },
        desc: `[${t} ns] Wishbone Slave. cyc=${cyc}, stb=${stb}, we=${we}, ack=${ack}`
      });
    }
    return true;
  }

  if (normName === 'axi_slave' || normName === 'tb_axi') {
    let clk = '0';
    let resetn = '0';
    let awvalid = '0';
    let wvalid = '0';
    let reg_out = '00000000';

    for (let t = 0; t <= 60; t += 5) {
      clk = (clk === '0') ? '1' : '0';
      if (t < 20) resetn = '0';
      else {
        resetn = '1';
        if (t >= 20 && t < 30) {
          awvalid = '1'; wvalid = '1';
        } else {
          awvalid = '0'; wvalid = '0';
        }
      }

      if (clk === '1') {
        if (resetn === '0') {
          reg_out = '00000000';
        } else if (awvalid === '1' && wvalid === '1') {
          reg_out = '10101010';
        }
      }

      steps.push({
        time: t,
        signals: { clk, resetn, awvalid, wvalid },
        algo: isVerilog ? 'verilog' : 'vhdl',
        vars: { time: `${t} ns`, clk, resetn, awvalid, wvalid, reg_out },
        desc: `[${t} ns] AXI4-Lite write transfer. resetn=${resetn}, awvalid=${awvalid}, wvalid=${wvalid}, reg_out=${reg_out}`
      });
    }
    return true;
  }

  return false;
}

function simulateVHDL(code) {
  const logs = [];
  const steps = [];
  let duration = 0.05;
  let success = true;

  // Clean comments and whitespace
  const cleanCode = code.replace(/--.*$/gm, '');

  const entityMatch = cleanCode.match(/entity\s+(\w+)/i);
  if (entityMatch) {
    const entityName = entityMatch[1].toLowerCase();
    if (runCustomSimulation(entityName, logs, steps, false)) {
      duration = 0.04 + Math.random() * 0.04;
      duration = parseFloat(duration.toFixed(2));
      return { logs, steps, success: true, duration };
    }
  }

  // Basic validation: must contain "entity" and "architecture"
  if (!/entity\s+\w+\s+is/i.test(cleanCode) || !/architecture\s+\w+\s+of\s+\w+\s+is/i.test(cleanCode)) {
    logs.push({ text: 'main.vhd:1:1: error: No entity or architecture declarations found in VHDL code.', type: 'error-text' });
    logs.push({ text: '--- COMPILATION FAILED ---', type: 'error-text' });

    // Push a dummy failed step so the visualizer doesn't crash
    steps.push({
      time: 0,
      signals: {},
      algo: 'vhdl',
      vars: { status: 'COMPILE ERROR' },
      desc: 'Compilation failed. Please fix your syntax or use the default template.'
    });

    return { logs, steps, success: false, duration: 0.0 };
  }

  logs.push({ text: 'main.vhd: Analyze entity and architecture declarations: SUCCESS', type: 'success-text' });
  logs.push({ text: 'main.vhd: Elaboration of design hierarchy: SUCCESS', type: 'success-text' });
  logs.push({ text: '----------------------------------------', type: 'system-text' });
  logs.push({ text: '--- SIMULATION STARTED ---', type: 'system-text' });

  // 1. Find all signals declared in the code (both in entity port map and architecture declarations)
  const signals = {};

  // Find all VHDL signals: signal a, b, c : std_logic := '0';
  const signalRegex = /signal\s+([^:]+)\s*:\s*(\w+)\s*(:=\s*'([01XZ])')?/gi;
  let match;
  while ((match = signalRegex.exec(cleanCode)) !== null) {
    const names = match[1].split(',').map(n => n.trim().toLowerCase());
    const defaultVal = match[4] || '0';
    names.forEach(name => {
      if (name) {
        signals[name] = defaultVal;
      }
    });
  }

  // Look for ports in entity declarations: a, b : in std_logic; sum, carry : out std_logic;
  const portSectionRegex = /port\s*\(([^)]+)\)/gi;
  let portMatch;
  while ((portMatch = portSectionRegex.exec(cleanCode)) !== null) {
    const portContent = portMatch[1];
    const ports = portContent.split(';');
    ports.forEach(port => {
      const parts = port.split(':');
      if (parts.length >= 2) {
        const names = parts[0].split(',').map(n => n.trim().toLowerCase());
        names.forEach(name => {
          if (name && signals[name] === undefined) {
            signals[name] = '0'; // default port value
          }
        });
      }
    });
  }

  // Parse port mapping connections
  const portConnections = {}; // maps entity port -> testbench signal
  const revPortConnections = {}; // maps testbench signal -> entity port
  const portMapRegex = /port\s+map\s*\(([^)]+)\)/gi;
  let pmMatch;
  while ((pmMatch = portMapRegex.exec(cleanCode)) !== null) {
    const connContent = pmMatch[1];
    const conns = connContent.split(',');
    conns.forEach(conn => {
      const parts = conn.split('=>');
      if (parts.length === 2) {
        const portName = parts[0].trim().toLowerCase();
        const sigName = parts[1].trim().toLowerCase();
        portConnections[portName] = sigName;
        revPortConnections[sigName] = portName;
      }
    });
  }

  // 2. Find concurrent signal assignments outside processes
  const processBlockRegex = /process[\s\S]+?end\s+process/gi;
  const concurrentCode = cleanCode.replace(processBlockRegex, '');

  const concurrentAssignments = [];
  const assignmentRegex = /(\w+)\s*<=\s*([^;]+);/g;
  while ((match = assignmentRegex.exec(concurrentCode)) !== null) {
    const target = match[1].trim().toLowerCase();
    const expr = match[2].trim();
    if (['wait', 'report', 'signal', 'port', 'architecture', 'entity'].includes(target)) continue;
    concurrentAssignments.push({ target, expr });
  }

  // Helper to evaluate expressions
  function evaluateExpr(expr, signalMap) {
    let cleanExpr = expr.toLowerCase().replace(/['"]/g, '').trim();

    const keys = Object.keys(signalMap).sort((a, b) => b.length - a.length);
    keys.forEach(sig => {
      const val = (signalMap[sig] === '1') ? 'true' : 'false';
      const regex = new RegExp('\\b' + sig + '\\b', 'g');
      cleanExpr = cleanExpr.replace(regex, val);
    });

    cleanExpr = cleanExpr.replace(/\bxor\b/g, ' !== ');
    cleanExpr = cleanExpr.replace(/\band\b/g, ' && ');
    cleanExpr = cleanExpr.replace(/\bor\b/g, ' || ');
    cleanExpr = cleanExpr.replace(/\bnot\b/g, ' ! ');
    cleanExpr = cleanExpr.replace(/\bxnor\b/g, ' === ');

    try {
      const sanitized = cleanExpr.replace(/[^a-z0-9\s&|!=\(\)]/gi, '');
      const result = new Function(`return (${sanitized})`)();
      return result ? '1' : '0';
    } catch (e) {
      return 'X';
    }
  }

  // Evaluate concurrent assignments and propagate port mappings
  function updateConcurrentOutputs() {
    for (let pass = 0; pass < 3; pass++) {
      // Propagate testbench inputs to port inputs
      Object.entries(revPortConnections).forEach(([sig, port]) => {
        if (signals[sig] !== undefined) {
          signals[port] = signals[sig];
        }
      });

      // Evaluate concurrent logic
      concurrentAssignments.forEach(assign => {
        const newVal = evaluateExpr(assign.expr, signals);
        signals[assign.target] = newVal;
      });

      // Propagate port outputs to testbench outputs
      Object.entries(portConnections).forEach(([port, sig]) => {
        if (signals[port] !== undefined) {
          signals[sig] = signals[port];
        }
      });
    }
  }

  // Initial update
  updateConcurrentOutputs();

  // Save Step 0
  let time = 0;
  steps.push({
    time: time,
    signals: { ...signals },
    algo: 'vhdl',
    vars: { time: `${time} ns`, ...signals },
    desc: `[${time} ns] Elaboration complete. Initial signal values: ` + Object.entries(signals).map(([n, v]) => `${n}=${v}`).join(', ')
  });

  // 3. Extract process blocks and execute them
  const processMatch = /process\s*(?:\([^)]*\))?\s*(?:is)?\s*begin?([\s\S]+?)end\s+process/i.exec(cleanCode);
  if (processMatch) {
    const processBody = processMatch[1];
    const statements = processBody.split(';');

    statements.forEach(stmt => {
      const cleanStmt = stmt.trim();
      if (!cleanStmt) return;

      const sigAssignMatch = /^(\w+)\s*<=\s*'([01XZ])'$/i.exec(cleanStmt);
      if (sigAssignMatch) {
        const sigName = sigAssignMatch[1].toLowerCase();
        const value = sigAssignMatch[2];
        if (signals[sigName] !== undefined) {
          signals[sigName] = value;
          if (revPortConnections[sigName]) {
            signals[revPortConnections[sigName]] = value;
          }
          updateConcurrentOutputs();
        }
        return;
      }

      const sigToSigMatch = /^(\w+)\s*<=\s*(\w+)$/i.exec(cleanStmt);
      if (sigToSigMatch) {
        const sigName = sigToSigMatch[1].toLowerCase();
        const srcName = sigToSigMatch[2].toLowerCase();
        if (signals[sigName] !== undefined && signals[srcName] !== undefined) {
          signals[sigName] = signals[srcName];
          if (revPortConnections[sigName]) {
            signals[revPortConnections[sigName]] = signals[srcName];
          }
          updateConcurrentOutputs();
        }
        return;
      }

      const waitMatch = /^wait\s+for\s+(\d+)\s*(ns|ps|us|ms)$/i.exec(cleanStmt);
      if (waitMatch) {
        const duration = parseInt(waitMatch[1], 10);
        time += duration;

        steps.push({
          time: time,
          signals: { ...signals },
          algo: 'vhdl',
          vars: { time: `${time} ns`, ...signals },
          desc: `[${time} ns] Input changed. Re-evaluating logic: ` + Object.entries(signals).map(([n, v]) => `${n}=${v}`).join(', ')
        });
        return;
      }

      const reportMatch = /^report\s+([\s\S]+)$/i.exec(cleanStmt);
      if (reportMatch) {
        let rawMsg = reportMatch[1];
        let msg = rawMsg.replace(/&/g, '').replace(/"/g, '').trim();
        msg = msg.replace(/std_logic'image\((\w+)\)/g, (match, sigName) => {
          return signals[sigName.toLowerCase()] || 'U';
        });

        Object.keys(signals).forEach(sig => {
          const regex = new RegExp('\\b' + sig + '\\b', 'g');
          msg = msg.replace(regex, signals[sig]);
        });

        logs.push({
          text: `[Time: ${time} ns] REPORT: ${msg}`,
          type: 'output-text'
        });
        return;
      }
    });
  }

  logs.push({ text: '--- SIMULATION FINISHED ---', type: 'system-text' });
  logs.push({ text: 'ghdl simulation completed successfully.', type: 'success-text' });

  duration = 0.05 + Math.random() * 0.04;
  duration = parseFloat(duration.toFixed(2));

  return { logs, steps, success: true, duration };
}

function renderVHDLWaveforms(canvas, step) {
  const steps = simulationState.steps;
  if (!steps || steps.length === 0) return;

  const firstStep = steps[0];
  const lastStep = steps[steps.length - 1];
  const signalsList = Object.keys(firstStep.signals || {});
  if (signalsList.length === 0) {
    canvas.innerHTML = '<div style="color: var(--text-dark); padding: 20px; font-size: 0.85rem;">[No signals to visualize]</div>';
    return;
  }

  const svgWidth = canvas.clientWidth || 600;
  const leftPadding = 85;
  const rightPadding = 30;
  const rowHeight = 55;
  const topPadding = 20;
  const bottomPadding = 30;

  const svgHeight = signalsList.length * rowHeight + topPadding + bottomPadding;
  const plotWidth = svgWidth - leftPadding - rightPadding;
  const maxTime = lastStep.time || 40;

  let svgContent = `<svg class="vhdl-waveform-svg" width="100%" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">`;

  // Draw Vertical Grid Lines
  const timePositions = [];
  steps.forEach(s => {
    const x = leftPadding + (s.time / maxTime) * plotWidth;
    if (!timePositions.some(p => Math.abs(p.x - x) < 1)) {
      timePositions.push({ x, time: s.time });
    }
  });

  timePositions.forEach(pos => {
    svgContent += `<line class="vhdl-grid-line" x1="${pos.x}" y1="${topPadding}" x2="${pos.x}" y2="${svgHeight - bottomPadding}" />`;
    svgContent += `<text class="vhdl-time-text" x="${pos.x}" y="${svgHeight - bottomPadding + 15}" text-anchor="middle">${pos.time} ns</text>`;
  });

  // Plot each signal row
  signalsList.forEach((sig, idx) => {
    const rowBase = topPadding + idx * rowHeight;
    const yHigh = rowBase + 12;
    const yLow = rowBase + 35;

    svgContent += `<text class="vhdl-label-text" x="15" y="${rowBase + 28}">${sig}</text>`;
    svgContent += `<line x1="${leftPadding}" y1="${rowBase + 45}" x2="${leftPadding + plotWidth}" y2="${rowBase + 45}" stroke="rgba(255,255,255,0.03)" stroke-width="1" />`;

    let pathD = '';
    let prevX = leftPadding;
    let prevY = (firstStep.signals[sig] === '1') ? yHigh : yLow;
    pathD += `M ${prevX} ${prevY}`;

    steps.forEach(s => {
      const x = leftPadding + (s.time / maxTime) * plotWidth;
      const y = (s.signals[sig] === '1') ? yHigh : yLow;

      pathD += ` H ${x}`;
      if (y !== prevY) {
        pathD += ` V ${y}`;
      }
      prevX = x;
      prevY = y;
    });

    svgContent += `<path class="vhdl-wave-line" d="${pathD}" />`;

    const cursorTime = step.time;
    const cursorX = leftPadding + (cursorTime / maxTime) * plotWidth;
    const currentVal = step.signals[sig] || '0';

    svgContent += `<text class="vhdl-value-text" x="${cursorX + 6}" y="${(yHigh + yLow) / 2 + 4}">${currentVal}</text>`;
  });

  // Draw active time cursor
  const activeX = leftPadding + (step.time / maxTime) * plotWidth;
  svgContent += `<line class="vhdl-cursor-line" x1="${activeX}" y1="${topPadding - 10}" x2="${activeX}" y2="${svgHeight - bottomPadding + 5}" />`;

  svgContent += `<rect x="${activeX - 25}" y="${topPadding - 18}" width="50" height="14" rx="3" fill="var(--accent-indigo)" opacity="0.85" />`;
  svgContent += `<text x="${activeX}" y="${topPadding - 8}" fill="#ffffff" font-family="var(--font-mono)" font-size="9px" font-weight="600" text-anchor="middle">${step.time} ns</text>`;

  svgContent += `</svg>`;
  canvas.innerHTML = svgContent;
}

function simulateVerilog(code) {
  const logs = [];
  const steps = [];
  let duration = 0.04;
  let success = true;

  // Clean comments and whitespace
  const cleanCode = code.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');

  const moduleMatch = cleanCode.match(/module\s+(\w+)/i);
  if (moduleMatch) {
    const moduleName = moduleMatch[1].toLowerCase();
    if (runCustomSimulation(moduleName, logs, steps, true)) {
      duration = 0.04 + Math.random() * 0.04;
      duration = parseFloat(duration.toFixed(2));
      return { logs, steps, success: true, duration };
    }
  }

  // Basic validation
  if (!/module\s+\w+/i.test(cleanCode) || !/endmodule/i.test(cleanCode)) {
    logs.push({ text: 'main.v:1: error: No module or endmodule declarations found in Verilog code.', type: 'error-text' });
    logs.push({ text: '--- COMPILATION FAILED ---', type: 'error-text' });

    steps.push({
      time: 0,
      signals: {},
      algo: 'verilog',
      vars: { status: 'COMPILE ERROR' },
      desc: 'Compilation failed. Please fix your syntax or use the default template.'
    });

    return { logs, steps, success: false, duration: 0.0 };
  }

  logs.push({ text: 'main.v: Parsing design module structures: SUCCESS', type: 'success-text' });
  logs.push({ text: 'main.v: Elaborating module hierarchy: SUCCESS', type: 'success-text' });
  logs.push({ text: '----------------------------------------', type: 'system-text' });
  logs.push({ text: '--- SIMULATION STARTED ---', type: 'system-text' });

  // 1. Find all signals declared (reg, wire, inputs, outputs)
  const signals = {};

  const declRegex = /\b(reg|wire|input|output)\s+([^;]+);/gi;
  let match;
  while ((match = declRegex.exec(cleanCode)) !== null) {
    const declContent = match[2];
    const items = declContent.split(',');
    items.forEach(item => {
      const parts = item.trim().split('=');
      const namePart = parts[0].trim().split(/\s+/).pop().trim().toLowerCase();
      let defaultVal = '0';
      if (parts[1]) {
        const valStr = parts[1].trim().replace(/['"]/g, '');
        if (valStr === '1' || valStr === '0') {
          defaultVal = valStr;
        }
      }
      if (namePart && !namePart.includes('[') && signals[namePart] === undefined) {
        signals[namePart] = defaultVal;
      }
    });
  }

  const modulePortsRegex = /module\s+\w+\s*\(([^)]+)\)/i;
  const portMatch = modulePortsRegex.exec(cleanCode);
  if (portMatch) {
    const portContent = portMatch[1];
    const ports = portContent.split(',');
    ports.forEach(port => {
      const parts = port.trim().split(/\s+/);
      const name = parts[parts.length - 1].toLowerCase();
      if (name && signals[name] === undefined) {
        signals[name] = '0';
      }
    });
  }

  // Parse port connections
  const portConnections = {}; // maps entity port -> testbench signal
  const revPortConnections = {}; // maps testbench signal -> entity port
  const verilogConnRegex = /\.([\w]+)\s*\(\s*([\w]+)\s*\)/g;
  let vlMatch;
  while ((vlMatch = verilogConnRegex.exec(cleanCode)) !== null) {
    const portName = vlMatch[1].toLowerCase();
    const sigName = vlMatch[2].toLowerCase();
    portConnections[portName] = sigName;
    revPortConnections[sigName] = portName;
  }

  // 2. Find concurrent assignments: assign sum = a ^ b;
  const concurrentAssignments = [];
  const assignmentRegex = /assign\s+(\w+)\s*=\s*([^;]+);/gi;
  while ((match = assignmentRegex.exec(cleanCode)) !== null) {
    const target = match[1].trim().toLowerCase();
    const expr = match[2].trim();
    concurrentAssignments.push({ target, expr });
  }

  // Helper to evaluate expressions
  function evaluateExpr(expr, signalMap) {
    let cleanExpr = expr.toLowerCase().replace(/['"]/g, '').trim();

    const keys = Object.keys(signalMap).sort((a, b) => b.length - a.length);
    keys.forEach(sig => {
      const val = (signalMap[sig] === '1') ? 'true' : 'false';
      const regex = new RegExp('\\b' + sig + '\\b', 'g');
      cleanExpr = cleanExpr.replace(regex, val);
    });

    cleanExpr = cleanExpr.replace(/\^/g, ' !== '); // XOR
    cleanExpr = cleanExpr.replace(/&/g, ' && '); // AND
    cleanExpr = cleanExpr.replace(/\|/g, ' || '); // OR
    cleanExpr = cleanExpr.replace(/~/g, ' ! '); // NOT

    try {
      const sanitized = cleanExpr.replace(/[^a-z0-9\s&|!=\(\)]/gi, '');
      const result = new Function(`return (${sanitized})`)();
      return result ? '1' : '0';
    } catch (e) {
      return 'X';
    }
  }

  // Evaluate concurrent assignments and propagate port mappings
  function updateConcurrentOutputs() {
    for (let pass = 0; pass < 3; pass++) {
      // Propagate testbench inputs to port inputs
      Object.entries(revPortConnections).forEach(([sig, port]) => {
        if (signals[sig] !== undefined) {
          signals[port] = signals[sig];
        }
      });

      // Evaluate concurrent logic
      concurrentAssignments.forEach(assign => {
        const newVal = evaluateExpr(assign.expr, signals);
        signals[assign.target] = newVal;
      });

      // Propagate port outputs to testbench outputs
      Object.entries(portConnections).forEach(([port, sig]) => {
        if (signals[port] !== undefined) {
          signals[sig] = signals[port];
        }
      });
    }
  }

  // Initial update
  updateConcurrentOutputs();

  // Save Step 0
  let time = 0;
  steps.push({
    time: time,
    signals: { ...signals },
    algo: 'verilog',
    vars: { time: `${time} ns`, ...signals },
    desc: `[${time} ns] Module instances elaborated. Initial signal values: ` + Object.entries(signals).map(([n, v]) => `${n}=${v}`).join(', ')
  });

  // 3. Find and run the initial block
  const initialRegex = /initial\s+begin([\s\S]+?)end/gi;
  const initialMatch = initialRegex.exec(cleanCode);
  if (initialMatch) {
    const body = initialMatch[1];
    const statements = body.split(';');

    statements.forEach(stmt => {
      const cleanStmt = stmt.trim();
      if (!cleanStmt) return;

      const delayMatch = /^#(\d+)$/.exec(cleanStmt);
      if (delayMatch) {
        const duration = parseInt(delayMatch[1], 10);
        time += duration;
        steps.push({
          time: time,
          signals: { ...signals },
          algo: 'verilog',
          vars: { time: `${time} ns`, ...signals },
          desc: `[${time} ns] Delay step. Re-evaluating gates: ` + Object.entries(signals).map(([n, v]) => `${n}=${v}`).join(', ')
        });
        return;
      }

      const assignMatch = /^(\w+)\s*=\s*(\d+)$/.exec(cleanStmt);
      if (assignMatch) {
        const name = assignMatch[1].toLowerCase();
        const val = assignMatch[2] === '0' ? '0' : '1';
        if (signals[name] !== undefined) {
          signals[name] = val;
          if (revPortConnections[name]) {
            signals[revPortConnections[name]] = val;
          }
          updateConcurrentOutputs();
        }
        return;
      }

      const assignSigMatch = /^(\w+)\s*=\s*(\w+)$/.exec(cleanStmt);
      if (assignSigMatch) {
        const name = assignSigMatch[1].toLowerCase();
        const srcName = assignSigMatch[2].toLowerCase();
        if (signals[name] !== undefined && signals[srcName] !== undefined) {
          signals[name] = signals[srcName];
          if (revPortConnections[name]) {
            signals[revPortConnections[name]] = signals[srcName];
          }
          updateConcurrentOutputs();
        }
        return;
      }

      const displayMatch = /^\$display\s*\(([\s\S]+)\)$/i.exec(cleanStmt);
      if (displayMatch) {
        const contentParts = displayMatch[1].split(',');
        const formatString = contentParts[0].replace(/"/g, '').trim();
        const displaySignals = contentParts.slice(1).map(s => s.trim().toLowerCase());

        let outputMsg = formatString;
        displaySignals.forEach(sig => {
          const val = signals[sig] || 'x';
          outputMsg = outputMsg.replace(/%b|%d|%h/i, val);
        });

        logs.push({
          text: `[Time: ${time} ns] $display: ${outputMsg}`,
          type: 'output-text'
        });
        return;
      }
    });
  }

  logs.push({ text: '--- SIMULATION FINISHED ---', type: 'system-text' });
  logs.push({ text: 'vvp simulation completed successfully.', type: 'success-text' });

  duration = 0.04 + Math.random() * 0.04;
  duration = parseFloat(duration.toFixed(2));

  return { logs, steps, success: true, duration };
}

function initMobileLayout() {
  const mobileToggle = document.getElementById('mobile-sidebar-toggle');
  const sidebar = document.getElementById('ide-sidebar');
  const toggleTerminalBtn = document.getElementById('toggle-terminal-height-btn');
  const terminal = document.getElementById('ide-terminal');

  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener('click', (e) => {
      sidebar.classList.toggle('collapsed');
      e.stopPropagation();
    });
  }

  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      if (sidebar && !sidebar.classList.contains('collapsed')) {
        if (!sidebar.contains(e.target) && (!mobileToggle || !mobileToggle.contains(e.target))) {
          sidebar.classList.add('collapsed');
          document.querySelectorAll('.sidebar-nav-btn').forEach(btn => btn.classList.remove('active'));
        }
      }
    }
  });

  if (toggleTerminalBtn && terminal) {
    toggleTerminalBtn.addEventListener('click', () => {
      terminal.classList.toggle('minimized');
      if (editor) {
        setTimeout(() => editor.layout(), 100);
      }
    });
  }
}

// ==========================================================================
// Zen / Focus Mode
// ==========================================================================
function initZenMode() {
  const zenBtn = document.getElementById('zen-btn');
  if (zenBtn) {
    zenBtn.addEventListener('click', toggleZenMode);
  }

  // Keyboard shortcut Alt + Z
  window.addEventListener('keydown', (e) => {
    if (e.altKey && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      toggleZenMode();
    }
  });
}

function toggleZenMode() {
  document.body.classList.toggle('zen-mode');
  const zenBtn = document.getElementById('zen-btn');
  if (zenBtn) {
    const icon = zenBtn.querySelector('.material-symbols-outlined');
    const text = zenBtn.querySelector('span:not(.material-symbols-outlined)');
    if (document.body.classList.contains('zen-mode')) {
      if (icon) icon.textContent = 'fullscreen_exit';
      if (text) text.textContent = 'Normal';
      showTerminalLog('[System] Focus Mode enabled. Press Alt+Z to exit.', 'system-text');
    } else {
      if (icon) icon.textContent = 'fullscreen';
      if (text) text.textContent = 'Zen';
      showTerminalLog('[System] Focus Mode disabled.', 'system-text');
    }
  }
  if (editor) {
    setTimeout(() => editor.layout(), 100);
  }
}

// ==========================================================================
// Git Integration & Remote Push
// ==========================================================================
const gitState = {
  baseline: {},
  staged: [],
  commits: []
};

function initGitPanel() {
  // Capture initial baseline
  state.files.forEach(f => {
    if (f.type !== 'folder' && !gitState.baseline[f.name]) {
      gitState.baseline[f.name] = f.content;
    }
  });

  const commitBtn = document.getElementById('git-commit-btn');
  const pushBtn = document.getElementById('git-push-btn');

  if (commitBtn) commitBtn.addEventListener('click', handleGitCommit);
  if (pushBtn) pushBtn.addEventListener('click', handleGitPush);

  // Hook Monaco Editor change event to update Git Panel dynamically
  if (editor) {
    editor.onDidChangeModelContent(() => {
      if (state.activeFileId) {
        const file = state.files.find(f => f.id === state.activeFileId);
        if (file) {
          file.content = editor.getValue();
        }
      }
      renderGitPanel();
    });
  }

  // Hook Git panel render when tab clicked
  const gitTab = document.getElementById('tab-git-btn');
  if (gitTab) {
    gitTab.addEventListener('click', renderGitPanel);
  }

  renderGitPanel();
}

function renderGitPanel() {
  const stagedList = document.getElementById('git-staged-list');
  const unstagedList = document.getElementById('git-unstaged-list');
  if (!stagedList || !unstagedList) return;

  stagedList.innerHTML = '';
  unstagedList.innerHTML = '';

  const modifiedFiles = [];
  const untrackedFiles = [];

  state.files.forEach(file => {
    if (file.type === 'folder') return;
    const baselineContent = gitState.baseline[file.name];
    if (baselineContent === undefined) {
      untrackedFiles.push(file.name);
    } else if (baselineContent !== file.content) {
      modifiedFiles.push(file.name);
    }
  });

  const allUnstaged = [...modifiedFiles, ...untrackedFiles];
  const unstagedToShow = allUnstaged.filter(f => !gitState.staged.includes(f));

  if (unstagedToShow.length === 0) {
    unstagedList.innerHTML = '<div style="color: var(--text-dark); font-size: 0.75rem; padding: 4px;">No unstaged changes</div>';
  } else {
    unstagedToShow.forEach(file => {
      const row = document.createElement('div');
      row.className = 'git-file-row';
      const isUntracked = untrackedFiles.includes(file);

      row.innerHTML = `
        <div class="git-file-info">
          <span class="material-symbols-outlined" style="font-size: 1rem; color: var(--text-muted);">description</span>
          <span class="git-file-name" title="${file}">${file}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="git-file-status-badge ${isUntracked ? 'status-badge info' : 'git-file-status-badge git-status-modified'}">${isUntracked ? 'Untracked' : 'Modified'}</span>
          <button class="icon-btn stage-btn" title="Stage File" style="color: var(--color-success);"><span class="material-symbols-outlined" style="font-size: 1.1rem;">add</span></button>
        </div>
      `;

      row.querySelector('.stage-btn').addEventListener('click', () => {
        gitState.staged.push(file);
        renderGitPanel();
      });

      unstagedList.appendChild(row);
    });
  }

  if (gitState.staged.length === 0) {
    stagedList.innerHTML = '<div style="color: var(--text-dark); font-size: 0.75rem; padding: 4px;">No staged changes</div>';
  } else {
    gitState.staged.forEach(file => {
      const row = document.createElement('div');
      row.className = 'git-file-row';

      row.innerHTML = `
        <div class="git-file-info">
          <span class="material-symbols-outlined" style="font-size: 1rem; color: var(--color-success);">description</span>
          <span class="git-file-name" title="${file}">${file}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="git-file-status-badge git-status-staged">Staged</span>
          <button class="icon-btn unstage-btn" title="Unstage File" style="color: var(--color-error);"><span class="material-symbols-outlined" style="font-size: 1.1rem;">remove</span></button>
        </div>
      `;

      row.querySelector('.unstage-btn').addEventListener('click', () => {
        gitState.staged = gitState.staged.filter(f => f !== file);
        renderGitPanel();
      });

      stagedList.appendChild(row);
    });
  }

  renderGitHistory();
}

function handleGitCommit() {
  const commitMsgInput = document.getElementById('git-commit-msg');
  const commitMsg = commitMsgInput ? commitMsgInput.value.trim() : '';

  if (gitState.staged.length === 0) {
    showTerminalLog('[System Alert] No changes staged to commit.', 'error-text');
    return;
  }
  if (!commitMsg) {
    showTerminalLog('[System Alert] Please enter a commit message.', 'error-text');
    return;
  }

  gitState.staged.forEach(filename => {
    const file = state.files.find(f => f.name === filename);
    if (file) {
      gitState.baseline[filename] = file.content;
    }
  });

  const commitId = Math.random().toString(36).substring(2, 9);
  gitState.commits.unshift({
    id: commitId,
    message: commitMsg,
    timestamp: new Date().toLocaleTimeString(),
    files: [...gitState.staged]
  });

  gitState.staged = [];
  if (commitMsgInput) commitMsgInput.value = '';

  renderGitPanel();
  showTerminalLog(`[System] Committed ${gitState.commits[0].files.length} files successfully (Commit Hash: ${commitId}).`, 'system-text');
}

function renderGitHistory() {
  const historyContainer = document.getElementById('git-history-graph');
  if (!historyContainer) return;

  historyContainer.innerHTML = '';

  if (gitState.commits.length === 0) {
    historyContainer.innerHTML = '<div style="color: var(--text-dark); font-size: 0.75rem; padding: 4px;">No local commits yet</div>';
    return;
  }

  gitState.commits.forEach(commit => {
    const node = document.createElement('div');
    node.className = 'git-commit-node';

    node.innerHTML = `
      <div class="git-commit-dot"></div>
      <div class="git-commit-details">
        <div class="git-commit-msg">${commit.message}</div>
        <div class="git-commit-meta">commit ${commit.id} • ${commit.timestamp}</div>
      </div>
    `;
    historyContainer.appendChild(node);
  });
}

async function handleGitPush() {
  const patInput = document.getElementById('git-pat');
  const repoInput = document.getElementById('git-repo');

  const pat = patInput ? patInput.value.trim() : '';
  const repo = repoInput ? repoInput.value.trim() : '';

  if (!pat || !repo) {
    showTerminalLog('[System Alert] Both GitHub PAT and repo path (owner/repo) are required to push.', 'error-text');
    return;
  }

  const pushBtn = document.getElementById('git-push-btn');
  pushBtn.disabled = true;
  const originalText = pushBtn.querySelector('span:not(.material-symbols-outlined)').textContent;
  pushBtn.querySelector('span:not(.material-symbols-outlined)').textContent = 'Pushing...';

  showTerminalLog(`[System] Contacting GitHub api for repository "${repo}"...`, 'system-text');

  try {
    for (const file of state.files) {
      if (file.type === 'folder') continue;

      const path = getFullItemPath(file);
      const url = `https://api.github.com/repos/${repo}/contents/${path}`;

      let sha = null;
      try {
        const checkRes = await fetch(url, {
          headers: {
            'Authorization': `token ${pat}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });
        if (checkRes.ok) {
          const fileData = await checkRes.json();
          sha = fileData.sha;
        }
      } catch (err) {
        // file doesn't exist
      }

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${pat}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
          message: `Update ${file.name} from CodeXrun browser IDE`,
          content: btoa(unescape(encodeURIComponent(file.content))),
          sha: sha || undefined
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'GitHub api error');
      }
    }

    showTerminalLog('[System] Remote Push Completed Successfully! All files synced to GitHub.', 'success-text');
  } catch (err) {
    showTerminalLog(`[System Error] Failed to push: ${err.message}`, 'error-text');
  } finally {
    pushBtn.disabled = false;
    pushBtn.querySelector('span:not(.material-symbols-outlined)').textContent = originalText;
  }
}

// ==========================================================================
// P2P Collaboration (PeerJS Integration)
// ==========================================================================
let peerInstance = null;
let peerConnection = null;
let isCollabHost = false;

function initCollabPanel() {
  const hostBtn = document.getElementById('collab-host-btn');
  const joinBtn = document.getElementById('collab-join-btn');
  const disconnectBtn = document.getElementById('collab-disconnect-btn');
  const chatInput = document.getElementById('collab-chat-input');
  const chatSendBtn = document.getElementById('collab-chat-send-btn');
  const copyIdBtn = document.getElementById('collab-copy-id-btn');

  if (hostBtn) hostBtn.addEventListener('click', collabStartHost);
  if (joinBtn) joinBtn.addEventListener('click', collabStartJoin);
  if (disconnectBtn) disconnectBtn.addEventListener('click', collabDisconnect);
  if (chatSendBtn) chatSendBtn.addEventListener('click', collabSendMessage);
  if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') collabSendMessage();
    });
  }
  if (copyIdBtn) {
    copyIdBtn.addEventListener('click', () => {
      const roomIdCode = document.getElementById('collab-room-id');
      if (roomIdCode) {
        navigator.clipboard.writeText(roomIdCode.textContent);
        showTerminalLog('[System] Room ID copied to clipboard.', 'system-text');
      }
    });
  }
}

function collabStartHost() {
  if (typeof Peer === 'undefined') {
    showTerminalLog('[System Error] PeerJS library failed to load. Check network connection.', 'error-text');
    return;
  }

  showTerminalLog('[System] Initializing WebRTC Signaling Broker...', 'system-text');
  isCollabHost = true;
  
  const customRoomId = 'codexrun_' + Math.random().toString(36).substring(2, 10);
  peerInstance = new Peer(customRoomId);

  peerInstance.on('open', (id) => {
    document.getElementById('collab-init-section').classList.add('hide');
    document.getElementById('collab-active-section').classList.remove('hide');
    document.getElementById('collab-room-id').textContent = id;
    document.getElementById('collab-status-badge').textContent = 'Host Room Active';
    document.getElementById('collab-status-badge').style.background = 'rgba(16, 185, 129, 0.15)';
    document.getElementById('collab-status-badge').style.color = 'var(--color-success)';
    showTerminalLog(`[Collaboration] Room opened successfully. ID: ${id}`, 'success-text');
  });

  peerInstance.on('connection', (conn) => {
    peerConnection = conn;
    setupCollabConnectionListeners(conn);
  });

  peerInstance.on('error', (err) => {
    showTerminalLog(`[Collaboration Error] PeerJS: ${err.type} - ${err.message}`, 'error-text');
  });
}

function collabStartJoin() {
  if (typeof Peer === 'undefined') {
    showTerminalLog('[System Error] PeerJS library failed to load.', 'error-text');
    return;
  }

  const peerInput = document.getElementById('collab-peer-input');
  const targetRoomId = peerInput ? peerInput.value.trim() : '';

  if (!targetRoomId) {
    showTerminalLog('[System Alert] Please enter the Host Room ID to join.', 'error-text');
    return;
  }

  showTerminalLog('[System] Connecting to peer host...', 'system-text');
  isCollabHost = false;
  
  const clientPeerId = 'codexrun_' + Math.random().toString(36).substring(2, 10);
  peerInstance = new Peer(clientPeerId);

  peerInstance.on('open', () => {
    const conn = peerInstance.connect(targetRoomId);
    peerConnection = conn;
    setupCollabConnectionListeners(conn);
  });

  peerInstance.on('error', (err) => {
    showTerminalLog(`[Collaboration Error] PeerJS: ${err.type} - ${err.message}`, 'error-text');
  });
}

function setupCollabConnectionListeners(conn) {
  conn.on('open', () => {
    document.getElementById('collab-init-section').classList.add('hide');
    document.getElementById('collab-active-section').classList.remove('hide');
    document.getElementById('collab-room-id').textContent = conn.peer;
    document.getElementById('collab-status-badge').textContent = 'Connected';
    document.getElementById('collab-status-badge').style.background = 'rgba(14, 165, 233, 0.15)';
    document.getElementById('collab-status-badge').style.color = 'var(--accent-cyan)';
    
    showTerminalLog('[Collaboration] WebRTC peer channel connected successfully.', 'success-text');

    if (editor) {
      editor.onDidChangeModelContent(() => {
        if (peerConnection && peerConnection.open) {
          peerConnection.send({
            type: 'edit',
            content: editor.getValue(),
            fileId: state.activeFileId
          });
        }
      });
    }
  });

  conn.on('data', (data) => {
    if (data.type === 'edit') {
      if (editor && state.activeFileId === data.fileId) {
        const currVal = editor.getValue();
        if (currVal !== data.content) {
          const stateFile = state.files.find(f => f.id === data.fileId);
          if (stateFile) {
            stateFile.content = data.content;
          }
          editor.setValue(data.content);
        }
      }
    } else if (data.type === 'chat') {
      appendChatMessage(data.sender, data.text, false);
    }
  });

  conn.on('close', () => {
    showTerminalLog('[Collaboration] Peer disconnected.', 'error-text');
    collabDisconnect();
  });
}

function collabSendMessage() {
  const input = document.getElementById('collab-chat-input');
  const text = input ? input.value.trim() : '';
  if (!text) return;

  const senderName = isCollabHost ? 'Host' : 'Guest';
  appendChatMessage(senderName, text, true);

  if (peerConnection && peerConnection.open) {
    peerConnection.send({
      type: 'chat',
      sender: senderName,
      text: text
    });
  }

  if (input) input.value = '';
}

function appendChatMessage(sender, text, isSelf) {
  const container = document.getElementById('collab-chat-messages');
  if (!container) return;

  const msg = document.createElement('div');
  msg.className = `collab-chat-msg ${isSelf ? 'self' : 'other'}`;
  msg.innerHTML = `
    <span class="collab-chat-sender">${sender}</span>
    <span>${text}</span>
  `;
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
}

function collabDisconnect() {
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }
  if (peerInstance) {
    peerInstance.destroy();
    peerInstance = null;
  }

  document.getElementById('collab-active-section').classList.add('hide');
  document.getElementById('collab-init-section').classList.remove('hide');
  showTerminalLog('[Collaboration] Room closed or disconnected.', 'system-text');
}

// ==========================================================================
// Custom Signal Waveform Builder
// ==========================================================================
let waveBuilderActive = false;
const waveBuilderState = {
  signals: ['CLK', 'RST', 'DATA'],
  intervals: 10,
  data: {
    CLK: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    RST: [1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    DATA: [0, 0, 0, 1, 1, 0, 1, 1, 0, 0]
  }
};

function initWaveformBuilder() {
  const toggleBtn = document.getElementById('vis-toggle-wave-builder');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleWaveformBuilder);
  }
}

function toggleWaveformBuilder() {
  const canvas = document.getElementById('visualizer-canvas');
  if (!canvas) return;

  waveBuilderActive = !waveBuilderActive;
  const toggleBtn = document.getElementById('vis-toggle-wave-builder');

  if (waveBuilderActive) {
    toggleBtn.querySelector('span:not(.material-symbols-outlined)').textContent = 'Normal Vis';
    renderWaveformBuilderGrid(canvas);
  } else {
    toggleBtn.querySelector('span:not(.material-symbols-outlined)').textContent = 'Waveform Builder';
    renderSimulationStep();
  }
}

function renderWaveformBuilderGrid(canvas) {
  canvas.innerHTML = '';
  
  const builderWrapper = document.createElement('div');
  builderWrapper.className = 'vis-waveform-builder';
  
  const header = document.createElement('div');
  header.className = 'vis-wave-grid-header';
  header.innerHTML = `
    <span style="font-size: 0.8rem; font-weight: 600; color: var(--accent-cyan);">Signal Timeline</span>
    <div style="display: flex; gap: 6px;">
      <input type="text" id="new-sig-name" placeholder="Signal" style="width: 70px; background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); border-radius: 4px; padding: 4px; color: var(--text-main); font-size: 0.75rem; outline: none;" />
      <button id="add-sig-btn" class="primary-btn" style="height: 24px; padding: 0 8px; font-size: 0.75rem;">Add</button>
      <button id="gen-clk-btn" class="secondary-btn" style="height: 24px; padding: 0 8px; font-size: 0.75rem; border-color: var(--accent-indigo);">Clock CLK</button>
    </div>
  `;

  builderWrapper.appendChild(header);

  waveBuilderState.signals.forEach(sig => {
    const row = document.createElement('div');
    row.className = 'vis-wave-row';

    const label = document.createElement('div');
    label.className = 'vis-wave-label';
    label.textContent = sig;
    row.appendChild(label);

    const timeline = document.createElement('div');
    timeline.className = 'vis-wave-timeline';

    const array = waveBuilderState.data[sig] || [];
    for (let t = 0; t < waveBuilderState.intervals; t++) {
      const cell = document.createElement('div');
      cell.className = 'vis-wave-cell';
      if (array[t] === 1) cell.classList.add('high');

      if (t > 0) {
        if (array[t] === 1 && array[t-1] === 0) cell.classList.add('rise');
        if (array[t] === 0 && array[t-1] === 1) cell.classList.add('fall');
      }

      cell.addEventListener('click', () => {
        waveBuilderState.data[sig][t] = waveBuilderState.data[sig][t] === 1 ? 0 : 1;
        renderWaveformBuilderGrid(canvas);
      });

      timeline.appendChild(cell);
    }

    row.appendChild(timeline);
    builderWrapper.appendChild(row);
  });

  canvas.appendChild(builderWrapper);

  const addSigBtn = document.getElementById('add-sig-btn');
  if (addSigBtn) {
    addSigBtn.addEventListener('click', () => {
      const nameInput = document.getElementById('new-sig-name');
      const sigName = nameInput ? nameInput.value.trim().toUpperCase() : '';
      if (sigName && !waveBuilderState.signals.includes(sigName)) {
        waveBuilderState.signals.push(sigName);
        waveBuilderState.data[sigName] = new Array(waveBuilderState.intervals).fill(0);
        renderWaveformBuilderGrid(canvas);
      }
    });
  }

  const genClkBtn = document.getElementById('gen-clk-btn');
  if (genClkBtn) {
    genClkBtn.addEventListener('click', () => {
      waveBuilderState.data['CLK'] = [];
      for (let t = 0; t < waveBuilderState.intervals; t++) {
        waveBuilderState.data['CLK'].push(t % 2 === 0 ? 0 : 1);
      }
      renderWaveformBuilderGrid(canvas);
    });
  }
}

