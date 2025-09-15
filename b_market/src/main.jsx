// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage";
import DashboardPage from "./pages/DashboardPage.jsx";
import ProductList from "./pages/ProductListPage.jsx";
import ProcurementPage from "./pages/ProcurementPage.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ProcurementPage />
    </BrowserRouter>
  </StrictMode>
);
