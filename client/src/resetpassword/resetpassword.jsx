import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import "./resetpassword-style.css";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const submitForm = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email and password are required!", {
        position: "top-right",
      });
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/resetpassword",
        {
          email,
          newPassword: password,
        }
      );

      toast.success(response.data.message, { position: "top-right" });
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.data?.message) {
        toast.error(error.response.data.message, { position: "top-right" });
      } else {
        toast.error("Something went wrong!", { position: "top-right" });
      }
    }
  };

  return (
    <div className="resetpasswordBG">
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="card shadow-lg p-4 modern-card">
          <h3 className="text-center mb-4">🔐 Reset Password</h3>
          <form className="resetPasswordUserForm" onSubmit={submitForm}>
            <div className="mb-3">
              <label className="form-label">📧 Email:</label>
              <input
                type="email"
                className="form-control modern-input"
                value={email}
                onChange={handleEmailChange}
                autoComplete="off"
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">🔑 New Password:</label>
              <input
                type="password"
                className="form-control modern-input"
                value={password}
                onChange={handlePasswordChange}
                autoComplete="off"
                placeholder="Enter your new password"
              />
            </div>

            <div className="d-grid">
              <button type="submit" className="btn modern-btn">
                Submit
              </button>
            </div>
          </form>

          <div className="text-center mt-3">
            <Link to="/profile" className="text-decoration-none">
              ← Back to Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
