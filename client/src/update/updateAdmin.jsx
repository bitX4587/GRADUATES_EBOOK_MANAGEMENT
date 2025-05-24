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
  });
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setAdmin((prev) => ({ ...prev, [name]: value }));
  };

  const fileHandler = (e) => {
    setImage(e.target.files[0]);
  };

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/adminID", { withCredentials: true })
      .then((response) => {
        const { name, email, mobile } = response.data.admin;
        setAdmin({ name, email, mobile });
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

    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios.put(
        "http://localhost:8000/api/update/adminID",
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
    <div className="container mt-5 mb-5 pt-5 pb-5">
      <Link
        to="/profileAdmin"
        type="button"
        className="btn btn-secondary mb-3 text-decoration-none"
      >
        <i className="fa-solid fa-backward"></i> Back
      </Link>

      <h3 className="mb-4">Update Admin</h3>

      <form
        encType="multipart/form-data"
        onSubmit={submitForm}
        className="needs-validation"
        noValidate
      >
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={admin.name}
            onChange={inputHandler}
            placeholder="Enter Your Name"
            autoComplete="off"
            required
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={admin.email}
            onChange={inputHandler}
            placeholder="Enter Your Email"
            autoComplete="off"
            required
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="mobile" className="form-label">
            Mobile:
          </label>
          <input
            type="text"
            id="mobile"
            name="mobile"
            value={admin.mobile}
            onChange={inputHandler}
            placeholder="Enter Your Mobile"
            autoComplete="off"
            required
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="image" className="form-label">
            New Image:
          </label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={fileHandler}
            className="form-control"
          />
        </div>
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
  );
};

export default UpdateAdmin;
