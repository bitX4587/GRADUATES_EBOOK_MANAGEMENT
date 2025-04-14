import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import "./loginUser.css";

const LoginUser = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      const response = await axios.post(
        "http://localhost:8000/api/login",
        { email, password },
        { withCredentials: true } // to maintain the session cookie
      );

      console.log(response.data);

      // If user is not verified, set error
      if (response.data.message === "Please verify your email") {
        setError("User not verified. Please verify your email.");
      } else {
        setError(""); // Clear any previous error

        // Store course information (from session) to sessionStorage or state
        sessionStorage.setItem("course", response.data.course); // Use sessionStorage instead of localStorage for session-based data
        sessionStorage.setItem("userId", response.data.userId);
        sessionStorage.setItem("targetId", response.data.targetId || ""); // Store the targetId (if applicable)

        navigate("/dashboard"); // Redirect to home if the user is verified
      }
    } catch (error) {
      // Log the error structure to help with debugging
      console.log("Error response:", error.response);

      // Handle specific cases based on the error response
      if (
        error.response &&
        error.response.data &&
        error.response.data.message === "Please verify your email"
      ) {
        setError("User not verified. Please verify your email.");
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.message === "Email and Password are incorrect"
      ) {
        setError("Invalid username or password.");
      } else {
        // This will cover any unexpected errors (e.g., server issues)
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="loginBackground">
      <div className="login-container">
        <form onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <br />
          <br />
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <br />
          <br />
          <input type="submit" value="Login" />
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <br />
        <Link to="/">Back</Link>
        <br />
        <Link to="/loginAdmin">Admin Login</Link>
      </div>
    </div>
  );
};

export default LoginUser;
