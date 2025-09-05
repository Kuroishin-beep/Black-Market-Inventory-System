import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "./CSR.css";
import "./shared.css";

const CSR = () => {
  const [userRole, setUserRole] = useState("csr");
  const [orderRequests, setOrderRequests] = useState([
    {
      itemInfo: "Lenovo ThinkBook Plus Gen 6",
      customer: "ABC Retail",
      item: "12,345",
      total: "$599.75",
      status: "pending",
      id: 1,
    },
    {
      itemInfo: "Acer Chromebook Plus Spin 514",
      customer: "DEF Merchandise",
      item: "23,456",
      total: "$599.75",
      status: "pending",
      id: 2,
    },
    {
      itemInfo: "Acer Predator Helios 18P AI",
      customer: "GHI Retail",
      item: "1,234",
      total: "$599.75",
      status: "approved",
      id: 3,
    },
    {
      itemInfo: "Asus ROG Zephyrus G16",
      customer: "JKL Store",
      item: "45,678",
      total: "$599.75",
      status: "pending",
      id: 4,
    },
    {
      itemInfo: "Acer Predator Helios Neo 16",
      customer: "MNO Merchandise",
      item: "678",
      total: "$599.75",
      status: "pending",
      id: 5,
    },
    {
      itemInfo: "Dell XPS 13",
      customer: "PQR Retail",
      item: "13,567",
      total: "$599.75",
      status: "denied",
      id: 6,
    },
    {
      itemInfo: "Lenovo ThinkBook Plus Gen 6",
      customer: "STU Merchandise",
      item: "12,345",
      total: "$599.75",
      status: "pending",
      id: 7,
    },
    {
      itemInfo: "Acer Chromebook Plus Spin 514",
      customer: "VWX Store",
      item: "23,456",
      total: "$599.75",
      status: "pending",
      id: 8,
    },
    {
      itemInfo: "Acer Predator Helios 18P AI",
      customer: "YZA Store",
      item: "1,234",
      total: "$599.75",
      status: "pending",
      id: 9,
    },
    {
      itemInfo: "Asus ROG Zephyrus G16",
      customer: "BCD Retail",
      item: "45,678",
      total: "$599.75",
      status: "pending",
      id: 10,
    },
  ]);

  const handleApprove = (id) => {
    setOrderRequests((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status: "approved" } : order
      )
    );
  };

  const handleDeny = (id) => {
    setOrderRequests((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status: "denied" } : order
      )
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <span className="status-badge approved">Approved</span>;
      case "denied":
        return <span className="status-badge denied">Denied</span>;
      case "pending":
      default:
        return (
          <div className="action-buttons">
            <button
              className="approve-btn"
              onClick={() => handleApprove(order.id)}
            >
              ✓
            </button>
            <button className="deny-btn" onClick={() => handleDeny(order.id)}>
              ✗
            </button>
          </div>
        );
    }
  };

  return (
    <div className="csr-container">
      <Sidebar userRole={userRole} />

      <main className="csr-main">
        <div className="csr-header">
          <h1>Order Requests</h1>
          <div className="header-actions">
            <button className="filter-btn">
              <span className="filter-icon">🔽</span>
              Filter
            </button>
          </div>
          <div className="user-info">
            <div className="user-avatar">
              <span className="user-icon">👤</span>
            </div>
            <div className="user-details">
              <span className="user-name">Mark Anthony Dela Cruz</span>
              <span className="user-id">#081203</span>
            </div>
          </div>
        </div>

        <div className="csr-content">
          <div className="orders-table">
            <div className="table-header">
              <div className="header-cell">Item Information</div>
              <div className="header-cell">Customer</div>
              <div className="header-cell">Item</div>
              <div className="header-cell">Total</div>
              <div className="header-cell">Action</div>
            </div>

            <div className="table-body">
              {orderRequests.map((order, index) => (
                <div key={index} className="table-row">
                  <div className="table-cell">{order.itemInfo}</div>
                  <div className="table-cell">{order.customer}</div>
                  <div className="table-cell">{order.item}</div>
                  <div className="table-cell">{order.total}</div>
                  <div className="table-cell">
                    {order.status === "approved" && (
                      <span className="status-badge approved">Approved</span>
                    )}
                    {order.status === "denied" && (
                      <span className="status-badge denied">Denied</span>
                    )}
                    {order.status === "pending" && (
                      <div className="action-buttons">
                        <button
                          className="approve-btn"
                          onClick={() => handleApprove(order.id)}
                        >
                          ✓
                        </button>
                        <button
                          className="deny-btn"
                          onClick={() => handleDeny(order.id)}
                        >
                          ✗
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pagination">
            <button className="pagination-btn">
              <span>←</span> Previous
            </button>

            <div className="page-numbers">
              <span className="page-number">01</span>
              <span className="page-number">02</span>
              <span className="page-number active">03</span>
              <span className="page-dots">...</span>
              <span className="page-number">20</span>
            </div>

            <button className="pagination-btn">
              Next <span>→</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CSR;
