import React from "react";
import "./ArticlePage.css";

const ArticlePage = () => {
  return (
    <div className="article-page">
      <header className="article-header">
        <h1>Lost cat found the way back to her home</h1>
        <p className="meta">Published on May 10, 2025 · 5 min read</p>
        <div className="social-share">
          {/* Placeholder for icons */}
          <span>🔗 Share</span>
        </div>
      </header>

      <div className="article-image">
        <img src="https://via.placeholder.com/800x400" alt="Article visual" />
      </div>

      <article className="article-content">
        <p>
          After three days of wandering the city, Luna, a domestic tabby cat,
          miraculously found her way home.
        </p>
        <p>
          Her owners, the Thompsons, were overjoyed and surprised when she
          appeared on their porch early Tuesday morning.
        </p>
        <p>
          Luna had been missing since Friday evening after slipping out the back
          door unnoticed.
        </p>
      </article>

      <section className="related-articles">
        <h3>Related Articles</h3>
        <div className="related-grid">
          {/* You can reuse ArticleCard here */}
        </div>
      </section>

      <footer className="article-footer">
        <p>&copy; 2025 Parental Assist</p>
      </footer>
    </div>
  );
};

export default ArticlePage;
