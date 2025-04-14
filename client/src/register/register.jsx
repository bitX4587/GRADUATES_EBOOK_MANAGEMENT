import React, { useState } from "react";
import "./registerUser.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const AddUser = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileError, setMobileError] = useState("");
  const [image, setImage] = useState(null);

  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    courseRoadmap: "",
  });

  const validateMobile = (mobile) => {
    const regex = /^[0-9]{11}$/; // Example for a 10-digit number
    return regex.test(mobile);
  };

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });

    if (name === "mobile" && !validateMobile(value)) {
      setMobileError("Please enter a valid 11-digit mobile number.");
    } else {
      setMobileError("");
    }
  };

  const fileHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Disable submit button

    const formData = new FormData();

    // Wrap the user data in an array
    const userData = [
      {
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        password: user.password,
        course: user.courseRoadmap,
      },
    ];

    formData.append("user", JSON.stringify(userData)); // Append as JSON string

    // Append the image separately
    formData.append("image", image);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/user",
        formData
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
    } finally {
      setIsSubmitting(false); // Enable submit button again
    }
  };

  return (
    <div className="registerBackground">
      <div className="addUser">
        <Link to="/" type="button" className="btn btn-secondary">
          <i className="fa-solid fa-backward"></i> Back
        </Link>
        <Link to="/registerAdmin" type="button" className="btn btn-secondary">
          <i className="fa-solid fa-backward"></i> Admin
        </Link>
        <h3>Register User</h3>
        <form
          className="addUserForm"
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
              maxLength={11}
            />
            {mobileError && <div className="error">{mobileError}</div>}
          </div>
          <div className="inputGroup">
            <label htmlFor="courseRoadmap">Course Roadmap:</label>
            <select
              id="courseRoadmap"
              name="courseRoadmap"
              value={user.courseRoadmap}
              onChange={inputHandler}
              required
            >
              <option value="">-- Select a Roadmap --</option>
              <option value="CE">Civil Engineering</option>
              <option value="ME">Mechanical Engineering</option>
            </select>
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
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
