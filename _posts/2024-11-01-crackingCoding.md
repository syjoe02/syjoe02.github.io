---
title: Cracking Coding Problems (4 different Languages)
author: syJoe
date: 2024-10-27 09:00:00 +0800
categories: [LeetCode]
tags: [c++, python, algorithm, go, java]
description: 
---

# One Away

- There are three types of edits that can be performed on strings: insert a character,
remove a character, or replace a character. Given two strings, write a function to check if they are
one edit (or zero edit) away.

  ```text
  pale, ple -> true
  pales, pale -> true
  pale, bale -> true
  pale, bake -> false
  ```

### Approach

- If the `shorter` character == `longer` character , increment both indics by 1

- If the `shorter` character != `longer` character , increment only the `longer` index by 1

  To check if a deletion would make the string match

- If the `shorter` length == `longer` length , increment both indics by 1

### Python

```python
def one_away(s1, s2):
    if abs(len(s1) - len(s2)) > 1:
        return False

    shorter = s1 if len(s1) < len(s2) else s2
    longer = s1 if len(s1) >= len(s2) else s2

    index1 = 0
    index2 = 0
    foundDifference = False

    while index1 < len(shorter) and index2 < len(longer):
        if shorter[index1] != longer[index2]:
            if foundDifference:
                return False
            foundDifference = True

            if len(shorter) == len(longer):
                index1 += 1
        else:
            index1 += 1
        index2 += 1

    return True

# Test main function
if __name__ == "__main__":
    print(one_away("pale", "ple"))  # True
    print(one_away("pales", "pale"))  # True
    print(one_away("pale", "bale"))  # True
    print(one_away("pale", "bake"))  # False
```

### Java

```java
public class OneAway {

    public static boolean oneAway(String s1, String s2) {
        if (Math.abs(s1.length() - s2.length()) > 1) {
            return false;
        }

        String shorter = s1.length() < s2.length() ? s1 : s2;
        String longer = s1.length() >= s2.length() ? s1 : s2;

        int index1 = 0, index2 = 0;
        boolean foundDifference = false;

        while (index1 < shorter.length() && index2 < longer.length()) {
            if (shorter.charAt(index1) != longer.charAt(index2)) {
                if (foundDifference) {
                    return false;
                }
                foundDifference = true;

                if (shorter.length() == longer.length()) {
                    index1++;
                }
            } else {
                index1++;
            }
            index2++;
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println(oneAway("pale", "ple")); // True
        System.out.println(oneAway("pales", "pale")); // True
        System.out.println(oneAway("pale", "bale")); // True
        System.out.println(oneAway("pale", "bake")); // False
    }
}
```

- `Python` : shorter[index1] == `Java` : shorter.charAt(index1)

- Ternary Operator

  `Python` : shorter = s1 if len(s1) < len(s2) else s2

  `Java` : String shorter = s1.length() < s2.length() ? s1 : s2;

### C++

```c++
#include <iostream>
#include <string>
#include <cmath>

bool oneAway(const std::string& s1, const std::string& s2) {
    if (std::abs((int)s1.size() - (int)s2.size()) > 1) {
        return false;
    }

    const std::string& shorter = s1.size() < s2.size() ? s1 : s2;
    const std::string& longer = s1.size() >= s2.size() ? s1 : s2;

    int index1 = 0, index2 = 0;
    bool foundDifference = false;

    while (index1 < shorter.size() && index2 < longer.size()) {
        if (shorter[index1] != longer[index2]) {
            if (foundDifference) {
                return false;
            }
            foundDifference = true;

            if (shorter.size() == longer.size()) {
                index1++;
            }
        } else {
            index1++;
        }
        index2++;
    }
    return true;
}

int main() {
    std::cout << std::boolalpha;
    std::cout << oneAway("pale", "ple") << std::endl;  // True
    std::cout << oneAway("pales", "pale") << std::endl;  // True
    std::cout << oneAway("pale", "bale") << std::endl;  // True
    std::cout << oneAway("pale", "bake") << std::endl;  // False
}
```

- Why use `(int)` for type conversion

  1. `std::string::size()` method returns a `size_t` type.

  2. `size_t` is an unsigned integer type. It could be negative, converting `size_t` to `int` is a safe approach

-  `const` means constant. s1 and s2 are read-only, cannot be modified

- What if not use `&`

  ```c++
  bool oneAway(std::string s1, std::string s2) {  // Removed '&' to pass by value
      if (std::abs((int)s1.size() - (int)s2.size()) > 1) {
          return false;
      }
      
      // Pass by value
      std::string shorter = s1.size() < s2.size() ? s1 : s2;
      std::string longer = s1.size() >= s2.size() ? s1 : s2;
  ```
  1. If strings are passed by value, copies of the strings are created (Only C++)

  2. Remove `const`. So the strings are now passed by value, which means copies of `s1` and `s2` are created inside the function -> Increase memory usage


### GO

```go
package main

import (
	"fmt"
	"math"
)

func oneAway(s1, s2 string) bool {
	if math.Abs(float64(len(s1)-len(s2))) > 1 {
		return false
	}

	shorter, longer := s1, s2
	if len(s1) > len(s2) {
		shorter, longer = s2, s1
	}

	index1, index2 := 0, 0
	foundDifference := false

	for index1 < len(shorter) && index2 < len(longer) {
		if shorter[index1] != longer[index2] {
			if foundDifference {
				return false
			}
			foundDifference = true

			if len(shorter) == len(longer) {
				index1++
			}
		} else {
			index1++
		}
		index2++
	}

	return true
}

func main() {
	fmt.Println(oneAway("pale", "ple"))   // True
	fmt.Println(oneAway("pales", "pale")) // True
	fmt.Println(oneAway("pale", "bale"))  // True
	fmt.Println(oneAway("pale", "bake"))  // False
}
```

- `:=` To declare and initialize variables quickly in GO

  If I don't use `:=` (colon-equals),

  ```go
  var index1, index2 int
  var foundDifference bool

  index1 = 0
  index2 = 0
  ```
