// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import DashboardPage from "./pages/DashboardPage";
// import LandingPage from "./pages/LandingPage";
// import LoginPage from "./pages/LoginPage";
// import SignUpPage from "./pages/SignUpPage";
// import DashboardPage from "./pages/DashboardPage";
// import ProductListPage from "./pages/ProductListPage";
// import OrdersPage from "./pages/OrdersPage";
// import CSRPage from "./pages/CSRPage";
// import TeamLeaderPage from "./pages/TeamLeaderPage";
// import ProcurementPage from "./pages/ProcurementPage";
// import WarehousePage from "./pages/WarehousePage";
// import AccountingPage from "./pages/AccountingPage";

// // ProtectedRoute component
// function ProtectedRoute({ children, allowedRoles, user }) {
//   // If no user is logged in, go to login page
//   if (!user || !user.role) {
//     return <Navigate to="/login" replace />;
//   }

//   // If user role is not allowed, send to dashboard
//   if (!allowedRoles.includes(user.role)) {
//     return <Navigate to="/dashboard" replace />;
//   }

//   return children;
// }

function App() {
  // Auth state (replace later with real auth logic)
  // const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
