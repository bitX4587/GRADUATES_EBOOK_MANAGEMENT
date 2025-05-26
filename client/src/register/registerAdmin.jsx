import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "./register-style.css";

const AddAdmin = ({ onCancel, onSwitchToUser }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileError, setMobileError] = useState("");

  const [admin, setAdmin] = useState({
    name: "",
    email: "",
    mobile: "",
    SchoolID: "",
    password: "",
    is_admin: "",
    is_admin_token: "",
  });
  const [image, setImage] = useState(null);

  const validateMobile = (mobile) => {
    const regex = /^[0-9]{11}$/; // Example for a 10-digit number
    return regex.test(mobile);
  };

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setAdmin({ ...admin, [name]: value });

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
    const adminData = [
      {
        name: admin.name,
        email: admin.email,
        mobile: admin.mobile,
        SchoolID: admin.SchoolID,
        password: admin.password,
        is_admin: admin.is_admin,
        is_admin_token: admin.is_admin_token,
      },
    ];

    formData.append("admin", JSON.stringify(adminData));

    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios.post(
        `
        ${process.env.REACT_APP_API_URL}/api/admin`,
        formData
      );
      toast.success(response.data.message, { position: "top-right" });
      if (onCancel) {
        onCancel();
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message, { position: "top-right" });
      } else {
        toast.error(error.response.data.message, { position: "top-right" });
      }
    }
  };

  return (
    <div className="position-relative text-white">
      <div className="d-flex justify-content-center align-items-center h-100 position-relative z-2 p-0">
        <div className="row w-100 ">
          {/* Right Side Form */}
          <div className="d-flex p-0">
            <form
              onSubmit={submitForm}
              encType="multipart/form-data"
              className="p-4 w-100"
            >
              <div className="container-btn d-flex justify-content-between mb-3">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onSwitchToUser}
                >
                  <i className="fa-solid fa-backward"></i> User
                </button>
              </div>

              <h3 className="text-center m-4 text-white">REGISTER ADMIN</h3>

              <div className="row g-3 text-white">
                <div className="col-md-6">
                  <label htmlFor="name" className="form-label">
                    Name:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    onChange={inputHandler}
                    placeholder="Enter Your Name"
                    autoComplete="off"
                    required
                  />
                </div>

                <div className="col-md-6 position-relative">
                  <label htmlFor="mobile" className="form-label">
                    Mobile:
                  </label>
                  <input
                    type="text"
                    id="mobile"
                    name="mobile"
                    onChange={inputHandler}
                    placeholder="Enter Your Mobile"
                    autoComplete="off"
                    required
                    maxLength={11}
                    className="form-control"
                  />
                  {mobileError && (
                    <div
                      className="position-absolute text-danger mt-1 bg-white px-2 py-1 border rounded"
                      style={{ zIndex: 1000 }}
                    >
                      {mobileError}
                    </div>
                  )}
                </div>

                <div className="col-md-6">
                  <label htmlFor="email" className="form-label">
                    Email:
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    onChange={inputHandler}
                    placeholder="Enter Your Email"
                    autoComplete="off"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="password" className="form-label">
                    Password:
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    onChange={inputHandler}
                    placeholder="Enter Your Password"
                    autoComplete="off"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="is_admin_token" className="form-label">
                    Enter Admin Key Token:
                  </label>
                  <input
                    className="form-control"
                    id="is_admin_token"
                    name="is_admin_token"
                    onChange={inputHandler}
                    placeholder="Enter Admin Key Token"
                    autoComplete="off"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="is_admin" className="form-label">
                    Enter Admin Key:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="is_admin"
                    name="is_admin"
                    onChange={inputHandler}
                    placeholder="Enter Admin Key"
                    autoComplete="off"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="SchoolID" className="form-label">
                    University:
                  </label>
                  <select
                    id="SchoolID"
                    name="SchoolID"
                    value={admin.SchoolID}
                    onChange={inputHandler}
                    required
                    className="form-select"
                  >
                    <option value="">-- Select a University --</option>
                    <option value="0">Northwest Samar State University</option>
                    <option value="1">Samar State University</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label htmlFor="image" className="form-label">
                    Image:
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="image"
                    name="image"
                    onChange={fileHandler}
                    required
                  />
                </div>

                <div className="d-grid mt-5">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAdmin;
