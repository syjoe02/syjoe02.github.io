---
title: Cracking Coding Problems (Double Linked List and HashMap)
author: syJoe
date: 2024-11-05 09:00:00 +0800
categories: [CrackingCoding]
tags: [python, java, c++, go, algorithm]
description: The LRU Cache is a data structure designed to store a limited number of key-value pairs and prioritize recent accesses, removing the least recently used items when full. This implementation uses a combination of a doubly linked list and a hash map (or dictionary) for fast lookups and efficient removal/insertion of nodes
---

# LRU(Least Recently Used) Cache

- Implement an LRU cache using a `doubly linked list` and `hash map`

- `get(key)`

    Retrieve the value associated with the key from the cache. If the key exists, return the value; otherwise, return -1

- `put(key, value)` 

    Insert the key-value pair into the cache. If the cache is full, remove the least recently used item before inserting the new one.

### Approach

- Use `HashMap` to store and retrieve data

- When a function is called or a new value is added, the new node is placed at the front of the `head`

- If the cache reaches its full capacity and a new value needs to be added, the node at the `tail` (the least recently used) is removed to make space

### Prerequisite

- `HashMap` uses a hash function to store and retrieve data. A hash function takes a key as input and returns an array index. This process is very fast, which is why the time complexity of the get and put operations in a HashMap is typically O(1).

- Inefficiency of Sequential Search : `It is the reason why I use HashMap` 
    
    If you search for a value directly without using a key, you have to compare each element one by one. In this case, the search time increases linearly with the number of elements. Especially when there is a large amount of data or frequent lookups, the `O(n)` time complexity of a sequential search is inefficient.

### Python

```python
# Global scope
class Node: 
    def __init__(self, key, value):
        self.key = key
        self.value = value
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = {} # Empty Dictionary
        self.head = Node(0, 0)
        self.tail = Node(0, 0)
        self.head.next = self.tail
        self.tail.prev = self.head

    def get(self, key: int) -> int:
        if key in self.cache:
            node = self.cache[key]
            self._remove(node)
            self._insert(node)
            return node.value
        return -1

    def put(self, key: int, value: int):
        if key in self.cache:
            self._remove(self.cache[key])
        if len(self.cache) == self.capacity:
            self._remove(self.tail.prev)
        self._insert(Node(key, value))

    def _remove(self, node):
        del self.cache[node.key]
        node.prev.next = node.next
        node.next.prev = node.prev

    def _insert(self, node):
        self.cache[node.key] = node
        node.next = self.head.next
        node.prev = self.head
        self.head.next.prev = node
        self.head.next = node

# Test Code
cache = LRUCache(2)
cache.put(1, 100)
cache.put(2, 200)
print(cache.get(1))  # Output: 100
cache.put(3, 300)
print(cache.get(2))  # Output: -1 (evicted)
cache.put(4, 400)
print(cache.get(1))  # Output: -1 (evicted)
print(cache.get(3))  # Output: 300
print(cache.get(4))  # Output: 400
```

- Prefixed with an underscore(_) are used as `private methods` by convention. But It is not enforce strict access control

- `def get(self, key: int) -> int:` : type hinting `->`

    Not enforce type chekcing at runtime, Just provides information about the type(int)

- Python : `__init__` == Java or C++ : constructor

    Since `self` refers to the current instance, the attributes declared in the __init__ method (such as self.cache, self.head, and self.tail) can be accessed through `self in all methods of the class`

### Java

```java
import java.util.HashMap;

class LRUCache {
    // Node class for the Double linked list
    class Node {
        int key, value;
        Node prev, next;

        Node(int key, int value) {
            this.key = key;
            this.value = value;
        }
    }

    private final int capacity;
    private HashMap<Integer, Node> cache;
    private Node head, tail;

    // Constructor
    public LRUCache(int capacity) {
        this.capacity = capacity;
        this.cache = new HashMap<>();
        // Initialize the head and tail of the doubly linked list
        head = new Node(0, 0);
        tail = new Node(0, 0);
        head.next = tail;
        tail.prev = head;
    }

    // Get the value of the key if it exists in the cache
    public int get(int key) {
        if (cache.containsKey(key)) {
            Node node = cache.get(key);
            remove(node);
            insert(node);
            return node.value;
        }
        return -1; // Key not found
    }

    // Put a key-value pair in the cache
    public void put(int key, int value) {
        if (cache.containsKey(key)) {
            remove(cache.get(key));
        }
        // If cache is full
        if (cache.size() == capacity) {
            remove(tail.prev);
        }
        insert(new Node(key, value));
    }

    // Remove a node from the doubly linked list
    private void remove(Node node) {
        cache.remove(node.key);
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    // Insert a node at the front of the doubly linked list
    private void insert(Node node) {
        cache.put(node.key, node);
        
        node.next = head.next;
        node.prev = head;
        
        head.next.prev = node;
        head.next = node;
    }
}

// Test
public class Main {
    public static void main(String[] args) {
        // LRU Cache with capacity 3
        LRUCache cache = new LRUCache(3);

        // Test 1: Put (1, 100), (2, 200), (3, 300)
        cache.put(1, 100);
        cache.put(2, 200);
        cache.put(3, 300);

        // Test 2: Get (1)
        System.out.println("Get(1): " + cache.get(1)); // Should return 100

        // Test 3: Put (4, 400) - This should evict key (2) as it is the least recently used
        cache.put(4, 400);

        // Test 4: Get (2) - Since (2) was evicted, it should return -1
        System.out.println("Get(2): " + cache.get(2)); // Should return -1

        // Test 5: Get (3) - Should return 300
        System.out.println("Get(3): " + cache.get(3)); // Should return 300

        // Test 6: Put (5, 500) - This should evict key (1)
        cache.put(5, 500);

        // Test 7: Get (1) - Since (1) was evicted, it should return -1
        System.out.println("Get(1): " + cache.get(1)); // Should return -1

        // Test 8: Get (4) - Should return 400
        System.out.println("Get(4): " + cache.get(4)); // Should return 400

        // Test 9: Get (5) - Should return 500
        System.out.println("Get(5): " + cache.get(5)); // Should return 500

        // Final state of cache should be: 5 (MRU), 4, 3 (LRU)
    }
}
```

- `final` : A variable declared as final can be assigned a value only once, and after that, the value cannot be changed

### C++

```c++
#include <iostream>
#include <unordered_map>
using namespace std;

class LRUCache {
    struct Node {
        int key, value;
        Node* prev;
        Node* next;
        Node(int k, int v) : key(k), value(v), prev(nullptr), next(nullptr) {}
    };

    int capacity;
    unordered_map<int, Node*> cache;
    Node* head;
    Node* tail;

public:
    LRUCache(int cap) : capacity(cap) {
        head = new Node(0, 0);
        tail = new Node(0, 0);
        head->next = tail;
        tail->prev = head;
    }

    int get(int key) {
        if (cache.find(key) != cache.end()) {
            Node* node = cache[key];
            remove(node);
            insert(node);
            return node->value;
        }
        return -1;
    }

    void put(int key, int value) {
        if (cache.find(key) != cache.end()) {
            remove(cache[key]);
        }
        if (cache.size() == capacity) {
            remove(tail->prev);
        }
        insert(new Node(key, value));
    }

private:
    void remove(Node* node) {
        cache.erase(node->key);
        node->prev->next = node->next;
        node->next->prev = node->prev;
        delete node;
    }

    void insert(Node* node) {
        cache[node->key] = node; // node->key == (*node).key
        node->next = head->next;
        node->prev = head;
        head->next->prev = node;
        head->next = node;
    }
};

// Test Code
int main() {
    LRUCache cache(2);
    cache.put(1, 100);
    cache.put(2, 200);
    cout << cache.get(1) << endl;  // Output: 100
    cache.put(3, 300);
    cout << cache.get(2) << endl;  // Output: -1 (evicted)
    cache.put(4, 400);
    cout << cache.get(1) << endl;  // Output: -1 (evicted)
    cout << cache.get(3) << endl;  // Output: 300
    cout << cache.get(4) << endl;  // Output: 400
    return 0;
}
```

- C++ : `unordered_map` : To store key-value pairs(hash table) 

    == Java : `HasnMap` == Python `dictonary`

- Dot `.` operator used to access members of the object itself, But when dealing with pointers, the `->` operator is used

### Go

```go
package main

import (
	"fmt"
)

type Node struct {
	key, value int
	prev, next *Node
}

type LRUCache struct {
	capacity int
	cache    map[int]*Node
	head     *Node   // Dummy node
	tail     *Node   // Dummy node
}

func Constructor(capacity int) LRUCache {
	head := &Node{}
	tail := &Node{}
	head.next = tail
	tail.prev = head
	return LRUCache{
		capacity: capacity,
		cache:    make(map[int]*Node),
		head:     head,
		tail:     tail,
	}
}

func (this *LRUCache) Get(key int) int {
	if node, found := this.cache[key]; found {
		this.remove(node)
		this.insert(node)
		return node.value
	}
	return -1
}

func (this *LRUCache) Put(key int, value int) {
	if node, found := this.cache[key]; found {
		this.remove(node)
	}
	if len(this.cache) == this.capacity {
		this.remove(this.tail.prev)
	}
	this.insert(&Node{key: key, value: value})
}

func (this *LRUCache) remove(node *Node) {
	delete(this.cache, node.key)
	node.prev.next = node.next
	node.next.prev = node.prev
}

func (this *LRUCache) insert(node *Node) {
	this.cache[node.key] = node
	node.next = this.head.next
	node.prev = this.head
	this.head.next.prev = node
	this.head.next = node
}

// Test Code
func main() {
	cache := Constructor(2)
	cache.Put(1, 100)
	cache.Put(2, 200)
	fmt.Println(cache.Get(1)) // Output: 100
	cache.Put(3, 300)
	fmt.Println(cache.Get(2)) // Output: -1 (evicted)
	cache.Put(4, 400)
	fmt.Println(cache.Get(1)) // Output: -1 (evicted)
	fmt.Println(cache.Get(3)) // Output: 300
	fmt.Println(cache.Get(4)) // Output: 400
}
```

- `found` boolean variable, whether the key exists in the map

    This syntax is part of Go's `comma ok` idiom, which is often used when retrieving values from a map

    If key exists, return `true` and does not exist, return `false`
