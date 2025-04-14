import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import CE from "./courseroadmap/CE";
import ME from "./courseroadmap/ME";

// UserCard Component
function UserCard({ user }) {
  return (
    <div>
      <p>{user.name}</p>
      {/* Pass targetId in URL */}
      <Link to={`/chatroom/${user._id}`}>Chat with {user.name}</Link>
    </div>
  );
}

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [course, setCourse] = useState(null);

  // Fetch users data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/users");
        console.log(response);

        // Check if the response data is an array before setting it
        if (Array.isArray(response.data)) {
          setUsers(response.data); // Set users only if the data is an array
        } else {
          console.error("Received data is not an array", response.data);
        }
      } catch (error) {
        console.log("Error while fetching data", error);
      }
    };
    fetchData();
  }, []);

  // You can use sessionStorage, localStorage, or an API call to fetch the user's course
  useEffect(() => {
    const userCourse = sessionStorage.getItem("course"); // Assuming the course is stored in sessionStorage
    setCourse(userCourse); // Set the user's course (CE or ME)
  }, []);

  return (
    <div className="userTable">
      {/* Render Course Roadmap Based on User's Course */}
      {course === "CE" ? (
        <CE />
      ) : course === "ME" ? (
        <ME />
      ) : (
        <div>Please select your course</div> // Show if course data is missing
      )}

      {/* User Table */}
      {users.length === 0 ? (
        <div className="noData">
          <h3>No Data to display.</h3>
          <p>Please add New User</p>
        </div>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th scope="col">S.No</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Mobile</th>
              <th scope="col">Image</th>
              <th scope="col">Password</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => {
              return (
                <tr key={user._id}>
                  <td>{users.indexOf(user) + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.mobile}</td>
                  <td>
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
                  </td>
                  <td>{user.beta_password}</td>
                  {/* Use UserCard component to show chat link */}
                  <td>
                    <UserCard user={user} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <div>
        <Link to="/profile">Go to your Profile</Link>
      </div>
    </div>
  );
};

export default Dashboard;
