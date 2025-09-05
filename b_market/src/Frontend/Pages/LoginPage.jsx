import React, { useState } from "react";
import "../CSS/Login.css";
import "../CSS/shared.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempt:", formData);
  };

  const handleSignUpRedirect = () => {
    // Handle navigation to sign up page
    window.location.href = "/signup";
  };

  return (
    <div className="login-container">
      {/* Header */}
      <header className="login-header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-circle"></div>
            <span className="logo-text">Black Market</span>
          </div>
          <div className="header-actions">
            <button className="help-btn">?</button>
            <button className="signup-btn">Sign up</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="login-main">
        <div className="login-card">
          <div className="login-form-container">
            <h1 className="login-title">LOGIN</h1>
            <p className="login-subtitle">
              Log in to manage stock, monitor sales, and stay updated—anytime,
              anywhere.
            </p>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <div className="input-container">
                  <span className="input-icon"></span>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email or Staff ID"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input login-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="input-container">
                  <span className="input-icon"></span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-input login-input"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "👁" : "👁"}
                  </button>
                </div>
              </div>

              <button type="submit" className="login-submit-btn">
                Login
              </button>

              <div className="login-footer">
                <p className="signup-prompt">Don't have an account yet?</p>
                <button
                  type="button"
                  className="signup-link-btn"
                  onClick={handleSignUpRedirect}
                >
                  Sign up
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
