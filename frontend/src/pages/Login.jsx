import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./Login.css";
import Navbar from '../components/Navbar';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <Link to="/" className="home-icon">🏠</Link>
      <main className="login">
        <div className="login-left">
          <img src="/assets/login-family.png" alt="Family illustration" />
          <div className="login-message">
            <h1>Welcome to Parental Assist</h1>
            <p>Your personal partner in modern parenting</p>
          </div>
        </div>

        <div className="login-right">
          <form onSubmit={handleSubmit} className="login-form">
            <h2>LOGIN</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>

            <button type="submit">Log In</button>
          </form>
          <ToastContainer />
        </div>
      </main>
    </>
  );
}
