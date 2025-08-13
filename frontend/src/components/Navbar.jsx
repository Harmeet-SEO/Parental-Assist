import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import "./Navbar.css";
import SearchSuggestions from "./SearchSuggestions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // 🔐 Check if user has token
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };
  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.length > 1) {
      const lowerTerm = term.toLowerCase();

      const articleResults = [
        { label: "Lost cat found the way back to her home", link: "/articles" },
        { label: "10 parenting hacks", link: "/articles" },
        { label: "Balancing work and family", link: "/articles" },
      ].filter((a) => a.label.toLowerCase().includes(lowerTerm));

      setSuggestions([...articleResults]);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <nav className="top-nav">
      <div className="logo">
        <img src="/assets/logo-icon.png" alt="logo" className="logo-icon" />
        <span>Parental Assist</span>
      </div>

      {/* 👇 Only show if logged in */}
      {isLoggedIn && (
        <div className="search-wrapper">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={handleInputChange}
            />
            <button type="submit">Search</button>
          </form>
          <SearchSuggestions
            results={suggestions}
            onClose={() => setSuggestions([])}
          />
        </div>
      )}

      <div className="nav-links">
        <Link to="/">
          <FaHome size={18} />
        </Link>
        <Link to="/articles">Articles</Link>
        <Link to="/podcasts">Podcasts</Link>
        <Link to="/contact">Contact Us</Link>
        <Link to="/feedback">Feedback</Link>

        {isLoggedIn ? (
          <>
            <Link to="/profile" className="profile-link">
              <FontAwesomeIcon icon={faUser} className="profile-icon" />
            </Link>

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/signup">Sign Up</Link>
        )}
      </div>
    </nav>
  );
}
