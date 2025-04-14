import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ProfileUser = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user data based on session
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/dashboard",
          {
            withCredentials: true,
          }
        );
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="home-container">
      <h1>Welcome to your profile, {user.name}!</h1>
      <h3>Your Information:</h3>
      <ul>
        <li>Email: {user.email}</li>
        <li>Username: {user.name}</li>
        <li>Mobile #: {user.mobile}</li>
        <li>Password: {user.beta_password}</li>
        <li>
          Image:{" "}
          {user.image ? (
            <img
              src={`http://localhost:8000/api/userImages/${user.image}`}
              alt={user.name}
              width="50"
              height="50"
              style={{ borderRadius: "50%", objectFit: "cover" }}
              onError={() => console.log("Image is not showing")}
            />
          ) : (
            "No Image"
          )}
        </li>
      </ul>
      <div>
        <Link to={`/update/` + user._id} type="button" className="btn btn-info">
          <i className="fa-solid fa-pen-to-square"></i>
        </Link>
        <Link to="/dashboard">Back</Link>
        <br />
        <Link to="/logout">Logout</Link>
        <br />
        <Link to="/forgetpassword">Forget Password</Link>
        <br />
        {/* <Link
          to={`/course/` + user.course}
          type="button"
          className="btn btn-info"
        >
          <i className="fa-solid fa-pen-to-square"></i>
        </Link> */}
        <br />
        <Link to="/download">Download Data</Link>
      </div>
    </div>
  );
};

export default ProfileUser;
