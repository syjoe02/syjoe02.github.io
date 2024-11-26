---
title: "[Cracking Coding Problems] Backetball hoop"
author: syJoe
date: 2024-11-25 09:00:00 +0800
categories: [CrackingCoding]
tags: [python, algorithm]
math: true
description: This logic puzzle explores the probabilities of success in two basketball games and determines which game to choose based on the probability of making a shot
---

# Logic Puzzles

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
