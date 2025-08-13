// src/pages/CategoryPage.jsx
import React, { useEffect, useState } from "react";
import "./category.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ChatBot from "../components/ChatBot";
import { api, API_BASE_URL } from "../api";

const joinUrl = (base, path) => {
  const b = String(base || "").replace(/\/+$/, "");
  const p = String(path || "");
  if (!p) return "";
  return `${b}${p.startsWith("/") ? "" : "/"}${p}`;
};

const toImageUrl = (val) =>
  /^https?:\/\//i.test(val || "")
    ? val
    : val
    ? joinUrl(API_BASE_URL, val)
    : "/assets/profile-placeholder.jpg";

export default function CategoryPage() {
  const [items, setItems] = useState([]);
  const [visible, setVisible] = useState(8);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        // Try resources endpoint first (if your API exposes it)
        const { data } = await api.get("/api/admin/resources");
        if (!alive) return;
        setItems(Array.isArray(data) ? data : []);
      } catch {
        try {
          // Fallback to generic content
          const { data } = await api.get("/api/admin/content");
          if (!alive) return;
          // Normalize: title/body/header_image/id
          const normalized = (data || []).map((d, i) => ({
            id: d?._id?.$oid || d?._id || d?.id || `c_${i}`,
            title: d?.title || "Untitled",
            body: d?.body || "",
            header_image: d?.header_image || "",
          }));
          setItems(normalized);
        } catch {
          try {
            // Final fallback: articles as “resources”
            const { data } = await api.get("/api/admin/articles");
            if (!alive) return;
            const normalized = (data || []).map((a, i) => ({
              id: a?._id?.$oid || a?._id || a?.id || `a_${i}`,
              title: a?.title || "Untitled",
              body: a?.summary || a?.body || "",
              header_image: a?.header_image || "",
            }));
            setItems(normalized);
          } catch (e3) {
            setErr(
              e3?.response?.data?.error ||
                e3.message ||
                "Failed to load resources."
            );
          }
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const visibleItems = items.slice(0, visible);

  return (
    <>
      <Navbar />
      <ChatBot />

      <div className="category-container">
        <h1>Resources</h1>
        <p className="category-intro">
          Welcome to the Culture section of our news, where we explore the
          latest trends and topics...
        </p>

        {loading && <p>Loading…</p>}
        {err && <div className="alert alert-danger">{err}</div>}

        {!loading && !err && (
          <>
            <div className="category-grid">
              {visibleItems.map((item) => (
                <div key={item.id} className="category-card">
                  <div
                    className="card-image"
                    style={{
                      backgroundImage: `url(${toImageUrl(item.header_image)})`,
                    }}
                  />
                  <div className="card-title">{item.title}</div>
                </div>
              ))}
              {visibleItems.length === 0 && <p>No resources found.</p>}
            </div>

            {visible < items.length && (
              <button
                className="load-more"
                onClick={() => setVisible((v) => v + 8)}
              >
                Load more
              </button>
            )}
          </>
        )}
      </div>

      <Footer />
    </>
  );
}
