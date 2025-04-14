import React, { useState } from "react";
import "./registerAdmin.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const AddAdmin = () => {
  const [admin, setAdmin] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    is_admin: 1,
  });
  const [image, setImage] = useState(null);

  const navigate = useNavigate();

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setAdmin({ ...admin, [name]: value });
  };

  const fileHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const submitForm = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Wrap the user data in an array
    const adminData = [
      {
        name: admin.name,
        email: admin.email,
        mobile: admin.mobile,
        password: admin.password,
        is_admin: admin.is_admin,
      },
    ];

    formData.append("admin", JSON.stringify(adminData)); // Append as JSON string

    // Append the image separately
    formData.append("image", image);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/admin",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(response.data.message, { position: "top-right" });
      navigate("/");
    } catch (error) {
      console.log("hey im listening");
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message, { position: "top-right" });
      } else {
        toast.error("Something went wrong!", { position: "top-right" });
      }
    }
  };

  return (
    <div className="registerAdminBackground">
      <div className="addAdmin">
        <Link to="/register" type="button" className="btn btn-secondary">
          <i className="fa-solid fa-backward"></i> User
        </Link>
        <h3>Register Admin</h3>
        <form
          className="addAdminForm"
          encType="multipart/form-data"
          onSubmit={submitForm}
        >
          <div className="inputGroup">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              onChange={inputHandler}
              placeholder="Enter Your Name"
              autoComplete="off"
              required
            />
          </div>
          <div className="inputGroup">
            <label htmlFor="name">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={inputHandler}
              placeholder="Enter Your Email"
              autoComplete="off"
              required
            />
          </div>
          <div className="inputGroup">
            <label htmlFor="name">Mobile:</label>
            <input
              type="text"
              id="mobile"
              name="mobile"
              onChange={inputHandler}
              placeholder="Enter Your Mobile"
              autoComplete="off"
              required
            />
          </div>
          <div className="inputGroup">
            <label htmlFor="name">Image:</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={fileHandler}
              required
            />
          </div>
          <div className="inputGroup">
            <label htmlFor="name">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={inputHandler}
              placeholder="Enter Your Password"
              autoComplete="off"
              required
            />
          </div>
          <div className="inputGroup">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAdmin;
