import React, { useState } from "react";
import Sidebar from "../components/SideBar";
import "../styles/Accounting.css";
import { LuSend } from "react-icons/lu";
import { FaUserCircle } from "react-icons/fa";
import { CiFilter } from "react-icons/ci";

const AccountingPage = ({ userRole = "accounting" }) => {
  const [billings, setBillings] = useState([
    {
      orderId: "#12345",
      customer: "ABC Retail",
      price: "$599.75",
      status: "Pending",
      invoiceSent: false,
      dueDate: "2025-09-01",
    },
    {
      orderId: "#67890",
      customer: "DEF Merchandise",
      price: "$599.75",
      status: "Paid",
      invoiceSent: true,
      dueDate: "2025-09-02",
    },
    {
      orderId: "#12346",
      customer: "GHI Retail",
      price: "$599.75",
      status: "Pending",
      invoiceSent: false,
      dueDate: "2025-09-03",
    },
    {
      orderId: "#67891",
      customer: "JKL Store",
      price: "$599.75",
      status: "Paid",
      invoiceSent: true,
      dueDate: "2025-09-04",
    },
    {
      orderId: "#12347",
      customer: "MNO Merchandise",
      price: "$599.75",
      status: "Pending",
      invoiceSent: false,
      dueDate: "2025-09-05",
    },
    {
      orderId: "#67892",
      customer: "PQR Retail",
      price: "$599.75",
      status: "Paid",
      invoiceSent: true,
      dueDate: "2025-09-06",
    },
    {
      orderId: "#12348",
      customer: "STU Merchandise",
      price: "$599.75",
      status: "Overdue",
      invoiceSent: true,
      dueDate: "2025-09-07",
    },
    {
      orderId: "#67893",
      customer: "VWX Store",
      price: "$599.75",
      status: "Paid",
      invoiceSent: true,
      dueDate: "2025-09-08",
    },
    {
      orderId: "#12349",
      customer: "YZA Store",
      price: "$599.75",
      status: "Pending",
      invoiceSent: false,
      dueDate: "2025-09-09",
    },
    {
      orderId: "#67894",
      customer: "BCD Retail",
      price: "$599.75",
      status: "Overdue",
      invoiceSent: true,
      dueDate: "2025-09-10",
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
      <div className="accounting-content">
        <header className="accounting-header">
          <FaUserCircle className="user-pfp" />
          <div className="user-details">
            <span className="user-name">Mark Anthony Dela Cruz</span>
            <span className="user-id">#081203</span>
          </div>
        </header>

        <main className="accounting-main">
          <div className="accounting-main__header">
            <h1 className="accounting-title">Billing</h1>
            <div className="accounting-main__header--buttons">
              <button className="accounting-main__filter">
                <CiFilter className="accounting-icon filter" /> Filter
              </button>
            </div>
          </div>

          <div className="accounting-table__main">
            <table className="accounting-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Price</th>
                  <th>Payment Due</th>
                  <th>Status</th>
                  <th className="last-column">Action</th>
                </tr>
              </thead>

              <tbody>
                {billings.map((bill) => (
                  <tr key={bill.id}>
                    <td>{bill.orderId}</td>
                    <td>{bill.customer}</td>
                    <td>{bill.price}</td>
                    <td>{bill.dueDate}</td>
                    <td>
                      <span className={`badge ${getStatusClass(bill.status)}`}>
                        {bill.status}
                      </span>
                    </td>

                    <td>
                      <button className="action-btn">
                        <LuSend />
                      </button>
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

export default AccountingPage;
