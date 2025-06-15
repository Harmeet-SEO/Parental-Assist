import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <nav className="top-nav">
      <div className="logo" data-aos="fade-down" data-aos-duration="800">
        <img src="/assets/logo-icon.png" alt="logo" className="logo-icon" />
        <span>Parental Assist</span>
      </div>

      <div className="nav-links">
        <Link to="/features">Features</Link>
        <Link to="/products">Products</Link>
        <Link to="/contact">Contact Us</Link>
        <Link to="/feedback">Feedback</Link> 

        {user ? (
          <>
            <Link to="/profile">Profile</Link>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup" className="get-started">Sign Up</Link>
          </>
        )}

        {/* Home button as last, symbol only */}
        <Link to="/" className="home-icon-inline">🏠</Link>
      </div>
    </nav>
  );
}
