import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "./Warehouse.css";

const Warehouse = ({ userRole = "warehouse" }) => {
  const [products, setProducts] = useState([
    {
      id: "12345",
      itemInfo: "Lenovo ThinkBook Plus Gen 6",
      productId: "#12345",
      stock: "12,345",
      price: "$599.75",
      status: "Good",
    },
    {
      id: "67890",
      itemInfo: "Acer Chromebook Plus Spin 514",
      productId: "#67890",
      stock: "23,456",
      price: "$599.75",
      status: "Good",
    },
    {
      id: "12345",
      itemInfo: "Acer Predator Helios 18P AI",
      productId: "#12345",
      stock: "1,234",
      price: "$599.75",
      status: "Pending",
    },
    {
      id: "67890",
      itemInfo: "Asus ROG Zephyrus G16",
      productId: "#67890",
      stock: "45,678",
      price: "$599.75",
      status: "Pending",
    },
    {
      id: "12345",
      itemInfo: "Acer Predator Helios Neo 16",
      productId: "#12345",
      stock: "678",
      price: "$599.75",
      status: "Pending",
    },
    {
      id: "67890",
      itemInfo: "Dell XPS 13",
      productId: "#67890",
      stock: "13,567",
      price: "$599.75",
      status: "Spoiled",
    },
    {
      id: "12345",
      itemInfo: "Lenovo ThinkBook Plus Gen 6",
      productId: "#12345",
      stock: "12,345",
      price: "$599.75",
      status: "Damaged",
    },
    {
      id: "67890",
      itemInfo: "Acer Chromebook Plus Spin 514",
      productId: "#67890",
      stock: "23,456",
      price: "$599.75",
      status: "Good",
    },
    {
      id: "12345",
      itemInfo: "Acer Predator Helios 18P AI",
      productId: "#12345",
      stock: "1,234",
      price: "$599.75",
      status: "Good",
    },
    {
      id: "67890",
      itemInfo: "Asus ROG Zephyrus G16",
      productId: "#67890",
      stock: "45,678",
      price: "$599.75",
      status: "Good",
    },
  ]);

  const [currentPage, setCurrentPage] = useState(3);

  const handleStatusChange = (index, newStatus) => {
    const updatedProducts = [...products];
    updatedProducts[index].status = newStatus;
    setProducts(updatedProducts);
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "good":
        return "good";
      case "spoiled":
        return "spoiled";
      case "damaged":
        return "damaged";
      case "pending":
        return "pending";
      default:
        return "pending";
    }
  };

  const getDropdownClass = (status) => {
    switch (status.toLowerCase()) {
      case "good":
        return "status-select good";
      case "spoiled":
        return "status-select spoiled";
      case "damaged":
        return "status-select damaged";
      case "pending":
        return "status-select pending";
      default:
        return "status-select pending";
    }
  };

  return (
    <div className="warehouse-container">
      <Sidebar userRole={userRole} />
      <main className="warehouse-main">
        <header className="warehouse-header">
          <h1>Product</h1>
          <div className="header-actions">
            <button className="filter-btn">
              <span className="filter-icon">▲</span>
              Filter
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

        <div className="warehouse-content">
          <div className="products-table">
            <div className="table-header">
              <div className="header-cell">Item Information</div>
              <div className="header-cell">Product ID</div>
              <div className="header-cell">Stock</div>
              <div className="header-cell">Price</div>
              <div className="header-cell">Action</div>
            </div>

            <div className="table-body">
              {products.map((product, index) => (
                <div key={index} className="table-row">
                  <div className="table-cell">{product.itemInfo}</div>
                  <div className="table-cell">{product.productId}</div>
                  <div className="table-cell">{product.stock}</div>
                  <div className="table-cell">{product.price}</div>
                  <div className="table-cell">
                    <select
                      className={getDropdownClass(product.status)}
                      value={product.status}
                      onChange={(e) =>
                        handleStatusChange(index, e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Good">Good</option>
                      <option value="Spoiled">Spoiled</option>
                      <option value="Damaged">Damaged</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pagination">
            <button className="pagination-btn" disabled>
              ◀ Previous
            </button>
            <div className="page-numbers">
              <span className="page-number">01</span>
              <span className="page-number">02</span>
              <span className="page-number active">03</span>
              <span className="page-dots">...</span>
              <span className="page-number">20</span>
            </div>
            <button className="pagination-btn">Next ▶</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Warehouse;
