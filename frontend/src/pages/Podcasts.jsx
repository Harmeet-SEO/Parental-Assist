import React from "react";
import "./podcasts.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ChatBot from "../components/ChatBot";

const Podcasts = () => {
  const podcasts = [
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

  const categories = [
    { id: 1, emoji: "🧘‍♂️", name: "Meditation" },
    { id: 2, emoji: "📣", name: "Daily Update" },
    { id: 3, emoji: "🎧", name: "Storytime" },
    { id: 4, emoji: "🍎", name: "Parent Tips" },
    { id: 5, emoji: "👨‍👩‍👧", name: "Education" },
    { id: 6, emoji: "🧠", name: "Mental Wellness" },
  ];

  return (
    <>
      <Navbar />
      <ChatBot />
      <div className="podcast-container">
        <h1>Podcasts</h1>
        <p>
          At <strong>Parental Assist</strong>, we bring you the best of
          easy-to-listen podcasts, featuring expert advice, parenting hacks,
          mindful storytelling, and real-life family experiences. Each episode
          is designed to help parents feel informed, supported, and encouraged
          in their journey. Subscribe today and never miss a moment of
          inspiration!
        </p>

        <hr style={{ margin: "2rem 0" }} />

        {/* === Latest Episodes === */}
        <h2>Latest episodes</h2>
        <div className="podcast-grid">
          {podcasts.map((pod) => (
            <a
              href={pod.link}
              target="_blank"
              rel="noopener noreferrer"
              key={pod.id}
              className="podcast-card"
            >
              <img src={pod.img} alt={pod.title} className="podcast-image" />
              <div className="podcast-title">{pod.title}</div>
              <div className="play-button">▶</div>
            </a>
          ))}
        </div>

        {/* === Categories === */}
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
};

export default Podcasts;
