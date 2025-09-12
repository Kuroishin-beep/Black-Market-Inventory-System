import React from "react";
import { Link } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = ({ userRole = "csr" }) => {
  const getRoleSpecificButton = () => {
    switch (userRole) {
      case "csr":
        return { label: "CSR Panel", icon: "🛡️", path: "/csr" };
      case "teamlead":
        return { label: "Approvals", icon: "🛡️", path: "/approvals" };
      case "procurement":
        return { label: "Procurement", icon: "➕", path: "/procurement" };
      case "warehouse":
        return { label: "Warehouse", icon: "📦", path: "/warehouse" };
      case "accounting":
        return { label: "Accounting", icon: "💳", path: "/accounting" };
      default:
        return { label: "CSR Panel", icon: "🛡️", path: "/csr" };
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
        <Link to="/dashboard" className="nav-item">
          <span className="nav-icon">🏠</span>
          <span className="nav-label">Dashboard</span>
        </Link>

        <Link to="/products" className="nav-item">
          <span className="nav-icon">🏷️</span>
          <span className="nav-label">Products</span>
        </Link>

        <Link to="/orders" className="nav-item">
          <span className="nav-icon">🛒</span>
          <span className="nav-label">Orders</span>
        </Link>

        <Link to={roleButton.path} className="nav-item">
          <span className="nav-icon">{roleButton.icon}</span>
          <span className="nav-label">{roleButton.label}</span>
        </Link>

        <Link to="/logout" className="nav-item logout">
          <span className="nav-icon">🚪</span>
          <span className="nav-label">Logout</span>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
