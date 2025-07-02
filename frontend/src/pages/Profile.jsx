import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Profile.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPhone,
  faHome,
  faUser,
  faUserTag,
  faPen,
  faSave,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    fetch("http://localhost:5000/api/user", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        setUser(data);
        setFormData(data);
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/user/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((updatedUser) => {
        setUser(updatedUser);
        setEditing(false);
      })
      .catch(() => alert("Failed to update profile."));
  };

  return (
    <>
      <Navbar />
      <Link to="/" className="home-icon">
        🏠
      </Link>

      <main className="profile-page">
        <div className="profile-container">
          <h1 className="profile-heading">
            <FontAwesomeIcon icon={faUser} /> My Profile
          </h1>

          {user ? (
            <div className="profile-card">
              <img
                src="/assets/profile-placeholder.jpg"
                alt="Profile Avatar"
                className="profile-avatar"
              />
              <h2>
                {formData.firstname} {formData.lastname}
              </h2>

              <div className="profile-detail">
                <FontAwesomeIcon icon={faEnvelope} />
                {editing ? (
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                ) : (
                  <span>{user.email}</span>
                )}
              </div>

              <div className="profile-detail">
                <FontAwesomeIcon icon={faPhone} />
                {editing ? (
                  <input
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                  />
                ) : (
                  <span>{user.phone_number}</span>
                )}
              </div>

              <div className="profile-detail">
                <FontAwesomeIcon icon={faHome} />
                {editing ? (
                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                ) : (
                  <span>{user.address}</span>
                )}
              </div>

              <div className="profile-detail">
                <FontAwesomeIcon icon={faUserTag} />
                <span>{user.userType}</span>
              </div>

              {editing ? (
                <div className="edit-actions">
                  <button onClick={handleSave}>
                    <FontAwesomeIcon icon={faSave} /> Save
                  </button>
                  <button onClick={() => setEditing(false)}>
                    <FontAwesomeIcon icon={faTimes} /> Cancel
                  </button>
                </div>
              ) : (
                <button
                  className="edit-profile-btn"
                  onClick={() => setEditing(true)}
                >
                  <FontAwesomeIcon icon={faPen} /> Edit Profile
                </button>
              )}
            </div>
          ) : (
            <p>Loading user info...</p>
          )}
        </div>
      </main>
    </>
  );
}
