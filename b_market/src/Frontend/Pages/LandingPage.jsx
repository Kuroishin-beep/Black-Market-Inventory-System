import React from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/Landing.css";
import "../CSS/Shared.css";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/signup");
  };

  const handleStartManaging = () => {
    navigate("/signup");
  };

  return (
    <div className="landing-container">
      {/* Header */}
      <header className="landing-header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-circle"></div>
            <span className="logo-text">Black Market</span>
          </div>
          <div className="header-actions">
            <button className="help-btn">?</button>
            <button className="get-started-btn" onClick={handleGetStarted}>
              Get Started Today
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Hero Card */}
      <main className="landing-main">
        <div className="hero-card">
          <h1 className="hero-title">Simplify Your Inventory Management</h1>
          <p className="hero-subtitle">
            Track stock, purchases, and sales in real
            <br />
            time—all from one clean dashboard.
          </p>
          <button className="start-managing-btn" onClick={handleStartManaging}>
            Start Managing Today
          </button>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
