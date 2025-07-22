import React from "react";
import "./category.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ChatBot from "../components/ChatBot";

function CategoryPage() {
  const resources = [
    { id: 1, title: "On a hunt for the best kombucha" },
    { id: 2, title: "Shenandoah’s best bodegas" },
    { id: 3, title: "Cooking on budget" },
    { id: 4, title: "Best alcohol-free cocktails" },
    { id: 5, title: "On a hunt for the best kombucha" },
    { id: 6, title: "Shenandoah’s best bodegas" },
    { id: 7, title: "Cooking on budget" },
    { id: 8, title: "Best alcohol-free cocktails" },
  ];

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
        <div className="category-grid">
          {resources.map((item) => (
            <div key={item.id} className="category-card">
              <div className="card-image"></div>
              <div className="card-title">{item.title}</div>
            </div>
          ))}
        </div>
        <button className="load-more">Load more</button>
      </div>
      <Footer />
    </>
  );
}

export default CategoryPage;
