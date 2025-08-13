// src/pages/Podcasts.jsx
import React, { useEffect, useState } from "react";
import "./podcasts.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ChatBot from "../components/ChatBot";
import { api, API_BASE_URL } from "../api";

const categories = [
  { id: 1, emoji: "🧘‍♂️", name: "Meditation" },
  { id: 2, emoji: "📣", name: "Daily Update" },
  { id: 3, emoji: "🎧", name: "Storytime" },
  { id: 4, emoji: "🍎", name: "Parent Tips" },
  { id: 5, emoji: "👨‍👩‍👧", name: "Education" },
  { id: 6, emoji: "🧠", name: "Mental Wellness" },
];

const joinUrl = (base, path) => {
  const b = String(base || "").replace(/\/+$/, "");
  const p = String(path || "");
  if (!p) return "";
  return `${b}${p.startsWith("/") ? "" : "/"}${p}`;
};
const toImg = (val) =>
  /^https?:\/\//i.test(val || "")
    ? val
    : val
    ? joinUrl(API_BASE_URL, val)
    : "/assets/profile-placeholder.jpg";

export default function Podcasts() {
  const [pods, setPods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // hardcoded fallback (your current list)
  const fallback = [
    {
      id: 1,
      title: "Morning Motivation",
      img: "/assets/podcast12.jpg",
      link: "https://example.com/morning-motivation",
    },
    {
      id: 2,
      title: "Parenting Tips",
      img: "/assets/podcast2.jpg",
      link: "https://example.com/parenting-tips",
    },
    {
      id: 3,
      title: "Mindfulness for Kids",
      img: "/assets/podcast3.jpg",
      link: "https://example.com/mindfulness",
    },
    {
      id: 4,
      title: "Nutrition Nuggets",
      img: "/assets/podcast4.jpg",
      link: "https://example.com/nutrition",
    },
    {
      id: 5,
      title: "Family Time Stories",
      img: "/assets/podcast5.jpg",
      link: "https://example.com/family-time",
    },
    {
      id: 6,
      title: "Weekend Adventure",
      img: "/assets/podcast6.jpg",
      link: "https://example.com/weekend-adventure",
    },
  ];

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // Preferred: a dedicated endpoint
        // Expected item shape: { id, title, image, link }
        const { data } = await api.get("/api/admin/articles");
        if (!alive) return;
        const normalized = (data || [])
          .filter((a) => (a?.tags || "").toLowerCase().includes("podcast"))
          .slice(0, 12)
          .map((a, i) => ({
            id: a?._id?.$oid || a?._id || a?.id || `a_${i}`,
            title: a?.title || "Untitled",
            image: a?.header_image || "",
            link: a?.external_url || "#",
          }));
        setPods(normalized.length ? normalized : fallback);
      } catch {
        try {
          // Fallback: reuse articles tagged "podcast"
          const { data } = await api.get("/api/admin/articles");
          if (!alive) return;
          const normalized = (data || [])
            .filter((a) => (a?.tags || "").toLowerCase().includes("podcast"))
            .slice(0, 12)
            .map((a, i) => ({
              id: a?._id?.$oid || a?._id || a?.id || `a_${i}`,
              title: a?.title || "Untitled",
              image: a?.header_image || "",
              link: a?.external_url || "#",
            }));
          setPods(normalized.length ? normalized : fallback);
        } catch (e2) {
          setErr(
            e2?.response?.data?.error ||
              e2.message ||
              "Failed to load podcasts."
          );
          setPods(fallback);
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <>
      <Navbar />
      <ChatBot />

      <div className="podcast-container">
        <h1>Podcasts</h1>
        <p>
          At <strong>Parental Assist</strong>, we bring you the best of
          easy-to-listen podcasts…
        </p>

        <hr style={{ margin: "2rem 0" }} />

        <h2>Latest episodes</h2>
        {loading && <p>Loading…</p>}
        {err && <div className="alert alert-warning">{err}</div>}

        <div className="podcast-grid">
          {pods.map((pod, i) => (
            <a
              href={pod.link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              key={pod.id || i}
              className="podcast-card"
              aria-label={`Open ${pod.title}`}
            >
              <img
                src={toImg(pod.image || pod.img)}
                alt={pod.title}
                className="podcast-image"
                onError={(e) => {
                  e.currentTarget.src = "/assets/profile-placeholder.jpg";
                }}
              />
              <div className="podcast-title">{pod.title}</div>
              <div className="play-button">▶</div>
            </a>
          ))}
        </div>

        <h2 style={{ marginTop: "3rem" }}>Categories</h2>
        <div className="podcast-categories">
          {categories.map((cat) => (
            <div key={cat.id} className="category-card">
              <span className="category-emoji">{cat.emoji}</span>
              <p>{cat.name}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}
