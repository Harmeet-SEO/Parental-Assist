import React, { useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function CreateUser() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone_number: "",
    address: "",
    userType: "user",
    children: []
  });

  const [newChild, setNewChild] = useState({ name: "", age: "", gender: "" });

  const handleAddChild = () => {
    if (!newChild.name || !newChild.age || !newChild.gender) {
      alert("Fill in all child fields");
      return;
    }
    setForm({
      ...form,
      children: [...form.children, newChild]
    });
    setNewChild({ name: "", age: "", gender: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post("/api/admin/create_user", form)
      .then(() => navigate("/admin/users"))
      .catch(err => console.error(err));
  };

  return (
    <div>
      <AdminNavbar />

      <div className="container py-5">
        <h1>Create New User</h1>
        <form onSubmit={handleSubmit}>
          {["firstname", "lastname", "email", "phone_number", "address"].map(field => (
            <div className="mb-3" key={field}>
              <label className="form-label">{field.replace("_", " ").toUpperCase()}</label>
              <input
                type="text"
                className="form-control"
                value={form[field]}
                onChange={(e) =>
                  setForm({ ...form, [field]: e.target.value })
                }
              />
            </div>
          ))}

          <div className="mb-3">
            <label className="form-label">User Type</label>
            <select
              className="form-select"
              value={form.userType}
              onChange={(e) => setForm({ ...form, userType: e.target.value })}
            >
              <option value="user">User</option>
              <option value="parent">Parent</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {form.userType === "parent" && (
            <>
              <h5 className="mt-4">Children</h5>
              <ul>
                {form.children.map((child, idx) => (
                  <li key={idx}>{child.name} - Age: {child.age} - Gender: {child.gender}</li>
                ))}
              </ul>

              <h6 className="mt-3">Add Child</h6>
              <div className="row g-2">
                <div className="col">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Name"
                    value={newChild.name}
                    onChange={(e) => setNewChild({ ...newChild, name: e.target.value })}
                  />
                </div>
                <div className="col">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Age"
                    value={newChild.age}
                    onChange={(e) => setNewChild({ ...newChild, age: e.target.value })}
                  />
                </div>
                <div className="col">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Gender"
                    value={newChild.gender}
                    onChange={(e) => setNewChild({ ...newChild, gender: e.target.value })}
                  />
                </div>
                <div className="col-auto">
                  <button className="btn btn-success" type="button" onClick={handleAddChild}>Add Child</button>
                </div>
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary mt-4">Create</button>
        </form>
      </div>
    </div>
  );
}