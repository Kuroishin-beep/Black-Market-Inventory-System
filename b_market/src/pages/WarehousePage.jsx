import React, { useState } from "react";
import Sidebar from "../components/SideBar";
import "../styles/Warehouse.css";
import { FaUserCircle } from "react-icons/fa";
import { CiFilter } from "react-icons/ci";

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

  const productCondition = [
    { value: "", label: "Set Condition" },
    { value: "good", label: "Good" },
    { value: "damaged", label: "Damaged" },
  ];

  return (
    <div className="warehouse-container">
      <Sidebar userRole={userRole} />
      <div className="warehouse-content">
        <header className="warehouse-header">
          <FaUserCircle className="user-pfp" />
          <div className="user-details">
            <span className="user-name">Mark Anthony Dela Cruz</span>
            <span className="user-id">#081203</span>
          </div>
        </header>

        <main className="warehouse-main">
          <div className="warehouse-main__header">
            <h1 className="warehouse-title">Product</h1>
            <div className="warehouse-main__header--buttons">
              <button className="warehouse-main__filter">
                <CiFilter className="warehouse-icon filter" /> Filter
              </button>
            </div>
          </div>

          <div className="warehouse-table__main">
            <table className="warehouse-table">
              <thead>
                <tr>
                  <th>Item Information</th>
                  <th>Product ID</th>
                  <th>Stock</th>
                  <th>Price</th>
                  <th className="last-column">Action</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.itemInfo}</td>
                    <td>{product.productId}</td>
                    <td>{product.stock}</td>
                    <td>{product.price}</td>

                    <td>
                      <div className="warehouse-card__input-wrapper">
                        <select
                          className={`warehouse-card__condition ${product.status.toLowerCase()}`}
                          value={product.status}
                          onChange={(e) =>
                            handleStatusChange(product.id, e.target.value)
                          }
                        >
                          <option value="">Set Condition</option>
                          <option value="Good">Good</option>
                          <option value="Damaged">Damaged</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              <button className="pagination-btn">
                <span>←</span> Previous
              </button>

              <div className="page-numbers">
                <span className="page-number">01</span>
                <span className="page-number">02</span>
                <span className="page-number">03</span>
              </div>

              <button className="pagination-btn">
                Next <span>→</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default WarehousePage;
