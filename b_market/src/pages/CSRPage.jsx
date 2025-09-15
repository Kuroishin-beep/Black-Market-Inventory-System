import React, { useState } from "react";
import Sidebar from "../components/SideBar";
import "../styles/CSR.css";
import "../styles/Shared.css";
import { FaUserCircle } from "react-icons/fa";
import { CiFilter } from "react-icons/ci";
import { BsCheckSquare } from "react-icons/bs";
import { BsXSquare } from "react-icons/bs";

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
      status: "denied",
      id: 2,
    },
    {
      itemInfo: "Acer Predator Helios 18P AI",
      customer: "GHI Retail",
      item: "1,234",
      total: "$599.75",
      status: "pending",
      id: 3,
    },
    {
      itemInfo: "Asus ROG Zephyrus G16",
      customer: "JKL Store",
      item: "45,678",
      total: "$599.75",
      status: "denied",
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
      status: "denied",
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

  const handleSetStatus = (id, newStatus) => {
    setOrderRequests((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
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

  const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

  return (
    <div className="csr-container">
      <Sidebar userRole={userRole} />
      <div className="csr-content">
        <header className="csr-header">
          <FaUserCircle className="user-pfp" />
          <div className="user-details">
            <span className="user-name">Mark Anthony Dela Cruz</span>
            <span className="user-id">#081203</span>
          </div>
        </header>

        <main className="csr-main">
          <div className="csr-main__header">
            <h1 className="csr-title">Order Requests</h1>
            <div className="csr-main__header--buttons">
              <button className="csr-main__filter">
                <CiFilter className="csr-icon filter" /> Filter
              </button>
            </div>
          </div>

          <div className="csr-table__main">
            <table className="csr-table">
              <thead>
                <tr>
                  <th>Item Information</th>
                  <th>Customer</th>
                  <th>Item</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th className="last-column">Action</th>
                </tr>
              </thead>

              <tbody>
                {orderRequests.map((order) => (
                  <tr key={order.id}>
                    <td>{order.itemInfo}</td>
                    <td>{order.customer}</td>
                    <td>{order.item}</td>
                    <td>{order.total}</td>

                    {/* Status column */}
                    <td>
                      <span
                        className={`status-badge ${
                          order.status === "pending" ? "pending" : "denied"
                        }`}
                      >
                        {capitalize(order.status)}
                      </span>
                    </td>

                    <td className="last-column">
                      <div className="action-icons">
                        <button
                          type="button"
                          className="icon-btn approved"
                          aria-label={`Set order ${order.id} pending`}
                          onClick={() => handleSetStatus(order.id, "pending")}
                        >
                          <BsCheckSquare className="action-icon approve" />
                        </button>

                        <button
                          type="button"
                          className="icon-btn denied"
                          aria-label={`Set order ${order.id} denied`}
                          onClick={() => handleSetStatus(order.id, "denied")}
                        >
                          <BsXSquare className="action-icon reject" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              <button className="pagination-btn">
                <span>←</span> Previous
              </button>

              <div className="page-numbers">
                <span className="page-number">01</span>
                <span className="page-number">02</span>
                <span className="page-number">03</span>
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

export default CSRPage;
