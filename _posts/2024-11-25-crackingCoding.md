---
title: "[Cracking Coding Problems] Logical Puzzles"
author: syJoe
date: 2024-11-25 09:00:00 +0800
categories: [CrackingCoding]
tags: [python, algorithm]
math: true
description: Dive into a collection of classic logic puzzles, complete with detailed explanations, mathematical approaches, and Python code implementations to verify and visualize the solutions. Whether you're preparing for interviews, enhancing your problem-solving skills, or just love a good challenge, these puzzles will captivate your interest
---

# Basketball

- You have a basketball hoop and someone says that you can play one of two games.
    
    - Game 1: You get one shot to make the hoop.
    - Game 2: You get three shots and you have to make two of three shots.

    If p is the probability of making a particular shot, for which values of p should you pick one game
    or the other?

### Approach

- Calculate probability with the probability mass function of a binomial distribution 

    $$
    P(X = k) = \binom{n}{k} p^k (1-p)^{n-k}
    $$

    - P(X = k) = (n choose k) * p^k * (1-p)^(n-k)

- Game1 : P(game1) = p

- Game 2 : P(X = 2) + P(X = 3)

### Prerequisite

- Probability

### Python

```python
import numpy as np
import matplotlib.pyplot as plt

def game1_probability(p):
    return p

def game2_probability(p):
    return 3 * p**2 * (1 - p) + p**3

p_values = np.linspace(0, 1, 1000)
game1_probs = game1_probability(p_values)
game2_probs = game2_probability(p_values)

# plot
plt.figure(figsize=(10, 6))
plt.plot(p_values, game1_probs, label="Game 1 Probability")
plt.plot(p_values, game2_probs, label="Game 2 Probability")
plt.axvline(x=0.5, color='red', linestyle='--', label="Intersection (~0.5)")
plt.xlabel("Probability of Making a Shot (p)")
plt.ylabel("Winning Probability")
plt.title("Comparison of Winning Probabilities for Game 1 and Game 2")
plt.legend()
plt.grid()
plt.show()

# Determine for which values of p to choose each game
for p in [0.1, 0.3, 0.5, 0.7, 0.9]:
    g1 = game1_probability(p)
    g2 = game2_probability(p)
    if g1 > g2:
        print(f"For p = {p:.2f}, choose Game 1 (P1: {g1:.3f}, P2: {g2:.3f})")
    else:
        print(f"For p = {p:.2f}, choose Game 2 (P1: {g1:.3f}, P2: {g2:.3f})")
```

- Result Graph

    ![Alt text](../assets/img/blog/result_graph.png)

# Dominos

- There is an 8x8 chessboard in which two diagonally opposite corners have been cut off. You are given 31 dominos, and a single domino can cover exactly two squares. Can you use the 31 dominos to cover the entire board? Prove your answer (by providing an example or showing why `it's impossible`)

### Approach

- Domino covers exactly 2 squares that are adjacent to each other. And chessboard squares are different colors (Black and White)

- So, when Domino cover exactly two squares, It will always cover one black and one while

- Therefore, the number of black squares and white squares must be equal

- However, Every chessboard always the same color in the diagonally opposite corners

- Thus, It is impossible

### Python

```python
def can_cover_with_dominos():
    board = [[(i + j) % 2 for j in range(8)] for i in range(8)]
    # Delete two diagonally opposite corners
    board[0][0] = -1
    board[7][7] = -1
    
    black_count = sum(cell == 1 for row in board for cell in row)
    white_count = sum(cell == 0 for row in board for cell in row)
    
    print("Black squares:", black_count)
    print("White squares:", white_count)
    
    if black_count != white_count:
        return "Impossible to cover the board with 31 dominos."
    else:
        return "Possible to cover the board with 31 dominos."

print(can_cover_with_dominos())
```

- Proof: The opposite corners of an N * N chessboard have the same color

    - Example
   
        If (i + j) is even == white
        
        If (i + j) is odd == black
        
        And (0, 0) is even == white
    
    - So, The bottom-right corner is

        (N - 1) + (N - 1) = 2N - 2 == Always `even`

# 100 Lockers

- There are 100 closed lockers in a hallway. A man begins by opening all 100 lockers. Next, he closes every second locker. 

    Then, on his third pass, he toggles every third locker (closes it if it is open or opens it if it is closed). 
    
    This process continues for 100 passes, such that on each pass i, the man toggles every ith locker. After his 100th pass in the hallway, in which he toggles only locker #100, how many lockers are open?

### Approach

- For example, scenario with 6 lockers (not a 100)

    ```text
    O : open , C : close

    1 2 3 4 5 6
    O O O O O O
      C   C   C
        C     O
          O
            C
              C
    ```

    Only 1, 4 locker is opened

- Odd number of divisors (1, 4, 9, ...) == Locker is always closed

    2 of divisor : 1, 2 (even) == Locker is closed

    6 of divisor : 1, 2, 3, 6 (even) == Locker is closed

- Thus, only lockers numbered as perfect squares will remain open

### Python

```python
def countOpenLockers(n):
    return int(n**0.5)

# Ask the number of lockers
try:
    n = int(input("Number of lockers : "))
    if n <= 0:
        print("Only positive integer")
    else:
        result = countOpenLockers(n)
        print(f"Number of openv lockers for {n} lockers : {result}")
except ValueError:
    print("Invalid Input")
```

# Posion

- You have 1000 bottles of soda, and exactly one is poisoned. You have 10 test strips which
can be used to detect poison. A single drop of poison will turn the test strip positive permanently.

    You can put any number of drops on a test strip at once and you can reuse a test strip as many time as you'd like (as long as the results are negative). 

    However, you can only run tests once per day and it takes seven days to return a result. How would you figure out the poisoned bottle in as few days as possible?