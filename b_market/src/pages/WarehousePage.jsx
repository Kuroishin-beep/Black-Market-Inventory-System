import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideBar";
import "../styles/Warehouse.css";
import { FaUserCircle } from "react-icons/fa";
import { supabase } from "../supabaseClient";

const WarehousePage = ({ userRole = "warehouse" }) => {
  const [user, setUser] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) console.error(error);
      setUser(user);
    };
    fetchUser();
  }, []);

  // Fetch purchases from purchases table
  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("purchases")
        .select(
          `
          id,
          item_id,
          qty,
          status,
          created_at,
          items (
            id,
            name,
            model,
            price,
            stock_qty
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPurchases(data || []);
    } catch (err) {
      console.error("Error fetching purchases:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  // Filtered purchases
  const filteredPurchases = filterStatus
    ? purchases.filter(
        (p) => (p.status || "").toLowerCase() === filterStatus.toLowerCase()
      )
    : purchases;

  return (
    <div className="warehouse-container">
      <Sidebar userRole={userRole} />
      <div className="warehouse-content">
        <header className="warehouse-header">
          <FaUserCircle className="user-pfp" />
          <div className="user-details">
            <span className="user-name">
              {user?.user_metadata?.full_name || user?.email || "User"}
            </span>
            <span className="user-id">{user?.id?.substring(0, 8)}</span>
            <span className="user-role" style={{ fontSize: 12, color: "#666" }}>
              Role: {userRole}
            </span>
          </div>
        </header>

        <main className="warehouse-main">
          <div className="warehouse-main__header">
            <h1 className="warehouse-title">Purchases</h1>
            <div className="warehouse-main__header--buttons">
              <select
                className="warehouse-main__filter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="received">Received</option>
              </select>
            </div>
          </div>

          <div className="warehouse-table__main">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <table className="warehouse-table">
                <thead>
                  <tr>
                    <th>Item Information</th>
                    <th>Purchase ID</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPurchases.map((purchase) => (
                    <tr key={purchase.id}>
                      <td>
                        {purchase.items?.name || "N/A"}{" "}
                        {purchase.items?.model || ""}
                      </td>
                      <td>{purchase.id?.substring(0, 8) || "N/A"}</td>
                      <td>{purchase.qty ?? "N/A"}</td>
                      <td>${purchase.items?.price ?? "0.00"}</td>
                      {/* className + inline style to guarantee left alignment */}
                      <td
                        className="status-cell"
                        style={{ textAlign: "left" }}
                      >
                        {purchase.status || "N/A"}
                      </td>
                    </tr>
                  ))}
                  {filteredPurchases.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center" }}>
                        No purchases found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default WarehousePage;
