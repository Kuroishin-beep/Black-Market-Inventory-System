import React, { useState } from "react";
import Sidebar from "../components/SideBar";
import "../styles/TeamLeader.css";
import { FaUserCircle } from "react-icons/fa";
import { CiFilter } from "react-icons/ci";
import { BsCheckSquare } from "react-icons/bs";
import { BsXSquare } from "react-icons/bs";

const TeamLeaderPage = ({ userRole = "teamlead" }) => {
  const [orderRequests, setOrderRequests] = useState([
    {
      itemInfo: "Lenovo ThinkBook Plus Gen 6",
      customer: "ABC Retail",
      item: "12,345",
      total: "$599.75",
      status: "approved",
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
      status: "approved",
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
      status: "approved",
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
      status: "approved",
      id: 7,
    },
    {
      itemInfo: "Acer Chromebook Plus Spin 514",
      customer: "VWX Store",
      item: "23,456",
      total: "$599.75",
      status: "approved",
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
      status: "approved",
      id: 10,
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

  const handleSetStatus = (id, newStatus) => {
    setOrderRequests((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  };

  const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

  return (
    <div className="team-container">
      <Sidebar userRole={userRole} />
      <div className="team-content">
        <header className="team-header">
          <FaUserCircle className="user-pfp" />
          <div className="user-details">
            <span className="user-name">Mark Anthony Dela Cruz</span>
            <span className="user-id">#081203</span>
          </div>
        </header>

        <main className="team-main">
          <div className="team-main__header">
            <h1 className="team-title">Order Requests</h1>
            <div className="team-main__header--buttons">
              <button className="team-main__filter">
                <CiFilter className="team-icon filter" /> Filter
              </button>
            </div>
          </div>

          <div className="team-table__main">
            <table className="team-table">
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

                    <td>
                      <span
                        className={`status-badge ${
                          order.status === "approved" ? "approved" : "denied"
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
                          aria-label={`Set order ${order.id} approved`}
                          onClick={() => handleSetStatus(order.id, "approved")}
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

export default TeamLeaderPage;
