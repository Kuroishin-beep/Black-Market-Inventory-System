import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideBar";
import "../styles/CSR.css";
import "../styles/Shared.css";
import { FaUserCircle } from "react-icons/fa";
import { BsPencil, BsTrash } from "react-icons/bs";
import { supabase } from "../supabaseClient";

const CSRPage = () => {
  const [userRole, setUserRole] = useState("csr");
  const [user, setUser] = useState(null);

  const [orderRequests, setOrderRequests] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [items, setItems] = useState([]);
  const [brands, setBrands] = useState([]);
  const [supplierBrands, setSupplierBrands] = useState({}); // Map: supplier_id -> [brands]

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newRequest, setNewRequest] = useState({
    distributor_id: "",
    brand: "",
    item_id: "",
    qty: "",
  });

  // Fetch authenticated user
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        setError("User not authenticated.");
        setLoading(false);
        return;
      }
      setUser(data.user);
    };
    fetchUser();
  }, []);

  // Fetch distributors and items
  useEffect(() => {
    const fetchData = async () => {
      const { data: distData, error: distError } = await supabase.from("distributors").select("id, name").order("name");
      if (!distError && distData) setDistributors(distData);
  
      const { data: itemData, error: itemError } = await supabase.from("items").select("id, name, brand, model, price").order("name");
      if (!itemError && itemData) {
        setItems(itemData);
  
        const uniqueBrands = [...new Set(itemData.map(i => i.brand))];
        setBrands(uniqueBrands);
  
        const distributorBrandMap = {};
        itemData.forEach(i => {
          distData.forEach(d => {
            if (i.brand && d.name.toLowerCase().includes(i.brand.toLowerCase())) {
              if (!distributorBrandMap[d.id]) distributorBrandMap[d.id] = [];
              if (!distributorBrandMap[d.id].includes(i.brand)) distributorBrandMap[d.id].push(i.brand);
            }
          });
        });
        setSupplierBrands(distributorBrandMap);
      }
    };
  
    fetchData();
  }, []);
  // Fetch order requests for current user
  const fetchOrderRequests = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
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
          created_at
        `)
        .eq("created_by", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
  
      const enriched = data.map((p) => ({
        ...p,
        distributor: distributors.find(d => d.id === p.distributor_id)?.name || "",
        item: items.find(i => i.id === p.item_id) || {},
      }));
  
      setOrderRequests(enriched);
    } catch (err) {
      setError("Failed to fetch order requests.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    if (user && distributors.length && items.length) {
      fetchOrderRequests();
    }
  }, [user, distributors, items]);
  

  const handleInputChange = e => {
    const { name, value } = e.target;

    // If supplier changes, update brand automatically
    if (name === "distributor_id") {
      const supplierBrand = supplierBrands[value]?.[0] || "";
      setNewRequest(prev => ({
        ...prev,
        distributor_id: value,
        brand: supplierBrand,
        item_id: "",
      }));
    } else if (name === "brand") {
      // If brand manually changes, reset item
      setNewRequest(prev => ({ ...prev, brand: value, item_id: "" }));
    } else {
      setNewRequest(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateNewRequest = async e => {
    e.preventDefault();
    setError(null);

    const { distributor_id, item_id, qty } = newRequest;
    if (!distributor_id || !item_id || !qty) {
      setError("Please fill in all fields.");
      return;
    }

    const item = items.find(i => i.id === item_id);
    if (!item) {
      setError("Selected item not found.");
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
          created_at: new Date().toISOString(),
        },
      ]);
      if (error) throw error;

      setNewRequest({ distributor_id: "", brand: "", item_id: "", qty: "" });
      fetchOrderRequests();
    } catch (err) {
      setError("Failed to create order request.");
      console.error(err);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;
    try {
      const { error } = await supabase.from("purchases").delete().eq("id", id);
      if (error) throw error;
      setOrderRequests(prev => prev.filter(o => o.id !== id));
    } catch (err) {
      setError("Failed to delete request.");
      console.error(err);
    }
  };

  const handleEdit = order => {
    setNewRequest({
      distributor_id: order.distributor_id,
      brand: order.item.brand,
      item_id: order.item.id,
      qty: order.qty,  // was order.quantity
    });
  };
  
  const capitalize = s => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

  // Filter items based on selected brand
  const filteredItems = items.filter(i => i.brand === newRequest.brand);

  return (
    <div className="csr-container">
      <Sidebar userRole={userRole} />
      <div className="csr-content">
        <header className="csr-header">
          <FaUserCircle className="user-pfp" />
          <div className="user-details">
          <span className="user-name">{user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || "User"}</span>
            <span className="user-id">{user?.id?.substring(0, 8)}</span>
          </div>
        </header>

        <main className="csr-main">
          <h1 className="csr-title">Order Form</h1>

          <div className="csr-card">
            <form onSubmit={handleCreateNewRequest}>
            <div className="form-group">
                <label>Distributor</label>
                <select
                  className="form-select"
                  name="distributor_id"
                  value={newRequest.distributor_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Distributor</option>
                  {distributors.map(dist => (
                    <option key={dist.id} value={dist.id}>
                      {dist.name}
                    </option>
                  ))}
                </select>
              </div>


              <div className="form-group">
                <label>Brand</label>
                <select
                  className="form-select"
                  name="brand"
                  value={newRequest.brand}
                  onChange={handleInputChange}
                  required
                  disabled={!newRequest.distributor_id}
                >
                  <option value="">Select Brand</option>
                  {supplierBrands[newRequest.distributor_id]?.map(b => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group product-group">
                  <label>Product/s</label>
                  <select
                    className="form-select"
                    name="item_id"
                    value={newRequest.item_id}
                    onChange={handleInputChange}
                    required
                    disabled={!newRequest.brand}
                  >
                    <option value="">Select Product</option>
                    {filteredItems.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.brand} {item.name} ({item.model})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group qty-group">
                  <label>Qty</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 1458"
                    name="qty"
                    value={newRequest.qty}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="add-btn">
                + Add More Product
              </button>
            </form>
          </div>

          {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

          <h2 style={{ marginTop: "30px" }}>Order Requests</h2>

          {loading ? (
            <p>Loading order requests...</p>
          ) : orderRequests.length === 0 ? (
            <p>No order requests found.</p>
          ) : (
            <table className="products-table" style={{ width: "100%", marginTop: "10px" }}>
              <thead>
                <tr>
                  <th>Item Info</th>
                  <th>Distributor</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orderRequests.map(order => (
                  <tr key={order.id}>
                    <td>{order.item?.name} ({order.item?.model})</td>
                    <td>{order.distributor}</td>
                    <td>{order.qty}</td>
                    <td>${parseFloat(order.total).toFixed(2)}</td>
                    <td>{capitalize(order.status)}</td>
                    <td>
                      <button className="action-btn" onClick={() => handleEdit(order)} title="Edit">
                        <BsPencil />
                      </button>
                      <button className="action-btn delete-btn" onClick={() => handleDelete(order.id)} title="Delete">
                        <BsTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </main>
      </div>
    </div>
  );
};

export default CSRPage;
