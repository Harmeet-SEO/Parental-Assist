import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGraduate } from "@fortawesome/free-solid-svg-icons";
import "./StudentNavbar.css";

export default function StudentNavbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="top-nav student-nav">
      <div className="logo">
        <img src="/assets/logo-icon.png" alt="logo" className="logo-icon" />
        <span>Parental Assist</span>
      </div>

      <div className="nav-links">
        <Link to="/student-dashboard">My Progress</Link>
        <Link to="/student/activity">Start Activity</Link>

        {isLoggedIn ? (
          <>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}
