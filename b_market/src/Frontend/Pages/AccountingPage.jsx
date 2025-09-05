import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "./Accounting.css";

const Accounting = ({ userRole = "accounting" }) => {
  const [billings, setBillings] = useState([
    {
      orderId: "#12345",
      customer: "ABC Retail",
      price: "$599.75",
      status: "Pending",
      action: "✈️",
    },
    {
      orderId: "#67890",
      customer: "DEF Merchandise",
      price: "$599.75",
      status: "Paid",
      action: "✈️",
    },
    {
      orderId: "#12345",
      customer: "GHI Retail",
      price: "$599.75",
      status: "Pending",
      action: "✈️",
    },
    {
      orderId: "#67890",
      customer: "JKL Store",
      price: "$599.75",
      status: "Paid",
      action: "✈️",
    },
    {
      orderId: "#12345",
      customer: "MNO Merchandise",
      price: "$599.75",
      status: "Pending",
      action: "✈️",
    },
    {
      orderId: "#67890",
      customer: "PQR Retail",
      price: "$599.75",
      status: "Paid",
      action: "✈️",
    },
    {
      orderId: "#12345",
      customer: "STU Merchandise",
      price: "$599.75",
      status: "Overdue",
      action: "✈️",
    },
    {
      orderId: "#67890",
      customer: "VWX Store",
      price: "$599.75",
      status: "Paid",
      action: "✈️",
    },
    {
      orderId: "#12345",
      customer: "YZA Store",
      price: "$599.75",
      status: "Pending",
      action: "✈️",
    },
    {
      orderId: "#67890",
      customer: "BCD Retail",
      price: "$599.75",
      status: "Overdue",
      action: "✈️",
    },
  ]);

  const [currentPage, setCurrentPage] = useState(3);

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "paid";
      case "pending":
        return "pending";
      case "overdue":
        return "overdue";
      default:
        return "pending";
    }
  };

  return (
    <div className="accounting-container">
      <Sidebar userRole={userRole} />
      <main className="accounting-main">
        <header className="accounting-header">
          <h1>Billing</h1>
          <div className="header-actions">
            <button className="filter-btn">
              <span className="filter-icon">▲</span>
              Filter
            </button>
          </div>
          <div className="user-info">
            <div className="user-avatar">
              <span className="user-icon">👤</span>
            </div>
            <div className="user-details">
              <div className="user-name">Mark Anthony Dela Cruz</div>
              <div className="user-id">#081203</div>
            </div>
          </div>
        </header>

        <div className="accounting-content">
          <div className="billing-table">
            <div className="table-header">
              <div className="header-cell">Order ID</div>
              <div className="header-cell">Customer</div>
              <div className="header-cell">Price</div>
              <div className="header-cell">Status</div>
              <div className="header-cell">Action</div>
            </div>

            <div className="table-body">
              {billings.map((billing, index) => (
                <div key={index} className="table-row">
                  <div className="table-cell">{billing.orderId}</div>
                  <div className="table-cell">{billing.customer}</div>
                  <div className="table-cell">{billing.price}</div>
                  <div className="table-cell">
                    <span
                      className={`status-badge ${getStatusClass(
                        billing.status
                      )}`}
                    >
                      {billing.status}
                    </span>
                  </div>
                  <div className="table-cell">
                    <span className="action-icon">{billing.action}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pagination">
            <button className="pagination-btn" disabled>
              ◀ Previous
            </button>
            <div className="page-numbers">
              <span className="page-number">01</span>
              <span className="page-number">02</span>
              <span className="page-number active">03</span>
              <span className="page-dots">...</span>
              <span className="page-number">20</span>
            </div>
            <button className="pagination-btn">Next ▶</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Accounting;
