---
title: Cracking Coding Problems (Linked List)
author: syJoe
date: 2024-11-05 09:00:00 +0800
categories: [LeetCode]
tags: [python, java, c++, go, algorithm]
description: Cracking Coding Interviews 6th problems and solutions
---

# Return Kth to Last

- Find the kth to last element in a singly linekd list

### Approach

- make a two pointers, `first` and `second`

- The `first` pointer moves ahead by k setps

- And then, both `first` and `second` pointers move together until the `first` reaches the end of the list

- At this point, `second` will point to the kth to last element

### Python

```python
class Node:
    # Constructor
    def __init__(self, data):
        self.data = data
        self.next = None

    def findKthToLast(self, k):
        # Point to head (first box)
        first = self
        second = self

        # Move the first pointer k steps ahead
        for _ in range(k):
            if not first:
                return None  # k is greater than the length of the list
            first = first.next

        # Move both pointers until first reaches the end
        while first:
            first = first.next
            second = second.next

        return second

# Example usage
head = Node(1)
head.next = Node(2)
head.next.next = Node(3)
head.next.next.next = Node(4)

result = head.findKthToLast(2)
if result:
    print("Kth to last element is:", result.data)
else:
    print("K is greater than the length of the list.")
```

- Python : `self` == Java : `this`

- `for _ in range(k)` : Move the `first` pointer k times

### Java

```java
class Node {
    int data;
    Node next;

    // Constructor
    public Node(int data) {
        this.data = data;
        this.next = null;
    }
    
    // Method
    public Node findKthToLast(int k) {
        Node first = this;
        Node second = this;
        
        // Move the first pointer k steps ahead
        for (int i = 0; i < k; i++) {
            if (first == null) return null; // k is greater than the length of the list
            first = first.next;
        }
        
        // Move both pointers until first reaches the end
        while (first != null) {
            first = first.next;
            second = second.next;
        }
        
        return second;
    }
}
```

- `constructor` is called when an object of the class is created (Must be the same as the class name)

- `Node first = this;` and `Node seocnd = this;` set up pointers to start the traversal from the current node (this)

### C++

```c++
#include <iostream>

class Node {
public:
    int data;
    Node* next;
    
    Node(int data) {
        this->data = data;
        this->next = nullptr;
    }

    Node* findKthToLast(int k) {
        Node* first = this;
        Node* second = this;
        
        // Move the first pointer k steps ahead
        for (int i = 0; i < k; i++) {
            if (first == nullptr) return nullptr; // k is greater than the length of the list
            first = first->next;
        }
        
        // Move both pointers until first reaches the end
        while (first != nullptr) {
            first = first->next;
            second = second->next;
        }
        
        return second;
    }
};

// Example usage
int main() {
    // Make Linked List (1 -> 2 -> 3 -> 4)
    Node* head = new Node(1);
    head->next = new Node(2);
    head->next->next = new Node(3);
    head->next->next->next = new Node(4);
    
    Node* result = head->findKthToLast(2); // k = 2
    if (result) {
        std::cout << "Kth to last element is: " << result->data << std::endl;
    } else {
        std::cout << "K is greater than the length of the list." << std::endl;
    }
    
    // Don't forget to free memory in C++
    delete head->next->next->next;
    delete head->next->next;
    delete head->next;
    delete head;
}
```

- Dot Operator (`.`): It is used to when the `object` itself holds the memory address. 

    In Java and Python, objects are automatically managed, so you can access members using `.`

- Arrow Operator (`->`): It is used to access `members of an object` that a pointer points to

    In C++, when you have a pointer to an object, you need to use `->` to access the object's members.

- Dot operator : box that is right in front of you

- Arrow operator : box that is far away, so follow the `arrow` to get

### Go

```go
package main

import "fmt"

type Node struct {
    data int
    next *Node
}

func (head *Node) findKthToLast(k int) *Node {
    first := head
    second := head

    // Move the first pointer k steps ahead
    for i := 0; i < k; i++ {
        if first == nil {
            return nil // k is greater than the length of the list
        }
        first = first.next
    }

    // Move both pointers until first reaches the end
    while first != nil {
        first = first.next
        second = second.next
    }

    return second // kth to last element
}

func main() {
    // Make Linked List (1 -> 2 -> 3 -> 4)
    head := &Node{data: 1}
    head.next = &Node{data: 2}
    head.next.next = &Node{data: 3}
    head.next.next.next = &Node{data: 4}

    result := head.findKthToLast(2) // k = 2
    if result != nil {
        fmt.Printf("Kth to last element is: %d\n", result.data)
    } else {
        fmt.Println("K is greater than the length of the list.")
    }
}
```

- Go : `nil` == C++ : `nullptr`

- `head` is a pointer receiver of type `*Node` (head is a pointer to a Node struct)

    Work with the `original linked list` instead of a copy (memory efficiency)
