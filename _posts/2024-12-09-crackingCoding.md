---
title: "[Cracking Coding Problems] Recursion and Dynamic Programming"
author: syJoe
date: 2024-12-09 09:00:00 +0800
categories: [CrackingCoding]
tags: [python, java, c++, go, algorithm]
math: true
description: Explore a practical implementation of the Triple Step Problem using dynamic programming across popular programming languages like Java, Python, C++, and Go. This problem involves counting the number of ways a child can run up a staircase with 𝑛 n steps, hopping 1, 2, or 3 steps at a time
---

# Triple Step: 

- A child is running up a staircase with n steps and can hop either 1 step, 2 steps, or 3 steps at a time. Implement a method to count how many possible ways the child can run up the stairs

### Approach

- Use `bottom-up` approach to store cache (Memoization)

- Base case 
    
    ```text
    step[0] = 0 : stay at starting position
    step[1] = 1 
    step[2] = 2 
    ```

### Java

```java
import java.util.Scanner;

public class CountWays {
    public static int countWays(int n) {
        long[] step = new long[n + 1];
        step[0] = 1;

        if (n >= 1) step[1] = 1;
        if (n >= 2) step[2] = 2;

        for (int i = 3; i <= n; i++) {
            step[i] = step[i - 1] + step[i - 2] + step[i - 3];
        }

        return (int) step[n];
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.println("Enter a number: ");
        int n = scanner.nextInt();

        System.out.println(countWays(n));
    }
}
```

- `Scanner scanner = new Scanner(System.in)`

    Class in `java.util` package
    
    Read the next integer value typed by user

### Python

```python
def countWays(n):
    step = [0] * (n + 1)
    step[0] = 1

    if n >= 1:
        step[1] = 1
    if n >= 2:
        step[2] = 2

    for i in range(3, n + 1):
        step[i] = step[i - 1] + step[i - 2] + step[i - 3]

    return step[n]

if __name__ == "__main__":
    n = int(input("Enter a number: "))
    print(countWays(n))
```

### C++

```c++
#include <iostream>
#include <vector>
using namespace std;

int countWays(int n) {
    vector<long long> step(n+1, 0);
    step[0] = 1;
    if (n >= 1) step[1] = 1;
    if (n >= 2) step[2] = 2;
  
    for (int i = 3; i <= n; i++) {
        step[i] = step[i-1] + step[i-2] + step[i-3];
    }

    return step[n];
}

int main() {
    int n;
    cin >> n;
    cout << countWays(n) << endl;
    return 0;
}
```

### Go

```go
package main

import (
	"fmt"
)

func countWays(n int) int {
	step := make([]int, n+1)
	step[0] = 1

	if n >= 1 {
		step[1] = 1
	}
	if n >= 2 {
		step[2] = 2
	}

	for i := 3; i <= n; i++ {
		step[i] = step[i-1] + step[i-2] + step[i-3]
	}

	return step[n]
}

func main() {
	var n int
	fmt.Scan(&n)
	fmt.Println(countWays(n))
}
```

- Recursive algorithms can be very space inefficient. For the reason, it is often better to implement a recursive algorithm iteratively

- Use `Memoization`(cache using Array)

    Overall time complexity : `O(n)` and Space complexity is `O(n)`

- If not use `Memorization` then

    Overall time complexity : `O(3^n)` and Space complexity is `O(n)`

    Because there are up to 3 possible branches (hopping 1,2,3)