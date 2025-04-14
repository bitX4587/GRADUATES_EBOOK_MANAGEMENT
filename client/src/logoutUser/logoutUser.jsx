// Logout.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        await axios.get(
          "http://localhost:8000/api/logout",
          {},
          { withCredentials: true }
        );
        // Redirect to login page after successful logout
        navigate("/login");
      } catch (error) {
        console.error("Error logging out", error);
      }
    };

    logoutUser();
  }, [navigate]);

  return <div>Logging out...</div>;
};

export default Logout;
