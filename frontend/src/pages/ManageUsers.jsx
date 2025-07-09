import React, { useEffect, useState } from "react";
import { api } from "../api";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    api.get("/api/admin/users")
      .then(res => {
        setUsers(res.data);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    api.delete(`/api/admin/users/${id}`)
      .then(() => {
        setUsers(users.filter(u => u._id !== id));
      })
      .catch(err => {
        console.error(err);
        alert("Failed to delete user.");
      });
  };

  const handleSave = () => {
    api.put(`/api/admin/users/${selectedUser._id}`, selectedUser)
      .then(() => {
        // ✅ Update local list
        setUsers(users.map(u => (u._id === selectedUser._id ? selectedUser : u)));
        setSelectedUser(null); // Close modal
      })
      .catch(err => {
        console.error(err);
        alert("Failed to update user.");
      });
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">Manage Users</h1>
      <table className="table table-striped">
        <thead className="thead-dark">
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.firstname || '-'}</td>
              <td>{user.lastname || '-'}</td>
              <td>{user.email}</td>
              <td>{user.phone_number || '-'}</td>
              <td>{user.address || '-'}</td>
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
          ))}
        </tbody>
      </table>

      {/* ✅ Bootstrap modal */}
      {selectedUser && (
        <div className="modal show fade d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">View / Edit User</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedUser(null)}></button>
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedUser.firstname || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, firstname: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedUser.lastname || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, lastname: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={selectedUser.email || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedUser.phone_number || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, phone_number: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedUser.address || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, address: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedUser(null)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleSave}>Save Changes</button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
