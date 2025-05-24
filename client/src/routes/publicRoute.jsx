import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie"; // Import js-cookie

const PublicRoute = ({ element, restricted, ...rest }) => {
  const token = Cookies.get("token");
  if (restricted && token) {
    return <Navigate to="/dashboard" />;
  }
  return element;
};

export default PublicRoute;
