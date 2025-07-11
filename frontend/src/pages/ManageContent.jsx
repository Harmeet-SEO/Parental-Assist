import React, { useEffect, useState } from "react";
import { api } from "../api";
import { Link, useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ManageContent() {
  const [content, setContent] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = () => {
    api.get("/api/admin/content")
      .then(res => setContent(res.data))
      .catch(err => console.error(err));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this content?")) return;

    api.delete(`/api/admin/content/${id}`)
      .then(() => fetchContent())
      .catch(err => console.error(err));
  };

  return (
    <div>
      <AdminNavbar />

      <div className="container py-5">
        <div className="d-flex justify-content-between mb-4">
          <h1>Manage Content</h1>
          <Link to="/admin/content/add" className="btn btn-primary h-auto">
            Add New Content
          </Link>
        </div>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>Title</th>
              <th>Body</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {content.map(item => (
              <tr key={item._id}>
                <td>{item.title}</td>
                <td>{item.body}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm me-2"
                    onClick={() => navigate(`/admin/add-edit-content?id=${item._id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}