import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/SideBar";
import "../styles/ProductList.css";
import "../styles/Shared.css";
import { FaUserCircle } from "react-icons/fa";
import { CiFilter } from "react-icons/ci";
import { LuPlus } from "react-icons/lu";

const ProductListPage = () => {
  const navigate = useNavigate();
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
      id: "#12346",
      price: "$599.75",
      sales: "$76,543.21",
      stock: "1,234",
    },
    {
      name: "Asus ROG Zephyrus G16",
      id: "#67891",
      price: "$599.75",
      sales: "$76,543.21",
      stock: "45,678",
    },
    {
      name: "Acer Predator Helios Neo 16",
      id: "#12347",
      price: "$599.75",
      sales: "$76,543.21",
      stock: "678",
    },
    {
      name: "Dell XPS 13",
      id: "#67892",
      price: "$599.75",
      sales: "$76,543.21",
      stock: "13,567",
    },
    {
      name: "Lenovo ThinkBook Plus Gen 6",
      id: "#12348",
      price: "$599.75",
      sales: "$76,543.21",
      stock: "12,345",
    },
    {
      name: "Acer Chromebook Plus Spin 514",
      id: "#67893",
      price: "$599.75",
      sales: "$76,543.21",
      stock: "23,456",
    },
    {
      name: "Acer Predator Helios 18P AI",
      id: "#12349",
      price: "$599.75",
      sales: "$76,543.21",
      stock: "1,234",
    },
    {
      name: "Asus ROG Zephyrus G16",
      id: "#67894",
      price: "$599.75",
      sales: "$76,543.21",
      stock: "45,678",
    },
  ]);

  const handleAddNewProduct = () => {
    // Navigate to procurement page to add new product
    navigate("/procurement");
  };

  return (
    <div className="product-container">
      <Sidebar userRole={userRole} />

      <div className="product-content">
        <header className="product-header">
          <FaUserCircle className="user-pfp" />
          <div className="user-details">
            <span className="user-name">Mark Anthony Dela Cruz</span>
            <span className="user-id">#081203</span>
          </div>
        </header>

        <main className="product-main">
          <div className="product-main__header">
            <h1 className="product-title">Product</h1>

            <div className="product-main__header--buttons">
              <button className="product-main__filter">
                <CiFilter className="product-icon filter" />
                Filter
              </button>
              <button className="product-main__procurement">
                <LuPlus className="product-icon plus" />
                Add New Product
              </button>
            </div>
          </div>

          <div className="product-table__main">
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

export default ProductListPage;
