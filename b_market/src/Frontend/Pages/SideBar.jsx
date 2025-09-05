import React from "react";
import "./Sidebar.css";

const Sidebar = ({ userRole = "customer" }) => {
  const getRoleSpecificButton = () => {
    switch (userRole) {
      case "csr":
        return { label: "CSR", icon: "🛡️", path: "/csr" };
      case "teamlead":
        return { label: "Approvals", icon: "🛡️", path: "/teamlead" };
      case "procurement":
        return { label: "Procurement", icon: "➕", path: "/procurement" };
      case "warehouse":
        return { label: "Warehouse", icon: "📦", path: "/warehouse" };
      case "accounting":
        return { label: "Accounting", icon: "💳", path: "/accounting" };
      case "customer":
        return { label: "My Orders", icon: "👤", path: "/my-orders" };
      case "admin":
        return { label: "Reports", icon: "📊", path: "/reports" };
      default:
        return { label: "My Orders", icon: "👤", path: "/my-orders" };
    }
  };

  const roleButton = getRoleSpecificButton();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-circle"></div>
        <span className="logo-text">Black Market</span>
      </div>

      <nav className="sidebar-nav">
        <a href="/dashboard" className="nav-item">
          <span className="nav-icon">🏠</span>
          <span className="nav-label">Dashboard</span>
        </a>

        <a href="/products" className="nav-item">
          <span className="nav-icon">🏷️</span>
          <span className="nav-label">Products</span>
        </a>

        <a href="/orders" className="nav-item">
          <span className="nav-icon">🛒</span>
          <span className="nav-label">Orders</span>
        </a>

        <a href={roleButton.path} className="nav-item">
          <span className="nav-icon">{roleButton.icon}</span>
          <span className="nav-label">{roleButton.label}</span>
        </a>

        <a href="/logout" className="nav-item logout">
          <span className="nav-icon">🔤</span>
          <span className="nav-label">Logout</span>
        </a>
      </nav>
    </aside>
  );
};

export default Sidebar;
