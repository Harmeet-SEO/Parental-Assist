import React, { useEffect, useState } from "react";
import { api } from "../api";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [admins, setAdmins] = useState([]);
  const [parents, setParents] = useState([]);

  useEffect(() => {
    api.get("/api/admin/dashboard")
      .then(res => {
        setAdmins(res.data.admins);
        setParents(res.data.parents);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="admin-dashboard d-flex">
      {/* === Sidebar === */}
      <aside className="sidebar bg-dark text-white p-4">
        <h2 className="mb-4">Parental Assist</h2>
        <nav className="nav flex-column">
          <Link className="nav-link text-white mb-2" to="/admin/dashboard">Dashboard</Link>
          <Link className="nav-link text-white mb-2" to="/admin/users">Manage Users</Link>
          <Link className="nav-link text-white mb-2" to="/admin/content">Manage Content</Link>
          <Link className="nav-link text-white mb-2" to="/admin/create-user">Create User</Link>
          <span className="nav-link text-white">Logout</span>
        </nav>
      </aside>

      {/* === Main Content === */}
      <main className="flex-grow-1 p-5">
        <h1 className="mb-4 fw-bold">Welcome Admin</h1>

        <div className="row g-4">
          <div className="col-md-6">
            <div className="card bg-light p-4 rounded shadow-sm">
              <h5 className="fw-bold mb-3">Newest Admins</h5>
              <ul className="list-unstyled">
                {admins.map(admin => (
                  <li key={admin._id} className="mb-2">
                    <strong>{admin.firstname} {admin.lastname}</strong><br />
                    <small>{admin.email}</small>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card bg-light p-4 rounded shadow-sm">
              <h5 className="fw-bold mb-3">Newest Parents</h5>
              <ul className="list-unstyled">
                {parents.map(parent => (
                  <li key={parent._id} className="mb-2">
                    <strong>{parent.firstname} {parent.lastname}</strong><br />
                    <small>{parent.email}</small>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
