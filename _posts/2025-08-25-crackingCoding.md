---
title: ""[Cracking Coding Problems] 1. Arrays and Strings"
author: syJoe
date: 2025-08-25 09:00:00 +0800
categories: [CrackingCoding]
tags: [algorithm, java]
description: "Solve the 'Is Unique' string problem from Cracking the Coding Interview in Java. Learn multiple solutions: brute force, sorting, HashSet with Unicode code points, ASCII boolean array, and bitmask for lowercase a-z. Understand time and space complexity (O(N²), O(N log N), O(N)), why to use codePointAt for emojis, and how Unicode normalization (NFC) ensures correctness. Perfect guide for coding interview prep with detailed Java examples."
---

# 1. Is Unique

## 1) Brute Force

- Compare all pairs

- when to use? : `Never`, only education

```java
public static boolean isUniqueBruteForce(String s) {
    if (s == null) return true;
    for (int i = 0; i < s.length(); i++) {
        for (int j = i + 1; j < s.length(); j++) {
            if (s.charAt(i) == s.charAt(j)) return false;
        }
    }
    return true;
}
```

- Time : O(N^2)

- Space : O(1)

## 2) Sorting + Adjacent Comparison

- If the string is `sorted`, any duplicatie char will appear next to each other

- when to use? : If extera memory is not allowed

```java
import java.util.Arrays;

public static boolean isUniqueSort(String s) {
    if (s == null) return true;
    char[] arr = s.toCharArray();
    Arrays.sort(arr);

    for (int i = 1; i < arr.length; i++) {
        if (arr[i] == arr[i - 1]) return false;
    }
    return true;
}
```

- Time : O(N logN)

    Arrays.sort(arr) → O(N logN)

    Arrays.sort internally uses `Dual-Pivot Quicksort` (QuickSort average time = O(N logN))

- Space : O(1 - N)

    Depends on `sorting implementation` → This refers to which sorting algorithm is actually used internally

    QuickSort is O(1) auxiliary space, but recursion the total space is O(log N) on average and O(N) in the worst case

- QuickSort, click here

## 3) HashSet + Unicode Code Points

- Store each char seen so far in HashSet. And If it already exists, then it is duplicate

- In java, char is 16 bits and does not always represent a full Unicode char (e.g emojis)

    - U+0000 ~ U+FFFF → Basic Multilingual Plane (BMP) : represented with a `single char`

        U+10000 ~ → represented as a `surrogate pair`, which uses two char values

    - Therefore, iterating with `for(char c: s.toCharArray())` may separate pieces

        For such surrogate pairs, use `codePointAt` to combine the two char values

- when to use? : For `real-world strings` where unicode support matter

```java
import java.util.*;

public static boolean isUniqueSet(String s) {
    if (s == null) return true;
    Set<Integer> seen = new HashSet<>();

    for (int i = 0; i < s.length(); ) {
        int cp = s.codePointAt(i);
        if (!seen.add(cp)) return false;
        i += Character.charCount(cp);
    }
    return true;
}
```

- Time : O(N) average

- Space : O(min(N, Σ)), Σ = max size of character set

    - char "aaaa" → only one distinct char → space : `O(1)`

    - char "abcdef" → (N=6, all distinct char) → space : `O(6)`

    - char "Σ size" → (N=Σ) → space : `O(Σ)`

## 4) Boolean Array (ASCII only)

- Simplest and fastest

- when to Use? : Every Input is `ASCII`

```java
public static boolean isUniqueAscii(String s) {
    if (s == null) return true;
    if (s.length() > 128) return false;

    boolean[] seen = new boolean[128];
    for (int i = 0; i < s.length(); i++) {
        int c = s.charAt(i);
        if (c >= 128) return false;
        if (seen[c]) return false;
        seen[c] = true;
    }
    return true;
}
```

- Time : O(N)

- Space : O(1) (constant)

## 5) Bitmask (Restricted Domain: a-z)

- Input only constrains `lowercase English`

- when to Use? : the domain is strictly limited (e.g only lowercase letter)

    - domain : range of values that the input can take

```java
public static boolean isUniqueLowercase(String s) {
    if (s == null) return true;
    int mask = 0;

    for (int i = 0; i < s.length(); i++) {
        char c = s.charAt(i);
        if (c < 'a' || c > 'z') return false;
        int bit = 1 << (c - 'a');
        if ((mask & bit) != 0) return false;
        mask |= bit;
    }
    return true;
}
```

- Explain code

    ```java
    int bit = 1 << (c - 'a');
    ```
    
    bit : 000..00, Insert 1 at the position 

    ```java
    if ((mask & bit) != 0) return false;
    mask |= bit;
    ```

    If there is already 1 at the bit position → duplicate → return false

    Otherwise, use bitwise OR (|) to insert 1

- Example

    ```text
    1.	'c': bit = 1 << 2 = 0100, mask=0 → mask=0100
	2.	'a': bit = 1 << 0 = 0001, mask=0100 → mask=0101
	3.	'b': bit = 1 << 1 = 0010, mask=0101 → mask=0111
    ```

- Time : O(N)

- Space : O(1)
