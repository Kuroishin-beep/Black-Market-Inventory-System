import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideBar";
import "../styles/Dashboard.css";
import "../styles/Shared.css";
import { FaUserCircle } from "react-icons/fa";
import { BsFillBarChartFill } from "react-icons/bs";
import { supabase } from "../supabaseClient";

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const [dashboardData, setDashboardData] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalSales: 0,
    customers: 0,
  });
  const [popularProducts, setPopularProducts] = useState([]);

  const [loadingUserRole, setLoadingUserRole] = useState(true);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [error, setError] = useState(null);

  // --- Fetch authenticated user and their role ---
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error || !user) {
          setError("User not authenticated.");
          setLoadingUserRole(false);
          return;
        }

        setUser(user);

        // Fetch employee from employees table
        const { data: employeeData, error: empError } = await supabase
          .from("employees")
          .select(
            `
            id,
            full_name,
            email,
            role_id,
            roles:roles(id, role, label)
          `
          )
          .eq("auth_user_id", user.id) // ✅ safer if your employees table uses auth_user_id
          .single();

        if (empError || !employeeData) {
          const metadataRole = user.user_metadata?.role;
          if (!metadataRole) {
            console.warn(
              "Employee record not found and no metadata role found. Falling back to default 'warehouse'."
            );
          }
          setUserRole(metadataRole || "warehouse");
        } else {
          setUserRole(employeeData.roles.role);
        }
      } catch (err) {
        console.error("Error fetching employee role:", err);
        const metadataRole = user?.user_metadata?.role;
        setUserRole(metadataRole || "warehouse");
      } finally {
        setLoadingUserRole(false);
      }
    };

    fetchUserRole();
  }, []);

  // --- Fetch dashboard data ---
  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      setLoadingDashboard(true);
      try {
        // Total orders
        const { count: totalOrdersCount, error: ordersError } = await supabase
          .from("sales")
          .select("*", { count: "exact", head: true });
        if (ordersError) throw ordersError;

        // Total products
        const { count: totalProductsCount, error: productsError } =
          await supabase
            .from("items")
            .select("*", { count: "exact", head: true });
        if (productsError) throw productsError;

        // Total sales sum
        const { data: salesSumData, error: salesSumError } = await supabase
          .from("sales")
          .select("total");
        if (salesSumError) throw salesSumError;
        const totalSalesSum = salesSumData.reduce(
          (acc, sale) => acc + (sale.total || 0),
          0
        );

        // Total customers
        const { count: customersCount, error: customersError } = await supabase
          .from("customers")
          .select("*", { count: "exact", head: true });
        if (customersError) throw customersError;

        setDashboardData({
          totalOrders: totalOrdersCount || 0,
          totalProducts: totalProductsCount || 0,
          totalSales: totalSalesSum || 0,
          customers: customersCount || 0,
        });

        // Popular products (top 6 by sales total)
        const { data: popularSales, error: popularSalesError } = await supabase
          .from("sales")
          .select("item_id, total")
          .order("total", { ascending: false })
          .limit(6);
        if (popularSalesError) throw popularSalesError;

        const itemIds = popularSales.map((sale) => sale.item_id);
        const { data: itemsData, error: itemsError } = await supabase
          .from("items")
          .select("id, name, model, price, stock_qty")
          .in("id", itemIds);
        if (itemsError) throw itemsError;

        const popularProductsData = itemsData.map((item) => {
          const sale = popularSales.find((s) => s.item_id === item.id);
          return {
            name: item.name,
            id: `#${item.id.substring(0, 8)}`,
            price: `$${item.price.toFixed(2)}`,
            sales: `$${sale?.total.toFixed(2) || "0.00"}`,
            status: item.stock_qty > 0 ? "In Stock" : "Out of Stock",
          };
        });

        setPopularProducts(popularProductsData);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoadingDashboard(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const isLoading = loadingUserRole || loadingDashboard;

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <Sidebar userRole={userRole} />
        <div className="dashboard-content">
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <Sidebar userRole={userRole} />
        <div className="dashboard-content">
          <p style={{ color: "red", textAlign: "center" }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar userRole={userRole} />

      <div className="dashboard-content">
        <header className="dashboard-header">
          <FaUserCircle className="user-pfp" />
          <div className="user-details">
            <span className="user-name">
              {user?.user_metadata?.full_name ||
                user?.user_metadata?.name ||
                user?.email ||
                "User"}
            </span>

            <span className="user-role" style={{ fontSize: 12, color: "#666" }}>
              Role: {userRole}
            </span>
          </div>
        </header>

        <main className="dashboard-main">
          <div className="kpi-cards">
            <div className="kpi-card orders">
              <BsFillBarChartFill className="kpi-icon orders" />
              <h2 className="kpi-value">
                {dashboardData.totalOrders.toLocaleString()}
              </h2>
              <p className="kpi-label">total orders</p>
            </div>

            <div className="kpi-card products">
              <BsFillBarChartFill className="kpi-icon products" />
              <h2 className="kpi-value">
                {dashboardData.totalProducts.toLocaleString()}
              </h2>
              <p className="kpi-label">products</p>
            </div>

            <div className="kpi-card sales">
              <BsFillBarChartFill className="kpi-icon sales" />
              <h2 className="kpi-value">
                ${dashboardData.totalSales.toLocaleString()}
              </h2>
              <p className="kpi-label">total sales</p>
            </div>

            <div className="kpi-card customers">
              <BsFillBarChartFill className="kpi-icon customers" />
              <h2 className="kpi-value">
                {dashboardData.customers.toLocaleString()}
              </h2>
              <p className="kpi-label">total customers</p>
            </div>
          </div>

          <div className="table-container">
            <div className="table-title">
              <h3>Popular Products</h3>
            </div>

            <table className="products-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Product ID</th>
                  <th>Price</th>
                  <th>Sales</th>
                  <th className="last-column">Status</th>
                </tr>
              </thead>
              <tbody>
                {popularProducts.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      No popular products found.
                    </td>
                  </tr>
                ) : (
                  popularProducts.map((product, index) => (
                    <tr key={index}>
                      <td>{product.name}</td>
                      <td>{product.id}</td>
                      <td>{product.price}</td>
                      <td>{product.sales}</td>
                      <td className="status-cell">
                        <span
                          className={`status ${
                            product.status === "In Stock"
                              ? "in-stock"
                              : "out-of-stock"
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
