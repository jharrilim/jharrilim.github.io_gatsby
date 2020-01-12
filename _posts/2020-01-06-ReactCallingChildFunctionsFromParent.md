---
title: "React: Calling Child Functions From Parent"
published: true
---

Here is an example of how you can pass functions to parent components through callbacks. Sometimes you want the parent
component to define when to invoke a funciton on a child component. An example would be to have a Modal component as the
root layout, and have it comprised of a ModalHeader, ModalContent, and ModalFooter. If you wish to define multiple modal
forms inside ModalContent and have them trigger on buttons within the ModalFooter, you may use this strategy.

```jsx
import React, { useState, useRef, useEffect } from 'react';

const useCustomHook = () => {
    const [total, setTotal] = useState(0);
    const decrement = () => setTotal(total => total > 0 ? total - 1 : 0);
    const increment = () => setTotal(total => total + 1);
    return { decrement, increment, total };
};

const FirstModalContent = ({ onMount = () => {} }) => {
    const { total, increment, decrement } = useCustomHook();

    useEffect(() => {
        // Parent requests for the functions via onMount prop.
        onMount([ increment, decrement ]);
    }, [increment, decrement]);

    return (
        <p>{total}</p>;
    );
};

const Modal = () => {
    // We must use useRef instead of useState because useState will
    // rerender the child component and create an infinite loop
    const buttonFuncs = useRef({
        next: () => { },
        prev: () => { },
    });

    return (
        <>
            <div>
                <h1>Header</h1>
            </div>
            <div>
            <FirstModalContent onMount={([f1, f2]) => {
                // This will let us call the child funcs from the 
                // parent component
                buttonFuncs.current = {
                    next: f1,
                    prev: f2,
                };
            }} />
            </div>
            <div>
                <button onClick={buttonFuncs.current.next}>Next</button>
                <button onClick={buttonFuncs.current.prev}>Previous</button>
            </div>
        </>
    );
};

```

