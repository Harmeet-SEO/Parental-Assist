import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";

export default function AddEditArticle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [author, setAuthor] = useState("");
  const [datePosted, setDatePosted] = useState("");
  const [headerImage, setHeaderImage] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {
    if (id) {
      api.get(`/api/admin/articles/${id}`)
        .then(res => {
          const found = res.data;
          setAuthor(found.author || "");
          setDatePosted(found.date_posted || "");
          setHeaderImage(found.header_image || "");
          setTitle(found.title || "");
          setSummary(found.summary || "");
          setBody(found.body || "");
          setTags(found.tags || "");
        })
        .catch(console.error);
    }
  }, [id]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/api/admin/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setHeaderImage(res.data.url);
      alert("Image uploaded!");
    } catch (error) {
      console.error(error);
      alert("Upload failed.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      author,
      date_posted: datePosted,
      header_image: headerImage,
      title,
      summary,
      body,
      tags
    };

    if (id) {
      api.put(`/api/admin/articles/${id}`, payload)
        .then(() => navigate("/admin/content"))
        .catch(console.error);
    } else {
      api.post("/api/admin/articles", payload)
        .then(() => navigate("/admin/content"))
        .catch(console.error);
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
          onChange={e => setAuthor(e.target.value)}
        />

        <input
          className="form-control mb-3"
          type="date"
          value={datePosted}
          onChange={e => setDatePosted(e.target.value)}
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
              src={headerImage}
              alt="Header"
              style={{ maxWidth: "200px", display: "block" }}
            />
          )}
        </div>

        <input
          className="form-control mb-3"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <textarea
          className="form-control mb-3"
          placeholder="Short Summary"
          value={summary}
          onChange={e => setSummary(e.target.value)}
          rows="2"
        />

        <textarea
          className="form-control mb-3"
          placeholder="Body"
          value={body}
          onChange={e => setBody(e.target.value)}
          rows="6"
        />

        <input
          className="form-control mb-3"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={e => setTags(e.target.value)}
        />

        <button className="btn btn-success">
          {id ? "Update" : "Add"} Article
        </button>
      </form>
    </div>
  );
}
