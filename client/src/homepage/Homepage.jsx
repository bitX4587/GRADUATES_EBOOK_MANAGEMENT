import React from "react";
import { Link } from "react-router-dom";
import "./Homepage.css";

const Homepage = () => {
  return (
    <div className="Homepage">
      <Link to="/register" type="button" className="btn btn-primary">
        Register <i className="fa-solid fa-user-plus"></i>
      </Link>
      <Link to="/login" type="button" className="btn btn-info">
        Login
      </Link>
    </div>
  );
};

export default Homepage;
