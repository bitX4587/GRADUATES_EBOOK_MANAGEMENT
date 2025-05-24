import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "./register-style.css";

const AddUser = ({ onCancel, onSwitchToAdmin }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileError, setMobileError] = useState("");
  const [image, setImage] = useState(null);
  const [adminList, setAdminList] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);

  const [user, setUser] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    courseRoadmap: "",
    SchoolID: "",
    graduationYear: "",
  });

  // 👇 Fetch all admins on load
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/admins")
      .then((res) => {
        console.log("Admins:", res.data); // Check here
        setAdminList(res.data);
      })
      .catch((err) => {
        console.error("Error fetching admins", err);
        console.log(err.response.data.message);
      });
  }, []);

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

    if (name === "SchoolID") {
      if (value === "") {
        setFilteredAdmins([]); // Reset admin list
      } else {
        const filtered = adminList.filter(
          (admin) => admin?.SchoolID?.toString() === value
        );
        setFilteredAdmins(filtered);
      }
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
        SchoolID: user.SchoolID,
        graduationYear: user.graduationYear,
        is_admin: user.is_admin, // 👈 add this
      },
    ];

    formData.append("user", JSON.stringify(userData)); // Append as JSON string

    // Append the image separately
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/user",
        formData
      );
      toast.success(response.data.message, { position: "top-right" });
      if (onCancel) {
        onCancel();
      }
    } catch (error) {
      console.log(error.response.data.message);
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
    <div className="position-relative text-white">
      <div className="d-flex justify-content-center align-items-center h-100 position-relative z-2 p-0">
        <div className="row w-100">
          {/* Right Side Form */}
          <div className="d-flex p-0">
            <form
              onSubmit={submitForm}
              encType="multipart/form-data"
              className="p-4 shadow w-100 "
              style={{
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
                borderRadius: "0",
              }}
            >
              <div className="container-btn d-flex justify-content-between mb-3">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onCancel}
                >
                  <i className="fa-solid fa-backward"></i> Back
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onSwitchToAdmin}
                >
                  Admin <i className="fa-solid fa-forward"></i>
                </button>
              </div>
              <h3 className="text-center mb-4 text-white">REGISTER USER</h3>

              <div className="row g-3 text-white">
                <div className="col-md-6">
                  <label htmlFor="name" className="form-label">
                    Name:
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    onChange={inputHandler}
                    placeholder="Enter Your Name"
                    autoComplete="off"
                    required
                    className="form-control"
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
                    id="email"
                    name="email"
                    onChange={inputHandler}
                    placeholder="Enter Your Email"
                    autoComplete="off"
                    required
                    className="form-control"
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="password" className="form-label">
                    Password:
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    onChange={inputHandler}
                    placeholder="Enter Your Password"
                    autoComplete="off"
                    required
                    className="form-control"
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="graduationYear" className="form-label">
                    Graduation Year:
                  </label>
                  <select
                    id="graduationYear"
                    name="graduationYear"
                    value={user.graduationYear}
                    onChange={inputHandler}
                    required
                    className="form-select"
                  >
                    <option value="">-- Select Year --</option>
                    {Array.from({ length: 30 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="col-md-6">
                  <label htmlFor="image" className="form-label">
                    Image:
                  </label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    onChange={fileHandler}
                    required
                    className="form-control"
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="courseRoadmap" className="form-label">
                    Course Roadmap:
                  </label>
                  <select
                    id="courseRoadmap"
                    name="courseRoadmap"
                    value={user.courseRoadmap}
                    onChange={inputHandler}
                    required
                    className="form-select"
                  >
                    <option value="">-- Select a Roadmap --</option>
                    <option value="CE">Civil Engineering</option>
                    <option value="ME">Mechanical Engineering</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label htmlFor="is_admin" className="form-label">
                    Select Admin:
                  </label>
                  <select
                    id="is_admin"
                    name="is_admin"
                    value={user.is_admin}
                    onChange={inputHandler}
                    required
                    className="form-select"
                  >
                    <option value="">-- Choose an Admin --</option>
                    {filteredAdmins.map((admin) => (
                      <option
                        key={admin.SchoolID + admin.name}
                        value={admin.is_admin}
                      >
                        {admin.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="SchoolID" className="form-label">
                    University:
                  </label>
                  <select
                    id="SchoolID"
                    name="SchoolID"
                    value={user.SchoolID}
                    onChange={inputHandler}
                    required
                    className="form-select"
                  >
                    <option value="">-- Select a University --</option>
                    <option value="0">Northwest Samar State University</option>
                    <option value="1">Samar State University</option>
                  </select>
                </div>

                <div
                  className="d-grid"
                  style={{
                    marginTop: "23px",
                  }}
                >
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

export default AddUser;
