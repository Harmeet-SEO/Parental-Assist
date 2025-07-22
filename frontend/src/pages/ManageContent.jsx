import React, { useEffect, useState } from "react";
import { api } from "../api";
import { Link, useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ManageContent() {
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/admin/articles")
      .then(res => setArticles(res.data))
      .catch(console.error);
  }, []);

  const deleteArticle = (id) => {
    if (!window.confirm("Delete this article?")) return;
    api.delete(`/api/admin/articles/${id}`).then(() => {
      setArticles(prev => prev.filter(a => a._id !== id));
    });
  };

  return (
    <div>
      <AdminNavbar />
      <div className="container py-5">
        <h1>Manage Articles</h1>
        <Link to="/admin/articles/add" className="btn btn-primary mb-4">Add New Article</Link>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map(a => (
              <tr key={a._id}>
                <td>{a.title}</td>
                <td>{a.author}</td>
                <td>{a.date_posted}</td>
                <td>
                  <button className="btn btn-info btn-sm me-2"
                    onClick={() => navigate(`/admin/articles/edit/${a._id}`)}>Edit</button>
                  <button className="btn btn-danger btn-sm"
                    onClick={() => deleteArticle(a._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Repeat for Products, Resources later */}
      </div>
    </div>
  );
}
