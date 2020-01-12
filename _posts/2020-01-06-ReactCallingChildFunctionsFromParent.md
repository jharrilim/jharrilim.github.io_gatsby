---
title: "React: Calling Child Functions From Parent"
published: true
---

Passing data to parent's can be done through callbacks. Functions are data too. Let's pass them!

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
        <p>{total}<p>;
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

