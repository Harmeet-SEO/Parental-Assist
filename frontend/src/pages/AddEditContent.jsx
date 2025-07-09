import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function AddEditContent() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ Add more fields if you have them
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  // ✅ Fetch existing content if editing
  useEffect(() => {
    if (id) {
      api.get(`/api/admin/content`) // Get all, find by ID in frontend
        .then(res => {
          const item = res.data.find(item => item._id === id);
          if (item) {
            setTitle(item.title);
            setBody(item.body || "");
          }
        })
        .catch(err => console.error(err));
    }
  }, [id]);

  // ✅ Save content (POST or PUT)
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = { title, body };

    if (id) {
      api.put(`/api/admin/content/${id}`, payload)
        .then(() => navigate("/admin/content"))
        .catch(err => console.error(err));
    } else {
      api.post(`/api/admin/content`, payload)
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

        <div className="mb-3">
          <label className="form-label">Body</label>
          <textarea
            className="form-control"
            rows="5"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-success">
          {id ? "Update" : "Add"} Content
        </button>
      </form>
    </div>
  );
}