import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import axios from "axios";
import Header from "./header";
import Navbar from "./navbar";
import "./layout-style.css";

const Layout = ({ darkMode, toggleDarkMode }) => {
  const [showNavbar, setShowNavbar] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);
  const [admin, setAdmin] = useState(null); // Store admin info
  const location = useLocation();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/dashboardAdmin`,
          { withCredentials: true }
        );
        setAdmin(response.data.admin);
      } catch (error) {
        console.error("Error fetching admin data:", error);
        setAdmin(null);
      }
    };

    fetchAdminData();
  }, []);

  const toggleNavbar = () => {
    if (showNavbar) {
      setAnimateOut(true);
      setTimeout(() => {
        setShowNavbar(false);
        setAnimateOut(false);
      }, 300);
    } else {
      setShowNavbar(true);
    }
  };

  const hideHeaderRoutes = ["/newsfeed"];
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  const hideNavbarRoutes = ["/newsfeed"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  // Check if user is admin based on fetched admin data
  // If admin data exists, assume it's an admin; otherwise, treat as user
  const isAdmin = admin !== null;

  return (
    <>
      {!shouldHideHeader && (
        <Header
          toggleNavbar={toggleNavbar}
          showNavbar={showNavbar}
          isAdmin={isAdmin}
          darkMode={darkMode}
          cycle={toggleDarkMode}
        />
      )}

      <div className="navbar-wrapper">
        {/* Show navbar only if NOT admin */}
        {showNavbar && !shouldHideNavbar && !isAdmin && (
          <Navbar
            toggleNavbar={toggleNavbar}
            cycle={toggleDarkMode}
            darkMode={darkMode}
            slideOut={animateOut}
          />
        )}
      </div>

      <Outlet />
    </>
  );
};

export default Layout;
