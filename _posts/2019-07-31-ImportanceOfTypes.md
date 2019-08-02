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
