// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import CSRPage from "./pages/CSRPage";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <CSRPage />
    </BrowserRouter>
  </StrictMode>
);
