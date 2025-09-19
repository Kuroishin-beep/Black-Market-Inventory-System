import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import DashboardPage from "./pages/DashboardPage";
import ProductsListPage from "./pages/ProductListPage";
import OrdersPage from "./pages/OrdersPage";
import CSRPage from "./pages/CSRPage";
import TeamLeaderPage from "./pages/TeamLeaderPage";
import ProcurementPage from "./pages/ProcurementPage";
import WarehousePage from "./pages/WarehousePage";
import AccountingPage from "./pages/AccountingPage";

// ProtectedRoute component
function ProtectedRoute({ children, allowedRoles = [], user }) {
  if (!user || !user.role) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Role not authorized
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  const [user, setUser] = useState(null);

  // Fetch user profile and role after login
  async function fetchUserProfile(userId) {
    const { data, error } = await supabase
      .from("employees")
      .select(`
        id,
        email,
        full_name,
        role_id,
        roles (
          id,
          role,
          label
        )
      `)
      .eq("id", userId)
      .maybeSingle(); 
  
    if (error) {
      console.error("Error fetching user profile:", error.message);
      return;
    }
  
    if (!data) {
      console.warn("No employee record found for this userId:", userId);
      return; 
    }
  
    console.log("Fetched user profile:", data);
  
    setUser({
      id: data.id,
      email: data.email,
      fullName: data.full_name,
      role: data.roles?.role?.toLowerCase(),
      roleLabel: data.roles?.label,
    });
  }
  
  
  useEffect(() => {
    // Check session on mount
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        fetchUserProfile(data.session.user.id);
      }
    });

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          fetchUserProfile(session.user.id);
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignUpPage setUser={setUser} />} />
      <Route path="/login" element={<LoginPage setUser={setUser} />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute user={user}>
            <DashboardPage user={user} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/procurement"
        element={
          <ProtectedRoute user={user} allowedRoles={["procurement", "admin"]}>
            <ProcurementPage userRole={user?.role} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders"
        element={
          <ProtectedRoute user={user}>
            <OrdersPage user={user} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/warehouse"
        element={
          <ProtectedRoute user={user} allowedRoles={["warehouse", "admin"]}>
            <WarehousePage userRole={user?.role} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/accounting"
        element={
          <ProtectedRoute user={user} allowedRoles={["accounting", "admin"]}>
            <AccountingPage user={user} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/csr"
        element={
          <ProtectedRoute user={user} allowedRoles={["csr", "admin"]}>
            <CSRPage userRole={user?.role} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/products"
        element={
          <ProtectedRoute user={user}>
            <ProductsListPage user={user} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teamlead"
        element={
          <ProtectedRoute user={user} allowedRoles={["teamlead", "admin"]}>
            <TeamLeaderPage userRole={user?.role} />
          </ProtectedRoute>
        }
      />

      {/* Redirect unknown routes */}
      <Route
        path="*"
        element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
      />
    </Routes>
  );
}

export default App;
