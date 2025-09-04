---
title: "[Cracking Coding Problems] 2. Linked Lists"
author: syJoe
date: 2025-09-02 09:00:00 +0800
categories: [CrackingCoding]
tags: [algorithm, java]
description: ""
---

# 8. Loop Detection

- Given a singly linked list, detect whether a cycle exists and return the node where the cycle begins

## 1) Brute Force

- Assume every node(i) could be the cycle start

    `start` : candidate node for the cycle start

    `runner` : traverses all nodes to check for duplicates in while loop

- when to use? : Never, only education

```java
public static ListNode detectCycle(ListNode head) {
    for (ListNode start = head; start != null; start = start.next) {
        ListNode runner = start.next;
        int steps = 0;

        while (runner != null && steps <= 1_000_000) {
            if (runner == start) return start;
            runner = runner.next;
            steps++;
        }
    }
    return null;
}
```

- Time : O(N^2)

    Inside the while loop the `runner` traverses all nodes → Slow

    That's why the `HashSet` or `Floyd` algorithm is generally preferred

- Space : O(1)

## 2) HashSet

- Stored visited nodes in HashSet

    Node that appears twice → It's the start of the cycle node

    `seen` is a set that stores all the nodes visited

    `seen.add(cur)` : if a node is added for the first time → true, but node is already in the set → false

- when to use? : Simple, but requires extra memory

```java
import java.util.*;

public static ListNode detectCycle(ListNode head) {
    Set<ListNode> seen = new HashSet<>();

    for (ListNode cur = head; cur != null; cur = cur.next) {
        if (!seen.add(cur)) return cur;
    }
    return null;
}
```

- Time : O(N)

- Space : O(N)

    Because `HashSet` is used to store visited nodes

## 3) Marking Technique (Destructive)

- Modify the list by marking visited nodes. If I encounter the marker again, the `cur` node is the cycle start

- when to use? : Only if list mutation is acceptable (can modify the list)

```java
public static ListNode detectCycle(ListNode head) {
    final ListNode MARK = new ListNode(Integer.MIN_VALUE);
    ListNode cur = head;

    while (cur != null) {
        if (cur.next == MARK) return cur;
        ListNode nxt = cur.next;
        cur.next = MARK;
        cur = nxt;
    }
    return null;
}
```

- Time : O(N)

- Space : O(1)

## 4) Floyd's Tortoise and Hare (Cycle Dection)

- Use two pointers (`slow`: 1 step, `fast`: 2 step)

    1. Move both pointers at the same speed

    2. If they meet (`slow` == `fast`), a cycle exists

    3. Make another nodes (p1,p2). `p1` to the head and `p2` points at `slow`

        and then move both one step

- when to use? : The standard interview solution (Best Solution). Does not modify the list

```java
public static ListNode detectCycle(ListNode head) {
    if (head == null) return null;
    ListNode slow = head, fast = head;

    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) {
            ListNode p1 = head;
            ListNode p2 = slow;

            while (p1 != p2) {
                p1 = p1.next;
                p2 = p2.next;
            }
            return p1;
        }
    }
    return null;
}
```

- Time : O(N)

    `p2` starts from the meeting point (slow == fast) inside the cycle. And as it moves around, it completes `one loop` it meets p1 at the cycle start (p1 == p2) → O(N)

- Space : O(1)
