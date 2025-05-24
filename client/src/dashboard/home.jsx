import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./dashboard-style.css";

// UserCard Component
function UserCard({ user }) {
  return (
    <div>
      {/* Pass targetId in URL */}
      <Link to={`/chatroom/${user._id}`} className="message-icon">
        <i className="fa-solid fa-message"></i>
      </Link>
    </div>
  );
}

const Home = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  console.log(document.cookie);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/allusers`,
          {
            withCredentials: true,
          }
        );
        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          console.error("Received data is not an array", response.data);
        }
      } catch (error) {
        console.log(error.response.data.message);
        console.log("Error while fetching data", error);
      }
    };
    fetchData();
  }, []);

  const filteredUsers = users.filter((user) =>
    user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-4 dashboard">
      <div className="mb-4 generalDIV">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="input-group-text bg-light">
            <i className="fa fa-search"></i>
          </span>
        </div>
      </div>

      <Link
        to="/dashboard"
        className="btn btn-primary position-fixed text-decoration-none"
        style={{ bottom: "20px", left: "20px", zIndex: 1000 }}
        aria-label="Go to Dashboard"
      >
        Dashboard <i className="fas fa-arrow-left ms-2"></i>
      </Link>
      <Link
        to="/newsfeed"
        className="btn btn-primary position-fixed text-decoration-none"
        style={{ bottom: "20px", right: "20px", zIndex: 1000 }}
        aria-label="Go to Newsfeed"
      >
        Newsfeed <i className="fas fa-arrow-right ms-2"></i>
      </Link>

      {users.length === 0 ? (
        <div className="text-center text-muted">
          <h4>No Data to Display</h4>
          <p>Please add a new user</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center text-muted">
          <h4 className="someInfo">No Users Found</h4>
          <p className="someInfo">Try a different search term</p>
        </div>
      ) : (
        <div className="row g-4">
          {filteredUsers.map((user, index) => (
            <div className="col-md-6 col-lg-4" key={user._id}>
              <div className="card h-100 shadow-sm border-1 p-3 text-center position-relative">
                <p
                  className="position-absolute top-0 start-0 m-2 fw-bold fs-6 bg-secondary text-white rounded-circle d-flex justify-content-center align-items-center"
                  style={{ width: "30px", height: "30px" }}
                >
                  {index + 1}
                </p>

                <div className="position-relative mb-3">
                  {user.image ? (
                    <img
                      src={user.image?.url || "/default-profile.png"}
                      alt={user.name}
                      className="rounded-circle img-thumbnail"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/default-profile.png";
                      }}
                    />
                  ) : (
                    <div className="text-muted">No Image</div>
                  )}

                  <div className="position-absolute top-0 end-0 me-2 mt-2">
                    <div className="dashboard-user-chat">
                      <UserCard user={user} />
                    </div>
                  </div>
                </div>
                <h5 className="mb-1">{user.name}</h5>
                {/* <p className="text-muted mb-2">User #{index + 1}</p> */}
                <p className="text-muted mb-2">{user.mobile}</p>
                <p className="text-muted mb-2">{user.email}</p>
                {user.achievements && user.achievements.length > 0 && (
                  <div className="mt-2">
                    {user.achievements.map((ach, i) => (
                      <span key={i} className="badge bg-success me-1 mb-1">
                        {ach}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
