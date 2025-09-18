import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideBar";
import "../styles/Warehouse.css";
import { FaUserCircle } from "react-icons/fa";
import { supabase } from "../supabaseClient";

const WarehousePage = ({ userRole = "warehouse" }) => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) console.error(error);
      setUser(user);
    };
    fetchUser();
  }, []);

  // Fetch products with latest log
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("warehouse_logs")
        .select(`
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
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Keep only the latest log per item
      const latestLogs = {};
      data.forEach(log => {
        if (!latestLogs[log.item_id]) latestLogs[log.item_id] = log;
      });

      setProducts(Object.values(latestLogs));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filtered products
  const filteredProducts = filterStatus
    ? products.filter(p => (p.status || "").toLowerCase() === filterStatus.toLowerCase())
    : products;

  return (
    <div className="warehouse-container">
      <Sidebar userRole={userRole} />
      <div className="warehouse-content">
        <header className="warehouse-header">
          <FaUserCircle className="user-pfp" />
          <div className="user-details">
            <span className="user-name">{user?.user_metadata?.full_name || user?.email || "User"}</span>
            <span className="user-id">{user?.id?.substring(0, 8)}</span>
            <span className="user-role" style={{ fontSize: 12, color: "#666" }}>Role: {userRole}</span>
          </div>
        </header>

        <main className="warehouse-main">
          <div className="warehouse-main__header">
            <h1 className="warehouse-title">Products</h1>
            <div className="warehouse-main__header--buttons">
              <select
                className="warehouse-main__filter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All</option>
                <option value="restock">Restock</option>
                <option value="sold">Sold</option>
                <option value="damaged">Damaged</option>
                <option value="returned">Returned</option>
                <option value="adjustment">Adjustment</option>
              </select>
            </div>
          </div>

          <div className="warehouse-table__main">
            {loading ? <p>Loading...</p> :
              <table className="warehouse-table">
                <thead>
                  <tr>
                    <th>Item Information</th>
                    <th>Product ID</th>
                    <th>Stock</th>
                    <th>Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((log) => (
                    <tr key={log.id}>
                      <td>{log.items?.name || "N/A"} {log.items?.model || ""}</td>
                      <td>{log.item_id?.substring(0, 8) || "N/A"}</td>
                      <td>{log.items?.stock_qty ?? "N/A"}</td>
                      <td>${log.items?.price ?? "0.00"}</td>
                      <td>{log.status || "N/A"}</td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center" }}>No products found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            }
          </div>
        </main>
      </div>
    </div>
  );
};

export default WarehousePage;
