---
title: The Importance of Type Systems
published: true
---

## Table of Contents

- [Static Types](#static-types)
- [Dynamic Types](#dynamic-types)
- [Strongly Typed vs Weakly Typed Languages](#strongly-typed-vs-weakly-typed-languages)
- [Summary](#summary)
- [Glossary](#glossary)

Type systems in languages are of constant debate in the programming community. Most of which revolves around these categories:

- Static types
- Dynamic types
- Implicit typing
- Strongly typed
- Weakly Typed

And although not necessarily about the type systems themselves, compiled vs interpreted also generally comes up in this debate.

So what is all the fuss about? What do all of these terms even mean?

Let's go over the pros and cons of each.

## Static Types

Static types are types that are constant at runtime. To use these types you generally must declare them, or use ones that are already declared in the language or its core libraries. In many modern languages, these types can be inferred to remove verbosity.

```rust
// Rust
struct Cube {    // Declare a data type named Cube, which can be described by the following fields
    height: i32, // Define a 32 bit integer parameter for the cube named height
    width: i32   // Define a 32 bit integer parameter for the cube named width
}

impl Cube { // v----v----|
    fn new() -> Cube {// A function that declares that it will return a Cube
        Cube {              // This is rust's way of returning a value.
            height: 10i32,  // We can see that it should give us back a Cube
            width: 10i32    // with a 10i32 height and width.
        }
    }
}

// The following variable assignments are equivalent:
let cube1: Cube = Cube::new(); // Declaring a variable with explicit typing
let cube2 = Cube::new(); // Declaring a variable with implicit typing (this is still static typing!)
```

At first glance, these static types may look visually confusing. They are however extremely powerful. In Rust's case, they have the ability to describe to the compiler the exact size of the type, so that it may allocate the correct space in memory for that type. Explicit type declarations also allow for language tooling developers to provide us with a lot of support. Finding out all of the properties and methods of a class, refactoring field names, type hinting, autocompletion; these are all possible to do efficiently and with guaranteed correctness due to static type systems.

So it seems there are a great deal of benefits to be had with static types. It seems like a great way to help the compiler so that it helps us.
What would happen if we started omitting types though?

## Dynamic Types

Let us look at a case with Javascript:

```javascript
// Javascript
// Declaring a cube in Javascript. Notice there is no class or struct declaration here.
const cube = { height: 10, width: 10 };
```

Javascript allows us to go ahead and declare this object without any precondition of defining a type. This allows us to be very succinct with our coding style. Since we removed so much information though, how much harder is it for our compilers and linters? Quite a bit harder, actually. In the example above, you might think "well you've used `const`, so we can make an assumption that it will never change right?" Well, we can assume the cube's pointer doesn't get changed, we cannot make any assumption about the internals of the cube though. This is still valid:

```javascript
// Javascript
const cube = { height: 10, width: 10 };
cube.height = null;
cube.width = { height: this, width: function() { return this.height; } };
```

Since we can reassign height and width, we can say this cube has "mutable" properties, and with mutable properties come dynamic memory allocations. In a C program, you can declare an array with a size of 10 multiplied by the size of int, and it is guaranteed to not change throughout the entirety of the program.
That means that the C compiler can go ahead and allocate this at compile time.

```C
// C
int foo[10];
```

In Javascript, that assumption cannot be made, so memory allocations must happen during runtime. Suppose you were writing a linter. How would you tell what type the property "height" is? Sure, it should be a `number`, but it very well doesn't have to be, as seen in the above Javascript example. Due to the fact that it is not concrete, a linter cannot and should not make any assumption about its type, therefore removing any concrete type hinting you would have for it as well. Type hinting itself is a very important development feature, and there are "smart" linters which will try to guess which properties are available on an object, even for a language like Javascript where the assumption cannot be made. These "smart" linters are always slower and many times will not be able to work simply due to Javascript's nature.

In Javascript, you can do bizarre things like:

```javascript
// Javascript
const foo = { bar: true, baz: -1 };
const blahObjectobject = 'blah ' + foo;
```

In all the code I've ever read, I've never come across a time where this effect was used with a purpose. It really feels like its sole purpose is to cause bugs in your code. This might never happen to you, but if it did, I'm sure you would prefer our good friend the compiler to say _"Hey, it looks like this might be a mistake. Did you perhaps meant to do this?"_ and then proceed to tell us what we should do.

> I'm trying really hard to not just shill the Rust compiler constantly, but I can't help it. The Rust compiler really does a wonderful job at this. The `cargo` toolchain has invented a new acronym for me, SAAA (Software as an Art).

### Alright, so what's the benefit of a language with dynamic types?

Alright, here's the hard pill to swallow. __Dynamic types are not worth using anymore__. Dynamic typing in Javascript might feel much better to use than some older type systems such as Java's, and I would have to agree. Dynamic types are good when the static type systems are hard to use for describing complex types.

There are patterns in Java that will help you avoid this problem. One case is variant method signatures, which can be handled in Java via method overloading:

```java
// Java
class Cube {
    private final int height;
    private final int width;
    public Cube(int height, int width) {
        this.height = height;
        this.width = width;
    }

    public final void printCube() {
        system.out.println("height: " + height + " width: " + width);
    }

    public final void printCube(Function<string, string> formatter) {
        if (formatter == null) {
            printCube();
        } else {
            system.out.println(formatter.apply("height: " + height + " width: " + width));
        }
    }
}
```

And if we were to do this in Javascript, it would look like:

```javascript
// Javascript
class Cube {
    constructor(height, width) {
        this.height = height;
        this.width = width;
    }

    printCube(formatter){
        if (typeof formatter !== 'function') {
            console.log('height: ' + this.height + ' width: ' + this.width);
        } else {
            console.log(formatter('height: ' + this.height + ' width: ' + this.width));
        }
    }
}
```

Whereas once again, the Javascript version is much more succinct. This feels like it is better while I am writing it as I have to write less, but is it _really_ better?

I would say it is not. The Javascript version is more difficult to use as an end user. In the Javascript version, one does not know what should be passed as an argument. The type signature has essentially been hidden to the user, and although we didn't declare it in the method signature our code still relies on a function that can take a string. We can always try to make our variable names as clear and descriptive as possible, but honestly, we may as well just describe it with a strict type. The Java version requires null checking regardless, but this is a fault of the Java type system. Many modern languages allow you to describe a type as nullable such as in:

Typescript:

```typescript
// Typescript
let possiblyACube: Cube | null = null; // either a Cube or a null value

let alsoPossiblyACube?: Cube; // Either a Cube or undefined
```

or Rust:

```rust
// Rust
let cube_or_null: Option<Cube> = None; // Cube or none
```

In both of these languages, you must explicitly handle what happens for each of the types (either Cube or null). This, in my _opinion_, should be better for all developers. As a beginner, they behave as training wheels to help you prevent mistakes. As a more seasoned developer, they act as your seat belt. Sure, you might not need to drive without it on, and hey, you might never crash. You will be glad to have that insurance though just in case.

### Hey! You keep using Typescript examples. Typescript types are stripped at compile time and therefore do not count!

I've honestly heard this one a lot surprisingly, and the answer is all compilers (that I know of) strip types. The reality is binary is untyped. At _some_ point in the processing of source code or byte code, it does become 1's and 0's. Types are here for our ergonomics, and the compiler ergonomics.

### Alright, Javascript is seriously not that hard though. I've already gotten a good hang for it, I know my best practices, I use linters, and I seriously don't think these are benefits to me.

And you know what, you might be right. You also may never crash your car, and never need to wear your seatbelt. Yes, this is a drastic parallel considering one involves life and death, but I guess the point is, does _safety_ ever hurt?

Javascript feels slightly better when used strictly for creating end-user applications as opposed to libraries, and it makes sense since the browser runs Javascript anyway, but don't let that deter you from experimenting with alternatives like Typescript, Reason, or Kotlin.

### Ugh fine, I'll play along. Let's just say these statically typed languages are superior. How do I convince employers to stop hiring for Javascript and to hire for Typescript?

I mean, I suppose you can send them a link to this, but this is honestly written for the sake of argument. A lot of developers are now learning Javascript/Python as their first and primary languages, and I encourage them to try out languages with static types. I also encourage developers who were previously saddened by the cumbersome languages like Java which don't allow implicit typing and enforced antipatterns (I'm looking at you, [anemic pojos](https://martinfowler.com/bliki/AnemicDomainModel.html)!) to try out some of the languages with more expressive type systems (C#, Typescript, ML languages, Haskell, Kotlin, Rust). Java has `var` now, but honestly, give one of these a shot.

### Hey man, you've been talking too much about this topic. When are you going to tell me about what strongly and weakly typed means?

Oops! I digress. Here we go.

## Strongly Typed vs Weakly Typed Languages

Ah yes, this part might be a little confusing. Many definitions for Strongly/Weakly typed languages are ambiguous, and it might be better to treat it as a spectrum based off of type safety and memory safety rules. Both static and dynamic type systems can be either strongly typed or weakly typed.

A statically typed language can also be unsafe, should it allow the ability to morph types through unsafe casts. Take C for an example:

```c
// C
int main()
{
    char *some_str = "foo bar";
    int   nonsense = (int)some_str; // Yikes, this doesn't make much sense
}
```

C lets you define types but you can freely cast them as you wish, unto thy own demise. A strongly typed language would not let you do this and stop you at compile time. Some languages like [C# have an implicit casting mechanism](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/operators/user-defined-conversion-operators) you can use and define yourself so that these casts may be more sensible.

There are also languages like Python which are dynamically and weakly typed. This might be confusing as well, since Python definitely has types, and Python 3 even allows you to statically type your variables, arguments, and return types. You also cannot do `2 + '2'` like you could in Javascript (which dynamically tries to convert the types at runtime). In Python, you can however do:

```python
# Python
foo = True
foo = 'bar'
foo = None
foo = Car()
```

This behavior is what defines it as a dynamic language (albeit less dynamic than Javascript). We are able to assign values of different types to the same label. It is acceptable for `foo` to become whatever it may. Once `foo` decides to become a `Car` however and perform an addition with itself and a string, Python will throw an error. Phew, we at least have some runtime safety.

### So what I've learned from this is that you're completely biased, and you've most likely stubbed your toe on Javascript, C, and Python, but mostly Javascript.

![Scooby Doo](https://i.imgur.com/W6tUU1m.gif)

I actually like Javascript, and I like all the work that was put into it. I like that I can still run Javascript on pages from the early 2000's. The beauty of Javascript is in what it has accomplished for our world, unfortunately not in the language itself. Another thing I like about Javascript is its ability to easily describe generic pure functions in a fairly sensible way, ie. Combinator birds:

```js
// Javascript
const I = a => a;
const K = a => b => a;
const KI = a => b => b;
const T = a => b => b(a);
```

These functions are quite easy to reason about, and adding the generic signatures to them as you would in a language like Typescript is much more cumbersome and doesn't really add any value. In F# however I may write the above as:

```fsharp
// F#
let I a = a
let K a b = a
let KI a b = b
let T a b = b a
```

The F# version is actually more concise (and may be more readable to those who know [lambda calculus notation](https://en.wikipedia.org/wiki/Lambda_calculus)), and still compiles with type safety and all of the other features of a statically typed language.

## Summary

Type systems are obviously a good thing. Verbosity is a very small cost for the benefits that they give, and in modern languages, that verbosity can be completely forgotten about. Dynamic languages are a nice way to express things concisely (and may not matter for very small applications with limited types, ie. coding challenges which are generally just collections of numbers or strings), however we should be looking towards using languages with **improved** type systems, as opposed to completely omitting them.

## Glossary

**Static Type System**: A type system which forces types to be checked and known at compile time, therefore making them constant at runtime. Static type systems **do not** require types to be declared if they can be precisely inferred (F#/OCaml/Rust/Haskell, C# sort of with the `var` keyword).

**Dynamic Type System**: A type system which allows variable types to morph at runtime. This can happen by putting properties on an object at runtime (like Javascript's famous testing libraries Mocha and Jest which add functions to the global context), or by reassigning a new type to a variable (such as declaring a variable as a string, and then later reassigning a number to it).

**Strongly Typed Language**: A language that is strongly typed has strict rules about how it handles it's type information. A strongly typed language will enforce more type rules at compile time.

**Weakly Typed Language**: A weakly type language can be a language that includes types, but might not enforce type safety at compile time, or might apply those rules at runtime instead.
