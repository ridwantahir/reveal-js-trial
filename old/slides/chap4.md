## SVG ANIMATION
Dataflow in the Ocean
![Sample image](./slides/images/a4.svg) <!-- .element: class="data-svg-animate" -->
---

### Header added

<div class="grid-container">

<div class="fragment itemleft">

<pre><code> 					
        class Food:
            def __init__(self, name, age):
                self.name = name
                self.age = age

            def eat(self):
                print("Hello my name is " + self.name)

            p1 = Food("John", 36)
            p1.eat() 
</code></pre>

</div>

<div class="fragment itemright">

<pre><code> 
    class Person:
        def __init__(self, name, age):
            self.name = name
            self.age = age

        def myfunc(self):
            print("Hello my name is " + self.name)

        p1 = Person("John", 36)
        p1.myfunc()lass Food:
        def __init__(self, name, age):
            self.name = name
            self.age = age

        def eat(self):
            print("Hello my name is " + self.name)

        p1 = Food("John", 36)
        p1.eat()
</code></pre>

</div>

</div>

### footer added

---
### This is code conitnued
```python [2-5|6-8|9-11|28]
class Person:
	def __init__(self, name, age):
		self.name = name
		self.age = age

	def myfunc1(self):
		print("Hello my name is " + self.name )

	def myfunc2(self):
		print("Hello my name is " + self.name )

	def myfunc3(self):
		print("Hello my name is " + self.name )

	def myfunc4(self):
		print("Hello my name is " + self.name )

	def myfunc5(self):
		print("Hello my name is " + self.name )

	def myfunc6(self):
		print("Hello my name is " + self.name )
		
	def myfunc6(self):
		print("Hello my name is " + self.name )

	p1 = Person("John", 36)
	p1.myfunc()
```