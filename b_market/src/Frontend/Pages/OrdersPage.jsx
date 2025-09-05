import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "./Orders.css";
import "./shared.css";

const Orders = () => {
  const [userRole, setUserRole] = useState("admin");
  const [orders] = useState([
    {
      orderId: "#12345",
      date: "12 July, 2025",
      customer: "ABC Retail",
      productId: "#12345",
      total: "$599.75",
      payment: "Pending",
      item: "12,345",
    },
    {
      orderId: "#67890",
      date: "17 Oct, 2025",
      customer: "DEF Merchandise",
      productId: "#67890",
      total: "$599.75",
      payment: "Paid",
      item: "23,456",
    },
    {
      orderId: "#12345",
      date: "12 Aug, 2025",
      customer: "GHI Retail",
      productId: "#12345",
      total: "$599.75",
      payment: "Pending",
      item: "1,234",
    },
    {
      orderId: "#67890",
      date: "12 Dec, 2025",
      customer: "JKL Store",
      productId: "#67890",
      total: "$599.75",
      payment: "Paid",
      item: "45,678",
    },
    {
      orderId: "#12345",
      date: "23 Sept, 2025",
      customer: "MNO Merchandise",
      productId: "#12345",
      total: "$599.75",
      payment: "Pending",
      item: "678",
    },
    {
      orderId: "#67890",
      date: "17 Oct, 2025",
      customer: "PQR Retail",
      productId: "#67890",
      total: "$599.75",
      payment: "Paid",
      item: "13,567",
    },
    {
      orderId: "#12345",
      date: "12 July, 2025",
      customer: "STU Merchandise",
      productId: "#12345",
      total: "$599.75",
      payment: "Pending",
      item: "12,345",
    },
    {
      orderId: "#67890",
      date: "12 Aug, 2025",
      customer: "VWX Store",
      productId: "#67890",
      total: "$599.75",
      payment: "Paid",
      item: "23,456",
    },
    {
      orderId: "#12345",
      date: "12 Dec, 2025",
      customer: "YZA Store",
      productId: "#12345",
      total: "$599.75",
      payment: "Pending",
      item: "1,234",
    },
    {
      orderId: "#67890",
      date: "23 Sept, 2025",
      customer: "BCD Retail",
      productId: "#67890",
      total: "$599.75",
      payment: "Paid",
      item: "45,678",
    },
  ]);

  const [currentPage, setCurrentPage] = useState(3);
  const totalPages = 20;

  return (
    <div className="orders-container">
      <Sidebar userRole={userRole} />

      <main className="orders-main">
        <div className="orders-header">
          <h1>Orders</h1>
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

        <div className="orders-content">
          <div className="table-container">
            <div className="table-actions">
              <button className="filter-btn">
                <span className="filter-icon">🔽</span>
                Filter
              </button>
            </div>

            <div className="orders-table">
              <div className="table-header">
                <div className="header-cell">Order ID</div>
                <div className="header-cell">Date</div>
                <div className="header-cell">Customer</div>
                <div className="header-cell">Product ID</div>
                <div className="header-cell">Total</div>
                <div className="header-cell">Payment</div>
                <div className="header-cell">Item</div>
              </div>

              <div className="table-body">
                {orders.map((order, index) => (
                  <div key={index} className="table-row">
                    <div className="table-cell">{order.orderId}</div>
                    <div className="table-cell">{order.date}</div>
                    <div className="table-cell">{order.customer}</div>
                    <div className="table-cell">{order.productId}</div>
                    <div className="table-cell">{order.total}</div>
                    <div className="table-cell">
                      <span
                        className={`status-badge ${
                          order.payment === "Paid" ? "paid" : "pending"
                        }`}
                      >
                        {order.payment}
                      </span>
                    </div>
                    <div className="table-cell">{order.item}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <span>←</span> Previous
              </button>

              <div className="page-numbers">
                <span className="page-number">01</span>
                <span className="page-number">02</span>
                <span className="page-number active">03</span>
                <span className="page-dots">...</span>
                <span className="page-number">{totalPages}</span>
              </div>

              <button
                className="pagination-btn"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Orders;
