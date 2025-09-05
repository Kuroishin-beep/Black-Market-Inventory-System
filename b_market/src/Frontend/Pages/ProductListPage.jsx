import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "./Products.css";
import "./shared.css";

const Products = () => {
  const [userRole, setUserRole] = useState("procurement");
  const [products] = useState([
    {
      name: "Lenovo ThinkBook Plus Gen 6",
      id: "#12345",
      price: "$599.75",
      sales: "$76,543.21",
      stock: "12,345",
    },
    {
      name: "Acer Chromebook Plus Spin 514",
      id: "#67890",
      price: "$599.75",
      sales: "$76,543.21",
      stock: "23,456",
    },
    {
      name: "Acer Predator Helios 18P AI",
      id: "#12345",
      price: "$599.75",
      sales: "$76,543.21",
      stock: "1,234",
    },
    {
      name: "Asus ROG Zephyrus G16",
      id: "#67890",
      price: "$599.75",
      sales: "$76,543.21",
      stock: "45,678",
    },
    {
      name: "Acer Predator Helios Neo 16",
      id: "#12345",
      price: "$599.75",
      sales: "$76,543.21",
      stock: "678",
    },
    {
      name: "Dell XPS 13",
      id: "#67890",
      price: "$599.75",
      sales: "$76,543.21",
      stock: "13,567",
    },
    {
      name: "Lenovo ThinkBook Plus Gen 6",
      id: "#12345",
      price: "$599.75",
      sales: "$76,543.21",
      stock: "12,345",
    },
    {
      name: "Acer Chromebook Plus Spin 514",
      id: "#67890",
      price: "$599.75",
      sales: "$76,543.21",
      stock: "23,456",
    },
    {
      name: "Acer Predator Helios 18P AI",
      id: "#12345",
      price: "$599.75",
      sales: "$76,543.21",
      stock: "1,234",
    },
    {
      name: "Asus ROG Zephyrus G16",
      id: "#67890",
      price: "$599.75",
      sales: "$76,543.21",
      stock: "45,678",
    },
  ]);

  const handleAddNewProduct = () => {
    // Redirect to procurement page
    window.location.href = "/procurement";
  };

  return (
    <div className="products-container">
      <Sidebar userRole={userRole} />

      <main className="products-main">
        <div className="products-header">
          <h1>Product</h1>
          <div className="header-actions">
            <button className="filter-btn">
              <span className="filter-icon">🔽</span>
              Filter
            </button>
            <button className="add-product-btn" onClick={handleAddNewProduct}>
              <span className="add-icon">+</span>
              Add New Product
            </button>
          </div>
          <div className="user-info">
            <div className="user-avatar">
              <span className="user-icon">👤</span>
            </div>
            <div className="user-details">
              <span className="user-name">Mark Anthony Dela Cruz</span>
              <span className="user-id">#081203</span>
            </div>
          </div>
        </div>

        <div className="products-content">
          <div className="products-table">
            <div className="table-header">
              <div className="header-cell">Product Name</div>
              <div className="header-cell">Product ID</div>
              <div className="header-cell">Price</div>
              <div className="header-cell">Sales</div>
              <div className="header-cell">Stock</div>
            </div>

            <div className="table-body">
              {products.map((product, index) => (
                <div key={index} className="table-row">
                  <div className="table-cell">{product.name}</div>
                  <div className="table-cell">{product.id}</div>
                  <div className="table-cell">{product.price}</div>
                  <div className="table-cell">{product.sales}</div>
                  <div className="table-cell">{product.stock}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="pagination">
            <button className="pagination-btn">
              <span>←</span> Previous
            </button>

            <div className="page-numbers">
              <span className="page-number">01</span>
              <span className="page-number">02</span>
              <span className="page-number active">03</span>
              <span className="page-dots">...</span>
              <span className="page-number">20</span>
            </div>

            <button className="pagination-btn">
              Next <span>→</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Products;
