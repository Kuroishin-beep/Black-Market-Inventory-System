import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/SideBar";
import "../styles/ProductList.css";
import "../styles/Shared.css";
import { FaUserCircle } from "react-icons/fa";
import { CiFilter } from "react-icons/ci";
import { LuPlus } from "react-icons/lu";
import { supabase } from "../supabaseClient"; // ✅ Import Supabase client

const ProductListPage = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("procurement");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch products from Supabase
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
