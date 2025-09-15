import React, { useState } from "react";
import Sidebar from "../components/SideBar";
import "../styles/Accounting.css";

const AccountingPage = ({ userRole = "accounting" }) => {
  const [billings, setBillings] = useState([
    {
      orderId: "#12345",
      customer: "ABC Retail",
      price: "$599.75",
      status: "Pending",
      invoiceSent: false,
    },
    {
      orderId: "#67890",
      customer: "DEF Merchandise",
      price: "$599.75",
      status: "Paid",
      invoiceSent: true,
    },
    {
      orderId: "#12346",
      customer: "GHI Retail",
      price: "$599.75",
      status: "Pending",
      invoiceSent: false,
    },
    {
      orderId: "#67891",
      customer: "JKL Store",
      price: "$599.75",
      status: "Paid",
      invoiceSent: true,
    },
    {
      orderId: "#12347",
      customer: "MNO Merchandise",
      price: "$599.75",
      status: "Pending",
      invoiceSent: false,
    },
    {
      orderId: "#67892",
      customer: "PQR Retail",
      price: "$599.75",
      status: "Paid",
      invoiceSent: true,
    },
    {
      orderId: "#12348",
      customer: "STU Merchandise",
      price: "$599.75",
      status: "Overdue",
      invoiceSent: true,
    },
    {
      orderId: "#67893",
      customer: "VWX Store",
      price: "$599.75",
      status: "Paid",
      invoiceSent: true,
    },
    {
      orderId: "#12349",
      customer: "YZA Store",
      price: "$599.75",
      status: "Pending",
      invoiceSent: false,
    },
    {
      orderId: "#67894",
      customer: "BCD Retail",
      price: "$599.75",
      status: "Overdue",
      invoiceSent: true,
    },
  ]);

  const [currentPage, setCurrentPage] = useState(3);

  const handleSendInvoice = (index) => {
    const updatedBillings = [...billings];
    updatedBillings[index].invoiceSent = true;
    setBillings(updatedBillings);
    console.log(`Invoice sent for order ${updatedBillings[index].orderId}`);
  };

  const handleMarkAsPaid = (index) => {
    const updatedBillings = [...billings];
    updatedBillings[index].status = "Paid";
    setBillings(updatedBillings);
    console.log(`Order ${updatedBillings[index].orderId} marked as Paid`);
  };

  const handleMarkAsOverdue = (index) => {
    const updatedBillings = [...billings];
    updatedBillings[index].status = "Overdue";
    setBillings(updatedBillings);
    console.log(`Order ${updatedBillings[index].orderId} marked as Overdue`);
  };

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
          <h1>Accounting - Billing & Invoices</h1>
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
                    <div className="action-dropdown">
                      <span
                        className="action-icon hover-trigger"
                        title="Options"
                      >
                        ⚙️
                      </span>
                      <div className="dropdown-menu">
                        {!billing.invoiceSent && (
                          <button
                            className="dropdown-item"
                            onClick={() => handleSendInvoice(index)}
                          >
                            📧 Send Invoice
                          </button>
                        )}
                        {billing.status !== "Paid" && (
                          <button
                            className="dropdown-item"
                            onClick={() => handleMarkAsPaid(index)}
                          >
                            ✅ Mark as Paid
                          </button>
                        )}
                        {billing.status === "Pending" && (
                          <button
                            className="dropdown-item"
                            onClick={() => handleMarkAsOverdue(index)}
                          >
                            ⚠️ Mark as Overdue
                          </button>
                        )}
                      </div>
                    </div>
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

export default AccountingPage;
