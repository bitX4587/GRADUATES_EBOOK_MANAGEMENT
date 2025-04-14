import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const ForgetPassword = () => {
  const [email, setEmail] = useState(""); // Step 1: Initialize email state
  const navigate = useNavigate();

  // Step 2: Handle the change event to update the email state
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const submitForm = async (e) => {
    e.preventDefault();

    // Ensure email is provided
    if (!email) {
      toast.error("Email is required!", { position: "top-right" });
      return;
    }

    // Send email to the server
    await axios
      .post("http://localhost:8000/api/forget", { email })
      .then((response) => {
        toast.success(response.data.message, { position: "top-right" });
        navigate("/profile");
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.message, { position: "top-right" });
        } else {
          toast.error("Something went wrong!", { position: "top-right" });
        }
      });
  };

  return (
    <>
      <form className="addUserForm" onSubmit={submitForm}>
        <div>Forget Password</div>
        <div className="inputGroup">
          <label>Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email} // Step 3: Bind the state to the input field
            onChange={handleEmailChange} // Handle input change
            autoComplete="off"
            placeholder="Enter Your Email"
          />
        </div>
        <div className="inputGroup">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
      <div>
        <Link to="/profile">Back</Link>
      </div>
    </>
  );
};

export default ForgetPassword;
