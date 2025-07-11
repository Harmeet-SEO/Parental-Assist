import { Link } from "react-router-dom";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./SignUp.css";
import { useNavigate } from "react-router-dom";

const provincesUSA = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming"
];

const provincesCanada = [
  "Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador",
  "Nova Scotia", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan",
  "Northwest Territories", "Nunavut", "Yukon"
];

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
    city: "",
    province: "",
    country: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCountryChange = (e) => {
    setFormData({ ...formData, country: e.target.value, province: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      toast.success("Account created successfully!");
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const provinceOptions =
    formData.country === "Canada"
      ? provincesCanada
      : formData.country === "USA"
      ? provincesUSA
      : [];

  return (
    <main className="signup-page">
      <div className="signup-illustration">
        <img src="/assets/signup-family.png" alt="Family" />
      </div>

      <div className="signup-card">
        <h2>Create an account</h2>
        <form onSubmit={handleSubmit} className="signup-form-new">

          <div className="row">
            <div className="col">
              <input
                type="text"
                name="firstname"
                placeholder="First Name"
                value={formData.firstname}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col">
              <input
                type="text"
                name="lastname"
                placeholder="Last Name"
                value={formData.lastname}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="full-width"
          />

          <input
            type="text"
            name="phone_number"
            placeholder="Phone Number"
            value={formData.phone_number}
            onChange={handleChange}
            required
            className="full-width"
          />

          {/* ✅ NEW: Address, full width */}
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
            className="full-width"
          />

          <div className="row">
            <div className="col">
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col">
              <select
                name="province"
                value={formData.province}
                onChange={handleChange}
                required
                disabled={!formData.country}
              >
                <option value="">-- Select Province/State --</option>
                {provinceOptions.map((prov) => (
                  <option key={prov} value={prov}>{prov}</option>
                ))}
              </select>
            </div>
            <div className="col">
              <select
                name="country"
                value={formData.country}
                onChange={handleCountryChange}
                required
              >
                <option value="">-- Select Country --</option>
                <option value="Canada">Canada</option>
                <option value="USA">USA</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="register-btn">Register</button>

          <div className="switch-text">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </form>

        <p className="terms">
          By registering your details, you agree with our Terms & Conditions and Privacy Policy.
        </p>
        <ToastContainer />
      </div>
    </main>
  );
}
