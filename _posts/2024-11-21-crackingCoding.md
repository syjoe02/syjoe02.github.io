---
title: "[Cracking Coding Problems] Bitwise Operations"
author: syJoe
date: 2024-11-21 09:00:00 +0800
categories: [CrackingCoding]
tags: [python, java, c++, go, algorithm]
description: The Build Order problem involves finding a valid sequence to build a set of projects given dependencies between them. This can be modeled as a directed graph where nodes represent projects and edges represent dependencies. The goal is to perform a topological sort to determine the build order, ensuring that a project is not built before its dependencies
---

# Pairwise Swap

- Write a program to swap odd and even bits in an integer with as few instructions as possible 

    (e.g., bit 0 and bit 1 are swapped, bit 2 and bit 3 are swapped, and so on)

### Approach

- Create `odd` and `even` masks using hexadecimal (0xAAAAAAAA for Odd and 0x55555555 for even)

- Use the `AND` to separate the ood and even bits

- Since odd bits are at positions 1, 3, 5, 7, ..., shift them right by 1 bit `>> 1` to move them to even positions (0, 2, 4, 6, ...)

- Shift the even bits left by 1 bit `<< 1`

- Combine the shifted ood and even bit using the OR operation

### Prerequisite

- Bitwise Operations

### Python

```python
def pairwiseSwap(n):
    oddMask = 0xAAAAAAAA
    evenMask = 0x55555555

    oddBits = (n & oddMask) >> 1
    evenBits = (n & evenMask) << 1

    return oddBits | evenBits

# Example usage
n = 0b10101010  # 170 in decimal
result = pairwiseSwap(n)
print(f"Input:  {bin(n)}")
print(f"Output: {bin(result)}")
```

- Prefix `0x` indicates a hexadecimal number

    `0b` indicates a binary number

### Java

```java
public class PairwiseSwap {
    public static int pairwiseSwap(int n) {
        int oddMask = 0xAAAAAAAA;
        int evenMask = 0x55555555;

        int oddBits = (n & oddMask) >>> 1;
        int evenBits = (n & evenMask) << 1;

        return oddBits | evenBits;
    }

    public static void main(String[] args) {
        int n = 0b10101010; // 170 in decimal
        int result = pairwiseSwap(n);
        System.out.println("Input:  " + Integer.toBinaryString(n));
        System.out.println("Output: " + Integer.toBinaryString(result));
    }
}
```

- `.toBinaryString` method : Convert an `int` into `binary` as a string

### C++

```c++
#include <iostream>
#include <bitset>
using namespace std;

unsigned int pairwiseSwap(unsigned int n) {
    unsigned int oddMask = 0xAAAAAAAA;
    unsigned int evenMask = 0x55555555;

    unsigned int oddBits = (n & oddMask) >> 1;
    unsigned int evenBits = (n & evenMask) << 1;

    return oddBits | evenBits;
}

int main() {
    unsigned int n = 0b10101010; // 170 in decimal
    unsigned int result = pairwiseSwap(n);

    cout << "Input:  " << bitset<8>(n) << endl;
    cout << "Output: " << bitset<8>(result) << endl;

    return 0;
}
```

### Go

```go
package main

import (
	"fmt"
)

func pairwiseSwap(n uint) uint {
	oddMask := uint(0xAAAAAAAA)
	evenMask := uint(0x55555555)

	oddBits := (n & oddMask) >> 1
	evenBits := (n & evenMask) << 1

	return oddBits | evenBits
}

func main() {
	n := uint(0b10101010) // 170 in decimal
	result := pairwiseSwap(n)
	fmt.Printf("Input:  %08b\n", n)
	fmt.Printf("Output: %08b\n", result)
}
```

- Go : `uint` == C++ : `unsigned int`
