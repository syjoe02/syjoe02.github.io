---
title: Mastering Data Structures & Alogrithms
author: syJoe
date: 2023-11-02 00:23:00 +0900
categories: [Udemy]
tags: [C++]
comments: true  
---

Online course lectures up to the 30th

## Class 

```c++
# include <iostream>
using namespace std;

class Arithmetic
{
private:
		int a;
		int b;
public:
	Arithmetic(int a, int b)
	{
		this->a=a;
		this->b=b;
	}
	int add()
	{
		int c;
		c = a + b;
		return c;
	}
	int sub()
	{
		int c;
		c = a - b;
		return c;
	}
};

int main(void)
{
	Arithmetic ar(10,5);
	
	cout<<"Add "<<ar.add()<<endl;
	cout<<"Sub "<<ar.sub()<<endl;
	return 0;
}
```



## Scope Resolution

```c++
# include <iostream>
using namespace std;

class Arithmetic
{
	private:
		int a;
		int b;
	public:
		Arithmetic(int a, int b);
		int add();
		int sub();
};

Arithmetic::Arithmetic(int a, int b)
{
	this->a=a;
	this->b=b;
}
int Arithmetic::add()
{
	int c;
	c = a + b;
	return c;
}
int Arithmetic::sub()
{
	int c;
	c = a - b;
	return c;
}

int main(void)
{
	Arithmetic ar(10,5);
	
	cout<<"Add "<<ar.add()<<endl;
	cout<<"Sub "<<ar.sub()<<endl;
	return 0;
}
```


## Template

```c++
# include <iostream>
using namespace std;

template<class T>
class Arithmetic
{
	private:
		T a;
		T b;
	public:
		Arithmetic(T a, T b);
		T add();
		T sub();
};

template<class T>
Arithmetic<T>::Arithmetic(T a, T b)
{
	this->a=a;
	this->b=b;
}

template<class T>
T Arithmetic<T>::add()
{
	T c;
	c = a + b;
	return c;
}

template<class T>
T Arithmetic<T>::sub()
{
	T c;
	c = a - b;
	return c;
}

int main(void)
{
	Arithmetic<int> ar(10,5);
	Arithmetic<float> ar1(10.5,5.3);
	Arithmetic<char> ar('a','b');
	
	cout<<"Add "<<ar.add()<<endl;
	cout<<"Sub "<<ar.sub()<<endl;
	return 0;
}
```