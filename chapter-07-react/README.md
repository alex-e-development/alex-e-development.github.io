Ensure that you have node.js installed

```bash
npm init -y
```

```bash
npm install react react-dom
```

In this case `react` serves as the core engine and `react-dom` is what allows it to do its work on our DOM elements in our web application. The reason they are separate is that gives React the flexibility to work on other environments beyond just the web browser, the most common example being [React Native](https://reactnative.dev/) which allows you to use React for mobile applications.

So to begin we will create our first React element. Let's start by loading our library from `node_modules`. Presuming that `index.html` and `node_modules` are in the same directory:

`index.html`

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Modern Development Stack Tutorial</title>
    <script src="node_modules/react/umd/react.development.js"></script>
    <script src="node_modules/react-dom/umd/react-dom.development.js"></script>
    <script src="script.js" defer></script>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

Although this tutorial will focus on the more modern method of creating [components as functions](https://reactjs.org/docs/components-and-props.html), it is important to make sure you are also familiar with the older style of creating [components as classes](https://reactjs.org/docs/react-component.html).

Class components are still fully supported in React and you're still very likely to encounter them in real codebases and projects, so understanding how they work is very important. For most users, particularly those just learning React, there is no difference. For more advance users there are a very small subset of scenarios where class components are still required (e.g. [error boundaries](https://reactjs.org/docs/error-boundaries.html)).

Most new features in React are designed around functional components (e.g. [hooks](https://reactjs.org/docs/hooks-intro.html)) so for new projects and people learning the library, functional components are recommended. In practice the best choice is to follow whatever convention your team has established.

With that said let's write our first component. Create a file called `script.js` in the same direction as your HTML file. You'll notice in our example above we have already connected the `script.js` file, and used `defer` to ensure it isn't run until after the HTML is parsed. The reason for this is because React is going to need to connect to the `div` with the `id="app"` attribute as a mounting point.

Our first component will be a simple button, along the same lines as the official React documentation, it will be "like" button.

`script.js`

```js
const LikeButton = () => {
  return React.createElement(
    "button",
    { className: "like-button" },
    "Click to like!"
  );
};

const domContainer = document.querySelector("#app");

ReactDOM.render(React.createElement(LikeButton), domContainer);
```

React elements are reacted with the `React.createElement` function. It takes three parameters:

1. The type of element. If this is a string it will create a DOM node of that type, a `<button>` in our example. This can also be another component.

2. The [props](https://reactjs.org/docs/components-and-props.html#rendering-a-component) of the component. These are similar to [HTML attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes) and in fact will extend the attributes if you are using them directly on an HTML element like our `button` here. You can also define your own custom props to make your components more reusable. If your component has no props this can be `null`. Some attributes in React are slighly different from their HTML counterparts: for example `className` instead of `class` due to the term `class` being already reseved in JS to refer to a [class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes).

3. The `children` of an element, which is how you create the standard nesting behavior of DOM nodes. The children can be a string, or more React elements. Components can have as many children as they want. In our case the child is simply text.

Based on our understanding of those three parameters, we would expect this to create a DOM structure that looks like:

```html
<div id="app">
  <button class="like-button">Click to like!</button>
</div>
```

The `React.render` function takes out `LikeButton` component and mounts it on any DOM node that we pass to it. Once the initial compoinent is mounted everything from that point on can be created inside of that root node. The `document.querySelector("#app")` call that we make to get the mounting node should the the _only_ manual call to querySelector in our entire React application.

## Making our Button "Reactive"

You may have noticed that despite saying click to like, our button doesn't actually have any click functionality. Let's say that when the button is clicked, we would like it to disappear and be replaced with an `<h1>` tag that says "Liked!".

If were were using plain old Javascript that would require us to use a lof of manual DOM methods, including `querySelector` to select all the nodes we are working with, as well as `createElement` to create our new `<h1>` and `appendChild` to add it as a child to our `#app` node.

Let's see how to accomplish the same thing using React, without the need for any DOM methods. We'll do this in a two step process to help understand the concept of [state](https://reactjs.org/docs/state-and-lifecycle.html) in a component.

Replace the content of `script.js` with the new code below:

`script.js`

```js
const LikeButton = () => {
  let liked = false;

  if (liked) {
    return React.createElement("h1", null, "Liked!");
  }

  return React.createElement(
    "button",
    {
      className: "like-button",
      onClick: () => {
        liked = true;
        console.log("button was clicked");
      },
    },
    "Click to like!"
  );
};

const domContainer = document.querySelector("#app");

ReactDOM.render(React.createElement(LikeButton), domContainer);
```

_(Note that in React, the normal lowercase `onclick` attribute you use in HTML files becomes the more Javascript idiomatic `onClick`. Make sure to be aware of this subtile difference. To help avoid this common syntax error you can use a `linter`, which will be discussed further in upcoming tutorials)._

You can see that the initial state of our `LikeButton` component is that `liked` is `false`. We're not going to render the `h1` because that only occurs when `liked` is `true`. We render a `button` with an `onClick` event handler that will set the value of `liked` to `true`. You can confirm the `onClick` handler is running by viewing the dev console and seeing out "button was clicked" message. Unfortunately despite being logically sound, the state of the button doesn't change.

Although we are changing the value of `liked`, our issue is that there is nothing telling React to update the component and run the function again.  What we have to do is introduce a method to inform React about the changing [state](https://reactjs.org/docs/state-and-lifecycle.html) of our component. We can do that with the [setState](https://reactjs.org/docs/hooks-state.html) hook.

Our updated `LikeButton` now looks like this:

`script.js`

```js
const LikeButton = () => {
  const [liked, setLiked] = React.useState(false); // <-- NEW

  if (liked) {
    return React.createElement("h1", null, "Liked!");
  }

  return React.createElement(
    "button",
    {
      className: "like-button",
      onClick: () => {
        setLiked(true); // <-- NEW
        console.log("button was clicked");
      },
    },
    "Click to like!"
  );
};

const domContainer = document.querySelector("#app");

ReactDOM.render(React.createElement(LikeButton), domContainer);
```

You can see two small changes highlighted with the `// <-- NEW` comment.

The first line in our updated `LikeButton` function component uses Javascript's [array destructuring](https://javascript.info/destructuring-assignment#array-destructuring) syntax. Make sure you have a good familiarity with that syntax so that you don't confuse it with the `useState` function itself.

React's `useState` function returns an array with two values. The first is a variable with the same value that was passed (in our case `liked` which will be `false`). 

The second array value is a `function` that is used to change the value of `liked` in a way that React will respond to and [re-render](https://reactjs.org/docs/rendering-elements.html) the component (update the DOM with the new state).

Stateful variables keep their value even when the component re-renders.  They will not be reset to defaults. This is what causes the component to now use the `if (liked)` branch and render the `h1` element instead of the `button`. Try it yourself!

## Moving on

We've now managed to create our first React component that manages its own state without the use of DOM methods. It might be a bit difficult to see the real advantage of this at such a small scale. Let's try and imagine how this might come in handy at a larger scale.

Imagine you have a Facebook-like interface with 5 posts, each with their own like button. If using traditional DOM methods, you would need to use make sure you could target the specific button that was clicked and update it. This might get fairly complicated depending on what kind of selector you are using. But with our button that handles its own state, it's as easy as:

`script.js`

```js
// ...
const domContainer = document.querySelector("#app");

const manyButtons = React.createElement(
  "div",
  null,
  React.createElement(LikeButton),
  React.createElement(LikeButton),
  React.createElement(LikeButton),
  React.createElement(LikeButton),
  React.createElement(LikeButton)
);

ReactDOM.render(manyButtons, domContainer);
```

Now you have five unique buttons that each update their own state when clicked.  This same basic paradigm can be extended as far as you can imagine to creater larger and more complex components, each with or without their own state, and with children that also manage their own state.  Combined together you can create a fully reactive application.

## JSX

At this stage is when you start to see how the `React.createElement` syntax can begin to feel pretty cumbersome.  That's where the special JSX syntax comes into play.  In the next tutorial we'll learn what JSX is and how to configure your environment to write your React components in JSX.  

## Bonus: Class Component

If you're curious, here's how our `LikeButton` component would look using `class` syntax.  A little bit more verbose, but accomplishes the same basic behavior:

`script.js`
```js
class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      return React.createElement("h1", null, "Liked!");
    }

    return React.createElement(
      "button",
      {
        className: "like-button",
        onClick: () => this.setState({ liked: true }),
      },
      "Click to like!"
    );
  }
}

const domContainer = document.querySelector("#app");

ReactDOM.render(React.createElement(LikeButton), domContainer);

```


