---
title: "[Cracking Coding Problems] Double Linked List and HashMap"
author: syJoe
date: 2024-11-13 09:00:00 +0800
categories: [CrackingCoding]
tags: [python, java, c++, go, algorithm]
description: The Build Order problem involves finding a valid sequence to build a set of projects given dependencies between them. This can be modeled as a directed graph where nodes represent projects and edges represent dependencies. The goal is to perform a topological sort to determine the build order, ensuring that a project is not built before its dependencies
---

# Build Order

### Approach

- Create the `inDegree` dictionary to represent the number of dependencies for each project

- If the `inDegree` == 0, add the project to the queue 

- For each project dequeued, append it to the `buildOrder` list and update the `inDegree` of its dependent projects

- If any dependent project's `inDegree` == 0, add it to the queue

### Prerequisite

- `deque` : Unlike a list, a deque is optimized for O(1) time complexity when appending or popping elements from either end, making it for implementing queue or stacks

### Python

```python
from collections import defaultdict, deque

def findBuildOrder(projects, dependencies):
    # Initialize
    graph = defaultdict(list)
    inDegree = {project: 0 for project in projects}

    # Update the graph and in-degree count
    for from_proj, to_proj in dependencies:
        graph[from_proj].append(to_proj)
        inDegree[to_proj] += 1
        # Result : 
        #  graph = {
        #  "a": ["d"],
        #  "f": ["b", "a"],
        #  "b": ["d"],
        #  "d": ["c"]

    # Queue for nodes with in-degree 0
    queue = deque([project for project in projects if inDegree[project] == 0])
    buildOrder = []

    # Topological sort
    while queue:
        current = queue.popleft()
        buildOrder.append(current)

        for neighbor in graph[current]:
            inDegree[neighbor] -= 1
            if inDegree[neighbor] == 0:
                queue.append(neighbor)

    if len(buildOrder) != len(projects):
        raise ValueError("Error: No valid build order")

    return buildOrder

# Test case
projects = ["a", "b", "c", "d", "e", "f"]
dependencies = [
    ("a", "d"),
    ("f", "b"),
    ("b", "d"),
    ("f", "a"),
    ("d", "c")
]

try:
    buildOrder = findBuildOrder(projects, dependencies)
    print("Build Order:", ", ".join(buildOrder))
except ValueError as e:
    print(e)
```

- `defaultdict` : Similar to a regular dictionary. Automatically creates a default value for a key if it does not exist

- `deque` : Allow fast and efficient addition and removal of elements from both ends (Double-ended queue)

### Java

```java
import java.util.*;

public class BuildOrder {
    public static List<String> findBuildOrder(String[] projects, String[][] dependencies) {
        // Initialize dictionaries
        Map<String, List<String>> graph = new HashMap<>();
        Map<String, Integer> inDegree = new HashMap<>();

        // Initialize project nodes
        for (String project : projects) {
            graph.put(project, new ArrayList<>());
            inDegree.put(project, 0);
        }

        for (String[] dependency : dependencies) {
            String from = dependency[0];
            String to = dependency[1];

            graph.get(from).add(to);
            inDegree.put(to, inDegree.get(to) + 1);
        }

        // Queue for nodes with in-degree 0
        Queue<String> queue = new LinkedList<>();
        for (String project : inDegree.keySet()) {
            if (inDegree.get(project) == 0) {
                queue.add(project);
            }
        }

        // Topological sort
        List<String> buildOrder = new ArrayList<>();
        while (!queue.isEmpty()) {
            String current = queue.poll();
            buildOrder.add(current);

            // Remove outgoing edges from the current node
            for (String neighbor : graph.get(current)) {
                inDegree.put(neighbor, inDegree.get(neighbor) - 1);

                if (inDegree.get(neighbor) == 0) {
                    queue.add(neighbor);
                }
            }
        }

        if (buildOrder.size() != projects.length) {
            throw new IllegalArgumentException("Error: No valid build order");
        }

        return buildOrder;
    }

    public static void main(String[] args) {
        String[] projects = {"a", "b", "c", "d", "e", "f"};
        String[][] dependencies = {
            {"a", "d"},
            {"f", "b"},
            {"b", "d"},
            {"f", "a"},
            {"d", "c"}
        };

        try {
            List<String> buildOrder = findBuildOrder(projects, dependencies);
            System.out.println("Build Order: " + String.join(", ", buildOrder));
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
        }
    }
}
```

- Java : `HashMap` == Python : `dictionary`
    
    Map<String, Integer> map = new HashMap<>(); == map = {}

- `keySet()` method returns a set view of all the keys in the map

    - Example : 
    ```java

    Map<String, Integer> inDegree = new HashMap<>();
    inDegree.put("a", 0);
    inDegree.put("b", 1);
    inDegree.put("c", 2);

    for (String project : inDegree.keySet()) {
        System.out.println(project);
    }
    ```
    - Output : a b c (all keys)

### C++

```c++
#include <iostream>
#include <vector>
#include <unordered_map>
#include <queue>

using namespace std;

vector<string> findBuildOrder(vector<string>& projects, vector<pair<string, string>>& dependencies) {
    unordered_map<string, vector<string>> graph;
    unordered_map<string, int> inDegree;

    // Initialize
    for (const auto& project : projects) {
        graph[project] = {};
        inDegree[project] = 0;
    }

    for (const auto& dep : dependencies) {
        string from = dep.first;
        string to = dep.second;
        graph[from].push_back(to);
        inDegree[to]++;
    }

    // Queue for nodes with in-degree 0
    queue<string> q;
    for (const auto& project : projects) {
        if (inDegree[project] == 0) {
            q.push(project);
        }
    }

    // Topological sort
    vector<string> buildOrder;
    while (!q.empty()) {
        string current = q.front();
        q.pop();
        buildOrder.push_back(current);

        for (const auto& neighbor : graph[current]) {
            inDegree[neighbor]--;
            if (inDegree[neighbor] == 0) {
                q.push(neighbor);
            }
        }
    }

    if (buildOrder.size() != projects.size()) {
        throw invalid_argument("Error: No valid build order exists due to a cycle.");
    }

    return buildOrder;
}

int main() {
    vector<string> projects = {"a", "b", "c", "d", "e", "f"};
    vector<pair<string, string>> dependencies = {
        {"a", "d"},
        {"f", "b"},
        {"b", "d"},
        {"f", "a"},
        {"d", "c"}
    };

    try {
        vector<string> buildOrder = findBuildOrder(projects, dependencies);
        cout << "Build Order: ";
        for (const auto& project : buildOrder) {
            cout << project << " ";
        }
        cout << endl;
    } catch (const exception& e) {
        cout << e.what() << endl;
    }

    return 0;
}
```

### Go

```go
package main

import (
	"errors"
	"fmt"
)

func findBuildOrder(projects []string, dependencies [][2]string) ([]string, error) {
	graph := make(map[string][]string)
	inDegree := make(map[string]int)

	// Initialize
	for _, project := range projects {
		graph[project] = []string{}
		inDegree[project] = 0
	}

	for _, dep := range dependencies {
		from, to := dep[0], dep[1]
		graph[from] = append(graph[from], to)
		inDegree[to]++
	}

	// Queue for nodes with in-degree 0
	queue := []string{}
	for _, project := range projects {
		if inDegree[project] == 0 {
			queue = append(queue, project)
		}
	}

    // Topological sort
	buildOrder := []string{}
	for len(queue) > 0 {
		current := queue[0]
		queue = queue[1:]
		buildOrder = append(buildOrder, current)

		for _, neighbor := range graph[current] {
			inDegree[neighbor]--
			if inDegree[neighbor] == 0 {
				queue = append(queue, neighbor)
			}
		}
	}

	if len(buildOrder) != len(projects) {
		return nil, errors.New("Error: No valid build order")
	}

	return buildOrder, nil
}

func main() {
	projects := []string{"a", "b", "c", "d", "e", "f"}
	dependencies := [][2]string{
		{"a", "d"},
		{"f", "b"},
		{"b", "d"},
		{"f", "a"},
		{"d", "c"},
	}

	buildOrder, err := findBuildOrder(projects, dependencies)
	if err != nil {
		fmt.Println(err)
	} else {
		fmt.Println("Build Order:", buildOrder)
	}
}
```

- `_` : blank identifier. It is used when you want to ignore a value in a loop
