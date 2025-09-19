import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideBar";
import "../styles/CSR.css";
import "../styles/Shared.css";
import { FaUserCircle } from "react-icons/fa";
import { BsPencil, BsTrash } from "react-icons/bs";
import { supabase } from "../supabaseClient";

const CSRPage = () => {
  const [user, setUser] = useState(null);
  const [orderRequests, setOrderRequests] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [items, setItems] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState("");

  // Form state
  const [newRequest, setNewRequest] = useState({
    customer_id: "",
    distributor_id: "",
    item_id: "",
    qty: "",
  });

  // For editing order requests
  const [editRequestId, setEditRequestId] = useState(null);
  const [editQty, setEditQty] = useState("");

  // For editing
  useEffect(() => {
    const fetchCustomers = async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("id, company_name, contact_person, email")
        .order("company_name", { ascending: true });

      if (error) {
        console.error("Error fetching customers:", error.message);
      } else {
        console.log("Fetched customers:", data); // 🟢 Debug log
        setCustomers(data || []);
      }
    };

    fetchCustomers();
  }, []);
  // Fetch authenticated user
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) {
        setError("User not authenticated.");
        setLoading(false);
        return;
      }
      setUser(user);
      setUserRole("csr");
    };
    fetchUser();
  }, []);

  // Fetch distributors, items, customers
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch distributors
        const { data: distributorsData, error: distError } = await supabase
          .from("distributors")
          .select("id, name")
          .order("name");

        if (distError) throw distError;
        setDistributors(distributorsData || []);

        // Fetch items
        const { data: itemsData, error: itemsError } = await supabase
          .from("items")
          .select("id, brand, name, model, stock_qty, price")
          .order("name");

        if (itemsError) throw itemsError;
        setItems(itemsData || []);

        // Fetch customers
        const { data: customersData, error: custError } = await supabase
          .from("customers")
          .select("id, company_name, contact_person, email")
          .order("company_name");

        if (custError) throw custError;
        console.log("✅ Customers fetched:", customersData); // 👈 Debug log
        setCustomers(customersData || []);
      } catch (err) {
        console.error("❌ Error fetching data:", err.message);
      }
    };

    fetchData();
  }, []);

  // ✅ Show all items
  useEffect(() => {
    setFilteredItems(items.length > 0 ? items : []);
  }, [items]);

  // Fetch order requests with joins
  const fetchOrderRequests = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("sales")
        .select(
          `
          id,
          distributor_id,
          customer_id,
          item_id,
          qty,
          total,
          status,
          created_at,
          items: item_id (name, model, price),
          distributors: distributor_id (name),
          customers: customer_id (company_name, contact_person)
        `
        )
        .eq("csr_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrderRequests(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderRequests();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRequest((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateNewRequest = async (e) => {
    e.preventDefault();
    setError(null);

    const { distributor_id, item_id, qty, customer_id } = newRequest;
    if (!distributor_id || !item_id || !qty || !customer_id) {
      setError("Please fill all fields.");
      return;
    }

    const item = items.find((i) => i.id === item_id);
    if (!item) {
      setError("Selected product not found.");
      return;
    }

    const total = parseFloat(item.price) * parseInt(qty, 10);

    try {
      const { error } = await supabase.from("sales").insert([
        {
          distributor_id,
          customer_id,
          item_id,
          qty: parseInt(qty, 10),
          total: parseFloat(total).toFixed(2),
          status: "pending",
          csr_id: user.id,
          stage: "csr",
        },
      ]);

      if (error) throw error;

      setNewRequest({
        customer_id: "",
        distributor_id: "",
        item_id: "",
        qty: "",
      });
      fetchOrderRequests();
    } catch (err) {
      console.error(err);
      setError("Failed to create order.");
    }
  };

  // Delete order request
  const handleDeleteRequest = async (order) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await supabase.from("sales").delete().eq("id", order.id);
      fetchOrderRequests();
    } catch (err) {
      console.error(err);
      alert("Failed to delete order.");
    }
  };

  // Edit order qty
  const handleEditOrder = (order) => {
    setEditRequestId(order.id);
    setEditQty(order.qty);
  };

  const handleSaveEdit = async (order) => {
    try {
      await supabase
        .from("sales")
        .update({
          qty: parseInt(editQty, 10),
          total: parseFloat(editQty * order.items.price),
        })
        .eq("id", order.id);

      setEditRequestId(null);
      fetchOrderRequests();
    } catch (err) {
      console.error(err);
      setError("Failed to update order.");
    }
  };

  const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

  return (
    <div className="csr-container">
      <Sidebar userRole="csr" />
      <div className="csr-content">
        <header className="csr-header">
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

        <main className="csr-main">
          <h1 className="csr-title">Order Form</h1>

          <div className="csr-card">
            <form onSubmit={handleCreateNewRequest}>
              {/* Customer select */}
              <div className="form-group">
                <label>Customer</label>
                <select
                  className="form-select"
                  name="customer_id"
                  value={newRequest.customer_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Customer</option>
                  {customers.length === 0 ? (
                    <option disabled>No customers found</option>
                  ) : (
                    customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.company_name} ({c.contact_person})
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Distributor select */}
              <div className="form-group">
                <label>Supplier</label>
                <select
                  className="form-select"
                  name="distributor_id"
                  value={newRequest.distributor_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Supplier</option>
                  {distributors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Item + Qty */}
              <div className="form-row">
                <div className="form-group product-group">
                  <label>Product/s</label>
                  <select
                    className="form-select"
                    name="item_id"
                    value={newRequest.item_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Product</option>
                    {filteredItems.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.brand} {i.name} ({i.model}) - Stock: {i.stock_qty}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group qty-group">
                  <label>Qty</label>
                  <input
                    type="number"
                    className="form-input"
                    name="qty"
                    value={newRequest.qty}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="add-btn">
                + Add Product
              </button>
            </form>
          </div>

          {error && (
            <p style={{ color: "red", textAlign: "center" }}>{error}</p>
          )}

          <h1 className="csr-title" style={{ marginTop: "30px" }}>
            Order Requests
          </h1>

          {loading ? (
            <p>Loading...</p>
          ) : orderRequests.length === 0 ? (
            <p>No orders yet.</p>
          ) : (
            <div className="csr-table__main">
              <table className="csr-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Item Info</th>
                    <th>Supplier</th>
                    <th>Qty</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th className="last-column">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orderRequests.map((order) => (
                    <tr key={order.id}>
                      <td>
                        {order.customers?.company_name} (
                        {order.customers?.contact_person})
                      </td>
                      <td>
                        {order.items.name} {order.items.model}
                      </td>
                      <td>{order.distributors.name}</td>
                      <td>
                        {editRequestId === order.id ? (
                          <input
                            type="number"
                            value={editQty}
                            min="1"
                            onChange={(e) => setEditQty(e.target.value)}
                          />
                        ) : (
                          order.qty
                        )}
                      </td>
                      <td>${order.total.toFixed(2)}</td>
                      <td className={`status-badge ${order.status}`}>
                        {capitalize(order.status)}
                      </td>
                      <td>
                        {editRequestId === order.id ? (
                          <>
                            <button
                              className="action-btn save-btn"
                              onClick={() => handleSaveEdit(order)}
                            >
                              Save
                            </button>
                            <button
                              className="action-btn cancel-btn"
                              onClick={() => setEditRequestId(null)}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="icon-btn"
                              onClick={() => handleEditOrder(order)}
                            >
                              <BsPencil />
                            </button>
                            <button
                              className="icon-btn"
                              onClick={() => handleDeleteRequest(order)}
                            >
                              <BsTrash />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CSRPage;
