import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./profileAdmin.css";

const ProfileAdmin = () => {
  const [admin, setAdmin] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");

  const schoolMap = {
    0: "Northwest Samar State University",
    1: "Samar State University",
  };

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
    <div className="home-cont">
      <div className="profile-cont generalDIV">
        {/* Left Section: Image + Basic Info */}
        <div className="profile-cont-left">
          <div className="profile-cont-image position-relative d-inline-block">
            {admin.image ? (
              <>
                <img
                  className="profile-image rounded-circle shadow border border-secondary"
                  src={admin.image?.url || "/default-profile.png"}
                  alt={admin.name}
                  onError={() => console.log("Image is not showing")}
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
                  id="imageUpload"
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />

                {/* Camera icon button overlay */}
                <button
                  className="btn btn-light position-absolute camera-btn"
                  onClick={() => document.getElementById("imageUpload").click()}
                  aria-label="Upload Image"
                  style={{ bottom: "0", right: "0" }}
                >
                  <i className="fa-solid fa-camera"></i>
                </button>
              </>
            ) : (
              "No Image"
            )}
          </div>

          <div className="profile-cont-info">
            <div className="profile-name">{admin.name}</div>
            <div>
              <i className="fa-solid fa-phone"></i> {admin.mobile}
            </div>
            <div>
              <i className="fa-solid fa-graduation-cap"></i>
              {schoolMap[admin.SchoolID] || "Unknown University"}
            </div>
            <div>
              <i className="fa-solid fa-envelope-circle-check"></i>{" "}
              {admin.email}
            </div>
            <div>
              <i className="fa-solid fa-location-dot"></i> {admin.address}
            </div>
          </div>
        </div>

        {/* Right Section: Tabs + Content */}
        <div className="profile-cont-right">
          <div className="profile-cont-right-head">
            <div
              className={`profile-heads ${
                activeTab === "personal" ? "active" : ""
              }`}
              onClick={() => setActiveTab("personal")}
            >
              Personal Detail
            </div>
            <div
              className={`profile-heads ${
                activeTab === "backup" ? "active" : ""
              }`}
              onClick={() => setActiveTab("backup")}
            >
              Admin Dashboard
            </div>
            <div
              className={`profile-heads ${
                activeTab === "security" ? "active" : ""
              }`}
              onClick={() => setActiveTab("security")}
            >
              Security and Password
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "personal" && (
            <div className="profile-info-bottom">
              <h3 className="text-uppercase fw-bold mb-3">
                Personal Achievements
              </h3>
              {admin.achievements && admin.achievements.length > 0 ? (
                <>
                  {admin.achievements.map((ach, index) => (
                    <p key={index} className="gradient-text">
                      {ach}
                    </p>
                  ))}
                </>
              ) : (
                <p>No achievements added yet.</p>
              )}
            </div>
          )}

          {activeTab === "backup" && (
            <div className="profile-info-bottom">
              <h3>Manage Users</h3>
              <Link to="/dashboardAdmin">Inspect Users</Link>
            </div>
          )}

          {activeTab === "security" && (
            <div className="profile-info-bottom">
              <h3>Security and Password</h3>
              <Link to="/resetpasswordAdmin">Forget Password</Link>
              <Link to="/logout">Logout</Link>
            </div>
          )}
        </div>

        {/* Middle Section: Personal Details Card, shows only if Personal tab active */}
        {activeTab === "personal" && (
          <div className="profile-cont-middle">
            <div className="card mt-3">
              <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h5 className="text-uppercase fw-bold mb-0">
                  Personal Details
                </h5>
                <Link
                  to="/updateAdmin"
                  className="btn btn-light btn-sm text-decoration-none"
                >
                  <i className="fa-solid fa-pen-to-square"></i> Edit
                </Link>
              </div>
              <div className="card-body">
                <div className="row">
                  {[
                    { label: "Address", value: admin.address },
                    {
                      label: "Birthday",
                      value: admin.birthday
                        ? new Date(admin.birthday).toLocaleDateString()
                        : "N/A",
                    },
                    { label: "Civil Status", value: admin.civil_status },
                    { label: "Birthplace", value: admin.birthplace },
                    { label: "Nationality", value: admin.nationality },
                    { label: "Religion", value: admin.religion },
                  ].map((item, index) => (
                    <div key={index} className="col-lg-4 col-md-6 col-12 mb-3">
                      <div className="border p-3 rounded bg-light h-100">
                        <span className="fw-bold text-uppercase">
                          {item.label}:
                        </span>{" "}
                        {item.value || "N/A"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileAdmin;
