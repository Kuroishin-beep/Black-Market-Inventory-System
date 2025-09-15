import React, { useState } from "react";
import Sidebar from "../components/SideBar";
import "../styles/Orders.css";
import "../styles/Shared.css";
import { FaUserCircle } from "react-icons/fa";
import { CiFilter } from "react-icons/ci";

const OrdersPage = () => {
  const [userRole, setUserRole] = useState("teamlead");
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
      orderId: "#12346",
      date: "12 Aug, 2025",
      customer: "GHI Retail",
      productId: "#12346",
      total: "$599.75",
      payment: "Pending",
      item: "1,234",
    },
    {
      orderId: "#67891",
      date: "12 Dec, 2025",
      customer: "JKL Store",
      productId: "#67891",
      total: "$599.75",
      payment: "Paid",
      item: "45,678",
    },
    {
      orderId: "#12347",
      date: "23 Sept, 2025",
      customer: "MNO Merchandise",
      productId: "#12347",
      total: "$599.75",
      payment: "Pending",
      item: "678",
    },
    {
      orderId: "#67892",
      date: "17 Oct, 2025",
      customer: "PQR Retail",
      productId: "#67892",
      total: "$599.75",
      payment: "Paid",
      item: "13,567",
    },
    {
      orderId: "#12348",
      date: "12 July, 2025",
      customer: "STU Merchandise",
      productId: "#12348",
      total: "$599.75",
      payment: "Overdue",
      item: "12,345",
    },
    {
      orderId: "#67893",
      date: "12 Aug, 2025",
      customer: "VWX Store",
      productId: "#67893",
      total: "$599.75",
      payment: "Paid",
      item: "23,456",
    },
    {
      orderId: "#12349",
      date: "12 Dec, 2025",
      customer: "YZA Store",
      productId: "#12349",
      total: "$599.75",
      payment: "Pending",
      item: "1,234",
    },
    {
      orderId: "#67894",
      date: "23 Sept, 2025",
      customer: "BCD Retail",
      productId: "#67894",
      total: "$599.75",
      payment: "Overdue",
      item: "45,678",
    },
  ]);

  const [currentPage, setCurrentPage] = useState(3);
  const totalPages = 20;

  const getPaymentStatusClass = (payment) => {
    switch (payment.toLowerCase()) {
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
    <div className="orders-container">
      <Sidebar userRole={userRole} />

      <div className="orders-content">
        {/* Header */}
        <header className="dashboard-header">
          <FaUserCircle className="user-pfp" />
          <div className="user-details">
            <span className="user-name">Mark Anthony Dela Cruz</span>
            <span className="user-id">#081203</span>
          </div>
        </header>

        {/* Main Content */}
        <main className="orders-main">
          <div className="orders-main__header">
            <h1 className="orders-title">Orders</h1>
            <div className="orders-main__header--buttons">
              <button className="orders-main__filter">
                <CiFilter className="orders-icon filter" />
                Filter
              </button>
            </div>
          </div>

          {/* Orders Table */}
          <div className="orders-table__main">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Product ID</th>
                  <th>Total</th>
                  <th>Item</th>
                  <th className="last-column">Payment</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={index}>
                    <td>{order.orderId}</td>
                    <td>{order.date}</td>
                    <td>{order.customer}</td>
                    <td>{order.productId}</td>
                    <td>{order.total}</td>
                    <td>{order.item}</td>
                    <td className="last-column">
                      <span
                        className={`badge ${getPaymentStatusClass(
                          order.payment
                        )}`}
                      >
                        {order.payment}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="pagination">
              <button className="pagination-btn">
                <span>←</span> Previous
              </button>

              <div className="page-numbers">
                <span className="page-number">01</span>
                <span className="page-number">02</span>
                <span className="page-number">
                  {String(currentPage).padStart(2, "0")}
                </span>
              </div>

              <button className="pagination-btn">
                Next <span>→</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrdersPage;
