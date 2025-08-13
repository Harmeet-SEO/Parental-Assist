import React, { useEffect, useState } from "react";
import "./Home.css";
import ArticleCard from "../components/ArticleCard";
import { Link } from "react-router-dom";
import EditorPickCard from "../components/EditorPickCard";
import PodcastCard from "../components/PodcastCard";
import Navbar from "../components/Navbar";
import HomeBanner from "../components/HomeBanner";
import ChatBot from "../components/ChatBot";
// import axios from "axios"; // ❌ not needed
import { api, API_BASE_URL } from "../api"; // ✅ use env-driven base + shared axios

// Join helper that avoids double slashes
const joinUrl = (base, path) => {
  if (!path) return "";
  const b = String(base || "").replace(/\/+$/, "");
  const p = String(path).startsWith("/") ? path : `/${path}`;
  return `${b}${p}`;
};

// Build final image URL (supports absolute http(s) or relative paths)
const toImageUrl = (val) =>
  !val
    ? "/assets/placeholder.jpg"
    : /^https?:\/\//i.test(val)
    ? val
    : `${API_BASE_URL}${val.startsWith("/") ? "" : "/"}${val}`;

const Home = () => {
  const [tips, setTips] = useState([]);
  const [selectedTip, setSelectedTip] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    api
      .get("/api/admin/content")
      .then((res) => setTips(res.data))
      .catch((err) => console.error(err));

    api
      .get("/api/admin/articles")
      .then((res) => setArticles(res.data || []))
      .catch(console.error);
  }, []);

  return (
    <div className="homepage">
      {/* === NAVBAR === */}
      <Navbar />
      <HomeBanner />
      <ChatBot />

      {/* === MAIN CONTENT === */}
      <div className="homepage__content">
        {/* === LEFT COLUMN === */}
        <div className="left-column">
          {/* === PODCAST SPOTLIGHT === */}
          <section className="podcast-highlight">
            <h3>🎧 Podcast spotlight</h3>
            <PodcastCard
              title="DAILY MINUTE: Reports from around the world"
              duration="22:14"
              author="Media Studio"
              image="/assets/podcast1.jpg"
            />
          </section>
        </div>

        {/* === RIGHT COLUMN (FEATURED GRID) === */}
        <div className="right-column">
          <section className="featured-articles">
            <div className="article-grid">
              {articles.slice(0, 3).map((article) => {
                const imgSrc = toImageUrl(article.header_image);
                return (
                  <ArticleCard
                    key={article._id}
                    title={article.title}
                    date={article.date_posted}
                    image={imgSrc}
                  />
                );
              })}
            </div>
          </section>
        </div>
      </div>

      {/* === PARENTING TIPS SECTION === */}
      <section className="parenting-tips-section">
        <h3>👨‍👩‍👧‍👦 Parenting Tips & Advice</h3>
        <div className="tips-grid">
          {tips.slice(2, 7).map((tip) => (
            <div
              key={tip._id}
              className="tip-card"
              onClick={() => {
                setSelectedTip(tip);
                setShowModal(true);
              }}
            >
              <h4>{tip.title}</h4>
              <p>{tip.body.slice(0, 100)}...</p>
              <small className="category-badge">
                {tip.category || "General"}
              </small>
            </div>
          ))}
        </div>
      </section>

      {showModal && selectedTip && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal_content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowModal(false)}>
              ✖
            </button>
            <h2>{selectedTip.title}</h2>
            <small className="category-badge">{selectedTip.category}</small>
            <p style={{ marginTop: "1rem" }}>{selectedTip.body}</p>
            <p className="tip-date">
              Published:{" "}
              {new Date(
                selectedTip.created_at?.$date || selectedTip.created_at
              ).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      )}

      {/* === FOOD AND DRINK === */}
      <section className="food-section">
        <h3>Food and Drink</h3>
        <div className="article-row">
          {articles
            .filter(
              (a) =>
                a.tags?.toLowerCase().includes("food") ||
                a.tags?.includes("drink")
            )
            .slice(0, 4)
            .map((article) => {
              const imgSrc = toImageUrl(article.header_image);
              return (
                <ArticleCard
                  key={article._id}
                  title={article.title}
                  date={article.date_posted}
                  image={imgSrc}
                />
              );
            })}
        </div>
      </section>

      {/* === EDITOR'S PICKS === */}
      <section className="editors-picks">
        <h3>Editor’s picks</h3>
        <div className="editor-pick-grid">
          <EditorPickCard
            number={1}
            title="People are happy and healthy everywhere"
          />
          <EditorPickCard
            number={2}
            title="Hockey Championship is about to start"
          />
          <EditorPickCard number={3} title="Finally a good theatre!" />
        </div>
      </section>

      {/* === FOOTER === */}
      <footer className="homepage__footer">
        <div className="footer-links">
          <span>About</span>
          <span>Authors</span>
          <span>Archive</span>
          <span>Terms and Conditions</span>
          <span>Cookie Policy</span>
        </div>
        <div className="social-icons">🔗 🌐 📧</div>
        <p>&copy; 2025 Parental Assist</p>
      </footer>
    </div>
  );
};

export default Home;
