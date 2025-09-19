// src/pages/TeamLeaderPage.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideBar";
import "../styles/TeamLeader.css";
import { FaUserCircle } from "react-icons/fa";
import { CiFilter } from "react-icons/ci";
import { BsCheckSquare, BsXSquare } from "react-icons/bs";
import { supabase } from "../supabaseClient";

const TeamLeaderPage = () => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [orderRequests, setOrderRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Fetch CSR Orders (pending approval, teamlead_id is NULL)
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("sales")
        .select(
          `
          id,
          qty,
          total,
          status,
          stage,
          created_at,
          customers:customer_id (company_name),
          items:item_id (name, model),
          distributors:distributor_id (name)
        `
        )
        .eq("status", "pending")
        .eq("stage", "csr")
        .is("teamlead_id", null)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrderRequests(data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch user (employee) and orders on mount
  useEffect(() => {
    const fetchUserAndOrders = async () => {
      try {
        // 1. Get logged-in auth user
        const {
          data: { user: authUser },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
          console.error("Auth error:", authError);
          setError("Authentication failed.");
          return;
        }

        if (!authUser) {
          setError("No authenticated user found.");
          return;
        }

        console.log("[DEBUG] Auth User ID:", authUser.id);

        // 2. Fetch employee row by ID (must match auth.users.id)
        const { data: employee, error: empError } = await supabase
          .from("employees")
          .select("id, full_name, email")
          .eq("id", authUser.id) // ✅ fixed: match employees.id to auth.users.id
          .single();

        if (empError || !employee) {
          console.warn(
            "[WARN] No employee record found for auth user. Check if employees.id matches auth.users.id"
          );
          setError("Employee record not found.");
          return;
        }

        console.log("[DEBUG] Employee record:", employee);
        setUser(employee);

        // 3. Load orders right after user
        fetchOrders();
      } catch (err) {
        console.error("Unexpected error fetching user/employee:", err);
        setError("Failed to load user data.");
      }
    };

    fetchUserAndOrders();
  }, []);

  // Approve order → moves to Procurement
  const handleApprove = async (id) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from("sales")
        .update({
          status: "approved",
          stage: "csr",
          teamlead_id: user.id, // employee.id
        })
        .eq("id", id);

      if (error) throw error;
      fetchOrders();
    } catch (err) {
      console.error("Approve failed:", err);
    }
  };

  // Deny order → stays in CSR stage
  const handleDeny = async (id) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from("sales")
        .update({
          status: "denied",
          stage: "csr",
          teamlead_id: user.id,
        })
        .eq("id", id);

      if (error) throw error;
      fetchOrders();
    } catch (err) {
      console.error("Deny failed:", err);
    }
  };

  const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

  return (
    <div className="team-container">
      <Sidebar userRole={userRole} />
      <div className="team-content">
        <header className="team-header">
          <FaUserCircle className="user-pfp" />
          <div className="user-details">
            <span className="user-name">
              {user?.full_name || user?.email || "User"}
            </span>

            <span className="user-role" style={{ fontSize: 12, color: "#666" }}>
              Role: {userRole}
            </span>
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
            {error ? (
              <p style={{ color: "red", textAlign: "center" }}>{error}</p>
            ) : loading ? (
              <p>Loading orders...</p>
            ) : orderRequests.length === 0 ? (
              <p>No pending requests.</p>
            ) : (
              <table className="team-table">
                <thead>
                  <tr>
                    <th>Item Information</th>
                    <th>Customer</th>
                    <th>Distributor</th>
                    <th>Qty</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th className="last-column">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orderRequests.map((order) => (
                    <tr key={order.id}>
                      <td>
                        {order.items?.name} {order.items?.model}
                      </td>
                      <td>{order.customers?.company_name || "N/A"}</td>
                      <td>{order.distributors?.name || "N/A"}</td>
                      <td>{order.qty}</td>
                      <td>${Number(order.total || 0).toFixed(2)}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            order.status === "approved"
                              ? "approved"
                              : order.status === "denied"
                              ? "denied"
                              : "pending"
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
                            aria-label={`Approve order ${order.id}`}
                            onClick={() => {
                              handleApprove(order.id);
                              console.log("approved");
                            }}
                          >
                            <BsCheckSquare className="action-icon approve" />
                          </button>
                          <button
                            type="button"
                            className="icon-btn denied"
                            aria-label={`Deny order ${order.id}`}
                            onClick={() => {
                              handleDeny(order.id);
                              console.log("denied");
                            }}
                          >
                            <BsXSquare className="action-icon reject" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeamLeaderPage;
