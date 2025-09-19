import React, { useEffect, useState } from "react";
import Sidebar from "../components/SideBar";
import "../styles/Accounting.css";
import { LuSend } from "react-icons/lu";
import { FaUserCircle } from "react-icons/fa";
import { CiFilter } from "react-icons/ci";
import { supabase } from "../supabaseClient"; // ✅ Supabase client

const AccountingPage = ({ userRole = "accounting" }) => {
  const [billings, setBillings] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch billings from Supabase
  useEffect(() => {
    const fetchBillings = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("sales")
        .select(
          "id, customer_id, item_id, qty, total, status, user_id, created_at, distributor_id, accounting_id"
        );

      if (error) {
        console.error("Error fetching billings:", error.message);
      } else {
        setBillings(data);
      }
      setLoading(false);
    };

    fetchBillings();
  }, []);

  // ✅ Send Invoice (update accounting_id)
  const handleSendInvoice = async (saleId) => {
    const { data, error } = await supabase
      .from("sales")
      .update({ accounting_id: "INV-" + saleId }) // Generate invoice ID
      .eq("id", saleId)
      .select();

    if (error) {
      console.error("Error sending invoice:", error.message);
    } else {
      console.log("Invoice sent:", data);
      setBillings((prev) =>
        prev.map((bill) =>
          bill.id === saleId ? { ...bill, accounting_id: "INV-" + saleId } : bill
        )
      );
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
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
                  <th>Sale ID</th>
                  <th>Customer</th>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th className="last-column">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8">Loading...</td>
                  </tr>
                ) : billings.length > 0 ? (
                  billings.map((bill) => (
                    <tr key={bill.id}>
                      <td>{bill.id}</td>
                      <td>{bill.customer_id}</td>
                      <td>{bill.item_id}</td>
                      <td>{bill.qty}</td>
                      <td>${bill.total}</td>
                      <td>
                        <span className={`badge ${getStatusClass(bill.status)}`}>
                          {bill.status || "Pending"}
                        </span>
                      </td>
                      <td>{new Date(bill.created_at).toLocaleDateString()}</td>
                      <td>
                        {bill.accounting_id ? (
                          <span className="badge paid">Invoice Sent</span>
                        ) : (
                          <button
                            className="action-btn"
                            onClick={() => handleSendInvoice(bill.id)}
                          >
                            <LuSend />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8">No billing records found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AccountingPage;
