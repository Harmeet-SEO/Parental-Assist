import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";
import "./ArticleDetail.css";

// If you use Font Awesome:
import { FaHeart, FaShareAlt, FaFacebook, FaTwitter } from "react-icons/fa";

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
          <button className="btn-action">
            <FaHeart /> Like
          </button>
          <button className="btn-action">
            <FaShareAlt /> Share
          </button>

          <div className="share-icons">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${window.location.href}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter />
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook />
            </a>
          </div>
        </div>

        <div className="article-comments">
          <h3>Comments</h3>
          <textarea placeholder="Write a comment..." />
          <button className="btn-comment">Post Comment</button>
        </div>
      </section>
    </main>
  );
}
