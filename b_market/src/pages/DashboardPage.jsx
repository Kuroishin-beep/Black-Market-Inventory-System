import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/Dashboard.css";
import "../styles/Shared.css";

const DashboardPage = () => {
  const [userRole, setUserRole] = useState("csr"); // Default role, should come from auth context
  const [dashboardData, setDashboardData] = useState({
    totalOrders: 6543,
    totalProducts: 7654,
    totalSales: 12345,
    refunds: 12,
  });

  const [popularProducts] = useState([
    {
      name: "Lenovo ThinkBook Plus Gen 6",
      id: "#12345",
      price: "$599.75",
      sales: "$76,543.21",
      status: "In Stock",
    },
    {
      name: "Acer Chromebook Plus Spin 514",
      id: "#67890",
      price: "$599.75",
      sales: "$76,543.21",
      status: "Out of Stock",
    },
    {
      name: "Acer Predator Helios 18P AI",
      id: "#12346",
      price: "$599.75",
      sales: "$76,543.21",
      status: "In Stock",
    },
    {
      name: "Asus ROG Zephyrus G16",
      id: "#67891",
      price: "$599.75",
      sales: "$76,543.21",
      status: "Out of Stock",
    },
    {
      name: "Acer Predator Helios Neo 16",
      id: "#12347",
      price: "$599.75",
      sales: "$76,543.21",
      status: "In Stock",
    },
    {
      name: "Dell XPS 13",
      id: "#67892",
      price: "$599.75",
      sales: "$76,543.21",
      status: "In Stock",
    },
  ]);

  return (
    <div className="dashboard-container">
      <Sidebar userRole={userRole} />

      <main className="dashboard-main">
        <div className="dashboard-header">
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

        <div className="dashboard-content">
          <div className="kpi-cards">
            <div className="kpi-card">
              <div className="kpi-icon purple">
                <div className="chart-bars">
                  <div className="bar"></div>
                  <div className="bar"></div>
                  <div className="bar"></div>
                  <div className="bar"></div>
                </div>
              </div>
              <div className="kpi-value">
                {dashboardData.totalOrders.toLocaleString()}
              </div>
              <div className="kpi-label">total order</div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon blue">
                <div className="chart-bars">
                  <div className="bar"></div>
                  <div className="bar"></div>
                  <div className="bar"></div>
                  <div className="bar"></div>
                </div>
              </div>
              <div className="kpi-value">
                {dashboardData.totalProducts.toLocaleString()}
              </div>
              <div className="kpi-label">products</div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon orange">
                <div className="chart-bars">
                  <div className="bar"></div>
                  <div className="bar"></div>
                  <div className="bar"></div>
                  <div className="bar"></div>
                </div>
              </div>
              <div className="kpi-value">
                ${dashboardData.totalSales.toLocaleString()}
              </div>
              <div className="kpi-label">total sales</div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon pink">
                <div className="chart-bars">
                  <div className="bar"></div>
                  <div className="bar"></div>
                  <div className="bar"></div>
                  <div className="bar"></div>
                </div>
              </div>
              <div className="kpi-value">{dashboardData.refunds}%</div>
              <div className="kpi-label">refunds</div>
            </div>
          </div>

          <div className="popular-products-section">
            <div className="section-header">
              <h2>Popular Products</h2>
            </div>

            <div className="products-table">
              <div className="table-header">
                <div className="header-cell">Product Name</div>
                <div className="header-cell">Product ID</div>
                <div className="header-cell">Price</div>
                <div className="header-cell">Sales</div>
                <div className="header-cell">Status</div>
              </div>

              <div className="table-body">
                {popularProducts.map((product, index) => (
                  <div key={index} className="table-row">
                    <div className="table-cell">{product.name}</div>
                    <div className="table-cell">{product.id}</div>
                    <div className="table-cell">{product.price}</div>
                    <div className="table-cell">{product.sales}</div>
                    <div className="table-cell">
                      <span
                        className={`status-badge ${
                          product.status === "In Stock"
                            ? "in-stock"
                            : "out-of-stock"
                        }`}
                      >
                        {product.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
