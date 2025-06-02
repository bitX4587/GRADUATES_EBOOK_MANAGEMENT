import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const UpdateUser = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const users = {
    name: "",
    email: "",
    mobile: "",
    address: "",
    birthday: "",
    civil_status: "Single", // default value
    birthplace: "",
    nationality: "",
    religion: "",
    achievements: "",
  };

  const [user, setUser] = useState(users);

  const navigate = useNavigate();

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  // get fetch user data
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/userID`, {
        withCredentials: true, // 🔥 Send cookies
      })
      .then((response) => {
        setUser(response.data.user);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // update user data
  const submitForm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Disable submit button

    // Create a FormData object to handle image file and text data
    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("email", user.email);
    formData.append("mobile", user.mobile);
    formData.append("address", user.address);
    formData.append("birthday", user.birthday);
    formData.append("civil_status", user.civil_status);
    formData.append("birthplace", user.birthplace);
    formData.append("nationality", user.nationality);
    formData.append("religion", user.religion);
    formData.append("achievements", user.achievements);

    try {
      // Send FormData to backend
      const response = await axios.put(
        `
        ${process.env.REACT_APP_API_URL}/api/update/userID`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, // 🔥 Send the JWT cookie
        }
      );

      toast.success(response.data.message, { position: "top-right" });
      navigate("/profile");
    } catch (error) {
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
    <div className="d-flex flex-column align-items-center">
      <div className="container pt-5 pb-5 m-4 bg-white text-black rounded w-auto">
        <Link
          to="/profile"
          className="btn btn-secondary mb-3 text-decoration-none"
        >
          <i className="fa-solid fa-backward"></i> Back
        </Link>
        <h3 className="mb-4 text-center">Update User</h3>
        <form
          className="row g-3"
          encType="multipart/form-data"
          onSubmit={submitForm}
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
              value={user.name}
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
              value={user.email}
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
              value={user.mobile}
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
              value={user.address}
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
              value={user.birthday}
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
              value={user.civil_status}
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
              value={user.birthplace}
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
              value={user.nationality}
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
              value={user.religion}
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

export default UpdateUser;
