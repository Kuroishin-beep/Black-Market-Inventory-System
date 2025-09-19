import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideBar";
import "../styles/Orders.css";
import "../styles/Shared.css";
import { FaUserCircle } from "react-icons/fa";
import { CiFilter } from "react-icons/ci";
import { supabase } from "../supabaseClient";

const OrdersPage = () => {
  const [userRole, setUserRole] = useState("teamlead");
  const [salesOrders, setSalesOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchSalesOrders();
  }, [currentPage]);

  // Fetch sales orders with all relationships
  const fetchSalesOrders = async () => {
    setLoading(true);
    setError(null);

    const from = (currentPage - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;

    const { data, error } = await supabase
      .from("sales")
      .select(
        `
        id,
        qty,
        total,
        status,
        created_at,
        customers (company_name, contact_person),
        distributors (name),
        items (name, model, price),
        csr:employees!sales_csr_id_fkey (full_name, email),
        teamlead:employees!sales_teamlead_id_fkey (full_name, email),
        accounting:employees!sales_accounting_id_fkey (full_name, email)
      `
      )
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Error fetching sales orders:", error);
      setError("Failed to fetch sales orders.");
    } else {
      setSalesOrders(data || []);
    }
    setLoading(false);
  };

  // Update payment/order status
  const handlePaymentStatusChange = async (orderId, newStatus) => {
    setError(null);
    const { error } = await supabase
      .from("sales")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      console.error("Error updating sales order status:", error);
      setError("Failed to update order status.");
    } else {
      fetchSalesOrders();
    }
  };

  const getPaymentStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "paid";
      case "pending":
        return "pending";
      case "approved":
        return "approved";
      case "invoiced":
        return "overdue";
      default:
        return "pending";
    }
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="orders-container">
        <Sidebar userRole={userRole} />
        <div className="orders-content">
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

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
            <h1 className="orders-title">Sales Orders</h1>
            <div className="orders-main__header--buttons">
              <button className="orders-main__filter">
                <CiFilter className="orders-icon filter" />
                Filter
              </button>
            </div>
          </div>

          {error && (
            <p style={{ color: "red", textAlign: "center" }}>{error}</p>
          )}

          {/* Orders Table */}
          <div className="orders-table__main">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Distributor</th>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th>CSR</th>
                  <th>Team Lead</th>
                  <th>Accounting</th>
                  <th className="last-column">Status</th>
                </tr>
              </thead>
              <tbody>
                {salesOrders.length === 0 ? (
                  <tr>
                    <td colSpan="11" style={{ textAlign: "center" }}>
                      No sales orders found.
                    </td>
                  </tr>
                ) : (
                  salesOrders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id.substring(0, 8)}</td>
                      <td>{new Date(order.created_at).toLocaleDateString()}</td>
                      <td>{order.customers?.company_name || "N/A"}</td>
                      <td>{order.distributors?.name || "N/A"}</td>
                      <td>
                        {order.items?.name || "N/A"} (
                        {order.items?.model || "N/A"})
                      </td>
                      <td>{order.qty}</td>
                      <td>${parseFloat(order.total).toFixed(2)}</td>
                      <td>{order.csr?.full_name || "N/A"}</td>
                      <td>{order.teamlead?.full_name || "N/A"}</td>
                      <td>{order.accounting?.full_name || "N/A"}</td>
                      <td className="last-column">
                        <span
                          className={`badge ${getPaymentStatusClass(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                        {/* <select
                          value={order.status}
                          onChange={(e) =>
                            handlePaymentStatusChange(order.id, e.target.value)
                          }
                          style={{
                            marginLeft: "10px",
                            padding: "5px",
                            borderRadius: "4px",
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="invoiced">Invoiced</option>
                          <option value="completed">Completed</option>
                        </select> */}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                <span>←</span> Previous
              </button>

              <div className="page-numbers">
                <span className="page-number">
                  {String(currentPage).padStart(2, "0")}
                </span>
              </div>

              <button className="pagination-btn" onClick={handleNextPage}>
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
