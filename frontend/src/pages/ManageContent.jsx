import React, { useEffect, useState } from "react";
import { api } from "../api";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ManageContent() {
  const [content, setContent] = useState([]);

  useEffect(() => {
    api.get("/api/admin/content")
      .then(res => {
        setContent(res.data);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this content?")) return;

    api.delete(`/api/admin/content/${id}`)
      .then(() => {
        setContent(content.filter(item => item._id !== id));
      })
      .catch(err => {
        console.error(err);
        alert("Failed to delete content.");
      });
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">Manage Content</h1>

      <Link to="/admin/content/add" className="btn btn-success mb-3">
        Add New Content
      </Link>

      <table className="table table-striped">
        <thead className="thead-dark">
          <tr>
            <th>Title</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {content.map(item => (
            <tr key={item._id}>
              <td>{item.title}</td>
              <td>
                <Link
                  to={`/admin/content/edit/${item._id}`}
                  className="btn btn-primary btn-sm me-2"
                >
                  Edit
                </Link>
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
  );
}
