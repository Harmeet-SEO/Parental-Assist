// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { api } from "../api";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AdminDashboard.css";

const getId = (obj) => obj?._id?.$oid || obj?._id || obj?.id || "";

export default function AdminDashboard() {
  const [admins, setAdmins] = useState([]);
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await api.get("/api/admin/dashboard");
        if (!alive) return;
        setAdmins(Array.isArray(data?.admins) ? data.admins : []);
        setParents(Array.isArray(data?.parents) ? data.parents : []);
      } catch (e) {
        if (e?.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        setErr(
          e?.response?.data?.error || e.message || "Failed to load dashboard."
        );
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="admin-dashboard d-flex">
      {/* === Sidebar === */}
      <aside className="sidebar bg-dark text-white p-4">
        <h2 className="mb-4">Parental Assist</h2>
        <nav className="nav flex-column">
          <Link className="nav-link text-white mb-2" to="/admin/dashboard">
            Dashboard
          </Link>
          <Link className="nav-link text-white mb-2" to="/admin/users">
            Manage Users
          </Link>
          <Link className="nav-link text-white mb-2" to="/admin/content">
            Manage Content
          </Link>
          <Link className="nav-link text-white mb-2" to="/admin/create-user">
            Create User
          </Link>
          <button
            className="nav-link text-white text-start btn btn-link p-0"
            onClick={logout}
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* === Main Content === */}
      <main className="flex-grow-1 p-5">
        <h1 className="mb-4 fw-bold">Welcome Admin</h1>

        {loading && <p>Loading…</p>}
        {err && <div className="alert alert-danger">{err}</div>}

        {!loading && !err && (
          <div className="row g-4">
            <div className="col-md-6">
              <div className="card bg-light p-4 rounded shadow-sm">
                <h5 className="fw-bold mb-3">Newest Admins</h5>
                <ul className="list-unstyled">
                  {admins.map((admin, i) => (
                    <li key={getId(admin) || admin.email || i} className="mb-2">
                      <strong>
                        {admin.firstname} {admin.lastname}
                      </strong>
                      <br />
                      <small>{admin.email}</small>
                    </li>
                  ))}
                  {admins.length === 0 && (
                    <li className="text-muted">No admins found.</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card bg-light p-4 rounded shadow-sm">
                <h5 className="fw-bold mb-3">Newest Parents</h5>
                <ul className="list-unstyled">
                  {parents.map((parent, i) => (
                    <li
                      key={getId(parent) || parent.email || i}
                      className="mb-2"
                    >
                      <strong>
                        {parent.firstname} {parent.lastname}
                      </strong>
                      <br />
                      <small>{parent.email}</small>
                    </li>
                  ))}
                  {parents.length === 0 && (
                    <li className="text-muted">No parents found.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
