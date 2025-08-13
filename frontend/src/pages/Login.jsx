import { Link } from "react-router-dom";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Hardcoded admin bypass for testing
    if (email === "admin@example.com" && password === "adminpass") {
      toast.success("Admin logged in!");
      navigate("/admin");
      return; // ✅ skip calling backend
    }

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      localStorage.setItem("token", data.token);
      toast.success("Logged in successfully!");

      // ✅ If your backend returns role info
      if (data.role === "admin") {
        navigate("/admin");
      } else if (data.role === "student") {
        navigate("/student-dashboard");
      } else {
        navigate("/"); // parent
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <>
      <Header />

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

            <p className="form-switch-text">
              Don’t have an account? <Link to="/signup">Create Account</Link>
            </p>
          </form>
          <ToastContainer />
        </div>
      </main>
    </>
  );
}
