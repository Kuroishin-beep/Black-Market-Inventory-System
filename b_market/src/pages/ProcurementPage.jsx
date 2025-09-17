import Sidebar from "../components/SideBar";
import "../styles/Procurement.css";
import { FaUserCircle, FaEdit, FaTrash } from "react-icons/fa";
import { FaMinus } from "react-icons/fa6";
import { PiPlus } from "react-icons/pi";
import placeholder from "../assets/img-placeholder.png";
import { supabase } from "../supabaseClient";
import { useEffect, useState } from "react";


const ProcurementPage = ({ userRole = "procurement" }) => {
  const [items, setItems] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showEditItemModal, setShowEditItemModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const [currentItem, setCurrentItem] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    model: "",
    price: "",
    stock_qty: "",
    category: "",
  });

  const [purchaseData, setPurchaseData] = useState({
    itemId: "",
    distributorId: "",
    qty: 1,
    total: 0,
  });

  useEffect(() => {
    fetchItems();
    fetchDistributors();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("items").select("*");
    if (error) {
      console.error("Error fetching items:", error);
      setError("Failed to fetch items.");
    } else {
      setItems(data);
    }
    setLoading(false);
  };

  const fetchDistributors = async () => {
    const { data, error } = await supabase.from("distributors").select("id, name");
    if (error) {
      console.error("Error fetching distributors:", error);
    } else {
      setDistributors(data);
    }
  };

  const handleItemFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePurchaseFormChange = (e) => {
    const { name, value } = e.target;
    setPurchaseData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddItemSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const { name, brand, model, price, stock_qty, category } = formData;
    if (!name || !brand || !model || !price || !stock_qty || !category) {
      setError("Please fill in all item fields.");
      return;
    }
    const { error } = await supabase.from("items").insert([
      {
        name,
        brand,
        model,
        price: parseFloat(price),
        stock_qty: parseInt(stock_qty),
        category,
      },
    ]);
    if (error) {
      console.error("Error adding item:", error);
      setError("Failed to add item.");
    } else {
      setFormData({ name: "", brand: "", model: "", price: "", stock_qty: "", category: "" });
      setShowAddItemModal(false);
      fetchItems();
    }
  };

  const handleEditItemSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!currentItem) return;
    const { name, brand, model, price, stock_qty, category } = formData;
    if (!name || !brand || !model || !price || !stock_qty || !category) {
      setError("Please fill in all item fields.");
      return;
    }
    const { error } = await supabase
      .from("items")
      .update({
        name,
        brand,
        model,
        price: parseFloat(price),
        stock_qty: parseInt(stock_qty),
        category,
      })
      .eq("id", currentItem.id);
    if (error) {
      console.error("Error updating item:", error);
      setError("Failed to update item.");
    } else {
      setShowEditItemModal(false);
      setCurrentItem(null);
      setFormData({ name: "", brand: "", model: "", price: "", stock_qty: "", category: "" });
      fetchItems();
    }
  };

  const openEditItemModal = (item) => {
    setCurrentItem(item);
    setFormData({
      name: item.name,
      brand: item.brand,
      model: item.model,
      price: item.price,
      stock_qty: item.stock_qty,
      category: item.category,
    });
    setShowEditItemModal(true);
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    setError(null);
    const { error } = await supabase.from("items").delete().eq("id", itemId);
    if (error) {
      console.error("Error deleting item:", error);
      setError("Failed to delete item.");
    } else {
      fetchItems();
    }
  };

  const openPurchaseModal = (item) => {
    setCurrentItem(item);
    setPurchaseData({ itemId: item.id, distributorId: "", qty: 1, total: item.price });
    setShowPurchaseModal(true);
  };

  useEffect(() => {
    if (currentItem && purchaseData.qty) {
      setPurchaseData((prev) => ({
        ...prev,
        total: currentItem.price * prev.qty,
      }));
    }
  }, [purchaseData.qty, currentItem]);

  const handleCreatePurchase = async (e) => {
    e.preventDefault();
    setError(null);
    const { itemId, distributorId, qty, total } = purchaseData;
    if (!itemId || !distributorId || !qty || !total) {
      setError("Please fill in all purchase details.");
      return;
    }
    const { data: { user }, error: userError } = await supabase.auth.getUser ();
    if (userError || !user) {
      setError("User  not authenticated. Please log in.");
      return;
    }
    const { error } = await supabase.from("purchases").insert([
      {
        distributor_id: distributorId,
        item_id: itemId,
        qty: parseInt(qty),
        total: parseFloat(total),
        status: "Pending",
        created_by: user.id,
      },
    ]);
    if (error) {
      console.error("Error creating purchase:", error);
      setError("Failed to create purchase order.");
    } else {
      setPurchaseData({ itemId: "", distributorId: "", qty: 1, total: 0 });
      setShowPurchaseModal(false);
      alert("Purchase order created successfully!");
    }
  };

  if (loading) {
    return (
      <div className="procurement-container">
        <Sidebar userRole={userRole} />
        <div className="procurement-content">
          <p>Loading items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="procurement-container">
      <Sidebar userRole={userRole} />
      <div className="procurement-content">
        <header className="procurement-header">
          <FaUserCircle className="user-pfp" />
          <div className="user-details">
            <span className="user-name">Mark Anthony Dela Cruz</span>
            <span className="user-id">#081203</span>
          </div>
        </header>

        <main className="procurement-main">
          <div className="procurement-main__header">
            <h1 className="procurement-title">Market (Items)</h1>
            <button className="procurement-main__add-button" onClick={() => setShowAddItemModal(true)}>
              <PiPlus /> Add New Item
            </button>
          </div>

          {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

          {/* Add Item Modal */}
          {showAddItemModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h2>Add New Item</h2>
                <form onSubmit={handleAddItemSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Item Name</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleItemFormChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="brand">Brand</label>
                    <input type="text" id="brand" name="brand" value={formData.brand} onChange={handleItemFormChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="model">Model</label>
                    <input type="text" id="model" name="model" value={formData.model} onChange={handleItemFormChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <input type="text" id="category" name="category" value={formData.category} onChange={handleItemFormChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="price">Price</label>
                    <input type="number" id="price" name="price" value={formData.price} onChange={handleItemFormChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="stock_qty">Initial Stock Quantity</label>
                    <input type="number" id="stock_qty" name="stock_qty" value={formData.stock_qty} onChange={handleItemFormChange} required />
                  </div>
                  <div className="modal-actions">
                    <button type="submit" className="procurement-actions__buy">Add Item</button>
                    <button type="button" className="procurement-actions__cancel" onClick={() => { setShowAddItemModal(false); setError(null); setFormData({ name: "", brand: "", model: "", price: "", stock_qty: "", category: "" }); }}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit Item Modal */}
          {showEditItemModal && currentItem && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h2>Edit Item</h2>
                <form onSubmit={handleEditItemSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Item Name</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleItemFormChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="brand">Brand</label>
                    <input type="text" id="brand" name="brand" value={formData.brand} onChange={handleItemFormChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="model">Model</label>
                    <input type="text" id="model" name="model" value={formData.model} onChange={handleItemFormChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <input type="text" id="category" name="category" value={formData.category} onChange={handleItemFormChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="price">Price</label>
                    <input type="number" id="price" name="price" value={formData.price} onChange={handleItemFormChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="stock_qty">Stock Quantity</label>
                    <input type="number" id="stock_qty" name="stock_qty" value={formData.stock_qty} onChange={handleItemFormChange} required />
                  </div>
                  <div className="modal-actions">
                    <button type="submit" className="procurement-actions__buy">Update Item</button>
                    <button type="button" className="procurement-actions__cancel" onClick={() => { setShowEditItemModal(false); setCurrentItem(null); setError(null); setFormData({ name: "", brand: "", model: "", price: "", stock_qty: "", category: "" }); }}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Purchase Modal */}
          {showPurchaseModal && currentItem && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h2>Create Purchase Order for {currentItem.name}</h2>
                <form onSubmit={handleCreatePurchase}>
                  <div className="form-group">
                    <label htmlFor="distributorId">Distributor</label>
                    <select id="distributorId" name="distributorId" value={purchaseData.distributorId} onChange={handlePurchaseFormChange} required>
                      <option value="">Select a Distributor</option>
                      {distributors.map((dist) => (
                        <option key={dist.id} value={dist.id}>{dist.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="qty">Quantity</label>
                    <input type="number" id="qty" name="qty" value={purchaseData.qty} onChange={handlePurchaseFormChange} min="1" required />
                  </div>
                  <div className="form-group">
                    <label>Total Price</label>
                    <p>${parseFloat(purchaseData.total).toFixed(2)}</p>
                  </div>
                  <div className="modal-actions">
                    <button type="submit" className="procurement-actions__buy">Place Purchase</button>
                    <button type="button" className="procurement-actions__cancel" onClick={() => { setShowPurchaseModal(false); setCurrentItem(null); setError(null); setPurchaseData({ itemId: "", distributorId: "", qty: 1, total: 0 }); }}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="procurement-cards">
            {items.map((item) => (
              <div key={item.id} className="procurement-list">
                <img className="procurement-img" src={placeholder} alt={item.name} />
                <p className="procurement-product-name">{item.name} ({item.model})</p>
                <p className="procurement-brand">{item.brand}</p>
                <p className="procurement-category">{item.category}</p>
                <p className="procurement-price">${parseFloat(item.price).toFixed(2)}</p>
                <p className="procurement-stock">Stock: {item.stock_qty}</p>

                <div className="procurement-actions">
                  <div className="procurement-actions__amount">
                    <button onClick={() => setPurchaseData((prev) => ({ ...prev, qty: Math.max(1, prev.qty - 1) }))} className="procurement-actions__amount--minus"><FaMinus /></button>
                    <span className="procurement-actions__amount--ctr">{purchaseData.itemId === item.id ? purchaseData.qty : 1}</span>
                    <button onClick={() => setPurchaseData((prev) => ({ ...prev, qty: prev.qty + 1 }))} className="procurement-actions__amount--add"><PiPlus /></button>
                  </div>
                  <button className="procurement-actions__buy" onClick={() => openPurchaseModal(item)}>Buy</button>

                  <div className="procurement-crud-actions">
                    <button className="procurement-crud-actions__edit" onClick={() => openEditItemModal(item)}><FaEdit /> Edit</button>
                    <button className="procurement-crud-actions__delete" onClick={() => handleDeleteItem(item.id)}><FaTrash /> Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProcurementPage;
