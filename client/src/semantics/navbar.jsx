import React from "react";
import { Link } from "react-router-dom";
import "./navbar-style.css";

const Navbar = ({ toggleNavbar, cycle, darkMode, slideOut }) => {
  return (
    <div className={`navbar-cont ${slideOut ? "slide-out" : "slide-in"}`}>
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
            color: darkMode ? "black" : "darkorange",
          }}
        ></i>
      </button>

      <button className="icon-btn" onClick={toggleNavbar} title="Menu">
        <i className="fa-solid fa-bars"></i>
      </button>

      <Link className="icon-btn" to="/dashboard" title="Dashboard">
        <i className="fa-solid fa-users"></i>
      </Link>
      <Link className="icon-btn" to="/course" title="Courses">
        <i className="fa-solid fa-graduation-cap"></i>
      </Link>
      <Link className="icon-btn" to="/profile" title="Profile">
        <i className="fa-solid fa-circle-user"></i>
      </Link>
      <Link className="icon-btn" to="/setting" title="Settings">
        <i className="fa-solid fa-gear"></i>
      </Link>
      <Link className="icon-btn" to="/logout" title="Logout">
        <i className="fa-solid fa-right-from-bracket"></i>
      </Link>
    </div>
  );
};

export default Navbar;
