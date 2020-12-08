---
title: 'React: Calling Child Functions From Parent'
published: true
slug: /blog/react-calling-child-functions-from-parent
date: '2020-01-06'
---

### Ignore this post, I can't remember why I did this and now that I think of it more, I don't see any good reason to do this. Confusing codebase got to my head.

------

Here is an example of how you can pass functions to parent components through callbacks. Sometimes you want the parent
component to define when to invoke a function on a child component. An example would be to have a Modal component as the
root layout, and have it comprised of a ModalHeader, ModalContent, and ModalFooter. If you wish to create a step by step
flow inside the modal where each step is a component that requires its own custom validation, this may be appropriate
since you will be able to write the validation within the appropriate step components instead of the parent.

```jsx
import React, { useState, useRef, useEffect } from 'react';

const useCustomHook = () => {
  const [total, setTotal] = useState(0);
  const decrement = () => setTotal(total => total > 0 ? total - 1 : 0);
  const increment = () => setTotal(total => total + 1);
  return { decrement, increment, total };
};

const ModalContent = ({ title = '', onMount = () => {} }) => {
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
  const [step, setStep] = useState(0);
  const buttonFuncs = useRef({
    next: () => { },
    prev: () => { },
  });

  return (
    <Dialog>
      <DialogTitle>
        <h1>Header</h1>
      </DialogTitle>
      <DialogContent>
      { step === 0 ?
        <ModalContent
          onMount={([next, prev]) => {
            // This will let us call the child funcs from the
            // parent component
            buttonFuncs.current = { next, prev };
          }} 
        />
        step === 1 ?
        <div></div>
        : <> </>
      }
      </DialogContent>
      <DialogActions>
        <button onClick={buttonFuncs.current.next}>Next</button>
        <button onClick={buttonFuncs.current.prev}>Previous</button>
      </DialogActions>
    </Dialog>
  );
};

```
