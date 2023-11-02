import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Alpha from "./pages/Alpha";
import Beta from "./pages/Beta";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Alpha />} />
        <Route path={"/Beta"} element={<Beta />}></Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
