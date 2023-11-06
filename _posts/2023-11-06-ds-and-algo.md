---
title: 3. Mastering Data Structures & Alogrithms
author: syJoe
date: 2023-11-06 00:12:00 +0900
categories: [Udemy]
tags: [C++]
comments: true  
---

Online course lectures up to the 45th

## Data Structure

- Each data structure contains information about the data values, relationships between the data and functions that can be applied to the data

- staying inside the main memory during the execution

### Database

- Collection of structure data used for storing, retrieving, adding, modifying, and deleting information

- Stored on a HDD ```Hard Disk Drive Storage```, and the data is typically arranged in tables

- RDBMS, Relational Database Management Systems are the most commonly used software to manage databases

### Data Warehouse

- A large collection of data that is currently ```inactive```. 

- Collects data from various sources within an organization and uses that data to provide bussiness insights through analysis

- Typically, It preserve data over a long period of time, useful for historial analysis

### Big data

- Large amounts of data accumulating daily on the internet


## Physical VS Logical Data Structure

### Physical Data Structure

- Manage how the data will be stored in the memory of a comptuer. 

- Directly deals with the memory storage operations 

- Array / Linked List



### Logical Data Structure

- high-level, abstract data sturcture that help to organize and manipulate the data in a more efficient

- Not deal with the memory organization, But focus on ```the logical view or task```

- Stack / Queue / Trees / Graph / Hash Table

## ADT (Abstract Data Type)

- Encapsulate the data and operations it can be performed on the data.

- It does not reveal the internal working of the data structure, hence the term ```abstract```

### Why?

- It allows us to focus on what the data structure does

- It makes it easier to manage complex systems by separating the interface (what the system does) from the implementation (how the system does it).

### Example

```Python
class Stack:
    def __init__(self):
        self.stack = []

    # Operation: push
    def push(self, item):
        self.stack.append(item)

    # Operation: pop
    def pop(self):
        if len(self.stack) < 1:
            return None
        return self.stack.pop()

    # Operation: peek (view the top item)
    def peek(self): 
        if not self.stack:
            return None
        return self.stack[-1]

    # Operation: is_empty (check if the stack is empty)
    def is_empty(self):
        return not bool(self.stack)

    # Operation: size (get the size of the stack)
    def size(self):
        return len(self.stack)
```

- Data : ```self.stack``` and Operations : ```push, pop, peek, is_empty, size```

## Time & Space Complexity

