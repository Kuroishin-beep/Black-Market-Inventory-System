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
  const [loadingUserRole, setLoadingUserRole] = useState(true);

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

  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("items")
        .select("id, product_name, price, stock");

      if (error) {
        console.error("Error fetching products:", error.message);
      } else {
        setProducts(data);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const isLoading = loadingUserRole || loading;

  if (isLoading) {
    return (
      <div className="product-container">
        <Sidebar userRole={userRole} />
        <div className="product-content">
          <div className="loader-wrapper">
            <YellowAnimatedLoader />
          </div>
        </div>
      </div>
    );
  }

  // ✅ Navigate to procurement page
  const handleAddNewProduct = () => {
    navigate("/procurement");
  };

  return (
    <div className="product-container">
      <Sidebar userRole={userRole} />

      <div className="product-content">
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

        <main className="product-main">
          <div className="product-main__header">
            <h1 className="product-title">Product</h1>

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

          <div className="product-table__main">
            <div className="products-table">
              <div className="table-header">
                <div className="header-cell">Product Name</div>
                <div className="header-cell">Product ID</div>
                <div className="header-cell">Price</div>
                <div className="header-cell">Stock</div>
              </div>

              <div className="table-body">
                {loading ? (
                  <div className="table-row">
                    <div className="table-cell" colSpan="4">
                      Loading products...
                    </div>
                  </div>
                ) : products.length > 0 ? (
                  products.map((product, index) => (
                    <div key={index} className="table-row">
                      <div className="table-cell">{product.product_name}</div>
                      <div className="table-cell">{product.id}</div>
                      <div className="table-cell">${product.price}</div>
                      <div className="table-cell">{product.stock}</div>
                    </div>
                  ))
                ) : (
                  <div className="table-row">
                    <div className="table-cell" colSpan="4">
                      No products found
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ✅ Pagination placeholder */}
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
