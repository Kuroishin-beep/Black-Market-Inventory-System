// src/Frontend/Pages/SignUpPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/SignUp.css";
import "../CSS/Shared.css";

const SignUpPage = ({ setUser }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    password: "",
    position: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const positions = [
    { value: "", label: "Pick your position" },
    { value: "csr", label: "Customer Service Representative" },
    { value: "teamlead", label: "Team Lead" },
    { value: "procurement", label: "Procurement Staff" },
    { value: "warehouse", label: "Warehouse Staff" },
    { value: "accounting", label: "Accounting Staff" },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signup attempt:", formData);

    // Store user data in memory (fake signup)
    setUser({
      email: formData.email,
      fullName: formData.fullName,
      role: formData.position, // important for routing
    });

    // Redirect to dashboard
    navigate("/dashboard");
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="signup-container">
      {/* Header */}
      <header className="signup-header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-circle"></div>
            <span className="logo-text">Black Market</span>
          </div>
          <div className="header-actions">
            <button className="help-btn">?</button>
            <button className="login-btn" onClick={handleLoginRedirect}>
              Login
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="signup-main">
        <div className="signup-card">
          <div className="signup-form-container">
            <h1 className="signup-title">SIGN UP</h1>
            <p className="signup-subtitle">
              Start organizing your stock with efficiency and ease.
            </p>

            <form onSubmit={handleSubmit} className="signup-form">
              <div className="form-group">
                <div className="input-container">
                  <span className="input-icon">✉️</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input signup-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="input-container">
                  <span className="input-icon">👤</span>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="form-input signup-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="input-container">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-input signup-input"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <div className="select-container">
                  <span className="select-icon">▼</span>
                  <select
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className="form-select signup-select"
                    required
                  >
                    {positions.map((position) => (
                      <option key={position.value} value={position.value}>
                        {position.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button type="submit" className="signup-submit-btn">
                Sign up
              </button>

              <div className="signup-footer">
                <p className="login-prompt">Already have an account?</p>
                <button
                  type="button"
                  className="login-link-btn"
                  onClick={handleLoginRedirect}
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignUpPage;
