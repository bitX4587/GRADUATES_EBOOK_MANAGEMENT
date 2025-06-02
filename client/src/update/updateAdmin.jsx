import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const UpdateAdmin = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [admin, setAdmin] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    birthday: "",
    civil_status: "Single", // default value
    birthplace: "",
    nationality: "",
    religion: "",
  });
  const navigate = useNavigate();

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setAdmin((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/adminID`, {
        withCredentials: true,
      })
      .then((response) => {
        setAdmin(response.data.admin);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to load admin data.");
      });
  }, []);

  const submitForm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Disable submit button

    const formData = new FormData();
    formData.append("name", admin.name);
    formData.append("email", admin.email);
    formData.append("mobile", admin.mobile);
    formData.append("address", admin.address);
    formData.append("birthday", admin.birthday);
    formData.append("civil_status", admin.civil_status);
    formData.append("birthplace", admin.birthplace);
    formData.append("nationality", admin.nationality);
    formData.append("religion", admin.religion);

    try {
      const response = await axios.put(
        `
        ${process.env.REACT_APP_API_URL}/api/update/adminID`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      toast.success(response.data.message, { position: "top-right" });
      navigate("/profileAdmin");
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error(error.response.data.message, { position: "top-right" });
      } else {
        toast.error("Something went wrong!", { position: "top-right" });
      }
    } finally {
      setIsSubmitting(false); // Enable submit button again
    }
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <div className="container pt-5 pb-5 m-4 bg-white text-black rounded w-auto">
        <Link
          to="/profileAdmin"
          type="button"
          className="btn btn-secondary mb-3 text-decoration-none"
        >
          <i className="fa-solid fa-backward"></i> Back
        </Link>

        <h3 className="mb-4 text-center">Update Admin</h3>

        <form
          encType="multipart/form-data"
          onSubmit={submitForm}
          className="needs-validation row g-3"
          noValidate
        >
          {/* Name */}
          <div className="col-md-6">
            <label htmlFor="name" className="form-label">
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={admin.name}
              onChange={inputHandler}
              className="form-control"
              placeholder="Enter Your Name"
              required
            />
          </div>

          {/* Email */}
          <div className="col-md-6">
            <label htmlFor="email" className="form-label">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={admin.email}
              onChange={inputHandler}
              className="form-control"
              placeholder="Enter Your Email"
              required
            />
          </div>

          {/* Mobile */}
          <div className="col-md-6">
            <label htmlFor="mobile" className="form-label">
              Mobile:
            </label>
            <input
              type="text"
              id="mobile"
              name="mobile"
              value={admin.mobile}
              onChange={inputHandler}
              className="form-control"
              placeholder="Enter Your Mobile"
              required
            />
          </div>

          {/* Address */}
          <div className="col-md-6">
            <label htmlFor="address" className="form-label">
              Address:
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={admin.address}
              onChange={inputHandler}
              className="form-control"
              placeholder="Enter Your Address"
            />
          </div>

          {/* Birthday */}
          <div className="col-md-6">
            <label htmlFor="birthday" className="form-label">
              Birthday:
            </label>
            <input
              type="date"
              id="birthday"
              name="birthday"
              value={admin.birthday}
              onChange={inputHandler}
              className="form-control"
              required
            />
          </div>

          {/* Civil Status */}
          <div className="col-md-6">
            <label htmlFor="civil_status" className="form-label">
              Civil Status:
            </label>
            <select
              id="civil_status"
              name="civil_status"
              value={admin.civil_status}
              onChange={inputHandler}
              className="form-select"
            >
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Widowed">Widowed</option>
              <option value="Divorced">Divorced</option>
              <option value="Separated">Separated</option>
            </select>
          </div>

          {/* Birthplace */}
          <div className="col-md-6">
            <label htmlFor="birthplace" className="form-label">
              Birthplace:
            </label>
            <input
              type="text"
              id="birthplace"
              name="birthplace"
              value={admin.birthplace}
              onChange={inputHandler}
              className="form-control"
              placeholder="Enter Your Birthplace"
            />
          </div>

          {/* Nationality */}
          <div className="col-md-6">
            <label htmlFor="nationality" className="form-label">
              Nationality:
            </label>
            <input
              type="text"
              id="nationality"
              name="nationality"
              value={admin.nationality}
              onChange={inputHandler}
              className="form-control"
              placeholder="Enter Your Nationality"
            />
          </div>

          {/* Religion */}
          <div className="col-md-6">
            <label htmlFor="religion" className="form-label">
              Religion:
            </label>
            <input
              type="text"
              id="religion"
              name="religion"
              value={admin.religion}
              onChange={inputHandler}
              className="form-control"
              placeholder="Enter Your Religion"
            />
          </div>

          {/* Submit Button */}
          <div className="col-12 text-end">
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

export default UpdateAdmin;
