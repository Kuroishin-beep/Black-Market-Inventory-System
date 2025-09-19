import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Landing.css";
import "../styles/Shared.css";
import logo from "../assets/logo.png";
import { HiQuestionMarkCircle } from "react-icons/hi2";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* HEADER */}
      <header className="landing-header">
        <div className="landing-header__app">
          <img className="landing-header__app--logo" src={logo} alt="logo" />
          <h1 className="landing-header__app--name">Black Market</h1>
        </div>

        <div className="landing-header__button">
          <button
            className="landing-header__button--start"
            onClick={() => navigate("/signup")}
          >
            Get Started
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="landing-card">
        <div className="landing-card__box">
          <h1 className="landing-card__title">
            Simplify Your Inventory <br /> Management
          </h1>
          <p className="landing-card__description">
            Track stock, purchases, and sales in real <br /> time—all from one
            clean dashboard.
          </p>
          <button
            className="landing-card__button"
            onClick={() => navigate("/signup")}
          >
            Start Managing Today
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
