import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  return (
    <header className="login-header">
      <div className="logo-search">
        <input type="text" placeholder="Search..." className="search-bar" />
        <Link to="/" className="logo">
          Parental Assist
        </Link>
        <div className="auth-buttons">
          {token ? (
            <div className="profile-menu">
              <div className="avatar-icon" onClick={toggleDropdown}>
                👤
              </div>
              {showDropdown && (
                <div className="dropdown">
                  <Link to="/profile">Profile</Link>
                  <Link to="/settings">Settings</Link>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="signin-btn">
              Sign In
            </Link>
          )}

          {/* 👇 Subscribe is always shown */}
          <button className="subscribe-btn">Subscribe</button>
        </div>
      </div>
    </header>
  );
}
