import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./profileAdmin.css";

const ProfileAdmin = () => {
  const [admin, setAdmin] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axios.get(
          `
          ${process.env.REACT_APP_API_URL}/api/dashboardAdmin`,
          {
            withCredentials: true,
          }
        );
        setAdmin(response.data.admin); // ✅ match backend
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchAdminData();
  }, []);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/update/adminID, formData`,
        {
          withCredentials: true,
        }
      );

      // Re-fetch updated admin data
      const response = await axios.get(
        `
        ${process.env.REACT_APP_API_URL}/api/dashboardAdmin`,
        {
          withCredentials: true,
        }
      );
      setAdmin(response.data.admin); // update admin state with fresh data

      console.log("Image updated successfully!");
    } catch (error) {
      console.error("Image upload failed", error.message);
    }
  };

  if (!admin) return <div>Loading...</div>;

  return (
    <div className="admin-home-cont">
      <div className="admin-profile-cont">
        {/* LEFT SIDE - IMAGE & BASIC INFO */}
        <div className="admin-profile-cont-left">
          <div className="admin-profile-cont-image position-relative d-inline-block">
            {admin.image ? (
              <>
                <img
                  className="admin-profile-image rounded-circle shadow border border-secondary"
                  src={admin.image?.url || "/default-profile.png"}
                  alt={admin.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-avatar.png"; // fallback image
                  }}
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                  }}
                />

                {/* Hidden file input */}
                <input
                  type="file"
                  accept="image/*"
                  id="adminImageUpload"
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />

                {/* Camera icon button overlayed */}
                <button
                  className="btn btn-light position-absolute camera-btn"
                  onClick={() =>
                    document.getElementById("adminImageUpload").click()
                  }
                  aria-label="Upload Admin Image"
                  style={{ bottom: "0", right: "0" }}
                >
                  <i className="fa-solid fa-camera"></i>
                </button>
              </>
            ) : (
              "No Image"
            )}
          </div>
          <div className="admin-profile-cont-info">
            <div className="admin-profile-name">{admin.name} (Admin)</div>
            <div>
              <i className="fa-solid fa-envelope"></i> {admin.email}
            </div>
            <div>
              <i className="fa-solid fa-phone"></i> {admin.mobile}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - TABS */}
        <div className="admin-profile-cont-right">
          <div className="admin-profile-cont-right-head">
            {["personal", "manage", "security"].map((tab) => (
              <div
                key={tab}
                className={`admin-profile-heads ${
                  activeTab === tab ? "active" : ""
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "personal"
                  ? "Personal Detail"
                  : tab === "manage"
                  ? "Manage Users"
                  : "Security & Password"}
              </div>
            ))}
          </div>

          {/* RIGHT-MID SECTION */}
          <div className="admin-profile-cont-middle">
            {activeTab === "personal" && (
              <div className="admin-profile-info-bottom">
                <h3>Personal Details</h3>
                <ul>
                  <li>Email: {admin.email}</li>
                  <li>Username: {admin.name}</li>
                  <li>Mobile #: {admin.mobile}</li>
                </ul>
                <Link
                  to={"/updateAdmin"}
                  className="btn btn-info text-decoration-none"
                >
                  <i className="fa-solid fa-pen-to-square"></i> Edit Profile
                </Link>
              </div>
            )}

            {activeTab === "manage" && (
              <div className="profile-info-bottom">
                <h3>Admin Controls</h3>
                <Link
                  to="/dashboardAdmin"
                  className="btn btn-dark text-decoration-none"
                >
                  Manage All Users
                </Link>
              </div>
            )}

            {activeTab === "security" && (
              <div className="profile-info-bottom">
                <h3>Security Options</h3>
                <Link
                  to="/resetpasswordAdmin"
                  className="btn btn-warning text-decoration-none"
                >
                  Reset Password
                </Link>
                <br />
                <Link
                  to="/logout"
                  className="btn btn-danger mt-2 text-decoration-none"
                >
                  Logout
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileAdmin;
