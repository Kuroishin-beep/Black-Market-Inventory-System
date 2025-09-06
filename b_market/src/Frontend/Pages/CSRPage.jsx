import React, { useState } from "react";
import Sidebar from "../Pages/Sidebar";
import "../CSS/CSR.css";
import "../CSS/Shared.css";

const CSRPage = () => {
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
      status: "denied",
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

  const handleSendRequest = (id) => {
    // Send product approval request to Team Lead
    setOrderRequests((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status: "sent-to-teamlead" } : order
      )
    );
    console.log(`Sending approval request for order ${id} to Team Lead`);
  };

  const handleCreateNewRequest = () => {
    // Add new request functionality
    const newRequest = {
      itemInfo: "New Product Request",
      customer: "New Customer",
      item: "0",
      total: "$0.00",
      status: "pending",
      id: Date.now(),
    };
    setOrderRequests((prev) => [newRequest, ...prev]);
  };

  return (
    <div className="csr-container">
      <Sidebar userRole={userRole} />

      <main className="csr-main">
        <div className="csr-header">
          <h1>CSR Panel - Product Approval Requests</h1>
          <div className="header-actions">
            <button className="filter-btn">
              <span className="filter-icon">🔽</span>
              Filter
            </button>
            <button
              className="add-request-btn"
              onClick={handleCreateNewRequest}
            >
              <span className="add-icon">+</span>
              New Request
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
              <div className="header-cell">Status/Action</div>
            </div>

            <div className="table-body">
              {orderRequests.map((order, index) => (
                <div key={index} className="table-row">
                  <div className="table-cell">{order.itemInfo}</div>
                  <div className="table-cell">{order.customer}</div>
                  <div className="table-cell">{order.item}</div>
                  <div className="table-cell">{order.total}</div>
                  <div className="table-cell">
                    {order.status === "denied" && (
                      <span className="status-badge denied">Denied</span>
                    )}
                    {order.status === "sent-to-teamlead" && (
                      <span className="status-badge sent">
                        Sent to Team Lead
                      </span>
                    )}
                    {order.status === "pending" && (
                      <button
                        className="send-request-btn"
                        onClick={() => handleSendRequest(order.id)}
                      >
                        Send to Team Lead
                      </button>
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

export default CSRPage;
