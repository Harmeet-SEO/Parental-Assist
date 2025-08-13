import React, { useEffect, useState } from "react";
import { api } from "../api";
import { Link, useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import "bootstrap/dist/css/bootstrap.min.css";

// Handles _id as string, {_id: {$oid}}, or id
const getId = (obj) => obj?._id?.$oid || obj?._id || obj?.id || "";

export default function ManageContent() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const { data } = await api.get("/api/admin/articles");
        if (!alive) return;
        setArticles(Array.isArray(data) ? data : []);
      } catch (e) {
        if (e?.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        setErr(
          e?.response?.data?.error || e.message || "Failed to load articles."
        );
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [navigate]);

  const deleteArticle = async (rawId) => {
    const id = getId({ _id: rawId }) || String(rawId || "");
    if (!id) return alert("Invalid article id.");
    if (!window.confirm("Delete this article?")) return;

    // Optimistic UI: remove row immediately
    const prev = articles;
    setArticles((list) => list.filter((a) => getId(a) !== id));

    try {
      await api.delete(`/api/admin/articles/${id}`);
    } catch (e) {
      // Revert on failure
      setArticles(prev);
      const msg = e?.response?.data?.error || e.message || "Delete failed.";
      alert(msg);
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className="container py-5">
        <h1>Manage Articles</h1>

        <div className="d-flex align-items-center justify-content-between mb-4">
          <Link to="/admin/articles/add" className="btn btn-primary">
            Add New Article
          </Link>
          {loading && <span className="text-muted">Loading…</span>}
        </div>

        {err && <div className="alert alert-danger">{err}</div>}

        {!loading && !err && (
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead>
                <tr>
                  <th style={{ minWidth: 200 }}>Title</th>
                  <th>Author</th>
                  <th>Date</th>
                  <th style={{ width: 220 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((a, i) => {
                  const id = getId(a);
                  return (
                    <tr key={id || i}>
                      <td>{a.title}</td>
                      <td>{a.author}</td>
                      <td>{a.date_posted}</td>
                      <td>
                        <button
                          className="btn btn-info btn-sm me-2"
                          onClick={() => navigate(`/admin/articles/edit/${id}`)}
                          disabled={!id}
                          title={!id ? "Invalid id" : "Edit"}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteArticle(id)}
                          disabled={!id}
                          title={!id ? "Invalid id" : "Delete"}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {articles.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center text-muted py-4">
                      No articles found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
