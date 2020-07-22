---
title: 'React Development Patterns 2020'
published: true
slug: /blog/react-development-patterns-2020
date: '2020-01-18'
---

Trying to keep up with the freshest React features? Want to know how to make your code less error prone, increase
performance, and increase descriptiveness?

Here are some common patterns for you to try.

- [Coding Style](#coding-style)
  - [Abandon var and let](#abandon-var-and-let)
  - [Abandon .forEach for Describing Data](#abandon-foreach-for-describing-data)
  - [Use Function Components](#use-function-components)
    - [Destructure Your Props](#destructure-your-props)
    - [Type Your Props](#type-your-props)
  - [Destructuring Objects](#destructuring-objects)
  - [Don't Write Redundant Event Handlers Unless Using `useCallback`](#dont-write-redundant-event-handlers-unless-using-usecallback)
  - [Util/Helper Modules Are Banned](#utilhelper-modules-are-banned)
- [Redux](#redux)
  - [Gotchas](#gotchas)
    - [Mapping the Entire Reducer to Props](#mapping-the-entire-reducer-to-props)
  - [Redux Toolkit](#redux-toolkit)
- [Redux Style Guide](#redux-style-guide)
- [React Context](#react-context)
  - [Map Context to Props](#map-context-to-props)
- [Component Design](#component-design)
  - [Styling](#styling)
    - [Button.css](#buttoncss)
    - [Button.jsx](#buttonjsx)
- [Project Structure Using Atomic Design (kinda)](#project-structure-using-atomic-design-kinda)

---

## Coding Style

### Abandon var and let

`var` and `let` both allow mutations. They allow "access" leaks in your code. Here is a trivial example:

```js
const foo = () => {
  let a;
  // Let's assume this if-else block is the only place
  // in this function where we want a to change
  if (something) {
    a = 'ok';
  } else {
    a = 'not ok';
  }
  // Variable 'a' is still mutable after this block.
  // We were unable to effectively express that we no
  // longer want a to change!
};
```

To properly describe that our variable should no longer be modified, we should convert this to either:

```js
const isOk = something => {
  if (something) return 'ok';
  return 'not ok';
};

const foo = () => {
  const a = isOk(something);
};
```

or:

```js
const foo = () => {
  const a = something ? 'ok' : 'not ok';
};
```

### Abandon .forEach for Describing Data

`Array.prototype.forEach` allows users to write side-effects. However, many times it is used to describe a new
sequence of data, for example:

```js
const fruits = ['apples', 'bananas', 'pears'];
const fruitObjs = [];
fruits.forEach((fruit, i) => {
  return {
    id: i
    name: fruit,
  };
});
```

Whereas we should use map:

```js
const fruits = ['apples', 'bananas', 'pears'];
const fruitObjs = fruits.map((fruit, i) => ({
  id: i,
  name: fruit,
}));
```

> Note: This should be good enough, but to prevent more mutator methods such as `Array.prototype.push`, you can use
> `Object.freeze`:

```js
const fruits = ['apples', 'bananas', 'pears'];
const fruitObjs = Object.freeze(
  fruits.map((fruit, i) => ({
    id: i,
    name: fruit,
  }))
);
```

### Use Function Components

[Function components are the future of React thanks to hooks](https://reactjs.org/docs/hooks-intro.html). There is no longer any reason to be using Class components, apart from code that has already been written using class components.

There are many examples for comparing between class components and function components. Here are some ways to help you write good ones.

#### Destructure Your Props

This should be considered very important for those writing React in `javascript`, but not as important if you are using `typescript`.

Destructuring your function props allows you to declare your functions dependencies clearly in the function signature. Compare these:

```jsx
const MyComponent = props => {
  return (
    <>
      <h1>{props.title || 'Default Title'}</h1>
      {props.children}
    </>
  );
};
```

vs:

```jsx
const MyComponent = ({ title = 'Default Title', children }) => {
  return (
    <>
      <h1>{title}</h1>
      {children}
    </>
  );
};
```

The first example requires you to scroll through your component to
find out which props exist. The second example does not, and also gives
you the benefit of being able to add default values as well.

Also, please continue to use `PropTypes`. These work for your function
components still.

#### Type Your Props

**Hey you, Javascript reader! You don't need to skip this section.**

Want that sweet, delectable, VS Code intellisense? Here is how you can get
it using

**Javascript:**

```jsx
/**
 * @type {React.FC<{ text: string; }>}
 */
const Title = ({ text }) => <h1>{text}</h1>;
```

> Note: if your props are too long, you can separate them like this:

```jsx
/**
 * @typedef BigProps
 * @type {{
    text?: string; 
    saveStuff: (...args: any[]) => any; };
    billInfo: BillInfo;
  }}
 */

/**
 * @type {React.FC<BigProps>}
 */
const BigComponent = ({ text = "Bill's bills", saveStuff, billInfo }) => {
  // do big important stuff
  return <></>;
};
```

> **Niiiice** (although I didn't define _BillInfo_ so it doesn't show up)

![](/assets/ReactCodingPatterns/TypeExample.png)

**Typescript:**

```tsx
import React, { FC } from 'react';

interface BigComponentProps {
  text: string | undefined;
  saveStuff: (...args: any[]) => any;
  billInfo: BillInfo;
}

const BigComponent: FC<BigComponentProps> = ({
  text = "Bill's bills",
  saveStuff,
  billInfo,
}) => {
  // do big important stuff
  return <></>;
};
```

### Destructuring Objects

You might be wondering, why should we destructure so much? Does it even help
readability?

Destructuring objects is about more than just readability.
Apart from the fact that it forces us to declare which fields are being used, when we destructure while using `const`, it has a different meaning.
Take a look.

If we declare foo like this:

```js
const foo = getAnObjectThatHasAPropertyCalledName();
```

We can still mutate the properties of `foo` because **only the pointer to foo is** `const`.

```js
const foo = getAnObjectThatHasAPropertyCalledName();
foo.name = 'Sith Lord'; // Oh no, scary!
```

This is not possible if we declare it such as:

```js
const { name } = getAnObjectThatHasAPropertyCalledName();
name = 'Sith Lord'; // Throws an error!
```

### Don't Write Redundant Event Handlers Unless Using `useCallback`

Event handlers inside function components are bizarre. The code
is abstracted, but you cannot test it as you would if you refactored
an event handler in a class component to a field of the component.

In simple terms, the following two components are not the same:

```jsx
class Foo extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };
  }

  // This can be accessed externally for testing
  updateSomething = ev => {
    this.setState(state => ({
      ...state,
      text: ev.target.value + 'wow',
    }));
  };

  render() {
    return <button onClick={this.updateSomething}>Hello</button>;
  }
}
```

and:

```jsx
const Foo = () => {
  const [text, setText] = useState('');

  // This cannot be accessed externally for testing
  const updateSomething = ev => {
    setText(ev.target.value + 'wow');
  };
  return <button onClick={updateSomething}>Hello</button>;
};
```

Instead, one should extract that function to make it testable. The
function that you extract should not take an event as a parameter if
it only needs one field.

Example:

```jsx
import React from 'react';

// This is testable
export const wowify = (aString = '') => aString + 'wow';

const Foo = () => {
  const [text, setText] = useState('');

  return (
    <button onClick={({ target: { value } }) => setText(wowify(value))}>
      Hello
    </button>
  );
};

export default Foo;
```

### Util/Helper Modules Are Banned

Naming a file as `util.js`, `utilities.js`, `helper.js` or anything similar or related to what was listed is a good way to make developers pull their hair out. I know it might be hard to find where to put your functions when
you want your directory structure to look something like:

```yaml
src:
  components:
    - button.jsx
  layouts:
    home:
      - user-home.layout.jsx
      - admin-home.layout.jsx
  pages:
    home:
      - home.jsx
  actions:
  store:
  reducers:
    # ah heck, let's just toss it in ./src
    - util.js
```

Honestly, this is a good spot to place such functions, but please,
give that file a better name. Show filenames some love. For example,
if you have code related to handling logic related to a user entity,
just name it `users.js`. If it gets too big, **publish it as a separate
node module**.

---

## Redux

The state management library with the fancy chrome debugger tool.

### Gotchas

#### Mapping the Entire Reducer to Props

Doing so will add all of the reducer's fields to your components props.
This in turn will force the component to re-render whenever **any** of those props get updated, even if you do not use the property. This may cause confusing bugs such as components losing focus when they shouldn't, and will definitely cause performance issues.

What it looks like:

```jsx
const mapStateToProps = state => {
  return { ...state.myReducer };
};

export default connect(mapStateToProps, null)(MyComponent);
```

Fix it by selecting just the props that your component needs:

```jsx
const mapStateToProps = ({ myReducer }) => ({
  aPropINeed: myReducer.aPropINeed,
  anotherPropINeed: myReducer.anotherPropINeed,
});

export default connect(mapStateToProps, null)(MyComponent);
```

### Redux Toolkit

If you haven't heard of [redux-toolkit](https://redux-toolkit.js.org/), I highly suggest you take a look at it. This
is an officially supported library to help you reduce redux boilerplate code. `createSlice` is a very useful function.

Check out their example from [https://redux-toolkit.js.org/usage/usage-guide#simplifying-slices-with-createslice](https://redux-toolkit.js.org/usage/usage-guide#simplifying-slices-with-createslice):

```js
const postsSlice = createSlice({
  name: 'posts',
  initialState: [],
  reducers: {
    createPost(state, action) {},
    updatePost(state, action) {},
    deletePost(state, action) {},
  },
});
console.log(postsSlice);
/*
{
    name: 'posts',
    actions : {
        createPost,
        updatePost,
        deletePost,
    },
    reducer
}
*/
const { createPost } = postsSlice.actions;
console.log(createPost({ id: 123, title: 'Hello World' }));
// {type : "posts/createPost", payload : {id : 123, title : "Hello World"}}
```

---

## Redux Style Guide

[This entire guide is useful](https://redux.js.org/style-guide/style-guide). This is a must read for using Redux.
Following these patterns are essential for writing code that is easily maintainable.

---

## React Context

React Context allows you to manage globally shared state in a simple way. It is even used internally in react-redux. It currently does have some caveats though, as using it requires you to recreate some features that Redux already creates for you.

Here are some guidelines for you to make sure you are using Context correctly:

### Map Context to Props

Sound familiar? We need to do this when using Context so we don't create additional un-necessary rerenders that might give us unexpected behaviour.

Here is an example of how a component gets un-necessarily rerendered when using Context:

```jsx
import React, { createContext, useState, useContext } from 'react';
import './styles.css';

const defaultPosition = { x: 0, y: 0 };
const defaultValue = [defaultPosition, () => {}];
const CounterContext = createContext(defaultValue);

export const PositionProvider = ({ children }) => {
  const positionContext = useState({ x: 0, y: 0 });
  return (
    <CounterContext.Provider value={positionContext}>
      {children}
    </CounterContext.Provider>
  );
};

const usePosition = () => useContext(CounterContext);

const XComponent = () => {
  const [{ x }, setPosition] = usePosition();
  console.log('Rendering X', x);
  return (
    <div>
      <h2>X: {x}</h2>
      <button
        onClick={() => {
          setPosition(prev => ({
            ...prev,
            x: prev.x + 1,
          }));
        }}
      >
        Inc X
      </button>
    </div>
  );
};

const YComponent = () => {
  const [{ y }, setPosition] = usePosition();
  console.log('Rendering Y', y);
  return (
    <div>
      <h2>Y: {y}</h2>
      <button
        onClick={() => {
          setPosition(prev => ({
            ...prev,
            y: prev.y + 1,
          }));
        }}
      >
        Inc Y
      </button>
    </div>
  );
};

const App = () => {
  return (
    <div className="App">
      <XComponent />
      <YComponent />
    </div>
  );
};

export default function Wrapp() {
  return (
    <PositionProvider>
      <App />
    </PositionProvider>
  );
}
```

The above example re-renders the X component when you update y from within the YComponent. This is not something we want. To fix this, React has given us `memo`.

Here is an example for how to prevent redundant rerenders:

```jsx
import React, {
  createContext,
  useState,
  useContext,
  useMemo,
  memo,
} from 'react';
import './styles.css';

const defaultPosition = { x: 0, y: 0 };
const defaultValue = [defaultPosition, () => {}];
const CounterContext = createContext(defaultValue);

export const PositionProvider = ({ children }) => {
  const positionContext = useState({ x: 0, y: 0 });
  return (
    <CounterContext.Provider value={positionContext}>
      {children}
    </CounterContext.Provider>
  );
};

const usePosition = () => useContext(CounterContext);

const XComponent = memo(
  ({ x, setPosition }) => {
    console.log('Rendering X', x);
    return (
      <div>
        <h2>X: {x}</h2>
        <button
          onClick={() => {
            setPosition(prev => ({
              ...prev,
              x: prev.x + 1,
            }));
          }}
        >
          Inc X
        </button>
      </div>
    );
  },
  (prev, next) => prev.x === next.x
);

const XContainer = () => {
  const [{ x }, setPosition] = usePosition();
  return <XComponent x={x} setPosition={setPosition} />;
};

const YComponent = memo(
  ({ y, setPosition }) => {
    console.log('Rendering Y', y);
    return (
      <div>
        <h2>Y: {y}</h2>
        <button
          onClick={() => {
            setPosition(prev => ({
              ...prev,
              y: prev.y + 1,
            }));
          }}
        >
          Inc Y
        </button>
      </div>
    );
  },
  (prev, next) => prev.y === next.y
);

const YContainer = () => {
  const [{ y }, setPosition] = usePosition();
  return <YComponent y={y} setPosition={setPosition} />;
};

const App = () => {
  return (
    <div className="App">
      <XContainer />
      <YContainer />
    </div>
  );
};

export default function Wrapp() {
  return (
    <PositionProvider>
      <App />
    </PositionProvider>
  );
}
```

Notice that the above is very similar to Redux. We move the state to props, we create a container component, and we check if the props that we use are still the same to determine whether we should update them.

---

## Component Design

Components that you create should follow common patterns. Adding properties with names that leak too much detail can make your component harder to use. The [Material UI](https://material-ui.com/) set of React components follow a strict API design which allow it to be generic enough for reuse, and easy to learn since they all follow similar patterns. Here are some examples for how you can create extensible components.

### Styling

Good component design will provide generic styling and the ability to override the styles through props if needed. We can provide a `className` property for properties that will be applied to the outermost element, and a `classes` property will be used for customizing internal elements. We can also use `style` to pass in a `CSSElements` object. `className` and `style` are both attributes that React provides. Here is an example of how you can create a styled component with extensible styling:

> Note: In practice, avoiding mixing `className` and `style`. This is for demonstration purposes only.

#### Button.css

```css
.custom-button {
  cursor: pointer;
}

.custom-button-check {
  color: green;
}
```

#### Button.jsx

```jsx
import React from 'react';
import './Button.css';

const Button = ({
  children,
  className = 'custom-button',
  classes = {
    check: 'custom-button-check',
  },
  onClick,
  style = {},
  checked = false,
}) => (
  <button
    className={className}
    onClick={onClick}
    style={{
      backgroundColor: 'hsl(30, 30%, 60%)',
      ...style,
      // Putting this after our own styling will let consumers
      // override it
    }}
  >
    <span className={classes.check}>{checked ? '✔' : '❌'}</span>
    {children}
  </button>
);
```

---

## Project Structure Using Atomic Design (kinda)

[Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/) is
at the heart of how we build our front end projects, whether you've realized
it or not. We effectively should be breaking everything down into:

- atoms (lowest level component, eg. Material's button)
- molecules (comprised of atoms, eg. Material's Input field with input adornments)
- organisms (comprised of molecules, eg. a form, or a section)
- templates (describes how to organize your organisms, eg. where you handle responsiveness and layouts)
- pages (adds the organisms into the template)

Now, how do we do we write this in code?

> TODO
