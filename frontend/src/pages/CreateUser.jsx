// src/pages/CreateUser.jsx
import React, { useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";

export default function CreateUser() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone_number: "",
    address: "",
    userType: "parent", // "parent" | "admin"
    children: [],
  });
  const [newChild, setNewChild] = useState({ name: "", age: "", gender: "" });

  const handleAddChild = () => {
    if (!newChild.name || !newChild.age || !newChild.gender) {
      return toast.error("Fill in all child fields");
    }
    setForm((f) => ({ ...f, children: [...f.children, newChild] }));
    setNewChild({ name: "", age: "", gender: "" });
  };

  const removeChild = (idx) => {
    setForm((f) => ({
      ...f,
      children: f.children.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstname.trim() || !form.lastname.trim()) {
      return toast.error("First and last name are required");
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      return toast.error("Enter a valid email");
    }

    const payload = {
      firstname: form.firstname.trim(),
      lastname: form.lastname.trim(),
      email: form.email.trim(),
      phone_number: form.phone_number.trim(),
      address: form.address.trim(),
      role: form.userType, // ✅ common backend field name
      children:
        form.userType === "parent"
          ? form.children.map((c) => ({
              name: c.name.trim(),
              age: Number(c.age) || 0,
              gender: c.gender.trim(),
            }))
          : [],
    };

    try {
      setSaving(true);
      await api.post("/api/admin/create_user", payload);
      toast.success("User created");
      navigate("/admin/users");
    } catch (err) {
      if (err?.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      toast.error(err?.response?.data?.error || err.message || "Create failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <AdminNavbar />

      <div className="container py-5">
        <h1>Create New User</h1>
        <form onSubmit={handleSubmit}>
          {["firstname", "lastname", "email", "phone_number", "address"].map(
            (field) => (
              <div className="mb-3" key={field}>
                <label className="form-label">
                  {field.replace("_", " ").toUpperCase()}
                </label>
                <input
                  type={field === "email" ? "email" : "text"}
                  className="form-control"
                  value={form[field]}
                  onChange={(e) =>
                    setForm({ ...form, [field]: e.target.value })
                  }
                  required={["firstname", "lastname", "email"].includes(field)}
                />
              </div>
            )
          )}

          <div className="mb-3">
            <label className="form-label">User Type</label>
            <select
              className="form-select"
              value={form.userType}
              onChange={(e) => setForm({ ...form, userType: e.target.value })}
            >
              <option value="parent">Parent</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {form.userType === "parent" && (
            <>
              <h5 className="mt-4">Children</h5>
              <ul>
                {form.children.map((child, idx) => (
                  <li key={`${child.name}_${idx}`} className="mb-1">
                    {child.name} — Age: {child.age} — Gender: {child.gender}{" "}
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger ms-2"
                      onClick={() => removeChild(idx)}
                    >
                      Remove
                    </button>
                  </li>
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
                    onChange={(e) =>
                      setNewChild({ ...newChild, name: e.target.value })
                    }
                  />
                </div>
                <div className="col">
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    placeholder="Age"
                    value={newChild.age}
                    onChange={(e) =>
                      setNewChild({ ...newChild, age: e.target.value })
                    }
                  />
                </div>
                <div className="col">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Gender"
                    value={newChild.gender}
                    onChange={(e) =>
                      setNewChild({ ...newChild, gender: e.target.value })
                    }
                  />
                </div>
                <div className="col-auto">
                  <button
                    className="btn btn-success"
                    type="button"
                    onClick={handleAddChild}
                  >
                    Add Child
                  </button>
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            className="btn btn-primary mt-4"
            disabled={saving}
          >
            {saving ? "Creating..." : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
}
