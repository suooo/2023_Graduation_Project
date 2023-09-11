import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import Alpha from "./Alpha";
import Beta from "./Beta";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Alpha />
    <Beta />
  </React.StrictMode>
);

reportWebVitals();
