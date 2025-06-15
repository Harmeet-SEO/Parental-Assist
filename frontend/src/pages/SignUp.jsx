import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./SignUp.css";
import Navbar from '../components/Navbar';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);

      await updateProfile(auth.currentUser, {
        displayName: formData.name
      });

      toast.success("Account created successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <Link to="/" className="home-icon">🏠</Link>

      <main className="signup">
        <div className="signup-left">
          <img src="/assets/signup-family.png" alt="Family with kids" />
          <div className="signup-message">
            <h1>Join Parental Assist</h1>
            <p>Create your account to unlock smart parenting tools</p>
          </div>
        </div>

        <div className="signup-right">
          <form onSubmit={handleSubmit} className="signup-form">
            <h2>Sign Up</h2>

            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>

            <div className="password-field">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <span
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </span>
            </div>

            <button type="submit">Sign Up</button>
          </form>
          <ToastContainer />
        </div>
      </main>
    </>
  );
}
