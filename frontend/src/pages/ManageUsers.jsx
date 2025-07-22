import React, { useEffect, useState } from "react";
import { api } from "../api";
import { Link } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ManageUsers() {
  const [parents, setParents] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newChild, setNewChild] = useState({ name: "", age: "", gender: "" });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = () => {
    api.get("/api/admin/dashboard")
      .then(res => {
        setParents(res.data.parents);
        setAdmins(res.data.admins);
      })
      .catch(err => {
        console.error(err);
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    api.delete(`/api/admin/users/${id}`)
      .then(() => {
        fetchAll();
      })
      .catch(err => {
        console.error(err);
        alert("Failed to delete user.");
      });
  };

  const handleSave = () => {
    api.put(`/api/admin/users/${selectedUser._id}`, selectedUser)
      .then(() => {
        fetchAll();
        setSelectedUser(null);
      })
      .catch(err => {
        console.error(err);
        alert("Failed to update user.");
      });
  };

  const handleAddChild = () => {
    if (!newChild.name || !newChild.age || !newChild.gender) {
      alert("Fill in all child fields");
      return;
    }
    api.post(`/api/admin/parents/${selectedUser._id}/children`, newChild)
      .then(() => {
        fetchAll();
        setNewChild({ name: "", age: "", gender: "" });
      })
      .catch(err => console.error(err));
  };

  const handleDeleteChild = (childId) => {
    if (!window.confirm("Delete this child?")) return;
    api.delete(`/api/admin/children/${childId}`)
      .then(() => fetchAll())
      .catch(err => console.error(err));
  };

  return (
    <div>
      <AdminNavbar />

      <div className="container py-5">
        <div className="d-flex justify-content-between mb-4">
          <h1>Manage Users</h1>
          <Link to="/admin/create-user" className="btn btn-primary">Create User</Link>
        </div>

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

        {selectedUser && (
          <div className="modal show fade d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">

                <div className="modal-header">
                  <h5 className="modal-title">View / Edit User</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSelectedUser(null)}
                  ></button>
                </div>

                <div className="modal-body">
                  {["firstname", "lastname", "email", "phone_number", "address"].map(field => (
                    <div className="mb-3" key={field}>
                      <label className="form-label">{field.replace("_", " ").toUpperCase()}</label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedUser[field] || ""}
                        onChange={(e) =>
                          setSelectedUser({ ...selectedUser, [field]: e.target.value })
                        }
                      />
                    </div>
                  ))}

                  <div className="mb-3">
                    <label className="form-label">User Type</label>
                    <select
                      className="form-select"
                      value={selectedUser.userType || 'parent'}
                      onChange={(e) =>
                        setSelectedUser({ ...selectedUser, userType: e.target.value })
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
                        {selectedUser.children && selectedUser.children.map(child => (
                          <li key={child._id}>
                            {child.name} - Age: {child.age} - Gender: {child.gender}
                            <button
                              className="btn btn-danger btn-sm ms-2"
                              onClick={() => handleDeleteChild(child._id)}
                            >
                              Delete
                            </button>
                          </li>
                        ))}
                      </ul>

                      <h6 className="mt-3">Add New Child</h6>
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
                          <button className="btn btn-success" onClick={handleAddChild}>Add Child</button>
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
    <table className="table table-striped">
      <thead className="thead-dark">
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Address</th>
          <th>User Type</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map(user => (
          <React.Fragment key={user._id}>
            <tr>
              <td>{user.firstname || '-'}</td>
              <td>{user.lastname || '-'}</td>
              <td>{user.email}</td>
              <td>{user.phone_number || '-'}</td>
              <td>{user.address || '-'}</td>
              <td>{user.userType || '-'}</td>
              <td>
                <button
                  className="btn btn-info btn-sm me-2"
                  onClick={() => setSelectedUser({ ...user })}
                >
                  View / Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(user._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
            {isParent && user.children && user.children.length > 0 && (
              <tr>
                <td colSpan="7">
                  <strong>Children:</strong>
                  <ul>
                    {user.children.map(child => (
                      <li key={child._id}>{child.name} - Age: {child.age} - Gender: {child.gender}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
}
