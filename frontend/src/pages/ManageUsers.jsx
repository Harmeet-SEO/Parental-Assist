import React, { useEffect, useState } from "react";
import { api } from "../api"; // ✅ Your Axios helper
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);

  // ✅ API call runs when this page loads
  useEffect(() => {
    api.get("/api/admin/users")
      .then(res => {
        setUsers(res.data);
      })
      .catch(err => {
        console.error(err);
      });
  }, []); // 👈 empty array = run once on load

  return (
    <div className="container py-5">
      <h1 className="mb-4">Manage Users</h1>
      <table className="table table-striped">
        <thead className="thead-dark">
          <tr>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.email}</td>
              <td>
                <button className="btn btn-danger btn-sm">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
