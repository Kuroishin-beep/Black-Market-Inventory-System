import React, { useState } from "react";
import Sidebar from "../components/SideBar";
import "../styles/Warehouse.css";

const WarehousePage = ({ userRole = "warehouse" }) => {
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
      id: "12346",
      itemInfo: "Acer Predator Helios 18P AI",
      productId: "#12346",
      stock: "1,234",
      price: "$599.75",
      status: "Pending",
    },
    {
      id: "67891",
      itemInfo: "Asus ROG Zephyrus G16",
      productId: "#67891",
      stock: "45,678",
      price: "$599.75",
      status: "Pending",
    },
    {
      id: "12347",
      itemInfo: "Acer Predator Helios Neo 16",
      productId: "#12347",
      stock: "678",
      price: "$599.75",
      status: "Pending",
    },
    {
      id: "67892",
      itemInfo: "Dell XPS 13",
      productId: "#67892",
      stock: "13,567",
      price: "$599.75",
      status: "Spoiled",
    },
    {
      id: "12348",
      itemInfo: "Lenovo ThinkBook Plus Gen 6",
      productId: "#12348",
      stock: "12,345",
      price: "$599.75",
      status: "Damaged",
    },
    {
      id: "67893",
      itemInfo: "Acer Chromebook Plus Spin 514",
      productId: "#67893",
      stock: "23,456",
      price: "$599.75",
      status: "Good",
    },
    {
      id: "12349",
      itemInfo: "Acer Predator Helios 18P AI",
      productId: "#12349",
      stock: "1,234",
      price: "$599.75",
      status: "Good",
    },
    {
      id: "67894",
      itemInfo: "Asus ROG Zephyrus G16",
      productId: "#67894",
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

    // This updates will reflect in product/order status across the system
    console.log(
      `Product ${updatedProducts[index].productId} status updated to ${newStatus}`
    );
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
          <h1>Warehouse - Product Status Management</h1>
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
          <div className="status-info">
            <p>
              Update product status from default <strong>Pending</strong> to
              reflect current condition:
            </p>
          </div>

          <div className="products-table">
            <div className="table-header">
              <div className="header-cell">Item Information</div>
              <div className="header-cell">Product ID</div>
              <div className="header-cell">Stock</div>
              <div className="header-cell">Price</div>
              <div className="header-cell">Status</div>
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

export default WarehousePage;
