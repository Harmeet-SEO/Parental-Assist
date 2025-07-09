import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
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

  const [child, setChild] = useState({
    name: "",
    age: "",
    gender: ""
  });

  const handleAddChild = () => {
    if (child.name && child.age && child.gender) {
      setForm({ ...form, children: [...form.children, child] });
      setChild({ name: "", age: "", gender: "" });
    }
  };

  const handleRemoveChild = (index) => {
    const updated = [...form.children];
    updated.splice(index, 1);
    setForm({ ...form, children: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post("/api/admin/create_user", form)
      .then(() => {
        navigate("/admin/users");
      })
      .catch(err => {
        console.error(err);
        alert("Failed to create user");
      });
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">Create New User</h1>
      <form onSubmit={handleSubmit}>

        <div className="mb-3">
          <label className="form-label">First Name</label>
          <input className="form-control" value={form.firstname} onChange={e => setForm({ ...form, firstname: e.target.value })} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Last Name</label>
          <input className="form-control" value={form.lastname} onChange={e => setForm({ ...form, lastname: e.target.value })} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input className="form-control" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <input className="form-control" value={form.phone_number} onChange={e => setForm({ ...form, phone_number: e.target.value })} />
        </div>

        <div className="mb-3">
          <label className="form-label">Address</label>
          <input className="form-control" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
        </div>

        <div className="mb-3">
          <label className="form-label">User Type</label>
          <select
            className="form-select"
            value={form.userType}
            onChange={e => setForm({ ...form, userType: e.target.value })}
          >
            <option value="user">User</option>
            <option value="parent">Parent</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {form.userType === "parent" && (
          <>
            <h5>Children</h5>

            {form.children.length > 0 && (
              <ul className="list-group mb-3">
                {form.children.map((c, idx) => (
                  <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                    {c.name} - Age: {c.age} - Gender: {c.gender}
                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleRemoveChild(idx)}>Remove</button>
                  </li>
                ))}
              </ul>
            )}

            <div className="mb-3">
              <input className="form-control mb-2" placeholder="Child's Name" value={child.name} onChange={e => setChild({ ...child, name: e.target.value })} />
              <input className="form-control mb-2" placeholder="Child's Age" type="number" value={child.age} onChange={e => setChild({ ...child, age: e.target.value })} />
              <input className="form-control mb-2" placeholder="Child's Gender" value={child.gender} onChange={e => setChild({ ...child, gender: e.target.value })} />
              <button type="button" className="btn btn-secondary" onClick={handleAddChild}>Add Child</button>
            </div>
          </>
        )}

        <button type="submit" className="btn btn-success">Create User</button>
      </form>
    </div>
  );
}