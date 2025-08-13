import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "./Contact.css";
import ChatBot from "../components/ChatBot";
import { api } from "../api"; // ✅ env-driven axios (uses REACT_APP_API_BASE_URL)

export default function Contact() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [newQuestion, setNewQuestion] = useState({
    title: "",
    description: "",
  });

  // Load from backend (and gracefully fallback if API not implemented)
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // Preferred forum endpoint (implement on backend if not present)
        const { data } = await api.get("/api/forum/questions");
        if (!alive) return;
        setQuestions(Array.isArray(data) ? data : []);
      } catch (e1) {
        try {
          // Fallback to generic content so page isn’t empty in dev
          const { data } = await api.get("/api/admin/content");
          if (!alive) return;
          const normalized = (data || []).slice(0, 6).map((d, i) => ({
            id: d?._id?.$oid || d?._id || d?.id || `c_${i}`,
            title: d?.title || "Untitled",
            description: d?.body || "",
          }));
          setQuestions(normalized);
        } catch (e2) {
          setErr(
            e2?.response?.data?.error ||
              e1?.response?.data?.error ||
              "Failed to load questions."
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

  const handleChange = (e) => {
    setNewQuestion({ ...newQuestion, [e.target.name]: e.target.value });
  };

  const handlePost = async (e) => {
    e.preventDefault();
    const title = newQuestion.title.trim();
    const description = newQuestion.description.trim();
    if (!title || !description) return;

    try {
      // Try real forum create endpoint
      const { data } = await api.post("/api/forum/questions", {
        title,
        description,
      });
      // If backend returns the saved question, prepend it
      const saved =
        data && typeof data === "object"
          ? data
          : { id: `tmp_${Date.now()}`, title, description };
      setQuestions((q) => [saved, ...q]);
      setNewQuestion({ title: "", description: "" });
    } catch (e) {
      // If not implemented, do local prepend so UI still works
      setQuestions((q) => [
        { id: `tmp_${Date.now()}`, title, description },
        ...q,
      ]);
      setNewQuestion({ title: "", description: "" });
      console.warn(
        "Posting to /api/forum/questions failed. Added locally.",
        e?.response?.data || e.message
      );
    }
  };

  return (
    <>
      <Navbar />
      <ChatBot />
      <main className="contact-page">
        <h1>Community Forum</h1>

        <form className="forum-form" onSubmit={handlePost}>
          <h2>Ask a Question</h2>
          <input
            type="text"
            name="title"
            placeholder="Question Title"
            value={newQuestion.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Question Description"
            value={newQuestion.description}
            onChange={handleChange}
            required
          />
          <button type="submit">Post Question</button>
        </form>

        {loading && <p>Loading…</p>}
        {err && <div className="alert alert-danger">{err}</div>}

        <div className="forum-questions">
          {questions.map((q, i) => (
            <div
              key={q._id?.$oid || q._id || q.id || i}
              className="forum-question-card"
            >
              <h3>{q.title}</h3>
              <p>{q.description}</p>
            </div>
          ))}
          {!loading && !err && questions.length === 0 && (
            <p>No questions yet. Be the first to ask!</p>
          )}
        </div>
      </main>
    </>
  );
}
