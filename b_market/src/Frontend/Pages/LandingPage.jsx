import React from "react";
import "../CSS/Landing.css";
import "../CSS/shared.css";

const LandingPage = () => {
  const handleGetStarted = () => {
    // Handle navigation to login/signup page
    window.location.href = "/login";
  };

  const handleStartManaging = () => {
    // Handle navigation to login/signup page
    window.location.href = "/login";
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
              Get Started
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
