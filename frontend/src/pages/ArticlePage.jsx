import React, { useState, useEffect } from "react";
import { api } from "../api";
import "./ArticlePage.css";

export default function ArticlePage() {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTag, setFilterTag] = useState("");

  useEffect(() => {
    api.get("/api/admin/articles")
      .then(res => {
        setArticles(res.data || []);
      })
      .catch(console.error);
  }, []);

  const filteredArticles = articles.filter(article => {
    const matchesSearch =
      article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.body?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTag =
      !filterTag || (article.tags && article.tags.toLowerCase().includes(filterTag.toLowerCase()));

    return matchesSearch && matchesTag;
  });

  return (
    <main className="articles-page container py-5">
      <h1 className="mb-4">Latest Articles</h1>

      <div className="filters mb-4">
        <input
          className="form-control mb-2"
          placeholder="Search articles..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />

        <input
          className="form-control"
          placeholder="Filter by tag..."
          value={filterTag}
          onChange={e => setFilterTag(e.target.value)}
        />
      </div>

      <div className="row">
        {filteredArticles.length === 0 && (
          <p>No articles match your criteria.</p>
        )}

        {filteredArticles.map(article => (
          <div key={article._id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 shadow-sm">
              {article.header_image && (
                <img
                  src={article.header_image}
                  alt={article.title}
                  className="card-img-top"
                />
              )}

              <div className="card-body">
                <h5 className="card-title">{article.title}</h5>
                <p className="text-muted mb-1">
                  By {article.author} | {article.date_posted}
                </p>
                <p className="card-text">{article.summary}</p>
                {article.tags && (
                  <small className="text-muted">Tags: {article.tags}</small>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
