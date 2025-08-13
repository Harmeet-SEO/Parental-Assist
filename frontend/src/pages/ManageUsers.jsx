import React, { useEffect, useState } from "react";
import { api } from "../api";
import { Link, useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import "bootstrap/dist/css/bootstrap.min.css";

// Helpers to normalize IDs & fields
const getId = (obj) => obj?._id?.$oid || obj?._id || obj?.id || "";
const getChildId = (obj) => obj?._id?.$oid || obj?._id || obj?.id || "";

// Normalize backend user to UI user shape
const toUiUser = (u) => ({
  ...u,
  userType: u?.userType || u?.role || "parent",
  _id: getId(u),
});

export default function ManageUsers() {
  const [parents, setParents] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newChild, setNewChild] = useState({ name: "", age: "", gender: "" });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAll();
  }, []); // deps intentionally empty

  const fetchAll = async () => {
    setLoading(true);
    setErr("");
    try {
      const { data } = await api.get("/api/admin/dashboard");
      const p = Array.isArray(data?.parents) ? data.parents.map(toUiUser) : [];
      const a = Array.isArray(data?.admins) ? data.admins.map(toUiUser) : [];
      setParents(p);
      setAdmins(a);
    } catch (e) {
      if (e?.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      setErr(e?.response?.data?.error || e.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (rawId) => {
    const id = getId({ _id: rawId });
    if (!id) return alert("Invalid user id.");
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    // optimistic removal
    const prevParents = parents;
    const prevAdmins = admins;
    setParents((ps) => ps.filter((u) => getId(u) !== id));
    setAdmins((as) => as.filter((u) => getId(u) !== id));

    try {
      await api.delete(`/api/admin/users/${id}`);
    } catch (e) {
      // revert on failure
      setParents(prevParents);
      setAdmins(prevAdmins);
      alert(e?.response?.data?.error || e.message || "Failed to delete user.");
    }
  };

  const handleSave = async () => {
    if (!selectedUser) return;

    const id = getId(selectedUser);
    if (!id) return alert("Invalid user id.");

    const payload = {
      firstname: (selectedUser.firstname || "").trim(),
      lastname: (selectedUser.lastname || "").trim(),
      email: (selectedUser.email || "").trim(),
      phone_number: (selectedUser.phone_number || "").trim(),
      address: (selectedUser.address || "").trim(),
      // Backend commonly expects "role"
      role: selectedUser.userType || selectedUser.role || "parent",
      // Preserve children if user is a parent
      children: Array.isArray(selectedUser.children)
        ? selectedUser.children.map((c) => ({
            _id: getChildId(c) || undefined,
            name: (c.name || "").trim(),
            age: Number(c.age) || 0,
            gender: (c.gender || "").trim(),
          }))
        : [],
    };

    try {
      await api.put(`/api/admin/users/${id}`, payload);
      setSelectedUser(null);
      await fetchAll();
    } catch (e) {
      alert(e?.response?.data?.error || e.message || "Failed to update user.");
    }
  };

  const handleAddChild = async () => {
    if (!selectedUser) return;
    if (!newChild.name || !newChild.age || !newChild.gender) {
      alert("Fill in all child fields");
      return;
    }
    const userId = getId(selectedUser);
    if (!userId) return alert("Invalid user id.");

    const payload = {
      name: newChild.name.trim(),
      age: Number(newChild.age) || 0,
      gender: newChild.gender.trim(),
    };

    try {
      await api.post(`/api/admin/parents/${userId}/children`, payload);
      setNewChild({ name: "", age: "", gender: "" });
      await fetchAll();
      // keep modal open & refresh selected user
      const updated = [...parents, ...admins].find((u) => getId(u) === userId);
      if (updated) setSelectedUser(toUiUser(updated));
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.error || e.message || "Failed to add child.");
    }
  };

  const handleDeleteChild = async (child) => {
    const childId = getChildId(child);
    if (!childId) return alert("Invalid child id.");
    if (!window.confirm("Delete this child?")) return;

    try {
      await api.delete(`/api/admin/children/${childId}`);
      await fetchAll();
      if (selectedUser) {
        const refreshed = [...parents, ...admins].find(
          (u) => getId(u) === getId(selectedUser)
        );
        if (refreshed) setSelectedUser(toUiUser(refreshed));
      }
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.error || e.message || "Failed to delete child.");
    }
  };

  return (
    <div>
      <AdminNavbar />

      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Manage Users</h1>
          <Link to="/admin/create-user" className="btn btn-primary">
            Create User
          </Link>
        </div>

        {loading && <p>Loading…</p>}
        {err && <div className="alert alert-danger">{err}</div>}

        {!loading && !err && (
          <>
            <h3>Parents</h3>
            <TableBlock
              data={parents}
              setSelectedUser={setSelectedUser}
              handleDelete={handleDelete}
              isParent={true}
            />

            <h3 className="mt-5">Admins</h3>
            <TableBlock
              data={admins}
              setSelectedUser={setSelectedUser}
              handleDelete={handleDelete}
            />
          </>
        )}

        {selectedUser && (
          <div
            className="modal show fade d-block"
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">View / Edit User</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSelectedUser(null)}
                    aria-label="Close"
                  />
                </div>

                <div className="modal-body">
                  {[
                    "firstname",
                    "lastname",
                    "email",
                    "phone_number",
                    "address",
                  ].map((field) => (
                    <div className="mb-3" key={field}>
                      <label className="form-label">
                        {field.replace("_", " ").toUpperCase()}
                      </label>
                      <input
                        type={field === "email" ? "email" : "text"}
                        className="form-control"
                        value={selectedUser[field] || ""}
                        onChange={(e) =>
                          setSelectedUser({
                            ...selectedUser,
                            [field]: e.target.value,
                          })
                        }
                      />
                    </div>
                  ))}

                  <div className="mb-3">
                    <label className="form-label">User Type</label>
                    <select
                      className="form-select"
                      value={selectedUser.userType || "parent"}
                      onChange={(e) =>
                        setSelectedUser({
                          ...selectedUser,
                          userType: e.target.value,
                        })
                      }
                    >
                      <option value="parent">Parent</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  {selectedUser.userType === "parent" && (
                    <>
                      <h5 className="mt-4">Children</h5>
                      <ul>
                        {(selectedUser.children || []).map((child) => (
                          <li key={getChildId(child)}>
                            {child.name} - Age: {child.age} - Gender:{" "}
                            {child.gender}
                            <button
                              className="btn btn-danger btn-sm ms-2"
                              onClick={() => handleDeleteChild(child)}
                            >
                              Delete
                            </button>
                          </li>
                        ))}
                        {(selectedUser.children || []).length === 0 && (
                          <li className="text-muted">No children on record.</li>
                        )}
                      </ul>

                      <h6 className="mt-3">Add New Child</h6>
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
                              setNewChild({
                                ...newChild,
                                gender: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="col-auto">
                          <button
                            className="btn btn-success"
                            onClick={handleAddChild}
                          >
                            Add Child
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setSelectedUser(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSave}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TableBlock({ data, setSelectedUser, handleDelete, isParent = false }) {
  return (
    <div className="table-responsive">
      <table className="table table-striped align-middle">
        <thead className="thead-dark">
          <tr>
            <th>First</th>
            <th>Last</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>User Type</th>
            <th style={{ width: 220 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user, i) => {
            const id = getId(user);
            return (
              <React.Fragment key={id || user.email || i}>
                <tr>
                  <td>{user.firstname || "-"}</td>
                  <td>{user.lastname || "-"}</td>
                  <td>{user.email}</td>
                  <td>{user.phone_number || "-"}</td>
                  <td>{user.address || "-"}</td>
                  <td>{user.userType || user.role || "-"}</td>
                  <td>
                    <button
                      className="btn btn-info btn-sm me-2"
                      onClick={() => setSelectedUser({ ...user })}
                    >
                      View / Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(id)}
                      disabled={!id}
                      title={!id ? "Invalid id" : "Delete"}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
                {isParent && user.children && user.children.length > 0 && (
                  <tr>
                    <td colSpan="7">
                      <strong>Children:</strong>
                      <ul className="mb-0">
                        {user.children.map((child) => (
                          <li key={getChildId(child)}>
                            {child.name} — Age: {child.age} — Gender:{" "}
                            {child.gender}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
          {data.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center text-muted py-4">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
