import React from "react";
import Logo from "./logo.png";
import "./header-style.css";

const Header = ({ toggleNavbar, showNavbar }) => {
  return (
    <>
      <div className="header-container">
        <div className="header-left-cont">
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
