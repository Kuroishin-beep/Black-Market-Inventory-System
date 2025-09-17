import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient"; // import your supabase client
import "../styles/Login.css";
import "../styles/Shared.css";
import logo from "../assets/logo.png";
import { HiQuestionMarkCircle } from "react-icons/hi2";
import { FaUser  } from "react-icons/fa6";
import { MdLock } from "react-icons/md";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";

const LoginPage = ({ setUser  }) => {
  const navigate = useNavigate();

  // Add state for form data and error
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  // Update formData on input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit with Supabase login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const { email, password } = formData;

    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    // Fetch user role from your 'users' table
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (userError) {
      setErrorMsg("Failed to fetch user role.");
      setLoading(false);
      return;
    }

    setUser ({ id: data.user.id, email: data.user.email, role: userData.role });
    setLoading(false);
    navigate("/dashboard");
  };

  const handleSignUpRedirect = () => {
    navigate("/signup");
  };

  return (
    <div className="login-container">
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
          <button
            className="login-header__button--signup"
            onClick={handleSignUpRedirect}
          >
            Sign up
          </button>
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

          {/* Add onSubmit handler here */}
          <form onSubmit={handleSubmit}>
            <div className="login-card__form">
              <div className="login-card__input-wrapper">
                <FaUser  className="login-card__icon" />
                {/* Add name, value, onChange */}
                <input
                  type="text"
                  name="email"
                  placeholder="Email or Staff ID"
                  className="login-card__form--email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="login-card__form">
              <div className="login-card__input-wrapper">
                <MdLock className="login-card__icon" />
                {/* Add name, value, onChange */}
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className="login-card__form--password"
                  value={formData.password}
                  onChange={handleChange}
                  required
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

            {/* Show error message if any */}
            {errorMsg && (
              <p style={{ color: "red", marginTop: "10px" }}>{errorMsg}</p>
            )}

            {/* Add disabled and loading text */}
            <button
              type="submit"
              className="login-card__form--login"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="login-card__form--footer">
              Don't have an account yet?
            </p>

            <button
              type="button"
              className="login-card__form--signup"
              onClick={handleSignUpRedirect}
            >
              Signup
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
