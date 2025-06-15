import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { setCredentials } from "./features/auth/authSlice";

const userFromStorage = JSON.parse(localStorage.getItem("user"));

if (userFromStorage) {
  store.dispatch(setCredentials(userFromStorage));
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
