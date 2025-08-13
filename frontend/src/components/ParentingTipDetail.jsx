import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import ChatBot from "../components/ChatBot";
import "./TipDetail.css";
import { api } from "../api";

export default function ParentingTipDetail() {
  const { id } = useParams();
  const [tip, setTip] = useState(null);

  useEffect(() => {
    api
      .get("/api/admin/content")
      .then((res) => {
        const found = res.data.find((item) => item._id === id);
        setTip(found);
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!tip) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      <ChatBot />
      <main className="tip-detail-page">
        <h1>{tip.title}</h1>
        <small className="category-badge">{tip.category}</small>
        <p className="tip-body">{tip.body}</p>
        <p className="tip-date">
          <strong>Published:</strong>{" "}
          {new Date(tip.created_at).toLocaleDateString()}
        </p>
      </main>
    </>
  );
}
