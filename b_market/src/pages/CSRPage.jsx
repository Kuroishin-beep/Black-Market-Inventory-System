import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideBar";
import "../styles/CSR.css";
import "../styles/Shared.css";
import { FaUserCircle } from "react-icons/fa";
import { BsCheckSquare, BsXSquare, BsPencil, BsTrash } from "react-icons/bs";
import { supabase } from "../supabaseClient";

const CSRPage = () => {
  const [user, setUser] = useState(null);
  const [orderRequests, setOrderRequests] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [newRequest, setNewRequest] = useState({
    distributor_id: "",
    item_id: "",
    qty: "",
  });

  // For editing
  const [editRequestId, setEditRequestId] = useState(null);
  const [editQty, setEditQty] = useState("");

  // Fetch authenticated user
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        setError("User not authenticated.");
        setLoading(false);
        return;
      }
      setUser(user);
    };
    fetchUser();
  }, []);

  // Fetch distributors and items
  useEffect(() => {
    const fetchData = async () => {
      const { data: distributorsData, error: distError } = await supabase
        .from("distributors")
        .select("*")
        .order("name");

      if (distError) console.error(distError);
      else setDistributors(distributorsData || []);

      const { data: itemsData, error: itemsError } = await supabase
        .from("items")
        .select("*")
        .order("name");

      if (itemsError) console.error(itemsError);
      else setItems(itemsData || []);
    };
    fetchData();
  }, []);

  // Filter products by distributor
  useEffect(() => {
    if (newRequest.distributor_id) {
      setFilteredItems(items.filter(i => i.distributor_id === newRequest.distributor_id));
    } else {
      setFilteredItems([]);
    }
  }, [newRequest.distributor_id, items]);

  // Fetch order requests
  const fetchOrderRequests = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("purchases")
        .select(`
          id,
          distributor_id,
          item_id,
          qty,
          total,
          status,
          created_at,
          items: item_id (name, model, price, stock_qty),
          distributors: distributor_id (name)
        `)
        .eq("created_by", user.id)
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
    setNewRequest(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateNewRequest = async (e) => {
    e.preventDefault();
    setError(null);
    const { distributor_id, item_id, qty } = newRequest;
    if (!distributor_id || !item_id || !qty) {
      setError("Please fill all fields.");
      return;
    }

    const item = items.find(i => i.id === item_id);
    if (!item) {
      setError("Selected product not found.");
      return;
    }

    if (qty > item.stock_qty) {
      setError(`Cannot order more than ${item.stock_qty} in stock.`);
      return;
    }

    const total = parseFloat(item.price) * parseInt(qty, 10);

    try {
      const { error } = await supabase.from("purchases").insert([
        {
          distributor_id,
          item_id,
          qty: parseInt(qty, 10),
          total,
          status: "pending",
          created_by: user.id,
          created_at: new Date().toISOString()
        },
      ]);

      if (error) throw error;

      // Reduce stock
      await supabase.from("items").update({ stock_qty: item.stock_qty - parseInt(qty, 10) }).eq("id", item.id);

      setNewRequest({ distributor_id: "", item_id: "", qty: "" });
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
      await supabase.from("purchases").delete().eq("id", order.id);
      // Restore stock
      await supabase.from("items").update({ stock_qty: order.items.stock_qty + order.qty }).eq("id", order.item_id);
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
    const diff = editQty - order.qty;
    if (diff > order.items.stock_qty) {
      setError(`Cannot increase by ${diff}, only ${order.items.stock_qty} available in stock.`);
      return;
    }

    try {
      await supabase.from("purchases").update({ qty: parseInt(editQty, 10), total: parseFloat(editQty * order.items.price) }).eq("id", order.id);
      await supabase.from("items").update({ stock_qty: order.items.stock_qty - diff }).eq("id", order.item_id);
      setEditRequestId(null);
      fetchOrderRequests();
    } catch (err) {
      console.error(err);
      setError("Failed to update order.");
    }
  };

  const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

  return (
    <div className="csr-container">
      <Sidebar userRole="csr" />
      <div className="csr-content">
        <header className="csr-header">
          <FaUserCircle className="user-pfp" />
          <div className="user-details">
            <span className="user-name">{user?.email || "User"}</span>
            <span className="user-id">{user?.id?.substring(0, 8)}</span>
          </div>
        </header>

        <main className="csr-main">
          <h1 className="csr-title">Order Form</h1>

          <div className="csr-card">
            <form onSubmit={handleCreateNewRequest}>
              <div className="form-group">
                <label>Supplier</label>
                <select className="form-select" name="distributor_id" value={newRequest.distributor_id} onChange={handleInputChange} required>
                  <option value="">Select Supplier</option>
                  {distributors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group product-group">
                  <label>Product/s</label>
                  <select className="form-select" name="item_id" value={newRequest.item_id} onChange={handleInputChange} required>
                    <option value="">Select Product</option>
                    {filteredItems.map(i => <option key={i.id} value={i.id}>{i.brand} {i.name} ({i.model}) - Stock: {i.stock_qty}</option>)}
                  </select>
                </div>

                <div className="form-group qty-group">
                  <label>Qty</label>
                  <input type="number" className="form-input" name="qty" value={newRequest.qty} onChange={handleInputChange} min="1" required />
                </div>
              </div>

              <button type="submit" className="add-btn">+ Add Product</button>
            </form>
          </div>

          {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

          <h2 style={{ marginTop: "30px" }}>Order Requests</h2>

          {loading ? <p>Loading...</p> :
            orderRequests.length === 0 ? <p>No orders yet.</p> :
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Item Info</th>
                    <th>Supplier</th>
                    <th>Qty</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orderRequests.map(order => (
                    <tr key={order.id}>
                      <td>{order.items.name} {order.items.model}</td>
                      <td>{order.distributors.name}</td>
                      <td>
                        {editRequestId === order.id ? (
                          <input type="number" value={editQty} min="1" onChange={(e) => setEditQty(e.target.value)} />
                        ) : order.qty}
                      </td>
                      <td>${order.total.toFixed(2)}</td>
                      <td>{capitalize(order.status)}</td>
                      <td>
                        {editRequestId === order.id ? (
                          <>
                            <button onClick={() => handleSaveEdit(order)}>Save</button>
                            <button onClick={() => setEditRequestId(null)}>Cancel</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => handleEditOrder(order)}><BsPencil /></button>
                            <button onClick={() => handleDeleteRequest(order)}><BsTrash /></button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          }
        </main>
      </div>
    </div>
  );
};

export default CSRPage;
