---
title: "[Cracking Coding Problems] 1. Algorithms"
author: syJoe
date: 2025-09-01 09:00:00 +0800
categories: [CrackingCoding]
tags: [algorithm, java]
description: "Understand Dual-Pivot QuickSort with Java code examples. Learn how Arrays.sort(int[]) in Java uses dual-pivot partitioning, dividing elements into three groups (<p, between p and q, >q) for faster sorting than single-pivot QuickSort. Includes detailed code, step-by-step explanation, time complexity O(N log N), and space complexity O(1) auxiliary with recursion stack O(log N) average / O(N) worst case."
---

## 1) Dual-Pivot QickSort

- Used `(Java Arrays.sort(int[]))`

- Three-way partitioning strategy, making it faster than single-pivot QuickSort

    Select two pivots (p and q) and divides

    1. less than p

    2. between p and q (inclusive)

    3. greater than q

    After partitioning into three groups, each group is recursively sorted. Finally, full sorted array

- when to use? : faster implementation than single-pivot QuickSort

```java
import java.util.Arrays;

public class DualPivotDemo {
    static int[] dualPivotPartition(int[] A, int left, int right) {
        int p = A[left];
        int q = A[right];
        // swap p and q
        if (p > q) {
            int tmp = p; p = q; q = tmp;
            A[left]  = p;
            A[right] = q;
        }

        // partition boundary
        int less  = left + 1;
        int great = right - 1;
        int k = less;

        while (k <= great) {
            if (A[k] < p) {
                swap(A, k, less);
                less++;
                k++;
            } else if (A[k] > q) {
                while (k < great && A[great] > q) great--;
                swap(A, k, great);
                great--;
                if (A[k] < p) {
                    swap(A, k, less);
                    less++;
                }
                k++;
            } else {
                k++;
            }
        }

        less--;
        great++;
        swap(A, left,  less);
        swap(A, right, great);

        return new int[]{less, great};
    }

    static void swap(int[] A, int i, int j) {
        int t = A[i]; A[i] = A[j]; A[j] = t;
    }

    public static void main(String[] args) {
        int[] A = {8, 3, 7, 1, 9, 2, 6, 5, 4};
        System.out.println("start: " + Arrays.toString(A));

        int[] piv = dualPivotPartition(A, 0, A.length - 1);
        System.out.println("after partition: " + Arrays.toString(A));
        System.out.println("p index=" + piv[0] + ", q index=" + piv[1]);
    }
}
```

- Time : O(N logN)

    Each partitioning tep scans all N elements and recursion depth is about logN

    Need logN levels of recursion

- Space

    - Auxiliary space : O(1)

        partitioning is done (in-place by swapping elements) == (no extra array is required) 

    - Recursion stack
    
        O(logN) on average (when partitions are balanced)

        O(N) worst case (when partitions are very skewed)
