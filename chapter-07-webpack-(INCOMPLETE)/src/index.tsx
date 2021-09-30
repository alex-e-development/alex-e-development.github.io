import join from "lodash/join";
import fff from "./sample.jpg";

import ReactDOM from "react-dom";

function component() {
  const element = document.createElement("div");

  // Lodash, currently included via a script, is required for this line to work
  element.innerHTML = join(["Hello", "webpack"], " ");

  const x: number = 5;

  const a = document.createElement("img");
  a.src = fff;

  document.body.appendChild(a);

  return element;
}

document.body.appendChild(component());

const F = () => (
  <>
    <h1>HELLO LOOK AT THIS</h1>
    <img src={fff} />
  </>
);

ReactDOM.render(<F />, document.getElementById('appppp'));

