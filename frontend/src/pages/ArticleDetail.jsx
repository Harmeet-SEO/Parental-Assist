import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";
import "./ArticleDetail.css";

export default function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    api.get(`/api/admin/articles/${id}`)
      .then(res => setArticle(res.data))
      .catch(console.error);
  }, [id]);

  if (!article) return <p>Loading...</p>;

  return (
    <main className="article-detail">
      {article.header_image && (
        <div
          className="article-hero"
          style={{ backgroundImage: `url(${article.header_image})` }}
        >
          <div className="overlay">
            <h1>{article.title}</h1>
            <p className="byline">
              By {article.author} | {article.date_posted}
            </p>
          </div>
        </div>
      )}

      <section className="article-body container">
        <p className="article-summary">{article.summary}</p>

        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: article.body.replace(/\n/g, "<br/>") }}
        />

        <div className="article-meta">
          <small>Tags: {article.tags}</small>
        </div>

        <div className="article-actions">
          <button className="btn btn-like">❤️ Like</button>
          <button className="btn btn-share">🔗 Share</button>
        </div>

        <div className="article-comments">
          <h3>Comments</h3>
          <textarea placeholder="Write a comment..." />
          <button className="btn btn-comment">Post Comment</button>
        </div>
      </section>
    </main>
  );
}