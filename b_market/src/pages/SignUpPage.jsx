import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient"; // Import your supabase client
import "../styles/SignUp.css";
import "../styles/Shared.css";
import logo from "../assets/logo.png";
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
    position: "", // This will store the selected role
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null); // State for error messages
  const [loading, setLoading] = useState(false); // State for loading indicator

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const { email, fullName, password, position } = formData;

    if (!email || !fullName || !password || !position) {
      setErrorMsg("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      // 1. Sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: position, // still useful for metadata
          },
        },
      });

      if (authError) {
        setErrorMsg(authError.message);
        setLoading(false);
        return;
      }

      if (authData.user) {
        // 2. Look up role_id from roles table
        const { data: roleData, error: roleError } = await supabase
          .from("roles")
          .select("id")
          .eq("role", position)
          .single();
        console.log("roleData:", roleData, "roleError:", roleError);

        if (roleError || !roleData) {
          setErrorMsg("Invalid role selected.");
          setLoading(false);
          return;
        }

        const roleId = roleData.id;

        // 3. Check if employee already exists
        const { data: existingEmp, error: existingEmpError } = await supabase
          .from("employees")
          .select("id")
          .eq("id", authData.user.id)
          .single();
        if (existingEmp && existingEmp.id) {
          // Employee already exists, proceed to dashboard
          setUser({
            id: authData.user.id,
            email: authData.user.email,
            fullName: fullName,
            roleId,
          });
          navigate("/dashboard");
          setLoading(false);
          return;
        }

        // 4. Insert into employees table if not exists
        const { data: empData, error: empError } = await supabase.from("employees").insert([
          {
            id: authData.user.id, // same UUID as auth.users
            email: email,
            full_name: fullName,
            role_id: roleId,
          },
        ]);
        console.log("empData:", empData, "empError:", empError);

        if (empError) {
          // If duplicate key error, treat as success
          if (empError.code === '23505' || (empError.message && empError.message.includes('duplicate key'))) {
            setUser({
              id: authData.user.id,
              email: authData.user.email,
              fullName: fullName,
              roleId,
            });
            navigate("/dashboard");
            setLoading(false);
            return;
          } else {
            console.error("Error inserting employee:", empError);
            setErrorMsg("Account created, but failed to save employee record. " + (empError.message || ""));
            setLoading(false);
            return;
          }
        }

        // 5. Set user state and go to dashboard
        setUser({
          id: authData.user.id,
          email: authData.user.email,
          fullName: fullName,
          roleId,
        });
        navigate("/dashboard");
      } else {
        setErrorMsg("Please check your email to confirm your account.");
      }
    } catch (error) {
      console.error("Unexpected error during signup:", error);
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
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
          <button
            className="signup-header__button--signup"
            onClick={handleLoginRedirect} // Changed to handleLoginRedirect
          >
            Login
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="signup-card">
        <div className="signup-card__box">
          <h1 className="signup-card__title">SIGN UP</h1>
          <p className="signup-card__description">
            Start organizing your stock with <br /> efficiency and ease.
          </p>

          <form onSubmit={handleSubmit}> {/* Added onSubmit handler */}
            <div className="signup-card__form">
              <div className="signup-card__input-wrapper">
                <IoMail className="signup-card__icon" />
                <input
                  type="email"
                  name="email" // Added name attribute
                  placeholder="Email"
                  className="signup-card__form--email"
                  value={formData.email} // Controlled component
                  onChange={handleChange} // Handle changes
                  required
                />
              </div>
            </div>

            <div className="signup-card__form">
              <div className="signup-card__input-wrapper">
                <FaUser className="signup-card__icon" />
                <input
                  type="text"
                  name="fullName" // Added name attribute
                  placeholder="Full Name"
                  className="signup-card__form--name"
                  value={formData.fullName} // Controlled component
                  onChange={handleChange} // Handle changes
                  required
                />
              </div>
            </div>

            <div className="signup-card__form">
              <div className="signup-card__input-wrapper">
                <MdLock className="signup-card__icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password" // Added name attribute
                  placeholder="Password"
                  className="signup-card__form--password"
                  value={formData.password} // Controlled component
                  onChange={handleChange} // Handle changes
                  required
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
                  name="position" // Added name attribute to match formData
                  value={formData.position} // Controlled component
                  onChange={handleChange} // Handle changes
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

            {/* Show error message if any */}
            {errorMsg && (
              <p style={{ color: "red", marginTop: "10px", textAlign: "center" }}>{errorMsg}</p>
            )}

            <button
              type="submit"
              className="signup-card__form--signup"
              disabled={loading} // Disable button during loading
            >
              {loading ? "Signing up..." : "Signup"}
            </button>

            <p className="signup-card__form--footer">
              Already have an account?
            </p>

            <button
              type="button"
              className="signup-card__form--login"
              onClick={handleLoginRedirect}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
