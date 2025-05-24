import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./header";
import Navbar from "./navbar";
import "./layout-style.css";

const Layout = ({ darkMode, toggleDarkMode }) => {
  const [showNavbar, setShowNavbar] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);

  const location = useLocation(); // Get current route

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

  const hideHeaderRoutes = ["/newsfeed"]; // List routes where header should be hidden
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  const hideNavbarRoutes = ["/newsfeed"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideHeader && (
        <Header toggleNavbar={toggleNavbar} showNavbar={showNavbar} />
      )}

      <div className="navbar-wrapper">
        {showNavbar && !shouldHideNavbar && (
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
