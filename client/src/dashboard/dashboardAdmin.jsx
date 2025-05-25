import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const DashboardAdmin = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [achievementInput, setAchievementInput] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [expandedUserId, setExpandedUserId] = useState(null);

  const toggleDetails = (userId) => {
    setExpandedUserId((prev) => (prev === userId ? null : userId));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `
        ${process.env.REACT_APP_API_URL}/api/usersAdminToken`,
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
      console.log("Error while fetching data", error);
    }
  };

  const promptDeleteUser = (userId) => {
    setSelectedUserId(userId);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = async () => {
    try {
      const response = await axios.delete(
        `
        ${process.env.REACT_APP_API_URL}/api/delete/user/${selectedUserId}`,
        {
          withCredentials: true,
        }
      );
      setUsers((prev) => prev.filter((u) => u._id !== selectedUserId));
      toast.success(response.data.message, { position: "top-right" });
    } catch (error) {
      toast.error(
        error.response?.data?.errorMessage || "Failed to delete user",
        { position: "top-right" }
      );
    } finally {
      setShowDeleteModal(false);
      setSelectedUserId(null);
    }
  };

  const handleAddAchievement = async () => {
    if (!achievementInput.trim()) return;

    try {
      const response = await axios.post(
        `
        ${process.env.REACT_APP_API_URL}/api/usersAdminToken/achievement`,
        {
          userId: selectedUser._id,
          achievement: achievementInput,
        },
        {
          withCredentials: true,
        }
      );

      if (response && response.data) {
        toast.success("Achievement added!");
        setAchievementInput("");
        fetchUsers();
      } else {
        toast.error("Failed to update achievements. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to add achievement", error.response.data.message);
    }
  };

  const handleDeleteAchievement = async (index) => {
    try {
      if (!selectedUser || !selectedUser.achievements) {
        return toast.error("No achievements found for this user.");
      }

      const updatedAchievements = selectedUser.achievements.filter(
        (_, i) => i !== index
      );

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/usersAdminToken/${selectedUser._id}/achievement/delete`,
        {
          achievements: updatedAchievements,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data) {
        toast.success("Achievement deleted!");

        setSelectedUser((prevState) => ({
          ...prevState,
          achievements: updatedAchievements,
        }));

        fetchUsers();
      }
    } catch (error) {
      console.error(
        "Failed to delete achievement",
        error.response ? error.response.data.message : error.message
      );
      toast.error("Failed to delete achievement. Please try again.");
    }
  };

  return (
    <div className="container py-4">
      <h3 className="mb-4">Admin Dashboard</h3>
      {users.length === 0 ? (
        <div className="alert text-center">
          <h1 className="someInfo">No Users Found.</h1>
        </div>
      ) : (
        <div className="list-group">
          {users.map((user, idx) => (
            <div
              key={user._id}
              className="list-group-item list-group-item-action flex-column align-items-start mb-3 shadow-sm"
            >
              <div className="d-flex justify-content-between w-100">
                <div>
                  <h5 className="mb-1">
                    {idx + 1}. {user.name}
                  </h5>
                </div>
                <button
                  className="btn btn-link text-primary p-0 text-decoration-none"
                  onClick={() => toggleDetails(user._id)}
                >
                  {expandedUserId === user._id ? "Hide" : "View"} Details
                </button>
              </div>

              {expandedUserId === user._id && (
                <div className="mt-3">
                  <div className="mb-2">
                    <strong>Achievements:</strong>
                    <div className="d-flex flex-wrap gap-2 mt-2">
                      {(user.achievements || []).map((ach, i) => (
                        <span key={i} className="badge bg-success">
                          {ach}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setSelectedUser(user)}
                      data-bs-toggle="modal"
                      data-bs-target="#achievementModal"
                    >
                      Manage Achievements
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => promptDeleteUser(user._id)}
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Achievement Modal */}
      <div
        className="modal fade"
        id="achievementModal"
        tabIndex="-1"
        aria-labelledby="achievementModalLabel"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="achievementModalLabel">
                Manage Achievements - {selectedUser?.name}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                onClick={() => setSelectedUser(null)}
              ></button>
            </div>
            <div className="modal-body">
              <ul className="list-group mb-3">
                {selectedUser?.achievements?.map((ach, index) => (
                  <li
                    className="list-group-item d-flex justify-content-between align-items-center"
                    key={index}
                  >
                    {ach}
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDeleteAchievement(index)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>

              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="New achievement"
                  value={achievementInput}
                  onChange={(e) => setAchievementInput(e.target.value)}
                />
                <button
                  className="btn btn-success"
                  onClick={handleAddAchievement}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>⚠️ Are You Sure?</h3>
            <p>This will permanently delete the user and all related data.</p>
            <div className="modal-buttons">
              <button
                className="modal-button confirm"
                onClick={confirmDeleteUser}
                style={{ backgroundColor: "red" }}
              >
                Yes, delete
              </button>
              <button
                className="modal-button cancel"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <Link
        to="/profileAdmin"
        className="btn btn-primary position-fixed text-decoration-none"
        style={{ bottom: "20px", right: "20px", zIndex: 1000 }}
        aria-label="Go to Profile Admin"
      >
        Go To Profile Admin <i className="fas fa-arrow-right ms-2"></i>
      </Link>
    </div>
  );
};

export default DashboardAdmin;
