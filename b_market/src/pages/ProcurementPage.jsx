import React, { useState } from "react";
import Sidebar from "../components/SideBar";
import "../styles/Procurement.css";
import { FaUserCircle } from "react-icons/fa";
import placeholder from "../assets/img-placeholder.png";
import { PiPlus } from "react-icons/pi";
import { FaMinus } from "react-icons/fa6";

const ProcurementPage = ({ userRole = "procurement" }) => {
  const [formData, setFormData] = useState({
    productName: "",
    distributor: "",
    price: "",
    quantity: "",
  });

  const [counter, setCounter] = useState(1);

  const [products, setProducts] = useState([
    {
      id: 1,
      productName: "Lenovo ThinkBook Plus Gen 6",
      distributor: "Tech Distributors Inc",
      price: "$599.75",
    },
    {
      id: 2,
      productName: "Acer Chromebook Plus Spin 514",
      distributor: "Global Tech Supply",
      price: "$599.75",
    },
    {
      id: 3,
      productName: "Dell XPS 13",
      distributor: "Premium Electronics",
      price: "$599.75",
    },
    {
      id: 1,
      productName: "Lenovo ThinkBook Plus Gen 6",
      distributor: "Tech Distributors Inc",
      price: "$599.75",
    },
    {
      id: 2,
      productName: "Acer Chromebook Plus Spin 514",
      distributor: "Global Tech Supply",
      price: "$599.75",
    },
    {
      id: 3,
      productName: "Dell XPS 13",
      distributor: "Premium Electronics",
      price: "$599.75",
    },

    {
      id: 1,
      productName: "Lenovo ThinkBook Plus Gen 6",
      distributor: "Tech Distributors Inc",
      price: "$599.75",
    },
    {
      id: 2,
      productName: "Acer Chromebook Plus Spin 514",
      distributor: "Global Tech Supply",
      price: "$599.75",
    },
    {
      id: 3,
      productName: "Dell XPS 13",
      distributor: "Premium Electronics",
      price: "$599.75",
    },
    {
      id: 1,
      productName: "Lenovo ThinkBook Plus Gen 6",
      distributor: "Tech Distributors Inc",
      price: "$599.75",
    },
    {
      id: 2,
      productName: "Acer Chromebook Plus Spin 514",
      distributor: "Global Tech Supply",
      price: "$599.75",
    },
    {
      id: 3,
      productName: "Dell XPS 13",
      distributor: "Premium Electronics",
      price: "$599.75",
    },
  ]);

  const [showForm, setShowForm] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      formData.productName &&
      formData.distributor &&
      formData.price &&
      formData.quantity
    ) {
      const newProduct = {
        id: products.length + 1,
        productName: formData.productName,
        distributor: formData.distributor,
        price: `$${formData.price}`,
        quantity: formData.quantity,
        status: "Pending",
        dateAdded: new Date().toISOString().split("T")[0],
      };

      setProducts((prev) => [...prev, newProduct]);
      setFormData({
        productName: "",
        distributor: "",
        price: "",
        quantity: "",
      });
      setShowForm(false);

      console.log("New product added to inventory:", newProduct);
    }
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "approved";
      case "pending":
        return "pending";
      case "rejected":
        return "rejected";
      default:
        return "pending";
    }
  };

  return (
    <div className="procurement-container">
      <Sidebar userRole={userRole} />

      <div className="procurement-content">
        <header className="procurement-header">
          <FaUserCircle className="user-pfp" />
          <div className="user-details">
            <span className="user-name">Mark Anthony Dela Cruz</span>
            <span className="user-id">#081203</span>
          </div>
        </header>

        <main className="procurement-main">
          <h1 className="procurement-title">Market</h1>
          <div className="procurement-cards">
            {products.map((product) => (
              <div key={product.id} className="procurement-list">
                <img
                  className="procurement-img"
                  src={placeholder}
                  alt={product.productName}
                />
                <p className="procurement-product-name">
                  {product.productName}
                </p>
                <p className="procurement-distributor">{product.distributor}</p>
                <p className="procurement-price">{product.price}</p>

                <div className="procurement-actions">
                  <div className="procurement-actions__amount">
                    <button
                      onClick={() =>
                        setCounter((prev) => (prev > 1 ? prev - 1 : 1))
                      }
                      className="procurement-actions__amount--minus"
                    >
                      <FaMinus />
                    </button>

                    <span className="procurement-actions__amount--ctr">
                      {counter}
                    </span>

                    <button
                      onClick={() => setCounter((prev) => prev + 1)}
                      className="procurement-actions__amount--add"
                    >
                      <PiPlus />
                    </button>
                  </div>
                  <button className="procurement-actions__buy">Buy</button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProcurementPage;
