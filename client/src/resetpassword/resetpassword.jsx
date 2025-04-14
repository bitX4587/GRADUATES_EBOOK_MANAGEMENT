import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Extract token from query string
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const submitForm = async (e) => {
    e.preventDefault();

    if (!password) {
      toast.error("Password is required!", { position: "top-right" });
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8000/api/resetpassword`,
        {
          token, // send token in body now
          newPassword: password,
        }
      );

      toast.success(response.data.message, { position: "top-right" });
      navigate("/");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message, { position: "top-right" });
      } else {
        toast.error("Something went wrong!", { position: "top-right" });
      }
    }
  };

  return (
    <form className="addUserForm" onSubmit={submitForm}>
      <div>Reset Password</div>
      <div className="inputGroup">
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          autoComplete="off"
          placeholder="Enter Your Password"
        />
      </div>
      <div className="inputGroup">
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </div>
    </form>
  );
};

export default ResetPassword;
