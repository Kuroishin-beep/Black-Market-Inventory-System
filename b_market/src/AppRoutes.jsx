// FileName: /AppRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ProcurementPage from "./pages/ProcurementPage";
import OrdersPage from "./pages/OrdersPage";
import WarehousePage from "./pages/WarehousePage";
import AccountingPage from "./pages/AccountingPage";
import CSRPage from "./pages/CSRPage";
import ProductListPage from "./pages/ProductListPage";
import TeamLeaderPage from "./pages/TeamLeaderPage";
import DashboardPage from "./pages/DashboardPage"; 
import ProtectedRoute from "./components/ProtectedRoute";

const AppRoutes = ({ user }) => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute user={user}>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/procurement"
        element={
          <ProtectedRoute user={user} allowedRoles={["procurement"]}>
            <ProcurementPage userRole={user?.role} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders"
        element={
          <ProtectedRoute user={user} allowedRoles={["teamlead", "csr"]}>
            <OrdersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/warehouse"
        element={
          <ProtectedRoute user={user} allowedRoles={["warehouse"]}>
            <WarehousePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/accounting"
        element={
          <ProtectedRoute user={user} allowedRoles={["accounting"]}>
            <AccountingPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/csr"
        element={
          <ProtectedRoute user={user} allowedRoles={["csr"]}>
            <CSRPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/products"
        element={
          <ProtectedRoute user={user} allowedRoles={["procurement"]}>
            <ProductListPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teamlead"
        element={
          <ProtectedRoute user={user} allowedRoles={["teamlead"]}>
            <TeamLeaderPage />
          </ProtectedRoute>
        }
      />

      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
};

export default AppRoutes;
