import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import Counter from "./Counter.tsx";
import {createStore} from "redux";
import counter from "./reducer/index.ts";

const store = createStore(counter);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <App /> */}
    <Counter />
  </React.StrictMode>
);
