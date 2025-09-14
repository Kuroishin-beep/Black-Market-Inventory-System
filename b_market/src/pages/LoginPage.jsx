import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import "../styles/Shared.css";
import logo from "../assets/logo.png";
import { HiQuestionMarkCircle } from "react-icons/hi2";
import { FaUser } from "react-icons/fa6";
import { MdLock } from "react-icons/md";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";

const LoginPage = ({ setUser }) => {
  const navigate = useNavigate();

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

    // For demo purposes, set a fake role based on email
    // In real app, this would come from authentication response
    let role = "csr"; // default
    if (formData.email.includes("teamlead")) role = "teamlead";
    else if (formData.email.includes("procurement")) role = "procurement";
    else if (formData.email.includes("warehouse")) role = "warehouse";
    else if (formData.email.includes("accounting")) role = "accounting";

    setUser({ role });

    // After successful login, redirect to dashboard
    navigate("/dashboard");
  };

  const handleSignUpRedirect = () => {
    navigate("/signup");
  };

  return (
    <div className="login-container">
      {/* BACKGROUND */}
      <div className="login-container__circle--large"></div>
      <div className="login-container__circle--small"></div>

      {/* HEADER */}
      <header className="login-header">
        <div className="login-header__app">
          <img className="login-header__app--logo" src={logo} alt="logo" />
          <h1 className="login-header__app--name">Black Market</h1>
        </div>

        <div className="login-header__button">
          <button className="login-header__button--query">
            <HiQuestionMarkCircle />
          </button>
          <button className="login-header__button--signup">Sign up</button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="login-card">
        <div className="login-card__box">
          <h1 className="login-card__title">LOGIN</h1>
          <p className="login-card__description">
            Log in to manage stock, monitor sales, and <br /> stay
            updated—anytime, anywhere.
          </p>

          <form action="">
            <div className="login-card__form">
              <div className="login-card__input-wrapper">
                <FaUser className="login-card__icon" />
                <input
                  type="text"
                  placeholder="Email or Staff ID"
                  className="login-card__form--email"
                />
              </div>
            </div>

            <div className="login-card__form">
              <div className="login-card__input-wrapper">
                <MdLock className="login-card__icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="login-card__form--password"
                />
                <button
                  type="button"
                  className="login-card__password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <IoEyeOff /> : <IoEye />}
                </button>
              </div>
            </div>

            <button className="login-card__form--login">Login</button>

            <p className="login-card__form--footer">
              Don't have an account yet?
            </p>

            <button className="login-card__form--signup">Signup</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
