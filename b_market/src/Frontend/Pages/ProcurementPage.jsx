import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "./Procurement.css";

const Procurement = ({ userRole = "procurement" }) => {
  const [formData, setFormData] = useState({
    productName: "",
    distributor: "",
    price: "",
    quantity: "",
  });

  const [products, setProducts] = useState([
    {
      id: 1,
      productName: "Lenovo ThinkBook Plus Gen 6",
      distributor: "Tech Distributors Inc",
      price: "$599.75",
      quantity: "12,345",
      status: "Pending",
      dateAdded: "2025-09-01",
    },
    {
      id: 2,
      productName: "Acer Chromebook Plus Spin 514",
      distributor: "Global Tech Supply",
      price: "$599.75",
      quantity: "23,456",
      status: "Approved",
      dateAdded: "2025-09-02",
    },
    {
      id: 3,
      productName: "Dell XPS 13",
      distributor: "Premium Electronics",
      price: "$599.75",
      quantity: "13,567",
      status: "Pending",
      dateAdded: "2025-09-03",
    },
  ]);

  const [showForm, setShowForm] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      formData.productName &&
      formData.distributor &&
      formData.price &&
      formData.quantity
    ) {
      const newProduct = {
        id: products.length + 1,
        productName: formData.productName,
        distributor: formData.distributor,
        price: `$${formData.price}`,
        quantity: formData.quantity,
        status: "Pending",
        dateAdded: new Date().toISOString().split("T")[0],
      };

      setProducts((prev) => [...prev, newProduct]);
      setFormData({
        productName: "",
        distributor: "",
        price: "",
        quantity: "",
      });
      setShowForm(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "approved";
      case "pending":
        return "pending";
      case "rejected":
        return "rejected";
      default:
        return "pending";
    }
  };

  return (
    <div className="procurement-container">
      <Sidebar userRole={userRole} />
      <main className="procurement-main">
        <header className="procurement-header">
          <h1>Procurement</h1>
          <div className="header-actions">
            <button
              className="add-product-btn"
              onClick={() => setShowForm(!showForm)}
            >
              <span className="add-icon">+</span>
              Add New Product
            </button>
          </div>
          <div className="user-info">
            <div className="user-avatar">
              <span className="user-icon">👤</span>
            </div>
            <div className="user-details">
              <div className="user-name">Mark Anthony Dela Cruz</div>
              <div className="user-id">#081203</div>
            </div>
          </div>
        </header>

        {showForm && (
          <div className="add-product-form">
            <div className="form-card">
              <div className="form-header">
                <h2>Add New Product</h2>
                <button
                  className="close-btn"
                  onClick={() => setShowForm(false)}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="product-form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Product Name</label>
                    <input
                      type="text"
                      name="productName"
                      value={formData.productName}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Distributor</label>
                    <input
                      type="text"
                      name="distributor"
                      value={formData.distributor}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter distributor name"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Price</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter price"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter quantity"
                      required
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn">
                    Add Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="procurement-content">
          <div className="products-table">
            <div className="table-header">
              <div className="header-cell">Product Name</div>
              <div className="header-cell">Distributor</div>
              <div className="header-cell">Price</div>
              <div className="header-cell">Quantity</div>
              <div className="header-cell">Status</div>
              <div className="header-cell">Date Added</div>
            </div>

            <div className="table-body">
              {products.map((product, index) => (
                <div key={product.id} className="table-row">
                  <div className="table-cell">{product.productName}</div>
                  <div className="table-cell">{product.distributor}</div>
                  <div className="table-cell">{product.price}</div>
                  <div className="table-cell">{product.quantity}</div>
                  <div className="table-cell">
                    <span
                      className={`status-badge ${getStatusClass(
                        product.status
                      )}`}
                    >
                      {product.status}
                    </span>
                  </div>
                  <div className="table-cell">{product.dateAdded}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Procurement;
