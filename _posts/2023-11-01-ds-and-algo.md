---
title: "[Mastering Data Structures and Algorithms] Pointers, Structures, and Function Calls in C++"
author: syJoe
date: 2023-11-01 00:00:00 +0900
categories: [Udemy]
tags: [c++, algorithm]
description: This post covers fundamental concepts in C++ programming, including pointers, dereferencing and referencing, structures, and function calls. Learn about memory management with pointers, the advantages of using structures for data organization, and the differences between call by value and call by reference.
---

# Udemy

Online course lectures up to the 16th

### 1. **Pointer**

pointers is an address variable.

- Using pointer is accessing ```heap``` memory

- Accessing the external resources

- Pointers are used for <u>parameter passing</u>

### 2. **Dereferencing AND Referencing**

- Dereferencing : It is the operation of <u>retrieving the value stored at the memory address</u> pointed to by a pointer variable.

    ```int *p```

- Referencing : The process of obtaining the memory address of a specific variable

    ```c++
    int A[5] = {2,4,6,8,10};

    p = &A[0] //reference
    p = A     //reference
    ```

    Even though variable a has another name, ```r```, it still refers to <u>the same memory location.</u>

    ```c++
    int main ()
    {
        int a=10;
        int &r=a; // reference  

        cout<<a;  // 10
        r++;
        cout<<r;  // 11
        cout<<a;  // 11
    }
    ```

### 3. **Struct**

```c++
struct Rectagle
{
	int length;  // member
	int breadth; // member
}
```

It represents a structure that holds the length and breadth of a rectangle as its members. Each member represents the length and breadth values within the Rectangle structure.

### 4. **Advantages of using structure**

- Grouping related data 

- Easy data management

### 5. **Malloc**

```c++
struct Rectagle
{
	int length;
	int breadth;
}

int main()
{
	struct Rectangle *p;
	// for c, create it in heap
	p = (struct Rectagle *)malloc(sizeof(struct Rectagle)); 
	// for c++, create it in heap, but simple
	p = new Rectagle;
	p -> length = 10;
	p -> breadth = 5;
}
```

- When using ```malloc()```, we need to ```typecast``` the returned value to the appropriate pointer type because <u>malloc() returns a void pointer.</u>

- Void pointers cannot perform pointer arithmetic so I need to convert (typecast) it to the appropriate type. ```struct Rectangle *```

- ```struct Rectangle *``` allows to use the dynamically allocated memory as a struct Rectangle data.



### 6. **Function**

- Monolithic Programming : Everything inside the main function. 

- Modular Programming OR Procedural Programming : Breaking a code into smaller pieces of functions.

    ```c++
    int main() {
        fun1(); 
        fun2();
    }
    ```

### A. **Call by Value**

This is a method of function calling where the actual value of the variable is passed to the function.

| main values (A, B) | → 

| swap function (B, A) : modified | →  

| main values (A,B) : But main isn't modified |

### B. **Call by Reference**

This is a method of function calling where a reference (the address) to the original variable is passed to the function. 

```void swap(int &x, int &y)```

| main values (A, B) | → 

| swap function (B, A) : modified | →  

| main values (B, A) : modified |
