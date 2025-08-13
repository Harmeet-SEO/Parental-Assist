import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "./Feedback.css";
import ChatBot from "../components/ChatBot";
import { api } from "../api"; // ✅ env-driven axios (REACT_APP_API_BASE_URL)

export default function Feedback() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");

  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Load existing feedback (tries /api/feedback, falls back to /api/admin/content for dev)
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await api.get("/api/feedback"); // preferred endpoint
        if (!alive) return;
        setFeedbackList(Array.isArray(data) ? data : []);
      } catch (e1) {
        try {
          // Fallback: reuse content items so the page isn't empty in dev
          const { data } = await api.get("/api/admin/content");
          if (!alive) return;
          const normalized = (data || []).slice(0, 6).map((d, i) => ({
            id: d?._id?.$oid || d?._id || d?.id || `c_${i}`,
            rating: Math.min(5, Math.max(1, ((d?.title || "").length % 5) + 1)),
            text: d?.body || d?.title || "No text",
          }));
          setFeedbackList(normalized);
        } catch (e2) {
          setErr(
            e2?.response?.data?.error ||
              e1?.message ||
              "Failed to load feedback."
          );
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = feedbackText.trim();
    if (rating <= 0 || !text) return;

    // Optimistic UI update
    const temp = { id: `tmp_${Date.now()}`, rating, text };
    setFeedbackList((list) => [temp, ...list]);
    setFeedbackText("");
    setRating(0);
    setHover(0);

    try {
      const { data } = await api.post("/api/feedback", { rating, text });
      // Replace temp with saved (if backend returns object with id)
      if (data && typeof data === "object") {
        setFeedbackList((list) => [
          data,
          ...list.filter((f) => f.id !== temp.id),
        ]);
      }
    } catch (e) {
      // Revert optimistic insert on failure
      setFeedbackList((list) => list.filter((f) => f.id !== temp.id));
      alert(
        e?.response?.data?.error || e.message || "Failed to submit feedback."
      );
    }
  };

  const average =
    feedbackList.length > 0
      ? (
          feedbackList.reduce((s, f) => s + (Number(f.rating) || 0), 0) /
          feedbackList.length
        ).toFixed(1)
      : null;

  return (
    <>
      <Navbar />
      <ChatBot />
      <main className="feedback-page">
        <h1>Feedback & Rating</h1>
        {average && (
          <p className="avg-line">
            Average rating: <strong>{average}</strong> / 5 (
            {feedbackList.length} reviews)
          </p>
        )}

        {/* Feedback Form */}
        <form className="feedback-form" onSubmit={handleSubmit}>
          <h2>Rate our Platform</h2>

          {/* Star Rating (accessible) */}
          <div
            className="star-rating"
            role="radiogroup"
            aria-label="Rate from 1 to 5 stars"
          >
            {[...Array(5)].map((_, index) => {
              const value = index + 1;
              const active = value <= (hover || rating);
              return (
                <label
                  key={value}
                  aria-label={`${value} star`}
                  style={{ cursor: "pointer" }}
                >
                  <input
                    type="radio"
                    name="rating"
                    value={value}
                    onChange={() => setRating(value)}
                    style={{ display: "none" }}
                  />
                  <span
                    className="star"
                    onMouseEnter={() => setHover(value)}
                    onMouseLeave={() => setHover(0)}
                    style={{ color: active ? "#FF867C" : "#ccc" }}
                  >
                    &#9733;
                  </span>
                </label>
              );
            })}
          </div>

          {/* Feedback Text */}
          <textarea
            name="feedbackText"
            placeholder="Write your feedback..."
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            required
          />

          <button type="submit" disabled={rating === 0 || !feedbackText.trim()}>
            Submit Feedback
          </button>
        </form>

        {loading && <p>Loading…</p>}
        {err && <div className="alert alert-danger">{err}</div>}

        {/* Feedback List */}
        <div className="feedback-list">
          {feedbackList.map((fb, i) => (
            <div
              key={fb._id?.$oid || fb._id || fb.id || i}
              className="feedback-card"
            >
              <div className="stars">
                {"★".repeat(Number(fb.rating) || 0)}
                {"☆".repeat(Math.max(0, 5 - (Number(fb.rating) || 0)))}
              </div>
              <p>{fb.text}</p>
            </div>
          ))}
          {!loading && !err && feedbackList.length === 0 && (
            <p>No feedback yet. Be the first to share yours!</p>
          )}
        </div>
      </main>
    </>
  );
}
