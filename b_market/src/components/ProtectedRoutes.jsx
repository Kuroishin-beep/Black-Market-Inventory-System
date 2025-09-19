import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, allowedRoles = [], children }) => {
  console.log("ProtectedRoute check:", { user, allowedRoles });

  if (!user) {
    console.log("Not logged in → redirect to /login");
    return <Navigate to="/login" replace />;
  }

  const role = (user.role).toLowerCase();
  console.log("User role:", role);

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    console.log("Role not authorized → redirect to /dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
