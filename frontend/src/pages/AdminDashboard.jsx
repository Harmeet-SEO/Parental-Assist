import React from "react";
import './AdminDashboard.css';
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function AdminDashboard() {
  return (
    <div className="container py-5">
      <h1 className="mb-4">Admin Dashboard</h1>
      <p className="mb-4">Welcome, Admin! Use the actions below to manage the site.</p>

      <div className="d-flex gap-3">
        <Link to="/admin/users" className="btn btn-primary">
          Manage Users
        </Link>
        <Link to="/admin/content" className="btn btn-success">
          Manage Content
        </Link>
      </div>
    </div>
  );
}