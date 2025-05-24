import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const PrivateRoute = ({ element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/check`,
          {
            withCredentials: true,
          }
        );
        console.log("✅ Authenticated:", res.data.user);
        setIsAuthenticated(true);
      } catch (error) {
        console.log("❌ Not authenticated");
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Or a spinner
  }

  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
