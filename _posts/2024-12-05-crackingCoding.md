---
title: "[Cracking Coding Problems] OOP"
author: syJoe
date: 2024-12-05 09:00:00 +0800
categories: [CrackingCoding]
tags: [java]
math: true
description: Efficiently handle customer queries with this detailed Java implementation of a Call Center Management System. Designed for optimal call routing and escalation management, this system includes three hierarchical employee levels.  The program utilizes core concepts such as object-oriented programming (OOP), encapsulation, and deque-based queuing to assign calls dynamically to the first available employee. It includes robust features such as call escalation, handler assignment, and resource release management.
---

# Call Center: 

- Imagine you have a call center with three levels of employees: respondent, manager, and director. An incoming telephone call must be first allocated to a respondent who is free

    If the respondent can't handle the call, he or she must escalate the call to a manager. If the manager is not free or not able to handle it, then the call should be escalated to a director
    
    Design the classes and data structures for this problem. Implement a method dispatchCall() which assigns a call to the first available employee

### Approach

- Employees have 3 different roles. But the task(`handling call`) is the same. So, It is reusable

- Using `Deque` enables efficient queuing

### Prerequisite

- Java

### Java

```java
import java.util.ArrayDeque;
import java.util.Deque;

class Call {
    private String caller;
    private Employee handler;

    public Call(String caller) {
        this.caller = caller;
        this.handler = null;
    }

    public String getCaller() {
        return caller;
    }

    public Employee getHandler() {
        return handler;
    }

    public void setHandler(Employee handler) {
        if (handler == null) {
            throw new IllegalArgumentException("Handler cannot be null");
        }

        this.handler = handler;
    }
}

abstract class Employee {
    private String name;
    private String rank; // respondent, manager, director 
    private boolean isFree;

    public Employee(String name, String rank) {
        this.name = name;
        this.rank = rank;
        this.isFree = true;
    }

    public boolean isFree() {
        return isFree;
    }

    public void handleCall(Call call) {
        this.isFree = false;
        call.setHandler(this);
        System.out.println(this.rank.substring(0, 1).toUpperCase() + this.rank.substring(1) 
                           + " " + this.name + " is handling the call from " + call.getCaller() + ".");
    }

    public void finishCall() {
        this.isFree = true;
        System.out.println(this.rank.substring(0, 1).toUpperCase() + this.rank.substring(1) 
                           + " " + this.name + " is now free.");
    }
}

class Respondent extends Employee {
    public Respondent(String name) {
        super(name, "respondent");
    }
}

class Manager extends Employee {
    public Manager(String name) {
        super(name, "manager");
    }
}

class Director extends Employee {
    public Director(String name) {
        super(name, "director");
    }
}

class CallCenter {
    private Deque<Respondent> respondents;
    private Deque<Manager> managers;
    private Deque<Director> directors;

    public CallCenter() {
        this.respondents = new ArrayDeque<>();
        this.managers = new ArrayDeque<>();
        this.directors = new ArrayDeque<>();
    }

    public void addEmployee(Employee employee) {
        if (employee instanceof Respondent) {
            respondents.add((Respondent) employee);
        } else if (employee instanceof Manager) {
            managers.add((Manager) employee);
        } else if (employee instanceof Director) {
            directors.add((Director) employee);
        }
    }

    public void dispatchCall(Call call) {
        for (Deque<? extends Employee> queue : new Deque[]{respondents, managers, directors}) {
            for (Employee employee : queue) {
                if (employee.isFree()) {
                    employee.handleCall(call);
                    return;
                }
            }
        }
        System.out.println("No employees are available to handle the call from " + call.getCaller() + ". Call is in queue.");
    }

    public void releaseEmployee(Employee employee) {
        employee.finishCall();
    }
}

public class Main {
    public static void main(String[] args) {
        CallCenter callCenter = new CallCenter();

        // Add employees
        callCenter.addEmployee(new Respondent("Alice"));
        callCenter.addEmployee(new Respondent("Bob"));
        callCenter.addEmployee(new Manager("Charlie"));
        callCenter.addEmployee(new Director("Diana"));

        // Incoming calls
        Call call1 = new Call("John Doe");
        Call call2 = new Call("Jane Smith");
        Call call3 = new Call("Customer X");

        callCenter.dispatchCall(call1); // Alice handles the call
        callCenter.dispatchCall(call2); // Bob handles the call
        callCenter.dispatchCall(call3); // Charlie handles the call (escalated)

        callCenter.releaseEmployee(call1.getHandler());
        callCenter.releaseEmployee(call2.getHandler());
        callCenter.releaseEmployee(call3.getHandler());

        Call call4 = new Call("Customer Y");
        callCenter.dispatchCall(call4); // Alice handles the call again
    }
}
```

### Call Class

- `caller` and `handler` fields : set as `private` to ensure encapsulation

    It prevents `direct access` to this fields (call.caller -> forbidden)

    By providing indirect access via `methods`(getCaller, getHandler and setHandler), offers the `Data Protection` and `Validation`

    ```java
    public void setHandler(Employee handler) {
        if (handler == null) {
            throw new IllegalArgumentException("Handler cannot be null");
        }

        this.handler = handler;
    }
    ```

- `return;` is used to `stop` the execution of the function

    Usually used in `void` functions

### Employee 

- `this`

    ```java
    public void handleCall(Call call) {
        this.isFree = false;
        call.setHandler(this);
        ...
    }
    ```
    
    `call.setHandler(this)` value : assinged the employee 

- Print line

    ```java
    System.out.println(this.rank.substring(0, 1).toUpperCase() + this.rank.substring(1) 
                           + " " + this.name + " is handling the call from " + call.getCaller() + ".");
    ```

    this.rank.substring(0,1).toUpperCase() -> Change the first character to uppercase ("respondent" -> "R")

    this.rank.substring(1) -> print word without the first character ("respondent" -> "espondent")

- `super`

    `super(name, "respondent")` calls the parent class(Employee) constructor(Employee(String name, String rank))
    
    and initialize the Employee class fields (name and rank)

### CallCenter

- `addEmplyee` Method

    `employee instanceof Responent` checks if the employee(object) is an instance of the `Respondent` class or subclass

    If it is true, the `employee` is cast to the `Respondent` type. Because only `Respondent`(objects) are added to the deque

- Why cast?

    `respondents` deque is typed as `Deque<Respondent>`. Only objects of type(Respondent) can added

- `public void dispatchCall(Call call)` Method

    - for (Deque<? extends Employee> queue : new Deque[]{respondents, managers, directors})

        Loops (respondents, managers, directors) and assign to the `queue`(variable) one by one in each iteration

    - for (Employee employee : queue)

        Example. `respondents` during the first iteration of the loop, each employee in the queue is assigned to the `employee`(variable)
