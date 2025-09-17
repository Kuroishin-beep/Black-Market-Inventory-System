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
          <h1 className="csr-title">Order Form</h1>

          <div className="csr-card">
            <div className="form-group">
              <label>Supplier</label>
              <select className="form-select">
                <option value="">Select Supplier</option>
                <option value="supplier1">Supplier 1</option>
                <option value="supplier2">Supplier 2</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group product-group">
                <label>Product/s</label>
                <select className="form-select">
                  <option value="">Select Product</option>
                  <option value="product1">Product 1</option>
                  <option value="product2">Product 2</option>
                </select>
              </div>

              <div className="form-group qty-group">
                <label>Qty</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 1458"
                />
              </div>
            </div>

            <button className="add-btn">+ Add More Product</button>

            <div className="form-submit">
              <button className="submit-btn">Submit</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CSRPage;
