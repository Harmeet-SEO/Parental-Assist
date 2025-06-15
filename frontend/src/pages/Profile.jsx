import { Link } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import "./Profile.css";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <Navbar />
      <Link to="/" className="home-icon">🏠</Link>
      <main className="profile-page">
        <div className="profile-container">
          <h1>User Profile</h1>
          {user ? (
            <div className="profile-card">
              <img
                src="/assets/profile-placeholder.png"
                alt="Profile Avatar"
                className="profile-avatar"
              />
              <h2>{user.email}</h2>
              <p>Name: {user.displayName ? user.displayName : '(No name set)'}</p>
              <button className="edit-profile-btn">Edit Profile</button>
            </div>
          ) : (
            <p>Please log in to view your profile.</p>
          )}
        </div>
      </main>
    </>
  );
}
