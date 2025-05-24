import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        // Send a request to the server to log out (clear the JWT cookie)
        await axios.get(`${process.env.REACT_APP_API_URL}/api/logout`, {
          withCredentials: true, // Make sure cookies are included with the request
        });

        // Redirect to the login page after successful logout
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
