// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

// Pages
import LandingPage from "./Frontend/Pages/LandingPage";
import LoginPage from "./Frontend/Pages/LoginPage";
import SignUpPage from "./Frontend/Pages/SignUpPage";
import DashboardPage from "./Frontend/Pages/DashboardPage";
import ProductListPage from "./Frontend/Pages/ProductListPage";
import OrdersPage from "./Frontend/Pages/OrdersPage";
import CSRPage from "./Frontend/Pages/CSRPage";
import TeamLeaderPage from "./Frontend/Pages/TeamLeaderPage";
import ProcurementPage from "./Frontend/Pages/ProcurementPage";
import WarehousePage from "./Frontend/Pages/WarehousePage";
import AccountingPage from "./Frontend/Pages/AccountingPage";

// Example fake auth state (replace with real auth later)
const fakeUser = {
  role: null, // "csr", "teamlead", "procurement", "warehouse", "accounting"
};

function ProtectedRoute({ children, allowedRoles }) {
  if (!fakeUser.role) {
    return <Navigate to="/login" replace />;
  }
  if (!allowedRoles.includes(fakeUser.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function App() {
  const [user, setUser] = useState(fakeUser);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage setUser={setUser} />} />
      <Route path="/signup" element={<SignUpPage setUser={setUser} />} />

      {/* Shared routes for all roles */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute
            allowedRoles={[
              "csr",
              "teamlead",
              "procurement",
              "warehouse",
              "accounting",
            ]}
          >
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products"
        element={
          <ProtectedRoute
            allowedRoles={[
              "csr",
              "teamlead",
              "procurement",
              "warehouse",
              "accounting",
            ]}
          >
            <ProductListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute
            allowedRoles={[
              "csr",
              "teamlead",
              "procurement",
              "warehouse",
              "accounting",
            ]}
          >
            <OrdersPage />
          </ProtectedRoute>
        }
      />

      {/* Role-specific routes */}
      <Route
        path="/csr"
        element={
          <ProtectedRoute allowedRoles={["csr"]}>
            <CSRPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/approvals"
        element={
          <ProtectedRoute allowedRoles={["teamlead"]}>
            <TeamLeaderPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/procurement"
        element={
          <ProtectedRoute allowedRoles={["procurement"]}>
            <ProcurementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/warehouse"
        element={
          <ProtectedRoute allowedRoles={["warehouse"]}>
            <WarehousePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/accounting"
        element={
          <ProtectedRoute allowedRoles={["accounting"]}>
            <AccountingPage />
          </ProtectedRoute>
        }
      />

      {/* Logout route */}
      <Route
        path="/logout"
        element={
          <div>
            <h1>Logging out...</h1>
            <Navigate to="/" replace />
          </div>
        }
      />

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
