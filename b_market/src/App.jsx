// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import DashboardPage from "./pages/DashboardPage";
import ProductListPage from "./pages/ProductListPage";
import OrdersPage from "./pages/OrdersPage";
import CSRPage from "./pages/CSRPage";
import TeamLeaderPage from "./pages/TeamLeaderPage";
import ProcurementPage from "./pages/ProcurementPage";
import WarehousePage from "./pages/WarehousePage";
import AccountingPage from "./pages/AccountingPage";

// ProtectedRoute component
function ProtectedRoute({ children, allowedRoles, user }) {
  // If no user is logged in, go to login page
  if (!user || !user.role) {
    return <Navigate to="/login" replace />;
  }

  // If user role is not allowed, send to dashboard
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  // Auth state (replace later with real auth logic)
  const [user, setUser] = useState(null);

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
            user={user}
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
            user={user}
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
            user={user}
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
          <ProtectedRoute user={user} allowedRoles={["csr"]}>
            <CSRPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/approvals"
        element={
          <ProtectedRoute user={user} allowedRoles={["teamlead"]}>
            <TeamLeaderPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/procurement"
        element={
          <ProtectedRoute user={user} allowedRoles={["procurement"]}>
            <ProcurementPage />
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

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
