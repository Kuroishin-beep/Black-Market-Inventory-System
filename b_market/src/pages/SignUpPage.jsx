// src/Frontend/Pages/SignUpPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SignUp.css";
import "../styles/Shared.css";
import logo from "../assets/logo.png";
import { HiQuestionMarkCircle } from "react-icons/hi2";
import { FaUser } from "react-icons/fa6";
import { MdLock } from "react-icons/md";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { IoMail } from "react-icons/io5";
import { FaCaretDown } from "react-icons/fa";

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
      {/* BACKGROUND */}
      <div className="signup-container__circle--large"></div>
      <div className="signup-container__circle--small"></div>

      {/* HEADER */}
      <header className="signup-header">
        <div className="signup-header__app">
          <img className="signup-header__app--logo" src={logo} alt="logo" />
          <h1 className="signup-header__app--name">Black Market</h1>
        </div>

        <div className="signup-header__button">
          <button className="signup-header__button--query">
            <HiQuestionMarkCircle />
          </button>
          <button className="signup-header__button--signup">Login</button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="signup-card">
        <div className="signup-card__box">
          <h1 className="signup-card__title">SIGN UP</h1>
          <p className="signup-card__description">
            Start organizing your stock with <br /> efficiency and ease.
          </p>

          <form action="">
            <div className="signup-card__form">
              <div className="signup-card__input-wrapper">
                <IoMail className="signup-card__icon" />
                <input
                  type="email"
                  placeholder="Email"
                  className="signup-card__form--email"
                />
              </div>
            </div>

            <div className="signup-card__form">
              <div className="signup-card__input-wrapper">
                <FaUser className="signup-card__icon" />
                <input
                  type="text"
                  placeholder="Full Name"
                  className="signup-card__form--name"
                />
              </div>
            </div>

            <div className="signup-card__form">
              <div className="signup-card__input-wrapper">
                <MdLock className="signup-card__icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="signup-card__form--password"
                />
                <button
                  type="button"
                  className="signup-card__password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <IoEyeOff /> : <IoEye />}
                </button>
              </div>
            </div>

            <div className="signup-card__form">
              <div className="signup-card__input-wrapper">
                <FaCaretDown className="signup-card__icon" />
                <select
                  className="signup-card__position"
                  id="job-title"
                  name="job-title"
                  defaultValue=""
                >
                  {positions.map((position) => (
                    <option key={position.value} value={position.value}>
                      {position.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button className="signup-card__form--signup">Signup</button>

            <p className="signup-card__form--footer">
              Don't have an account yet?
            </p>

            <button className="signup-card__form--login">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
