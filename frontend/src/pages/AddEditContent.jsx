// src/pages/AddEditContent.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";
import "bootstrap/dist/css/bootstrap.min.css";

const getId = (obj) => obj?._id?.$oid || obj?._id || obj?.id || "";

export default function AddEditContent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    let alive = true;
    (async () => {
      try {
        // 1) Try direct fetch by ID
        const { data } = await api.get(`/api/admin/content/${id}`);
        if (!alive) return;
        setTitle(data?.title || "");
        setBody(data?.body || "");
      } catch {
        // 2) Fallback: fetch all and find by id, handling different _id shapes
        try {
          const { data: list } = await api.get("/api/admin/content");
          if (!alive) return;
          const found = (list || []).find((it) => getId(it) === id);
          if (found) {
            setTitle(found.title || "");
            setBody(found.body || "");
          } else {
            setError("Content not found.");
          }
        } catch (e2) {
          setError(
            e2?.response?.data?.error || e2.message || "Failed to load content."
          );
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = { title: title.trim(), body };

    try {
      if (id) {
        await api.put(`/api/admin/content/${id}`, payload);
      } else {
        await api.post(`/api/admin/content`, payload);
      }
      navigate("/admin/content");
    } catch (err) {
      setError(err?.response?.data?.error || err.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">{id ? "Edit Content" : "Add Content"}</h1>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <p>Loading…</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              className="form-control"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={saving}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Body</label>
            <textarea
              className="form-control"
              rows="5"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              disabled={saving}
            />
          </div>

          <button type="submit" className="btn btn-success" disabled={saving}>
            {saving ? "Saving…" : id ? "Update" : "Add"} Content
          </button>
        </form>
      )}
    </div>
  );
}
