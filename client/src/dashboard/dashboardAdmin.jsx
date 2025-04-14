import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const DashboardAdmin = () => {
  const [users, SetUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/users");
        console.log(response);

        // Check if the response data is an array before setting it
        if (Array.isArray(response.data)) {
          SetUsers(response.data); // Set users only if the data is an array
        } else {
          console.error("Received data is not an array", response.data);
        }
      } catch (error) {
        console.log("Error while fetching data", error);
      }
    };
    fetchData();
  }, []);

  const deleteUser = async (userId) => {
    await axios
      .delete(`http://localhost:8000/api/delete/user/${userId}`)
      .then((response) => {
        SetUsers((prevUser) => prevUser.filter((user) => user._id !== userId));
        toast.success(response.data.message, { position: "top-right" });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="userTable">
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
                  <td className="actionButtons">
                    <button
                      onClick={() => deleteUser(user._id)}
                      type="button"
                      className="btn btn-danger"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}{" "}
      <div>
        <Link to="/profileAdmin">Go to your Profile</Link>
      </div>
    </div>
  );
};

export default DashboardAdmin;
