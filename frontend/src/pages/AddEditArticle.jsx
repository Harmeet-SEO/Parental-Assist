import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, API_BASE_URL } from "../api";

// helpers
const joinUrl = (base, path) => {
  const b = String(base || "").replace(/\/+$/, "");
  const p = String(path || "");
  if (!p) return "";
  return `${b}${p.startsWith("/") ? "" : "/"}${p}`;
};

const toImageUrl = (val) =>
  /^https?:\/\//i.test(val || "")
    ? val || ""
    : joinUrl(API_BASE_URL, val || "");

const stripBase = (val) => {
  if (!val) return val;
  const base = String(API_BASE_URL).replace(/\/+$/, "");
  // if absolute and starts with our API base, strip it to store relative
  return val.startsWith(base) ? val.slice(base.length) || "/" : val;
};

export default function AddEditArticle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [author, setAuthor] = useState("");
  const [datePosted, setDatePosted] = useState("");
  const [headerImage, setHeaderImage] = useState(""); // keep whatever (absolute or relative)
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {
    if (id) {
      api
        .get(`/api/admin/articles/${id}`)
        .then((res) => {
          const found = res.data || {};
          setAuthor(found.author || "");
          setDatePosted(found.date_posted || "");
          // convert stored value (abs or relative) to absolute for preview
          setHeaderImage(toImageUrl(found.header_image || ""));
          setTitle(found.title || "");
          setSummary(found.summary || "");
          setBody(found.body || "");
          setTags(found.tags || "");
        })
        .catch(console.error);
    }
  }, [id]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/api/admin/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // backend may return relative (e.g. "/uploads/x.jpg") or absolute
      const returned = res.data?.url || res.data?.path || "";
      setHeaderImage(toImageUrl(returned)); // preview needs absolute
      alert("Image uploaded!");
    } catch (error) {
      console.error(error);
      alert("Upload failed.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // store a clean relative path if image is under our API base
    const header_image = stripBase(headerImage);

    const payload = {
      author,
      date_posted: datePosted,
      header_image,
      title,
      summary,
      body,
      tags,
    };

    try {
      if (id) {
        await api.put(`/api/admin/articles/${id}`, payload);
      } else {
        await api.post("/api/admin/articles", payload);
      }
      navigate("/admin/content");
    } catch (err) {
      console.error(err);
      alert("Save failed.");
    }
  };

  return (
    <div className="container py-5">
      <h1>{id ? "Edit Article" : "Add Article"}</h1>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-3"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />

        <input
          className="form-control mb-3"
          type="date"
          value={datePosted}
          onChange={(e) => setDatePosted(e.target.value)}
        />

        <div className="mb-3">
          <label className="form-label">Header Image</label>
          <input
            type="file"
            className="form-control mb-2"
            onChange={handleFileChange}
          />
          {headerImage && (
            <img
              src={toImageUrl(headerImage)}
              alt="Header"
              style={{ maxWidth: "200px", display: "block" }}
              onError={(e) => {
                e.currentTarget.src = "/assets/profile-placeholder.jpg";
              }}
            />
          )}
        </div>

        <input
          className="form-control mb-3"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="form-control mb-3"
          placeholder="Short Summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows="2"
        />

        <textarea
          className="form-control mb-3"
          placeholder="Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows="6"
        />

        <input
          className="form-control mb-3"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <button className="btn btn-success">
          {id ? "Update" : "Add"} Article
        </button>
      </form>
    </div>
  );
}
