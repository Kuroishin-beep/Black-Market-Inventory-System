import React, { useEffect, useState } from "react";
import Sidebar from "../components/SideBar";
import "../styles/Accounting.css";
import { LuSend } from "react-icons/lu";
import { FaUserCircle } from "react-icons/fa";
import { CiFilter } from "react-icons/ci";
import { supabase } from "../supabaseClient";

const AccountingPage = ({ user }) => {
  const userRole = user?.role || "accounting";
  const [billings, setBillings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); 

  useEffect(() => {
    fetchBillings();
  }, []);

  const fetchBillings = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("sales")
      .select(`
        id,
        distributor_id,
        customer_id,
        item_id,
        qty,
        total,
        status,
        payment_status,
        created_at,
        accounting_id,
        customer:customers(id, company_name, contact_person),
        item:items(id, name, price),
        distributor:distributors(id, name)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching billings:", error.message);
    } else {
      setBillings(data);
    }

    setLoading(false);
  };

  const handleSendInvoice = async (saleId) => {
    const { error } = await supabase
      .from("sales")
      .update({
        accounting_id: user?.id || null,
        payment_status: "invoiced",
      })
      .eq("id", saleId);

    if (error) {
      console.error("Error sending invoice:", error.message);
    } else {
      setBillings((prev) =>
        prev.map((bill) =>
          bill.id === saleId
            ? { ...bill, accounting_id: user?.id, payment_status: "invoiced" }
            : bill
        )
      );
    }
  };

  const handleDeleteBilling = async (saleId) => {
    if (!window.confirm("Are you sure you want to delete this billing?")) return;
    const { error } = await supabase.from("sales").delete().eq("id", saleId);
    if (error) console.error("Error deleting billing:", error.message);
    else setBillings((prev) => prev.filter((bill) => bill.id !== saleId));
  };

  const getPaymentClass = (paymentStatus) => {
    switch (paymentStatus?.toLowerCase()) {
      case "invoiced":
        return "paid";
      case "pending":
        return "pending";
      case "overdue":
        return "overdue";
      default:
        return "pending";
    }
  };

  // Filter billings based on selected filter
  const filteredBillings = billings.filter((bill) => {
    if (filter === "pending") return bill.payment_status === "pending";
    if (filter === "invoiced") return bill.payment_status === "invoiced";
    return true;
  });

  return (
    <div className="accounting-container">
      <Sidebar userRole={userRole} />

      <div className="accounting-content">
        <header className="accounting-header">
          <FaUserCircle className="user-pfp" />
          <div className="user-details">
            <span className="user-name">
              {user?.fullName || user?.email || "User"}
            </span>
            <span className="user-role" style={{ fontSize: 12, color: "#666" }}>
              {userRole}
            </span>
          </div>
        </header>

        <main className="accounting-main">
          <div className="accounting-main__header">
            <h1 className="accounting-title">Billing</h1>
            <div className="accounting-main__header--buttons">
              {/* ✅ Dropdown filter */}
              <select
                className="accounting-main__filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="invoiced">Invoiced</option>
              </select>
            </div>
          </div>

          {/*Table */}
          <div className="accounting-table__main">
            <table className="accounting-table">
              <thead>
                <tr>
                  <th>Sale ID</th>
                  <th>Distributor</th>
                  <th>Customer</th>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th>Payment Status</th>
                  <th>Created</th>
                  <th className="last-column">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9">Loading...</td>
                  </tr>
                ) : filteredBillings.length > 0 ? (
                  filteredBillings.map((bill) => (
                    <tr key={bill.id}>
                      <td>{bill.id}</td>
                      <td>{bill.distributor?.name || bill.distributor_id}</td>
                      <td>{bill.customer?.company_name || bill.customer_id}</td>
                      <td>{bill.item?.name || bill.item_id}</td>
                      <td>{bill.qty}</td>
                      <td>${bill.total}</td>
                      <td>
                        <span
                          className={`badge ${getPaymentClass(
                            bill.payment_status
                          )}`}
                        >
                          {bill.payment_status || "Pending"}
                        </span>
                      </td>
                      <td>{new Date(bill.created_at).toLocaleDateString()}</td>
                      <td>
                        {bill.payment_status === "invoiced" ? (
                          <span className="badge paid">Invoice Sent</span>
                        ) : (
                          <button
                            className="action-btn"
                            onClick={() => handleSendInvoice(bill.id)}
                          >
                            <LuSend />
                          </button>
                        )}
                        <button
                          className="action-btn delete"
                          onClick={() => handleDeleteBilling(bill.id)}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9">No billing records found</td>
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
