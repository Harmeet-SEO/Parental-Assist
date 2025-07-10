import React, { useEffect, useState } from "react";
import { api } from "../api";
import AdminNavbar from "../components/AdminNavbar";  // ✅ Import it
import 'bootstrap/dist/css/bootstrap.min.css';

export default function AdminDashboard() {
  const [admins, setAdmins] = useState([]);
  const [parents, setParents] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/api/admin/dashboard")
      .then(res => {
        setAdmins(res.data.admins);
        setParents(res.data.parents);
        setUsers(res.data.users);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <AdminNavbar /> {/* ✅ Add navbar here */}

      <div className="container py-5">
        <h1 className="mb-4">Admin Dashboard</h1>
        <p className="mb-4">Welcome, Admin! Below are the latest created users in each category.</p>

        <div className="mb-4">
          <h3>Newest Admins</h3>
          <ul>
            {admins.map(admin => (
              <li key={admin._id}>{admin.firstname} {admin.lastname} - {admin.email}</li>
            ))}
          </ul>
        </div>

        <div className="mb-4">
          <h3>Newest Parents</h3>
          <ul>
            {parents.map(parent => (
              <li key={parent._id}>{parent.firstname} {parent.lastname} - {parent.email}</li>
            ))}
          </ul>
        </div>

        <div className="mb-4">
          <h3>Newest Users</h3>
          <ul>
            {users.map(user => (
              <li key={user._id}>{user.firstname} {user.lastname} - {user.email}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}