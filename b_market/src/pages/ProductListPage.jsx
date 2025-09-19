import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/SideBar";
import "../styles/ProductList.css";
import "../styles/Shared.css";
import YellowAnimatedLoader from "../components/Loading";
import { FaUserCircle } from "react-icons/fa";
import { CiFilter } from "react-icons/ci";
import { LuPlus } from "react-icons/lu";
import { supabase } from "../supabaseClient";

const ProductListPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
          return;
        }

        setUser(user);

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
          .eq("auth_user_id", user.id)
          .single();

        if (empError || !employeeData) {
          const metadataRole = user.user_metadata?.role;
          setUserRole(metadataRole || "warehouse");
        } else {
          setUserRole(employeeData.roles.role);
        }
      } catch (err) {
        console.error("Error fetching employee role:", err);
        const metadataRole = user?.user_metadata?.role;
        setUserRole(metadataRole || "warehouse");
      }
    };

    fetchUserRole();
  }, []);

  // --- Fetch products with pagination ---
  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    const from = (currentPage - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;

    const { data, error } = await supabase
      .from("items")
      .select(
        `
        id,
        name,
        brand,
        model,
        price,
        stock_qty,
        category,
        created_at
      `
      )
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Error fetching products:", error);
      setError("Failed to fetch products.");
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  // ✅ Navigate to procurement page
  const handleAddNewProduct = () => {
    navigate("/procurement");
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="product-container">
        <Sidebar userRole={userRole} />
        <div className="loader-wrapper">
          <YellowAnimatedLoader />
        </div>
      </div>
    );
  }

  return (
    <div className="product-container">
      <Sidebar userRole={userRole} />

      <div className="product-content">
        {/* Header */}
        <header className="product-header">
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

        {/* Main Content */}
        <main className="product-main">
          <div className="product-main__header">
            <h1 className="product-title">Products</h1>
            <div className="product-main__header--buttons">
              <button className="product-main__filter">
                <CiFilter className="product-icon filter" />
                Filter
              </button>
              <button
                className="product-main__procurement"
                onClick={handleAddNewProduct}
              >
                <LuPlus className="product-icon plus" />
                Add New Product
              </button>
            </div>
          </div>

          {error && (
            <p style={{ color: "red", textAlign: "center" }}>{error}</p>
          )}

          {/* Products Table */}
          <div className="product-table__main">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Product ID</th>
                  <th>Brand</th>
                  <th>Model</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>
                      No products found.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{product.id}</td>
                      <td>{product.brand || "N/A"}</td>
                      <td>{product.model || "N/A"}</td>
                      <td>{product.category || "N/A"}</td>
                      <td>${parseFloat(product.price).toFixed(2)}</td>
                      <td>{product.stock_qty ?? 0}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                <span>←</span> Previous
              </button>

              <div className="page-numbers">
                <span className="page-number">
                  {String(currentPage).padStart(2, "0")}
                </span>
              </div>

              <button className="pagination-btn" onClick={handleNextPage}>
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
