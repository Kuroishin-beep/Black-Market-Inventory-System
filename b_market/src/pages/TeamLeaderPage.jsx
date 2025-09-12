import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/TeamLeader.css";

const TeamLeaderPage = ({ userRole = "teamlead" }) => {
  const [orders, setOrders] = useState([
    {
      id: "12345",
      itemInfo: "Lenovo ThinkBook Plus Gen 6",
      customer: "ABC Retail",
      item: "12,345",
      total: "$599.75",
      status: "Pending Approval",
    },
    {
      id: "67890",
      itemInfo: "Acer Chromebook Plus Spin 514",
      customer: "DEF Merchandise",
      item: "23,456",
      total: "$599.75",
      status: "Pending Approval",
    },
    {
      id: "12346",
      itemInfo: "Acer Predator Helios 18P AI",
      customer: "GHI Retail",
      item: "1,234",
      total: "$599.75",
      status: "Approved",
    },
    {
      id: "67891",
      itemInfo: "Asus ROG Zephyrus G16",
      customer: "JKL Store",
      item: "45,678",
      total: "$599.75",
      status: "Pending Approval",
    },
    {
      id: "12347",
      itemInfo: "Acer Predator Helios Neo 16",
      customer: "MNO Merchandise",
      item: "678",
      total: "$599.75",
      status: "Pending Approval",
    },
    {
      id: "67892",
      itemInfo: "Dell XPS 13",
      customer: "PQR Retail",
      item: "13,567",
      total: "$599.75",
      status: "Denied",
    },
    {
      id: "12348",
      itemInfo: "Lenovo ThinkBook Plus Gen 6",
      customer: "STU Merchandise",
      item: "12,345",
      total: "$599.75",
      status: "Pending Approval",
    },
    {
      id: "67893",
      itemInfo: "Acer Chromebook Plus Spin 514",
      customer: "VWX Store",
      item: "23,456",
      total: "$599.75",
      status: "Approved",
    },
    {
      id: "12349",
      itemInfo: "Acer Predator Helios 18P AI",
      customer: "YZA Store",
      item: "1,234",
      total: "$599.75",
      status: "Pending Approval",
    },
    {
      id: "67894",
      itemInfo: "Asus ROG Zephyrus G16",
      customer: "BCD Retail",
      item: "45,678",
      total: "$599.75",
      status: "Pending Approval",
    },
  ]);

  const [currentPage, setCurrentPage] = useState(3);

  const handleApprove = (index) => {
    const updatedOrders = [...orders];
    updatedOrders[index].status = "Approved";
    setOrders(updatedOrders);

    // In real app, this would also update the Orders page to show the approved order
    console.log(
      `Order ${updatedOrders[index].id} approved and will appear in Orders`
    );
  };

  const handleDeny = (index) => {
    const updatedOrders = [...orders];
    updatedOrders[index].status = "Denied";
    setOrders(updatedOrders);

    // In real app, this would reflect back to CSR as Denied
    console.log(
      `Order ${updatedOrders[index].id} denied and reflected back to CSR`
    );
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "approved";
      case "denied":
        return "denied";
      case "pending approval":
        return "pending";
      default:
        return "pending";
    }
  };

  return (
    <div className="teamlead-container">
      <Sidebar userRole={userRole} />
      <main className="teamlead-main">
        <header className="teamlead-header">
          <h1>Approvals - CSR Requests</h1>
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

        <div className="teamlead-content">
          <div className="orders-table">
            <div className="table-header">
              <div className="header-cell">Item Information</div>
              <div className="header-cell">Customer</div>
              <div className="header-cell">Item</div>
              <div className="header-cell">Total</div>
              <div className="header-cell">Action</div>
            </div>

            <div className="table-body">
              {orders.map((order, index) => (
                <div key={index} className="table-row">
                  <div className="table-cell">{order.itemInfo}</div>
                  <div className="table-cell">{order.customer}</div>
                  <div className="table-cell">{order.item}</div>
                  <div className="table-cell">{order.total}</div>
                  <div className="table-cell">
                    {order.status === "Pending Approval" ? (
                      <div className="action-buttons">
                        <button
                          className="approve-btn"
                          onClick={() => handleApprove(index)}
                        >
                          ✓
                        </button>
                        <button
                          className="deny-btn"
                          onClick={() => handleDeny(index)}
                        >
                          ✗
                        </button>
                      </div>
                    ) : (
                      <span
                        className={`status-badge ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    )}
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

export default TeamLeaderPage;
