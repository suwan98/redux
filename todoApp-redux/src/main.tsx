import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import {Provider} from "react-redux";
import todoStore from "./redux/store/todoStore";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={todoStore}>
      <App />
    </Provider>
  </React.StrictMode>
);
