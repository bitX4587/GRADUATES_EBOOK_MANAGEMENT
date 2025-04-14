// import "./update.css";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const UpdateAdmin = () => {
  const users = {
    name: "",
    email: "",
    mobile: "",
  };
  const [image, setImage] = useState(null);

  const [user, setUser] = useState(users);

  const navigate = useNavigate();
  const { id } = useParams();

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const fileHandler = (e) => {
    setImage(e.target.files[0]);
  };

  // get fetch user data
  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/admin/${id}`)
      .then((response) => {
        console.log(response.data);
        setUser(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  // update user data
  const submitForm = async (e) => {
    e.preventDefault();

    // Create a FormData object to handle image file and text data
    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("email", user.email);
    formData.append("mobile", user.mobile);
    formData.append("password", user.password);

    // If an image is selected, append it to FormData
    if (image) {
      formData.append("image", image);
    }

    try {
      // Send FormData to backend
      const response = await axios.put(
        `http://localhost:8000/api/update/admin/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set header for multipart form data
          },
        }
      );
      toast.success(response.data.message, { position: "top-right" });
      navigate("/dashboardAdmin");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message, { position: "top-right" });
      } else {
        toast.error("Something went wrong!", { position: "top-right" });
      }
    }
  };

  return (
    <div className="addUser">
      <Link to="/dashboardAdmin" type="button" className="btn btn-secondary">
        <i className="fa-solid fa-backward"></i> Back
      </Link>
      <h3>Update Admin</h3>
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
            value={user.name}
            onChange={inputHandler}
            placeholder="Enter Your Name"
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
            value={user.mobile}
            onChange={inputHandler}
            placeholder="Enter Your Mobile"
            autoComplete="off"
            required
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="image">Image:</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={fileHandler}
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
  );
};

export default UpdateAdmin;
