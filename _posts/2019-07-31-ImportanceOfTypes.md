---
title: The Importance of Type Systems
published: true
---

[WIP]

Type systems in languages are of constant debate in the programming community. Most of which revolves around these categories:

- Static types
- Dynamic types
- Implicit typing
- Strongly typed
- Weakly Typed

And although not necessarily about the type systems themselves, compiled vs interpreted also generally comes up in this debate.

So what is all the fuss about? What do all of these terms even mean?

Let's go over the pros and cons of each.

### Static Types

Static types are types that are constant at runtime. To use these types you generally must declare them, or use ones that are already
declared in the language or its core libraries. In many modern languages, these types can be inferred to remove verbosity.

```rust
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

At first glance, these static types may look visually confusing. They are however extremely powerful. In Rust's case, they have the ability
to describe to the compiler the exact size of the type, so that it may allocate the correct space in memory for that type. Explicit type declarations
also allow for language tooling developers to provide us with a lot of support. Finding out all of the properties and methods of a class, refactoring field names,
type hinting, autocompletion; these are all possible to do efficiently and with guaranteed correctness due to static type systems.

So it seems there are a great deal of benefits to be had with static types. It seems like a great way to help the compiler so that it helps us.
What would happen if we started omitting types though?

### Dynamic Types

Let us look at a case with Javascript:

```javascript
// Declaring a cube in Javascript. Notice there is no class or struct declaration here.
const cube = { height: 10, width: 10 };
```

Javascript allows us to go ahead and declare this object without and precondition of defining a type. This allows us to be very succinct with our coding style.
Since we removed so much information though, how much harder is it for our compilers and linters? Quite a bit harder, actually. In the example above, you might
think "well you've used `const`, so we can make an assumption that it will never change right?" Well, we can assume the cube's pointer doesn't get changed, we
cannot make any assumption about the internals of the cube though. This is still valid:

```javascript
const cube = { height: 10, width: 10 };
cube.height = null;
cube.width = { height: this, width: function() { return this.height; } };
```

Since we can reassign height and width, we can say this cube has "mutable' properties, and with mutable properties come dynamic memory allocations. In a C program,
you can declare an array with a size of 10 * the size of int, and it is guaranteed to not change throughout the entirety of the program.
That means that the C compiler can go ahead and allocate this at compile time.

```C
int foo[10];
```

In Javascript, that assumption cannot be made, so memory allocations must happen during runtime. Suppose you were writing a linter. How would you tell what type
the property "height" is? Sure, it should be a `number`, but it very well doesn't have to be, as seen in the above Javascript example. Due to the fact that it is not
concrete, a linter cannot and should not make any assumption about its type, therefore removing any concrete type hinting you would have for it as well. Type hinting
itself is a very important development feature, and there are "smart" linters which will try to guess which properties are available on an object, even for a language
like Javascript where the assumption cannot be made. These "smart" linters are always slower and many times will not be able to work simply due to Javascript's nature.

#### Alright, so what's the benefit of a language with dynamic types?

Alright, here's the hard pill to swallow. __Dynamic types are not worth using anymore__. Dynamic typing in Javascript might feel much better to use than some
older type systems such as Java's, and I would have to agree. Dynamic types are good when the static type systems are hard to use for describing complex types.

There are patterns in Java that will help you avoid this problem. One case is variant method signatures, which can be handled in Java via method overloading:

```java
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

Whereas once again, the Javascript version is much more succinct. This feels like it is better while I am writing it as I have to write less, but is it really better?

I would say it is not. The Javascript version is more difficult to use as an end user. In the Javascript version, one does not know what should be passed as an argument.
The type signature has essentially been hidden to the user, and although we didn't declare it in the method signature our code still relies on a function that can take a
string. We can always try to make our variable names as clear and descriptive as possible, but honestly, we may as well just describe it with a strict type. The Java
version requires null checking regardless, but this is a fault of the Java type system. Many modern languages allow you to describe a type as nullable such as in

Typescript:

```typescript
let possiblyACube: Cube | null = null; // either a Cube or a null value

let alsoPossiblyACube?: Cube; // Either a Cube or undefined
```

Rust:

```rust
let cube_or_null: Option<Cube> = None; // Cube or none
```

In both of these languages, you must explicitly handle what happens for each of the types (either Cube or null).
