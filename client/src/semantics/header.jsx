import React from "react";
import Logo from "./logo.png";
import "./header-style.css";

const Header = ({ toggleNavbar, showNavbar, isAdmin, darkMode, cycle }) => {
  return (
    <>
      <div className="header-container">
        <div className="header-left-cont">
          {isAdmin ? (
            // Show theme toggle button for admin
            <button
              className="icon-btn theme-toggle-icon"
              onClick={cycle}
              title="Toggle Theme"
            >
              <i
                className="fa-solid fa-circle-half-stroke"
                style={{
                  transform: darkMode ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease, color 0.3s ease",
                  color: darkMode ? "darkorange" : "black",
                }}
              ></i>
            </button>
          ) : (
            // Show hamburger menu for normal user
            <button
              className="icon-btn-burger"
              onClick={toggleNavbar}
              title="Menu"
            >
              <i
                className={`fa-solid ${showNavbar ? "fa-xmark" : "fa-bars"}`}
                aria-hidden="true"
              ></i>
            </button>
          )}
        </div>

        <div className="header-mid-cont">
          <p>Northwest Samar</p>
          <p>State University</p>
        </div>

        <div className="header-right-cont">
          <i className="fa-solid fa-envelope"></i>
          <i className="fa-solid fa-bell"></i>
          <img src={Logo} alt="Logo" />
        </div>
      </div>
    </>
  );
};

export default Header;
