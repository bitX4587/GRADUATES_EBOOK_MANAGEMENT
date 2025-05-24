import React, { useEffect, useState } from "react";
import "./profileUser.css";
import { Link } from "react-router-dom";
import axios from "axios";

const ProfileUser = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");

  const schoolMap = {
    0: "Northwest Samar State University",
    1: "Samar State University",
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `
          ${process.env.REACT_APP_API_URL}/api/dashboard`,
          {
            withCredentials: true,
          }
        );
        setUser(response.data.user);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      await axios.put(
        `
        ${process.env.REACT_APP_API_URL}/api/update/userID`, // Replace with actual user ID if needed
        formData,
        {
          withCredentials: true,
        }
      );

      // Re-fetch updated user data
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/dashboard`,
        {
          withCredentials: true,
        }
      );
      setUser(response.data.user);

      console.log("Image updated successfully!");
    } catch (error) {
      console.error("Image upload failed", error.message);
    }
  };

  return (
    <div className="home-cont">
      <div className="profile-cont generalDIV">
        <div className="profile-cont-left">
          <div className="profile-cont-image position-relative d-inline-block">
            {user.image ? (
              <>
                <img
                  className="profile-image rounded-circle shadow border border-secondary"
                  src={user.image?.url || "/default-profile.png"}
                  alt={user.name}
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

                {/* Camera icon button overlayed */}
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
            <div className="profile-name">{user.name}</div>
            <div>
              <i className="fa-solid fa-phone"></i> {user.mobile}
            </div>
            <div>
              <i className="fa-solid fa-graduation-cap"></i>
              {schoolMap[user.SchoolID] || "Unknown University"}
            </div>
            <div>
              <i className="fa-solid fa-envelope-circle-check"></i> {user.email}
            </div>
            <div>
              <i className="fa-solid fa-location-dot"></i> {user.address}
            </div>
          </div>
        </div>

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
              Download Backup
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

          {/* 👇 OTHER TABS SHOW HERE */}

          {activeTab === "personal" && (
            <div className="profile-info-bottom">
              <h3 className="text-uppercase fw-bold mb-3">
                Personal Achievements
              </h3>
              {user.achievements && user.achievements.length > 0 ? (
                <p className="achievements-list">
                  {user.achievements.map((ach, index) => (
                    <p key={index} className="gradient-text">
                      {ach}
                    </p>
                  ))}
                </p>
              ) : (
                <p>No achievements added yet.</p>
              )}
            </div>
          )}

          {activeTab === "backup" && (
            <div className="profile-info-bottom">
              <h3>Download Backup</h3>
              <Link to="/download">Download Data</Link>
            </div>
          )}

          {activeTab === "security" && (
            <div className="profile-info-bottom">
              <h3>Security and Password</h3>
              <Link to="/resetpassword">Forget Password</Link>
            </div>
          )}
        </div>

        <div className="profile-cont-middle">
          {/* 👇 PERSONAL DETAILS SHOW HERE ONLY IF IT'S ACTIVE */}
          {activeTab === "personal" && (
            <div className="card mt-3">
              <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h5 className="text-uppercase fw-bold mb-0">
                  Personal Details
                </h5>
                <Link
                  to="/update"
                  className="btn btn-light btn-sm text-decoration-none"
                >
                  <i className="fa-solid fa-pen-to-square"></i> Edit
                </Link>
              </div>
              <div className="card-body">
                <div className="row">
                  {[
                    { label: "Address", value: user.address },
                    {
                      label: "Birthday",
                      value: user.birthday
                        ? new Date(user.birthday).toLocaleDateString()
                        : "N/A",
                    },
                    { label: "Civil Status", value: user.civil_status },
                    { label: "Birthplace", value: user.birthplace },
                    { label: "Nationality", value: user.nationality },
                    { label: "Religion", value: user.religion },
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
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileUser;
