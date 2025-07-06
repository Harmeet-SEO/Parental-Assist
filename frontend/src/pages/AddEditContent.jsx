import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function AddEditContent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (id) {
      api.get(`/admin/content/${id}`)
        .then(res => setTitle(res.data.title))
        .catch(err => console.error(err));
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id) {
      api.put(`/admin/content/${id}`, { title })
        .then(() => navigate("/admin/content"))
        .catch(err => console.error(err));
    } else {
      api.post("/admin/content", { title })
        .then(() => navigate("/admin/content"))
        .catch(err => console.error(err));
    }
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">{id ? "Edit Content" : "Add Content"}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            className="form-control"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-success">
          {id ? "Update" : "Add"} Content
        </button>
      </form>
    </div>
  );
}