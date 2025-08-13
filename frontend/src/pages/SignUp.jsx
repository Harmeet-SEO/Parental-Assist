import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./SignUp.css";
import Header from "../components/Header";
import { api } from "../api"; // ✅ env-driven axios (uses REACT_APP_API_BASE_URL)

export default function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone_number: "",
    address: "",
    userType: "parent", // "parent" | "student" | "admin" (if you add it later)
  });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    // (optional) simple email check
    if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      toast.error("Please enter a valid email.");
      return;
    }

    const payload = {
      firstname: formData.firstname.trim(),
      lastname: formData.lastname.trim(),
      email: formData.email.trim(),
      password: formData.password, // let backend hash it
      phone_number: formData.phone_number.trim(),
      address: formData.address.trim(),
      // Send both to be compatible with either backend expectation
      userType: formData.userType,
      role: formData.userType,
    };

    try {
      setSubmitting(true);
      await api.post("/api/register", payload); // ✅ env-based URL
      toast.success("Account created successfully!");
      navigate("/login");
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />

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
              name="firstname"
              placeholder="First Name"
              value={formData.firstname}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="lastname"
              placeholder="Last Name"
              value={formData.lastname}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="phone_number"
              placeholder="Phone Number"
              value={formData.phone_number}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
            />

            <select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              required
            >
              <option value="parent">I am a Parent</option>
              <option value="student">I am a Student</option>
              {/* <option value="admin">I am an Admin</option> */}
            </select>

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

            <button type="submit" disabled={submitting}>
              {submitting ? "Creating..." : "Sign Up"}
            </button>
            <p className="form-switch-text">
              Already have an account? <Link to="/login">Sign In</Link>
            </p>
          </form>
          <ToastContainer />
        </div>
      </main>
    </>
  );
}
