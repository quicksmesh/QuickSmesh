import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import store from "./redux/store";
import { Provider } from "react-redux";
import WebSocketConnect from "./WebSocket";

const root = ReactDOM.createRoot(document.getElementById("root"));

WebSocketConnect();

// TODO: remove strict mode
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
