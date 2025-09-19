import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideBar";
import "../styles/Orders.css";
import "../styles/Shared.css";
import YellowAnimatedLoader from "../components/Loading";
import { FaUserCircle } from "react-icons/fa";
import { CiFilter } from "react-icons/ci";
import { supabase } from "../supabaseClient";

const OrdersPage = () => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [salesOrders, setSalesOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- Fetch authenticated user and their role ---
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error || !user) {
          setError("User not authenticated.");
          setLoadingUserRole(false);
          return;
        }

        setUser(user);

        // Fetch employee from employees table
        const { data: employeeData, error: empError } = await supabase
          .from("employees")
          .select(
            `
              id,
              full_name,
              email,
              role_id,
              roles:roles(id, role, label)
            `
          )
          .eq("auth_user_id", user.id) // ✅ safer if your employees table uses auth_user_id
          .single();

        if (empError || !employeeData) {
          const metadataRole = user.user_metadata?.role;
          if (!metadataRole) {
            console.warn(
              "Employee record not found and no metadata role found. Falling back to default 'warehouse'."
            );
          }
          setUserRole(metadataRole || "warehouse");
        } else {
          setUserRole(employeeData.roles.role);
        }
      } catch (err) {
        console.error("Error fetching employee role:", err);
        const metadataRole = user?.user_metadata?.role;
        setUserRole(metadataRole || "warehouse");
      } finally {
        setLoadingUserRole(false);
      }
    };

    fetchUserRole();
  }, []);

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
        payment_status,
        created_at,
        customers (company_name, contact_person),
        distributors (name),
        items (name, model, price),
        csr:employees!sales_csr_id_fkey (full_name, email),
        teamlead:employees!sales_teamlead_id_fkey (full_name, email),
        accounting:employees!sales_accounting_id_fkey (full_name, email)
      `
      )
      .eq("status", "approved")
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
      case "pending":
        return "pending";
      case "invoiced":
        return "invoiced";
      default:
        return "pending";
    }
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "pending";
      case "approved":
        return "approved";
      case "denied":
        return "denied";
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
        <div className="loader-wrapper">
          <YellowAnimatedLoader />
        </div>
      </div>
    );
  }
  const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
  return (
    <div className="orders-container">
      <Sidebar userRole={userRole} />

      <div className="orders-content">
        {/* Header */}
        <header className="orders-header">
          <FaUserCircle className="user-pfp" />
          <div className="user-details">
            <span className="user-name">
              {user?.user_metadata?.full_name ||
                user?.user_metadata?.name ||
                user?.email ||
                "User"}
            </span>

            <span className="user-role" style={{ fontSize: 12, color: "#666" }}>
              Role: {userRole}
            </span>
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
                  <th className="last-column">Payment Status</th>
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
                            order.payment_status
                          )}`}
                        >
                          {capitalize(order.payment_status)}
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
